import ReactMarkdown from "react-markdown";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  if (!content) {
    return <p className="text-sm text-slate-400 italic">No content</p>;
  }

  return (
    <div className="prose prose-sm prose-slate max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-slate-800 mt-6 mb-3 pb-2 border-b border-slate-200">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-slate-700 mt-5 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium text-slate-600 mt-4 mb-1">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-sm text-slate-600 leading-relaxed my-2">{children}</p>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="px-1 py-0.5 bg-slate-100 text-red-500 rounded text-xs font-mono">
                {children}
              </code>
            ) : (
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-md overflow-x-auto text-xs">
                <code className={className}>{children}</code>
              </pre>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 my-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1 my-2">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-amber-400 bg-amber-50 pl-4 py-2 my-3 text-sm text-amber-800 rounded-r">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-slate-200" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
