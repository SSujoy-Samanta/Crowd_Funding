"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import { FaEthereum } from "react-icons/fa";

type StatusType = "idle" | "processing" | "confirmed" | "error";

export const AnimatedLogo = ({ status }: { status: StatusType }) => {
  return (
    <div className="relative h-20 w-20 mx-auto mb-6">
      {/* Outer circle */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={{ scale: 0.6, opacity: 0.4 }}
        animate={{
          scale: status === "confirmed" ? 1 : status === "error" ? 0.95 : 0.8,
          opacity: status === "confirmed" ? 0.8 : status === "error" ? 0.7 : 0.5,
          backgroundColor:
            status === "confirmed"
              ? "#d1fae5"
              : status === "error"
              ? "#fee2e2"
              : status === "processing"
              ? "#dbeafe"
              : "#e0f2fe",
        }}
        transition={{ duration: 0.8, type: "spring" }}
      />

      {/* Middle circle */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={{ scale: 0.4, opacity: 0.5 }}
        animate={{
          scale: status === "confirmed" ? 0.85 : status === "error" ? 0.8 : 0.65,
          opacity: status === "confirmed" ? 0.9 : status === "error" ? 0.8 : 0.6,
          backgroundColor:
            status === "confirmed"
              ? "#a7f3d0"
              : status === "error"
              ? "#fecaca"
              : status === "processing"
              ? "#bfdbfe"
              : "#bae6fd",
        }}
        transition={{ duration: 0.8, delay: 0.1, type: "spring" }}
      />

      {/* Main circle with icon */}
      <motion.div
        className="relative h-full w-full flex items-center justify-center rounded-full shadow-md"
        initial={{ scale: 0.9 }}
        animate={{
          scale: 1,
          backgroundColor:
            status === "confirmed"
              ? "#10b981"
              : status === "error"
              ? "#ef4444"
              : status === "processing"
              ? "#3b82f6"
              : "#0ea5e9",
        }}
        transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
      >
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <FaEthereum size={32} className="text-white" />
            </motion.div>
          )}

          {status === "processing" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 size={32} className="text-white" />
              </motion.div>
            </motion.div>
          )}

          {status === "confirmed" && (
            <motion.div
              key="success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
            >
              <Check size={32} className="text-white" />
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <X size={32} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
