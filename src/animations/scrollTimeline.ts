import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SCROLL_PER_SCENE = 1400

/*
 * LOGIQUE SCRUB BIDIRECTIONNEL
 * ─────────────────────────────
 * Scrub = GSAP joue la timeline en avant (scroll bas) et en arrière (scroll haut).
 * Il suffit de définir la direction "vers le bas" :
 *   - Scène qui part  : monte légèrement + blur + fade out
 *   - Scène qui entre : monte depuis le bas + blur → net
 *   - Texte qui part  : monte + blur out
 *   - Texte qui entre : monte depuis le bas + blur → net
 * En remontant, tout s'inverse automatiquement.
 */

function addTransition(
  tl: gsap.core.Timeline,
  sceneOut: HTMLElement,
  sceneIn: HTMLElement,
  textOut: HTMLElement | null,
  textIn: HTMLElement | null
) {
  // ── Image sortante : fade simple, PAS de scale ni blur ─
  tl.to(sceneOut, {
    opacity: 0,
    duration: 1,
    ease: 'none',
  })

  // ── Image entrante : crossfade propre ─────────────────
  tl.fromTo(
    sceneIn,
    { opacity: 0 },
    { opacity: 1, duration: 1, ease: 'none' },
    '<0.2'
  )

  // ── Texte sortant : 2 phases ──────────────────────────
  // Phase 1 (70%) : monte proprement, pas de blur
  // Phase 2 (30%) : blur explose + fade out en fin de course
  if (textOut) {
    tl.to(textOut,
      { y: -22, opacity: 0.8, filter: 'blur(0px)', duration: 0.45, ease: 'none' },
      '<'
    )
    tl.to(textOut,
      { y: -44, opacity: 0,   filter: 'blur(14px)', duration: 0.25, ease: 'none' },
      '>'
    )
  }

  // ── Texte entrant : 2 phases ───────────────────────────
  // Phase 1 (30%) : arrive du bas avec blur (vient de nulle part)
  // Phase 2 (70%) : se stabilise, blur disparaît, montée propre
  if (textIn) {
    tl.fromTo(textIn,
      { y: 50,  opacity: 0,   filter: 'blur(14px)' },
      { y: 22,  opacity: 0.8, filter: 'blur(0px)',  duration: 0.3, ease: 'none' },
      '<0.15'
    )
    tl.to(textIn,
      { y: 0,   opacity: 1,   filter: 'blur(0px)',  duration: 0.45, ease: 'none' },
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

  const n     = scenes.length
  const total = (n - 1) * SCROLL_PER_SCENE

  // ── Initialisation ────────────────────────────────────
  // Toutes les scènes cachées sauf la première
  gsap.set(scenes,    { opacity: 0 })
  gsap.set(scenes[0], { opacity: 1 })

  // Tous les textes cachés sauf le premier
  gsap.set(texts,    { opacity: 0, y: 40, filter: 'blur(10px)' })
  if (texts[0]) gsap.set(texts[0], { opacity: 1, y: 0, filter: 'blur(0px)' })

  // ── Timeline pinned ───────────────────────────────────
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger:       container,
      start:         'top top',
      end:           `+=${total}`,
      scrub:         2,          // valeur haute = plus fluide/cinématique
      pin:           true,
      anticipatePin: 1,
      onUpdate(self) {
        const idx = Math.min(n - 1, Math.floor(self.progress * n))
        onSceneChange(idx)
      },
    },
  })

  // ── Transitions scène par scène ───────────────────────
  for (let i = 0; i < n - 1; i++) {
    addTransition(
      tl,
      scenes[i],
      scenes[i + 1],
      texts[i]     ?? null,
      texts[i + 1] ?? null  // ProductUI n'a pas de data-scene-text → null
    )
  }

  return tl
}

export function killScrollTimeline() {
  ScrollTrigger.getAll().forEach(t => t.kill())
}
