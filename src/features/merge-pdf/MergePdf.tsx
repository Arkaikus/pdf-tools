import { FC, useState, DragEvent } from 'react';
import { FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { Dropzone } from '../../components/common/Dropzone';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { PDFFileItem } from './components/PDFFileItem';
import { usePDFMerger } from './hooks/usePDFMerger';

export const MergePdf: FC = () => {
  const {
    files,
    isProcessing,
    progress,
    error,
    addFiles,
    removeFile,
    reorderFiles,
    updatePageRange,
    clearFiles,
    mergePDFs,
  } = usePDFMerger();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderFiles(draggedIndex, dropIndex);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMerge = async () => {
    await mergePDFs();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Merge PDF Files
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Combine multiple PDF files into a single document. Select specific pages or merge entire files.
          All processing happens in your browser.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload & Files */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload */}
          <Dropzone
            onDrop={addFiles}
            accept="application/pdf"
            multiple={true}
            maxSize={100 * 1024 * 1024}
            disabled={isProcessing}
          />

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaExclamationCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Processing */}
          {isProcessing && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <Loader size="md" text="Merging PDF files..." />
              <div className="mt-4">
                <div className="w-full bg-primary-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-primary-700 text-center mt-2">
                  {progress}%
                </p>
              </div>
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-900">
                  PDF Files ({files.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFiles}
                  disabled={isProcessing}
                >
                  Clear All
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Drag and drop to reorder files. Files will be merged in this order.
              </p>
              
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`transition-all ${
                      draggedIndex === index ? 'opacity-50' : ''
                    } ${
                      dragOverIndex === index && draggedIndex !== index
                        ? 'border-2 border-primary-500 rounded-lg'
                        : ''
                    }`}
                  >
                    <PDFFileItem
                      file={file}
                      onRemove={removeFile}
                      onUpdateRange={updatePageRange}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Info & Actions (Sticky) */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-8 space-y-6">
            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Privacy First</p>
                  <p className="mb-3">All processing happens in your browser. Your PDFs are never uploaded to any server.</p>
                  
                  <p className="font-medium mb-1 mt-3">Page Selection</p>
                  <p>You can select specific pages from each PDF or merge entire files.</p>
                  
                  <p className="font-medium mb-1 mt-3">Examples:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><code className="bg-blue-100 px-1 rounded">all</code> - All pages</li>
                    <li><code className="bg-blue-100 px-1 rounded">1-3</code> - Pages 1 to 3</li>
                    <li><code className="bg-blue-100 px-1 rounded">1,3,5</code> - Pages 1, 3, and 5</li>
                    <li><code className="bg-blue-100 px-1 rounded">1-3,5,7-10</code> - Combined ranges</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Merge Button */}
            {files.length > 0 && (
              <Button
                variant="primary"
                size="lg"
                onClick={handleMerge}
                disabled={isProcessing || files.length < 2}
                isLoading={isProcessing}
                className="w-full"
              >
                {files.length < 2 ? 'Add More Files' : 'Merge PDFs'}
              </Button>
            )}

            {files.length === 1 && (
              <p className="text-sm text-gray-600 text-center">
                Add at least one more PDF to merge
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
