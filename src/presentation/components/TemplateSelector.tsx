'use client';

import { SocialTemplate } from '@/data/CounterData';
import { FaTwitter, FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';

interface TemplateSelectorProps {
  templates: SocialTemplate[];
  selected: SocialTemplate | null;
  onSelect: (template: SocialTemplate | null) => void;
}

export default function TemplateSelector({ templates, selected, onSelect }: TemplateSelectorProps) {
  const getIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <FaTwitter size={16} />;
      case 'instagram':
        return <FaInstagram size={16} />;
      case 'linkedin':
        return <FaLinkedin size={16} />;
      case 'facebook':
        return <FaFacebook size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2A2E33] rounded-[14px] p-6">
      <h3 className="text-[11px] tracking-[0.12em] uppercase font-semibold text-white mb-4">Plantilla</h3>

      <div className="space-y-2">
        <button
          onClick={() => onSelect(null)}
          className={`w-full py-2.5 px-4 rounded-[8px] text-[13px] flex items-center gap-3 transition-colors ${
            !selected
              ? 'bg-white text-[#0f0f0f] font-medium'
              : 'bg-[#25282B] text-[#9CA3AF] hover:text-white'
          }`}
        >
          <span className="w-5 h-5 flex items-center justify-center text-[#6B7280]">∞</span>
          Sin límite
        </button>

        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className={`w-full py-2.5 px-4 rounded-[8px] text-[13px] flex items-center gap-3 transition-colors ${
              selected?.id === template.id
                ? 'bg-white text-[#0f0f0f] font-medium'
                : 'bg-[#25282B] text-[#9CA3AF] hover:text-white'
            }`}
          >
            <span className="w-5 h-5 flex items-center justify-center text-[#6B7280]">
              {getIcon(template.platform)}
            </span>
            {template.name}
            <span className="ml-auto text-[11px] text-[#6B7280]">{template.maxChars}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
