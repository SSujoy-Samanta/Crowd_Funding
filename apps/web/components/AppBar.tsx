import { AuthButtons } from "./AuthButton";
import { WalletPopUp } from "./WalletPopUp";
import { Logo } from "./Logo";


export const AppBar = () => {
  return (
    <nav className="px-6 sm:px-10 md:px-20 lg:px-40 py-2 md:py-3 fixed top-0 z-30 w-full">
        <div className="flex items-center justify-between p-3 md:p-4 rounded-2xl top-0 z-30 shadow-xl   backdrop-blur-xl bg-opacity-20 bg-black">
            <div>
              <Logo/>
            </div>
            <div className="flex justify-around items-center gap-2">
              <AuthButtons/>
              <WalletPopUp/>
            </div>
        </div>
    </nav>
  );
};