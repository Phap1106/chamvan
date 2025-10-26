'use client';

import Link from 'next/link';

export default function TermsPolicyPage() {
  return (
    <main className="px-4">
      <section className="max-w-4xl py-10 mx-auto md:py-14">
        <h1 className="text-2xl font-semibold tracking-tight">Điều khoản dịch vụ &amp; Chính sách bảo mật</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Bằng việc tạo tài khoản, mua hàng hoặc sử dụng website Chạm Vân, bạn xác nhận đã đọc, hiểu và đồng ý tuân thủ
          toàn bộ nội dung dưới đây. Nếu không đồng ý với bất kỳ điều khoản nào, vui lòng dừng sử dụng dịch vụ.
        </p>

        <div className="mt-8 space-y-8 text-[15px] leading-7 text-zinc-800">
          <section>
            <h2 className="mb-2 text-lg font-semibold">1. Căn cứ pháp lý áp dụng</h2>
            <ul className="pl-5 space-y-1 list-disc">
              <li>Luật Thương mại 2005; Luật Bảo vệ quyền lợi người tiêu dùng 2023.</li>
              <li>Nghị định 52/2013/NĐ-CP về Thương mại điện tử và Nghị định 85/2021/NĐ-CP sửa đổi, bổ sung.</li>
              <li>Luật Giao dịch điện tử 2023 và văn bản hướng dẫn.</li>
              <li>Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.</li>
              <li>Các quy định liên quan về thuế, hóa đơn, sở hữu trí tuệ, xử phạt hành chính (ví dụ: NĐ 98/2020/NĐ-CP).</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">2. Phạm vi áp dụng &amp; Đối tượng</h2>
            <p>
              Điều khoản áp dụng cho mọi khách hàng truy cập, đăng ký tài khoản, đặt mua, thanh toán, nhận hàng và/hoặc
              sử dụng bất kỳ dịch vụ nào trên hệ thống của chúng tôi.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">3. Tài khoản &amp; Bảo mật</h2>
            <ul className="pl-5 space-y-1 list-disc">
              <li>Khách hàng chịu trách nhiệm về tính chính xác của thông tin khi đăng ký.</li>
              <li>Giữ bí mật thông tin đăng nhập; mọi giao dịch phát sinh từ tài khoản được coi là do chính chủ tài khoản thực hiện.</li>
              <li>Thông báo ngay cho chúng tôi khi phát hiện truy cập trái phép hoặc nghi ngờ lộ thông tin.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">4. Đặt hàng, giá, thuế &amp; thanh toán</h2>
            <ul className="pl-5 space-y-1 list-disc">
              <li>Giá hiển thị đã/hoặc chưa bao gồm thuế GTGT sẽ được ghi rõ theo từng sản phẩm.</li>
              <li>Đơn hàng chỉ được xác nhận khi bạn hoàn tất các bước thanh toán theo hướng dẫn hoặc được chúng tôi chấp nhận.</li>
              <li>Chúng tôi có quyền từ chối/cancel đơn hàng trong trường hợp sai giá hiển thị, thiếu hàng, hoặc nghi ngờ gian lận.</li>
              <li>Hóa đơn chứng từ được cung cấp theo quy định pháp luật về thuế và hóa đơn điện tử.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">5. Giao hàng &amp; Kiểm tra</h2>
            <ul className="pl-5 space-y-1 list-disc">
              <li>Thời gian giao hàng ước tính phụ thuộc địa chỉ và đơn vị vận chuyển.</li>
              <li>Vui lòng kiểm tra ngoại quan khi nhận; nếu có hư hỏng, thiếu hàng, hãy ghi nhận với bưu tá và liên hệ ngay.</li>
              <li>Rủi ro, trách nhiệm đối với hàng hóa được chuyển giao khi bạn hoặc người được ủy quyền ký nhận.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">6. Đổi trả &amp; Bảo hành</h2>
            <ul className="pl-5 space-y-1 list-disc">
              <li>Chính sách đổi trả/bảo hành cụ thể được công bố tại trang <Link className="underline" href="/bao-hanh">Bảo hành</Link> và <Link className="underline" href="/giao-hang">Giao hàng</Link>.</li>
              <li>Hàng đổi trả cần còn nguyên trạng, đầy đủ phụ kiện/hóa đơn (trừ trường hợp hàng lỗi do nhà sản xuất).</li>
              <li>Không áp dụng đổi trả với sản phẩm thuộc danh mục loại trừ theo chính sách riêng hoặc theo luật định.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">7. Hành vi bị cấm &amp; Trách nhiệm của khách hàng</h2>
            <ul className="pl-5 space-y-1 list-disc">
              <li>Tuyệt đối không mua bán, trao đổi, sử dụng sản phẩm trái pháp luật; không dùng dịch vụ để che giấu hành vi vi phạm pháp luật.</li>
              <li>Không đăng tải thông tin giả mạo, xâm phạm danh dự/uy tín, vi phạm quyền sở hữu trí tuệ.</li>
              <li>Chịu trách nhiệm toàn bộ trước pháp luật đối với hành vi vi phạm của mình. Cửa hàng không chịu bất kỳ yêu cầu/đòi hỏi nào phát sinh từ việc khách hàng vi phạm pháp luật.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">8. Quyền sở hữu trí tuệ</h2>
            <p>
              Toàn bộ nội dung, hình ảnh, nhãn hiệu, thiết kế… thuộc quyền sở hữu của Chạm Vân hoặc đối tác cấp phép. Nghiêm cấm sao chép, khai thác thương mại khi chưa có sự chấp thuận bằng văn bản.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">9. Bảo vệ dữ liệu cá nhân</h2>
            <ul className="pl-5 space-y-1 list-disc">
              <li>Chúng tôi thu thập, xử lý dữ liệu theo mục đích phục vụ giao dịch, chăm sóc khách hàng và theo quy định tại Nghị định 13/2023/NĐ-CP.</li>
              <li>Bạn có quyền yêu cầu truy cập, sửa, xoá hoặc rút lại sự đồng ý theo quy định pháp luật.</li>
              <li>Chi tiết tại mục “Chính sách bảo mật” trong trang này.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">10. Giới hạn trách nhiệm</h2>
            <ul className="pl-5 space-y-1 list-disc">
              <li>Trong mọi trường hợp, trách nhiệm của chúng tôi (nếu có) giới hạn ở giá trị đơn hàng liên quan.</li>
              <li>Không chịu trách nhiệm đối với thiệt hại gián tiếp, lợi nhuận bị mất, dữ liệu bị mất hoặc các tổn thất hệ quả khác.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">11. Xử lý vi phạm &amp; Chấm dứt</h2>
            <p>
              Trường hợp vi phạm điều khoản hoặc pháp luật, chúng tôi có quyền tạm khóa/từ chối phục vụ, chuyển cơ quan có thẩm quyền xử lý theo quy định. Mọi tranh chấp được ưu tiên giải quyết thương lượng; nếu không thành, thẩm quyền thuộc Tòa án theo pháp luật Việt Nam.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">12. Sửa đổi điều khoản</h2>
            <p>
              Điều khoản có thể được cập nhật theo chính sách nội bộ hoặc thay đổi pháp luật. Bản cập nhật có hiệu lực kể từ khi đăng tải. Tiếp tục sử dụng dịch vụ đồng nghĩa bạn chấp nhận phiên bản mới.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">13. Liên hệ</h2>
            <p>
              Mọi thắc mắc về điều khoản &amp; bảo mật, vui lòng liên hệ trang{' '}
              <Link href="/lien-he" className="underline">Liên hệ</Link> hoặc email{' '}
              <a className="underline" href="mailto:chamvan@gmail.com">chamvan@gmail.com</a>.
            </p>
          </section>
        </div>

        <div className="p-4 mt-10 text-xs rounded-lg bg-zinc-50 text-zinc-500">
          <p>
            <strong>Lưu ý:</strong> Tài liệu này nhằm mục đích cung cấp thông tin và điều chỉnh quan hệ giữa cửa hàng và
            khách hàng trong phạm vi pháp luật Việt Nam. Bạn vui lòng đọc kỹ trước khi đăng ký/mua hàng.
          </p>
        </div>
      </section>
    </main>
  );
}
