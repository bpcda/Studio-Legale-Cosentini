import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ScrollReveal from "@/components/ScrollReveal";
import { FileText, ArrowLeft, ExternalLink, Calendar, BookOpen } from "lucide-react";
import logoCosentini from "@/assets/logo-cosentini.png";

interface Sentence {
  id: string;
  title: string;
  tags: string[];
  comment: string;
  pdf_url: string;
  author_name: string | null;
  author_team_member_id: string | null;
  created_at: string;
}

const SentenzeCommentate = () => {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from("commented_sentences")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setSentences(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              Sentenze Commentate
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Raccolta di sentenze rilevanti con analisi e commento a cura dello Studio.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-6 space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : sentences.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p>Nessuna sentenza pubblicata al momento.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sentences.map((s, idx) => (
              <ScrollReveal key={s.id} delay={idx * 80}>
                <article className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div className="space-y-1.5">
                      <Link to={`/sentenze-commentate/${s.id}`} className="hover:underline underline-offset-2">
                        <h2 className="text-lg font-medium text-foreground leading-snug">
                          {s.title}
                        </h2>
                      </Link>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(s.created_at).toLocaleDateString("it-IT", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link to={`/sentenze-commentate/${s.id}`}>
                        <Button variant="default" size="sm" className="gap-1.5 active:scale-[0.97] transition-transform">
                          <BookOpen className="h-3.5 w-3.5" />
                          Leggi
                        </Button>
                      </Link>
                      {s.pdf_url && (
                        <a href={s.pdf_url} target="_blank" rel="noopener noreferrer" download>
                          <Button variant="outline" size="sm" className="gap-1.5 active:scale-[0.97] transition-transform">
                            <ExternalLink className="h-3.5 w-3.5" />
                            PDF
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>

                  {s.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {s.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {s.author_name && (
                    <p className="text-xs text-muted-foreground/70 mb-2 italic">
                      di {s.author_name}
                    </p>
                  )}

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {(() => {
                      const plain = s.comment.replace(/<[^>]*>/g, "");
                      const words = plain.split(/\s+/).filter(Boolean);
                      return words.length > 50
                        ? words.slice(0, 50).join(" ") + "…"
                        : plain;
                    })()}
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

export default SentenzeCommentate;
