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
  const [activeIdx, setActiveIdx]       = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      if (max > 0) setScrollProgress(window.scrollY / max)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // RAF garantit que le DOM React est entièrement rendu
    const raf = requestAnimationFrame(() => {
      createScrollTimeline(container, (idx) => {
        setActiveIdx(idx)
        onScroll()
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      killScrollTimeline()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const scrollToScene = (i: number) => {
    const container = containerRef.current
    if (!container) return
    const SCROLL_PER_SCENE = 1400
    const top = container.offsetTop + i * SCROLL_PER_SCENE
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const active = SECTIONS[activeIdx]

  return (
    <>
      <Navbar />

      <div
        ref={containerRef}
        id="scroll-container"
        className="relative w-full h-screen overflow-hidden"
        style={{ isolation: 'isolate' }}
      >
        <SceneStage />
      </div>

      <SpecsSection />
      <Footer />

      <BottomBar
        sectionName={active?.name ?? ''}
        sectionThumb={active?.image ?? ''}
        progress={scrollProgress}
        hidden={activeIdx === SECTIONS.length - 1}
      />

      <SideDots
        count={SECTIONS.length}
        active={activeIdx}
        onDotClick={scrollToScene}
      />
    </>
  )
}
