import type { Metadata } from "next";
import { AIAssistantWidget } from "@/presentation/components/AIAssistantWidget";
import { AIAssistantChat } from "@/presentation/components/AIAssistantChat";
import { LeadGenBanner } from "@/presentation/components/LeadGenBanner";
import { AIAssistantVoice } from "@/presentation/components/AIAssistantVoice";
import { InjectorDashboard } from "@/presentation/components/InjectorDashboard";

export const metadata: Metadata = {
  title: "B2B Widget Injector Demo",
  description: "Growth Hacking Injector MVP",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ site?: string; widget?: string; color?: string; niche?: string; pos?: string }>;
}) {
  const params = await searchParams;
  const siteUrl = params.site;
  const widgetType = params.widget || "form";
  const niche = params.niche || "medical";
  const pos = params.pos || "right";
  const brandColor = params.color ? `#${params.color}` : "#FFD700";

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
          {widgetType === "chat" && <AIAssistantChat color={brandColor} niche={niche} pos={pos} />}
          {widgetType === "banner" && <LeadGenBanner color={brandColor} pos={pos} />}
          {widgetType === "voice" && <AIAssistantVoice color={brandColor} niche={niche} pos={pos} />}
          {widgetType === "both" && (
            <>
              <AIAssistantWidget color={brandColor} niche={niche} pos={pos} />
              <AIAssistantVoice color={brandColor} niche={niche} pos={pos} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
