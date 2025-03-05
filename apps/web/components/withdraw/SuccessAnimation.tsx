"use client"
import { motion } from 'framer-motion';
import { Check} from 'lucide-react';
import { FaEthereum } from 'react-icons/fa';
export const SuccessAnimation = () => {
    return (
      <motion.div 
        className="relative overflow-hidden rounded-lg bg-green-50 p-4 mt-4"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="absolute top-0 left-0 h-1 bg-green-500"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        
        <div className="flex items-center">
          <motion.div 
            className="mr-4 bg-green-100 rounded-full p-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          >
            <Check size={24} className="text-green-600" />
          </motion.div>
          <div>
            <motion.h3 
              className="font-bold text-green-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              Transaction Successful
            </motion.h3>
            <motion.p 
              className="text-green-600 text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              Your funds have been successfully withdrawn!
            </motion.p>
          </div>
        </div>
        
        {/* Animated falling coins */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute text-green-500"
            initial={{ 
              x: `${20 + (i * 15)}%`, 
              y: -20, 
              opacity: 0 
            }}
            animate={{ 
              y: 100, 
              opacity: [0, 1, 0],
              rotate: i % 2 === 0 ? 180 : -180 
            }}
            transition={{ 
              duration: 2 + (i * 0.2), 
              repeat: Infinity, 
              delay: i * 0.3,
              repeatDelay: i * 0.2
            }}
          >
            <FaEthereum size={16} />
          </motion.div>
        ))}
      </motion.div>
    );
};
  