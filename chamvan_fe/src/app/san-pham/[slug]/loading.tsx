export default function Loading() {
  return (
    <div className="max-w-6xl px-4 py-10 mx-auto md:px-6 md:py-14">
      <div className="flex items-center gap-3 mb-8 text-sm text-neutral-600">
        <div className="w-8 h-8 border-2 rounded-full border-neutral-300 border-t-neutral-900 animate-spin" />
        <div className="flex items-center gap-2">
          <span>Đang tải sản phẩm</span>
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:300ms]" />
          </span>
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        <div className="w-full aspect-[4/3] rounded-2xl bg-gray-200/70 animate-pulse" />

        <div className="animate-pulse">
          <div className="w-10/12 mb-4 rounded bg-gray-200/70 h-9" />
          <div className="w-40 h-6 mb-6 rounded bg-gray-200/70" />
          <div className="w-full h-12 mb-3 rounded bg-gray-200/70" />
          <div className="w-full h-12 rounded bg-gray-200/70" />

          <div className="mt-10 space-y-3">
            <div className="w-9/12 h-4 rounded bg-gray-200/70" />
            <div className="w-11/12 h-4 rounded bg-gray-200/70" />
            <div className="w-10/12 h-4 rounded bg-gray-200/70" />
            <div className="w-8/12 h-4 rounded bg-gray-200/70" />
          </div>
        </div>
      </div>
    </div>
  );
}
