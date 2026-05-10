import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-[999] flex items-center justify-center px-8 py-[18px]
        transition-all duration-500
        ${scrolled ? 'bg-black/20 backdrop-blur-md' : 'bg-transparent'}`}
    >
      {/* Logo — centré */}
      <a href="#" className="flex items-center gap-3 text-white no-underline select-none">
        <span className="text-[18px] font-light tracking-wide">∞ Meta</span>
        <span className="w-px h-5 bg-white/40" />
        <em className="text-[18px] font-normal not-italic" style={{ fontFamily: 'Georgia, serif' }}>
          Ray·Ban
        </em>
      </a>

      {/* Actions — droite */}
      <div className="absolute right-8 flex items-center gap-3">
        <a
          href="#"
          className="px-4 py-1.5 rounded-full border border-white/70 text-white text-xs
            hover:bg-white/15 transition-colors duration-200"
        >
          Book a demo
        </a>
        <button
          aria-label="Menu"
          className="w-[34px] h-[34px] rounded-full border border-white/50 flex flex-col
            items-center justify-center gap-1 bg-transparent cursor-pointer"
        >
          <span className="block w-3 h-px bg-white rounded-full" />
          <span className="block w-3 h-px bg-white rounded-full" />
        </button>
      </div>
    </nav>
  )
}
