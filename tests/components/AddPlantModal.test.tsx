import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '../../src/i18n';
import { AddPlantModal } from '../../src/components/forms/AddPlantModal';
import { AuthProvider } from '../../src/context/AuthContext';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('AddPlantModal Component', () => {
  it('renders photo upload step by default when open', () => {
    render(
      <AuthProvider>
        <AddPlantModal
          isOpen={true}
          onClose={vi.fn()}
          currentLat={25.3176}
          currentLng={82.9739}
        />
      </AuthProvider>
    );

    expect(screen.getByText('Add a Plant or Tree')).toBeInTheDocument();
    expect(screen.getByText(/Upload a Photo/i)).toBeInTheDocument();
    expect(screen.getByText(/Continue/i)).toBeInTheDocument();
  });

  it('navigates through steps to location and enforces private land consent', async () => {
    render(
      <AuthProvider>
        <AddPlantModal
          isOpen={true}
          onClose={vi.fn()}
          currentLat={25.3176}
          currentLng={82.9739}
        />
      </AuthProvider>
    );

    // Step 1 -> Step 2
    fireEvent.click(screen.getByText(/Continue/i));
    expect(screen.getByText(/Select Plant Species/i)).toBeInTheDocument();

    // Step 2 -> Step 3
    fireEvent.click(screen.getByText(/Next: Location & Land/i));
    expect(screen.getByText(/Location & Land Type/i)).toBeInTheDocument();

    // Select "Private Property"
    const privateButton = screen.getByText(/Private Property/i);
    fireEvent.click(privateButton);

    // Verify landowner consent warning is displayed
    expect(screen.getByText(/Landowner Consent Required/i)).toBeInTheDocument();
    expect(screen.getByText(/I confirm the landowner has agreed to share this plant's location with the community/i)).toBeInTheDocument();

    // Submit button should be disabled without consent checkbox checked
    const submitBtn = screen.getByRole('button', { name: /Submit Plant/i });
    expect(submitBtn).toBeDisabled();

    // Check consent checkbox
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Submit button should now be enabled
    expect(submitBtn).not.toBeDisabled();
  });
});
