"use client"

import { Button } from "@/components/ui/button";
import { Printer, Share } from "lucide-react";
import { toast } from "sonner";

interface ArticleActions {
    headline: string;
    excerpt: string;
    link: string;
}

export function ArticleActions({headline, excerpt, link}: ArticleActions) {
    const handlePrint = () => {
        window.print();
    }

    const handleShare = async () => {
        const shareData = {
            title: headline,
            text: excerpt,
            url: link
        };

        // Verifica se a API está disponível
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                toast.success('Compartilhado com sucesso');
            } catch (err) {
                // Usuário cancelou o compartilhamento
                if (err instanceof Error && err.name !== 'AbortError') {
                    toast.error(`Erro ao compartilhar: ${err.message}`);
                }
            }
        } else {
            // Fallback: copiar link para clipboard
            try {
                await navigator.clipboard.writeText(shareData.url);
                toast.success('Link copiado para a área de transferência!');
            } catch (err) {
                toast.error('Compartilhamento não disponível neste navegador');
            }
        }
    };

    return(
        <section className="w-full md:w-3/5 md:mx-auto grid grid-cols-4 *:flex *:flex-row *:justify-center *:items-center *:p-6 *:gap-4 divide-x md:divide-x-reverse divide-ring/20 *:text-foreground/60 *:transition-all *:duration-100 *:ease-in-out">
            <button className="md:border-l md:border-r md:border-ring/20 col-span-1 hover:bg-black/10 focus:bg-black/10" onClick={handlePrint} aria-label="Imprimir conteúdo">
                <Printer className="size-5" />
            </button>
        
            <button className="col-span-3 hover:bg-black/10 focus:bg-black/10" onClick={handleShare} aria-label="Compartilhar">
                <Share className="size-5" />
                Compartilhar
            </button>
        </section>
    )
}