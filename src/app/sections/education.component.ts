import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../directives/reveal.directive';
import { SectionHeaderComponent } from '../components/section-header.component';
import { ResumeService } from '../core/resume.service';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, RevealDirective, SectionHeaderComponent],
  template: `
    <section id="education" class="wrap">
      <app-section-header id="education" appReveal />

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
            <a class="row cert" [href]="c.link" target="_blank" rel="noopener"
               [attr.aria-label]="'Verify certificate: ' + c.title + ' — opens in a new tab'">
              <div class="row-main">
                <span class="row-title">
                  {{ c.title }}
                  <svg class="ext" viewBox="0 0 24 24" width="13" height="13" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                       aria-hidden="true">
                    <path d="M7 17 17 7M9 7h8v8"/>
                  </svg>
                </span>
                <span class="row-sub">{{ c.org }} · <span class="verify mono">verify</span></span>
              </div>
              <span class="year mono">{{ c.when }}</span>
            </a>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
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

    /* clickable, verifiable certificate rows */
    .cert { text-decoration: none; border-radius: 8px; transition: background .2s var(--ease); }
    .cert .row-title {
      display: inline-flex; align-items: center; gap: .4rem;
      transition: color .2s var(--ease);
    }
    .cert .ext { color: var(--text-3); transition: color .2s var(--ease), transform .2s var(--ease-out); }
    .verify { color: var(--accent); font-size: .78rem; }
    .cert:hover .row-title { color: var(--accent); }
    .cert:hover .ext { color: var(--accent); transform: translate(2px, -2px); }
    .cert:hover .year { color: var(--text-2); }
    .cert:focus-visible { outline: 2px solid var(--ring); outline-offset: 3px; }

    @media (max-width: 720px) { .cols { grid-template-columns: 1fr; } }
  `],
})
export class EducationComponent {
  private resume = inject(ResumeService);
  readonly education = this.resume.education;
  readonly certs = this.resume.certs;
}
