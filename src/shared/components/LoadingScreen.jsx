import { useEffect } from 'react';
import Mainlogo from '@/assets/eaarth.webp';
import { Loader } from 'lucide-react';

function LoadingScreen({ variant = "default" }) {
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
      <div className={`fixed top-0 left-0 z-50 w-screen h-screen flex flex-col justify-center items-center ${variant === "glass" ? "backdrop-blur-sm bg-background/10" : "bg-background"}`}>
        <img src={Mainlogo} className="w-30 lg:w-40 animate-pulse" alt="Eaarth Studios Logo" />
        {variant === "glass" &&

          <Loader className='size-6 animate-spin text-primary' />
        }
      </div>
    </>
  );
}

export default LoadingScreen;