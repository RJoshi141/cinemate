import React, { useEffect, useState } from 'react';
import circle from './logo/circle.png'; // Adjust the path if needed
import reel from './logo/reel.png';

const LogoAnimation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 5000); // Fades out after 5 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="logo-container">
      <div className="circle">
        <img src={circle} alt="Circle" className="circle-img" />
      </div>
      <div className="reel">
        <img src={reel} alt="Reel" className="reel-img" />
      </div>
      <div className="logo-text">CINEMATE</div>
      <p className="logo-subtext">Curating your next cinematic escape</p>
    </div>
  );
};

export default LogoAnimation;
