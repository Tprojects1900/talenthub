import React, { useState, useEffect } from 'react';

const FootballLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        // Incrémentation aléatoire entre 2% et 10%
        const nextProgress = prevProgress + Math.floor(Math.random() * 8) + 2;
        
        if (nextProgress >= 100) {
          clearInterval(interval);
          // Déclenche une fonction callback optionnelle quand le chargement est fini
          if (onComplete) {
            setTimeout(onComplete, 500); 
          }
          return 100;
        }
        return nextProgress;
      });
    }, 150); // Vitesse de rafraîchissement

    return () => clearInterval(interval);
  }, [onComplete]);

  // Styles en ligne pour garantir le centrage parfait et le look "Football App"
  const styles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#121824', // Fond sombre sport
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      zIndex: 9999, // Reste au-dessus de l'application
    },
    ballWrapper: {
      width: '80px',
      height: '80px',
      animation: 'spin 2s linear infinite',
    },
    text: {
      fontSize: '1.2rem',
      fontWeight: '600',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: '#00ff87', // Vert pelouse néon
    },
    barContainer: {
      width: '250px',
      height: '8px',
      backgroundColor: '#1f293d',
      borderRadius: '4px',
      overflow: 'hidden',
      boxShadow: '0 0 10px rgba(0, 255, 135, 0.2)',
    },
    bar: {
      height: '100%',
      width: `${progress}%`,
      background: 'linear-gradient(90deg, #00ff87, #60efff)',
      borderRadius: '4px',
      transition: 'width 0.4s ease-out',
    },
    percentage: {
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#a0aec0',
    },
  };

  return (
    <div style={styles.container}>
      {/* Injection de l'animation de rotation dans le document */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* SVG du Ballon de Football */}
      <div style={styles.ballWrapper}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#121824" strokeWidth="3"/>
          <polygon points="50,38 61,46 57,59 43,59 39,46" fill="#121824"/>
          <path d="M50,38 L50,15 M61,46 L80,38 M57,59 L70,78 M43,59 L30,78 M39,46 L20,38" stroke="#121824" strokeWidth="3" strokeLinecap="round"/>
          <polygon points="50,2 59,15 41,15" fill="#121824"/>
          <polygon points="90,25 80,38 95,45" fill="#121824"/>
          <polygon points="78,90 70,78 85,73" fill="#121824"/>
          <polygon points="22,90 30,78 15,73" fill="#121824"/>
          <polygon points="10,25 20,38 5,45" fill="#121824"/>
        </svg>
      </div>

      {/* Texte dynamique */}
      <div style={styles.text}>
        {progress === 100 ? 'KICK OFF !' : 'TOP FOOT...'}
      </div>

      {/* Barre de progression */}
      <div style={styles.barContainer}>
        <div style={styles.bar}></div>
      </div>

      {/* Pourcentage */}
      <div style={styles.percentage}>{progress}%</div>
    </div>
  );
};

export default FootballLoader;