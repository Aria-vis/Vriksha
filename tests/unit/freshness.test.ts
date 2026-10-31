import { describe, it, expect } from 'vitest';
import { computeFreshnessStatus } from '../../src/config/freshness';

describe('Freshness System Decay Windows', () => {
  const baseDate = new Date('2026-10-31T00:00:00Z');

  describe('Large Tree (Peepal, Neem, Bael, Mango, Banyan)', () => {
    it('is recently_verified up to 18 months', () => {
      // 6 months ago
      const verifiedAt6Mo = new Date('2026-04-30T00:00:00Z');
      expect(computeFreshnessStatus(verifiedAt6Mo, 'large_tree', 0, baseDate)).toBe('recently_verified');

      // 17 months ago
      const verifiedAt17Mo = new Date('2025-05-31T00:00:00Z');
      expect(computeFreshnessStatus(verifiedAt17Mo, 'large_tree', 0, baseDate)).toBe('recently_verified');
    });

    it('transitions to needs_recheck between 18 and 36 months', () => {
      // 24 months ago (2 years)
      const verifiedAt24Mo = new Date('2024-10-31T00:00:00Z');
      expect(computeFreshnessStatus(verifiedAt24Mo, 'large_tree', 0, baseDate)).toBe('needs_recheck');

      // 35 months ago
      const verifiedAt35Mo = new Date('2023-11-30T00:00:00Z');
      expect(computeFreshnessStatus(verifiedAt35Mo, 'large_tree', 0, baseDate)).toBe('needs_recheck');
    });

    it('transitions to possibly_gone after 36 months', () => {
      // 40 months ago
      const verifiedAt40Mo = new Date('2023-06-30T00:00:00Z');
      expect(computeFreshnessStatus(verifiedAt40Mo, 'large_tree', 0, baseDate)).toBe('possibly_gone');
    });
  });

  describe('Shrub (Tulsi, Hibiscus, Shami, Kaner)', () => {
    it('is recently_verified up to 6 months', () => {
      const verifiedAt3Mo = new Date('2026-07-31T00:00:00Z');
      expect(computeFreshnessStatus(verifiedAt3Mo, 'shrub', 0, baseDate)).toBe('recently_verified');
    });

    it('transitions to needs_recheck between 6 and 12 months', () => {
      const verifiedAt8Mo = new Date('2026-02-28T00:00:00Z');
      expect(computeFreshnessStatus(verifiedAt8Mo, 'shrub', 0, baseDate)).toBe('needs_recheck');
    });

    it('transitions to possibly_gone after 12 months', () => {
      const verifiedAt14Mo = new Date('2025-08-31T00:00:00Z');
      expect(computeFreshnessStatus(verifiedAt14Mo, 'shrub', 0, baseDate)).toBe('possibly_gone');
    });
  });

  describe('Herb and Grass (Durva, Mint, small herbs)', () => {
    it('is recently_verified up to 2 months', () => {
      const verifiedAt1Mo = new Date('2026-09-30T00:00:00Z');
      expect(computeFreshnessStatus(verifiedAt1Mo, 'grass', 0, baseDate)).toBe('recently_verified');
      expect(computeFreshnessStatus(verifiedAt1Mo, 'herb', 0, baseDate)).toBe('recently_verified');
    });

    it('transitions to needs_recheck between 2 and 4 months', () => {
      const verifiedAt3Mo = new Date('2026-07-31T00:00:00Z');
      expect(computeFreshnessStatus(verifiedAt3Mo, 'grass', 0, baseDate)).toBe('needs_recheck');
      expect(computeFreshnessStatus(verifiedAt3Mo, 'herb', 0, baseDate)).toBe('needs_recheck');
    });

    it('transitions to possibly_gone after 4 months', () => {
      const verifiedAt6Mo = new Date('2026-04-30T00:00:00Z');
      expect(computeFreshnessStatus(verifiedAt6Mo, 'grass', 0, baseDate)).toBe('possibly_gone');
      expect(computeFreshnessStatus(verifiedAt6Mo, 'herb', 0, baseDate)).toBe('possibly_gone');
    });
  });

  describe('Negative Verification (Gone Reports)', () => {
    it('sets reported_gone when 2 or more gone reports are filed regardless of age', () => {
      const freshDate = new Date('2026-10-30T00:00:00Z'); // yesterday
      expect(computeFreshnessStatus(freshDate, 'large_tree', 2, baseDate)).toBe('reported_gone');
      expect(computeFreshnessStatus(freshDate, 'shrub', 3, baseDate)).toBe('reported_gone');
    });

    it('does not set reported_gone on only 1 gone report', () => {
      const freshDate = new Date('2026-10-30T00:00:00Z');
      expect(computeFreshnessStatus(freshDate, 'large_tree', 1, baseDate)).toBe('recently_verified');
    });
  });
});
