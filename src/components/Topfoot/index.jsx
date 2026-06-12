import styles from "./styles.module.css";

export default function TopFoot() {
  return (
    <div className={styles.container}>
      <svg viewBox="0 0 200 220" className={styles.svg}>

        {/* Ballon contour */}
        <circle cx="100" cy="110" r="60"
          className={`${styles.draw} ${styles.delay1}`}
        />

        {/* Hexagone central */}
        <polygon
          points="100,80 120,95 110,120 90,120 80,95"
          className={`${styles.draw} ${styles.delay2}`}
        />

        {/* Lignes ballon */}
        <path d="M100 80 L100 50"
          className={`${styles.draw} ${styles.delay3}`}
        />
        <path d="M120 95 L150 85"
          className={`${styles.draw} ${styles.delay3}`}
        />
        <path d="M110 120 L130 150"
          className={`${styles.draw} ${styles.delay3}`}
        />
        <path d="M90 120 L70 150"
          className={`${styles.draw} ${styles.delay3}`}
        />
        <path d="M80 95 L50 85"
          className={`${styles.draw} ${styles.delay3}`}
        />

        {/* Polygones autour */}
        <polygon points="100,50 115,65 85,65"
          className={`${styles.draw} ${styles.delay4}`}
        />
        <polygon points="150,85 140,105 160,105"
          className={`${styles.draw} ${styles.delay4}`}
        />
        <polygon points="130,150 110,140 140,165"
          className={`${styles.draw} ${styles.delay4}`}
        />
        <polygon points="70,150 90,140 60,165"
          className={`${styles.draw} ${styles.delay4}`}
        />
        <polygon points="50,85 60,105 40,105"
          className={`${styles.draw} ${styles.delay4}`}
        />

        {/* Sifflet */}
        <circle cx="130" cy="40" r="18"
          className={`${styles.draw} ${styles.delay5}`}
        />

        <circle cx="130" cy="40" r="6"
          className={`${styles.draw} ${styles.delay5}`}
        />

        <circle cx="110" cy="40" r="4"
          className={`${styles.draw} ${styles.delay5}`}
        />

        <path d="M148 40 L180 40 L180 48 L155 48"
          className={`${styles.draw} ${styles.delay6}`}
        />

        {/* Texte */}
        <text
          x="100"
          y="210"
          textAnchor="middle"
          className={styles.text}
        >
          TOP FOOT
        </text>

      </svg>
    </div>
  );
}