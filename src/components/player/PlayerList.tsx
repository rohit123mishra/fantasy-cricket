import React, { useState } from 'react';
import { Player, PlayerRole } from '../../utils/types';
import { PLAYER_ROLES } from '../../utils/constants';
import PlayerCard from './PlayerCard';
import Input from '../common/Input';
import Select from '../common/Select';

interface PlayerListProps {
  players: Player[];
  selectedPlayers: Player[];
  onPlayerSelect: (player: Player) => void;
  maxCredits: number;
  title?: string;
  showFilters?: boolean;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  selectedPlayers,
  onPlayerSelect,
  maxCredits,
  title = "Players",
  showFilters = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('points');

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    ...PLAYER_ROLES.map(role => ({ value: role, label: role }))
  ];

  const sortOptions = [
    { value: 'points', label: 'Points' },
    { value: 'credits', label: 'Credits' },
    { value: 'selection', label: 'Selection %' }
  ];

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || player.role === selectedRole;
    const isAffordable = !selectedPlayers.includes(player) || player.credit <= maxCredits;
    return matchesSearch && matchesRole && isAffordable;
  });

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    switch (sortBy) {
      case 'credits':
        return b.credit - a.credit;
      case 'selection':
        return (Math.random() * 100) - (Math.random() * 100); // Mock selection %
      case 'points':
      default:
        return (
          b.statistics.batting.last10Matches.totalRuns -
          a.statistics.batting.last10Matches.totalRuns
        );
    }
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            options={roleOptions}
            value={selectedRole}
            onChange={(value) => setSelectedRole(value as string)}
            placeholder="Select Role"
          />
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={(value) => setSortBy(value as string)}
            placeholder="Sort By"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            isSelected={selectedPlayers.includes(player)}
            onSelect={onPlayerSelect}
            disabled={
              !selectedPlayers.includes(player) &&
              player.credit > maxCredits
            }
          />
        ))}
      </div>
    </div>
  );
};