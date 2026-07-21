import {
  Component, signal, computed, ElementRef, inject, AfterViewInit, OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../directives/reveal.directive';
import { SectionHeaderComponent } from '../components/section-header.component';
import { ResumeService } from '../core/resume.service';
import { highlightSql, SqlToken } from '../utils/sql-highlight';
import { yearsBetween } from '../utils/duration';

interface QueryDef {
  id: string;
  label: string;
  sql: SqlToken[][];
  columns: string[];
  align: ('l' | 'r')[];
  rows: string[][];
}

@Component({
  selector: 'app-query-console',
  standalone: true,
  imports: [CommonModule, RevealDirective, SectionHeaderComponent],
  template: `
    <section id="query" class="wrap">
      <app-section-header id="query" appReveal />

      <div class="sql" appReveal [revealDelay]="80">
        <div class="sql-top">
          <div class="tabs" role="tablist" aria-label="Saved queries">
            @for (query of queries; track query.id; let i = $index) {
              <button class="qtab mono" role="tab" [class.on]="active() === i"
                      [attr.aria-selected]="active() === i" (click)="select(i)">
                {{ query.label }}
              </button>
            }
          </div>
          <button class="run mono" (click)="run()" [disabled]="running()">
            <span class="tri" aria-hidden="true">▶</span> Run
          </button>
        </div>

        <!-- editor -->
        <div class="editor mono">
          @for (line of q().sql; track $index; let li = $index) {
            <div class="cline">
              <span class="ln">{{ li + 1 }}</span>
              <span class="src">@for (t of line; track $index) {<span [class]="t.c">{{ t.t }}</span>}</span>
            </div>
          }
        </div>

        <!-- result -->
        <div class="result">
          @if (running()) {
            <div class="running mono"><span class="spin" aria-hidden="true"></span> executing on career.db…</div>
          } @else {
            <div class="grid">
              <table>
                <thead>
                  <tr>@for (c of q().columns; track c; let ci = $index) {
                    <th [class.r]="q().align[ci] === 'r'">{{ c }}</th>}</tr>
                </thead>
                <tbody>
                  @for (row of q().rows; track $index; let ri = $index) {
                    <tr class="rrow" [style.animation-delay.ms]="ri * 55">
                      @for (cell of row; track $index; let ci = $index) {
                        <td [class.r]="q().align[ci] === 'r'"
                            [class.first]="ci === 0">{{ cell }}</td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <p class="rfoot mono">
              <span class="tok-com">-- {{ q().rows.length }} row{{ q().rows.length === 1 ? '' : 's' }} in set · {{ ms() }} ms</span>
            </p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .sql {
      border: 1px solid var(--border); border-radius: 14px; overflow: hidden;
      background: var(--bg-2); box-shadow: var(--shadow-1);
    }
    .sql-top {
      display: flex; align-items: center; gap: .6rem; flex-wrap: wrap;
      padding: .6rem .7rem; border-bottom: 1px solid var(--border); background: var(--bg-3);
    }
    .tabs { display: flex; gap: .35rem; flex-wrap: wrap; }
    .qtab {
      font-size: .76rem; color: var(--text-2); padding: .28rem .7rem;
      border-radius: 7px; border: 1px solid transparent;
      transition: color .18s var(--ease), background .18s var(--ease), border-color .18s var(--ease);
    }
    .qtab:hover { color: var(--text); background: var(--bg-inset); }
    .qtab.on {
      color: var(--accent); background: color-mix(in oklab, var(--accent) 12%, transparent);
      border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
    }
    .run {
      margin-left: auto; display: inline-flex; align-items: center; gap: .4rem;
      font-size: .78rem; font-weight: 600; color: var(--accent-contrast);
      background: var(--accent); padding: .35rem .8rem; border-radius: 7px;
      transition: transform .2s var(--ease-out), opacity .2s var(--ease);
    }
    .run:hover { transform: translateY(-1px); }
    .run:disabled { opacity: .5; }
    .run .tri { font-size: .62rem; }

    /* editor */
    .editor {
      padding: .9rem 0; font-size: clamp(.78rem, 1.5vw, .9rem); line-height: 1.85;
      background: var(--bg-inset); border-bottom: 1px solid var(--border); overflow-x: auto;
    }
    .cline { display: flex; white-space: pre; }
    .ln {
      flex: none; width: 2.6rem; text-align: right; padding-right: 1rem;
      color: var(--text-3); opacity: .55; user-select: none;
    }
    .src { white-space: pre; }
    .tok-id { color: var(--text); }
    .tok-op { color: var(--text-3); }

    /* result */
    .result { padding: .5rem .2rem .3rem; }
    .running {
      display: flex; align-items: center; gap: .6rem; padding: 1.3rem 1rem;
      color: var(--text-2); font-size: .85rem;
    }
    .spin {
      width: 13px; height: 13px; border-radius: 50%;
      border: 2px solid var(--border); border-top-color: var(--accent);
      animation: spin-slow .7s linear infinite;
    }

    .grid { overflow-x: auto; padding: .3rem .3rem 0; }
    table { border-collapse: collapse; width: 100%; font-family: var(--font-mono); font-size: .82rem; }
    thead th {
      text-align: left; padding: .5rem .9rem; color: var(--teal);
      font-weight: 600; border-bottom: 1px solid var(--border); white-space: nowrap;
    }
    th.r, td.r { text-align: right; }
    tbody td {
      padding: .5rem .9rem; color: var(--text-2);
      border-bottom: 1px solid var(--border-soft); white-space: nowrap;
    }
    td.first { color: var(--text); font-weight: 500; }
    .rrow { opacity: 0; animation: rowin .45s var(--ease-out) forwards; }
    @keyframes rowin { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    tbody tr:hover td { background: color-mix(in oklab, var(--accent) 7%, transparent); }

    .rfoot { padding: .7rem .9rem .3rem; font-size: .76rem; }

    @media (prefers-reduced-motion: reduce) {
      .rrow { opacity: 1; animation: none; }
      .pulse, .spin { animation: none; }
    }
  `],
})
export class QueryConsoleComponent implements AfterViewInit, OnDestroy {
  private host = inject(ElementRef<HTMLElement>);
  private resume = inject(ResumeService);

