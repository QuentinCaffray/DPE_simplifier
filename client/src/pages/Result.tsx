import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, RefreshCw, Lightbulb, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { usePDF } from '@/context/PDFContext';

export default function Result() {
  const navigate = useNavigate();
  const { pdfFile, resultUrl, resetState } = usePDF();

  // Redirect if no result
  useEffect(() => {
    if (!pdfFile || !resultUrl) {
      navigate('/');
    }
  }, [pdfFile, resultUrl, navigate]);

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = pdfFile?.name?.replace('.pdf', '_simplifie.pdf') || 'dpe_simplifie.pdf';
    link.click();
  };

  const handleNewPdf = () => {
    resetState();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg mx-auto">
          {/* Success message */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/10">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              Votre PDF a été simplifié avec succès !
            </h2>
          </div>

          {/* PDF Preview placeholder */}
          <div className="bg-secondary/50 border border-border rounded-2xl p-8 sm:p-12 mb-8">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground mb-1">
                  Aperçu du PDF
                </p>
                <p className="text-sm text-muted-foreground">
                  {pdfFile?.name?.replace('.pdf', '_simplifie.pdf') || 'document_simplifie.pdf'}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleDownload}
              size="lg"
              className="w-full py-6 text-base font-medium gap-2 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              aria-label="Télécharger le PDF simplifié"
            >
              <Download className="w-5 h-5" />
              Télécharger le PDF
            </Button>
            
            <Button
              onClick={handleNewPdf}
              variant="outline"
              size="lg"
              className="w-full py-6 text-base font-medium gap-2 rounded-xl"
              aria-label="Traiter un nouveau fichier PDF"
            >
              <RefreshCw className="w-5 h-5" />
              Traiter un nouveau PDF
            </Button>
          </div>

          {/* Tip */}
          <div className="flex items-start gap-3 mt-8 p-4 rounded-xl bg-accent/10 border border-accent/20">
            <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              <span className="font-medium">Conseil :</span> Vérifiez le contenu du document avant de l'envoyer à votre client.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
