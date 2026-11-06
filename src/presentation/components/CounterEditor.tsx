'use client';

import { useState, useEffect, useRef } from 'react';

interface CounterEditorProps {
  value: string;
  onChange: (text: string) => void;
  onAutoSave: (text: string) => void;
}

export default function CounterEditor({ value, onChange, onAutoSave }: CounterEditorProps) {
  const [localValue, setLocalValue] = useState(value);
  const lastSavedRef = useRef(value);

  useEffect(() => {
    setLocalValue(value);
    lastSavedRef.current = value;
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setLocalValue(newText);
    onChange(newText);
  };

  // Autoguardado con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localValue !== lastSavedRef.current) {
        lastSavedRef.current = localValue;
        onAutoSave(localValue);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localValue, onAutoSave]);

  return (
    <textarea
      value={localValue}
      onChange={handleChange}
      placeholder="Escribe o pega tu texto aquí..."
      className="w-full h-full min-h-[400px] p-6 bg-[#1a1a1a] border border-[#2A2E33] rounded-[14px] text-white text-[15px] leading-[1.7] resize-none focus:outline-none focus:border-[#6B7280] transition-colors placeholder:text-[#6B7280]"
    />
  );
}