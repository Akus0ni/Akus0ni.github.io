import { Component } from '@angular/core';

/** The three macOS-style window "traffic light" dots used in editor/terminal chrome. */
@Component({
  selector: 'app-window-dots',
  standalone: true,
  template: `<span class="d r"></span><span class="d y"></span><span class="d g"></span>`,
  styles: [`
    :host { display: inline-flex; gap: .45rem; }
    .d { width: 11px; height: 11px; border-radius: 50%; }
    .r { background: #ff5f57; }
    .y { background: #febc2e; }
    .g { background: #28c840; }
  `],
})
export class WindowDotsComponent {}
