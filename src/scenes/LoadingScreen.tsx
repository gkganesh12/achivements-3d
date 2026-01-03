import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import './LoadingScreen.css';

export const LoadingScreen = () => {
  const { setAppState } = useStore();
  const [progress, setProgress] = useState(0);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    // Simulate loading with progress counter
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Flash effect then transition
          setShowFlash(true);
          setTimeout(() => {
            setAppState('MUSEUM');
          }, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [setAppState]);

  if (showFlash) {
    return <div className="flash-screen" />;
  }

  return (
    <div className="loading-screen">
      <div className="loading-content">
        {/* Subtle name */}
        <h1 className="loading-name">Ganesh Khetawat</h1>
        <p className="loading-subtitle">Developer · CEH</p>
        
        {/* Progress bar */}
        <div className="loader-container">
          <div className="loader-bar" style={{ width: `${progress}%` }} />
        </div>
        
        {/* Progress counter */}
        <span className="loader-counter">{progress}</span>
      </div>
    </div>
  );
};
