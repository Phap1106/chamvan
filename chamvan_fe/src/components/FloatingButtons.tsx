"use client";

import React from "react";
import Image from "next/image";

import messengerIcon from "@/icon-logo/messenger.png";
import botIcon from "@/icon-logo/robot-assistant.png";

type FloatingButtonsProps = {
  onChatbotClick: () => void;
};

const FloatingButtons: React.FC<FloatingButtonsProps> = ({ onChatbotClick }) => {
  return (
    <div className="cv-floating-contact">
      {/* Caption giới thiệu khu vực hỗ trợ */}
      

      {/* Hai nút liên hệ */}
      <div className="cv-floating-contact-buttons">
        {/* Messenger */}
        <a
          href="https://www.facebook.com/profile.php?id=61558520552168"
          target="_blank"
          rel="noopener noreferrer"
          className="cv-floating-circle cv-floating-circle--messenger"
          aria-label="Nhắn tin Facebook"
        >
          <Image
            src={messengerIcon}
            alt="Nhắn tin Facebook"
            width={36}
            height={36}
            className="cv-floating-circle-image"
          />
        </a>

        {/* Chatbot – Trợ lý Chạm Vân */}
        <button
          type="button"
          className="cv-floating-circle cv-floating-circle--bot"
          onClick={onChatbotClick}
          aria-label="Mở trợ lý Chạm Vân"
        >
          <Image
            src={botIcon}
            alt="Trợ lý Chạm Vân"
            width={34}
            height={34}
            className="cv-floating-circle-image"
          />
        </button>
      </div>
      <div className="cv-floating-caption">
        <span className="cv-floating-caption-main">Cần hỗ trợ?</span>
        <span className="cv-floating-caption-sub">
          Nhắn tin ngay cho chúng tôi
        </span>
      </div>
    </div>
  );
};

export default FloatingButtons;
