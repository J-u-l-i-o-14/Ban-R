import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { E } from './easing'

gsap.registerPlugin(ScrollTrigger)

function addTransition(
  tl: gsap.core.Timeline,
  sceneOut: HTMLElement,
  sceneIn: HTMLElement,
  textOut: HTMLElement | null,
  textIn: HTMLElement | null,
  waterOverlay: HTMLElement | null,
  dispMap: SVGElement | null
) {
  // ── 1. HOLD — scène respire, rien ne bouge (45% du temps) ─
  tl.to({}, { duration: 0.9 })

  // ── 2. WATER OVERLAY — distorsion liquide apparaît ────────
  if (waterOverlay && dispMap) {
    gsap.set(dispMap, { attr: { scale: 0 } })
    tl.to(waterOverlay,
      { opacity: 0.75, duration: 0.35, ease: E.scrub },
      '>'
    )
    tl.to(dispMap,
      { attr: { scale: 50 }, duration: 0.35, ease: E.scrub },
      '<'
    )
  }

  // ── 3. TEXTE SORTANT : monte → blur en fin de course ──────
  if (textOut) {
    tl.to(textOut,
      { y: -22, opacity: 0.8, filter: 'blur(0px)',  duration: 0.4, ease: E.scrub },
      waterOverlay ? '<' : '>'
    )
    tl.to(textOut,
      { y: -44, opacity: 0,   filter: 'blur(14px)', duration: 0.22, ease: E.scrub },
      '>'
    )
  }

  // ── 4. IMAGE SORTANTE : brightness flash + fade ───────────
  tl.to(sceneOut,
    { filter: 'brightness(1.2)', opacity: 0.4, duration: 0.35, ease: E.scrub },
    textOut ? '<' : '>'
  )
  tl.to(sceneOut,
    { filter: 'brightness(1)',   opacity: 0,   duration: 0.4,  ease: E.scrub },
    '>'
  )

  // ── 5. IMAGE ENTRANTE ─────────────────────────────────────
  tl.fromTo(sceneIn,
    { opacity: 0 },
    { opacity: 1, duration: 0.75, ease: E.scrub },
    '<0.15'
  )

  // ── 6. WATER OVERLAY — disparaît, distorsion se résorbe ───
  if (waterOverlay && dispMap) {
    tl.to(waterOverlay,
      { opacity: 0, duration: 0.55, ease: E.scrub },
      '<0.1'
    )
    tl.to(dispMap,
      { attr: { scale: 0 }, duration: 0.55, ease: E.scrub },
      '<'
    )
  }

  // ── 7. TEXTE ENTRANT : blur à l'arrivée → se stabilise ───
  if (textIn) {
    tl.fromTo(textIn,
      { y: 50,  opacity: 0,   filter: 'blur(14px)' },
      { y: 22,  opacity: 0.8, filter: 'blur(0px)',  duration: 0.28, ease: E.scrub },
      '<0.12'
    )
    tl.to(textIn,
      { y: 0,   opacity: 1,   filter: 'blur(0px)',  duration: 0.42, ease: E.scrub },
      '>'
    )
  }
}

export function createScrollTimeline(
  container: HTMLElement,
  onSceneChange: (i: number) => void
) {
  const scenes       = Array.from(container.querySelectorAll<HTMLElement>('[data-scene]'))
  const texts        = Array.from(container.querySelectorAll<HTMLElement>('[data-scene-text]'))
  const waterOverlay = container.querySelector<HTMLElement>('#water-overlay')
  const dispMap      = document.querySelector<SVGElement>('#water feDisplacementMap')

  if (scenes.length === 0) return

  const n = scenes.length

  gsap.set(scenes,    { opacity: 0 })
  gsap.set(scenes[0], { opacity: 1 })
  gsap.set(texts,     { opacity: 0, y: 40, filter: 'blur(10px)' })
  if (texts[0]) gsap.set(texts[0], { opacity: 1, y: 0, filter: 'blur(0px)' })
  if (dispMap)  gsap.set(dispMap,  { attr: { scale: 0 } })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger:       container,
      start:         'top top',
      end:           () => `+=${window.innerHeight * n * 1.6}`,
      scrub:         2,
      pin:           true,
      anticipatePin: 1,
      onUpdate(self) {
        const idx = Math.min(n - 1, Math.floor(self.progress * n))
        onSceneChange(idx)
      },
    },
  })

  for (let i = 0; i < n - 1; i++) {
    addTransition(
      tl,
      scenes[i],
      scenes[i + 1],
      texts[i]     ?? null,
      texts[i + 1] ?? null,
      waterOverlay,
      dispMap
    )
  }

  return tl
}

export function killScrollTimeline() {
  ScrollTrigger.getAll().forEach(t => t.kill())
}
