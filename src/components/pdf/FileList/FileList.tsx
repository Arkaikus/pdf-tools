import { FC } from 'react';
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
  showPreview = true,
  className,
}) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className={clsx('space-y-2', className)}>
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-soft hover:shadow-medium transition-shadow"
        >
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
