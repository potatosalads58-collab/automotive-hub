import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from 'next-sanity';

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
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
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
      return NextResponse.json({ reply: 'API Key is missing.', navigateTo: null }, { status: 500 });
    }
    if (messages.length === 0) {
      return NextResponse.json({ reply: 'No message provided.', navigateTo: null }, { status: 400 });
    }

    // Full car details — not just names — so the assistant can actually
    // answer questions about price, year, mileage, specs, and body type.
    const sanityData = await sanityClient.fetch(`
      *[_type == "car" && isAvailable == true] | order(_createdAt desc){
        _id, title, price, year, mileage, bodyType, specs
      }
    `);

    const systemInstruction = `
      You are a refined, knowledgeable assistant for Automotive Hub, a premium
      car dealership in Cairo, Egypt. Use only the following live inventory
      data to answer questions about specific cars, prices, specs, mileage,
      or availability:
      ${JSON.stringify(sanityData)}

      Language rule: always reply in the same language as the user's most
      recent message. English in, English out. Arabic in, Arabic out. If
      unclear, default to Arabic.

      Formatting rule: never use markdown — no asterisks, no bullet dashes,
      no headers. Write in plain, natural sentences, the way a person
      speaks.

      Navigation rule: if the user asks to be taken somewhere, or their
      question is clearly best answered by visiting a page, set navigateTo
      to the matching path:
      - A specific car from the data above -> "/vehicle/{_id}" using that
        car's real _id
      - Browsing all available cars -> "/inventory"
      - Contacting the dealership, asking a question a human should answer,
        or wanting to visit/call -> "/contact"
      - Learning about the company -> "/about"
      - Selling their own car -> "/sell-your-car"
      - Reading news/reviews -> "/news"
      If none of these clearly apply, set navigateTo to null. Never invent
      a path that isn't one of the ones listed above.

      If the answer isn't in the data provided, say so briefly and
      elegantly without inventing information.
    `;

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const result = await generateWithRetry({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            reply: { type: 'string' },
            navigateTo: { type: 'string', nullable: true },
          },
          required: ['reply'],
        } as any,
      },
    });

    let reply = 'Sorry, something went wrong.';
    let navigateTo: string | null = null;
    try {
      const parsed = JSON.parse(result.text ?? '{}');
      reply = parsed.reply ?? reply;
      navigateTo = parsed.navigateTo ?? null;
    } catch {
      // Model didn't return valid JSON — fall back to raw text as the reply
      reply = result.text ?? reply;
    }

    return NextResponse.json({ reply, navigateTo });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { reply: 'Sorry, something went wrong. / عذراً، حدث خطأ أثناء الاتصال بالخادم.', navigateTo: null },
      { status: 500 }
    );
  }
}
