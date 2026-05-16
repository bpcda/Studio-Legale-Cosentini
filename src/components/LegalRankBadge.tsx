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
  return (
    <div
      className={className}
      aria-label="Legal Rank"
      dangerouslySetInnerHTML={{
        __html: `<script src="https://legalrank.it/badge/embed.js" data-ficha-id="${fichaId}" data-style="${style}"></script>`,
      }}
    />
  );
};

export default LegalRankBadge;
