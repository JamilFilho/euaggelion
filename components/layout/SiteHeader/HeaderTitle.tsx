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
                <img src={logo} alt="Logo projeto Euaggelion" className="w-[10rem] md:w-[8rem] grayscale dark:grayscale-0"/>
                <span className="sr-only">{text}</span>
                </>
            ) : (
                text
            )}
            </h1>
        </Link>
    )
}