import { Page } from "@/components/content/Page";
import PlannerGenerator from "@/components/content/Planner";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Planner de leitura bíblica | Euaggelion",
    description: "Monte planos anuais ou semestrais de leitura bíblica, escolha testamentos ou grupos temáticos e exporte seu cronograma em PDF.",
    keywords: ["planner bíblico", "plano de leitura", "cronograma bíblico", "leitura da bíblia"],
    openGraph: {
        title: "Planner de leitura bíblica | Euaggelion",
        description: "Monte planos anuais ou semestrais de leitura bíblica e exporte em PDF.",
        url: "https://euaggelion.com.br/planners",
        type: "website",
        siteName: "Euaggelion",
        locale: "pt_BR",
        images: [
            {
                url: "https://euaggelion.com.br/og-image.png",
                width: 1200,
                height: 630,
                alt: "Planner Bíblico - Euaggelion",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Planner de leitura bíblica | Euaggelion",
        description: "Monte planos anuais ou semestrais de leitura bíblica.",
    },
    robots: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
    },
    alternates: {
        canonical: "https://euaggelion.com.br/planners",
    },
};

export default function PlannersPage() {
    return (
        <Page.Root>
            <Page.Content>
                <PlannerGenerator />
            </Page.Content>
        </Page.Root>
    );
}