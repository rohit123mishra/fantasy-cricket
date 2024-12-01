import React, { useState } from 'react';
import { Player, Match } from '../../utils/types';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Select from '../common/Select';

interface TeamGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
  availablePlayers: Player[];
  onGenerateTeams: (teams: GeneratedTeam[]) => void;
}

export interface GeneratedTeam {
  id: string;
  players: Player[];
  captain: string;
  viceCaptain: string;
  predictedPoints: number;
  teamValue: number;
}

interface PlayerScore {
  player: Player;
  totalScore: number;
  recentForm: number;
  matchupScore: number;
  consistencyScore: number;
}

export const TeamGeneratorModal: React.FC<TeamGeneratorModalProps> = ({
  isOpen,
  onClose,
  match,
  availablePlayers,
  onGenerateTeams
}) => {
  const [numberOfTeams, setNumberOfTeams] = useState<number>(3);
  const [team1PlayingXI, setTeam1PlayingXI] = useState<string[]>([]);
  const [team2PlayingXI, setTeam2PlayingXI] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  const calculatePlayerScores = (players: Player[]): PlayerScore[] => {
    return players.map(player => {
      const recentForm = player.statistics.recentForm.reduce((score, match, index) => {
        const weight = 1 - (index * 0.2);
        return score + (match.runs + match.wickets * 25) * weight;
      }, 0);

      const matchupScore = 50; // Base matchup score
      const consistencyScore = player.statistics.batting.last10Matches.totalRuns / 10;

      return {
        player,
        totalScore: recentForm * 0.4 + matchupScore * 0.3 + consistencyScore * 0.3,
        recentForm,
        matchupScore,
        consistencyScore
      };
    });
  };

  const generateSingleTeam = (
    players: Player[],
    playerScores: PlayerScore[],
    existingCombinations: Set<string>
  ): GeneratedTeam | null => {
    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
      attempts++;
      let selectedPlayers: Player[] = [];
      let remainingCredits = 100;
      
      const roleCount = {
        WK: 0,
        BAT: 0,
        ALL: 0,
        BOWL: 0
      };
      
      const teamCount = {
        [match.team1]: 0,
        [match.team2]: 0
      };

      // First, select a wicketkeeper
      const wicketkeepers = players.filter(p => p.role === 'WK');
      if (wicketkeepers.length > 0) {
        const selectedWK = wicketkeepers[Math.floor(Math.random() * wicketkeepers.length)];
        selectedPlayers.push(selectedWK);
        roleCount.WK++;
        teamCount[selectedWK.team]++;
        remainingCredits -= selectedWK.credit;
      }

      // Shuffle remaining players for random selection
      const remainingPlayers = players
        .filter(p => !selectedPlayers.includes(p))
        .sort(() => Math.random() - 0.5);

      // Try to fill the team
      for (const player of remainingPlayers) {
        if (selectedPlayers.includes(player)) continue;

        const wouldBeValid = (
          roleCount[player.role] < 8 &&
          teamCount[player.team] < 7 &&
          player.credit <= remainingCredits &&
          selectedPlayers.length < 11
        );

        if (wouldBeValid) {
          selectedPlayers.push(player);
          roleCount[player.role]++;
          teamCount[player.team]++;
          remainingCredits -= player.credit;
        }
      }

      // Validate final team
      if (selectedPlayers.length === 11) {
        const isValid = (
          roleCount.WK >= 1 &&
          roleCount.BAT >= 1 &&
          roleCount.ALL >= 1 &&
          roleCount.BOWL >= 1 &&
          teamCount[match.team1] >= 4 &&
          teamCount[match.team2] >= 4
        );

        if (isValid) {
          const teamKey = selectedPlayers.map(p => p.id).sort().join(',');
          if (!existingCombinations.has(teamKey)) {
            // Sort players by score for captain selection
            const sortedByScore = [...selectedPlayers].sort((a, b) => {
              const scoreA = playerScores.find(s => s.player.id === a.id)?.totalScore || 0;
              const scoreB = playerScores.find(s => s.player.id === b.id)?.totalScore || 0;
              return scoreB - scoreA;
            });

            const captain = sortedByScore[0].id;
            const viceCaptain = sortedByScore[1].id;

            return {
              id: Math.random().toString(36).substr(2, 9),
              players: selectedPlayers,
              captain,
              viceCaptain,
              predictedPoints: calculateTeamPoints(selectedPlayers, playerScores, captain, viceCaptain),
              teamValue: selectedPlayers.reduce((sum, p) => sum + p.credit, 0)
            };
          }
        }
      }
    }

    return null;
  };

  const calculateTeamPoints = (
    players: Player[],
    playerScores: PlayerScore[],
    captain: string,
    viceCaptain: string
  ): number => {
    return players.reduce((total, player) => {
      const score = playerScores.find(s => s.player.id === player.id)?.totalScore || 0;
      const multiplier = player.id === captain ? 2 : player.id === viceCaptain ? 1.5 : 1;
      return total + score * multiplier;
    }, 0);
  };

  const handleGenerateTeams = async () => {
    setGenerating(true);
    setError('');

    try {
      const playingXI = [...team1PlayingXI, ...team2PlayingXI];
      const playingXIPlayers = availablePlayers.filter(p => playingXI.includes(p.id));
      const playerScores = calculatePlayerScores(playingXIPlayers);

      console.log('Generating teams with:', {
        playingXI,
        playerCount: playingXIPlayers.length,
        numberOfTeams
      });

      const teams: GeneratedTeam[] = [];
      const combinations = new Set<string>();

      for (let i = 0; i < numberOfTeams * 2 && teams.length < numberOfTeams; i++) {
        const team = generateSingleTeam(playingXIPlayers, playerScores, combinations);
        if (team) {
          teams.push(team);
          combinations.add(team.players.map(p => p.id).sort().join(','));
          console.log(`Generated team ${teams.length}:`, team);
        }
      }

      if (teams.length === 0) {
        setError('Could not generate valid teams. Please try again.');
        return;
      }

      // Sort teams by predicted points
      teams.sort((a, b) => b.predictedPoints - a.predictedPoints);
      onGenerateTeams(teams);
      onClose();
    } catch (error) {
      console.error('Error generating teams:', error);
      setError('An error occurred while generating teams.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Teams"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Teams to Generate
          </label>
          <Select
            options={[
              { value: 1, label: '1 Team' },
              { value: 3, label: '3 Teams' },
              { value: 5, label: '5 Teams' },
              { value: 10, label: '10 Teams' }
            ]}
            value={numberOfTeams}
            onChange={(value) => setNumberOfTeams(Number(value))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team 1 Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {match.team1} Playing XI ({team1PlayingXI.length}/11)
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availablePlayers
                .filter(p => p.team === match.team1)
                .map(player => (
                  <label key={player.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={team1PlayingXI.includes(player.id)}
                      onChange={(e) => {
                        if (e.target.checked && team1PlayingXI.length < 11) {
                          setTeam1PlayingXI([...team1PlayingXI, player.id]);
                        } else if (!e.target.checked) {
                          setTeam1PlayingXI(team1PlayingXI.filter(id => id !== player.id));
                        }
                      }}
                      className="rounded text-blue-600"
                    />
                    <span>{player.name} ({player.role})</span>
                  </label>
                ))}
            </div>
          </div>

          {/* Team 2 Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {match.team2} Playing XI ({team2PlayingXI.length}/11)
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availablePlayers
                .filter(p => p.team === match.team2)
                .map(player => (
                  <label key={player.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={team2PlayingXI.includes(player.id)}
                      onChange={(e) => {
                        if (e.target.checked && team2PlayingXI.length < 11) {
                          setTeam2PlayingXI([...team2PlayingXI, player.id]);
                        } else if (!e.target.checked) {
                          setTeam2PlayingXI(team2PlayingXI.filter(id => id !== player.id));
                        }
                      }}
                      className="rounded text-blue-600"
                    />
                    <span>{player.name} ({player.role})</span>
                  </label>
                ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleGenerateTeams}
            disabled={generating || 
              team1PlayingXI.length !== 11 || 
              team2PlayingXI.length !== 11
            }
          >
            {generating ? 'Generating...' : 'Generate Teams'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TeamGeneratorModal;