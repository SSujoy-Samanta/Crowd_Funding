"use client";
import { notificationState } from "@/lib/atom";
import  { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export function Notification() {

    const [notify,setNotification]=useRecoilState(notificationState);

    useEffect(() => {
        if (notify) {
            // Clear notification after 3 seconds
            const timer = setTimeout(() => {
                setNotification(null);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [notify, setNotification]);

    if (!notify?.msg) return null;

    return (
        <div className="fixed right-10 bottom-10 flex justify-start z-40 ">
        <div
            className={
            notify.type === "success"
                ? `w-full border border-sky-600 bg-green-800 text-white p-4 rounded-md`
                : `w-full border border-yellow-500 bg-red-700 text-white p-4 rounded-md`
            }
        >
            {notify.msg}
        </div>
        </div>
    );
}
