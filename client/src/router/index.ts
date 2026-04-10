import { useNavigate, useLocation, type NavigateFunction } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import { useEffect } from "react";
import routes from "./config";
import { usePageTracking } from "../hooks/usePageTracking";

let navigateResolver: (navigate: ReturnType<typeof useNavigate>) => void;

declare global {
  interface Window {
    REACT_APP_NAVIGATE: ReturnType<typeof useNavigate>;
  }
}

export const navigatePromise = new Promise<NavigateFunction>((resolve) => {
  navigateResolver = resolve;
});

export function AppRoutes() {
  const element = useRoutes(routes);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Track page views on route changes
  usePageTracking();
  
  useEffect(() => {
    window.REACT_APP_NAVIGATE = navigate;
    navigateResolver(window.REACT_APP_NAVIGATE);
  }, [navigate]);
  
  // Debug: Log current route
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('📍 Current route:', location.pathname);
      console.log('📍 Available routes count:', routes.length);
      console.log('📍 Gallery year route exists:', routes.some(r => r.path === '/gallery-:year'));
    }
  }, [location.pathname]);
  
  return element;
}
