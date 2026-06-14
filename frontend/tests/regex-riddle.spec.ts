import { test, expect } from '@playwright/test';

// Costante per l'URL base di Angular
const BASE_URL = 'http://localhost:4200';

test.describe('RegexRiddle E2E Tests', () => {

  // ==========================================
  // SEZIONE 1: Navigazione e Sicurezza Base
  // ==========================================

  test('1. Should load the home page and display the navbar', async ({ page }) => {
    await page.goto(`${BASE_URL}/home`);
    
    // Verifica che la navbar sia visibile
    await expect(page.locator('nav')).toBeVisible();
    // Cerca esattamente il link con il nome del brand, evitando ambiguità!
    await expect(page.getByRole('link', { name: 'RegexRiddle' })).toBeVisible();
  });

  test('2. Should navigate to the Rules page', async ({ page }) => {
    await page.goto(`${BASE_URL}/home`);
    await page.click('text=Rules');
    
    // Verifica l'URL e la presenza del titolo corretto
    await expect(page).toHaveURL(/.*rules/);
    await expect(page.locator('h1')).toContainText('Game Rules');
  });

  test('3. AuthGuard should block unauthenticated users from /create', async ({ page }) => {
    // Tenta di forzare l'accesso alla rotta protetta
    await page.goto(`${BASE_URL}/create`);
    
    // Angular dovrebbe intercettarlo e rimbalzarlo al login
    await expect(page).toHaveURL(/.*login/);
  });

  // ==========================================
  // SEZIONE 2: Autenticazione (Register & Login)
  // ==========================================

  test('4. Should show an error message on invalid login', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    await page.fill('#username', 'utente_falso_123');
    await page.fill('#password', 'password_sbagliata');
    await page.click('button[type="submit"]');
    
    // Verifica che compaia il div rosso di errore
    await expect(page.locator('.text-red-400')).toBeVisible();
  });

  test('5. Should register a new user successfully', async ({ page }) => {
    // Usa un timestamp per garantire un username unico ad ogni esecuzione del test
    const uniqueUser = `hacker_${Date.now()}`;
    
    await page.goto(`${BASE_URL}/register`);
    await page.fill('#username', uniqueUser);
    await page.fill('#password', 'SuperSecret123!');
    await page.click('button[type="submit"]');
    
    // Dopo la registrazione, dovrebbe rimandare alla Home
    await expect(page).toHaveURL(/.*home/);
  });

  test('6. Should login successfully and update the Navbar', async ({ page }) => {
    // Nota: presuppone che tu abbia creato un utente "mario_rossi" per i test, 
    // oppure puoi concatenare questo test al precedente. Usiamo un utente mock o uno reale.
    const testUser = `test_user_${Date.now()}`;
    
    // Setup rapido: Registra l'utente per fare login pulito
    await page.goto(`${BASE_URL}/register`);
    await page.fill('#username', testUser);
    await page.fill('#password', 'testpass');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*home/);
    
    // Fai il logout
    await page.click('text=Logout');

    // Fai il login vero e proprio
    await page.goto(`${BASE_URL}/login`);
    await page.fill('#username', testUser);
    await page.fill('#password', 'testpass');
    await page.click('button[type="submit"]');
    
    // Verifica che la navbar mostri le opzioni per utenti loggati
    await expect(page.getByText('Create Challenge')).toBeVisible();
    await expect(page.getByText('Logout')).toBeVisible();
  });

  // ==========================================
  // SEZIONE 3: Flusso di Gioco (Creazione e Risoluzione)
  // ==========================================

  // Per questi test usiamo un hook beforeEach per loggare un utente fittizio prima di ogni test
  test.describe('Authenticated User Flows', () => {
    
    test.beforeEach(async ({ page }) => {
      // Registra e logga un utente al volo prima di testare le sfide
      const sessionUser = `player_${Date.now()}`;
      await page.goto(`${BASE_URL}/register`);
      await page.fill('#username', sessionUser);
      await page.fill('#password', '123456');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*home/);
    });

    test('7. Should navigate to Create Challenge and verify form validation', async ({ page }) => {
      // 1. Va alla pagina di creazione
      await page.click('text=Create Challenge');
      await expect(page).toHaveURL(/.*create/);
      
      // 2. Verifica che il titolo sia corretto
      await expect(page.locator('h1')).toContainText('Create a New Challenge');
      
      // 3. Ottimo test: verifica che la sicurezza del form funzioni e che il bottone sia DISABILITATO di default
      const submitBtn = page.getByRole('button', { name: 'Submit Challenge' });
      await expect(submitBtn).toBeDisabled();
    });

    test('8. Should logout and clear the session', async ({ page }) => {
      await page.click('text=Logout');
      
      // I pulsanti protetti dovrebbero sparire, e dovrebbero tornare Login/Register
      await expect(page.getByText('Create Challenge')).not.toBeVisible();
      await expect(page.getByText('Login')).toBeVisible();
    });

    test('9. Should load the mission briefing for an existing challenge', async ({ page }) => {
      await page.goto(`${BASE_URL}/home`);
      
      // Clicca sul primo bottone "Solve" disponibile nella griglia
      await page.locator('text=Solve').first().click();
      
      // Verifica che la UI della pagina di risoluzione venga caricata
      await expect(page).toHaveURL(/.*solve\/\d+/);
      await expect(page.getByText('Mission Briefing')).toBeVisible();
      await expect(page.locator('#proposedRegex')).toBeVisible();
    });

    test('10. Should submit a regex and display the evaluation results', async ({ page }) => {
      await page.goto(`${BASE_URL}/home`);
      await page.locator('text=Solve').first().click();
      
      // Compila la soluzione
      await page.fill('#proposedRegex', '.*'); // Una regex base che matcha tutto
      await page.click('button[type="submit"]');
      
      // Aspetta che appaia il blocco dei risultati (sano o fallito)
      // Usiamo una RegEx nel locator per cercare il testo "Challenge Passed!" o "Tests Failed"
      await expect(page.locator('h3:has-text("Challenge Passed!"), h3:has-text("Tests Failed")')).toBeVisible();
      
      // Verifica che mostri la breakdown dei test
      await expect(page.getByText('Test Breakdown')).toBeVisible();
      await expect(page.getByText('Positive Strings Matched:')).toBeVisible();
    });
  });
});
