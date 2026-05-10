import { useEffect, useRef } from 'react'

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let raf: number
    type Particle = { x: number; y: number; r: number; vx: number; vy: number; a: number }
    let pts: Particle[] = []

    const resize = () => {
      canvas.width  = canvas.offsetWidth  || window.innerWidth
      canvas.height = canvas.offsetHeight || window.innerHeight
    }

    const init = () => {
      pts = Array.from({ length: 400 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        a: Math.random() * 0.55 + 0.2,
      }))
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach(p => {
        p.x = (p.x + p.vx + canvas.width)  % canvas.width
        p.y = (p.y + p.vy + canvas.height) % canvas.height
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(190,215,230,${p.a})`
        ctx.fill()
      })
      raf = requestAnimationFrame(tick)
    }

    resize()
    init()
    tick()

    window.addEventListener('resize', () => { resize(); init() })
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1] opacity-40"
    />
  )
}
