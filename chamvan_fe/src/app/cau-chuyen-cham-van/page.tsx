// // chamvan_fe/src/app/cau-chuyen-cham-van/page.tsx
// "use client";
// import Image from "next/image";
// import n3 from '@/app/img/cccv/cccv10.jpg';
// import n4 from '@/app/img/cccv/cccv4.jpg';
// import n5 from '@/app/img/cccv/cccv5.jpg';
// import n6 from '@/app/img/cccv/cccv9.jpg';
// export default function StoryPage() {
//   return (
//     <main className="bg-white text-neutral-800">
//       {/* HERO IMAGE */}
// <section className="relative w-full">
//   {/* full viewport height */}
//   <div className="relative min-h-[100svh]">
//     <Image
//       src="https://dytbw3ui6vsu6.cloudfront.net/media/wysiwyg/NVL_1293-min_1.webp"
//       alt="Nghệ nhân tiện gỗ - Chạm Vân"
//       fill
//       priority
//       unoptimized
//       sizes="100vw"
//       className="object-cover"
//     />
//   </div>
// </section>


//       {/* INTRO + 2-COLUMN BLOCKS */}
//       <section className="max-w-6xl px-4 py-10 mx-auto sm:px-6 lg:px-8 sm:py-14 lg:py-16">
//         {/* Tiêu đề chính */}
//         <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
//           NIỀM ĐAM MÊ
//         </h1>

//         {/* Đoạn mở đầu + ảnh phải */}
//         <div className="grid grid-cols-1 gap-8 mt-6 md:mt-8 md:grid-cols-2 md:gap-10 lg:gap-12">
//           <div className="leading-7 text-neutral-700">
//             <p className="mb-4">
//               Chạm Vân ra đời dựa trên niềm đam mê sâu sắc với thủ công mỹ nghệ.
//               Chúng tôi theo đuổi thiết kế vượt thời gian, tôn vinh giá trị truyền
//               thống qua ngôn ngữ đương đại.
//             </p>
//             <p className="mb-4">
//               Ở Chạm Vân, mọi thiết kế đều được phó thác cho đôi bàn tay khéo léo
//               của người thợ. Mỗi ngày hoàn thiện là mỗi ngày kỹ thuật lâu đời
//               được truyền lại và tiếp nối với tinh thần sáng tạo của thời đại.
//             </p>
//             <p>
//               Với sự tận tâm và nỗ lực không ngừng nghỉ, chúng tôi mang đến những
//               sản phẩm bền bỉ, tinh tế và đậm bản sắc.
//             </p>
//           </div>

//           <div className="relative aspect-[16/10] w-full">
//             <Image
//               src={n6}
//               fill
//               className="object-cover rounded-md"
//             />
//           </div>
//         </div>

//         {/* BLOCK 2: Ảnh trái - chữ phải */}
//         <div className="grid grid-cols-1 gap-8 mt-10 md:mt-12 md:grid-cols-2 md:gap-10 lg:gap-12">
//           <div className="relative order-1 md:order-none aspect-[16/12]">
//             <Image
//              src={n5}
//               fill
//               className="object-cover rounded-md"
//             />
//           </div>

//           <div className="leading-7 text-neutral-700">
//             <p className="mb-4">
//               Bằng sự tận tụy với nghề thủ công, sơn mài luôn là điểm nhấn trong
//               ngôn ngữ thiết kế của Chạm Vân. Từ khởi đầu khi chỉ là nhóm nhỏ
//               nghệ nhân, hôm nay chúng tôi tiếp nối các giá trị truyền thống và
//               tạo ra các thiết kế độc bản mang tinh thần đương đại.
//             </p>
//             <p>
//               Điều làm nên sức hấp dẫn của sơn mài Chạm Vân là khả năng chế tác
//               tỉ mỉ, am hiểu kỹ thuật chuyên sâu cùng con mắt nghệ thuật tinh tế
//               với từng chi tiết nhỏ.
//             </p>
//           </div>
//         </div>

//         {/* ẢNH FULL-WIDTH CHEN GIỮA */}
//         <div className="mt-12 sm:mt-14 lg:mt-16">
//           <div className="relative aspect-[21/9] w-full overflow-hidden rounded-md">
//             <Image
//              src={n4}
//               fill
//               className="object-cover"
//             />
//           </div>
//         </div>

//         {/* BLOCK 3: Chữ trái - ảnh phải */}
//         <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 md:gap-10 lg:gap-12">
//           <div className="leading-7 text-neutral-700">
//             <p className="mb-4">
//               Mỗi tác phẩm đều trải qua quy trình chế tác lâu dài với nhiều công
//               đoạn tỉ mỉ: từ chọn gỗ, tạo phôi, mài phủ đến khảm trai, dát vàng.
//             </p>
//             <p className="mb-4">
//               “Nếu thiết kế là dấu ấn riêng, thì sơn mài là thành quả chung từ vô
//               vàn công đoạn kiên nhẫn của đội ngũ nghệ nhân.”
//             </p>
//             <p>
//               Tất cả những nhân tố ấy định hình bản sắc riêng của Chạm Vân và tạo
//               nên sức hấp dẫn cho từng sản phẩm.
//             </p>
//           </div>

