import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowLeft, Download, Calendar, FileText } from "lucide-react";
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

const SentenzaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentence = async () => {
      if (!supabase || !id) return;
      const { data } = await supabase
        .from("commented_sentences")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setSentence(data);
      setLoading(false);
    };
    fetchSentence();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
            <Skeleton className="h-10 w-24" />
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-6 py-12 space-y-6">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-[70vh] w-full" />
        </main>
      </div>
    );
  }

  if (!sentence) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <FileText className="h-16 w-16 text-muted-foreground/40" />
        <p className="text-muted-foreground">Sentenza non trovata.</p>
        <Link to="/sentenze-commentate">
          <Button variant="outline" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Torna alle sentenze
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoCosentini} alt="Studio Legale Cosentini" className="h-10 w-auto" />
          </Link>
          <Link to="/sentenze-commentate">
            <Button variant="ghost" size="sm" className="gap-1.5 active:scale-[0.97] transition-transform">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Tutte le sentenze</span>
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <ScrollReveal>
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight leading-tight">
              {sentence.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(sentence.created_at).toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              {sentence.author_name && (
                <span className="italic">· di {sentence.author_name}</span>
              )}
            </div>

            {sentence.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {sentence.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="mb-8">
            <h2 className="text-lg font-medium text-foreground mb-3">Commento</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line max-w-prose">
              {sentence.comment}
            </p>
          </div>
        </ScrollReveal>

        {sentence.pdf_url && (
          <ScrollReveal delay={200}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-foreground">Documento</h2>
                <a href={sentence.pdf_url} target="_blank" rel="noopener noreferrer" download>
                  <Button variant="outline" size="sm" className="gap-1.5 active:scale-[0.97] transition-transform">
                    <Download className="h-3.5 w-3.5" />
                    Scarica PDF
                  </Button>
                </a>
              </div>
              <div className="rounded-lg border border-border overflow-hidden bg-muted/30">
                <iframe
                  src={`${sentence.pdf_url}#toolbar=1&navpanes=1&scrollbar=1`}
                  className="w-full h-[75vh] min-h-[500px]"
                  title={sentence.title}
                />
              </div>
            </div>
          </ScrollReveal>
        )}
      </main>
    </div>
  );
};

export default SentenzaDetail;
