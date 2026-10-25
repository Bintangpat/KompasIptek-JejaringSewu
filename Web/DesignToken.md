---
version: "2.0.0-tokens"
name: "Guts AI Global Design Tokens"
description: "Comprehensive design token repository for Guts AI across Web, Tailwind CSS, and CSS Custom Properties."
format: "W3C Design Token Community Group (DTCG) specification & CSS Variables"
analyzed_source: "gutsai.id (Landing, Catalog, Rankings)"
---

# Guts AI — Global Design Token Repository

Dokumen ini merupakan sumber kebenaran (*single source of truth*) untuk seluruh variabel desain (Design Tokens) sistem Guts AI, mencakup palet warna gelap/terang, tipografi mono-teknikal, elevasi glow, radius, spasi modular, serta panduan implementasi untuk CSS murni dan Tailwind CSS v3/v4.

---

## 1. Color System Tokens

### 1.1 Base Canvas & Surface Ramp (Dark Theme - Primary)

Kanvas gelap Guts AI menggunakan kombinasi rona hitam pekat dengan semburat *teal/slate* mikro (*rich cybernetic dark*) untuk mengurangi ketegangan mata developer dan mempertahankan rasio kontras WCAG AAA.

| Token Identifier | CSS Variable | Hex / RGBA | Luminance / Role |
| :--- | :--- | :--- | :--- |
| `color.bg.base` | `--bg-base` | `#080C0D` | Background viewport utama (body/canvas). |
| `color.bg.subtle` | `--bg-subtle` | `#05080A` | Background area header/footer paling dalam. |
| `color.surface.1` | `--surface-1` | `#0D1315` | Card tier-1, outer table container, search inputs. |
| `color.surface.2` | `--surface-2` | `#121A1C` | Secondary containers, table header row, inner cards. |
| `color.surface.3` | `--surface-3` | `#162124` | Table row hover state, elevated popover menu. |
| `color.surface.active`| `--surface-active` | `#1A282B` | Selected timeframe pill, active filter chip. |
| `color.surface.code` | `--surface-code` | `#0B1012` | Playground window & code block terminal canvas. |

### 1.2 Surface Inversion Ramp (Light Theme - Pricing Section)

Khusus digunakan pada seksi transisi kalkulasi saldo/refund (*"You pay for the tokens you use"*).

| Token Identifier | CSS Variable | Hex / RGBA | Role / Deskripsi |
| :--- | :--- | :--- | :--- |
| `color.light.bg` | `--light-bg` | `#FCFCFD` | Canvas latar belakang seksi terang. |
| `color.light.surface` | `--light-surface` | `#FFFFFF` | Background kartu saldo & simulasi deposit. |
| `color.light.subtle` | `--light-subtle` | `#F8F9FA` | Inner container kolom balance. |
| `color.light.border` | `--light-border` | `#E4EAE8` | Garis tepi kartu dan divider light section. |
| `color.light.text.1` | `--light-text-1` | `#162022` | Heading teks kontras tinggi pada latar putih. |
| `color.light.text.2` | `--light-text-2` | `#56625F` | Deskripsi & label penjelas pada latar putih. |

### 1.3 Border & Separator Tokens

| Token Identifier | CSS Variable | Hex / RGBA | Penggunaan |
| :--- | :--- | :--- | :--- |
| `border.subtle` | `--border-subtle` | `rgba(255, 255, 255, 0.05)` | Border pemisah baris tabel data (`<tr>`). |
| `border.medium` | `--border-medium` | `rgba(95, 217, 191, 0.15)` | Default card border, filter button outline. |
| `border.strong` | `--border-strong` | `rgba(95, 217, 191, 0.35)` | Active tab border, input text focus ring. |
| `border.glow` | `--border-glow` | `rgba(95, 217, 191, 0.65)` | Primary CTA border highlight saat hover. |
| `border.white.subtle` | `--border-white-subtle` | `rgba(255, 255, 255, 0.12)` | Secondary button border outline. |

