# Fluxo de Dados

## Introdução

Este documento descreve o fluxo de dados no projeto "Euaggelion", incluindo como os dados são obtidos, processados e exibidos.

## Fontes de Dados

### Conteúdo Estático

- **Localização**: `content/`
- **Descrição**: Conteúdo estático em formato MDX.
- **Tipos de Conteúdo**:
  - Artigos (`content/articles/`)
  - Páginas (`content/pages/`)
  - Wiki (`content/wiki/`)

### APIs Externas

- **WebMentions**: Integração com webmentions para interações sociais.
- **Newsletter**: Integração com serviços de newsletter para envio de atualizações.

## Obtenção de Dados

### Funções de Obtenção

- **getArticles.ts**: Obtém artigos do diretório `content/articles/`.
- **getPages.ts**: Obtém páginas do diretório `content/pages/`.
- **getWiki.ts**: Obtém conteúdo da wiki do diretório `content/wiki/`.

### Exemplo de Uso

```typescript
import { getArticles } from '../lib/getArticles';

const articles = getArticles();
```

## Processamento de Dados

### Geração de Índice de Busca

- **Localização**: `lib/generateSearchIndex.js`
- **Descrição**: Gera um índice de busca para conteúdo estático.
- **Saída**: `public/search-index.json`

### Exemplo de Uso

```javascript
const generateSearchIndex = require('./lib/generateSearchIndex');
generateSearchIndex();
```

## Exibição de Dados

### Componentes de Exibição

- **Article**: Exibe artigos individuais.
- **Feed**: Exibe uma lista de artigos ou posts.
- **Page**: Exibe páginas estáticas.

### Exemplo de Uso

```typescript
import Article from '../components/content/Article';

const ArticlePage = ({ article }) => {
  return <Article article={article} />;
};
```

## Fluxo de Dados em APIs

### Rotas da API

- **Newsletter**: `app/api/newsletter/route.ts`
- **Search**: `app/api/search/route.tsx`
- **WebMentions**: `app/api/webmentions/route.tsx`

### Exemplo de Rota de API

```typescript
// app/api/newsletter/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  // Processa os dados da newsletter
  return NextResponse.json({ success: true });
}
```

## Fluxo de Dados em Busca

### Hook de Busca

- **Localização**: `hooks/useSearch.tsx`
- **Descrição**: Fornece lógica para busca de conteúdo.

### Exemplo de Uso

```typescript
import { useSearch } from '../hooks/useSearch';

const SearchPage = () => {
  const { results, search } = useSearch();
  
  return (
    <div>
      <input onChange={(e) => search(e.target.value)} />
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
};
```

## Conclusão

O fluxo de dados no projeto "Euaggelion" é projetado para ser eficiente e modular. Os dados são obtidos de conteúdo estático e APIs externas, processados conforme necessário e exibidos através de componentes reutilizáveis.
