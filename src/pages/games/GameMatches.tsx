// src/pages/Games/GameMatches.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

interface Match {
  id: string;
  teams: string;
  date: string;
  time: string;
  venue: string;
}

const GameMatches: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  
  // Mock data - in a real app, this would come from an API
  const matches: Match[] = [
    {
      id: '1',
      teams: 'Team A vs Team B',
      date: '2024-11-30',
      time: '14:00',
      venue: 'Stadium 1'
    },
    {
      id: '2',
      teams: 'Team C vs Team D',
      date: '2024-11-30',
      time: '16:30',
      venue: 'Stadium 2'
    }
  ];

  const getGameName = (id: string) => {
    const gameNames: { [key: string]: string } = {
      cricket: 'Cricket',
      football: 'Football',
      basketball: 'Basketball'
    };
    return gameNames[id] || 'Unknown Game';
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{getGameName(gameId || '')} Matches</h1>
      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{match.teams}</h2>
            <div className="text-gray-600">
              <p>Date: {match.date}</p>
              <p>Time: {match.time}</p>
              <p>Venue: {match.venue}</p>
            </div>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Join Match
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameMatches;