# Sistema de Filtragem de Conteúdo - Documentação

## Overview

Sistema de filtragem de artigos implementado no componente Feed, permitindo que usuários filtrem conteúdo por:
- **Data de Publicação**: Ordenar por mais recentes ou mais antigos
- **Autor**: Filtrar artigos por autor específico
- **Testamento**: Filtrar por Antigo/Novo Testamento (verso-a-verso)

## Estrutura

### Componentes Atualizados

#### 1. FeedProvider.tsx
Gerencia o estado da filtragem e oferece contexto para os componentes filhos.

**Props do contexto:**
```typescript
filterType: "testament" | "date" | "author"  // Tipo de filtro ativo
filter: string                                 // Valor do filtro
authorFilter?: string                          // Autor selecionado
authors: string[]                              // Lista de autores disponíveis
onFilterChange: (value: string) => void       // Muda o valor do filtro
onFilterTypeChange: (type: FilterType) => void // Muda o tipo de filtro
onAuthorFilterChange: (author: string) => void // Muda o autor filtrado
```

**Lógica de filtragem:**
- Testament: Filtra por AT/NT como antes
- Data: Ordena crescente (asc) ou decrescente (desc)
- Autor: Filtra por autor específico e ordena por data

#### 2. FeedHeader.tsx
Interface de seleção de filtros com suporte a múltiplas opções.

**Props:**
```typescript
show?: boolean                        // Mostra o header
home?: boolean                        // Modo home (sem filtros)
testamentOptions?: {...}[]           // Opções para filtro de testamento
allowDateFilter?: boolean            // Habilita filtro por data
allowAuthorFilter?: boolean          // Habilita filtro por autor
```

**Comportamento:**
- Se `allowDateFilter=false` e `allowAuthorFilter=false`: Mostra apenas filtro de testamento
- Se `allowDateFilter=true`: Mostra seletor de tipo de filtro + opções de data
- Se `allowAuthorFilter=true`: Permite selecionar autor após ativar filtro por autor

#### 3. FeedRoot.tsx
Atualizado para incluir campos `author` e `date` na interface Article.

#### 4. app/s/[category]/page.tsx
Atualizado para passar os novos props ao FeedHeader:

```typescript
<Feed.Header 
    show={category === "verso-a-verso"}
    allowDateFilter={category !== "verso-a-verso"}
    allowAuthorFilter={true}
/>
```

## Como Usar

### Para Verso-a-Verso
Mantém o comportamento original - filtro por Testamento:

```tsx
<Feed.Header show={true} />
```

### Para Outras Categorias
Ativa filtro por Data e Autor:

```tsx
<Feed.Header 
    show={true}
    allowDateFilter={true}
    allowAuthorFilter={true}
/>
```

## Fluxo de Filtragem

1. **Usuário seleciona tipo de filtro** (Data ou Autor)
2. **Se Data**: Seleciona ordem (Mais Recentes/Mais Antigos)
3. **Se Autor**: Seleciona autor da lista disponível
4. **Artigos são filtrados e ordenados** conforme seleção
5. **Paginação reinicia** na página 1

## Dados Necessários

Os artigos passados para o FeedProvider devem ter:

```typescript
interface Article {
    slug: string
    title: string
    description: string
    category: string
    testament?: "at" | "nt"
    author?: string        // Campo obrigatório para filtro por autor
    date?: string         // Campo obrigatório para ordenação por data
    isWiki?: boolean
    count?: number
}
```

## Integração com getArticlesByCategory

A função `getArticlesByCategory()` em `lib/getArticles.ts` já retorna os metadados necessários:
- `author`: Campo do MDX frontmatter
- `date`: Campo do MDX frontmatter
- `testament`: Campo do MDX frontmatter

Exemplo de artigo MDX:

```mdx
---
title: "Título do Artigo"
description: "Descrição"
date: "2024-01-15"
author: "Nome do Autor"
published: true
category: "teoleigo"
---
```

## Estilos

Os componentes usam Tailwind CSS com as classes do projeto:
- `.text-foreground/60`: Texto de label
- `.w-fit`: Largura automática do select
- `.ml-auto`: Alinhamento à direita
- `.gap-4`: Espaçamento entre elementos

## Estados

### Filtro de Data
```
Mais Recentes (desc) | Mais Antigos (asc)
```

### Filtro de Autor
Lista dinâmica gerada a partir dos autores únicos do conjunto de artigos.

## Exemplos de Uso no Projeto

### Página de Categoria (verso-a-verso)
```tsx
<Feed.Header show={true} /> // Mantém testamento
```

### Página de Categoria (outras)
```tsx
<Feed.Header 
    show={true}
    allowDateFilter={true}
    allowAuthorFilter={true}
/>
```

### Home Page
```tsx
<Feed.Header show={false} home> // Sem filtros
    <Feed.Name content={...} />
    <Feed.Description content={...} />
</Feed.Header>
```

## Notas Técnicas

- Filtragem acontece no lado do cliente (dentro do FeedProvider)
- Paginação se adapta automaticamente ao número de resultados filtrados
- Lista de autores é gerada dinamicamente a cada render
- Mudança de filtro reseta a paginação para página 1
- Ordenação por data usa `new Date().getTime()` para comparação

## Futuras Melhorias

- [ ] Filtros combinados (data AND autor)
- [ ] URL state (manter filtro ao recarregar página)
- [ ] Persistência de filtros (localStorage)
- [ ] Mais opções de ordenação (A-Z, por visualizações, etc)
- [ ] Indicador visual de filtro ativo
