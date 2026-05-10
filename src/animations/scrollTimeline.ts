import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { E } from './easing'
import { neuralProgress } from '../state'

gsap.registerPlugin(ScrollTrigger)

function addTransition(
  tl: gsap.core.Timeline,
  sceneOut: HTMLElement,
  sceneIn: HTMLElement,
  textOut: HTMLElement | null,
  textIn: HTMLElement | null,
  dissolveProxy?: { value: number }
) {
  // ── 1. HOLD — scène respire avant toute animation ─────────
  tl.to({}, { duration: 0.9 })

  // ── 2. TEXTE SORTANT : monte proprement → blur fin de course
  if (textOut) {
    tl.to(textOut,
      { y: -22, opacity: 0.8, filter: 'blur(0px)',  duration: 0.4,  ease: E.scrub },
      '>'
    )
    tl.to(textOut,
      { y: -44, opacity: 0,   filter: 'blur(14px)', duration: 0.22, ease: E.scrub },
      '>'
    )
  }

  // ── 3. IMAGE SORTANTE : opacity pure, SANS filter ─────────
  tl.to(sceneOut,
    { opacity: 0, duration: 0.7, ease: E.scrub },
    textOut ? '<0.1' : '>'
  )

  // ── Dissolution particules (Neural Band uniquement) ────────
  // fromTo explicite pour garantir 0 → 1 même lors du scrub
  if (dissolveProxy) {
    tl.fromTo(dissolveProxy,
      { value: 0 },
      { value: 1, duration: 0.7, ease: E.scrub },
      '<'
    )
  }

  // ── 4. IMAGE ENTRANTE + TEXTE ENTRANT en même temps ───────
  // Démarrent ensemble pour éviter la fenêtre "image sans texte"
  tl.fromTo(sceneIn,
    { opacity: 0 },
    { opacity: 1, duration: 0.7, ease: E.scrub },
    '<0.15'
  )

  if (textIn) {
    tl.fromTo(textIn,
      { y: 50,  opacity: 0,   filter: 'blur(14px)' },
      { y: 22,  opacity: 0.8, filter: 'blur(0px)',  duration: 0.28, ease: E.scrub },
      '<'  // exactement en même temps que sceneIn
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
  const scenes = Array.from(container.querySelectorAll<HTMLElement>('[data-scene]'))
  const texts  = Array.from(container.querySelectorAll<HTMLElement>('[data-scene-text]'))

  if (scenes.length === 0) return

  const n = scenes.length

  gsap.set(scenes,    { opacity: 0 })
  gsap.set(scenes[0], { opacity: 1 })
  gsap.set(texts,     { opacity: 0, y: 40, filter: 'blur(10px)' })
  if (texts[0]) gsap.set(texts[0], { opacity: 1, y: 0, filter: 'blur(0px)' })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger:       container,
      start:         'top top',
      end:           () => `+=${window.innerHeight * n * 1.6}`,
      scrub:         1.2,
      pin:           true,
      anticipatePin: 1,
      onUpdate(self) {
        const idx = Math.min(n - 1, Math.floor(self.progress * n))
        onSceneChange(idx)
      },
    },
  })

  for (let i = 0; i < n - 1; i++) {
    // Reset neuralProgress avant chaque transition
    if (i === 3) gsap.set(neuralProgress, { value: 0 })

    addTransition(
      tl,
      scenes[i],
      scenes[i + 1],
      texts[i]     ?? null,
      texts[i + 1] ?? null,
      i === 3 ? neuralProgress : undefined  // dissolution sur Neural Band uniquement
    )
  }

  return tl
}

export function killScrollTimeline() {
  ScrollTrigger.getAll().forEach(t => t.kill())
}
