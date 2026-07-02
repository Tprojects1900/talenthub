import { useCallback, useState } from "react";
import { toPng } from "html-to-image";

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

export default function useImageExport(defaultRef,bgColor="#0d0f0d") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const exportImage = useCallback(
    async ({
      ref = defaultRef,
      fileName = "topfoot-match",
      download = true,
      pixelRatio = 3,
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

        // const dataUrl = await toPng(node, {
        //   cacheBust: true,
        //   pixelRatio,
        //   backgroundColor: "#0d0f0d",
        //   skipFonts: false,
        //   includeQueryParams: true,
        // });
           const dataUrl = await toPng(node, {
          cacheBust: true,
          pixelRatio,
          backgroundColor: bgColor,
          includeQueryParams: true,
          skipFonts: false,
          skipFonts: true,
        });

        if (download) {
          const link = document.createElement("a");
          link.download = `${fileName}.png`;
          link.href = dataUrl;
          link.click();
        }

        return dataUrl;
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
    exportImage,
    loading,
    error,
  };
}