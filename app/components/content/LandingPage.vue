<script setup lang="ts">

const localePath = useLocalePath();
const { t, tm, rt } = useI18n();

/* ─── Hero headline: typewriter cycling through the taglines ─── */
const heroTitles = computed<string[]>(() => (tm('landing.hero.titles') as unknown[]).map(m => rt(m as never)));

const typedLength = ref(heroTitles.value[0]?.length ?? 0);
const titleIndex = ref(0);

const currentTitle = computed(() => heroTitles.value[titleIndex.value] ?? '');
const typed = computed(() => currentTitle.value.slice(0, typedLength.value));
/* Last word stays in the accent colour while it is being typed. */
const accentStart = computed(() => {
  const space = currentTitle.value.lastIndexOf(' ');
  return space === -1 ? 0 : space + 1;
});
const typedHead = computed(() => typed.value.slice(0, accentStart.value));
const typedAccent = computed(() => typed.value.slice(accentStart.value));
/* Rendered invisibly behind the typed text so the block never changes height. */
const longestTitle = computed(() => heroTitles.value.reduce((a, b) => (b.length > a.length ? b : a), ''));

const TYPE_MS = 65;
const ERASE_MS = 30;
const HOLD_MS = 2000;
const NEXT_MS = 400;

let timer: ReturnType<typeof setTimeout> | undefined;
let erasing = false;

function schedule(delay: number) {
  timer = setTimeout(step, delay);
}

function step() {
  const full = currentTitle.value;

  if (!erasing) {
    if (typedLength.value < full.length) {
      typedLength.value += 1;
      schedule(TYPE_MS);
    }
    else {
      erasing = true;
      schedule(HOLD_MS);
    }
    return;
  }

  if (typedLength.value > 0) {
    typedLength.value -= 1;
    schedule(ERASE_MS);
  }
  else {
    erasing = false;
    titleIndex.value = (titleIndex.value + 1) % heroTitles.value.length;
    schedule(NEXT_MS);
  }
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  erasing = true;
  schedule(HOLD_MS);
});

onBeforeUnmount(() => clearTimeout(timer));

useSeoMeta({
  title: () => heroTitles.value[0] ?? '',
  description: t('landing.hero.description'),
});

const rawSignals = [
  { time: '14:32:07.441', type: 'VELOCITY_BREACH',     entity: 'MTN·GH·***4821',      amount: 'GHS 12,400',   action: 'BLOCK',  risk: 'HIGH' },
  { time: '14:32:08.203', type: 'SIM_SWAP_PROXIMITY',  entity: 'Orange·SN·***7293',    amount: 'XOF 85,000',   action: 'FLAG',   risk: 'MED'  },
  { time: '14:32:09.847', type: 'LARGE_OUTLIER',       entity: 'GTBank·NG·***1149',    amount: 'NGN 2,400,000',action: 'REVIEW', risk: 'MED'  },
  { time: '14:32:11.012', type: 'IMPOSSIBLE_TRAVEL',   entity: 'Absa·ZA·***9872',      amount: 'ZAR 44,000',   action: 'BLOCK',  risk: 'HIGH' },
  { time: '14:32:12.589', type: 'RAPID_VELOCITY',      entity: 'Ecobank·CI·***3341',   amount: 'XOF 210,000',  action: 'FLAG',   risk: 'MED'  },
  { time: '14:32:13.771', type: 'NEW_DEVICE_ACCESS',   entity: 'M-Pesa·KE·***6621',    amount: 'KES 128,000',  action: 'FLAG',   risk: 'MED'  },
  { time: '14:32:15.123', type: 'SYNTHETIC_IDENTITY',  entity: 'Zenith·NG·***0184',    amount: 'NGN 890,000',  action: 'BLOCK',  risk: 'HIGH' },
  { time: '14:32:16.004', type: 'MULE_NETWORK',        entity: 'UBA·GH·***7743',       amount: 'GHS 7,200',    action: 'REVIEW', risk: 'MED'  },
  { time: '14:32:17.888', type: 'VELOCITY_BREACH',     entity: 'Airtel·TZ·***2291',    amount: 'TZS 4,800,000',action: 'BLOCK',  risk: 'HIGH' },
  { time: '14:32:19.033', type: 'GEO_ANOMALY',         entity: 'Standard·ZA·***5519',  amount: 'ZAR 91,000',   action: 'FLAG',   risk: 'MED'  },
  { time: '14:32:20.441', type: 'PEP_MATCH',           entity: 'Access·NG·***3302',    amount: 'NGN 5,200,000',action: 'BLOCK',  risk: 'HIGH' },
  { time: '14:32:21.820', type: 'SANCTIONS_HIT',       entity: 'BCI·SN·***8870',       amount: 'XOF 1,400,000',action: 'BLOCK',  risk: 'HIGH' },
];

