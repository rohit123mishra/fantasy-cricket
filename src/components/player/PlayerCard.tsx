import React from 'react';
import { Player } from '../../utils/types';
import { User, Activity, TrendingUp } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  isSelected?: boolean;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  onSelect?: (player: Player) => void;
  showCredits?: boolean;
  disabled?: boolean;
  className?: string;
}


const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isSelected = false,
  isCaptain = false,
  isViceCaptain = false,
  onSelect,
  showCredits = true,
  disabled = false,
  className = ''
}) => {
  const {
    name,
    team,
    role,
    credit,
    statistics
  } = player;

  const getRecentFormColor = () => {
    const recentRuns = statistics.batting.last10Matches.totalRuns;
    if (recentRuns > 200) return 'text-green-600';
    if (recentRuns > 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div
      className={`
        relative border rounded-lg p-4 transition-all
        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-300'}
        ${className}
      `}
      onClick={() => !disabled && onSelect?.(player)}
    >
      {(isCaptain || isViceCaptain) && (
        <div className="absolute top-2 right-2">
          <span className={`
            inline-flex items-center justify-center w-6 h-6 rounded-full
            ${isCaptain ? 'bg-blue-600' : 'bg-blue-400'}
            text-white text-sm font-bold
          `}>
            {isCaptain ? 'C' : 'VC'}
          </span>
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">{team}</p>
        </div>
        <span className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${role === 'BAT' ? 'bg-red-100 text-red-800' :
            role === 'BOWL' ? 'bg-green-100 text-green-800' :
            role === 'ALL' ? 'bg-purple-100 text-purple-800' :
            'bg-yellow-100 text-yellow-800'}
        `}>
          {role}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="text-gray-500">Points</p>
          <p className={`font-medium ${getRecentFormColor()}`}>
            {statistics.batting.last10Matches.totalRuns}
          </p>
        </div>
        {showCredits && (
          <div>
            <p className="text-gray-500">Credits</p>
            <p className="font-medium">{credit}</p>
          </div>
        )}
        <div>
          <p className="text-gray-500">Sel By</p>
          <p className="font-medium text-gray-900">
            {Math.floor(Math.random() * 100)}%
          </p>
        </div>
      </div>

      <div className="mt-2 text-xs">
        <div className="flex items-center text-gray-500">
          <Activity size={14} className="mr-1" />
          Last 3: {statistics.recentForm.map(form => form.runs).join(', ')}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;