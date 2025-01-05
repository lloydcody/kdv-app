import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface Props {
  visible: boolean;
}

export function UpdateToast({ visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 right-4 bg-gray-800 text-white rounded-lg shadow-lg p-4 flex items-center gap-3"
        >
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Checking for updates...</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}