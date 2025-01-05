import React from 'react';
import { motion } from 'framer-motion';

export function BeginButton() {
  return (
    <div className="fixed bottom-12 left-0 right-0 flex justify-center pointer-events-none">
      <motion.div
        className="w-[60%] bg-white/20 backdrop-blur-lg rounded-full p-12"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <span className="text-white text-3xl font-light">
          Touch here to begin
        </span>
      </motion.div>
    </div>
  );
}