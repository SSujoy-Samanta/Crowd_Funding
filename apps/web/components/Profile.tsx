"use client"
import { GoPerson } from "react-icons/go";
export const Profile = ({
    userName,
    onClick,
}: {
    userName: string;
    onClick: () => void;
}) => {
    const profile = userName[0]?.toUpperCase();
    return (
      <div onClick={onClick}>
        <div className="bg-gradient-to-b from-cyan-500 to-white text-black rounded-full w-10 h-10 p-2 font-semibold text-center  cursor-pointer">
            {userName === "unknown" ? (
                <div className="flex justify-center items-center">
                    <GoPerson size={20}/>
                </div>
            ) : (
                profile
            )}
        </div>
      </div>
    );
};
  