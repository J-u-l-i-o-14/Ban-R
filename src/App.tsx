import { useEffect, useRef, useState } from 'react'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useScrollProgress } from './hooks/useScrollProgress'
import { SECTIONS } from './data/content'

import Navbar       from './components/layout/Navbar'
import Footer       from './components/layout/Footer'
import PinnedScene  from './components/sections/PinnedScene'
import SceneText    from './components/sections/SceneText'
import UsesPanel    from './components/sections/UsesPanel'
import ProductUI    from './components/sections/ProductUI'
import SpecsSection from './components/sections/SpecsSection'
import BottomBar    from './components/ui/BottomBar'
import SideDots     from './components/ui/SideDots'

import './index.css'

export default function App() {
  useSmoothScroll()
  const progress = useScrollProgress()

  const [activeIdx, setActiveIdx]   = useState(0)
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([])

  /* Track active section for bottom bar + side dots */
  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight
      let idx = 0
      wrapperRefs.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (rect.top <= vh * 0.5 && rect.bottom >= vh * 0.5) idx = i
      })
      setActiveIdx(idx)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (i: number) => {
    wrapperRefs.current[i]?.scrollIntoView({ behavior: 'smooth' })
  }

  const active = SECTIONS[activeIdx]

  return (
    <>
      <Navbar />

      {/* ── PINNED SECTIONS ───────────────────────────── */}
      {SECTIONS.map((section, i) => (
        <div
          key={section.id}
          ref={el => { wrapperRefs.current[i] = el }}
        >
          <PinnedScene
            id={section.id}
            bgImage={section.image}
            bgVideo={'video' in section ? section.video : undefined}
            zIndex={i + 1}
            particles={'particles' in section && section.particles}
            data-name={section.name}
            data-thumb={section.image}
          >
            {'product' in section && section.product ? (
              <ProductUI />
            ) : (
              <>
                <SceneText
                  lines={section.headline as string[]}
                  body={'body' in section ? section.body : undefined}
                />
                {'useCards' in section && section.useCards && <UsesPanel />}
              </>
            )}
          </PinnedScene>
        </div>
      ))}

      {/* ── SPECS ─────────────────────────────────────── */}
      <SpecsSection />

      {/* ── FOOTER ────────────────────────────────────── */}
      <Footer />

      {/* ── BOTTOM BAR ────────────────────────────────── */}
      <BottomBar
        sectionName={active?.name ?? ''}
        sectionThumb={active?.image ?? ''}
        progress={progress}
      />

      {/* ── SIDE DOTS ─────────────────────────────────── */}
      <SideDots
        count={SECTIONS.length}
        active={activeIdx}
        onDotClick={scrollTo}
      />
    </>
  )
}
