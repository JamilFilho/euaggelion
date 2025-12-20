import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeedFooterProps {
    category: string
}

export default function FeedFooter({category}:FeedFooterProps) {
    return(
        <div className="px-10 py-6">
            <Link href={`/s/${category}`} className="w-fit text-accent flex flex-row items-center font-semibold gap-2">
                Ver tudo
                <ArrowRight className="size-4"/>
            </Link>
        </div>
    )
}