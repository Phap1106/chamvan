// src/components/ProcessTimeline.tsx
const steps = [
  { n: '01', t: 'Chọn gỗ', d: 'Tuyển chọn gỗ chuẩn tuổi, thớ đẹp.' },
  { n: '02', t: 'Tạo phôi', d: 'Định hình thô, ghép mộng, xử lý bề mặt.' },
  { n: '03', t: 'Sơn mài', d: 'Phủ sơn – thếp vàng – khảm trai theo mẫu.' },
  { n: '04', t: 'Mài & phủ', d: 'Mài thủ công nhiều nước, phủ bóng.' },
  { n: '05', t: 'Hoàn thiện', d: 'Ráp chi tiết, kiểm định & đóng gói.' },
];

const ACCENT = '#747474';

export default function ProcessTimeline() {
  return (
    <section className="bg-[#F7F6F3]">
      <div className="mx-auto max-w-[1400px] px-8 py-16 text-gray-900">
        {/* Heading */}
        <div className="text-center">
          <div
            className="mx-auto mb-3 h-[2px] w-12"
            style={{ background: ACCENT }}
          />
          <h2 className="mb-10 text-3xl md:text-4xl uppercase font-medium tracking-[0.08em]">
            Quy trình chế tác
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className="bg-white border border-gray-200 p-6 transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div
                className="text-3xl font-semibold"
                style={{ color: ACCENT }}
              >
                {s.n}
              </div>
              <div className="mt-2 text-base font-semibold uppercase tracking-wide">
                {s.t}
              </div>
              <div className="mt-1 text-sm leading-6 text-gray-600">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
