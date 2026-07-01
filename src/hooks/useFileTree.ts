import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/tauri";
import type { SubDir } from "../types";

export function useFileTree(dir: string | undefined) {
  const [tree, setTree] = useState<SubDir[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!dir) return;
    setLoading(true);
    try {
      const result = await api.getFileTree(dir);
      setTree(result);
    } catch (err) {
      console.error("Failed to get file tree:", err);
    } finally {
      setLoading(false);
    }
  }, [dir]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tree, loading, refresh };
}
