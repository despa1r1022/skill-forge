import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../lib/tauri";
import type { ToolInfo } from "../types";

interface ToolsContextType {
  tools: ToolInfo[];
  loading: boolean;
  selectedTool: string;
  setSelectedTool: (id: string) => void;
  refresh: () => Promise<void>;
}

const ToolsContext = createContext<ToolsContextType>({
  tools: [],
  loading: false,
  selectedTool: "codebuddy",
  setSelectedTool: () => {},
  refresh: async () => {},
});

export function ToolsProvider({ children }: { children: ReactNode }) {
  const [tools, setTools] = useState<ToolInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState("codebuddy");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.listTools();
      setTools(result);
    } catch (err) {
      console.error("Failed to list tools:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <ToolsContext.Provider value={{ tools, loading, selectedTool, setSelectedTool, refresh }}>
      {children}
    </ToolsContext.Provider>
  );
}

export function useTools() {
  return useContext(ToolsContext);
}
