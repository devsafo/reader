import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles,
  Loader2,
  Sliders,
  Check,
} from 'lucide-react';
import { StoryParagraph } from '../data/storyData';
import { getParagraphAudio, playWebSpeech, VoiceName } from '../services/ttsService';

interface AudioPlayerProps {
  currentParagraph: StoryParagraph;
  totalParagraphs: number;
  onParagraphChange: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  voice: VoiceName;
  setVoice: (voice: VoiceName) => void;
  autoPlayNext: boolean;
  setAutoPlayNext: (val: boolean) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentParagraph,
  totalParagraphs,
  onParagraphChange,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  voice,
  setVoice,
  autoPlayNext,
  setAutoPlayNext,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cancelWebSpeechRef = useRef<(() => void) | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [isUsingGemini, setIsUsingGemini] = useState(true);

  // Load and play audio whenever currentParagraph or voice changes (if playing)
  useEffect(() => {
    let isCancelled = false;

    // Stop existing playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (cancelWebSpeechRef.current) {
      cancelWebSpeechRef.current();
      cancelWebSpeechRef.current = null;
    }

    if (!isPlaying) {
      setIsLoading(false);
      return;
    }

    const loadAndPlay = async () => {
      setIsLoading(true);
      try {
        const { url, isFallback } = await getParagraphAudio(currentParagraph, voice);
        if (isCancelled) return;

        if (isFallback || !url) {
          setIsUsingGemini(false);
          setIsLoading(false);
          // Fall back to Web Speech API
          cancelWebSpeechRef.current = playWebSpeech(
            currentParagraph.text,
            speed,
            () => {
              if (autoPlayNext && currentParagraph.id < totalParagraphs - 1) {
                setTimeout(() => {
                  onParagraphChange(currentParagraph.id + 1);
                }, 1000); // 1s pause between paragraphs
              } else {
                setIsPlaying(false);
              }
            }
          );
        } else {
          setIsUsingGemini(true);
          if (!audioRef.current) {
            audioRef.current = new Audio();
          }
          const audio = audioRef.current;
          audio.src = url;
          audio.playbackRate = speed;
          audio.volume = isMuted ? 0 : volume;

          audio.onloadedmetadata = () => {
            if (!isCancelled) {
              setDuration(audio.duration);
              setIsLoading(false);
            }
          };

          audio.ontimeupdate = () => {
            if (!isCancelled) {
              setCurrentTime(audio.currentTime);
            }
          };

          audio.onended = () => {
            if (!isCancelled) {
              if (autoPlayNext && currentParagraph.id < totalParagraphs - 1) {
                // 1 second pause between paragraphs as requested in prompt instructions
                setTimeout(() => {
                  onParagraphChange(currentParagraph.id + 1);
                }, 1000);
              } else {
                setIsPlaying(false);
              }
            }
          };

          audio.onerror = () => {
            console.warn('Audio element error, using Web Speech fallback');
            setIsUsingGemini(false);
            setIsLoading(false);
            cancelWebSpeechRef.current = playWebSpeech(
              currentParagraph.text,
              speed,
              () => {
                if (autoPlayNext && currentParagraph.id < totalParagraphs - 1) {
                  setTimeout(() => {
                    onParagraphChange(currentParagraph.id + 1);
                  }, 1000);
                } else {
                  setIsPlaying(false);
                }
              }
            );
          };

          await audio.play();
        }
      } catch (err) {
        console.error('Playback error:', err);
        if (!isCancelled) {
          setIsLoading(false);
          setIsUsingGemini(false);
          cancelWebSpeechRef.current = playWebSpeech(
            currentParagraph.text,
            speed,
            () => {
              if (autoPlayNext && currentParagraph.id < totalParagraphs - 1) {
                setTimeout(() => {
                  onParagraphChange(currentParagraph.id + 1);
                }, 1000);
              } else {
                setIsPlaying(false);
              }
            }
          );
        }
      }
    };

    loadAndPlay();

    return () => {
      isCancelled = true;
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (cancelWebSpeechRef.current) {
        cancelWebSpeechRef.current();
      }
    };
  }, [currentParagraph.id, voice, isPlaying]);

  // Adjust playback speed on the fly
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  // Adjust volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentParagraph.id > 0) {
      onParagraphChange(currentParagraph.id - 1);
    }
  };

  const handleNext = () => {
    if (currentParagraph.id < totalParagraphs - 1) {
      onParagraphChange(currentParagraph.id + 1);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const voicesList: { id: VoiceName; label: string; desc: string }[] = [
    { id: 'Kore', label: 'Teacher Kore', desc: 'Warm, calm & soothing (Recommended)' },
    { id: 'Zephyr', label: 'Teacher Zephyr', desc: 'Clear, gentle & encouraging' },
    { id: 'Puck', label: 'Teacher Puck', desc: 'Friendly, clear male narrator' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 text-stone-100 backdrop-blur-lg border-t border-stone-800 shadow-2xl px-4 py-3 sm:py-3.5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Current Paragraph info & Speaker Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-amber-600/30 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xs">
              {currentParagraph.id === 0 ? 'Title' : `#${currentParagraph.id}`}
            </span>
            <div className="max-w-[200px] sm:max-w-[280px]">
              <div className="flex items-center gap-1.5 text-xs text-stone-300">
                <span className="font-semibold text-amber-300">{currentParagraph.speaker}</span>
                <span className="text-stone-500">•</span>
                <span className="truncate text-stone-400">{currentParagraph.speakerTone}</span>
              </div>
              <p className="text-xs text-stone-400 truncate">
                {currentParagraph.text.slice(0, 45)}...
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:hidden">
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">
              {currentParagraph.id + 1} / {totalParagraphs}
            </span>
          </div>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Prev button */}
            <button
              onClick={handlePrev}
              disabled={currentParagraph.id === 0}
              className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              title="Previous paragraph"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Replay paragraph */}
            <button
              onClick={handleReplay}
              className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
              title="Replay this sentence"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Main Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-600/30 hover:scale-105 active:scale-95 transition-all"
              title={isPlaying ? 'Pause' : 'Play narration'}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              )}
            </button>

            {/* Next button */}
            <button
              onClick={handleNext}
              disabled={currentParagraph.id >= totalParagraphs - 1}
              className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              title="Next paragraph"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Time & Engine Indicator */}
          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
            <span className="text-stone-600">•</span>
            <span className="inline-flex items-center gap-1 text-amber-400/90">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {isUsingGemini ? 'Gemini 3.8 Flash TTS' : 'Audio Reader'}
            </span>
          </div>
        </div>

        {/* Right: Settings (Speed, Voice, Continuous, Volume) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Continuous toggle */}
          <button
            onClick={() => setAutoPlayNext(!autoPlayNext)}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
              autoPlayNext
                ? 'bg-amber-600/30 border-amber-500/60 text-amber-300'
                : 'bg-stone-800 border-stone-700 text-stone-400'
            }`}
            title="Auto-play the entire story with 1-second pause between paragraphs"
          >
            {autoPlayNext ? 'Auto-Flow ON' : 'Single Seg'}
          </button>

          {/* Speed selector */}
          <div className="flex items-center bg-stone-800 rounded-md p-0.5 border border-stone-700 text-xs">
            {[0.75, 0.85, 1.0].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  speed === s
                    ? 'bg-amber-600 text-white font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
                title={`${s}x speed${s === 0.85 ? ' (Recommended for A2 learners)' : ''}`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Voice selector dropdown button */}
          <div className="relative">
            <button
              onClick={() => setShowVoiceMenu(!showVoiceMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-stone-800 border border-stone-700 text-stone-200 hover:bg-stone-700 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{voice}</span>
            </button>

            {showVoiceMenu && (
              <div className="absolute right-0 bottom-full mb-2 w-64 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl p-2 z-50 text-xs">
                <div className="px-2 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  Teacher Voice Persona
                </div>
                {voicesList.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setVoice(v.id);
                      setShowVoiceMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      voice === v.id
                        ? 'bg-amber-600/30 text-amber-300 font-medium'
                        : 'text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-stone-200">{v.label}</div>
                      <div className="text-[10px] text-stone-400">{v.desc}</div>
                    </div>
                    {voice === v.id && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-md text-stone-400 hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