const signals = [...rawSignals, ...rawSignals];

const stats = [
  { value: '< 48ms', label: 'landing.stats.detection_latency' },
  { value: '94M+',   label: 'landing.stats.signals_month'   },
  { value: '23',     label: 'landing.stats.institutions'       },
  { value: '99.7%',  label: 'landing.stats.uptime_sla'         },
];

const features = [
  {
    code: '01',
    icon: 'i-lucide-shield-check',
    title: 'landing.features.items.01.title',
    description: 'landing.features.items.01.description',
    link: '/platform/network-effects',
  },
  {
    code: '02',
    icon: 'i-lucide-lock-keyhole',
    title: 'landing.features.items.02.title',
    description: 'landing.features.items.02.description',
    link: '/security/principles',
  },
  {
    code: '03',
    icon: 'i-lucide-bar-chart-3',
    title: 'landing.features.items.03.title',
    description: 'landing.features.items.03.description',
    link: '/api/overview',
  },
  {
    code: '04',
    icon: 'i-lucide-scale',
    title: 'landing.features.items.04.title',
    description: 'landing.features.items.04.description',
    link: '/compliance/positioning',
  },
  {
    code: '05',
    icon: 'i-lucide-git-fork',
    title: 'landing.features.items.05.title',
    description: 'landing.features.items.05.description',
    link: '/platform/architecture',
  },
  {
    code: '06',
    icon: 'i-lucide-users',
    title: 'landing.features.items.06.title',
    description: 'landing.features.items.06.description',
    link: '/partners/operational-guides/kyb-onboarding',
  },
];

</script>

