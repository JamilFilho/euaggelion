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
        setCurrentVersion(newVersionId);
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