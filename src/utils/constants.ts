// src/utils/constants.ts

export const TEAM_RULES = {
  minWK: 1,
  maxWK: 4,
  minBAT: 3,
  maxBAT: 6,
  minALL: 1,
  maxALL: 4,
  minBOWL: 3,
  maxBOWL: 6,
  totalPlayers: 11,
  maxFromOneTeam: 7,
  totalCredits: 100
};


export const PLAYER_ROLES = ['WK', 'BAT', 'ALL', 'BOWL'] as const;

export const MATCH_FORMATS = [
  { value: 'T20', label: 'T20' },
  { value: 'ODI', label: 'ODI' },
  { value: 'TEST', label: 'Test' },
  { value: 'T10', label: 'T10' },
  { value: 'THE_HUNDRED', label: 'The Hundred' }
] as const;

export const POINTS_SYSTEM = {
  batting: {
    run: 1,
    four: 1,
    six: 2,
    thirtyBonus: 4,
    fiftyBonus: 8,
    hundredBonus: 16,
    strikeRateBonus: {
      '130-150': 2,
      '150.01-170': 4,
      '>170': 6
    },
    strikeRatePenalty: {
      '60-70': -2,
      '50-59.99': -4,
      '<50': -6
    }
  },
  bowling: {
    wicket: 25,
    lbwBonus: 8,
    bowledBonus: 8,
    threeWicketBonus: 4,
    fourWicketBonus: 8,
    fiveWicketBonus: 16,
    economyBonus: {
      '6-7': 2,
      '5-5.99': 4,
      '<5': 6
    },
    economyPenalty: {
      '10-11': -2,
      '11.01-12': -4,
      '>12': -6
    }
  },
  fielding: {
    catch: 8,
    threeWicketBonus: 4,
    stumping: 12,
    runOutDirectHit: 12,
    runOutPartial: 6
  },
  other: {
    duckPenalty: -2,
    maidenOver: 12
  }
};