import { useEffect, useRef, useCallback } from 'react';
import { getVoices, VoiceProfile } from '../../config/voiceConfig';

interface PreloaderParams {
  lang: string;
  brandName: string;
  niche: string;
  clinicId?: string | null;
  getGreetingText: (voice: VoiceProfile) => string;
  enabled?: boolean;
  voiceType?: "guided" | "free";
}

export function useVoicePreloader({
  lang,
  brandName,
  niche,
  clinicId = null,
  getGreetingText,
  enabled = true,
  voiceType = "guided"
}: PreloaderParams) {
  // Cache of fully loaded Blob URLs by cache key (locale_voiceId)
  const preloadedUrls = useRef<Record<string, string>>({});
  
  // Track active controllers to allow abortion on unmount
  const abortControllers = useRef<Set<AbortController>>(new Set());

  // Function to safely revoke all URLs to avoid memory leaks
  const clearCache = useCallback(() => {
    Object.values(preloadedUrls.current).forEach((url) => {
       URL.revokeObjectURL(url);
    });
    preloadedUrls.current = {};
  }, []);

  useEffect(() => {
    if (!enabled || !brandName) return;

    let isMounted = true;
    const voicesToPreload = getVoices(lang);
    let activeRequests = 0;
    const maxConcurrent = 3;
    const pendingQueue = [...voicesToPreload];
    const currentAbortGroup = abortControllers.current;

    // Helper to process the queue with a concurrency limit
    const processQueue = () => {
      if (!isMounted) return;
      
      while (pendingQueue.length > 0 && activeRequests < maxConcurrent) {
        const voice = pendingQueue.shift();
        if (!voice) continue;

        const cacheKey = `${lang}_${voice.id}`;
        if (preloadedUrls.current[cacheKey]) continue; // Already cached

        activeRequests++;
        const controller = new AbortController();
        currentAbortGroup.add(controller);

        const text = getGreetingText(voice);
        let voiceProvider = "elevenlabs";
        try { voiceProvider = new URLSearchParams(window.location.search).get('voice') || "elevenlabs"; } catch {}

        fetch('/api/v1/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text, 
            provider: voiceProvider, 
            voiceType: voiceType, 
            elevenlabs_voice_id: voice.elevenLabsId, 
            gender: voice.gender, 
            niche: niche, 
            clinicId: clinicId, 
            locale: lang || 'es' 
          }),
          signal: controller.signal
        })
        .then(res => {
           if (!res.ok) throw new Error("API Error");
           return res.blob();
        })
        .then(blob => {
           if (isMounted) {
              const url = URL.createObjectURL(blob);
              preloadedUrls.current[cacheKey] = url;
           }
        })
        .catch(err => {
           if (err.name !== 'AbortError') console.error("Voice preload failed for", voice.id, err);
        })
        .finally(() => {
           currentAbortGroup.delete(controller);
           activeRequests--;
           if (isMounted) processQueue();
        });
      }
    };

    processQueue();

    return () => {
      isMounted = false;
      // Abort any ongoing fetches
      currentAbortGroup.forEach(ctrl => ctrl.abort());
      currentAbortGroup.clear();
      
      // Memory cleanup for object URLs
      clearCache();
    };
  }, [lang, brandName, niche, clinicId, enabled, getGreetingText, voiceType, clearCache]);

  const getPreloadedUrl = useCallback((voiceId: string) => {
    const key = `${lang}_${voiceId}`;
    return preloadedUrls.current[key] || null;
  }, [lang]);

  return { getPreloadedUrl };
}
