import { Feed } from "@/components/content/Feed";
import { Page } from "@/components/content/Page";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import keystaticConfig from "@/keystatic.config";
import { BreadcrumbSchema, CollectionPageSchema } from "@/lib/schema";
import { slugify, collections, isPublished} from "@/lib/utils";
import { createReader } from "@keystatic/core/reader";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const reader = createReader(process.cwd(), keystaticConfig);

export async function generateStaticParams() {
  const categories = await reader.collections.categories.all();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

interface Params {
  category: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { category } = await params;
    const categorySlug = slugify(category);
    const articlesInCategory = await getCategoriesPublications(categorySlug);
    const categoryData = await reader.collections.categories.read(categorySlug);

    const articleCount = articlesInCategory.length;

    if (!categoryData) {
        notFound();
    }

    return {
        title: `${categoryData.name} | Euaggelion`,
        description: `${categoryData.description}. ${articleCount} ${articleCount === 1 ? 'conteúdo disponível' : 'conteúdos disponíveis'}.`,
        keywords: [categoryData.name, "artigos", "estudos bíblicos", "cristianismo", "teologia"],
        openGraph: {
        title: `${categoryData.name} | Euaggelion`,
        description: categoryData.description,
        type: 'website',
        url: `https://euaggelion.com.br/s/${categorySlug}`,
        siteName: "Euaggelion",
        locale: "pt_BR",
        images: [
            {
            url: "https://euaggelion.com.br/og-image.png",
            width: 1200,
            height: 630,
            alt: categoryData.name,
            },
        ],
        },
        twitter: {
        card: 'summary_large_image',
        title: `${categoryData.name} | Euaggelion`,
        description: categoryData.description,
        },
        robots: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        },
        alternates: {
        canonical: `https://euaggelion.com.br/s/${categorySlug}`,
        },
    };
}

async function getCategoriesPublications(categorySlug: string) {
  const publications = [];

  for (const collectionName of [...collections]) {
    try {
      const items = await reader.collections[collectionName].all();

      const filteredItems = items.filter((item) => {
        const itemCategorySlug = slugify(item.entry.category || '');
        const date = item.entry.date ?? undefined;

        return (
            itemCategorySlug === categorySlug && isPublished(date)
        );
      });

      const mappedItems = filteredItems.map(item => ({
        slug: item.slug,
        title: item.entry.title,
        description: 'description' in item.entry ? item.entry.description : '',
        category: slugify(item.entry.category || ''),
        author: 'author' in item.entry ? item.entry.author ?? undefined : undefined,
        date: item.entry.date ?? undefined,
        isWiki: false
      }));
      publications.push(...mappedItems);
    } catch (error) {
      continue;
    }
  }
  return publications;
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const categoryData = await reader.collections.categories.read(category);
    const categoryPublications = await getCategoriesPublications(category);

    if (!categoryData) {
        notFound();
    }

    return(
        <>
        <CollectionPageSchema
            name={categoryData.name}
            description={categoryData.description}
            url={`https://euaggelion.com.br/s/${category}`}
            itemCount={categoryPublications.length}
        />

        <BreadcrumbSchema
            items={[
                { name: "Home", url: "https://euaggelion.com.br" },
                { name: "Seções", url: "https://euaggelion.com.br/s" },
                { name: categoryData.name, url: `/s/${category}` },
            ]}
        />

        <Breadcrumb
            items={[
                { label: "Home", href: "/" },
                { label: "Seções", href: "/s" },
                { label: categoryData.name, href: `/s/${category}` },
            ]}
            sticky={true}
            topOffset={0}
        />
        <Page.Root>
            <Page.Header>
                <Page.Title content={categoryData.name} />
                {categoryData.description && (
                    <Page.Description content={categoryData.description} />
                )}
            </Page.Header>

            <Page.Content>    
                <Feed.Root articles={categoryPublications} category={category}>
                    <Feed.Header 
                        show={true}
                        allowDateFilter={category !== "verso-a-verso"}
                        allowAuthorFilter={category !== "verso-a-verso"}
                    />

                    <Feed.Group>
                        <Feed.Articles category={category} />
                    </Feed.Group>
                    
                    <Feed.Pagination />
                </Feed.Root>
            </Page.Content>
        </Page.Root>
        </>
    )
}