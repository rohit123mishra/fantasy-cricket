import React from 'react';
import { Player, Match } from '../../utils/types';
import Card from '../common/Card';
import Button from '../common/Button';
import { calculatePlayerPoints } from '../../utils/helpers';

interface TeamListProps {
  teams: Array<{
    id: string;
    players: Player[];
    captain: string;
    viceCaptain: string;
    predictedPoints: number;
  }>;
  match: Match;
  onTeamSelect?: (teamId: string) => void;
  onTeamDelete?: (teamId: string) => void;
  showActions?: boolean;
}

const TeamList: React.FC<TeamListProps> = ({
  teams,
  match,
  onTeamSelect,
  onTeamDelete,
  showActions = true
}) => {
  const renderTeamCard = (team: typeof teams[0]) => {
    const roleCount = team.players.reduce((acc, player) => ({
      ...acc,
      [player.role]: (acc[player.role] || 0) + 1
    }), {} as Record<string, number>);

    const totalCredits = team.players.reduce((sum, player) => sum + player.credit, 0);
    const captain = team.players.find(p => p.id === team.captain);
    const viceCaptain = team.players.find(p => p.id === team.viceCaptain);

    return (
      <Card
        key={team.id}
        className="hover:shadow-md transition-duration-200"
      >
        <div className="space-y-4">
          {/* Team Header */}
          <div className="flex justify-between items-center">
            <div className="text-lg font-medium">Team {team.id}</div>
            <div className="text-sm text-gray-500">
              Points: {team.predictedPoints.toFixed(1)}
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Credits:</span>{' '}
              <span className="font-medium">{totalCredits.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-gray-500">Players:</span>{' '}
              <span className="font-medium">{team.players.length}</span>
            </div>
          </div>

          {/* Role Distribution */}
          <div className="flex space-x-4 text-sm">
            {Object.entries(roleCount).map(([role, count]) => (
              <div key={role} className="flex-1 text-center">
                <div className="font-medium">{count}</div>
                <div className="text-gray-500">{role}</div>
              </div>
            ))}
          </div>

          {/* Captain & Vice Captain */}
          <div className="flex space-x-4">
            {captain && (
              <div className="flex-1 p-2 bg-blue-50 rounded-md">
                <div className="text-xs text-blue-600 font-medium">Captain</div>
                <div className="font-medium">{captain.name}</div>
                <div className="text-sm text-gray-500">{captain.team}</div>
              </div>
            )}
            {viceCaptain && (
              <div className="flex-1 p-2 bg-green-50 rounded-md">
                <div className="text-xs text-green-600 font-medium">Vice Captain</div>
                <div className="font-medium">{viceCaptain.name}</div>
                <div className="text-sm text-gray-500">{viceCaptain.team}</div>
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex space-x-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => onTeamSelect?.(team.id)}
              >
                View Details
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => onTeamDelete?.(team.id)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  };

  if (teams.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No teams generated yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map(team => renderTeamCard(team))}
    </div>
  );
};

export default TeamList;