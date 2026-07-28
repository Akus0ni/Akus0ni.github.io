import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../directives/reveal.directive';
import { SectionHeaderComponent } from '../components/section-header.component';
import { ResumeService } from '../core/resume.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RevealDirective, SectionHeaderComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  private resume = inject(ResumeService);
  readonly stats = this.resume.stats;
}
