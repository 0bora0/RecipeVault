import { useEffect, useState } from 'react';
import '../styles/Loader.css';
import loadingGif from '../assets/loading.gif';

export default function Loader({ onDone }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const minVisibleTime = 9000; // 3 секунди
    const startTime = Date.now();
    const duration = 5000; // цялата продължителност на прогрес лентата (примерно)

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
    }, 16);

    const timer = setTimeout(() => {
      setVisible(false);
      if (onDone) onDone(); // ако родителят иска да знае кога е приключил
    }, minVisibleTime);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="loader-gif-container">
          <img src={loadingGif} alt="Loading" className="loader-gif" />
          <div className="loader-border-animation"></div>
        </div>
        <p className="loader-text">Loading in progress...</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}
