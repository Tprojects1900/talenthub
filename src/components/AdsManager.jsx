import { useEffect, useRef } from "react";

export default function AdsManager() {
  const adRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!adRef.current) return;

      // Évite de pousser deux fois la même annonce
      if (adRef.current.getAttribute("data-adsbygoogle-status")) {
        return;
      }

      // Vérifie que le conteneur a une largeur
      if (adRef.current.offsetWidth === 0) {
        return;
      }

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error("AdSense:", error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex justify-center my-4">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-6278463521673732"
        data-ad-slot="5121065354"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}