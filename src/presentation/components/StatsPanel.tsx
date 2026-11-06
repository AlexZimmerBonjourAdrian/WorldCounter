'use client';

import { CounterStats, SocialTemplate } from '@/data/CounterData';
import { FaCopy } from 'react-icons/fa';

interface StatsPanelProps {
  stats: CounterStats;
  template?: SocialTemplate | null;
  onCopy: () => void;
}

export default function StatsPanel({ stats, template, onCopy }: StatsPanelProps) {
  const getProgressColor = (percentage: number): string => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const percentage = template ? (stats.charCount / template.maxChars) * 100 : 0;
  const remaining = template ? template.maxChars - stats.charCount : 0;

  return (
    <div className="bg-[#1a1a1a] border border-[#2A2E33] rounded-[14px] p-6 space-y-6">
      <h3 className="text-[11px] tracking-[0.12em] uppercase font-semibold text-white">Estadísticas</h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[13px] text-[#9CA3AF]">Palabras</span>
          <span className="text-[20px] font-bold text-white">{stats.wordCount}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[13px] text-[#9CA3AF]">Caracteres (con espacios)</span>
          <span className="text-[20px] font-bold text-white">{stats.charCount}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[13px] text-[#9CA3AF]">Caracteres (sin espacios)</span>
          <span className="text-[20px] font-bold text-white">{stats.charCountNoSpaces}</span>
        </div>
      </div>

      {template && template.maxChars > 0 && (
        <div className="pt-4 border-t border-[#2A2E33]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[13px] text-[#9CA3AF]">{template.name}</span>
            <span className="text-[13px] text-white">
              {stats.charCount} / {template.maxChars}
            </span>
          </div>
          <div className="w-full h-[3px] bg-[#25282B] rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColor(percentage)} transition-all duration-300`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[11px] text-[#6B7280]">
              {remaining >= 0 ? `${remaining} restantes` : `${Math.abs(remaining)} excedidos`}
            </span>
            <span className="text-[11px] text-[#6B7280]">{percentage.toFixed(0)}%</span>
          </div>
        </div>
      )}

      <button
        onClick={onCopy}
        className="w-full py-3 bg-[#C0392B] text-white rounded-[8px] hover:bg-[#A93226] transition-colors text-[13px] font-medium flex items-center justify-center gap-2"
      >
        <FaCopy size={14} />
        Copiar al portapapeles
      </button>
    </div>
  );
}
