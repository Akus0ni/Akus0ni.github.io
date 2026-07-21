import {
  Component, Input, OnInit, OnDestroy, signal, ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-typewriter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="tw">{{ text() }}<span class="caret" aria-hidden="true"></span></span>`,
  styles: [`
    .tw { font-family: var(--font-mono); }
    .caret {
      display: inline-block; width: .62ch; height: 1.05em; margin-left: 2px;
      transform: translateY(2px); background: var(--accent);
      animation: blink 1s steps(1) infinite;
    }
    @media (prefers-reduced-motion: reduce) { .caret { animation: none; } }
  `],
})
export class TypewriterComponent implements OnInit, OnDestroy {
  @Input({ required: true }) phrases: string[] = [];
  readonly text = signal('');

  private timer?: ReturnType<typeof setTimeout>;
  private phrase = 0;
  private char = 0;
  private deleting = false;

  ngOnInit(): void {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { this.text.set(this.phrases[0] ?? ''); return; }
    this.tick();
  }

  ngOnDestroy(): void { clearTimeout(this.timer); }

  private tick(): void {
    const current = this.phrases[this.phrase] ?? '';
    if (!this.deleting) {
      this.char++;
      this.text.set(current.slice(0, this.char));
      if (this.char === current.length) {
        this.deleting = true;
        this.timer = setTimeout(() => this.tick(), 1500);
        return;
      }
    } else {
      this.char--;
      this.text.set(current.slice(0, this.char));
      if (this.char === 0) {
        this.deleting = false;
        this.phrase = (this.phrase + 1) % this.phrases.length;
      }
    }
    this.timer = setTimeout(() => this.tick(), this.deleting ? 45 : 80);
  }
}
