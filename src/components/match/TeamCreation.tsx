// src/components/match/TeamCreation.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Player, PlayerRole, Match } from '../../utils/types';
import { mockPlayers } from '../../mocks/players';
import { mockMatches } from '../../mocks/matches';
import TeamPreview from '../team/TeamPreview';
import Button from '../common/Button';
import Modal from '../common/Modal';
import PlayerSelection from '../player/PlayerSelection';



interface TeamRules {
  minWK: number;
  maxWK: number;
  minBAT: number;
  maxBAT: number;
  minALL: number;
  maxALL: number;
  minBOWL: number;
  maxBOWL: number;
  totalPlayers: number;
  maxFromOneTeam: number;
  totalCredits: number;
}
interface TeamCreationProps {
  matchId: string;
}

const defaultRules: TeamRules = {
  minWK: 1,
  maxWK: 4,
  minBAT: 3,
  maxBAT: 6,
  minALL: 1,
  maxALL: 4,
  minBOWL: 3,
  maxBOWL: 6,
  totalPlayers: 11,
  maxFromOneTeam: 7,
  totalCredits: 100
};


const TeamCreation: React.FC<TeamCreationProps> = ({ matchId }) => {
  const [match, setMatch] = useState<Match | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [captain, setCaptain] = useState<string>('');
  const [viceCaptain, setViceCaptain] = useState<string>('');
  const [remainingCredits, setRemainingCredits] = useState(100);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const matchData = mockMatches.find(m => m.id === matchId);
    if (matchData) {
      setMatch(matchData);
    }
  }, [matchId]);

  useEffect(() => {
    const usedCredits = selectedPlayers.reduce((sum, player) => sum + player.credit, 0);
    setRemainingCredits(defaultRules.totalCredits - usedCredits);
  }, [selectedPlayers]);

  const validateTeamComposition = (): string[] => {
    const validationErrors: string[] = [];
    const roleCount = selectedPlayers.reduce((acc, player) => {
      acc[player.role] = (acc[player.role] || 0) + 1;
      return acc;
    }, {} as Record<PlayerRole, number>);

    // Check role limits
    if ((roleCount.WK || 0) < defaultRules.minWK) validationErrors.push(`Minimum ${defaultRules.minWK} wicketkeeper required`);
    if ((roleCount.WK || 0) > defaultRules.maxWK) validationErrors.push(`Maximum ${defaultRules.maxWK} wicketkeepers allowed`);
    if ((roleCount.BAT || 0) < defaultRules.minBAT) validationErrors.push(`Minimum ${defaultRules.minBAT} batsmen required`);
    if ((roleCount.BAT || 0) > defaultRules.maxBAT) validationErrors.push(`Maximum ${defaultRules.maxBAT} batsmen allowed`);
    if ((roleCount.ALL || 0) < defaultRules.minALL) validationErrors.push(`Minimum ${defaultRules.minALL} all-rounders required`);
    if ((roleCount.ALL || 0) > defaultRules.maxALL) validationErrors.push(`Maximum ${defaultRules.maxALL} all-rounders allowed`);
    if ((roleCount.BOWL || 0) < defaultRules.minBOWL) validationErrors.push(`Minimum ${defaultRules.minBOWL} bowlers required`);
    if ((roleCount.BOWL || 0) > defaultRules.maxBOWL) validationErrors.push(`Maximum ${defaultRules.maxBOWL} bowlers allowed`);

    // Check team balance
    if (match) {
      const team1Players = selectedPlayers.filter(p => p.team === match.team1).length;
      const team2Players = selectedPlayers.filter(p => p.team === match.team2).length;
      if (team1Players > defaultRules.maxFromOneTeam) {
        validationErrors.push(`Maximum ${defaultRules.maxFromOneTeam} players allowed from ${match.team1}`);
      }
      if (team2Players > defaultRules.maxFromOneTeam) {
        validationErrors.push(`Maximum ${defaultRules.maxFromOneTeam} players allowed from ${match.team2}`);
      }
    }

    // Check captain and vice-captain
    if (selectedPlayers.length === defaultRules.totalPlayers && !captain) {
      validationErrors.push('Captain must be selected');
    }
    if (selectedPlayers.length === defaultRules.totalPlayers && !viceCaptain) {
      validationErrors.push('Vice Captain must be selected');
    }
    if (captain === viceCaptain && captain) {
      validationErrors.push('Captain and Vice Captain must be different players');
    }

    return validationErrors;
  };

  const handlePlayerSelect = (player: Player) => {
    if (selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
      if (captain === player.id) setCaptain('');
      if (viceCaptain === player.id) setViceCaptain('');
    } else {
      if (selectedPlayers.length < defaultRules.totalPlayers && player.credit <= remainingCredits) {
        setSelectedPlayers(prev => [...prev, player]);
      }
    }
  };

  const handleCaptainSelect = (playerId: string) => {
    if (captain === playerId) {
      setCaptain('');
    } else {
      setCaptain(playerId);
      if (viceCaptain === playerId) setViceCaptain('');
    }
  };

  const handleViceCaptainSelect = (playerId: string) => {
    if (viceCaptain === playerId) {
      setViceCaptain('');
    } else {
      setViceCaptain(playerId);
      if (captain === playerId) setCaptain('');
    }
  };

  const handlePreview = () => {
    const validationErrors = validateTeamComposition();
    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      setShowPreviewModal(true);
    }
  };

  if (!match) {
    return <div>Match not found</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Player Selection Area */}
      <div className="lg:col-span-2">
        <PlayerSelection
          match={match}
          selectedPlayers={selectedPlayers}
          onPlayerSelect={handlePlayerSelect}
          remainingCredits={remainingCredits}
        />
      </div>

      {/* Team Preview Area */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Your Team</h2>
          <TeamPreview
            selectedPlayers={selectedPlayers}
            captain={captain}
            viceCaptain={viceCaptain}
            onCaptainSelect={handleCaptainSelect}
            onViceCaptainSelect={handleViceCaptainSelect}
            onPlayerRemove={handlePlayerSelect}
          />
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Players</span>
              <span>{selectedPlayers.length}/{defaultRules.totalPlayers}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Credits Left</span>
              <span>{remainingCredits.toFixed(1)}</span>
            </div>
          </div>
          {errors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 rounded-md">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-600">{error}</p>
              ))}
            </div>
          )}
          <Button
            variant="primary"
            fullWidth
            className="mt-4"
            onClick={handlePreview}
            disabled={selectedPlayers.length !== defaultRules.totalPlayers}
          >
            Preview Team
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Team Preview"
      >
        <div className="space-y-4">
          <TeamPreview
            selectedPlayers={selectedPlayers}
            captain={captain}
            viceCaptain={viceCaptain}
            readonly
          />
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowPreviewModal(false)}
            >
              Edit Team
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                // Handle team save logic
                setShowPreviewModal(false);
              }}
            >
              Save Team
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamCreation;