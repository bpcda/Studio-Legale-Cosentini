import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FileText, Plus, Trash2, Upload, X, RefreshCw, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface TeamMember {
  id: string;
  full_name: string;
}

const SentenceManager = () => {
  const { toast } = useToast();
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Author state: "external" or a team member id
  const [authorType, setAuthorType] = useState<string>("external");
  const [externalAuthorName, setExternalAuthorName] = useState("");

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

  const fetchTeamMembers = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("team_members")
      .select("id, full_name")
      .order("display_order");
    if (data) setTeamMembers(data);
  }, []);

  useEffect(() => {
    fetchSentences();
    fetchTeamMembers();
  }, [fetchSentences, fetchTeamMembers]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
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
    if (file?.type === "application/pdf") setPdfFile(file);
  };

  const resetForm = () => {
    setTitle("");
    setComment("");
    setTags([]);
    setTagInput("");
    setPdfFile(null);
    setExistingPdfUrl("");
    setShowForm(false);
    setEditingId(null);
    setAuthorType("external");
    setExternalAuthorName("");
  };

  const startEdit = (s: Sentence) => {
    setEditingId(s.id);
    setTitle(s.title);
    setComment(s.comment);
    setTags(s.tags || []);
    setExistingPdfUrl(s.pdf_url || "");
    setPdfFile(null);
    if (s.author_team_member_id) {
      setAuthorType(s.author_team_member_id);
    } else {
      setAuthorType("external");
      setExternalAuthorName(s.author_name || "");
    }
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!supabase || !title.trim() || !comment.trim()) {
      toast({ title: "Compila titolo e commento", variant: "destructive" });
      return;
    }

    setSaving(true);
    let pdf_url = existingPdfUrl;

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

    const isTeamMember = authorType !== "external";
    const teamMemberName = isTeamMember
      ? teamMembers.find((m) => m.id === authorType)?.full_name || null
      : null;

    const payload = {
      title: title.trim(),
      comment: comment.trim(),
      tags,
      pdf_url,
      author_name: isTeamMember ? teamMemberName : (externalAuthorName.trim() || "Autore esterno"),
      author_team_member_id: isTeamMember ? authorType : null,
    };

    if (editingId) {
      const { error } = await supabase
        .from("commented_sentences")
        .update(payload)
        .eq("id", editingId);
      if (error) {
        toast({ title: "Errore aggiornamento", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Sentenza aggiornata" });
        resetForm();
        fetchSentences();
      }
    } else {
      const { error } = await supabase.from("commented_sentences").insert(payload);
      if (error) {
        toast({ title: "Errore salvataggio", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Sentenza pubblicata" });
        resetForm();
        fetchSentences();
      }
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

  const getAuthorLabel = (s: Sentence) => {
    if (s.author_team_member_id) {
      const member = teamMembers.find((m) => m.id === s.author_team_member_id);
      return member?.full_name || "—";
    }
    return s.author_name || "—";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">Sentenze Commentate</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchSentences} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          {editingId ? (
            <Button variant="outline" size="sm" onClick={resetForm}>Annulla modifica</Button>
          ) : (
            <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Nuova
            </Button>
          )}
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

          <RichTextEditor
            content={comment}
            onChange={setComment}
            placeholder="Scrivi il commento alla sentenza..."
          />

          {/* Author */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Autore</label>
            <Select value={authorType} onValueChange={(v) => { setAuthorType(v); setExternalAuthorName(""); }}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona autore" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="external">Autore esterno</SelectItem>
                {teamMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {authorType === "external" && (
              <Input
                placeholder="Nome autore esterno (opzionale)"
                value={externalAuthorName}
                onChange={(e) => setExternalAuthorName(e.target.value)}
              />
            )}
          </div>

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
            ) : existingPdfUrl ? (
              <div className="flex items-center justify-center gap-2 text-sm">
                <FileText className="h-5 w-5 text-accent" />
                <span className="text-muted-foreground">PDF già caricato — trascina per sostituire</span>
                <label className="text-accent cursor-pointer hover:underline">
                  oppure seleziona
                  <input type="file" accept="application/pdf" className="hidden" onChange={handleFileSelect} />
                </label>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Trascina qui il PDF oppure{" "}
                  <label className="text-accent cursor-pointer hover:underline">
                    selezionalo
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleFileSelect} />
                  </label>
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={resetForm}>Annulla</Button>
            <Button size="sm" onClick={handleSubmit} disabled={saving}>
              {saving ? "Salvataggio..." : editingId ? "Aggiorna" : "Pubblica"}
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
                <TableHead className="hidden sm:table-cell">Autore</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead className="text-right w-24">Azioni</TableHead>
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
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {getAuthorLabel(s)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString("it-IT", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(s)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSentence(s.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
