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
  templateUrl: './query-console.component.html',
  styleUrl: './query-console.component.scss',
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
