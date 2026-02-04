import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { MainLayout } from './layouts';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/common/Toast';
import { Home, TaskQueue } from './pages';
import { JpgToPdf } from './features/jpg-to-pdf';
import { MergePdf } from './features/merge-pdf';
import { initializeTheme } from './utils/storage';

export function App() {
  useEffect(() => {
    // Initialize theme
    initializeTheme();
  }, []);

  return (
    <BrowserRouter>
      <ToastProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
            <Route path="/merge-pdf" element={<MergePdf />} />
            <Route path="/tasks" element={<TaskQueue />} />
          </Routes>
        </MainLayout>
        <ToastContainer />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
