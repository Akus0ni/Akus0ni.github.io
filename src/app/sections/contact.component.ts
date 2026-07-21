import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../directives/reveal.directive';
import { LINKS } from '../data/resume';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section id="contact" class="contact">
      <div class="band" aria-hidden="true">
        <img src="media/akash-sunset.jpg" alt="" loading="lazy" />
      </div>

      <div class="panel" appReveal>
        <header class="s-head">
          <span class="s-index mono">06</span>
          <h2 class="s-title">Let's build something</h2>
          <span class="s-file mono">./contact.sh</span>
        </header>

        <div class="term">
          <div class="term-bar">
            <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
            <span class="term-title mono">bash — akash&#64;portfolio</span>
          </div>
          <div class="term-body mono">
            <p class="tl"><span class="prompt">akash&#64;portfolio</span>:<span class="path">~</span>$ ./contact.sh --hire</p>
            <p class="tl out"><span class="ok">✔</span> open to backend, full-stack and/or cloud engineering roles</p>
            <p class="tl out"><span class="ok">✔</span> {{ links.location }} · remote-friendly · UTC+5:30</p>
            <p class="tl"><span class="prompt">akash&#64;portfolio</span>:<span class="path">~</span>$ ls ./channels</p>

            <div class="links">
              <a class="lk" [href]="'mailto:' + links.email">
                <span class="lk-k mono">email</span>
                <span class="lk-v">{{ links.email }}</span>
                <span class="arw" aria-hidden="true">→</span>
              </a>
              <a class="lk" [href]="links.linkedin" target="_blank" rel="noopener">
                <span class="lk-k mono">linkedin</span>
                <span class="lk-v">/in/akus0ni</span>
                <span class="arw" aria-hidden="true">→</span>
              </a>
              <a class="lk" [href]="links.github" target="_blank" rel="noopener">
                <span class="lk-k mono">github</span>
                <span class="lk-v">/Akus0ni</span>
                <span class="arw" aria-hidden="true">→</span>
              </a>
              <a class="lk primary" [href]="links.resume" download>
                <span class="lk-k mono">resume</span>
                <span class="lk-v">Akash_Soni_Resume.pdf ↓</span>
                <span class="arw" aria-hidden="true">→</span>
              </a>
            </div>

            <p class="tl"><span class="prompt">akash&#64;portfolio</span>:<span class="path">~</span>$ <span class="cursor"></span></p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact { position: relative; padding: clamp(3rem, 8vw, 6rem) 0 2rem; }

    .band { position: absolute; inset: 0; overflow: hidden; z-index: 0; opacity: .5; }
    .band::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(180deg, var(--bg) 0%, transparent 30%, transparent 60%, var(--bg) 100%),
                  linear-gradient(90deg, var(--bg) 0%, transparent 40%, transparent 60%, var(--bg) 100%);
    }
    .band img {
      width: 100%; height: 100%; object-fit: cover; object-position: 50% 40%;
      filter: grayscale(.65) contrast(1.05) saturate(1.1);
      mix-blend-mode: luminosity;
    }

    .panel { position: relative; z-index: 1; }
    .s-head {
      display: flex; align-items: baseline; gap: .8rem; margin-bottom: 1.8rem;
      border-bottom: 1px solid var(--border); padding-bottom: .9rem;
    }
    .s-index { color: var(--accent); font-size: .85rem; }
    .s-title { font-size: clamp(1.6rem, 4.5vw, 2.4rem); }
    .s-file { margin-left: auto; color: var(--text-3); font-size: .78rem; }

    .term {
      border: 1px solid var(--border); border-radius: 14px; overflow: hidden;
      background: var(--bg-glass); backdrop-filter: blur(10px);
      box-shadow: var(--shadow-2); max-width: 760px;
    }
    .term-bar {
      display: flex; align-items: center; gap: .45rem;
      padding: .6rem .85rem; border-bottom: 1px solid var(--border); background: var(--bg-3);
    }
    .dot { width: 11px; height: 11px; border-radius: 50%; }
    .dot.r { background: #ff5f57; } .dot.y { background: #febc2e; } .dot.g { background: #28c840; }
    .term-title { margin-left: .4rem; font-size: .72rem; color: var(--text-3); }

    .term-body { padding: 1.1rem 1.2rem 1.3rem; font-size: clamp(.8rem, 1.6vw, .9rem); }
    .tl { line-height: 1.9; color: var(--text-2); }
    .prompt { color: var(--green); } .path { color: var(--blue); }
    .out { color: var(--text-2); } .ok { color: var(--green); margin-right: .3rem; }

    .links { display: grid; grid-template-columns: 1fr 1fr; gap: .55rem; margin: .8rem 0 1rem; }
    .lk {
      display: flex; align-items: center; gap: .6rem;
      padding: .7rem .9rem; border: 1px solid var(--border); border-radius: 10px;
      background: var(--bg-2);
      transition: transform .25s var(--ease-out), border-color .25s var(--ease), background .25s var(--ease);
    }
    .lk:hover { transform: translateX(4px); border-color: var(--accent); }
    .lk-k { color: var(--amber); font-size: .78rem; min-width: 4.5rem; }
    .lk-v { color: var(--text); font-family: var(--font-body); font-size: .9rem; }
    .arw { margin-left: auto; color: var(--text-3); transition: transform .25s var(--ease-out), color .25s; }
    .lk:hover .arw { transform: translateX(3px); color: var(--accent); }
    .lk.primary { border-color: color-mix(in oklab, var(--accent) 45%, var(--border)); background: color-mix(in oklab, var(--accent) 8%, var(--bg-2)); }

    .cursor {
      display: inline-block; width: .55ch; height: 1.05em; transform: translateY(2px);
      background: var(--accent); animation: blink 1s steps(1) infinite;
    }
    @media (prefers-reduced-motion: reduce) { .cursor { animation: none; } }
    @media (max-width: 560px) { .links { grid-template-columns: 1fr; } }
  `],
})
export class ContactComponent {
  readonly links = LINKS;
}
