import { test, expect } from '@playwright/test';

// Constant for the Angular base URL
const BASE_URL = 'http://localhost:4200';

test.describe('RegexRiddle E2E Tests', () => {

  // ========================================
  // SECTION 1: Navigation and Basic Security
  // ========================================

  test('1. Should load the home page and display the navbar', async ({ page }) => {
    await page.goto(`${BASE_URL}/home`);
    
    // Verify that the navbar is visible
    await expect(page.locator('nav')).toBeVisible();
    // Search exactly for the link with the brand name, avoiding ambiguity
    await expect(page.getByRole('link', { name: 'RegexRiddle' })).toBeVisible();
  });

  test('2. Should navigate to the Rules page', async ({ page }) => {
    await page.goto(`${BASE_URL}/home`);
    await page.click('text=Rules');
    
    // Verify the URL and the presence of the correct title
    await expect(page).toHaveURL(/.*rules/);
    await expect(page.locator('h1')).toContainText('Game Rules');
  });

  test('3. AuthGuard should block unauthenticated users from /create', async ({ page }) => {
    // Try to force access to the protected route
    await page.goto(`${BASE_URL}/create`);
    
    // Angular should intercept it and redirect to login
    await expect(page).toHaveURL(/.*login/);
  });

  // ============================================
  // SECTION 2: Authentication (Register & Login)
  // ============================================

  test('4. Should show an error message on invalid login', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    await page.fill('#username', 'utente_falso_123');
    await page.fill('#password', 'password_sbagliata');
    await page.click('button[type="submit"]');
    
    // Verify that the red error div appears
    await expect(page.locator('.text-red-400')).toBeVisible();
  });

  test('5. Should register a new user successfully', async ({ page }) => {
    // Use a timestamp to ensure a unique username for each test execution
    const uniqueUser = `hacker_${Date.now()}`;
    
    await page.goto(`${BASE_URL}/register`);
    await page.fill('#username', uniqueUser);
    await page.fill('#password', 'SuperSecret123!');
    await page.click('button[type="submit"]');
    
    // After registration, it should redirect to the Home page
    await expect(page).toHaveURL(/.*home/);
  });

  test('6. Should login successfully and update the Navbar', async ({ page }) => {
    const testUser = `test_user_${Date.now()}`;
    
    // Quick setup: Register the user for a clean login
    await page.goto(`${BASE_URL}/register`);
    await page.fill('#username', testUser);
    await page.fill('#password', 'testpass');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*home/);
    
    // Logout
    await page.click('text=Logout');

    // Perform the actual login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('#username', testUser);
    await page.fill('#password', 'testpass');
    await page.click('button[type="submit"]');
    
    // Verify that the navbar shows options for logged-in users
    await expect(page.getByText('Create Challenge')).toBeVisible();
    await expect(page.getByText('Logout')).toBeVisible();
  });

  // ===========================================
  // SECTION 3: Game Flow (Creation and Solving)
  // ===========================================

  // For these tests we use a beforeEach hook to log in a dummy user before each test
  test.describe('Authenticated User Flows', () => {
    
    test.beforeEach(async ({ page }) => {
      // Register and log in a user on the fly before testing the challenges
      const sessionUser = `player_${Date.now()}`;
      await page.goto(`${BASE_URL}/register`);
      await page.fill('#username', sessionUser);
      await page.fill('#password', '123456');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*home/);
    });

    test('7. Should navigate to Create Challenge and verify form validation', async ({ page }) => {
      // 1. Go to the creation page
      await page.click('text=Create Challenge');
      await expect(page).toHaveURL(/.*create/);
      
      // 2. Verify that the title is correct
      await expect(page.locator('h1')).toContainText('Create a New Challenge');
      
      // 3. Verify that form security works and the button is DISABLED by default
      const submitBtn = page.getByRole('button', { name: 'Submit Challenge' });
      await expect(submitBtn).toBeDisabled();
    });

    test('8. Should logout and clear the session', async ({ page }) => {
      await page.click('text=Logout');
      
      // Protected buttons should disappear, and Login/Register should return
      await expect(page.getByText('Create Challenge')).not.toBeVisible();
      await expect(page.getByText('Login')).toBeVisible();
    });

    test('9. Should load the mission briefing for an existing challenge', async ({ page }) => {
      await page.goto(`${BASE_URL}/home`);
      
      // Click on the first available "Solve" button in the grid
      await page.locator('text=Solve').first().click();
      
      // Verify that the solving page UI is loaded
      await expect(page).toHaveURL(/.*solve\/\d+/);
      await expect(page.getByText('Mission Briefing')).toBeVisible();
      await expect(page.locator('#proposedRegex')).toBeVisible();
    });

    test('10. Should submit a regex and display the evaluation results', async ({ page }) => {
      await page.goto(`${BASE_URL}/home`);
      await page.locator('text=Solve').first().click();
      
      // Fill in the solution
      await page.fill('#proposedRegex', '.*'); // A basic regex that matches everything
      await page.click('button[type="submit"]');
      
      // Wait for the results block to appear (passed or failed)
      // We use a RegEx in the locator to search for the text "Challenge Passed!" or "Tests Failed"
      await expect(page.locator('h3:has-text("Challenge Passed!"), h3:has-text("Tests Failed")')).toBeVisible();
      
      // Verify that it shows the test breakdown
      await expect(page.getByText('Test Breakdown')).toBeVisible();
      await expect(page.getByText('Positive Strings Matched:')).toBeVisible();
    });
  });
});
