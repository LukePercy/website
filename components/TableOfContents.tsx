import type { TocEntry } from '../types/site';

interface TableOfContentsProps {
  entries: TocEntry[];
}

export default function TableOfContents({ entries }: TableOfContentsProps) {
  if (entries.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="max-h-[calc(100vh-7rem)] overflow-y-auto">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
        Contents
      </p>
      <ol className="space-y-2.5">
        {entries.map(({ text, slug }) => (
          <li key={slug}>
            <a
              href={`#${slug}`}
              className="block text-sm text-slate-400 hover:text-white leading-snug transition-colors"
            >
              {text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
