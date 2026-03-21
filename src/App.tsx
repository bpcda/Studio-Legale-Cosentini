import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import CookieBanner from "@/components/CookieBanner";
import Index from "./pages/Index.tsx";
import Consulenza from "./pages/Consulenza.tsx";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import SentenzeCommentate from "./pages/SentenzeCommentate.tsx";
import SentenzaDetail from "./pages/SentenzaDetail.tsx";
import Articoli from "./pages/Articoli.tsx";
import ArticoloDetail from "./pages/ArticoloDetail.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import CookiePolicy from "./pages/CookiePolicy.tsx";
import LoStudio from "./pages/LoStudio.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/consulenza" element={<Consulenza />} />
            <Route path="/lo-studio" element={<LoStudio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sentenze-commentate" element={<SentenzeCommentate />} />
            <Route path="/sentenze-commentate/:id" element={<SentenzaDetail />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieBanner />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
