import type { FC } from 'react';
import { FaWifi } from 'react-icons/fa';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';

export const OfflineIndicator: FC = () => {
  const { isOffline } = useOnlineStatus();

  if (!isOffline) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center gap-2 text-sm text-yellow-800">
          <FaWifi className="w-4 h-4" />
          <span>
            <strong>Offline mode:</strong> PDF processing still works! Your files are processed locally in your browser.
          </span>
        </div>
      </div>
    </div>
  );
};
