import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FestivalChecklist } from '../../src/components/festival/FestivalChecklist';
import { SeedFestivalItem } from '../../scripts/data/festival-data';
import { PlantSearchResult } from '../../src/types/plant';

const mockFestival: SeedFestivalItem = {
  slug: 'maha-shivratri',
  name_en: 'Maha Shivratri',
  name_hi: 'महाशिवरात्रि',
  description_en: 'The great night of Lord Shiva. Devotees offer Bilva leaves.',
  description_hi: 'भगवान शिव का पावन महापर्व।',
  typical_month: 2,
  lunar_tithi_desc: 'Phalguna Krishna Chaturdashi',
  next_observed_date: '2027-03-06',
  region: 'All India',
  needs_local_review: true,
  checklist: [
    {
      species_scientific_name: 'Aegle marmelos',
      purpose: 'Primary offering to Shiva Lingam',
      part_needed: 'Trifoliate leaves (Belpatra)',
      is_essential: true,
      notes: 'Take 3-leaf clusters that are clean.',
    },
    {
      species_scientific_name: 'Datura metel',
      purpose: 'Sacred offering to neutralize cosmic poisons',
      part_needed: 'Fruit and flower',
      is_essential: true,
    },
  ],
};

const mockPlants: PlantSearchResult[] = [
  {
    id: 'p-bael-1',
    species_id: 'sp-bael',
    scientific_name: 'Aegle marmelos',
    common_name_en: 'Bael',
    common_name_hi: 'बेल',
    plant_type: 'large_tree',
    use_tags: ['puja', 'medicinal'],
    parts_used: ['leaves'],
    is_toxic: false,
    toxicity_details: null,
    is_restricted: false,
    lat: 25.318,
    lng: 82.974,
    distance_meters: 150,
    address_hint: 'Behind temple',
    land_type: 'public',
    status: 'recently_verified',
    last_verified_at: new Date().toISOString(),
    verification_count: 1,
    is_sacred_heritage: false,
    heritage_story: null,
    primary_photo_url: null,
    source: 'community',
    attribution: 'Contributor',
    license: 'CC BY-SA 4.0',
  },
];

describe('FestivalChecklist Component', () => {
  it('renders festival header, checklist items, and regional disclaimer', () => {
    render(
      <FestivalChecklist
        festival={mockFestival}
        nearbyPlants={mockPlants}
        userLat={25.3176}
        userLng={82.9739}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('Maha Shivratri')).toBeInTheDocument();
    expect(screen.getByText('(महाशिवरात्रि)')).toBeInTheDocument();
    expect(screen.getByText(/Regional Ritual Traditions:/i)).toBeInTheDocument();
    expect(screen.getByText(/Trifoliate leaves \(Belpatra\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Fruit and flower/i)).toBeInTheDocument();
  });

  it('shows availability distance for plants found nearby', () => {
    render(
      <FestivalChecklist
        festival={mockFestival}
        nearbyPlants={mockPlants}
        userLat={25.3176}
        userLng={82.9739}
        onClose={vi.fn()}
      />
    );

    // Bael was found within 150m
    expect(screen.getByText('150 m')).toBeInTheDocument();
    // Dhatura was not found
    expect(screen.getByText('None nearby')).toBeInTheDocument();
  });

  it('updates basket progress counter when item checkbox is clicked', () => {
    render(
      <FestivalChecklist
        festival={mockFestival}
        nearbyPlants={mockPlants}
        userLat={25.3176}
        userLng={82.9739}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText(/Puja Basket: 0 of 2 items collected/i)).toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
    fireEvent.click(checkboxes[0]!);

    expect(screen.getByText(/Puja Basket: 1 of 2 items collected/i)).toBeInTheDocument();
  });

  it('launches trip planner modal when Plan My Trip is clicked', () => {
    render(
      <FestivalChecklist
        festival={mockFestival}
        nearbyPlants={mockPlants}
        userLat={25.3176}
        userLng={82.9739}
        onClose={vi.fn()}
      />
    );

    const planBtn = screen.getByRole('button', { name: /Plan My Trip/i });
    fireEvent.click(planBtn);

    expect(screen.getByText(/Optimized Collection Route/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Multi-Stop in Google Maps/i)).toBeInTheDocument();
  });
});
