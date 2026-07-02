import { PlayerCategory } from './enums/player-category.enum';
import { PlayerGender } from './enums/player-gender.enum';
import { PlayerRole } from './enums/player-role.enum';
import { PlayerStatus } from './enums/player-status.enum';

export interface Player {
  id: string;
  serialNo: number;
  name: string;
  photoUrl: string | null;
  gender: PlayerGender;
  role: PlayerRole;
  category: PlayerCategory;
  basePrice: number;
  skillRating: number;
  isMarquee: boolean;
  battingStyle: string | null;
  bowlingStyle: string | null;
  status: PlayerStatus;
  soldPrice: number | null;
  soldToTeamId: string | null;
}

export type PlayerDraft = Omit<
  Player,
  'id' | 'serialNo' | 'status' | 'soldPrice' | 'soldToTeamId'
>;
