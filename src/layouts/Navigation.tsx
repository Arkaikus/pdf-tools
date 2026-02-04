import { FC, ReactNode } from 'react';

interface LinkProps {
  href: string;
  children: ReactNode;
}

export const Link: FC<LinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
    >
      {children}
    </a>
  );
};

interface ToolCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  badge?: string;
}

export const ToolCard: FC<ToolCardProps> = ({
  icon,
  title,
  description,
  href,
  badge,
}) => {
  return (
    <a
      href={href}
      className="group block p-6 bg-white rounded-xl shadow-soft hover:shadow-large transition-all duration-300 border border-gray-100 hover:border-primary-300"
    >
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
              <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </a>
  );
};
