import { FC } from 'react';
import { 
  FaImage, 
  FaFileAlt, 
  FaTh, 
  FaCut, 
  FaCompress, 
  FaFileImage,
  FaCheckCircle,
  FaLock,
  FaBolt,
  FaDollarSign
} from 'react-icons/fa';
import { ToolCard } from '../layouts';

export const Home: FC = () => {
  const tools = [
    {
      id: 'jpg-to-pdf',
      title: 'JPG to PDF',
      description: 'Convert images to PDF documents with customizable settings',
      href: '/jpg-to-pdf',
      badge: 'Ready',
      disabled: false,
      icon: <FaImage className="w-6 h-6 text-primary-600" />,
    },
    {
      id: 'merge-pdf',
      title: 'Merge PDF',
      description: 'Combine multiple PDF files into a single document',
      href: '/merge-pdf',
      badge: 'Ready',
      disabled: false,
      icon: <FaFileAlt className="w-6 h-6 text-primary-600" />,
    },
    {
      id: 'organize-pdf',
      title: 'Organize PDF',
      description: 'Reorder, rotate, and delete pages in your PDF',
      href: '/organize-pdf',
      badge: 'Coming Soon',
      disabled: true,
      icon: <FaTh className="w-6 h-6 text-primary-600" />,
    },
    {
      id: 'split-pdf',
      title: 'Split PDF',
      description: 'Extract pages or split PDF into multiple files',
      href: '/split-pdf',
      badge: 'Coming Soon',
      disabled: true,
      icon: <FaCut className="w-6 h-6 text-primary-600" />,
    },
    {
      id: 'compress-pdf',
      title: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining quality',
      href: '/compress-pdf',
      badge: 'Coming Soon',
      disabled: true,
      icon: <FaCompress className="w-6 h-6 text-primary-600" />,
    },
    {
      id: 'pdf-to-jpg',
      title: 'PDF to JPG',
      description: 'Convert PDF pages to image files',
      href: '/pdf-to-jpg',
      badge: 'Coming Soon',
      disabled: true,
      icon: <FaFileImage className="w-6 h-6 text-primary-600" />,
    },
  ];

  return (
    <div className="py-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          <span className="text-gradient">PDF Tools</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Free, privacy-first PDF manipulation tools. All processing happens in your browser
          - no uploads, no tracking, no data collection.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FaCheckCircle className="w-5 h-5 text-green-500" />
            <span>100% Client-side</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCheckCircle className="w-5 h-5 text-green-500" />
            <span>No Data Upload</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCheckCircle className="w-5 h-5 text-green-500" />
            <span>Open Source</span>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20" id="features">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Why Choose PDF Tools?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLock className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your files never leave your device. All processing happens locally in your browser.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBolt className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fast & Efficient</h3>
            <p className="text-gray-600">
              No server uploads means instant processing. Work with large files without waiting.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaDollarSign className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Completely Free</h3>
            <p className="text-gray-600">
              All features are free to use. No subscriptions, no hidden fees, no limitations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
