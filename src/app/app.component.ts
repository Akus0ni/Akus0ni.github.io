import { Component, inject, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { ResumeService } from './core/resume.service';
import { SectionService } from './core/section.service';
import { ScrollSpyService } from './core/scroll-spy.service';
import { HeroComponent } from './sections/hero.component';
import { AboutComponent } from './sections/about.component';
import { ExperienceComponent } from './sections/experience.component';
import { ProjectsComponent } from './sections/projects.component';
import { QueryConsoleComponent } from './sections/query-console.component';
import { SkillsComponent } from './sections/skills.component';
import { EducationComponent } from './sections/education.component';
import { ContactComponent } from './sections/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, HeroComponent, AboutComponent, ExperienceComponent,
    ProjectsComponent, QueryConsoleComponent, SkillsComponent,
    EducationComponent, ContactComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  private themeSvc = inject(ThemeService);
  private sections = inject(SectionService);
  private scrollSpy = inject(ScrollSpyService);
  private resume = inject(ResumeService);

  readonly theme = this.themeSvc.theme;
  readonly links = this.resume.links;
  readonly profile = this.resume.profile;
  readonly nav = this.sections.sections;

  readonly active = this.scrollSpy.activeId;
  readonly scrolled = this.scrollSpy.scrolled;
  readonly menuOpen = signal(false);
  readonly year = new Date().getFullYear();
  readonly ngVersion = '19';

  toggleTheme(): void { this.themeSvc.toggle(); }
  toggleMenu(): void { this.menuOpen.update((v) => !v); }

  go(id: string, ev?: Event): void {
    ev?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.menuOpen.set(false);
  }

  activeFile(): string {
    return this.nav.find((n) => n.id === this.active())?.navFile ?? 'home.tsx';
  }

  ngAfterViewInit(): void {
    this.scrollSpy.init(this.sections.ids());
  }
}
