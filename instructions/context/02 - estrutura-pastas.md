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
- **api/**: Rotas da API.
  - **newsletter/route.ts**: Rota para newsletter.
  - **search/route.tsx**: Rota para busca.
  - **webmentions/route.tsx**: Rota para webmentions.
- **feed/route.tsx**: Rota para feed.
- **p/**: Páginas de conteúdo.
- **s/**: Páginas de busca.
- **wiki/**: Páginas da wiki.

## Pasta `components`

Contém componentes reutilizáveis da aplicação.

- **webMentions.tsx**: Componente para webmentions.
- **content/**: Componentes de conteúdo.
- **layout/**: Componentes de layout.
- **ui/**: Componentes de UI.

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
- **generateSearchIndex.js**: Geração de índice de busca.
- **getArticles.ts**: Funções para obter artigos.
- **getPages.ts**: Funções para obter páginas.
- **getWiki.ts**: Funções para obter conteúdo da wiki.
- **relativeDate.ts**: Funções para datas relativas.
- **timeReader.ts**: Funções para obter tempo de leitura dos artigos.
- **utils.ts**: Funções utilitárias.
- **webMentions.tsx**: Funções para webmentions.

## Pasta `public`

Contém arquivos públicos.

- **search-index.json**: Índice de busca.

## Pasta `scripts`

Contém scripts de automação.

- **archive-wayback.js**: Script para arquivamento do site no Wayback Machine.

## Pasta `styles`

Contém estilos globais.

- **globals.css**: Estilos globais.

## Pasta `ai`

Contém documentação para inteligência artificial.

- **indice.md**: Índice da documentação.
- **visao-geral.md**: Visão geral do projeto.
- **estrutura-pastas.md**: Estrutura de pastas.
- **tecnologias.md**: Tecnologias utilizadas.
- **padroes-codificacao.md**: Padrões de codificação.
- **componentes-principais.md**: Componentes principais.
- **fluxo-dados.md**: Fluxo de dados.
- **apis-rotas.md**: APIs e rotas.
- **estilos-ui.md**: Estilos e UI.
- **conteudo-mdx.md**: Conteúdo e MDX.
- **hooks-utilitarios.md**: Hooks e utilitários.
- **scripts-automacao.md**: Scripts e automação.

## Conclusão

A estrutura de pastas é projetada para ser intuitiva e modular, permitindo fácil navegação e manutenção do código.
