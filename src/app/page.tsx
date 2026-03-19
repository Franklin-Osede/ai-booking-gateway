import type { Metadata } from "next";
import { AIAssistantWidget } from "@/presentation/components/AIAssistantWidget";
import { AIAssistantChat } from "@/presentation/components/AIAssistantChat";
import { LeadGenBanner } from "@/presentation/components/LeadGenBanner";
import { InjectorDashboard } from "@/presentation/components/InjectorDashboard";

export const metadata: Metadata = {
  title: "B2B Widget Injector Demo",
  description: "Growth Hacking Injector MVP",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ site?: string; widget?: string; color?: string; niche?: string }>;
}) {
  const params = await searchParams;
  const siteUrl = params.site;
  const widgetType = params.widget || "form";
  const niche = params.niche || "medical";
  const brandColor = params.color ? `#${params.color}` : "#FFD700";

  if (!siteUrl) {
    return <InjectorDashboard />;
  }

  const proxyUrl = `/api/proxy?url=${encodeURIComponent(siteUrl)}`;

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
          {widgetType === "form" && <AIAssistantWidget color={brandColor} niche={niche} />}
          {widgetType === "chat" && <AIAssistantChat color={brandColor} niche={niche} />}
          {widgetType === "banner" && <LeadGenBanner color={brandColor} />}
          {widgetType === "both" && (
            <>
              <AIAssistantWidget color={brandColor} niche={niche} />
              <LeadGenBanner color={brandColor} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
