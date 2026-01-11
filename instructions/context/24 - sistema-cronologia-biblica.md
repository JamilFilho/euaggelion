# Sistema de Cronologia Bíblica

## Introdução

Este documento descreve o sistema de cronologia bíblica do projeto "Euaggelion", que permite criar linhas do tempo interativas de eventos bíblicos e históricos para enriquecer o conteúdo dos artigos.

## Conceito

O sistema de cronologia permite que autores criem visualizações temporais de eventos bíblicos, facilitando a compreensão do contexto histórico e da sequência de acontecimentos descritos nas Escrituras.

## Estrutura de Dados

### Localização dos Datasets

- **Pasta**: `content/chronology/`
- **Formato**: JSON
- **Nomenclatura**: `{dataset-name}.json`

### Estrutura do Arquivo JSON

```json
{
  "name": "Nome descritivo do período/dataset",
  "description": "Descrição do que este dataset cobre",
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
      "description": "Descrição detalhada do evento",
      "reference": ["Mateus 3:13-17", "Marcos 1:9-11"]
    }
  ]
}
```

### Propriedades do Dataset

#### Metadados (Raiz)

- **name** (string, obrigatório): Nome descritivo do período coberto pelo dataset
- **description** (string, obrigatório): Descrição do que o dataset abrange
- **period** (object, opcional): Período temporal coberto
  - **start** (number): Ano de início (use valores negativos para a.C.)
  - **end** (number): Ano de término

#### Propriedades de Eventos

- **year** (number, obrigatório): Ano do evento
  - Valores positivos: d.C. (depois de Cristo)
  - Valores negativos: a.C. (antes de Cristo)
  - Exemplo: -1446 = 1446 a.C., 30 = 30 d.C.

- **month** (string, opcional): Mês ou estação do ano
  - Estações: "Primavera", "Verão", "Outono", "Inverno"
  - Meses: "Janeiro", "Fevereiro", etc.

- **day** (string, opcional): Dia específico quando relevante
  - Exemplo: "Domingo", "15", "Sexta-feira"

- **event** (string, obrigatório): Nome/título do evento
  - Deve ser conciso e descritivo
  - Exemplo: "Batismo de Jesus", "Êxodo do Egito"

- **description** (string, obrigatório): Descrição detalhada do evento
  - Contexto histórico e teológico
  - Significado do evento
  - Personagens envolvidos

- **reference** (array de strings, opcional): Referências bíblicas
  - Formato: "Livro Capítulo:Versículo"
  - Exemplos: ["Mateus 3:13-17", "João 1:29-34"]
  - Múltiplas referências para eventos registrados em vários livros

## Datasets Disponíveis

### jesus-ministry.json

Cronologia do ministério terreno de Jesus Cristo, cobrindo:
- Período: 27-30 d.C.
- Eventos: Batismo, tentação, milagres, ensinos, crucificação, ressurreição e ascensão
- Total: 20 eventos principais

## Uso em Artigos MDX

### Frontmatter

No frontmatter do artigo MDX, você pode definir eventos cronológicos específicos:

```yaml
---
title: "Título do Artigo"
chronology:
  - year: -4000
    event: "Criação do Mundo"
    description: "Deus cria o céu e a terra, separando luz das trevas."
  - year: -2348
    event: "Dilúvio"
    description: "Deus envia um dilúvio para purificar a terra."
---
```

### Componente Chronology (Planejado)

O componente permitirá selecionar qual dataset usar:

```jsx
// Usar dataset pré-definido
<Chronology dataset="jesus-ministry" />

// Usar dataset do Antigo Testamento
<Chronology dataset="old-testament" />

// Usar dataset do reinado de Davi
<Chronology dataset="king-david" />

// Usar dataset do primeiro século da igreja
<Chronology dataset="first-century" />
```

## Convenções de Nomenclatura

### Nomes de Datasets

- **Formato**: lowercase com hífen
- **Padrão**: `{contexto-temporal}.json`

**Exemplos:**
- `jesus-ministry.json` - Ministério de Jesus
- `old-testament.json` - Panorama do Antigo Testamento
- `new-testament.json` - Panorama do Novo Testamento
- `apostolic-age.json` - Era apostólica
- `king-david.json` - Reinado de Davi
- `exodus.json` - Eventos do Êxodo
- `early-church.json` - Igreja primitiva (séc. I-II)
- `reformation.json` - Reforma Protestante

### Estrutura por Escopo

**Datasets Amplos (Panorâmicos):**
- Cobrem períodos longos
- Eventos principais/marcos históricos
- Úteis para contextualização geral

**Datasets Focados (Específicos):**
- Cobrem períodos curtos ou eventos específicos
- Mais detalhados e granulares
- Úteis para artigos temáticos

## Diretrizes de Criação

### Dados Históricos

1. **Precisão**: Use datas historicamente reconhecidas
2. **Fontes**: Base eventos em registros bíblicos e históricos confiáveis
3. **Clareza**: Descrições devem ser claras e concisas
4. **Referências**: Sempre inclua referências bíblicas quando disponíveis

### Organização

1. **Ordem Cronológica**: Eventos devem estar em ordem temporal crescente
2. **Consistência**: Mantenha formato consistente dentro do dataset
3. **Contexto**: Inclua contexto suficiente nas descrições
4. **Relevância**: Inclua apenas eventos relevantes para o escopo do dataset

## Exemplos de Uso

### Dataset de Eventos do Ministério de Jesus

```json
{
  "year": 30,
  "month": "Primavera",
  "event": "Entrada Triunfal",
  "description": "Jesus entra em Jerusalém montado em um jumentinho.",
  "reference": ["Mateus 21:1-11", "Marcos 11:1-11"]
}
```

### Dataset de Eventos do Antigo Testamento

```json
{
  "year": -1446,
  "month": "Primavera",
  "event": "Êxodo do Egito",
  "description": "Moisés lidera os israelitas para fora do Egito.",
  "reference": ["Êxodo 12-14"]
}
```

### Dataset de Igreja Primitiva

```json
{
  "year": 33,
  "month": "Primavera",
  "event": "Pentecostes",
  "description": "O Espírito Santo desce sobre os discípulos.",
  "reference": ["Atos 2:1-47"]
}
```

## Benefícios

### Para Autores
- Facilita a contextualização histórica dos artigos
- Permite visualização clara de sequências de eventos
- Reutilização de datasets em múltiplos artigos

### Para Leitores
- Compreensão melhor do contexto histórico
- Visualização temporal dos eventos
- Enriquecimento do conteúdo com informações estruturadas

## Próximos Passos

1. **Criação de Datasets Adicionais**: old-testament.json, new-testament.json, etc.
2. **Desenvolvimento do Componente**: Interface visual para renderizar cronologias
3. **Integração com MDX**: Suporte para uso do componente em artigos
4. **Estilos e Responsividade**: Design atraente e funcional para linhas do tempo
