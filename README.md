# AsuoSafi (Clear Waters) 💧
### Community Water Safety & Extractive Mining Concession Ledger

> **Capstone Entry for the OSF × Andela Hackathon: "Information You Can Trust"**  
> **Challenge Tracks:** Stability & Social Cohesion + Transparency & Accountability *(Cross-Track Entry)*  
> **Geographic Anchor:** Ghana (Pra, Ankobra, Birim, and Offin River Basins)  
> **Continental Scalability:** DRC, South Africa, Zimbabwe, Sierra Leone  

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-10b981?style=flat&logo=leaflet)](https://leafletjs.com/)
[![Cryptographic Ledger](https://img.shields.io/badge/Security-SHA--256%20Attestation-amber?style=flat)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
[![Accessibility](https://img.shields.io/badge/Accessibility-Multilingual%20Voice%20Bulletins-purple?style=flat)](#4-multilingual-voice-bulletins-audio-inclusion)

---

## 1. Executive Summary & Problem Context

Across Ghana's mineral-rich forest belts, unregulated artisanal gold mining (*galamsey*) has triggered a catastrophic humanitarian and ecological crisis:
* **Over 60% of Ghana's major watercourses**—including the Offin, Birim, Ankobra, and Pra rivers—suffer from severe siltation (turbidity frequently exceeding **800–1,400 NTU** against the World Health Organization drinking safety limit of **< 5 NTU**) and heavy metal contamination (mercury, cyanide, lead).
* **The Information Breakdown & Social Friction:** When a riparian village's drinking river turns milky-yellow, community members face a dangerous vacuum of trusted data:
  1. *Is the water acutely toxic today, or merely cloudy from upstream rainfall?*
  2. *Where is the closest verified clean drinking borehole?*
  3. *Are upstream excavators operating under a legal Minerals Commission lease, or conducting illegal riverbed dredging inside the statutory 100-meter river buffer?*
* This information void breeds panic, spreads waterborne diseases, and incites violent confrontations between farming communities, artisanal miners, traditional authorities, and state security task forces.

**AsuoSafi** bridges this trust deficit through an offline-first civic ledger that unites community water monitoring, satellite concession geofencing, cryptographic multi-witness verification, and automated statutory legal redress.

---

## 2. End-to-End System Architecture

```
  ┌────────────────────────────────────────────────────────────────────────┐
  │                       1. FIELD OBSERVATION INPUT                       │
  │  • Physical Water Testing (Turbidity NTU, pH, Heavy Metals)            │
  │  • EXIF Geofenced Photo Upload & Zero-Knowledge Whistleblower Mode     │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                 2. TRUST & CONSENSUS ENGINE (SHA-256)                  │
  │  • Multi-Witness Gate: Corroboration from 2+ Independent Witnesses    │
  │    (Clinic Nurse, Traditional Elder, Assembly Member, School Head)     │
  │  • Web Crypto API SHA-256 Immutable Audit Hash Generation              │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │             3. GEOSPATIAL ANALYSIS & BUFFER BREACH DETECTOR            │
  │  • Official Minerals Commission Concession Polygons Overlay            │
  │  • Automatic 100m Statutory River Protection Buffer Breach Flagging     │
  │  • High-Contrast Pulsing Telemetry Markers (Critical / Caution / Safe) │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                     4. IMMEDIATE CIVIC ACTION SUITE                    │
  │  ├─► Emergency Routing: Nearest Verified Clean Borehole (Distance/Time) │
  │  ├─► Audio Inclusion: Local Voice Advisories (Twi, Ewe, Hausa, English) │
  │  └─► Statutory Legal Redress: 1-Click Petitions under Acts 522 & 995   │
  └────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Judges' Evaluation Guide: Scoring Matrix Alignment

| Evaluation Pillar (25% Each) | How AsuoSafi Delivers a Winning Solution |
| :--- | :--- |
| **1. Uniqueness (25%)** | **Bypasses generic chatbots and passive dashboards.** Directly pairs physical citizen science water metrics with satellite concession boundary polygons, decentralized multi-witness consensus, and 1-click legal petitions that hold authorities accountable under statutory law. |
| **2. Pan-African Scalability (25%)** | **Designed for continental deployment.** The underlying schema (`WaterPoint` + `PurityMetrics` + `MiningConcession` + `WitnessAttestation`) translates seamlessly to artisanal mining conflicts across the **DRC** (cobalt/coltan watersheds in Katanga/Kivu), **South Africa** (acid mine drainage from *Zama Zama* gold shafts in Gauteng), and **Zimbabwe/Sierra Leone**. |
| **3. AI Toolchain & Accelerated Engineering (25%)** | **Engineered using advanced agentic AI workflows.** AI was leveraged for Next.js 15 App Router & React 19 architecture, dual Google Material & Netflix Cinematic design tokens (`DESIGN.md`), SSR-safe Leaflet mapping wrappers, SVG telemetry gauges, statutory legal prompt pipelines, and multilingual phonetics. |
| **4. Presentation & User Experience (25%)** | **Industrial-grade civic-tech interface.** High-contrast dual theme engine (Slate/Obsidian), zero-neon institutional palette, barcode telemetry signal meters, full local language audio bulletins, and responsive mobile-first layouts. |

---

## 4. Compliance with the 7 Hackathon Operating Constraints

| Hackathon Operating Constraint | AsuoSafi Technical Implementation |
| :--- | :--- |
| **1. Trust & Verification** | **Multi-Witness Consensus Gate:** Status updates require corroboration from at least two verified community actors before publishing. Every record receives an immutable **SHA-256 cryptographic audit stamp** verifiable via the "Inspect Cryptographic Audit Trail" modal. |
| **2. Low Bandwidth & Limited Access** | **Ultra-lightweight footprint (~127 kB client JS).** Built with Next.js App Router for optimal tree-shaking, local storage caching for offline resilience, and client-side photo compression (<60 KB) enabling smooth operation over 2G/3G connections. |
| **3. Accessibility & Low Literacy** | **Dual visual and auditory communication.** High-contrast, color-coded visual hierarchy paired with one-click **synthesized audio voice bulletins in local languages** to ensure full access for non-literate community members and rural elders. |
| **4. Privacy & Whistleblower Security** | **Zero-Knowledge Whistleblower Mode.** Automatically strips GPS EXIF metadata, camera device serials, and submitter identifiers to shield community monitors from intimidation or violent retaliation by illegal mining syndicates. |
| **5. Multilingual Access** | **Native linguistic inclusion.** Full interface strings and natural voice bulletins localized in **English, Twi (Akan), Ewe, and Hausa**, respecting West African phonetics and regional terms. |
| **6. Local Relevance & Grounding** | **Rooted in authentic Ghanaian governance.** Directly models Metropolitan, Municipal, and District Assemblies (MMDAs), traditional council elders, the Environmental Protection Agency (EPA), the Minerals Commission, and river basin authorities (Pra, Ankobra, Birim, Offin). |
| **7. Clear Next Steps & Civic Redress** | **Transforms grievance into immediate protection and legal action.** Calculates walking directions to the nearest clean borehole and generates formal, printable legal petitions citing **Section 24 of Act 522** and **Section 99 of Act 995**. |

---

## 5. Core Platform Capabilities

### 🗺️ 1. Geospatial Water Quality & Buffer Breach Map
* Real-time monitoring markers with animated pulsing status rings:
  * 🔴 **Critical Toxic / Galamsey Siltation** (>800 NTU, acidic pH)
  * 🟡 **Caution / Turbid Sediments** (50–200 NTU)
  * 🟢 **Verified Safe Mechanized Borehole** (<5 NTU, potable)
* **Mining Concession & Statutory Buffer Overlay:** Ingests official Minerals Commission license boundaries and automatically highlights illegal dredging operating inside the mandatory 100-meter statutory river protection buffer.

### 🛡️ 2. Cryptographic Multi-Witness Attestation Ledger
* Status updates require verification by at least 2 independent community witnesses (e.g., community health nurse, traditional council representative, assembly member, or school head).
* Every observation generates an immutable **SHA-256 cryptographic audit hash** to guarantee non-repudiation and prevent political tampering.
* The "Inspect Cryptographic Audit Trail" modal provides complete evidentiary transparency for citizens, civil society, and investigative journalists.

### 🧭 3. Emergency Safe Alternative Routing
* When an unsafe water source is selected, AsuoSafi instantly calculates the distance, walking time (e.g., `~14 min walk`), and purity parameters to the nearest verified clean borehole, giving citizens immediate life-saving alternatives.

### 🗣️ 4. Multilingual Voice Bulletins (Audio Inclusion)
* Full voice playback support for **English, Twi (Akan), Ewe, and Hausa** using browser speech synthesis and localized phrasing.
* Empowers non-literate community members, rural elders, and children to listen to emergency drinking water advisories without needing to read English text.

### ⚖️ 5. Automated Statutory Environmental Petition Generator
* Moves beyond passive dashboards into tangible civic redress: one-click generation of formal legal petitions citing:
  * **Section 24 of the Water Resources Commission Act, 1996 (Act 522)**
  * **Section 99 of the Minerals and Mining (Amendment) Act, 2019 (Act 995)**
* Automatically addresses the responsible District Chief Executive (DCE), Member of Parliament, and Regional EPA Director.
* Provides printable formal legal dossiers and one-click WhatsApp community mobilization text.

### 🥷 6. Whistleblower Privacy & EXIF Scrubbing
* Anonymous reporting mode strips identifiable metadata and device fingerprints to protect citizens from intimidation by illegal mining cartels while validating coordinates for geographic truth.

---

## 6. How AI Software Development Tools Were Utilized

AsuoSafi was built using modern agentic AI software development workflows:
1. **Full-Stack Architecture & Scaffolding:** Accelerated setup of Next.js 15 App Router, React 19, strict TypeScript configurations, and Tailwind CSS design tokens.
2. **Dual Design System Engineering:** Implementation of a rigorous, institutional visual architecture following Google Material and Netflix Cinematic guidelines (`DESIGN.md`), avoiding neon cliches in favor of high-contrast civic clarity.
3. **Geospatial & SSR Engineering:** Development of SSR-safe Leaflet dynamic map wrappers, custom SVG pulsing marker definitions, and geodesic distance calculations.
4. **Statutory Legal Prompt Synthesis:** Automated synthesis and formatting of Ghanaian environmental petitions precisely structured according to Act 522 and Act 995.
5. **Phonetic & Dialectal Tuning:** Structuring phonetically accurate speech synthesis configurations for West African languages (Twi, Ewe, Hausa) to ensure natural speech output.

---

## 7. Technology Stack

* **Framework:** Next.js 15.5 (App Router, Server & Client Components)
* **Language:** TypeScript 5.7 (Strict Mode)
* **Styling:** Tailwind CSS 3.4
* **Icons:** Lucide React
* **Geospatial Mapping:** Leaflet 1.9 & React-Leaflet with OpenStreetMap / ESRI Satellite toggles
* **Audio & Speech:** Web Speech API + localized phonetics
* **Security & Hashing:** Web Crypto API (SHA-256)
* **Package Manager:** pnpm v11 / npm

---

## 8. Design System Specifications

* [**`DESIGN.md`**](./DESIGN.md) — Comprehensive design system architecture specifications following Google Material and Netflix Cinematic design tokens, typography scales, telemetry palettes, and accessibility guidelines.

---

## 9. Getting Started & Running Locally

### Prerequisites
* Node.js v18.0 or higher (v20+ recommended)
* `pnpm` (recommended) or `npm`

### Installation
```bash
# Clone the repository
git clone https://github.com/dannkkie/asuosafi.git
cd asuosafi

# Install dependencies
pnpm install

# Start the local development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the live ledger.

### Building for Production
```bash
pnpm build
pnpm start
```

---

## 10. Pan-African Scalability Roadmap

While grounded in Ghana's *galamsey* crisis, AsuoSafi’s underlying data schema is designed for seamless continental adaptation:
* **Democratic Republic of Congo (DRC):** Tracking river pollution and community water access in artisanal cobalt and coltan mining zones across Katanga and South Kivu.
* **South Africa:** Monitoring groundwater contamination and acid mine drainage from *Zama Zama* illegal gold mining in Gauteng.
* **Zimbabwe & Sierra Leone:** River siltation and chemical run-off tracking in artisanal diamond and gold corridors.

---

## 11. License

This project is licensed under the MIT License — open and accessible for communities, researchers, and civil society across Africa and beyond.
