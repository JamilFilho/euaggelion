# Estrutura de Pastas

## Visão Geral

A estrutura de pastas do projeto "Euaggelion" é organizada para facilitar a manutenção e escalabilidade. Abaixo está uma descrição detalhada das pastas e seus propósitos.

## Raiz do Projeto

- **components.json**: Configurações para componentes.
- **eslint.config.mjs**: Configuração do ESLint para linting de código.
- **mdx-components.tsx**: Componentes personalizados para MDX.
- **next-env.d.ts**: Definições de tipo para Next.js.
- **next.config.ts**: Configuração do Next.js.
- **package.json**: Dependências e scripts do projeto.
- **postcss.config.js**: Configuração do PostCSS.
- **postcss.config.mjs**: Configuração do PostCSS em formato ES Module.
- **README.md**: Documentação principal do projeto.
- **tailwind.config.js**: Configuração do Tailwind CSS.
- **tsconfig.json**: Configuração do TypeScript.

## Pasta `app`

A pasta `app` contém a lógica principal da aplicação, incluindo rotas e layouts.

- **layout.tsx**: Layout principal da aplicação.
- **page.tsx**: Página inicial.
- **sitemap.tsx**: Configuração do sitemap.
- **manifest.ts**: Configuração do manifesto PWA.
- **actions.ts**: Ações do servidor.
- **api/**: Rotas da API.
  - **newsletter/route.ts**: Rota para newsletter.
  - **search/route.tsx**: Rota para busca.
  - **webmentions/route.tsx**: Rota para webmentions.
  - **bible/**: Rotas para a Bíblia.
  - **manual-notify/**: Rota para notificações manuais.
  - **tina-webhook/**: Rota para webhook do TinaCMS.
- **feed/route.tsx**: Rota para feed.
- **p/**: Páginas de conteúdo.
- **s/**: Páginas de busca.
- **wiki/**: Páginas da wiki.
- **biblia/**: Páginas da Bíblia.
  - **layout.tsx**: Layout da Bíblia.
  - **page.tsx**: Página inicial da Bíblia.
  - **[version]/**: Páginas de versão da Bíblia.
    - **page.tsx**: Página de versão da Bíblia.
    - **[book]/**: Páginas de livros da Bíblia.
      - **page.tsx**: Página de livro da Bíblia.
      - **[chapter]/**: Páginas de capítulos da Bíblia.
        - **layout.tsx**: Layout de capítulo da Bíblia.
        - **page.tsx**: Página de capítulo da Bíblia.

## Pasta `components`

Contém componentes reutilizáveis da aplicação.

- **pushNotification.tsx**: Componente para notificações push.
- **webMentions.tsx**: Componente para webmentions.
- **content/**: Componentes de conteúdo.
  - **search.tsx**: Componente de busca.
  - **thumbnail.tsx**: Componente de miniaturas.
  - **Article/**: Componentes de artigos.
  - **Bible/**: Componentes da Bíblia.
    - **BibleHomeLink.tsx**: Componente para link da página inicial da Bíblia.
    - **BibleVersionSelector.tsx**: Componente para seleção de versão da Bíblia.
    - **BibleRoot.tsx**: Componente raiz da Bíblia.
    - **BibleHeader.tsx**: Componente de cabeçalho da Bíblia.
    - **BibleBooks.tsx**: Componente de livros da Bíblia.
    - **BibleBooksItems.tsx**: Componente de itens de livros da Bíblia.
    - **BibleContent.tsx**: Componente de conteúdo da Bíblia.
  - **Feed/**: Componentes de feed.
  - **Page/**: Componentes de página.
- **layout/**: Componentes de layout.
  - **Newsletter/**: Componentes de newsletter.
  - **PWA/**: Componentes de PWA.
  - **SiteFooter/**: Componentes de rodapé do site.
  - **SiteHeader/**: Componentes de cabeçalho do site.
  - **SiteNavigation/**: Componentes de navegação do site.
- **ui/**: Componentes de UI.
  - **badge.tsx**: Componente de badge.
  - **button.tsx**: Componente de botão.
  - **dialog.tsx**: Componente de dialog.
  - **drawer.tsx**: Componente de drawer.
  - **input.tsx**: Componente de input.
  - **item.tsx**: Componente de item.
  - **navigation-menu.tsx**: Componente de menu de navegação.
  - **pagination.tsx**: Componente de paginação.
  - **select.tsx**: Componente de seleção.
  - **separator.tsx**: Componente de separador.
  - **sonner.tsx**: Componente de notificações toast.

## Pasta `content`

Contém o conteúdo da aplicação em formato MDX.

- **articles/**: Artigos em MDX.
- **pages/**: Páginas em MDX.
- **wiki/**: Conteúdo da wiki em MDX.

## Pasta `hooks`

Contém hooks personalizados.

- **useSearch.tsx**: Hook para funcionalidade de busca.

## Pasta `lib`

Contém utilitários e funções auxiliares.

- **categories.tsx**: Funções para categorias.
- **generateSearchIndex.ts**: Geração de índice de busca.
- **getArticles.ts**: Funções para obter artigos.
- **getBible.ts**: Funções para obter dados da Bíblia.
- **getPages.ts**: Funções para obter páginas.
- **getWiki.ts**: Funções para obter conteúdo da wiki.
- **kv.tsx**: Funções para armazenamento chave-valor.
- **relativeDate.ts**: Funções para datas relativas.
- **timeReader.ts**: Funções para obter tempo de leitura dos artigos.
- **utils.ts**: Funções utilitárias.
- **webMentions.tsx**: Funções para webmentions.
- **context/**: Contexto da aplicação.
  - **BibleVersionContext.tsx**: Contexto para gerenciamento da versão da Bíblia.

## Pasta `public`

Contém arquivos públicos.

- **search-index.json**: Índice de busca.
- **robots.txt**: Configuração para robôs de busca.
- **sw.js**: Service Worker para PWA.
- **admin/**: Arquivos de administração.
- **pwa/**: Arquivos para PWA.

## Pasta `scripts`

Contém scripts de automação.

- **archive-wayback.js**: Script para arquivamento do site no Wayback Machine.
- **structure-bible.py**: Script para estruturação da Bíblia.
- **test-webpush-auth.js**: Script para teste de autenticação de notificações push.

## Pasta `data`

Contém dados da aplicação.

- **as21.json**: Dados da versão AS21 da Bíblia.
- **jfaa.json**: Dados da versão JFAA da Bíblia.
- **kja.json**: Dados da versão KJA da Bíblia.
- **kjf.json**: Dados da versão KJF da Bíblia.
- **naa.json**: Dados da versão NAA da Bíblia.
- **nbv.json**: Dados da versão NBV da Bíblia.
- **ntlh.json**: Dados da versão NTLH da Bíblia.
- **nvi.json**: Dados da versão NVI da Bíblia.
- **tb.json**: Dados da versão TB da Bíblia.

## Pasta `styles`

Contém estilos globais.

- **globals.css**: Estilos globais.

## Pasta `instructions`

Contém documentação e instruções para o projeto.

- **context/**: Contexto do projeto.
  - **00 - indice.md**: Índice da documentação.
  - **01 - visao-geral.md**: Visão geral do projeto.
  - **02 - estrutura-pastas.md**: Estrutura de pastas.
  - **03 - tecnologias.md**: Tecnologias utilizadas.
  - **04 - padroes-codificacao.md**: Padrões de codificação.
  - **05 - componentes-principais.md**: Componentes principais.
  - **06 - fluxo-dados.md**: Fluxo de dados.
  - **07 - apis-rotas.md**: APIs e rotas.
  - **08 - estilos-ui.md**: Estilos e UI.
  - **09 - conteudo-mdx.md**: Conteúdo e MDX.
  - **10 - hooks-utilitarios.md**: Hooks e utilitários.
  - **11 - scripts-automacao.md**: Scripts e automação.
  - **12 - criacao-memorias.md**: Criação de memórias.
- **memories/**: Memórias de atualizações.
  - **2025-12-22T12-00-00.md**: Memória de atualização.
  - **2025-12-31T12-00-00.md**: Memória de atualização.
  - **2025-12-31T15-00-00.md**: Memória de atualização.
  - **2026-01-01T00-00-00.md**: Memória de atualização.

## Conclusão

A estrutura de pastas é projetada para ser intuitiva e modular, permitindo fácil navegação e manutenção do código.
