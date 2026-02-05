

import { type ReactNode } from 'react';
import Header from './Header';

interface MainLayoutProps {
  children: ReactNode;
  disableOverflowX?: boolean;
}

export default function MainLayout({ children, disableOverflowX = false }: MainLayoutProps) {
  // Commented out overflow-x-hidden for venwind page as requested
  // .overflow-x-hidden { overflow-x: hidden; } - disabled when disableOverflowX is true
  const overflowClass = disableOverflowX ? '' : 'overflow-x-hidden';
  
  return (
    <div className={`flex flex-col min-h-screen ${overflowClass}`}>
      <Header />
      <main className={`flex-grow ${overflowClass}`}>
        {children}
      </main>
    </div>
  );
}
