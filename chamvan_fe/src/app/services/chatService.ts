// // src/services/chatService.ts
// import OpenAI from "openai";
// import { SYSTEM_PROMPT } from "./prompt";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export interface ChatMessage {
//   role: "user" | "assistant";
//   content: string;
//   image?: string; // data URL base64 nếu có ảnh
// }

// export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
//   if (!process.env.OPENAI_API_KEY) {
//     throw new Error("Missing OPENAI_API_KEY");
//   }

//   // Chuẩn hoá về dạng messages của OpenAI
//   const apiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

//   // System prompt cố định
//   apiMessages.push({
//     role: "system",
//     content: SYSTEM_PROMPT,
//   });

//   for (const msg of messages) {
//     if (msg.role === "user" && msg.image) {
//       // User có kèm ảnh → dùng content dạng mảng (text + image_url)
//       const parts: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];

//       if (msg.content && msg.content.trim() !== "") {
//         parts.push({
//           type: "text",
//           text: msg.content,
//         });
//       } else {
//         // nếu user chỉ gửi ảnh không có text
//         parts.push({
//           type: "text",
//           text: "Hãy phân tích nội dung của hình ảnh này.",
//         });
//       }

//       parts.push({
//         type: "image_url",
//         image_url: {
//           url: msg.image, // data URL base64
//         },
//       });

//       apiMessages.push({
//         role: "user",
//         content: parts,
//       });
//     } else {
//       // User/assistant chỉ text
//       apiMessages.push({
//         role: msg.role,
//         content: msg.content,
//       });
//     }
//   }

//   // Gọi OpenAI bằng SDK
//   const completion = await openai.chat.completions.create({
//     // bạn có thể đổi thành "gpt-4.1" hoặc "gpt-4o" tuỳ tài khoản
//     model: "gpt-4.1", 
//     messages: apiMessages,
//     max_tokens: 20000,
//     temperature: 0.7,
//   });

//   const reply = completion.choices[0]?.message?.content ?? "";
//   return reply;
// }






// src/services/chatService.ts
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "./prompt";

const ENV_MODEL = process.env.ENV_MODEL ?? "1"; // "1" = OpenAI, "2" = Gemini

/* ========== OpenAI client ========== */
const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = openaiApiKey
  ? new OpenAI({
      apiKey: openaiApiKey,
    })
  : null;

/* ========== Gemini client ========== */
const geminiApiKey = process.env.GEMINI_API_KEY;
const gemini = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  image?: string; // data URL base64 nếu có ảnh
}

/* ============================================================
   HÀM PUBLIC: chatWithAI -> tự chọn provider theo ENV_MODEL
   ============================================================ */
export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  const provider = ENV_MODEL;

  if (provider === "2") {
    // Dùng Gemini
    if (!gemini) {
      throw new Error("Missing GEMINI_API_KEY (ENV_MODEL=2 nhưng chưa set key Gemini)");
    }
    return chatWithGemini(messages);
  }

  // Mặc định: dùng OpenAI
  if (!openai) {
    throw new Error("Missing OPENAI_API_KEY (ENV_MODEL=1 nhưng chưa set key OpenAI)");
  }
  return chatWithOpenAI(messages);
}

/* ============================================================
   1) OpenAI (GPT) – logic cũ, tách riêng cho gọn
   ============================================================ */
async function chatWithOpenAI(messages: ChatMessage[]): Promise<string> {
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

  const completion = await openai!.chat.completions.create({
    model: "gpt-4o-mini", // gợi ý: dùng 4o-mini cho rẻ/nhanh, khi nào cần thì đổi sang 4.1
    messages: apiMessages,
    max_tokens: 2000,
    temperature: 0.7,
  });

  const reply = completion.choices[0]?.message?.content ?? "";
  return reply;
}

/* ============================================================
   2) Gemini – dùng khi ENV_MODEL=2
   ============================================================ */

async function chatWithGemini(messages: ChatMessage[]): Promise<string> {
  if (!gemini) {
    throw new Error(
      "Missing GEMINI_API_KEY (ENV_MODEL=2 nhưng chưa set GEMINI_API_KEY)"
    );
  }

  try {
    // Chọn model Gemini – có thể giữ 2.5-flash như anh đang dùng
    const model = gemini.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT
        ? {
            // systemInstruction là một Content object
            role: "system",
            parts: [{ text: SYSTEM_PROMPT }],
          }
        : undefined,
    });

    // Build history cho Gemini
    const history: { role: "user" | "model"; parts: { text: string }[] }[] = [];

    for (const msg of messages) {
      const role: "user" | "model" = msg.role === "user" ? "user" : "model";

      // Nếu có ảnh, thêm note để model hiểu (không xử lý base64)
      const baseText = msg.content || "";
      const textWithNote = msg.image
        ? `${baseText}\n\n[Lưu ý: người dùng có gửi kèm 1 hình ảnh (dạng base64). Hãy tập trung tư vấn dựa trên phần chữ, bỏ qua nội dung hình nếu không đọc được.]`
        : baseText;

      history.push({
        role,
        parts: [{ text: textWithNote }],
      });
    }

    // Gemini yêu cầu phần tử đầu tiên trong history phải là user
    if (history.length === 0 || history[0].role !== "user") {
      history.unshift({
        role: "user",
        parts: [{ text: "Xin chào, em cần tư vấn giúp." }],
      });
    }

    // Lấy tin nhắn user mới nhất làm prompt chính
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const prompt =
      lastUser?.content?.trim() ||
      "Anh/chị vui lòng nhắn lại nội dung cần tư vấn giúp em ạ.";

    // Tạo phiên chat với history đã chuẩn hóa
    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(prompt);
    const text = result.response.text() || "";

    return text;
  } catch (err: any) {
    console.error("Gemini error:", err);

    const msg = String(err?.message || "").toLowerCase();
    const status = (err as any)?.status;

    const isOverloaded =
      status === 503 ||
      msg.includes("overloaded") ||
      msg.includes("service unavailable");

    if (isOverloaded) {
      // Trường hợp model quá tải / 503 – trả thông điệp thân thiện cho khách
      return (
        "Hiện tại hệ thống trả lời tự động đang hơi quá tải hoặc tạm thời gián đoạn.\n\n" +
        "- Anh/chị có thể chờ 1–2 phút rồi thử lại giúp em.\n" +
        "- Hoặc nhắn trực tiếp qua Fanpage / Zalo để được hỗ trợ nhanh hơn ạ. 🙏"
      );
    }

    // Lỗi khác (mạng, cấu hình…) – trả lời chung chung
    return (
      "Xin lỗi anh/chị, hiện tại hệ thống đang gặp sự cố kỹ thuật nên chưa trả lời được ngay.\n\n" +
      "Anh/chị vui lòng thử lại sau ít phút hoặc liên hệ trực tiếp Fanpage / Zalo giúp em nhé."
    );
  }
}


