import { useEffect, useState } from 'react';
import { globalSettingsService } from '../../services/apiService';

interface FontProviderProps {
  children: React.ReactNode;
}

export default function FontProvider({ children }: FontProviderProps) {
  const [fontFamily, setFontFamily] = useState<string>('Montserrat');

  useEffect(() => {
    const applyFont = async () => {
      try {
        const settings = await globalSettingsService.getAll();
        const websiteFont = settings?.website_font || 'Montserrat';
        
        // Set font family
        setFontFamily(websiteFont);
        
        // Apply to CSS variable
        const root = document.documentElement;
        if (websiteFont === 'Source Sans Pro') {
          root.style.setProperty('--website-font', "'Source Sans Pro', sans-serif");
        } else {
          root.style.setProperty('--website-font', "'Montserrat', sans-serif");
        }
      } catch (error) {
        console.error('Error fetching font setting:', error);
        // Default to Montserrat on error
        const root = document.documentElement;
        root.style.setProperty('--website-font', "'Montserrat', sans-serif");
      }
    };

    applyFont();

    // Listen for CMS updates
    const handleRefresh = () => {
      applyFont();
    };
    window.addEventListener('cms-refresh', handleRefresh);
    
    return () => {
      window.removeEventListener('cms-refresh', handleRefresh);
    };
  }, []);

  return <>{children}</>;
}

