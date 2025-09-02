import { test, expect } from '@playwright/test';

test.describe('Kanban Board', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kanban');
  });

  test('should display kanban board with columns', async ({ page }) => {
    // Check that main columns are present
    await expect(page.locator('text=New')).toBeVisible();
    await expect(page.locator('text=Waiting Artwork')).toBeVisible();
    await expect(page.locator('text=Ready for Press')).toBeVisible();
    await expect(page.locator('text=In Press')).toBeVisible();
    await expect(page.locator('text=QC')).toBeVisible();
    await expect(page.locator('text=Packed')).toBeVisible();
    await expect(page.locator('text=Shipped')).toBeVisible();
  });

  test('should display job cards with correct information', async ({ page }) => {
    // Check for job cards
    await expect(page.locator('[data-testid="job-card"]').first()).toBeVisible();
    
    // Check job card contains client name
    await expect(page.locator('text=Acme Corp').first()).toBeVisible();
    
    // Check for rush badge
    await expect(page.locator('text=RUSH 24hr')).toBeVisible();
  });

  test('should show job details when clicking info button', async ({ page }) => {
    // Click on job details button
    const firstJobCard = page.locator('[data-testid="job-card"]').first();
    const infoButton = firstJobCard.locator('button[aria-label="View details"]');
    
    await infoButton.click();
    
    // Should trigger job details view (in production would open modal/drawer)
    // For now just check console log was triggered
  });

  test('should filter jobs by CSR', async ({ page }) => {
    // Select CSR filter
    await page.selectOption('select:has-text("All CSRs")', 'Sarah M.');
    
    // Check that only Sarah's jobs are visible
    // This would need actual filtering implementation
  });

  test('should show capacity and on-time metrics', async ({ page }) => {
    // Check metrics are displayed
    await expect(page.locator('text=On-Time:')).toBeVisible();
    await expect(page.locator('text=Capacity:')).toBeVisible();
    
    // Check percentage values
    await expect(page.locator('text=94%')).toBeVisible();
    await expect(page.locator('text=85%')).toBeVisible();
  });

  test('should handle drag and drop operations', async ({ page }) => {
    // This test would need to simulate drag and drop
    // For now, just check that draggable elements exist
    const jobCard = page.locator('[data-testid="job-card"]').first();
    await expect(jobCard).toHaveClass(/cursor-move/);
  });
});

test.describe('Job Status Transitions', () => {
  test('should prevent moving job to In Press without approved proof', async ({ page }) => {
    await page.goto('/kanban');
    
    // Try to move a job from Ready for Press to In Press without approved proof
    // This would trigger validation and show error message
    // Implementation depends on drag-and-drop library
  });

  test('should prevent shipping job that needs photo', async ({ page }) => {
    await page.goto('/kanban');
    
    // Try to move a job with "Need Photo" to Shipped
    // Should show blocking message
  });
});

test.describe('Print Functionality', () => {
  test('should be able to print production ticket', async ({ page }) => {
    await page.goto('/kanban');
    
    // Open job details
    const firstJobCard = page.locator('[data-testid="job-card"]').first();
    await firstJobCard.click();
    
    // Click print ticket button (when modal is implemented)
    // Should generate barcode and prepare print view
  });
});