import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { PlayerFacade } from '../../../../core/facades/player.facade';
import {
  PLAYER_CATEGORY_LABELS,
  PlayerCategory,
} from '../../../../core/models/enums/player-category.enum';
import { PLAYER_GENDER_LABELS, PlayerGender } from '../../../../core/models/enums/player-gender.enum';
import { PLAYER_ROLE_LABELS, PlayerRole } from '../../../../core/models/enums/player-role.enum';
import { PlayerDraft } from '../../../../core/models/player.model';
import { SettingsStore } from '../../../../core/state/settings.store';
import { UiStore } from '../../../../core/state/ui.store';
import { GlassPanelDirective } from '../../../../shared/directives/glass-panel.directive';
import { PlayerAvatar } from '../../../../shared/components/player-avatar/player-avatar';

@Component({
  selector: 'app-player-pool-import-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTabsModule,
    GlassPanelDirective,
    PlayerAvatar,
  ],
  templateUrl: './player-pool-import-page.html',
  styleUrl: './player-pool-import-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerPoolImportPage {
  private readonly fb = inject(FormBuilder);
  readonly playerFacade = inject(PlayerFacade);
  private readonly settingsStore = inject(SettingsStore);
  private readonly uiStore = inject(UiStore);
  private readonly router = inject(Router);

  readonly genders = Object.values(PlayerGender);
  readonly roles = Object.values(PlayerRole);
  readonly categories = Object.values(PlayerCategory);
  readonly genderLabels = PLAYER_GENDER_LABELS;
  readonly roleLabels = PLAYER_ROLE_LABELS;
  readonly categoryLabels = PLAYER_CATEGORY_LABELS;

  readonly jsonError = signal<string | null>(null);
  readonly jsonText = signal('');

  private readonly defaultBasePrice = this.settingsStore.settings().defaultBasePrice;

  readonly quickAddForm = this.fb.group({
    name: ['', Validators.required],
    gender: [PlayerGender.Boy, Validators.required],
    role: [PlayerRole.Batsman, Validators.required],
    category: [PlayerCategory.B, Validators.required],
    basePrice: [this.defaultBasePrice, [Validators.required, Validators.min(0.5)]],
    skillRating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    photoUrl: [''],
  });

  addPlayer(): void {
    if (this.quickAddForm.invalid) {
      this.quickAddForm.markAllAsTouched();
      return;
    }

    const value = this.quickAddForm.getRawValue();
    const name = value.name!.trim();

    if (this.playerFacade.hasPlayerNamed(name)) {
      this.uiStore.showToast(`"${name}" is already in the pool.`, 'warning');
      return;
    }

    const draft: PlayerDraft = {
      name,
      gender: value.gender!,
      role: value.role!,
      category: value.category!,
      basePrice: Number(value.basePrice),
      skillRating: Number(value.skillRating),
      isMarquee: value.category === PlayerCategory.Star,
      battingStyle: null,
      bowlingStyle: null,
      photoUrl: value.photoUrl || null,
    };

    this.playerFacade.importPlayers([draft]);
    this.quickAddForm.patchValue({ name: '', photoUrl: '' });
  }

  removePlayer(id: string): void {
    this.playerFacade.removePlayer(id);
  }

  importJson(): void {
    this.jsonError.set(null);
    try {
      const parsed = JSON.parse(this.jsonText()) as Partial<PlayerDraft>[];
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of players.');
      }
      const drafts: PlayerDraft[] = parsed.map((entry, index) => {
        if (!entry.name || !entry.gender || !entry.role) {
          throw new Error(`Entry ${index + 1} is missing name, gender, or role.`);
        }
        const category = entry.category ?? PlayerCategory.B;
        return {
          name: entry.name,
          gender: entry.gender,
          role: entry.role,
          category,
          basePrice: entry.basePrice ?? this.defaultBasePrice,
          skillRating: entry.skillRating ?? 3,
          isMarquee: entry.isMarquee ?? category === PlayerCategory.Star,
          battingStyle: entry.battingStyle ?? null,
          bowlingStyle: entry.bowlingStyle ?? null,
          photoUrl: entry.photoUrl ?? null,
        };
      });
      const added = this.playerFacade.importPlayers(drafts);
      const skipped = drafts.length - added;
      if (skipped > 0) {
        this.uiStore.showToast(`${skipped} duplicate player(s) skipped.`, 'warning');
      }
      this.jsonText.set('');
    } catch (err) {
      this.jsonError.set(err instanceof Error ? err.message : 'Invalid JSON.');
    }
  }

  finish(): void {
    this.router.navigate(['/auction']);
  }
}
