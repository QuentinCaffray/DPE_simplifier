import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface EndPage {
  file: File;
  previewUrl: string;
}

interface BuildingPhoto {
  file: File;
  previewUrl: string;
  caption: string;
}

interface CustomizationState {
  primaryColor: string;
  secondaryColor: string;
  logoFile: File | null;
  logoPreviewUrl: string | null;
  coverFile: File | null;
  coverPreviewUrl: string | null;
  endPages: EndPage[];
  buildingPhotos: BuildingPhoto[];
}

interface CustomizationContextType extends CustomizationState {
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setLogoFile: (file: File | null) => void;
  setCoverFile: (file: File | null) => void;
  addEndPages: (files: File[]) => void;
  removeEndPage: (index: number) => void;
  reorderEndPages: (fromIndex: number, toIndex: number) => void;
  addBuildingPhotos: (files: File[]) => void;
  removeBuildingPhoto: (index: number) => void;
  updatePhotoCaption: (index: number, caption: string) => void;
  resetCustomization: () => void;
  hasCustomization: boolean;
}

const DEFAULTS = {
  primaryColor: '#5590ee',
  secondaryColor: '#3b7dd8',
};

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export function CustomizationProvider({ children }: { children: ReactNode }) {
  const [primaryColor, setPrimaryColor] = useState(DEFAULTS.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(DEFAULTS.secondaryColor);
  const [logoFile, setLogoFileState] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [coverFile, setCoverFileState] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [endPages, setEndPages] = useState<EndPage[]>([]);
  const [buildingPhotos, setBuildingPhotos] = useState<BuildingPhoto[]>([]);

  const setLogoFile = useCallback((file: File | null) => {
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    setLogoFileState(file);
    setLogoPreviewUrl(file ? URL.createObjectURL(file) : null);
  }, [logoPreviewUrl]);

  const setCoverFile = useCallback((file: File | null) => {
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverFileState(file);
    setCoverPreviewUrl(file ? URL.createObjectURL(file) : null);
  }, [coverPreviewUrl]);

  const addEndPages = useCallback((files: File[]) => {
    const newPages = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setEndPages(prev => [...prev, ...newPages]);
  }, []);

  const removeEndPage = useCallback((index: number) => {
    setEndPages(prev => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const reorderEndPages = useCallback((fromIndex: number, toIndex: number) => {
    setEndPages(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, []);

  const addBuildingPhotos = useCallback((files: File[]) => {
    const newPhotos = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      caption: '',
    }));
    setBuildingPhotos(prev => [...prev, ...newPhotos]);
  }, []);

  const removeBuildingPhoto = useCallback((index: number) => {
    setBuildingPhotos(prev => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const updatePhotoCaption = useCallback((index: number, caption: string) => {
    setBuildingPhotos(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], caption };
      }
      return updated;
    });
  }, []);

  const resetCustomization = useCallback(() => {
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    endPages.forEach(p => URL.revokeObjectURL(p.previewUrl));
    buildingPhotos.forEach(p => URL.revokeObjectURL(p.previewUrl));
    setPrimaryColor(DEFAULTS.primaryColor);
    setSecondaryColor(DEFAULTS.secondaryColor);
    setLogoFileState(null);
    setLogoPreviewUrl(null);
    setCoverFileState(null);
    setCoverPreviewUrl(null);
    setEndPages([]);
    setBuildingPhotos([]);
  }, [logoPreviewUrl, coverPreviewUrl, endPages, buildingPhotos]);

  const hasCustomization =
    primaryColor !== DEFAULTS.primaryColor ||
    secondaryColor !== DEFAULTS.secondaryColor ||
    logoFile !== null ||
    coverFile !== null ||
    endPages.length > 0 ||
    buildingPhotos.length > 0;

  return (
    <CustomizationContext.Provider
      value={{
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
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomization() {
  const context = useContext(CustomizationContext);
  if (context === undefined) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
}
