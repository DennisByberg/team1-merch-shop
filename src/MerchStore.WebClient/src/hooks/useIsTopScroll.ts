import { useEffect, useState } from 'react';

export function useIsTopScroll() {
  // State to track if the scroll position is at the top
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    // Function to check scroll position
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Return true if at the top, false otherwise
  return isTop;
}
