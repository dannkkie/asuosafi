export type WaterSourceType = 'river' | 'borehole' | 'stream' | 'well' | 'piped_scheme';
export type ContaminationStatus = 'safe' | 'caution_turbid' | 'critical_toxic' | 'unknown';
export type ConcessionStatus = 'valid_active' | 'expired' | 'illegal_encroachment' | 'suspended';

export interface WaterPointMetrics {
  turbidityNtu: number; // Safe WHO limit is < 5 NTU; Galamsey rivers reach > 800 NTU
  phLevel: number; // Safe range: 6.5 - 8.5
  chemicalRiskDetected: boolean; // Mercury/Cyanide alert
  visualColor: 'clear' | 'brown' | 'yellow_orange' | 'milky';
  coliformBacteria: 'none' | 'moderate' | 'high';
}

export interface WaterPoint {
  id: string;
  name: string;
  riverBasin?: string;
  community: string;
  district: string;
  region: 'Western' | 'Ashanti' | 'Eastern' | 'Central' | 'Western North';
  sourceType: WaterSourceType;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  currentStatus: ContaminationStatus;
  lastTestedAt: string;
  metrics: WaterPointMetrics;
  verifiedByCount: number;
  verificationBadge: 'Official_EPA_GWCL' | 'Community_MultiWitness' | 'Unconfirmed_Alert';
  upstreamMiningDistanceKm: number;
  nearestSafeAlternativeId?: string;
  description: string;
  photoUrl?: string;
}

export interface VerificationRecord {
  id: string;
  waterPointId: string;
  waterPointName: string;
  reportedByRole: 'community_monitor' | 'clinic_health_worker' | 'school_teacher' | 'assembly_member' | 'resident';
  reporterAlias: string;
  observationDate: string;
  photoEvidenceUrl?: string;
  metricsObserved: {
    visualColor: string;
    turbidityEstimate: string;
    odorDetected: boolean;
  };
  exifVerified: boolean;
  sha256Hash: string;
  attestations: {
    witnessNameOrRole: string;
    organization: string;
    verifiedAt: string;
    verifiedVia: 'phone_call' | 'in_person_inspection' | 'test_strip_kit';
  }[];
  calculatedTrustScore: number; // 0 - 100%
  verificationBadge: 'Official_EPA_GWCL' | 'Community_MultiWitness' | 'Unconfirmed_Alert';
  notes: string;
}

export interface MiningConcession {
  id: string;
  concessionName: string;
  operatorName: string;
  licenseNumber: string;
  licenseStatus: ConcessionStatus;
  licenseType: 'Large Scale' | 'Small Scale Community Scheme' | 'Prospecting Only' | 'Illegal Dredging';
  issuingAuthority: 'Minerals Commission of Ghana' | 'None (Unlicensed)';
  riverBufferCompliance: boolean; // Prohibited within 100m of water body under Ghana Water Act
  boundaryPolygon: [number, number][]; // Lat/Lng coordinates for polygon
  notes: string;
}

export type SupportedLanguage = 'en' | 'twi' | 'ewe' | 'hausa';
