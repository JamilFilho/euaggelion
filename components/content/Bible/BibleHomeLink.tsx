"use client";
import Link from "next/link";
import { useBibleVersion } from "@/lib/context/BibleVersionContext";
import { Album } from "lucide-react";

export default function BibleHomeLink() {
    const { currentVersion } = useBibleVersion();
    
    return (
        <Link 
            href={currentVersion ? `/biblia?version=${currentVersion}` : "/biblia"} 
            title="Bíblia Sagrada" 
            className="text-lg font-bold flex flex-row items-center gap-2"
        >
            <Album className="hover:text-accent transition-colors ease-out size-5" />
            <h2 className="py-4">Bíblia Sagrada</h2>
        </Link>
    );
}