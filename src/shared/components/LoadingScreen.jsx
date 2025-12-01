import { useEffect } from 'react';
import Mainlogo from '@/assets/eaarth.png';

function LoadingScreen() {
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else if (theme === 'light') {
      document.body.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }, []);

  return (
    <>
      {/* Loader UI */}
      <div className="fixed top-0 z-100 w-screen bg-background dark:bg-background h-screen flex flex-col justify-center items-center">
        <img src={Mainlogo} className="w-30 lg:w-40 animate-pulse" alt="Eaarth Studios Logo" />
      </div>
    </>
  );
}

export default LoadingScreen;