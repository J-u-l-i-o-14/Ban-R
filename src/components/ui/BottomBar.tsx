interface Props {
  sectionName: string
  sectionThumb: string
  progress: number
}

export default function BottomBar({ sectionName, sectionThumb, progress }: Props) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-[998] pointer-events-none">
      {/* Section pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-auto
        flex items-center bg-black/75 backdrop-blur-xl border border-white/10
        rounded-xl overflow-hidden min-w-[280px]">
        <img
          src={sectionThumb}
          alt=""
          className="w-12 h-12 object-cover flex-shrink-0"
        />
        <span className="flex-1 px-4 text-sm font-light whitespace-nowrap">{sectionName}</span>
        <a
          href="#"
          className="px-4 h-12 flex items-center text-xs text-white/70
            border-l border-white/10 hover:text-white transition-colors"
        >
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
