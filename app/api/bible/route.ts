import { NextRequest, NextResponse } from "next/server";
import { getBibleChapter } from "@/lib/getBible";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const version = searchParams.get("version");
  const book = searchParams.get("book");
  const chapter = searchParams.get("chapter");

  if (!version || !book || !chapter) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const chapterNum = parseInt(chapter);
  if (isNaN(chapterNum)) {
    return NextResponse.json({ error: "Invalid chapter number" }, { status: 400 });
  }

  const verses = getBibleChapter(version, book, chapterNum);

  if (!verses) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  return NextResponse.json({ verses });
}