<template>
  <div class="landing">

    <!-- ═══════ HERO ═══════ -->
    <section class="hero">
      <div class="hero-grid-bg" aria-hidden="true" />

      <div class="hero-inner">

        <!-- Left ─ headline + CTAs -->
        <div class="hero-left">
          <div class="live-badge">
            <span class="live-dot" aria-hidden="true" />
            <span class="live-text">{{ $t('landing.hero.badge') }}</span>
          </div>

          <h1 class="hero-title" :aria-label="currentTitle">
            <span class="hero-title-ghost" aria-hidden="true">{{ longestTitle }}</span>
            <span class="hero-title-typed" aria-hidden="true">{{ typedHead }}<span class="hero-accent">{{ typedAccent }}</span><span class="hero-caret" /></span>
          </h1>

          <p class="hero-desc">
            {{ $t('landing.hero.description') }}
          </p>

          <div class="hero-actions">
            <NuxtLink :to="localePath('/getting-started/onboarding')" class="btn-primary-hero">
              <UIcon name="i-lucide-shield-plus" class="btn-icon" />
              {{ $t('common.request_access') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/platform/architecture')" class="btn-ghost-hero">
              {{ $t('common.how_it_works') }}
              <UIcon name="i-lucide-arrow-right" class="btn-icon" />
            </NuxtLink>
          </div>
        </div>

        <!-- Right ─ live signal terminal -->
        <div class="hero-right">
          <div class="terminal">
            <div class="terminal-bar">
              <div class="terminal-dots">
                <span /><span /><span />
              </div>
              <span class="terminal-title">{{ $t('landing.hero.terminal.title') }}</span>
              <span class="terminal-live">● {{ $t('landing.hero.terminal.live') }}</span>
            </div>

            <div class="terminal-legend">
              <span>{{ $t('landing.hero.terminal.legend.time') }}</span>
              <span>{{ $t('landing.hero.terminal.legend.detector') }}</span>
              <span>{{ $t('landing.hero.terminal.legend.entity') }}</span>
              <span>{{ $t('landing.hero.terminal.legend.action') }}</span>
            </div>

            <div class="terminal-viewport">
              <div class="terminal-track">
                <div
                  v-for="(s, i) in signals"
                  :key="`${s.time}-${i}`"
                  class="signal-row"
                  :class="s.risk === 'HIGH' ? 'signal-high' : 'signal-med'"
                >
                  <span class="sig-time">{{ s.time }}</span>
                  <span class="sig-type">{{ s.type }}</span>
                  <span class="sig-entity">{{ s.entity }}</span>
                  <span class="sig-action" :class="s.action === 'BLOCK' ? 'action-block' : s.action === 'FLAG' ? 'action-flag' : 'action-review'">
                    {{ s.action }}
                  </span>
                </div>
              </div>
            </div>

            <div class="terminal-footer">
              <span>{{ $t('landing.hero.terminal.footer.version') }}</span>
              <span>·</span>
              <span>{{ $t('landing.hero.terminal.footer.encryption') }}</span>
              <span>·</span>
              <span>{{ $t('landing.hero.terminal.footer.pii') }}</span>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ═══════ STATS STRIP ═══════ -->
    <div class="stats-strip">
      <div class="stats-inner">
        <div v-for="s in stats" :key="s.label" class="stat-item">
          <span class="stat-value">{{ s.value }}</span>
          <span class="stat-label">{{ $t(s.label) }}</span>
        </div>
      </div>
    </div>

    <!-- ═══════ FEATURES ═══════ -->
    <section class="features-section">
      <div class="features-inner">
        <header class="section-header">
          <p class="section-eyebrow">{{ $t('landing.features.eyebrow') }}</p>
          <h2 class="section-title">{{ $t('landing.features.title') }}</h2>
          <p class="section-desc">
            {{ $t('landing.features.description') }}
          </p>
        </header>

        <div class="features-grid">
          <article v-for="f in features" :key="f.code" class="feature-card">
            <div class="feature-header">
              <span class="feature-code">{{ f.code }}</span>
              <UIcon :name="f.icon" class="feature-icon" />
            </div>
            <h3 class="feature-title">{{ $t(f.title) }}</h3>
            <p class="feature-desc">{{ $t(f.description) }}</p>
            <NuxtLink :to="localePath(f.link)" class="feature-link">
              {{ $t('landing.features.learn_more') }} <UIcon name="i-lucide-arrow-right" class="feature-link-icon" />
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <!-- ═══════ CTA ═══════ -->
    <section class="cta-section">
      <div class="cta-inner">
        <div class="cta-glow" aria-hidden="true" />
        <p class="section-eyebrow">{{ $t('landing.cta.eyebrow') }}</p>
        <h2 class="cta-title">{{ $t('landing.cta.title') }}</h2>
        <p class="cta-desc">
          {{ $t('landing.cta.description') }}
        </p>
        <div class="cta-actions">
          <NuxtLink :to="localePath('/getting-started/onboarding')" class="btn-primary-hero">
            <UIcon name="i-lucide-check-circle" class="btn-icon" />
            {{ $t('common.apply_for_access') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/resources/contact')" class="btn-ghost-hero btn-ghost-hero--light">
            {{ $t('common.talk_to_sales') }}
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ─── Reset & root ─────────────────────────────────── */
.landing {
  min-height: 100vh;
  background: var(--ui-bg);
  color: var(--ui-text);
}

/* ─── HERO ─────────────────────────────────────────── */
.hero {
  position: relative;
  background: oklch(0.177 0.065 260);
  overflow: hidden;
  padding: 6rem 2rem 5rem;
}

/* Fine dot-grid texture */
.hero-grid-bg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, oklch(1 0 0 / 0.06) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

/* Decorative bottom edge — transition to page bg */
.hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg,
    transparent 0%,
    oklch(0.700 0.172 174) 30%,
    oklch(0.700 0.172 174) 70%,
    transparent 100%
  );
}

.hero-inner {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

/* Live badge */
.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: oklch(0.700 0.172 174 / 0.12);
  border: 1px solid oklch(0.700 0.172 174 / 0.35);
  color: oklch(0.700 0.172 174);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  padding: 6px 14px;
  border-radius: 2px;
  margin-bottom: 2rem;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: oklch(0.700 0.172 174);
  animation: pulse-dot 1.6s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.7); }
}

.live-text {
  letter-spacing: 0.14em;
}

/* Hero headline */
.hero-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: oklch(1 0 0);
  margin-bottom: 1.5rem;
  position: relative;
}

/* The longest tagline holds the block's height; the typed one sits on top. */
.hero-title-ghost {
  visibility: hidden;
}

.hero-title-typed {
  position: absolute;
  inset: 0;
}

.hero-caret {
  display: inline-block;
  width: 0.06em;
  height: 0.95em;
  margin-left: 0.08em;
  vertical-align: text-bottom;
  background: oklch(0.700 0.172 174);
  animation: hero-caret-blink 1s steps(1) infinite;
}

