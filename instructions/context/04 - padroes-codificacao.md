# Padrões de Codificação

## Introdução

Este documento descreve os padrões de codificação e convenções adotadas no projeto "Euaggelion". Seguir esses padrões garante consistência, legibilidade e manutenção eficiente do código.

## Convenções Gerais

### Nomenclatura

- **Variáveis e Funções**: Use `camelCase`.

  ```typescript
  const userName = "John";
  function getUserName() { ... }
  ```

- **Componentes**: Use `PascalCase`.
  
  ```typescript
  const UserProfile = () => { ... };
  ```

- **Arquivos**: Use `kebab-case`.
  
  ```plaintext
  user-profile.tsx
  ```

- **Constantes**: Use `UPPER_CASE`.
  
  ```typescript
  const MAX_USERS = 100;

  ```

### Tipagem

- **TypeScript**: Use tipagem estática sempre que possível.
  
  ```typescript
  const userName: string = "John";
  ```

- **Interfaces**: Use `PascalCase` para interfaces.
  
  ```typescript
  interface User {
    id: number;
    name: string;
  }
  ```

### Organização de Código

- **Imports**: Agrupe imports por origem e tipo.
  
  ```typescript
  // Bibliotecas externas
  import React from 'react';
  
  // Componentes internos
  import { Button } from '../components/ui/button';
  
  // Estilos
  import '../styles/globals.css';
  ```
  
- **Ordem de Funções**: Organize funções em ordem de dependência, com funções auxiliares antes das principais.

## Componentes React

### Estrutura de Componentes

- **Props**: Use interfaces para definir props.

  ```typescript
  interface UserProfileProps {
    user: User;
  }
  
  const UserProfile: React.FC<UserProfileProps> = ({ user }) => { ... };
  ```

- **Hooks**: Use hooks personalizados para lógica reutilizável.

  ```typescript
  const useUser = () => { ... };
  ```

### Estilos

- **Tailwind CSS**: Use classes utilitárias para estilos.

  ```typescript
  const Button = () => {
    return <button className="bg-blue-500 text-white p-2 rounded">Click</button>;
  };
  ```

## MDX

### Estrutura de Conteúdo

- **Frontmatter**: Use frontmatter para metadados. Padrões adotados no projeto:

  ```markdown
    // Frontmatter Artigos
    ---
    title: ""
    description: ""
    date: ""
    author: ""
    published: true || false
    category: ""
    tags: ["tag1", "tag2", ...]
    search: true || false
    ---
  ```

  ```markdown
    // Frontmatter Páginas Internas
    ---
    title: ""
    description: ""
    published: true || false
    ---
  ```

  ```markdown
    // Frontmatter Wiki
    ---
    title: ""
    date: ""
    published: true || false
    category: ""
    relatedContent:
        - Theme1,
        - Theme2,
        - ...
    tags: [""]
    search: true || false
    ---
  ```

## APIs e Rotas

### Estrutura de Rotas

- **Next.js API Routes**: Use a pasta `api` para rotas da API.

  ```typescript
  // app/api/newsletter/route.ts
  export async function POST(request: Request) { ... }
  ```

### Tratamento de Erros

- **Erros**: Use try-catch para tratamento de erros.

  ```typescript
  try {
    // Código que pode falhar
  } catch (error) {
    console.error(error);
  }
  ```

## Scripts e Automação

### Scripts Personalizados

- **Nomenclatura**: Use `kebab-case` para nomes de scripts.

  ```plaintext
  generate-search-index.js
  ```

- **Documentação**: Comente scripts para explicar seu propósito.

  ```javascript
  // Script para gerar índice de busca
  const generateSearchIndex = () => { ... };
  ```

## Conclusão

Seguir esses padrões de codificação garante que o código seja consistente, legível e fácil de manter. Qualquer desvio desses padrões deve ser documentado e justificado.
