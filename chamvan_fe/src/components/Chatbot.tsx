"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatbotProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  image?: string;
};

const MIN_REPLY_TIME = 100; // ms
const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK as string;

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  // mỗi lần load trang tạo 1 conversationId mới
  const [conversationId] = useState<string>(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `cv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Xin chào 👋 Em là trợ lý Chạm Vân. Anh/chị muốn xem sản phẩm, hỏi về giá hay cần em tư vấn quà tặng ạ?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  // ref đến cuối danh sách tin nhắn
const messagesEndRef = useRef<HTMLDivElement | null>(null);

// mỗi khi messages hoặc loading đổi, tự cuộn xuống cuối
useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }
}, [messages, loading]);

  // Gợi ý xuất hiện lúc đầu (giữa khung) – chỉ hiện khi chưa có tin nhắn user
  const suggestedQuestions: string[] = [
    "Anh/chị muốn xem sản phẩm nào? (hãy nhập tên mẫu hoặc mô tả ở ô chat phía dưới nhé)",
    "Em tư vấn giúp anh/chị chọn quà tặng phù hợp.",
    "Em tư vấn giúp anh/chị chọn tượng trang trí cho phòng khách.",
  ];

  // Gợi ý luôn xuất hiện trên ô nhập – ưu tiên câu hỏi chung, không dính dữ liệu cụ thể
  const bottomQuestions: string[] = [
    "Em tư vấn giúp anh/chị chọn quà tặng.",
    "Em tư vấn giúp anh/chị chọn tượng cho phòng khách.",
    "Em tư vấn giúp anh/chị chọn tượng phong thủy hợp mệnh.",
    "Anh/chị cần thông tin về giao hàng / đổi trả.",
  ];

  if (!isOpen) return null;

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Gọi API nội bộ dùng OpenAI SDK trực tiếp (xử lý FAQ đơn giản + ảnh)
  const callLocalAI = async (updatedMessages: Message[]): Promise<string> => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    if (!res.ok) {
      throw new Error(`Local AI HTTP ${res.status}`);
    }

    const data = await res.json();
    const aiText: string =
      data?.message ||
      data?.reply ||
      data?.output ||
      "Xin lỗi anh/chị, hiện tại em chưa nhận được phản hồi. Anh/chị vui lòng thử lại sau ít phút nhé.";

    return aiText;
  };

  // Gọi n8n (RAG, dữ liệu sản phẩm,...)
  const callN8n = async (
    updatedMessages: Message[],
    lastMessage: Message,
  ): Promise<string> => {
    if (!N8N_WEBHOOK_URL) {
      throw new Error("Thiếu NEXT_PUBLIC_N8N_CHAT_WEBHOOK trong env");
    }

    const payload = {
      conversationId,
      messages: updatedMessages,
      lastMessage,
      source: "chamvan_fe",
    };

    if (process.env.NODE_ENV === "development") {
      console.log("[Chatbot → n8n] payload:", payload);
    }

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`n8n HTTP ${res.status}`);
    }

    const data: any = await res.json();

    // n8n có thể trả về object hoặc mảng [{ output: ... }]
    let aiText: string | undefined;

    if (Array.isArray(data)) {
      const first = data[0] || {};
      aiText = first.reply || first.output || first.message;
    } else {
      aiText = data.reply || data.output || data.message;
    }

    return (
      aiText ||
      "Xin lỗi anh/chị, hiện tại em chưa nhận được phản hồi. Anh/chị vui lòng thử lại sau ít phút nhé."
    );
  };

  // Hàm gửi – tuỳ mode: useLocalAI=true thì gọi GPT trực tiếp, ngược lại gọi n8n
  const sendMessage = async (opts?: {
    textOverride?: string;
    useLocalAI?: boolean;
  }) => {
    if (loading) return;

    const textToSend = (opts?.textOverride ?? inputText).trim();
    const hadImage = !!attachedImage;

    if (!textToSend && !hadImage) return;

    const newUserMessage: Message = {
      role: "user",
      content: textToSend,
    };
    if (hadImage && attachedImage) {
      newUserMessage.image = attachedImage;
    }

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputText("");
    setAttachedImage(null);
    setLoading(true);

    const startTime = Date.now();

    try {
      // Điều kiện dùng local AI:
      // - opts.useLocalAI = true (câu hỏi gợi ý có sẵn)
      // - có ảnh đính kèm
      // - hoặc không cấu hình webhook n8n
      const useLocal =
        opts?.useLocalAI === true || hadImage || !N8N_WEBHOOK_URL;

      let aiText: string;
      if (useLocal) {
        aiText = await callLocalAI(updatedMessages);
      } else {
        aiText = await callN8n(updatedMessages, newUserMessage);
      }

      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_REPLY_TIME) {
        await new Promise((resolve) =>
          setTimeout(resolve, MIN_REPLY_TIME - elapsed),
        );
      }

      const aiMessage: Message = {
        role: "assistant",
        content: aiText,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Xin lỗi anh/chị, hiện tại hệ thống đang bận hoặc mất kết nối. Anh/chị vui lòng thử lại sau ít phút nhé.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage();
  };

  // Câu hỏi gợi ý → luôn dùng local GPT (không gọi n8n)
  const handleSuggestionClick = (question: string) => {
    if (loading) return;
    void sendMessage({ textOverride: question, useLocalAI: true });
  };

  const hasUserMessage = messages.some((m) => m.role === "user");

  const renderMessageContent = (msg: Message) => {
    if (msg.role === "assistant") {
      return (
        <div className="chat-markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {msg.content}
          </ReactMarkdown>
        </div>
      );
    }
    return <span>{msg.content}</span>;
  };

  return (
    <div className="chatbot-shell">
      <div className="chatbot-container">
        {/* HEADER */}
        <div className="chatbot-header">
          <div className="chatbot-header-left">
            <div className="chatbot-avatar">CV</div>
            <div>
              <div className="chatbot-title">Chạm Vân Assistant</div>
              <div className="chatbot-subtitle">
                Thường phản hồi trong vài giây
              </div>
            </div>
          </div>
          <button
            type="button"
            className="chatbot-close-btn"
            onClick={onClose}
            aria-label="Đóng chatbot"
          >
            ×
          </button>
        </div>

        {/* MESSAGES */}
        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chatbot-message-row ${msg.role}`}
            >
              <div
                className={`chat-bubble ${
                  msg.role === "user" ? "user-bubble" : "assistant-bubble"
                }`}
              >
                {renderMessageContent(msg)}
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Ảnh người dùng gửi"
                    className="chatbot-image-in-bubble"
                  />
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chatbot-loading-row">
              <div className="chatbot-loading-bubble">
                <span className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            </div>
          )}

          {/* GỢI Ý GIỮA KHUNG – chỉ khi chưa có tin nhắn user & đang mở gợi ý */}
          {!hasUserMessage && showSuggestions && (
            <div className="chatbot-suggestions">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="chatbot-suggestion-btn"
                  onClick={() => handleSuggestionClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
            <div ref={messagesEndRef} />

        </div>

        {/* FOOTER / INPUT */}
        <div className="chatbot-footer">
          <div className="chatbot-suggestions-toggle">
            <button
              type="button"
              onClick={() => setShowSuggestions((prev) => !prev)}
            >
              <span>Gợi ý câu hỏi</span>
              <span
                className={`chatbot-toggle-icon ${
                  showSuggestions ? "open" : ""
                }`}
              >
                ˅
              </span>
            </button>
          </div>

          {/* Dải gợi ý phía trên ô nhập – chỉ 1 lần, thu gọn khi đã có tin nhắn user */}
          {showSuggestions && (
            <div
              className={
                "chatbot-suggestions-bottom" +
                (hasUserMessage ? " chatbot-suggestions-bottom--compact" : "")
              }
            >
              {bottomQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="chatbot-suggestion-btn chatbot-suggestion-btn--small"
                  onClick={() => handleSuggestionClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Preview ảnh nếu có */}
          {attachedImage && (
            <div className="chatbot-image-preview">
              <img src={attachedImage} alt="Ảnh đã chọn" />
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                aria-label="Xoá ảnh"
              >
                ×
              </button>
            </div>
          )}

          {/* FORM INPUT */}
          <form className="chatbot-input-row" onSubmit={handleSubmit}>
            <button
              type="button"
              className="chatbot-attach-btn"
              onClick={() =>
                document.getElementById("chatbot-image-input")?.click()
              }
              aria-label="Đính kèm hình ảnh"
            >
              📎
            </button>
            <input
              id="chatbot-image-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleSelectImage}
            />
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={loading}
            >
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