@keyframes hero-caret-blink {
  0%, 50% { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-caret { animation: none; }
}

.hero-accent {
  color: oklch(0.700 0.172 174);
}

.hero-desc {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  color: oklch(1 0 0 / 0.65);
  margin-bottom: 2.5rem;
  max-width: 480px;
}

/* CTA buttons */
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.btn-primary-hero {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: oklch(0.700 0.172 174);
  color: oklch(1 0 0);
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 2px;
  text-decoration: none;
  transition: background 0.15s, transform 0.1s;
}
.btn-primary-hero:hover {
  background: oklch(0.645 0.160 174);
  transform: translateY(-1px);
}

.btn-ghost-hero {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: oklch(1 0 0 / 0.70);
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 12px 24px;
  border: 1px solid oklch(1 0 0 / 0.15);
  border-radius: 2px;
  text-decoration: none;
  transition: color 0.15s, border-color 0.15s;
}
.btn-ghost-hero:hover {
  color: oklch(1 0 0);
  border-color: oklch(1 0 0 / 0.35);
}

.btn-ghost-hero--light {
  color: oklch(0.177 0.065 260 / 0.70);
  border-color: oklch(0.177 0.065 260 / 0.20);
}
.btn-ghost-hero--light:hover {
  color: oklch(0.177 0.065 260);
  border-color: oklch(0.177 0.065 260 / 0.45);
}

.btn-icon {
  width: 1em;
  height: 1em;
}

/* ─── TERMINAL ──────────────────────────────────────── */
.terminal {
  background: oklch(0.110 0.035 260);
  border: 1px solid oklch(1 0 0 / 0.10);
  border-radius: 4px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px oklch(0.700 0.172 174 / 0.12),
    0 32px 64px oklch(0 0 0 / 0.45);
}

.terminal-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: oklch(0.090 0.030 260);
  border-bottom: 1px solid oklch(1 0 0 / 0.07);
}

.terminal-dots {
  display: flex;
  gap: 5px;
}
.terminal-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: oklch(1 0 0 / 0.12);
}
.terminal-dots span:nth-child(1) { background: oklch(0.72 0.18 28);  }
.terminal-dots span:nth-child(2) { background: oklch(0.78 0.16 85);  }
.terminal-dots span:nth-child(3) { background: oklch(0.70 0.17 145); }

.terminal-title {
  flex: 1;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: oklch(1 0 0 / 0.35);
}

.terminal-live {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.06em;
  color: oklch(0.700 0.172 174);
  animation: blink-live 2s ease-in-out infinite;
}
@keyframes blink-live {
  0%, 80%, 100% { opacity: 1; }
  40%            { opacity: 0.3; }
}

.terminal-legend {
  display: grid;
  grid-template-columns: 110px 1fr 120px 54px;
  gap: 0 8px;
  padding: 6px 14px;
  background: oklch(0.100 0.032 260);
  border-bottom: 1px solid oklch(1 0 0 / 0.06);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.12em;
  color: oklch(1 0 0 / 0.25);
}

.terminal-viewport {
  height: 296px;
  overflow: hidden;
  position: relative;
}

/* Fade masks top/bottom */
.terminal-viewport::before,
.terminal-viewport::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 40px;
  z-index: 2;
  pointer-events: none;
}
.terminal-viewport::before {
  top: 0;
  background: linear-gradient(to bottom, oklch(0.110 0.035 260), transparent);
}
.terminal-viewport::after {
  bottom: 0;
  background: linear-gradient(to top, oklch(0.110 0.035 260), transparent);
}

.terminal-track {
  animation: scroll-feed 28s linear infinite;
}

@keyframes scroll-feed {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}

.signal-row {
  display: grid;
  grid-template-columns: 110px 1fr 120px 54px;
  gap: 0 8px;
  align-items: center;
  padding: 7px 14px;
  border-bottom: 1px solid oklch(1 0 0 / 0.04);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  transition: background 0.15s;
}
.signal-row:hover {
  background: oklch(1 0 0 / 0.03);
}

.signal-high { border-inline-start: 2px solid oklch(0.658 0.240 38); }
.signal-med  { border-inline-start: 2px solid oklch(0.700 0.172 174 / 0.5); }

.sig-time   { color: oklch(1 0 0 / 0.30); font-size: 0.6rem; }
.sig-type   { color: oklch(1 0 0 / 0.65); letter-spacing: 0.02em; }
.sig-entity { color: oklch(1 0 0 / 0.45); }

.sig-action {
  font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 2px 6px;
  border-radius: 2px;
  text-align: center;
}
.action-block  { background: oklch(0.658 0.240 38 / 0.15); color: oklch(0.780 0.220 38);  }
.action-flag   { background: oklch(0.700 0.172 174 / 0.15); color: oklch(0.700 0.172 174); }
.action-review { background: oklch(1 0 0 / 0.06); color: oklch(1 0 0 / 0.45);             }

.terminal-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: oklch(0.090 0.030 260);
  border-top: 1px solid oklch(1 0 0 / 0.06);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.08em;
  color: oklch(1 0 0 / 0.22);
}

