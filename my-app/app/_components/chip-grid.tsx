'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

// ── Chip data ────────────────────────────────────────────────────
const CHIPS = [
  {
    src:         '/Face/backend.png',
    name:        'Frontend Section',
    desc:        'Turn your agent into a senior frontend dev',
    badge:       'CODING',
    badgeColor:  '#F97316',
    borderColor: 'rgba(249,115,22,0.3)',
    glowColor:   'rgba(249,115,22,0.12)',
  },
  {
    src:         '/Face/SEO.png',
    name:        'SEO Console',
    desc:        'Rank higher with an SEO-obsessed agent',
    badge:       'SEO',
    badgeColor:  '#22C55E',
    borderColor: 'rgba(34,197,94,0.3)',
    glowColor:   'rgba(34,197,94,0.12)',
  },
  {
    src:         '/Face/QA.png',
    name:        'QA Section',
    desc:        'Ship bulletproof code, zero regressions',
    badge:       'QA',
    badgeColor:  '#A855F7',
    borderColor: 'rgba(168,85,247,0.3)',
    glowColor:   'rgba(168,85,247,0.12)',
  },
  {
    src:         '/Face/UI.png',
    name:        'UI & UX Console',
    desc:        'Design interfaces users actually love',
    badge:       'DESIGN',
    badgeColor:  '#EAB308',
    borderColor: 'rgba(234,179,8,0.3)',
    glowColor:   'rgba(234,179,8,0.12)',
  },
  {
    src:         '/Face/copy.png',
    name:        'Copy Section',
    desc:        'Write copy that converts, every time',
    badge:       'COPY',
    badgeColor:  '#3B82F6',
    borderColor: 'rgba(59,130,246,0.3)',
    glowColor:   'rgba(59,130,246,0.12)',
  },
] as const

type Chip = typeof CHIPS[number]

// ── ChipCard ─────────────────────────────────────────────────────
function ChipCard({ chip }: { chip: Chip }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el || window.matchMedia('(hover: none)').matches) return

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect()
      const x = (e.clientX - left) / width  - 0.5  // -0.5 → 0.5
      const y = (e.clientY - top)  / height - 0.5
      el.style.transition = 'transform 0.12s ease-out'
      el.style.transform  = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateY(-8px) scale(1.015)`
    }

    const onLeave = () => {
      el.style.transition = 'transform 0.5s ease'
      el.style.transform  = ''
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className="group relative rounded-2xl p-6 flex flex-col gap-5 cursor-pointer"
      style={{
        border:           `1px solid ${chip.borderColor}`,
        background:       'rgba(255,255,255,0.025)',
        transformStyle:   'preserve-3d',
        willChange:       'transform',
      }}
    >
      {/* Radial glow — follows chip accent colour */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 90% 70% at 50% 110%, ${chip.glowColor}, transparent)` }}
      />

      {/* Image */}
      <div className="relative flex justify-center py-2">
        <Image
          src={chip.src}
          alt={chip.name}
          width={190}
          height={250}
          className="relative z-10 drop-shadow-2xl"
          style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-semibold tracking-widest px-2.5 py-1 rounded-full"
            style={{
              color:      chip.badgeColor,
              background: `${chip.badgeColor}18`,
              border:     `1px solid ${chip.badgeColor}35`,
            }}
          >
            {chip.badge}
          </span>
          <span className="text-amber-400 font-semibold text-sm">$4.99</span>
        </div>

        <h3
          className="text-white text-xl leading-snug"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          {chip.name}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed">{chip.desc}</p>

        <Link
          href="/chips"
          className="mt-1 w-full py-2.5 rounded-lg text-sm font-semibold text-center text-black bg-amber-400 hover:bg-amber-300 transition-colors"
        >
          Get chip →
        </Link>
      </div>
    </div>
  )
}

// ── Grid ─────────────────────────────────────────────────────────
export default function ChipGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {CHIPS.map(chip => (
        <ChipCard key={chip.src} chip={chip} />
      ))}
    </div>
  )
}
