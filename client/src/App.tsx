import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router';
import { ThemeProvider } from './pages/admin/shared/ThemeContext';
import FontProvider from './components/feature/FontProvider';

function App() {
  return (
    <ThemeProvider>
      <FontProvider>
        <BrowserRouter basename={__BASE_PATH__}>
          <AppRoutes />
        </BrowserRouter>
      </FontProvider>
    </ThemeProvider>
  );
}

export default App;
