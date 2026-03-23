import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ScrollReveal from "@/components/ScrollReveal";
import { FileText, ArrowLeft, ExternalLink, Calendar, BookOpen } from "lucide-react";
import logoCosentini from "@/assets/logo-cosentini.png";

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  external_url: string | null;
  tags: string[];
  author_name: string | null;
  date: string;
  created_at: string;
}

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

const truncate = (text: string, wordLimit: number) => {
  const plain = stripHtml(text);
  const words = plain.split(/\s+/).filter(Boolean);
  return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "…" : plain;
};

const Articoli = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from("articles")
        .select("*")
        .order("date", { ascending: false });
      if (data) setArticles(data);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  const getLink = (a: Article) =>
    a.external_url ? a.external_url : `/articoli/${a.id}`;

  const isExternal = (a: Article) => !!a.external_url;

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoCosentini} alt="Studio Legale Cosentini" className="h-10 w-auto" />
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1.5 active:scale-[0.97] transition-transform">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Torna al sito</span>
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <ScrollReveal>
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">
              Articoli e Approfondimenti
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Pubblicazioni, analisi e contributi a cura dello Studio.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-6 space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p>Nessun articolo pubblicato al momento.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((a, idx) => (
              <ScrollReveal key={a.id} delay={idx * 80}>
                <article className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="space-y-1.5">
                      {isExternal(a) ? (
                        <a href={a.external_url!} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-2">
                          <h2 className="text-lg font-medium text-foreground leading-snug">{a.title}</h2>
                        </a>
                      ) : (
                        <Link to={`/articoli/${a.id}`} className="hover:underline underline-offset-2">
                          <h2 className="text-lg font-medium text-foreground leading-snug">{a.title}</h2>
                        </Link>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(a.date).toLocaleDateString("it-IT", {
                          day: "2-digit", month: "long", year: "numeric",
                        })}
                        {a.author_name && (
                          <span className="italic">· di {a.author_name}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {isExternal(a) ? (
                        <a href={a.external_url!} target="_blank" rel="noopener noreferrer">
                          <Button variant="default" size="sm" className="gap-1.5 active:scale-[0.97] transition-transform">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Leggi
                          </Button>
                        </a>
                      ) : (
                        <Link to={`/articoli/${a.id}`}>
                          <Button variant="default" size="sm" className="gap-1.5 active:scale-[0.97] transition-transform">
                            <BookOpen className="h-3.5 w-3.5" />
                            Leggi
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  {a.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {a.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}

                  {isExternal(a) && (
                    <Badge variant="outline" className="text-xs mb-3">Articolo esterno</Badge>
                  )}

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {truncate(a.excerpt || a.content || "", 50)}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Articoli;
