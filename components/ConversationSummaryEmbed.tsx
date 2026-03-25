import { useState } from 'react';

type ConversationSummaryEmbedProps = {
  title?: string;
  description?: string;
  src?: string;
};

const DEFAULT_SRC = '/conversation-summary.html';

export default function ConversationSummaryEmbed({
  title = 'RepoWatch session summary',
  description = 'Interactive timeline of the diagnosis, deploy fixes, and lessons learned.',
  src = DEFAULT_SRC,
}: ConversationSummaryEmbedProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      className="not-prose my-14 w-screen px-4 sm:px-4 lg:px-12"
      style={{ marginLeft: 'calc(50% - 50vw)' }}
    >
      <div className="mx-auto max-w-6xl rounded-2xl border border-slate-700/70 bg-slate-900/55 p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Interactive Companion
            </p>
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-slate-500 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-300 hover:text-white transition-colors"
            >
              Open full page
            </a>
            <button
              type="button"
              onClick={() => setIsExpanded((current) => !current)}
              className="inline-flex items-center rounded-full border border-amber-200/50 bg-amber-100/10 px-4 py-2 text-sm font-medium text-amber-50 hover:border-amber-100 hover:bg-amber-100/20 transition-colors"
              aria-expanded={isExpanded}
            >
              {isExpanded ? 'Hide inline view' : 'Show inline view'}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
            <iframe
              src={src}
              title={title}
              loading="lazy"
              className="h-[720px] w-full"
            />
          </div>
        )}
      </div>
    </section>
  );
}
