import { FC, useState, DragEvent } from 'react';
import { FaExclamationCircle, FaInfoCircle, FaFileUpload } from 'react-icons/fa';
import { Dropzone } from '../../components/common/Dropzone';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { PageThumbnail } from './components/PageThumbnail';
import { useOrganizePDF } from './hooks/useOrganizePDF';

export const OrganizePdf: FC = () => {
  const {
    file,
    pages,
    isLoading,
    isProcessing,
    progress,
    error,
    loadPDF,
    rotatePage,
    deletePage,
    restorePage,
    reorderPages,
    savePDF,
    reset,
  } = useOrganizePDF();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleFileUpload = async (files: File[]) => {
    if (files.length > 0) {
      await loadPDF(files[0]);
    }
  };

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
      reorderPages(draggedIndex, dropIndex);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const activePages = pages.filter((p) => !p.isDeleted);
  const deletedPages = pages.filter((p) => p.isDeleted);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Organize PDF Pages
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Reorder, rotate, and delete pages in your PDF. All changes are previewed before saving.
        </p>
      </div>

      {!file ? (
        /* Upload Section */
        <div className="max-w-3xl mx-auto">
          <Dropzone
            onDrop={handleFileUpload}
            accept="application/pdf"
            multiple={false}
            maxSize={100 * 1024 * 1024}
            disabled={isLoading}
          />

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaExclamationCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-6">
              <Loader size="md" text="Loading PDF..." />
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

          {/* Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How to Use</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Upload a single PDF file</li>
                  <li>Drag pages to reorder them</li>
                  <li>Click rotate buttons to rotate pages</li>
                  <li>Click delete to remove unwanted pages</li>
                  <li>Save your organized PDF</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Organize Section */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Pages Grid */}
          <div className="lg:col-span-3">
            {/* Error */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FaExclamationCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Processing */}
            {isProcessing && (
              <div className="mb-6 bg-primary-50 border border-primary-200 rounded-lg p-6">
                <Loader size="md" text="Saving organized PDF..." />
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

            {/* Active Pages */}
            <div className="mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">
                Pages ({activePages.length})
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop to reorder pages
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {activePages.map((page, index) => (
                  <div
                    key={page.index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`transition-all ${
                      draggedIndex === index ? 'opacity-50 scale-95' : ''
                    } ${
                      dragOverIndex === index && draggedIndex !== index
                        ? 'ring-2 ring-primary-500 rounded-lg'
                        : ''
                    }`}
                  >
                    <PageThumbnail
                      pageNumber={index + 1}
                      thumbnail={page.thumbnail}
                      rotation={page.rotation}
                      isDeleted={page.isDeleted}
                      onRotateLeft={() => rotatePage(page.index, -90)}
                      onRotateRight={() => rotatePage(page.index, 90)}
                      onDelete={() => deletePage(page.index)}
                      onRestore={() => restorePage(page.index)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Deleted Pages */}
            {deletedPages.length > 0 && (
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-4">
                  Deleted Pages ({deletedPages.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {deletedPages.map((page, index) => (
                    <PageThumbnail
                      key={page.index}
                      pageNumber={page.index + 1}
                      thumbnail={page.thumbnail}
                      rotation={page.rotation}
                      isDeleted={page.isDeleted}
                      onRotateLeft={() => {}}
                      onRotateRight={() => {}}
                      onDelete={() => {}}
                      onRestore={() => restorePage(page.index)}
                      isDraggable={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions (Sticky) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* File Info */}
              <div className="bg-white rounded-lg shadow-soft p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">File Info</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">File:</span>
                    <p className="font-medium text-gray-900 truncate">{file.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Pages:</span>
                    <p className="font-medium text-gray-900">{pages.length}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Active Pages:</span>
                    <p className="font-medium text-gray-900">{activePages.length}</p>
                  </div>
                  {deletedPages.length > 0 && (
                    <div>
                      <span className="text-gray-600">Deleted:</span>
                      <p className="font-medium text-red-600">{deletedPages.length}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FaInfoCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Privacy First</p>
                    <p className="mb-3">All processing happens in your browser. Your PDF is never uploaded.</p>
                    
                    <p className="font-medium mb-1">Actions:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Drag pages to reorder</li>
                      <li>Rotate left/right (90°)</li>
                      <li>Delete unwanted pages</li>
                      <li>Restore deleted pages</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={savePDF}
                  disabled={isProcessing || activePages.length === 0}
                  isLoading={isProcessing}
                  className="w-full"
                >
                  Save Organized PDF
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={reset}
                  disabled={isProcessing}
                  className="w-full"
                  leftIcon={<FaFileUpload />}
                >
                  Load Different PDF
                </Button>
              </div>

              {activePages.length === 0 && (
                <p className="text-sm text-red-600 text-center">
                  Cannot save: All pages are deleted
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
