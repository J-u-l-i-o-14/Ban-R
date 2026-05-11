# Guide Technique — Clone Cinématique Style Meta Ray-Ban / Apple

> Documentation complète pour reproduire ce type de projet :
> site avec scroll cinématique, transitions GSAP, dissolution en particules, menu animé.

---

## 1. VUE D'ENSEMBLE DU PROJET

### Qu'est-ce qu'on a construit ?
Un clone du site Meta Ray-Ban Display : un site de présentation produit avec
scroll cinématique style Apple/Meta. Le scroll ne fait pas défiler des sections
normalement — il avance une **timeline d'animation globale** qui contrôle
toutes les transitions entre scènes.

### Pourquoi cette approche ?
Les sites classiques React scrollent section par section (sticky CSS).
Ce projet utilise le paradigme **"film interactif"** : la page est figée,
et le scroll avance une timeline GSAP comme une bande-annonce.

---

## 2. STACK TECHNIQUE

| Technologie | Rôle | Pourquoi |
|---|---|---|
| Vite + React + TypeScript | Base du projet | Rapide, HMR instantané, typage |
| Tailwind CSS v3 | Styles utilitaires | Pas de CSS à écrire manuellement |
| GSAP + ScrollTrigger | Timeline scroll + animations | Standard industrie pour scroll cinématique |
| Lenis | Smooth scroll physique | Inertie naturelle + sync avec GSAP |
| Canvas 2D | Effet particules | Pas de dépendance Three.js lourde |
| SVG feTurbulence | Filtre eau | CSS natif, léger |

---

## 3. INSTALLATION

```bash
# 1. Créer le projet Vite
npm create vite@latest mon-projet -- --template react-ts
cd mon-projet
npm install

# 2. Dépendances principales
npm install gsap lenis

# 3. Tailwind CSS v3
npm install -D tailwindcss@3 postcss autoprefixer
node_modules/.bin/tailwindcss init -p

# 4. Utilitaires optionnels
npm install clsx lucide-react
```

### Configuration `tailwind.config.js`
```js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

### `src/index.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { background: #votre-couleur; color: white; overflow-x: hidden; }
  body { margin: 0; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
}
```

---

## 4. ARCHITECTURE DES FICHIERS

```
src/
├── animations/
│   ├── scrollTimeline.ts   ← Cerveau du site : timeline GSAP globale
│   └── easing.ts           ← Courbes d'animation centralisées
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx       ← Barre de navigation fixe
│   │   └── MobileMenu.tsx   ← Menu burger avec animations GSAP
│   ├── sections/
│   │   ├── SceneStage.tsx   ← Rend toutes les scènes empilées
│   │   └── ParticleDissolve.tsx ← Canvas 2D dissolution en particules
│   └── ui/
│       ├── BottomBar.tsx    ← Pill de navigation bas de page
│       └── SideDots.tsx     ← Points de navigation latéraux
│
├── hooks/
│   ├── useSmoothScroll.ts  ← Lenis + sync GSAP ticker
│   └── useScrollProgress.ts ← Progression globale du scroll (0-1)
│
├── state/
│   └── index.ts            ← État partagé GSAP ↔ Canvas (sans React)
│
└── data/
    └── content.ts          ← Toutes les données (sections, specs...)
```

---

## 5. LE CŒUR : TIMELINE GSAP GLOBALE

### Pourquoi une timeline globale ?
❌ Approche classique (à éviter) :
```tsx
// Chaque section scroll indépendamment → pas cinématique
<div style={{ height: '200vh' }}>
  <div className="sticky top-0">Section 1</div>
</div>
```

✅ Approche cinématique :
```tsx
// UN SEUL conteneur pinné, toutes les scènes en absolute
<div ref={containerRef} className="relative w-full h-screen overflow-hidden">
  <SceneStage /> {/* absolute inset-0 pour chaque scène */}
</div>
```

### Structure de la timeline
```ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function createScrollTimeline(container: HTMLElement, onSceneChange) {
  const scenes = container.querySelectorAll('[data-scene]')
  const texts  = container.querySelectorAll('[data-scene-text]')

  // Init : toutes les scènes invisibles sauf la première
  gsap.set(scenes, { opacity: 0 })
  gsap.set(scenes[0], { opacity: 1 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start:   'top top',
      end:     () => `+=${window.innerHeight * scenes.length * 1.6}`,
      scrub:   1.2,      // délai de lissage en secondes
      pin:     true,     // fige le container pendant le scroll
      anticipatePin: 1,
      onUpdate(self) {
        const idx = Math.floor(self.progress * scenes.length)
        onSceneChange(Math.min(scenes.length - 1, idx))
      }
    }
  })

  // Pour chaque transition i → i+1
  for (let i = 0; i < scenes.length - 1; i++) {
    addTransition(tl, scenes[i], scenes[i+1], texts[i], texts[i+1])
  }
}
```

### Règles critiques du scrub
- **`ease: 'none'`** dans les tweens scrubbed (le scrub gère lui-même le lissage)
- **`scrub: 1.2`** = le playhead suit le scroll avec 1.2s de lissage
- **Jamais** `filter: brightness()` sur les scènes (crée un stacking context qui passe au-dessus des z-index)
- **`fromTo` explicite** pour les valeurs critiques (évite les bugs de valeur initiale au scrub)

---

## 6. SMOOTH SCROLL AVEC LENIS

### Pourquoi Lenis ?
Lenis remplace le scroll natif par une inertie physique réaliste.
Il faut le **synchroniser avec GSAP** sinon ScrollTrigger et Lenis se marchent dessus.

```ts
// hooks/useSmoothScroll.ts
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export let scrollVelocity = 0  // accessible globalement pour les effets

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // ⚠️ OBLIGATOIRE : sync Lenis → GSAP ScrollTrigger
    lenis.on('scroll', (e) => {
      scrollVelocity = e.velocity
      ScrollTrigger.update()
    })

    // ⚠️ OBLIGATOIRE : utiliser gsap.ticker (pas requestAnimationFrame)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)  // évite les saccades après inactivité

    return () => lenis.destroy()
  }, [])
}
```

---

## 7. ANIMATIONS DE TEXTE (SCRUB)

### Principe : texte sort vers le haut, entre depuis le bas
```ts
// Texte sortant : 2 phases (mouvement → blur en fin de course)
tl.to(textOut, { y: -22, opacity: 0.8, filter: 'blur(0px)',  duration: 0.45, ease: 'none' })
tl.to(textOut, { y: -44, opacity: 0,   filter: 'blur(14px)', duration: 0.22, ease: 'none' }, '>')

