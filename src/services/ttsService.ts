import { STORY_PARAGRAPHS, StoryParagraph } from '../data/storyData';

export type VoiceName = 'Kore' | 'Zephyr' | 'Puck' | 'Fenrir' | 'Charon';

interface AudioCacheEntry {
  url: string;
  blob: Blob;
  duration?: number;
}

const clientAudioCache = new Map<string, AudioCacheEntry>();

export async function checkServerTtsStatus(): Promise<{ hasApiKey: boolean; ttsModel: string }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    console.warn('TTS health check error:', err);
    return { hasApiKey: false, ttsModel: 'gemini-3.8-flash-tts' };
  }
}

/**
 * Fetch or retrieve cached Gemini 3.8 Flash TTS audio for a specific paragraph
 */
export async function getParagraphAudio(
  paragraph: StoryParagraph,
  voice: VoiceName = 'Kore'
): Promise<{ url: string; isFallback: boolean }> {
  const cacheKey = `p_${paragraph.id}_${voice}`;
  if (clientAudioCache.has(cacheKey)) {
    return { url: clientAudioCache.get(cacheKey)!.url, isFallback: false };
  }

  try {
    const res = await fetch('/api/tts/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: paragraph.text,
        voice,
        style: paragraph.stylePrompt,
        cacheKey,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${res.status}`);
    }

    const data = await res.json();
    if (!data.audioBase64) {
      throw new Error('No audioBase64 in response');
    }

    // Convert base64 WAV to Blob
    const binary = atob(data.audioBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
    const url = URL.createObjectURL(blob);

    clientAudioCache.set(cacheKey, { url, blob });
    return { url, isFallback: false };
  } catch (err) {
    console.warn(`Falling back to browser speech synthesis for paragraph ${paragraph.id}:`, err);
    return { url: '', isFallback: true };
  }
}

/**
 * Generate full story audio using Gemini 3.8 Flash TTS
 */
export async function getFullStoryAudio(
  voice: VoiceName = 'Kore'
): Promise<{ url: string; isFallback: boolean }> {
  const cacheKey = `full_story_${voice}`;
  if (clientAudioCache.has(cacheKey)) {
    return { url: clientAudioCache.get(cacheKey)!.url, isFallback: false };
  }

  const fullText = STORY_PARAGRAPHS.map((p) => p.text).join('\n\n');
  const fullStoryStyle =
    'Read the story aloud as a warm, friendly English teacher narrating for language learners (A2 level). ' +
    'Speak clearly and slowly, at about 85-90% of normal speed, so learners can follow every word. ' +
    'Use a calm, gentle, storytelling tone. Pronounce each word distinctly, especially the vocabulary words. ' +
    'Pause for about one second between paragraphs, and briefly at commas and full stops. ' +
    'For dialogue, change tone slightly: Ali (polite, young-sounding), Teacher (calm and encouraging), ' +
    'Old man (kind, warm, slightly slow), Mother (soft and loving). ' +
    'When Ali is afraid during the dog scene, sound a little nervous. When he feels happy, sound cheerful. ' +
    'Read the title as a heading, then pause for two seconds. Do not add extra comments or sound effects.';

  try {
    const res = await fetch('/api/tts/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: fullText,
        voice,
        style: fullStoryStyle,
        cacheKey,
      }),
    });

    if (!res.ok) {
      throw new Error(`TTS server responded with ${res.status}`);
    }

    const data = await res.json();
    if (!data.audioBase64) {
      throw new Error('No audio returned');
    }

    const binary = atob(data.audioBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
    const url = URL.createObjectURL(blob);

    clientAudioCache.set(cacheKey, { url, blob });
    return { url, isFallback: false };
  } catch (err) {
    console.warn('Full story TTS generation fallback:', err);
    return { url: '', isFallback: true };
  }
}

/**
 * Web Speech API fallback reader
 */
export function playWebSpeech(
  text: string,
  rate = 0.85,
  onEnd?: () => void
): () => void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) onEnd();
    return () => {};
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.05;
  utterance.lang = 'en-US';

  // Select a natural English voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      (v.name.includes('Natural') ||
        v.name.includes('Google') ||
        v.name.includes('Samantha') ||
        v.name.includes('Daniel'))
  );
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}
