<template>
  <div class="landing" :class="{ loaded }">

    <canvas ref="starCanvas" class="star-canvas" aria-hidden="true"></canvas>

    <nav class="nav">
      <div class="nav-inner">
        <a href="/" class="nav-logo">
          <img src="/icon_round.png" alt="hoshi" class="nav-icon" />
          <span class="nav-name">hoshi</span>
        </a>
        <div class="nav-links">
          <a href="/docs/guide/introduction" class="nav-link">Docs</a>
          <a href="/docs/extensions/getting-started" class="nav-link">Extensions</a>
          <a href="https://github.com/hoshi-io/hoshi" target="_blank" class="nav-gh" aria-label="GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
        </div>
      </div>
    </nav>

    <section class="policy-wrapper">
      <div class="container policy-inner">
        <h1 class="policy-title">Privacy Policy</h1>

        <div class="policy-content">
          <div class="policy-block">
            <h3>Data Collection</h3>
            <p>There is <strong>0 data collected</strong> by hoshi, and <strong>everything remains completely local</strong> on your device. We do not have servers storing your watch history, reading progress, or personal information.</p>
          </div>

          <div class="policy-block">
            <h3>Network Activity</h3>
            <p>While the application stores your data locally, the <strong>app does network requests</strong>. These requests are strictly necessary to fetch media metadata, images, and content directly from the sources and extensions you choose to use.</p>
          </div>

          <div class="policy-block">
            <h3>Authentication</h3>
            <p>The app supports authentications, but they are strictly <strong>external ones</strong>. If you choose to sync your libraries, you authenticate directly with third-party providers (such as <strong>AniList</strong> or <strong>MyAnimeList</strong>). We do not intercept, view, or store your login credentials.</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <span class="footer-logo">hoshi</span>
          <span class="footer-license">GNU AGPL v3.0 · Open Source</span>
        </div>
        <div class="footer-nav">
          <a href="/docs/guide/introduction">Docs</a>
          <a href="https://github.com/hoshi-io/hoshi" target="_blank">GitHub</a>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const loaded = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    loaded.value = true
  })
})

const starCanvas = ref(null)
let animationId = null

onMounted(() => {
  const canvas = starCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = document.documentElement.scrollHeight
  }

  const STAR_COUNT = 1000
  const stars = []

  const initStars = () => {
    stars.length = 0
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        baseAlpha: Math.random() * 0.35 + 0.08,
        alpha: 0,
        speed: Math.random() * 0.004 + 0.001,
        phase: Math.random() * Math.PI * 2,
      })
    }
  }

  let time = 0

  const draw = () => {
    time += 0.01
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const s of stars) {
      const alpha = s.baseAlpha + Math.sin(time + s.phase) * s.baseAlpha * 0.35
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${alpha})`
      ctx.fill()
    }
    animationId = requestAnimationFrame(draw)
  }

  const onResize = () => {
    resize()
    initStars()
  }

  window.addEventListener('resize', onResize)
  resize()
  initStars()
  resize()
  initStars()
  draw()

  onBeforeUnmount(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', onResize)
  })
})
</script>

<style scoped>
/* Core Landing Styles (Kept identical to landing.vue for consistency) */
.star-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 0;
}

.landing {
  position: relative;
  background-color: #09090b !important;
  color: #f4f4f5 !important;
  font-family: system-ui, -apple-system, sans-serif !important;
  min-height: 100vh;
  width: 100%;
}

.landing a, .landing p, .landing h1, .landing h2, .landing h3, .landing span {
  text-decoration: none !important;
  margin: 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 64px;
}

/* NAV */
.nav {
  position: fixed; top: 0; left: 0; width: 100%;
  height: 64px;
  background-color: rgba(9, 9, 11, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #27272a;
  z-index: 100;
  display: flex; align-items: center;
  transition: background-color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease;
}
.nav-inner {
  width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 64px;
  display: flex; justify-content: space-between; align-items: center;
}
.nav-logo {
  display: flex; align-items: center; gap: 10px;
  font-weight: 700; font-size: 1.1rem; color: #fff !important;
}
.nav-icon { width: 26px; height: 26px; border-radius: 50%; }

.nav-links { display: flex; gap: 16px; align-items: center; }
.nav-link {
  color: #a1a1aa !important; font-size: 0.85rem; font-weight: 500;
  padding: 6px 8px; transition: color 0.2s ease;
}
.nav-gh {
  color: #a1a1aa !important; display: flex; align-items: center;
  padding: 6px; transition: color 0.2s ease;
}
.nav-link:hover, .nav-gh:hover { color: #fff !important; }

/* POLICY SECTION */
.policy-wrapper {
  padding-top: 160px;
  padding-bottom: 100px;
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 200px);
}

.policy-inner {
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.loaded .policy-inner {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.05s;
}

.policy-title {
  font-size: 3.5rem;
  font-weight: 900;
  color: #ffffff !important;
  letter-spacing: -0.04em;
  text-align: center;
}

.policy-content {
  background-color: #0f0f11;
  padding: 40px;
  border-radius: 16px;
  border: 1px solid #18181b;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.policy-block h3 {
  font-size: 1.2rem;
  color: #ffffff !important;
  margin-bottom: 12px !important;
  font-weight: 700;
}

.policy-block p {
  font-size: 0.95rem;
  color: #a1a1aa !important;
  line-height: 1.7;
}

.policy-block strong {
  color: #d4d4d8 !important;
  font-weight: 600;
}

/* FOOTER */
.footer {
  padding: 48px 0; border-top: 1px solid #18181b;
  position: relative; z-index: 1;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.loaded .footer {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.15s;
}

.footer-inner {
  display: flex; justify-content: space-between; align-items: center;
}
.footer-brand { display: flex; flex-direction: column; gap: 4px; }
.footer-logo { font-weight: 800; font-size: 1.1rem; color: #ffffff !important; }
.footer-license { font-size: 0.8rem; color: #52525b !important; }
.footer-nav { display: flex; gap: 20px; }
.footer-nav a { color: #71717a !important; font-size: 0.85rem; font-weight: 500; transition: color 0.2s ease; }
.footer-nav a:hover { color: #ffffff !important; }

/* MEDIA QUERIES */
@media (max-width: 900px) {
  .container { padding: 0 24px; }
  .nav-inner { padding: 0 24px; }
  .policy-title { font-size: 2.8rem; }
  .footer-inner { flex-direction: column; gap: 32px; text-align: center; }
}

@media (max-width: 600px) {
  .nav-links { display: none; }
  .policy-title { font-size: 2.2rem; }
  .policy-content { padding: 24px; }
}
</style>