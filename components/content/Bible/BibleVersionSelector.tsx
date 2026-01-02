"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBibleVersion } from "@/lib/context/BibleVersionContext";
import { useRouter, usePathname } from "next/navigation";

export default function BibleVersionSelector() {
    const { currentVersion, setCurrentVersion, versions } = useBibleVersion();
    const router = useRouter();
    const pathname = usePathname();

    const handleVersionChange = (versionId: string) => {
        const newVersionId = versionId === "all" ? "nvt" : versionId;
        
        // Update context
        setCurrentVersion(newVersionId);
        
        // Navigate to the same page but with the new version
        const pathSegments = pathname.split("/");
        const bibliaIndex = pathSegments.indexOf("biblia");
        
        if (bibliaIndex !== -1 && pathSegments.length > bibliaIndex + 1) {
            // We are in a versioned route (e.g., /biblia/nvt/...)
            pathSegments[bibliaIndex + 1] = newVersionId;
            router.push(pathSegments.join("/"));
        } else {
            // We are in the root /biblia or something else, use query param or just navigate
            router.push(`/biblia?version=${newVersionId}`);
        }
    };

    return (
        <Select value={currentVersion || "nvt"} onValueChange={handleVersionChange}>
            <SelectTrigger className="w-fit">
                <SelectValue placeholder="Selecionar versão..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todas as versões</SelectItem>
                {versions.map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                        {version.id}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}