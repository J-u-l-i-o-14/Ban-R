import { useState, useRef } from 'react'

const CDN = (path: string) =>
  `https://media.ray-ban.com/2025/MetaDisplay/LP/${path}?hyperbypass=ok`

const COLORS = {
  black: CDN('05_Details/Black_S.jpg'),
  sand:  CDN('05_Details/Black_S.jpg'), // same fallback until real sand URL available
}

export default function ProductUI() {
  const [color, setColor] = useState<'black' | 'sand'>('black')
  const bgRef = useRef<HTMLDivElement>(null)

  const switchColor = (c: 'black' | 'sand') => {
    const bg = bgRef.current
    if (!bg) return
    bg.style.transition = 'opacity .4s'
    bg.style.opacity = '0'
    setTimeout(() => {
      setColor(c)
      bg.style.opacity = '1'
    }, 400)
  }

  return (
    <>
      {/* Dynamic background */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center transition-opacity"
        style={{ backgroundImage: `url('${COLORS[color]}')` }}
      />
      {/* Dark gradient */}
      <div className="absolute inset-0 z-[2]"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,.55) 0%, transparent 60%)' }} />

      {/* Text + color picker */}
      <div className="absolute bottom-0 left-0 px-14 pb-28 z-[3]">
        <h1 className="text-[clamp(40px,5vw,70px)] font-light leading-[1.1] mb-5">
          Meta Ray-Ban<br/>Display
        </h1>
        <div className="flex gap-2.5 mb-3">
          {(['black', 'sand'] as const).map(c => (
            <button
              key={c}
              onClick={() => switchColor(c)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs text-white
                border transition-all duration-200 cursor-pointer
                ${color === c
                  ? 'bg-white/22 border-white/90'
                  : 'bg-white/10 border-white/50 hover:bg-white/16'
                }`}
            >
              <span
                className="w-3 h-3 rounded-full border border-white/30"
                style={{ background: c === 'black' ? '#111' : '#c4a882' }}
              />
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
        <p className="text-sm text-white/60">Starting from $799</p>
      </div>
    </>
  )
}
