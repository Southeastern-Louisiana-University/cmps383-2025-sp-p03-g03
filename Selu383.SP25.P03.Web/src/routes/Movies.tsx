import { useState } from "react";
import novocaineposter from "../assets/novocaine-1305898130.jpg";
import dogmanposter from "../assets/dogmanposter.jpg";
import rulebreakersposter from "../assets/Rule-Breakers-Poster-2241008542.jpg";
import "./App.css";

function Movies() {
  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 text-gray-900 w-full">
      <div className="flex-grow w-full">
        <div className="flex justify-center items-center w-full">
          <h1 className="text-9xl! font-bold text-green-700 mt-20 mb-16!">
            NOW PLAYING
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-15 m-20">
          <div className="flex flex-col items-center gap-4 transition-transform hover:scale-110 cursor-pointer">
            <img
              className="w-96 h-auto object-contain"
              src={novocaineposter}
              alt="novocaine"
            />
            <h2 className="text-4xl font-bold text-green-700 text-center">
              Novocaine
            </h2>
          </div>

          <div className="flex flex-col items-center gap-4 transition-transform hover:scale-110 cursor-pointer">
            <img
              className="w-96 h-auto object-contain"
              src={dogmanposter}
              alt="dogman"
            />
            <h2 className="text-4xl font-bold text-green-700 text-center">
              Dog Man
            </h2>
          </div>

          <div className="flex flex-col items-center gap-4 transition-transform hover:scale-110 cursor-pointer">
            <img
              className="w-96 h-auto object-contain"
              src={rulebreakersposter}
              alt="rulebreakers"
            />
            <h2 className="text-4xl font-bold text-green-700 text-center">
              Rule Breakers
            </h2>
          </div>
        </div>
      </div>
      <footer>
        <div className="flex flex-row items-center justify-center min-w-screen bg-green-600 text-white h-full mt-16">
          <p className="text-xl font-bold mt-8 mb-8">
            @ 2025 Lion's Den Cinema
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Movies;
