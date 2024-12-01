import React, { useState } from 'react';
import { Player, Match } from '../../utils/types';
import { calculatePlayerPoints, validateTeamComposition } from '../../utils/helpers';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Select from '../common/Select';

interface TeamGeneratorProps {
  availablePlayers: Player[];
  match: Match;
  onTeamsGenerated: (teams: GeneratedTeam[]) => void;
}

interface GeneratedTeam {
  players: Player[];
  captain: string;
  viceCaptain: string;
  predictedPoints: number;
}

const TeamGenerator: React.FC<TeamGeneratorProps> = ({
  availablePlayers,
  match,
  onTeamsGenerated
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numberOfTeams, setNumberOfTeams] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTeams = async () => {
    setIsGenerating(true);
    try {
      const teams: GeneratedTeam[] = [];
      
      for (let i = 0; i < numberOfTeams; i++) {
        const team = generateSingleTeam();
        if (team) teams.push(team);
      }

      if (teams.length > 0) {
        onTeamsGenerated(teams);
        setIsModalOpen(false);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSingleTeam = (): GeneratedTeam | null => {
    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
      attempts++;
      let selectedPlayers: Player[] = [];
      let remainingCredits = 100;

      // Try to build a valid team
      while (selectedPlayers.length < 11 && remainingCredits > 0) {
        const validPlayers = availablePlayers.filter(player => {
          // Check if player can be added
          const tempTeam = [...selectedPlayers, player];
          const validation = validateTeamComposition(tempTeam, match);
          return validation.isValid && player.credit <= remainingCredits;
        });

        if (validPlayers.length === 0) break;

        // Select random player from valid players
        const selectedPlayer = validPlayers[Math.floor(Math.random() * validPlayers.length)];
        selectedPlayers.push(selectedPlayer);
        remainingCredits -= selectedPlayer.credit;
      }

      // Validate final team
      const validation = validateTeamComposition(selectedPlayers, match);
      if (validation.isValid) {
        // Select captain and vice-captain based on form
        const sortedByPoints = [...selectedPlayers].sort(
          (a, b) => calculatePlayerPoints(b, match) - calculatePlayerPoints(a, match)
        );

        return {
          players: selectedPlayers,
          captain: sortedByPoints[0].id,
          viceCaptain: sortedByPoints[1].id,
          predictedPoints: selectedPlayers.reduce(
            (total, player) => total + calculatePlayerPoints(player, match),
            0
          )
        };
      }
    }

    return null;
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setIsModalOpen(true)}
        fullWidth
      >
        Generate Teams
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Teams"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Teams to Generate
            </label>
            <Select
              options={[
                { value: 1, label: '1 Team' },
                { value: 3, label: '3 Teams' },
                { value: 5, label: '5 Teams' },
                { value: 11, label: '11 Teams' }
              ]}
              value={numberOfTeams}
              onChange={(value) => setNumberOfTeams(Number(value))}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={generateTeams}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TeamGenerator;