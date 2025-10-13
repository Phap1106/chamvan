// src/components/Pagination.tsx
"use client";

type Props = {
  total: number;
  pageSize: number;
  current: number;
  makeLink: (page: number) => string;
  maxPages?: number; // số nút hiển thị (mặc định 5)
};

export default function Pagination({
  total,
  pageSize,
  current,
  makeLink,
  maxPages = 5,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const half = Math.floor(maxPages / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(totalPages, start + maxPages - 1);
  if (end - start + 1 < maxPages) start = Math.max(1, end - maxPages + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  const Btn = ({
    page,
    label,
    disabled,
    active,
  }: {
    page: number;
    label?: string | number;
    disabled?: boolean;
    active?: boolean;
  }) => (
    <a
      href={disabled ? "#" : makeLink(page)}
      aria-disabled={disabled}
      className={[
        "inline-flex h-9 min-w-9 items-center justify-center rounded border px-3 text-sm",
        disabled
          ? "cursor-not-allowed border-neutral-200 text-neutral-300"
          : active
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-300 text-neutral-700 hover:border-neutral-500",
      ].join(" ")}
    >
      {label ?? page}
    </a>
  );

  return (
    <nav className="flex items-center justify-center gap-2">
      <Btn page={current - 1} label="«" disabled={current <= 1} />
      {start > 1 && (
        <>
          <Btn page={1} />
          <span className="px-1 text-neutral-400">…</span>
        </>
      )}
      {pages.map((p) => (
        <Btn key={p} page={p} active={p === current} />
      ))}
      {end < totalPages && (
        <>
          <span className="px-1 text-neutral-400">…</span>
          <Btn page={totalPages} />
        </>
      )}
      <Btn page={current + 1} label="»" disabled={current >= totalPages} />
    </nav>
  );
}
