import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FileText, Plus, Trash2, Upload, X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sentence {
  id: string;
  title: string;
  tags: string[];
  comment: string;
  pdf_url: string;
  created_at: string;
}

const SentenceManager = () => {
  const { toast } = useToast();
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchSentences = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from("commented_sentences")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSentences(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSentences();
  }, [fetchSentences]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") {
      setPdfFile(file);
    } else {
      toast({ title: "Solo file PDF", variant: "destructive" });
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type === "application/pdf") {
      setPdfFile(file);
    }
  };

  const resetForm = () => {
    setTitle("");
    setComment("");
    setTags([]);
    setTagInput("");
    setPdfFile(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!supabase || !title.trim() || !comment.trim()) {
      toast({ title: "Compila titolo e commento", variant: "destructive" });
      return;
    }

    setSaving(true);
    let pdf_url = "";

    if (pdfFile) {
      const fileName = `${Date.now()}_${pdfFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("sentences-pdfs")
        .upload(fileName, pdfFile);

      if (uploadError) {
        toast({ title: "Errore upload PDF", description: uploadError.message, variant: "destructive" });
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("sentences-pdfs")
        .getPublicUrl(uploadData.path);
      pdf_url = urlData.publicUrl;
    }

    const { error } = await supabase.from("commented_sentences").insert({
      title: title.trim(),
      comment: comment.trim(),
      tags,
      pdf_url,
    });

    if (error) {
      toast({ title: "Errore salvataggio", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sentenza pubblicata" });
      resetForm();
      fetchSentences();
    }
    setSaving(false);
  };

  const deleteSentence = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from("commented_sentences").delete().eq("id", id);
    if (!error) {
      setSentences((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Sentenza eliminata" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">Sentenze Commentate</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchSentences} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Nuova
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
          <Input
            placeholder="Titolo della sentenza"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            placeholder="Scrivi il commento alla sentenza..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
          />

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Aggiungi tag (es. Diritto Civile)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={addTag} type="button">
                Aggiungi
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Drag & Drop PDF */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
              dragOver
                ? "border-accent bg-accent/5"
                : "border-border hover:border-muted-foreground/30"
            }`}
          >
            {pdfFile ? (
              <div className="flex items-center justify-center gap-2 text-sm">
                <FileText className="h-5 w-5 text-accent" />
                <span className="font-medium">{pdfFile.name}</span>
                <button onClick={() => setPdfFile(null)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Trascina qui il PDF oppure{" "}
                  <label className="text-accent cursor-pointer hover:underline">
                    selezionalo
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={resetForm}>Annulla</Button>
            <Button size="sm" onClick={handleSubmit} disabled={saving}>
              {saving ? "Pubblicazione..." : "Pubblica"}
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : sentences.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
          Nessuna sentenza pubblicata
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titolo</TableHead>
                <TableHead className="hidden sm:table-cell">Tag</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead className="text-right w-20">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sentences.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <span className="font-medium text-sm">{s.title}</span>
                      <p className="text-xs text-muted-foreground line-clamp-1">{s.comment}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {s.tags?.slice(0, 2).map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                      {(s.tags?.length ?? 0) > 2 && (
                        <span className="text-xs text-muted-foreground">+{s.tags.length - 2}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString("it-IT", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSentence(s.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SentenceManager;
