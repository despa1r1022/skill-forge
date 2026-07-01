import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/tauri";
import type { SkillEntry } from "../types";

export function useSkillDetail(toolId: string, name: string | undefined) {
  const [skill, setSkill] = useState<SkillEntry | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!toolId || !name) return;
    setLoading(true);
    try {
      const result = await api.getSkill(toolId, name);
      setSkill(result);
    } catch (err) {
      console.error("Failed to get skill:", err);
    } finally {
      setLoading(false);
    }
  }, [toolId, name]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { skill, loading, refresh };
}
