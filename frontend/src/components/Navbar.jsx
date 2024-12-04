import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between py-4 px-6 shadow-lg bg-white mb-20">
      <div className="flex items-center space-x-4">
        <a href="/" className="flex items-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzcu7iYfNs3hZT6fli_rJNGeoJSh0EzcMMrw&s"
            alt="Avnet Logo"
            className="h-8 w-auto"
          />
        </a>
      </div>

      <div className="sm:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 hover:text-black focus:outline-none"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </div>

      <div
        className={`${
          isOpen ? "block" : "hidden"
        } sm:block md:flex md:items-center space-y-4 md:space-y-0 md:space-x-6`}
      >
        <a href="/" className="text-gray-700 hover:text-green-500 block">
          Upload
        </a>
        <a
          href="/Overview Page"
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow-md block md:inline-block"
        >
          Overview →
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
