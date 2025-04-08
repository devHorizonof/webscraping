import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://g1.globo.com/?utm_source=globo.com&utm_medium=header')
  
  const div = await page.locator('#glb-main-home > div:nth-child(5) > div > div > div > div > div:nth-child(1) > div > a > ul > li.bstn-hl-itemlist.bstn-hl-mainitem > div > div > span').innerText();

  // .textContent(); -> Pega o texto dentro de um elemento HTML
  // .innerText(); -> Pega o texto visível dentro de um elemento HTML -> Visível ná página para o usuário
  console.log(div);
  
})();