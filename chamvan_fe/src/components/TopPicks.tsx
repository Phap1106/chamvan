'use client';

type PickItem = { type: 'color' | 'image'; title?: string; src?: string };

const TILE_BG = '#8b2a2a'; // đỏ nâu sang trọng giống demo

export default function TopPicks() {
  const items: PickItem[] = [
    { type: 'image', title: 'CASTLE' ,src:'https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/499954180_122178180650284018_2891944701068019517_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHxRtTBEsAL7bsqoRHaQkdxvGBEjTifqWK8YESNOJ-pYpdhPC2G8YNu--qTZHWnLmTq8jqdD36TIJF1046Vv90A&_nc_ohc=IuZbEQgGivkQ7kNvwEnZKPL&_nc_oc=AdkXGSyXuWV7cL1dx6gTGZ97dKhkOLjXZfes9fSeOORS48n8Xfbm34UPChn2e4bqGWpTIjtYfmD4TVtSYIIe3ZXp&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=ipJhgnyJiDQigSogHyFnfw&oh=00_AfclM0eEZ3m2e9lQL3teQOlgxbtNV05RSKZKHWV8EDYQcQ&oe=68F1507D' },
    { type: 'image', src: 'https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/508167896_122182492436284018_1449141869790592263_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFXnPplIAY8izgKH_vafKiy8aPi85pxH1Xxo-LzmnEfVe-M-IPFaYCyLUizGSaFpsiiHMdwVBI_5gefJmfFfhpS&_nc_ohc=-nvvnJnRpUYQ7kNvwHUwOBP&_nc_oc=AdmvKjiCqtt6rHXDVbmV8NtOkz2Amy8dh6ykvuWtF9H-kiqrnJ9rkPrgCardCiEDUACCk1kSerNN3fXc7lYAkfeF&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=nW8nEwAMxOyH0sASbuu-5A&oh=00_AfdNXRs1hj3AxX2l7w2wA00OxNr-PVSxWrYhvo3aglhjUQ&oe=68F13478' },
    { type: 'image', src: 'https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/497459505_122177615234284018_6309761953188986597_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeE1fuVnAeCvhrjWy2dAIhjUA5q-NEO5TiMDmr40Q7lOIytCm1kmerb0GOSbzRx1-qi3V7_cW4yryalcrOwkCjT7&_nc_ohc=LQao886jYscQ7kNvwGO_a88&_nc_oc=AdmR3Yuc4gB7SeOt_3DRYYHl_726omoGdoEOTq_R6nS2cWf5qC7yyG7w0IxIQwbFwdmsrVKV8mLyaDG3pq-oEnd3&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=1SoZ7PH1wZe2soXgztn1Ug&oh=00_Aff3rpwa2V8kl6PdDE105gZcx7rQJFU3c61viHfQlM4wRg&oe=68F162C5' },
    // hàng 2
    { type: 'image', src: 'https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/495157073_122176671722284018_4211204462146952656_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGR_kJfesDJpe22lh6mNzV3JT12GKTuDx0lPXYYpO4PHcpy08oblDv1SQfJg6AnTqMHTUKVRIRpB4uN4mlYwC6c&_nc_ohc=iutZYCZOpdQQ7kNvwF5lXNx&_nc_oc=Adm4SyZU0LTto-VwPEV8JEgeTDqGfuTEK6WISut6Ko_cztqsI19oYzCBaMzs8KgzWYgazBj-XSOvTH-gTPxI9Yg-&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=ZMKyL2J3MhV3mKwJq5ruQw&oh=00_AfcakrGwlcn-IISLcnvKnQH1Uk29LuGMmv6dgB1GR9MAfQ&oe=68F13705' },
    { type: 'image', title: 'TERRACE',src:'https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/492424736_122174241146284018_8873876483924844018_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEES7sDQs4wIPKLT5XFD5yEC_C1ZCypZcML8LVkLKllwyA4xZaELGN9HcLO4XczHjpAdOEz8g3TJxn-VQQRzkyf&_nc_ohc=nwL_U_VtDUYQ7kNvwF1bZiE&_nc_oc=Adlu0oygFxlCQv51FJiG_cwjD8rLh8Vtfy0pYCJ34iYEIuvTTDFErPnGn9EQKbgsxZT_V1ccKHRIi1HdEugQOfSL&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=TF4TrFk811cHaP8AhBc2cQ&oh=00_Afcj2f1eXcxYghLOpTZUoV8Qvh_CAYEvu5NwScJ9elVd1Q&oe=68F152A2' },
    { type: 'image', src: 'https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/468393939_122151881288284018_3116400024005176420_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeELxA6pv31j7Q-ELWZY2c59QUQCA-fD4FpBRAID58PgWg0TN3W21jXPl10v2FaiAyHr2NHuXECOmpgyL05nUTpn&_nc_ohc=n0IMnkm6XKwQ7kNvwGzcDM0&_nc_oc=AdkDC0Zc5v-4EuL6pzhNHmJQxjgNKGvpU6diP5RjDK2u7akmnNjIIwhcJr9vchUsKJO5fwmxWF0IzlAqjEpWs6VR&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=v5RS7S5UalRXQ4-4EErfig&oh=00_AfcjSVX4uTQimpPnVw-3RAzESOAxMcgxjtaVE7Kp5joi7A&oe=68F1629C' },
    // hàng 3
     { type: 'image', src: 'https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/468435923_122151864554284018_2935683311190292803_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFGH4nwTOOf60VRJCB0zAUCMQ29wLgZa2kxDb3AuBlrabZo94voZg1PY1rc36mRcIYP9rUNFi6lMSCj8raudNNY&_nc_ohc=4vfX42FeYG8Q7kNvwG8XcnN&_nc_oc=AdkhPlS_9c019P8HVyjD4ontHpiKNx0gacRm-uK4jXFsE5Mpz3nc7i1k8VL3tMkdQOCx1vJfa4gtFpuxKPwwqy4L&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=M4p6txL-dTReOif7R1NzSw&oh=00_Aff4dtBjbFNM9WmtkktyI3ZaZC2h4l7Pzua25vOpC_c93Q&oe=68F13BFD' },
    { type: 'image', title: 'TERRACE',src:'https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/494630625_122175679250284018_1258550545047416938_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHCwdafPXHE7zp5aFqWdbfzESNtM0RHm1wRI20zREebXEP-rAy6ahJScqj0srjHkD5YiwWuTvWwo-oTXbVQElf3&_nc_ohc=eC5HbJvjpH0Q7kNvwH8I0G4&_nc_oc=AdmHKZBe2B85RIRXbOWUGSb6ZFvUcLe04zdr2vWR1v4g16jB90TZCSWwZoWC8g1YLzqRjioWb91PYknuWdS9CV59&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=crZIXSf4Le1DAHZ7KsAZjA&oh=00_AfeSIcm2ZaXX5SCEti6IBVAqHTRivP-rOzYw_5exiiwxqA&oe=68F15F45' },
    { type: 'image', src: 'https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-6/557624023_122199072260284018_8108230308048036546_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFczJ3BwYSS74ndSb_iswhvzKYkAh5FnLnMpiQCHkWcuSmt0PX_jz3fwtvEIHtpVD2zhJF-b1fl98nacxnE_Ydm&_nc_ohc=95QTr6i7FNQQ7kNvwHL66UV&_nc_oc=Adn0jDaxYsNYbZ6MUK_snvEv68KH2mgGr3gxIHUP2mujF7S67MBwU5mByKWMNe1AsWAE1Nge-4ejAjEPc5hpg0ly&_nc_zt=23&_nc_ht=scontent.fhan19-1.fna&_nc_gid=ZTJZDgAdcrXE1-pUMDVLjg&oh=00_AfeG8-B_vUfohFjaayYAsxLTQrHrvk6dA74_MFjk36JL9w&oe=68F16862' },
    
];

  return (
    <section className="mx-auto max-w-[1400px] px-8 py-16">
      <h2 className="mb-10 text-center text-3xl font-semibold tracking-wide">TOP PICKS</h2>

      <div className="grid grid-cols-3 gap-6">
        {items.map((it, i) => {
          if (it.type === 'color') {
            return (
              <div
                key={i}
                className="relative aspect-[4/3] overflow-hidden rounded"
                style={{ background: TILE_BG }}
              >
                <div className="absolute left-8 top-8 text-2xl font-semibold tracking-wider text-white">
                  {it.title}
                </div>
              </div>
            );
          }
          return (
            <div key={i} className="relative aspect-[4/3] overflow-hidden rounded">
              <img
                src={it.src}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                alt=""
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
