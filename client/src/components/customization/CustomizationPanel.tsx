import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, RotateCcw, ImageIcon, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { useCustomization } from '@/context/CustomizationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

function ImageDropZone({
  label,
  hint,
  file,
  previewUrl,
  onDrop,
  onClear,
  previewHeight = 'h-20',
}: {
  label: string;
  hint: string;
  file: File | null;
  previewUrl: string | null;
  onDrop: (file: File) => void;
  onClear: () => void;
  previewHeight?: string;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => { if (files[0]) onDrop(files[0]); },
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'] },
    maxSize: 2 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {file && previewUrl ? (
        <div className="relative rounded-lg border border-border overflow-hidden bg-muted/30">
          <img
            src={previewUrl}
            alt={label}
            className={`w-full ${previewHeight} object-contain p-2`}
          />
          <button
            onClick={onClear}
            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-background/80 hover:bg-background border border-border/50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="px-3 py-1.5 border-t border-border/50 bg-muted/20">
            <p className="text-xs text-muted-foreground truncate">{file.name}</p>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
          }`}
        >
          <input {...getInputProps()} />
          <ImageIcon className="w-6 h-6 text-muted-foreground" />
          <p className="text-xs text-muted-foreground text-center">{hint}</p>
        </div>
      )}
    </div>
  );
}

export function CustomizationPanel() {
  const {
    primaryColor,
    secondaryColor,
    logoFile,
    logoPreviewUrl,
    coverFile,
    coverPreviewUrl,
    endPages,
    buildingPhotos,
    setPrimaryColor,
    setSecondaryColor,
    setLogoFile,
    setCoverFile,
    addEndPages,
    removeEndPage,
    reorderEndPages,
    addBuildingPhotos,
    removeBuildingPhoto,
    updatePhotoCaption,
    resetCustomization,
    hasCustomization,
  } = useCustomization();

  const handleLogoDrop = useCallback((file: File) => setLogoFile(file), [setLogoFile]);
  const handleCoverDrop = useCallback((file: File) => setCoverFile(file), [setCoverFile]);

  const { getRootProps: getEndPagesRootProps, getInputProps: getEndPagesInputProps, isDragActive: isEndPagesDragActive } = useDropzone({
    onDrop: (files) => { if (files.length > 0) addEndPages(files); },
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
  });

  const { getRootProps: getBuildingPhotosRootProps, getInputProps: getBuildingPhotosInputProps, isDragActive: isBuildingPhotosDragActive } = useDropzone({
    onDrop: (files) => { if (files.length > 0) addBuildingPhotos(files); },
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxSize: 3 * 1024 * 1024,
    multiple: true,
  });

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* ── Couleurs ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Couleurs du PDF
        </h3>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="primary-color" className="text-xs">Couleur principale</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="primary-color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-28 font-mono text-xs h-9"
                maxLength={7}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="secondary-color" className="text-xs">Couleur secondaire</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="secondary-color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
              />
              <Input
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-28 font-mono text-xs h-9"
                maxLength={7}
              />
            </div>
          </div>

          {/* Aperçu gradient */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Aperçu en-tête PDF</Label>
            <div
              className="h-10 rounded-lg shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${secondaryColor} 0%, ${primaryColor} 55%, ${primaryColor}88 100%)`,
              }}
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Logo ── */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Logo entreprise
        </h3>
        <ImageDropZone
          label="Logo"
          hint="Glissez votre logo ici (PNG, JPG, SVG — max 2 Mo)"
          file={logoFile}
          previewUrl={logoPreviewUrl}
          onDrop={handleLogoDrop}
          onClear={() => setLogoFile(null)}
          previewHeight="h-16"
        />
      </section>

      <Separator />

      {/* ── Photos du bâtiment ── */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          📸 Photos du bâtiment
        </h3>
        <p className="text-xs text-muted-foreground">
          Ajoutez des photos de façades, détails ou vues du bâtiment pour illustrer le rapport (max 6 photos).
        </p>

        {buildingPhotos.length > 0 && (
          <div className="space-y-3">
            {buildingPhotos.map((photo, index) => (
              <div key={photo.previewUrl} className="space-y-1.5">
                <div className="relative rounded-lg border border-border overflow-hidden bg-muted/30">
                  <img
                    src={photo.previewUrl}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    onClick={() => removeBuildingPhoto(index)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-background/80 hover:bg-background border border-border/50 transition-colors"
                    title="Supprimer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <Input
                  placeholder={`Légende photo ${index + 1} (optionnel)`}
                  value={photo.caption}
                  onChange={(e) => updatePhotoCaption(index, e.target.value)}
                  className="text-xs h-8"
                />
              </div>
            ))}
          </div>
        )}

        <div
          {...getBuildingPhotosRootProps()}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
            isBuildingPhotosDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
          }`}
        >
          <input {...getBuildingPhotosInputProps()} />
          <Plus className="w-5 h-5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground text-center">
            {buildingPhotos.length === 0
              ? 'Glissez vos photos ici (PNG, JPG — max 3 Mo chacune)'
              : `Ajouter d'autres photos (${buildingPhotos.length}/6)`}
          </p>
        </div>
      </section>

      <Separator />

      {/* ── Couverture ── */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Page de couverture
        </h3>
        <p className="text-xs text-muted-foreground">
          Remplace la couverture par défaut. Laissez vide pour garder la couverture standard.
        </p>
        <ImageDropZone
          label="Couverture"
          hint="Glissez une image de couverture (PNG, JPG — max 2 Mo)"
          file={coverFile}
          previewUrl={coverPreviewUrl}
          onDrop={handleCoverDrop}
          onClear={() => setCoverFile(null)}
          previewHeight="h-32"
        />
      </section>

      <Separator />

      {/* ── Pages de fin ── */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Pages de fin
        </h3>
        <p className="text-xs text-muted-foreground">
          Ajoutez une ou plusieurs images qui apparaîtront à la fin du PDF, après le contenu.
        </p>

        {endPages.length > 0 && (
          <div className="space-y-2">
            {endPages.map((page, index) => (
              <div key={page.previewUrl} className="relative rounded-lg border border-border overflow-hidden bg-muted/30">
                <img
                  src={page.previewUrl}
                  alt={`Page de fin ${index + 1}`}
                  className="w-full h-20 object-contain p-2"
                />
                <div className="absolute top-1.5 right-1.5 flex gap-1">
                  {index > 0 && (
                    <button
                      onClick={() => reorderEndPages(index, index - 1)}
                      className="p-1 rounded-full bg-background/80 hover:bg-background border border-border/50 transition-colors"
                      title="Monter"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                  )}
                  {index < endPages.length - 1 && (
                    <button
                      onClick={() => reorderEndPages(index, index + 1)}
                      className="p-1 rounded-full bg-background/80 hover:bg-background border border-border/50 transition-colors"
                      title="Descendre"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => removeEndPage(index)}
                    className="p-1 rounded-full bg-background/80 hover:bg-background border border-border/50 transition-colors"
                    title="Supprimer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="px-3 py-1.5 border-t border-border/50 bg-muted/20 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate">{page.file.name}</p>
                  <span className="text-xs text-muted-foreground/60 flex-shrink-0 ml-2">Page {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          {...getEndPagesRootProps()}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
            isEndPagesDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
          }`}
        >
          <input {...getEndPagesInputProps()} />
          <Plus className="w-5 h-5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground text-center">
            {endPages.length === 0
              ? 'Glissez vos images de fin ici (PNG, JPG — max 5 Mo chacune)'
              : 'Ajouter d\'autres pages'}
          </p>
        </div>
      </section>

      {/* ── Réinitialiser ── */}
      {hasCustomization && (
        <>
          <Separator />
          <Button
            variant="outline"
            onClick={resetCustomization}
            className="w-full gap-2 text-muted-foreground"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </Button>
        </>
      )}
    </div>
  );
}
