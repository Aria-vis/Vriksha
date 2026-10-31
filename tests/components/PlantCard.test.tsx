import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '../../src/i18n';
import PlantCard from '../../src/components/plant/PlantCard';
import { formatDistance } from '../../src/lib/formatters';
import { PlantSearchResult } from '../../src/types/plant';


const mockPlant: PlantSearchResult = {
  id: 'test-plant-1',
  species_id: 'sp-1',
  scientific_name: 'Azadirachta indica',
  common_name_en: 'Neem',
  common_name_hi: 'नीम',
  plant_type: 'large_tree',
  use_tags: ['medicinal', 'puja'],
  parts_used: ['leaves', 'twigs'],
  is_toxic: false,
  toxicity_details: null,
  is_restricted: false,
  lat: 25.3176,
  lng: 82.9739,
  distance_meters: 450,
  address_hint: 'Near Dashashwamedh Ghat gate',
  land_type: 'public',
  status: 'recently_verified',
  last_verified_at: '2026-10-20T10:00:00Z',
  verification_count: 3,
  is_sacred_heritage: true,
  heritage_story: 'Ancient Neem tree planted by temple elders',
  primary_photo_url: null,
  source: 'community',
  attribution: 'Varanasi Volunteer',
  license: 'CC BY-SA 4.0',
};

describe('PlantCard Component', () => {
  it('formats distance correctly in meters and kilometers', () => {
    expect(formatDistance(350)).toBe('350 m');
    expect(formatDistance(1250)).toBe('1.3 km');
    expect(formatDistance(5000)).toBe('5.0 km');
  });

  it('renders plant common name, Hindi name, scientific name, and distance', () => {
    render(<PlantCard plant={mockPlant} />);

    expect(screen.getByText('Neem')).toBeInTheDocument();
    expect(screen.getByText('(नीम)')).toBeInTheDocument();
    expect(screen.getByText('Azadirachta indica')).toBeInTheDocument();
    expect(screen.getByText('450 m')).toBeInTheDocument();
    expect(screen.getByText('Near Dashashwamedh Ghat gate')).toBeInTheDocument();
    expect(screen.getByText('Heritage')).toBeInTheDocument();
  });

  it('triggers onSelect when clicked', () => {
    const handleSelect = vi.fn();
    render(<PlantCard plant={mockPlant} onSelect={handleSelect} />);

    fireEvent.click(screen.getByText('Neem'));
    expect(handleSelect).toHaveBeenCalledWith(mockPlant);
  });
});
