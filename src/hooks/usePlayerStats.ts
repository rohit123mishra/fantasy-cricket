import { useMemo } from 'react';
import { Player, Match } from '../utils/types';
import { calculatePlayerPoints } from '../utils/helpers';

export const usePlayerStats = (
  player: Player,
  match: Match
) => {
  const stats = useMemo(() => {
    const basePoints = calculatePlayerPoints(player, match);
    const battingStats = player.statistics.batting.last10Matches;
    const bowlingStats = player.statistics.bowling.last10Matches;
    const recentForm = player.statistics.recentForm;

    return {
      basePoints,
      captainPoints: basePoints * 2,
      viceCaptainPoints: basePoints * 1.5,
      battingAverage: battingStats.totalRuns / (battingStats.inningsPlayed - battingStats.notOuts || 1),
      strikeRate: battingStats.strikeRate,
      economy: bowlingStats.economy,
      recentFormTrend: recentForm.map(match => ({
        runs: match.runs,
        wickets: match.wickets,
        points: match.runs + (match.wickets * 25)
      }))
    };
  }, [player, match]);

  return stats;
};