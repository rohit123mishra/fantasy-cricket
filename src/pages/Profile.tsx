import React from 'react';
import Card from '../components/common/Card';

const Profile: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              User Information
            </h2>
            {/* Add user information fields */}
          </div>
        </Card>
        
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Statistics
            </h2>
            {/* Add user statistics */}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;