import { FC, useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaExclamationTriangle, 
  FaInfoCircle,
  FaTimes 
} from 'react-icons/fa';
import clsx from 'clsx';
import type { ToastMessage } from '../../../types/global.d';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: FC<ToastProps> = ({ toast, onClose }) => {
  const { id, type, message, duration } = toast;

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const iconMap = {
    success: <FaCheckCircle className="w-5 h-5" />,
    error: <FaExclamationCircle className="w-5 h-5" />,
    warning: <FaExclamationTriangle className="w-5 h-5" />,
    info: <FaInfoCircle className="w-5 h-5" />,
  };

  const colorClasses = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <div
      className={clsx(
        'flex items-center gap-3 p-4 rounded-lg border shadow-medium animate-slide-up',
        colorClasses[type]
      )}
    >
      <div className="flex-shrink-0">{iconMap[type]}</div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <FaTimes className="w-5 h-5" />
      </button>
    </div>
  );
};
