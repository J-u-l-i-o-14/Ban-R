interface Props {
  count: number
  active: number
  onDotClick: (i: number) => void
}

export default function SideDots({ count, active, onDotClick }: Props) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[900] flex flex-col gap-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          aria-label={`Go to section ${i + 1}`}
          className={`w-1.5 h-1.5 rounded-full cursor-pointer border-none transition-all duration-300
            ${i === active
              ? 'bg-white scale-[1.5]'
              : 'bg-white/30 hover:bg-white/60'
            }`}
        />
      ))}
    </div>
  )
}
