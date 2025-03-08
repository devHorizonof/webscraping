// Importar o playwright
import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();

    const page = await context.newPage();

    // Iniciar a navegação
    await page.goto('https://www.google.com')

    await page.goto('https://playwright.dev/docs/intro')

    // Aguarda o fechamento do browser
    // await browser.close();
})();