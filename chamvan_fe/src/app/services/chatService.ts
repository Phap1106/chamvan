// src/services/chatService.ts
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./prompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  image?: string; // data URL base64 nếu có ảnh
}

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  // Chuẩn hoá về dạng messages của OpenAI
  const apiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

  // System prompt cố định
  apiMessages.push({
    role: "system",
    content: SYSTEM_PROMPT,
  });

  for (const msg of messages) {
    if (msg.role === "user" && msg.image) {
      // User có kèm ảnh → dùng content dạng mảng (text + image_url)
      const parts: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];

      if (msg.content && msg.content.trim() !== "") {
        parts.push({
          type: "text",
          text: msg.content,
        });
      } else {
        // nếu user chỉ gửi ảnh không có text
        parts.push({
          type: "text",
          text: "Hãy phân tích nội dung của hình ảnh này.",
        });
      }

      parts.push({
        type: "image_url",
        image_url: {
          url: msg.image, // data URL base64
        },
      });

      apiMessages.push({
        role: "user",
        content: parts,
      });
    } else {
      // User/assistant chỉ text
      apiMessages.push({
        role: msg.role,
        content: msg.content,
      });
    }
  }

  // Gọi OpenAI bằng SDK
  const completion = await openai.chat.completions.create({
    // bạn có thể đổi thành "gpt-4.1" hoặc "gpt-4o" tuỳ tài khoản
    model: "gpt-4.1", 
    messages: apiMessages,
    max_tokens: 20000,
    temperature: 0.7,
  });

  const reply = completion.choices[0]?.message?.content ?? "";
  return reply;
}
