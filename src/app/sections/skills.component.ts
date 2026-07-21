import {
  Component, signal, computed, ElementRef, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RevealDirective } from '../directives/reveal.directive';
import { SKILLS, SkillKind } from '../data/resume';

interface Row {
  name: string; meta: string; note: string;
  group: string; kind: SkillKind; glyph: string; kindLabel: string;
  hay: string; // lowercased search haystack
}

// short chip labels for the long group names
const SHORT: Record<string, string> = {
  'Languages & Frameworks': 'Languages',
  'Cloud — AWS & Azure': 'Cloud',
  'Data & Analytics': 'Data',
  'Frontend': 'Frontend',
  'Integration & APIs': 'Integration',
  'Security': 'Security',
  'Practices': 'Practices',
};

const KIND: Record<SkillKind, { glyph: string; label: string }> = {
  method:    { glyph: 'M', label: 'method' },
  class:     { glyph: 'C', label: 'class' },
  field:     { glyph: 'F', label: 'field' },
  variable:  { glyph: 'V', label: 'variable' },
  interface: { glyph: 'I', label: 'interface' },
  event:     { glyph: 'E', label: 'event' },
  snippet:   { glyph: 'S', label: 'snippet' },
};

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, FormsModule, RevealDirective],
  template: `
    <section id="skills" class="wrap">
      <header class="s-head" appReveal>
        <span class="s-index mono">04</span>
        <h2 class="s-title">Skills</h2>
        <span class="s-file mono">skills.ts</span>
      </header>

      <div class="cmd" appReveal [revealDelay]="80">
        <!-- palette invocation hint -->
        <div class="cmd-caption mono">
          <span class="tok-com">// press to search symbols</span>
          <span class="kbd">Ctrl</span><span class="kbd">Shift</span><span class="kbd">P</span>
        </div>

        <div class="cmd-panel">
          <!-- search bar -->
          <div class="cmd-bar">
            <svg class="cmd-search" viewBox="0 0 24 24" width="16" height="16" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input #box class="cmd-input mono" type="text"
                   [ngModel]="query()" (ngModelChange)="onQuery($event)"
                   (keydown)="onKey($event)"
                   placeholder="Filter 41 skills — try 'aws', 'security', 'angular'…"
                   aria-label="Filter skills" autocomplete="off" spellcheck="false" />
            <span class="cmd-count mono">{{ filtered().length }}</span>
          </div>

          <!-- category quick-filters -->
          <div class="cmd-cats" role="tablist" aria-label="Filter by category">
            <button class="cat-btn" role="tab" [class.on]="activeCat() === null"
                    [attr.aria-selected]="activeCat() === null" (click)="setCat(null)">
              All <span class="cat-n mono">{{ rows.length }}</span>
            </button>
            @for (c of cats; track c.group) {
              <button class="cat-btn" role="tab" [attr.data-kind]="c.kind"
                      [class.on]="activeCat() === c.group"
                      [attr.aria-selected]="activeCat() === c.group" (click)="setCat(c.group)">
                {{ c.short }} <span class="cat-n mono">{{ c.count }}</span>
              </button>
            }
          </div>

          <!-- results -->
          <ul class="cmd-list" role="listbox" aria-label="Skills">
            @for (r of filtered(); track r.name; let i = $index) {
              <li role="option" [attr.aria-selected]="i === index()">
                <div class="cmd-row" [class.sel]="i === index()" [attr.data-idx]="i"
                     (mouseenter)="index.set(i)">
                  <span class="cmd-ico" [attr.data-kind]="r.kind">{{ r.glyph }}</span>
                  <div class="cmd-main">
                    <p class="cmd-name">
                      <span class="mono">{{ r.name }}</span>
                      <span class="cmd-cat" [attr.data-kind]="r.kind">{{ r.group }}</span>
                    </p>
                    <p class="cmd-note">{{ r.note }}</p>
                  </div>
                  <span class="cmd-meta mono">{{ r.meta }}</span>
                </div>
              </li>
            } @empty {
              <li class="cmd-none mono">
                <span class="tok-com">// no symbols match “{{ query() }}”</span>
              </li>
            }
          </ul>

          <div class="cmd-foot mono">
            <span><span class="kbd sm">↑</span><span class="kbd sm">↓</span> navigate</span>
            <span>{{ filtered().length }} / {{ rows.length }} symbols</span>
          </div>
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

    .cmd-caption {
      display: flex; align-items: center; gap: .4rem; margin-bottom: .7rem;
      font-size: .78rem; color: var(--text-3);
    }
    .cmd-caption .tok-com { margin-right: auto; }
    .kbd {
      font-family: var(--font-mono); font-size: .68rem; color: var(--text-2);
      background: var(--bg-3); border: 1px solid var(--border);
      border-bottom-width: 2px; border-radius: 5px; padding: .08rem .38rem;
    }
    .kbd.sm { font-size: .62rem; padding: .02rem .3rem; }

    .cmd-panel {
      border: 1px solid var(--accent); border-radius: 12px; overflow: hidden;
      background: var(--bg-2); box-shadow: var(--shadow-2);
    }

    .cmd-bar {
      display: flex; align-items: center; gap: .6rem;
      padding: .7rem .9rem; border-bottom: 1px solid var(--border);
      background: var(--bg-3);
    }
    .cmd-search { color: var(--text-3); flex: none; }
    .cmd-input {
      flex: 1; min-width: 0; background: none; border: none; outline: none;
      color: var(--text); font-size: .9rem;
    }
    .cmd-input::placeholder { color: var(--text-3); }
    .cmd-count {
      flex: none; font-size: .72rem; color: var(--accent-contrast);
      background: var(--accent); border-radius: 20px; padding: .06rem .5rem; font-weight: 600;
    }

    .cmd-cats {
      display: flex; gap: .4rem; padding: .6rem .7rem; overflow-x: auto;
      border-bottom: 1px solid var(--border); background: var(--bg-2);
      scrollbar-width: none;
    }
    .cmd-cats::-webkit-scrollbar { display: none; }
    .cat-btn {
      display: inline-flex; align-items: center; gap: .4rem; flex: none;
      font-size: .76rem; color: var(--text-2);
      padding: .3rem .65rem; border-radius: 20px;
      border: 1px solid var(--border); background: var(--bg-3);
      transition: color .18s var(--ease), border-color .18s var(--ease), background .18s var(--ease);
    }
    .cat-btn:hover { color: var(--text); border-color: var(--text-3); }
    .cat-n { font-size: .64rem; color: var(--text-3); }
    .cat-btn.on {
      color: var(--accent); border-color: color-mix(in oklab, var(--accent) 55%, var(--border));
      background: color-mix(in oklab, var(--accent) 12%, transparent);
    }
    .cat-btn.on .cat-n { color: var(--accent); }
    .cat-btn[data-kind='method'].on    { color: var(--lav);   border-color: color-mix(in oklab, var(--lav) 55%, var(--border));   background: color-mix(in oklab, var(--lav) 12%, transparent); }
    .cat-btn[data-kind='class'].on     { color: var(--amber); border-color: color-mix(in oklab, var(--amber) 55%, var(--border)); background: color-mix(in oklab, var(--amber) 12%, transparent); }
    .cat-btn[data-kind='field'].on     { color: var(--blue);  border-color: color-mix(in oklab, var(--blue) 55%, var(--border));  background: color-mix(in oklab, var(--blue) 12%, transparent); }
    .cat-btn[data-kind='variable'].on  { color: var(--teal);  border-color: color-mix(in oklab, var(--teal) 55%, var(--border));  background: color-mix(in oklab, var(--teal) 12%, transparent); }
    .cat-btn[data-kind='interface'].on { color: var(--green); border-color: color-mix(in oklab, var(--green) 55%, var(--border)); background: color-mix(in oklab, var(--green) 12%, transparent); }
    .cat-btn[data-kind='event'].on     { color: var(--coral); border-color: color-mix(in oklab, var(--coral) 55%, var(--border)); background: color-mix(in oklab, var(--coral) 12%, transparent); }
    .cat-btn[data-kind='snippet'].on   { color: var(--amber); border-color: color-mix(in oklab, var(--amber) 55%, var(--border)); background: color-mix(in oklab, var(--amber) 12%, transparent); }
    .cat-btn[data-kind].on .cat-n { color: inherit; }

    .cmd-list { max-height: 430px; overflow-y: auto; padding: .3rem; }

    .cmd-row {
      display: flex; align-items: flex-start; gap: .7rem;
      padding: .55rem .6rem; border-radius: 8px; cursor: default;
      transition: background .12s var(--ease);
    }
    .cmd-row.sel { background: color-mix(in oklab, var(--accent) 14%, transparent); }

    .cmd-ico {
      flex: none; margin-top: 1px; display: grid; place-items: center;
      width: 20px; height: 20px; border-radius: 5px;
      font-family: var(--font-mono); font-size: .68rem; font-weight: 700;
      color: var(--bg); background: var(--lav);
    }
    .cmd-ico[data-kind='class'] { background: var(--amber); }
    .cmd-ico[data-kind='field'] { background: var(--blue); }
    .cmd-ico[data-kind='variable'] { background: var(--teal); }
    .cmd-ico[data-kind='interface'] { background: var(--green); }
    .cmd-ico[data-kind='event'] { background: var(--coral); }
    .cmd-ico[data-kind='snippet'] { background: var(--amber); }

    .cmd-main { min-width: 0; flex: 1; }
    .cmd-name {
      display: flex; align-items: center; gap: .55rem; flex-wrap: wrap;
      font-size: .88rem; color: var(--text); line-height: 1.4;
    }
    .cmd-cat {
      font-family: var(--font-mono); font-size: .62rem; letter-spacing: .02em;
      color: var(--text-2); border: 1px solid var(--border);
      border-radius: 20px; padding: .02rem .45rem; white-space: nowrap;
    }
    .cmd-cat[data-kind='method']    { color: var(--lav);   border-color: color-mix(in oklab, var(--lav) 40%, var(--border)); }
    .cmd-cat[data-kind='class']     { color: var(--amber); border-color: color-mix(in oklab, var(--amber) 40%, var(--border)); }
    .cmd-cat[data-kind='field']     { color: var(--blue);  border-color: color-mix(in oklab, var(--blue) 40%, var(--border)); }
    .cmd-cat[data-kind='variable']  { color: var(--teal);  border-color: color-mix(in oklab, var(--teal) 40%, var(--border)); }
    .cmd-cat[data-kind='interface'] { color: var(--green); border-color: color-mix(in oklab, var(--green) 40%, var(--border)); }
    .cmd-cat[data-kind='event']     { color: var(--coral); border-color: color-mix(in oklab, var(--coral) 40%, var(--border)); }
    .cmd-cat[data-kind='snippet']   { color: var(--amber); border-color: color-mix(in oklab, var(--amber) 40%, var(--border)); }

    .cmd-note { font-size: .8rem; color: var(--text-2); line-height: 1.45; margin-top: .1rem; }
    .cmd-meta { flex: none; font-size: .72rem; color: var(--text-3); margin-top: 2px; white-space: nowrap; }

    .cmd-none { padding: 1.4rem .8rem; text-align: center; font-size: .85rem; }

    .cmd-foot {
      display: flex; justify-content: space-between; align-items: center;
      padding: .5rem .9rem; border-top: 1px solid var(--border);
      background: var(--bg-3); font-size: .7rem; color: var(--text-3);
    }
    .cmd-foot .kbd { margin-right: 2px; }

    @media (max-width: 560px) {
      .cmd-meta { display: none; }
      .cmd-list { max-height: 380px; }
    }
  `],
})
export class SkillsComponent {
  private host = inject(ElementRef<HTMLElement>);

