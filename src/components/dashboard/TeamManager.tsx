import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, RefreshCw, Trash2, Upload, GripVertical, X, Pencil } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TeamMember {
  id: string;
  full_name: string;
  role_title: string;
  short_description: string;
  long_description: string;
  email: string;
  phone: string;
  photo_url: string;
  display_order: number;
  created_at: string;
}

interface FormData {
  fullName: string;
  roleTitle: string;
  shortDesc: string;
  longDesc: string;
  email: string;
  phone: string;
  photoFile: File | null;
  photoPreview: string | null;
}

const emptyForm: FormData = {
  fullName: "", roleTitle: "", shortDesc: "", longDesc: "",
  email: "", phone: "", photoFile: null, photoPreview: null,
};

const TeamManager = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setMembers(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (member: TeamMember) => {
    setForm({
      fullName: member.full_name,
      roleTitle: member.role_title || "",
      shortDesc: member.short_description || "",
      longDesc: member.long_description || "",
      email: member.email || "",
      phone: member.phone || "",
      photoFile: null,
      photoPreview: member.photo_url || null,
    });
    setEditingId(member.id);
    setShowForm(true);
  };

  const updateField = (key: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(prev => ({ ...prev, photoFile: file, photoPreview: URL.createObjectURL(file) }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setForm(prev => ({ ...prev, photoFile: file, photoPreview: URL.createObjectURL(file) }));
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    if (!supabase) return null;
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("team-photos").upload(path, file);
    if (error) {
      toast({ title: "Errore upload foto", description: error.message, variant: "destructive" });
      return null;
    }
    const { data: urlData } = supabase.storage.from("team-photos").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    if (!supabase || !form.fullName.trim()) {
      toast({ title: "Inserisci almeno il nome", variant: "destructive" });
      return;
    }
    setSaving(true);

    let photo_url = editingId
      ? members.find(m => m.id === editingId)?.photo_url || ""
      : "";

    if (form.photoFile) {
      const url = await uploadPhoto(form.photoFile);
      if (!url) { setSaving(false); return; }
      photo_url = url;
    }

    const payload = {
      full_name: form.fullName.trim(),
      role_title: form.roleTitle.trim(),
      short_description: form.shortDesc.trim(),
      long_description: form.longDesc.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      photo_url,
    };

    if (editingId) {
      const { error } = await supabase.from("team_members").update(payload).eq("id", editingId);
      if (error) {
        toast({ title: "Errore", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Membro aggiornato" });
        resetForm();
        fetchMembers();
      }
    } else {
      const { error } = await supabase.from("team_members").insert({
        ...payload,
        display_order: members.length,
      });
      if (error) {
        toast({ title: "Errore", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Membro aggiunto" });
        resetForm();
        fetchMembers();
      }
    }
    setSaving(false);
  };

  const deleteMember = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (!error) {
      setMembers(prev => prev.filter(m => m.id !== id));
      toast({ title: "Membro rimosso" });
    }
  };

  // Drag & drop reorder
  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const reordered = [...members];
    const [dragged] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, dragged);

    // Update local state immediately
    const updated = reordered.map((m, i) => ({ ...m, display_order: i }));
    setMembers(updated);

    dragItem.current = null;
    dragOverItem.current = null;

    // Persist to DB
    if (!supabase) return;
    const promises = updated.map(m =>
      supabase.from("team_members").update({ display_order: m.display_order }).eq("id", m.id)
    );
    await Promise.all(promises);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Membri dello Studio</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchMembers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button size="sm" onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}>
            {showForm ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
            {showForm ? "Annulla" : "Nuovo"}
          </Button>
        </div>
      </div>

      {/* Form (add / edit) */}
      {showForm && (
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            {editingId ? "Modifica membro" : "Nuovo membro"}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome completo *</Label>
              <Input value={form.fullName} onChange={e => updateField("fullName", e.target.value)} placeholder="Avv. Mario Rossi" />
            </div>
            <div className="space-y-2">
              <Label>Ruolo / Titolo</Label>
              <Input value={form.roleTitle} onChange={e => updateField("roleTitle", e.target.value)} placeholder="Socio fondatore" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descrizione breve (card)</Label>
            <Textarea value={form.shortDesc} onChange={e => updateField("shortDesc", e.target.value)} placeholder="Breve descrizione visibile nella card..." rows={2} />
          </div>

          <div className="space-y-2">
            <Label>Descrizione estesa (dettaglio)</Label>
            <Textarea value={form.longDesc} onChange={e => updateField("longDesc", e.target.value)} placeholder="Descrizione completa visibile cliccando sulla card..." rows={4} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => updateField("email", e.target.value)} placeholder="nome@studio.it" />
            </div>
            <div className="space-y-2">
              <Label>Telefono</Label>
              <Input value={form.phone} onChange={e => updateField("phone", e.target.value)} placeholder="+39 081 ..." />
            </div>
          </div>

          {/* Photo upload */}
          <div className="space-y-2">
            <Label>Foto</Label>
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-accent/50 transition-colors"
              onClick={() => document.getElementById("team-photo-input")?.click()}
            >
              {form.photoPreview ? (
                <div className="flex items-center justify-center gap-4">
                  <img src={form.photoPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
                  <p className="text-sm text-muted-foreground">{form.photoFile?.name ?? "Foto attuale"}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Trascina una foto o clicca per selezionarla</p>
                </div>
              )}
              <input
                id="team-photo-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={saving} className="w-full sm:w-auto">
            {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-1" /> : null}
            {editingId ? "Salva modifiche" : "Aggiungi membro"}
          </Button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">Nessun membro aggiunto. Clicca "Nuovo" per iniziare.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {members.map((member, index) => (
              <div
                key={member.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={e => e.preventDefault()}
                className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-muted/50 transition-colors cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />

                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.full_name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                    {member.full_name.split(" ").map(n => n[0]).join("")}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{member.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.role_title}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(member)}>
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Rimuovere {member.full_name}?</AlertDialogTitle>
                        <AlertDialogDescription>Questa azione non può essere annullata.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMember(member.id)}>Elimina</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManager;
