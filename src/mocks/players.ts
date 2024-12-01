import { Player, PlayerRole, PlayingStyle } from '../utils/types';

// Helper function to generate batting statistics
const generateBattingStats = (
  role: PlayerRole,
  isTopOrder: boolean = false
) => {
  const baseRuns = role === 'BAT' || role === 'ALL' ? 250 : 150;
  const totalRuns = baseRuns + Math.floor(Math.random() * 200);
  const innings = 10;
  
  return {
    last10Matches: {
      totalRuns,
      inningsPlayed: innings,
      notOuts: Math.floor(Math.random() * 3),
      centuries: Math.floor(totalRuns / 300),
      halfCenturies: Math.floor(totalRuns / 150),
      thirties: Math.floor(totalRuns / 80),
      fours: Math.floor(totalRuns / 10),
      sixes: Math.floor(totalRuns / 20),
      battingPositions: [
        {
          position: isTopOrder ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 5) + 4,
          matches: innings,
          runs: totalRuns
        }
      ],
      strikeRate: 120 + Math.random() * 40
    },
    situational: {
      firstInnings: {
        average: 35 + Math.random() * 20,
        strikeRate: 130 + Math.random() * 30
      },
      secondInnings: {
        average: 32 + Math.random() * 20,
        strikeRate: 135 + Math.random() * 30
      },
      powerplay: {
        average: 30 + Math.random() * 15,
        strikeRate: 140 + Math.random() * 30
      },
      death: {
        average: 25 + Math.random() * 20,
        strikeRate: 160 + Math.random() * 40
      }
    }
  };
};

// Helper function to generate bowling statistics
const generateBowlingStats = (role: PlayerRole) => {
  const isBowler = role === 'BOWL' || role === 'ALL';
  const baseWickets = isBowler ? 12 : 2;
  const wickets = baseWickets + Math.floor(Math.random() * 8);
  
  return {
    last10Matches: {
      wickets,
      threeWickets: Math.floor(wickets / 5),
      fourWickets: Math.floor(wickets / 8),
      fiveWickets: Math.floor(wickets / 12),
      bestBowling: {
        wickets: Math.min(5, wickets),
        runs: 20 + Math.floor(Math.random() * 30),
        overs: 4
      },
      economy: 6 + Math.random() * 4,
      maidens: Math.floor(Math.random() * 3)
    },
    situational: {
      powerplay: {
        wickets: Math.floor(wickets * 0.3),
        economy: 7 + Math.random() * 3
      },
      death: {
        wickets: Math.floor(wickets * 0.4),
        economy: 8 + Math.random() * 4
      }
    }
  };
};

// Generate a player with full statistics
const generatePlayer = (
  id: string,
  name: string,
  team: string,
  role: PlayerRole,
  battingStyle: 'Left Hand' | 'Right Hand',
  bowlingStyle: 'Fast' | 'Spin' | 'Medium' | null,
  credit: number,
  isTopOrder: boolean = false
): Player => {
  return {
    id,
    name,
    team,
    role,
    playingStyle: {
      batting: battingStyle,
      bowling: bowlingStyle
    },
    credit,
    isPlaying11: true,
    statistics: {
      batting: generateBattingStats(role, isTopOrder),
      bowling: generateBowlingStats(role),
      fielding: {
        catches: Math.floor(Math.random() * 10),
        stumpings: role === 'WK' ? Math.floor(Math.random() * 5) : 0,
        runOuts: {
          direct: Math.floor(Math.random() * 3),
          indirect: Math.floor(Math.random() * 3)
        }
      },
      recentForm: Array.from({ length: 3 }, (_, i) => ({
        matchId: `m${i + 1}`,
        runs: Math.floor(Math.random() * 50) + 20,
        wickets: role === 'BOWL' || role === 'ALL' ? Math.floor(Math.random() * 3) : 0,
        catches: Math.floor(Math.random() * 2),
        stumpings: role === 'WK' ? Math.floor(Math.random() * 2) : 0,
        date: new Date(2024, 2, 1 - i).toISOString().split('T')[0]
      }))
    }
  };
};

