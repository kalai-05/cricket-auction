import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PlayerFacade } from '../../../../core/facades/player.facade';
import {
  PLAYER_CATEGORY_LABELS,
  PlayerCategory,
} from '../../../../core/models/enums/player-category.enum';
import { PLAYER_GENDER_LABELS, PlayerGender } from '../../../../core/models/enums/player-gender.enum';
import { PLAYER_ROLE_LABELS, PlayerRole } from '../../../../core/models/enums/player-role.enum';
import { PlayerStatus } from '../../../../core/models/enums/player-status.enum';

@Component({
  selector: 'app-filter-panel',
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  templateUrl: './filter-panel.html',
  styleUrl: './filter-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanel {
  readonly playerFacade = inject(PlayerFacade);

  readonly roles = Object.values(PlayerRole);
  readonly genders = Object.values(PlayerGender);
  readonly statuses = Object.values(PlayerStatus);
  readonly categories = Object.values(PlayerCategory);
  readonly roleLabels = PLAYER_ROLE_LABELS;
  readonly genderLabels = PLAYER_GENDER_LABELS;
  readonly categoryLabels = PLAYER_CATEGORY_LABELS;

  setRole(role: PlayerRole | null): void {
    this.playerFacade.filterBy({ role });
  }

  setCategory(category: PlayerCategory | null): void {
    this.playerFacade.filterBy({ category });
  }

  setGender(gender: PlayerGender | null): void {
    this.playerFacade.filterBy({ gender });
  }

  setStatus(status: PlayerStatus | null): void {
    this.playerFacade.filterBy({ status });
  }

  clear(): void {
    this.playerFacade.clearFilters();
  }
}
