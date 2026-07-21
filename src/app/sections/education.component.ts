import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../directives/reveal.directive';
import { EDUCATION, CERTS } from '../data/resume';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section id="education" class="wrap">
      <header class="s-head" appReveal>
        <span class="s-index mono">05</span>
        <h2 class="s-title">Foundations</h2>
        <span class="s-file mono">education · certs</span>
      </header>

      <div class="cols">
        <div class="col" appReveal>
          <h3 class="col-h mono">// education</h3>
          @for (e of education; track e.school) {
            <div class="row">
              <div class="row-main">
                <span class="row-title">{{ e.school }}</span>
                <span class="row-sub">{{ e.detail }}</span>
              </div>
              <div class="row-side">
                <span class="score mono">{{ e.score }}</span>
                <span class="year mono">{{ e.year }}</span>
              </div>
            </div>
          }
        </div>

        <div class="col" appReveal [revealDelay]="100">
          <h3 class="col-h mono">// certifications</h3>
          @for (c of certs; track c.title) {
            <div class="row">
              <div class="row-main">
                <span class="row-title">{{ c.title }}</span>
                <span class="row-sub">{{ c.org }}</span>
              </div>
              <span class="year mono">{{ c.when }}</span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .wrap { padding: clamp(2.5rem, 6vw, 4rem) 0; }
    .s-head {
      display: flex; align-items: baseline; gap: .8rem; margin-bottom: 2rem;
      border-bottom: 1px solid var(--border); padding-bottom: .9rem;
    }
    .s-index { color: var(--accent); font-size: .85rem; }
    .s-title { font-size: clamp(1.5rem, 4vw, 2.1rem); }
    .s-file { margin-left: auto; color: var(--text-3); font-size: .78rem; }

    .cols { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(1.5rem, 4vw, 3rem); }
    .col-h { color: var(--text-3); font-size: .82rem; margin-bottom: 1rem; }

    .row {
      display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;
      padding: .95rem 0; border-top: 1px solid var(--border);
    }
    .row:first-of-type { border-top: none; }
    .row-main { display: flex; flex-direction: column; }
    .row-title { font-weight: 600; color: var(--text); }
    .row-sub { color: var(--text-2); font-size: .9rem; }
    .row-side { display: flex; flex-direction: column; align-items: flex-end; gap: .1rem; }
    .score { color: var(--teal); font-size: .82rem; }
    .year { color: var(--text-3); font-size: .82rem; }

    @media (max-width: 720px) { .cols { grid-template-columns: 1fr; } }
  `],
})
export class EducationComponent {
  readonly education = EDUCATION;
  readonly certs = CERTS;
}
