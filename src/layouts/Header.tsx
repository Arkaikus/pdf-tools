import { FC } from 'react';
import { Link } from 'react-router-dom';
import { FaFilePdf, FaGithub } from 'react-icons/fa';

export const Header: FC = () => {
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
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Features
            </a>
            <a href="#about" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              About
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaGithub className="w-6 h-6" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
