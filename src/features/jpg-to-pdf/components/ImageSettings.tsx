import { FC } from 'react';
import type { ImageToPDFOptions } from '../../../types/pdf.types';

interface ImageSettingsProps {
  options: ImageToPDFOptions;
  onChange: (options: ImageToPDFOptions) => void;
}

export const ImageSettings: FC<ImageSettingsProps> = ({ options, onChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-soft p-6 space-y-4">
      <h3 className="font-bold text-lg text-gray-900 mb-4">PDF Settings</h3>

      {/* Page Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Page Size
        </label>
        <select
          value={options.pageSize || 'A4'}
          onChange={(e) =>
            onChange({ ...options, pageSize: e.target.value as any })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
        >
          <option value="A4">A4</option>
          <option value="Letter">Letter</option>
          <option value="Legal">Legal</option>
        </select>
      </div>

      {/* Orientation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Orientation
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => onChange({ ...options, orientation: 'portrait' })}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
              options.orientation === 'portrait'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            Portrait
          </button>
          <button
            onClick={() => onChange({ ...options, orientation: 'landscape' })}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
              options.orientation === 'landscape'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            Landscape
          </button>
        </div>
      </div>

      {/* Margin */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Margin: {options.margin || 20}px
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={options.margin || 20}
          onChange={(e) => onChange({ ...options, margin: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.fitToPage !== false}
            onChange={(e) => onChange({ ...options, fitToPage: e.target.checked })}
            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Fit images to page</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.maintainAspectRatio !== false}
            onChange={(e) =>
              onChange({ ...options, maintainAspectRatio: e.target.checked })
            }
            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Maintain aspect ratio</span>
        </label>
      </div>
    </div>
  );
};
