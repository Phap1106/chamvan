export default function Newsletter() {
  return (
    <section className="mx-auto max-w-[1100px] px-8 py-20 text-center">
      <h3 className="text-4xl font-extrabold tracking-wide">ĐĂNG KÝ BẢN TIN</h3>
      <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-gray-600">
        Nhận thông tin sản phẩm mới, ưu đãi đặc biệt và câu chuyện nghề từ Chạm Vân.
      </p>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mx-auto mt-8 flex max-w-xl items-center gap-2"
      >
        <input
          className="w-full rounded border px-4 py-3 text-sm outline-none focus:border-black"
          placeholder="Nhập email của bạn"
        />
        <button className="rounded bg-black px-6 py-3 text-sm text-white">GỬI</button>
      </form>
    </section>
  );
}
