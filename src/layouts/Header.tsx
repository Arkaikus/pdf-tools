import { FC } from 'react';
import { Link } from 'react-router-dom';
import { FaFilePdf, FaGithub, FaTasks } from 'react-icons/fa';
import { useTaskQueue } from '../hooks/useTaskQueue';

export const Header: FC = () => {
  const { stats } = useTaskQueue();
  const activeTasks = stats.processing + stats.completed;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex gap-3 items-center group">
              <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-br rounded-lg transition-shadow from-primary-500 to-primary-700 shadow-medium group-hover:shadow-large">
                <FaFilePdf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">PDF Tools</h1>
                <p className="text-xs text-gray-500">Privacy-first PDF editor</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex gap-6 items-center">
            {/* Task Queue */}
            <Link
              to="/tasks"
              className="relative text-gray-600 transition-colors hover:text-primary-600"
              title="Task Queue"
            >
              <FaTasks className="w-6 h-6" />
              {activeTasks > 0 && (
                <span className="flex absolute -top-2 -right-2 justify-center items-center w-5 h-5 text-xs font-bold text-white rounded-full bg-primary-500">
                  {activeTasks > 9 ? '9+' : activeTasks}
                </span>
              )}
            </Link>

            <div className="hidden gap-6 items-center md:flex">
              <a href="#/#features" className="font-medium text-gray-600 transition-colors hover:text-primary-600">
                Features
              </a>
              <a href="#about" className="font-medium text-gray-600 transition-colors hover:text-primary-600">
                About
              </a>
              <a
                href="https://github.com/arkaikus/pdf-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 transition-colors hover:text-gray-900"
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
