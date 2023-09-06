import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectCards, Pagination, Navigation, EffectFlip } from "swiper";
import Class from "./percentChange.module.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PercentChange(props: any) {
  const { spotData, images } = props;

  const [decrease, setDecrease] = useState<any[]>([]);


  useEffect(() => {

    let dec = spotData.sort((a: any,b: any) => {
      return  Math.round(parseFloat(b.percentChange) * 100) / 100 - Math.round(parseFloat(a.percentChange) * 100) / 100;
    })

    setDecrease(dec)


  }, [spotData])


  return (
    <div className={Class.percentChange}>
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        effect={"cards"}
        navigation={true}
        grabCursor={true}
        modules={[EffectCards, Pagination, Navigation]}
        className={Class.swiper}
      >
        
        <SwiperSlide className={Class.swiperSlide}>
          <div className={Class.text}>
            <div className={Class.textDiv}>
              If a cryptocurrency goes up in percentage terms, it means that
              there is a lot of interest in the market for that particular
              cryptocurrency.
            </div>
          </div>

          <Swiper
            className={Class.MiniSwiper}
            effect={"flip"}
            grabCursor={true}
            modules={[EffectFlip, Pagination]}
            pagination={{
              dynamicBullets: true,
            }}
          >
            {decrease.map((crypto: any) => {
              let indexOfName = crypto.name.search("USDT");

              let imageName = crypto.name.slice(0, indexOfName).toLowerCase();

              let imageLink = import.meta.env.VITE_API_URL + "/icon/" + imageName;

              return (
                <SwiperSlide className={Class.MiniSwiperSlide}>
                  <Link className={Class.swiperLink} to={"/markets/spot/" + crypto.name}>{crypto.name}</Link>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Link className={Class.swiperLink} to={"/markets/" + crypto.name}><img src={imageLink}></img></Link>
                  </div>
                  <div>
                    <p className={Class.swiperText}>
                      Current price: {parseFloat(crypto.openPrice)}
                    </p>
                    <p className={Class.swiperText}>
                      Price change:{" "}
                      {Math.round(parseFloat(crypto.percentChange) * 100) / 100}
                      %
                    </p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </SwiperSlide>


      </Swiper>
    </div>
  );
}
