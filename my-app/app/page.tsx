'use client'

import { useEffect, useState } from 'react'
import ScrollDrivenHero from './_components/scroll-hero'
import Navbar           from './_components/navbar'
import ChipGrid         from './_components/chip-grid'
import WaitlistForm     from './_components/waitlist-form'
import WaitlistModal    from './_components/waitlist-modal'

const HOW_IT_WORKS = [
  { step: '01', label: 'browse chips',        desc: 'find the expertise your agent is missing' },
  { step: '02', label: 'download the .md',    desc: 'one file, zero configuration' },
  { step: '03', label: 'plug into your agent', desc: 'works with Claude, GPT, Cursor and more' },
] as const

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const handler = () => setModalOpen(true)
    window.addEventListener('waitlist:open', handler)
    return () => window.removeEventListener('waitlist:open', handler)
  }, [])

  return (
    <div className="bg-black min-h-screen flex flex-col">

      <WaitlistModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ── SCROLL-DRIVEN FRAME SEQUENCE ────────────────────────── */}
      <ScrollDrivenHero />

      {/* ── NAVBAR — fades in during black interlude ────────────── */}
      <Navbar />

      {/* ── HERO WAITLIST ────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-8 text-center">
          <h1
            className="text-6xl md:text-7xl font-normal text-white lowercase leading-tight"
            style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic' }}
          >
            the chip store<br />is coming.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed" style={{ maxWidth: '500px' }}>
            chips that turn your AI agent into an expert. get early access — 40% off forever.
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* ── CHIPS TEASER ─────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-16">
            <h2
              className="text-5xl font-normal text-white lowercase leading-tight"
              style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic' }}
            >
              what's coming.
            </h2>
          </div>

          <ChipGrid />
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">

          <h2
            className="text-5xl md:text-6xl font-normal text-white mb-16 lowercase leading-tight text-center"
            style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic' }}
          >
            how it works.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ step, label, desc }) => (
              <div
                key={step}
                className="flex flex-col gap-3 rounded-2xl p-8"
                style={{ border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
              >
                <span className="text-amber-400 font-mono font-bold text-5xl leading-none">{step}</span>
                <p className="text-white text-lg lowercase">{label}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-32 px-6 border-t border-white/5 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          <h2
            className="text-5xl md:text-6xl font-normal text-white lowercase leading-tight"
            style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic' }}
          >
            your agent deserves better.
          </h2>
          <p className="text-gray-400 text-lg">be the first to know when we launch.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-8 py-3.5 rounded-full font-medium text-base bg-amber-400 text-black hover:bg-amber-300 transition-colors"
          >
            join the waitlist
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-gray-900 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-gray-600 text-sm">© 2026 Chiplaw</span>
          <span className="text-gray-600 text-sm">built for claude, gpt &amp; cursor</span>
        </div>
      </footer>

    </div>
  )
}