/* ─── STATS STRIP ────────────────────────────────────── */
.stats-strip {
  background: oklch(0.177 0.065 260);
  border-bottom: 1px solid oklch(1 0 0 / 0.08);
}

.stats-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 2rem 1.5rem;
  border-inline-end: 1px solid oklch(1 0 0 / 0.08);
}
.stat-item:last-child { border-inline-end: none; }

.stat-value {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1.75rem;
  font-weight: 500;
  color: oklch(0.700 0.172 174);
  letter-spacing: -0.02em;
  line-height: 1;
}

.stat-label {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: oklch(1 0 0 / 0.40);
}

/* ─── FEATURES ──────────────────────────────────────── */
.features-section {
  padding: 6rem 2rem;
  background: var(--ui-bg);
}

.features-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  max-width: 560px;
  margin-bottom: 3.5rem;
}

.section-header--dark {
  max-width: 640px;
  margin: 0 auto 3.5rem;
  text-align: center;
}

.section-eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  color: oklch(0.700 0.172 174);
  margin-bottom: 0.75rem;
}

.section-eyebrow--light {
  color: oklch(0.700 0.172 174);
}

.section-title {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--ui-text-highlighted);
  margin-bottom: 1rem;
}

.section-title--light {
  color: oklch(1 0 0);
}

.section-desc {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 1rem;
  line-height: 1.65;
  color: var(--ui-text-muted);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border: 1px solid var(--ui-border);
}

.feature-card {
  padding: 2rem;
  border-inline-end: 1px solid var(--ui-border);
  border-bottom: 1px solid var(--ui-border);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  background: var(--ui-bg-elevated);
  transition: background 0.2s;
}
.feature-card:hover {
  background: var(--ui-bg-accented);
}
.feature-card:nth-child(3n) { border-inline-end: none; }
.feature-card:nth-last-child(-n+3) { border-bottom: none; }

/* Emerald left accent strip on hover */
.feature-card::before {
  content: '';
  position: absolute;
  top: 0; inset-inline-start: 0; bottom: 0;
  width: 2px;
  background: oklch(0.700 0.172 174);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.2s ease;
}
.feature-card:hover::before {
  transform: scaleY(1);
}

.feature-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.feature-code {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: var(--ui-text-dimmed);
}

.feature-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: oklch(0.700 0.172 174);
}

.feature-title {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--ui-text-highlighted);
  line-height: 1.3;
}

.feature-desc {
  font-family: 'Inter', sans-serif;
  font-size: 0.8125rem;
  line-height: 1.65;
  color: var(--ui-text-muted);
  flex: 1;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  color: oklch(0.700 0.172 174);
  text-decoration: none;
  margin-top: 0.5rem;
  transition: gap 0.15s;
}
.feature-link:hover { gap: 8px; }

.feature-link-icon {
  width: 0.875rem;
  height: 0.875rem;
}

/* ─── CTA ───────────────────────────────────────────── */
.cta-section {
  padding: 6rem 2rem;
  background: var(--ui-bg);
  position: relative;
  overflow: hidden;
  text-align: center;
}

.cta-inner {
  position: relative;
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.cta-glow {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 300px;
  background: radial-gradient(ellipse at center, oklch(0.700 0.172 174 / 0.10), transparent 70%);
  pointer-events: none;
}

.cta-title {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--ui-text-highlighted);
}

.cta-desc {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--ui-text-muted);
  max-width: 520px;
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
}

/* ─── RESPONSIVE ────────────────────────────────────── */
@media (max-width: 1024px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .hero-right {
    order: -1;
  }
  .stats-inner {
    grid-template-columns: repeat(2, 1fr);
  }
  .stat-item:nth-child(2) { border-inline-end: none; }
  .stat-item:nth-child(3) { border-inline-end: 1px solid oklch(1 0 0 / 0.08); }
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .feature-card:nth-child(3n) { border-inline-end: 1px solid var(--ui-border); }
  .feature-card:nth-child(2n) { border-inline-end: none; }
  .feature-card:nth-last-child(-n+3) { border-bottom: 1px solid var(--ui-border); }
  .feature-card:nth-last-child(-n+2) { border-bottom: none; }
}

@media (max-width: 640px) {
  .hero { padding: 4rem 1.25rem 3.5rem; }
  .stats-inner { grid-template-columns: repeat(2, 1fr); }
  .features-grid { grid-template-columns: 1fr; }
  .feature-card { border-inline-end: none; border-bottom: 1px solid var(--ui-border); }
  .feature-card:last-child { border-bottom: none; }
}
</style>
