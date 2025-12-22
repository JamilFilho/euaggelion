# Estilos e UI

## Introdução

Este documento descreve os estilos e componentes de UI utilizados no projeto "Euaggelion", incluindo como eles são aplicados e personalizados.

## Tailwind CSS

### Configuração

- **Localização**: `tailwind.config.js`
- **Descrição**: Configuração principal do Tailwind CSS.
- **Funcionalidades**:
  - Define cores, fontes e estilos personalizados.
  - Configura plugins e extensões.

### Exemplo de Configuração

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      },
    },
  },
  plugins: [],
};
```

### Uso de Classes Utilitárias

- **Descrição**: O Tailwind CSS é utilizado para estilização rápida e eficiente.
- **Exemplo**:

  ```typescript
  const Button = () => {
    return <button className="bg-blue-500 text-white p-2 rounded">Click</button>;
  };
  ```

## Componentes de UI

### Button

- **Localização**: `components/ui/button.tsx`
- **Descrição**: Componente de botão reutilizável.
- **Funcionalidades**:
  - Suporta diferentes variantes (e.g., primary, secondary).
  - Estilizado com Tailwind CSS.

### Exemplo de Uso

```typescript
import Button from '../components/ui/button';

const Example = () => {
  return <Button variant="primary">Click Me</Button>;
};
```

### Input

- **Localização**: `components/ui/input.tsx`
- **Descrição**: Componente de entrada de texto.
- **Funcionalidades**:
  - Suporta diferentes tipos de entrada (e.g., text, email).
  - Estilizado com Tailwind CSS.

### Exemplo de Uso

```typescript
import Input from '../components/ui/input';

const Example = () => {
  return <Input type="text" placeholder="Enter text" />;
};
```

### Dialog

- **Localização**: `components/ui/dialog.tsx`
- **Descrição**: Componente de diálogo modal.
- **Funcionalidades**:
  - Exibe conteúdo em um modal.
  - Suporta ações de confirmação e cancelamento.

### Exemplo de Uso

```typescript
import Dialog from '../components/ui/dialog';

const Example = () => {
  return (
    <Dialog>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Content>Content</Dialog.Content>
    </Dialog>
  );
};
```

### Drawer

- **Localização**: `components/ui/drawer.tsx`
- **Descrição**: Componente de gaveta lateral.
- **Funcionalidades**:
  - Exibe conteúdo em uma gaveta lateral.
  - Suporta ações de abertura e fechamento.

### Exemplo de Uso

```typescript
import Drawer from '../components/ui/drawer';

const Example = () => {
  return (
    <Drawer>
      <Drawer.Title>Title</Drawer.Title>
      <Drawer.Content>Content</Drawer.Content>
    </Drawer>
  );
};
```

## Estilos Globais

### Globals.css

- **Localização**: `styles/globals.css`
- **Descrição**: Estilos globais para a aplicação.
- **Funcionalidades**:
  - Define estilos base para a aplicação.
  - Inclui reset de estilos e variáveis globais.

### Exemplo de Uso

```css
/* styles/globals.css */
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
}
```

## Componentes de Layout

### SiteHeader

- **Localização**: `components/layout/SiteHeader/`
- **Descrição**: Cabeçalho principal do site.
- **Funcionalidades**:
  - Exibe o logo e título do site.
  - Fornece links de navegação.

### Exemplo de Uso

```typescript
import SiteHeader from '../components/layout/SiteHeader';

const Example = () => {
  return <SiteHeader />;
};
```

### SiteFooter

- **Localização**: `components/layout/SiteFooter/`
- **Descrição**: Rodapé do site.
- **Funcionalidades**:
  - Exibe informações de copyright.
  - Fornece links para páginas secundárias.

### Exemplo de Uso

```typescript
import SiteFooter from '../components/layout/SiteFooter';

const Example = () => {
  return <SiteFooter />;
};
```

## Conclusão

Os estilos e componentes de UI do projeto "Euaggelion" são projetados para serem reutilizáveis, modulares e fáceis de manter. O Tailwind CSS é utilizado para estilização rápida e eficiente, enquanto os componentes de UI são personalizados para atender às necessidades do projeto.
