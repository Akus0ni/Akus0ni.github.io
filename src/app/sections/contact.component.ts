import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../directives/reveal.directive';
import { SectionHeaderComponent } from '../components/section-header.component';
import { WindowDotsComponent } from '../components/window-dots.component';
import { ResumeService } from '../core/resume.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RevealDirective, SectionHeaderComponent, WindowDotsComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private resume = inject(ResumeService);
  readonly links = this.resume.links;
  readonly profile = this.resume.profile;
}