// Texte entrant : blur à l'arrivée → se stabilise (commence en même temps que sceneIn)
tl.fromTo(textIn,
  { y: 50, opacity: 0, filter: 'blur(14px)' },
  { y: 22, opacity: 0.8, filter: 'blur(0px)', duration: 0.28, ease: 'none' },
  '<'  // démarre EN MÊME TEMPS que l'image pour éviter "image sans texte"
)
tl.to(textIn, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.42, ease: 'none' }, '>')
```

### Stagger lettre par lettre (effet premium)
```tsx
// SceneText component
useEffect(() => {
  gsap.set(linesRef.current, { letterSpacing: '-0.04em' })
  gsap.to(linesRef.current, {
    letterSpacing: '0em',
    duration: 1.2,
    stagger: 0.08,
    ease: 'expo.out',
    delay: 0.1,
  })
}, [])
```

---

## 8. SYSTÈME DE PARTICULES (Canvas 2D)

### Concept
1. Charger l'image sur un canvas off-screen
2. Lire les pixels (`getImageData`)
3. Créer des particules avec position d'origine + direction aléatoire
4. Dans un RAF : calculer position = `origin + velocity * SPREAD * progress`
5. Écrire dans `ImageData` (performant) et `putImageData`

### Code complet
```ts
const SAMPLE = 4   // 1 particule tous les 4px
const SPREAD = 500 // dispersion max en pixels

type Particle = {
  ox: number; oy: number      // position d'origine
  vx: number; vy: number      // direction normalisée
  r: number; g: number; b: number
}

// 1. Charger + sampler l'image
const img = new Image()
img.src = '/mon-image.png'   // DOIT être local (CORS interdit getImageData CDN)
img.onload = () => {
  // Calcul cover (centrer l'image sur le canvas)
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
  const dw = img.naturalWidth * scale
  const dh = img.naturalHeight * scale
  ctx.drawImage(img, (cw-dw)/2, (ch-dh)/2, dw, dh)

  const data = ctx.getImageData(0, 0, cw, ch).data
  for (let y = 0; y < ch; y += SAMPLE) {
    for (let x = 0; x < cw; x += SAMPLE) {
      const i = (y * cw + x) * 4
      if (data[i+3] < 10) continue  // pixel transparent → skip
      const angle = Math.random() * Math.PI * 2
      const speed = 0.3 + Math.random() * 0.8
      particles.push({ ox: x, oy: y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed - 0.35, r: data[i], g: data[i+1], b: data[i+2] })
    }
  }
}

