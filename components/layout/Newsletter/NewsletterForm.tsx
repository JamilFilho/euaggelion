'use client';

import { useState } from 'react'
import { ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function NewsletterForm() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        setMessage('')
    
        try {
          const response = await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          })
    
          const data = await response.json()
    
          if (response.ok) {
            setStatus('success')
            setMessage(data.message)
            setEmail('')
            toast.success('Inscrição realizada com sucesso!')
          } else {
            setStatus('error')
            setMessage(data.error)
            setEmail('')
            toast.error(data.error)
          }
        } catch (error) {
          setStatus('error')
          setMessage('Erro ao processar inscrição. Tente novamente.')
          toast.error('Erro ao processar inscrição')
        }
    }
    return(
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
          <div className="relative w-full">
            <input 
              className={`w-full bg-transparent py-4 px-10 focus:outline-none border-t border-b border-ring/20 ${status === 'error' ? "placeholder-red-500" : ""}`} 
              placeholder={status === 'success' ? message : status === 'error' ? message : 'Seu e-mail'}
              required 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
            />
            
            {status === 'success' && (
              <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-green-500" />
            )}
            {status === 'error' && (
              <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-red-500" />
            )}
          </div>
    
          <button 
            type="submit" 
            disabled={status === 'loading' || status === 'success'}
            className="flex flex-row justify-between items-center px-10 py-4 md:border-l md:border-t border-b border-ring/20 md:w-1/3 bg-black/20 hover:bg-black/30 disabled:bg-black/10 disabled:cursor-not-allowed text-foreground transition-all ease-in-out hover:pr-8 font-semibold"
          >
            <span>
              {status === 'loading' && 'Inscrevendo...'}
              {status === 'success' && 'Inscrito!'}
              {(status === 'idle' || status === 'error') && 'Assinar a Newsletter'}
            </span>
            
            {status === 'loading' ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowRight className="size-4" />
            )}
          </button>
        </form>
    )
}