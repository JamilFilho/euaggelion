import { Page } from "@/components/content/Page";
import PlannerGenerator from "@/components/content/Planner";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Planner de leitura bíblica | Euaggelion",
    description: "Monte planos anuais ou semestrais, escolha testamentos ou grupos temáticos e exporte seu cronograma em PDF.",
    alternates: {
        canonical: "https://euaggelion.com.br/planners",
    },
};

export default function PlannersPage() {
    return (
        <Page.Root>
            <div className="print:hidden">
            <Page.Header>
                <Page.Title content="Planner de leitura bíblica" />
                <Page.Description content="Organize sua leitura bíblica, monte planos anuais ou semestrais, escolha testamentos ou grupos temáticos e exporte seu cronograma em PDF." />
            </Page.Header>
            </div>

            <Page.Content>
                <div className="px-8 mb-6">
                    <PlannerGenerator /> 
                </div>         
            </Page.Content>
        </Page.Root>
    );
}