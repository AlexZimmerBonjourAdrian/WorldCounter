'use client';

import { FaHistory } from 'react-icons/fa';
import FileImportButton from './FileImportButton';

interface HeaderProps {
  onOpenHistory: () => void;
  onImportText?: (text: string) => void;
  onImportError?: (message: string) => void;
}

export default function Header({ onOpenHistory, onImportText, onImportError }: HeaderProps) {
  return (
    <header className="bg-[#0f0f0f] border-b border-[#2A2E33] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-[68px]">
          <div className="flex items-center gap-3">
            <div className="bg-[#C0392B] p-[9px] rounded-[10px]">
              <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex items-baseline gap-[7px]">
              <span className="text-[19px] font-bold tracking-[-0.02em] text-white font-serif">WorldCounter</span>
              <span className="hidden sm:inline text-[10px] tracking-[0.14em] uppercase text-[#6B7280] font-medium">v2.0.0</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onImportText && (
              <FileImportButton
                onImport={onImportText}
                onError={onImportError}
              />
            )}
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2A2E33] rounded-[8px] text-[#9CA3AF] hover:text-white hover:border-[#3A3E44] transition-colors text-[13px]"
            >
              <FaHistory size={14} />
              <span className="hidden sm:inline">Historial</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
