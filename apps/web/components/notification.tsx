"use client";
import { notificationState } from "@/lib/atom";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, X } from "lucide-react";

export function Notification() {
  const [notify, setNotification] = useRecoilState(notificationState);

  useEffect(() => {
    if (notify) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [notify, setNotification]);

  if (!notify?.msg) return null;

  const isSuccess = notify.type === "success";

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <AnimatePresence>
        {notify.msg && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md shadow-lg rounded-lg overflow-hidden backdrop-blur-sm"
          >
            <div 
              className={`
                flex items-center gap-3 p-4 
                ${isSuccess 
                  ? "bg-emerald-50 border-l-4 border-emerald-500 dark:bg-emerald-900/70 dark:border-emerald-400" 
                  : "bg-rose-50 border-l-4 border-rose-500 dark:bg-rose-900/30 dark:border-rose-400"}
              `}
            >
              <div className="shrink-0">
                {isSuccess ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                )}
              </div>
              
              <div className="flex-1">
                <p className={`text-sm font-medium ${isSuccess ? "text-emerald-800 dark:text-emerald-200" : "text-rose-800 dark:text-rose-200"}`}>
                  {notify.msg}
                </p>
              </div>
              
              <button 
                onClick={() => setNotification(null)}
                className="shrink-0 rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}