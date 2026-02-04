import { useState, useEffect } from 'react';
import './index.css';
import { MainLayout } from './layouts';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/common/Toast';
import { Home } from './pages';
import { JpgToPdf } from './features/jpg-to-pdf';
import { initializeTheme } from './utils/storage';

type Route = '/' | '/jpg-to-pdf';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('/');

  useEffect(() => {
    // Initialize theme
    initializeTheme();

    // Simple routing
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/';
      setCurrentRoute(hash as Route);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderRoute = () => {
    switch (currentRoute) {
      case '/jpg-to-pdf':
        return <JpgToPdf />;
      default:
        return <Home />;
    }
  };

  return (
    <ToastProvider>
      <MainLayout>{renderRoute()}</MainLayout>
      <ToastContainer />
    </ToastProvider>
  );
}

export default App;
