import { FC } from 'react';
import { FaTrash, FaGripVertical, FaFilePdf } from 'react-icons/fa';
import { formatBytes, pluralize } from '../../../utils/helpers';

interface PDFFileItemProps {
  file: {
    id: string;
    name: string;
    size: number;
    pageCount: number;
    pageRange?: string;
  };
  onRemove: (id: string) => void;
  onUpdateRange: (id: string, range: string) => void;
  isDraggable?: boolean;
}

export const PDFFileItem: FC<PDFFileItemProps> = ({
  file,
  onRemove,
  onUpdateRange,
  isDraggable = true,
}) => {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-soft">
      {isDraggable && (
        <div className="flex-shrink-0 text-gray-400 cursor-move mt-1">
          <FaGripVertical className="w-4 h-4" />
        </div>
      )}
      
      <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
        <FaFilePdf className="w-6 h-6 text-red-600" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate mb-1">{file.name}</p>
        <p className="text-sm text-gray-500 mb-2">
          {formatBytes(file.size)} • {pluralize(file.pageCount, 'page')}
        </p>
        
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600 font-medium">Pages:</label>
          <input
            type="text"
            value={file.pageRange || 'all'}
            onChange={(e) => onUpdateRange(file.id, e.target.value)}
            placeholder="all or 1-3,5,7-10"
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Enter "all" or specific pages (e.g., "1-3,5,7-10")
        </p>
      </div>

      <button
        onClick={() => onRemove(file.id)}
        className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
      >
        <FaTrash className="w-5 h-5" />
      </button>
    </div>
  );
};
