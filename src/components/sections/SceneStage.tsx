import { ReactNode, useEffect, useRef } from 'react'
import gsap from 'gsap'
import ParticleCanvas from '../ui/ParticleCanvas'
import ParticleDissolve from './ParticleDissolve'
import UsesPanel from './UsesPanel'
import ProductUI from './ProductUI'
import { SECTIONS } from '../../data/content'

interface SceneProps {
  section: typeof SECTIONS[number]
  index: number
}

function Scene({ section, index }: SceneProps) {
  return (
    <div
      data-scene
      data-name={section.name}
      data-thumb={section.image}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ zIndex: index + 1 }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${section.image}')`,
          backgroundSize: ('bgSize' in section ? section.bgSize : 'cover') as string,
          backgroundPosition: ('bgPos' in section ? section.bgPos : 'center') as string,
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Video hero */}
      {'video' in section && (
        <video
          className="absolute inset-0 w-full h-full object-cover z-[1]"
          autoPlay muted loop playsInline
          poster={section.image}
        >
          <source src={section.video as string} type="video/mp4" />
        </video>
      )}


      {/* Bottom gradient */}
      <div
        className="absolute inset-0 z-[3]"
        style={{ background: 'linear-gradient(to top,rgba(0,0,0,.5) 0%,rgba(0,0,0,.08) 40%,transparent 100%)' }}
      />

      {/* Content */}
      <div className="relative z-[4] h-full">
        {'product' in section && section.product ? (
          <ProductUI />
        ) : (
          <>
            <SceneText
              lines={section.headline as string[]}
              body={'body' in section ? section.body as string : undefined}
            />
            {'useCards' in section && section.useCards && <UsesPanel />}
          </>
        )}
      </div>
    </div>
  )
}

function SceneText({ lines, body }: { lines: string[]; body?: string }) {
  const linesRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    const els = linesRef.current.filter(Boolean)
    if (els.length === 0) return

    // Init letter-spacing large → sera animé à 0 par la timeline GSAP globale
    // Ici on prépare juste les lignes pour un stagger visuel au montage
    gsap.set(els, { letterSpacing: '-0.04em' })
    gsap.to(els, {
      letterSpacing: '0em',
      duration: 1.2,
      stagger: 0.08,
      ease: 'expo.out',
      delay: 0.1,
    })
  }, [])

  return (
    <div
      data-scene-text
      className="absolute bottom-0 left-0 px-14 pb-28 max-w-[580px]"
    >
      <h1 className="text-[clamp(36px,4.5vw,62px)] font-light leading-[1.1] mb-4 overflow-hidden">
        {lines.map((line, i) => (
          <span
            key={i}
            ref={el => { if (el) linesRef.current[i] = el }}
            className="block"
            style={{ display: 'block' }}
          >
            {line}
          </span>
        ))}
      </h1>
      {body && (
        <p className="text-sm leading-[1.7] text-white/75 max-w-[420px]">{body}</p>
      )}
    </div>
  )
}

export default function SceneStage() {
  return (
    <>
      {SECTIONS.map((section, i) => (
        <Scene key={section.id} section={section} index={i} />
      ))}

      {/* Canvas particules HORS de toute scène → pas affecté par le fade de la scène
          z-index 4 = même niveau que neural (index 3+1=4), après dans le DOM → dessus */}
      <ParticleDissolve />
    </>
  )
}
