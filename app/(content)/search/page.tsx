"use client";

import { useSearchParams } from "next/navigation";
import { useSearch } from "@/hooks/useSearch";
import { Feed } from "@/components/content/Feed";
import { Page } from "@/components/content/Page";
import { Skeleton } from "@/components/ui/skeleton";
import { isPublished } from "@/lib/utils";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const { results: searchResults, isLoading } = useSearch(query);

    const visibleResults = searchResults.filter(item =>
        isPublished(item.date)
    );

    const articles = visibleResults.map((item) => ({
        slug: item.slug,
        title: item.title,
        description: item.description,
        category: item.category,
        isWiki: item.category === "wiki",
        date: item.date,
        author: item.author,
    }));

    return (
        <Page.Root>
            <Page.Header>
                <Page.Title content="Resultado da pesquisa" />
                <Page.Description content={`${articles.length} resultado${articles.length !== 1 ? "s" : ""} encontrado${articles.length !== 1 ? "s" : ""} para o termo "${query}"`} />
            </Page.Header>

            <Feed.Root articles={articles} category="search" itemsPerPage={12}>
                <Feed.Header allowDateFilter={true} allowAuthorFilter={true} allowCategoryFilter={true}>
                </Feed.Header>
                {isLoading ? (
                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-ring/20">
                        <div className="h-32 md:h-48 flex flex-col gap-2 col-span-1">
                            <Skeleton className="w-[70%] h-6 rounded-md" />
                            <Skeleton className="w-[90%] h-6 rounded-md" />
                            <div className="mt-6 flex flex-col gap-1">
                                <Skeleton className="w-full h-4 rounded-md" />
                                <Skeleton className="w-full h-4 rounded-md" />
                                <Skeleton className="w-full h-4 rounded-md" />
                            </div>
                            <Skeleton className="w-full mt-auto h-8 rounded-md" />
                        </div>

                        <div className="h-32 md:h-48 flex flex-col gap-2 col-span-1">
                            <Skeleton className="w-[70%] h-6 rounded-md" />
                            <Skeleton className="w-[90%] h-6 rounded-md" />
                            <div className="mt-6 flex flex-col gap-1">
                                <Skeleton className="w-full h-4 rounded-md" />
                                <Skeleton className="w-full h-4 rounded-md" />
                                <Skeleton className="w-full h-4 rounded-md" />
                            </div>
                            <Skeleton className="w-full mt-auto h-8 rounded-md" />
                        </div>

                        <div className="h-32 md:h-48 flex flex-col gap-2 col-span-1">
                            <Skeleton className="w-[70%] h-6 rounded-md" />
                            <Skeleton className="w-[90%] h-6 rounded-md" />
                            <div className="mt-6 flex flex-col gap-1">
                                <Skeleton className="w-full h-4 rounded-md" />
                                <Skeleton className="w-full h-4 rounded-md" />
                                <Skeleton className="w-full h-4 rounded-md" />
                            </div>
                            <Skeleton className="w-full mt-auto h-8 rounded-md" />
                        </div>
                    </div>
                ) : (
                    <Feed.Group>
                        <Feed.Articles category="search" />
                    </Feed.Group>
                )}
                <Feed.Pagination />
            </Feed.Root>
        </Page.Root>
    );
}