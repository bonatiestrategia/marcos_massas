/* ============================================================================
   verificar.mjs — rodada de inspeção em lote. Desktop e mobile num render só.
   Uso:  node blocos/verificar.mjs modelos/01-massa-viva/index.html
   Saída: JSON no stdout + capturas em .verificacao/<modelo>/

   Uma rodada mostra tudo. Corrija tudo o que ela apontar de uma vez, rode no
   máximo mais uma vez para confirmar, e pare.
   ========================================================================== */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { resolve, basename, dirname } from 'node:path';

const alvo = process.argv[2];
if (!alvo) { console.error('uso: node blocos/verificar.mjs <caminho/index.html>'); process.exit(1); }

const caminho = resolve(alvo);
const nome = basename(dirname(caminho));
const saida = resolve('.verificacao', nome);
mkdirSync(saida, { recursive: true });

const VIEWPORTS = [
  { id: 'desktop', width: 1440, height: 900 },
  { id: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
];

const navegador = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const relatorio = { modelo: nome, arquivo: alvo, viewports: {}, problemas: [] };
const prob = (nivel, viewport, msg) => relatorio.problemas.push({ nivel, viewport, msg });

for (const vp of VIEWPORTS) {
  const ctx = await navegador.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor || 1,
    isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch,
    locale: 'pt-BR'
  });
  const page = await ctx.newPage();
  const erros = [];
  page.on('console', m => { if (m.type() === 'error') erros.push('console: ' + m.text().slice(0, 200)); });
  page.on('pageerror', e => erros.push('pageerror: ' + String(e).slice(0, 200)));

  await page.goto('file://' + caminho, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo({ top: 200, behavior: 'instant' }));
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(1800);

  const r = await page.evaluate(() => {
    const res = {};
    const doc = document.documentElement;

    /* --- medição ------------------------------------------------------- */
    res.dataLayerExiste = Array.isArray(window.dataLayer);
    res.eventosIniciais = (window.dataLayer || []).map(x => x && x.event).filter(Boolean);
    res.metaSearchConsole = !!document.querySelector('meta[name="google-site-verification"]');
    res.noscriptGtm = !!document.querySelector('noscript');
    const html = doc.outerHTML;
    const iConsent = html.indexOf("'consent', 'default'") >= 0 ? html.indexOf("'consent', 'default'") : html.indexOf('"consent"');
    const iGtmSrc = html.indexOf('googletagmanager.com/gtm.js');
    res.consentAntesDoGtm = iConsent > -1 && iGtmSrc > -1 && iConsent < iGtmSrc;
    res.modoSemGtmComentado = !document.querySelector('script[src*="gtag/js"]') && !document.querySelector('script[src*="clarity.ms"]');

    /* --- overflow horizontal ---------------------------------------------
       Medido com overflow-x do body DESLIGADO. Muitas páginas usam
       `body { overflow-x: hidden }` como rede de segurança, e ela mascara um
       estouro real: o conteúdo é cortado em silêncio em vez de aparecer. Aqui
       a rede fica, mas a medição enxerga através dela. */
    const guardaOriginal = document.body.style.overflowX;
    document.body.style.overflowX = 'visible';
    res.larguraDoc = doc.scrollWidth;
    res.larguraJanela = window.innerWidth;
    res.overflowH = doc.scrollWidth > window.innerWidth + 1;
    res.culpadosOverflow = [];
    if (res.overflowH) {
      for (const el of document.querySelectorAll('body *')) {
        const b = el.getBoundingClientRect();
        if (b.width > 0 && b.right > window.innerWidth + 1) {
          res.culpadosOverflow.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : '') + ' right=' + Math.round(b.right));
          if (res.culpadosOverflow.length >= 6) break;
        }
      }
    }

    document.body.style.overflowX = guardaOriginal;

    /* --- alvos de toque -------------------------------------------------- */
    res.alvosPequenos = [];
    for (const el of document.querySelectorAll('a[href], button, input, select, textarea, [role="button"]')) {
      const b = el.getBoundingClientRect();
      if (b.width === 0 && b.height === 0) continue;
      if (b.width < 44 || b.height < 44) {
        res.alvosPequenos.push({
          el: el.tagName.toLowerCase(),
          texto: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40),
          w: Math.round(b.width), h: Math.round(b.height)
        });
      }
    }

    /* --- contraste ------------------------------------------------------- */
    const lum = ([r, g, b]) => {
      const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const parse = s => { const m = (s || '').match(/[\d.]+/g); return m ? m.slice(0, 4).map(Number) : null; };
    const fundoDe = el => {
      let n = el;
      while (n && n !== document.documentElement) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c && (c[3] === undefined || c[3] > 0.85)) return c;
        n = n.parentElement;
      }
      return [255, 255, 255];
    };
    res.contrasteFalhas = [];
    const vistos = new Set();
    for (const el of document.querySelectorAll('p,li,a,span,td,th,h1,h2,h3,h4,h5,h6,label,button,dt,dd,summary,figcaption,small,strong,em,input,select,textarea')) {
      const txt = (el.textContent || '').trim();
      if (!txt || txt.length < 3) continue;
      if (el.querySelector('p,li,h1,h2,h3,h4,span,a')) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      const fg = parse(cs.color); if (!fg) continue;
      const bg = fundoDe(el);
      const l1 = lum(fg), l2 = lum(bg);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const px = parseFloat(cs.fontSize);
      const grande = px >= 24 || (px >= 18.66 && +cs.fontWeight >= 700);
      const minimo = grande ? 3 : 4.5;
      if (ratio < minimo) {
        const chave = cs.color + '|' + bg.join(',') + '|' + Math.round(px);
        if (vistos.has(chave)) continue;
        vistos.add(chave);
        res.contrasteFalhas.push({
          texto: txt.slice(0, 46), cor: cs.color, fundo: 'rgb(' + bg.slice(0, 3).join(',') + ')',
          px: Math.round(px), ratio: +ratio.toFixed(2), minimo
        });
      }
    }

    /* --- botão flutuante -------------------------------------------------- */
    const wa = document.getElementById('mm-wa');
    res.wa = { existe: !!wa };
    if (wa) {
      const cs = getComputedStyle(wa);
      const b = wa.getBoundingClientRect();
      res.wa.position = cs.position;
      res.wa.direita = Math.round(window.innerWidth - b.right);
      res.wa.baixo = Math.round(window.innerHeight - b.bottom);
      res.wa.tamanho = { w: Math.round(b.width), h: Math.round(b.height) };
      res.wa.ariaLabel = wa.getAttribute('aria-label') || '';
      res.wa.href = wa.getAttribute('href') || '';
      res.wa.dataWa = wa.getAttribute('data-wa') || '';
      res.wa.visivel = +cs.opacity > 0.5;
    }

    /* --- links de whatsapp e formulário ----------------------------------- */
    res.origensWa = [...document.querySelectorAll('[data-wa]')].map(e => e.getAttribute('data-wa'));
    res.temFormOrcamento = !!document.querySelector('[data-form-orcamento]');
    res.temFormNaPagina = !!document.querySelector('form');
    res.temRodapeComEspaco = !!document.querySelector('.mm-rodape');

    /* --- placeholders visíveis -------------------------------------------- */
    res.placeholders = [...new Set((document.body.innerText.match(/\[[A-Z_]+\]/g) || []))];
    return res;
  });

  /* --- o botão cobre o fim da página? ---------------------------------- */
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await page.waitForFunction(() => Math.abs((window.scrollY + window.innerHeight) - document.documentElement.scrollHeight) < 4, null, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(400);
  r.waCobre = await page.evaluate(() => {
    const wa = document.getElementById('mm-wa');
    if (!wa) return null;
    const b = wa.getBoundingClientRect();
    const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    const vis = wa.style.visibility; wa.style.visibility = 'hidden';
    const pontos = [[cx, cy], [b.left + 4, b.top + 4], [b.right - 4, b.bottom - 4]];
    const achados = [];
    for (const [x, y] of pontos) {
      const el = document.elementFromPoint(x, y);
      if (!el) continue;
      const interativo = el.closest('a[href],button,input,select,textarea,label');
      const txt = (el.textContent || '').trim();
      if (interativo) achados.push('INTERATIVO: ' + interativo.tagName.toLowerCase() + ' "' + (interativo.textContent || '').trim().slice(0, 40) + '"');
      else if (txt && el !== document.body && getComputedStyle(el).fontSize) {
        const direto = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        if (direto) achados.push('TEXTO: "' + txt.slice(0, 40) + '"');
      }
    }
    wa.style.visibility = vis;
    return [...new Set(achados)];
  });

  /* --- clique programático: o dataLayer recebe? ------------------------- */
  r.dataLayerAposClique = await page.evaluate(() => {
    const wa = document.getElementById('mm-wa');
    if (!wa) return null;
    const bloq = e => { e.preventDefault(); };
    document.addEventListener('click', bloq, true);
    wa.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    document.removeEventListener('click', bloq, true);
    const ev = (window.dataLayer || []).filter(x => x && x.event === 'whatsapp_click');
    return ev.length ? { total: ev.length, ultimo: ev[ev.length - 1] } : null;
  });

  /* --- o formulário perde o lead em silêncio? --------------------------- */
  try {
  r.formHonesto = await page.evaluate(async () => {
    const form = document.querySelector('[data-form-orcamento]');
    if (!form) return null;
    const temAction = !!(form.getAttribute('action') || '').trim();
    for (const c of form.querySelectorAll('input,select,textarea')) {
      if (c.type === 'tel') c.value = '11999999999';
      else if (c.tagName === 'SELECT') { const o = c.querySelector('option[value]:not([value=""])') || c.options[1]; if (o) c.value = o.value; }
      else if (c.type !== 'hidden') c.value = 'teste';
      c.dispatchEvent(new Event('input', { bubbles: true }));
    }
    let navegou = false;
    const guarda = e => { navegou = true; e.preventDefault(); };
    window.addEventListener('beforeunload', guarda);
    const antes = (window.dataLayer || []).filter(x => x && x.event === 'form_submit').length;
    if (typeof form.requestSubmit === 'function') form.requestSubmit();
    else form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await new Promise(res => setTimeout(res, 250));
    window.removeEventListener('beforeunload', guarda);
    const depois = (window.dataLayer || []).filter(x => x && x.event === 'form_submit').length;
    const aviso = [...document.querySelectorAll('[role="status"],[role="alert"],[aria-live]')]
      .filter(el => !el.hidden && el.offsetParent !== null && (el.textContent || '').trim().length > 10)
      .map(el => (el.textContent || '').trim().slice(0, 120));
    return { temAction, navegou, eventoSubmit: depois > antes, aviso };
  });
  } catch (err) {
    /* O contexto morrer aqui significa que o envio NAVEGOU de verdade: sem
       preventDefault e sem action, o contato se perde e a página recarrega. */
    r.formHonesto = { temAction: false, navegou: true, eventoSubmit: false, aviso: [], erro: String(err).slice(0, 120) };
    await page.goto('file://' + caminho, { waitUntil: 'load' });
    await page.waitForTimeout(1800);
  }

  /* --- capturas ---------------------------------------------------------- */
  await page.screenshot({ path: `${saida}/${vp.id}-fim.png` });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${saida}/${vp.id}-dobra.png` });
  await page.screenshot({ path: `${saida}/${vp.id}-completa.png`, fullPage: true });

  r.erros = erros;
  relatorio.viewports[vp.id] = r;

  /* --- triagem ----------------------------------------------------------- */
  if (erros.length) prob('erro', vp.id, `${erros.length} erro(s) de console/página: ${erros.slice(0, 3).join(' | ')}`);
  if (r.overflowH) prob('erro', vp.id, `scroll horizontal (${r.larguraDoc}px > ${r.larguraJanela}px). Culpados: ${r.culpadosOverflow.join(', ')}`);
  if (r.contrasteFalhas.length) prob('erro', vp.id, `${r.contrasteFalhas.length} combinação(ões) de contraste abaixo do mínimo: ` + r.contrasteFalhas.map(f => `"${f.texto}" ${f.ratio}:1 (min ${f.minimo}) ${f.cor} sobre ${f.fundo}`).join(' | '));
  if (vp.id === 'mobile' && r.alvosPequenos.length) prob('aviso', vp.id, `${r.alvosPequenos.length} alvo(s) abaixo de 44px: ` + r.alvosPequenos.slice(0, 5).map(a => `${a.el} "${a.texto}" ${a.w}x${a.h}`).join(', '));
  if (!r.wa.existe) prob('erro', vp.id, 'botão flutuante #mm-wa ausente');
  else {
    if (r.wa.position !== 'fixed') prob('erro', vp.id, 'botão flutuante não está fixed');
    if (!r.wa.visivel) prob('erro', vp.id, 'botão flutuante permaneceu invisível depois do scroll');
    if (r.wa.tamanho.h < 44 || r.wa.tamanho.w < 44) prob('erro', vp.id, `botão flutuante pequeno: ${r.wa.tamanho.w}x${r.wa.tamanho.h}`);
    if (!r.wa.ariaLabel) prob('erro', vp.id, 'botão flutuante sem aria-label');
    if (!/wa\.me\//.test(r.wa.href)) prob('erro', vp.id, 'botão flutuante sem href wa.me');
    if (r.wa.direita > 40 || r.wa.baixo > 40) prob('aviso', vp.id, `botão flutuante distante do canto (dir ${r.wa.direita}px, baixo ${r.wa.baixo}px)`);
  }
  if (r.waCobre && r.waCobre.length) prob('erro', vp.id, 'botão flutuante cobre conteúdo no fim da página: ' + r.waCobre.join(' | '));
  if (!r.dataLayerAposClique) prob('erro', vp.id, 'clique no botão flutuante não empurrou whatsapp_click para o dataLayer');
  else if (r.dataLayerAposClique.ultimo.origem !== 'flutuante') prob('erro', vp.id, `whatsapp_click com origem errada: ${r.dataLayerAposClique.ultimo.origem}`);
  if (!r.dataLayerExiste) prob('erro', vp.id, 'window.dataLayer não existe');
  if (!r.metaSearchConsole) prob('erro', vp.id, 'meta google-site-verification ausente');
  if (!r.noscriptGtm) prob('erro', vp.id, 'noscript do GTM ausente');
  if (!r.consentAntesDoGtm) prob('erro', vp.id, 'Consent Mode não aparece antes do carregador do GTM');
  if (!r.modoSemGtmComentado) prob('erro', vp.id, 'bloco "modo sem GTM" está ativo — risco de contagem dupla');
  /* O formulário é opcional: páginas WhatsApp-first legitimamente não têm um.
     O que não se aceita é um <form> existir e perder o contato em silêncio. */
  if (r.temFormNaPagina && !r.temFormOrcamento)
    prob('erro', vp.id, 'existe <form> na página mas sem data-form-orcamento — o envio não é medido');
  if (r.formHonesto) {
    if (r.formHonesto.navegou && !r.formHonesto.temAction)
      prob('erro', vp.id, 'enviar o formulário RECARREGA a página sem destino — o contato se perde em silêncio');
    if (!r.formHonesto.temAction && !r.formHonesto.aviso.length)
      prob('erro', vp.id, 'formulário sem destino E sem aviso ao enviar — o contato se perde em silêncio');
    if (!r.formHonesto.eventoSubmit)
      prob('erro', vp.id, 'envio válido do formulário não empurrou form_submit para o dataLayer');
  }
  if (!r.temRodapeComEspaco) prob('erro', vp.id, 'nenhum elemento com a classe mm-rodape — o botão vai cobrir o fim da página');

  await ctx.close();
}

await navegador.close();
relatorio.resumo = {
  erros: relatorio.problemas.filter(p => p.nivel === 'erro').length,
  avisos: relatorio.problemas.filter(p => p.nivel === 'aviso').length,
  capturas: saida
};
console.log(JSON.stringify(relatorio, null, 2));
process.exit(relatorio.resumo.erros > 0 ? 1 : 0);
