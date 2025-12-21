// app/test-webmentions/page.tsx
import { fetchWebmentions } from '@/lib/webMentions'

export default async function TestWebmentions() {
  const mentions = await fetchWebmentions('https://euaggelion.com.br/salmo-01')
  
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Teste Webmentions</h1>
      
      <div className="bg-muted p-4 rounded">
        <p>Total de menções: {mentions.length}</p>
        
        {mentions.length > 0 ? (
          <pre className="mt-4 text-xs overflow-auto">
            {JSON.stringify(mentions, null, 2)}
          </pre>
        ) : (
          <p className="mt-4 text-foreground/60">
            Nenhuma menção encontrada ainda.
          </p>
        )}
      </div>
      
      <div className="mt-6 p-4 border border-ring/20 rounded">
        <h2 className="font-bold mb-2">Como testar:</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Abra seu perfil no Mastodon</li>
          <li>Crie um post com o link: https://euaggelion.com.br/salmo-01</li>
          <li>Aguarde 5-10 minutos</li>
          <li>Recarregue esta página</li>
        </ol>
      </div>
    </div>
  )
}