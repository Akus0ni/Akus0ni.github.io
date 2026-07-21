import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionService } from '../core/section.service';

/**
 * Shared header for every content section. Content (index/eyebrow/title/file)
 * comes from the central SectionService, so a section only declares which id
 * it is: `<app-section-header id="experience" />`.
 */
@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="s-head" [class.emph]="h().emphasis">
      @if (h().live) {
        <span class="live mono"><span class="pulse"></span>{{ h().eyebrow }}</span>
      } @else if (h().eyebrow) {
        <span class="eyebrow mono">{{ h().eyebrow }}</span>
      } @else {
        <span class="s-index mono">{{ h().index }}</span>
      }
      <h2 class="s-title">{{ h().title }}</h2>
      <span class="s-file mono">{{ h().file }}</span>
    </header>
  `,
  styles: [`
    :host { display: block; }
    .s-head {
      display: flex; align-items: baseline; gap: .8rem; margin-bottom: 2rem;
      border-bottom: 1px solid var(--border); padding-bottom: .9rem;
    }
    .s-head.emph { margin-bottom: 1.8rem; }
    .s-index { color: var(--accent); font-size: .85rem; }
    .eyebrow { font-size: .74rem; }
    .s-title { font-size: clamp(1.5rem, 4vw, 2.1rem); }
    .s-head.emph .s-title { font-size: clamp(1.6rem, 4.5vw, 2.4rem); }
    .s-file { margin-left: auto; color: var(--text-3); font-size: .78rem; }

    .live {
      display: inline-flex; align-items: center; gap: .45rem;
      font-size: .72rem; color: var(--green); letter-spacing: .04em;
    }
    .pulse {
      width: 7px; height: 7px; border-radius: 50%; background: var(--green);
      box-shadow: 0 0 0 0 color-mix(in oklab, var(--green) 60%, transparent);
      animation: pulse 1.8s var(--ease) infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--green) 55%, transparent); }
      70% { box-shadow: 0 0 0 6px transparent; }
      100% { box-shadow: 0 0 0 0 transparent; }
    }
    @media (prefers-reduced-motion: reduce) { .pulse { animation: none; } }
  `],
})
export class SectionHeaderComponent {
  @Input({ required: true }) id!: string;
  private sections = inject(SectionService);
  readonly h = computed(() => this.sections.header(this.id));
}
