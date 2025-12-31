# APIs e Rotas

## Introdução

Este documento descreve as APIs e rotas disponíveis no projeto "Euaggelion", incluindo suas funcionalidades e como elas são utilizadas.

## Rotas da API

### Newsletter

- **Localização**: `app/api/newsletter/route.ts`
- **Método**: POST
- **Descrição**: Rota para inscrição em newsletter com integração MailerLite.
- **Funcionalidades**:
  - Validação de email
  - Verificação de inscrições duplicadas
  - Integração com MailerLite API
  - Gerenciamento de grupos de assinantes
- **Autenticação**: Requere `MAILERLITE_API_KEY` e `MAILERLITE_GROUP_ID`
- **Exemplo de Request**:
  ```json
  {
    "email": "usuario@example.com"
  }
  ```
- **Exemplo de Response (Sucesso)**:
  ```json
  {
    "message": "Inscrição realizada com sucesso!"
  }
  ```
- **Exemplo de Response (Erro)**:
  ```json
  {
    "error": "Este email já está inscrito"
  }
  ```

### Exemplo de Uso

```typescript
// app/api/newsletter/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  // Processa os dados da newsletter
  return NextResponse.json({ success: true });
}
```

### Search

- **Localização**: `app/api/search/route.tsx`
- **Método**: GET
- **Descrição**: Rota para busca de conteúdo com cache otimizado.
- **Funcionalidades**:
  - Retorna índice de busca completo
  - Cache de 1 hora para melhor desempenho
  - Filtra apenas conteúdo publicado
  - Inclui metadados para busca fuzzy
- **Cache Headers**:
  ```
  Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
  ```
- **Integração**: Usado pelo hook `useSearch` com Fuse.js para busca client-side
- **Exemplo de Response**:
  ```json
  [
    {
      "slug": "nome-do-artigo",
      "title": "Título do Artigo",
      "description": "Descrição do artigo",
      "date": "2025-12-31",
      "category": "teologia",
      "tags": ["tag1", "tag2"],
      "testament": "Novo Testamento"
    }
  ]
  ```

### Webmentions

- **Localização**: `app/api/webmentions/route.tsx`
- **Método**: GET
- **Descrição**: Rota para buscar interações sociais (webmentions) para um artigo específico.
- **Funcionalidades**:
  - Integração com webmention.io
  - Suporte para diferentes tipos de interações
  - Cache de 5 minutos
  - Filtro por URL alvo
- **Parâmetros**:
  - `target` (obrigatório): URL do artigo
- **Autenticação**: Requere `WEBMENTION_IO_TOKEN`
- **Cache Headers**:
  ```
  Cache-Control: public, s-maxage=300, stale-while-revalidate=600
  ```
- **Tipos de Webmentions**:
  - `in-reply-to`: Comentários/respostas
  - `like-of`: Curtidas
  - `repost-of`: Compartilhamentos
  - `mention-of`: Menções
  - `bookmark-of`: Favoritos
- **Exemplo de Request**:
  ```
  GET /api/webmentions?target=https://euaggelion.com.br/artigo-exemplo
  ```
- **Exemplo de Response**:
  ```json
  {
    "mentions": [
      {
        "type": "entry",
        "author": {
          "name": "João Silva",
          "photo": "https://example.com/photo.jpg",
          "url": "https://example.com"
        },
        "url": "https://example.com/resposta",
        "published": "2025-12-31T10:00:00Z",
        "wm-received": "2025-12-31T10:05:00Z",
        "wm-id": 12345,
        "wm-property": "in-reply-to",
        "content": {
          "text": "Ótimo artigo! Concordo com sua análise."
        }
      }
    ],
    "count": 1
  }
  ```

### Exemplo de Uso

```typescript
// app/api/search/route.tsx
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  // Processa a busca
  return NextResponse.json({ results: [] });
}
```

### WebMentions

- **Localização**: `app/api/webmentions/route.tsx`
- **Método**: GET, POST
- **Descrição**: Rota para integração com webmentions.
- **Funcionalidades**:
  - Recebe e envia webmentions.
  - Retorna webmentions associados a um artigo ou página.

### Exemplo de Uso

```typescript
// app/api/webmentions/route.tsx
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  // Processa webmentions
  return NextResponse.json({ webmentions: [] });
}
```

## Rotas de Feed

### Feed

- **Localização**: `app/feed/route.tsx`
- **Método**: GET
- **Descrição**: Rota para geração de feed RSS.
- **Funcionalidades**:
  - Gera um feed RSS com os artigos mais recentes.
  - Retorna o feed em formato XML.

### Exemplo de Uso

```typescript
// app/feed/route.tsx
import { NextResponse } from 'next/server';

export async function GET() {
  const feed = generateFeed();
  return NextResponse.json(feed, { headers: { 'Content-Type': 'application/xml' } });
}
```

## Rotas de Páginas

### Página Inicial

- **Localização**: `app/page.tsx`
- **Descrição**: Página inicial do site.
- **Funcionalidades**:
  - Exibe uma lista de artigos recentes.
  - Fornece links para categorias e seções.

### Exemplo de Uso

```typescript
// app/page.tsx
import { getArticles } from '../lib/getArticles';

export default function Home() {
  const articles = getArticles();
  return (
    <div>
      <h1>Bem-vindo ao Euaggelion</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>{article.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Página de Artigo

- **Localização**: `app/[slug]/page.tsx`
- **Descrição**: Página para exibição de artigos individuais.
- **Funcionalidades**:
  - Exibe o conteúdo do artigo.
  - Fornece funcionalidades de compartilhamento e comentários.

### Exemplo de Uso

```typescript
// app/[slug]/page.tsx
import { getArticle } from '../lib/getArticles';

export default function ArticlePage({ params }) {
  const article = getArticle(params.slug);
  return (
    <div>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
}
```

## Conclusão

As APIs e rotas do projeto "Euaggelion" são projetadas para serem modulares e fáceis de manter. Elas fornecem funcionalidades essenciais como busca, newsletter e webmentions, além de rotas para exibição de conteúdo estático.
