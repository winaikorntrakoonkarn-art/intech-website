"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const MAX_COMPARE = 4;

interface CompareContextType {
  compareIds: number[];
  isInCompare: (productId: number) => boolean;
  toggleCompare: (productId: number) => void;
  addToCompare: (productId: number) => boolean;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
  count: number;
  isFull: boolean;
}

const CompareContext = createContext<CompareContextType>({
  compareIds: [],
  isInCompare: () => false,
  toggleCompare: () => {},
  addToCompare: () => false,
  removeFromCompare: () => {},
  clearCompare: () => {},
  count: 0,
  isFull: false,
});

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("intech_compare");
      if (saved) setCompareIds(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("intech_compare", JSON.stringify(compareIds));
    }
  }, [compareIds, loaded]);

  const isInCompare = useCallback(
    (productId: number) => compareIds.includes(productId),
    [compareIds]
  );

  const addToCompare = useCallback((productId: number) => {
    let added = false;
    setCompareIds((prev) => {
      if (prev.includes(productId)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      added = true;
      return [...prev, productId];
    });
    return added;
  }, []);

  const removeFromCompare = useCallback((productId: number) => {
    setCompareIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const toggleCompare = useCallback((productId: number) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, productId];
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
  }, []);

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        isInCompare,
        toggleCompare,
        addToCompare,
        removeFromCompare,
        clearCompare,
        count: compareIds.length,
        isFull: compareIds.length >= MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => useContext(CompareContext);
