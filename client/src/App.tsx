import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './router';
import { ThemeProvider } from './pages/admin/shared/ThemeContext';
import FontProvider from './components/feature/FontProvider';
import { useEffect, useState } from 'react';
import PageLoader from './components/feature/PageLoader';

function AppContent() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800); // short, smooth loader
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isLoading && <PageLoader />}
      <AppRoutes />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <FontProvider>
        <BrowserRouter basename={__BASE_PATH__}>
          <AppContent />
        </BrowserRouter>
      </FontProvider>
    </ThemeProvider>
  );
}

export default App;
