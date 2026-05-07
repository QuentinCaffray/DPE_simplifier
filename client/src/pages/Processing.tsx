import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProcessingStep } from '@/components/processing/ProcessingStep';
import { usePDF } from '@/context/PDFContext';
import { useCustomization } from '@/context/CustomizationContext';

type StepStatus = 'completed' | 'active' | 'pending';

function getStepStatus(progress: number, stepThreshold: number, nextThreshold: number): StepStatus {
  if (progress >= nextThreshold) return 'completed';
  if (progress >= stepThreshold) return 'active';
  return 'pending';
}

export default function Processing() {
  const navigate = useNavigate();
  const { pdfFile, progress, setProgress, setResultUrl, setStatus, setError, error } = usePDF();
  const { primaryColor, secondaryColor, logoFile, coverFile, endPages, buildingPhotos } = useCustomization();
  const [warmingUp, setWarmingUp] = useState(false);

  // Redirect if no file
  useEffect(() => {
    if (!pdfFile) {
      navigate('/');
    }
  }, [pdfFile, navigate]);

  // Redirect to upload on error
  useEffect(() => {
    if (error) {
      navigate('/');
    }
  }, [error, navigate]);

  // Appel API + progression animée
  useEffect(() => {
    if (!pdfFile) return;

    let cancelled = false;
    setStatus('processing');

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress = Math.min(90, currentProgress + Math.random() * 3 + 0.5);
      setProgress(currentProgress);
    }, 300);

    const formData = new FormData();
    formData.append('pdf', pdfFile.file);
    formData.append('customization', JSON.stringify({ primaryColor, secondaryColor }));
    if (logoFile) formData.append('logo', logoFile);
    if (coverFile) formData.append('cover', coverFile);
    endPages.forEach(page => formData.append('endPages', page.file));
    buildingPhotos.forEach(photo => formData.append('buildingPhotos', photo.file));
    if (buildingPhotos.length > 0) {
      formData.append('photoCaptions', JSON.stringify(buildingPhotos.map(p => p.caption)));
    }

    const apiBase = import.meta.env.VITE_API_URL || '';

    // Ping jusqu'à ce que le serveur soit réveillé (cold start Render)
    const pingUntilReady = async () => {
      for (let i = 0; i < 12; i++) {
        try {
          const res = await fetch(`${apiBase}/api/health`);
          if (res.ok) {
            setWarmingUp(false);
            return;
          }
        } catch {}
        setWarmingUp(true);
        await new Promise(r => setTimeout(r, 5000));
      }
    };

    const run = async () => {
      await pingUntilReady();
      if (cancelled) return;

      try {
        const response = await fetch(`${apiBase}/api/process`, { method: 'POST', body: formData });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Erreur lors du traitement');
        }
        const blob = await response.blob();
        if (cancelled) return;
        clearInterval(interval);
        setResultUrl(URL.createObjectURL(blob));
        setProgress(100);
        setStatus('done');
        setTimeout(() => navigate('/result'), 500);
      } catch (err) {
        if (cancelled) return;
        clearInterval(interval);
        setError((err as Error).message || 'Erreur réseau');
      }
    };

    run();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [pdfFile, setProgress, setResultUrl, setStatus, setError, navigate]);

  const steps = [
    { label: 'Extraction des données', threshold: 0, next: 33 },
    { label: 'Vulgarisation du contenu', threshold: 33, next: 66 },
    { label: 'Génération du PDF final', threshold: 66, next: 100 },
  ];

  const estimatedTime = Math.max(0, Math.ceil((100 - progress) / 5));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
              Traitement de votre document...
            </h2>
            {pdfFile && (
              <p className="text-muted-foreground">
                {pdfFile.name}
              </p>
            )}
            {warmingUp && (
              <p className="text-sm text-amber-500 mt-2">
                Démarrage du serveur, veuillez patienter...
              </p>
            )}
          </div>

          <div className="mb-8">
            <ProgressBar progress={progress} className="mb-3" />
            <p className="text-center text-sm font-medium text-primary">
              {Math.round(progress)}%
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {steps.map((step) => (
              <ProcessingStep
                key={step.label}
                label={step.label}
                status={getStepStatus(progress, step.threshold, step.next)}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              Temps estimé : ~{estimatedTime} secondes
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
