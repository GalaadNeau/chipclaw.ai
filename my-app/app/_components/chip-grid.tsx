'use client'

import Image from 'next/image'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'

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
  return (
    <CardContainer containerClassName="w-full" className="w-full">
      <div
        style={{
          background: 'rgba(255,255,255,0.025)',
          border:     `1px solid ${chip.borderColor}`,
        }}
        className="rounded-2xl"
      >
      <CardBody className="relative group/card w-full h-auto rounded-2xl p-6 flex flex-col gap-4">
        {/* Radial glow */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 90% 70% at 50% 110%, ${chip.glowColor}, transparent)` }}
        />

        {/* Badge row */}
        <CardItem translateZ={30} className="flex items-center">
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
        </CardItem>

        {/* Image */}
        <CardItem translateZ={80} className="w-full flex justify-center py-2 relative">
          <Image
            src={chip.src}
            alt={chip.name}
            width={190}
            height={250}
            className="drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
          />
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none rounded-b-xl"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}
          />
        </CardItem>

        {/* Title */}
        <CardItem
          translateZ={50}
          className="text-white text-xl leading-snug"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          {chip.name}
        </CardItem>

        {/* Description */}
        <CardItem
          as="p"
          translateZ={40}
          className="text-gray-400 text-sm leading-relaxed"
        >
          {chip.desc}
        </CardItem>

        {/* Coming soon */}
        <CardItem translateZ={20} className="flex justify-center mt-1">
          <span className="border border-white/20 text-gray-500 text-xs px-4 py-1.5 rounded-full">
            coming soon
          </span>
        </CardItem>
      </CardBody>
      </div>
    </CardContainer>
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
