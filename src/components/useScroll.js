import { useState, useEffect } from 'react';

function useScroll() {
  const [scrollingDown, setScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setScrollingDown(true); // User is scrolling down
    } else {
      setScrollingDown(false); // User is scrolling up
    }

    setLastScrollY(window.scrollY); // Update the last scroll position
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return scrollingDown;
}

export default useScroll;
