# ✅ Checklist de SEO - Euaggelion

## 📋 Checklist Prático

Marque cada item conforme for completado. Este é o guia prático para colocar as melhorias em produção.

---

## FASE 1: VALIDAÇÃO (Semana 1)
- [ ] Ler [20 - seo-sumario-implementacoes.md](20 - seo-sumario-implementacoes.md)
- [ ] Ler [16 - seo-guia-integracao.md](16 - seo-guia-integracao.md)
- [ ] Revisar todos os arquivos .tsx criados
- [ ] Revisar todas as modificações de arquivo

## FASE 2: TESTES LOCAIS (Semana 1-2)
- [ ] `npm run build` - Compilar sem erros
- [ ] `npm run dev` - Verificar no navegador
- [ ] Abrir DevTools > Elements > Head
  - [ ] Verificar se `<OrganizationSchema />` está presente
  - [ ] Verificar se `<WebsiteSchema />` está presente
- [ ] Abrir um artigo em /[slug]
  - [ ] Verificar se `<ArticleSchema />` está presente
  - [ ] Verificar se `<BreadcrumbSchema />` está presente
  - [ ] Verificar se og:image está definida

## FASE 3: INTEGRAÇÃO (Semana 2-3)

### 3.1 - Adicionar Breadcrumbs aos Artigos
- [ ] Abrir [app/[slug]/page.tsx](../../app/[slug]/page.tsx)
- [ ] Adicionar import: `import { Breadcrumb } from "@/components/ui/breadcrumb";`
- [ ] Adicionar antes de `<Article.Root>`:
```tsx
<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: categoryName, href: `/s/${found.category}` },
    { label: found.title, href: `/${found.slug}` },
  ]}
  className="mb-6 px-4 md:px-20"
/>
```
- [ ] Compilar sem erros
- [ ] Testar em navegador

### 3.2 - Adicionar Related Articles aos Artigos
- [ ] Abrir [app/[slug]/page.tsx](../../app/[slug]/page.tsx)
- [ ] Adicionar import: `import { RelatedArticles } from "@/components/content/RelatedArticles";`
- [ ] Adicionar antes de `</Article.Root>`:
```tsx
<RelatedArticles currentSlug={slug} maxResults={3} />
```
- [ ] Compilar sem erros
- [ ] Testar em navegador - deve mostrar 3 artigos relacionados

