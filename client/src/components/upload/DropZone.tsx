import { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { FileText, Upload, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onFileAccepted: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
}

const MAX_SIZE = 15 * 1024 * 1024; // 15 Mo

export function DropZone({ onFileAccepted, selectedFile, onClearFile }: DropZoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors.some((e) => e.code === 'file-too-large')) {
          setError('Le fichier dépasse la taille maximale de 15 Mo');
        } else if (rejection.errors.some((e) => e.code === 'file-invalid-type')) {
          setError('Seuls les fichiers PDF sont acceptés');
        } else {
          setError('Fichier invalide');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: MAX_SIZE,
    multiple: false,
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 backdrop-blur-sm",
          "hover:border-primary/60 hover:bg-primary/5 hover:shadow-md",
          isDragActive && !isDragReject && "border-primary bg-primary/8 scale-[1.02] shadow-lg shadow-primary/15",
          isDragReject && "border-destructive bg-destructive/5",
          selectedFile && "border-success bg-success/5 shadow-md",
          !isDragActive && !selectedFile && "border-muted-foreground/30 bg-card/70 shadow-sm"
        )}
      >
        <input {...getInputProps()} aria-label="Sélectionner un fichier PDF" />
        
        {selectedFile ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10">
              <FileText className="w-8 h-8 text-success" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground truncate max-w-[280px]">
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearFile();
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
              aria-label="Supprimer le fichier sélectionné"
            >
              <X className="w-4 h-4" />
              Changer de fichier
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              "flex items-center justify-center w-16 h-16 rounded-2xl transition-colors",
              isDragActive ? "bg-primary/20" : "bg-secondary"
            )}>
              <Upload className={cn(
                "w-8 h-8 transition-colors",
                isDragActive ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">
                {isDragActive
                  ? "Déposez votre fichier ici"
                  : "Glissez votre PDF ici ou cliquez pour parcourir"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Format accepté : PDF uniquement • Taille max : 15 Mo
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
