import { useRef, useState } from 'react'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useScrollProgress } from './hooks/useScrollProgress'
import { SECTIONS } from './data/content'

import Navbar       from './components/layout/Navbar'
import Footer       from './components/layout/Footer'
import ScrollScene  from './components/sections/ScrollScene'
import SpecsSection from './components/sections/SpecsSection'
import BottomBar    from './components/ui/BottomBar'
import SideDots     from './components/ui/SideDots'

import './index.css'

export default function App() {
  useSmoothScroll()
  const progress   = useScrollProgress()
  const [activeIdx, setActiveIdx] = useState(0)
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([])

  const scrollTo = (i: number) => {
    // Scroll to the scroll-scene wrapper proportionally
    const scene = document.getElementById('scroll-stage-wrapper')
    if (!scene) return
    const top = scene.offsetTop + (i / (SECTIONS.length - 1)) * (scene.offsetHeight - window.innerHeight)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const active = SECTIONS[activeIdx]

  return (
    <>
      <Navbar />

      {/* ── ONE PINNED SCROLL UNIVERSE ─────────────────── */}
      <div id="scroll-stage-wrapper">
        <ScrollScene onSectionChange={setActiveIdx} />
      </div>

      {/* ── SPECS (scroll normal après le stage) ───────── */}
      <SpecsSection />

      {/* ── FOOTER ─────────────────────────────────────── */}
      <Footer />

      {/* ── BOTTOM BAR ─────────────────────────────────── */}
      <BottomBar
        sectionName={active?.name ?? ''}
        sectionThumb={active?.image ?? ''}
        progress={progress}
      />

      {/* ── SIDE DOTS ──────────────────────────────────── */}
      <SideDots
        count={SECTIONS.length}
        active={activeIdx}
        onDotClick={scrollTo}
      />
    </>
  )
}
