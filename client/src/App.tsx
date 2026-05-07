import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PDFProvider } from "@/context/PDFContext";
import { CustomizationProvider } from "@/context/CustomizationContext";
import Upload from "./pages/Upload";
import Processing from "./pages/Processing";
import Result from "./pages/Result";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <PDFProvider>
          <CustomizationProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/processing" element={<Processing />} />
            <Route path="/result" element={<Result />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </CustomizationProvider>
        </PDFProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
