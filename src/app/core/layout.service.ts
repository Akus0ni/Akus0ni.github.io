import { Injectable, computed, inject, signal } from '@angular/core';
import { SectionService } from './section.service';
import { ScrollSpyService } from './scroll-spy.service';

/**
 * Shell-level UI state shared across the layout chrome (top bar, explorer rail,
 * status bar). Kept in a service — rather than passed through inputs/outputs —
 * so each chrome component can inject exactly what it needs, matching the
 * signal-service pattern used by ThemeService / ScrollSpyService.
 */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private sections = inject(SectionService);
  private scrollSpy = inject(ScrollSpyService);

  /** Mobile explorer-rail open/closed — toggled by the top-bar burger, the rail, the scrim. */
  readonly menuOpen = signal(false);

  /** `navFile` of the section currently in view — drives the breadcrumb + status bar. */
  readonly activeFile = computed(() =>
    this.sections.sections.find((n) => n.id === this.scrollSpy.activeId())?.navFile ?? 'home.tsx',
  );

  toggleMenu(): void { this.menuOpen.update((v) => !v); }
  closeMenu(): void { this.menuOpen.set(false); }
}
