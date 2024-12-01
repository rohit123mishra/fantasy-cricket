// src/mocks/matches.ts

import { Match, MatchFormat } from '../utils/types';
import { mockPlayers } from './players';

const venues = [
  {
    name: 'Melbourne Cricket Ground',
    location: 'Melbourne, Australia',
    capacity: 100000
  },
  {
    name: 'Lords Cricket Ground',
    location: 'London, England',
    capacity: 30000
  },
  {
    name: 'Eden Gardens',
    location: 'Kolkata, India',
    capacity: 66000
  },
  {
    name: 'Wanderers Stadium',
    location: 'Johannesburg, South Africa',
    capacity: 28000
  },
  {
    name: 'Sydney Cricket Ground',
    location: 'Sydney, Australia',
    capacity: 48000
  }
];

const teams = [
  'India',
  'Australia',
  'England',
  'South Africa',
  'New Zealand',
  'Pakistan',
  'West Indies',
  'Bangladesh'
];

interface MatchGenerator {
  generateMatchPlayers: (team1: string, team2: string) => {
    team1Players: string[];
    team2Players: string[];
  };
  createMatch: (
    id: string,
    team1: string,
    team2: string,
    format: MatchFormat,
    date: Date
  ) => Match;
}

const matchGenerator: MatchGenerator = {
  generateMatchPlayers: (team1: string, team2: string) => {
    const team1Players = mockPlayers
      .filter(p => p.team === team1 && p.isPlaying11)
      .map(p => p.id)
      .slice(0, 11);
    
    const team2Players = mockPlayers
      .filter(p => p.team === team2 && p.isPlaying11)
      .map(p => p.id)
      .slice(0, 11);

    return { team1Players, team2Players };
  },

  createMatch: (id: string, team1: string, team2: string, format: MatchFormat, date: Date): Match => {
    const venue = venues[Math.floor(Math.random() * venues.length)].name;
    const { team1Players, team2Players } = matchGenerator.generateMatchPlayers(team1, team2);

    return {
      id,
      team1,
      team2,
      format,
      venue,
      date: date.toISOString(),
      status: 'upcoming',
      players: {
        team1: team1Players,
        team2: team2Players
      }
    };
  }
};

// Generate a series of matches over the next month
const generateUpcomingMatches = (count: number): Match[] => {
  const matches: Match[] = [];
  const formats: MatchFormat[] = ['T20', 'ODI', 'TEST', 'T10', 'THE_HUNDRED'];
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Ensure teams are different
    let team1Index = Math.floor(Math.random() * teams.length);
    let team2Index = Math.floor(Math.random() * teams.length);
    while (team2Index === team1Index) {
      team2Index = Math.floor(Math.random() * teams.length);
    }

    const format = formats[Math.floor(Math.random() * formats.length)];
    
    matches.push(
      matchGenerator.createMatch(
        `m${i + 1}`,
        teams[team1Index],
        teams[team2Index],
        format,
        date
      )
    );
  }

  return matches;
};

// Generate scheduled matches
export const mockMatches: Match[] = [
  // Specific important matches
  matchGenerator.createMatch(
    'm1',
    'India',
    'Australia',
    'T20',
    new Date('2024-03-15T09:30:00.000Z')
  ),
  matchGenerator.createMatch(
    'm2',
    'England',
    'South Africa',
    'ODI',
    new Date('2024-03-18T10:00:00.000Z')
  ),
  // Add more specific matches...
  ...generateUpcomingMatches(13) // Generate 13 more matches for a total of 15
];

export const matchUtils = {
  matchGenerator,
  generateUpcomingMatches,
  getMatchesByTeam: (team: string) => 
    mockMatches.filter(m => m.team1 === team || m.team2 === team),
  getMatchesByFormat: (format: MatchFormat) =>
    mockMatches.filter(m => m.format === format),
  getMatchesByVenue: (venue: string) =>
    mockMatches.filter(m => m.venue === venue)
};