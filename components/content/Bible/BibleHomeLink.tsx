"use client";
import Link from "next/link";
import { useBibleVersion } from "@/lib/context/BibleVersionContext";

export default function BibleHomeLink() {
    const { currentVersion } = useBibleVersion();
    
    return (
        <Link 
            href={currentVersion ? `/biblia?version=${currentVersion}` : "/biblia"} 
            title="Bíblia Sagrada" 
            className="text-lg font-bold"
        >
            <h2 className="py-4">Bíblia Sagrada</h2>
        </Link>
    );
}