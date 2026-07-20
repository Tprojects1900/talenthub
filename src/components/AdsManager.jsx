import { useEffect, useRef, useState } from "react";

export default function AdsManager() {
  const adRef = useRef(null);
  const pushed = useRef(false);
  const [show, setShow] = useState(false);


  useEffect(() => {

    if (pushed.current) return;

    pushed.current = true;


    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }


    const timer = setInterval(() => {

      if (adRef.current) {

        const height = adRef.current.offsetHeight;

        if (height > 50) {
          setShow(true);
          clearInterval(timer);
        }

      }

    }, 500);


    return () => clearInterval(timer);


  }, []);



  if (!show) {
    return null;
  }


  return (
    <div
      ref={adRef}
      className="w-full flex justify-center"
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%"
        }}
        data-ad-client="ca-pub-6278463521673732"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}