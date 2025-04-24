// CheckoutSuccess.tsx
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <div className="!flex !flex-col !min-h-screen !bg-gray-900 !text-white">
      <div className="!max-w-2xl !mx-auto !p-6 !text-center !flex-1 !flex !flex-col !justify-center">
        <CheckCircleIcon className="!h-20 !w-20 !text-green-500 !mx-auto !mb-6" />
        <h1 className="!text-3xl !font-extrabold !text-indigo-300 !mb-4 !drop-shadow-lg">
          Order Complete!
        </h1>
        <p className="!text-xl !text-gray-300 !mb-8">
          Thank you for your purchase!
        </p>

        <div className="!flex !flex-col sm:!flex-row !gap-4 !justify-center">
          <Button
            onClick={() => navigate("/MyTickets")}
            className="!bg-indigo-700 hover:!bg-indigo-600 !text-white !px-6 !py-3 !rounded-lg !transition-all !duration-300 !shadow-md hover:!shadow-lg"
          >
            View Tickets
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="!bg-gray-700 !border !border-indigo-600 !text-indigo-300 hover:!bg-gray-600 !px-6 !py-3 !rounded-lg !transition-all !duration-300"
          >
            Back to Home
          </Button>
        </div>
      </div>

      <footer className="!w-full !bg-indigo-950 !text-white !py-6">
        <div className="!container !mx-auto !px-4 !text-center">
          <p>© {currentYear} Lion's Den Cinemas. All rights reserved.</p>
          <div className="!mt-2 !space-x-4">
            <a href="/terms" className="hover:!text-indigo-300">
              Terms
            </a>
            <a href="/privacy" className="hover:!text-indigo-300">
              Privacy
            </a>
            <a href="/contact" className="hover:!text-indigo-300">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
