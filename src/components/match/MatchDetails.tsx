import React from 'react';
import { useParams } from 'react-router-dom';
import { mockMatches } from '../../mocks/matches';
import { mockPlayers } from '../../mocks/players';
import { mockTeamStats } from '../../mocks/teams';
import Card from '../common/Card';

export const MatchDetails: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const match = mockMatches.find(m => m.id === matchId);

  if (!match) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Match not found</h2>
      </div>
    );
  }

  const team1Stats = mockTeamStats[match.team1];
  const team2Stats = mockTeamStats[match.team2];
  const team1Players = mockPlayers.filter(p => p.team === match.team1);
  const team2Players = mockPlayers.filter(p => p.team === match.team2);

  const headToHead = team1Stats.headToHead.find(h => h.opponent === match.team2);

  return (
    <div className="space-y-6">
      {/* Match Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {match.team1} vs {match.team2}
          </h1>
          <div className="text-sm text-gray-500">
            {new Date(match.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        <div className="mt-2 text-gray-600">
          {match.venue} • {match.format}
        </div>
      </div>

      {/* Head to Head Stats */}
      <Card title="Head to Head">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{headToHead?.won || 0}</div>
            <div className="text-sm text-gray-500">{match.team1} Wins</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{headToHead?.drawn || 0}</div>
            <div className="text-sm text-gray-500">Draws</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{headToHead?.lost || 0}</div>
            <div className="text-sm text-gray-500">{match.team2} Wins</div>
          </div>
        </div>
      </Card>

      {/* Team Squads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title={`${match.team1} Squad`}>
          <ul className="divide-y divide-gray-200">
            {team1Players.map(player => (
              <li key={player.id} className="py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{player.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      {player.role}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {player.playingStyle.batting}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title={`${match.team2} Squad`}>
          <ul className="divide-y divide-gray-200">
            {team2Players.map(player => (
              <li key={player.id} className="py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{player.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      {player.role}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {player.playingStyle.batting}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};