'use client'
import { motion} from 'framer-motion';
import {AlertCircle} from 'lucide-react';



// Success Animation Component with Framer Motion

// Error Animation Component with Framer Motion
export const ErrorAnimation = ({ message }:{message:string}) => {
  return (
    <motion.div 
      className="relative overflow-hidden rounded-lg bg-red-50 p-4 mt-4"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="absolute top-0 left-0 h-1 bg-red-500"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      
      <div className="flex items-center">
        <motion.div 
          className="mr-4 bg-red-100 rounded-full p-2"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AlertCircle size={24} className="text-red-600" />
        </motion.div>
        <div>
          <motion.h3 
            className="font-bold text-red-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            Transaction Failed
          </motion.h3>
          <motion.p 
            className="text-red-600 text-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            {message}
          </motion.p>
        </div>
      </div>
      
      {/* Error zigzag animation */}
      <motion.div 
        className="absolute bottom-3 w-full flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.6 }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.div
            key={i}
            className="h-3 w-3 mx-1"
            initial={{ y: 0 }}
            animate={{ 
              y: i % 2 === 0 ? [0, -6, 0] : [0, 6, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.6,
              delay: i * 0.07,
              ease: "easeInOut" 
            }}
          >
            <div className="h-2 w-2 rounded-full bg-red-400" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
