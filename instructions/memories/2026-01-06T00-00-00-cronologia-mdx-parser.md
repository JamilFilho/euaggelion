# Implementação do Sistema de Cronologia MDX

**Data**: 2026-01-06  
**Tipo**: Feature  
**Escopo**: Processamento de MDX, Componentes React, Plugins Remark/Rehype  
**Status**: Completo ✅

## Resumo

Implementação de um sistema completo de cronologia em MDX que permite autores criar timelines interativas usando blocos de código YAML em arquivos MDX. O sistema utiliza plugins Remark e Rehype personalizados para processar os blocos durante o build e renderizar componentes React interativos no runtime.

## Motivação

O projeto já possuía um sistema de cronologia baseado em arquivos JSON ([24 - sistema-cronologia-biblica.md](../context/24%20-%20sistema-cronologia-biblica.md)), mas requeria que autores criassem arquivos separados e referenciassem manualmente em artigos. A necessidade de simplificar o fluxo de criação e permitir cronologias inline nos artigos motivou esta implementação.

## Solução Implementada

### Arquitetura

**Pipeline de Processamento**:
```
MDX File (chronology: block)
    ↓
remarkChronologyParser
    ├─ Detecta código com lang="chronology"
    ├─ Parse YAML → JSON
    ├─ Codifica base64
    └─ Insere HTML comment
    ↓
rehypeChronologyParser
    ├─ Detecta HTML comments
    ├─ Decodifica base64
    └─ Cria <chronologyblock> element
    ↓
MDXRemote Component Mapping
    └─ Mapeia chronologyblock → ChronologyBlock
    ↓
ChronologyBlock React Component
    ├─ Parse JSON data
    ├─ Provide ChronologyProvider context
    └─ Render ChronologyTimeline
```

### Tecnologias Utilizadas

- **Remark/Rehype**: Plugins para processamento de Markdown/HTML
- **js-yaml**: Parse de YAML para JSON
- **unist-util-visit**: Navegação de AST
- **next-mdx-remote/rsc**: Renderização de MDX com componentes customizados
- **Base64**: Codificação segura de dados entre plugins

## Alterações Realizadas

### 1. Criação de Plugins

#### remarkChronologyParser (`lib/remarkChronologyParser.ts`)

**Criado**: 2026-01-06

Funcionalidade:
- Plugin Remark que intercepta blocos de código
- Filtra apenas blocos com `lang="chronology"`
- Parse YAML usando `js-yaml`
- Codifica dados em base64
- Substitui node code por HTML comment especial

**Código principal**:
```typescript
import { visit } from 'unist-util-visit';
import type { Root, Code } from 'mdast';
import YAML from 'js-yaml';

export function remarkChronologyParser() {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code, index, parent) => {
      if (node.lang === 'chronology') {
        const data = YAML.load(node.value);
        const jsonString = JSON.stringify(data);
        const base64Data = Buffer.from(jsonString).toString('base64');
        
        const commentNode = {
          type: 'html',
          value: `<!-- CHRONOLOGY_DATA:${base64Data} -->`
        };
        
        parent.children[index] = commentNode;
      }
    });
  };
}
```

**Dependências adicionadas**:
- `unist-util-visit@^5.0.0`
- `@types/mdast@^4.0.0`

#### rehypeChronologyParser (`lib/rehypeChronologyParser.ts`)

**Criado**: 2026-01-06

Funcionalidade:
- Plugin Rehype que processa HTML
- Busca comentários com `CHRONOLOGY_DATA:`
- Decodifica base64
- Cria elemento customizado `<chronologyblock>`

**Código principal**:
```typescript
import { visit } from 'unist-util-visit';
import type { Root, Element, Comment, Parent } from 'hast';

export function rehypeChronologyParser() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent: Parent) => {
      if (node.tagName === 'p') {
        const commentChild = node.children.find(
          (child) => child.type === 'comment'
        ) as Comment | undefined;
        
        if (commentChild) {
          const match = /CHRONOLOGY_DATA:([A-Za-z0-9+/=]+)/.exec(
            commentChild.value
          );
          
          if (match) {
            const base64Data = match[1];
            const chronologyElement: Element = {
              type: 'element',
              tagName: 'chronologyblock',
              properties: { dataChronology: base64Data },
              children: [],
            };
            parent.children[index] = chronologyElement;
          }
        }
      }
    });
  };
}
```

