'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

// ── useTilt hook ─────────────────────────────────────────────────
// Applies 3D perspective tilt on mousemove, restores baseTransform
// on mouseleave. Disabled automatically on touch devices.
function useTilt(ref: RefObject<HTMLDivElement | null>, baseTransform: string) {
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(hover: none)').matches) return

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect()
      const x = (e.clientX - left) / width  - 0.5
      const y = (e.clientY - top)  / height - 0.5
      el.style.transition = 'transform 0.15s ease-out'
      el.style.transform  = `perspective(800px) rotateY(${x * 40}deg) rotateX(${-y * 40}deg) scale(1.08)`
      el.style.setProperty('--mouse-x', `${(x + 0.5) * 100}%`)
      el.style.setProperty('--mouse-y', `${(y + 0.5) * 100}%`)
    }

    const onLeave = () => {
      el.style.transition = 'transform 0.4s ease'
      el.style.transform  = baseTransform
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [baseTransform])
}

// ── Chip data ────────────────────────────────────────────────────
// qa.png = centre (index 2/4). Note exact casing from /public/Face/.
const CHIPS = [
  { src: '/Face/backend.png', alt: 'Backend Expert',  baseTransform: 'rotateY(-20deg)', opacity: 0.65, floatDelay: '0s',    isCenter: false },
  { src: '/Face/copy.png',    alt: 'Copywriter AIDA', baseTransform: 'rotateY(-10deg)', opacity: 0.75, floatDelay: '0.8s',  isCenter: false },
  { src: '/Face/QA.png',      alt: 'QA Expert',       baseTransform: 'scale(1.1)',      opacity: 1.0,  floatDelay: '1.6s',  isCenter: true  },
  { src: '/Face/SEO.png',     alt: 'SEO Strategist',  baseTransform: 'rotateY(10deg)',  opacity: 0.75, floatDelay: '2.4s',  isCenter: false },
  { src: '/Face/UI.png',      alt: 'UI Feedback',     baseTransform: 'rotateY(20deg)',  opacity: 0.65, floatDelay: '3.2s',  isCenter: false },
] as const

// ── ChipCard ─────────────────────────────────────────────────────
interface CardProps {
  src: string
  alt: string
  baseTransform: string
  opacity: number
  floatDelay: string
  isCenter: boolean
  enterDelay: string
}

function ChipCard({ src, alt, baseTransform, opacity, floatDelay, isCenter, enterDelay }: CardProps) {
  const tiltRef  = useRef<HTMLDivElement>(null)
  const enterRef = useRef<HTMLDivElement>(null)

  useTilt(tiltRef, baseTransform)

  // Entrance: IntersectionObserver triggers CSS transition-delay stagger
  useEffect(() => {
    const el = enterRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.style.opacity   = '1'
        el.style.transform = 'translateY(0px)'
        obs.disconnect()
      },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={enterRef}
      style={{
        position:   'relative',
        flexShrink: 0,
        opacity:    0,
        transform:  'translateY(40px)',
        transition: `opacity 0.6s ease-out ${enterDelay}, transform 0.6s ease-out ${enterDelay}`,
      }}
    >
      {/* Amber glow behind the central card only */}
      {isCenter && (
        <div
          aria-hidden
          style={{
            position:     'absolute',
            inset:        '-60px',
            borderRadius: '50%',
            background:   'radial-gradient(circle, rgba(245,168,0,0.2) 0%, transparent 68%)',
            pointerEvents: 'none',
            zIndex:       0,
          }}
        />
      )}

      {/* Tilt target — receives JS transform + shimmer ::after */}
      <div
        ref={tiltRef}
        className="chip-tilt"
        style={{
          transform: baseTransform,
          opacity,
          position:  'relative',
          zIndex:    1,
        }}
      >
        {/* Float wrapper — uses CSS `translate` property to avoid
            conflicting with the JS-controlled `transform` above    */}
        <div className="chip-float" style={{ animationDelay: floatDelay }}>
          <Image
            src={src}
            alt={alt}
            width={160}
            height={210}
            style={{ display: 'block' }}
            priority={isCenter}
          />
        </div>
      </div>
    </div>
  )
}

// ── Section ──────────────────────────────────────────────────────
export default function ChipShowcase() {
  return (
    <>
      {/* Scoped styles — keyframes + pseudo-elements can't use Tailwind */}
      <style>{`
        @keyframes chipFloat {
          0%, 100% { translate: 0px 0px;   }
          50%       { translate: 0px -10px; }
        }

        .chip-float {
          animation: chipFloat 3s ease-in-out infinite;
        }

        /* Tilt target: preserve-3d so child layers honour z-axis */
        .chip-tilt {
          position:         relative;
          transform-style:  preserve-3d;
          cursor:           pointer;
          border-radius:    12px;
        }

        /* Shimmer follows --mouse-x / --mouse-y set by useTilt */
        .chip-tilt::after {
          content:          '';
          position:         absolute;
          inset:            0;
          border-radius:    12px;
          background:       radial-gradient(
                              circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                              rgba(255,255,255,0.18) 0%,
                              transparent 60%
                            );
          opacity:          0;
          transition:       opacity 0.3s ease;
          pointer-events:   none;
          z-index:          2;
        }
        .chip-tilt:hover::after { opacity: 1; }

        /* ── Desktop layout ─────────────────────────────────── */
        .chip-showcase-track {
          display:         flex;
          align-items:     center;
          justify-content: center;
          gap:             3rem;
          position:        relative;
        }

        /* ── Mobile: horizontal scroll-snap ─────────────────── */
        @media (max-width: 768px) {
          .chip-showcase-track {
            justify-content:              flex-start;
            overflow-x:                   auto;
            scroll-snap-type:             x mandatory;
            -webkit-overflow-scrolling:   touch;
            scrollbar-width:              none;
            gap:                          1.5rem;
            padding:                      2rem 12vw;
          }
          .chip-showcase-track::-webkit-scrollbar { display: none; }
          .chip-showcase-track > div { scroll-snap-align: center; }
        }
      `}</style>

      <section style={{ background: '#080d1a', padding: '7rem 0', overflow: 'hidden' }}>
        <div className="chip-showcase-track">
          {CHIPS.map((chip, i) => (
            <ChipCard
              key={chip.src}
              {...chip}
              enterDelay={`${i * 0.1}s`}
            />
          ))}
        </div>
      </section>
    </>
  )
}
