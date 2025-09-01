import React, { createContext, useContext, useState } from 'react';

interface MapContextType {
  isMapOpen: boolean;
  setMapOpen: (open: boolean) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const setMapOpen = (open: boolean) => {
    setIsMapOpen(open);
  };

  return (
    <MapContext.Provider value={{ isMapOpen, setMapOpen }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
}
