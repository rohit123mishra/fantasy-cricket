import React, { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockMatches } from '../mocks/matches';
import { mockPlayers } from '../mocks/players';
import TeamGeneratorModal, { GeneratedTeam } from '../components/team/TeamGeneratorModal';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const CreateTeam: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatedTeams, setGeneratedTeams] = useState<GeneratedTeam[]>([]);
  const [selectedTeamIndex, setSelectedTeamIndex] = useState<number | null>(null);
  const [data, setData] = useState(null);


  // API call to RapidAPI
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers: HeadersInit = {
          'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
        };
  
        if (process.env.REACT_APP_RAPIDAPI_KEY) {
          headers['X-RapidAPI-Key'] = process.env.REACT_APP_RAPIDAPI_KEY;
        } else {
          console.error('REACT_APP_RAPIDAPI_KEY is not set');
          return;
        }
  
        const response = await fetch('https://cricbuzz-cricket.p.rapidapi.com/schedule/v1/international', {
          method: 'GET',
          headers
        });
        const data = await response.json();
        console.log('RapidAPI Data:', data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const match = mockMatches.find(m => m.id === matchId);
  const availablePlayers = mockPlayers.filter(
    p => p.team === match?.team1 || p.team === match?.team2
  );

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Match not found</h1>
        </div>
      </div>
    );
  }

  const handleTeamsGenerated = (teams: GeneratedTeam[]) => {
    console.log('Generated Teams:', teams);
    setGeneratedTeams(teams);
    setShowGenerator(false);
  };

  const calculateRoleCount = (players: GeneratedTeam['players']) => {
    return players.reduce((acc, player) => {
      acc[player.role] = (acc[player.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const calculateTeamCount = (players: GeneratedTeam['players']) => {
    return players.reduce((acc, player) => {
      acc[player.team] = (acc[player.team] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Teams</h1>
          <p className="text-sm text-gray-600 mt-1">
            {match.team1} vs {match.team2} • {match.format}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowGenerator(true)}
        >
          Generate Teams
        </Button>
      </div>

      {/* Generated Teams Display */}
      {generatedTeams.length > 0 && (
        <div className="space-y-6">
          {/* Teams Overview */}
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">
                Generated Teams ({generatedTeams.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Players
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Captain & VC
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credits
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {generatedTeams.map((team, index) => {
                      const roleCount = calculateRoleCount(team.players);
                      const teamCount = calculateTeamCount(team.players);
                      const captain = team.players.find(p => p.id === team.captain);
                      const viceCaptain = team.players.find(p => p.id === team.viceCaptain);

                      return (
                        <tr 
                          key={team.id}
                          className={selectedTeamIndex === index ? 'bg-blue-50' : ''}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium">Team {index + 1}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              WK: {roleCount.WK || 0} • BAT: {roleCount.BAT || 0} •{' '}
                              ALL: {roleCount.ALL || 0} • BOWL: {roleCount.BOWL || 0}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {match.team1}: {teamCount[match.team1] || 0} •{' '}
                              {match.team2}: {teamCount[match.team2] || 0}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              C: {captain?.name}
                              <br />
                              VC: {viceCaptain?.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium">
                              {team.predictedPoints.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm">
                              {team.teamValue.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => setSelectedTeamIndex(index)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Selected Team Details */}
          {selectedTeamIndex !== null && (
            <Card>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Team {selectedTeamIndex + 1} Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['WK', 'BAT', 'ALL', 'BOWL'].map(role => {
                    const rolePlayers = generatedTeams[selectedTeamIndex].players
                      .filter(p => p.role === role);
                    
                    return (
                      <div key={role} className="space-y-2">
                        <h4 className="font-medium text-gray-700">{role}</h4>
                        {rolePlayers.map(player => (
                          <div
                            key={player.id}
                            className={`p-2 rounded ${
                              player.id === generatedTeams[selectedTeamIndex].captain
                                ? 'bg-blue-100'
                                : player.id === generatedTeams[selectedTeamIndex].viceCaptain
                                ? 'bg-green-100'
                                : 'bg-gray-50'
                            }`}
                          >
                            <div className="text-sm font-medium">
                              {player.name}
                              {player.id === generatedTeams[selectedTeamIndex].captain && ' (C)'}
                              {player.id === generatedTeams[selectedTeamIndex].viceCaptain && ' (VC)'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {player.team} • {player.credit} Cr
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Team Generator Modal */}
      <TeamGeneratorModal
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
        match={match}
        availablePlayers={availablePlayers}
        onGenerateTeams={handleTeamsGenerated}
      />
    </div>
  );
};

export default CreateTeam;