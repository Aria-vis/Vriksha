import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import SeasonalityStrip from '../../src/components/plant/SeasonalityStrip';

describe('SeasonalityStrip Component', () => {
  it('renders all 12 calendar month initials', () => {
    render(
      <SeasonalityStrip
        floweringMonths={[3, 4]}
        fruitingMonths={[5, 6]}
        freshLeavesMonths={[3, 4, 5, 6, 7]}
      />
    );

    expect(screen.getByText('12-Month Seasonality')).toBeInTheDocument();
    expect(screen.getByText('Flowers')).toBeInTheDocument();
    expect(screen.getByText('Fruit')).toBeInTheDocument();
    expect(screen.getByText('Leaves')).toBeInTheDocument();
  });

  it('correctly indicates in-season when active in current month', () => {
    const currentMonth = new Date().getMonth() + 1;
    render(
      <SeasonalityStrip
        floweringMonths={[currentMonth]}
        fruitingMonths={[]}
        freshLeavesMonths={[]}
      />
    );

    expect(screen.getByText('In Season Now')).toBeInTheDocument();
  });

  it('indicates off-season when no activity in current month', () => {
    // Current month is not in empty arrays
    render(
      <SeasonalityStrip
        floweringMonths={[]}
        fruitingMonths={[]}
        freshLeavesMonths={[]}
      />
    );

    expect(screen.getByText('Off Season')).toBeInTheDocument();
  });
});
