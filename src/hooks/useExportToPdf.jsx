import { useCallback, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForFonts = async () => {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
};

const waitForImages = async (element) => {
  const images = Array.from(element.querySelectorAll("img"));

  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );
};

export default function useExportPdf(defaultRef, bgColor = "#0d0f0d") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const exportPdf = useCallback(
    async ({
      ref = defaultRef,
      fileName = "topfoot-match",
      download = true,
      pixelRatio = 3,
      // "fit" = un PDF à la taille exacte du contenu (pas de marges/pages A4)
      // "a4"  = PDF au format A4, contenu adapté à la page (portrait ou paysage auto)
      mode = "fit",
      margin = 0, // en mm, utilisé seulement si mode = "a4"
    } = {}) => {
      try {
        setLoading(true);
        setError(null);

        if (!ref?.current) {
          throw new Error("Référence invalide.");
        }

        const node = ref.current;

        await waitForFonts();
        await waitForImages(node);

        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);

        await wait(100);

        const dataUrl = await toPng(node, {
          cacheBust: true,
          pixelRatio,
          backgroundColor: bgColor,
          includeQueryParams: true,
          skipFonts: false,
        });

        // Dimensions réelles de l'image générée (en px)
        const img = new Image();
        img.src = dataUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const imgWidthPx = img.width;
        const imgHeightPx = img.height;

        // conversion px -> mm (96 DPI de base, on annule le pixelRatio)
        const pxToMm = (px) => (px / pixelRatio / 96) * 25.4;
        const widthMm = pxToMm(imgWidthPx);
        const heightMm = pxToMm(imgHeightPx);

        let pdf;

        if (mode === "fit") {
          // PDF à la taille exacte du contenu
          const orientation = widthMm >= heightMm ? "l" : "p";
          pdf = new jsPDF({
            orientation,
            unit: "mm",
            format: [widthMm, heightMm],
          });
          pdf.addImage(dataUrl, "PNG", 0, 0, widthMm, heightMm);
        } else {
          // PDF au format A4 (595 x 842 pt ~ 210 x 297 mm), contenu adapté
          const orientation = widthMm >= heightMm ? "l" : "p";
          pdf = new jsPDF({
            orientation,
            unit: "mm",
            format: "a4",
          });

          const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;
          const pageHeight = pdf.internal.pageSize.getHeight() - margin * 2;

          const ratio = Math.min(pageWidth / widthMm, pageHeight / heightMm);
          const finalWidth = widthMm * ratio;
          const finalHeight = heightMm * ratio;

          const x = margin + (pageWidth - finalWidth) / 2;
          const y = margin + (pageHeight - finalHeight) / 2;

          pdf.addImage(dataUrl, "PNG", x, y, finalWidth, finalHeight);
        }

        if (download) {
          pdf.save(`${fileName}.pdf`);
        }

        return pdf;
      } catch (err) {
        console.error(err);
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [defaultRef]
  );

  return {
    exportPdf,
    loading,
    error,
  };
}