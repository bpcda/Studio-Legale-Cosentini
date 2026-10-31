import { cleanup, render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import services from "@/data/services.json";
import Servizio from "./Servizio";

afterEach(cleanup);

function showService(slug: string) {
  render(<HelmetProvider><MemoryRouter initialEntries={[`/servizi/${slug}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes><Route path="/servizi/:slug" element={<Servizio />} /></Routes>
  </MemoryRouter></HelmetProvider>);
}

describe("pagine dei servizi", () => {
  it.each(services)("collega $title alla corrispondente area di consulenza", (service) => {
    showService(service.slug);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(service.title);
    expect(screen.getByRole("link", { name: /Richiedi un appuntamento/ })).toHaveAttribute("href", `/consulenza?servizio=${service.serviceType}`);
  });

  it("mostra la pagina non trovata per slug non riconosciuti", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    showService("non-esiste");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("404");
    expect(screen.queryByRole("link", { name: /Richiedi un appuntamento/ })).not.toBeInTheDocument();
    log.mockRestore();
  });
});