//           <div className="relative aspect-[16/12]">
//             <Image
//              src={n3}
//               fill
//               className="object-cover rounded-md"
//             />
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }







// chamvan_fe/src/app/cau-chuyen-cham-van/page.tsx
"use client";
import Image from "next/image";
import n3 from "@/app/img/cccv/cccv10.jpg";
import n4 from "@/app/img/cccv/cccv4.jpg";
import n5 from "@/app/img/cccv/cccv5.jpg";
import n6 from "@/app/img/cccv/cccv9.jpg";

export default function StoryPage() {
  return (
    <main className="bg-white text-neutral-800">
      {/* HERO IMAGE */}
      <section className="relative w-full">
        <div className="relative min-h-[100svh]">
          <Image
            src="https://dytbw3ui6vsu6.cloudfront.net/media/wysiwyg/NVL_1293-min_1.webp"
            alt="Nghệ nhân tiện gỗ tại xưởng Chạm Vân"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* INTRO + 2-COLUMN BLOCKS */}
      <section className="max-w-6xl px-4 py-10 mx-auto sm:px-6 lg:px-8 sm:py-14 lg:py-16">
        {/* Tiêu đề chính */}
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          NIỀM ĐAM MÊ
        </h1>

        {/* BLOCK 1: Chữ trái - ảnh phải */}
        <div className="grid grid-cols-1 gap-8 mt-6 md:mt-8 md:grid-cols-2 md:gap-10 lg:gap-12">
          <div className="leading-7 text-neutral-700">
            <p className="mb-4">
              Chạm Vân ra đời dựa trên niềm đam mê sâu sắc với thủ công mỹ nghệ.
              Chúng tôi theo đuổi thiết kế vượt thời gian, tôn vinh giá trị truyền
              thống qua ngôn ngữ đương đại.
            </p>
            <p className="mb-4">
              Ở Chạm Vân, mọi thiết kế đều được phó thác cho đôi bàn tay khéo léo
              của người thợ. Mỗi ngày hoàn thiện là mỗi ngày kỹ thuật lâu đời
              được truyền lại và tiếp nối với tinh thần sáng tạo của thời đại.
            </p>
            <p>
              Với sự tận tâm và nỗ lực không ngừng nghỉ, chúng tôi mang đến những
              sản phẩm bền bỉ, tinh tế và đậm bản sắc.
            </p>
          </div>

          <div className="relative aspect-[16/10] w-full">
            <Image
              src={n6}
              alt="Không gian chế tác sản phẩm của Chạm Vân"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-md"
            />
          </div>
        </div>

        {/* BLOCK 2: Ảnh trái - chữ phải */}
        <div className="grid grid-cols-1 gap-8 mt-10 md:mt-12 md:grid-cols-2 md:gap-10 lg:gap-12">
          <div className="relative order-1 md:order-none aspect-[16/12]">
            <Image
              src={n5}
              alt="Nghệ nhân sơn mài tỉ mỉ hoàn thiện từng chi tiết"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-md"
            />
          </div>

          <div className="leading-7 text-neutral-700">
            <p className="mb-4">
              Bằng sự tận tụy với nghề thủ công, sơn mài luôn là điểm nhấn trong
              ngôn ngữ thiết kế của Chạm Vân. Từ khởi đầu khi chỉ là nhóm nhỏ
              nghệ nhân, hôm nay chúng tôi tiếp nối các giá trị truyền thống và
              tạo ra các thiết kế độc bản mang tinh thần đương đại.
            </p>
            <p>
              Điều làm nên sức hấp dẫn của sơn mài Chạm Vân là khả năng chế tác
              tỉ mỉ, am hiểu kỹ thuật chuyên sâu cùng con mắt nghệ thuật tinh tế
              với từng chi tiết nhỏ.
            </p>
          </div>
        </div>

        {/* ẢNH FULL-WIDTH CHEN GIỮA */}
        <div className="mt-12 sm:mt-14 lg:mt-16">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-md">
            <Image
              src={n4}
              alt="Bức ảnh toàn cảnh xưởng và sản phẩm Chạm Vân"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* BLOCK 3: Chữ trái - ảnh phải */}
        <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 md:gap-10 lg:gap-12">
          <div className="leading-7 text-neutral-700">
            <p className="mb-4">
              Mỗi tác phẩm đều trải qua quy trình chế tác lâu dài với nhiều công
              đoạn tỉ mỉ: từ chọn gỗ, tạo phôi, mài phủ đến khảm trai, dát vàng.
            </p>
            <p className="mb-4">
              “Nếu thiết kế là dấu ấn riêng, thì sơn mài là thành quả chung từ vô
              vàn công đoạn kiên nhẫn của đội ngũ nghệ nhân.”
            </p>
            <p>
              Tất cả những nhân tố ấy định hình bản sắc riêng của Chạm Vân và tạo
              nên sức hấp dẫn cho từng sản phẩm.
            </p>
          </div>

          <div className="relative aspect-[16/12]">
            <Image
              src={n3}
              alt="Chi tiết hoàn thiện sản phẩm thủ công tại Chạm Vân"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-md"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
