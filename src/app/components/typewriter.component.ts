import {
  Component, Input, OnInit, OnDestroy, signal, ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-typewriter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="tw">{{ text() }}<span class="blink-caret" aria-hidden="true"></span></span>`,
  styles: [`
    .tw { font-family: var(--font-mono); }
    /* caret is the shared global .blink-caret; nudge it away from the text */
    .blink-caret { margin-left: 2px; }
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
