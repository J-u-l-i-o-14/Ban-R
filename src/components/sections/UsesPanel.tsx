import { useEffect, useRef } from 'react'
import { USE_CASES } from '../../data/content'

export default function UsesPanel() {
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          refs.current.forEach((el, i) => {
            if (!el) return
            setTimeout(() => {
              el.style.opacity = '1'
              el.style.transform = 'translateX(0)'
            }, i * 200)
          })
        } else {
          refs.current.forEach(el => {
            if (!el) return
            el.style.opacity = '0'
            el.style.transform = 'translateX(30px)'
          })
        }
      },
      { threshold: 0.4 }
    )

    const parent = refs.current[0]?.closest('section')
    if (parent) observer.observe(parent)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="absolute right-12 top-1/2 -translate-y-1/2 z-[3] w-[290px] flex flex-col gap-3
      max-lg:hidden">
      {USE_CASES.map((uc, i) => (
        <div
          key={uc.id}
          ref={el => { refs.current[i] = el }}
          className="rounded-2xl overflow-hidden border border-white/14"
          style={{
            background: 'rgba(10,25,35,.65)',
            backdropFilter: 'blur(14px)',
            opacity: 0,
            transform: 'translateX(30px)',
            transition: 'opacity .5s ease, transform .5s ease',
          }}
        >
          <img src={uc.image} alt={uc.title} className="w-full h-28 object-cover" />
          <div className="p-3.5">
            <h4 className="text-sm font-medium mb-1.5">{uc.title}</h4>
            <p className="text-[11px] leading-[1.55] text-white/60">{uc.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
