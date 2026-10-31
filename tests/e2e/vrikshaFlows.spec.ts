import { test, expect } from '@playwright/test';

test.describe('Vriksha Core User Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('Flow 1: App Header, City Switching, and Search/Filters', async ({ page }) => {
    // 1. Verify App Title and Header
    await expect(page.locator('h1')).toContainText('Vriksha');
    await expect(page.locator('h1')).toContainText('(वृक्ष)');

    // 2. Verify filter chips are rendered
    await expect(page.locator('text=Puja & Rituals')).toBeVisible();
    await expect(page.locator('text=Recently Verified')).toBeVisible();

    // 3. Search for "Neem"
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Neem');

    // 4. Verify search results contain Neem
    await expect(page.locator('text=Neem').first()).toBeVisible();
  });

  test('Flow 2: Add Plant Wizard with Private Property Consent Enforced', async ({ page }) => {
    // 1. Open Add Plant Wizard
    const addPlantBtn = page.locator('header button[aria-label="Add a plant"]').first();
    await addPlantBtn.click();

    // 2. Step 1: Upload Photo header visible
    await expect(page.locator('text=Upload a Photo')).toBeVisible();

    // 3. Navigate to Step 2 (Species)
    const continueBtn = page.locator('button:has-text("Continue")');
    await continueBtn.click();
    await expect(page.locator('text=Select Plant Species')).toBeVisible();

    // 4. Select a species (Neem)
    const speciesChip = page.locator('button:has-text("Neem")').first();
    await speciesChip.click();

    // 5. Navigate to Step 3 (Location & Land)
    await page.locator('button:has-text("Next: Location & Land")').click();
    await expect(page.locator('text=Location & Land Type')).toBeVisible();

    // 6. Select Private Property button
    const privatePropertyBtn = page.locator('button:has-text("Private Property")');
    await privatePropertyBtn.click();

    // 7. Verify Landowner Consent notice appears
    await expect(page.locator('text=Landowner Consent Required')).toBeVisible();

    // 8. Submit button should be disabled until owner consent is checked
    const submitBtn = page.locator('button:has-text("Submit Plant")');
    await expect(submitBtn).toBeDisabled();

    // 9. Check the consent checkbox
    const consentCheckbox = page.locator('input[type="checkbox"]').first();
    await consentCheckbox.check();

    // 10. Submit button becomes enabled
    await expect(submitBtn).toBeEnabled();
  });

  test('Flow 3: Festival Checklist and Route Planner', async ({ page }) => {
    // 1. Verify upcoming festivals strip
    await expect(page.locator('text=Puja & Festival Mode')).toBeVisible();

    // 2. Open Maha Shivratri checklist
    const shivratriBtn = page.locator('button:has-text("Maha Shivratri")').first();
    await expect(shivratriBtn).toBeVisible({ timeout: 10000 });
    await shivratriBtn.click();

    // 3. Verify checklist drawer opens
    await expect(page.locator('h2:has-text("Maha Shivratri")')).toBeVisible();
    await expect(page.locator('text=Bilva Leaves')).toBeVisible();

    // 4. Launch Route Planner
    const planTripBtn = page.locator('button:has-text("Plan My Trip")');
    await planTripBtn.click();

    // 5. Verify Route Planner Modal
    await expect(page.locator('text=Optimized Collection Route')).toBeVisible();
    await expect(page.locator('text=Total Distance')).toBeVisible();
    await expect(page.locator('text=Walking')).toBeVisible();
  });
});
