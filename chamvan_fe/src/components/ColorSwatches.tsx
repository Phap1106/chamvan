"use client";

export type Color = { name: string; hex: string };

export default function ColorSwatches({
  colors,
  value,
  onChange,
}: {
  colors: Color[];
  value?: string;
  onChange?: (hex: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {colors.map((c) => {
        const active = value === c.hex;
        return (
          <button
            key={c.hex}
            type="button"
            title={c.name}
            onClick={() => onChange?.(c.hex)}
            className={[
              "relative w-9 h-9 rounded-full border transition",
              "ring-offset-2 focus:outline-none",
              active
                ? "border-neutral-900 ring-2 ring-neutral-900"
                : "border-neutral-300 hover:border-neutral-500",
            ].join(" ")}
            style={{ backgroundColor: c.hex }}
          >
            {active && (
              <svg
                viewBox="0 0 24 24"
                className="absolute w-4 h-4 text-white rounded-full -right-1 -bottom-1 fill-neutral-900"
              >
                <circle cx="12" cy="12" r="12" className="fill-neutral-900" />
                <path d="M17 8l-7.3 8L7 13.2" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
