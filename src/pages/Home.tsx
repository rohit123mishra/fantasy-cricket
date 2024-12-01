import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockMatches } from '../mocks/matches';
import  MatchList  from '../components/match/MatchList';
import Card from '../components/common/Card';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const upcomingMatches = mockMatches.filter(match => match.status === 'upcoming');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Welcome Section */}
        <Card>
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Fantasy Cricket
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create your dream team and compete with others. Choose from upcoming matches,
              select your players wisely, and win big!
            </p>
          </div>
        </Card>

        {/* Upcoming Matches */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Matches</h2>
          <MatchList matches={upcomingMatches} />
        </div>
      </div>
    </div>
  );
};

export default Home;