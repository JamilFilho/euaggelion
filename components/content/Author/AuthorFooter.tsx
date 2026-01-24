import { slugify } from "@/lib/utils";
import Link from "next/link";

interface AuthorFooter {
    content: string;
}

export default function AuthorFooter({content}:AuthorFooter) {
    return(
        <Link href={`/autores/${slugify(content)}`} className="mt-10 px-10 py-6 col-span-1 md:col-span-5 text-center bg-black/20 border-t border-ring/20" title={`Mais artigos de ${content}`}>
            Mais artigos de {content}
        </Link>
    )
}