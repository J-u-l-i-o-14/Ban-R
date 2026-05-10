import { SPECS } from '../../data/content'

const CDN_BLUR = 'https://media.ray-ban.com/2025/MetaDisplay/LP/05_Details/Black_S.jpg?hyperbypass=ok'

/* ── SVG icons matching the original Ray-Ban page ── */
const ICONS: Record<string, JSX.Element> = {
  material: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M4 16c0-3 2-5 5-5h4c2 0 3 1 3 3s1 3 3 3h4c3 0 5 2 5 5"/>
      <path d="M8 16h2M22 16h2" strokeLinecap="round"/>
      <ellipse cx="10" cy="16" rx="2" ry="2"/>
      <ellipse cx="22" cy="16" rx="2" ry="2"/>
    </svg>
  ),
  weight: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M10 10h12l2 14H8L10 10z"/>
      <path d="M13 10a3 3 0 016 0" strokeLinecap="round"/>
      <path d="M12 17h8M13 21h6" strokeLinecap="round"/>
    </svg>
  ),
  sizes: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M4 20c0-3 2-5 5-5h4c1.5 0 3 1 3 2.5S17.5 20 19 20h4c3 0 5 2 5 4"/>
      <ellipse cx="11" cy="19" rx="2" ry="2"/>
      <ellipse cx="21" cy="20" rx="2" ry="2"/>
    </svg>
  ),
  tech: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="8" y="12" width="16" height="10" rx="3"/>
      <path d="M12 12V9a4 4 0 018 0v3" strokeLinecap="round"/>
      <path d="M16 17v2" strokeLinecap="round"/>
      <circle cx="16" cy="16" r="1.5"/>
    </svg>
  ),
  battery: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="4" y="11" width="20" height="10" rx="2"/>
      <path d="M24 15v2" strokeLinecap="round" strokeWidth="2"/>
      <path d="M8 16h8" strokeLinecap="round"/>
    </svg>
  ),
  control: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M8 16 Q10 10 16 10 Q22 10 24 16"/>
      <path d="M8 16 Q10 22 16 22 Q22 22 24 16"/>
      <line x1="12" y1="13" x2="12" y2="19"/>
      <line x1="16" y1="11" x2="16" y2="21"/>
      <line x1="20" y1="13" x2="20" y2="19"/>
    </svg>
  ),
  lensT: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="16" cy="16" r="9"/>
      <circle cx="16" cy="16" r="5"/>
      <path d="M16 7v2M16 23v2M7 16h2M23 16h2" strokeLinecap="round"/>
      <path d="M13 16a3 3 0 016 0" strokeLinecap="round"/>
    </svg>
  ),
  lensC: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="16" cy="16" r="9"/>
      <path d="M16 7a9 9 0 010 18" fill="currentColor" fillOpacity=".15"/>
      <circle cx="16" cy="16" r="4"/>
    </svg>
  ),
  display: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="16" cy="16" r="9"/>
      <circle cx="16" cy="16" r="5"/>
      <path d="M16 11v2M16 19v2M11 16h2M19 16h2" strokeLinecap="round"/>
      <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  resolution: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="5" y="8" width="22" height="16" rx="2"/>
      <text x="10" y="20" fontSize="8" fill="currentColor" stroke="none" fontWeight="500">12MP</text>
    </svg>
  ),
  image: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="6" y="6" width="20" height="20" rx="2"/>
      <path d="M6 13h20M13 6v20" strokeLinecap="round"/>
    </svg>
  ),
  video: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <polygon points="12,10 24,16 12,22"/>
    </svg>
  ),
  fov: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="16" cy="16" r="9"/>
      <circle cx="16" cy="16" r="5"/>
      <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none"/>
      <path d="M10 10l3 3M22 10l-3 3M10 22l3-3M22 22l-3-3" strokeLinecap="round"/>
    </svg>
  ),
  speakers: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <polygon points="8,12 13,12 19,7 19,25 13,20 8,20"/>
      <path d="M22 12a6 6 0 010 8M25 9a11 11 0 010 14" strokeLinecap="round"/>
    </svg>
  ),
  mic: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="12" y="5" width="8" height="13" rx="4"/>
      <path d="M8 18a8 8 0 0016 0" strokeLinecap="round"/>
      <line x1="16" y1="26" x2="16" y2="22" strokeLinecap="round"/>
      <line x1="12" y1="26" x2="20" y2="26" strokeLinecap="round"/>
    </svg>
  ),
  voice: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M4 16c0-4 3-7 7-7h10c4 0 7 3 7 7s-3 7-7 7H7l-4 4V16z"/>
      <path d="M11 16h10M11 13h6M11 19h8" strokeLinecap="round"/>
    </svg>
  ),
  metaLogo: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M4 20c2-6 5-10 8-10 2 0 3 2 4 5 1-3 2-5 4-5 3 0 6 4 8 10"/>
      <path d="M4 20c0 1.5 1 2.5 2.5 2.5 2 0 3-2 4-4 1 2 2 4 4 4s3-2 4-4c1 2 2 4 4 4 1.5 0 2.5-1 2.5-2.5"/>
    </svg>
  ),
  touch: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M14 8a2 2 0 014 0v8l4-2a2 2 0 012 2v2a10 10 0 01-10 10 10 10 0 01-10-10v-6a2 2 0 014 0v3"/>
      <path d="M14 16v-8" strokeLinecap="round"/>
    </svg>
  ),
  glassesVoice: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M3 14c0-2 2-4 5-4h4c1.5 0 3 1.5 3 3s1.5 3 3 3h4c3 0 5 2 5 4"/>
      <ellipse cx="10" cy="14" rx="3" ry="3"/>
      <ellipse cx="22" cy="14" rx="3" ry="3"/>
      <path d="M10 20v2M22 20v2" strokeLinecap="round"/>
      <path d="M8 22h4M20 22h4" strokeLinecap="round"/>
      <path d="M14 8v2M18 8v2" strokeLinecap="round"/>
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="9" y="4" width="14" height="24" rx="3"/>
      <circle cx="16" cy="23" r="1.5" fill="currentColor" stroke="none"/>
      <path d="M13 7h6" strokeLinecap="round"/>
    </svg>
  ),
  band: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="6" y="10" width="20" height="12" rx="4"/>
      <path d="M6 14h20M6 18h20" strokeLinecap="round" strokeOpacity=".4"/>
      <circle cx="16" cy="16" r="2"/>
    </svg>
  ),
  batteryMain: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="3" y="10" width="22" height="12" rx="2"/>
      <path d="M25 14v4" strokeLinecap="round" strokeWidth="2.5"/>
      <path d="M7 16h10" strokeLinecap="round"/>
    </svg>
  ),
  memory: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="6" y="6" width="20" height="20" rx="2"/>
      <text x="9" y="20" fontSize="7" fill="currentColor" stroke="none" fontWeight="600">32GB</text>
    </svg>
  ),
  wifi: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M5 15a16 16 0 0122 0" strokeLinecap="round"/>
      <path d="M9 19a10 10 0 0114 0" strokeLinecap="round"/>
      <path d="M13 23a5 5 0 016 0" strokeLinecap="round"/>
      <circle cx="16" cy="26" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  bluetooth: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M10 10l12 12-6 6V4l6 6L10 22" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  os: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="16" cy="16" r="11"/>
      <text x="9" y="20" fontSize="7" fill="currentColor" stroke="none" fontWeight="600">OS</text>
    </svg>
  ),
  // In the box
  case: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="5" y="10" width="22" height="16" rx="2"/>
      <path d="M11 10V8a5 5 0 0110 0v2" strokeLinecap="round"/>
      <path d="M5 18h22" strokeLinecap="round"/>
      <path d="M13 18v3M19 18v3" strokeLinecap="round"/>
    </svg>
  ),
  cloth: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="6" y="8" width="20" height="16" rx="2"/>
      <path d="M6 13h20M6 19h20M11 8v16M21 8v16" strokeLinecap="round" strokeOpacity=".4"/>
    </svg>
  ),
  guide: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M20 4H9a2 2 0 00-2 2v20a2 2 0 002 2h14a2 2 0 002-2V10z"/>
      <path d="M20 4v6h6" strokeLinecap="round"/>
      <path d="M11 16h10M11 20h7M11 12h5" strokeLinecap="round"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M16 4l10 4v8c0 6-4 10-10 12C10 26 6 22 6 16V8l10-4z"/>
      <path d="M12 16l3 3 5-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  usb: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M10 16h12M22 12l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="4" y="13" width="6" height="6" rx="1"/>
    </svg>
  ),
}

