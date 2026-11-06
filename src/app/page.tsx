'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/presentation/components/Header';
import Footer from '@/presentation/components/Footer';
import CounterEditor from '@/presentation/components/CounterEditor';
import StatsPanel from '@/presentation/components/StatsPanel';
import TemplateSelector from '@/presentation/components/TemplateSelector';
import HistoryPanel from '@/presentation/components/HistoryPanel';
import ToastNotification from '@/presentation/components/ToastNotification';
import { StorageService } from '@/data/StorageService';
import { TextAnalysisService } from '@/business/services/TextAnalysisService';
import { TemplateService } from '@/business/services/TemplateService';
import { ClipboardService } from '@/business/services/ClipboardService';
import { CounterStats, SocialTemplate, StoredCounterText } from '@/data/CounterData';

export default function Home() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState<CounterStats>({ wordCount: 0, charCount: 0, charCountNoSpaces: 0 });
  const [selectedTemplate, setSelectedTemplate] = useState<SocialTemplate | null>(null);
  const [savedTexts, setSavedTexts] = useState<StoredCounterText[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const templates = TemplateService.getTemplates();

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const newStats = TextAnalysisService.analyzeText(text);
    setStats(newStats);
  }, [text]);

  const loadHistory = async () => {
    try {
      const texts = await StorageService.listTexts();
      setSavedTexts(texts);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  const handleAutoSave = async (textToSave: string) => {
    if (!textToSave.trim()) return;
    
    setIsSaving(true);
    try {
      await StorageService.saveText(textToSave);
      await loadHistory();
      showToast('Texto guardado', 'success');
    } catch (error) {
      console.error('Error auto-saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    const success = await ClipboardService.copyToClipboard(text);
    if (success) {
      showToast('Texto copiado al portapapeles', 'success');
    } else {
      showToast('Error al copiar', 'warning');
    }
  };

  const handleLoadText = async (id: number) => {
    const loadedText = await StorageService.loadText(id);
    if (loadedText) {
      setText(loadedText.text);
      setIsHistoryOpen(false);
      showToast('Texto cargado', 'info');
    }
  };

  const handleDeleteText = async (id: number) => {
    await StorageService.deleteText(id);
    await loadHistory();
    showToast('Texto eliminado', 'info');
  };

  const handlePurgeOld = async () => {
    const deletedCount = await StorageService.purgeOldTexts(30);
    await loadHistory();
    showToast(`${deletedCount} textos purgados`, 'success');
  };

  const handlePurgeAll = async () => {
    await StorageService.purgeAllTexts();
    await loadHistory();
    setText('');
    showToast('Todos los textos purgados', 'success');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      <Header onOpenHistory={() => setIsHistoryOpen(true)} />

      <main className="flex-1 px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Editor - ocupa 8 columnas en desktop */}
            <div className="lg:col-span-8">
              <CounterEditor
                value={text}
                onChange={handleTextChange}
                onAutoSave={handleAutoSave}
              />
            </div>

            {/* Panel derecho - estadísticas y plantillas */}
            <div className="lg:col-span-4 space-y-6">
              <StatsPanel
                stats={stats}
                template={selectedTemplate}
                onCopy={handleCopy}
              />
              <TemplateSelector
                templates={templates}
                selected={selectedTemplate}
                onSelect={setSelectedTemplate}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <HistoryPanel
        texts={savedTexts}
        onLoad={handleLoadText}
        onDelete={handleDeleteText}
        onPurgeOld={handlePurgeOld}
        onPurgeAll={handlePurgeAll}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <ToastNotification
        message={toast?.message || ''}
        type={toast?.type}
        isVisible={toast !== null}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
