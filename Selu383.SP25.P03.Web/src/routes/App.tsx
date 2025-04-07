import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "./App.css";
import { Button } from "@headlessui/react";
import { TicketIcon, MapPinIcon, FilmIcon } from "@heroicons/react/24/outline";

// Import images
import featuredMovie1 from "../assets/a8ef64aec4eda2ac7ec380354de41544.jpg";
import featuredMovie2 from "../assets/dddab7549433592f49b94d5a1514487f.jpg";
import featuredMovie3 from "../assets/bda1a61dcfbdec87b99ca7735e97774c.jpg";

function App() {
  const navigate = useNavigate();

  const locations = [
    { name: "New York", opening: "Early 2026" },
    { name: "New Orleans", opening: "Early 2026" },
    { name: "Los Angeles", opening: "Early 2026" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Featured Movies Carousel */}
      <Swiper
        className="w-full md:h-[600px] h-[400px]"
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        loop
      >
        <SwiperSlide>
          <div className="relative h-full">
            <img
              className="w-full h-full object-cover brightness-75"
              src={featuredMovie1}
              alt="Featured Movie 1"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 p-8 text-white bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-300 drop-shadow-lg">
                Coming Soon
              </h2>
              <p className="text-lg md:text-xl mt-2 drop-shadow-md">
                Experience it at Lion's Den Cinemas in Early 2026
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative h-full">
            <img
              className="w-full h-full object-cover brightness-75"
              src={featuredMovie2}
              alt="Featured Movie 2"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 p-8 text-white bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-300 drop-shadow-lg">
                New Releases
              </h2>
              <p className="text-lg md:text-xl mt-2 drop-shadow-md">
                Premium Reclining Seats & Dolby Atmos Sound
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative h-full">
            <img
              className="w-full h-full object-cover brightness-75"
              src={featuredMovie3}
              alt="Featured Movie 3"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 p-8 text-white bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-300 drop-shadow-lg">
                Opening 2026
              </h2>
              <p className="text-lg md:text-xl mt-2 drop-shadow-md">
                NY, New Orleans, & LA Locations
              </p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-1">
        <section className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-300 mb-4 drop-shadow-lg">
            Welcome to Lion's Den Cinemas
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-200">
            Experience movies like never before with premium reclining seats and
            Dolby Atmos Cinema Sound. Opening in New York, New Orleans, and Los
            Angeles in Early 2026.
          </p>
          <Button
            onClick={() => navigate("/movies")}
            className="mt-6 inline-flex items-center gap-2 bg-indigo-700! hover:bg-indigo-600! text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Get Tickets <TicketIcon className="h-5 w-5" />
          </Button>
        </section>

        {/* Locations Section */}
        <section className="grid md:grid-cols-3 gap-8 mb-12">
          {locations.map((location) => (
            <div
              key={location.name}
              className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50 transition-all duration-300 hover:shadow-indigo-800/70"
            >
              <MapPinIcon className="h-8 w-8 mx-auto text-indigo-400 mb-2" />
              <h3 className="text-xl font-semibold text-indigo-200">
                Lion's Den Cinemas: {location.name}
              </h3>
              <p className="text-gray-300">Opening {location.opening}</p>
              <Button
                onClick={() =>
                  navigate(`/locations/${location.name.toLowerCase()}`)
                }
                className="mt-4 text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
              >
                Learn More
              </Button>
            </div>
          ))}
        </section>

        {/* Features Section */}
        <section className="text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-300 mb-6 drop-shadow-lg">
            Why Choose Lion's Den?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <FilmIcon className="h-10 w-10 mx-auto text-indigo-400 mb-2" />
              <h3 className="font-semibold text-indigo-200">
                Premium Experience
              </h3>
              <p className="text-gray-300">
                Reclining seats & Dolby Atmos sound
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <TicketIcon className="h-10 w-10 mx-auto text-indigo-400 mb-2" />
              <h3 className="font-semibold text-indigo-200">
                Flexible Pricing
              </h3>
              <p className="text-gray-300">
                Location-specific rates & showtimes
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <MapPinIcon className="h-10 w-10 mx-auto text-indigo-400 mb-2" />
              <h3 className="font-semibold text-indigo-200">
                Unique Locations
              </h3>
              <p className="text-gray-300">Custom-designed theaters</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-indigo-950 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {currentYear} Lion's Den Cinemas. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="/terms" className="hover:text-indigo-300">
              Terms
            </a>
            <a href="/privacy" className="hover:text-indigo-300">
              Privacy
            </a>
            <a href="/contact" className="hover:text-indigo-300">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
