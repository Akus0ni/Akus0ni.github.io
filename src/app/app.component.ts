import {
  Component, signal, inject, AfterViewInit, OnDestroy, HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { HeroComponent } from './sections/hero.component';
import { AboutComponent } from './sections/about.component';
import { ExperienceComponent } from './sections/experience.component';
import { ProjectsComponent } from './sections/projects.component';
import { SkillsComponent } from './sections/skills.component';
import { EducationComponent } from './sections/education.component';
import { ContactComponent } from './sections/contact.component';
import { LINKS } from './data/resume';

interface NavItem { id: string; label: string; file: string; icon: string; }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, HeroComponent, AboutComponent, ExperienceComponent,
    ProjectsComponent, SkillsComponent, EducationComponent, ContactComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private themeSvc = inject(ThemeService);
  readonly theme = this.themeSvc.theme;
  readonly links = LINKS;

  readonly active = signal('home');
  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);
  readonly year = new Date().getFullYear();
  readonly ngVersion = '19';

  readonly nav: NavItem[] = [
    { id: 'home',       label: 'home',       file: 'home.tsx',        icon: 'M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5' },
    { id: 'about',      label: 'about',      file: 'README.md',       icon: 'M6 3h9l3 3v15H6zM14 3v4h4' },
    { id: 'experience', label: 'experience', file: 'git.log',         icon: 'M6 3v12a3 3 0 0 0 3 3h6M6 3a2 2 0 1 0 .01 0M15 18a2 2 0 1 0 .01 0' },
    { id: 'projects',   label: 'projects',   file: 'projects/',       icon: 'M3 7l2-3h5l2 3h7v12H3z' },
    { id: 'skills',     label: 'skills',     file: 'Akash.csproj',    icon: 'M9 6l-5 6 5 6M15 6l5 6-5 6' },
    { id: 'education',  label: 'education',   file: 'certs/',          icon: 'M12 4 2 9l10 5 10-5zM6 12v5c0 1 3 3 6 3s6-2 6-3v-5' },
    { id: 'contact',    label: 'contact',    file: 'contact.sh',      icon: 'M4 5h16v14H4zM4 7l8 6 8-6' },
  ];

  private observer?: IntersectionObserver;

  toggleTheme(): void { this.themeSvc.toggle(); }
  toggleMenu(): void { this.menuOpen.update((v) => !v); }

  go(id: string, ev?: Event): void {
    ev?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.menuOpen.set(false);
  }

  activeFile(): string {
    return this.nav.find((n) => n.id === this.active())?.file ?? 'home.tsx';
  }

  @HostListener('window:scroll')
  onScroll(): void { this.scrolled.set(window.scrollY > 20); }

  ngAfterViewInit(): void {
    const sections = this.nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) this.active.set(e.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    sections.forEach((s) => this.observer!.observe(s));
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }
}
