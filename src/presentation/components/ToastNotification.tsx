'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaInfo, FaExclamationTriangle } from 'react-icons/fa';

type ToastType = 'success' | 'info' | 'warning';

interface ToastNotificationProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

export default function ToastNotification({
  message,
  type = 'success',
  isVisible,
  onClose,
}: ToastNotificationProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheck className="text-green-500" size={18} />;
      case 'info':
        return <FaInfo className="text-blue-500" size={18} />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" size={18} />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-[#1a1a1a] border-green-500/30';
      case 'info':
        return 'bg-[#1a1a1a] border-blue-500/30';
      case 'warning':
        return 'bg-[#1a1a1a] border-yellow-500/30';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className={`${getBgColor()} border rounded-[12px] px-6 py-4 flex items-center gap-3 shadow-xl`}>
            {getIcon()}
            <span className="text-[13px] text-white">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