### 1.4 Brand, Primary & Functional Accents

| Token Identifier | CSS Variable | Hex Value | Semantic Role |
| :--- | :--- | :--- | :--- |
| `color.primary.mint` | `--color-mint-primary` | `#5FD9BF` | Brand signature, "Dashboard" CTA, active data. |
| `color.primary.hover`| `--color-mint-hover` | `#4EC3A9` | Hover state tombol primer & link aktif. |
| `color.primary.tint` | `--color-mint-tint` | `rgba(95, 217, 191, 0.12)`| Subtle pill badge background. |
| `color.accent.cyan` | `--color-cyan-glow` | `#3DE6F2` | Glow secondary pada hero title & routing lines. |
| `color.accent.teal` | `--color-teal-dark` | `#1F8A78` | Gradient edge, header notification background. |
| `color.accent.orange`| `--color-accent-orange`| `#D66B3D` | Anthropic card accent, warning badge. |
| `color.status.error` | `--color-status-err` | `#EF4444` | Fallback trigger notice, error state. |
| `color.status.ok` | `--color-status-ok` | `#10B981` | 200 OK latency status dot, healthy uptime. |

### 1.5 Multi-Provider & Chart Palette Tokens

Digunakan secara proporsional pada **Stacked Distribution Bar Chart** di halaman Rankings dan Badge penyedia di Model Catalog.

| Provider / Model Segment | Token Variable | Hex Value | Visual Swatch Role |
| :--- | :--- | :--- | :--- |
| **Kimi (Moonshot AI)** | `--chart-kimi` | `#5FD9BF` | Mint green (Top share volume) |
| **Zai (GLM series)** | `--chart-zai` | `#6366F1` | Indigo / Slate blue |
| **DeepSeek (V2/V2.5)** | `--chart-deepseek` | `#FDE047` | Cyber yellow pastel |
| **Qwen (Alibaba)** | `--chart-qwen` | `#FB923C` | Soft peach / Warm coral |
| **OpenAI (GPT-4o)** | `--chart-openai` | `#C084FC` | Soft lavender / Violet |
| **Google (Gemini)** | `--chart-google` | `#38BDF8` | Bright sky blue |
| **Anthropic (Claude)** | `--chart-anthropic` | `#F97316` | Terracotta orange |
| **Others / Unclassified**| `--chart-others` | `#475569` | Neutral slate mute |

### 1.6 Typography Colors

| Token Identifier | CSS Variable | Hex / RGBA | Kontras Rasio |
| :--- | :--- | :--- | :--- |
| `text.primary` | `--text-primary` | `#FFFFFF` | Kontras murni (Heading & highlight data) |
| `text.secondary` | `--text-secondary` | `#94A3B8` | Muted slate (Body text & sub-label) |
| `text.tertiary` | `--text-tertiary` | `#5A6B68` | Low contrast (Timestamps, footer links) |
| `text.on-primary` | `--text-on-mint` | `#080C0D` | Dark text on primary green button |
| `text.mono-code` | `--text-mono-code` | `#E2E8F0` | Code token default color |

---

## 2. Typography Tokens

### 2.1 Font Families

```css
--font-sans: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-display: "Outfit", var(--font-sans);
--font-mono: "Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
```

### 2.2 Type Scale (Desktop & Mobile Matrix)

