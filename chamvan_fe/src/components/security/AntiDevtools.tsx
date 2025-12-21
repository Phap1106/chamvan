"use client";

import { useEffect } from "react";

export default function AntiDevtools() {
  useEffect(() => {
    const onCtx = (e: MouseEvent) => e.preventDefault();

    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      // chặn các combo phổ biến
      if (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(k)) e.preventDefault();
      if (e.ctrlKey && ["u", "s"].includes(k)) e.preventDefault();
      if (k === "f12") e.preventDefault();
    };

    document.addEventListener("contextmenu", onCtx);
    window.addEventListener("keydown", onKey, { passive: false });

    return () => {
      document.removeEventListener("contextmenu", onCtx);
      window.removeEventListener("keydown", onKey as any);
    };
  }, []);

  return null;
}
