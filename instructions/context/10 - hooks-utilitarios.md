# Hooks e Utilitários

## Introdução

Este documento descreve os hooks personalizados e utilitários utilizados no projeto "Euaggelion", incluindo suas funcionalidades e como eles são utilizados.

## Hooks Personalizados

### useSearch

- **Localização**: `hooks/useSearch.tsx`
- **Descrição**: Hook para busca fuzzy em conteúdo usando Fuse.js.
- **Funcionalidades**:
  - Busca em tempo real com Fuse.js
  - Pesquisa em títulos, descrições e conteúdo
  - Configuração de pesos para diferentes campos
  - Limiar de relevância ajustável
  - Carregamento assíncrono do índice de busca
- **Parâmetros**:
  - `query`: String de busca
- **Retorno**: Array de itens correspondentes
- **Configuração Fuse.js**:
  - Título: peso 0.5 (mais importante)
  - Descrição: peso 0.3
  - Conteúdo: peso 0.2
  - Limiar: 0.3 (máximo para correspondência)
- **Integração**:
  - Carrega índice de `/search-index.json`
  - Usa cache do navegador para melhor desempenho

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

## Utilitários

### categories.tsx

- **Localização**: `lib/categories.tsx`
- **Descrição**: Funções para manipulação de categorias.
- **Funcionalidades**:
  - Obtém categorias de conteúdo.
  - Filtra conteúdo por categoria.

### Exemplo de Uso

```typescript
import { getCategories } from '../lib/categories';

const categories = getCategories();
```

### generateSearchIndex.js

- **Localização**: `lib/generateSearchIndex.js`
- **Descrição**: Gera um índice de busca para conteúdo estático.
- **Funcionalidades**:
  - Processa conteúdo MDX.
  - Gera um índice de busca em formato JSON.

### Exemplo de Uso

```javascript
const generateSearchIndex = require('./lib/generateSearchIndex');
generateSearchIndex();
```

### getArticles.ts

- **Localização**: `lib/getArticles.ts`
- **Descrição**: Obtém artigos do diretório `content/articles/`.
- **Funcionalidades**:
  - Lê arquivos MDX.
  - Processa metadados e conteúdo.

### Exemplo de Uso

```typescript
import { getArticles } from '../lib/getArticles';

const articles = getArticles();
```

### getPages.ts

- **Localização**: `lib/getPages.ts`
- **Descrição**: Obtém páginas do diretório `content/pages/`.
- **Funcionalidades**:
  - Lê arquivos MDX.
  - Processa metadados e conteúdo.

### Exemplo de Uso

```typescript
import { getPages } from '../lib/getPages';

const pages = getPages();
```

### getWiki.ts

- **Localização**: `lib/getWiki.ts`
- **Descrição**: Obtém conteúdo da wiki do diretório `content/wiki/`.
- **Funcionalidades**:
  - Lê arquivos MDX.
  - Processa metadados e conteúdo.

### Exemplo de Uso

```typescript
import { getWiki } from '../lib/getWiki';

const wiki = getWiki();
```

### relativeDate.ts

- **Localização**: `lib/relativeDate.ts`
- **Descrição**: Funções para datas relativas.
- **Funcionalidades**:
  - Converte datas para formato relativo (e.g., "há 2 dias").

### Exemplo de Uso

```typescript
import { formatRelativeDate } from '../lib/relativeDate';

const relativeDate = formatRelativeDate(new Date());
```

### timeReader.ts

- **Localização**: `lib/timeReader.ts`
- **Descrição**: Funções para leitura de tempo.
- **Funcionalidades**:
  - Estima o tempo de leitura de um conteúdo.

### Exemplo de Uso

```typescript
import { estimateReadingTime } from '../lib/timeReader';

const readingTime = estimateReadingTime(content);
```

### utils.ts

- **Localização**: `lib/utils.ts`
- **Descrição**: Funções utilitárias gerais.
- **Funcionalidades**:
  - Funções auxiliares para manipulação de dados.

### Exemplo de Uso

```typescript
import { slugify } from '../lib/utils';

const slug = slugify("Título do Artigo");
```

### webMentions.tsx

- **Localização**: `lib/webMentions.tsx`
- **Descrição**: Funções para integração com webmentions.
- **Funcionalidades**:
  - Obtém e processa webmentions.

### Exemplo de Uso

```typescript
import { getWebMentions } from '../lib/webMentions';

const webmentions = getWebMentions(url);
```

## Conclusão

Os hooks personalizados e utilitários do projeto "Euaggelion" são projetados para serem reutilizáveis e modulares. Eles fornecem funcionalidades essenciais como busca, manipulação de categorias e integração com webmentions, facilitando o desenvolvimento e manutenção do projeto.
