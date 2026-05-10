import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParticleCanvas from '../ui/ParticleCanvas'
import UsesPanel from './UsesPanel'
import ProductUI from './ProductUI'
import { SECTIONS } from '../../data/content'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollScene({
  onSectionChange,
}: {
  onSectionChange: (i: number) => void
}) {
  const stageRef   = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage   = stageRef.current!
    const wrapper = wrapperRef.current!
    const scenes  = gsap.utils.toArray<HTMLElement>('.rb-scene')
    const texts   = gsap.utils.toArray<HTMLElement>('.rb-text')
    const n       = SECTIONS.length

    // ── Global pinned timeline ─────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: `+=${(n - 1) * 100}%`,
        scrub: 1.5,
        pin: stage,
        anticipatePin: 1,
        onUpdate(self) {
          const idx = Math.round(self.progress * (n - 1))
          onSectionChange(idx)
        },
      },
    })

    // ── Transition entre chaque section ───────────────
    scenes.forEach((scene, i) => {
      if (i === 0) return

      const text = texts[i]
      const prevText = texts[i - 1]

      // Section i entre par le bas avec clipPath "eau"
      tl.fromTo(
        scene,
        {
          clipPath: 'ellipse(120% 0% at 50% 100%)',
          y: '3%',
        },
        {
          clipPath: 'ellipse(170% 170% at 50% 50%)',
          y: '0%',
          duration: 1,
          ease: 'none',
        },
        (i - 1) * 1 // chaque transition = 1 unité de timeline
      )

      // Texte précédent sort vers le haut + blur
      tl.to(
        prevText,
        {
          opacity: 0,
          y: -40,
          filter: 'blur(8px)',
          duration: 0.4,
          ease: 'power2.in',
        },
        (i - 1) * 1
      )

      // Texte courant entre depuis le bas
      tl.fromTo(
        text,
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' },
        (i - 1) * 1 + 0.5
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [onSectionChange])

  return (
    /* Wrapper : hauteur totale = n * 100vh  */
    <div ref={wrapperRef} style={{ height: `${SECTIONS.length * 100}vh` }}>

      {/* Stage : fixé par GSAP pin */}
      <div ref={stageRef} className="relative w-full h-screen overflow-hidden">

        {/* SVG water distortion filter global */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <filter id="water">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.018 0.025"
                numOctaves="3"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="28"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        {/* Scenes empilées */}
        {SECTIONS.map((section, i) => (
          <div
            key={section.id}
            className="rb-scene absolute inset-0 w-full h-full overflow-hidden"
            style={{ zIndex: i + 1 }}
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${section.image}')` }}
            />

            {/* Video (hero only) */}
            {'video' in section && (
              <video
                className="absolute inset-0 w-full h-full object-cover z-[1]"
                autoPlay muted loop playsInline
                poster={section.image}
              >
                <source src={section.video as string} type="video/mp4" />
              </video>
            )}

            {/* Particules (Neural Band) */}
            {'particles' in section && section.particles && <ParticleCanvas />}

            {/* Gradient bas */}
            <div
              className="absolute inset-0 z-[2]"
              style={{
                background:
                  'linear-gradient(to top,rgba(0,0,0,.55) 0%,rgba(0,0,0,.1) 45%,transparent 100%)',
              }}
            />

            {/* Contenu */}
            <div className="relative z-[3] h-full">
              {'product' in section && section.product ? (
                <ProductUI />
              ) : (
                <>
                  {/* Text — animé par GSAP */}
                  <div
                    className="rb-text absolute bottom-0 left-0 px-14 pb-28 max-w-[580px]"
                    style={{ opacity: i === 0 ? 1 : 0 }}
                  >
                    <h1 className="text-[clamp(36px,4.5vw,62px)] font-light leading-[1.1] mb-4">
                      {(section.headline as string[]).map((line, j) => (
                        <span key={j} className="block">{line}</span>
                      ))}
                    </h1>
                    {'body' in section && (
                      <p className="text-sm leading-[1.7] text-white/75 max-w-[420px]">
                        {section.body as string}
                      </p>
                    )}
                  </div>

                  {/* Use cases panel */}
                  {'useCards' in section && section.useCards && <UsesPanel />}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
