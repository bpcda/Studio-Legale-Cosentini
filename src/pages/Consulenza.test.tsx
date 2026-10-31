import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Consulenza from "./Consulenza";
import services from "@/data/services.json";

const backend = vi.hoisted(() => ({
  configured: true,
  getAccount: vi.fn(),
  createSession: vi.fn(),
  createDocument: vi.fn(),
  createExecution: vi.fn(),
  toast: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: backend.toast }) }));
vi.mock("@/lib/appwrite", () => ({
  get isConfigured() { return backend.configured; },
  account: { get: backend.getAccount, createAnonymousSession: backend.createSession },
  databases: { createDocument: backend.createDocument },
  functions: { createExecution: backend.createExecution },
  ID: { unique: () => "request-id" },
  Permission: { read: (role: string) => `read:${role}`, update: (role: string) => `update:${role}`, delete: (role: string) => `delete:${role}` },
  Role: { label: (label: string) => label },
  DB_ID: "main",
  COLLECTIONS: { consultation_requests: "consultation_requests" },
  FUNCTIONS: { send_consultation_email: "send-consultation-email" },
}));

function showForm(query = "") {
  return render(
    <HelmetProvider><MemoryRouter initialEntries={[`/consulenza${query}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Consulenza /></MemoryRouter></HelmetProvider>
  );
}

function fillForm() {
  fireEvent.change(screen.getByLabelText("Nome completo *"), { target: { value: "  Mario Rossi  " } });
  fireEvent.change(screen.getByLabelText("Email *"), { target: { value: "mario@example.com" } });
  fireEvent.change(screen.getByLabelText("Telefono *"), { target: { value: "0811234567" } });
  fireEvent.change(screen.getByLabelText("Di cosa ha bisogno? *"), { target: { value: "  Vorrei informazioni su un credito.  " } });
}

beforeEach(() => {
  vi.clearAllMocks();
  backend.configured = true;
  backend.getAccount.mockResolvedValue({});
  backend.createSession.mockResolvedValue({});
  backend.createDocument.mockResolvedValue({ $id: "request-id" });
  backend.createExecution.mockResolvedValue({});
});
afterEach(cleanup);

describe("richiesta di consulenza", () => {
  it.each(services)("preseleziona l'area valida per $title senza compilare il messaggio", (service) => {
    showForm(`?servizio=${service.serviceType}`);
    expect(screen.getByRole("combobox")).not.toHaveTextContent("Non so quale area scegliere");
    expect(screen.getByLabelText("Di cosa ha bisogno? *")).toHaveValue("");
  });

  it("ignora un servizio sconosciuto proveniente dall'URL", () => {
    showForm("?servizio=non-valido");
    expect(screen.getByRole("combobox")).toHaveTextContent("Non so quale area scegliere");
  });

  it("salva l'area scelta, conserva i permessi admin e conferma solo dopo il salvataggio", async () => {
    backend.getAccount.mockRejectedValueOnce(new Error("no session"));
    showForm("?servizio=recupero-crediti");
    fillForm();
    fireEvent.submit(screen.getByRole("form"));
    await screen.findByText("Richiesta ricevuta.");
    expect(backend.createSession).toHaveBeenCalledOnce();
    expect(backend.createDocument).toHaveBeenCalledWith("main", "consultation_requests", "request-id", {
      full_name: "Mario Rossi", email: "mario@example.com", phone: "0811234567", service_type: "recupero-crediti",
      message: "Vorrei informazioni su un credito.", consultation_mode: "webcall", status: "pending",
    }, ["read:admin", "update:admin", "delete:admin"]);
    expect(backend.createExecution).toHaveBeenCalledOnce();
    expect(screen.getByLabelText("Di cosa ha bisogno? *")).toHaveValue("");
  });

  it("mantiene i dati e consente di riprovare se il salvataggio fallisce", async () => {
    backend.createDocument.mockRejectedValueOnce(new Error("unavailable"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    showForm();
    fillForm();
    fireEvent.submit(screen.getByRole("form"));
    expect(await screen.findByRole("alert")).toHaveTextContent("La richiesta non è stata inviata");
    expect(screen.getByLabelText("Nome completo *")).toHaveValue("  Mario Rossi  ");
    expect(screen.queryByText("Richiesta ricevuta.")).not.toBeInTheDocument();
    expect(backend.createExecution).not.toHaveBeenCalled();
    fireEvent.submit(screen.getByRole("form"));
    await screen.findByText("Richiesta ricevuta.");
    log.mockRestore();
  });

  it("non simula un invio quando il backend non è configurato", async () => {
    backend.configured = false;
    showForm();
    fillForm();
    fireEvent.submit(screen.getByRole("form"));
    expect(await screen.findByRole("alert")).toHaveTextContent("Il modulo non è disponibile");
    expect(backend.createDocument).not.toHaveBeenCalled();
    expect(backend.toast).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Di cosa ha bisogno? *")).not.toHaveValue("");
  });

  it("non invia un messaggio composto solo da spazi", async () => {
    showForm();
    fillForm();
    fireEvent.change(screen.getByLabelText("Di cosa ha bisogno? *"), { target: { value: "   " } });
    fireEvent.submit(screen.getByRole("form"));
    await screen.findByRole("alert");
    expect(backend.createDocument).not.toHaveBeenCalled();
  });

  it("impedisce un secondo invio mentre il primo è in corso", async () => {
    let finish: (value: object) => void;
    backend.createDocument.mockReturnValueOnce(new Promise((resolve) => { finish = resolve; }));
    showForm();
    fillForm();
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => expect(backend.createDocument).toHaveBeenCalledOnce());
    fireEvent.submit(screen.getByRole("form"));
    expect(backend.createDocument).toHaveBeenCalledOnce();
    finish({ $id: "request-id" });
    await screen.findByText("Richiesta ricevuta.");
  });
});
