import { chromium, firefox } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({headless: false});
  const context = await browser.newContext();

  const page = await context.newPage();

  // Interação com a página
  await page.goto('https://playwright.dev/docs/intro')

  // Seletores que nos ajudarão
  const ul = await page.locator('h2#system-requirements + ul');

  // Obter o texto dos elementos

  const listItems = await ul.locator('li').all();

  const data = {
    system_requirements: [],
  }
  
  for (const li of listItems) {
    const text = await li.textContent();
    data.system_requirements.push(text);
  }

  // Transformar em JSON e salvar
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync('./data.json', json, 'utf-8')

  console.log('Arquivo salvo');

  await browser.close();
  
})();