import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { TeamFacade } from '../../../../core/facades/team.facade';
import { SettingsStore } from '../../../../core/state/settings.store';
import { TeamDraft } from '../../../../core/models/team.model';
import { GlassPanelDirective } from '../../../../shared/directives/glass-panel.directive';

const SUGGESTED_COLORS = ['#d4af37', '#2e5eff', '#2ee6a8', '#ff4d6d', '#a78bfa', '#ff9f43'];

@Component({
  selector: 'app-team-setup-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    GlassPanelDirective,
  ],
  templateUrl: './team-setup-page.html',
  styleUrl: './team-setup-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamSetupPage {
  private readonly fb = inject(FormBuilder);
  private readonly teamFacade = inject(TeamFacade);
  private readonly settingsStore = inject(SettingsStore);
  private readonly router = inject(Router);

  readonly teamCount = this.settingsStore.settings().teamCount;

  readonly form = this.fb.group({
    teams: this.fb.array(
      Array.from({ length: this.teamCount }, (_, i) => this.buildTeamGroup(i)),
    ),
  });

  get teamControls(): FormGroup[] {
    return (this.form.get('teams') as FormArray).controls as FormGroup[];
  }

  private buildTeamGroup(index: number): FormGroup {
    const letter = String.fromCharCode(65 + index);
    return this.fb.group({
      name: [`Team ${letter}`, [Validators.required, Validators.maxLength(30)]],
      shortCode: [`T${letter}`, [Validators.required, Validators.maxLength(4)]],
      colorHex: [SUGGESTED_COLORS[index % SUGGESTED_COLORS.length], Validators.required],
      logoUrl: [''],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const drafts: TeamDraft[] = this.teamControls.map((group) => ({
      name: group.value.name,
      shortCode: group.value.shortCode,
      colorHex: group.value.colorHex,
      logoUrl: group.value.logoUrl || null,
    }));

    this.teamFacade.createTeams(drafts);
    this.router.navigate(['/setup/players']);
  }
}
