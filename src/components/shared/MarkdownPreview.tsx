import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  if (!content) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-300">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">暂无内容</p>
        </div>
      </div>
    );
  }

  return (
    <article className="prose prose-slate max-w-none prose-headings:scroll-mt-28 prose-headings:font-semibold prose-h1:text-2xl prose-h1:mt-8 prose-h1:mb-4 prose-h1:pb-2 prose-h1:border-b prose-h1:border-gray-200 prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-2 prose-p:text-sm prose-p:leading-7 prose-p:text-gray-600 prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-800 prose-code:text-amber-700 prose-code:bg-amber-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:shadow-inner prose-pre:rounded-xl prose-img:rounded-lg prose-img:shadow-md prose-blockquote:border-l-violet-400 prose-blockquote:bg-violet-50/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-600 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-li:text-sm prose-li:text-gray-600 prose-hr:my-8 prose-hr:border-gray-200 prose-table:text-sm prose-th:bg-gray-50 prose-th:px-4 prose-th:py-2 prose-th:text-xs prose-th:font-semibold prose-td:px-4 prose-td:py-2 prose-td:text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
