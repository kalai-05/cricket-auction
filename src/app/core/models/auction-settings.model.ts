export interface AuctionSettings {
  schemaVersion: number;
  totalCreditsPerTeam: number;
  teamCount: number;
  maxBoys: number;
  maxGirls: number;
  /** Base price applied to new players unless overridden per player. */
  defaultBasePrice: number;
  /** Auctioneer-selectable bid raise amounts. */
  bidIncrements: number[];
  /** Countdown per player; a new bid restarts it. 0 disables via timerEnabled. */
  timerEnabled: boolean;
  bidTimerSeconds: number;
}

export const DEFAULT_AUCTION_SETTINGS: AuctionSettings = {
  schemaVersion: 2,
  totalCreditsPerTeam: 100,
  teamCount: 4,
  maxBoys: 9,
  maxGirls: 5,
  defaultBasePrice: 5,
  bidIncrements: [1, 5, 10],
  timerEnabled: true,
  bidTimerSeconds: 10,
};
