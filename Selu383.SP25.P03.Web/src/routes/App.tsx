//import { useState } from "react";
import novocaine from "../assets/a8ef64aec4eda2ac7ec380354de41544.jpg";
import dogman from "../assets/dddab7549433592f49b94d5a1514487f.jpg";
import rulebreakers from "../assets/bda1a61dcfbdec87b99ca7735e97774c.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "./App.css";
import "swiper/swiper-bundle.css";

function App() {
  //const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 w-full">
      <Swiper
        className="w-full md:h-[600px] h-full"
        spaceBetween={50}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          clickable: true,
          el: ".swiper-pagination",
          bulletClass: "swiper-pagination-bullet !bg-indigo-700",
          bulletActiveClass: "swiper-pagination-bullet-active !bg-indigo-700",
        }}
        modules={[Navigation, Pagination]}
        loop
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
      >
        <SwiperSlide>
          <img
            className="w-full h-full object-cover"
            src={novocaine}
            alt="Slide 1"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="w-full h-full object-cover"
            src={dogman}
            alt="Slide 2"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="w-full h-full object-cover"
            src={rulebreakers}
            alt="Slide 3"
          />
        </SwiperSlide>

        <div className="swiper-button-next !text-indigo-700"></div>
        <div className="swiper-button-prev !text-indigo-700"></div>

        <div className="swiper-pagination"></div>
      </Swiper>
      <div className="flex-grow justify-center items-center mx-10">
        <div className="flex space-x-8 mb-38"></div>
        <h1 className="text-4xl text-center font-bold text-indigo-700">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. A, maiores
          ducimus itaque doloremque maxime nam soluta architecto ipsum provident
          dolorem sed, omnis qui laboriosam, repellendus nulla natus quidem quam
          unde?
        </h1>
        <h1 className="text-4xl text-center font-bold text-indigo-700">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. A, maiores
          ducimus itaque doloremque maxime nam soluta architecto ipsum provident
          dolorem sed, omnis qui laboriosam, repellendus nulla natus quidem quam
          unde?
        </h1>
        <h1 className="text-4xl text-center font-bold text-indigo-700">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. A, maiores
          ducimus itaque doloremque maxime nam soluta architecto ipsum provident
          dolorem sed, omnis qui laboriosam, repellendus nulla natus quidem quam
          unde?
        </h1>
        <h1 className="text-4xl text-center font-bold text-indigo-700">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. A, maiores
          ducimus itaque doloremque maxime nam soluta architecto ipsum provident
          dolorem sed, omnis qui laboriosam, repellendus nulla natus quidem quam
          unde?
        </h1>
        <h1 className="text-4xl text-center font-bold text-indigo-700">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. A, maiores
          ducimus itaque doloremque maxime nam soluta architecto ipsum provident
          dolorem sed, omnis qui laboriosam, repellendus nulla natus quidem quam
          unde?
        </h1>
        <h1 className="text-4xl text-center font-bold text-indigo-700">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. A, maiores
          ducimus itaque doloremque maxime nam soluta architecto ipsum provident
          dolorem sed, omnis qui laboriosam, repellendus nulla natus quidem quam
          unde?
        </h1>
      </div>

      <footer className="min-w-full">
        <div className="flex flex-row min-w-full justify-center items-center bg-indigo-600 text-white h-full mt-16">
          <p className="text-xl font-bold mt-8 mb-8">
            @ 2025 Lion's Den Cinema
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
