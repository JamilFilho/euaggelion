# Instruções para Criação de Novas Memórias

## Introdução

Este documento descreve o processo para criar e registrar novas memórias de atualizações no projeto "Euaggelion". As memórias são arquivos `.md` que documentam as mudanças e implementações realizadas no projeto.

## Localização

- **Pasta**: `/instructions/memories`
- **Formato**: `.md`
- **Nomeação**: Utilizar o timestamp do momento da criação (e.g., `YYYY-MM-DDTHH-MM-SS.md`).

## Processo de Criação

### 1. Nomeação do Arquivo

- **Formato**: `AAAA-MM-DDTHH-MM-SS.md`
- **Exemplo**: `2025-12-22T14-30-00.md`

### 2. Estrutura do Arquivo

Cada memória deve seguir a estrutura abaixo para garantir consistência e clareza:

```markdown
# Memória de Atualização - AAAA-MM-DDTHH-MM-SS

## Descrição
Breve descrição das atualizações realizadas.

## Atualizações Realizadas

### 1. Título da Atualização
- **Descrição**: Descrição detalhada da atualização.
- **Arquivos Modificados**: Lista de arquivos modificados ou criados.
- **Detalhes**: Informações adicionais relevantes.

### 2. Título da Atualização
- **Descrição**: Descrição detalhada da atualização.
- **Arquivos Modificados**: Lista de arquivos modificados ou criados.
- **Detalhes**: Informações adicionais relevantes.

## Próximos Passos
- **Ações Futuras**: Descrever ações ou tarefas pendentes.
- **Recomendações**: Sugestões para melhorias ou ajustes.

## Conclusão
Resumo das mudanças e impacto no projeto.
```

### 3. Conteúdo da Memória

- **Descrição**: Fornecer uma visão geral das mudanças realizadas.
- **Atualizações Realizadas**: Detalhar cada mudança, incluindo:
  - **Título da Atualização**: Um título claro e descritivo.
  - **Descrição**: Explicação detalhada da mudança.
  - **Arquivos Modificados**: Lista de arquivos afetados.
  - **Detalhes**: Informações adicionais, como motivos ou impactos.

### 4. Próximos Passos

- **Ações Futuras**: Descrever quaisquer ações pendentes ou planejadas.
- **Recomendações**: Incluir sugestões para melhorias ou ajustes futuros.

### 5. Conclusão

- **Resumo**: Fornecer um resumo das mudanças e seu impacto no projeto.

## Exemplo de Memória

```markdown
# Memória de Atualização - 2025-12-22T14-30-00

## Descrição
Este documento registra a implementação de um novo componente de busca no projeto "Euaggelion".

## Atualizações Realizadas

### 1. Implementação do Componente de Busca
- **Descrição**: Foi adicionado um novo componente de busca para melhorar a experiência do usuário.
- **Arquivos Modificados**:
  - `components/content/search.tsx`: Novo componente de busca.
  - `hooks/useSearch.tsx`: Hook para lógica de busca.
- **Detalhes**: O componente permite busca em tempo real e filtros avançados.

### 2. Atualização da Documentação
- **Descrição**: A documentação foi atualizada para incluir informações sobre o novo componente.
- **Arquivos Modificados**:
  - `ai/05 - componentes-principais.md`: Adicionada seção sobre o componente de busca.
- **Detalhes**: Inclusão de exemplos de uso e funcionalidades.

## Próximos Passos
- **Ações Futuras**: Testar o componente em diferentes cenários de uso.
- **Recomendações**: Considerar a adição de sugestões de busca automáticas.

## Conclusão
A implementação do novo componente de busca melhora significativamente a usabilidade do projeto, permitindo que os usuários encontrem conteúdo de forma mais eficiente.
```

## Boas Práticas

- **Consistência**: Siga a estrutura padrão para todas as memórias.
- **Clareza**: Seja claro e detalhado nas descrições.
- **Atualização**: Registre todas as mudanças relevantes, por menores que sejam.
- **Revisão**: Revise o conteúdo antes de salvar para garantir precisão.

## Conclusão

Manter um registro detalhado das atualizações é essencial para a manutenção e evolução do projeto. Siga estas instruções para garantir que todas as memórias sejam criadas de forma consistente e útil.
