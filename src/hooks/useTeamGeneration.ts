import { useState, useCallback } from 'react';
import { Player, Match } from '../utils/types';
import { validateTeamComposition, calculatePlayerPoints } from '../utils/helpers';

interface GeneratedTeam {
  id: string;
  players: Player[];
  captain: string;
  viceCaptain: string;
  predictedPoints: number;
}

export const useTeamGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTeams, setGeneratedTeams] = useState<GeneratedTeam[]>([]);

  const generateTeams = useCallback(async (
    availablePlayers: Player[],
    match: Match,
    count: number
  ) => {
    setIsGenerating(true);
    try {
      const teams: GeneratedTeam[] = [];
      for (let i = 0; i < count; i++) {
        let team = await generateSingleTeam(availablePlayers, match);
        if (team) {
          teams.push({
            id: `team${i + 1}`,
            ...team
          });
        }
      }
      setGeneratedTeams(teams);
      return teams;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateSingleTeam = async (
    availablePlayers: Player[],
    match: Match
  ): Promise<Omit<GeneratedTeam, 'id'> | null> => {
    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
      attempts++;
      let selectedPlayers: Player[] = [];
      let remainingCredits = 100;

      // Try to build a valid team
      const shuffledPlayers = [...availablePlayers].sort(() => Math.random() - 0.5);
      
      for (const player of shuffledPlayers) {
        if (selectedPlayers.length === 11) break;
        
        const tempTeam = [...selectedPlayers, player];
        const validation = validateTeamComposition(tempTeam, match);
        
        if (validation.isValid && player.credit <= remainingCredits) {
          selectedPlayers.push(player);
          remainingCredits -= player.credit;
        }
      }

      if (selectedPlayers.length === 11) {
        // Sort players by points for captain selection
        const sortedPlayers = [...selectedPlayers].sort(
          (a, b) => calculatePlayerPoints(b, match) - calculatePlayerPoints(a, match)
        );

        return {
          players: selectedPlayers,
          captain: sortedPlayers[0].id,
          viceCaptain: sortedPlayers[1].id,
          predictedPoints: selectedPlayers.reduce((total, player) => {
            let points = calculatePlayerPoints(player, match);
            if (player.id === sortedPlayers[0].id) points *= 2;
            if (player.id === sortedPlayers[1].id) points *= 1.5;
            return total + points;
          }, 0)
        };
      }
    }

    return null;
  };

  return {
    isGenerating,
    generatedTeams,
    generateTeams
  };
};
