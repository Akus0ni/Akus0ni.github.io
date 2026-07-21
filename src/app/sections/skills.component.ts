import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../directives/reveal.directive';
import { SKILLS, SkillGroup } from '../data/resume';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <section id="skills" class="wrap">
      <header class="s-head" appReveal>
        <span class="s-index mono">04</span>
        <h2 class="s-title">Stack</h2>
        <span class="s-file mono">Akash.Soni.csproj</span>
      </header>

      <div class="editor" appReveal [revealDelay]="80">
        <div class="code" role="text"
          aria-label="Skills as a .NET project file listing languages, cloud, data, frontend and practices.">
          <div class="ln"><span class="tok-key">&lt;Project</span> <span class="tok-teal">Sdk</span>=<span class="tok-str">"Microsoft.NET.Sdk.Engineer"</span><span class="tok-key">&gt;</span></div>
          <div class="ln"><span class="ind">&nbsp;&nbsp;</span><span class="tok-key">&lt;ItemGroup&gt;</span></div>

          @for (g of skills; track g.group) {
            <div class="ln grp"><span class="ind">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tok-com">&lt;!-- {{ g.group }} --&gt;</span></div>
            @for (it of g.items; track it.name) {
              <div class="ln ref"><span class="ind">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tok-key">&lt;PackageReference </span><span class="tok-teal">Include</span>=<span class="tok-str">"Akash.{{ it.name }}"</span> <span class="tok-teal">Version</span>=<span class="tok-str">"{{ it.version }}"</span> <span class="tok-key">/&gt;</span></div>
            }
          }

          <div class="ln"><span class="ind">&nbsp;&nbsp;</span><span class="tok-key">&lt;/ItemGroup&gt;</span></div>
          <div class="ln"><span class="tok-key">&lt;/Project&gt;</span></div>
        </div>
      </div>

      <p class="hint mono" appReveal>
        <span class="tok-com">// dotnet restore → {{ totalRefs }} packages · 0 vulnerabilities · builds clean</span>
      </p>
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

    .editor {
      border: 1px solid var(--border); border-radius: 14px; overflow: hidden;
      background: var(--bg-2); box-shadow: var(--shadow-1);
    }
    .code {
      counter-reset: ln; padding: 1rem 0; overflow-x: auto;
      font-family: var(--font-mono);
      font-size: clamp(.72rem, 1.5vw, .85rem); line-height: 1.9;
      color: var(--text-2);
    }
    .ln {
      counter-increment: ln; position: relative; white-space: nowrap;
      padding: 0 1.2rem 0 3.6rem;
    }
    .ln::before {
      content: counter(ln); position: absolute; left: 0; width: 2.6rem;
      text-align: right; color: var(--text-3); opacity: .6;
    }
    .ln.ref { transition: background .2s var(--ease); }
    .ln.ref:hover { background: color-mix(in oklab, var(--accent) 10%, transparent); }
    .ln.ref:hover::before { color: var(--accent); opacity: 1; }
    .ind { white-space: pre; }

    .hint { margin-top: 1rem; font-size: .8rem; }
  `],
})
export class SkillsComponent {
  readonly skills: SkillGroup[] = SKILLS;
  readonly totalRefs = SKILLS.reduce((a, g) => a + g.items.length, 0);
}
