import { Loader } from "lucide-react";

export default function TrailsPage() {
    return(
        <section className="w-full p-20 border-b border-ring/20 flex flex-col items-center text-center">
            <Loader className="size-8 animate-spin mb-4 motion-safe:animate-spin" />
            Estamos atualizando essa funcionalidade. Em breve, as trilhas de conteúdo estarão disponíveis.
        </section>
    )
}