**Dependências adicionadas**:
- `@types/hast@^3.0.0`

### 2. Componente React

#### ChronologyBlock (`components/content/Chronology/ChronologyBlock.tsx`)

**Criado**: 2026-01-06

Funcionalidade:
- Componente client-side que renderiza timeline
- Recebe dados via prop `dataChronology` (base64)
- Decodifica e parse JSON
- Utiliza ChronologyProvider existente
- Renderiza ChronologyTimeline

**Código completo**:
```typescript
'use client';

import React, { useMemo } from 'react';
import { ChronologyProvider } from '@/lib/context/ChronologyContext';
import * as Chronology from '@/components/content/Chronology';

interface ChronologyBlockProps {
  dataChronology: string;
}

export function ChronologyBlock({ dataChronology }: ChronologyBlockProps) {
  const events = useMemo(() => {
    if (!dataChronology) return [];
    
    try {
      const jsonString = Buffer.from(dataChronology, 'base64').toString('utf-8');
      const parsedData = JSON.parse(jsonString);
      return Array.isArray(parsedData) ? parsedData : [parsedData];
    } catch (error) {
      console.error('Error parsing chronology data:', error);
      return [];
    }
  }, [dataChronology]);

  if (events.length === 0) {
    return null;
  }

  return (
    <ChronologyProvider initialEvents={events}>
      <Chronology.Timeline />
    </ChronologyProvider>
  );
}
```

**Exportação atualizada** (`components/content/Chronology/index.tsx`):
```typescript
export { ChronologyBlock } from './ChronologyBlock';
```

### 3. Integração em Páginas MDX

#### app/[slug]/page.tsx

**Modificado**: 2026-01-06

**Alterações**:
1. Importação de plugins:
```typescript
import { remarkChronologyParser } from '@/lib/remarkChronologyParser';
import { rehypeChronologyParser } from '@/lib/rehypeChronologyParser';
import { ChronologyBlock } from '@/components/content/Chronology/ChronologyBlock';
```

2. Configuração mdxOptions:
```typescript
const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [
      remarkChronologyParser, // Adicionado
      remarkGfm,
    ],
    rehypePlugins: [
      rehypeChronologyParser, // Adicionado
      rehypeSlug,
      [rehypeAutolinkHeadings, headingAutolinkOptions],
    ],
  },
  components: {
    chronologyblock: ChronologyBlock as any, // Adicionado
  } as any,
};
```

#### app/wiki/[category]/[slug]/page.tsx

**Modificado**: 2026-01-06

**Alterações**: Idênticas às de `app/[slug]/page.tsx`

#### app/p/[page]/page.tsx

**Modificado**: 2026-01-06

**Alterações**: Idênticas às de `app/[slug]/page.tsx`

### 4. Configuração Next.js

#### next.config.ts

**Status**: Mantido simples (sem plugins)

**Razão**: Next.js 16 com @next/mdx tem limitações de serialização. Plugins complexos devem ser configurados em `next-mdx-remote` em cada página.

**Configuração atual**:
```typescript
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
```

### 5. Script de Teste

#### test-chronology-parser.ts

**Criado**: 2026-01-06

Funcionalidade:
- Valida funcionamento dos parsers
- Testa parse de YAML
- Testa codificação/decodificação base64
- Mostra estrutura de dados

**Uso**:
```bash
npx tsx test-chronology-parser.ts
```

**Resultado esperado**:
```
🧪 Teste do Parser de Cronologia MDX
===========================================

✅ YAML parseado com sucesso!
✅ Codificação base64 OK!
✅ Decodificação base64 OK!
✅ Dados JSON recuperados corretamente!

Estrutura final dos dados:
[{ evento, descrição, datas, referências }]
```

