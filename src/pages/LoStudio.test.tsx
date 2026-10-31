import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import LoStudio from "./LoStudio";

const listDocuments = vi.hoisted(() => vi.fn());
vi.mock("@/lib/appwrite", () => ({
  isConfigured: true,
  databases: { listDocuments },
  Query: { orderAsc: (field: string) => field, limit: (limit: number) => limit },
  DB_ID: "main",
  COLLECTIONS: { team_members: "team_members" },
  normalizeDocs: (docs: object[]) => docs,
}));
afterEach(cleanup);

function showStudio() {
  render(<HelmetProvider><MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><LoStudio /></MemoryRouter></HelmetProvider>);
}

describe("professionisti e sedi", () => {
  it("mostra foto, biografia e contatti pubblicati dal pannello esistente", async () => {
    listDocuments.mockResolvedValueOnce({ documents: [{
      id: "member", full_name: "Avv. Test", role_title: "Avvocato", short_description: "Profilo breve",
      long_description: "Biografia completa", photo_url: "/portrait.jpg", email: "test@example.com", phone: "0811234567",
    }] });
    showStudio();
    expect(await screen.findByRole("heading", { name: "Avv. Test" })).toBeInTheDocument();
    expect(screen.getByAltText("Avv. Test")).toHaveAttribute("src", "/portrait.jpg");
    fireEvent.click(screen.getByText("Profilo completo di Avv. Test"));
    expect(screen.getByText("Biografia completa").closest("details")).toHaveAttribute("open");
    expect(screen.getByRole("link", { name: "test@example.com" })).toHaveAttribute("href", "mailto:test@example.com");
    expect(listDocuments).toHaveBeenCalledWith("main", "team_members", ["display_order", 100]);
  });

  it("mantiene il riferimento pubblico al professionista quando il team è vuoto", async () => {
    listDocuments.mockResolvedValueOnce({ documents: [] });
    showStudio();
    expect(await screen.findByRole("heading", { name: "Avv. Sergio Cosentini" })).toBeInTheDocument();
    expect(screen.getByText(/Via Nuova del Campo 14/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Indicazioni per Napoli/ })).toHaveAttribute("href", expect.stringContaining("Via+Nuova+del+Campo+14+80141+Napoli"));
  });

  it("segnala un errore di lettura senza nascondere i recapiti", async () => {
    listDocuments.mockRejectedValueOnce(new Error("unavailable"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    showStudio();
    expect(await screen.findByRole("status")).toHaveTextContent("I profili non sono disponibili");
    expect(screen.getByRole("link", { name: "081 7511775" })).toHaveAttribute("href", "tel:+390817511775");
    log.mockRestore();
  });
});
