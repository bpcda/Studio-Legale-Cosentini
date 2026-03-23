import { Helmet } from "react-helmet-async";

const SITE_NAME = "Studio Legale Cosentini";
const BASE_URL = "https://www.cosentini.it";
const DEFAULT_DESCRIPTION =
  "Studio Legale Cosentini. Assistenza legale in diritto civile, amministrativo, recupero crediti, trust e wealth management. Sedi a Napoli e Roma.";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  articleDate?: string;
  articleAuthor?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  type = "website",
  articleDate,
  articleAuthor,
  noindex = false,
  jsonLd,
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Avvocati Napoli e Roma`;
  const url = `${BASE_URL}${path}`;

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: SITE_NAME,
    url: BASE_URL,
    description: DEFAULT_DESCRIPTION,
    areaServed: ["Napoli", "Roma", "Italia"],
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: "Napoli",
        addressCountry: "IT",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "Roma",
        addressCountry: "IT",
      },
    ],
    serviceType: [
      "Diritto Civile",
      "Diritto Amministrativo",
      "Recupero Crediti",
      "Trust",
      "Wealth Management",
    ],
  };

  const defaultJsonLd = type === "article" && articleDate
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        datePublished: articleDate,
        ...(articleAuthor && { author: { "@type": "Person", name: articleAuthor } }),
        publisher: { "@type": "Organization", name: SITE_NAME },
        url,
      }
    : organizationLd;

  const ldData = jsonLd || defaultJsonLd;
  const ldArray = Array.isArray(ldData) ? ldData : [ldData];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="it_IT" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* Article-specific */}
      {type === "article" && articleDate && (
        <meta property="article:published_time" content={articleDate} />
      )}
      {type === "article" && articleAuthor && (
        <meta property="article:author" content={articleAuthor} />
      )}

      {/* JSON-LD */}
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
