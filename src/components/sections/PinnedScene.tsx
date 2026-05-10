import { useRef, useEffect, ReactNode } from 'react'
import ParticleCanvas from '../ui/ParticleCanvas'

interface Props {
  id: string
  bgImage: string
  bgVideo?: string
  zIndex: number
  children: ReactNode
  particles?: boolean
  'data-name'?: string
  'data-thumb'?: string
}

export default function PinnedScene({
  id, bgImage, bgVideo, zIndex, children, particles,
  'data-name': dataName,
  'data-thumb': dataThumb,
}: Props) {
  const sceneRef = useRef<HTMLElement>(null)
  const wrapRef  = useRef<HTMLDivElement>(null)

  /* Water-entry border-radius animation driven by scroll */
  useEffect(() => {
    const onScroll = () => {
      const wrap = wrapRef.current
      const scene = sceneRef.current
      if (!wrap || !scene || zIndex === 1) return

      const rect = wrap.getBoundingClientRect()
      const vh   = window.innerHeight
      // t: 1 when wrapper enters from bottom, 0 when it reaches top
      const t = Math.max(0, Math.min(1, rect.top / vh))
      const r = t * 40 // vw
      scene.style.borderRadius = r > 0.3 ? `${r}vw ${r}vw 0 0` : '0'
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [zIndex])

  return (
    <div ref={wrapRef} className="relative" style={{ height: '200vh' }}>
      <section
        ref={sceneRef}
        id={id}
        data-name={dataName}
        data-thumb={dataThumb}
        className="sticky top-0 h-screen overflow-hidden"
        style={{ zIndex, willChange: 'border-radius' }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />

        {/* Video overlay (hero only) */}
        {bgVideo && (
          <video
            className="absolute inset-0 w-full h-full object-cover z-[1]"
            autoPlay muted loop playsInline
            poster={bgImage}
          >
            <source src={bgVideo} type="video/mp4" />
          </video>
        )}

        {/* Particles */}
        {particles && <ParticleCanvas />}

        {/* Bottom gradient */}
        <div className="absolute inset-0 z-[2]"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,.55) 0%, rgba(0,0,0,.12) 45%, transparent 100%)' }}
        />

        {/* Content */}
        <div className="relative z-[3] h-full">
          {children}
        </div>
      </section>
    </div>
  )
}
