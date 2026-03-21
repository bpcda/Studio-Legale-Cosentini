import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, RefreshCw, Trash2, Upload, GripVertical, X } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
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

const TeamManager = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
    setFullName(""); setRoleTitle(""); setShortDesc(""); setLongDesc("");
    setEmail(""); setPhone(""); setPhotoFile(null); setPhotoPreview(null);
    setShowForm(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!supabase || !fullName.trim()) {
      toast({ title: "Inserisci almeno il nome", variant: "destructive" });
      return;
    }
    setSaving(true);

    let photo_url = "";
    if (photoFile) {
      const ext = photoFile.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("team-photos")
        .upload(path, photoFile);
      if (uploadErr) {
        toast({ title: "Errore upload foto", description: uploadErr.message, variant: "destructive" });
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("team-photos").getPublicUrl(path);
      photo_url = urlData.publicUrl;
    }

    const { error } = await supabase.from("team_members").insert({
      full_name: fullName.trim(),
      role_title: roleTitle.trim(),
      short_description: shortDesc.trim(),
      long_description: longDesc.trim(),
      email: email.trim(),
      phone: phone.trim(),
      photo_url,
      display_order: members.length,
    });

    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Membro aggiunto" });
      resetForm();
      fetchMembers();
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Membri dello Studio</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchMembers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
            {showForm ? "Annulla" : "Nuovo"}
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome completo *</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Avv. Mario Rossi" />
            </div>
            <div className="space-y-2">
              <Label>Ruolo / Titolo</Label>
              <Input value={roleTitle} onChange={e => setRoleTitle(e.target.value)} placeholder="Socio fondatore" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descrizione breve (card)</Label>
            <Textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)} placeholder="Breve descrizione visibile nella card..." rows={2} />
          </div>

          <div className="space-y-2">
            <Label>Descrizione estesa (dettaglio)</Label>
            <Textarea value={longDesc} onChange={e => setLongDesc(e.target.value)} placeholder="Descrizione completa visibile cliccando sulla card..." rows={4} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nome@studio.it" />
            </div>
            <div className="space-y-2">
              <Label>Telefono</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+39 081 ..." />
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
              {photoPreview ? (
                <div className="flex items-center justify-center gap-4">
                  <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
                  <p className="text-sm text-muted-foreground">{photoFile?.name}</p>
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
            Aggiungi membro
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden sm:table-cell">Ruolo</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map(member => (
                <TableRow key={member.id}>
                  <TableCell>
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.full_name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                        {member.full_name.split(" ").map(n => n[0]).join("")}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-sm">{member.full_name}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm text-muted-foreground">{member.role_title}</span>
                  </TableCell>
                  <TableCell className="text-right">
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

export default TeamManager;
