# Sistema de Cronologia em MDX

## Introdução

Este documento descreve o sistema de cronologia em MDX do projeto "Euaggelion", que permite criar timelines interativas diretamente em arquivos MDX usando blocos de código com sintaxe YAML.

## Conceito

O sistema permite que autores adicionem blocos de cronologia em artigos MDX usando uma sintaxe simples. Os blocos são automaticamente convertidos em timelines interativas durante o processamento do MDX.

## Como Funciona

### Fluxo de Processamento

1. **Build-time**: Arquivo MDX é lido
2. **Remark Plugin**: Detecta blocos com linguagem `chronology`
3. **Parse YAML**: Converte dados para JSON
4. **Codificação**: Dados são codificados em base64
5. **Rehype Plugin**: Processa HTML e cria elementos customizados
6. **Runtime**: Componente React renderiza a timeline interativa

### Arquitetura

```
Arquivo MDX
    ↓
remarkChronologyParser (lib/remarkChronologyParser.ts)
    ├─ Detecta blocos chronology:
    ├─ Parse YAML → JSON
    ├─ Codifica base64
    └─ Insere comentário especial
    ↓
rehypeChronologyParser (lib/rehypeChronologyParser.ts)
    ├─ Processa HTML
    ├─ Encontra comentários
    └─ Cria elementos <chronologyblock>
    ↓
MDXRemote com Componentes Customizados
    └─ Renderiza ChronologyBlock
    ↓
ChronologyBlock (components/content/Chronology/ChronologyBlock.tsx)
    ├─ Parse JSON
    ├─ ChronologyProvider
    └─ ChronologyTimeline interativa
```

## Sintaxe de Uso

### Formato Básico

```markdown
Algum texto antes...

```chronology
- yearStart: 27
  monthStart: "Janeiro"
  yearEnd: 29
  monthEnd: "Dezembro"
  event: "Ministério de Jesus"
  description: "Descrição detalhada do período histórico."
  reference:
    - text: "Mateus 4:17"
      url: "/biblia/mateus/4"
```
```

