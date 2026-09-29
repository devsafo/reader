import React, { useState, useRef } from 'react';
import {
  X,
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { StoryParagraph } from '../data/storyData';
import { getParagraphAudio, VoiceName } from '../services/ttsService';

interface PracticeModalProps {
  paragraph: StoryParagraph | null;
  isOpen: boolean;
  onClose: () => void;
  voice: VoiceName;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  paragraph,
  isOpen,
  onClose,
  voice,
}) => {
  if (!isOpen || !paragraph) return null;

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [isPlayingTeacher, setIsPlayingTeacher] = useState(false);
  const [isTeacherLoading, setIsTeacherLoading] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);
  const teacherAudioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayTeacher = async () => {
    if (isPlayingTeacher) {
      if (teacherAudioRef.current) teacherAudioRef.current.pause();
      setIsPlayingTeacher(false);
      return;
    }

    setIsTeacherLoading(true);
    try {
      const { url } = await getParagraphAudio(paragraph, voice);
      setIsTeacherLoading(false);
      if (url) {
        if (!teacherAudioRef.current) {
          teacherAudioRef.current = new Audio(url);
        } else {
          teacherAudioRef.current.src = url;
        }
        teacherAudioRef.current.playbackRate = 0.85;
        teacherAudioRef.current.onended = () => setIsPlayingTeacher(false);
        teacherAudioRef.current.onerror = () => setIsPlayingTeacher(false);
        setIsPlayingTeacher(true);
        await teacherAudioRef.current.play();
      }
    } catch {
      setIsTeacherLoading(false);
      setIsPlayingTeacher(false);
    }
  };

  const startRecording = async () => {
    setRecordError(null);
    recordedChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setRecordError('Could not access microphone. Please allow microphone permissions in your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePlayUserAudio = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingRecorded) {
      if (userAudioRef.current) userAudioRef.current.pause();
      setIsPlayingRecorded(false);
      return;
    }

    if (!userAudioRef.current) {
      userAudioRef.current = new Audio(recordedAudioUrl);
    } else {
      userAudioRef.current.src = recordedAudioUrl;
    }
    userAudioRef.current.onended = () => setIsPlayingRecorded(false);
    userAudioRef.current.onerror = () => setIsPlayingRecorded(false);
    setIsPlayingRecorded(true);
    userAudioRef.current.play();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-amber-200/90 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-amber-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Pronunciation Shadowing & Practice
              </h2>
              <p className="text-xs text-stone-500">
                Listen to the teacher's model, then record yourself saying the lines
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

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Target Sentence */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
                Target Sentence ({paragraph.speaker}):
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 font-medium">
                {paragraph.speakerTone}
              </span>
            </div>
            <p className="font-serif text-lg text-stone-800 leading-relaxed italic">
              "{paragraph.text}"
            </p>
          </div>

          {/* Teacher Model Audio */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-stone-800">
                  Teacher Narration Model
                </div>
                <div className="text-[11px] text-stone-500">
                  Gemini 3.8 Flash TTS • 85-90% Learner Pace
                </div>
              </div>
            </div>

            <button
              onClick={handlePlayTeacher}
              disabled={isTeacherLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all ${
                isPlayingTeacher
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-stone-800 border border-stone-300 hover:bg-stone-100'
              }`}
            >
              {isTeacherLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              ) : isPlayingTeacher ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              <span>{isPlayingTeacher ? 'Pause' : 'Listen'}</span>
            </button>
          </div>

          {/* User Recording Section */}
          <div className="p-4 rounded-xl border border-stone-200 bg-white text-center space-y-3">
            <div className="text-xs font-semibold text-stone-600">
              {isRecording
                ? 'Recording... Speak clearly and slowly like the teacher!'
                : recordedAudioUrl
                ? 'Great job! Play back your voice to compare with the teacher.'
                : 'Click the microphone when ready to record yourself.'}
            </div>

            <div className="flex items-center justify-center gap-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-600/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Mic className="w-4 h-4" />
                  <span>{recordedAudioUrl ? 'Record Again' : 'Start Recording'}</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-black text-white font-semibold text-sm shadow-md animate-pulse"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop Recording</span>
                </button>
              )}

              {recordedAudioUrl && !isRecording && (
                <button
                  onClick={handlePlayUserAudio}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                    isPlayingRecorded
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-stone-100 text-stone-800 border-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {isPlayingRecorded ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                  <span>Play My Recording</span>
                </button>
              )}
            </div>

            {recordError && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{recordError}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
