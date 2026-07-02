import { useEffect, useRef } from "react";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { yaml } from "@codemirror/lang-yaml";

interface CodeEditorProps {
  value: string;
  filename: string;
  readonly?: boolean;
  onChange: (value: string) => void;
}

export function CodeEditor({ value, filename, readonly, onChange }: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const getExtension = (fn: string) => {
    const ext = fn.split(".").pop()?.toLowerCase() || "";
    switch (ext) {
      case "json": return json();
      case "md": return markdown();
      case "js":
      case "ts":
      case "jsx":
      case "tsx": return javascript();
      case "py": return python();
      case "yml":
      case "yaml": return yaml();
      case "sh":
      case "bash": return javascript();
      case "css": return javascript();
      case "html": return javascript();
      default: return [];
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        oneDark,
        getExtension(filename),
        EditorState.readOnly.of(!!readonly),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": { height: "100%" },
          ".cm-scroller": { overflow: "auto" },
          "&.cm-focused": { outline: "none" },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []); // Only mount once per instance

  // Update content when value prop changes externally
  useEffect(() => {
    if (!viewRef.current) return;
    const currentDoc = viewRef.current.state.doc.toString();
    if (value !== currentDoc) {
      viewRef.current.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: value },
      });
    }
  }, [value]);

  return <div ref={containerRef} className="h-[50vh]" />;
}
