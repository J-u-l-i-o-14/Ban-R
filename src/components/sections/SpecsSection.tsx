import { SPECS } from '../../data/content'

const CDN_BLUR = 'https://media.ray-ban.com/2025/MetaDisplay/LP/05_Details/Black_S.jpg?hyperbypass=ok'

function Group({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <div className="mb-11">
      <h3 className="text-lg font-light mb-4 pb-2.5 border-b border-white/20">{title}</h3>
      {items.map(item => (
        <div key={item.label} className="flex gap-3 py-3.5 border-b border-white/07">
          <div>
            <p className="text-[10px] font-semibold tracking-[1.5px] uppercase mb-0.5">{item.label}</p>
            <p className="text-sm text-white/65 leading-[1.5]">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SpecsSection() {
  return (
    <section className="relative z-[7] overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #3d6880, #6696aa)' }}>
      {/* Blurred background */}
      <div
        className="absolute inset-[-20px] bg-cover bg-center opacity-35"
        style={{
          backgroundImage: `url('${CDN_BLUR}')`,
          filter: 'blur(35px)',
          transform: 'scale(1.05)',
        }}
      />

      <div className="relative z-[1] px-14 pt-[120px] pb-20 max-md:px-6">
        <h2 className="text-[clamp(36px,4vw,58px)] font-light mb-2.5">Product details</h2>
        <p className="text-sm text-white/65 mb-14 max-w-[460px] leading-[1.7]">
          Together, Meta Ray-Ban Display & Meta Neural Band change the way you interact with your world.
        </p>

        <div className="grid grid-cols-2 gap-x-[72px] max-md:grid-cols-1">
          <Group title="Frame description"    items={SPECS.frame} />
          <Group title="Wristband description" items={SPECS.wristband} />
          <Group title="Lens information"      items={SPECS.lens} />
          <Group title="Camera"                items={SPECS.camera} />
          <Group title="Audio"                 items={SPECS.audio} />
          <Group title="Battery and memory"    items={SPECS.battery} />
          <Group title="Connectivity"          items={SPECS.connectivity} />

          {/* In the box */}
          <div className="mb-11">
            <h3 className="text-lg font-light mb-4 pb-2.5 border-b border-white/20">In the box</h3>
            <ul className="list-none p-0">
              {SPECS.inbox.map(item => (
                <li key={item} className="py-3 border-b border-white/07 text-xs font-medium tracking-[1.5px] uppercase">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
