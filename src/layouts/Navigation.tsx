import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

interface ToolCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  badge?: string;
  disabled?: boolean;
}

export const ToolCard: FC<ToolCardProps> = ({
  icon,
  title,
  description,
  href,
  badge,
  disabled = false,
}) => {
  const content = (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
            {title}
          </h3>
          {badge && (
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${
              badge === 'Ready' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <FaChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
    </div>
  );

  if (disabled) {
    return (
      <div className="group block p-6 bg-white rounded-xl shadow-soft border border-gray-100 opacity-60 cursor-not-allowed">
        {content}
      </div>
    );
  }

  return (
    <Link
      to={href}
      className="group block p-6 bg-white rounded-xl shadow-soft hover:shadow-large transition-all duration-300 border border-gray-100 hover:border-primary-300"
    >
      {content}
    </Link>
  );
};
