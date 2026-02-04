import { FC, useState } from 'react';
import { FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { Dropzone } from '../../components/common/Dropzone';
import { FileList } from '../../components/pdf/FileList';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { ImageSettings } from './components/ImageSettings';
import { useImageToPDF } from './hooks/useImageToPDF';
import type { ImageToPDFOptions } from '../../types/pdf.types';

export const JpgToPdf: FC = () => {
  const {
    files,
    isProcessing,
    progress,
    error,
    addFiles,
    removeFile,
    reorderFiles,
    clearFiles,
    convertToPDF,
  } = useImageToPDF();

  const [options, setOptions] = useState<ImageToPDFOptions>({
    pageSize: 'A4',
    orientation: 'portrait',
    margin: 20,
    fitToPage: true,
    maintainAspectRatio: true,
  });

  const handleConvert = async () => {
    await convertToPDF(options);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          JPG to PDF Converter
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Convert your images to PDF instantly. All processing happens in your browser
          - your files never leave your device.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload & Files */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload */}
          <Dropzone
            onDrop={addFiles}
            accept="image/jpeg,image/jpg,image/png,image/webp"
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
              <Loader size="md" text="Converting images to PDF..." />
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
                  Images ({files.length})
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
                Drag and drop to reorder images
              </p>
              <FileList
                files={files.map((f) => ({
                  id: f.id!,
                  name: f.name,
                  size: f.size,
                  type: f.type,
                  preview: f.preview,
                }))}
                onRemove={removeFile}
                onReorder={reorderFiles}
                showPreview={true}
              />
            </div>
          )}
        </div>

        {/* Right Column - Settings (Sticky) */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-8 space-y-6">
            <ImageSettings options={options} onChange={setOptions} />

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Privacy First</p>
                  <p>All processing happens in your browser. Your images are never uploaded to any server.</p>
                </div>
              </div>
            </div>

            {/* Convert Button */}
            {files.length > 0 && (
              <Button
                variant="primary"
                size="lg"
                onClick={handleConvert}
                disabled={isProcessing}
                isLoading={isProcessing}
                className="w-full"
              >
                Convert to PDF
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
