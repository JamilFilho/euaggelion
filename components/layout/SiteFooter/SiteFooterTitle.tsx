import Image from "next/image"
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
                    <Image src={logo} alt={text} width={300} height={55} loading="lazy" className="w-[10rem]"/>
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