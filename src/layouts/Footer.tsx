import { FC } from 'react';

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">PDF Tools</h3>
            <p className="text-sm text-gray-600">
              Privacy-first PDF manipulation tools. All processing happens in your browser.
              No data ever leaves your device.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• JPG to PDF</li>
              <li>• Merge PDFs</li>
              <li>• Organize PDFs</li>
              <li>• More coming soon...</li>
            </ul>
          </div>

          {/* Privacy */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Privacy</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ 100% Client-side</li>
              <li>✓ No data upload</li>
              <li>✓ No tracking</li>
              <li>✓ Open source</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© {currentYear} PDF Tools. Built with ❤️ using Bun and React.</p>
        </div>
      </div>
    </footer>
  );
};
