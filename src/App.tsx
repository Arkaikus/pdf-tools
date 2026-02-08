import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { MainLayout } from './layouts';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { PipelineProvider } from './contexts/PipelineContext';
import { ToastContainer } from './components/common/Toast';
import { PWAInstallPrompt, OfflineIndicator } from './components/common';
import { Home, TaskQueue } from './pages';
import { JpgToPdf } from './features/jpg-to-pdf';
import { MergePdf } from './features/merge-pdf';
import { OrganizePdf } from './features/organize-pdf';
import { initializeTheme } from './utils/storage';
import { registerServiceWorker, skipWaiting } from './utils/sw';

function AppContent() {
  const { addToast } = useToast();

  useEffect(() => {
    // Initialize theme
    initializeTheme();

    // Register service worker
    registerServiceWorker({
      onUpdateAvailable: (registration) => {
        console.log('[App] New version available');
        addToast('info', 'New version available! Click to update.', 0);
        
        // Auto-update after 5 seconds
        setTimeout(() => {
          skipWaiting(registration);
        }, 5000);
      },
      onOfflineReady: () => {
        console.log('[App] App ready to work offline');
        addToast('success', 'App installed! You can now use it offline.', 5000);
      },
      onError: (error) => {
        console.error('[App] Service worker error:', error);
      },
    });
  }, [addToast]);

  return (
    <HashRouter>
      <PipelineProvider>
        <MainLayout>
          <OfflineIndicator />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
            <Route path="/merge-pdf" element={<MergePdf />} />
            <Route path="/organize-pdf" element={<OrganizePdf />} />
            <Route path="/tasks" element={<TaskQueue />} />
          </Routes>
        </MainLayout>
        <ToastContainer />
        <PWAInstallPrompt />
      </PipelineProvider>
    </HashRouter>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
