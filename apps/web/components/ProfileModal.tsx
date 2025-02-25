"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { notificationState } from "@/lib/atom";
import { IoPersonSharp } from "react-icons/io5";
export const ProfileModal = ({
  setToggle,
  username,
  email,
}: {
    setToggle: React.Dispatch<React.SetStateAction<boolean>>;
    username: string;
    email: string;
}) => {
    const setNotification = useSetRecoilState(notificationState);
    const router = useRouter();
    const handleClickOutside = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        event.stopPropagation();
        setToggle((prev) => !prev);
    };

    const handleClickInside = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        event.stopPropagation();
    };
    const openLinkInNewTab = (url: string) => {
        window.open(url, "_blank");
    };
    return (
        <div
        id="popup-modal"
        className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        onClick={handleClickOutside}
        >
        <div
            className="absolute right-0 sm:p-4 top-24 xxs:pl-12 w-full max-w-md max-h-full"
            onClick={handleClickInside}
        >
            <div
            className="relative bg-white rounded-lg shadow dark:bg-stone-900 sm:w-5/6 xxs:w-11/12"
            onClick={handleClickInside}
            >
            <div className="p-4 md:p-5  flex flex-col gap-3">
                <div className="flex items-center gap-2 border rounded-md border-teal-900 p-2">
                    <div className="w-10 h-10 rounded-full p-2 bg-cyan-600 text-center">
                        {username.toUpperCase()[0]}
                    </div>
                    <div className="flex flex-col gap-1 justify-start ">
                        <div>{username}</div>
                        <div className="xxs:text-xs md:text-sm break-all">{email}</div>
                    </div>
                </div>
                <button
                    type="button"
                    className="p-2 text-sm font-medium text-white  rounded-lg border border-gray-200 hover:bg-gray-100  focus:z-10 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
                    onClick={() => {
                        setToggle((x) => !x);
                        router.push("/profile");
                    }}
                >
                    <div className="flex gap-2 items-center">
                        <IoPersonSharp size={20}/>
                        <p>Profile</p>
                    </div>
                </button>
                <div className="flex gap-2 text-sm xxs:flex xxs:flex-col-reverse flex-col-reverse">
                    <button
                        onClick={() => {
                            setToggle((x) => !x);
                            router.push("/dashboard");
                        }}
                        className="transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-400 p-2 text-sm font-medium text-white rounded-lg dark:text-white dark:hover:text-white"
                    >
                        <div className="flex gap-2 items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 3h7v7H3V3zM14 3h7v7h-7V3zM14 14h7v7h-7v-7zM3 14h7v7H3v-7z"
                                />
                            </svg>
                            <p className="text-white ">Dashboard</p>
                        </div>
                    </button>
                </div>

                <button
                    type="button"
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm flex items-center text-center p-2 dark:hover:text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
                    onClick={async () => {
                        await signOut();
                        setToggle((x) => !x);
                        setNotification({
                            msg: "Loged out.",
                            type: "success",
                        });
                    }}
                >
                    <div className="flex gap-2 items-center">
                        <div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-log-out "
                            >
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" x2="9" y1="12" y2="12"></line>
                            </svg>
                        </div>
                        <p>Logout</p>
                    </div>
                </button>
            </div>
            </div>
        </div>
        </div>
    );
};
