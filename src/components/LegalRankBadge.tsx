import { useEffect, useRef } from "react";

interface LegalRankBadgeProps {
  fichaId?: string;
  style?: string;
  className?: string;
}

const LegalRankBadge = ({
  fichaId = "38702",
  style = "standard",
  className,
}: LegalRankBadgeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const script = document.createElement("script");
    script.src = "https://legalrank.it/badge/embed.js";
    script.async = true;
    script.setAttribute("data-ficha-id", fichaId);
    script.setAttribute("data-style", style);
    containerRef.current.appendChild(script);
  }, [fichaId, style]);

  return <div ref={containerRef} className={className} aria-label="Legal Rank" />;
};

export default LegalRankBadge;
