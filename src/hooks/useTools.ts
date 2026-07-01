import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/tauri";
import type { ToolInfo } from "../types";

export function useTools() {
  const [tools, setTools] = useState<ToolInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState<string>("codebuddy");

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

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tools, loading, selectedTool, setSelectedTool, refresh };
}
