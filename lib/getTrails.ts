import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { TRAILS } from "./trails";

const TRAILS_PATH = path.join(process.cwd(), "content", "trails");

export interface TrailListItem {
  slug: string;
  title: string;
  description: string;
  category: "trilhas";
  author?: string;
  date?: string;
}

export interface TrailStepMeta {
  slug: string;
  title: string;
  description: string;
  category: "steps";
  author?: string;
  date?: string;
  step?: number;
}

export interface TrailStepDetail extends TrailStepMeta {
  trail: string;
  content: string;
  summary?: string;
  video?: string;
  file?: string[];
  trailSteps: Array<{ slug: string; title: string; step?: number }>;
}

function ensureTrailsDir(): boolean {
  if (!fs.existsSync(TRAILS_PATH)) {
    console.warn(`Diretório ${TRAILS_PATH} não encontrado`);
    return false;
  }
  return true;
}

function readFrontmatter(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  return matter(raw);
}

function listTrailDirs(): string[] {
  if (!ensureTrailsDir()) return [];
  return fs
    .readdirSync(TRAILS_PATH)
    .filter((name) => {
      const full = path.join(TRAILS_PATH, name);
      try {
        return fs.statSync(full).isDirectory();
      } catch {
        return false;
      }
    });
}

export async function getTrails(): Promise<TrailListItem[]> {
  const dirs = listTrailDirs();

  const items: TrailListItem[] = dirs.map((slug) => {
    const meta = TRAILS[slug];

    // Fallback: tenta usar o primeiro passo publicado para descrição
    let fallbackTitle = slug;
    let fallbackDescription = "";
    let fallbackAuthor: string | undefined;
    let fallbackDate: string | undefined;

    const trailDir = path.join(TRAILS_PATH, slug);
    try {
      const files = fs
        .readdirSync(trailDir)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => path.join(trailDir, f));

      const parsed = files
        .map((f) => ({ fp: f, ...readFrontmatter(f) }))
        .filter((fm) => (fm.data?.published ?? false) as boolean)
        .sort((a, b) => {
          const sa = Number(a.data?.step ?? 0);
          const sb = Number(b.data?.step ?? 0);
          return sa - sb;
        });

      if (parsed.length > 0) {
        const first = parsed[0];
        fallbackTitle = String(first.data?.title ?? fallbackTitle);
        fallbackDescription = String(first.data?.description ?? "");
        fallbackAuthor = first.data?.author ? String(first.data.author) : undefined;
        fallbackDate = first.data?.date ? String(first.data.date) : undefined;
      }
    } catch {
      // ignore per-trail failures
    }

    return {
      slug,
      title: meta?.name ?? fallbackTitle,
      description: meta?.description ?? fallbackDescription,
      category: "trilhas",
      author: fallbackAuthor,
      date: fallbackDate,
    } satisfies TrailListItem;
  });

  // Filtrar apenas trilhas com data igual ou anterior ao dia atual
  const today = new Date().toISOString().slice(0, 10);
  const filteredItems = items.filter(item => item.date && item.date <= today);

  // Ordena por título para estabilidade
  return filteredItems.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
}

export async function getTrailSteps(trail: string): Promise<TrailStepMeta[]> {
  const trailDir = path.join(TRAILS_PATH, trail);
  if (!fs.existsSync(trailDir)) return [];

  const steps = fs
    .readdirSync(trailDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(trailDir, file);
      const { data } = readFrontmatter(filePath);
      const slug = file.replace(/\.mdx$/i, "").toLowerCase();

      return {
        slug,
        title: String(data?.title ?? slug),
        description: String(data?.description ?? ""),
        category: "steps" as const,
        author: data?.author ? String(data.author) : undefined,
        date: data?.date ? String(data.date) : undefined,
        step: data?.step !== undefined ? Number(data.step) : undefined,
      } satisfies TrailStepMeta;
    })
    .filter((s) => Boolean(s))
    .sort((a, b) => {
      const sa = a.step ?? Number.MAX_SAFE_INTEGER;
      const sb = b.step ?? Number.MAX_SAFE_INTEGER;
      if (sa !== sb) return sa - sb;
      return a.title.localeCompare(b.title, "pt-BR");
    });

  return steps;
}

export async function getTrailStep(
  trail: string,
  stepSlug: string
): Promise<TrailStepDetail | undefined> {
  const trailDir = path.join(TRAILS_PATH, trail);
  if (!fs.existsSync(trailDir)) return undefined;

  const targetFile = fs
    .readdirSync(trailDir)
    .find((f) => f.replace(/\.mdx$/i, "").toLowerCase() === stepSlug.toLowerCase());

  if (!targetFile) return undefined;

  const filePath = path.join(trailDir, targetFile);
  const { data, content } = readFrontmatter(filePath);

  const steps = await getTrailSteps(trail);
  const trailSteps = steps.map((s) => ({ slug: s.slug, title: s.title, step: s.step }));

  return {
    slug: stepSlug,
    title: String(data?.title ?? stepSlug),
    description: String(data?.description ?? ""),
    category: "steps",
    author: data?.author ? String(data.author) : undefined,
    date: data?.date ? String(data.date) : undefined,
    step: data?.step !== undefined ? Number(data.step) : undefined,
    trail,
    content,
    summary: data?.summary ? String(data.summary) : undefined,
    video: data?.video ? String(data.video) : undefined,
    file: Array.isArray(data?.file) ? (data.file as any[]).map(String) : undefined,
    trailSteps,
  } satisfies TrailStepDetail;
}