import { getAllPages, getPageBySlug } from "@/lib/getPages";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/mdx-components";
import { Article } from "@/components/content/Article";

interface Params {
  page: string;
}

export async function generateStaticParams() {
  const pages = getAllPages();
  
  return pages
    .filter(page => page.published)
    .map((page) => ({
      page: page.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { page: pageSlug } = await params;
  const page = getPageBySlug(pageSlug);

  if (!page) {
    return {
      title: "Página não encontrada",
    };
  }

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function StaticPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { page: pageSlug } = await params;
  
  const page = getPageBySlug(pageSlug);
  
  if (!page) {
    notFound();
  }

  // Usa o nome real do arquivo
  const filePath = path.join(process.cwd(), "content", "pages", page.fileName);
  
  // Verifica se o arquivo existe
  if (!fs.existsSync(filePath)) {
    console.error(`Arquivo não encontrado: ${filePath}`);
    notFound();
  }
  
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(fileContent);
  const components = useMDXComponents({});

  return (
    <Article.Root>
      <Article.Header>
        <Article.Group>
          <Article.Title content={page.title} />
          <Article.Description content={page.description} />
        </Article.Group>
      </Article.Header>

      <Article.Content>
        <MDXRemote source={content} components={components} />
      </Article.Content>
    </Article.Root>
  );
}