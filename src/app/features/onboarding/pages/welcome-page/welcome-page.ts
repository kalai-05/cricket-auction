import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { GlassPanelDirective } from '../../../../shared/directives/glass-panel.directive';

@Component({
  selector: 'app-welcome-page',
  imports: [MatButtonModule, MatIconModule, RouterLink, GlassPanelDirective],
  templateUrl: './welcome-page.html',
  styleUrl: './welcome-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePage {}
