import { 
  Player, 
  Match, 
  TeamStats, 
  MatchFormat, 
  MatchPerformance,
  MatchPerformanceDetails 
} from './types';
import { mockPlayers } from '../mocks/players';
import { mockMatches } from '../mocks/matches';
import { mockTeamStats } from '../mocks/teams';

// Ensure player IDs in matches correspond to actual players
export const syncMatchPlayersWithPlayerPool = (
  matches: Match[],
  players: Player[]
): Match[] => {
  return matches.map(match => {
    const team1Players = players
      .filter(p => p.team === match.team1)
      .slice(0, 11)
      .map(p => p.id);
    const team2Players = players
      .filter(p => p.team === match.team2)
      .slice(0, 11)
      .map(p => p.id);

    return {
      ...match,
      players: {
        team1: team1Players,
        team2: team2Players
      }
    };
  });
};

// Helper to generate match details based on format
const generateMatchDetailsForFormat = (format: MatchFormat): MatchPerformanceDetails => {
  const maxOvers = format === 'T20' ? 20 : format === 'ODI' ? 50 : 90;
  const scoringRate = format === 'T20' ? 8 : format === 'ODI' ? 6 : 3;

  const batting = {
    totalScore: Math.floor(Math.random() * (maxOvers * scoringRate * 1.5)) + (maxOvers * scoringRate * 0.5),
    wickets: Math.floor(Math.random() * 10),
    overs: maxOvers,
    runRate: 0
  };

  const bowling = {
    totalScore: Math.floor(Math.random() * (maxOvers * scoringRate * 1.5)) + (maxOvers * scoringRate * 0.5),
    wickets: Math.floor(Math.random() * 10),
    overs: maxOvers,
    runRate: 0
  };

  batting.runRate = batting.totalScore / batting.overs;
  bowling.runRate = bowling.totalScore / bowling.overs;

  return { batting, bowling };
};

const determineResult = (
  matchDetails: MatchPerformanceDetails,
  isTeam1: boolean
): 'W' | 'L' | 'T' => {
  const team1Score = isTeam1 ? matchDetails.batting.totalScore : matchDetails.bowling.totalScore;
  const team2Score = isTeam1 ? matchDetails.bowling.totalScore : matchDetails.batting.totalScore;
  
  if (team1Score > team2Score) return 'W';
  if (team1Score < team2Score) return 'L';
  return 'T';
};

const generateScoreString = (matchDetails: MatchPerformanceDetails): string => {
  return `${matchDetails.batting.totalScore}/${matchDetails.batting.wickets} vs ${matchDetails.bowling.totalScore}/${matchDetails.bowling.wickets}`;
};

// Generate match performance from match data
const generateMatchPerformanceFromMatch = (
  match: Match,
  teamName: string
): MatchPerformance => {
  const isTeam1 = match.team1 === teamName;
  const opponent = isTeam1 ? match.team2 : match.team1;
  const matchDetails = generateMatchDetailsForFormat(match.format);

  return {
    matchId: match.id,
    opponent,
    result: determineResult(matchDetails, isTeam1),
    score: generateScoreString(matchDetails),
    date: match.date,
    venue: match.venue,
    format: match.format,
    matchDetails
  };
};

// Ensure team stats reference valid matches and players
export const syncTeamStatsWithMatchesAndPlayers = (
  teamStats: Record<string, TeamStats>,
  matches: Match[],
  players: Player[]
): Record<string, TeamStats> => {
  const updatedTeamStats: Record<string, TeamStats> = {};

  Object.entries(teamStats).forEach(([teamName, stats]) => {
    const teamMatches = matches.filter(
      m => m.team1 === teamName || m.team2 === teamName
    );
    const teamPlayers = players.filter(p => p.team === teamName);

    // Update last ten performances with actual matches
    const lastTenPerformances = teamMatches
      .slice(0, 10)
      .map(match => generateMatchPerformanceFromMatch(match, teamName));

    updatedTeamStats[teamName] = {
      ...stats,
      lastTenPerformances,
      // Update other relevant stats based on matches and players
      matchesPlayed: teamMatches.length,
      // You can add more stat calculations here
    };
  });

  return updatedTeamStats;
};

// Utility function to calculate team performance metrics
export const calculateTeamMetrics = (
  team: string,
  matches: Match[],
  players: Player[]
) => {
  const teamMatches = matches.filter(m => m.team1 === team || m.team2 === team);
  const teamPlayers = players.filter(p => p.team === team);

  return {
    recentForm: calculateRecentForm(teamMatches, team),
    playerStrength: calculatePlayerStrength(teamPlayers),
    // Add more metrics as needed
  };
};

const calculateRecentForm = (matches: Match[], team: string): number => {
  const recentMatches = matches.slice(0, 5);
  // Implement form calculation logic
  return 0; // Replace with actual calculation
};

const calculatePlayerStrength = (players: Player[]): number => {
  // Implement player strength calculation logic
  return 0; // Replace with actual calculation
};

// Export synchronized data
export const syncedData = {
  players: mockPlayers,
  matches: syncMatchPlayersWithPlayerPool(mockMatches, mockPlayers),
  teamStats: syncTeamStatsWithMatchesAndPlayers(mockTeamStats, mockMatches, mockPlayers)
};

// Export utility functions for external use
export const mockDataUtils = {
  calculateTeamMetrics,
  generateMatchPerformanceFromMatch,
  syncMatchPlayersWithPlayerPool,
  syncTeamStatsWithMatchesAndPlayers
};