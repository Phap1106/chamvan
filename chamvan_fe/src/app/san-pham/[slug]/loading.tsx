export default function Loading() {
  return (
    <div className="max-w-6xl px-4 py-8 mx-auto md:px-6 md:py-12 animate-pulse">
      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        <div className="w-full aspect-[4/3] rounded-2xl bg-gray-200" />
        <div>
          <div className="w-10/12 mb-4 bg-gray-200 rounded h-9" />
          <div className="w-40 h-6 mb-6 bg-gray-200 rounded" />
          <div className="w-full h-12 mb-3 bg-gray-200 rounded" />
          <div className="w-full h-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
