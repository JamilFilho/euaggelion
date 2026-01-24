import { Menu } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/layout/SiteHeader/";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNavigation } from "@/components/layout/SiteNavigation";
import { PushNotificationManager } from "@/components/pushNotification";
import { BibleVersionProvider } from "@/lib/context/BibleVersionContext";
import { StickyProvider } from "@/lib/context/StickyContext";
import { getBibleVersions } from "@/lib/getBible";
import { Suspense } from "react";
import { InstallButton } from "@/components/layout/PWA/pwaPrompt";
import SearchDrawer from "@/components/SearchDrawer";

export default function ContentLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  const versions = getBibleVersions();

  return (
    <Suspense fallback={null}>
      <StickyProvider>
        <BibleVersionProvider versions={versions}>
          <SiteHeader.Root>
            <SiteHeader.Title text="Euaggelion" logo="/euaggelion-logo.svg" />
            
            <SiteNavigation.Root>
              <SiteNavigation.Menu />
              <div className="h-full flex items-center justify-center gap-4 ml-auto">
                <PushNotificationManager />
                <SearchDrawer />
              </div>
            </SiteNavigation.Root>

            <SiteHeader.Navigation icon={Menu} />
          </SiteHeader.Root>

          {children}

          <SiteFooter.Root>
            <SiteFooter.Menu />

            <SiteFooter.Content>            
              <SiteFooter.Group>
                <SiteFooter.Title text="Euaggelion" logo="/euaggelion-logo.svg" />
                <SiteFooter.Copy 
                  copyright="CC0 1.0 Universal" 
                  content="O projeto Euaggelion é uma iniciativa cristã independente cujo objetivo central é a divulgação gratuita de conteúdo cristão e teológico. Todo material disponibilizado por meio de nosso site está diponível sob uma licença de uso de domínio público." 
                />
              </SiteFooter.Group>
              
              <InstallButton />
            </SiteFooter.Content>
          </SiteFooter.Root>
        </BibleVersionProvider>
      </StickyProvider>
      
      <Toaster />
    </Suspense>
  );
}