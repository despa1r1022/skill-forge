import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/tauri";
import type { SkillEntry } from "../types";

export function useSkills(toolId: string) {
  const [skills, setSkills] = useState<SkillEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!toolId) return;
    setLoading(true);
    try {
      const result = await api.listSkills(toolId);
      setSkills(result);
    } catch (err) {
      console.error("Failed to list skills:", err);
    } finally {
      setLoading(false);
    }
  }, [toolId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { skills, loading, refresh };
}
