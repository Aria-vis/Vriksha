import { LandType, FreshnessStatus } from '../../src/types/database.types';

export interface SeedPlantItem {
  id: string;
  species_scientific_name: string;
  cityName: 'Patna' | 'Varanasi' | 'Delhi' | 'Bengaluru';
  lat: number;
  lng: number;
  fuzzed_lat: number;
  fuzzed_lng: number;
  address_hint: string;
  land_type: LandType;
  private_owner_consent: boolean;
  notes: string;
  source: 'community' | 'osm' | 'inaturalist';
  attribution: string;
  license: string;
  last_verified_at: string;
  status: FreshnessStatus;
  is_sacred_heritage: boolean;
  heritage_story?: string;
  primary_photo_url?: string;
}

export const SEED_DEMO_PLANTS: SeedPlantItem[] = [
  // ===================== VARANASI =====================
  {
    id: 'd0000001-0000-0000-0000-000000000001',
    species_scientific_name: 'Aegle marmelos', // Bael
    cityName: 'Varanasi',
    lat: 25.3109,
    lng: 83.0107,
    fuzzed_lat: 25.3000,
    fuzzed_lng: 83.0000,
    address_hint: 'Near Assi Ghat entrance pathway, under stone pavilion',
    land_type: 'temple',
    private_owner_consent: false,
    notes: 'Mature Bael tree with abundant trifoliate leaves, revered by local morning bathers and pujaris.',
    source: 'community',
    attribution: 'Kashi Heritage Trust (CC BY-SA 4.0)',
    license: 'CC BY-SA 4.0',
    last_verified_at: '2026-10-15T08:30:00Z',
    status: 'recently_verified',
    is_sacred_heritage: true,
    heritage_story: 'Planted over 60 years ago; devotees collect Belpatra for morning Vishwanath offerings.',
    primary_photo_url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'd0000001-0000-0000-0000-000000000002',
    species_scientific_name: 'Ficus religiosa', // Peepal
    cityName: 'Varanasi',
    lat: 25.3085,
    lng: 83.0072,
    fuzzed_lat: 25.3000,
    fuzzed_lng: 83.0000,
    address_hint: 'Tulsi Ghat, adjacent to Akhada platform',
    land_type: 'public',
    private_owner_consent: false,
    notes: 'Massive sacred Peepal overlooking the Ganga river steps. Excellent cooling shade.',
    source: 'community',
    attribution: 'Ghat Conservation Volunteer',
    license: 'CC BY-SA 4.0',
    last_verified_at: '2026-09-20T10:00:00Z',
    status: 'recently_verified',
    is_sacred_heritage: true,
    heritage_story: 'Associated with Goswami Tulsidas tradition along the Ghats.',
    primary_photo_url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'd0000001-0000-0000-0000-000000000003',
    species_scientific_name: 'Datura metel', // Dhatura
    cityName: 'Varanasi',
    lat: 25.2677,
    lng: 82.9913,
    fuzzed_lat: 25.2500,
    fuzzed_lng: 83.0000,
    address_hint: 'BHU Campus, Botanical Garden outskirts near New Vishwanath Temple',
    land_type: 'institution',
    private_owner_consent: false,
    notes: 'Wild Dhatura shrubs bearing characteristic spiky round fruits and purple-white trumpet blossoms.',
    source: 'community',
    attribution: 'BHU Student Botany Circle',
    license: 'CC BY-SA 4.0',
    last_verified_at: '2026-10-01T14:15:00Z',
    status: 'recently_verified',
    is_sacred_heritage: false,
    primary_photo_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'd0000001-0000-0000-0000-000000000004',
    species_scientific_name: 'Prosopis cineraria', // Shami
    cityName: 'Varanasi',
    lat: 25.3176,
    lng: 82.9739,
    fuzzed_lat: 25.3000,
    fuzzed_lng: 82.9500,
    address_hint: 'Sigra Stadium Road, public park corner',
    land_type: 'public',
    private_owner_consent: false,
    notes: 'Young healthy Shami tree. Frequently visited during Dussehra for auspicious leaves.',
    source: 'community',
    attribution: 'Varanasi Green Walk',
    license: 'CC BY-SA 4.0',
    last_verified_at: '2025-06-15T11:00:00Z', // 16 months ago -> needs_recheck
    status: 'needs_recheck',
    is_sacred_heritage: false,
  },

  // ===================== PATNA =====================
  {
    id: 'd0000002-0000-0000-0000-000000000001',
    species_scientific_name: 'Azadirachta indica', // Neem
    cityName: 'Patna',
    lat: 25.6022,
    lng: 85.1325,
    fuzzed_lat: 25.6000,
    fuzzed_lng: 85.1500,
    address_hint: 'Eco Park (Rajdhani Vatika), Section 2 walking trail',
    land_type: 'public',
    private_owner_consent: false,
    notes: 'Ancient spreading Neem tree with dense medicinal foliage. Great air and cooling shade.',
    source: 'osm',
    attribution: '© OpenStreetMap contributors, ODbL',
    license: 'ODbL 1.0',
    last_verified_at: '2026-10-18T09:00:00Z',
    status: 'recently_verified',
    is_sacred_heritage: false,
    primary_photo_url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'd0000002-0000-0000-0000-000000000002',
    species_scientific_name: 'Cynodon dactylon', // Durva grass
    cityName: 'Patna',
    lat: 25.6186,
    lng: 85.1439,
    fuzzed_lat: 25.6000,
    fuzzed_lng: 85.1500,
    address_hint: 'Gandhi Maidan perimeter lawn, near Gate 4',
    land_type: 'public',
    private_owner_consent: false,
    notes: 'Lush green patches of 3-bladed Durva grass. Regularly clipped by park caretakers.',
    source: 'community',
    attribution: 'Patna Morning Walkers Club',
    license: 'CC BY-SA 4.0',
    last_verified_at: '2026-10-25T07:00:00Z',
    status: 'recently_verified',
    is_sacred_heritage: false,
  },
  {
    id: 'd0000002-0000-0000-0000-000000000003',
    species_scientific_name: 'Mangifera indica', // Mango
    cityName: 'Patna',
    lat: 25.6124,
    lng: 85.1219,
    fuzzed_lat: 25.6000,
    fuzzed_lng: 85.1000,
    address_hint: 'Boring Road, residential avenue garden boundary',
    land_type: 'private',
    private_owner_consent: true, // Consent confirmed!
    notes: 'Large Langra mango tree. Owner permits harvesting fresh leaves for festivals and Kalash pujas.',
    source: 'community',
    attribution: 'Resident Verma Family (with consent)',
    license: 'CC BY-SA 4.0',
    last_verified_at: '2026-08-10T16:00:00Z',
    status: 'recently_verified',
    is_sacred_heritage: false,
  },
  {
    id: 'd0000002-0000-0000-0000-000000000004',
    species_scientific_name: 'Aegle marmelos', // Bael
    cityName: 'Patna',
    lat: 25.6025,
    lng: 85.1290,
    fuzzed_lat: 25.6000,
    fuzzed_lng: 85.1500,
    address_hint: 'Behind Mahavir Mandir campus, Station Road',
    land_type: 'temple',
    private_owner_consent: false,
    notes: 'Sacred Bael tree in temple garden courtyard. Leaves harvested for Hanuman ji and Shiva worship.',
    source: 'community',
    attribution: 'Mahavir Mandir Trust volunteer',
    license: 'CC BY-SA 4.0',
    last_verified_at: '2026-10-12T12:00:00Z',
    status: 'recently_verified',
    is_sacred_heritage: true,
    heritage_story: 'Supplies belpatra for thousands of devotees during Sawan and Shivratri.',
  },

  // ===================== DELHI =====================
  {
    id: 'd0000003-0000-0000-0000-000000000001',
    species_scientific_name: 'Azadirachta indica', // Neem
    cityName: 'Delhi',
    lat: 28.5933,
    lng: 77.2197,
    fuzzed_lat: 28.6000,
    fuzzed_lng: 77.2000,
    address_hint: 'Lodhi Gardens, near Sikandar Lodi Tomb',
    land_type: 'public',
    private_owner_consent: false,
    notes: 'Majestic heritage Neem tree providing broad canopy. Tagged and maintained by NDMC.',
    source: 'community',
    attribution: 'Delhi Trees Heritage Walk',
    license: 'CC BY-SA 4.0',
    last_verified_at: '2026-10-20T11:00:00Z',
    status: 'recently_verified',
    is_sacred_heritage: true,
    heritage_story: 'Over 80 years old, one of the heritage trees of the Lodhi historical precinct.',
    primary_photo_url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'd0000003-0000-0000-0000-000000000002',
    species_scientific_name: 'Ficus benghalensis', // Banyan
    cityName: 'Delhi',
    lat: 28.5912,
    lng: 77.2435,
    fuzzed_lat: 28.6000,
    fuzzed_lng: 77.2500,
    address_hint: 'Sundar Nursery, Heritage section near water canal',
    land_type: 'institution',
    private_owner_consent: false,
    notes: 'Exemplary sprawling Banyan tree with numerous descending aerial roots. Popular landmark.',
    source: 'community',
    attribution: 'Sundar Nursery Botanical Record',
    license: 'CC BY-SA 4.0',
    last_verified_at: '2026-10-14T15:30:00Z',
    status: 'recently_verified',
    is_sacred_heritage: true,
    heritage_story: 'Planted during the early 20th-century botanical landscaping of central Delhi.',
  },
  {
    id: 'd0000003-0000-0000-0000-000000000003',
    species_scientific_name: 'Nyctanthes arbor-tristis', // Parijat
    cityName: 'Delhi',
    lat: 28.6145,
    lng: 77.2088,
    fuzzed_lat: 28.6000,
    fuzzed_lng: 77.2000,
    address_hint: 'Central Ridge Forest edge, near talkatora garden gate',
    land_type: 'public',
    private_owner_consent: false,
    notes: 'Parijat tree blooming with fragrant orange-stemmed white flowers in early dawn.',
    source: 'inaturalist',
    attribution: 'Observation 1428934 by @delhibirder via iNaturalist (CC BY-NC 4.0)',
    license: 'CC BY-NC 4.0',
    last_verified_at: '2026-10-05T06:00:00Z',
    status: 'recently_verified',
    is_sacred_heritage: false,
  },
  {
    // RESTRICTED SPECIES: Sandalwood in Delhi (Fuzzed coords)
    id: 'd0000003-0000-0000-0000-000000000004',
    species_scientific_name: 'Santalum album', // Sandalwood
    cityName: 'Delhi',
    lat: 28.5833, // Exact (hidden from non-moderators)
    lng: 77.2167,
    fuzzed_lat: 28.6000, // Fuzzed centroid (~5km grid)
    fuzzed_lng: 77.2000,
    address_hint: 'Protected botanical research grove (Area centroid shown)',
    land_type: 'institution',
    private_owner_consent: false,
    notes: 'Protected specimen. Coordinates fuzzed for conservation security.',
    source: 'community',
    attribution: 'Department of Forestry Research (CC BY-SA 4.0)',
    license: 'CC BY-SA 4.0',
    last_verified_at: '2026-09-01T10:00:00Z',
    status: 'recently_verified',
    is_sacred_heritage: false,
  },

  // ===================== BENGALURU =====================
  {
    id: 'd0000004-0000-0000-0000-000000000001',
    species_scientific_name: 'Ficus benghalensis', // Banyan
    cityName: 'Bengaluru',
    lat: 12.9763,
    lng: 77.5929,
    fuzzed_lat: 13.0000,
    fuzzed_lng: 77.6000,
    address_hint: 'Cubbon Park, near Band Stand lawn',
    land_type: 'public',
    private_owner_consent: false,
    notes: 'Sprawling mature Banyan tree. Shade point for walkers and weekend book clubs.',
    source: 'community',
    attribution: 'Cubbon Park Heritage Walk',
    license: 'CC BY-SA 4.0',
    last_verified_at: '2026-10-22T17:00:00Z',
    status: 'recently_verified',
    is_sacred_heritage: true,
    heritage_story: 'Witness to Bengaluru\'s transformation, over 120 years old.',
    primary_photo_url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'd0000004-0000-0000-0000-000000000002',
    species_scientific_name: 'Murraya koenigii', // Curry tree
    cityName: 'Bengaluru',
    lat: 12.9431,
    lng: 77.5739,
    fuzzed_lat: 12.9500,
    fuzzed_lng: 77.5500,
    address_hint: 'Basavanagudi, residential street green verge near DVG Road',
    land_type: 'public',
    private_owner_consent: false,
    notes: 'Healthy aromatic Curry leaf tree. Neighbors harvest fresh sprigs for daily Rasam and Sambhar.',
    source: 'community',
    attribution: 'Namma Bengaluru Flora Project',
    license: 'CC BY-SA 4.0',
    last_verified_at: '2026-10-19T08:00:00Z',
    status: 'recently_verified',
    is_sacred_heritage: false,
  },
  {
    id: 'd0000004-0000-0000-0000-000000000003',
    species_scientific_name: 'Phyllanthus emblica', // Amla
    cityName: 'Bengaluru',
    lat: 12.9507,
    lng: 77.5848,
    fuzzed_lat: 12.9500,
    fuzzed_lng: 77.6000,
    address_hint: 'Lalbagh Botanical Garden, Medicinal Plants section',
    land_type: 'institution',
    private_owner_consent: false,
    notes: 'High yielding gooseberry tree. In fruit during late autumn.',
    source: 'community',
    attribution: 'Horticultural Society of Bengaluru',
    license: 'CC BY-SA 4.0',
    last_verified_at: '2026-10-10T11:00:00Z',
    status: 'recently_verified',
    is_sacred_heritage: false,
  },
  {
    // RESTRICTED SPECIES: Red Sanders in Bengaluru
    id: 'd0000004-0000-0000-0000-000000000004',
    species_scientific_name: 'Pterocarpus santalinus', // Red Sanders
    cityName: 'Bengaluru',
    lat: 12.9480, // Exact
    lng: 77.5810,
    fuzzed_lat: 12.9500, // Fuzzed
    fuzzed_lng: 77.6000,
    address_hint: 'Botanical Conservatory Grove (Area centroid displayed for safety)',
    land_type: 'institution',
    private_owner_consent: false,
    notes: 'Protected endangered endemic timber species. Exact location obscured to prevent poaching.',
    source: 'community',
    attribution: 'Botanical Survey of India (Southern Circle)',
    license: 'CC BY-SA 4.0',
    last_verified_at: '2026-09-15T14:00:00Z',
    status: 'recently_verified',
    is_sacred_heritage: false,
  },
];
