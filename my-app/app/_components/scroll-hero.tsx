'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

// ── Sequence counts (verified from public/) ─────────────────────
const SEQ1 = 191
const SEQ2 = 288
const SEQ3 = 160
const TOTAL = SEQ1 + SEQ2 + SEQ3   // 639

// ── seq1 → seq2 scroll-driven transition ────────────────────────
// Phase 1 — exit  : canvas + seq1 text scale 1→0.3 + fade, 30 frames
// Phase 2 — black : 5 virtual black frames (no images)
// Phase 3 — entry : seq2 canvas slides in from top, 30 frames
const EXIT_LEN   = 30
const ENTER_LEN  = 30
const TRANS1_GAP = 5     // virtual frames of pure black between seq1 and seq2

// Boundaries in global frame space (SEQ2 is pushed right by TRANS1_GAP)
const EXIT_START  = SEQ1 - EXIT_LEN              // 161 — exit phase begins
const SEQ2_START  = SEQ1 + TRANS1_GAP            // 196 — seq2 images start
const SEQ3_START  = SEQ2_START + SEQ2            // 484
// seq2→seq3: hard cut (no transition)

// Black interlude after seq3 (virtual frames — no images needed)
const BLACK_START   = SEQ3_START + SEQ3          // 644
const BLACK_LEN     = 40
const TOTAL_VIRTUAL = BLACK_START + BLACK_LEN    // 684 — for scroll mapping

// ── Text ────────────────────────────────────────────────────────
const TEXT_TRIGGER = 149   // seq1 frame >= 149 → show text
const STAGGER_MS   = 100

// seq2 text blocks (global frame positions)
const LEFT_TRIGGER  = SEQ2_START + 207  // 398
const RIGHT_TRIGGER = SEQ2_START + 237  // 428
const TEXT2_HIDE    = SEQ2_START + 277  // 468

// Black interlude center text — fades in with black, stays until overlay exits
const BLACK_FADE     = 10
const CENTER_TRIGGER = BLACK_START  // 639 — black and text appear together

// ── Helpers ─────────────────────────────────────────────────────
const src1 = (i: number) => `/frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
const src2 = (i: number) => `/frames_2/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
const src3 = (i: number) => `/frames_3/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`

// ── Easing helpers (scroll-driven — applied to progress 0→1) ────
const easeIn  = (t: number) => t * t
const easeOut = (t: number) => t * (2 - t)

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  const dw    = img.naturalWidth  * scale
  const dh    = img.naturalHeight * scale
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
}

const WORD_BASE: CSSProperties = {
  fontFamily: 'var(--font-instrument-serif)',
  fontWeight: 400,
  opacity:    0,
  transform:  'translateY(12px)',
  transition: 'opacity 0.4s ease, transform 0.4s ease',
  display:    'inline',
}
const ITALIC: CSSProperties = { ...WORD_BASE, fontStyle: 'italic' }

