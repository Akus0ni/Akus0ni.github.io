import {
  Component, computed, signal, inject, OnInit, OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../core/resume.service';
import {
  ARCH_W, ARCH_H, BOX_W, BOX_H,
  LaidNode, LaidEdge, layoutNodes, layoutEdges,
} from '../utils/arch-layout';

const STEP_MS = 2100;

@Component({
  selector: 'app-arch-diagram',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './arch-diagram.component.html',
  styleUrl: './arch-diagram.component.scss',
})
export class ArchDiagramComponent implements OnInit, OnDestroy {
  private resume = inject(ResumeService);
  readonly W = ARCH_W; readonly H = ARCH_H;
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

  readonly nodes = computed<LaidNode[]>(() => layoutNodes(this.flow()));

  readonly edges = computed<LaidEdge[]>(() =>
    layoutEdges(this.flow(), this.nodes(), this.activeFlowId()),
  );

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
