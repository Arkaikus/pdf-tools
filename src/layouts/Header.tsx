import { FC } from 'react';
import { Link } from 'react-router-dom';
import { FaFilePdf, FaGithub, FaTasks } from 'react-icons/fa';
import { useTaskQueue } from '../hooks/useTaskQueue';

export const Header: FC = () => {
  const { stats } = useTaskQueue();
  const activeTasks = stats.processing + stats.completed;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-medium group-hover:shadow-large transition-shadow">
                <FaFilePdf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">PDF Tools</h1>
                <p className="text-xs text-gray-500">Privacy-first PDF editor</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {/* Task Queue */}
            <Link
              to="/tasks"
              className="relative text-gray-600 hover:text-primary-600 transition-colors"
              title="Task Queue"
            >
              <FaTasks className="w-6 h-6" />
              {activeTasks > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeTasks > 9 ? '9+' : activeTasks}
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                About
              </a>
              <a
                href="https://github.com/arkaikus/pdf-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaGithub className="w-6 h-6" />
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
