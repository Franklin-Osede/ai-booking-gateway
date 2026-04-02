"use client";

import { PlayCircle, Phone, Calendar, Stethoscope, MessageCircle, Mic } from "lucide-react";

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
  activeMode: "triage" | "text" | "voice" | "phone";
  onModeChange: (mode: "triage" | "text" | "voice" | "phone") => void;
  primaryColor?: string;
}

export function TopPillNavigation({ onOpenPitch, activeMode, onModeChange, primaryColor = "#1a4b8c" }: TopPillNavigationProps) {
  const contrastColor = getContrastColor(primaryColor);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-9000 flex items-center bg-black/40 backdrop-blur-md rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/20 p-1.5 transition-all">
      <button 
        onClick={onOpenPitch}
        className="flex items-center gap-1.5 text-white/90 hover:text-white px-3 py-2 sm:py-2.5 rounded-full text-xs font-medium transition-colors hover:bg-white/10"
      >
        <PlayCircle size={16} /> <span className="hidden sm:inline">Vídeo Demo</span>
      </button>

      <div className="w-px h-6 bg-white/20 mx-1"></div>

      <button
        onClick={() => onModeChange("triage")}
        className={`flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-full text-xs font-semibold transition-colors ${activeMode === 'triage' ? 'bg-white text-gray-900 shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
      >
        <Stethoscope size={16} /> <span className="hidden sm:inline">Triaje Médico</span>
      </button>

      <button
        onClick={() => onModeChange("voice")}
        className={`flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-full text-xs font-semibold transition-colors ${activeMode === 'voice' ? 'bg-white text-gray-900 shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
      >
        <Mic size={16} /> <span className="hidden sm:inline">Voz (Widget)</span>
      </button>

      <button
        onClick={() => onModeChange("phone")}
        className={`flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-full text-xs font-semibold transition-colors ${activeMode === 'phone' ? 'bg-white text-gray-900 shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
      >
        <Phone size={16} /> <span className="hidden sm:inline">Voz (Llamada)</span>
      </button>
      
      <button
        onClick={() => onModeChange("text")}
        className={`flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-full text-xs font-semibold transition-colors ${activeMode === 'text' ? 'bg-white text-gray-900 shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
      >
        <MessageCircle size={16} /> <span className="hidden sm:inline">Chat Texto</span>
      </button>

      <div className="w-px h-6 bg-white/20 mx-1"></div>

      <button 
        className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all shadow-md hover:scale-105 active:scale-95 ml-1"
        style={{ backgroundColor: primaryColor, color: contrastColor }}
      >
        <Calendar size={16} /> Agendar
      </button>
    </div>
  );
}
