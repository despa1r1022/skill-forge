import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../lib/tauri";
import type { SkillEntry } from "../types";

interface SkillsContextType {
  skills: SkillEntry[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const SkillsContext = createContext<SkillsContextType>({
  skills: [],
  loading: false,
  refresh: async () => {},
});

export function SkillsProvider({ toolId, children }: { toolId: string; children: ReactNode }) {
  const [skills, setSkills] = useState<SkillEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!toolId) return;
    setLoading(true);
    try {
      const result = await api.listSkills(toolId);
      console.log(`[SkillsProvider] toolId=${toolId}, count=${result.length}`, result.map(s => s.name));
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

  return (
    <SkillsContext.Provider value={{ skills, loading, refresh }}>
      {children}
    </SkillsContext.Provider>
  );
}

export function useSkillsContext() {
  return useContext(SkillsContext);
}

// Legacy hook - wraps the context for backward compatibility in components that don't have provider
export function useSkills(toolId: string) {
  try {
    return useContext(SkillsContext);
  } catch {
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
}
