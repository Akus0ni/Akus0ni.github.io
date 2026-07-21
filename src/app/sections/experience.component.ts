import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../directives/reveal.directive';
import { ROLES, Role } from '../data/resume';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section id="experience" class="wrap">
      <header class="s-head" appReveal>
        <span class="s-index mono">02</span>
        <h2 class="s-title">Experience</h2>
        <span class="s-file mono">git log --oneline</span>
      </header>

      <div class="log">
        @for (r of roles; track r.company; let i = $index) {
          <article class="commit" appReveal [revealDelay]="i * 90">
            <div class="graph"><span class="node"></span></div>

            <div class="commit-body">
              <div class="commit-top">
                <code class="hash">{{ hash(i) }}</code>
                <span class="subject">{{ r.scope }}</span>
              </div>

              <div class="meta">
                <span class="company">{{ r.company }}</span>
                <span class="sep">·</span>
                <span>{{ r.title }}</span>
                <span class="sep">·</span>
                <span class="mono when">{{ r.period }}</span>
                <span class="sep">·</span>
                <span class="loc">{{ r.location }}</span>
              </div>

              <ul class="points">
                @for (p of r.points; track p) { <li>{{ p }}</li> }
              </ul>

              <div class="stack">
                @for (t of r.stack; track t) { <span class="chip">{{ t }}</span> }
              </div>
            </div>
          </article>
        }

        <div class="commit init" appReveal>
          <div class="graph"><span class="node dim"></span></div>
          <div class="commit-body">
            <div class="commit-top">
              <code class="hash">0000000</code>
              <span class="subject dim">init: B.Tech IT, NIT Raipur — the first commit</span>
            </div>
          </div>
        </div>
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

    .log { position: relative; }
    .commit { display: grid; grid-template-columns: 30px 1fr; gap: .4rem; }

    .graph { position: relative; display: flex; justify-content: center; }
    .graph::before {
      content: ''; position: absolute; top: 0; bottom: -1.6rem; left: 50%;
      width: 2px; transform: translateX(-50%);
      background: var(--border);
    }
    .commit:last-child .graph::before { display: none; }
    .node {
      width: 14px; height: 14px; border-radius: 50%; margin-top: 5px;
      background: var(--bg); border: 2px solid var(--accent); z-index: 1;
      box-shadow: 0 0 0 4px color-mix(in oklab, var(--accent) 14%, transparent);
      transition: transform .3s var(--ease-out);
    }
    .node.dim { border-color: var(--text-3); box-shadow: none; }
    .commit:hover .node { transform: scale(1.25); }

    .commit-body { padding-bottom: 1.9rem; }
    .commit-top { display: flex; flex-wrap: wrap; align-items: baseline; gap: .55rem; }
    .hash {
      font-family: var(--font-mono); font-size: .8rem; color: var(--amber);
      background: color-mix(in oklab, var(--amber) 12%, transparent);
      padding: .05rem .4rem; border-radius: 5px;
    }
    .subject {
      font-family: var(--font-mono); font-size: clamp(.86rem, 1.7vw, 1rem);
      color: var(--text); font-weight: 500; letter-spacing: -.01em;
    }
    .subject.dim { color: var(--text-3); }

    .meta {
      display: flex; flex-wrap: wrap; align-items: center; gap: .45rem;
      margin: .55rem 0 .8rem; color: var(--text-2); font-size: .88rem;
    }
    .company { font-weight: 600; color: var(--text); }
    .when { color: var(--teal); font-size: .82rem; }
    .sep { color: var(--text-3); }
    .loc { color: var(--text-3); }

    .points { display: grid; gap: .4rem; margin-bottom: .9rem; }
    .points li {
      position: relative; padding-left: 1.2rem; color: var(--text-2);
      font-size: .95rem; max-width: 74ch;
    }
    .points li::before {
      content: '+'; position: absolute; left: 0; top: -1px;
      color: var(--green); font-family: var(--font-mono); font-weight: 600;
    }

    .stack { display: flex; flex-wrap: wrap; gap: .4rem; }
    .chip {
      font-family: var(--font-mono); font-size: .72rem; color: var(--text-2);
      border: 1px solid var(--border); border-radius: 6px; padding: .18rem .5rem;
      background: var(--bg-2); transition: border-color .25s var(--ease), color .25s var(--ease);
    }
    .chip:hover { border-color: var(--accent); color: var(--accent); }

    .init .commit-body { padding-bottom: 0; }
  `],
})
export class ExperienceComponent {
  readonly roles: Role[] = ROLES;
  private hashes = ['a1f9c2e', '7b3d05a', 'e4c81ff'];
  hash(i: number): string { return this.hashes[i] ?? '1a2b3c4'; }
}
