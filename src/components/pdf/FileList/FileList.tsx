import { FC, useState, DragEvent } from 'react';
import { FaTrash, FaGripVertical } from 'react-icons/fa';
import clsx from 'clsx';
import { formatBytes } from '../../../utils/helpers';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

export interface FileListProps {
  files: FileItem[];
  onRemove?: (id: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  showPreview?: boolean;
  className?: string;
}

export const FileList: FC<FileListProps> = ({
  files,
  onRemove,
  onReorder,
  showPreview = true,
  className,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  if (files.length === 0) {
    return null;
  }

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== dropIndex && onReorder) {
      onReorder(draggedIndex, dropIndex);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className={clsx('space-y-2', className)}>
      {files.map((file, index) => (
        <div
          key={file.id}
          draggable={!!onReorder}
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={clsx(
            'flex items-center gap-4 p-4 bg-white rounded-lg shadow-soft transition-all',
            onReorder && 'cursor-move hover:shadow-medium',
            draggedIndex === index && 'opacity-50',
            dragOverIndex === index && draggedIndex !== index && 'border-2 border-primary-500'
          )}
        >
          {onReorder && (
            <div className="flex-shrink-0 text-gray-400 cursor-move">
              <FaGripVertical className="w-4 h-4" />
            </div>
          )}
          {showPreview && file.preview && (
            <img
              src={file.preview}
              alt={file.name}
              className="w-16 h-16 object-cover rounded"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
          </div>
          {onRemove && (
            <button
              onClick={() => onRemove(file.id)}
              className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
            >
              <FaTrash className="w-5 h-5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
