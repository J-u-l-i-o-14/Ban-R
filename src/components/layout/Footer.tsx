export default function Footer() {
  return (
    <footer className="relative z-[7] text-center px-10 pt-[72px] pb-9
      border-t border-white/08"
      style={{ background: 'rgba(30,55,70,.9)' }}>
      <p className="text-[20px] font-light mb-5 opacity-80">
        ∞ Meta &nbsp;|&nbsp; <em style={{ fontFamily: 'Georgia,serif' }}>Ray·Ban</em>
      </p>
      <a
        href="https://www.ray-ban.com" target="_blank" rel="noreferrer"
        className="inline-block px-6 py-2 rounded-full border border-white/35
          text-xs text-white hover:bg-white/08 transition-colors mb-9"
      >
        Ray-Ban.com
      </a>

      <div className="flex justify-center gap-5 mb-9">
        {['f', '◎', '𝕏', '▶'].map((icon, i) => (
          <a
            key={i} href="#"
            className="w-10 h-10 rounded-full border border-white/25 flex items-center
              justify-center text-sm hover:bg-white/08 transition-colors"
          >
            {icon}
          </a>
        ))}
      </div>

      <p className="text-[11px] text-white/35 border-t border-white/08 pt-5">
        © 2025 Ray-Ban. A Luxottica Group brand. · Privacy · Terms
      </p>
    </footer>
  )
}
