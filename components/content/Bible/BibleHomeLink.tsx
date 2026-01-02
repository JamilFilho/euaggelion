"use client";
import Link from "next/link";

export default function BibleHomeLink() {
    return (
        <Link href="/biblia" title="Bíblia Sagrada" className="text-lg font-bold">
            <h2 className="py-4">Bíblia Sagrada</h2>
        </Link>
    );
}