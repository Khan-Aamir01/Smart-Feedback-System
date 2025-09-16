import React from "react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext"; // adjust path

export default function Footer() {
  const { dark } = useTheme(); // use global theme

  return (
    <footer
      className={`border-t ${
        dark ? "bg-gray-900 border-gray-800 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Logo & About */}
          <div className="text-center md:text-left">
            <h2 className={`text-2xl font-bold ${dark ? "text-gray-200" : "text-gray-800"}`}>
              SMDFeedback
            </h2>
            <p className={`mt-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
              Smart feedback and insights to improve your business 🚀
            </p>
          </div>

          {/* Links */}
          <div className="mt-6 md:mt-0 flex flex-col md:flex-row md:space-x-8 text-center md:text-right">
            {["About", "Features", "Pricing", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className={`transition ${
                  dark
                    ? "text-gray-300 hover:text-blue-400"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between ${dark ? "border-gray-800" : "border-gray-200"}`}>
          {/* Social Icons */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-2xl transition ${
                dark ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-blue-500"
              }`}
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-2xl transition ${
                dark ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-blue-700"
              }`}
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-2xl transition ${
                dark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaGithub />
            </a>
          </div>

          {/* Copyright */}
          <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            © {new Date().getFullYear()} Khan Aamir SIH. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}



