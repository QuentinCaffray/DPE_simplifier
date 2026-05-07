import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, FileText, Sparkles, Download, Settings2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { DropZone } from '@/components/upload/DropZone';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { CustomizationPanel } from '@/components/customization/CustomizationPanel';
import { usePDF } from '@/context/PDFContext';
import { useCustomization } from '@/context/CustomizationContext';

const steps = [
  { icon: FileText, label: 'Extraction', desc: 'Lecture du DPE' },
  { icon: Sparkles, label: 'Vulgarisation', desc: 'Simplification IA' },
  { icon: Download, label: 'Génération', desc: 'PDF clé en main' },
];

export default function Upload() {
  const navigate = useNavigate();
  const { setPdfFile, error, setError, resetState } = usePDF();
  const { hasCustomization } = useCustomization();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Réinitialise le contexte à chaque fois qu'on revient sur cette page
  useEffect(() => {
    resetState();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileAccepted = (file: File) => {
    setError(null);
    setSelectedFile(file);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  const handleGenerate = () => {
    if (selectedFile) {
      setPdfFile({
        file: selectedFile,
        name: selectedFile.name,
        size: selectedFile.size,
      });
      navigate('/processing');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Gradient blobs décoratifs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative z-10">
        <div className="w-full max-w-2xl mx-auto">

          {/* Heading avec texte gradient */}
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight">
              Simplifiez votre DPE
              <span className="block bg-gradient-to-r from-[#5590ee] to-[#3b7dd8] bg-clip-text text-transparent">
                en quelques secondes
              </span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto leading-relaxed">
              Uploadez votre diagnostic technique et obtenez un rapport simplifié, clair et professionnel pour votre client.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <DropZone
            onFileAccepted={handleFileAccepted}
            selectedFile={selectedFile}
            onClearFile={handleClearFile}
          />

          <div className="mt-8 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setSheetOpen(true)}
              className="gap-2 rounded-xl h-12 px-5"
            >
              <Settings2 className="w-4 h-4" />
              Personnaliser
              {hasCustomization && (
                <span className="ml-1 w-2 h-2 rounded-full bg-primary inline-block" />
              )}
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!selectedFile}
              size="lg"
              className="px-10 py-6 text-base font-semibold gap-2 rounded-xl bg-gradient-to-r from-[#5590ee] to-[#3b7dd8] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all disabled:shadow-none"
              aria-label="Générer le PDF simplifié"
            >
              Générer le PDF
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent side="right" className="w-[380px] sm:w-[420px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Personnalisation</SheetTitle>
                <SheetDescription>
                  Adaptez le PDF à votre charte graphique
                </SheetDescription>
              </SheetHeader>
              <CustomizationPanel />
            </SheetContent>
          </Sheet>

          {/* Étapes du pipeline */}
          <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-2 sm:gap-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center p-3 sm:p-4 rounded-xl bg-card/60 border border-border/50 backdrop-blur-sm"
              >
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-bold shadow-sm shadow-primary/30">
                  {i + 1}
                </span>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-2 mt-1">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground">{step.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
