import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from 'next-sanity';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

type IncomingMessage = { role: 'user' | 'assistant'; content: string };

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

    // Pull live inventory data from Sanity
    const sanityData = await sanityClient.fetch(`
      *[_type == "car"]{ title, price, year, status }[0...10]
    `);

    const systemInstruction = `
      أنت مساعد ذكي فاخر لموقع سيارات (Automotive Hub).
      استخدم البيانات المتاحة التالية فقط من الـ CMS للإجابة على استفسارات المستخدمين:
      ${JSON.stringify(sanityData)}

      إذا لم تجد الإجابة في البيانات، أجب بأسلوب راقي وقصير جداً.
    `;

    // Map the full conversation into Gemini's format so it remembers context
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const result = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
      },
    });

    return NextResponse.json({ reply: result.text });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ reply: 'عذراً، حدث خطأ أثناء الاتصال بالخادم.' }, { status: 500 });
  }
}