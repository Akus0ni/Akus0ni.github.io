import {
  Component, signal, computed, ElementRef, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../directives/reveal.directive';
import { SKILLS, SkillKind } from '../data/resume';

interface Row {
  name: string; meta: string; note: string;
  group: string; kind: SkillKind; glyph: string; kindLabel: string;
  first: boolean; // first item of its group -> render a group label
}

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
  imports: [CommonModule, RevealDirective],
  template: `
    <section id="skills" class="wrap">
      <header class="s-head" appReveal>
        <span class="s-index mono">04</span>
        <h2 class="s-title">Skills</h2>
        <span class="s-file mono">skills.ts</span>
      </header>

      <div class="ac" appReveal [revealDelay]="80">
        <!-- editor context line that "triggers" the suggestion widget -->
        <div class="ac-code mono">
          <div class="ac-line"><span class="tok-com">// intellisense — {{ rows.length }} symbols on 'akash'</span></div>
          <div class="ac-line">
            <span class="tok-key">const</span>&nbsp;<span class="tok-teal">akash</span>&nbsp;=&nbsp;<span class="tok-key">new</span>&nbsp;<span class="tok-type">Engineer</span>();
          </div>
          <div class="ac-line">
            <span class="tok-teal">akash</span>.<span class="typed" [attr.data-kind]="selected().kind">{{ selected().name }}</span><span class="caret" aria-hidden="true"></span>
          </div>
        </div>

        <!-- the suggestion widget -->
        <div class="ac-widget">
          <ul class="ac-list" role="listbox" aria-label="Skills" tabindex="0"
              (keydown)="onKey($event)">
            @for (r of rows; track r.name; let i = $index) {
              @if (r.first) { <li class="ac-grp" role="presentation">{{ r.group }}</li> }
              <li role="option" [attr.aria-selected]="i === index()">
                <button class="ac-row" [class.sel]="i === index()"
                        [attr.data-idx]="i"
                        (mouseenter)="index.set(i)" (focus)="index.set(i)"
                        (click)="index.set(i)">
                  <span class="ac-ico" [attr.data-kind]="r.kind">{{ r.glyph }}</span>
                  <span class="ac-name">{{ r.name }}</span>
                  <span class="ac-meta mono">{{ r.meta }}</span>
                </button>
              </li>
            }
          </ul>

          <!-- docs flyout for the highlighted symbol -->
          <aside class="ac-doc">
            <div class="ac-doc-head">
              <span class="ac-ico big" [attr.data-kind]="selected().kind">{{ selected().glyph }}</span>
              <div>
                <p class="ac-doc-name">{{ selected().name }}</p>
                <p class="ac-doc-kind mono">{{ selected().kindLabel }} · {{ selected().group }}</p>
              </div>
            </div>
            <p class="ac-sig mono"><span class="tok-teal">akash</span>.<span class="tok-fn">{{ selected().name }}</span>: <span class="tok-str">"{{ selected().meta }}"</span></p>
            <p class="ac-note">{{ selected().note }}</p>
          </aside>
        </div>

        <p class="ac-hint mono">
          <span class="tok-com">// hover a symbol, or focus the list and press ↑ ↓ to browse</span>
        </p>
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

    .ac-code {
      background: var(--bg-inset); border: 1px solid var(--border);
      border-radius: 12px 12px 0 0; border-bottom: none;
      padding: .9rem 1.1rem; font-size: clamp(.8rem, 1.6vw, .92rem); line-height: 1.9;
    }
    .ac-line { white-space: nowrap; overflow-x: auto; }
    .typed { color: var(--lav); font-weight: 600; }
    .typed[data-kind='class'] { color: var(--amber); }
    .typed[data-kind='field'] { color: var(--blue); }
    .typed[data-kind='variable'] { color: var(--teal); }
    .typed[data-kind='interface'] { color: var(--green); }
    .typed[data-kind='event'] { color: var(--coral); }
    .typed[data-kind='snippet'] { color: var(--amber); }
    .caret {
      display: inline-block; width: .55ch; height: 1.05em; transform: translateY(2px);
      background: var(--accent); margin-left: 1px; animation: blink 1s steps(1) infinite;
    }

    .ac-widget {
      display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr);
      border: 1px solid var(--accent); border-radius: 0 0 12px 12px;
      background: var(--bg-2); overflow: hidden;
      box-shadow: var(--shadow-2);
    }

    .ac-list {
      max-height: 360px; overflow-y: auto; padding: .35rem;
      border-right: 1px solid var(--border); outline: none;
    }
    .ac-list:focus-visible { box-shadow: inset 0 0 0 2px var(--ring); border-radius: 6px; }
    .ac-grp {
      font-family: var(--font-mono); font-size: .66rem; letter-spacing: .12em;
      text-transform: uppercase; color: var(--text-3);
      padding: .7rem .6rem .3rem; position: sticky; top: 0;
      background: var(--bg-2); z-index: 1;
    }
    .ac-row {
      display: flex; align-items: center; gap: .6rem; width: 100%;
      padding: .4rem .55rem; border-radius: 6px; text-align: left;
      color: var(--text-2); transition: background .12s var(--ease);
    }
    .ac-row.sel { background: color-mix(in oklab, var(--accent) 16%, transparent); color: var(--text); }
    .ac-name {
      font-family: var(--font-mono); font-size: .84rem; color: var(--text);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .ac-meta { margin-left: auto; font-size: .7rem; color: var(--text-3); white-space: nowrap; flex: none; }

    .ac-ico {
      flex: none; display: grid; place-items: center;
      width: 18px; height: 18px; border-radius: 5px;
      font-family: var(--font-mono); font-size: .66rem; font-weight: 700;
      color: var(--bg); background: var(--lav);
    }
    .ac-ico[data-kind='class'] { background: var(--amber); }
    .ac-ico[data-kind='field'] { background: var(--blue); }
    .ac-ico[data-kind='variable'] { background: var(--teal); }
    .ac-ico[data-kind='interface'] { background: var(--green); }
    .ac-ico[data-kind='event'] { background: var(--coral); }
    .ac-ico[data-kind='snippet'] { background: var(--amber); }
    .ac-ico.big { width: 30px; height: 30px; border-radius: 8px; font-size: .95rem; }

    .ac-doc { padding: 1.1rem 1.2rem; display: flex; flex-direction: column; gap: .7rem; }
    .ac-doc-head { display: flex; align-items: center; gap: .7rem; }
    .ac-doc-name { font-family: var(--font-mono); font-weight: 600; font-size: 1rem; color: var(--text); }
    .ac-doc-kind { font-size: .72rem; color: var(--text-3); }
    .ac-sig {
      font-size: .82rem; padding: .55rem .7rem; border-radius: 8px;
      background: var(--bg-inset); border: 1px solid var(--border-soft);
      white-space: nowrap; overflow-x: auto;
    }
    .ac-note { color: var(--text-2); font-size: .92rem; line-height: 1.55; }

    .ac-hint { margin-top: 1rem; font-size: .78rem; }

    @media (max-width: 720px) {
      .ac-widget { grid-template-columns: 1fr; }
      .ac-list { max-height: 260px; border-right: none; border-bottom: 1px solid var(--border); }
    }
  `],
})
export class SkillsComponent {
  private host = inject(ElementRef<HTMLElement>);

  readonly rows: Row[] = SKILLS.flatMap((g) =>
    g.items.map((it, idx) => ({
      ...it,
      group: g.group,
      kind: g.kind,
      glyph: KIND[g.kind].glyph,
      kindLabel: KIND[g.kind].label,
      first: idx === 0,
    })),
  );

  readonly index = signal(0);
  readonly selected = computed(() => this.rows[this.index()]);

  onKey(ev: KeyboardEvent): void {
    const last = this.rows.length - 1;
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