// ── Component ───────────────────────────────────────────────────
export default function ScrollDrivenHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const overlayRef   = useRef<HTMLDivElement>(null)
  const blackRef     = useRef<HTMLDivElement>(null)   // fade-to-black overlay
  const loadingRef   = useRef<HTMLDivElement>(null)
  const barRef       = useRef<HTMLDivElement>(null)
  const pctRef       = useRef<HTMLSpanElement>(null)

  const seq1TextRef = useRef<HTMLDivElement>(null)  // wrapper for exit-scale animation

  const wYour      = useRef<HTMLSpanElement>(null)
  const wAgent     = useRef<HTMLSpanElement>(null)
  const wWas       = useRef<HTMLSpanElement>(null)
  const wMissing   = useRef<HTMLSpanElement>(null)
  const wSomething = useRef<HTMLSpanElement>(null)

  const leftWordRefs   = useRef<HTMLElement[]>([])
  const rightWordRefs  = useRef<HTMLElement[]>([])
  const centerWordRefs = useRef<HTMLElement[]>([])

  useEffect(() => {
    const container = containerRef.current
    const canvas    = canvasRef.current
    const overlay   = overlayRef.current
    const black     = blackRef.current
    const loading   = loadingRef.current
    const bar       = barRef.current
    const pctEl     = pctRef.current
    if (!container || !canvas || !overlay || !black || !loading || !bar || !pctEl) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Non-null aliases for inner functions
    const ctr  = container
    const cnv  = canvas
    const cx   = ctx
    const ovl  = overlay
    const blk  = black
    const ldr  = loading
    const brEl = bar
    const pctSp = pctEl

    const wordEls = [
      wYour.current, wAgent.current, wWas.current,
      wMissing.current, wSomething.current,
    ].filter((el): el is HTMLElement => el !== null)

    // ── Canvas resize ──────────────────────────────────────────
    function resizeCanvas() {
      cnv.width  = window.innerWidth
      cnv.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas, { passive: true })

    // ── Preload all 3 sequences ────────────────────────────────
    const seq1: HTMLImageElement[] = new Array(SEQ1)
    const seq2: HTMLImageElement[] = new Array(SEQ2)
    const seq3: HTMLImageElement[] = new Array(SEQ3)

    const s1tEl   = seq1TextRef.current   // seq1 text wrapper (exit animation)
    const leftWords   = leftWordRefs.current
    const rightWords  = rightWordRefs.current
    const centerWords = centerWordRefs.current

    let loaded     = 0
    let drawnFrame = -1
    let latestScrollY  = window.scrollY
    let textVisible    = false
    let leftVisible    = false
    let rightVisible   = false
    let centerVisible  = false
    let rafId          = 0

    function onLoad() {
      loaded++
      const pct = Math.round((loaded / TOTAL) * 100)
      pctSp.textContent = `${pct}%`
      brEl.style.width  = `${pct}%`

      if (loaded < TOTAL) return

      // Draw first frame and reveal
      drawCover(cx, seq1[0], cnv.width, cnv.height)
      ldr.style.opacity      = '0'
      ldr.style.pointerEvents = 'none'
      rafId = requestAnimationFrame(tick)
    }

    function makeFrames(count: number, srcFn: (i: number) => string, arr: HTMLImageElement[]) {
      for (let i = 0; i < count; i++) {
        const img    = new Image()
        img.decoding = 'async'
        img.onload   = onLoad
        img.src      = srcFn(i)
        arr[i]       = img
      }
    }
    makeFrames(SEQ1, src1, seq1)
    makeFrames(SEQ2, src2, seq2)
    makeFrames(SEQ3, src3, seq3)

    // ── Scroll ─────────────────────────────────────────────────
    function onScroll() { latestScrollY = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })

    // ── RAF loop ───────────────────────────────────────────────
    function tick() {
      const totalScroll = ctr.offsetHeight - window.innerHeight
      const progress    = Math.min(Math.max(latestScrollY / totalScroll, 0), 1)

      // Continuous global position (0.0 – 678.0, includes 40 virtual black frames)
      const gf    = progress * (TOTAL_VIRTUAL - 1)
      const frame = Math.floor(gf)   // 0 – 678

      // ── Draw frame (only when changed) ──────────────────────
      if (frame !== drawnFrame) {
        drawnFrame = frame
        let img: HTMLImageElement
        if (frame < SEQ1) {
          img = seq1[frame]                         // seq1 (0–190)
        } else if (frame < SEQ2_START) {
          img = seq1[SEQ1 - 1]                      // virtual gap — hold last seq1 frame (hidden)
        } else if (frame < SEQ3_START) {
          img = seq2[frame - SEQ2_START]            // seq2 (196–483)
        } else if (frame < BLACK_START) {
          img = seq3[frame - SEQ3_START]            // seq3 (484–643)
        } else {
          img = seq3[SEQ3 - 1]                      // hold last seq3 frame under black
        }
        cx.clearRect(0, 0, cnv.width, cnv.height)
        drawCover(cx, img, cnv.width, cnv.height)
      }

      // ── Black overlay: transitions + interlude ───────────────
      let blackOpacity = 0

      // Exit phase — black fades in as seq1 exits (frames 161→191)
      if (gf >= EXIT_START && gf < SEQ1) {
        blackOpacity = Math.max(blackOpacity, Math.min(1, (gf - EXIT_START) / EXIT_LEN))
      }
      // Virtual gap — pure black (frames 191→196)
      if (gf >= SEQ1 && gf < SEQ2_START) {
        blackOpacity = 1
      }
      // Entry phase — black fades out as seq2 slides in (frames 196→226)
      if (gf >= SEQ2_START && gf < SEQ2_START + ENTER_LEN) {
        blackOpacity = Math.max(blackOpacity, 1 - (gf - SEQ2_START) / ENTER_LEN)
      }
      // Black interlude after seq3 — fades in and stays (no fade-out → shop transition)
      if (gf >= BLACK_START) {
        blackOpacity = Math.max(blackOpacity, Math.min(1, (gf - BLACK_START) / BLACK_FADE))
      }

      blk.style.opacity = String(blackOpacity)

      // ── seq1 exit: canvas + text scale toward centre ─────────
      if (gf < EXIT_START) {
        // Normal — clear any lingering transforms
        cnv.style.transform  = ''
        cnv.style.opacity    = ''
        if (s1tEl) { s1tEl.style.transform = ''; s1tEl.style.opacity = '' }
      } else if (gf < SEQ1) {
        // Exit: scale 1→0.3, opacity 1→0 (easeIn so it feels like it "drops away")
        const t  = easeIn((gf - EXIT_START) / EXIT_LEN)
        const sc = 1 - t * 0.7
        const op = String(1 - t)
        cnv.style.transform  = `scale(${sc})`
        cnv.style.opacity    = op
        if (s1tEl) { s1tEl.style.transform = `scale(${sc})`; s1tEl.style.opacity = op }
      } else if (gf < SEQ2_START) {
        // Virtual gap — canvas fully hidden
        cnv.style.transform  = 'scale(0.3)'
        cnv.style.opacity    = '0'
        if (s1tEl) { s1tEl.style.transform = 'scale(0.3)'; s1tEl.style.opacity = '0' }
      } else if (gf < SEQ2_START + ENTER_LEN) {
        // Entry: seq2 slides in from top, easeOut for smooth landing
        const t = easeOut((gf - SEQ2_START) / ENTER_LEN)
        cnv.style.transform  = `translateY(${(1 - t) * -100}vh)`
        cnv.style.opacity    = String(t)
        if (s1tEl) { s1tEl.style.transform = ''; s1tEl.style.opacity = '0' }
      } else {
        // Post-transition — fully normal, clear everything
        cnv.style.transform  = ''
        cnv.style.opacity    = ''
        if (s1tEl) { s1tEl.style.transform = ''; s1tEl.style.opacity = '0' }
      }

      // ── Text: seq1 only, frame >= 149, bidirectional ────────
      // Hides at SEQ1 (191) so the exit animation is the last visible action
      const shouldShowText = frame >= TEXT_TRIGGER && frame < SEQ1
      if (shouldShowText !== textVisible) {
        textVisible = shouldShowText
        wordEls.forEach((el, i) => {
          if (shouldShowText) {
            el.style.transitionDelay = `${i * STAGGER_MS}ms`
            el.style.opacity         = '1'
            el.style.transform       = 'translateY(0px)'
          } else {
            el.style.transitionDelay = '0ms'
            el.style.opacity         = '0'
            el.style.transform       = 'translateY(12px)'
          }
        })
      }

      // ── Text: seq2 left block (frame 398–467) ───────────────
      const shouldShowLeft = frame >= LEFT_TRIGGER && frame < TEXT2_HIDE
      if (shouldShowLeft !== leftVisible) {
        leftVisible = shouldShowLeft
        leftWords.forEach((el, i) => {
          if (shouldShowLeft) {
            el.style.transitionDelay = `${i * STAGGER_MS}ms`
            el.style.opacity         = '1'
            el.style.transform       = 'translateY(0px)'
          } else {
            el.style.transitionDelay = '0ms'
            el.style.opacity         = '0'
            el.style.transform       = 'translateY(12px)'
          }
        })
      }

      // ── Text: seq2 right block (frame 428–467) ──────────────
      const shouldShowRight = frame >= RIGHT_TRIGGER && frame < TEXT2_HIDE
      if (shouldShowRight !== rightVisible) {
        rightVisible = shouldShowRight
        rightWords.forEach((el, i) => {
          if (shouldShowRight) {
            el.style.transitionDelay = `${i * STAGGER_MS}ms`
            el.style.opacity         = '1'
            el.style.transform       = 'translateY(0px)'
          } else {
            el.style.transitionDelay = '0ms'
            el.style.opacity         = '0'
            el.style.transform       = 'translateY(12px)'
          }
        })
      }

      // ── Text: black interlude center block — stays until overlay exits ──
      const shouldShowCenter = frame >= CENTER_TRIGGER
      if (shouldShowCenter !== centerVisible) {
        centerVisible = shouldShowCenter
        centerWords.forEach((el, i) => {
          if (shouldShowCenter) {
            el.style.transitionDelay = `${i * STAGGER_MS}ms`
            el.style.opacity         = '1'
            el.style.transform       = 'translateY(0px)'
          } else {
            el.style.transitionDelay = '0ms'
            el.style.opacity         = '0'
            el.style.transform       = 'translateY(12px)'
          }
        })
      }

      // ── Hide whole overlay past scroll section ───────────────
      ovl.style.opacity = latestScrollY > totalScroll ? '0' : '1'

      rafId = requestAnimationFrame(tick)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* 400vh scroll driver */}
      <div ref={containerRef} style={{ height: '400vh' }} />

      {/* Fixed fullscreen overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-20"
        style={{ transition: 'opacity 0.4s ease', pointerEvents: 'none' }}
      >
        {/* Frame canvas */}
        <canvas ref={canvasRef} className="block w-full h-full" />

        {/* Left-side text — ref used for exit-scale animation in sync with canvas */}
        <div ref={seq1TextRef} className="absolute inset-0 flex items-center" style={{ paddingLeft: '8%' }}>
          <div style={{ maxWidth: '44%' }}>
            <h1 className="text-4xl md:text-8xl font-normal text-white leading-tight">
              <span ref={wYour}      style={WORD_BASE}>your </span>
              <span ref={wAgent}     style={WORD_BASE}>agent </span>
              <span ref={wWas}       style={WORD_BASE}>was </span>
              <span ref={wMissing}   style={ITALIC   }>missing</span>
              <span ref={wSomething} style={WORD_BASE}> something.</span>
            </h1>
          </div>
        </div>

        {/* seq2 left text block */}
        <div className="absolute inset-x-0 top-[10%] pointer-events-none md:top-0 md:bottom-0 md:flex md:items-center">
          <div className="text-center px-[5%] md:text-left md:px-0 md:pl-[6%] md:max-w-[40%]">
            <h2
              className="text-3xl md:text-6xl font-normal text-white leading-tight lowercase"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              {(['a\u00A0', 'generic\u00A0', 'agent'] as const).map((w, i) => (
                <span
                  key={i}
                  ref={el => { if (el) leftWordRefs.current[i] = el }}
                  style={{ opacity: 0, transform: 'translateY(12px)', transition: 'opacity 0.4s ease, transform 0.4s ease', display: 'inline' }}
                >{w}</span>
              ))}
              <br />
              {(['knows\u00A0', 'everything.'] as const).map((w, i) => (
                <span
                  key={i + 3}
                  ref={el => { if (el) leftWordRefs.current[i + 3] = el }}
                  style={{ opacity: 0, transform: 'translateY(12px)', transition: 'opacity 0.4s ease, transform 0.4s ease', display: 'inline' }}
                >{w}</span>
              ))}
              <br />
              {(['and\u00A0', 'nothing.'] as const).map((w, i) => (
                <span
                  key={i + 5}
                  ref={el => { if (el) leftWordRefs.current[i + 5] = el }}
                  style={{ opacity: 0, transform: 'translateY(12px)', transition: 'opacity 0.4s ease, transform 0.4s ease', display: 'inline' }}
                >{w}</span>
              ))}
            </h2>
          </div>
        </div>

        {/* seq2 right text block */}
        <div className="absolute inset-x-0 bottom-[10%] pointer-events-none md:top-0 md:bottom-0 md:flex md:items-center md:justify-end">
          <div className="text-center px-[5%] md:text-right md:px-0 md:pr-[6%] md:max-w-[40%]">
            <h2
              className="text-3xl md:text-6xl font-normal text-white leading-tight lowercase"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              {(['the\u00A0', 'best\u00A0', 'agents'] as const).map((w, i) => (
                <span
                  key={i}
                  ref={el => { if (el) rightWordRefs.current[i] = el }}
                  style={{ opacity: 0, transform: 'translateY(12px)', transition: 'opacity 0.4s ease, transform 0.4s ease', display: 'inline' }}
                >{w}</span>
              ))}
              <br />
              {(['are\u00A0', 'the\u00A0', 'ones'] as const).map((w, i) => (
                <span
                  key={i + 3}
                  ref={el => { if (el) rightWordRefs.current[i + 3] = el }}
                  style={{ opacity: 0, transform: 'translateY(12px)', transition: 'opacity 0.4s ease, transform 0.4s ease', display: 'inline' }}
                >{w}</span>
              ))}
              <br />
              {(['that\u00A0'] as const).map((w, i) => (
                <span
                  key={i + 6}
                  ref={el => { if (el) rightWordRefs.current[i + 6] = el }}
                  style={{ opacity: 0, transform: 'translateY(12px)', transition: 'opacity 0.4s ease, transform 0.4s ease', display: 'inline' }}
                >{w}</span>
              ))}
              <span
                ref={el => { if (el) rightWordRefs.current[7] = el }}
                style={{ opacity: 0, transform: 'translateY(12px)', transition: 'opacity 0.4s ease, transform 0.4s ease', display: 'inline', fontStyle: 'italic' }}
              >specialize.</span>
            </h2>
          </div>
        </div>

        {/* Fade-to-black layer (seq1 → seq2 transition + seq3 → shop transition) */}
        <div
          ref={blackRef}
          className="absolute inset-0 bg-black"
          style={{ opacity: 0, pointerEvents: 'none' }}
        />

        {/* Black interlude center text — rendered AFTER blackRef so it sits on top */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center px-[8%]">
            <h2
              className="text-4xl md:text-7xl font-normal text-white leading-tight lowercase"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              {(['your\u00A0', 'agent\u00A0', 'talks.'] as const).map((w, i) => (
                <span
                  key={i}
                  ref={el => { if (el) centerWordRefs.current[i] = el }}
                  style={{ opacity: 0, transform: 'translateY(12px)', transition: 'opacity 0.4s ease, transform 0.4s ease', display: 'inline' }}
                >{w}</span>
              ))}
              <br />
              {(['it\u00A0', "doesn't"] as const).map((w, i) => (
                <span
                  key={i + 3}
                  ref={el => { if (el) centerWordRefs.current[i + 3] = el }}
                  style={{ opacity: 0, transform: 'translateY(12px)', transition: 'opacity 0.4s ease, transform 0.4s ease', display: 'inline' }}
                >{w}</span>
              ))}
              <br />
              <span
                ref={el => { if (el) centerWordRefs.current[5] = el }}
                style={{ opacity: 0, transform: 'translateY(12px)', transition: 'opacity 0.4s ease, transform 0.4s ease', display: 'inline', fontStyle: 'italic' }}
              >know.</span>
            </h2>
          </div>
        </div>

        {/* Loading screen */}
        <div
          ref={loadingRef}
          className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-5"
          style={{ transition: 'opacity 0.5s ease' }}
        >
          <div className="w-48 h-px bg-slate-800 relative overflow-hidden rounded-full">
            <div
              ref={barRef}
              className="absolute inset-y-0 left-0 bg-amber-400 rounded-full"
              style={{ width: '0%', transition: 'width 0.1s linear' }}
            />
          </div>
          <span ref={pctRef} className="text-slate-500 text-xs font-mono tracking-widest">
            0%
          </span>
        </div>
      </div>
    </>
  )
}
