"use client"
import { useState } from "react";
import { AuthButtons } from "./AuthButton";
import { WalletPopUp } from "./WalletPopUp";
import { Logo } from "./Logo";
import { RxCross1 } from "react-icons/rx";
import { CiMenuBurger } from "react-icons/ci";

export const AppBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="px-3 sm:px-4 md:px-6 lg:px-12 xl:px-20 py-2 fixed top-0 z-30 w-full">
      <div className="sm:p-3 sm:rounded-xl md:rounded-2xl flex items-center justify-between p-3 md:p-4 rounded-2xl top-0 z-30 shadow-xl   backdrop-blur-xl bg-opacity-20 bg-black">
        <div className="flex-shrink-0">
          <Logo />
        </div>
        
        {/* Menu button for small screens */}
        <div className="block md:hidden">
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-md focus:outline-none"
          >
            {isMenuOpen ? (
              <span className="text-white text-xl"><RxCross1/></span> 
            ) : (
              <span className="text-white"><CiMenuBurger/></span>
            )}
          </button>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-3">
          <AuthButtons />
          <WalletPopUp />
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 p-3 rounded-lg shadow-lg backdrop-blur-xl bg-opacity-20 bg-black">
          <div className="flex flex-col gap-3">
            <div className="w-full"><AuthButtons /></div>
            <div className="w-full"><WalletPopUp /></div>
          </div>
        </div>
      )}
    </nav>
  );
};