"use client"

import { ReactNode, useEffect, useRef } from "react"
import { toast } from "sonner"

interface ArticleContentProps {
    children: ReactNode
}

export function ArticleContent({children}: ArticleContentProps) {
    const containerRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null
            const anchor = target?.closest('a.heading-anchor') as HTMLAnchorElement | null
            if (!anchor) return

            event.preventDefault()

            const heading = anchor.parentElement as HTMLElement | null
            const id = heading?.id
            if (!id) return

            const url = `${window.location.origin}${window.location.pathname}#${id}`

            const doCopy = async () => {
                try {
                    if (navigator.clipboard?.writeText) {
                        await navigator.clipboard.writeText(url)
                    } else {
                        const textarea = document.createElement('textarea')
                        textarea.value = url
                        document.body.appendChild(textarea)
                        textarea.select()
                        document.execCommand('copy')
                        document.body.removeChild(textarea)
                    }
                    toast.success('Link copiado!')
                } catch (error) {
                    toast.error('Não foi possível copiar o link')
                }
            }

            void doCopy()
        }

        container.addEventListener('click', handleClick)
        return () => container.removeEventListener('click', handleClick)
    }, [])

    return(
        <section ref={containerRef} className="md:w-2/3 md:mx-auto px-10 md:px-20 article-content overflow-visible">
            {children}
        </section>
    )
}