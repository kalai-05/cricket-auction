import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuctionFacade } from '../../../../core/facades/auction.facade';
import { PlayerFacade } from '../../../../core/facades/player.facade';
import { TeamFacade } from '../../../../core/facades/team.facade';
import { ExportService } from '../../../../core/services/export/export.service';
import { SoundEffectsService } from '../../../../core/services/audio/sound-effects.service';
import { SettingsStore } from '../../../../core/state/settings.store';
import { UiStore } from '../../../../core/state/ui.store';
import { GlassPanelDirective } from '../../../../shared/directives/glass-panel.directive';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-settings-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSliderModule,
    MatSlideToggleModule,
    GlassPanelDirective,
  ],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  private readonly fb = inject(FormBuilder);
  readonly settingsStore = inject(SettingsStore);
  private readonly auctionFacade = inject(AuctionFacade);
  private readonly teamFacade = inject(TeamFacade);
  private readonly playerFacade = inject(PlayerFacade);
  private readonly exportService = inject(ExportService);
  private readonly dialog = inject(MatDialog);
  private readonly uiStore = inject(UiStore);
  readonly soundEffects = inject(SoundEffectsService);

  readonly form = this.fb.group({
    totalCreditsPerTeam: [this.settingsStore.settings().totalCreditsPerTeam, [Validators.required, Validators.min(1)]],
    maxBoys: [this.settingsStore.settings().maxBoys, [Validators.required, Validators.min(1)]],
    maxGirls: [this.settingsStore.settings().maxGirls, [Validators.required, Validators.min(1)]],
    teamCount: [this.settingsStore.settings().teamCount, [Validators.required, Validators.min(2)]],
    defaultBasePrice: [this.settingsStore.settings().defaultBasePrice, [Validators.required, Validators.min(0.5)]],
    bidTimerSeconds: [this.settingsStore.settings().bidTimerSeconds, [Validators.required, Validators.min(3)]],
  });

  saveSettings(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.settingsStore.update(this.form.getRawValue() as Record<string, number>);
    this.uiStore.showToast('Settings saved. New values apply to teams created from now on.', 'success');
  }

  toggleTimer(enabled: boolean): void {
    this.settingsStore.update({ timerEnabled: enabled });
  }

  setVolume(value: number): void {
    this.soundEffects.setVolume(value);
  }

  exportBackup(): void {
    this.exportService.exportFullBackup();
  }

  async importBackup(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    await this.exportService.importFullBackup(file);
  }

  exportRosters(): void {
    this.exportService.exportTeamRostersCsv(this.teamFacade.teams(), this.playerFacade.players());
  }

  exportRostersExcel(): void {
    this.exportService.exportTeamRostersExcel(this.teamFacade.teams(), this.playerFacade.players());
  }

  print(): void {
    this.exportService.triggerPrint();
  }

  confirmResetAuction(): void {
    this.openConfirm(
      {
        title: 'Reset Auction?',
        message:
          'This returns every player to Available and refunds all teams, but keeps your teams and player pool. This cannot be undone.',
        confirmText: 'Reset Auction',
        danger: true,
      },
      () => this.auctionFacade.resetAuction(),
    );
  }

  confirmResetEverything(): void {
    this.openConfirm(
      {
        title: 'Start a New Tournament?',
        message: 'This permanently deletes all teams, players, settings and auction history. This cannot be undone.',
        confirmText: 'Delete Everything',
        danger: true,
      },
      () => this.auctionFacade.resetEverything(),
    );
  }

  private openConfirm(data: ConfirmDialogData, onConfirm: () => void): void {
    this.dialog
      .open(ConfirmDialog, { data })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) onConfirm();
      });
  }
}
