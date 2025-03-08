import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "../assets/vite.svg";
import novocaine from "../assets/a8ef64aec4eda2ac7ec380354de41544.jpg";
import dogman from "../assets/dddab7549433592f49b94d5a1514487f.jpg";
import rulebreakers from "../assets/bda1a61dcfbdec87b99ca7735e97774c.jpg";
import "./App.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 w-full">
      <Swiper
        className="w-full md:h-[500px] h-full"
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        loop // Enable infinite loop
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
      </Swiper>

      <div className="flex space-x-8 mb-38"></div>
      <h1 className="text-4xl font-bold text-green-600">Vite + React</h1>
      <h1 className="text-4xl font-bold text-green-600">Vite + React</h1>
      <h1 className="text-4xl font-bold text-green-600">Vite + React</h1>
      <h1 className="text-4xl font-bold text-green-600">Vite + React</h1>
      <h1 className="text-4xl font-bold text-green-600">Vite + React</h1>
      <h1 className="text-4xl font-bold text-green-600">Vite + React</h1>
      <h1 className="text-4xl font-bold text-green-600">Vite + React</h1>
      <h1 className="text-4xl font-bold text-green-600">Vite + React</h1>
      <h1 className="text-4xl font-bold text-green-600">Vite + React</h1>
      <h1 className="text-4xl font-bold text-green-600">Vite + React</h1>
      <h1 className="text-4xl font-bold text-green-600">Vite + React</h1>
      <h1 className="text-4xl font-bold text-green-600">Vite + React</h1>
      <h1 className="text-4xl font-bold text-green-600">Vite + React</h1>
      <h1 className="text-4xl font-bold text-green-600">Vite + React</h1>

      <div className="mt-6 p-6 bg-white shadow-md rounded-lg text-center w-full max-w-lg mx-auto">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-6 py-3 text-lg font-semibold bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Count is {count}
        </button>
        <p className="mt-4 text-gray-600">
          Edit <code className="bg-gray-200 px-1 rounded">src/App.tsx</code> and
          save to test HMR
        </p>
      </div>
      <p className="mt-6 text-gray-500">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
