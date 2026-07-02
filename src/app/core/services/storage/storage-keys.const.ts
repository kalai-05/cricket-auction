export const STORAGE_KEYS = {
  settings: 'settings',
  teams: 'teams',
  players: 'players',
  auctionState: 'auction-state',
} as const;

export const ALL_STORAGE_KEYS = Object.values(STORAGE_KEYS);
