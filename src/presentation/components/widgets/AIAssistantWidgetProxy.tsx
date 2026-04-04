"use client";

import { AIAssistantWidgetCapilar } from './niches/capilar/AIAssistantWidgetCapilar';
import { AIAssistantWidgetDental } from './niches/dental/AIAssistantWidgetDental';

interface AIAssistantWidgetProxyProps {
  color: string;
  niche: string;
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
}

export function AIAssistantWidgetProxy({ color, niche, isOpen, setIsOpen }: AIAssistantWidgetProxyProps) {
  if (!isOpen) return null;

  // Route to the correct module based on the CRM / DB Niche
  switch (niche) {
    case "Clínica Dental":
      return <AIAssistantWidgetDental color={color} isOpen={isOpen} setIsOpen={setIsOpen} />;
    case "Clínica Capilar":
    case "Triaje Capilar":
      return <AIAssistantWidgetCapilar color={color} isOpen={isOpen} setIsOpen={setIsOpen} />;
    default:
      // Default fallback (we can build a Generic Widget later)
      return <AIAssistantWidgetCapilar color={color} isOpen={isOpen} setIsOpen={setIsOpen} />;
  }
}
