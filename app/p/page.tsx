"use client";

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RedirectPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('https://euaggelion.com.br')
  }, [router])
  
  return <section className="h-96 flex items-center justify-center">...</section>
}