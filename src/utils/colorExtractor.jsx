// utils/colorExtractor.js


export const getDominantColor = (imgSrc) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return resolve("#1e3a8a");
      }

      // Redimensionner pour traiter plus rapidement
      const size = 150;
      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(img, 0, 0, size, size);

      let imageData;
      try {
        imageData = ctx.getImageData(0, 0, size, size).data;
      } catch {
        return resolve("#1e3a8a");
      }

      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      // Parcourir chaque pixel
      for (let i = 0; i < imageData.length; i += 4) {
        const alpha = imageData[i + 3];
        const red = imageData[i];
        const green = imageData[i + 1];
        const blue = imageData[i + 2];

        // Ignorer les pixels transparents
        if (alpha < 125) continue;

        // Ignorer le blanc et le noir trop purs
        const brightness = (red + green + blue) / 3;
        if (brightness > 230 || brightness < 25) continue;

        r += red;
        g += green;
        b += blue;
        count++;
      }

      if (!count) return resolve("#1e3a8a");

      const avgR = Math.floor(r / count);
      const avgG = Math.floor(g / count);
      const avgB = Math.floor(b / count);

      const toHex = (v) => v.toString(16).padStart(2, "0");

      resolve(
        `#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`.toLowerCase()
      );
    };

    img.onerror = () => resolve("#1e3a8a");
  });
};

/**
 * Génère un identifiant unique standardisé à 8 caractères maximum
 * Structure : 2 lett. Équipe + Index à 2 chiffres + 4 lett. Nom du Joueur
 */
export const generateLicenseId = (teamName, index, playerName) => {
  const cleanTeam = teamName.replace(/[^A-Z]/gi, "").toUpperCase().substring(0, 2);
  const cleanPlayer = playerName.replace(/[^A-Z]/gi, "").toUpperCase().substring(0, 4);
  const padIndex = String(index).padStart(2, "0");
  
  return `${cleanTeam}${padIndex}${cleanPlayer}`.substring(0, 8);
};