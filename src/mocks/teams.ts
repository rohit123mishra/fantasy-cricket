// src/mocks/teams.ts

import { 
  TeamStats, 
  MatchFormat, 
  FormatStats, 
  HeadToHead,
  MatchPerformance 
} from '../utils/types';
import { mockMatches } from './matches';

const generateFormatStats = (
  baseMatches: number,
  winRate: number = 0.6
): FormatStats => {
  const wins = Math.floor(baseMatches * winRate);
  const losses = Math.floor(baseMatches * (1 - winRate) * 0.8);
  const draws = baseMatches - wins - losses;

  return {
    matches: baseMatches,
    wins,
    losses,
    draws,
    winPercentage: (wins / baseMatches) * 100,
    highestScore: `${Math.floor(Math.random() * 100) + 200}/${Math.floor(Math.random() * 10)}`,
    lowestScore: `${Math.floor(Math.random() * 100) + 100}/${Math.floor(Math.random() * 10)}`,
    averageScoreFor: Math.floor(Math.random() * 50) + 150,
    averageScoreAgainst: Math.floor(Math.random() * 50) + 140
  };
};

const generateHeadToHead = (
  opponent: string,
  matches: number,
  winRate: number = 0.55
): HeadToHead => {
  const won = Math.floor(matches * winRate);
  const lost = Math.floor(matches * (1 - winRate));
  const drawn = matches - won - lost;
  
  // Generate last five results
  const generateResult = () => Math.random() > (1 - winRate) ? 'W' : 'L';
  const lastFive = Array.from({ length: 5 }, () => generateResult() as 'W' | 'L' | 'T');

  return {
    opponent,
    played: matches,
    won,
    lost,
    drawn,
    lastFive,
    lastMatch: {
      date: new Date().toISOString().split('T')[0],
      result: `Won by ${Math.floor(Math.random() * 100)} runs`,
      venue: 'Sample Venue'
    }
  };
};

// Generate full team statistics
const generateTeamStats = (
  teamName: string,
  baseMatches: number = 150,
  baseWinRate: number = 0.65
): TeamStats => {
  const wins = Math.floor(baseMatches * baseWinRate);
  const losses = Math.floor(baseMatches * (1 - baseWinRate) * 0.8);
  const draws = baseMatches - wins - losses;

  return {
    teamName,
    matchesPlayed: baseMatches,
    wins,
    losses,
    draws,
    winPercentage: (wins / baseMatches) * 100,
    ranking: {
      T20: Math.floor(Math.random() * 10) + 1,
      ODI: Math.floor(Math.random() * 10) + 1,
      TEST: Math.floor(Math.random() * 10) + 1
    },
    headToHead: [
      generateHeadToHead('Australia', 45, 0.55),
      generateHeadToHead('England', 42, 0.67),
      generateHeadToHead('South Africa', 38, 0.58),
      generateHeadToHead('New Zealand', 35, 0.60)
    ],
    lastTenPerformances: [], // This will be filled by the sync helper
    formatWiseStats: {
      T20: generateFormatStats(50, baseWinRate),
      ODI: generateFormatStats(60, baseWinRate),
      TEST: generateFormatStats(40, baseWinRate),
      T10: generateFormatStats(30, baseWinRate), // Added T10 format
      THE_HUNDRED: generateFormatStats(25, baseWinRate) // Added THE_HUNDRED format
    },
    homeRecord: {
      matches: Math.floor(baseMatches / 2),
      wins: Math.floor(wins * 0.6),
      losses: Math.floor(losses * 0.4),
      draws: Math.floor(draws / 2),
      winPercentage: 73.33
    },
    awayRecord: {
      matches: Math.floor(baseMatches / 2),
      wins: Math.floor(wins * 0.4),
      losses: Math.floor(losses * 0.6),
      draws: Math.floor(draws / 2),
      winPercentage: 57.33
    },
    currentForm: 'WWLWW'
  };
};

// Create mock team stats for all teams
export const mockTeamStats: Record<string, TeamStats> = {
  'India': generateTeamStats('India', 150, 0.65),
  'Australia': generateTeamStats('Australia', 145, 0.63),
  'England': generateTeamStats('England', 140, 0.62),
  'South Africa': generateTeamStats('South Africa', 135, 0.60),
  'New Zealand': generateTeamStats('New Zealand', 130, 0.58),
  'Pakistan': generateTeamStats('Pakistan', 125, 0.57),
  'West Indies': generateTeamStats('West Indies', 120, 0.55),
  'Bangladesh': generateTeamStats('Bangladesh', 115, 0.52)
};

export const teamUtils = {
  generateTeamStats,
  generateFormatStats,
  generateHeadToHead,
  
  
  
  getHeadToHeadRecord: (team1: string, team2: string) => {
    const stats = mockTeamStats[team1];
    return stats?.headToHead.find(h => h.opponent === team2);
  },
  
  getCurrentForm: (team: string): string => {
    return mockTeamStats[team]?.currentForm || '';
  },
  
  getWinPercentage: (team: string, format: MatchFormat): number => {
    return mockTeamStats[team]?.formatWiseStats[format].winPercentage || 0;
  }
};