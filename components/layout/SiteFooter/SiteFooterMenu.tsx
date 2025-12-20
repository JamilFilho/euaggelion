import Link from "next/link";

export function SiteFooterMenu() {
    return(
        <div className="px-10 col-span-2 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
          <ul className="col-span-1 flex flex-col gap-2">
            <li className="text-lg font-bold mb-4">Devocionais</li>
            <li><Link href="/s/ecos-da-eternidade" title="Ecos da Eternidade">Ecos da Eternidade</Link></li>
            <li><Link href="/s/cada-manha" title="Novas de Cada Manhã">Novas de Cada Manhã</Link></li>
          </ul>

          <ul className="col-span-1 flex flex-col gap-2">
            <li className="text-lg font-bold mb-4">Download</li>
            <li><Link href="/s/ebook" title="eBooks">eBooks</Link></li>
            <li><Link href="/s/planners" title="Planners de Leitura">Planners de Leitura</Link></li>
          </ul>

          <ul className="col-span-1 flex flex-col gap-2">
            <li className="text-lg font-bold mb-4">Estudo Bíblico</li>
            <li><Link href="/s/biblioteca-crista" title="Biblioteca Cristã">Biblioteca Cristã</Link></li>
            <li><Link href="/s/estudos" title="Estudos Temáticos">Estudos Temáticos</Link></li>
            <li><Link href="/s/sermoes" title="Sermões Históricos">Sermões Históricos</Link></li>
            <li><Link href="/s/estudos" title="Estudos">TEOleigo</Link></li>
            <li><Link href="/s/verso-a-verso" title="Verso a verso">Verso a verso</Link></li>
          </ul>

          <ul className="col-span-1 flex flex-col gap-2">
            <li className="text-lg font-bold mb-4">Ferramentas de Estudo</li>
            <li><Link href="/f/leitor-biblico" title="Leitor Bíblico">Leitor Bíblico</Link></li>
            <li><Link href="/f/versoes-biblicas" title="Versões Bíblicas">Versões Bíblicas</Link></li>
          </ul>
          
          <ul className="col-span-1 flex flex-col gap-2">
            <li className="text-lg font-bold mb-4">Opinião</li>
            <li><Link href="/s/blog" title="Blog">Blog</Link></li>
          </ul>

          <ul className="col-span-1 flex flex-col gap-2">
            <li className="text-lg font-bold mb-4">Wiki</li>
            <li><Link href="/wiki/escatologia" title="Escatologia">Escatologia</Link></li>
            <li><Link href="/wiki/glossario" title="Glossário Teológico">Glossário Teológico</Link></li>
            <li><Link href="/wiki/teologos" title="Teólogos">Teólogos</Link></li>
          </ul>

          <ul className="col-span-1 flex flex-col gap-2">
            <li className="text-lg font-bold mb-4">Institucional</li>
            <li><Link href="/s/editorial" title="Editorial">Editorial</Link></li>
            <li><Link href="/p/confissao-de-fe" title="Confissão de Fé">Confissão de Fé</Link></li>
            <li><Link href="/p/manifesto" title="Manifesto">Manifesto</Link></li>
            <li><Link href="/p/privacidade" title="Política de Privacidade">Politica de Privacidade</Link></li>
          </ul>
        </div>
    )
}