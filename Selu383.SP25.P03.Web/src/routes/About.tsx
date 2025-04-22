import { useNavigate } from "react-router-dom";
import { Button } from "@headlessui/react";
import {
  FilmIcon,
  UsersIcon,
  LightBulbIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";

function About() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-1">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-300 mb-4 drop-shadow-lg">
            About Lion's Den Cinemas
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-200">
            Discover the story behind Lion's Den Cinemas, where passion for film
            meets unparalleled comfort and innovation.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-300 mb-6 text-center drop-shadow-lg">
            Our Mission
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50 max-w-3xl mx-auto">
            <p className="text-gray-200 text-lg">
              At Lion's Den Cinemas, we strive to redefine the movie-going
              experience. Our mission is to bring stories to life with
              cutting-edge technology, premium reclining seats, and immersive
              Dolby Atmos sound, creating unforgettable moments for every guest
              in our custom-designed theaters.
            </p>
          </div>
        </section>

        {/* History Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-300 mb-6 text-center drop-shadow-lg">
            Our Story
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50 max-w-3xl mx-auto">
            <p className="text-gray-200 text-lg">
              Founded with a vision to transform cinema, Lion's Den Cinemas was
              born from a love of storytelling and a commitment to excellence.
              Set to open in Early 2026, our theaters in New York, New Orleans,
              and Los Angeles will blend modern design with local culture,
              offering a unique experience in every city.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-300 mb-6 drop-shadow-lg">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 outline-3 outline-indigo-300 p-6 rounded-lg shadow-lg shadow-indigo-950/50 transition-all duration-300 hover:shadow-indigo-800/70">
              <FilmIcon className="h-10 w-10 mx-auto text-indigo-400 mb-2" />
              <h3 className="font-semibold text-indigo-200">Quality</h3>
              <p className="text-gray-300">
                State-of-the-art visuals and sound with premium reclining seats
                for ultimate comfort.
              </p>
            </div>
            <div className="bg-gray-800 outline-3 outline-indigo-300 p-6 rounded-lg shadow-lg shadow-indigo-950/50 transition-all duration-300 hover:shadow-indigo-800/70">
              <UsersIcon className="h-10 w-10 mx-auto text-indigo-400 mb-2" />
              <h3 className="font-semibold text-indigo-200">Community</h3>
              <p className="text-gray-300">
                Engaging local audiences with events and tailored experiences in
                every city.
              </p>
            </div>
            <div className="bg-gray-800 outline-3 outline-indigo-300 p-6 rounded-lg shadow-lg shadow-indigo-950/50 transition-all duration-300 hover:shadow-indigo-800/70">
              <LightBulbIcon className="h-10 w-10 mx-auto text-indigo-400 mb-2" />
              <h3 className="font-semibold text-indigo-200">Innovation</h3>
              <p className="text-gray-300">
                Pushing boundaries with custom-designed theaters and
                cutting-edge technology.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-300 mb-6 drop-shadow-lg">
            Join Us in 2026
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-200 mb-6">
            Be among the first to experience Lion's Den Cinemas. Explore
            showtimes or learn more about our upcoming locations.
          </p>
          <Button
            onClick={() => navigate("/movies")}
            className="inline-flex items-center gap-2 bg-indigo-700 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Get Tickets <TicketIcon className="h-5 w-5" />
          </Button>
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

export default About;
