"use client";

import React, { useState } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RootProviders from "@/components/providers/RootProviders";
import Toaster from "@/components/Toaster";
import FloatingButtons from "@/components/FloatingButtons";
import Chatbot from "@/components/Chatbot";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen((prev) => !prev);

  return (
    <Toaster>
      <RootProviders>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />

        {/* Nút nổi */}
        <FloatingButtons
          onChatbotClick={toggleChat}
          isChatOpen={isChatOpen}
        />

        {/* Khung Chatbot */}
        <Chatbot
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      </RootProviders>
    </Toaster>
  );
}
