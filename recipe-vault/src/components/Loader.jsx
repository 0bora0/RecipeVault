import { useEffect, useState } from 'react';
import '../styles/Loader.css';
import loadingGif from '../assets/loading.gif';

export default function Loader({ isLoading }) {
  const [showLoader, setShowLoader] = useState(true);
  const [minDisplayTimePassed, setMinDisplayTimePassed] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const minTimer = setTimeout(() => {
      setMinDisplayTimePassed(true);
    }, 5000);

    const startTime = Date.now();
    const duration = 5000;
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
    }, 16);

    return () => {
      clearTimeout(minTimer);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (minDisplayTimePassed && !isLoading) {
      setShowLoader(false);
    }
  }, [minDisplayTimePassed, isLoading]);

  if (!showLoader) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="loader-gif-container">
          <img src={loadingGif} alt="Loading" className="loader-gif" />
          <div className="loader-orbital-ring"></div>
        </div>
        <p className="loader-text">Loading in progress...</p>
        <div className="progress-track">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="loader-percentage">{Math.round(progress)}%</div>
      </div>
    </div>
  );
}