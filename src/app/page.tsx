import type { Metadata } from "next";
import { AIAssistantWidget } from "@/presentation/components/AIAssistantWidget";
import { AIAssistantChat } from "@/presentation/components/AIAssistantChat";
import { LeadGenBanner } from "@/presentation/components/LeadGenBanner";
import { AIAssistantVoice } from "@/presentation/components/AIAssistantVoice";
import { AIAssistantVoiceFree } from "@/presentation/components/AIAssistantVoiceFree";
import { AIAssistantPhone } from "@/presentation/components/AIAssistantPhone";
import { InjectorDashboard } from "@/presentation/components/InjectorDashboard";
import { AIAssistantWidgetProxy } from "@/presentation/components/widgets/AIAssistantWidgetProxy";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Soluciones Automatizadas",
  description: "Growth Hacking Injector MVP",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ site?: string; widget?: string; color?: string; niche?: string; pos?: string; c?: string; lang?: string }>;
}) {
  const params = await searchParams;
  let siteUrl = params.site;
  const widgetType = params.widget || "form";
  let niche = params.niche || "default";
  let brandColor = params.color ? `#${params.color}` : "#FFD700";
  const lang = params.lang || "es-ES";
  const pos = "left";

  const clinicId = params.c;

  if (clinicId) {
    try {
      const clinic = await prisma.clinic.findUnique({
        where: { id: clinicId },
        include: { websites: true, brandings: true }
      });
      if (clinic) {
        siteUrl = clinic.websites?.[0]?.url || siteUrl;
        brandColor = clinic.brandings?.[0]?.primaryColor || brandColor;
        niche = clinic.industry?.toLowerCase().includes("capilar") ? "hair_transplant" : "default";
      }
    } catch (e) {
      console.error("Failed to fetch clinic by ID", e);
    }
  }

  const brandColorMatch = brandColor?.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/);
  if (brandColorMatch) brandColor = brandColorMatch[0];

  if (!siteUrl) {
    return <InjectorDashboard />;
  }

  const proxyUrl = `/api/v1/proxy?url=${encodeURIComponent(siteUrl)}`;

  return (
    <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-white">
      {/* Background: Target Website */}
      <iframe
        src={proxyUrl}
        className="w-full h-full border-0 absolute inset-0 bg-white"
        title="Client Website"
      />

      {/* Foreground: Injected Widget Layers */}
      <div 
        className="absolute inset-0 pointer-events-none z-99999"
        style={{ "--brand-color": brandColor } as React.CSSProperties}
      >
        <div className="h-full w-full relative *:pointer-events-auto">
          {widgetType === "form" && <AIAssistantWidget color={brandColor} niche={niche} pos={pos} />}
          {widgetType === "capilar" && <AIAssistantWidgetProxy color={brandColor} niche={niche === "hair_transplant" ? "Clínica Capilar" : niche} isOpen={true} setIsOpen={() => {}} />}
          {widgetType === "chat" && <AIAssistantChat color={brandColor} niche={niche} pos={pos} lang={lang} />}
          {widgetType === "banner" && <LeadGenBanner color={brandColor} pos={pos} />}
          {widgetType === "voice" && <AIAssistantVoice color={brandColor} niche={niche} pos="right" lang={lang} />}
          {widgetType === "voice-free" && <AIAssistantVoiceFree color={brandColor} niche={niche} pos="right" lang={lang} />}
          {widgetType === "dual-voice" && (
            <>
              <AIAssistantVoiceFree color={brandColor} niche={niche} pos="left" lang={lang} />
              <AIAssistantVoice color={brandColor} niche={niche} pos="right" lang={lang} />
            </>
          )}
          {widgetType === "phone" && <AIAssistantPhone color={brandColor} niche={niche} pos={pos} lang={lang} />}
          {widgetType === "both" && (
            <>
              <AIAssistantWidget color={brandColor} niche={niche} pos="left" />
              <AIAssistantVoice color={brandColor} niche={niche} pos="right" lang={lang} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
