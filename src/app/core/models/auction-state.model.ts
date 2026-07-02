import { AuctionPhase } from './enums/auction-phase.enum';
import { Bid } from './bid.model';
import { SoldRecord } from './sold-record.model';

export interface AuctionState {
  phase: AuctionPhase;
  currentPlayerId: string | null;
  currentBidAmount: number;
  currentBiddingTeamId: string | null;
  currentBidTrail: Bid[];
  queue: string[];
  soldLog: SoldRecord[];
  startedAt: number | null;
}

export const INITIAL_AUCTION_STATE: AuctionState = {
  phase: AuctionPhase.NotStarted,
  currentPlayerId: null,
  currentBidAmount: 0,
  currentBiddingTeamId: null,
  currentBidTrail: [],
  queue: [],
  soldLog: [],
  startedAt: null,
};
