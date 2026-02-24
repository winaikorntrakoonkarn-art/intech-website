"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "intech_recently_viewed";
const MAX_ITEMS = 12;

export function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setRecentIds(JSON.parse(saved));
    } catch {}
  }, []);

  const addViewed = useCallback((productId: number) => {
    setRecentIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const updated = [productId, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecentIds([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { recentIds, addViewed, clearRecent };
}
