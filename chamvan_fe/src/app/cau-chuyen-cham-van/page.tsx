// chamvan_fe/src/app/cau-chuyen-cham-van/page.tsx
"use client";

import Image from "next/image";

export default function StoryPage() {
  return (
    <main className="bg-white text-neutral-800">
      {/* HERO IMAGE */}
<section className="relative w-full">
  {/* full viewport height */}
  <div className="relative min-h-[100svh]">
    <Image
      src="https://dytbw3ui6vsu6.cloudfront.net/media/wysiwyg/NVL_1293-min_1.webp"
      alt="Nghệ nhân tiện gỗ - Chạm Vân"
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

        {/* Đoạn mở đầu + ảnh phải */}
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
              src="https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/548323314_122195831018284018_793362289614377921_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeG7j62efcKqsqPHYTnYOhVwsvQ0kfWmYRCy9DSR9aZhEGg1ir6pfsAYUuSBBdMoL-acFGOZ5UHNegAApGslo08i&_nc_ohc=IRZvBSb3rasQ7kNvwEtvYBj&_nc_oc=Adn_OgDRsq4_3hPVVnexdHs7EHVvA38IM_rTJwaRUojf2O9ewZt356ptV1-KzDykKWloTvP88pdKKfiwBBbZ_g-5&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=OQWvvvf3yDlmLJUDcFmUGQ&oh=00_AfcVXYNzREkAhrQccfertvoFTNyIEpIxrlKnoMPFp9Dtcg&oe=68F1A885"
              alt="Quy trình hoàn thiện sơn mài"
              fill
              className="object-cover rounded-md"
            />
          </div>
        </div>

        {/* BLOCK 2: Ảnh trái - chữ phải */}
        <div className="grid grid-cols-1 gap-8 mt-10 md:mt-12 md:grid-cols-2 md:gap-10 lg:gap-12">
          <div className="relative order-1 md:order-none aspect-[16/12]">
            <Image
              src="https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/536269792_122192325674284018_8380023754092190133_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeH5hkb8KJDmWIYOHLofu_IMs5PiT7wc-NOzk-JPvBz405uihC4mCMsjWaIM63hYNaLhcDsdMQFCUnOHx8OHP-_h&_nc_ohc=UBqdx-CW09IQ7kNvwHJMO8O&_nc_oc=AdkbtH_LBAYCeHIV9-qrBg4PK0LsjeFZMcRMn_EFy-_VDfiiuLy88CrtTB8TITMSQ02xPUoj5AXQcfbKJs6dhU7v&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=23fZlhLwjoAxmOE9bq541Q&oh=00_Affmyp8GB-j4zkJAytA6cQmMlg2sUnD8gDfFejiyPm1ayA&oe=68F1B47F"
              alt="Nghệ nhân khảm - Chạm Vân"
              fill
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
              src="https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/549691555_122196904094284018_6215630067626396280_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGAgYFmzvXxxls7Nh62quYqXMB9OVJK5otcwH05Ukrmi8iMGAO8eBH8nLUhge3r9V_CSBudW2ppOAH-17vSHlH8&_nc_ohc=Qrb_QaeKx1gQ7kNvwHeIlik&_nc_oc=AdlRFKG7Hha8EVxKQ82IkSMRM2BUfVKM5AeVeGS_kPJIWkQ7YnKS2RVcPDm85NDqLQJjiJg1ADJ0vNVIyDh0_5-A&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=27kXlY57533BOuI9HnLsHw&oh=00_AfeyUa638lS5rlUIpBi8EpPl3J21PHzendmdADkm0EA7yA&oe=68F1B08F"
              alt="Xưởng Chạm Vân"
              fill
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
              src="https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/529297627_122190564644284018_8321851820315081125_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEhsTIvgZYpdKFkN3dA0Vtv9QNU-FS45Mv1A1T4VLjkyy4VSGtGQS0neWmf5Aue51uC1XrNwmhEhKWsab26W5rn&_nc_ohc=P-qqW-N-MgoQ7kNvwE4QKFc&_nc_oc=AdnqoVfqDAznDwcTHhNCIJeX3rLuYsGjO7amyEtXJx7WWQKa3zM_oIJfaexUmPSGs1s5E25T2hWaznc7b6lo5bcF&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=UdaT9wFX8Z7hbsodAdtWvg&oh=00_Afeg4XYrdZl5d7i0X6egD0gpP-XlpcWqTMamfvpUvCKCqg&oe=68F1BB6D"
              alt="Bộ sưu tập sản phẩm Chạm Vân"
              fill
              className="object-cover rounded-md"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
