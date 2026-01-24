import React from "react";
import Markdoc from "@markdoc/markdoc";
import { Article } from "@/components/content/Article"
import BibliaLink from "@/components/content/Bible/BibliaLink";
import keystaticConfig from "@/keystatic.config";
import { createReader } from "@keystatic/core/reader";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb";
import { BreadcrumbSchema } from "@/lib/schema";

const reader = createReader(process.cwd(), keystaticConfig);

export async function generateStaticParams() {
  const pages = await reader.collections.page.all();
  return pages.map((page) => ({
    page: page.slug,
  }));
}

interface Params {
  page: string;
}

export default async function Page({ params }: { params: Promise<Params> }) {
    const { page } = await params;
    const pageData = await reader.collections.page.read(page);

    if (!pageData) {
        notFound();
    }

    const content = await pageData.content();
    const { node } = content;
    const errors = Markdoc.validate(node);
    
    if (errors.length) {
    console.error(errors);
        throw new Error('Invalid content');
    }
    const renderable = Markdoc.transform(node);

    return(
        <>
        <BreadcrumbSchema
            items={[
                { name: "Home", url: "https://euaggelion.com.br" },
                { name: pageData.title, url: `https://euaggelion.com.br/p/${page}` },
            ]}
        />
        <Breadcrumb
            items={[
                { label: "Home", href: "/" },
                { label: pageData.title, href: `/p/${page}` },
            ]}
            sticky={true}
            className=""
        />
        <div className="pb-10 border-b border-ring/20">
        <Article.Root>
            <Article.Header>
                <div className="p-10 space-y-2">
                    <Article.Title content={pageData.title} />
                    <Article.Description content={pageData.description} />
                </div>
            </Article.Header>
            <Article.Content>
                <BibliaLink>
                    {Markdoc.renderers.react(renderable, React)}
                </BibliaLink>
            </Article.Content>
        </Article.Root>
        </div>
        </>
    )
}