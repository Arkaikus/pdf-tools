import { FC } from 'react';
import { FaTrash, FaUndo, FaGripVertical, FaRedo } from 'react-icons/fa';
import clsx from 'clsx';

interface PageThumbnailProps {
  pageNumber: number; // 1-indexed for display
  thumbnail: string;
  rotation: number;
  isDeleted: boolean;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onDelete: () => void;
  onRestore: () => void;
  isDraggable?: boolean;
}

export const PageThumbnail: FC<PageThumbnailProps> = ({
  pageNumber,
  thumbnail,
  rotation,
  isDeleted,
  onRotateLeft,
  onRotateRight,
  onDelete,
  onRestore,
  isDraggable = true,
}) => {
  return (
    <div
      className={clsx(
        'relative bg-white rounded-lg shadow-soft hover:shadow-medium transition-all p-3',
        isDeleted && 'opacity-40',
        isDraggable && 'cursor-move'
      )}
    >
      {/* Drag Handle */}
      {isDraggable && !isDeleted && (
        <div className="absolute top-2 left-2 text-gray-400 z-10">
          <FaGripVertical className="w-4 h-4" />
        </div>
      )}

      {/* Page Number */}
      <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs font-bold rounded px-2 py-1 z-10">
        {pageNumber}
      </div>

      {/* Deleted Overlay */}
      {isDeleted && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-20 rounded-lg z-10">
          <span className="text-red-700 font-bold text-lg">DELETED</span>
        </div>
      )}

      {/* Thumbnail */}
      <div className="mb-3 flex items-center justify-center bg-gray-50 rounded overflow-hidden min-h-[200px]">
        <img
          src={thumbnail}
          alt={`Page ${pageNumber}`}
          className="max-w-full h-auto"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease',
          }}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-2">
        {!isDeleted ? (
          <>
            <button
              onClick={onRotateLeft}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
              title="Rotate Left"
            >
              <FaUndo className="w-4 h-4" />
            </button>
            <button
              onClick={onRotateRight}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
              title="Rotate Right"
            >
              <FaRedo className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="Delete Page"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={onRestore}
            className="px-3 py-1 text-sm bg-primary-500 text-white hover:bg-primary-600 rounded transition-colors"
          >
            Restore
          </button>
        )}
      </div>
    </div>
  );
};
