import { useEffect, useRef } from 'react'
import { neuralProgress } from '../../state'

const SAMPLE = 5     // 1 particule tous les 5px
const SPREAD = 320   // dispersion max en pixels

type Particle = {
  ox: number; oy: number
  vx: number; vy: number
  r: number; g: number; b: number
}

export default function ParticleDissolve() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const rafRef    = useRef<number>(0)
  const readyRef  = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = canvas.offsetWidth  || window.innerWidth
      canvas.height = canvas.offsetHeight || window.innerHeight
      if (readyRef.current) buildParticles()
    }

    const buildParticles = () => {
      const cw = canvas.width
      const ch = canvas.height
      const img = new Image()
      img.src   = '/nb.png'

      img.onload = () => {
        const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
        const dw = img.naturalWidth  * scale
        const dh = img.naturalHeight * scale
        const dx = (cw - dw) / 2
        const dy = (ch - dh) / 2

        const off  = document.createElement('canvas')
        off.width  = cw
        off.height = ch
        const oc   = off.getContext('2d')!
        oc.drawImage(img, dx, dy, dw, dh)

        const data = oc.getImageData(0, 0, cw, ch).data
        particles.current = []

        for (let y = 0; y < ch; y += SAMPLE) {
          for (let x = 0; x < cw; x += SAMPLE) {
            const idx = (y * cw + x) * 4
            if (data[idx + 3] < 10) continue

            const angle = Math.random() * Math.PI * 2
            const speed = 0.4 + Math.random() * 0.6
            particles.current.push({
              ox: x, oy: y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 0.28,
              r: data[idx], g: data[idx + 1], b: data[idx + 2],
            })
          }
        }
        readyRef.current = true
      }
      img.onerror = () => console.warn('[ParticleDissolve] /nb.png not found')
    }

    const render = () => {
      const p   = neuralProgress.value
      const pts = particles.current
      const cw  = canvas.width
      const ch  = canvas.height

      // Opacité du canvas lui-même : visible à p=0, disparaît à p>0.9
      canvas.style.opacity = p > 0.95 ? '0' : '1'

      if (!readyRef.current) {
        rafRef.current = requestAnimationFrame(render)
        return
      }

      const id = ctx.createImageData(cw, ch)
      const d  = id.data

      for (const pt of pts) {
        const x = Math.round(pt.ox + pt.vx * SPREAD * p)
        const y = Math.round(pt.oy + pt.vy * SPREAD * p)
        if (x < 0 || x >= cw || y < 0 || y >= ch) continue

        const particleOpacity = Math.max(0, 1 - p * 1.5)
        const i4 = (y * cw + x) * 4
        d[i4]     = pt.r
        d[i4 + 1] = pt.g
        d[i4 + 2] = pt.b
        d[i4 + 3] = Math.round(particleOpacity * 255)
      }

      ctx.clearRect(0, 0, cw, ch)
      ctx.putImageData(id, 0, 0)
      rafRef.current = requestAnimationFrame(render)
    }

    resize()
    buildParticles()
    rafRef.current = requestAnimationFrame(render)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 4 }}   // au-dessus de neural (z=4, mais après dans le DOM)
    />
  )
}
