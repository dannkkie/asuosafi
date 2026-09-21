# Visual Design System & System Prompts (DESIGN.md)

## 🚫 CRITICAL RESTRICTIONS (ANTI-AI BIAS RULES)
1. NEVER use the "Inter" or "Roboto" font families under any circumstances.
2. NEVER inject radial or linear purple/magenta/cyan gradients or background "glow" blobs.
3. NEVER use absolute blacks (`#000000`) for dark mode surfaces, nor neon purple outlines.
4. DO NOT make every section a card. Use whitespace, divider lines, and typographic scale to separate sections.
5. NO glassmorphism or back-drop blur unless specifically directed for video overlays.

---

## 🎨 MODE 1: GOOGLE MATERIAL DESIGN ELEVATION (LIGHT / CLEAN SYSTEMATIC)
*Use this theme for data-dense, dashboard, operational, utility, or content creation interfaces.*

### 1. Typography
*   **Brand Display & Headings:** `font-family: "Product Sans", "Geist Sans", "SF Pro Display", sans-serif;`
*   **Body & Interface Text:** `font-family: "Plus Jakarta Sans", "Geist", "SF Pro Text", sans-serif;` (Tight tracking: `-0.01em` on body, `-0.03em` on headings).

### 2. Color Palette (Material Tokens)
*   **Primary (Action/Brand):** `#1a73e8` (Google Blue) | On-Primary: `#ffffff`
*   **Surface Background:** `#f8f9fa` (Off-white canvas)
*   **Surface Container (Cards/Sheets):** `#ffffff` (Pure white for structural contrast)
*   **Text Principal:** `#1f2124` (Soft charcoal charcoal gray)
*   **Text Secondary/Muted:** `#5f6368` (Mid-tone editorial gray)
*   **Borders & Dividers:** `#e0e2e6` (Ultra-thin, crisp gray separation lines)

### 3. Component Architecture & Atmosphere
*   **Borders:** `1px solid var(--border)`. Border-radius is strictly uniform at `12px` (Medium) or `24px` (Pill actions).
*   **Shadows:** Flat UI or structural micro-shadows only: `box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);`
*   **Spacing Hierarchy:** Generous padding layout (`p-6` or `24px`). Let components breathe.

---

## 🎬 MODE 2: NETFLIX CINEMATIC ENGINE (DARK / IMMERSIVE CONTENT-FIRST)
*Use this theme for entertainment, media consumption, video apps, galleries, or premium storytelling dashboards.*

### 1. Typography
*   **Headings & Titles:** `font-family: "Bebas Neue", "Geist Mono", "Impact", sans-serif;` (Bold, structural verticality)
*   **Body & Metadata:** `font-family: "Netflix Sans", "System-ui", "-apple-system", sans-serif;`

### 2. Color Palette (Cinematic Tokens)
*   **Primary Brand/CTA:** `#e50914` (Netflix Red) | Hover: `#b80710`
*   **Main Canvas Canvas:** `#141414` (Deep obsidian gray - never pure pitch black)
*   **Surface Container (Cards/Popovers):** `#221f1f` or `#1f1f1f`
*   **Text Primary:** `#f5f5f1` (Warm linen off-white to combat eye-strain)
*   **Text Secondary/Metadata:** `#a3a3a3` (Muted silver)
*   **Borders & Selection:** `#333333` (Subtle boundary borders)

### 3. Component Architecture & Atmosphere
*   **Borders:** `0px` or `1px solid #2a2a2a`. Let image/video assets define the shape.
*   **Border Radius:** Highly compact. Boxy and cinematic (`4px` for media thumbnails, `8px` max for layout containers).
*   **Shadows:** None. Use dark layout shading or slight black ambient gradients beneath white text labels to ensure accessibility over images (`background: linear-gradient(to top, rgba(0,0,0,0.8), transparent)`).
*   **Layout Structure:** Infinite scroll rows, density-packed media cards, hidden controls that slide up on interaction.

---

## 🛠️ CODE BASE & TAILWIND TAILORING IMPLEMENTATION GUIDELINES
When writing code for components:
*   **High-End Precision Over Flash:** Rely on text size hierarchies (`text-xs tracking-wider uppercase font-semibold` for headers) rather than adding a bright background color.
*   **Action Elements:** Input fields must have solid, light backgrounds or clean solid outlines. No inner neon glows. Focus states must use clean 2px solid accents (`focus:ring-2 focus:ring-blue-500`).
