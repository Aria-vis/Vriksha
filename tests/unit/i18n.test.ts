import { describe, it, expect, beforeEach } from 'vitest';
import i18n, { SUPPORTED_LANGUAGES, setLanguage } from '../../src/i18n';

describe('Internationalization (i18n) System', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
  });

  it('supports 11 official Indian languages with scripts', () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(11);

    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('hi');
    expect(codes).toContain('bn');
    expect(codes).toContain('ta');
    expect(codes).toContain('te');
    expect(codes).toContain('mr');
    expect(codes).toContain('gu');
    expect(codes).toContain('kn');
    expect(codes).toContain('ml');
    expect(codes).toContain('pa');
    expect(codes).toContain('or');
  });

  it('translates core UI strings into English by default', () => {
    expect(i18n.t('app.title')).toBe('Vriksha');
    expect(i18n.t('freshness.recently_verified')).toBe('Recently Verified');
    expect(i18n.t('filters.puja')).toBe('Puja & Rituals');
    expect(i18n.t('app.addPlant')).toBe('Add a Plant');
  });

  it('translates core UI strings into Hindi when language changes', async () => {
    await i18n.changeLanguage('hi');

    expect(i18n.t('app.title')).toBe('वृक्ष');
    expect(i18n.t('freshness.recently_verified')).toBe('हाल ही में सत्यापित');
    expect(i18n.t('filters.puja')).toBe('पूजा और अनुष्ठान');
    expect(i18n.t('app.addPlant')).toBe('पौधा जोड़ें');
  });

  it('falls back gracefully to English when a key is missing in regional stubs', async () => {
    await i18n.changeLanguage('ta');

    // Tamil key exists
    expect(i18n.t('app.title')).toBe('விருக்ஷா');
    // Fallback to English for nested keys not present in regional stub
    expect(i18n.t('plant.flowering')).toBe('Flowering');
  });

  it('setLanguage updates active language and persists in localStorage', () => {
    setLanguage('mr');
    expect(i18n.language).toBe('mr');
    expect(localStorage.getItem('vriksha_language')).toBe('mr');
  });
});
