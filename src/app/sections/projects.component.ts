import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../directives/reveal.directive';
import { PROJECTS, Project } from '../data/resume';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section id="projects" class="wrap">
      <header class="s-head" appReveal>
        <span class="s-index mono">03</span>
        <h2 class="s-title">Selected work</h2>
        <span class="s-file mono">~/projects</span>
      </header>

      <div class="grid">
        @for (p of projects; track p.id; let i = $index) {
          <article class="card" [class.featured]="p.featured" appReveal [revealDelay]="i * 80"
            (pointermove)="onMove($event)">
            <div class="glow" aria-hidden="true"></div>
            <div class="card-in">
              <div class="card-head">
                <span class="kind mono">{{ p.kind }}</span>
                @if (p.featured) { <span class="badge mono">★ solo build</span> }
              </div>
              <h3 class="card-title">{{ p.name }}</h3>
              <p class="blurb">{{ p.blurb }}</p>

              <ul class="pts">
                @for (pt of p.points; track pt) { <li>{{ pt }}</li> }
              </ul>

              <div class="tags">
                @for (t of p.tags; track t) { <span class="tag">{{ t }}</span> }
              </div>
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .wrap { padding: clamp(2.5rem, 6vw, 4rem) 0; }
    .s-head {
      display: flex; align-items: baseline; gap: .8rem; margin-bottom: 2.2rem;
      border-bottom: 1px solid var(--border); padding-bottom: .9rem;
    }
    .s-index { color: var(--accent); font-size: .85rem; }
    .s-title { font-size: clamp(1.5rem, 4vw, 2.1rem); }
    .s-file { margin-left: auto; color: var(--text-3); font-size: .78rem; }

    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.1rem; }
    .card.featured { grid-column: 1 / -1; }

    .card { position: relative; border-radius: 16px; }
    .glow {
      position: absolute; inset: 0; border-radius: 16px; opacity: 0;
      transition: opacity .4s var(--ease); pointer-events: none;
      background: radial-gradient(300px circle at var(--mx, 50%) var(--my, 0%),
        color-mix(in oklab, var(--accent) 22%, transparent), transparent 60%);
    }
    .card:hover .glow { opacity: 1; }

    .card-in {
      position: relative; height: 100%;
      border: 1px solid var(--border); border-radius: 16px;
      background: var(--bg-2); padding: clamp(1.2rem, 3vw, 1.7rem);
      transition: transform .35s var(--ease-out), border-color .35s var(--ease);
    }
    .card:hover .card-in { transform: translateY(-4px); border-color: color-mix(in oklab, var(--accent) 45%, var(--border)); }
    .featured .card-in {
      background:
        radial-gradient(130% 130% at 100% 0%, color-mix(in oklab, var(--amber) 8%, transparent), transparent 50%),
        var(--bg-2);
    }

    .card-head { display: flex; align-items: center; justify-content: space-between; gap: .6rem; margin-bottom: .5rem; }
    .kind { font-size: .74rem; color: var(--teal); letter-spacing: .02em; }
    .badge {
      font-size: .68rem; color: var(--accent); padding: .12rem .5rem; border-radius: 20px;
      border: 1px solid color-mix(in oklab, var(--accent) 40%, var(--border));
    }
    .card-title {
      font-size: clamp(1.15rem, 2.6vw, 1.5rem); margin-bottom: .5rem;
      transition: color .3s var(--ease);
    }
    .card:hover .card-title { color: var(--accent); }
    .blurb { color: var(--text-2); font-size: .95rem; margin-bottom: .9rem; max-width: 62ch; }

    .pts { display: grid; gap: .35rem; margin-bottom: 1rem; }
    .featured .pts { grid-template-columns: 1fr 1fr; gap: .35rem 1.4rem; }
    .pts li {
      position: relative; padding-left: 1.15rem; color: var(--text-2);
      font-size: .88rem; max-width: 60ch;
    }
    .pts li::before {
      content: '▸'; position: absolute; left: 0; color: var(--accent); font-size: .7rem; top: .18rem;
    }

    .tags { display: flex; flex-wrap: wrap; gap: .4rem; }
    .tag {
      font-family: var(--font-mono); font-size: .71rem; color: var(--text-2);
      background: var(--bg-inset); border: 1px solid var(--border);
      border-radius: 6px; padding: .16rem .5rem;
    }

    @media (max-width: 760px) {
      .grid { grid-template-columns: 1fr; }
      .featured .pts { grid-template-columns: 1fr; }
    }
  `],
})
export class ProjectsComponent {
  readonly projects: Project[] = PROJECTS;

  onMove(e: PointerEvent): void {
    const el = (e.currentTarget as HTMLElement);
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }
}
