import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { E } from './easing'

gsap.registerPlugin(ScrollTrigger)

function addTransition(
  tl: gsap.core.Timeline,
  sceneOut: HTMLElement,
  sceneIn: HTMLElement,
  textOut: HTMLElement | null,
  textIn: HTMLElement | null
) {
  // ── Image : crossfade pur ──────────────────────────────
  tl.to(sceneOut, { opacity: 0, duration: 1, ease: E.scrub })
  tl.fromTo(sceneIn,
    { opacity: 0 },
    { opacity: 1, duration: 1, ease: E.scrub },
    '<0.2'
  )

  // ── Texte sortant : monte proprement → blur fin de course
  if (textOut) {
    tl.to(textOut,
      { y: -22, opacity: 0.8, filter: 'blur(0px)',  duration: 0.45, ease: E.scrub },
      '<'
    )
    tl.to(textOut,
      { y: -44, opacity: 0,   filter: 'blur(14px)', duration: 0.25, ease: E.scrub },
      '>'
    )
  }

  // ── Texte entrant : blur à l'arrivée → se stabilise net
  if (textIn) {
    tl.fromTo(textIn,
      { y: 50,  opacity: 0,   filter: 'blur(14px)' },
      { y: 22,  opacity: 0.8, filter: 'blur(0px)',  duration: 0.3,  ease: E.scrub },
      '<0.15'
    )
    tl.to(textIn,
      { y: 0,   opacity: 1,   filter: 'blur(0px)',  duration: 0.45, ease: E.scrub },
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

  // End dynamique — s'adapte à chaque taille d'écran
  const total = () => `+=${window.innerHeight * n * 1.4}`

  // Init
  gsap.set(scenes,    { opacity: 0 })
  gsap.set(scenes[0], { opacity: 1 })
  gsap.set(texts,     { opacity: 0, y: 40, filter: 'blur(10px)' })
  if (texts[0]) gsap.set(texts[0], { opacity: 1, y: 0, filter: 'blur(0px)' })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger:       container,
      start:         'top top',
      end:           total,
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
      texts[i + 1] ?? null
    )
  }

  return tl
}

export function killScrollTimeline() {
  ScrollTrigger.getAll().forEach(t => t.kill())
}
