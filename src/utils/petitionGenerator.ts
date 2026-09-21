import { WaterPoint } from '@/types';

export interface PetitionDetails {
  date: string;
  referenceNumber: string;
  recipientName: string;
  recipientOffice: string;
  assemblyName: string;
  waterBodyName: string;
  communityName: string;
  turbidityValue: number;
  upstreamDistanceKm: number;
  statutoryCitations: string[];
  citizenDemands: string[];
  bodyMarkdown: string;
  whatsappSummaryText: string;
}

export function generatePetitionForWaterPoint(point: WaterPoint): PetitionDetails {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const ref = `ASUOSAFI/PETITION/${point.region.substring(0, 3).toUpperCase()}/${point.district.substring(0, 3).toUpperCase()}/${Date.now().toString().slice(-5)}`;
  
  const citations = [
    "Article 41(k) of the 1992 Constitution of the Republic of Ghana (Duty of citizens to protect the environment)",
    "Section 24 of the Water Resources Commission Act, 1996 (Act 522) — Prohibition of water resource pollution",
    "Section 99 of the Minerals and Mining (Amendment) Act, 2019 (Act 995) — Severe sanctions for mining in watercourses",
    "Section 12 of the Environmental Protection Agency Act, 1994 (Act 490) — Enforcement of environmental compliance notices"
  ];

  const demands = [
    `Immediate convening of the District Security Council (DISEC) to halt unlicensed alluvial dredging currently operating ${point.upstreamMiningDistanceKm}km upstream from ${point.name}.`,
    `Emergency dispatch of potable water supply (via clean motorized water tankers or mobile water treatment units) to the residents of ${point.community}, where turbidity currently measures ${point.metrics.turbidityNtu} NTU (exceeding WHO safe drinking limit of <5 NTU by over ${Math.round(point.metrics.turbidityNtu / 5)}x).`,
    `Joint public water sampling and chemical testing by the EPA Regional Office and Ghana Water Company Limited (GWCL), with laboratory results published openly at the Assembly and Local Traditional Palace.`,
    `Confiscation and decommissioning of illegal excavators and Changfa wash plants operating within the statutory 100-meter buffer zone of the ${point.riverBasin || point.name}.`
  ];

  const bodyMarkdown = `
**URGENT CITIZEN REDRESS PETITION UNDER STATUTORY ENVIRONMENTAL MANDATE**

**Date:** ${currentDate}  
**Reference:** ${ref}  

**TO:**  
The District Chief Executive (DCE)  
${point.district} Assembly  
${point.region} Region, Republic of Ghana  

**COPIED TO:**  
1. The Honorable Member of Parliament, ${point.district} Constituency  
2. The Regional Director, Environmental Protection Agency (EPA)  
3. The Regional Chief Manager, Ghana Water Company Limited (GWCL)  
4. The Paramount Chief & Traditional Council of ${point.community}  

---

### SUBJECT: FORMAL PETITION ON CRITICAL WATER CONTAMINATION AND ILLEGAL MINING ENCROACHMENT AT ${point.name.toUpperCase()}

Respected District Chief Executive,

We, the undersigned residents, community water committee monitors, and civic guardians of **${point.community}**, submit this urgent statutory petition pursuant to our civic responsibilities enshrined in **Article 41(k) of the 1992 Constitution of Ghana**.

#### 1. Evidentiary Findings from the AsuoSafi Community Trust Ledger
Physical field tests and multi-witness verifications conducted on **${new Date(point.lastTestedAt).toLocaleDateString('en-GB')}** reveal catastrophic pollution of our primary water source:
* **Water Source:** ${point.name} (${point.sourceType.toUpperCase()})
* **GPS Coordinates:** ${point.coordinates.latitude.toFixed(4)}° N, ${point.coordinates.longitude.toFixed(4)}° W
* **Measured Turbidity:** **${point.metrics.turbidityNtu} NTU** (WHO / Ghana Standards Authority limit: **< 5 NTU**)
* **pH Level:** ${point.metrics.phLevel} (Acidic runoff risk)
* **Chemical / Heavy Metal Risk:** **CRITICAL / HIGH DETECTED**
* **Upstream Extraction Proximity:** Heavy alluvial mining machinery confirmed operating approximately **${point.upstreamMiningDistanceKm} km** upstream within the statutory 100m river protection buffer.

#### 2. Legal Basis for Immediate Action
Under **Section 24 of the Water Resources Commission Act (Act 522)**, any act that pollutes or despoils a water resource constitutes a strict liability offense. Furthermore, under **Section 99 of Act 995 (Minerals & Mining Amendment Act)**, mining within water bodies or forest buffers carries mandatory custodial sentences. The ongoing pollution threatens the lives, health, and economic livelihoods of over 15,000 community members.

#### 3. Formal Demands for Redress
We hereby demand that the ${point.district} Assembly and the District Security Council (DISEC) take the following immediate steps within **seventy-two (72) hours** of receipt:
${demands.map((d, i) => `${i + 1}. ${d}`).join('\n')}

We reserve the constitutional right to escalate this formal petition to the Office of the Special Prosecutor (OSP), the Ministry of Sanitation and Water Resources, and national media should this urgent life-safety appeal be ignored.

**Signed on behalf of the Community:**  
*AsuoSafi Citizen Coalition & Community Water Monitors of ${point.community}*  
*Cryptographic Audit Trace: ${ref}*
`.trim();

  const whatsappSummaryText = `🚨 *URGENT CITIZEN WATER ALERT - ${point.community.toUpperCase()}* 🚨\n\nOur water source at *${point.name}* is heavily contaminated by galamsey (Turbidity: *${point.metrics.turbidityNtu} NTU*, safe limit is <5 NTU).\n\nAn official petition citing Act 522 and Act 995 has been submitted to the District Chief Executive (DCE) of ${point.district}.\n\n*Immediate Action:* Do NOT drink or cook with this water. Use the nearest verified safe borehole. Join our community petition here: [AsuoSafi Portal]`;

  return {
    date: currentDate,
    referenceNumber: ref,
    recipientName: `District Chief Executive`,
    recipientOffice: `${point.district} Assembly`,
    assemblyName: point.district,
    waterBodyName: point.name,
    communityName: point.community,
    turbidityValue: point.metrics.turbidityNtu,
    upstreamDistanceKm: point.upstreamMiningDistanceKm,
    statutoryCitations: citations,
    citizenDemands: demands,
    bodyMarkdown,
    whatsappSummaryText
  };
}
