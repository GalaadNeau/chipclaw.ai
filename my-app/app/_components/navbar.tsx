'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

// Frame constants mirrored from scroll-hero — keep in sync if those change
const TOTAL_REAL    = 639   // real image frames (SEQ1 + SEQ2 + SEQ3)
const TRANS1_GAP    = 5     // virtual gap inserted between seq1 and seq2
const BLACK_LEN     = 40    // virtual black frames after seq3
const TOTAL_VIRTUAL = TOTAL_REAL + TRANS1_GAP + BLACK_LEN  // 684
const BLACK_START   = TOTAL_REAL + TRANS1_GAP               // 644 — black interlude begins

export default function Navbar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      // Scroll driver is 400vh → totalScroll = 3 * innerHeight
      const totalScroll = 4 * window.innerHeight - window.innerHeight
      const progress    = Math.min(1, window.scrollY / totalScroll)
      const gf          = progress * (TOTAL_VIRTUAL - 1)
      setVisible(gf >= BLACK_START)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // check on mount (handles page reload at scroll position)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/8 backdrop-blur-2xl"
      style={{
        background:    'rgba(255, 255, 255, 0.04)',
        opacity:       visible ? 1 : 0,
        transition:    'opacity 0.8s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-amber-400 tracking-tight">
          🦞 Chiplaw
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/chips"   className="text-sm text-gray-400 hover:text-white transition-colors">chips</Link>
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">pricing</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 border border-white/10 hover:border-white/30 hover:text-white transition-all"
          >
            sign in
          </Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-400 text-black hover:bg-amber-300 transition-colors"
          >
            get started
          </Link>
        </div>
      </div>
    </header>
  )
}
