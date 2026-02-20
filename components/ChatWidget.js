import React, { useEffect, useMemo, useRef, useState } from 'react';
import { marked } from 'marked';

const initialAssistantMessage = {
    role: 'assistant',
    content: "Kia ora. Ask me anything about digital delivery, CMS work, or advisory context.",
};

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([initialAssistantMessage]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [needsContinuation, setNeedsContinuation] = useState(false);
    const [language, setLanguage] = useState('en-NZ');
    const messagesEndRef = useRef(null);
    const abortControllerRef = useRef(null);
    const continuationInsertedRef = useRef(false);

    const trimmedMessages = useMemo(() => messages.slice(-16), [messages]);

    const escapeHtml = (value) =>
        value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

    const markdownRenderer = useMemo(() => {
        const renderer = new marked.Renderer();

        const toSafeUrl = (href) => {
            if (!href) return null;
            try {
                const url = new URL(href, 'https://ljpercy.com');
                if (['http:', 'https:', 'mailto:'].includes(url.protocol)) {
                    return url.href;
                }
                return null;
            } catch {
                return null;
            }
        };

        renderer.text = (text) => escapeHtml(text);
        renderer.html = (html) => escapeHtml(html);
        renderer.codespan = (code) => `<code>${escapeHtml(code)}</code>`;
        renderer.code = (code) => `<pre><code>${escapeHtml(code)}</code></pre>`;
        renderer.image = () => '';
        renderer.link = (href, title, text) => {
            const safeHref = toSafeUrl(href);
            const safeText = escapeHtml(text || '');
            if (!safeHref) return safeText;
            const safeTitle = title ? ` title="${escapeHtml(title)}"` : '';
            return `<a href="${safeHref}"${safeTitle} target="_blank" rel="noopener noreferrer">${safeText}</a>`;
        };

        return renderer;
    }, []);

    const renderMarkdown = (content) => {
        return marked.parse(content, {
            breaks: true,
            mangle: false,
            headerIds: false,
            renderer: markdownRenderer,
        });
    };

    useEffect(() => {
        if (!isOpen) return;
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [isOpen, messages]);

    const cancelStream = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    };

    const toggleOpen = () => {
        setIsOpen((prev) => {
            const next = !prev;
            if (!next) {
                cancelStream();
                setIsLoading(false);
            }
            return next;
        });
        setError('');
    };

    useEffect(() => () => cancelStream(), []);

    const handleStop = () => {
        cancelStream();
        setIsLoading(false);
    };

    const sendMessage = async (content) => {
        if (!content || isLoading) return;

        cancelStream();
        setNeedsContinuation(false);
        continuationInsertedRef.current = false;
        const nextMessages = [...messages, { role: 'user', content }];
        setMessages([...nextMessages, { role: 'assistant', content: '' }]);
        setInput('');
        setIsLoading(true);
        setError('');

        try {
            const abortController = new AbortController();
            abortControllerRef.current = abortController;
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: nextMessages, language }),
                signal: abortController.signal,
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload?.error || 'The assistant is unavailable right now.');
            }

            if (!response.body) {
                throw new Error('No response stream available.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed.startsWith('data:')) continue;
                    const data = trimmed.replace(/^data:\s*/, '');
                    if (data === '[DONE]') {
                        setIsLoading(false);
                        return;
                    }

                    const payload = JSON.parse(data);
                    if (payload?.error) {
                        throw new Error(payload.error);
                    }

                    if (payload?.delta) {
                        setMessages((prev) => {
                            const updated = [...prev];
                            const lastIndex = updated.length - 1;
                            const lastMessage = updated[lastIndex];
                            if (!lastMessage || lastMessage.role !== 'assistant') {
                                updated.push({ role: 'assistant', content: payload.delta });
                            } else {
                                updated[lastIndex] = {
                                    ...lastMessage,
                                    content: `${lastMessage.content}${payload.delta}`,
                                };
                            }
                            return updated;
                        });
                    }

                    if (payload?.finish_reason) {
                        if (payload.finish_reason === 'length' && !continuationInsertedRef.current) {
                            continuationInsertedRef.current = true;
                            setNeedsContinuation(true);
                            setMessages((prev) => [
                                ...prev,
                                {
                                    role: 'assistant',
                                    content: 'Looks like that response was a bit long. Would you like me to continue?',
                                },
                            ]);
                        } else if (payload.finish_reason === 'stop') {
                            setNeedsContinuation(false);
                        }
                    }
                }
            }
        } catch (err) {
            if (err?.name === 'AbortError') {
                return;
            }
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    const handleSend = () => {
        const content = input.trim();
        if (!content) return;
        sendMessage(content);
    };

    const handleContinue = () => {
        if (isLoading || !needsContinuation) return;
        sendMessage('Please continue.');
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
            <button
                type="button"
                onClick={toggleOpen}
                className="group flex items-center gap-3 rounded-full border border-slate-700/60 bg-slate-900/90 px-4 py-3 text-sm font-medium text-slate-100 shadow-xl backdrop-blur transition hover:border-slate-500/80 hover:bg-slate-900"
                aria-expanded={isOpen}
                aria-controls="chat-panel"
            >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-rose-500 text-slate-900 shadow">
                    AI
                </span>
                <span className="hidden sm:inline">Ask Luke's AI assistant</span>
                <span className="sm:hidden">Chat</span>
            </button>

            <div
                id="chat-panel"
                className={`mt-4 w-[min(92vw,480px)] origin-bottom-left rounded-2xl border border-slate-700/60 bg-slate-900/95 shadow-2xl backdrop-blur transition-all duration-200 ${isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
                    }`}
                role="dialog"
                aria-label="AI advisory chat"
                aria-hidden={!isOpen}
            >
                <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4">
                    <div>
                        <p className="text-sm font-semibold text-slate-100">AI Advisory Assistant</p>
                        <p className="text-xs text-slate-400">Calm, structured guidance based on Luke's own principles.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-xs text-slate-400" htmlFor="chat-language">
                            Language
                        </label>
                        <div className="relative">
                            <select
                                id="chat-language"
                                value={language}
                                onChange={(event) => setLanguage(event.target.value)}
                                className="appearance-none rounded-full border border-slate-700/60 bg-slate-900/80 px-3 py-1 pr-8 text-xs text-slate-200 transition hover:border-amber-500/70 hover:bg-slate-900 focus:border-amber-500/80 focus:outline-none focus:ring-1 focus:ring-amber-500/60"
                            >
                                <option className="bg-slate-900 text-slate-100" value="en-NZ">English (NZ)</option>
                                <option className="bg-slate-900 text-slate-100" value="mi-NZ">Te Reo Māori</option>
                            </select>
                            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 20 20"
                                    className="h-3.5 w-3.5"
                                    fill="currentColor"
                                >
                                    <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" />
                                </svg>
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={toggleOpen}
                            className="rounded-full border border-slate-700/60 p-2 text-slate-300 transition hover:border-slate-500/80 hover:text-white"
                            aria-label="Close chat"
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 6L6 18" />
                                <path d="M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="max-h-[55vh] space-y-4 overflow-y-auto px-5 py-4 text-sm text-slate-200">
                    {trimmedMessages.map((message, index) => (
                        <div
                            key={`${message.role}-${index}`}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow ${message.role === 'user'
                                    ? 'bg-gradient-to-br from-slate-200 to-slate-50 text-slate-900'
                                    : 'bg-slate-800/80 text-slate-100'
                                    }`}
                            >
                                {message.role === 'assistant' ? (
                                    <div
                                        className="chat-markdown prose prose-invert prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                                    />
                                ) : (
                                    message.content
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading ? (
                        <div className="flex justify-start">
                            <div className="rounded-2xl bg-slate-800/80 px-4 py-3 text-slate-300">
                                Thinking...
                            </div>
                        </div>
                    ) : null}
                    {error ? (
                        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-200">
                            {error}
                        </div>
                    ) : null}
                    <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-slate-800/80 px-5 py-4">
                    <div className="flex items-end gap-3">
                        <textarea
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask a question or describe the situation."
                            rows={2}
                            readOnly={isLoading}
                            className={`flex-1 resize-none rounded-xl border border-slate-700/60 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500/80 focus:outline-none focus:ring-0 ${isLoading ? 'cursor-not-allowed opacity-70' : ''
                                }`}
                        />
                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                                        Sending
                                    </span>
                                ) : (
                                    'Send'
                                )}
                            </button>
                            {isLoading ? (
                                <button
                                    type="button"
                                    onClick={handleStop}
                                    className="rounded-xl border border-slate-700/60 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500/80 hover:text-white"
                                >
                                    Stop
                                </button>
                            ) : null}
                            {needsContinuation && !isLoading ? (
                                <button
                                    type="button"
                                    onClick={handleContinue}
                                    className="rounded-xl border border-slate-700/60 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500/80 hover:text-white"
                                >
                                    Continue
                                </button>
                            ) : null}
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                        Responses are advisory. Sensitive details should be shared carefully.
                    </p>
                    {language === 'mi-NZ' ? (
                        <p className="mt-2 text-xs text-slate-500">
                            Te Reo Māori translations are best-effort and may miss nuance. Please review if using publicly.
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
