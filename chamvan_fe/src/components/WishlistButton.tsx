"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toaster";

export default function WishlistButton({ productId }: { productId: string }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [active, setActive] = useState(false);
  const toast = useToast();
  const key = "cv_wishlist";

  useEffect(() => {
    try {
      setIsAuthed(Boolean(localStorage.getItem("auth_user")));
      const raw = localStorage.getItem(key);
      const list: string[] = raw ? JSON.parse(raw) : [];
      setActive(list.includes(productId));
    } catch {}
  }, [productId]);

  function toggle() {
    if (!isAuthed) {
      toast({
        variant: "warning",
        title: "Cần đăng nhập",
        message: "Hãy đăng nhập để dùng Yêu thích.",
        action: { label: "Đăng nhập", onClick: () => (window.location.href = "/dang-nhap") },
        duration: 3500,
      });
      return;
    }
    try {
      const raw = localStorage.getItem(key);
      const list: string[] = raw ? JSON.parse(raw) : [];
      const i = list.indexOf(productId);
      let msg = "";
      if (i >= 0) {
        list.splice(i, 1);
        msg = "Đã bỏ khỏi Yêu thích.";
        setActive(false);
      } else {
        list.push(productId);
        msg = "Đã thêm vào Yêu thích.";
        setActive(true);
      }
      localStorage.setItem(key, JSON.stringify(list));
      toast({ variant: "success", message: msg });
    } catch {
      toast({ variant: "error", message: "Có lỗi xảy ra. Vui lòng thử lại." });
    }
  }

  return (
    <button onClick={toggle} className="inline-flex items-center gap-1 underline">
      <svg width="16" height="16" viewBox="0 0 24 24"
        className={`transition ${active ? "fill-rose-500 stroke-rose-500" : "fill-none stroke-neutral-700"}`}>
        <path strokeWidth="1.8" d="M12 21s-6.716-4.297-9.333-7.24C.833 11.7 2 8 5.333 8A4.6 4.6 0 0 1 12 9.5 4.6 4.6 0 0 1 18.667 8C22 8 23.167 11.7 21.333 13.76 18.716 16.703 12 21 12 21Z"/>
      </svg>
      Yêu thích
    </button>
  );
}
