import { useLocation } from 'react-router-dom';
import { Home, Calendar, Users, Trophy, Settings, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { icon: <Gamepad2 size={20} />, label: 'Games', path: '/Games' },
    { icon: <Calendar size={20} />, label: 'Matches', path: '/matches' },
    { icon: <Users size={20} />, label: 'My Teams', path: '/my-teams' },
    { icon: <Trophy size={20} />, label: 'Leaderboard', path: '/leaderboard' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto" style={{minHeight:"80vh"}}>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;