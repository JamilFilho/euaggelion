import { getDictionaryEntryByTerm } from "@/lib/getDictionary";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ term: string }> }
) {
  const { term } = await params;
  const entry = getDictionaryEntryByTerm(decodeURIComponent(term));

  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  return NextResponse.json(entry);
}