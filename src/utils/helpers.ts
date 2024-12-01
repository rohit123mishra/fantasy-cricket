// src/utils/helpers.ts

import { Player, Match, TeamStats } from './types';
import { TEAM_RULES, POINTS_SYSTEM } from './constants';

export const calculatePlayerPoints = (player: Player, match: Match): number => {
  let points = 0;
  const stats = player.statistics;

  // Batting points
  const battingStats = stats.batting.last10Matches;
  points += battingStats.totalRuns * POINTS_SYSTEM.batting.run;
  points += battingStats.fours * POINTS_SYSTEM.batting.four;
  points += battingStats.sixes * POINTS_SYSTEM.batting.six;

  // Add strike rate bonus/penalty
  const strikeRate = battingStats.strikeRate;
  if (strikeRate > 170) points += POINTS_SYSTEM.batting.strikeRateBonus['>170'];
  else if (strikeRate > 150) points += POINTS_SYSTEM.batting.strikeRateBonus['150.01-170'];
  else if (strikeRate > 130) points += POINTS_SYSTEM.batting.strikeRateBonus['130-150'];
  else if (strikeRate < 50) points += POINTS_SYSTEM.batting.strikeRatePenalty['<50'];
  else if (strikeRate < 60) points += POINTS_SYSTEM.batting.strikeRatePenalty['50-59.99'];
  else if (strikeRate < 70) points += POINTS_SYSTEM.batting.strikeRatePenalty['60-70'];

  // Bowling points
  const bowlingStats = stats.bowling.last10Matches;
  points += bowlingStats.wickets * POINTS_SYSTEM.bowling.wicket;
  if (bowlingStats.threeWickets > 0) points += POINTS_SYSTEM.bowling.threeWicketBonus;
  if (bowlingStats.fourWickets > 0) points += POINTS_SYSTEM.bowling.fourWicketBonus;
  if (bowlingStats.fiveWickets > 0) points += POINTS_SYSTEM.bowling.fiveWicketBonus;

  return points;
};

export const validateTeamComposition = (
  selectedPlayers: Player[],
  match: Match
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const roleCount = selectedPlayers.reduce((acc, player) => {
    acc[player.role] = (acc[player.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Check role counts
  if ((roleCount.WK || 0) < TEAM_RULES.minWK) 
    errors.push(`Need at least ${TEAM_RULES.minWK} wicketkeeper`);
  if ((roleCount.BAT || 0) < TEAM_RULES.minBAT) 
    errors.push(`Need at least ${TEAM_RULES.minBAT} batsmen`);
  if ((roleCount.ALL || 0) < TEAM_RULES.minALL) 
    errors.push(`Need at least ${TEAM_RULES.minALL} all-rounder`);
  if ((roleCount.BOWL || 0) < TEAM_RULES.minBOWL) 
    errors.push(`Need at least ${TEAM_RULES.minBOWL} bowlers`);

  // Check team balance
  const team1Players = selectedPlayers.filter(p => p.team === match.team1).length;
  const team2Players = selectedPlayers.filter(p => p.team === match.team2).length;

  if (team1Players > TEAM_RULES.maxFromOneTeam) 
    errors.push(`Maximum ${TEAM_RULES.maxFromOneTeam} players allowed from ${match.team1}`);
  if (team2Players > TEAM_RULES.maxFromOneTeam) 
    errors.push(`Maximum ${TEAM_RULES.maxFromOneTeam} players allowed from ${match.team2}`);

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const calculateTeamPoints = (
  selectedPlayers: Player[],
  captain: string,
  viceCaptain: string,
  match: Match
): number => {
  return selectedPlayers.reduce((total, player) => {
    let points = calculatePlayerPoints(player, match);
    if (player.id === captain) points *= 2;
    if (player.id === viceCaptain) points *= 1.5;
    return total + points;
  }, 0);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTeamStrength = (teamName: string, teamStats: Record<string, TeamStats>): number => {
  const stats = teamStats[teamName];
  if (!stats) return 0;

  const recentFormWeight = 0.4;
  const overallStatsWeight = 0.3;
  const rankingWeight = 0.3;

  const recentForm = stats.lastTenPerformances.reduce((score, perf) => {
    return score + (perf.result === 'W' ? 1 : perf.result === 'T' ? 0.5 : 0);
  }, 0) / stats.lastTenPerformances.length * 100;

  const overallStats = (stats.wins / stats.matchesPlayed) * 100;

  const ranking = (10 - stats.ranking.T20) * 10; // Normalize ranking to 0-100

  return (
    recentForm * recentFormWeight +
    overallStats * overallStatsWeight +
    ranking * rankingWeight
  );
};