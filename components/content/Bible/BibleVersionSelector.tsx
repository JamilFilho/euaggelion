"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface BibleVersionSelectorProps {
    versions: { id: string; name: string }[];
    currentVersion?: string;
}

export default function BibleVersionSelector({ versions, currentVersion }: BibleVersionSelectorProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleVersionChange = useCallback((versionId: string) => {
        const params = new URLSearchParams(searchParams);
        if (versionId === "all") {
            params.delete("version");
        } else {
            params.set("version", versionId);
        }
        
        // Replace the current URL with the new search params
        router.replace(`${pathname}?${params.toString()}`);
    }, [router, pathname, searchParams]);

    return (
        <header className="md:col-span-3 flex items-center justify-between md:justify-end md:gap-4 border-b border-ring/20 py-4 px-10">
            <span className="text-foreground/60">Selecionar versão:</span>
            <Select value={currentVersion || "all"} onValueChange={handleVersionChange}>
                <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Selecionar versão..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas as versões</SelectItem>
                    {versions.map((version) => (
                        <SelectItem key={version.id} value={version.id}>
                            {version.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </header>
    );
}