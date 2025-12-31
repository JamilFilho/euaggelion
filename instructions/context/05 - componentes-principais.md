# Componentes Principais

## Introdução

Este documento descreve os componentes principais do projeto "Euaggelion", suas funcionalidades e como eles se integram à aplicação.

## Componentes de Layout

### SiteHeader

- **Localização**: `components/layout/SiteHeader/`
- **Descrição**: Cabeçalho principal do site, contendo navegação e branding.
- **Funcionalidades**:
  - Exibe o logo e título do site.
  - Fornece links de navegação para páginas principais.
  - Inclui um menu de navegação responsivo.

### SiteFooter

- **Localização**: `components/layout/SiteFooter/`
- **Descrição**: Rodapé do site, contendo informações adicionais e links.
- **Funcionalidades**:
  - Exibe informações de copyright.
  - Fornece links para páginas secundárias (e.g., privacidade, sobre).
  - Inclui links para redes sociais.

### SiteNavigation

- **Localização**: `components/layout/SiteNavigation/`
- **Descrição**: Componente de navegação principal.
- **Funcionalidades**:
  - Fornece links para categorias e seções do site.
  - Suporta navegação hierárquica.

## Componentes de UI

### Button

- **Localização**: `components/ui/button.tsx`
- **Descrição**: Componente de botão reutilizável.
- **Funcionalidades**:
  - Suporta diferentes variantes (e.g., primary, secondary).
  - Estilizado com Tailwind CSS.

### Input

- **Localização**: `components/ui/input.tsx`
- **Descrição**: Componente de entrada de texto.
- **Funcionalidades**:
  - Suporta diferentes tipos de entrada (e.g., text, email).

### SearchContent

- **Localização**: `components/content/search.tsx`
- **Descrição**: Componente de busca com interface modal.
- **Funcionalidades**:
  - Interface de busca full-screen
  - Pesquisa em tempo real com Fuse.js
  - Exibição de resultados com destaque
  - Navegação direta para artigos
  - Filtro por categorias
- **Integração**:
  - Usa o hook `useSearch` para busca client-side
  - Conecta com a API `/api/search` para obter índice
  - Interface com Dialog do Radix UI

### Webmentions

- **Localização**: `components/webMentions.tsx`
- **Descrição**: Componente para exibir interações sociais.
- **Funcionalidades**:
  - Exibição de comentários, curtidas e compartilhamentos
  - Filtro por tipo de interação
  - Carregamento assíncrono
  - Exibição de informações do autor
  - Formatação de datas
- **Integração**:
  - Conecta com a API `/api/webmentions`
  - Usa o serviço webmention.io
  - Suporte para diferentes tipos de webmentions

### PWA Install Button

- **Localização**: `components/layout/PWA/pwaPrompt.tsx`
- **Descrição**: Componente para instalação do Progressive Web App.
- **Funcionalidades**:
  - Detecção automática de capacidade de instalação
  - Prompt de instalação personalizado
  - Detecção de modo standalone
  - Feedback visual de sucesso
  - Gerenciamento do evento beforeinstallprompt
- **Integração**:
  - Usa a API PWA do navegador
  - Interface com ícone e botão
  - Notificações de sucesso com Sonner
  - Estilizado com Tailwind CSS.

### Dialog

- **Localização**: `components/ui/dialog.tsx`
- **Descrição**: Componente de diálogo modal.
- **Funcionalidades**:
  - Exibe conteúdo em um modal.
  - Suporta ações de confirmação e cancelamento.

### Drawer

- **Localização**: `components/ui/drawer.tsx`
- **Descrição**: Componente de gaveta lateral.
- **Funcionalidades**:
  - Exibe conteúdo em uma gaveta lateral.
  - Suporta ações de abertura e fechamento.

## Componentes de Conteúdo

### Article

- **Localização**: `components/content/Article/`
- **Descrição**: Componente para exibição de artigos.
- **Funcionalidades**:
  - Renderiza conteúdo MDX.
  - Suporta metadados como título, data e autor.
  - Inclui funcionalidades de compartilhamento e comentários.

### Feed

- **Localização**: `components/content/Feed/`
- **Descrição**: Componente para exibição de feeds de conteúdo.
- **Funcionalidades**:
  - Exibe uma lista de artigos ou posts.
  - Suporta paginação.

### Page

- **Localização**: `components/content/Page/`
- **Descrição**: Componente para exibição de páginas estáticas.
- **Funcionalidades**:
  - Renderiza conteúdo MDX.
  - Suporta metadados como título e descrição.

## Componentes de WebMentions

### WebMentions

- **Localização**: `components/webMentions.tsx`
- **Descrição**: Componente para integração com webmentions.
- **Funcionalidades**:
  - Exibe webmentions associados a um artigo ou página.
  - Suporta interações sociais como comentários e likes.

## Componentes de Busca

### Search

- **Localização**: `components/content/search.tsx`
- **Descrição**: Componente para funcionalidade de busca.
- **Funcionalidades**:
  - Permite busca por conteúdo no site.
  - Exibe resultados de busca.
  - Suporta filtros e ordenação.

## Hooks Personalizados

### useSearch

- **Localização**: `hooks/useSearch.tsx`
- **Descrição**: Hook para funcionalidade de busca.
- **Funcionalidades**:
  - Fornece lógica para busca de conteúdo.
  - Suporta filtros e ordenação.

## Conclusão

Os componentes principais do projeto "Euaggelion" são projetados para serem reutilizáveis, modulares e fáceis de manter. Eles são estilizados com Tailwind CSS e seguem os padrões de codificação do projeto.
