# Logger Utilitário

## Introdução

Este documento descreve o sistema de logging implementado no projeto "Euaggelion", que gerencia mensagens de console de forma inteligente, exibindo logs apenas em ambiente de desenvolvimento e ocultando-os em produção.

## Visão Geral

O logger utilitário fornece uma maneira consistente e eficiente de gerenciar logs em toda a aplicação, evitando poluição do console em produção e melhorando a performance da aplicação.

## Logger Server-Side

### Localização
`lib/logger.ts` - Função utilitária para logging no servidor

### Descrição
Objeto `logger` para uso em Server Components e Server Actions.

### Funcionalidades
- Detecta automaticamente o ambiente via `process.env.NODE_ENV`
- Exibe logs apenas em desenvolvimento
- Não afeta performance em produção
- Métodos: `log()`, `error()`, `warn()`, `info()`

### Uso

```typescript
import { logger } from '@/lib/logger'

// Logging normal
logger.log('✅ Subscription salva com sucesso:', endpoint)

// Logging de erro
logger.error('❌ Erro ao salvar subscription:', error)

// Avisos
logger.warn('⚠️ Atenção ao processar subscription')

// Informações
logger.info('ℹ️ Iniciando processo de sincronização')
```

### Exemplo Prático

```typescript
// app/actions.ts
export async function subscribeUser(sub: any) {
  try {
    await saveSubscription(subscriptionData)
    logger.log('✅ Subscription salva:', sub.endpoint.substring(0, 50))
    return { success: true }
  } catch (error) {
    logger.error('❌ Erro ao salvar subscription:', error)
    return { success: false }
  }
}
```

## Logger Client-Side

### Localização
`lib/logger.ts` - Função utilitária para logging no cliente

### Descrição
Objeto `clientLogger` para uso em Client Components.

### Funcionalidades
- Detecta ambiente de desenvolvimento no cliente
- Exibe logs apenas em desenvolvimento
- Seguro para uso em componentes React
- Métodos: `log()`, `error()`, `warn()`, `info()`

### Uso

```typescript
'use client'

import { clientLogger } from '@/lib/logger'

// Logging normal
clientLogger.log('✅ Inscrição realizada com sucesso')

// Logging de erro
clientLogger.error('❌ Falha ao salvar subscription:', error)

// Avisos
clientLogger.warn('⚠️ Alt text muito curto para imagem')

// Informações
clientLogger.info('ℹ️ PWA pronto para instalação')
```

### Exemplo Prático

```typescript
// components/pushNotification.tsx
'use client'

import { clientLogger } from '@/lib/logger'

export function PushNotificationManager() {
  async function subscribeToPush() {
    try {
      const sub = await registration.pushManager.subscribe(...)
      const result = await subscribeUser(serializedSub)
      
      if (result.success) {
        clientLogger.log('✅ Inscrição realizada com sucesso')
      }
    } catch (error) {
      clientLogger.error('❌ Erro ao se inscrever:', error)
    }
  }
}
```

## Arquivos Que Utilizam o Logger

### Server-side
- `app/actions.ts` - Gerenciamento de subscriptions push e notificações

### Client-side
- `components/pushNotification.tsx` - Componente de notificações push
- `components/webMentions.tsx` - Carregamento de webmentions
- `components/layout/PWA/pwaPrompt.tsx` - Instalação de PWA
- `components/ui/optimized-image.tsx` - Validação de imagens
- `components/content/Bible/BibleModal.tsx` - Carregamento de textos bíblicos

## Padrão de Mensagens

O projeto utiliza emojis para melhor identificar o tipo de log:

- ✅ Sucesso
- ❌ Erro crítico
- ⚠️ Aviso/Atenção
- ℹ️ Informação
- 🔄 Processamento
- 📊 Estatísticas
- 🚫 Negação/Não suportado

### Exemplos

```typescript
logger.log('✅ Operação concluída com sucesso')
logger.error('❌ Falha ao conectar ao servidor')
logger.warn('⚠️ Limite de requisições próximo')
logger.info('ℹ️ Iniciando sincronização')
logger.log('🔄 Verificando subscription existente')
logger.log('📊 Notificações enviadas: 100 | Falhadas: 2')
```

## Comportamento por Ambiente

### Desenvolvimento (`NODE_ENV === 'development'`)
```
✅ Todas as mensagens aparecem no console
✅ Emojis visíveis
✅ Informações de debug disponíveis
```

### Produção (`NODE_ENV === 'production'`)
```
✅ Nenhuma mensagem de log é exibida
✅ Sem impacto na performance
✅ Console limpo para o usuário final
```

## Boas Práticas

### 1. Usar Mensagens Descritivas
```typescript
// ✅ Bom
logger.log('✅ Subscription salva para:', subscription.endpoint.substring(0, 50))

// ❌ Ruim
logger.log('Done')
```

### 2. Incluir Contexto
```typescript
// ✅ Bom
logger.error('❌ Erro ao enviar notificação para:', endpoint, error)

// ❌ Ruim
logger.error(error)
```

### 3. Usar Método Apropriado
```typescript
// ✅ Bom
logger.warn('⚠️ Tentativa 3 de 5')
logger.error('❌ Falha após 5 tentativas')

// ❌ Ruim
logger.log('Aviso!')
logger.log('Erro!')
```

### 4. Truncar Dados Sensíveis
```typescript
// ✅ Bom
logger.log('Endpoint:', endpoint.substring(0, 50) + '...')

// ❌ Ruim
logger.log('Endpoint:', endpoint) // Expõe chaves sensíveis
```

## Integração com Monitoramento Futuro

O logger foi estruturado para facilitar integração futura com serviços de monitoramento:

```typescript
// Exemplo de extensão futura
export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args)
    }
    // Futuramente: enviar para Sentry, LogRocket, etc.
    // sendToMonitoring('log', args)
  },
  
  error: (...args: any[]) => {
    if (isDev) {
      console.error(...args)
    }
    // Futuramente: rastrear erros
    // sendToMonitoring('error', args)
  }
}
```

## Referências

- Arquivo: `lib/logger.ts`
- Padrão: Singleton pattern para logging
- Ambiente: Node.js (server) e Browser (client)
