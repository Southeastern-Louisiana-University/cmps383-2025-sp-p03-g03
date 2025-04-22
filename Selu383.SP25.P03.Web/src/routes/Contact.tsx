import { useNavigate } from "react-router-dom";
import { Button } from "@headlessui/react";
import {
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";

function ContactPage() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Placeholder form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here (e.g., API call)
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-1">
        {/* Header */}
        <section className="text-center mb-12">
          <EnvelopeIcon className="h-12 w-12 mx-auto text-indigo-400 mb-4" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-300 mb-4 drop-shadow-lg">
            Contact Us
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-200">
            We're here to help! Reach out with any questions about our theaters
            opening in Early 2026 or your movie-going experience.
          </p>
        </section>

        {/* Contact Form and Info */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
            <h2 className="text-xl font-semibold text-indigo-200 mb-4">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-400"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-400"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-400"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <Button
                type="submit"
                className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Send Message <EnvelopeIcon className="h-5 w-5" />
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
            <h2 className="text-xl font-semibold text-indigo-200 mb-4">
              Get in Touch
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="h-6 w-6 text-indigo-400" />
                <p className="text-gray-300">
                  Email:{" "}
                  <a
                    href="mailto:cmps3830@gmail.com"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    cmps3830@gmail.com
                  </a>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-6 w-6 text-indigo-400" />
                <p className="text-gray-300">
                  Phone:{" "}
                  <a
                    href="tel:+1-800-555-1234"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    +1-800-555-1234
                  </a>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <GlobeAltIcon className="h-6 w-6 text-indigo-400" />
                <p className="text-gray-300">
                  Address: 123 Cinema Way, New York, NY 10001
                </p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-indigo-200 mt-6 mb-2">
              Follow Us
            </h3>
            <div className="flex justify-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                <GlobeAltIcon className="h-8 w-8" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                <GlobeAltIcon className="h-8 w-8" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                <GlobeAltIcon className="h-8 w-8" />
                <span className="sr-only">X</span>
              </a>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-300 mb-6 drop-shadow-lg">
            Explore Our Theaters
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-200 mb-6">
            Get ready for a premium movie experience in New York, New Orleans,
            and Los Angeles, opening in Early 2026.
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

export default ContactPage;
