// 'use client';
// import pick12 from '@/app/img/topics/topic12.jpg';
// import pick13 from '@/app/img/topics/topic13.jpg';
// import Link from 'next/link';

// export default function SplitShowcase() {
//   return (
//     <section className="mx-auto max-w-[1400px] px-8 py-16">
//       {/* Heading */}
//       <div className="max-w-4xl mx-auto text-center">
//         <h2 className="mb-3 text-4xl md:text-5xl uppercase font-medium tracking-[0.08em] text-black">
//           Tinh hoa của<br />thủ công và sáng tạo
//         </h2>
//         <p className="mx-auto max-w-3xl text-[15px] leading-7 text-gray-600">
//           Gốc rễ của Chạm Vân bắt nguồn từ niềm đam mê với nghề thủ công, đặc biệt là kỹ thuật sơn mài.
//           Mỗi tác phẩm là sự gìn giữ tinh hoa truyền thống qua bàn tay người thợ, kết hợp cảm hứng hiện đại
//           cho một không gian sống sang trọng.
//         </p>
//       </div>

//       {/* 2 cột ảnh vuông góc */}
//       <div className="grid gap-10 mt-12 md:grid-cols-2">
//         {/* LEFT column */}
//         <div className="space-y-4">
//           {/* Card ảnh: góc vuông, có viền */}
//           <div className="overflow-hidden border">
//             <img
//               src="https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/550185864_122197109258284018_5937516143350693886_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHYmwMNiLtbnhsR3HAhe6rBk1vnHx9-JHGTW-cfH34kcYYC7I0bhc3JBlB1fjhFo7rnkCTnnuY81F3g4H9Oknmx&_nc_ohc=Yajzl15qTVMQ7kNvwF3TuOm&_nc_oc=Adn6giSkE3nl-X8c7gCeewkvOUAG64aCE8ZIZXgsqOfNNs6Ji1sitYu-bN5y-1rgGU2cTgoVSDA5t3kL3-kFqKvl&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=RxQWSSDgBHuYCyODU6JA2A&oh=00_Afd_rmh3kyrLx7xUA6QqpW20U0AmpJQYc8rWveKfoA67zA&oe=68F13D35"
//               alt="Thủ công"
//               className="h-[540px] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
//             />
//           </div>

//           {/* Nút rời, góc vuông */}
//           <div className="text-center">
//             <Link
//               href="/thu-cong"
//               className="inline-flex items-center justify-center bg-black px-8 md:px-10 py-3.5 text-base md:text-lg text-white tracking-wide hover:bg-black/90 transition rounded-none"
//             >
//               Thủ công
//               <svg
//                 className="w-5 h-5 ml-2"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 aria-hidden="true"
//               >
//                 <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//             </Link>
//           </div>
//         </div>

//         {/* RIGHT column */}
//         <div className="space-y-4">
//           <div className="overflow-hidden border">
//             <img
//               src="https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/550431978_122197109294284018_7467416075868373401_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHQ-oBJxlrFvOp6CouhNrgD-Pne3gbTaQ_4-d7eBtNpD4r4k-W3PppOski3ndDjkyXt37Sac7n8YpXWpIlLO4rt&_nc_ohc=RiTcziMZ_nkQ7kNvwE7Gm-u&_nc_oc=AdmwRzWaqSMvIgqf4qRzvZzboonZOpiFfYDBa_-Z85_1SkJyrxDqVbfGoQaG5CKbDCd95fuVEhq1_iq1JbmqcRkY&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=ximqYv-qpfh_WC_mvOJLwA&oh=00_AfcjBVJSmKKjXgZXZxkhPXgnjM0-7hmaNyQuJj9PAqNU4g&oe=68F14D5B"
//               alt="Sáng tạo"
//               className="h-[540px] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
//             />
//           </div>

//           <div className="text-center">
//             <Link
//               href="/sang-tao"
//               className="inline-flex items-center justify-center bg-black px-8 md:px-10 py-3.5 text-base md:text-lg text-white tracking-wide hover:bg-black/90 transition rounded-none"
//             >
//               Sáng tạo
//               <svg
//                 className="w-5 h-5 ml-2"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 aria-hidden="true"
//               >
//                 <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }











'use client';
import show1 from '@/app/img/showcase/topic14.jpg';
import show2 from '@/app/img/showcase/topic13.jpg';
import Link from 'next/link';

export default function SplitShowcase() {
  // Chuẩn hoá import tĩnh -> string để dùng cho <img>
  const srcOf = (img: any) => (typeof img === 'string' ? img : img?.src);

  return (
    <section className="mx-auto max-w-[1400px] px-8 py-16">
      {/* Heading */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="mb-3 text-4xl md:text-5xl uppercase font-medium tracking-[0.08em] text-black">
          Tinh hoa của<br />thủ công và sáng tạo
        </h2>
        <p className="mx-auto max-w-3xl text-[15px] leading-7 text-gray-600">
          Gốc rễ của Chạm Vân bắt nguồn từ niềm đam mê với nghề thủ công, đặc biệt là kỹ thuật sơn mài.
          Mỗi tác phẩm là sự gìn giữ tinh hoa truyền thống qua bàn tay người thợ, kết hợp cảm hứng hiện đại
          cho một không gian sống sang trọng.
        </p>
      </div>

      {/* 2 cột ảnh vuông góc */}
      <div className="grid gap-10 mt-12 md:grid-cols-2">
        {/* LEFT column */}
        <div className="space-y-4">
          {/* Card ảnh: góc vuông, có viền */}
          <div className="overflow-hidden border">
            <img
              src={srcOf(show1)}
              alt="Thủ công"
              className="h-[540px] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>

          {/* Nút rời, góc vuông */}
          <div className="text-center">
            <Link
              href="/thu-cong"
              className="inline-flex items-center justify-center bg-black px-8 md:px-10 py-3.5 text-base md:text-lg text-white tracking-wide hover:bg-black/90 transition rounded-none"
            >
              Thủ công
              <svg
                className="w-5 h-5 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* RIGHT column */}
        <div className="space-y-4">
          <div className="overflow-hidden border">
            <img
              src={srcOf(show2)}
              alt="Sáng tạo"
              className="h-[540px] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>

          <div className="text-center">
            <Link
              href="/sang-tao"
              className="inline-flex items-center justify-center bg-black px-8 md:px-10 py-3.5 text-base md:text-lg text-white tracking-wide hover:bg-black/90 transition rounded-none"
            >
              Sáng tạo
              <svg
                className="w-5 h-5 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
