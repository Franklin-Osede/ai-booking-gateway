"use client";

import { PlayCircle, Calendar } from "lucide-react";

function getContrastColor(hexcolor: string) {
  if (!hexcolor || hexcolor.length < 6) return '#ffffff';
  if (hexcolor.length === 4) {
    hexcolor = '#' + hexcolor[1]+hexcolor[1] + hexcolor[2]+hexcolor[2] + hexcolor[3]+hexcolor[3];
  }
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#111827' : '#ffffff';
}

interface TopPillNavigationProps {
  onOpenPitch: () => void;
  activeMode: "hub" | "triage" | "text" | "voice" | "voice-free" | "phone";
  onModeChange: (mode: "hub" | "triage" | "text" | "voice" | "voice-free" | "phone") => void;
  primaryColor?: string;
}

export function TopPillNavigation({ onOpenPitch, onModeChange, primaryColor = "#1a4b8c" }: TopPillNavigationProps) {
  const contrastColor = getContrastColor(primaryColor);

  return (
    <div className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-9000 flex items-center bg-white/85 backdrop-blur-xl border border-gray-100 p-1.5 sm:p-2 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-1 ring-black/5`}>
      <button
        id="tour-asistentes-nav"
        onClick={() => onModeChange("hub")}
        className="flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-colors text-gray-800 hover:bg-gray-100"
      >
        <span className="w-2 h-2 rounded-full animate-pulse mr-1" style={{ backgroundColor: primaryColor }} /> Asistentes
      </button>
      <div className="w-px h-6 bg-gray-200 mx-1"></div>

      <button 
        id="tour-video-intro"
        onClick={onOpenPitch}
        className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 px-3 py-2 sm:py-2.5 rounded-full text-xs font-medium transition-colors hover:bg-gray-100"
      >
        <PlayCircle size={16} /> <span className="hidden sm:inline">Vídeo Intro</span>
      </button>

      <button 
        id="tour-agendar"
        onClick={() => window.open("https://calendly.com/agentminds", "_blank")}
        className="flex items-center gap-1.5 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all shadow-md hover:scale-105 active:scale-95 ml-2"
        style={{ backgroundColor: primaryColor, color: contrastColor }}
      >
        <Calendar size={16} /> Agendar
      </button>
    </div>
  );
}
