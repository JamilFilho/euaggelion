# 2026-01-05 - Implementação de Sistema de Filtragem de Conteúdo

## Resumo
Implementado sistema de filtragem avançado para artigos, permitindo filtrar por:
- **Data de Publicação** (Crescente/Decrescente) - Para todas as categorias
- **Autor** - Com seletor que aparece quando o filtro é ativado
- **Testamento** (AT/NT) - Mantém comportamento existente em verso-a-verso

## Arquivo Modificados

### Componentes Feed
1. **components/content/Feed/FeedProvider.tsx**
   - Adicionado suporte a múltiplos tipos de filtro: `testament | date | author`
   - Novo estado: `filterType`, `authorFilter`
   - Lista dinâmica de autores extraída dos artigos
   - Lógica de ordenação por data (ASC/DESC)
   - Lógica de filtragem por autor

2. **components/content/Feed/FeedHeader.tsx**
   - Novo design com seletor de tipo de filtro
   - Props: `allowDateFilter` e `allowAuthorFilter`
   - Comportamento diferente baseado no tipo de categoria
   - Seletor de autor aparece apenas quando filtro por autor está ativo

3. **components/content/Feed/FeedRoot.tsx**
   - Interface Article atualizada com campos `author` e `date`

### Páginas
4. **app/s/[category]/page.tsx**
   - Feed.Header atualizado com: `allowDateFilter={category !== "verso-a-verso"}` e `allowAuthorFilter={true}`

## Implementação Técnica

### Estados Adicionados no FeedProvider
```typescript
filterType: "testament" | "date" | "author"
authorFilter?: string
authors: string[]
```

### Handlers Adicionados
```typescript
onFilterTypeChange: (type: FilterType) => void
onAuthorFilterChange: (author: string) => void
```

### Lógica de Filtragem

**Por Data:**
- Ordena artigos por data de publicação
- `desc` = Mais recentes primeiro (padrão)
- `asc` = Mais antigos primeiro

**Por Autor:**
- Lista de autores gerada dinamicamente do conjunto de artigos
- Filtra artigos por autor selecionado
- Mantém ordenação por data (desc)

**Por Testamento:**
- Comportamento existente mantido (verso-a-verso)

## Estrutura de Dados

Os artigos devem conter:
```typescript
interface Article {
    slug: string
    title: string
    description: string
    category: string
    testament?: "at" | "nt"      // Para verso-a-verso
    author?: string              // Para filtro por autor
    date?: string               // Para filtro por data
    isWiki?: boolean
    count?: number
}
```

## Documentação

Criado arquivo: `instructions/context/23 - sistema-filtragem-conteudo.md`
Com detalhes sobre:
- Estrutura dos componentes
- Como usar os filtros
- Exemplos práticos
- Notas técnicas
- Futuras melhorias

## Comportamento por Categoria

### Verso-a-Verso
- Mostra apenas filtro de Testamento (AT/NT)
- Header visível apenas para esta categoria

### Outras Categorias
- Mostra seletor de tipo de filtro: Data ou Autor
- Se Data: Mais Recentes/Mais Antigos
- Se Autor: Lista de autores disponíveis
- Paginação automática baseada em resultados filtrados

## Home Page e Outros Usos
- Mantém comportamento existente (`show={false}`)
- Sem mudanças visuais para o usuário nesses contextos

## Próximas Etapas (Opcional)
- [ ] URL state para manter filtro ao recarregar
- [ ] Persistência em localStorage
- [ ] Indicador visual de filtro ativo
- [ ] Combinação de filtros (data AND autor)
- [ ] Mais opções de ordenação
