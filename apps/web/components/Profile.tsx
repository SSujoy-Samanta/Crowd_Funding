"use client"
import { IoPersonSharp } from "react-icons/io5";
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
        <div className="bg-gradient-to-br from-black to-blue-600 text-white rounded-full w-10 h-10 p-2 font-semibold text-center  cursor-pointer">
            {userName === "unknown" ? (
                <div className="flex justify-center items-center">
                    <IoPersonSharp size={20}/>
                </div>
            ) : (
                profile
            )}
        </div>
      </div>
    );
};
  