// 2. Render loop
const render = () => {
  const p = progress.value  // 0 (intact) → 1 (éparpillé)
  const id = ctx.createImageData(cw, ch)
  const d = id.data

  for (const pt of particles) {
    const x = Math.round(pt.ox + pt.vx * SPREAD * p)
    const y = Math.round(pt.oy + pt.vy * SPREAD * p)
    if (x < 0 || x >= cw || y < 0 || y >= ch) continue

    // Opacité : base au repos, monte à 100% en début de dissolution
    const base = 0.18
    const eff  = base + (1 - base) * Math.min(1, p * 6)
    const alpha = Math.round(Math.max(0, eff * (1 - p)) * 255)

    // 2×2px pour visibilité
    for (let dy = 0; dy < 2; dy++) {
      for (let dx = 0; dx < 2; dx++) {
        const i4 = ((y+dy) * cw + (x+dx)) * 4
        d[i4]=pt.r; d[i4+1]=pt.g; d[i4+2]=pt.b; d[i4+3]=alpha
      }
    }
  }
  ctx.clearRect(0, 0, cw, ch)
  ctx.putImageData(id, 0, 0)
  requestAnimationFrame(render)
}
```

### Communication GSAP → Canvas (sans React re-render)
```ts
// state/index.ts
export const dissolveProgress = { value: 0 }

// Dans la timeline GSAP
tl.fromTo(dissolveProgress, { value: 0 }, { value: 1, duration: 0.7, ease: 'none' }, '<')

// Dans le canvas RAF
const p = dissolveProgress.value  // lu chaque frame
```

---

## 9. FILTRE EAU SVG

### Pourquoi SVG feTurbulence ?
Crée une distorsion organique "liquide" sans WebGL. S'anime tout seul via `<animate>`.

```html
<!-- index.html dans <body> -->
<svg style="position:absolute;width:0;height:0;overflow:hidden">
  <defs>
    <filter id="water" x="-25%" y="-25%" width="150%" height="150%">
      <feTurbulence type="fractalNoise" numOctaves="4" result="noise">
        <animate
          attributeName="baseFrequency"
          dur="9s"
          values="0.012 0.016;0.018 0.024;0.012 0.016"
          repeatCount="indefinite"
        />
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="0"
        xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
