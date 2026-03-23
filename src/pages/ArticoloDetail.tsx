import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
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

const ArticoloDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!supabase || !id) return;
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setArticle(data);
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
            <Skeleton className="h-10 w-24" />
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-6 py-12 space-y-6">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-[50vh] w-full" />
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <FileText className="h-16 w-16 text-muted-foreground/40" />
        <p className="text-muted-foreground">Articolo non trovato.</p>
        <Link to="/articoli">
          <Button variant="outline" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Torna agli articoli
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoCosentini} alt="Studio Legale Cosentini" className="h-10 w-auto" />
          </Link>
          <Link to="/articoli">
            <Button variant="ghost" size="sm" className="gap-1.5 active:scale-[0.97] transition-transform">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Tutti gli articoli</span>
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <ScrollReveal>
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight leading-tight" style={{ textWrap: "balance" as any }}>
              {article.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(article.date).toLocaleDateString("it-IT", {
                  day: "2-digit", month: "long", year: "numeric",
                })}
              </div>
              {article.author_name && (
                <span className="italic">· di {article.author_name}</span>
              )}
            </div>

            {article.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div
            className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content || "" }}
          />
        </ScrollReveal>
      </main>
    </div>
  );
};

export default ArticoloDetail;