| Token Identifier | CSS Size | Desktop Rem | Line-Height | Letter-Spacing | Weight |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `font.display.xl` | `64px` | `4.0rem` | `1.1` | `-0.03em` | 700 / 800 |
| `font.display.lg` | `48px` | `3.0rem` | `1.15` | `-0.025em` | 600 / 700 |
| `font.display.md` | `36px` | `2.25rem` | `1.2` | `-0.02em` | 600 |
| `font.heading.lg` | `24px` | `1.5rem` | `1.3` | `-0.015em` | 600 |
| `font.heading.md` | `20px` | `1.25rem` | `1.35` | `-0.01em` | 500 / 600 |
| `font.body.lg` | `18px` | `1.125rem` | `1.5` | `0` | 400 |
| `font.body.md` | `15px` | `0.9375rem`| `1.55` | `0` | 400 |
| `font.body.sm` | `13px` | `0.8125rem`| `1.5` | `0.01em` | 400 / 500 |
| `font.caption` | `11px` | `0.6875rem`| `1.4` | `0.06em` | 600 (Uppercase) |
| `font.mono.metric`| `14px` | `0.875rem` | `1.2` | `0.02em` | 500 (`tabular-nums`) |

---

## 3. Spatial & Dimensional Tokens

### 3.1 Spacing Scale (4px Base Grid)

```css
--space-1: 4px;     /* Micro padding, badge internal gaps */
--space-2: 8px;     /* Element spacing, tight cell vertical padding */
--space-3: 12px;    /* Button inner padding, compact gaps */
--space-4: 16px;    /* Standard card padding, nav bar item gap */
--space-5: 20px;    /* Tablet screen horizontal container gutter */
--space-6: 24px;    /* Desktop container padding, card grid gutters */
--space-8: 32px;    /* Section inner margins, leaderboard padding */
--space-10: 40px;   /* Major component spacing */
--space-12: 48px;   /* Title to data table vertical gap */
--space-16: 64px;   /* Section separation padding */
--space-20: 80px;   /* Pre-footer spacing */
--space-24: 96px;   /* Hero section padding top/bottom */
```

### 3.2 Layout & Container Constraints

| Token Identifier | CSS Variable | Value | Kegunaan |
| :--- | :--- | :--- | :--- |
| `container.max-width` | `--container-max` | `1240px` | Batas lebar konten desktop utama. |
| `container.narrow` | `--container-narrow` | `880px` | Lebar teks dokumentasi & artikel FAQ. |
| `header.height` | `--header-height` | `64px` | Tinggi sticky navigation bar. |
| `banner.height` | `--banner-height` | `36px` | Tinggi top notification banner. |
| `table.row.height` | `--table-row-height` | `56px` | Standar tinggi baris tabel LLM Leaderboard. |

### 3.3 Border Radius Tokens

```css
--radius-xs: 4px;     /* Progress bar segments, table status badges */
--radius-sm: 6px;     /* Search input, secondary filter buttons */
--radius-md: 10px;    /* Inner provider list cards, terminal wrappers */
--radius-lg: 16px;    /* Outer master cards, Top 3 ranking podiums */
--radius-xl: 24px;    /* Large marketing callout banners */
--radius-pill: 9999px;/* Top notification chip, Primary "Dashboard" CTA */
```

---

## 4. Elevation, Shadow & Glow Tokens

```css
/* Ambient Card Outlines */
--shadow-card-subtle: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
--shadow-card-elevated: 0 8px 32px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.08);

/* Interactive Mint Neon Glows */
--shadow-glow-mint-sm: 0 0 12px rgba(95, 217, 191, 0.20);
--shadow-glow-mint-lg: 0 0 28px rgba(95, 217, 191, 0.35);

/* Background Hero Atmosphere */
--glow-hero-radial: radial-gradient(circle at 50% -20%, rgba(95, 217, 191, 0.18), transparent 70%);
```

---

## 5. Animation & Transition Tokens

```css
/* Durations */
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;

/* Timing Curves */
--ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Transition Presets */
--transition-interactive: background-color var(--duration-fast) var(--ease-standard),
                          border-color var(--duration-fast) var(--ease-standard),
                          transform var(--duration-fast) var(--ease-standard),
                          box-shadow var(--duration-fast) var(--ease-standard);
```

---

## 6. Ready-to-Use Implementations

### 6.1 Native CSS Root File (`tokens.css`)

