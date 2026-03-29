'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function WaitlistForm() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.from('waitlist').insert({ email })
    setStatus(error ? 'error' : 'success')
  }

  if (status === 'success') {
    return (
      <p
        className="text-2xl text-amber-400"
        style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic' }}
      >
        you're in. we'll be in touch.
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="bg-transparent border border-white/20 rounded-full px-6 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400 transition-colors"
          style={{ width: '320px' }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-amber-400 text-black rounded-full px-6 py-3 font-medium hover:bg-amber-300 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'loading' ? 'joining…' : 'join waitlist'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-400 text-sm">something went wrong — try again.</p>
      )}
    </div>
  )
}
