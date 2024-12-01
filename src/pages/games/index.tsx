import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Game {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const games: Game[] = [
  {
    id: 'cricket',
    name: 'Cricket',
    icon: '🏏',
    description: 'International and domestic cricket matches'
  },
  {
    id: 'football',
    name: 'Football',
    icon: '⚽',
    description: 'Premier league and championship matches'
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: '🏀',
    description: 'NBA and international basketball matches'
  }
];

const Games: React.FC = () => {
  const navigate = useNavigate();

  const handleGameClick = (gameId: string) => {
    navigate('/matches', { state: { selectedGame: gameId } });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Available Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => handleGameClick(game.id)}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{game.icon}</span>
              <h2 className="text-xl font-semibold">{game.name}</h2>
            </div>
            <p className="text-gray-600">{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;