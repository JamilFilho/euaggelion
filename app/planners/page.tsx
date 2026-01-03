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
            <Page.Content>
                <PlannerGenerator />
            </Page.Content>
        </Page.Root>
    );
}