Texto depois...
```

## Estrutura de Dados

### Campos Obrigatórios

- **event** (string): Título/nome do evento
- **description** (string): Descrição detalhada do evento

### Campos de Data (escolha uma opção)

**Opção 1 - Intervalo de tempo:**
- **yearStart** (number): Ano inicial
- **yearEnd** (number): Ano final
- **monthStart** (string, opcional): Mês inicial (ex: "Janeiro")
- **monthEnd** (string, opcional): Mês final (ex: "Dezembro")

**Opção 2 - Data específica:**
- **year** (number): Ano específico
- **month** (string, opcional): Mês específico
- **day** (string, opcional): Dia específico

### Campos Opcionais

- **reference** (array): Array de referências
  - **text** (string): Texto do link
  - **url** (string): URL da referência
- **track** (number): Para criar linhas paralelas de eventos

## Exemplos de Uso

### Exemplo 1: Período Histórico

```markdown
```chronology
- yearStart: 27
  monthStart: "Janeiro"
  yearEnd: 29
  monthEnd: "Dezembro"
  event: "Ministério de Jesus"
  description: "Durante estes anos, Jesus percorreu a Palestina realizando milagres, ensinando sobre o Reino de Deus e formando seus discípulos."
  reference:
    - text: "Evangelho de Mateus"
      url: "/biblia/mateus"
    - text: "Evangelho de Marcos"
      url: "/biblia/marcos"
```
```

### Exemplo 2: Data Específica

```markdown
```chronology
- year: 33
  month: "Maio"
  event: "Pentecostes"
  description: "Dia em que o Espírito Santo foi derramado sobre os crentes em Jerusalém."
  reference:
    - text: "Atos 2"
      url: "/biblia/atos/2"
```
```

### Exemplo 3: Múltiplos Eventos

```markdown
```chronology
- yearStart: 33
  yearEnd: 64
  event: "Missões de Paulo"
  description: "Paulo realizou três viagens missionárias..."
  track: 1

- yearStart: 33
  yearEnd: 70
  event: "Ministério de Pedro"
  description: "Pedro liderou a Igreja em Jerusalém..."
  track: 2
```
```

## Componentes do Sistema

### 1. remarkChronologyParser

**Arquivo**: `lib/remarkChronologyParser.ts`

**Função**: Plugin Remark que:
- Detecta blocos de código com linguagem `chronology`
- Faz parse do YAML usando `js-yaml`
- Codifica dados em base64
- Insere comentário HTML especial no markdown

### 2. rehypeChronologyParser

**Arquivo**: `lib/rehypeChronologyParser.ts`

**Função**: Plugin Rehype que:
- Processa o HTML gerado pelo Remark
- Encontra comentários especiais de cronologia
- Cria elementos HTML customizados `<chronologyblock>`

### 3. ChronologyBlock

**Arquivo**: `components/content/Chronology/ChronologyBlock.tsx`

**Função**: Componente React client-side que:
- Recebe dados JSON via atributo `dataChronology`
- Faz parse dos dados
- Usa `ChronologyProvider` para fornecer contexto
- Renderiza `ChronologyTimeline` interativa

## Integração com MDX

### Configuração

O sistema está integrado em três páginas que usam MDX:

1. **app/[slug]/page.tsx** - Artigos
2. **app/wiki/[category]/[slug]/page.tsx** - Wiki
3. **app/p/[page]/page.tsx** - Páginas estáticas

Cada página importa e configura:

```typescript
import { remarkChronologyParser } from '@/lib/remarkChronologyParser';
import { rehypeChronologyParser } from '@/lib/rehypeChronologyParser';
import { ChronologyBlock } from '@/components/content/Chronology/ChronologyBlock';

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [
      remarkChronologyParser,
      remarkGfm,
    ],
    rehypePlugins: [
      rehypeChronologyParser,
      rehypeSlug,
      [rehypeAutolinkHeadings, headingAutolinkOptions],
    ],
  },
  components: {
    chronologyblock: ChronologyBlock as any,
  } as any,
};
```

## Funcionalidades

### Timeline Interativa

- ✅ Visualização de eventos em ordem cronológica
- ✅ Zoom in/out na timeline
- ✅ Navegação com scroll horizontal
- ✅ Botões de navegação (desktop)
- ✅ Touch-friendly (mobile)
- ✅ Eventos paralelos (tracks)
- ✅ Links clicáveis em referências

### Responsividade

- ✅ Layout otimizado para desktop
- ✅ Layout otimizado para tablet
- ✅ Layout otimizado para mobile
- ✅ Suporte a tema claro/escuro

## Validação e Testes

### Script de Teste

**Arquivo**: `test-chronology-parser.ts`

Valida:
- Parse de YAML
- Codificação/decodificação base64
- Estrutura de dados

**Uso**:
```bash
npx tsx test-chronology-parser.ts
```

### Validação TypeScript

```bash
npx tsc --noEmit
```

## Dependências

### Instaladas
- `unist-util-visit` - Navegação em AST
- `js-yaml` - Parse de YAML (já estava instalado)

### Existentes
- `@next/mdx` - MDX no Next.js
- `next-mdx-remote` - Renderização de MDX
- `remark-gfm` - Plugin Remark
- `rehype-slug` - Plugin Rehype

## Boas Práticas

### ✅ Faça

- Use descrições claras e bem estruturadas (100-300 caracteres)
- Adicione referências relevantes sempre que possível
- Use nomes de meses em português completos ("Janeiro", "Fevereiro")
- Organize eventos em ordem cronológica
- Use `track` para eventos paralelos/simultâneos
- Valide YAML em https://www.yamllint.com/ antes de publicar

### ❌ Evite

- Abreviaturas de meses ("Jan", "Fev")
- Descrições vazias ou muito longas (>500 caracteres)
- Caracteres especiais não escapados no YAML
- Mais de 20-30 eventos em um único bloco
- Misturar formatos de data

## Troubleshooting

### Cronologia não aparece

**Verificações**:
1. Linguagem do bloco é exatamente `` `chronology` ``?
2. YAML está bem formatado (indentação correta)?
3. Campos obrigatórios (`event`, `description`) presentes?
4. Console do navegador mostra erros?

### Erro de parsing YAML

**Causas comuns**:
- Aspas desapareadas
- Indentação irregular (use espaços, não tabs)
- Caracteres especiais não escapados
- `:` fora de strings não escapado

**Solução**: Valide em https://www.yamllint.com/

### Referências não aparecem

**Verificações**:
- Array indentado corretamente
- Aspas em `text` e `url`
- URL válida

## Performance

- Processamento em **build-time** (server-side)
- Renderização em **runtime** (client-side)
- Dados codificados para transporte eficiente
- Sem bloqueios no carregamento da página

## Segurança

- ✅ Dados validados no servidor
- ✅ Sem execução de código arbitrário
- ✅ Base64 apenas para transporte
- ✅ Sem vulnerabilidades XSS

## Compatibilidade

- Next.js 16.0.10+
- React 19.2.1+
- TypeScript 5+
- Navegadores modernos
- Mobile (iOS/Android)

## Casos de Uso

- Cronologia bíblica (eventos do AT e NT)
- História da Igreja
- Períodos históricos
- Testemunhos pessoais
- Jornadas espirituais
- Cronogramas educacionais

## Veja Também

- [Sistema de Cronologia Bíblica](24%20-%20sistema-cronologia-biblica.md) - Sistema com datasets JSON
- [Conteúdo e MDX](09%20-%20conteudo-mdx.md) - Informações sobre MDX no projeto
- [Componentes Principais](05%20-%20componentes-principais.md) - Arquitetura de componentes
