import { useEffect } from 'react'
import Lenis from 'lenis'

let lenis: Lenis | null = null

export function useSmoothScroll() {
  useEffect(() => {
    lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis!.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis?.destroy()
      lenis = null
    }
  }, [])

  return lenis
}
