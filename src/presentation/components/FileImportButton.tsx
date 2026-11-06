'use client';

import { useRef, useState } from 'react';
import { FaFileUpload } from 'react-icons/fa';
import { FileImportService } from '@/business/services/FileImportService';

interface FileImportButtonProps {
  onImport: (text: string) => void;
  onError?: (message: string) => void;
  label?: string;
}

export default function FileImportButton({ onImport, onError, label = 'Cargar archivo' }: FileImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsImporting(true);
    try {
      const text = await FileImportService.importFiles(files);
      if (!text.trim()) {
        throw new Error('El archivo no contiene texto legible');
      }
      onImport(text);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar el archivo';
      onError?.(message);
    } finally {
      setIsImporting(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const accept = FileImportService.getSupportedExtensions().join(',');

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={isImporting}
        className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2A2E33] rounded-[8px] text-[#9CA3AF] hover:text-white hover:border-[#3A3E44] transition-colors text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaFileUpload size={14} />
        <span className="hidden sm:inline">{isImporting ? 'Cargando...' : label}</span>
      </button>
    </>
  );
}