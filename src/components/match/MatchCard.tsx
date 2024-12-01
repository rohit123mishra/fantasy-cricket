import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { Match } from '../../utils/types';
import Card from '../common/Card';
import Button from '../common/Button';

interface MatchCardProps {
  match: Match;
  showJoinButton?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, showJoinButton = true }) => {
  const navigate = useNavigate();
  const matchDate = new Date(match.date);
  const isUpcoming = match.status === 'upcoming';

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow"
      onClick={() => navigate(`/matches/${match.id}`)}
    >
      <div className="flex flex-col space-y-4">
        {/* Match Format & Date */}
        <div className="flex justify-between text-sm text-gray-500">
          <span className="flex items-center">
            <Calendar size={16} className="mr-1" />
            {formatDate(matchDate)}
          </span>
          <span className="flex items-center">
            <Clock size={16} className="mr-1" />
            {formatTime(matchDate)}
          </span>
        </div>

        {/* Teams */}
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <div className="font-semibold text-lg">{match.team1}</div>
          </div>
          <div className="flex-shrink-0 px-4">
            <span className="text-gray-400 font-bold">VS</span>
          </div>
          <div className="text-center flex-1">
            <div className="font-semibold text-lg">{match.team2}</div>
          </div>
        </div>

        {/* Match Details */}
        <div className="text-center">
          <div className="text-sm text-gray-600">{match.venue}</div>
          <div className="text-sm font-medium text-blue-600">{match.format}</div>
        </div>

        {/* Action Button */}
        {showJoinButton && isUpcoming && (
          <Button
            variant="primary"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/matches/${match.id}/create-team`);
            }}
          >
            Join Contest
          </Button>
        )}
      </div>
    </Card>
  );
};