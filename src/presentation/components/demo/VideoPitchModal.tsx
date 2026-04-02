"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string; // YouTube embed URL
}

export function VideoPitchModal({ isOpen, onClose, videoUrl }: VideoPitchModalProps) {
  // Extrae el ID inteligente, o usa un vídeo genérico por defecto
  let finalUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
  if (videoUrl) {
    const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/);
    const videoId = match ? match[1] : (videoUrl.length === 11 ? videoUrl : "dQw4w9WgXcQ");
    finalUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl relative border border-white/10 aspect-video ring-1 ring-white/5"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white/70 hover:text-white transition-colors backdrop-blur-md"
            >
              <X size={20} />
            </button>
            
            <iframe 
              src={`${finalUrl}?autoplay=1&rel=0`} 
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
