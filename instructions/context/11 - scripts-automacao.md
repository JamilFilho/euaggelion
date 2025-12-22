# Scripts e Automação

## Introdução
Este documento descreve os scripts e automações utilizados no projeto "Euaggelion", incluindo suas funcionalidades e como eles são utilizados.

## Scripts Personalizados

### archive-wayback.js
- **Localização**: `scripts/archive-wayback.js`
- **Descrição**: Script para arquivamento de conteúdo.
- **Funcionalidades**:
  - Arquiva conteúdo em serviços como Wayback Machine.
  - Garante a preservação de conteúdo histórico.

### Exemplo de Uso
```javascript
const archiveWayback = require('./scripts/archive-wayback');
archiveWayback(url);
```

### generateSearchIndex.js
- **Localização**: `lib/generateSearchIndex.js`
- **Descrição**: Script para geração de índice de busca.
- **Funcionalidades**:
  - Processa conteúdo MDX.
  - Gera um índice de busca em formato JSON.

### Exemplo de Uso
```javascript
const generateSearchIndex = require('./lib/generateSearchIndex');
generateSearchIndex();
```

## Automação de Build

### package.json
- **Localização**: `package.json`
- **Descrição**: Contém scripts para automação de build e desenvolvimento.
- **Scripts**:
  - `dev`: Inicia o servidor de desenvolvimento.
  - `build`: Compila a aplicação para produção.
  - `start`: Inicia o servidor de produção.

### Exemplo de Uso
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

## Scripts de Linting e Formatação

### ESLint
- **Localização**: `eslint.config.mjs`
- **Descrição**: Configuração do ESLint para linting de código.
- **Funcionalidades**:
  - Garantir a qualidade e consistência do código.
  - Detectar erros e padrões não conformes.

### Exemplo de Uso
```javascript
// eslint.config.mjs
import eslint from '@eslint/js';

export default [
  eslint.configs.recommended,
];
```

### Prettier
- **Descrição**: Ferramenta para formatação de código.
- **Funcionalidades**:
  - Manter um estilo de código consistente.
  - Formatar código automaticamente.

### Exemplo de Uso
```json
{
  "scripts": {
    "format": "prettier --write ."
  }
}
```

## Scripts de Deploy

### Deploy
- **Descrição**: Scripts para deploy da aplicação.
- **Funcionalidades**:
  - Compila a aplicação.
  - Faz deploy para o ambiente de produção.

### Exemplo de Uso
```json
{
  "scripts": {
    "deploy": "npm run build && vercel --prod"
  }
}
```

## Conclusão
Os scripts e automações do projeto "Euaggelion" são projetados para facilitar o desenvolvimento, build, linting, formatação e deploy da aplicação. Eles garantem consistência, qualidade e eficiência no processo de desenvolvimento.