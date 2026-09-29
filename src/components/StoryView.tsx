import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  BookOpen,
  Mic,
  Sparkles,
  Info,
  ChevronRight,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import {
  StoryParagraph,
  StoryScene,
  STORY_PARAGRAPHS,
  STORY_SCENES,
  VocabularyItem,
} from '../data/storyData';

interface StoryViewProps {
  currentParagraphId: number;
  onSelectParagraph: (id: number, andPlay?: boolean) => void;
  isPlaying: boolean;
  onOpenVocab: (item: VocabularyItem) => void;
  onOpenPractice: (paragraph: StoryParagraph) => void;
}

export const StoryView: React.FC<StoryViewProps> = ({
  currentParagraphId,
  onSelectParagraph,
  isPlaying,
  onOpenVocab,
  onOpenPractice,
}) => {
  const paragraphRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [selectedSceneId, setSelectedSceneId] = useState<number>(1);
  const [activeVocabPopover, setActiveVocabPopover] = useState<{
    vocab: VocabularyItem;
    x: number;
    y: number;
  } | null>(null);

  // Auto-scroll active paragraph into view smoothly when it changes
  useEffect(() => {
    const el = paragraphRefs.current[currentParagraphId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Update active scene based on paragraph id
    const currentScene = STORY_SCENES.find(
      (s) => currentParagraphId >= s.paragraphRange[0] && currentParagraphId <= s.paragraphRange[1]
    );
    if (currentScene && currentScene.id !== selectedSceneId) {
      setSelectedSceneId(currentScene.id);
    }
  }, [currentParagraphId]);

  const activeScene =
    STORY_SCENES.find((s) => s.id === selectedSceneId) || STORY_SCENES[0];

  // Render text with clickable vocabulary
  const renderTextWithVocab = (text: string, vocabList?: VocabularyItem[]) => {
    if (!vocabList || vocabList.length === 0) {
      return <span>{text}</span>;
    }

    // Sort vocabulary by word length descending so longer words match first
    const sortedVocab = [...vocabList].sort((a, b) => b.word.length - a.word.length);

    // Build regex
    const regex = new RegExp(`\\b(${sortedVocab.map((v) => v.word).join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, index) => {
          const matchedItem = sortedVocab.find(
            (v) => v.word.toLowerCase() === part.toLowerCase()
          );

          if (matchedItem) {
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenVocab(matchedItem);
                }}
                className="inline-flex items-baseline px-1 py-0.5 mx-0.5 rounded bg-amber-100/90 text-amber-950 font-semibold border-b-2 border-amber-500 hover:bg-amber-200 transition-colors cursor-pointer group"
                title={`Click to see definition of "${matchedItem.word}"`}
              >
                <span>{part}</span>
                <span className="text-[10px] ml-0.5 text-amber-700 opacity-60 group-hover:opacity-100">
                  ⓘ
                </span>
              </button>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  };

  const getSpeakerStyle = (speaker: StoryParagraph['speaker'], tone: string) => {
    switch (speaker) {
      case 'Teacher':
        return {
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          border: 'border-l-emerald-500',
          label: 'Teacher',
          toneBadge: 'bg-emerald-50 text-emerald-700',
        };
      case 'Ali':
        if (tone.toLowerCase().includes('nervous') || tone.toLowerCase().includes('fear') || tone.toLowerCase().includes('afraid')) {
          return {
            badge: 'bg-rose-100 text-rose-800 border-rose-300',
            border: 'border-l-rose-500',
            label: 'Ali (Nervous)',
            toneBadge: 'bg-rose-50 text-rose-700',
          };
        }
        return {
          badge: 'bg-sky-100 text-sky-800 border-sky-300',
          border: 'border-l-sky-500',
          label: 'Ali',
          toneBadge: 'bg-sky-50 text-sky-700',
        };
      case 'Old Man':
        return {
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
          border: 'border-l-amber-600',
          label: 'Old Man',
          toneBadge: 'bg-amber-50 text-amber-800',
        };
      case 'Mother':
        return {
          badge: 'bg-purple-100 text-purple-900 border-purple-300',
          border: 'border-l-purple-500',
          label: "Ali's Mother",
          toneBadge: 'bg-purple-50 text-purple-800',
        };
      default:
        return {
          badge: 'bg-stone-100 text-stone-700 border-stone-300',
          border: 'border-l-stone-400',
          label: 'English Teacher Narration',
          toneBadge: 'bg-stone-50 text-stone-600',
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 pt-6 px-4 sm:px-6">
      {/* Scene Illustration Card */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border border-amber-200/80 bg-stone-900 text-white relative group">
        <div className="aspect-21/9 sm:aspect-16/7 w-full overflow-hidden relative">
          <img
            src={activeScene.image}
            alt={activeScene.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
        </div>

        <div className="p-4 sm:p-5 absolute bottom-0 left-0 right-0 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-500/40">
                Scene {activeScene.id} of 3
              </span>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
                {activeScene.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-200 max-w-xl leading-relaxed">
              {activeScene.caption}
            </p>
          </div>

          {/* Scene selector jump buttons */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-stone-900/80 p-1 rounded-xl backdrop-blur-md border border-stone-700">
            {STORY_SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => {
                  setSelectedSceneId(scene.id);
                  onSelectParagraph(scene.paragraphRange[0], false);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedSceneId === scene.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                Scene {scene.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Teacher Narration Guideline Banner */}
      <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-amber-950">
              Interactive Story Narration (A2 Pace • 85-90% Speed)
            </h3>
            <p className="text-xs text-amber-800">
              Click any sentence to listen. Underlined words have instant definitions. Practice repeating with the mic!
            </p>
          </div>
        </div>
        <button
          onClick={() => onSelectParagraph(0, true)}
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start From Beginning</span>
        </button>
      </div>

      {/* Story Paragraphs List */}
      <div className="space-y-4">
        {STORY_PARAGRAPHS.map((p) => {
          const isActive = currentParagraphId === p.id;
          const speakerInfo = getSpeakerStyle(p.speaker, p.speakerTone);

          if (p.type === 'title') {
            return (
              <div
                key={p.id}
                ref={(el) => { paragraphRefs.current[p.id] = el; }}
                onClick={() => onSelectParagraph(p.id, true)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer text-center relative group ${
                  isActive
                    ? 'bg-amber-100/90 border-amber-400 shadow-md ring-2 ring-amber-400/40'
                    : 'bg-white/80 border-amber-200/70 hover:bg-amber-50/60 shadow-xs'
                }`}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mb-2 border border-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Story Heading</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  {renderTextWithVocab(p.text, p.vocabulary)}
                </h1>
                <p className="text-xs text-stone-500 mt-2 italic">
                  Read aloud clearly with a 2-second pause before the first paragraph
                </p>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectParagraph(p.id, true);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      isActive && isPlaying
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    }`}
                  >
                    {isActive && isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Playing...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Listen to Title</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={p.id}
              ref={(el) => { paragraphRefs.current[p.id] = el; }}
              onClick={() => onSelectParagraph(p.id, true)}
              className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer relative group ${
                isActive
                  ? `bg-amber-50/95 border-amber-400 shadow-md ring-2 ring-amber-400/30 ${speakerInfo.border} border-l-4`
                  : `bg-white/90 border-stone-200/80 hover:bg-amber-50/40 hover:border-amber-300 shadow-2xs`
              }`}
            >
              {/* Header inside paragraph: Speaker & Tone metadata */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${speakerInfo.badge}`}
                  >
                    {speakerInfo.label}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${speakerInfo.toneBadge}`}
                  >
                    {p.speakerTone}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  {/* Practice speaking button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPractice(p);
                    }}
                    className="p-1.5 rounded-md text-stone-500 hover:text-amber-700 hover:bg-amber-100 transition-colors"
                    title="Practice speaking this sentence"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  {/* Play sentence button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectParagraph(p.id, true);
                    }}
                    className={`p-1.5 rounded-md transition-colors ${
                      isActive && isPlaying
                        ? 'bg-amber-600 text-white'
                        : 'text-stone-500 hover:text-amber-700 hover:bg-amber-100'
                    }`}
                    title="Listen to this paragraph"
                  >
                    {isActive && isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                  </button>
                </div>
              </div>

              {/* Story text */}
              <p
                className={`font-serif text-base sm:text-lg leading-relaxed text-stone-800 ${
                  p.type === 'dialogue' ? 'italic font-medium' : ''
                }`}
              >
                {renderTextWithVocab(p.text, p.vocabulary)}
              </p>

              {/* Inline Vocabulary Badges if present */}
              {p.vocabulary && p.vocabulary.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Key Vocabulary:
                  </span>
                  {p.vocabulary.map((vocab, vIdx) => (
                    <button
                      key={vIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenVocab(vocab);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-amber-100/80 text-amber-900 hover:bg-amber-200 border border-amber-200/80 transition-colors"
                    >
                      <span className="font-semibold">{vocab.word}</span>
                      <span className="text-[10px] text-stone-500">{vocab.phonetic}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
