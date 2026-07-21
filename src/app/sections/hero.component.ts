import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypewriterComponent } from '../components/typewriter.component';
import { ArchDiagramComponent } from '../components/arch-diagram.component';
import { RevealDirective } from '../directives/reveal.directive';
import { LINKS } from '../data/resume';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TypewriterComponent, ArchDiagramComponent, RevealDirective],
  template: `
    <section id="home" class="hero">
      <div class="hero-grid">
        <!-- identity -->
        <div class="identity">
          <p class="eyebrow load load-1">~/akash-soni · <span class="branch">main</span></p>

          <pre class="id-code load load-2" aria-hidden="true"><span class="tok-com">// available for senior full-stack & cloud roles</span>
<span class="tok-key">public sealed class</span> <span class="tok-type">Akash</span> : <span class="tok-type">SoftwareEngineer</span></pre>

          <h1 class="name load load-3">Akash&nbsp;Soni</h1>

          <div class="role load load-4">
            <span class="chev">&gt;</span>
            <app-typewriter [phrases]="phrases"></app-typewriter>
          </div>

          <p class="tagline load load-5">
            6+ years turning tangled enterprise systems into clean, reusable
            platforms — <span class="accent">.NET / C#</span> on
            <span class="accent">AWS&nbsp;&amp;&nbsp;Azure</span>. Integrations are the throughline.
          </p>

          <div class="cta load load-6">
            <a class="btn btn-primary" href="#projects">
              <span class="mono">&lt;/&gt;</span> View work
            </a>
            <a class="btn btn-ghost" [href]="links.resume" download>
              Download résumé
            </a>
            <a class="btn btn-ghost" [href]="'mailto:' + links.email">
              Email me
            </a>
          </div>
        </div>

        <!-- portrait, treated as an editor preview -->
        <figure class="portrait-frame load load-5">
          <div class="pf-bar">
            <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
            <span class="pf-name mono">akash.jpg — preview</span>
          </div>
          <div class="portrait">
            <img src="media/akash-portrait.jpg"
                 alt="Portrait of Akash Soni at the coast at sunset" loading="eager" />
            <span class="scan"></span>
          </div>
          <figcaption class="pf-tags">
            <span>Raipur, IN</span><span>· UTC+5:30</span><span class="accent">· open to remote</span>
          </figcaption>
        </figure>
      </div>

      <!-- signature: real serverless architecture he shipped -->
      <div class="signature" appReveal>
        <div class="sig-head">
          <p class="eyebrow">signature build · AI-Powered Review Intelligence</p>
          <p class="sig-sub">A serverless AWS stack, architected & shipped solo — QR&nbsp;→ AI review in&nbsp;&lt;30s</p>
        </div>
        <app-arch-diagram></app-arch-diagram>
      </div>

      <a class="scroll-hint" href="#about" aria-label="Scroll to about">
        <span class="mono">scroll</span>
        <span class="arrow"></span>
      </a>
    </section>
  `,
  styles: [`
    .hero { padding: clamp(1.6rem, 5vw, 3.4rem) 0 2rem; position: relative; }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.15fr .85fr;
      gap: clamp(1.5rem, 4vw, 3.4rem);
      align-items: center;
    }

    .branch { color: var(--green); }

    .id-code {
      font-family: var(--font-mono);
      font-size: clamp(.82rem, 1.4vw, .95rem);
      line-height: 1.7;
      margin: .2rem 0 .4rem;
      white-space: pre-wrap;
    }

    .name {
      font-size: clamp(3rem, 9vw, 5.6rem);
      font-weight: 700;
      letter-spacing: -.035em;
      background: linear-gradient(120deg, var(--text) 30%, var(--amber));
      -webkit-background-clip: text; background-clip: text; color: transparent;
      margin: .1rem 0 .3rem;
    }

    .role {
      display: flex; align-items: center; gap: .5rem;
      font-size: clamp(1rem, 2.3vw, 1.4rem);
      color: var(--text-2); min-height: 1.8em;
    }
    .role .chev { color: var(--accent); font-family: var(--font-mono); }

    .tagline {
      margin: 1.1rem 0 1.7rem; max-width: 46ch;
      color: var(--text-2); font-size: clamp(.98rem, 1.6vw, 1.08rem);
    }

    .cta { display: flex; flex-wrap: wrap; gap: .7rem; }
    .btn {
      display: inline-flex; align-items: center; gap: .5rem;
      padding: .68rem 1.15rem; border-radius: 10px;
      font-weight: 500; font-size: .95rem;
      border: 1px solid var(--border);
      transition: transform .25s var(--ease-out), box-shadow .25s var(--ease-out),
                  background .25s var(--ease), border-color .25s var(--ease);
    }
    .btn:hover { transform: translateY(-2px); }
    .btn-primary {
      background: var(--accent); color: var(--accent-contrast);
      border-color: transparent; box-shadow: var(--shadow-glow);
    }
    .btn-primary:hover { box-shadow: 0 10px 30px color-mix(in oklab, var(--accent) 35%, transparent); }
    .btn-ghost { background: var(--bg-2); }
    .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
    .btn .mono { font-family: var(--font-mono); font-size: .85em; }

    /* portrait */
    .portrait-frame {
      border: 1px solid var(--border); border-radius: 14px;
      background: var(--bg-2); overflow: hidden; box-shadow: var(--shadow-2);
      transition: transform .5s var(--ease-out);
    }
    .portrait-frame:hover { transform: translateY(-4px) rotate(-.4deg); }
    .pf-bar {
      display: flex; align-items: center; gap: .45rem;
      padding: .55rem .8rem; border-bottom: 1px solid var(--border);
      background: var(--bg-3);
    }
    .dot { width: 11px; height: 11px; border-radius: 50%; opacity: .9; }
    .dot.r { background: #ff5f57; } .dot.y { background: #febc2e; } .dot.g { background: #28c840; }
    .pf-name { margin-left: .4rem; font-size: .72rem; color: var(--text-3); }

    .portrait { position: relative; aspect-ratio: 16 / 11; overflow: hidden; }
    .portrait img {
      width: 100%; height: 100%; object-fit: cover; object-position: 50% 32%;
      filter: grayscale(1) contrast(1.08) brightness(.96);
    }
    /* duotone: ocean-teal shadows, sunset-amber highlights */
    .portrait::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(150deg, var(--teal) 0%, transparent 62%);
      mix-blend-mode: color; opacity: .9;
    }
    .portrait::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(330deg, var(--amber) 0%, transparent 55%);
      mix-blend-mode: overlay; opacity: .85;
    }
    :root[data-theme='light'] .portrait img { filter: grayscale(1) contrast(1.05) brightness(1.02); }
    .scan {
      position: absolute; inset: 0; pointer-events: none;
      background: repeating-linear-gradient(0deg,
        transparent 0 3px, color-mix(in oklab, var(--bg) 22%, transparent) 3px 4px);
      opacity: .35;
    }
    .pf-tags {
      display: flex; flex-wrap: wrap; gap: .5rem;
      padding: .6rem .85rem; font-family: var(--font-mono);
      font-size: .72rem; color: var(--text-3); border-top: 1px solid var(--border);
    }

    /* signature */
    .signature {
      margin-top: clamp(2.4rem, 6vw, 4rem);
      border: 1px solid var(--border); border-radius: 16px;
      background:
        radial-gradient(120% 140% at 80% 0%, color-mix(in oklab, var(--amber) 7%, transparent), transparent 55%),
        var(--bg-2);
      padding: clamp(1.1rem, 3vw, 1.8rem);
      box-shadow: var(--shadow-1);
    }
    .sig-head { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .4rem; margin-bottom: .4rem; }
    .sig-sub { color: var(--text-2); font-size: .9rem; }

    /* scroll hint */
    .scroll-hint {
      display: flex; flex-direction: column; align-items: center; gap: .4rem;
      width: fit-content; margin: 2.2rem auto 0;
      font-family: var(--font-mono); font-size: .68rem; letter-spacing: .18em;
      text-transform: uppercase; color: var(--text-3);
    }
    .scroll-hint .arrow {
      width: 1px; height: 34px; background: linear-gradient(var(--text-3), transparent);
      position: relative; animation: floaty 2.4s var(--ease) infinite;
    }
    .scroll-hint .arrow::after {
      content: ''; position: absolute; bottom: 0; left: -3px;
      width: 7px; height: 7px; border-right: 1px solid var(--text-3);
      border-bottom: 1px solid var(--text-3); transform: rotate(45deg);
    }

    /* load-in orchestration */
    .load { opacity: 0; transform: translateY(14px); animation: rise .7s var(--ease-out) forwards; }
    .load-1 { animation-delay: .05s; } .load-2 { animation-delay: .14s; }
    .load-3 { animation-delay: .24s; } .load-4 { animation-delay: .36s; }
    .load-5 { animation-delay: .48s; } .load-6 { animation-delay: .6s; }
    @keyframes rise { to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .load { animation: none; opacity: 1; transform: none; } }

    @media (max-width: 860px) {
      .hero-grid { grid-template-columns: 1fr; }
      .portrait-frame { max-width: 420px; order: -1; }
    }
  `],
})
export class HeroComponent {
  readonly links = LINKS;
  readonly phrases = [
    'Full-stack Software Engineer',
    '.NET / C# · AWS & Azure',
    'I connect systems.',
    'Cloud data-platform builder',
  ];
}
