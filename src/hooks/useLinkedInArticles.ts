import { useState, useEffect } from "react";

export interface LinkedInArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  url: string;
  source: string;
}

// Real articles by Avv. Sergio Cosentini — used as fallback when DB is unavailable
const FALLBACK_ARTICLES: LinkedInArticle[] = [
  {
    id: "1",
    title: "L'abrogazione del delitto di abuso d'ufficio",
    excerpt:
      "«Se vogliamo che tutto rimanga com'è, bisogna che tutto cambi». Analisi della portata dell'abrogazione e delle questioni di legittimità costituzionale per eventuale violazione degli artt. 11 e 117 Cost.",
    date: "2024-09-15",
    url: "https://www.filodiritto.com/labrogazione-dellabuso-dufficio",
    source: "Filodiritto",
  },
  {
    id: "2",
    title: "I reati di cui alla legge 22/2022: profili di vantaggio e obblighi di custodia",
    excerpt:
      "Dalla convenzione di Nicosia alla legge 22/2022: un'analisi in ottica 231 dei profili di vantaggio e degli obblighi di custodia e protezione del patrimonio culturale.",
    date: "2022-09-01",
    url: "https://www.filodiritto.com/i-reati-di-cui-alla-legge-222022-profili-di-vantaggio-e-obblighi-di-custodia-0",
    source: "Filodiritto — Sistema 231",
  },
  {
    id: "3",
    title: "Modelli Organizzativi 231/01 e Responsabilità Amministrativa degli Enti",
    excerpt:
      "Consulenza e assistenza nell'implementazione dei modelli di organizzazione, gestione e controllo previsti dal D.Lgs. 231/2001 per società a partecipazione pubblica e privata.",
    date: "2023-03-20",
    url: "https://www.linkedin.com/in/scosentini/",
    source: "LinkedIn",
  },
  {
    id: "4",
    title: "Project Financing e Servizi Pubblici Locali: quadro normativo",
    excerpt:
      "Un approfondimento sugli strumenti di finanza di progetto per la valorizzazione del territorio e la gestione dei servizi pubblici locali.",
    date: "2023-06-12",
    url: "https://www.linkedin.com/in/scosentini/",
    source: "LinkedIn",
  },
  {
    id: "5",
    title: "La Commissione 231 e Anticorruzione dell'Ordine degli Avvocati di Napoli",
    excerpt:
      "Riflessioni sul ruolo della Commissione 231 istituita dal Consiglio dell'Ordine degli Avvocati di Napoli e le sfide nella prevenzione della corruzione.",
    date: "2022-11-08",
    url: "https://www.linkedin.com/in/scosentini/",
    source: "LinkedIn",
  },
];

import { databases, isConfigured, Query, DB_ID, COLLECTIONS } from "@/lib/appwrite";

async function fetchFromDb(): Promise<LinkedInArticle[] | null> {
  if (!isConfigured) return null;
  try {
    const res = await databases.listDocuments(DB_ID, COLLECTIONS.linkedin_articles, [
      Query.orderDesc("date"),
      Query.limit(5),
    ]);
    if (!res.documents.length) return null;
    return res.documents.map((row: any) => ({
      id: row.$id,
      title: row.title,
      excerpt: row.excerpt,
      date: row.date,
      url: row.url,
      source: row.source ?? "LinkedIn",
    }));
  } catch {
    return null;
  }
}

export function useLinkedInArticles() {
  const [articles, setArticles] = useState<LinkedInArticle[]>(FALLBACK_ARTICLES);
  const [isLoading, setIsLoading] = useState(true);
  const [fromDb, setFromDb] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchFromDb().then((dbArticles) => {
      if (cancelled) return;
      if (dbArticles) {
        setArticles(dbArticles);
        setFromDb(true);
      }
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { articles, isLoading, fromDb };
}
