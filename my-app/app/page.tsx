import Link from 'next/link'
import ScrollDrivenHero from './_components/scroll-hero'
import Navbar           from './_components/navbar'
import ChipGrid         from './_components/chip-grid'

const HOW_IT_WORKS = [
  { step: '01', label: 'browse chips' },
  { step: '02', label: 'download the .md' },
  { step: '03', label: 'plug into your agent' },
] as const

export default function Home() {
  return (
    <div className="bg-black min-h-screen flex flex-col">

      {/* ── SCROLL-DRIVEN FRAME SEQUENCE ────────────────────────── */}
      <ScrollDrivenHero />

      {/* ── NAVBAR — fades in during black interlude ────────────── */}
      <Navbar />

      {/* ── CATALOGUE ───────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-20">
            <h2
              className="text-6xl md:text-7xl font-normal text-white mb-5 lowercase leading-tight"
              style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic' }}
            >
              pick your chip.
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
              each chip is a <span className="font-mono text-gray-300">.md</span> file — drop it in your agent and unlock instant expertise.
            </p>
          </div>

          <ChipGrid />
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">

          <h2
            className="text-5xl md:text-6xl font-normal text-white mb-16 lowercase leading-tight text-center"
            style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic' }}
          >
            how it works.
          </h2>

          <div className="flex flex-col md:flex-row gap-12 md:gap-0">
            {HOW_IT_WORKS.map(({ step, label }, i) => (
              <div key={step} className="flex-1 flex flex-col md:items-center md:text-center relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div
                    aria-hidden
                    className="hidden md:block absolute top-4 left-[calc(50%+2rem)] right-0 h-px"
                    style={{ background: 'linear-gradient(to right, rgba(251,191,36,0.2), transparent)' }}
                  />
                )}
                <span className="text-amber-400 font-mono font-bold text-sm mb-3">{step}.</span>
                <p className="text-gray-400 text-base lowercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-32 px-6 border-t border-white/5 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
          <h2
            className="text-5xl md:text-7xl font-normal text-white lowercase leading-tight"
            style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic' }}
          >
            your agent deserves better.
          </h2>
          <Link
            href="/chips"
            className="px-8 py-3.5 rounded-xl font-semibold text-base bg-amber-400 text-black hover:bg-amber-300 transition-colors"
          >
            browse all chips
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-gray-900 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-gray-600 text-sm">© 2026 Chiplaw</span>
          <span className="text-gray-600 text-sm">built for claude, gpt &amp; cursor</span>
        </div>
      </footer>

    </div>
  )
}
