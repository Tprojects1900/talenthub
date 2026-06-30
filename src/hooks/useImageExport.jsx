import { useCallback, useState } from "react";
import html2canvas from "html2canvas";

export default function useImageExport(defaultRef) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const exportImage = useCallback(
    async ({
      ref = defaultRef,
      fileName = "topfoot-match",
      download = true,
    } = {}) => {
      try {
        setLoading(true);
        setError(null);

        if (!ref?.current) {
          throw new Error("Référence invalide.");
        }

        const element = ref.current;

        // CORRECTIF : On utilise width/height réels et on neutralise le scroll
        const canvas = await html2canvas(element, {
          scale: 3, // Excellente qualité pour le partage
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: "#0d0f0d",
          width: element.scrollWidth,    // Capture la largeur totale de l'élément réel
          height: element.scrollHeight,  // Capture la hauteur totale de l'élément réel
          scrollX: 0,                   // Ne pas prendre en compte le scroll de la page
          scrollY: 0,
          imageTimeout: 10000,
        });

        const dataUrl = canvas.toDataURL("image/png");

        if (download) {
          const link = document.createElement("a");
          link.download = `${fileName}.png`;
          link.href = dataUrl;
          link.click();
          // Pas besoin de revokeObjectURL ici car dataUrl est une String en Base64, pas un Blob Object
        }

        return dataUrl;
      } catch (err) {
        console.error("Erreur export image:", err);
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [defaultRef]
  );

  return {
    exportImage,
    loading,
    error,
  };
}