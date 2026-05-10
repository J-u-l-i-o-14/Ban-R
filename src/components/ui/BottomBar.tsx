import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Props {
  sectionName: string
  sectionThumb: string
  progress: number
  hidden: boolean
}

export default function BottomBar({ sectionName, sectionThumb, progress, hidden }: Props) {
  const pillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pillRef.current) return
    gsap.to(pillRef.current, {
      y:        hidden ? 90 : 0,
      opacity:  hidden ? 0  : 1,
      duration: 0.55,
      ease:     hidden ? 'power2.in' : 'power3.out',
    })
  }, [hidden])

  return (
    <div className="fixed bottom-0 inset-x-0 z-[998] pointer-events-none">

      {/* Pill */}
      <div
        ref={pillRef}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto
          w-[min(860px,90vw)] flex items-center rounded-full overflow-hidden
          border border-white/15"
        style={{
          background:     'linear-gradient(to right, rgba(10,20,30,0.88) 0%, rgba(20,35,50,0.70) 60%, rgba(30,50,65,0.55) 100%)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <img
          src={sectionThumb}
          alt=""
          className="w-14 h-14 object-cover flex-shrink-0 rounded-full m-1.5"
        />
        <span className="flex-1 px-4 text-[15px] font-semibold text-white whitespace-nowrap">
          {sectionName}
        </span>
        <div className="w-px h-7 bg-white/20 flex-shrink-0" />
        <a href="#"
          className="px-6 h-[60px] flex items-center text-sm text-white/75
            hover:text-white transition-colors whitespace-nowrap font-light">
          Learn more
        </a>
      </div>

      {/* Progress line */}
      <div className="h-0.5 bg-white/10">
        <div
          className="h-full bg-white transition-[width] duration-100"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

    </div>
  )
}
