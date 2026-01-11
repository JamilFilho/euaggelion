import { getTrailStep } from '@/lib/getTrails';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { Trail } from '@/components/content/Trail';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { Download } from 'lucide-react';
import { ChronologyBlock } from '@/components/content/Chronology/ChronologyBlock';
import { remarkChronologyParser } from '@/lib/remarkChronologyParser';
import { rehypeChronologyParser } from '@/lib/rehypeChronologyParser';
import { remarkTimelineParser } from '@/lib/remarkTimelineParser';
import { rehypeTimelineParser } from '@/lib/rehypeTimelineParser';
import { TimelineBlock } from '@/components/content/Timeline/TimelineBlock';
import { Skeleton } from '@/components/ui/skeleton';
import { TRAILS } from "@/lib/trails";
import Breadcrumb from '@/components/ui/breadcrumb';
import type { Metadata } from 'next';
import { ArticleSchema, BreadcrumbSchema } from '@/lib/schema';

export async function generateMetadata({ params }: { params: Promise<{ trail: string; step: string }> }): Promise<Metadata> {
    const { trail, step } = await params;
    const stepData = await getTrailStep(trail, step);

    if (!stepData) {
        return {
            title: 'Conteúdo não encontrado | Euaggelion',
            description: 'O conteúdo solicitado não foi encontrado.',
        };
    }

    const title = `${stepData.title} | Trilhas | Euaggelion`;
    const description = stepData.description || stepData.summary || '';
    const url = `https://euaggelion.com.br/trilhas/${trail}/${stepData.slug}`;
    const imageUrl = `https://euaggelion.com.br/api/og?slug=${stepData.slug}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime: stepData.date,
            authors: stepData.author ? [stepData.author] : ['Euaggelion'],
            tags: [],
            url,
            siteName: 'Euaggelion',
            locale: 'pt_BR',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: stepData.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
        robots: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
        },
        alternates: {
            canonical: url,
        },
    };
}

export default async function StepPage({ params }: { params: Promise<{ trail: string; step: string }> }) {
    const { trail, step } = await params;
    const stepData = await getTrailStep(trail, step);

    console.log(trail)

    if (!stepData) {
    notFound();
    }

    const mdxOptions = {
        mdxOptions: {
            remarkPlugins: [
                remarkChronologyParser,
                remarkTimelineParser,
                remarkGfm, // Suporte para tabelas, strikethrough, tasklists, etc.
            ],
            rehypePlugins: [
                rehypeChronologyParser,
                rehypeTimelineParser,
            ]
        },
    };

    const mdxComponents = {
      ChronologyBlock: ChronologyBlock as any,
      TimelineBlock: TimelineBlock as any,
    };

    const trailMeta = TRAILS[stepData.trail] ?? { name: stepData.trail };
    
    return (
        <Trail.Root>
            <ArticleSchema
                title={stepData.title}
                description={stepData.description || stepData.summary || ''}
                imageUrl={`https://euaggelion.com.br/api/og?slug=${stepData.slug}`}
                datePublished={stepData.date || ''}
                dateModified={stepData.date || ''}
                authorName={stepData.author || 'Euaggelion'}
                url={`https://euaggelion.com.br/trilhas/${stepData.trail}/${stepData.slug}`}
                category={'trilhas'}
            />
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: 'https://euaggelion.com.br' },
                    { name: 'Trilhas', url: 'https://euaggelion.com.br/trilhas' },
                    { name: typeof trailMeta === 'string' ? trailMeta : trailMeta.name, url: `https://euaggelion.com.br/trilhas/${stepData.trail}` },
                    { name: stepData.title, url: `https://euaggelion.com.br/trilhas/${stepData.trail}/${stepData.slug}` },
                ]}
            />
            <Breadcrumb
                sticky={true}
                className=""
                items={[
                { label: "Home", href: "/" },
                { label: "Trilhas", href: "/trilhas" },
                { label: typeof trailMeta === 'string' ? trailMeta : trailMeta.name, href: `/trilhas/${stepData.trail}` },
                { label: stepData.title, href: `/trilhas/${stepData.trail}/${stepData.slug}` },
                ]}
            />

            {stepData.video && (
                <Suspense fallback={<Skeleton className="w-full h-64 mb-8 rounded-lg" />}>
                    <Trail.Video src={stepData.video} title={stepData.title} />
                </Suspense>
            )}

            <Trail.Header>
                <Link 
                className="w-fit py-1 px-2 text-background bg-accent mb-4 font-semibold"
                    href={`/trilhas/${stepData.trail}`}
                    title={typeof trailMeta === 'string' ? trailMeta : trailMeta.name}
                >
                    {typeof trailMeta === 'string' ? trailMeta : trailMeta.name}
                </Link>
                <Trail.Title content={stepData.title} />
                <Trail.Description content={stepData.description} />
            </Trail.Header>

            <section className="w-full grid grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-2 md:border-r border-ring/20">
                    {stepData.summary && (
                    <div className="p-10 flex flex-col gap-4 border-b border-ring/20">
                        <span className="text-xl text-foreground font-bold">Resumo do conteúdo</span>
                        <p className="text-foreground/70 text-lg">{stepData.summary}</p>
                    </div>
                    )}

                    <div className="p-10 article-content border-b border-ring/20">
                        <MDXRemote 
                            source={stepData.content}
                            options={mdxOptions}
                            components={mdxComponents}
                        />
                    </div>
                    {stepData.file && stepData.file.length > 0 && (
                        <div className="pt-10">
                            <div className="px-10">
                                <h3 className="text-2xl font-bold text-foreground mb-4">Materiais Complementares</h3>
                                <span className="text-lg text-foreground/70">Aprofunde-se no conteúdo, faça download dos materiais complementares.</span>
                            </div>
                            <ul className="mt-10 grid grid-cols-1 md:grid-cols-2">
                                {stepData.file.map((file: string, index: number) => (
                                <li key={index}>
                                    <Link 
                                        href={file} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-row items-center justify-start md:justify-center gap-2 py-4 px-10 font-semibold transition-colors ease-in-out border-t border-r border-ring/20 bg-secondary hover:bg-black/20"
                                    >
                                        <Download className="size-4" />
                                        <span>Material {index + 1}</span>
                                    </Link>
                                </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="border-t border-ring/20 md:border-t-0 md:col-span-1">
                    <span className="flex md:hidden px-10 py-6 text-lg font-bold border-b border-ring/20">Conteúdos da trilha</span>
                    <ul className="w-full flex flex-col md:sticky md:top-16">
                        {stepData.trailSteps.map((trailStep) => (
                        <li
                            key={trailStep.slug}
                        >
                            <Link 
                                href={`/trilhas/${trail}/${trailStep.slug}`}
                                className={`flex py-4 px-10 font-semibold transition-colors ease-in-out border-b border-ring/20 ${trailStep.slug === stepData.slug ? 'text-secondary bg-foreground hover:bg-foreground/90' : 'bg-secondary hover:bg-black/20'}`}
                            >
                            {trailStep.step}. {trailStep.title}
                            </Link>
                        </li>
                        ))}
                </ul>
                </div>
            </section>
        </Trail.Root>
    );
}