### 3.3 - Verificar Google Search Console
- [ ] Ir para [Google Search Console](https://search.google.com/search-console)
- [ ] Adicionar propriedade se não existir
- [ ] Ir para Sitemaps
- [ ] Clicar em "ADICIONAR NOVO SITEMAP"
- [ ] Adicionar: `https://euaggelion.com.br/sitemap.xml`
- [ ] Clicar em "ENVIAR"
- [ ] Aguardar processamento (1-2 dias)
- [ ] Voltar e verificar status

## FASE 4: TESTES DE RICH RESULTS (Semana 2-3)

### 4.1 - Testar Homepage
- [ ] Ir para [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Colar URL: `https://euaggelion.com.br`
- [ ] Clicar em "TESTAR"
- [ ] Verificar se aparecem:
  - [ ] Organization schema
  - [ ] WebSite schema
  - [ ] SearchAction
- [ ] Não deve haver ERROS ❌ (avisos são ok)

### 4.2 - Testar Artigo
- [ ] Ir para [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Colar URL de um artigo: `https://euaggelion.com.br/[slug-de-artigo]`
- [ ] Clicar em "TESTAR"
- [ ] Verificar se aparecem:
  - [ ] NewsArticle schema
  - [ ] BreadcrumbList schema
  - [ ] Imagem OG
- [ ] Não deve haver ERROS ❌

### 4.3 - Testar Página de Categorias
- [ ] Ir para [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Colar URL: `https://euaggelion.com.br/s/`
- [ ] Clicar em "TESTAR"
- [ ] Verificar se aparecem:
  - [ ] CollectionPage schema
- [ ] Não deve haver ERROS ❌

## FASE 5: SCHEMA VALIDATION (Semana 2-3)

### 5.1 - Validar Schema.org
- [ ] Ir para [Schema.org Validator](https://validator.schema.org/)
- [ ] Colar URL: `https://euaggelion.com.br`
- [ ] Verificar se não há ERROS ❌
- [ ] Repetir para um artigo
- [ ] Repetir para página de categorias

## FASE 6: MONITORAMENTO (Contínuo)

### 6.1 - Google Search Console
- [ ] Verificar diariamente:
  - [ ] Performance report
  - [ ] Coverage
  - [ ] Enhancements
- [ ] Semanalmente:
  - [ ] Core Web Vitals
  - [ ] Mobile Usability
  - [ ] Security Issues
- [ ] Mensalmente:
  - [ ] Top queries
  - [ ] Click-through rate trends
  - [ ] Indexing status

### 6.2 - Google Analytics
- [ ] Configurar GA4 (se não tiver)
- [ ] Rastrear:
  - [ ] Organic traffic
  - [ ] Landing pages
  - [ ] Time on page
  - [ ] Scroll depth
- [ ] Revisar relatórios mensalmente

### 6.3 - Rankings
- [ ] Usar ferramenta de rastreamento (opcional):
  - [ ] SE Ranking
  - [ ] Semrush
  - [ ] Ahrefs
- [ ] Rastrear keywords importantes
- [ ] Revisar rankings mensalmente

## FASE 7: OTIMIZAÇÕES FUTURAS (1-3 meses)

### 7.1 - Próxima Semana
- [ ] Criar página dinâmica de categorias ([16 - seo-guia-integracao.md](16 - seo-guia-integracao.md), Passo 6)
- [ ] Melhorar RSS feed ([16 - seo-guia-integracao.md](16 - seo-guia-integracao.md), Passo 7)
- [ ] Testar Web Vitals em [PageSpeed Insights](https://pagespeed.web.dev/)

### 7.2 - Próximo Mês
- [ ] Implementar FAQ Schema em páginas aplicáveis
- [ ] Otimizar imagens para WebP
- [ ] Adicionar preload de fontes críticas
- [ ] Melhorar Largest Contentful Paint (LCP)

### 7.3 - Próximos 3 Meses
- [ ] Análise de gap de conteúdo
- [ ] Estratégia de backlinks
- [ ] Topic clusters
- [ ] Link reclamation

---

## 🚨 TROUBLESHOOTING

### Problema: Build falha com erro em schema.tsx
**Solução:**
```bash
# Limpar cache
rm -rf .next/
# Reinstalar deps
npm install
# Tentar novamente
npm run build
```

### Problema: Schema não aparece no Rich Results Test
**Verificação:**
1. Abrir em navegador: https://euaggelion.com.br
2. Abrir DevTools (F12)
3. Ir para "Elements" (Elementos)
4. Procurar por `<script type="application/ld+json">`
5. Verificar se está no `<head>`
6. Copiar todo o JSON
7. Colar em https://validator.schema.org/

### Problema: og:image não é mostrada no compartilhamento social
**Verificação:**
1. Abrir artigo
2. Abrir DevTools
3. Procurar por `<meta property="og:image"`
4. Verificar se URL está completa e acessível
5. Se necessário, usar Facebook Debugger: https://developers.facebook.com/tools/debug/

### Problema: Sitemap.xml retorna erro 404
**Verificação:**
1. Ir para: https://euaggelion.com.br/sitemap.xml
2. Verificar se arquivo existe em `app/sitemap.tsx`
3. Verificar se o arquivo foi buildado
4. Verificar logs de build

---

## 📞 REFERÊNCIAS RÁPIDAS

| Ferramenta | URL |
|-----------|-----|
| Google Rich Results Test | https://search.google.com/test/rich-results |
| Schema.org Validator | https://validator.schema.org/ |
| Google PageSpeed | https://pagespeed.web.dev/ |
| GSC | https://search.google.com/search-console |
| GA4 | https://analytics.google.com/ |
| Facebook Debugger | https://developers.facebook.com/tools/debug/ |
| Twitter Card Validator | https://cards-dev.twitter.com/validator |

---

## 📊 TRACKING DE PROGRESSO

### Semana 1
- [ ] Documentação lida
- [ ] Arquivos revisados
- [ ] Build passou
- [ ] Validações realizadas

### Semana 2
- [ ] Breadcrumbs integrados
- [ ] RelatedArticles integrados
- [ ] Rich Results testados
- [ ] Sitemap submetido

### Semana 3-4
- [ ] GSC mostra dados
- [ ] Primeiros artigos indexados
- [ ] Schema validado
- [ ] Monitoramento iniciado

### Mês 1-3
- [ ] Impressões em aumento
- [ ] CTR melhorado
- [ ] Rich results visíveis
- [ ] Featured snippets ganhados

---

## 🎯 METAS

| Período | Meta |
|---------|------|
| Semana 1 | ✅ Implementação 100% |
| Semana 2 | ✅ Validação 100% |
| Semana 3 | ✅ Indexação iniciada |
| Mês 1 | +20% impressões |
| Mês 2 | +30% impressões |
| Mês 3 | +40-60% impressões |

---

## ✅ CONCLUSÃO

Após completar este checklist você terá:
- ✅ Implementado 10+ melhorias de SEO
- ✅ Validado em ferramentas do Google
- ✅ Submetido sitemap
- ✅ Iniciado monitoramento
- ✅ Posicionado para crescimento

**Parabéns! Seu site agora está otimizado! 🚀**

---

**Criado:** 4 de Janeiro de 2026  
**Status:** Pronto para ser seguido  
**Última atualização:** 4 de Janeiro de 2026
