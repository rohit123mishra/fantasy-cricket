// src/components/match/MatchList.tsx
import React, { useState } from 'react';
import { Match } from '../../utils/types';
import { MatchCard } from './MatchCard';
import Select from '../common/Select';

// Add props interface
interface MatchListProps {
  matches: Match[];
  showFilters?: boolean;
}

const MatchList: React.FC<MatchListProps> = ({ matches, showFilters = true }) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  const formatOptions = [
    { value: 'all', label: 'All Formats' },
    { value: 'T20', label: 'T20' },
    { value: 'ODI', label: 'ODI' },
    { value: 'TEST', label: 'Test' }
  ];

  const filteredMatches = selectedFormat === 'all'
    ? matches
    : matches.filter(match => match.format === selectedFormat);

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex justify-end">
          <Select
            options={formatOptions}
            value={selectedFormat}
            onChange={value => setSelectedFormat(value as string)}
            className="w-48"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.map(match => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {filteredMatches.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No matches found
        </div>
      )}
    </div>
  );
};

export default MatchList;