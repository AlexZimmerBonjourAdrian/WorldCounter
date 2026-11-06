'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { StoredCounterText } from '@/data/CounterData';
import { FaCopy, FaTrash, FaHistory, FaClock } from 'react-icons/fa';

interface HistoryPanelProps {
  texts: StoredCounterText[];
  onLoad: (id: number) => void;
  onDelete: (id: number) => void;
  onPurgeOld: () => void;
  onPurgeAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryPanel({
  texts,
  onLoad,
  onDelete,
  onPurgeOld,
  onPurgeAll,
  isOpen,
  onClose,
}: HistoryPanelProps) {
  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'ahora mismo';
    if (minutes < 60) return `hace ${minutes} min`;
    if (hours < 24) return `hace ${hours} h`;
    if (days < 7) return `hace ${days} días`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getDisplayTitle = (text: StoredCounterText): string => {
    if (text.title) return text.title;
    const preview = text.text.substring(0, 30);
    return preview + (text.text.length > 30 ? '...' : '');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0f0f0f] z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#2A2E33]">
              <div className="flex items-center gap-3">
                <FaHistory className="text-[#C0392B]" size={20} />
                <h2 className="text-[15px] font-semibold text-white">Historial</h2>
              </div>
              <button
                onClick={onClose}
                className="text-[#9CA3AF] hover:text-white transition-colors text-[20px]"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {texts.length === 0 ? (
                <div className="text-center py-12">
                  <FaClock className="text-[#6B7280] mx-auto mb-3" size={32} />
                  <p className="text-[13px] text-[#6B7280]">No hay textos guardados</p>
                </div>
              ) : (
                texts.map((text) => (
                  <div
                    key={text.id}
                    className="bg-[#1a1a1a] border border-[#2A2E33] rounded-[12px] p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-medium text-white truncate">
                          {getDisplayTitle(text)}
                        </h4>
                        <p className="text-[11px] text-[#6B7280] mt-1">
                          {formatRelativeTime(text.timestamp)} · {text.text.length} caracteres
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => onLoad(text.id!)}
                          className="px-3 py-1.5 bg-[#25282B] text-white rounded-[6px] hover:bg-[#3A3E44] transition-colors text-[11px]"
                        >
                          Cargar
                        </button>
                        <button
                          onClick={() => onDelete(text.id!)}
                          className="p-1.5 text-[#9CA3AF] hover:text-red-500 transition-colors"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(text.text);
                      }}
                      className="w-full py-2 bg-[#25282B] text-[#9CA3AF] rounded-[6px] hover:bg-[#3A3E44] hover:text-white transition-colors text-[12px] flex items-center justify-center gap-2"
                    >
                      <FaCopy size={12} />
                      Copiar
                    </button>
                  </div>
                ))
              )}
            </div>

            {texts.length > 0 && (
              <div className="p-6 border-t border-[#2A2E33] space-y-3">
                <button
                  onClick={onPurgeOld}
                  className="w-full py-3 bg-[#25282B] text-[#9CA3AF] rounded-[8px] hover:bg-[#3A3E44] hover:text-white transition-colors text-[13px]"
                >
                  Purgar textos viejos (&gt; 30 días)
                </button>
                <button
                  onClick={onPurgeAll}
                  className="w-full py-3 bg-[#C0392B] text-white rounded-[8px] hover:bg-[#A93226] transition-colors text-[13px]"
                >
                  Purgar todos los textos
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
