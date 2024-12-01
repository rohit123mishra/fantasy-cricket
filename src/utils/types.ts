// src/utils/types.ts

export type MatchFormat = 'T20' | 'ODI' | 'TEST' | 'T10' | 'THE_HUNDRED';
export type RankingFormat = 'T20' | 'ODI' | 'TEST';
export type MatchResult = 'W' | 'L' | 'T';

export interface TeamRecord {
  matches: number;
  wins: number;
  losses: number;
  draws?: number;
  winPercentage: number;
}

export interface FormatStats {
  matches: number;
  wins: number;
  losses: number;
  draws?: number;
  winPercentage: number;
  highestScore: string;
  lowestScore: string;
  averageScoreFor: number;
  averageScoreAgainst: number;
}

export interface HeadToHead {
  opponent: string;
  played: number;
  won: number;
  lost: number;
  drawn?: number;
  lastFive: MatchResult[];
  lastMatch: {
    date: string;
    result: string;
    venue: string;
  };
}



export interface MatchPerformanceDetails {
  batting: {
    totalScore: number;
    wickets: number;
    overs: number;
    runRate: number;
  };
  bowling: {
    totalScore: number;
    wickets: number;
    overs: number;
    runRate: number;
  };
}

export interface MatchPerformance {
  matchId: string;
  opponent: string;
  result: MatchResult;
  score: string;
  date: string;
  venue: string;
  format: MatchFormat;
  matchDetails: MatchPerformanceDetails;
}



export interface TeamStats {
  teamName: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws?: number;
  winPercentage: number;
  headToHead: HeadToHead[];
  lastTenPerformances: MatchPerformance[];
  formatWiseStats: { [key in MatchFormat]: FormatStats };
  homeRecord: TeamRecord;
  awayRecord: TeamRecord;
  currentForm: string;
  ranking: { [key in RankingFormat]: number };
}

export interface Player {
  id: string;
  name: string;
  team: string;
  role: PlayerRole;
  playingStyle: PlayingStyle;
  credit: number;
  isPlaying11: boolean;
  statistics: PlayerStatistics;
}

export type PlayerRole = 'WK' | 'BAT' | 'BOWL' | 'ALL';

export interface PlayingStyle {
  batting: 'Left Hand' | 'Right Hand';
  bowling: 'Fast' | 'Spin' | 'Medium' | null;
}

export interface BattingStats {
  last10Matches: {
    totalRuns: number;
    inningsPlayed: number;
    notOuts: number;
    centuries: number;
    halfCenturies: number;
    thirties: number;
    fours: number;
    sixes: number;
    battingPositions: Array<{
      position: number;
      matches: number;
      runs: number;
    }>;
    strikeRate: number;
  };
  situational: {
    firstInnings: { average: number; strikeRate: number; };
    secondInnings: { average: number; strikeRate: number; };
    powerplay: { average: number; strikeRate: number; };
    death: { average: number; strikeRate: number; };
  };
}

export interface BowlingStats {
  last10Matches: {
    wickets: number;
    threeWickets: number;
    fourWickets: number;
    fiveWickets: number;
    bestBowling: { wickets: number; runs: number; overs: number; };
    economy: number;
    maidens: number;
  };
  situational: {
    powerplay: { wickets: number; economy: number; };
    death: { wickets: number; economy: number; };
  };
}

export interface PlayerStatistics {
  batting: BattingStats;
  bowling: BowlingStats;
  fielding: {
    catches: number;
    stumpings: number;
    runOuts: { direct: number; indirect: number; };
  };
  recentForm: Array<{
    matchId: string;
    runs: number;
    wickets: number;
    catches: number;
    stumpings: number;
    date: string;
  }>;
}

export interface Match {
  id: string;
  team1: string;
  team2: string;
  format: MatchFormat;
  venue: string;
  date: string;
  status: 'upcoming' | 'live' | 'completed';
  players: {
    team1: string[];
    team2: string[];
  };
}