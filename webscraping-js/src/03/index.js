import { chromium } from 'playwright';
import fs from 'fs';

// Desafio
  // 1 - Poder acessar a página do time que quiser mudando apenas uma variável
  // 2 - Poder dizer quantas noticias ao todo o código deve coletar
  //   a - Caso não tenha todas as noticias, o código deve parar e exibir uma mensagem informando isso no retorno do objeto `data`
  // 3 - Retornar uma mensagem informando um erro genérico caso o time pesquisado não exista no site.

//
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Navegação
  await page.goto('https://ge.globo.com/sp/santos-e-regiao/futebol/times/santos/');

  // Obter os dados
  const data = {
    url: null,
    title: null,
    noticias: [],
  };

  const div = await page.locator('#feed-placeholder > div > div > div._evg > div > div > div')
  
  const materias = await div.locator('div:has(div[data-type="materia"])').all();
  
  // `materias` contem todas as divs com as noticias.
  for (const materia of materias) {
    const materiaTitle = await materia.locator('h2 > a > p').textContent();
    const materiaUrl = await materia.locator('h2 > a').getAttribute('href');
    const descricao = (await materia.locator('ul.bstn-relateditems li a').allTextContents()).join(' | ')
    const dataMateria = await materia.locator('span.feed-post-datetime').first().textContent();

    data.noticias.push({
      title: materiaTitle,
      url: materiaUrl,
      descricao: descricao,
      data: dataMateria,
    });
  }

  data.url = page.url();
  data.title = await page.title();
  
  // Transformar em JSON e salvar
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync('./data.json', json, 'utf-8')

  console.log('Arquivo salvo');
  await browser.close();
})();