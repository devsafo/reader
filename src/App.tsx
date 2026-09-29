import React, { useState } from 'react';
import { Header } from './components/Header';
import { AudioPlayer } from './components/AudioPlayer';
import { StoryView } from './components/StoryView';
import { VocabularyModal } from './components/VocabularyModal';
import { PracticeModal } from './components/PracticeModal';
import { QuizView } from './components/QuizView';
import {
  STORY_PARAGRAPHS,
  VocabularyItem,
  StoryParagraph,
} from './data/storyData';
import { VoiceName } from './services/ttsService';
import { BookOpen, Sparkles, Mic, Volume2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'story' | 'vocab' | 'practice' | 'quiz'>('story');
  const [currentParagraphId, setCurrentParagraphId] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(0.85); // 85-90% as requested for A2 learners
  const [voice, setVoice] = useState<VoiceName>('Kore'); // Warm teacher voice
  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(true);

  // Vocabulary Modal state
  const [selectedVocab, setSelectedVocab] = useState<VocabularyItem | null>(null);
  const [isVocabModalOpen, setIsVocabModalOpen] = useState<boolean>(false);

  // Practice Modal state
  const [practiceParagraph, setPracticeParagraph] = useState<StoryParagraph | null>(null);
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState<boolean>(false);

  // Calculate unique vocabulary count
  const uniqueVocabCount = new Set(
    STORY_PARAGRAPHS.flatMap((p) => p.vocabulary?.map((v) => v.word.toLowerCase()) || [])
  ).size;

  const currentParagraph = STORY_PARAGRAPHS[currentParagraphId] || STORY_PARAGRAPHS[0];

  const handleSelectParagraph = (id: number, andPlay = false) => {
    setCurrentParagraphId(id);
    if (andPlay) {
      setIsPlaying(true);
    }
  };

  const handleOpenVocab = (item: VocabularyItem) => {
    setSelectedVocab(item);
    setIsVocabModalOpen(true);
  };

  const handleOpenPractice = (paragraph: StoryParagraph) => {
    setPracticeParagraph(paragraph);
    setIsPracticeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-900 flex flex-col">
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        vocabCount={uniqueVocabCount}
      />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1">
        {activeTab === 'story' && (
          <StoryView
            currentParagraphId={currentParagraphId}
            onSelectParagraph={handleSelectParagraph}
            isPlaying={isPlaying}
            onOpenVocab={handleOpenVocab}
            onOpenPractice={handleOpenPractice}
          />
        )}

        {activeTab === 'vocab' && (
          <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 pb-32">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Vocabulary Explorer</span>
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
                Essential A2 Words from the Story
              </h2>
              <p className="text-sm text-stone-600 max-w-md mx-auto mt-1">
                Explore key words with pronunciation and simple definitions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {STORY_PARAGRAPHS.flatMap((p) => p.vocabulary || [])
                .filter(
                  (v, idx, self) =>
                    idx === self.findIndex((t) => t.word.toLowerCase() === v.word.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.word}
                    onClick={() => handleOpenVocab(item)}
                    className="p-4 rounded-xl bg-white border border-stone-200/90 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="font-serif text-lg font-bold text-stone-900 capitalize group-hover:text-amber-800 transition-colors">
                          {item.word}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono">
                          {item.pos}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-amber-700 mb-2">{item.phonetic}</p>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {item.definition}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-amber-700 font-medium">
                      <span>View details & audio</span>
                      <Volume2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 pb-32">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                <Mic className="w-3.5 h-3.5" />
                <span>Speaking Studio</span>
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
                Listen & Shadow Dialogue Lines
              </h2>
              <p className="text-sm text-stone-600 max-w-md mx-auto mt-1">
                Select any character or narration line below to record yourself and compare with the teacher model!
              </p>
            </div>

            <div className="space-y-3">
              {STORY_PARAGRAPHS.filter((p) => p.type === 'dialogue' || p.id === 15 || p.id === 20).map(
                (p) => (
                  <div
                    key={p.id}
                    onClick={() => handleOpenPractice(p)}
                    className="p-4 rounded-xl bg-white border border-stone-200/90 hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-stone-900">{p.speaker}</span>
                          <span className="text-[11px] text-stone-500 font-medium italic">
                            ({p.speakerTone})
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-700 italic">"{p.text}"</p>
                      </div>
                    </div>

                    <button className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 shadow-xs">
                      Practice
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {activeTab === 'quiz' && <QuizView />}
      </main>

      {/* Floating Audio Player */}
      <AudioPlayer
        currentParagraph={currentParagraph}
        totalParagraphs={STORY_PARAGRAPHS.length}
        onParagraphChange={handleSelectParagraph}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        speed={speed}
        setSpeed={setSpeed}
        voice={voice}
        setVoice={setVoice}
        autoPlayNext={autoPlayNext}
        setAutoPlayNext={setAutoPlayNext}
      />

      {/* Modals */}
      <VocabularyModal
        isOpen={isVocabModalOpen}
        onClose={() => setIsVocabModalOpen(false)}
        selectedItem={selectedVocab}
        onSelectItem={(item) => setSelectedVocab(item)}
        voice={voice}
      />

      <PracticeModal
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        paragraph={practiceParagraph}
        voice={voice}
      />
    </div>
  );
}
