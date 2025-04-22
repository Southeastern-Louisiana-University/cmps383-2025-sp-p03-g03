import { useNavigate } from "react-router-dom";
import { Button } from "@headlessui/react";
import { DocumentTextIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

function Terms() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-1">
        {/* Header */}
        <section className="text-center mb-12">
          <DocumentTextIcon className="h-12 w-12 mx-auto text-indigo-400 mb-4" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-300 mb-4 drop-shadow-lg">
            Terms of Service
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-200">
            Welcome to Lion's Den Cinemas. By using our website or services, you
            agree to the following terms and conditions.
          </p>
        </section>

        {/* Terms Sections */}
        <section className="mb-12">
          <div className="space-y-8 max-w-3xl mx-auto">
            {/* Acceptance of Terms */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-300">
                By accessing or using the Lion's Den Cinemas website, purchasing
                tickets, or attending our theaters, you agree to be bound by
                these Terms of Service. If you do not agree, please do not use
                our services.
              </p>
            </div>

            {/* Ticket Purchases */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                2. Ticket Purchases
              </h2>
              <p className="text-gray-300">
                All ticket sales are final unless otherwise stated. Prices may
                vary by location (New York, New Orleans, Los Angeles) and
                showtime. Tickets are non-transferable and valid only for the
                specified movie, date, and time. Lion's Den Cinemas reserves the
                right to refuse service or cancel tickets suspected of
                fraudulent activity.
              </p>
            </div>

            {/* Refunds and Exchanges */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                3. Refunds and Exchanges
              </h2>
              <p className="text-gray-300">
                Refunds or exchanges may be granted at the discretion of Lion's
                Den Cinemas, subject to our refund policy. Requests must be made
                at least 24 hours before the showtime. No refunds will be issued
                for missed showtimes or late arrivals. Contact our support team
                for assistance.
              </p>
            </div>

            {/* User Conduct */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                4. User Conduct
              </h2>
              <p className="text-gray-300">
                Guests are expected to behave respectfully in our theaters.
                Prohibited actions include disruptive behavior, recording
                movies, using mobile devices during screenings, or bringing
                outside food and beverages. Lion's Den Cinemas may remove guests
                who violate these rules without refund.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                5. Intellectual Property
              </h2>
              <p className="text-gray-300">
                All content on the Lion's Den Cinemas website, including logos,
                designs, and text, is the property of Lion's Den Cinem ماسشس or
                its licensors. Unauthorized use, reproduction, or distribution
                is prohibited.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                6. Limitation of Liability
              </h2>
              <p className="text-gray-300">
                Lion's Den Cinemas is not liable for any damages arising from
                the use of our website or services, including but not limited to
                technical issues, cancellations, or delays. Our theaters,
                opening in Early 2026, strive to provide a premium experience,
                but we cannot guarantee uninterrupted service.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                7. Changes to Terms
              </h2>
              <p className="text-gray-300">
                Lion's Den Cinemas reserves the right to modify these Terms of
                Service at any time. Updated terms will be posted on our
                website, and continued use of our services constitutes
                acceptance of the revised terms.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-indigo-950/50">
              <h2 className="text-xl font-semibold text-indigo-200 mb-3">
                8. Contact
              </h2>
              <p className="text-gray-300">
                For questions about these Terms of Service, please reach out to
                our support team via our{" "}
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
            Have Questions?
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-200 mb-6">
            Our team is here to assist you. Contact us or explore our upcoming
            theaters opening in Early 2026.
          </p>
          <Button
            onClick={() => navigate("/contact")}
            className="inline-flex items-center gap-2 bg-indigo-700 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
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

export default Terms;
