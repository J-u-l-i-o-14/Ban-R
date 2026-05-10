import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function createScrollTimeline(
  container: HTMLElement,
  onSceneChange: (i: number) => void
) {
  const scenes = Array.from(container.querySelectorAll<HTMLElement>('[data-scene]'))
  if (scenes.length === 0) return

  // Toutes les scènes invisibles sauf la première
  gsap.set(scenes, { opacity: 0, scale: 1, x: 0, y: 0 })
  gsap.set(scenes[0], { opacity: 1 })

  const SCROLL_PER_SCENE = 1200 // px de scroll par scène
  const total = (scenes.length - 1) * SCROLL_PER_SCENE

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: `+=${total}`,
      scrub: 1.5,
      pin: true,
      anticipatePin: 1,
      onUpdate(self) {
        // Notifie la scène active pour bottom bar + dots
        const idx = Math.min(
          scenes.length - 1,
          Math.floor(self.progress * scenes.length)
        )
        onSceneChange(idx)
      },
    },
  })

  // ── SCENE 1 → 2 ─────────────────────────────────
  // Hero sort : scale up + fade out
  tl.to(scenes[0], { scale: 1.08, opacity: 0, filter: 'blur(6px)', duration: 1, ease: 'power2.in' })
  // Display entre : monte depuis le bas + dézoom
  tl.fromTo(scenes[1],
    { opacity: 0, y: '8%', scale: 1.04, filter: 'blur(8px)' },
    { opacity: 1, y: '0%', scale: 1,    filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
    '<0.3'
  )

  // ── SCENE 2 → 3 ─────────────────────────────────
  tl.to(scenes[1], { scale: 1.06, opacity: 0, filter: 'blur(6px)', duration: 1, ease: 'power2.in' })
  tl.fromTo(scenes[2],
    { opacity: 0, y: '10%', scale: 1.05, filter: 'blur(8px)' },
    { opacity: 1, y: '0%',  scale: 1,    filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
    '<0.3'
  )

  // ── SCENE 3 → 4 (Neural Band : effet particules) ─
  tl.to(scenes[2], { opacity: 0, y: '-6%', filter: 'blur(8px)', duration: 1, ease: 'power2.in' })
  tl.fromTo(scenes[3],
    { opacity: 0, scale: 1.1, filter: 'blur(10px)' },
    { opacity: 1, scale: 1,   filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
    '<0.3'
  )

  // ── SCENE 4 → 5 (Uses : glisse depuis la droite) ─
  tl.to(scenes[3], { opacity: 0, scale: 1.05, filter: 'blur(6px)', duration: 1, ease: 'power2.in' })
  tl.fromTo(scenes[4],
    { opacity: 0, x: '6%', filter: 'blur(8px)' },
    { opacity: 1, x: '0%', filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
    '<0.3'
  )

  // ── SCENE 5 → 6 (Product : zoom in depuis grand) ─
  tl.to(scenes[4], { opacity: 0, x: '-4%', filter: 'blur(6px)', duration: 1, ease: 'power2.in' })
  tl.fromTo(scenes[5],
    { opacity: 0, scale: 1.15, filter: 'blur(10px)' },
    { opacity: 1, scale: 1,    filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
    '<0.3'
  )

  return tl
}

export function killScrollTimeline() {
  ScrollTrigger.getAll().forEach(t => t.kill())
}
