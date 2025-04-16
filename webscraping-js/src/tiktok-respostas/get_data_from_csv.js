// Obeter dados de um csv/planilha excel e incrementar parâmetros na extração de dados.
import { chromium } from 'playwright';
import xlsx from 'xlsx';

// carrega a planilha
const planilha = xlsx.readFile('./src/tiktok-respostas/service-tags.xlsx');

// Seleciona a primeira aba da planilha
const aba = planilha.Sheets[planilha.SheetNames[0]];

// Converte os dados em um array de objetos
const data = xlsx.utils.sheet_to_json(aba, { header: 1 });

// Supondo que a primeira linha contém os cabeçalhos
// remove o cabeçalho com slice(1)
// data.slice(1);

// trim(removee espaços em branco)
const tags = data.map(row => row[0].trim()).filter(Boolean); // Remove linhas vazias

const specs = {
  specs: []
};

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--disable-web-security',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();

  await page.goto('https://www.google.com.br/?hl=pt-BR');
  for (const tag of tags) {
    await page.goto(`https://www.dell.com/support/home/pt-br?app=drivers`)

    await page.locator('#inpEntrySelection').fill(tag, { delay: 100 } );

    await page.locator('#txtSearchEs').click();

    await page.locator('span').filter({ hasText: 'Visão geral' } ).first().click();

    await page.locator('div#dep_quick_links_xl').first().waitFor( {state: 'visible' });
    await page.locator('div#dep_quick_links_xl').first().click();

    await page.locator('div:has(a#review-specs-drawer-trigger)').first().waitFor( {state: 'visible' } );
    await page.locator('div:has(a#review-specs-drawer-trigger) > a').filter({hasText: 'Ver especificações do produto' } ).last().click();

    await page.locator('button#dep_original_config_tab:has(span[title="Original Configuration Tab"])').waitFor( {state: 'visible' } );
    
    const divSpecs = await page.locator('#dep_original_config_accordion')
    

    const divs = await divSpecs.locator('div:has(h5)').all();
    const tagSpecs = {
      tag: tag,
      specs: [],
    }
    for (const div of divs) {
      const title = await div.locator('h5').textContent();
      const spans = await div.locator('div.dds__tbody > div.dds__tr div span.dds__table__cell').all()

      const textPromises = spans.map(t => t.textContent());

      const text = await Promise.all(textPromises);

      tagSpecs.specs.push({
        titulo: title.trim(),
        numero_peca: text[0],
        descricao: text[1],
        quantidade: text[2],

      })
    }

    specs.specs.push(tagSpecs);
  }

  console.log(specs.specs[0]);

  await browser.close()
  
})();