## Estrutura de Dados

### Input (YAML)

```yaml
- yearStart: 27
  monthStart: "Janeiro"
  yearEnd: 29
  monthEnd: "Dezembro"
  event: "Ministério de Jesus"
  description: "Descrição detalhada do período histórico."
  reference:
    - text: "Mateus 4:17"
      url: "/biblia/mateus/4"
    - text: "João 1:14"
      url: "/biblia/joao/1"
  track: 1
```

### Campos Suportados

**Obrigatórios**:
- `event` (string): Nome do evento
- `description` (string): Descrição do evento

**Datas** (escolha um formato):
- Intervalo: `yearStart`, `yearEnd`, `monthStart`, `monthEnd`
- Específico: `year`, `month`, `day`

**Opcionais**:
- `reference` (array): Array de objetos `{text, url}`
- `track` (number): Linha paralela na timeline

### Output (JSON)

```json
[
  {
    "yearStart": 27,
    "monthStart": "Janeiro",
    "yearEnd": 29,
    "monthEnd": "Dezembro",
    "event": "Ministério de Jesus",
    "description": "Descrição detalhada...",
    "reference": [
      { "text": "Mateus 4:17", "url": "/biblia/mateus/4" },
      { "text": "João 1:14", "url": "/biblia/joao/1" }
    ],
    "track": 1
  }
]
```

## Desafios e Soluções

### Desafio 1: Erro de Serialização MDX

**Problema**: 
```
Error: loader D:\Projects\euaggelion\node_modules\@next\mdx\mdx-js-loader.js
for match does not have serializable options
```

**Causa**: 
Next.js 16 com @next/mdx não suporta plugins complexos em `createMDX()` devido a limitações de serialização do webpack/turbopack.

**Tentativa 1 (falhou)**:
```typescript
// next.config.ts
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkChronologyParser], // ❌ Não serializa
    rehypePlugins: [rehypeChronologyParser],
  },
});
```

**Solução implementada**:
- Manteve `next.config.ts` simples
- Moveu configuração de plugins para `next-mdx-remote` em cada página
- Plugins são importados e configurados em `mdxOptions` por página

**Resultado**: ✅ Dev server inicia sem erros

### Desafio 2: Passagem de Dados entre Plugins

**Problema**: Como passar dados estruturados do Remark (Markdown AST) para Rehype (HTML AST)?

**Soluções consideradas**:
1. ❌ Usar frontmatter - não funciona para múltiplos blocos
2. ❌ Usar data attributes - limitações de serialização
3. ✅ HTML comments com base64 - escolhido

**Implementação**:
- Remark insere: `<!-- CHRONOLOGY_DATA:base64string -->`
- Rehype detecta comentário e extrai base64
- Base64 garante dados complexos sem escape issues

### Desafio 3: Componente Client vs Server

**Problema**: ChronologyTimeline requer interatividade (zoom, scroll)

**Solução**:
- ChronologyBlock marcado como `'use client'`
- Parse de dados em `useMemo` para otimização
- Renderização server-side do MDX até o elemento customizado
- Hidratação client-side do ChronologyBlock

## Validação

### Checklist de Testes

- ✅ TypeScript compila sem erros (`npx tsc --noEmit`)
- ✅ Parser de YAML funciona (script de teste)
- ✅ Codificação base64 correta
- ✅ Decodificação base64 correta
- ✅ Dev server inicia sem erros
- ✅ Componente renderiza timeline
- ✅ Interatividade funciona (zoom, scroll)
- ✅ Referências são clicáveis
- ✅ Responsivo (desktop, tablet, mobile)
- ✅ Tema claro/escuro funciona

### Comandos de Validação

```bash
# TypeScript
npx tsc --noEmit

# Parser test
npx tsx test-chronology-parser.ts

# Dev server
npm run dev
```

## Arquivos Criados

```
lib/
  remarkChronologyParser.ts          # Plugin Remark
  rehypeChronologyParser.ts          # Plugin Rehype

components/content/Chronology/
  ChronologyBlock.tsx                # Componente React

test-chronology-parser.ts            # Script de validação
```

