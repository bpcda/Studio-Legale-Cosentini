import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FileText, Plus, Trash2, X, RefreshCw, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string | null;
  external_url: string | null;
  tags: string[];
  author_name: string | null;
  author_team_member_id: string | null;
  date: string;
  created_at: string;
}

interface TeamMember {
  id: string;
  full_name: string;
}

const ArticleManager = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [articleDate, setArticleDate] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [authorType, setAuthorType] = useState<string>("external");
  const [externalAuthorName, setExternalAuthorName] = useState("");
  const [isExternal, setIsExternal] = useState(false);

  const fetchArticles = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("date", { ascending: false });
    if (data) setArticles(data);
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
    fetchArticles();
    fetchTeamMembers();
  }, [fetchArticles, fetchTeamMembers]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((x) => x !== tag));

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setExternalUrl("");
    setArticleDate("");
    setTags([]);
    setTagInput("");
    setAuthorType("external");
    setExternalAuthorName("");
    setIsExternal(false);
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (a: Article) => {
    setEditingId(a.id);
    setTitle(a.title);
    setExcerpt(a.excerpt || "");
    setContent(a.content || "");
    setExternalUrl(a.external_url || "");
    setArticleDate(a.date || "");
    setTags(a.tags || []);
    setIsExternal(!!a.external_url);
    if (a.author_team_member_id) {
      setAuthorType(a.author_team_member_id);
    } else {
      setAuthorType("external");
      setExternalAuthorName(a.author_name || "");
    }
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!supabase || !title.trim()) {
      toast({ title: "Compila almeno il titolo", variant: "destructive" });
      return;
    }
    if (isExternal && !externalUrl.trim()) {
      toast({ title: "Inserisci l'URL dell'articolo esterno", variant: "destructive" });
      return;
    }
    if (!isExternal && !content.trim()) {
      toast({ title: "Inserisci il contenuto dell'articolo", variant: "destructive" });
      return;
    }

    setSaving(true);

    const isTeamMember = authorType !== "external";
    const teamMemberName = isTeamMember
      ? teamMembers.find((m) => m.id === authorType)?.full_name || null
      : null;

    const payload = {
      title: title.trim(),
      excerpt: excerpt.trim() || null,
      content: isExternal ? null : content.trim(),
      external_url: isExternal ? externalUrl.trim() : null,
      tags,
      date: articleDate || new Date().toISOString().split("T")[0],
      author_name: isTeamMember ? teamMemberName : (externalAuthorName.trim() || "Autore esterno"),
      author_team_member_id: isTeamMember ? authorType : null,
    };

    if (editingId) {
      const { error } = await supabase.from("articles").update(payload).eq("id", editingId);
      if (error) {
        toast({ title: "Errore aggiornamento", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Articolo aggiornato" });
        resetForm();
        fetchArticles();
      }
    } else {
      const { error } = await supabase.from("articles").insert(payload);
      if (error) {
        toast({ title: "Errore salvataggio", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Articolo pubblicato" });
        resetForm();
        fetchArticles();
      }
    }
    setSaving(false);
  };

  const deleteArticle = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (!error) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast({ title: "Articolo eliminato" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">Articoli</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchArticles} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          {editingId ? (
            <Button variant="outline" size="sm" onClick={resetForm}>Annulla modifica</Button>
          ) : (
            <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Nuovo
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
          <Input placeholder="Titolo dell'articolo" value={title} onChange={(e) => setTitle(e.target.value)} />

          {/* External toggle */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-foreground">Tipo:</label>
            <Button
              variant={!isExternal ? "default" : "outline"}
              size="sm"
              onClick={() => setIsExternal(false)}
            >
              Interno
            </Button>
            <Button
              variant={isExternal ? "default" : "outline"}
              size="sm"
              onClick={() => setIsExternal(true)}
            >
              Esterno
            </Button>
          </div>

          {isExternal ? (
            <Input
              placeholder="URL articolo esterno (es. https://...)"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
            />
          ) : (
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Contenuto completo dell'articolo..."
            />
          )}

          <Textarea
            placeholder="Estratto / anteprima (opzionale, mostrato nella card)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
          />

          <Input
            type="date"
            value={articleDate}
            onChange={(e) => setArticleDate(e.target.value)}
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
                placeholder="Aggiungi tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={addTag} type="button">Aggiungi</Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
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
      ) : articles.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
          Nessun articolo pubblicato
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titolo</TableHead>
                <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead className="text-right w-24">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <span className="font-medium text-sm">{a.title}</span>
                      <p className="text-xs text-muted-foreground line-clamp-1">{a.excerpt || a.content}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={a.external_url ? "outline" : "secondary"} className="text-xs">
                      {a.external_url ? "Esterno" : "Interno"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {new Date(a.date).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(a)} className="text-muted-foreground hover:text-foreground">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteArticle(a.id)} className="text-muted-foreground hover:text-destructive">
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

export default ArticleManager;
