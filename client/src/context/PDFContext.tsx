import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PDFFile {
  file: File;
  name: string;
  size: number;
}

export type PDFStatus = 'idle' | 'processing' | 'done' | 'error';

interface PDFContextType {
  pdfFile: PDFFile | null;
  setPdfFile: (file: PDFFile | null) => void;
  progress: number;
  setProgress: (progress: number) => void;
  resultUrl: string | null;
  setResultUrl: (url: string | null) => void;
  status: PDFStatus;
  setStatus: (status: PDFStatus) => void;
  error: string | null;
  setError: (error: string | null) => void;
  resetState: () => void;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export function PDFProvider({ children }: { children: ReactNode }) {
  const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<PDFStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setPdfFile(null);
    setProgress(0);
    setResultUrl(null);
    setStatus('idle');
    setError(null);
  };

  return (
    <PDFContext.Provider
      value={{
        pdfFile,
        setPdfFile,
        progress,
        setProgress,
        resultUrl,
        setResultUrl,
        status,
        setStatus,
        error,
        setError,
        resetState,
      }}
    >
      {children}
    </PDFContext.Provider>
  );
}

export function usePDF() {
  const context = useContext(PDFContext);
  if (context === undefined) {
    throw new Error('usePDF must be used within a PDFProvider');
  }
  return context;
}
