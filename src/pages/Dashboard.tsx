import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogOut, RefreshCw, Calendar, Phone, Mail, User, Filter } from "lucide-react";
import logoCosentini from "@/assets/logo-cosentini.png";

interface ConsultationRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service_type: string;
  message: string;
  consultation_mode: string;
  status: string;
  created_at: string;
}

const serviceLabels: Record<string, string> = {
  generico: "Generica",
  civile: "Diritto Civile",
  amministrativo: "Diritto Amministrativo",
  patrimoniale: "Patrimoniale & Wealth",
  trust: "Trust",
  "231": "Responsabilità 231/01",
  "recupero-crediti": "Recupero Crediti",
  custodia: "Custodia Giudiziaria",
};

const modeLabels: Record<string, string> = {
  webcall: "Videochiamata",
  persona: "In Presenza",
};

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "In attesa", variant: "secondary" },
  accepted: { label: "Accettata", variant: "default" },
  completed: { label: "Completata", variant: "outline" },
  rejected: { label: "Rifiutata", variant: "destructive" },
};

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const fetchRequests = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("consultation_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRequests(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const updateStatus = async (id: string, newStatus: string) => {
    if (!supabase) return;
    setUpdatingId(id);
    const { error } = await supabase
      .from("consultation_requests")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    }
    setUpdatingId(null);
  };

  const filtered = filterStatus === "all"
    ? requests
    : requests.filter((r) => r.status === filterStatus);

  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoCosentini} alt="Logo" className="h-8 object-contain" />
            <span className="text-sm font-medium text-foreground hidden sm:inline">
              Dashboard Consulenze
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Totali", value: counts.total, color: "bg-primary/10 text-primary" },
            { label: "In attesa", value: counts.pending, color: "bg-accent/10 text-accent" },
            { label: "Accettate", value: counts.accepted, color: "bg-emerald-500/10 text-emerald-600" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-semibold mt-1 ${stat.color.split(" ")[1]}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte</SelectItem>
                <SelectItem value="pending">In attesa</SelectItem>
                <SelectItem value="accepted">Accettate</SelectItem>
                <SelectItem value="completed">Completate</SelectItem>
                <SelectItem value="rejected">Rifiutate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" onClick={fetchRequests} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline ml-1">Aggiorna</span>
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nessuna richiesta trovata</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Richiedente</TableHead>
                  <TableHead className="hidden md:table-cell">Servizio</TableHead>
                  <TableHead className="hidden lg:table-cell">Modalità</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="hidden sm:table-cell">Data</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((req) => {
                  const sc = statusConfig[req.status] ?? statusConfig.pending;
                  return (
                    <TableRow key={req.id}>
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium text-sm">{req.full_name}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />{req.email}
                            </span>
                            <span className="flex items-center gap-1 hidden lg:flex">
                              <Phone className="h-3 w-3" />{req.phone}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm">
                          {serviceLabels[req.service_type] ?? req.service_type}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm">
                          {modeLabels[req.consultation_mode] ?? req.consultation_mode}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={sc.variant}>{sc.label}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                        {new Date(req.created_at).toLocaleDateString("it-IT", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={req.status}
                          onValueChange={(val) => updateStatus(req.id, val)}
                          disabled={updatingId === req.id}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">In attesa</SelectItem>
                            <SelectItem value="accepted">Accettata</SelectItem>
                            <SelectItem value="completed">Completata</SelectItem>
                            <SelectItem value="rejected">Rifiutata</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
