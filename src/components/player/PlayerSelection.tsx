import React, { useState } from 'react';
import { Player, Match } from '../../utils/types';
import { TEAM_RULES } from '../../utils/constants';
import { PlayerList } from './PlayerList';
import Card from '../common/Card';
import { mockPlayers } from '../../mocks/players';


interface PlayerSelectionProps {
  match: Match;
  selectedPlayers: Player[];
  onPlayerSelect: (player: Player) => void;
  remainingCredits: number;
}

const PlayerSelection: React.FC<PlayerSelectionProps> = ({
  match,
  selectedPlayers,
  onPlayerSelect,
  remainingCredits
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'WK' | 'BAT' | 'ALL' | 'BOWL'>('ALL');

  const availablePlayers = mockPlayers.filter(
    player => player.team === match.team1 || player.team === match.team2
  );

  const roleCounters = {
    WK: selectedPlayers.filter(p => p.role === 'WK').length,
    BAT: selectedPlayers.filter(p => p.role === 'BAT').length,
    ALL: selectedPlayers.filter(p => p.role === 'ALL').length,
    BOWL: selectedPlayers.filter(p => p.role === 'BOWL').length
  };

  const filteredPlayers = activeTab === 'ALL'
  ? availablePlayers
  : availablePlayers.filter(p => p.role === activeTab);

  return (
    <Card>
      <div className="space-y-4">
        {/* Role Tabs */}
        <div className="flex space-x-2 border-b">
          {['ALL', 'WK', 'BAT', 'ALL', 'BOWL'].map((role) => (
            <button
              key={role}
              className={`
                px-4 py-2 text-sm font-medium rounded-t-lg
                ${activeTab === role
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
              onClick={() => setActiveTab(role as typeof activeTab)}
            >
              {role}
              {role !== 'ALL' && (
                <span className="ml-2 text-xs">
                  {roleCounters[role as keyof typeof roleCounters]}/
                  {TEAM_RULES[`max${role}` as keyof typeof TEAM_RULES]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Player List */}
        <PlayerList
          players={filteredPlayers}
          selectedPlayers={selectedPlayers}
          onPlayerSelect={onPlayerSelect}
          maxCredits={remainingCredits}
          showFilters={true}
        />
      </div>
    </Card>
  );
};

export default PlayerSelection;