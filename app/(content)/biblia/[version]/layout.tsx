import { Bible } from "@/components/content/Bible";
import { getBibleVersion } from "@/lib/getBible";
import { notFound } from "next/navigation";

interface Props {
  children: React.ReactNode;
  params: Promise<{ version: string }>;
}

export default async function BibleVersionLayout({ children, params }: Props) {
  const { version: versionId } = await params;
  const version = getBibleVersion(versionId);

  if (!version) {
    notFound();
  }

  return (
    <Bible.Root>
      {children}
      <Bible.Footer>
        <p className="text-foreground/60">{version.copyright}</p>
      </Bible.Footer>
    </Bible.Root>
  );
}