import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../core/resume.service';
import { ArchNode } from '../data/resume';

interface LaidNode extends ArchNode { cx: number; cy: number; }
interface LaidEdge { id: string; d: string; dur: number; delay: number; }

const W = 1000, H = 440, PADX = 92, PADY = 52;
const BOX_W = 150, BOX_H = 54;

@Component({
  selector: 'app-arch-diagram',
  standalone: true,
  imports: [CommonModule],
  template: `
    <figure class="arch" role="img"
      aria-label="Serverless AWS architecture: client to CloudFront and API Gateway, through Cognito JWT, into a Lambda function that reaches DynamoDB and a provider-agnostic LLM client.">
      <svg [attr.viewBox]="'0 0 ' + W + ' ' + H" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="var(--teal)" stop-opacity=".15"/>
            <stop offset="1" stop-color="var(--amber)" stop-opacity=".55"/>
          </linearGradient>
        </defs>

        <!-- edges -->
        <g class="edges" fill="none">
          @for (e of edges(); track e.id) {
            <path [attr.id]="e.id" [attr.d]="e.d" class="edge-base"/>
            <path [attr.d]="e.d" class="edge-flow"/>
          }
        </g>

        <!-- travelling packets -->
        @if (animate()) {
          <g class="packets">
            @for (e of edges(); track e.id) {
              <circle r="3.4" class="packet">
                <animateMotion [attr.dur]="e.dur + 's'" [attr.begin]="e.delay + 's'"
                  repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                  <mpath [attr.href]="'#' + e.id"/>
                </animateMotion>
              </circle>
            }
          </g>
        }

        <!-- nodes -->
        <g class="nodes">
          @for (n of nodes(); track n.id) {
            <g [class]="'node kind-' + n.kind"
               [attr.transform]="'translate(' + (n.cx - boxW / 2) + ',' + (n.cy - boxH / 2) + ')'">
              <rect [attr.width]="boxW" [attr.height]="boxH" rx="9" class="node-box"/>
              <rect x="0" y="0" [attr.width]="4" [attr.height]="boxH" rx="2" class="node-tab"/>
              <text [attr.x]="16" [attr.y]="23" class="node-label">{{ n.label }}</text>
              <text [attr.x]="16" [attr.y]="41" class="node-sub">{{ n.sub }}</text>
            </g>
          }
        </g>
      </svg>
    </figure>
  `,
  styles: [`
    .arch { width: 100%; margin: 0; }
    svg { width: 100%; height: auto; overflow: visible; }

    .edge-base { stroke: var(--border); stroke-width: 1.6; }
    .edge-flow {
      stroke: url(#edgeGrad); stroke-width: 2;
      stroke-dasharray: 7 10; animation: dash-flow 3.2s linear infinite;
    }
    .packet { fill: var(--amber); filter: drop-shadow(0 0 5px color-mix(in oklab, var(--amber) 70%, transparent)); }

    .node-box {
      fill: var(--bg-3);
      stroke: var(--border);
      stroke-width: 1.2;
      transition: stroke .3s var(--ease), fill .3s var(--ease);
    }
    .node { transform-box: fill-box; }
    .node-tab { fill: var(--text-3); }
    .node-label { font-family: var(--font-display); font-weight: 600; font-size: 15px; fill: var(--text); }
    .node-sub  { font-family: var(--font-mono); font-size: 10.5px; fill: var(--text-3); letter-spacing: .02em; }

    .kind-cdn    .node-tab { fill: var(--teal); }
    .kind-api    .node-tab { fill: var(--blue); }
    .kind-auth   .node-tab { fill: var(--coral); }
    .kind-compute .node-tab { fill: var(--amber); }
    .kind-data   .node-tab { fill: var(--green); }
    .kind-ai     .node-tab { fill: var(--lav); }
    .kind-edge   .node-tab { fill: var(--text-2); }

    .kind-compute .node-box { stroke: color-mix(in oklab, var(--amber) 45%, var(--border)); }

    @media (prefers-reduced-motion: reduce) {
      .edge-flow { animation: none; }
    }
    @media (max-width: 560px) {
      .node-label { font-size: 17px; }
      .node-sub { font-size: 12px; }
    }
  `],
})
export class ArchDiagramComponent {
  private resume = inject(ResumeService);
  readonly W = W; readonly H = H;
  readonly boxW = BOX_W; readonly boxH = BOX_H;
  readonly animate = signal(!matchMedia('(prefers-reduced-motion: reduce)').matches);

  readonly nodes = computed<LaidNode[]>(() =>
    this.resume.archNodes.map((n) => ({
      ...n,
      cx: PADX + (n.x / 100) * (W - 2 * PADX),
      cy: PADY + (n.y / 100) * (H - 2 * PADY),
    })),
  );

  readonly edges = computed<LaidEdge[]>(() => {
    const map = new Map(this.nodes().map((n) => [n.id, n]));
    return this.resume.archEdges.map((e, i) => {
      const a = map.get(e.from)!, b = map.get(e.to)!;
      const dx = (b.cx - a.cx) * 0.42;
      return {
        id: `edge-${i}`,
        d: `M ${a.cx} ${a.cy} C ${a.cx + dx} ${a.cy}, ${b.cx - dx} ${b.cy}, ${b.cx} ${b.cy}`,
        dur: 2.6 + (i % 3) * 0.7,
        delay: (i % 4) * 0.5,
      };
    });
  });
}
