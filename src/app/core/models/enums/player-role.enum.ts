export enum PlayerRole {
  Batsman = 'BATSMAN',
  Bowler = 'BOWLER',
  AllRounder = 'ALL_ROUNDER',
  WicketKeeper = 'WICKET_KEEPER',
}

export const PLAYER_ROLE_LABELS: Record<PlayerRole, string> = {
  [PlayerRole.Batsman]: 'Batsman',
  [PlayerRole.Bowler]: 'Bowler',
  [PlayerRole.AllRounder]: 'All-Rounder',
  [PlayerRole.WicketKeeper]: 'Wicket-Keeper',
};
