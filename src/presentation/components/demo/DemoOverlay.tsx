"use client";

import { useState, useEffect } from "react";
import { TopPillNavigation } from "./TopPillNavigation";
import { VideoPitchModal } from "./VideoPitchModal";
import { AIAssistantVoice } from "../AIAssistantVoice";
import { AIAssistantChat } from "../AIAssistantChat";
import { AIAssistantVoiceFree } from "../AIAssistantVoiceFree";
import { AIAssistantPhone } from "../AIAssistantPhone";
import { DemoSelectorHub } from "./DemoSelectorHub";
import { AIAssistantWidgetProxy } from "../widgets/AIAssistantWidgetProxy";
import { ProductTour } from "./ProductTour";

interface DemoOverlayProps {
  clinicUrl: string;
  themeColor?: string;
  useImageMode?: boolean;
  videoPitchUrl?: string;
  niche?: string;
  lang?: string;
  widgetPosition?: string;
}

export function DemoOverlay({ clinicUrl, themeColor = "#1a4b8c", useImageMode = false, videoPitchUrl, niche, lang = "es", widgetPosition = "right" }: DemoOverlayProps) {
  console.log("=== DEBUG [DemoOverlay.tsx] ===");
  console.log("niche string received:", niche);
  console.log("===============================");
  
  const [activeMode, setActiveMode] = useState<"hub" | "triage" | "text" | "voice" | "voice-free" | "phone">("hub");
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      if (typeof window !== 'undefined' && clinicUrl) {
         localStorage.setItem('onboarding_site_url', clinicUrl);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [clinicUrl]);

  const handleModeChange = (mode: "hub" | "triage" | "text" | "voice" | "voice-free" | "phone") => {
    setActiveMode(mode);
  };


  const screenshotApiUrl = `https://api.microlink.io/?url=${encodeURIComponent(clinicUrl)}&screenshot=true&meta=false&embed=screenshot.url`;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-50">
      
      {/* 1. Top Navigation Controller */}
      <TopPillNavigation 
        activeMode={activeMode} 
        onModeChange={handleModeChange} 
        onOpenPitch={() => setIsPitchOpen(true)}
        primaryColor={themeColor}
        hasVideo={!!videoPitchUrl}
        lang={lang}
      />

      {/* 2. Video Pitch Modal */}
      <VideoPitchModal 
        isOpen={isPitchOpen} 
        onClose={() => setIsPitchOpen(false)} 
        videoUrl={videoPitchUrl}
      />

      {/* 2.5. Product Tour (Only show when hub is active so elements exist) */}
      {mounted && activeMode === "hub" && (
        <ProductTour primaryColor={themeColor} lang={lang} />
      )}

      {/* 3. The Full Screen Target Website (Plan B o Iframe) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        {useImageMode && !useIframeFallback ? (
           <>
             {/* Loading State underneath the image */}
             <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full z-0 bg-gray-50">
                <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-gray-800 animate-spin mb-4" />
                <p className="text-gray-500 font-bold animate-pulse text-sm uppercase tracking-widest">Generando Fondo (10-20s)...</p>
             </div>
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
               src={screenshotApiUrl}
               alt="Clinic Background"
               className={`relative z-10 w-full h-full object-cover object-top transition-opacity duration-1000 ${isLoaded ? 'opacity-90' : 'opacity-0'}`}
               onLoad={() => setIsLoaded(true)}
               onError={(e) => {
                 if (!e.currentTarget.src.includes('thum.io')) {
                   e.currentTarget.src = `https://image.thum.io/get/width/1200/crop/1000/noanimate/${clinicUrl}`;
                 } else {
                   setUseIframeFallback(true);
                 }
               }}
             />
           </>
        ) : (
           <iframe 
             src={clinicUrl} 
             className="w-full h-full border-none relative z-10"
             title="Clinic Website Demo"
           />
        )}
      </div>

      {/* 4. Dynamic Widget Rendering - Only active mode is mounted */}
      <div className="absolute z-50 pointer-events-none w-full h-full">
        
        {/* Real Conditional Rendering to prevent memory leaks and unnecessary API calls */}
        {mounted && (
          <div className="pointer-events-auto h-full w-full opacity-100 transition-opacity duration-300">
            {activeMode === "hub" && <DemoSelectorHub color={themeColor} niche={niche || "Clínica Capilar"} lang={lang} onSelect={handleModeChange} />}
            {activeMode === "triage" && <AIAssistantWidgetProxy color={themeColor} niche={niche || "Clínica Capilar"} lang={lang} isOpen={true} setIsOpen={(b: boolean) => { if (!b) setActiveMode("hub"); }} />}
            
            {/* Dynamic niche resolver logic for text & voice components */}
            {(() => {
                const normalized = (niche || "capilar").toLowerCase();
                const isDental = normalized.includes("dental") || normalized.includes("dentist") || normalized.includes("odont");
                const isAesthetic = normalized.includes("aesthetic") || normalized.includes("estetica") || normalized.includes("estética");
                const mappedNiche = isDental ? "dental" : isAesthetic ? "aesthetic" : "hair_transplant";
                return (
                 <>
                   {activeMode === "text" && <AIAssistantChat color={themeColor} pos={widgetPosition} niche={mappedNiche} lang={lang} />}
                   {activeMode === "voice" && <AIAssistantVoice color={themeColor} pos={widgetPosition} niche={mappedNiche} lang={lang} />}
                   {activeMode === "voice-free" && <AIAssistantVoiceFree color={themeColor} pos={widgetPosition} niche={mappedNiche} lang={lang} />}
                   {activeMode === "phone" && <AIAssistantPhone color={themeColor} pos={widgetPosition} niche={mappedNiche} lang={lang} />}
                 </>
               );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
