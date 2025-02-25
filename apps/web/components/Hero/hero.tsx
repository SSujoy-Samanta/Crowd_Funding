"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";


export const HeroPage = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-blue-700">FundRaiser</h1>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700">
          <a href="#" className="hover:text-blue-700 transition-colors">Discover</a>
          <a href="#" className="hover:text-blue-700 transition-colors">How it Works</a>
          <a href="#" className="hover:text-blue-700 transition-colors">Success Stories</a>
          <a href="#" className="hover:text-blue-700 transition-colors">For Nonprofits</a>
        </div>
        <div className="flex items-center space-x-4">
          <button className="hidden md:block px-4 py-2 text-sm font-medium text-blue-700 border border-blue-700 rounded-full hover:bg-blue-50 transition-colors">
            Sign In
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-full hover:bg-blue-800 transition-colors">
            Start Fundraising
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative px-6 pt-12 pb-24 md:pt-24 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Make an Impact with <span className="text-blue-700">Your Story</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Start a fundraiser that moves people. Connect with donors who care about causes like yours.
          </p>
          
          {/* Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search for a cause or fundraiser..."
                className="w-full px-6 py-4 pr-12 text-gray-700 bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 shadow-sm"
              />
              <button className="absolute right-4 text-blue-700">
                <CiSearch size={20} />
              </button>
            </div>
          </div>
          
          {/* Quick Start Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all shadow-md">
              Start a Fundraiser
            </button>
            <button className="px-6 py-3 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-full hover:bg-blue-50 transition-colors shadow-sm">
              Explore Fundraisers
            </button>
          </div>
        </div>
      </div>
      
      {/* Floating Cards Section */}
      <div className="absolute w-full bottom-0 translate-y-1/2">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-xl p-6 transform transition-transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Quick Setup</h3>
              <p className="mt-2 text-gray-600">Start your fundraiser in minutes with our simple, guided process.</p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-xl p-6 transform transition-transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905V10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Share Easily</h3>
              <p className="mt-2 text-gray-600">Reach more donors with our built-in social sharing and promotion tools.</p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-xl p-6 transform transition-transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Fast Access</h3>
              <p className="mt-2 text-gray-600">Get your funds quickly and securely with multiple withdrawal options.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


