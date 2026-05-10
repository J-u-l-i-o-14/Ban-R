import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const CDN = (p: string) => `https://media.ray-ban.com/2025/MetaDisplay/LP/${p}?hyperbypass=ok`

const ITEMS = [
  { name: 'In-lens display',  thumb: CDN('01_Display/Display_S.jpg') },
  { name: 'Capabilities',     thumb: CDN('02_Capabilities/Capabilities_S.jpg') },
  { name: 'Meta Neural Band', thumb: CDN('03_NB/NB_S.jpg') },
  { name: 'Real-world uses',  thumb: CDN('04_Uses/Uses_S.jpg') },
  { name: 'Product details',  thumb: CDN('05_Details/Black_S.jpg') },
]

interface Props { open: boolean; onClose: () => void }

export default function MobileMenu({ open, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const linesRef   = useRef<(HTMLDivElement | null)[]>([])
  const rowsRef    = useRef<(HTMLDivElement | null)[]>([])
  const btnRef     = useRef<HTMLDivElement>(null)
  const tlRef      = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const el = overlayRef.current
    if (!el) return

    // Tuer la timeline précédente avant d'en créer une nouvelle
    tlRef.current?.kill()

    if (open) {
      gsap.set(el, { display: 'flex' })

      const tl = gsap.timeline()
      tlRef.current = tl

      // Backdrop
      tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' })

      // Lignes tracées de gauche → droite
      tl.fromTo(
        linesRef.current.filter(Boolean),
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out' },
        '<0.1'
      )

      // Images + textes apparaissent sur les lignes (stagger identique)
      tl.fromTo(
        rowsRef.current.filter(Boolean),
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.07, ease: 'power3.out' },
        '<0.05'
      )

      // "Book a demo" monte depuis le bas en dernier
      tl.fromTo(
        btnRef.current,
        { y: 40, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.45, ease: 'power3.out' },
        '+=0.1'   // légère pause avant qu'il arrive
      )

    } else {
      // ── Fermeture : inverse fluide ─────────────────────
      const tl = gsap.timeline({
        onComplete: () => gsap.set(el, { display: 'none' }),
      })
      tlRef.current = tl

      // Bouton descend
      tl.to(btnRef.current,
        { y: 36, opacity: 0, duration: 0.3, ease: 'power2.in' }
      )
      // Lignes et rows se ferment (stagger inverse)
      tl.to(
        [...rowsRef.current].reverse().filter(Boolean),
        { opacity: 0, x: -10, duration: 0.25, stagger: 0.05, ease: 'power2.in' },
        '<0.05'
      )
      tl.to(
        [...linesRef.current].reverse().filter(Boolean),
        { scaleX: 0, transformOrigin: 'right center', duration: 0.35, stagger: 0.05, ease: 'power2.in' },
        '<0.05'
      )
      // Backdrop
      tl.to(el, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '<0.1')
    }
  }, [open])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex-col"
      style={{ display: 'none', background: 'rgba(14,24,32,.94)', backdropFilter: 'blur(24px)' }}
    >
      {/* Header — pleine largeur, boutons aux extrémités */}
      <div className="flex items-center justify-between px-8 pt-7 pb-4">
        <button onClick={onClose}
          className="flex items-center gap-2 text-white/65 text-xs border border-white/22
            rounded-full px-4 py-2 hover:text-white hover:border-white/45 transition-colors tracking-wide">
          ← Back to Homepage
        </button>
        <button onClick={onClose}
          className="w-9 h-9 rounded-full border border-white/35 flex items-center justify-center
            text-white/80 hover:text-white hover:border-white/60 transition-colors text-sm leading-none">
          ✕
        </button>
      </div>

      {/* Contenu centré — ne touche pas les bords */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-full max-w-[700px] mx-auto px-6">

          {ITEMS.map((item, i) => (
            <div key={item.name} className="relative">
              {/* Ligne horizontale animée */}
              <div
                ref={el => { linesRef.current[i] = el }}
                className="absolute top-0 left-0 right-0 h-px bg-white/22"
              />

              {/* Image + Texte */}
              <div
                ref={el => { rowsRef.current[i] = el }}
                className="flex items-center gap-5 py-[18px] cursor-pointer group"
                onClick={onClose}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.thumb} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-white text-[22px] font-light tracking-tight
                  group-hover:opacity-70 transition-opacity">
                  {item.name}
                </span>
              </div>
            </div>
          ))}

          {/* Ligne finale */}
          <div className="h-px bg-white/22" />
        </div>
      </div>

      {/* Book a demo — centré, même largeur que la liste */}
      <div ref={btnRef} className="w-full max-w-[700px] mx-auto px-6 pb-10 pt-5">
        <button className="w-full py-[14px] rounded-full border border-white/40 text-white
          text-xs tracking-[2.5px] uppercase hover:bg-white/08 transition-colors">
          Book a demo
        </button>
      </div>
    </div>
  )
}
