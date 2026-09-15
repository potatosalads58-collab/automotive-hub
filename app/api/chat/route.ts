import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from 'next-sanity';

// Allow enough time for retries on Vercel (needs a paid plan for >10s on Hobby)
export const maxDuration = 60;

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

type IncomingMessage = { role: 'user' | 'assistant'; content: string };

async function generateWithRetry(
  params: Parameters<typeof ai.models.generateContent>[0],
  maxRetries = 5
) {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err) {
      lastError = err;
      const message = err instanceof Error ? err.message : String(err);
      const isOverloaded = message.includes('UNAVAILABLE') || message.includes('503');
      if (isOverloaded && attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1))); // 1s, 2s, 3s...
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: IncomingMessage[] = body.messages || [];

    if (!apiKey) {
      return NextResponse.json({ reply: 'API Key is missing.' }, { status: 500 });
    }
    if (messages.length === 0) {
      return NextResponse.json({ reply: 'No message provided.' }, { status: 400 });
    }

    const sanityData = await sanityClient.fetch(`
      *[_type == "car"]{ title, price, year, status }[0...10]
    `);

    const systemInstruction = `
      You are a refined, luxury assistant for Automotive Hub, a premium car
      dealership. Use only the following live inventory data from the CMS to
      answer questions:
      ${JSON.stringify(sanityData)}

      Language rule: always reply in the same language as the user's most
      recent message. If they write in English, reply in English. If they
      write in Arabic, reply in Arabic. If the language is unclear or mixed,
      default to Arabic.

      If the answer isn't in the data provided, respond briefly and elegantly
      without inventing information.
    `;

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const result = await generateWithRetry({
      model: 'gemini-3.5-flash',
      contents,
      config: { systemInstruction },
    });

    return NextResponse.json({ reply: result.text });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { reply: 'Sorry, something went wrong. / عذراً، حدث خطأ أثناء الاتصال بالخادم.' },
      { status: 500 }
    );
  }
}