import React, { useState } from 'react';
import { Match, Player } from '../utils/types';
import { mockMatches } from '../mocks/matches';
import TeamList from '../components/team/TeamList';
import Card from '../components/common/Card';

// Define interface for user team
interface UserTeam {
  id: string;
  players: Player[];
  captain: string;
  viceCaptain: string;
  predictedPoints: number;
  match: Match;
  createdAt: string;
}

const MyTeams: React.FC = () => {
  // In a real app, this would come from your backend
  const [userTeams] = useState<UserTeam[]>([
    // You can add mock data here if needed
    // {
    //   id: '1',
    //   players: [],
    //   captain: '',
    //   viceCaptain: '',
    //   predictedPoints: 0,
    //   match: mockMatches[0],
    //   createdAt: new Date().toISOString()
    // }
  ]);

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Teams</h1>
          
          {userTeams.length > 0 && (
            <select
              className="form-select rounded-md border-gray-300"
              onChange={(e) => {
                const match = mockMatches.find(m => m.id === e.target.value);
                setSelectedMatch(match || null);
              }}
              value={selectedMatch?.id || ''}
            >
              <option value="">All Matches</option>
              {mockMatches.map(match => (
                <option key={match.id} value={match.id}>
                  {match.team1} vs {match.team2}
                </option>
              ))}
            </select>
          )}
        </div>

        {userTeams.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                No teams created yet
              </h2>
              <p className="text-gray-600 mb-4">
                Start by selecting an upcoming match and creating your dream team!
              </p>
              <a
                href="/matches"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                View Matches
              </a>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userTeams.length}
                  </div>
                  <div className="text-sm text-gray-500">Total Teams</div>
                </div>
              </Card>
              
              <Card>
                <div className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userTeams.reduce((max, team) => 
                      Math.max(max, team.predictedPoints), 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500">Best Score</div>
                </div>
              </Card>
              
              <Card>
                <div className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {(userTeams.reduce((sum, team) => 
                      sum + team.predictedPoints, 0) / userTeams.length).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500">Average Score</div>
                </div>
              </Card>
            </div>

            {/* Teams List */}
            <TeamList
              teams={selectedMatch 
                ? userTeams.filter(team => team.match.id === selectedMatch.id)
                : userTeams
              }
              match={selectedMatch || mockMatches[0]}
              onTeamDelete={(teamId) => {
                // Handle team deletion
                console.log('Delete team:', teamId);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeams;