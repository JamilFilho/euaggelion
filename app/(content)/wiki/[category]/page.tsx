import { Feed } from "@/components/content/Feed";
import { Page } from "@/components/content/Page";
import keystaticConfig from "@/keystatic.config";
import { slugify, wiki} from "@/lib/utils";
import { createReader } from "@keystatic/core/reader";
import { notFound } from "next/navigation";

const reader = createReader(process.cwd(), keystaticConfig);

async function getCategoriesPublications(categorySlug: string) {
  const publications = [];

  for (const collectionName of wiki) {
    try {
      const items = await reader.collections[collectionName].all();
      const filteredItems = items.filter((item) => {
        const itemCategorySlug = slugify(item.entry.category || '');
        return itemCategorySlug === categorySlug;
      });
      const mappedItems = filteredItems.map(item => ({
        slug: item.slug,
        title: item.entry.title,
        description: 'description' in item.entry ? item.entry.description : '',
        category: slugify(item.entry.category || ''),
        date: item.entry.date ?? undefined,
        isWiki: true,
      }));
      publications.push(...mappedItems);
    } catch (error) {
      continue;
    }
  }
  return publications;
}

export default async function WikiCategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const categoryData = await reader.collections.categories.read(category);
    const categoryPublications = await getCategoriesPublications(category);

    if (!categoryData) {
        notFound();
    }
    return(
        <>
        <Page.Root>
            <Page.Header>
                <Page.Title content={categoryData.name} />
                {categoryData.description && (
                    <Page.Description content={categoryData.description} />
                )}
            </Page.Header>

            <Page.Content>    
                <Feed.Root articles={categoryPublications} category="wiki" >
                    <Feed.Header 
                        show={true}
                        allowDateFilter={category !== "verso-a-verso"}
                        allowAuthorFilter={category !== "verso-a-verso"}
                    />

                    <Feed.Group>
                        <Feed.Articles category="wiki" isCategoryPage={true} />
                    </Feed.Group>
                    
                    <Feed.Pagination />
                </Feed.Root>
            </Page.Content>
        </Page.Root>
        </>
    )
}