import { useEffect, useState } from 'react';

export function useSystemDarkMode() {
  // State to track if system prefers dark mode
  const [isDarkMode, setIsDarkMode] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    // MediaQueryList for dark mode preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Handler to update state when system preference changes
    const handleChange = (event: MediaQueryListEvent) => setIsDarkMode(event.matches);

    // Listen for changes in system color scheme
    mediaQuery.addEventListener('change', handleChange);

    // Clean up event listener on unmount
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Return current dark mode state and setter
  return [isDarkMode, setIsDarkMode] as const;
}
