import { SupportedLanguage } from '@/types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  criticalAlertTitle: string;
  criticalAlertText: string;
  statusSafe: string;
  statusCaution: string;
  statusToxic: string;
  findSafeWater: string;
  nearestSafeDistance: string;
  reportWaterIssue: string;
  generatePetition: string;
  inspectAuditTrail: string;
  verifiedBy: string;
  concessionLayerToggle: string;
  miningInsideBuffer: string;
  audioWarningTitle: string;
  audioPlayPrompt: string;
  audioPlaying: string;
  allBasins: string;
  filterByStatus: string;
  turbidityLabel: string;
  phLabel: string;
  safeLimitNotice: string;
  petitionTitle: string;
  petitionCiting: string;
  petitionDownload: string;
  petitionShareWhatsApp: string;
  close: string;
  submitAudit: string;
  anonymousToggle: string;
  witnessAttestation: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: "AsuoSafi",
    tagline: "Community Water Safety & Mining Concession Ledger",
    criticalAlertTitle: "TOXIC WATER ALERT: Heavy Galamsey Siltation",
    criticalAlertText: "The selected water source is severely contaminated with toxic mining silt and chemical runoff. Do not drink, cook, or bathe. Access verified safe alternative.",
    statusSafe: "Safe for Use",
    statusCaution: "Caution / Turbid",
    statusToxic: "Critical Toxic / Do Not Drink",
    findSafeWater: "Find Nearest Clean Water",
    nearestSafeDistance: "Nearest Safe Borehole:",
    reportWaterIssue: "Report Water Condition",
    generatePetition: "Generate EPA / DCE Petition",
    inspectAuditTrail: "Inspect Cryptographic Audit Trail",
    verifiedBy: "Verified by:",
    concessionLayerToggle: "Show Mining Concessions & Buffer Zones",
    miningInsideBuffer: "ILLEGAL RIVER BUFFER BREACH (<100m)",
    audioWarningTitle: "Listen to Voice Advisory",
    audioPlayPrompt: "Play Audio Warning",
    audioPlaying: "Playing voice bulletin...",
    allBasins: "All River Basins",
    filterByStatus: "Filter by Status",
    turbidityLabel: "Turbidity (NTU):",
    phLabel: "pH Balance:",
    safeLimitNotice: "WHO Safe Limit is < 5 NTU",
    petitionTitle: "Statutory Environmental Petition",
    petitionCiting: "Citing Section 24 of Act 522 (Water Resources) & Act 995 (Minerals & Mining)",
    petitionDownload: "Download Official Legal PDF",
    petitionShareWhatsApp: "Share via WhatsApp to Assembly Member",
    close: "Close",
    submitAudit: "Submit Citizen Water Audit",
    anonymousToggle: "Submit Anonymously (Whistleblower Protection)",
    witnessAttestation: "Multi-Witness Attestation",
  },
  twi: {
    appName: "AsuoSafi",
    tagline: "Nsuo Pa ne Galamsey ho Amanneɛbɔ Ledger",
    criticalAlertTitle: "KƆKƆBƆ KƐSEƐ: Nsuo yi yɛ bɔne, Galamsey asɛe no",
    criticalAlertText: "Asuo anaa borɔhool yi asɛe koraa esiane galamsey nti. Nnom, nnoa aduane, na nnguare. Kɔ nsuo pa a ɛbɛn wo no nkyɛn ntɛm.",
    statusSafe: "Nsuo Pa / Ɛyɛ ma Nom",
    statusCaution: "Hwɛ Yie / Nsuo no ho ate kakra",
    statusToxic: "Nsuo Bɔne / Ɛnteɛ Koraa",
    findSafeWater: "Hwehwɛ Nsuo Pa a Ɛbɛn Wo",
    nearestSafeDistance: "Borɔhool Pa a ɛbɛn wo paa:",
    reportWaterIssue: "Bɔ Nsuo Tebea ho Amanneɛ",
    generatePetition: "Yɛ Krataa Kɔma DCE ne EPA",
    inspectAuditTrail: "Hwɛ Adansedie ne Ahyɛnsodeɛ",
    verifiedBy: "Adansefoɔ a wɔahwɛ:",
    concessionLayerToggle: "Kyerɛ Galamsey ne Mfitiaseɛ Mpaapaemu",
    miningInsideBuffer: "MMARA TO: Wɔretutu nsuo ano koraa (<100m)",
    audioWarningTitle: "Tie Nsuo Kɔkɔbɔ Nne",
    audioPlayPrompt: "Bɔ Kɔkɔbɔ Nne no",
    audioPlaying: "Nne no rekasa...",
    allBasins: "Asuogya Nyinaa",
    filterByStatus: "Fa Tebea Yi Hwehwɛ",
    turbidityLabel: "Nsuo Fi Tebea (NTU):",
    phLabel: "Nsuo Kawa (pH):",
    safeLimitNotice: "Wiase Nyinaa Akwahosan Mmara se ɛnyɛ boro 5 NTU",
    petitionTitle: "Adesrɛ Krataa a Ɛfa Mmara Ho",
    petitionCiting: "Ɛnam Ghana Mmara Act 522 ne Act 995 so",
    petitionDownload: "Fa Krataa no (PDF)",
    petitionShareWhatsApp: "Mene Assembly Member no nkasa wɔ WhatsApp",
    close: "To mu",
    submitAudit: "Fa Wo Nsuo Nsɔhwɛ Kɔma",
    anonymousToggle: "Kora me din so (Whistleblower)",
    witnessAttestation: "Adansefoɔ Mmienu Ahyɛnsodeɛ",
  },
  ewe: {
    appName: "AsuoSafi",
    tagline: "Tsi Nyui Kple Tsimenuwo ƒe Kpekpeɖeŋununya",
    criticalAlertTitle: "NUXƆLƆ̃AME GÃ: Tsi sia gblẽ, Galamsey tsɔe",
    criticalAlertText: "Tsi sia le vɔ̃ɖi ŋutɔ le galamsey dɔwɔwɔwo ta. Mègakɔe ano alo aɖa nu le eme o. Yi tsi nyui bubu si te ɖe ŋuwò gbɔ.",
    statusSafe: "Tsi Nyui / Sɔ na Nono",
    statusCaution: "Kpɔ Nyuie / Tsi la me kɔ nyuie o",
    statusToxic: "Tsi Vɔ̃ / Mègakɔe Kuraa O",
    findSafeWater: "Di Tsi Nyui si Te Ðe Ŋuwò",
    nearestSafeDistance: "Tsi Vudo Nyui si te ɖe gbɔwò:",
    reportWaterIssue: "Na Nya Tso Tsi la Ŋu",
    generatePetition: "Wɔ Aɖaŋuɖoɖo Gbalvi na DCE kple EPA",
    inspectAuditTrail: "Kpɔ Kpeɖodzi Ŋuti Nyatakakawo",
    verifiedBy: "Ame siwo kpɔe dzi:",
    concessionLayerToggle: "Fia Galamsey Dɔwɔƒewo",
    miningInsideBuffer: "SEDZI MADA: Wole dɔ wɔm le tɔsisi to (<100m)",
    audioWarningTitle: "Se Gbe Nuxɔlɔ̃ame la",
    audioPlayPrompt: "Ɖo Gbe Ɖi",
    audioPlaying: "Gbe la le yiyim...",
    allBasins: "Tɔsisiwo Katã",
    filterByStatus: "Ti Tsi ƒe Nɔnɔme",
    turbidityLabel: "Tsi la ƒe Ƒoɖiɖi (NTU):",
    phLabel: "pH Nɔnɔme:",
    safeLimitNotice: "Xexeme Lãmesẽ Habɔbɔ se be wòagade 5 NTU o",
    petitionTitle: "Sedede Kpekpeɖeŋu Gbalvi",
    petitionCiting: "Ghana Sewo Act 522 kple Act 995 nu",
    petitionDownload: "Kɔ Gbalvi la Ɖi (PDF)",
    petitionShareWhatsApp: "Ɖoe ɖe Assembly Member le WhatsApp dzi",
    close: "Tuie",
    submitAudit: "Na Tsi Ŋuti Nyatakakawo",
    anonymousToggle: "Ɣla nye ŋkɔ (Whistleblower)",
    witnessAttestation: "Ɖasefo Evelia Ƒe Kpeɖodzi",
  },
  hausa: {
    appName: "AsuoSafi",
    tagline: "Tsarin Tsabtace Ruwa da Bayanin Ma'adanai na Al'umma",
    criticalAlertTitle: "GARGADI MAI TSANANI: Gurbataccen Ruwan Galamsey",
    criticalAlertText: "Wannan ruwan ya gurbace sosai sakamakon aikin hakar ma'adanai ba bisa ka'ida ba. Kada a sha, kada a dafa abinci da shi. Je zuwa mafi kusa da ke da tsabtataccen ruwa.",
    statusSafe: "Ruwa Mai Kyau / Za a iya sha",
    statusCaution: "A Kula / Ruwan ya dan gurbace",
    statusToxic: "Gurbataccen Ruwa / Kada a sha",
    findSafeWater: "Nemi Mafi Kusancin Ruwa Mai Tsabta",
    nearestSafeDistance: "Rijiyar burtsatse mafi kusa:",
    reportWaterIssue: "Bayar da Rahoton Halin Ruwa",
    generatePetition: "Kirkiri Takardar Korafi zuwa ga DCE da EPA",
    inspectAuditTrail: "Duba Hujjojin Tabbatarwa",
    verifiedBy: "Wadanda suka tabbatar:",
    concessionLayerToggle: "Nuna Wuraren Hakar Ma'adanai",
    miningInsideBuffer: "KARYA DOKA: Haka ma'adanai kusa da kogi (<100m)",
    audioWarningTitle: "Saurari Gargadin Murya",
    audioPlayPrompt: "Kunna Muryar Gargadi",
    audioPlaying: "Ana kunna sautin gargadi...",
    allBasins: "Dukkan Koguna",
    filterByStatus: "Tace ta Halin Ruwa",
    turbidityLabel: "Matsayin Dazancin Ruwa (NTU):",
    phLabel: "Ma'aunin pH:",
    safeLimitNotice: "Ka'idar Lafiya ta Duniya (WHO) kasa da 5 NTU ce",
    petitionTitle: "Takardar Neman Hakki ta Shari'a",
    petitionCiting: "Karkashin Dokokin Ghana Act 522 da Act 995",
    petitionDownload: "Sauke Takardar PDF",
    petitionShareWhatsApp: "Aika wa Dan Majalisar Yanki ta WhatsApp",
    close: "Rufe",
    submitAudit: "Aika Binciken Ruwa",
    anonymousToggle: "A boye sunana (Kariyar Masu Bayani)",
    witnessAttestation: "Tabbatarwar Shaidu Biyu",
  }
};