</svg>
```

Appliquer via CSS : `filter: url(#water)`
Le `scale` du `feDisplacementMap` contrôle l'intensité (0 = aucun effet).

---

## 10. MENU BURGER ANIMÉ (GSAP)

### Principe : Timeline GSAP open/close
```ts
// OUVERTURE
const tl = gsap.timeline()
tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35 })
tl.fromTo(lines, { scaleX: 0, transformOrigin: 'left center' },
  { scaleX: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out' }, '<0.1')
tl.fromTo(rows, { opacity: 0, x: -12 }, { opacity: 1, x: 0, stagger: 0.07 }, '<0.05')
tl.fromTo(btn, { y: 40, opacity: 0 }, { y: 0, opacity: 1 }, '+=0.1')

// FERMETURE (ordre inverse)
const tl = gsap.timeline({ onComplete: () => gsap.set(el, { display: 'none' }) })
tl.to(btn, { y: 36, opacity: 0, duration: 0.3 })
tl.to([...rows].reverse(), { opacity: 0, x: -10, stagger: 0.05 }, '<')
tl.to([...lines].reverse(), { scaleX: 0, transformOrigin: 'right center', stagger: 0.05 }, '<0.05')
tl.to(overlay, { opacity: 0, duration: 0.3 }, '<0.1')
```

### Règles importantes pour le menu
- `gsap.set(el, { display: 'flex' })` avant d'animer l'ouverture
- `onComplete: () => gsap.set(el, { display: 'none' })` pour la fermeture
- `tlRef.current?.kill()` avant chaque nouvelle timeline (évite les conflits)
- Z-index menu (1000) > navbar (999) pour couvrir entièrement

---

## 11. EFFETS VISUELS PREMIUM

### Film grain (3 lignes CSS)
```css
.film-grain {
  position: fixed;
  inset: -50%;
  width: 200%;
  height: 200%;
  pointer-events: none;
  z-index: 500;
  opacity: 0.038;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)'/%3E%3C/svg%3E");
  animation: film-grain 0.35s steps(1) infinite;
}
@keyframes film-grain {
  0%  { transform: translate(0, 0); }
  25% { transform: translate(-3px, 2px); }
  50% { transform: translate(2px, -3px); }
  75% { transform: translate(-2px, 3px); }
}
```

### Velocity skew (scroll rapide = inclinaison physique)
```ts
// Dans un RAF loop
const tick = () => {
  const skew = Math.max(-2.5, Math.min(2.5, scrollVelocity * 0.12))
  gsap.to('#container', { skewY: skew, duration: 0.9, ease: 'power3.out', overwrite: 'auto' })
  requestAnimationFrame(tick)
}
```

### Micro-motion idle (site qui respire)
```ts
// Démarre quand la section active change
gsap.to(activeScene, {
  y: '+=7',
  duration: 3.8,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut',
})
```

---

## 12. SYSTÈME D'EASING (courbes centralisées)

```ts
// animations/easing.ts
export const E = {
  out:       'power3.out',     // Entrée douce, sortie rapide → révèle
  inOut:     'power2.inOut',   // Symétrique → transitions scènes
  cinematic: 'expo.out',       // Très rapide puis freine → Apple-style
  smooth:    'sine.inOut',     // Organique → éléments "vivants"
  scrub:     'none',           // ⚠️ OBLIGATOIRE pour animations scrubbed
}
```

---

## 13. RÈGLES CRITIQUES (BUGS FRÉQUENTS)

### ❌ Ne jamais appliquer `filter: brightness()` aux scènes
```ts
// ❌ Crée un stacking context, passe au-dessus des z-index → ghost effect
tl.to(scene, { filter: 'brightness(1.2)' })

// ✅ Utiliser seulement opacity pour les scènes
tl.to(scene, { opacity: 0 })
```

### ❌ Ne pas appliquer filter CSS sur les scènes pendant la transition
Le `filter` CSS crée un **nouveau stacking context** qui peut ignorer les `z-index`.
Réserver `filter: blur()` aux textes uniquement.

### ✅ `sceneIn` et `textIn` doivent démarrer ensemble
```ts
// ❌ textIn démarre 0.3s après → fenêtre "image sans texte" visible
tl.fromTo(sceneIn, ..., '<0.1')
tl.fromTo(textIn, ..., '<0.3')  // trop tard !

// ✅ En même temps
tl.fromTo(sceneIn, ..., '<0.1')
tl.fromTo(textIn, ..., '<')     // '<' = même moment
```

### ✅ Toujours `fromTo` pour les valeurs critiques en mode scrub
```ts
// ❌ tl.to : GSAP capture la valeur courante au premier play → peut être 1 au 2e passage
tl.to(proxy, { value: 1 })

// ✅ fromTo : valeurs explicites toujours respectées
tl.fromTo(proxy, { value: 0 }, { value: 1 })
```

### ✅ Canvas de particules = HORS des scènes animées
Si le canvas est DANS une scène qui a `opacity: 0`, il disparaît avec elle.
Le canvas doit être un **sibling** des scènes, pas un enfant.

### ✅ Images pour Canvas = LOCAL uniquement
`getImageData()` est bloqué par CORS sur les CDN externes.
Télécharger l'image dans `public/` et référencer `/image.png`.

### ✅ Sync Lenis + GSAP ScrollTrigger obligatoire
Sans cette sync, ScrollTrigger utilise le scroll natif et Lenis l'intercepte → jerky.
```ts
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

---

## 14. STRUCTURE Z-INDEX

```
z-index 1000  : Menu burger overlay (couvre tout)
z-index 999   : Navbar fixe
z-index 998   : BottomBar
z-index 900   : SideDots
z-index 4     : Canvas particules (sibling des scènes, après dans le DOM)
z-index 1-6   : Scènes (index + 1)
```

---

## 15. COMMANDES UTILES

```bash
# Développement
npm run dev -- --port 3334 --host   # accessible sur le réseau local

# Tunnel public pour partager
npx localtunnel --port 3334          # URL publique sans compte
ngrok http --url=ton-domaine.ngrok-free.app 3334  # ngrok avec domaine gratuit

# TypeScript check
npx tsc --noEmit

# Build production
npm run build

# Git push avec buffer augmenté (si erreur mémoire GitHub)
git config http.postBuffer 157286400
git push
```

---

## 16. CHECKLIST POUR UN NOUVEAU PROJET SIMILAIRE

- [ ] Créer le projet Vite + React + TypeScript
- [ ] Installer GSAP, Lenis, Tailwind v3
- [ ] Configurer le hook `useSmoothScroll` avec sync GSAP
- [ ] Créer `state/index.ts` pour la communication GSAP ↔ Canvas
- [ ] Créer `animations/easing.ts` avec les courbes
- [ ] Créer `animations/scrollTimeline.ts` avec la timeline globale
- [ ] Créer `SceneStage.tsx` avec scènes en `absolute inset-0` + `data-scene`
- [ ] Créer `SceneText` avec `data-scene-text` pour les textes animables
- [ ] Ajouter le SVG filtre eau dans `index.html`
- [ ] Ajouter le film grain dans `index.css`
- [ ] Images pour Canvas : télécharger en local dans `public/`
- [ ] Tester : `sceneIn` et `textIn` démarrent au même moment
- [ ] Vérifier : pas de `filter:` CSS sur les divs de scènes
- [ ] Burger menu avec `display:none → flex` géré par GSAP (pas React state pour display)

---

*Réalisé avec Claude Sonnet 4.6 — Projet : Ban-R (Meta Ray-Ban Display Clone)*
*GitHub : https://github.com/J-u-l-i-o-14/Ban-R*
