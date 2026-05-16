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
    const container = containerRef.current;
    const html = `<script src="https://legalrank.it/badge/embed.js" data-ficha-id="${fichaId}" data-style="${style}"></script>`;
    const range = document.createRange();
    range.selectNode(container);
    const fragment = range.createContextualFragment(html);
    container.appendChild(fragment);
  }, [fichaId, style]);

  return <div ref={containerRef} className={className} aria-label="Legal Rank" />;
};

export default LegalRankBadge;
