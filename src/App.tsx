// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Games from './pages/games';
import GameMatches from './pages/games/GameMatches';
import Matches from './pages/Matches';
import CreateTeam from './pages/CreateTeam';
import MyTeams from './pages/MyTeams';
import Profile from './pages/Profile';

// Custom hook to manage auth state (mock for now)
const useAuth = () => {
  // In a real app, this would check for authentication
  const isAuthenticated = true;
  return { isAuthenticated };
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:gameId/matches" element={<GameMatches />} />
          <Route path="/matches" element={<Matches />} />
          
          {/* Protected Routes */}
          <Route
            path="/matches/:matchId/create-team"
            element={
              <ProtectedRoute>
                <CreateTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-teams"
            element={
              <ProtectedRoute>
                <MyTeams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Page not found</p>
                  <a
                    href="/"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Go back home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;