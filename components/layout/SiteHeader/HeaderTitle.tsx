import Link from "next/link"

interface SiteHeaderTitleProps {
    text: string
    logo?: string
}

export function SiteHeaderTitle({ text, logo }: SiteHeaderTitleProps) {
    return(
        <Link href="/" title="Euaggelion">
            <h1>
            {logo ? (
                <>
                <img src={logo} alt={text} className="w-[8rem]"/>
                <span className="sr-only">{text}</span>
                </>
            ) : (
                text
            )}
            </h1>
        </Link>
    )
}