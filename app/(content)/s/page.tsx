import { createReader } from "@keystatic/core/reader";
import { Feed } from "@/components/content/Feed";
import { Page } from "@/components/content/Page";
import keystaticConfig from "@/keystatic.config";
import { BreadcrumbSchema, CollectionPageSchema } from "@/lib/schema";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Seções de Conteúdo | Materiais Cristãos | Euaggelion",
    description: "Navegue por nossas seções temáticas de conteúdo cristão e edifique sua fé com artigos, estudos bíblicos e devocionais.",
    keywords: ["categorias", "seções", "artigos", "estudos bíblicos", "devocionais"],
    openGraph: {
        title: "Seções de Conteúdo | Materiais Cristãos | Euaggelion",
        description: "Navegue por nossas seções temáticas de conteúdo cristão e edifique sua fé com artigos, estudos bíblicos e devocionais.",
        url: "https://euaggelion.com.br/s/",
        type: 'website',
        siteName: "Euaggelion",
        locale: "pt_BR",
        images: [
            {
                url: "https://euaggelion.com.br/og-image.png",
                width: 1200,
                height: 630,
                alt: "Seções - Euaggelion",
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Seções | Euaggelion",
        description: "Navegue por nossas seções temáticas de conteúdo cristão",
    },
    robots: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
    },
    alternates: {
        canonical: "https://euaggelion.com.br/s/",
    },
};

const reader = createReader(process.cwd(), keystaticConfig);

export default async function SectionsPage() {
    const sectionData = await reader.collections.categories.all();

    const sections = sectionData.map(section => ({
        slug: section.slug,
        title: section.entry.name,
        description: section.entry.description,
        category: "sections"
    }));

    return(
        <>
        <CollectionPageSchema
            name="Seções de Conteúdo | Materiais Cristãos | Euaggelion"
            description="Navegue por nossas seções temáticas de conteúdo cristão e edifique sua fé com artigos, estudos bíblicos e devocionais."
            url="https://euaggelion.com.br/s/"
            itemCount={sectionData.length}
        />
        <BreadcrumbSchema
            items={[
                { name: "Home", url: "https://euaggelion.com.br" },
                { name: "Seções", url: "https://euaggelion.com.br/s" },
            ]}
        />
        <Breadcrumb
            items={[
            { label: "Home", href: "/" },
            { label: "Seções", href: "/s" },
            ]}
            sticky={true}
            topOffset={0}
        />
        <Page.Root>
            <Page.Header>
                <Page.Title content="Seções" />
                <Page.Description content="Navegue por nossas seções de conteúdos" />
            </Page.Header>
            <Page.Content>
                <Feed.Root articles={sections} category="sections" itemsPerPage={80} >
                    <Feed.Group>
                        <Feed.Articles category="sections" />
                    </Feed.Group>
                    <Feed.Pagination />
                </Feed.Root>
            </Page.Content>
        </Page.Root>
        </>
    )
}