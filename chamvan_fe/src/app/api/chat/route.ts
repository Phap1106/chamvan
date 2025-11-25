// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { chatWithAI ,ChatMessage} from '@/app/services/chatService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body?.messages as ChatMessage[] | undefined;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request body: messages is required." },
        { status: 400 }
      );
    }

    const assistantReply = await chatWithAI(messages);

    return NextResponse.json({ message: assistantReply });
  } catch (err) {
    console.error("API /api/chat error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
