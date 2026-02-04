import React, { FC, useCallback, DragEvent, ChangeEvent, useRef } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import clsx from 'clsx';

export interface DropzoneProps {
  onDrop: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Dropzone: FC<DropzoneProps> = ({
  onDrop,
  accept = '*/*',
  multiple = true,
  maxSize,
  disabled = false,
  className,
  children,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter((file) => {
        if (maxSize && file.size > maxSize) return false;
        return true;
      });

      onDrop(validFiles);
    },
    [disabled, maxSize, onDrop]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      const validFiles = files.filter((file) => {
        if (maxSize && file.size > maxSize) return false;
        return true;
      });

      onDrop(validFiles);

      // Reset input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [maxSize, onDrop]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  return (
    <div
      className={clsx(
        'relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer',
        isDragging
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      {children || (
        <div className="p-12 text-center">
          <FaCloudUploadAlt className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2 text-gray-700">
            Drop files here
          </h3>
          <p className="text-gray-500 mb-4">
            or click to browse
          </p>
          {maxSize && (
            <p className="text-sm text-gray-400">
              Max file size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
            </p>
          )}
        </div>
      )}
    </div>
  );
};
