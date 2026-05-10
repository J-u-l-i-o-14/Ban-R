import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Props {
  lines: string[]
  body?: string
}

export default function SceneText({ lines, body }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            el,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
          )
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="absolute bottom-0 left-0 px-14 pb-28 max-w-[580px]"
      style={{ opacity: 0 }}
    >
      <h1 className="text-[clamp(36px,4.5vw,62px)] font-light leading-[1.1] mb-4">
        {lines.map((line, i) => (
          <span key={i} className="block">{line}</span>
        ))}
      </h1>
      {body && (
        <p className="text-sm leading-[1.7] text-white/75 max-w-[420px]">{body}</p>
      )}
    </div>
  )
}
