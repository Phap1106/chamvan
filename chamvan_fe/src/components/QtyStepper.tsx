"use client";

import { useEffect, useState } from "react";

export default function QtyStepper({
  value = 1,
  min = 1,
  max = 99,
  onChange,
}: {
  value?: number;
  min?: number;
  max?: number;
  onChange?: (v: number) => void;
}) {
  const [v, setV] = useState<number>(value);
  const [bump, setBump] = useState(false);

  useEffect(() => setV(value), [value]);

  function set(val: number) {
    const n = Math.max(min, Math.min(max, val));
    setV(n);
    onChange?.(n);
    setBump(true);
    setTimeout(() => setBump(false), 150);
  }

  return (
    <div className="inline-flex items-center border rounded-md">
      <button
        type="button"
        onClick={() => set(v - 1)}
        className="w-10 h-10 text-lg hover:bg-neutral-100"
        aria-label="Giảm"
      >
        –
      </button>
      <span
        className={`w-12 text-center transition-transform ${bump ? "scale-110" : "scale-100"}`}
      >
        {v}
      </span>
      <button
        type="button"
        onClick={() => set(v + 1)}
        className="w-10 h-10 text-lg hover:bg-neutral-100"
        aria-label="Tăng"
      >
        +
      </button>
    </div>
  );
}
