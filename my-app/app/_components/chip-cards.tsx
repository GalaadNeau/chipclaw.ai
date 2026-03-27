'use client'

import { useRef } from 'react'

const CHIPS = [
  { title: 'Senior Code Reviewer', category: 'Coding',    price: '9,90€' },
  { title: 'Copywriter AIDA',       category: 'Marketing', price: '9,90€' },
  { title: 'SEO Content Strategist',category: 'SEO',       price: '9,90€' },
  { title: 'UI Feedback Expert',    category: 'Design',    price: '9,90€' },
]

// Alternating contact heights mimicking SD card gold pads
const CONTACTS = [36, 26, 36, 26, 36, 26, 36]

function ChipCard({ title, category, price }: { title: string; category: string; price: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const cardRef   = useRef<HTMLDivElement>(null)
  const glareRef  = useRef<HTMLDivElement>(null)

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const wrapper = wrapperRef.current
    const card    = cardRef.current
    const glare   = glareRef.current
    if (!wrapper || !card || !glare) return

    const { left, top, width, height } = wrapper.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top

    const rotX = ((y - height / 2) / (height / 2)) * -13
    const rotY = ((x - width  / 2) / (width  / 2)) *  13

    card.style.transition = 'transform 0.06s ease-out'
    card.style.transform  = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`

    const px = (x / width)  * 100
    const py = (y / height) * 100
    glare.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(251,191,36,0.14) 0%, transparent 65%)`
  }

  function onMouseLeave() {
    const card  = cardRef.current
    const glare = glareRef.current
    if (!card || !glare) return
    card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)'
    card.style.transform  = 'rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    glare.style.background = 'transparent'
  }

  return (
    <div
      ref={wrapperRef}
      className="cursor-pointer select-none"
      style={{ perspective: '900px' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Card shell — clip-path creates SD card notch top-right */}
      <div
        ref={cardRef}
        className="relative"
        style={{
          background:  'linear-gradient(155deg, #1e293b 0%, #0f172a 100%)',
          clipPath:    'polygon(0 0, calc(100% - 2.5rem) 0, 100% 2.5rem, 100% 100%, 0 100%)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Subtle inner border that follows the clip-path shape */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 2.5rem) 0, 100% 2.5rem, 100% 100%, 0 100%)',
            background: 'linear-gradient(155deg, rgba(148,163,184,0.15) 0%, rgba(148,163,184,0.04) 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '1px',
          }}
        />

        {/* Amber glare that follows the cursor */}
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none z-10"
          style={{ transition: 'background 0.15s ease' }}
        />

        {/* Main content */}
        <div className="relative z-20 px-6 pt-7 pb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20 mb-5">
            {category}
          </span>
          <h3 className="text-white font-bold text-xl leading-snug mb-8">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-amber-400 font-bold text-2xl tracking-tight">
              {price}
            </span>
            <button className="px-4 py-2 rounded-lg text-sm font-semibold border border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-slate-950 transition-all duration-200">
              Get chip
            </button>
          </div>
        </div>

        {/* SD card gold contacts */}
        <div className="relative z-20 flex gap-[5px] px-5 pb-5 pt-2">
          {CONTACTS.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-[2px]"
              style={{
                height: `${h}px`,
                background: 'linear-gradient(to top, #92400e 0%, #d97706 35%, #fbbf24 70%, #fef3c7 100%)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ChipCardsSection() {
  return (
    <section className="py-24 px-6 border-t border-slate-800/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready-to-plug chips
          </h2>
          <p className="text-slate-400 text-lg">
            Des experts IA prêts à l'emploi — un fichier&nbsp;<code className="text-slate-300 font-mono text-base">.md</code>, une transformation.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {CHIPS.map((chip) => (
            <ChipCard key={chip.title} {...chip} />
          ))}
        </div>
      </div>
    </section>
  )
}
