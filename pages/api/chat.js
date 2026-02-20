import fs from 'fs/promises';
import path from 'path';

let cachedSystemPrompt = null;

const MODEL_NAME = process.env.OPENAI_MODEL || 'gpt-5.2';

async function loadSystemPrompt() {
    if (cachedSystemPrompt) return cachedSystemPrompt;
    const promptPath = path.join(process.cwd(), '.ai', 'systemprompt.md');
    cachedSystemPrompt = await fs.readFile(promptPath, 'utf8');
    return cachedSystemPrompt;
}

function normalizeMessages(messages) {
    if (!Array.isArray(messages)) return [];
    return messages
        .filter((message) => message && typeof message.content === 'string')
        .map((message) => ({
            role: message.role === 'assistant' ? 'assistant' : 'user',
            content: message.content.trim(),
        }))
        .filter((message) => message.content.length > 0)
        .slice(-16);
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OPENAI_API_KEY is not configured.' });
    }

    try {
        const systemPrompt = await loadSystemPrompt();
        const clientMessages = normalizeMessages(req.body?.messages);

        if (clientMessages.length === 0) {
            return res.status(400).json({ error: 'No messages supplied.' });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                temperature: 0.4,
                max_completion_tokens: 400,
                stream: true,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...clientMessages,
                ],
            }),
        });

        if (!response.ok) {
            const errorPayload = await response.json().catch(() => ({}));
            const errorMessage = errorPayload?.error?.message || 'OpenAI request failed.';
            return res.status(response.status).json({ error: errorMessage });
        }

        if (!response.body) {
            return res.status(502).json({ error: 'OpenAI stream was unavailable.' });
        }

        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders?.();

        const decoder = new TextDecoder();
        let buffer = '';

        for await (const chunk of response.body) {
            buffer += decoder.decode(chunk, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith('data:')) continue;

                const data = trimmed.replace(/^data:\s*/, '');
                if (data === '[DONE]') {
                    res.write('data: [DONE]\n\n');
                    res.end();
                    return;
                }

                try {
                    const payload = JSON.parse(data);
                    const choice = payload?.choices?.[0];
                    const delta = choice?.delta?.content;
                    const finishReason = choice?.finish_reason;
                    if (delta) {
                        res.write(`data: ${JSON.stringify({ delta })}\n\n`);
                    }
                    if (finishReason) {
                        res.write(`data: ${JSON.stringify({ finish_reason: finishReason })}\n\n`);
                    }
                } catch (parseError) {
                    res.write(`data: ${JSON.stringify({ error: 'Stream parse error.' })}\n\n`);
                }
            }
        }

        res.write('data: [DONE]\n\n');
        res.end();
        return;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unexpected server error.';
        return res.status(500).json({ error: message });
    }
}
