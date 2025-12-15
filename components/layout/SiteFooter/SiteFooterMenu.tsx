import Link from "next/link";

export function SiteFooterMenu() {
    return(
        <div className="px-10 col-span-2 grid grid-cols-2 gap-4">
          <ul className="col-span-1 flex flex-col gap-2">
            <li className="text-lg font-bold mb-4">Institucional</li>
            <li><Link href="/s/blog" title="Blog">Blog</Link></li>
            <li><Link href="/s/editorial" title="Editorial">Editorial</Link></li>
            <li><Link href="/p/confissao-de-fe" title="Confissão de Fé">Confissão de Fé</Link></li>
            <li><Link href="/p/sobre" title="Sobre Nós">Sobre nós</Link></li>
          </ul>

          <ul className="col-span-1 flex flex-col gap-2">
            <li className="text-lg font-bold mb-4">Materiais</li>
            <li><Link href="/s/biblioteca-crista" title="Biblioteca Cristã">Biblioteca Cristã</Link></li>
            <li><Link href="/s/ebook" title="eBooks">eBooks</Link></li>
            <li><Link href="/s/estudos" title="Estudos">Estudos</Link></li>
            <li><Link href="/s/cada-manha" title="Novas de Cada Manhã">Novas de Cada Manhã</Link></li>
            <li><Link href="/s/sermoes" title="Sermões Históricos">Sermões Históricos</Link></li>
            <li><Link href="/s/teoleigo" title="TEOleigo">TEOleigo</Link></li>
            <li><Link href="/s/verso-a-verso" title="Verso a verso">Verso a verso</Link></li>
          </ul>
        </div>
    )
}