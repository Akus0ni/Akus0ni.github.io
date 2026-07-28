import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../directives/reveal.directive';
import { SectionHeaderComponent } from '../components/section-header.component';
import { ResumeService } from '../core/resume.service';
import { Project } from '../data/resume';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RevealDirective, SectionHeaderComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  private resume = inject(ResumeService);
  readonly projects: Project[] = this.resume.projects;

  onMove(e: PointerEvent): void {
    const el = (e.currentTarget as HTMLElement);
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }
}