  readonly rows: Row[] = SKILLS.flatMap((g) =>
    g.items.map((it) => ({
      ...it,
      group: g.group,
      kind: g.kind,
      glyph: KIND[g.kind].glyph,
      kindLabel: KIND[g.kind].label,
      hay: `${it.name} ${it.meta} ${it.note} ${g.group} ${KIND[g.kind].label}`.toLowerCase(),
    })),
  );

  // one quick-filter chip per group, with a short label + count
  readonly cats = SKILLS.map((g) => ({
    group: g.group,
    kind: g.kind,
    short: SHORT[g.group] ?? g.group,
    count: g.items.length,
  }));

  readonly query = signal('');
  readonly activeCat = signal<string | null>(null);
  readonly index = signal(0);

  readonly filtered = computed<Row[]>(() => {
    const q = this.query().trim().toLowerCase();
    const cat = this.activeCat();
    return this.rows.filter(
      (r) => (!cat || r.group === cat) && (!q || r.hay.includes(q)),
    );
  });

  onQuery(v: string): void {
    this.query.set(v);
    this.index.set(0);
  }

  setCat(group: string | null): void {
    // clicking the active chip clears it back to "All"
    this.activeCat.update((cur) => (cur === group ? null : group));
    this.index.set(0);
  }

  onKey(ev: KeyboardEvent): void {
    const last = this.filtered().length - 1;
    if (last < 0) return;
    let handled = true;
    switch (ev.key) {
      case 'ArrowDown': this.index.update((i) => Math.min(last, i + 1)); break;
      case 'ArrowUp':   this.index.update((i) => Math.max(0, i - 1)); break;
      case 'Home':      this.index.set(0); break;
      case 'End':       this.index.set(last); break;
      default: handled = false;
    }
    if (handled) {
      ev.preventDefault();
      queueMicrotask(() => {
        this.host.nativeElement
          .querySelector(`[data-idx="${this.index()}"]`)
          ?.scrollIntoView({ block: 'nearest' });
      });
    }
  }
}
