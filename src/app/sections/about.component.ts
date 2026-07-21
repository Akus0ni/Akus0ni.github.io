import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../directives/reveal.directive';
import { STATS } from '../data/resume';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section id="about" class="wrap">
      <header class="s-head" appReveal>
        <span class="s-index mono">01</span>
        <h2 class="s-title">whoami</h2>
        <span class="s-file mono">README.md</span>
      </header>

      <div class="about-grid">
        <article class="readme" appReveal [revealDelay]="80">
          <p class="lead">
            I build the <span class="accent">unglamorous middle</span> of software —
            the integration layers, data pipelines, and cloud plumbing that let
            enterprise products actually talk to each other.
          </p>
          <p>
            Across energy, healthcare, and my own SaaS, the throughline is the same:
            take something tangled and legacy, and leave behind a clean, reusable
            platform. A NuGet library three product surfaces now share. An analytics
            stack lifted from SSAS onto Redshift. A HIPAA-adjacent app whose auth I
            rebuilt from the ground up.
          </p>
          <p class="muted">
            Lately that means designing serverless architectures on AWS end-to-end,
            and pairing with AI tooling to ship faster without cutting corners on
            security or isolation.
          </p>
        </article>

        <aside class="stats" appReveal [revealDelay]="160">
          @for (s of stats; track s.label) {
            <div class="stat">
              <span class="stat-val">{{ s.value }}</span>
              <span class="stat-label">{{ s.label }}</span>
              <span class="stat-hint mono">{{ s.hint }}</span>
            </div>
          }
        </aside>
      </div>
    </section>
  `,
  styles: [`
    .wrap { padding: clamp(3rem, 8vw, 6rem) 0 clamp(1.5rem, 4vw, 2.5rem); }
    .s-head {
      display: flex; align-items: baseline; gap: .8rem; margin-bottom: 2rem;
      border-bottom: 1px solid var(--border); padding-bottom: .9rem;
    }
    .s-index { color: var(--accent); font-size: .85rem; }
    .s-title { font-size: clamp(1.5rem, 4vw, 2.1rem); }
    .s-file { margin-left: auto; color: var(--text-3); font-size: .78rem; }

    .about-grid { display: grid; grid-template-columns: 1.4fr .9fr; gap: clamp(1.5rem, 4vw, 3rem); }

    .readme p { margin-bottom: 1rem; color: var(--text-2); max-width: 60ch; }
    .readme .lead { font-size: clamp(1.15rem, 2.4vw, 1.45rem); color: var(--text); line-height: 1.45; font-family: var(--font-display); }
    .readme .muted { color: var(--text-3); }

    .stats { display: grid; grid-template-columns: 1fr 1fr; gap: .8rem; align-content: start; }
    .stat {
      border: 1px solid var(--border); border-radius: 12px; padding: 1rem 1.05rem;
      background: var(--bg-2); display: flex; flex-direction: column;
      transition: transform .3s var(--ease-out), border-color .3s var(--ease);
    }
    .stat:hover { transform: translateY(-3px); border-color: color-mix(in oklab, var(--accent) 50%, var(--border)); }
    .stat-val { font-family: var(--font-display); font-weight: 700; font-size: clamp(1.7rem, 4vw, 2.3rem); color: var(--accent); line-height: 1; }
    .stat-label { margin-top: .35rem; font-size: .92rem; color: var(--text); }
    .stat-hint { font-size: .68rem; color: var(--text-3); margin-top: .15rem; }

    @media (max-width: 800px) {
      .about-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 420px) { .stats { grid-template-columns: 1fr; } }
  `],
})
export class AboutComponent {
  readonly stats = STATS;
}
