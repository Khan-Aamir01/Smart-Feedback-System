import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { dark, toggleTheme } = useTheme(); // 👈 global theme

    return (
        <header className={`w-full ${dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-md`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo + Brand */}
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg ${dark ? 'bg-gray-800' : 'bg-blue-50'}`}>
                                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="3" width="18" height="18" rx="6" stroke={dark ? 'white' : '#2563EB'} strokeWidth="1.5" />
                                        <path d="M7 13c1.5-2 4.5-2 6 0" stroke={dark ? 'white' : '#2563EB'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-lg">SMDFeedBack</span>
                            </Link>
                        </div>

                        {/* Desktop nav */}
                        <nav className="hidden md:flex space-x-4 items-center ml-4">
                            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:text-white hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-800">Home</Link>
                            <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:text-white hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-800">Features</a>
                            <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:text-white hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-800">Docs</a>
                            <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:text-white hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-800">Pricing</a>
                        </nav>
                    </div>

                    {/* Right: CTA + Theme toggle */}
                    <div className="flex items-center gap-3">
                        <Link to="/sentiments" className="hidden md:inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow">Dashboard</Link>

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme} 
                            title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            className={`p-2 rounded-full border ${dark ? "border-gray-700 bg-gray-800 text-yellow-300" : "border-gray-200 bg-yellow-100 text-gray-800"} hover:shadow transition`}
                        >
                            {dark ? "🌙" : "☀️"}
                        </button>

                        {/* Avatar */}
                        <button className="flex items-center gap-2 p-1 rounded-full hover:shadow">
                            <img src="https://i.pravatar.cc/40" alt="avatar" className="h-8 w-8 rounded-full object-cover" />
                            <span className="hidden sm:inline-block text-sm">User</span>
                        </button>

                        {/* Mobile menu button */}
                        <button onClick={() => setMobileOpen((s) => !s)} className="ml-2 inline-flex md:hidden p-2 rounded-md border border-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                {mobileOpen ? (
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                ) : (
                                    <path d="M3 6h14M3 10h14M3 14h14" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className={`md:hidden ${dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} border-t`}>
                    <nav className="px-4 py-3 space-y-2">
                        <a href="#" className="block px-3 py-2 rounded-md">Home</a>
                        <a href="#" className="block px-3 py-2 rounded-md">Features</a>
                        <a href="#" className="block px-3 py-2 rounded-md">Docs</a>
                        <a href="#" className="block px-3 py-2 rounded-md">Pricing</a>
                        <a href="#" className="block px-3 py-2 rounded-md">Add Feedback</a>
                    </nav>
                </div>
            )}
        </header>
    );
}

