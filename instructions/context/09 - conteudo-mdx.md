# Conteúdo e MDX

## Introdução

Este documento descreve como o conteúdo é gerenciado e exibido no projeto "Euaggelion" usando MDX, um formato que combina Markdown e JSX.

## MDX

### Descrição

- **MDX**: Formato que permite a escrita de conteúdo em Markdown com a inclusão de componentes React.
- **Vantagens**:
  - Facilita a criação de conteúdo rico.
  - Permite a reutilização de componentes React.
  - Suporta metadados através de frontmatter.

### Exemplo de MDX

```markdown
---
title: "Artigo Exemplo"
date: "2023-10-01"
author: "Autor"
---

# Título do Artigo

Conteúdo do artigo...

<Article>
  # Título do Artigo
  
  Conteúdo do artigo...
</Article>
```

## Estrutura de Conteúdo

### Artigos

- **Localização**: `content/articles/`
- **Descrição**: Artigos em formato MDX.
- **Exemplo**:

  ```markdown
  ---
  title: "Artigo Exemplo"
  date: "2023-10-01"
  ---
  
  # Título do Artigo
  
  Conteúdo do artigo...
  ```

### Páginas

- **Localização**: `content/pages/`
- **Descrição**: Páginas estáticas em formato MDX.
- **Exemplo**:

  ```markdown
  ---
  title: "Página Exemplo"
  ---
  
  # Título da Página
  
  Conteúdo da página...
  ```

### Wiki

- **Localização**: `content/wiki/`
- **Descrição**: Conteúdo da wiki em formato MDX.
- **Exemplo**:

  ```markdown
  ---
  title: "Wiki Exemplo"
  ---
  
  # Título da Wiki
  
  Conteúdo da wiki...
  ```

## Componentes de Conteúdo

### Article

- **Localização**: `components/content/Article/`
- **Descrição**: Componente para exibição de artigos.
- **Funcionalidades**:
  - Renderiza conteúdo MDX.
  - Suporta metadados como título, data e autor.
  - Inclui funcionalidades de compartilhamento e comentários.

### Exemplo de Uso

```typescript
import Article from '../components/content/Article';

const ArticlePage = ({ article }) => {
  return <Article article={article} />;
};
```

### Feed

- **Localização**: `components/content/Feed/`
- **Descrição**: Componente para exibição de feeds de conteúdo.
- **Funcionalidades**:
  - Exibe uma lista de artigos ou posts.
  - Suporta paginação.

### Exemplo de Uso

```typescript
import Feed from '../components/content/Feed';

const FeedPage = ({ articles }) => {
  return <Feed articles={articles} />;
};
```

### Page

- **Localização**: `components/content/Page/`
- **Descrição**: Componente para exibição de páginas estáticas.
- **Funcionalidades**:
  - Renderiza conteúdo MDX.
  - Suporta metadados como título e descrição.

### Exemplo de Uso

```typescript
import Page from '../components/content/Page';

const PageExample = ({ page }) => {
  return <Page page={page} />;
};
```

## Obtenção de Conteúdo

### Funções de Obtenção

- **getArticles.ts**: Obtém artigos do diretório `content/articles/`.
- **getPages.ts**: Obtém páginas do diretório `content/pages/`.
- **getWiki.ts**: Obtém conteúdo da wiki do diretório `content/wiki/`.

### Exemplo de Uso

```typescript
import { getArticles } from '../lib/getArticles';

const articles = getArticles();
```

## Geração de Índice de Busca

### Descrição

- **Localização**: `lib/generateSearchIndex.js`
- **Descrição**: Gera um índice de busca para conteúdo estático.
- **Saída**: `public/search-index.json`

### Exemplo de Uso

```javascript
const generateSearchIndex = require('./lib/generateSearchIndex');
generateSearchIndex();
```

## Conclusão

O uso de MDX no projeto "Euaggelion" permite a criação de conteúdo rico e dinâmico, combinando a simplicidade do Markdown com a flexibilidade do React. Os componentes de conteúdo são projetados para serem reutilizáveis e fáceis de manter.
