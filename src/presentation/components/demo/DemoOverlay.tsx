"use client";

import { useState, useEffect } from "react";
import { TopPillNavigation } from "./TopPillNavigation";
import { VideoPitchModal } from "./VideoPitchModal";
import { AIAssistantWidgetCapilar } from "../AIAssistantWidgetCapilar";
import { AIAssistantVoice } from "../AIAssistantVoice";
import { AIAssistantChat } from "../AIAssistantChat";
import { AIAssistantVoiceFree } from "../AIAssistantVoiceFree";
import { AIAssistantPhone } from "../AIAssistantPhone";

interface DemoOverlayProps {
  clinicUrl: string;
  themeColor?: string;
  useImageMode?: boolean;
  videoPitchUrl?: string;
}

export function DemoOverlay({ clinicUrl, themeColor = "#1a4b8c", useImageMode = false, videoPitchUrl }: DemoOverlayProps) {
  const [activeMode, setActiveMode] = useState<"triage" | "text" | "voice" | "voice-free" | "phone">("voice");
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);



  const screenshotApiUrl = `https://api.microlink.io/?url=${encodeURIComponent(clinicUrl)}&screenshot=true&meta=false&embed=screenshot.url`;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-50">
      
      {/* 1. Top Navigation Controller */}
      <TopPillNavigation 
        activeMode={activeMode} 
        onModeChange={setActiveMode} 
        onOpenPitch={() => setIsPitchOpen(true)}
        primaryColor={themeColor}
      />

      {/* 2. Video Pitch Modal */}
      <VideoPitchModal 
        isOpen={isPitchOpen} 
        onClose={() => setIsPitchOpen(false)} 
        videoUrl={videoPitchUrl}
      />

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
                   // Fallback mágico gratuito anti-límites
                   e.currentTarget.src = `https://image.thum.io/get/width/1200/crop/1000/noanimate/${clinicUrl}`;
                 } else {
                   // Si fallan ambos, metemos por cojones el Iframe para que NO se quede cargando
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

      {/* 4. Dynamic Widget Rendering */}
      <div className="absolute z-50 pointer-events-auto">
        {activeMode === "triage" && (
          <AIAssistantWidgetCapilar color={themeColor} pos="right" />
        )}
        {activeMode === "text" && (
          <AIAssistantChat color={themeColor} pos="right" niche="hair_transplant" />
        )}
        {activeMode === "voice" && (
          <AIAssistantVoice color={themeColor} pos="right" niche="hair_transplant" />
        )}
        {activeMode === "voice-free" && (
          <AIAssistantVoiceFree color={themeColor} pos="right" niche="hair_transplant" />
        )}
        {activeMode === "phone" && (
          <AIAssistantPhone color={themeColor} pos="right" niche="hair_transplant" />
        )}
      </div>

    </div>
  );
}