```css
:root {
  /* Colors - Background & Surfaces */
  --bg-base: #080C0D;
  --bg-subtle: #05080A;
  --surface-1: #0D1315;
  --surface-2: #121A1C;
  --surface-3: #162124;
  --surface-active: #1A282B;
  --surface-code: #0B1012;

  /* Colors - Light Inversion Section */
  --light-bg: #FCFCFD;
  --light-surface: #FFFFFF;
  --light-subtle: #F8F9FA;
  --light-border: #E4EAE8;
  --light-text-1: #162022;
  --light-text-2: #56625F;

  /* Colors - Accent & Brand */
  --color-mint-primary: #5FD9BF;
  --color-mint-hover: #4EC3A9;
  --color-mint-tint: rgba(95, 217, 191, 0.12);
  --color-cyan-glow: #3DE6F2;
  --color-teal-dark: #1F8A78;
  --color-accent-orange: #D66B3D;
  --color-status-err: #EF4444;
  --color-status-ok: #10B981;

  /* Chart Colors */
  --chart-kimi: #5FD9BF;
  --chart-zai: #6366F1;
  --chart-deepseek: #FDE047;
  --chart-qwen: #FB923C;
  --chart-openai: #C084FC;
  --chart-google: #38BDF8;
  --chart-anthropic: #F97316;
  --chart-others: #475569;

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.05);
  --border-medium: rgba(95, 217, 191, 0.15);
  --border-strong: rgba(95, 217, 191, 0.35);
  --border-glow: rgba(95, 217, 191, 0.65);
  --border-white-subtle: rgba(255, 255, 255, 0.12);

  /* Typography Text Colors */
  --text-primary: #FFFFFF;
  --text-secondary: #94A3B8;
  --text-tertiary: #5A6B68;
  --text-on-mint: #080C0D;
  --text-mono-code: #E2E8F0;

  /* Fonts */
  --font-sans: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-display: "Outfit", var(--font-sans);
  --font-mono: "Geist Mono", "JetBrains Mono", monospace;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* Dimensions */
  --container-max: 1240px;
  --container-narrow: 880px;
  --header-height: 64px;
  --banner-height: 36px;
  --table-row-height: 56px;

  /* Radii */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 9999px;

  /* Elevations */
  --shadow-card-subtle: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  --shadow-card-elevated: 0 8px 32px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  --shadow-glow-mint-sm: 0 0 12px rgba(95, 217, 191, 0.20);
  --shadow-glow-mint-lg: 0 0 28px rgba(95, 217, 191, 0.35);

  /* Transitions */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 6.2 Tailwind CSS Configuration (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'var(--bg-base)',
          subtle: 'var(--bg-subtle)',
        },
        surface: {
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
          active: 'var(--surface-active)',
          code: 'var(--surface-code)',
        },
        light: {
          bg: 'var(--light-bg)',
          surface: 'var(--light-surface)',
          subtle: 'var(--light-subtle)',
          border: 'var(--light-border)',
          text1: 'var(--light-text-1)',
          text2: 'var(--light-text-2)',
        },
        mint: {
          primary: 'var(--color-mint-primary)',
          hover: 'var(--color-mint-hover)',
          tint: 'var(--color-mint-tint)',
        },
        cyan: {
          glow: 'var(--color-cyan-glow)',
        },
        chart: {
          kimi: 'var(--chart-kimi)',
          zai: 'var(--chart-zai)',
          deepseek: 'var(--chart-deepseek)',
          qwen: 'var(--chart-qwen)',
          openai: 'var(--chart-openai)',
          google: 'var(--chart-google)',
          anthropic: 'var(--chart-anthropic)',
          others: 'var(--chart-others)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      maxWidth: {
        container: 'var(--container-max)',
        narrow: 'var(--container-narrow)',
      },
      boxShadow: {
        'glow-mint-sm': 'var(--shadow-glow-mint-sm)',
        'glow-mint-lg': 'var(--shadow-glow-mint-lg)',
        'card-elevated': 'var(--shadow-card-elevated)',
      },
    },
  },
  plugins: [],
};
```
