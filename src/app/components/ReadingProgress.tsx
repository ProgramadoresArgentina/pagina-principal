'use client';

import React, { useState, useEffect } from 'react';
import './ReadingProgress.css';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = trackLength > 0 ? (scrollTop / trackLength) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, progress)));
    };

    calculateProgress();
    window.addEventListener('scroll', calculateProgress);
    window.addEventListener('resize', calculateProgress);

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, []);

  return (
    <div className="reading-progress-bar">
      <div 
        className="reading-progress-fill" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

