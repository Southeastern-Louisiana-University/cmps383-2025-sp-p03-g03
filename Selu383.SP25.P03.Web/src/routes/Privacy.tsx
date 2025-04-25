import { useNavigate } from "react-router-dom";
import { Button } from "@headlessui/react";
import { ShieldCheckIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

function Privacy() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-1">
        {/* Header */}
        <section className="text-center mb-12">
          <ShieldCheckIcon className="h-12 w-12 mx-auto text-indigo-400 mb-4" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-300 mb-4 drop-shadow-lg">
            Privacy Policy
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-200">
            At Lion's Den Cinemas, we are committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your
            information.
          </p>
        </section>

        {/* Privacy Sections */}
        <section className="mb-12">
          <div className="space-y-8 max-w-3xl mx-auto">
            {/* Introduction */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                1. Introduction
              </h2>
              <p className="text-gray-300">
                Lion's Den Cinemas values your privacy. This Privacy Policy
                outlines how we handle your personal information when you use
                our website, purchase tickets, or visit our theaters opening in
                New York, New Orleans, and Los Angeles in Early 2026.
              </p>
            </div>

            {/* Data Collection */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                2. Data Collection
              </h2>
              <p className="text-gray-300">
                We collect information you provide, such as your name, email,
                payment details, and preferences when purchasing tickets or
                creating an account. We also collect browsing data, including IP
                addresses and device information, to improve our services.
              </p>
            </div>

            {/* Data Usage */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                3. Data Usage
              </h2>
              <p className="text-gray-300">
                Your information is used to process ticket purchases, manage
                reservations, and enhance your experience with personalized
                offers. We may also use data to communicate updates about
                showtimes, promotions, or our 2026 theater openings.
              </p>
            </div>

            {/* Data Sharing */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                4. Data Sharing
              </h2>
              <p className="text-gray-300">
                We may share your information with trusted third parties, such
                as payment processors or marketing partners, to facilitate
                services. We do not sell your personal data to third parties.
                All sharing complies with applicable privacy laws.
              </p>
            </div>

            {/* User Rights */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                5. User Rights
              </h2>
              <p className="text-gray-300">
                You have the right to access, correct, or request deletion of
                your personal information. To exercise these rights, please
                contact us via our{" "}
                <a
                  href="/contact"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Contact
                </a>{" "}
                page. We will respond promptly in accordance with applicable
                laws.
              </p>
            </div>

            {/* Cookies */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                6. Cookies
              </h2>
              <p className="text-gray-300">
                Our website uses cookies to enhance functionality and analyze
                usage. You can manage cookie preferences through your browser
                settings. Disabling cookies may limit certain features of our
                website.
              </p>
            </div>

            {/* Security */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                7. Security
              </h2>
              <p className="text-gray-300">
                We implement industry-standard security measures to protect your
                data. However, no system is completely secure, and we cannot
                guarantee absolute protection against unauthorized access.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                8. Changes to Policy
              </h2>
              <p className="text-gray-300">
                Lion's Den Cinemas may update this Privacy Policy as needed.
                Changes will be posted on our website, and continued use of our
                services constitutes acceptance of the updated policy.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                9. Contact
              </h2>
              <p className="text-gray-300">
                For questions about this Privacy Policy, please reach out to our
                support team via our{" "}
                <a
                  href="/contact"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Contact
                </a>{" "}
                page.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-300 mb-6 drop-shadow-lg">
            Need Assistance?
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-200 mb-6">
            Our team is here to answer any questions about your privacy or our
            services. Contact us or explore our upcoming theaters opening in
            Early 2026.
          </p>
          <Button
            onClick={() => navigate("/contact")}
            className="inline-flex items-center gap-2 bg-indigo-700 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
          >
            Contact Us <EnvelopeIcon className="h-5 w-5" />
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

export default Privacy;
