const CDN = (path: string) =>
  `https://media.ray-ban.com/2025/MetaDisplay/LP/${path}?hyperbypass=ok`

export const SECTIONS = [
  {
    id: 'hero',
    name: 'In-lens display',
    image: CDN('00_Hero/Hero_S.jpg'),
    video: CDN('00_Hero/Hero_S.mp4'),
    headline: ['AI glasses,', 'now with display'],
    body: 'Interact with information in a new way with the full-color, high-resolution 600×600 pixel visual display, built into the right lens of the glasses.',
  },
  {
    id: 'display',
    name: 'In-lens display',
    image: CDN('01_Display/Display_S.jpg'),
    headline: ['AI glasses,', 'now with display'],
    body: 'Interact with information in a new way with the full-color, high-resolution 600×600 pixel visual display, built into the right lens of the glasses.',
  },
  {
    id: 'stay',
    name: 'Capabilities',
    image: CDN('02_Capabilities/Capabilities_S.jpg'),
    headline: ['Stay present,', 'stay connected'],
    body: 'Stay tuned-in with the world around you and do more than ever with Meta Ray-Ban Display.',
  },
  {
    id: 'neural',
    name: 'Meta Neural Band',
    image: CDN('03_NB/NB_S.jpg'),
    headline: ['Effortless', 'control'],
    body: 'Meta Neural Band uses EMG technology to interpret the natural signals created by your muscle activity so you can control your content in a more intuitive way.',
    particles: true,
  },
  {
    id: 'uses',
    name: 'Real-world uses',
    image: CDN('04_Uses/Uses_S.jpg'),
    headline: ['For the ones', 'who look forward'],
    body: 'Together, Meta Ray-Ban Display & Meta Neural Band change the way you interact with your world.',
    useCards: true,
  },
  {
    id: 'product',
    name: 'Meta Ray-Ban Display',
    image: CDN('05_Details/Black_S.jpg'),
    headline: ['Meta Ray-Ban', 'Display'],
    product: true,
  },
] as const

export const USE_CASES = [
  {
    id: 'directions',
    title: 'Get directions as you walk',
    desc: 'Phone-free, turn-by-turn walking directions with a visual map shown on your display.',
    image: 'https://media.ray-ban.com/2025/MetaDisplay/LP/04_Uses/00_Uses.jpg?hyperbypass=ok',
  },
  {
    id: 'translate',
    title: 'Connect in another language',
    desc: 'Live translation shown as captions directly on your in-lens display.',
    image: 'https://media.ray-ban.com/2025/MetaDisplay/LP/02_Capabilities/00_Capabilities.jpg?hyperbypass=ok',
  },
  {
    id: 'messages',
    title: 'Check your messages, not your phone',
    desc: 'View and reply to WhatsApp, Messenger, Instagram — hands-free.',
    image: 'https://media.ray-ban.com/2025/MetaDisplay/LP/02_Capabilities/01_Capabilities.jpg?hyperbypass=ok',
  },
]

export const SPECS = {
  frame: [
    { label: 'Material', value: 'Injected' },
    { label: 'Weight', value: 'Meta Ray-Ban Display 68 g / L 70 g · Case 169 g' },
    { label: 'Sizes', value: 'Standard, Large' },
  ],
  wristband: [
    { label: 'Tech', value: 'Haptic Feedback' },
    { label: 'Battery', value: '18 hour battery' },
    { label: 'Control', value: 'High Performance EMG' },
    { label: 'Sizes', value: '1 (small) · 2 (medium) · 3 (large)' },
  ],
  lens: [
    { label: 'Lens Treatment', value: 'Transitions® Gen8' },
    { label: 'Lens Color', value: 'Clear / Grey' },
    { label: 'Display', value: 'Full-color, Hi-res 600×600px integrated into one lens' },
  ],
  camera: [
    { label: 'Resolution', value: '12 MP ultra wide 3× Zoom' },
    { label: 'Image', value: '3024 × 4032 pixels' },
    { label: 'Video', value: '1440 × 1920 pixels @30fps' },
    { label: 'Display', value: '20° FOV monocular display, 600×600 pixels' },
  ],
  audio: [
    { label: 'Speakers', value: '2 custom-built speakers (open ear)' },
    { label: 'Microphone', value: 'Custom 5-mic Array (2L · 2R · 1 nose pad)' },
    { label: 'Voice Command', value: 'Ask "Hey Meta"' },
  ],
  battery: [
    { label: 'Battery', value: 'Up to 6 hours / 24 hours with charged case' },
    { label: 'Memory', value: '32 GB Flash · 100+ videos · 500+ photos' },
  ],
  connectivity: [
    { label: 'Wi-Fi', value: 'WiFi 6' },
    { label: 'Bluetooth', value: '5.3' },
    { label: 'OS Compatibility', value: 'iOS 15.2+ · Android 10+' },
  ],
  inbox: ['Charging Case', 'Cleaning Cloth', 'Quick Start Guide', 'Safety & Warranty Guide', 'USB-C Cable'],
}