interface SpecItem { label: string; value: string }

function SpecGroup({ title, items, iconKeys }: {
  title: string
  items: SpecItem[]
  iconKeys: string[]
}) {
  return (
    <div className="mb-12">
      <h3 className="text-xl font-light mb-5 pb-3 border-b border-white/20">{title}</h3>
      {items.map((item, i) => (
        <div key={item.label} className="flex items-start gap-4 py-4 border-b border-white/[0.07]">
          <div className="w-8 h-8 flex-shrink-0 opacity-70 mt-0.5">
            {ICONS[iconKeys[i]] ?? null}
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[1.8px] uppercase mb-1">{item.label}</p>
            <p className="text-sm text-white/65 leading-[1.55]">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SpecsSection() {
  return (
    <section className="relative z-[7] overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#3d6880,#6696aa)' }}>

      {/* Blurred bg */}
      <div className="absolute inset-[-20px] bg-cover bg-center opacity-35"
        style={{ backgroundImage:`url('${CDN_BLUR}')`, filter:'blur(35px)', transform:'scale(1.05)' }}
      />

      <div className="relative z-[1] px-14 pt-[120px] pb-20 max-md:px-6">
        <h2 className="text-[clamp(36px,4vw,58px)] font-light mb-3">Product details</h2>
        <p className="text-sm text-white/65 mb-16 max-w-[480px] leading-[1.7]">
          Together, Meta Ray-Ban Display & Meta Neural Band change the way you interact with your world.
        </p>

        <div className="grid grid-cols-2 gap-x-20 max-md:grid-cols-1">

          <SpecGroup title="Frame description" items={SPECS.frame}
            iconKeys={['material','weight','sizes']} />

          <SpecGroup title="Wristband description" items={SPECS.wristband}
            iconKeys={['tech','battery','control','sizes']} />

          <SpecGroup title="Lens information" items={SPECS.lens}
            iconKeys={['lensT','lensC','display']} />

          <SpecGroup title="Camera" items={SPECS.camera}
            iconKeys={['resolution','image','video','fov']} />

          <SpecGroup title="Audio" items={SPECS.audio}
            iconKeys={['speakers','mic','metaLogo']} />

          {/* Controls */}
          <div className="mb-12">
            <h3 className="text-xl font-light mb-5 pb-3 border-b border-white/20">Controls</h3>
            {[
              { icon: 'touch',       label: 'TOUCH',               value: 'Touchpad on temple arm' },
              { icon: 'glassesVoice',label: 'VOICE',               value: 'Ask "Hey Meta"' },
              { icon: 'glassesVoice',label: 'META AI',             value: 'Meta AI built-in' },
              { icon: 'phone',       label: 'META COMPANION APP',  value: 'iOS & Android' },
              { icon: 'band',        label: 'META NEURAL BAND',    value: 'EMG wristband control' },
            ].map(c => (
              <div key={c.label} className="flex items-start gap-4 py-4 border-b border-white/[0.07]">
                <div className="w-8 h-8 flex-shrink-0 opacity-70 mt-0.5">{ICONS[c.icon]}</div>
                <div>
                  <p className="text-[11px] font-semibold tracking-[1.8px] uppercase mb-1">{c.label}</p>
                  <p className="text-sm text-white/65">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          <SpecGroup title="Battery and memory" items={SPECS.battery}
            iconKeys={['batteryMain','memory']} />

          <SpecGroup title="Connectivity" items={SPECS.connectivity}
            iconKeys={['wifi','bluetooth','os']} />

          {/* In the box */}
          <div className="mb-12">
            <h3 className="text-xl font-light mb-5 pb-3 border-b border-white/20">In the box</h3>
            {[
              { icon:'case',   label:'CHARGING CASE' },
              { icon:'cloth',  label:'CLEANING CLOTH' },
              { icon:'guide',  label:'QUICK START GUIDE' },
              { icon:'shield', label:'SAFETY & WARRANTY GUIDE' },
              { icon:'usb',    label:'USB-C CABLE' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-4 py-4 border-b border-white/[0.07]">
                <div className="w-8 h-8 flex-shrink-0 opacity-70">{ICONS[b.icon]}</div>
                <p className="text-[11px] font-semibold tracking-[1.8px] uppercase">{b.label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
