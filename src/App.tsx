import { useEffect, useRef, useState } from 'react'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { createScrollTimeline, killScrollTimeline } from './animations/scrollTimeline'
import { SECTIONS } from './data/content'

import Navbar       from './components/layout/Navbar'
import Footer       from './components/layout/Footer'
import SceneStage   from './components/sections/SceneStage'
import SpecsSection from './components/sections/SpecsSection'
import BottomBar    from './components/ui/BottomBar'
import SideDots     from './components/ui/SideDots'

import './index.css'

export default function App() {
  useSmoothScroll()

  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const tl = createScrollTimeline(container, (idx) => {
      setActiveIdx(idx)
      // Calcul de la progression globale pour la barre de bas de page
      const max = document.body.scrollHeight - window.innerHeight
      if (max > 0) setScrollProgress(window.scrollY / max)
    })

    // Mise à jour progress bar au scroll
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      if (max > 0) setScrollProgress(window.scrollY / max)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      killScrollTimeline()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const scrollToScene = (i: number) => {
    const container = containerRef.current
    if (!container) return
    const SCROLL_PER_SCENE = 1200
    const top = container.offsetTop + i * SCROLL_PER_SCENE
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const active = SECTIONS[activeIdx]

  return (
    <>
      <Navbar />

      {/* ── SINGLE PINNED SCROLL UNIVERSE ────────── */}
      <div
        ref={containerRef}
        id="scroll-container"
        className="relative w-full h-screen overflow-hidden"
        style={{ isolation: 'isolate' }}
      >
        <SceneStage />
      </div>

      {/* ── SPECS + FOOTER (scroll normal) ──────── */}
      <SpecsSection />
      <Footer />

      {/* ── UI overlay ──────────────────────────── */}
      <BottomBar
        sectionName={active?.name ?? ''}
        sectionThumb={active?.image ?? ''}
        progress={scrollProgress}
      />

      <SideDots
        count={SECTIONS.length}
        active={activeIdx}
        onDotClick={scrollToScene}
      />
    </>
  )
}
