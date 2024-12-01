import React from 'react';
import { Player, PlayerRole } from '../../utils/types';
import Card from '../common/Card';
import Button from '../common/Button';

interface TeamPreviewProps {
  selectedPlayers: Player[];
  captain?: string;
  viceCaptain?: string;
  onCaptainSelect?: (playerId: string) => void;
  onViceCaptainSelect?: (playerId: string) => void;
  onPlayerRemove?: (player: Player) => void;
  readonly?: boolean;
}

const TeamPreview: React.FC<TeamPreviewProps> = ({
  selectedPlayers,
  captain,
  viceCaptain,
  onCaptainSelect,
  onViceCaptainSelect,
  onPlayerRemove,
  readonly = false
}) => {
  const playersByRole: Record<PlayerRole, Player[]> = {
    WK: selectedPlayers.filter(p => p.role === 'WK'),
    BAT: selectedPlayers.filter(p => p.role === 'BAT'),
    ALL: selectedPlayers.filter(p => p.role === 'ALL'),
    BOWL: selectedPlayers.filter(p => p.role === 'BOWL')
  };

  const renderPlayerSection = (role: PlayerRole, players: Player[]) => (
    <div key={role} className="mb-4">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{role} ({players.length})</h3>
      <div className="space-y-2">
        {players.map(player => (
          <div
            key={player.id}
            className={`
              p-3 rounded-lg border
              ${captain === player.id ? 'border-blue-500 bg-blue-50' :
                viceCaptain === player.id ? 'border-green-500 bg-green-50' :
                'border-gray-200'}
            `}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{player.name}</div>
                <div className="text-sm text-gray-500">{player.team}</div>
              </div>
              {!readonly && (
                <div className="flex space-x-2">
                  <button
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${captain === player.id ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-blue-100'}
                    `}
                    onClick={() => onCaptainSelect?.(player.id)}
                  >
                    C
                  </button>
                  <button
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${viceCaptain === player.id ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-green-100'}
                    `}
                    onClick={() => onViceCaptainSelect?.(player.id)}
                  >
                    VC
                  </button>
                  {onPlayerRemove && (
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onPlayerRemove(player)}
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {Object.entries(playersByRole).map(([role, players]) => 
        players.length > 0 && renderPlayerSection(role as PlayerRole, players)
      )}
    </div>
  );
};

export default TeamPreview;