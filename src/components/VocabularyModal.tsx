import React, { useState } from 'react';
import { X, Volume2, Sparkles, BookOpen, Check, Loader2 } from 'lucide-react';
import { VocabularyItem, STORY_PARAGRAPHS } from '../data/storyData';
import { VoiceName } from '../services/ttsService';

interface VocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: VocabularyItem | null;
  onSelectItem: (item: VocabularyItem) => void;
  voice: VoiceName;
}

export const VocabularyModal: React.FC<VocabularyModalProps> = ({
  isOpen,
  onClose,
  selectedItem,
  onSelectItem,
  voice,
}) => {
  const [isPlayingWord, setIsPlayingWord] = useState<string | null>(null);

  if (!isOpen) return null;

  // Gather all unique vocabulary across paragraphs
  const allVocab: VocabularyItem[] = [];
  const seenWords = new Set<string>();

  STORY_PARAGRAPHS.forEach((p) => {
    p.vocabulary?.forEach((v) => {
      if (!seenWords.has(v.word.toLowerCase())) {
        seenWords.add(v.word.toLowerCase());
        allVocab.push(v);
      }
    });
  });

  const activeVocab = selectedItem || allVocab[0];

  const handlePronounce = async (word: string, example?: string) => {
    setIsPlayingWord(word);
    try {
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `${word}. ${example ? example : ''}`,
          voice,
          style: `Friendly English teacher pronouncing the vocabulary word "${word}" very clearly and distinctly for A2 learners, followed by a simple example sentence.`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const binary = atob(data.audioBase64);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
          const audio = new Audio(URL.createObjectURL(blob));
          audio.playbackRate = 0.85;
          audio.onended = () => setIsPlayingWord(null);
          audio.onerror = () => setIsPlayingWord(null);
          await audio.play();
          return;
        }
      }
      throw new Error('TTS error');
    } catch {
      // Fallback to browser SpeechSynthesis
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(word);
        u.rate = 0.8;
        u.pitch = 1.05;
        u.lang = 'en-US';
        u.onend = () => setIsPlayingWord(null);
        u.onerror = () => setIsPlayingWord(null);
        window.speechSynthesis.speak(u);
      } else {
        setIsPlayingWord(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-amber-200/90 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-amber-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Key Story Vocabulary (A2 Level)
              </h2>
              <p className="text-xs text-stone-500">
                Tap any word to listen to distinct teacher pronunciation & meaning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-amber-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Word List Sidebar */}
          <div className="md:col-span-5 space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-2 mb-2">
              Words in this story ({allVocab.length})
            </div>
            {allVocab.map((item) => {
              const isSelected = activeVocab.word.toLowerCase() === item.word.toLowerCase();
              return (
                <button
                  key={item.word}
                  onClick={() => onSelectItem(item)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-amber-50 text-stone-700'
                  }`}
                >
                  <div>
                    <div className="text-sm capitalize">{item.word}</div>
                    <div
                      className={`text-[11px] ${
                        isSelected ? 'text-amber-100' : 'text-stone-400'
                      }`}
                    >
                      {item.phonetic}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isSelected
                        ? 'bg-amber-700 text-amber-100'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {item.pos}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Word Card Detail */}
          <div className="md:col-span-7 bg-amber-50/60 rounded-xl p-5 border border-amber-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-2xl font-bold text-stone-900 capitalize">
                      {activeVocab.word}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-mono">
                      {activeVocab.pos}
                    </span>
                  </div>
                  <p className="text-sm font-mono text-amber-800 mt-0.5">
                    {activeVocab.phonetic}
                  </p>
                </div>

                {/* Pronounce Button */}
                <button
                  onClick={() => handlePronounce(activeVocab.word, activeVocab.example)}
                  disabled={isPlayingWord === activeVocab.word}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                  title="Listen to teacher pronounce this word distinctly"
                >
                  {isPlayingWord === activeVocab.word ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                  <span>Pronounce</span>
                </button>
              </div>

              {/* Definition */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Definition (A2 Level)
                </div>
                <p className="text-stone-800 text-sm sm:text-base leading-relaxed bg-white p-3 rounded-lg border border-amber-200/60">
                  {activeVocab.definition}
                </p>
              </div>

              {/* Example sentence */}
              <div>
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Example Sentence
                </div>
                <p className="text-stone-700 text-sm italic bg-white/70 p-3 rounded-lg border border-amber-200/40">
                  "{activeVocab.example}"
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-amber-200 flex items-center justify-between text-xs text-stone-500">
              <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini 3.8 Flash TTS
              </span>
              <span>Learner Pace • 85% Speed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
