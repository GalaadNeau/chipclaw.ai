'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  open: boolean
  onClose: () => void
}

export default function WaitlistModal({ open, onClose }: Props) {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.from('waitlist').insert({ email })
    setStatus(error ? 'error' : 'success')
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-8 flex flex-col gap-6"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-600 hover:text-gray-300 transition-colors text-2xl leading-none"
          aria-label="close"
        >
          ×
        </button>

        <div className="flex flex-col gap-2 text-center">
          <h2
            className="text-4xl font-normal text-white lowercase leading-tight"
            style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic' }}
          >
            get early access.
          </h2>
        </div>

        {status === 'success' ? (
          <p
            className="text-center text-2xl text-amber-400"
            style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic' }}
          >
            you're in. we'll be in touch.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-transparent border border-white/20 rounded-full px-6 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-amber-400 text-black rounded-full px-6 py-3 font-medium hover:bg-amber-300 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'joining…' : 'join waitlist'}
            </button>
            {status === 'error' && (
              <p className="text-red-400 text-sm text-center">something went wrong — try again.</p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
