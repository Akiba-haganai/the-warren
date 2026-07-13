import { useEffect } from "react";

interface AdUnitProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdUnit({ slot, format = "auto", className, style }: AdUnitProps) {
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className ?? ""}`}

      style={{ display: "block", ...(style || {}) }}

      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}

