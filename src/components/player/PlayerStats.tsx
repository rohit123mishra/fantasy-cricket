import React from 'react';
import { Player } from '../../utils/types';
import Card from '../common/Card';

interface PlayerStatsProps {
  player: Player;
  className?: string;
}


export const PlayerStats: React.FC<PlayerStatsProps> = ({ player, className = '' }) => {
  const battingStats = player.statistics.batting.last10Matches;
  const bowlingStats = player.statistics.bowling.last10Matches;

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Statistics</h3>
        
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Batting Stats */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Batting</h4>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Runs</dt>
                <dd className="text-lg font-medium">{battingStats.totalRuns}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Strike Rate</dt>
                <dd className="text-lg font-medium">{battingStats.strikeRate.toFixed(1)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Highest Score</dt>
                <dd className="text-lg font-medium">
                  {Math.max(...player.statistics.recentForm.map(f => f.runs))}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">50s/100s</dt>
                <dd className="text-lg font-medium">
                  {battingStats.halfCenturies}/{battingStats.centuries}
                </dd>
              </div>
            </dl>
          </div>

          {/* Bowling Stats */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Bowling</h4>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Wickets</dt>
                <dd className="text-lg font-medium">{bowlingStats.wickets}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Economy</dt>
                <dd className="text-lg font-medium">{bowlingStats.economy.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">3+ Wickets</dt>
                <dd className="text-lg font-medium">{bowlingStats.threeWickets}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Best Bowling</dt>
                <dd className="text-lg font-medium">
                  {bowlingStats.bestBowling.wickets}/{bowlingStats.bestBowling.runs}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Recent Form */}
        <div className="mt-5">
          <h4 className="font-medium text-gray-900 mb-4">Recent Form</h4>
          <div className="overflow-hidden bg-gray-50 rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex space-x-4">
                {player.statistics.recentForm.map((form, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-white p-3 rounded-lg shadow-sm"
                  >
                    <div className="text-sm text-gray-500">
                      {new Date(form.date).toLocaleDateString()}
                    </div>
                    <div className="mt-1 text-lg font-medium">
                      {form.runs} runs
                    </div>
                    {form.wickets > 0 && (
                      <div className="text-sm text-gray-600">
                        {form.wickets} wickets
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
