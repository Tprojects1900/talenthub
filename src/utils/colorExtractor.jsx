// utils/colorExtractor.js


export const getDominantColor = (imgSrc) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    //  onload/onerror DOIVENT être assignés AVANT img.src
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return resolve("#1e3a8a");
      }

      const size = 150;
      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(img, 0, 0, size, size);

      let imageData;
      try {
        imageData = ctx.getImageData(0, 0, size, size).data;
      } catch (err) {
        console.warn("Canvas tainted (CORS) :", err);
        return resolve("#1e3a8a");
      }

      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      for (let i = 0; i < imageData.length; i += 4) {
        const alpha = imageData[i + 3];
        const red = imageData[i];
        const green = imageData[i + 1];
        const blue = imageData[i + 2];

        if (alpha < 125) continue;

        const brightness = (red + green + blue) / 3;
        // Filtres assouplis pour ne pas tout exclure sur un logo N&B
        if (brightness > 245 || brightness < 10) continue;

        r += red;
        g += green;
        b += blue;
        count++;
      }

      // Fallback : si le filtre a tout exclu, on refait une passe SANS filtre de luminosité
      if (!count) {
        for (let i = 0; i < imageData.length; i += 4) {
          const alpha = imageData[i + 3];
          if (alpha < 125) continue;
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
          count++;
        }
      }

      if (!count) return resolve("#1e3a8a");

      const avgR = Math.floor(r / count);
      const avgG = Math.floor(g / count);
      const avgB = Math.floor(b / count);

      const toHex = (v) => v.toString(16).padStart(2, "0");

      resolve(`#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`.toLowerCase());
    };

    img.onerror = (err) => {
      console.warn("Erreur de chargement image :", err);
      resolve("#1e3a8a");
    };

    // src assigné en dernier, une fois les handlers en place
    img.src = imgSrc;
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