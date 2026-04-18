"use client";

import { AIAssistantWidgetCapilar } from './niches/capilar/AIAssistantWidgetCapilar';
import { AIAssistantWidgetDental } from './niches/dental/AIAssistantWidgetDental';
import { AIAssistantWidgetAesthetic } from './niches/aesthetic/AIAssistantWidgetAesthetic';

interface AIAssistantWidgetProxyProps {
  color: string;
  niche: string;
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
  lang?: string;
}

export function AIAssistantWidgetProxy({ color, niche, isOpen, setIsOpen, lang }: AIAssistantWidgetProxyProps) {
  console.log("=== DEBUG [Proxy.tsx] ===");
  console.log("niche string received:", niche);
  console.log("===========================");

  if (!isOpen) return null;

  // Normalize the niche string for flexible matching
  const normalizedNiche = (niche || "").toLowerCase();

  if (normalizedNiche.includes("dental") || normalizedNiche.includes("dentist") || normalizedNiche.includes("odont")) {
    return <AIAssistantWidgetDental color={color} isOpen={isOpen} setIsOpen={setIsOpen} lang={lang} />;
  }

  if (normalizedNiche.includes("aesthetic") || normalizedNiche.includes("estetica") || normalizedNiche.includes("estética")) {
    return <AIAssistantWidgetAesthetic color={color} isOpen={isOpen} setIsOpen={setIsOpen} lang={lang} />;
  }
  
  // Default to Capilar for hair transplant or unknown niches
  return <AIAssistantWidgetCapilar color={color} isOpen={isOpen} setIsOpen={setIsOpen} lang={lang} />;
}
