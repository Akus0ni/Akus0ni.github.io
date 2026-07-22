import {
  Component, computed, signal, inject, OnInit, OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../core/resume.service';
import { ArchNode } from '../data/resume';

interface LaidNode extends ArchNode { cx: number; cy: number; }
interface LaidEdge { id: string; d: string; from: string; to: string; bidir: boolean; dur: number; delay: number; }

const W = 1200, H = 470, PADX = 80, PADY = 56;
const BOX_W = 150, BOX_H = 56;
const STEP_MS = 2100;

@Component({
  selector: 'app-arch-diagram',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="arch-wrap">
      <!-- flow selector (editor tabs) + arrow-direction legend -->
      <div class="flow-head">
        <div class="flow-tabs" role="tablist" aria-label="Architecture flow">
          @for (f of flows; track f.id) {
            <button
              type="button" role="tab" class="flow-tab"
              [class.is-active]="f.id === activeFlowId()"
              [attr.aria-selected]="f.id === activeFlowId()"
              (click)="setFlow(f.id)">
              <span class="dot" [attr.data-flow]="f.id"></span>{{ f.name }}
            </button>
          }
        </div>
        <p class="flow-legend mono" aria-hidden="true">
          <span class="lg"><span class="flow-dot"></span> live data flow</span>
          <span class="lg"><span class="swatch sw-compute"></span> compute</span>
          <span class="lg"><span class="swatch sw-data"></span> data</span>
        </p>
      </div>

      <figure class="arch" role="img" [attr.aria-label]="ariaLabel()">
        <svg [attr.viewBox]="'0 0 ' + W + ' ' + H" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="var(--teal)" stop-opacity=".18"/>
              <stop offset="1" stop-color="var(--amber)" stop-opacity=".6"/>
            </linearGradient>
          </defs>

          <!-- edges — direction is carried by the travelling packets + narration -->
          <g class="edges" fill="none">
            @for (e of edges(); track e.id) {
              <path [attr.id]="e.id" [attr.d]="e.d"
                    class="edge-base" [class.is-active]="activeEdges().has(e.id)"/>
              <path [attr.d]="e.d"
                    class="edge-flow" [class.is-active]="activeEdges().has(e.id)"/>
            }
          </g>

          <!-- travelling packets -->
          @if (animate()) {
            <g class="packets">
              @for (e of edges(); track e.id) {
                <circle r="3.6" class="packet" [class.is-active]="activeEdges().has(e.id)">
                  <animateMotion [attr.dur]="e.dur + 's'" [attr.begin]="e.delay + 's'"
                    repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                    <mpath [attr.href]="'#' + e.id"/>
                  </animateMotion>
                  <animate attributeName="opacity" [attr.dur]="e.dur + 's'" [attr.begin]="e.delay + 's'"
                    repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.18;0.82;1" calcMode="linear"/>
                </circle>
              }
            </g>
          }

          <!-- nodes -->
          <g class="nodes">
            @for (n of nodes(); track n.id) {
              <g [class]="'node kind-' + n.kind"
                 [class.is-lit]="litSet().has(n.id)"
                 [class.is-dim]="!litSet().has(n.id)"
                 [attr.transform]="'translate(' + (n.cx - boxW / 2) + ',' + (n.cy - boxH / 2) + ')'"
                 (mouseenter)="onEnter(n.id)" (mouseleave)="onLeave()">
                <rect [attr.width]="boxW" [attr.height]="boxH" rx="10" class="node-box"/>
                <rect x="0" y="0" [attr.width]="4" [attr.height]="boxH" rx="2" class="node-tab"/>
                <text [attr.x]="14" [attr.y]="24" class="node-label">{{ n.label }}</text>
                <text [attr.x]="14" [attr.y]="42" class="node-sub">{{ n.sub }}</text>
              </g>
            }
          </g>
        </svg>
      </figure>

      <!-- narration -->
      <div class="flow-caption" aria-live="polite">
        <span class="step-index mono" aria-hidden="true">{{ stepBadge() }}</span>
        <p class="step-text">{{ caption() }}</p>
      </div>
    </div>
  `,
  styles: [`
    .arch-wrap { width: 100%; }

    /* ── flow tabs + legend ───────────────────────────────── */
    .flow-head {
      display: flex; align-items: center; justify-content: space-between;
      gap: .75rem; flex-wrap: wrap; margin-bottom: .85rem;
    }
    .flow-tabs { display: flex; gap: .4rem; flex-wrap: wrap; }
    .flow-legend {
      display: flex; gap: 1rem; margin: 0;
      font-size: .68rem; color: var(--text-3);
    }
    .flow-legend .lg { display: inline-flex; align-items: center; gap: .38rem; }
    .flow-legend .flow-dot {
      width: 7px; height: 7px; border-radius: 50%; background: var(--amber);
      box-shadow: 0 0 6px color-mix(in oklab, var(--amber) 70%, transparent);
    }
    .flow-legend .swatch { width: 9px; height: 9px; border-radius: 2px; }
    .flow-legend .sw-compute { background: var(--amber); }
    .flow-legend .sw-data { background: var(--green); }
    .flow-tab {
      display: inline-flex; align-items: center; gap: .5rem;
      padding: .42rem .85rem; border-radius: 8px;
      font-family: var(--font-mono); font-size: .78rem; letter-spacing: .01em;
      color: var(--text-3); background: var(--bg-3);
      border: 1px solid var(--border); cursor: pointer;
      transition: color .25s var(--ease), border-color .25s var(--ease),
                  background .25s var(--ease), transform .2s var(--ease-out);
    }
    .flow-tab:hover { color: var(--text-2); transform: translateY(-1px); }
    .flow-tab .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-3); transition: background .25s var(--ease); }
    .flow-tab .dot[data-flow='review'] { background: var(--teal); }
    .flow-tab .dot[data-flow='dashboard'] { background: var(--coral); }
    .flow-tab.is-active {
      color: var(--text); background: var(--bg);
      border-color: color-mix(in oklab, var(--accent) 55%, var(--border));
      box-shadow: 0 0 0 1px color-mix(in oklab, var(--accent) 22%, transparent);
    }

    .arch { width: 100%; margin: 0; }
    svg { width: 100%; height: auto; overflow: visible; }

    /* ── edges ────────────────────────────────────────────── */
    .edge-base {
      stroke: color-mix(in oklab, var(--text-3) 38%, var(--border));
      stroke-width: 1.5; transition: stroke .35s var(--ease);
    }
    .edge-base.is-active { stroke: color-mix(in oklab, var(--accent) 60%, var(--border)); }
    .edge-flow {
      stroke: url(#edgeGrad); stroke-width: 2;
      stroke-dasharray: 7 10; opacity: .5;
      animation: dash-flow 3.2s linear infinite;
      transition: opacity .35s var(--ease);
    }
    .edge-flow.is-active { opacity: 1; stroke-width: 2.4; }
    @keyframes dash-flow { to { stroke-dashoffset: -34; } }

    /* opacity is driven by the SMIL fade (source → target), so it only carries colour here */
    .packet { fill: var(--text-3); transition: fill .35s var(--ease); }
    .packet.is-active {
      fill: var(--amber);
      filter: drop-shadow(0 0 6px color-mix(in oklab, var(--amber) 75%, transparent));
    }

    /* ── nodes ────────────────────────────────────────────── */
    .node { transform-box: fill-box; }
    .node { cursor: pointer; }
    .node-box {
      fill: var(--bg-3); stroke: var(--border); stroke-width: 1.2;
      transition: stroke .35s var(--ease), fill .35s var(--ease), filter .35s var(--ease);
    }
    .node-tab { fill: var(--text-3); transition: fill .35s var(--ease); }
    .node-label { font-family: var(--font-display); font-weight: 600; font-size: 14px; letter-spacing: -.005em; fill: var(--text); }
    .node-sub {
      font-family: var(--font-mono); font-size: 11px; letter-spacing: .02em;
      fill: color-mix(in oklab, var(--text-2) 62%, var(--text-3));
      transition: fill .35s var(--ease);
    }

    .kind-cdn     .node-tab { fill: var(--teal); }
    .kind-api     .node-tab { fill: var(--blue); }
    .kind-auth    .node-tab { fill: var(--coral); }
    .kind-compute .node-tab { fill: var(--amber); }
    .kind-data    .node-tab { fill: var(--green); }
    .kind-ai      .node-tab { fill: var(--lav); }
    .kind-secret  .node-tab { fill: var(--coral); }
    .kind-storage .node-tab { fill: var(--teal); }
    .kind-edge    .node-tab { fill: var(--text-2); }

    /* focus state driven by the narration stepper */
    .node { transition: opacity .4s var(--ease); }
    /* unlit nodes stay fully legible — they just sit back one layer */
    .node.is-dim { opacity: .82; }
    .node.is-lit .node-box {
      fill: color-mix(in oklab, var(--accent) 11%, var(--bg-3));
      stroke: color-mix(in oklab, var(--accent) 72%, var(--border));
      stroke-width: 1.6;
      animation: node-glow 2.1s var(--ease) infinite;
    }
    .node.is-lit .node-label { fill: var(--text); }
    .node.is-lit .node-sub { fill: var(--text); }

    /* a soft ambient glow behind the focused node — not a second border */
    @keyframes node-glow {
      0%, 100% { filter: drop-shadow(0 0 2px color-mix(in oklab, var(--accent) 24%, transparent)); }
      50%      { filter: drop-shadow(0 0 10px color-mix(in oklab, var(--accent) 52%, transparent)); }
    }

    /* ── caption ──────────────────────────────────────────── */
    .flow-caption {
      display: flex; align-items: flex-start; gap: .6rem;
      margin-top: 1rem; min-height: 2.6em;
      padding: .55rem .7rem; border-radius: 9px;
      background: var(--bg-3); border: 1px solid var(--border);
    }
    .step-index {
      flex: none; font-size: .72rem; color: var(--accent);
      padding-top: .1rem; letter-spacing: .04em;
    }
    .step-text {
      margin: 0; font-size: .88rem; line-height: 1.45; color: var(--text-2);
      transition: opacity .3s var(--ease);
    }

    @media (prefers-reduced-motion: reduce) {
      .edge-flow { animation: none; }
      .node.is-lit .node-box { animation: none; filter: none; }
      .node.is-dim { opacity: 1; }
    }
    @media (max-width: 560px) {
      .node-sub { font-size: 11px; }
      .flow-tab { font-size: .82rem; }
      .step-text { font-size: .92rem; }
    }
  `],
})
export class ArchDiagramComponent implements OnInit, OnDestroy {
  private resume = inject(ResumeService);
  readonly W = W; readonly H = H;
  readonly boxW = BOX_W; readonly boxH = BOX_H;

  readonly flows = this.resume.archFlows;
  private readonly reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  readonly animate = signal(!this.reduced);

  readonly activeFlowId = signal(this.flows[0].id);
  readonly step = signal(0);
  private timer?: ReturnType<typeof setInterval>;

  readonly flow = computed(() => this.flows.find((f) => f.id === this.activeFlowId())!);

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  private startTimer(): void {
    clearInterval(this.timer);
    if (this.reduced) return;
    this.timer = setInterval(() => {
      const n = this.flow().steps.length;
      this.step.update((s) => (s + 1) % n);
    }, STEP_MS);
  }

  setFlow(id: string): void {
    if (id === this.activeFlowId()) return;
    this.activeFlowId.set(id);
    this.step.set(0);
    this.startTimer();
  }

  /** Hovering a node pauses the auto-tour and focuses that node's beat + caption. */
  onEnter(id: string): void {
    clearInterval(this.timer);
    const idx = this.flow().steps.findIndex((s) => s.at.includes(id));
    if (idx >= 0) this.step.set(idx);
  }

  onLeave(): void {
    this.startTimer();
  }

  readonly ariaLabel = computed(() =>
    `${this.flow().name}: ${this.flow().tagline}. ` +
    this.flow().steps.map((s) => s.text).join('. ') + '.',
  );

  readonly nodes = computed<LaidNode[]>(() =>
    this.flow().nodes.map((n) => ({
      ...n,
      cx: PADX + (n.x / 100) * (W - 2 * PADX),
      cy: PADY + (n.y / 100) * (H - 2 * PADY),
    })),
  );

  readonly edges = computed<LaidEdge[]>(() => {
    const map = new Map(this.nodes().map((n) => [n.id, n]));
    // Edges enter/leave nodes horizontally, so trim each end to the box's
    // left/right border (+ a small gap) — arrowheads and packets then sit in
    // the open space between nodes instead of hiding under the boxes.
    const trim = BOX_W / 2 + 6;
    const FAN = 13; // vertical spread so edges leaving a shared source don't stack
    return this.flow().edges.map((e, i) => {
      const a = map.get(e.from)!, b = map.get(e.to)!;
      const s = b.cx >= a.cx ? 1 : -1;
      const dyAB = b.cy - a.cy;
      const bias = Math.abs(dyAB) > 4 ? Math.sign(dyAB) * FAN : 0;
      const ax = a.cx + s * trim, bx = b.cx - s * trim;
      // Fan out at the source; arrive centred on the target so the arrowhead
      // meets the box squarely. A long horizontal tail (0.5) keeps the arrow
      // flat and aligned even when the target is well above/below the source.
      const ay = a.cy + bias, by = b.cy;
      const dx = (bx - ax) * 0.5;
      return {
        id: `edge-${this.activeFlowId()}-${i}`,
        from: e.from, to: e.to, bidir: !!e.bidir,
        d: `M ${ax} ${ay} C ${ax + dx} ${ay}, ${bx - dx} ${by}, ${bx} ${by}`,
        dur: 2.4 + (i % 3) * 0.6,
        delay: (i % 4) * 0.45,
      };
    });
  });

  /** Node ids highlighted for the current beat (all of them under reduced motion). */
  readonly litSet = computed<Set<string>>(() => {
    if (this.reduced) return new Set(this.flow().nodes.map((n) => n.id));
    const steps = this.flow().steps;
    return new Set(steps[this.step() % steps.length].at);
  });
  /** Ids of edges on the current beat's path — both endpoints lit. Precomputed once per beat. */
  readonly activeEdges = computed<Set<string>>(() => {
    const s = this.litSet();
    return new Set(
      this.edges().filter((e) => s.has(e.from) && s.has(e.to)).map((e) => e.id),
    );
  });

  readonly caption = computed(() => {
    if (this.reduced) return this.flow().tagline;
    const steps = this.flow().steps;
    return steps[this.step() % steps.length].text;
  });
  readonly stepBadge = computed(() => {
    if (this.reduced) return '';
    const steps = this.flow().steps;
    const i = (this.step() % steps.length) + 1;
    return `${String(i).padStart(2, '0')}/${String(steps.length).padStart(2, '0')}`;
  });
}
