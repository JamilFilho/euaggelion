"use client"

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function WikiPage() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const faqItems = [
        {
            question: "Porque a indicação 'beta' na wiki?",
            answer: "Como a wiki ainda está em desenvolvimento, a indicação 'beta' informa que o conteúdo e as funcionalidades podem ser atualizados ou alterados no futuro.",
        },
        {
            question: "Como pesquisar na wiki?",
            answer: "Digite um termo no campo de busca acima. A wiki irá mostrar artigos relacionados ao termo pesquisado.",
        },
        {
            question: "O que é a WikiGelion?",
            answer: "É uma wiki sobre temas bíblicos, comentários teológicos e estudos relacionados à fé cristã.",
        },
        {
            question: "Como navegar pelos artigos?",
            answer: "Clique em qualquer artigo da lista de resultados para ler o conteúdo completo.",
        },
    ];

    return(
        <section className="w-full border-b border-ring/20">
            <form className="relative w-full grid grid-cols-5 border-b border-ring/20" onSubmit={(e) => { e.preventDefault(); if (query.trim()) router.push(`/wiki/search?q=${encodeURIComponent(query)}`); }}>
                <Search className="size-5 hidden md:flex absolute left-10 top-1/2 -translate-y-1/2 text-foreground/60" />
                <Input 
                    type="text" 
                    placeholder="O que vamos estudar hoje?" 
                    className="col-span-4 w-full h-16 hover:outline-none focus:outline-none px-10 md:px-20 border-0 text-white placeholder:text-white/50 transition-colors bg-black/10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    required
                />
                <Button type="submit" className="col-span-1 w-full h-full rounded-none text-foreground bg-black/20 hover:bg-black/30 focus:bg-black/30 focus:outline-none">
                    <Search className="size-5 md:hidden text-foreground/60" />
                    <span className="hidden md:inline-flex">Pesquisar</span>
                </Button>
            </form>

            <section className="border-t border-ring/20" aria-labelledby="wiki-faq-title">
                <header className="px-10 py-10 border-b border-ring/20">
                    <h2 id="wiki-faq-title" className="text-2xl md:text-3xl font-semibold">Perguntas frequentes</h2>
                    <p className="text-sm md:text-base text-foreground/70 max-w-3xl">Tire dúvidas rápidas sobre como usar a wiki e pesquisar artigos bíblicos.</p>
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
        </section>
    )
}