// Create mock players data
export const mockPlayers: Player[] = [
  // India Team
  generatePlayer('1', 'Rohit Sharma', 'India', 'BAT', 'Right Hand', null, 9, true),
  generatePlayer('2', 'Virat Kohli', 'India', 'BAT', 'Right Hand', 'Medium', 8, true),
  generatePlayer('3', 'KL Rahul', 'India', 'WK', 'Right Hand', null, 9.5, true),
  generatePlayer('4', 'Hardik Pandya', 'India', 'ALL', 'Right Hand', 'Fast', 9.0),
  generatePlayer('5', 'Ravindra Jadeja', 'India', 'ALL', 'Left Hand', 'Spin', 9.0),
  generatePlayer('6', 'Jasprit Bumrah', 'India', 'BOWL', 'Right Hand', 'Fast', 9.5),
  generatePlayer('7', 'Axar Patel', 'India', 'ALL', 'Left Hand', 'Spin', 11.0, true),
  generatePlayer('8', 'Rahul Dravid', 'India', 'BAT', 'Right Hand', null, 9.5, true),
  generatePlayer('9', 'Shikhar Dhawan', 'India', 'BAT', 'Left Hand', null, 9.0, true),
  generatePlayer('10', 'Mohammed Shami', 'India', 'BOWL', 'Right Hand', 'Fast', 9.5),
  generatePlayer('11', 'Ishan Kishan', 'India', 'WK', 'Left Hand', null, 8.5),
  generatePlayer('12', 'Suryakumar Yadav', 'India', 'BAT', 'Right Hand', null, 8.0),
  generatePlayer('13', 'Shardul Thakur', 'India', 'ALL', 'Right Hand', 'Medium', 7.5),
  generatePlayer('14', 'Yuzvendra Chahal', 'India', 'BOWL', 'Right Hand', 'Spin', 8.5),
  generatePlayer('15', 'Kuldeep Yadav', 'India', 'BOWL', 'Left Hand', 'Spin', 8.0),
  generatePlayer('16', 'Prithvi Shaw', 'India', 'BAT', 'Right Hand', null, 7.5),

  // Australia Team
  generatePlayer('17', 'David Warner', 'Australia', 'BAT', 'Left Hand', null, 10.0, true),
  generatePlayer('18', 'Steve Smith', 'Australia', 'BAT', 'Right Hand', 'Spin', 10.5, true),
  generatePlayer('19', 'Alex Carey', 'Australia', 'WK', 'Left Hand', null, 8.5),
  generatePlayer('20', 'Mitchell Marsh', 'Australia', 'ALL', 'Right Hand', 'Fast', 8.5),
  generatePlayer('21', 'Pat Cummins', 'Australia', 'BOWL', 'Right Hand', 'Fast', 9.0),
  generatePlayer('22', 'Mitchell Starc', 'Australia', 'BOWL', 'Left Hand', 'Fast', 9.5),
  generatePlayer('23', 'Aaron Finch', 'Australia', 'BAT', 'Right Hand', null, 8.0),
  generatePlayer('24', 'Glenn Maxwell', 'Australia', 'ALL', 'Right Hand', 'Spin', 9.5),
  generatePlayer('25', 'Marcus Stoinis', 'Australia', 'ALL', 'Right Hand', 'Medium', 8.0),
  generatePlayer('26', 'Josh Hazlewood', 'Australia', 'BOWL', 'Right Hand', 'Fast', 9.0),
  generatePlayer('27', 'Adam Zampa', 'Australia', 'BOWL', 'Right Hand', 'Spin', 8.5),
  generatePlayer('28', 'Matthew Wade', 'Australia', 'WK', 'Left Hand', null, 7.5),
  generatePlayer('29', 'Ashton Agar', 'Australia', 'ALL', 'Left Hand', 'Spin', 7.5),
  generatePlayer('30', 'Travis Head', 'Australia', 'BAT', 'Left Hand', 'Spin', 8.0),
  generatePlayer('31', 'Cameron Green', 'Australia', 'ALL', 'Right Hand', 'Fast', 7.5),
  generatePlayer('32', 'Usman Khawaja', 'Australia', 'BAT', 'Left Hand', null, 8.5),

  // England Team
  generatePlayer('33', 'Jos Buttler', 'England', 'WK', 'Right Hand', null, 10.0, true),
  generatePlayer('34', 'Joe Root', 'England', 'BAT', 'Right Hand', 'Spin', 10.0, true),
  generatePlayer('35', 'Ben Stokes', 'England', 'ALL', 'Left Hand', 'Fast', 10.5),
  generatePlayer('36', 'Moeen Ali', 'England', 'ALL', 'Left Hand', 'Spin', 8.5),
  generatePlayer('37', 'James Anderson', 'England', 'BOWL', 'Right Hand', 'Fast', 9.0),
  generatePlayer('38', 'Jofra Archer', 'England', 'BOWL', 'Right Hand', 'Fast', 9.5),
  generatePlayer('39', 'Eoin Morgan', 'England', 'BAT', 'Left Hand', null, 8.5),
  generatePlayer('40', 'Jason Roy', 'England', 'BAT', 'Right Hand', null, 8.0),
  generatePlayer('41', 'Jonny Bairstow', 'England', 'WK', 'Right Hand', null, 9.5),
  generatePlayer('42', 'Chris Woakes', 'England', 'ALL', 'Right Hand', 'Fast', 8.5),
  generatePlayer('43', 'Mark Wood', 'England', 'BOWL', 'Right Hand', 'Fast', 8.0),
  generatePlayer('44', 'Adil Rashid', 'England', 'BOWL', 'Right Hand', 'Spin', 8.5),
  generatePlayer('45', 'Sam Curran', 'England', 'ALL', 'Left Hand', 'Medium', 8.0),
  generatePlayer('46', 'Tom Curran', 'England', 'ALL', 'Right Hand', 'Medium', 7.5),
  generatePlayer('47', 'Liam Livingstone', 'England', 'ALL', 'Right Hand', 'Spin', 8.0),
  generatePlayer('48', 'Dawid Malan', 'England', 'BAT', 'Left Hand', null, 8.5),

  // Pakistan Team
  generatePlayer('49', 'Babar Azam', 'Pakistan', 'BAT', 'Right Hand', null, 10.0, true),
  generatePlayer('50', 'Mohammad Rizwan', 'Pakistan', 'WK', 'Right Hand', null, 9.5, true),
  generatePlayer('51', 'Shaheen Afridi', 'Pakistan', 'BOWL', 'Left Hand', 'Fast', 9.5),
  generatePlayer('52', 'Shadab Khan', 'Pakistan', 'ALL', 'Right Hand', 'Spin', 8.5),
  generatePlayer('53', 'Fakhar Zaman', 'Pakistan', 'BAT', 'Left Hand', null, 8.0),
  generatePlayer('54', 'Imad Wasim', 'Pakistan', 'ALL', 'Left Hand', 'Spin', 7.5),
  generatePlayer('55', 'Hasan Ali', 'Pakistan', 'BOWL', 'Right Hand', 'Fast', 8.0),
  generatePlayer('56', 'Haris Rauf', 'Pakistan', 'BOWL', 'Right Hand', 'Fast', 8.5),
  
  // New Zealand Team
  generatePlayer('57', 'Kane Williamson', 'New Zealand', 'BAT', 'Right Hand', null, 10.0, true),
  generatePlayer('58', 'Tom Latham', 'New Zealand', 'WK', 'Left Hand', null, 8.5),
  generatePlayer('59', 'Trent Boult', 'New Zealand', 'BOWL', 'Left Hand', 'Fast', 9.5),
  generatePlayer('60', 'Mitchell Santner', 'New Zealand', 'ALL', 'Left Hand', 'Spin', 8.0),

  // South Africa Team
  generatePlayer('61', 'Quinton de Kock', 'South Africa', 'WK', 'Left Hand', null, 9.5),
  generatePlayer('62', 'Kagiso Rabada', 'South Africa', 'BOWL', 'Right Hand', 'Fast', 9.5),
  generatePlayer('63', 'David Miller', 'South Africa', 'BAT', 'Left Hand', null, 8.5),
  generatePlayer('64', 'Anrich Nortje', 'South Africa', 'BOWL', 'Right Hand', 'Fast', 8.5),
];


// Export functions for external use
export const playerUtils = {
  generatePlayer,
  generateBattingStats,
  generateBowlingStats
};