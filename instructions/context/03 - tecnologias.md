# Tecnologias Utilizadas

## Frameworks e Bibliotecas

### Next.js

- **Descrição**: Framework React para desenvolvimento web.
- **Versão**: Utilizada a versão mais recente compatível com o projeto.
- **Propósito**: Estrutura principal da aplicação, incluindo roteamento, renderização do lado do servidor (SSR) e geração de sites estáticos (SSG).

### React

- **Descrição**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Versão**: Utilizada a versão mais recente compatível com o Next.js.
- **Propósito**: Base para a construção de componentes reutilizáveis e interativos.

### TypeScript

- **Descrição**: Linguagem de programação para tipagem estática.
- **Versão**: Utilizada a versão mais recente compatível com o projeto.
- **Propósito**: Adiciona tipagem estática ao JavaScript, melhorando a manutenção e detecção de erros.

### Tailwind CSS

- **Descrição**: Framework CSS para design responsivo.
- **Versão**: Utilizada a versão mais recente compatível com o projeto.
- **Propósito**: Estilização rápida e eficiente com classes utilitárias.

### MDX

- **Descrição**: Formato que combina Markdown e JSX.
- **Versão**: Utilizada a versão mais recente compatível com o projeto.
- **Propósito**: Permite a criação de conteúdo rico com componentes React integrados.

### Fuse.js

- **Descrição**: Biblioteca de busca fuzzy para JavaScript.
- **Versão**: ^7.1.0
- **Propósito**: Implementação de busca tolerante a erros em conteúdo.
- **Integração**: Usado no hook `useSearch` para busca client-side.

### MailerLite Node.js SDK

- **Descrição**: SDK oficial do MailerLite para Node.js.
- **Versão**: ^1.5.0
- **Propósito**: Integração com a API do MailerLite para gerenciamento de newsletter.
- **Integração**: Usado no endpoint `/api/newsletter`.

### Webmention.io

- **Descrição**: Serviço para gerenciamento de interações sociais (webmentions).
- **Propósito**: Coleta e gerenciamento de comentários, curtidas e compartilhamentos.
- **Integração**: Usado no endpoint `/api/webmentions` e componente `Webmentions`.

## Ferramentas de Desenvolvimento

### ESLint

- **Descrição**: Ferramenta para linting de código.
- **Configuração**: `eslint.config.mjs`.
- **Propósito**: Garantir a qualidade e consistência do código.

### PostCSS

- **Descrição**: Ferramenta para transformação de CSS.
- **Configuração**: `postcss.config.js` e `postcss.config.mjs`.
- **Propósito**: Processamento de CSS com plugins como Autoprefixer.

### Prettier

- **Descrição**: Ferramenta para formatação de código.
- **Propósito**: Manter um estilo de código consistente.

## Scripts e Automação

### Scripts Personalizados

- **archive-wayback.js**: Script para arquivamento de conteúdo.
- **generateSearchIndex.js**: Script para geração de índice de busca.

### Dependências

- **package.json**: Contém todas as dependências e scripts do projeto.

## Conclusão

O projeto utiliza uma combinação de tecnologias modernas para garantir desempenho, escalabilidade e manutenção eficiente. A escolha de Next.js, React e TypeScript proporciona uma base sólida para o desenvolvimento, enquanto o Tailwind CSS e MDX facilitam a criação de interfaces ricas e conteúdo dinâmico.
