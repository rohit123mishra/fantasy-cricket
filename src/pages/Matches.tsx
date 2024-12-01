import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { mockMatches } from '../mocks/matches';
import MatchList from '../components/match/MatchList';
import Select from '../components/common/Select';
import { MatchFormat, Match } from '../utils/types';

type GameType = 'cricket' | 'football' | 'basketball';

interface FormatOption {
  value: string;
  label: string;
}

const formatOptionsByGame: Record<GameType, FormatOption[]> = {
  cricket: [
    { value: 'all', label: 'All Formats' },
    { value: 'T20', label: 'T20' },
    { value: 'ODI', label: 'ODI' },
    { value: 'TEST', label: 'Test' },
    { value: 'T10', label: 'T10' },
    { value: 'THE_HUNDRED', label: 'The Hundred' }
  ],
  football: [
    { value: 'all', label: 'All Formats' },
    { value: 'LEAGUE', label: 'League' },
    { value: 'CUP', label: 'Cup' },
    { value: 'FRIENDLY', label: 'Friendly' }
  ],
  basketball: [
    { value: 'all', label: 'All Formats' },
    { value: 'NBA', label: 'NBA' },
    { value: 'FIBA', label: 'FIBA' },
    { value: 'EUROLEAGUE', label: 'EuroLeague' }
  ]
};

const gameNames: Record<GameType, string> = {
  cricket: 'Cricket',
  football: 'Football',
  basketball: 'Basketball'
};

const Matches: React.FC = () => {
  const location = useLocation();
  const selectedGame = (location.state?.selectedGame || 'cricket') as GameType;
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  // Reset format when game changes
  useEffect(() => {
    setSelectedFormat('all');
  }, [selectedGame]);

  // Get format options based on selected game
  const formatOptions = formatOptionsByGame[selectedGame] || formatOptionsByGame.cricket;

  // Filter matches based on both game type and format
  const filteredMatches = mockMatches.filter((match: Match) => {
    if (selectedFormat === 'all') {
      return true;
    }
    return match.format === selectedFormat;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {gameNames[selectedGame]} Matches
        </h1>
        <Select
          options={formatOptions}
          value={selectedFormat}
          onChange={value => setSelectedFormat(value as string)}
          className="w-48"
        />
      </div>
      <MatchList matches={filteredMatches} />
    </div>
  );
};

export default Matches;