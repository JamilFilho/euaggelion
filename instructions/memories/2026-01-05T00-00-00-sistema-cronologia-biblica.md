# Implementação do Sistema de Cronologia Bíblica

**Data**: 2026-01-05  
**Tipo**: Feature Implementation  
**Componente**: Chronology

## Resumo

Implementação completa do sistema de cronologia bíblica que permite criar linhas do tempo interativas de eventos bíblicos e históricos para enriquecer o conteúdo dos artigos.

## Alterações Realizadas

### 1. Componentes Criados

#### `/components/content/Chronology/index.tsx`
- Exporta os componentes usando padrão de composição
- `Chronology.Root`, `Chronology.Header`, `Chronology.Timeline`

#### `/components/content/Chronology/ChronologyRoot.tsx`
- Componente raiz que envolve toda a cronologia
- Adiciona bordas e espaçamento padrão
- Recebe props `dataset` e `timeline` (não utilizados diretamente, apenas para documentação)

#### `/components/content/Chronology/ChronologyHeader.tsx`
- Componente para cabeçalho da cronologia
- Espaçamento e borda inferior padrão
- Permite customização total do conteúdo

#### `/components/content/Chronology/ChronologyTimeline.tsx`
- Componente principal client-side da timeline
- Funcionalidades:
  - Carrega dados de datasets JSON via fetch
  - Usa contexto para pegar chronology do frontmatter
  - Combina ambas as fontes quando disponíveis
  - Scroll horizontal suave
  - Botões de navegação no desktop
  - Responsivo para mobile e desktop
  - Loading state
  - Empty state
- Renderiza cards de eventos com:
  - Marcador de ano (formatado como a.C. ou d.C.)
  - Mês/dia quando disponível
  - Nome do evento
  - Descrição
  - Referências bíblicas

### 2. Context Provider

#### `/lib/context/ChronologyContext.tsx`
- Context para compartilhar dados de chronology do frontmatter
- Provider envolve o conteúdo MDX
- Hook `useChronology()` para acessar os dados

### 3. Atualizações em getArticles

#### `/lib/getArticles.ts`
- Adicionada interface `ChronologyEvent`
- Adicionado campo `chronology` à interface `ArticleMeta`
- Parser do frontmatter agora extrai campo `chronology`

### 4. Integração com MDX

#### `/app/[slug]/page.tsx`
- Importado `ChronologyProvider` e `Chronology`
- Adicionados componentes Chronology às opções do MDX
- Conteúdo MDX envolvido com `ChronologyProvider`
- Passa `found.chronology` para o provider

### 5. Dataset Exemplo

#### `/content/chronology/jesus-ministry.json`
- Dataset completo do ministério de Jesus (27-30 d.C.)
- 20 eventos principais
- Estrutura com metadados do dataset e array de eventos
- Inclui referências bíblicas para cada evento

### 6. Documentação

#### `/instructions/context/24 - sistema-cronologia-biblica.md`
- Documentação completa do sistema
- Estrutura de dados detalhada
- Convenções de nomenclatura
- Exemplos de uso
- Diretrizes de criação

#### `/instructions/context/00 - indice.md`
- Adicionado link para documentação de cronologia

### 7. Exemplo de Uso

#### `/content/articles/teoleigo/teste.mdx`
- Atualizado com exemplos de uso do componente
- Demonstra uso com dataset
- Demonstra uso com frontmatter

## Estrutura de Dados

### Dataset JSON

```json
{
  "name": "Nome do período",
  "description": "Descrição do dataset",
  "period": {
    "start": 27,
    "end": 30
  },
  "events": [
    {
      "year": 27,
      "month": "Outono",
      "day": "Sexta-feira",
      "event": "Nome do Evento",
      "description": "Descrição detalhada",
      "reference": ["Mateus 3:13-17"]
    }
  ]
}
```

### Frontmatter

```yaml
chronology:
  - year: -4000
    event: "Criação do Mundo"
    description: "Deus cria o céu e a terra"
  - year: -2348
    event: "Dilúvio"
    description: "Deus envia um dilúvio para purificar a terra"
```

## Exemplos de Uso

### Com Dataset Pré-definido

```jsx
<Chronology.Root dataset="jesus-ministry">
  <Chronology.Header>
    <h3>Ministério de Jesus Cristo</h3>
    <p>Cronologia dos principais eventos (27-30 d.C.)</p>
  </Chronology.Header>
  <Chronology.Timeline dataset="jesus-ministry" />
</Chronology.Root>
```

### Com Frontmatter

```jsx
<Chronology.Root>
  <Chronology.Header>
    <h3>Eventos do Antigo Testamento</h3>
  </Chronology.Header>
  <Chronology.Timeline />
</Chronology.Root>
```

### Combinando Ambos

```jsx
<Chronology.Root dataset="jesus-ministry">
  <Chronology.Header>
    <h3>Cronologia Combinada</h3>
  </Chronology.Header>
  <Chronology.Timeline dataset="jesus-ministry" />
</Chronology.Root>
```
*Eventos do frontmatter serão mesclados com o dataset e ordenados por ano*

## Características Técnicas

### Responsividade
- Desktop: Scroll horizontal com botões de navegação
- Mobile: Scroll touch com hint visual

### Estilos
- Segue padrão visual do projeto
- Usa variáveis de tema (accent, secondary, foreground, etc.)
- Cards hover com transição suave
- Timeline visual com linha conectora

### Performance
- Fetch de datasets apenas quando necessário
- Memoização de eventos combinados
- Scroll suave com requestAnimationFrame

### Acessibilidade
- Labels ARIA nos botões de navegação
- Estrutura semântica
- Contraste adequado

## Arquivos Modificados

```
components/content/Chronology/
  ├── index.tsx (novo)
  ├── ChronologyRoot.tsx (novo)
  ├── ChronologyHeader.tsx (novo)
  └── ChronologyTimeline.tsx (novo)

lib/
  ├── getArticles.ts (modificado)
  └── context/
      └── ChronologyContext.tsx (novo)

content/
  ├── chronology/
  │   └── jesus-ministry.json (novo)
  └── articles/teoleigo/
      └── teste.mdx (modificado)

app/[slug]/
  └── page.tsx (modificado)

instructions/context/
  ├── 00 - indice.md (modificado)
  └── 24 - sistema-cronologia-biblica.md (novo)
```

## Próximos Passos Sugeridos

1. **Datasets Adicionais**:
   - old-testament.json (panorama do AT)
   - new-testament.json (panorama do NT)
   - apostolic-age.json (era apostólica)
   - reformation.json (reforma protestante)

2. **Melhorias no Componente**:
   - Filtros por período
   - Busca de eventos
   - Zoom in/out na timeline
   - Modo de visualização alternativo (lista/grid)

3. **Funcionalidades Extras**:
   - Export para PDF/imagem
   - Compartilhamento de eventos específicos
   - Links deep para eventos
   - Integração com BibliaLink para referências

## Notas de Implementação

- O componente é totalmente client-side para permitir interatividade
- Datasets são servidos como arquivos estáticos (public route)
- Chronology do frontmatter é passada via Context API
- Componentes seguem padrão de composição do projeto
- Estilos mantêm consistência com o design system
