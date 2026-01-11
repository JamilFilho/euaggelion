import { Page } from "@/components/content/Page";
import PlannerGenerator from "@/components/content/Planner";
import Breadcrumb from "@/components/ui/breadcrumb";
import { FAQSchema, SchemaScript } from "@/lib/schema";
import { Metadata } from "next";

const pageTitle = "Planner de leitura bíblica | Euaggelion";
const pageDescription = "Monte planos anuais ou semestrais de leitura bíblica, defina capítulos por dia, escolha testamentos ou grupos temáticos e exporte tudo em PDF.";
const pageUrl = "https://euaggelion.com.br/planners";
const ogImageUrl = "https://euaggelion.com.br/og-image.png";

const faqItems = [
    {
        question: "Posso gerar plano anual ou semestral?",
        answer: "Sim. Escolha o período anual ou semestral no formulário e o cronograma calcula automaticamente as datas previstas.",
    },
    {
        question: "Consigo focar em um testamento ou grupo temático?",
        answer: "Sim. É possível selecionar Antigo Testamento, Novo Testamento, ambos ou um grupo temático específico para personalizar o seu plano de leitura.",
    },
    {
        question: "Como exporto o plano para PDF?",
        answer: "Após gerar o plano, clique em Imprimir/Salvar PDF para baixar ou salvar o cronograma.",
    },
    {
        question: "O planner adapta o número de capítulos por dia?",
        answer: "Sim, você pode definir quantos capítulos deseja ler por dia e o planner recalcula automaticamente a duração e a data de término.",
    },
];

const plannerWebAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Planner de leitura bíblica",
    url: pageUrl,
    description: pageDescription,
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    featureList: [
        "Planos anual ou semestral",
        "Seleção por testamento ou grupo temático",
        "Cálculo automático de datas",
        "Exportação em PDF com marcações",
    ],
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "BRL",
    },
};

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    keywords: ["planner bíblico", "plano de leitura", "cronograma bíblico", "leitura da bíblia", "plano anual", "plano semestral"],
    openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: pageUrl,
        type: "website",
        siteName: "Euaggelion",
        locale: "pt_BR",
        images: [
            {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: "Planner bíblico personalizado com exportação em PDF - Euaggelion",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description: pageDescription,
        images: [ogImageUrl],
    },
    robots: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
    },
    alternates: {
        canonical: pageUrl,
    },
};

export default function PlannersPage() {
    return (
        <>
            <SchemaScript schema={plannerWebAppSchema} />
            <FAQSchema faqs={faqItems} />

            <Page.Root>
                <Breadcrumb
                    sticky={true}
                    className=""
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Planners", href: "/planners" },
                    ]}
                />

                <Page.Content>
                    <PlannerGenerator />

                    <section className="border-t border-ring/20" aria-labelledby="planner-faq-title">
                        <header className="px-10 py-10 border-b border-ring/20">
                            <h2 id="planner-faq-title" className="text-2xl md:text-3xl font-semibold">Perguntas frequentes</h2>
                            <p className="text-sm md:text-base text-foreground/70 max-w-3xl">Tire dúvidas rápidas sobre como gerar, personalizar e exportar o seu plano de leitura bíblica.</p>
                        </header>

                        <dl className="grid md:grid-cols-2">
                            {faqItems.map((faq) => (
                                <div key={faq.question} className="border-r border-l border-b border-ring/20 p-10 hover:bg-black/20 transition-colors ease-out">
                                    <dt className="text-lg font-semibold mb-2">{faq.question}</dt>
                                    <dd className="text-sm md:text-base text-foreground/70 leading-relaxed">{faq.answer}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                </Page.Content>
            </Page.Root>
        </>
    );
}