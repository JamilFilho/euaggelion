import Link from "next/link"

interface SiteFooterTitleProps {
    text: string
    logo?: string
}

export function SiteFooterTitle({ text, logo }: SiteFooterTitleProps) {
    return(
        <div className="md:col-span-3 flex">
            <Link href="/" title="Euaggelion" className="w-fit">
                <h1>
                {logo ? (
                    <>
                    <img src={logo} alt={text} className="w-[10rem] grayscale dark:grayscale-0"/>
                    <span className="sr-only">{text}</span>
                    </>
                ) : (
                    text
                )}
                </h1>
            </Link>
        </div>
    )
}