  readonly queries: QueryDef[] = [
    {
      id: 'experience',
      label: 'experience',
      sql: highlightSql(
        "SELECT company, role, years, stack\n" +
        "FROM   career.experience\n" +
        "WHERE  'C#' = ANY(stack)\n" +
        "ORDER  BY start_date DESC;",
      ),
      columns: ['company', 'role', 'years', 'stack'],
      align: ['l', 'l', 'r', 'l'],
      rows: this.resume.roles.map((r) => [
        r.company,
        r.title.replace(/^.*\((.*)\).*$/, '$1'),
        yearsBetween(r.from, r.to),
        r.stack.slice(0, 3).join(', '),
      ]),
    },
    {
      id: 'projects',
      label: 'projects',
      sql: highlightSql(
        "SELECT name, type, tech\n" +
        "FROM   career.projects\n" +
        "ORDER  BY featured DESC;",
      ),
      columns: ['name', 'type', 'tech'],
      align: ['l', 'l', 'l'],
      rows: this.resume.projects.map((p) => [p.name, p.kind, p.tags.slice(0, 3).join(', ')]),
    },
    {
      id: 'stack',
      label: 'stack',
      sql: highlightSql(
        "SELECT category, COUNT(*) AS skills\n" +
        "FROM   career.skills\n" +
        "GROUP  BY category\n" +
        "ORDER  BY skills DESC;",
      ),
      columns: ['category', 'skills'],
      align: ['l', 'r'],
      rows: this.resume.skills
        .map((g) => [g.short, String(g.items.length)])
        .sort((a, b) => Number(b[1]) - Number(a[1])),
    },
  ];

  readonly active = signal(0);
  readonly running = signal(false);
  readonly ms = signal('0.6');
  readonly q = computed(() => this.queries[this.active()]);

  private timer?: ReturnType<typeof setTimeout>;
  private observer?: IntersectionObserver;
  private hasAutoRun = false;

  select(i: number): void {
    if (i === this.active()) { this.run(); return; }
    this.active.set(i);
    this.run();
  }

  run(): void {
    clearTimeout(this.timer);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.ms.set((0.4 + Math.random() * 1.5).toFixed(1));
    if (reduce) { this.running.set(false); return; }
    this.running.set(true);
    this.timer = setTimeout(() => this.running.set(false), 430);
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !this.hasAutoRun) {
            this.hasAutoRun = true;
            this.run();
            this.observer?.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    this.observer?.disconnect();
  }
}
