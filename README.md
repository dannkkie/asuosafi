# AsuoSafi (Clear Waters) 💧
### Community Water Safety & Extractive Mining Concession Ledger
**Capstone Project for the OSF × Andela Hackathon: "Information You Can Trust"**  
**Challenge Tracks:** Stability & Social Cohesion + Transparency & Accountability  
**Geographic Anchor:** Ghana (Pra, Ankobra, Birim, Offin River Basins)  
**Scalability Horizon:** DRC, South Africa, Zimbabwe, Sierra Leone

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-10b981?style=flat&logo=leaflet)](https://leafletjs.com/)

---

## 1. Executive Summary & Problem Context

Across Ghana's mineral-rich belts, illegal and unregulated artisanal mining (*galamsey*) has precipitated a catastrophic ecological and civic crisis:
* Over **60% of Ghana's major watercourses** (including the Offin, Birim, Ankobra, and Pra rivers) suffer from extreme siltation (turbidity frequently exceeding **800–1,400 NTU** versus the WHO safe drinking limit of **< 5 NTU**) and heavy metal contamination (mercury, cyanide).
* Rural farming and riparian communities face acute drinking water scarcity, crop destruction, and health risks.
* **The Critical Trust Breakdown:** When river water turns milky-yellow, community members have no verifiable information. They do not know whether the water is acutely toxic, where to find clean alternative boreholes, or whether upstream excavators are licensed by the Minerals Commission or operating illegally inside statutory river protection buffers. This vacuum sparks panic, rumors, and violent clashes between communities, mining syndicates, and security task forces.

**AsuoSafi** provides a trusted, offline-first digital ledger that connects physical community observations with statutory transparency and real-world legal action.

---

## 2. Core Features & Innovations

### 🗺️ 1. Interactive Geospatial Water Safety Map
* Real-time color-coded monitoring markers with animated pulsing status:
  * 🔴 **Critical Toxic / Galamsey Siltation** (>800 NTU)
  * 🟡 **Caution / Turbid** (50–200 NTU)
  * 🟢 **Verified Safe Deep Ground Borehole** (<5 NTU)
* **Mining Concession & Buffer Overlay:** Shows official Minerals Commission concessions vs. illegal riverbed dredging inside the mandatory 100-meter statutory river buffer.

### 🛡️ 2. Cryptographic Multi-Witness Attestation Core
* Information you can trust: Status updates require multi-witness corroboration (e.g., clinic health worker + local traditional council elder + assembly member).
* Every observation generates an immutable **SHA-256 cryptographic audit stamp** to prevent tampering or false reporting.
* "Inspect Cryptographic Audit Trail" modal gives complete evidentiary transparency.

### 🧭 3. Emergency Safe Alternative Routing
* When an unsafe water point is selected, AsuoSafi immediately calculates distance, walking time (e.g., `~15 min walk`), and purity parameters to the nearest verified clean borehole, giving citizens immediate protection.

### 🗣️ 4. Multilingual Voice Bulletin (Audio Accessibility)
* Full voice playback support for **English, Twi (Akan), Ewe, and Hausa** using browser speech synthesis and natural phrasing.
* Empowers non-literate community members, rural elders, and children to listen to emergency drinking water advisories.

### ⚖️ 5. Automated Statutory Environmental Petition Generator
* Moves beyond passive dashboards into real civic redress: 1-click generation of formal legal petitions citing:
  * **Section 24 of the Water Resources Commission Act, 1996 (Act 522)**
  * **Section 99 of the Minerals and Mining (Amendment) Act, 2019 (Act 995)**
* Automatically addresses the responsible District Chief Executive (DCE), Member of Parliament, and Regional EPA Director.
* Provides printable legal dossiers and one-click WhatsApp community mobilization text.

### 🥷 6. Whistleblower Privacy & EXIF Geofencing
* Anonymous reporting mode strips identifiable metadata to protect citizens from rogue mining syndicates while verifying camera EXIF coordinates.

---

## 3. How AsuoSafi Fulfills the 7 Hackathon Constraints

| Hackathon Operating Constraint | AsuoSafi Technical Implementation |
| :--- | :--- |
| **1. Trust and verification** | Decentralized multi-witness consensus gate (2+ corroborating witnesses) + SHA-256 cryptographic audit hashes. |
| **2. Low bandwidth and limited access** | Lightweight client bundle (~127 kB total JS). Fully functional on 2G/3G connections with client-side image compression (<60KB). |
| **3. Accessibility and inclusion** | High-contrast visual color-coding + voice-out audio advisories in local dialects for low-literacy users. |
| **4. Privacy and security** | Zero-knowledge anonymous whistleblower toggle protecting community monitors from intimidation. |
| **5. Multilingual access** | Native language translations and speech bulletins in **English, Twi, Ewe, and Hausa**. |
| **6. Local relevance** | Grounded in authentic Ghanaian governance structures (MMDAs, Minerals Commission, EPA, traditional councils, river basins). |
| **7. Clear next steps** | Guides citizens to the nearest safe drinking borehole and generates formal legal petitions under Acts 522 and 995. |

---

## 4. Technology Stack & Architecture

* **Frontend:** Next.js 15.5 (App Router, Server & Client Components)
* **Language:** TypeScript 5.7 (Strict Mode)
* **Styling:** Tailwind CSS 3.4
* **Icons:** Lucide React
* **Geospatial Mapping:** Leaflet 1.9 & React-Leaflet with CartoDB Voyager tiles
* **Audio & Speech:** Web Speech API + localized phonetics
* **Hashing & Security:** Web Crypto API (SHA-256)
* **Build & Package Manager:** pnpm v11 / npm

---

## 5. Getting Started & Running Locally

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
# or: npm install

# Start the local development server
pnpm dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the live ledger.

### Building for Production
```bash
pnpm build
pnpm start
```

---

## 6. Pan-African Scalability Roadmap

While grounded in Ghana's *galamsey* crisis, AsuoSafi’s underlying data schema is designed for seamless continental adaptation:
* **Democratic Republic of Congo (DRC):** Tracking river pollution and community water access in artisanal cobalt and coltan mining zones across Katanga and South Kivu.
* **South Africa:** Monitoring groundwater contamination and acid mine drainage from *Zama Zama* illegal gold mining in Gauteng.
* **Zimbabwe & Sierra Leone:** River siltation and chemical run-off tracking in artisanal diamond and gold corridors.

---

## 7. Submission Artifacts & Documentation

* [**`DESIGN.md`**](./DESIGN.md) — Comprehensive design system architecture specifications following Google Material and Netflix Cinematic tokens.
* **Official Hackathon Dossier** — Structured evaluation response covering the 4 core judging criteria (Impact, Feasibility, Trust Architecture, Civic Redress), 10-slide pitch deck structure, and 3-minute video presentation script.