## Arquivos Modificados

```
app/[slug]/page.tsx                  # Integração plugins + componente
app/wiki/[category]/[slug]/page.tsx  # Integração plugins + componente
app/p/[page]/page.tsx                # Integração plugins + componente

components/content/Chronology/
  index.tsx                          # Export ChronologyBlock

instructions/context/
  25 - sistema-cronologia-mdx.md     # Documentação técnica

instructions/memories/
  2026-01-06T00-00-00-cronologia-mdx-parser.md  # Este arquivo
```

## Dependências Instaladas

```json
{
  "dependencies": {
    "unist-util-visit": "^5.0.0"
  },
  "devDependencies": {
    "@types/mdast": "^4.0.0",
    "@types/hast": "^3.0.0"
  }
}
```

**Nota**: `js-yaml` e `@types/js-yaml` já estavam instalados.

## Exemplo de Uso

```markdown
---
title: "Cronologia da Vida de Jesus"
---

# A Vida de Jesus

Este artigo apresenta os principais eventos da vida de Jesus.

```chronology
- yearStart: 6
  monthStart: "Abril"
  yearEnd: 4
  monthEnd: "Março"
  event: "Nascimento de Jesus"
  description: "Jesus nasce em Belém durante o reinado de Herodes, o Grande."
  reference:
    - text: "Mateus 2:1"
      url: "/biblia/mateus/2"
    - text: "Lucas 2:1-7"
      url: "/biblia/lucas/2"

- yearStart: 27
  monthStart: "Outubro"
  yearEnd: 30
  monthEnd: "Abril"
  event: "Ministério Público"
  description: "Jesus percorre a Palestina pregando o Evangelho e realizando milagres."
  reference:
    - text: "Mateus 4:17"
      url: "/biblia/mateus/4"
  track: 1

- year: 30
  month: "Abril"
  event: "Crucificação e Ressurreição"
  description: "Jesus é crucificado e ressuscita ao terceiro dia."
  reference:
    - text: "Mateus 27-28"
      url: "/biblia/mateus/27"
```
```

Mais conteúdo do artigo...
```

## Benefícios

1. **Simplicidade**: Autores escrevem YAML inline, sem arquivos externos
2. **Consistência**: Usa componentes existentes do sistema de cronologia
3. **Performance**: Processamento em build-time, renderização otimizada
4. **Flexibilidade**: Múltiplas cronologias por artigo
5. **Manutenibilidade**: Código separado em plugins pequenos e focados
6. **Reutilização**: Aproveita ChronologyProvider e ChronologyTimeline existentes

## Próximos Passos (Futuro)

### Possíveis Melhorias

1. **Validação de Schema**:
   - Adicionar Zod para validar estrutura YAML
   - Mensagens de erro mais claras

2. **Editor Visual**:
   - Interface no Tina CMS para criar cronologias
   - Preview em tempo real

3. **Exportação**:
   - Permitir download de cronologia como JSON/CSV
   - Compartilhamento de timeline

4. **Acessibilidade**:
   - ARIA labels para eventos
   - Navegação por teclado melhorada

5. **Otimização**:
   - Lazy loading para cronologias grandes
   - Virtualização de timeline

## Referências

- [Remark Plugin Documentation](https://github.com/remarkjs/remark/blob/main/doc/plugins.md)
- [Rehype Plugin Documentation](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md)
- [next-mdx-remote Documentation](https://github.com/hashicorp/next-mdx-remote)
- [unist-util-visit](https://github.com/syntax-tree/unist-util-visit)
- [js-yaml](https://github.com/nodeca/js-yaml)

## Veja Também

- [Sistema de Cronologia Bíblica](../context/24%20-%20sistema-cronologia-biblica.md)
- [Sistema de Cronologia MDX](../context/25%20-%20sistema-cronologia-mdx.md)
- [Conteúdo e MDX](../context/09%20-%20conteudo-mdx.md)
