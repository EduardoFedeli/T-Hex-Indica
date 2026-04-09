import * as cheerio from 'cheerio'

export interface ScraperResult {
  nome: string
  preco: number
  preco_original: number | null
  imagem: string
}

// Cabeçalhos agressivos
const HEADERS_NAVEGADOR = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Cache-Control': 'max-age=0'
}

// O Disfarce: Simulamos ser o bot de preview do Facebook/WhatsApp
const HEADERS_SOCIAL_BOT = {
  'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  'Accept': 'text/html',
}

function extrairPrecoAmazon($: cheerio.CheerioAPI): { preco: number; preco_original: number | null } {
  let preco = 0
  let preco_original: number | null = null

  const whole = $('.priceToPay .a-price-whole').first().text().trim().replace(/[^\d]/g, '')
  const frac = $('.priceToPay .a-price-fraction').first().text().trim().replace(/[^\d]/g, '') || '00'
  if (whole) preco = parseFloat(`${whole}.${frac}`)

  if (!preco) {
    const apexStr = $('#corePrice_desktop .a-offscreen, #corePrice_feature_div .a-offscreen').first().text().trim()
    if (apexStr) preco = parseFloat(apexStr.replace(/[^\d,]/g, '').replace(',', '.'))
  }

  const origStr = $('span.a-price.a-text-price[data-a-strike="true"] span.a-offscreen').first().text().trim() || $('#listPrice').text().trim()
  if (origStr) {
    const parsed = parseFloat(origStr.replace(/[^\d,]/g, '').replace(',', '.'))
    if (!isNaN(parsed) && parsed > preco) preco_original = parsed
  }

  return { preco, preco_original }
}

export async function rasparProduto(url: string): Promise<ScraperResult> {
  let urlFinal = url;
  let idMlb: string | null = null;

  // 1. BYPASS DE REDES DE AFILIADOS (LinkSynergy / Rakuten)
  if (url.includes('linksynergy.com') && url.includes('murl=')) {
    try {
      const urlObj = new URL(url);
      const murl = urlObj.searchParams.get('murl');
      if (murl) urlFinal = decodeURIComponent(murl);
    } catch (e) {}
  }

  // 2. MERCADO LIVRE (Vitrine Social + API)
  if (urlFinal.includes('meli.la') || urlFinal.includes('mercadolivre.com')) {
    try {
      const response = await fetch(urlFinal, { redirect: 'follow', headers: HEADERS_NAVEGADOR });
      let mlbMatch = response.url.match(/MLB[-_]?(\d+)/i);
      
      if (!mlbMatch && response.url.includes('/social/')) {
        const htmlSocial = await response.text();
        mlbMatch = htmlSocial.match(/MLB(?:[-_]|%2D)?(\d+)/i);
      }
      if (mlbMatch) idMlb = `MLB${mlbMatch[1]}`;
    } catch (error) {}

    if (idMlb) {
      try {
        const apiRes = await fetch(`https://api.mercadolibre.com/items/${idMlb}`);
        if (apiRes.ok) {
          const data = await apiRes.json();
          return {
            nome: data.title,
            preco: data.price,
            preco_original: data.original_price || null,
            imagem: data.pictures?.length > 0 ? data.pictures[0].secure_url : data.thumbnail
          };
        }
      } catch (e) {}
    }
  }

  // 3. FETCH ÚNICO E BLINDADO (Resolve tudo numa cajadada só)
  let res: Response | null = null;
  let html = '';

  try {
    // Tenta primeiro como navegador normal e segue a URL (resolve os encurtadores amzn.to, s.shopee automaticamente)
    res = await fetch(urlFinal, { redirect: 'follow', headers: HEADERS_NAVEGADOR });
    
    // Shopee frequentemente retorna 403, 405 ou 503 para bots.
    if (!res.ok || res.status === 403 || res.status === 503 || res.status === 405) {
      console.log(`[SCRAPER] Bloqueio detectado (${res.status}). Vestindo disfarce de Social Bot...`);
      res = await fetch(urlFinal, { redirect: 'follow', headers: HEADERS_SOCIAL_BOT });
    }
    
    urlFinal = res.url; // Atualiza para a URL real redirecionada
    html = await res.text();
  } catch (error) {
    console.error('[SCRAPER] Falha de rede HTTP:', error);
  }

  const $ = cheerio.load(html);
  
  let nome = '';
  let imagem = '';
  let preco = 0;
  let preco_original: number | null = null;

  if (urlFinal.includes('amazon') || urlFinal.includes('amzn')) {
    nome = $('#productTitle').text().trim() || $('meta[property="og:title"]').attr('content') || '';
    imagem = $('#landingImage').attr('src') || $('#imgBlkFront').attr('src') || $('meta[property="og:image"]').attr('content') || '';
    const precos = extrairPrecoAmazon($);
    preco = precos.preco;
    preco_original = precos.preco_original;
    
  } else if (urlFinal.includes('magazineluiza.com') || urlFinal.includes('magalu')) {
    nome = $('h1[data-testid="heading-product-title"]').text().trim() || $('meta[property="og:title"]').attr('content') || '';
    imagem = $('meta[property="og:image"]').attr('content') || '';
    
    const precoStr = $('[data-testid="price-value"]').first().text().replace(/[^\d,]/g, '').replace(',', '.');
    let precoOrigStr = $('[data-testid="price-original"]').first().text().replace(/[^\d,]/g, '').replace(',', '.');
    if (!precoOrigStr) precoOrigStr = $('s').first().text().replace(/[^\d,]/g, '').replace(',', '.');
    
    if (precoStr) preco = parseFloat(precoStr);
    if (precoOrigStr) {
      const pOrig = parseFloat(precoOrigStr);
      if (pOrig > preco) preco_original = pOrig;
    }

  } else if (urlFinal.includes('netshoes.com')) {
    nome = $('title').text().split('|')[0].trim() || $('meta[property="og:title"]').attr('content') || '';
    imagem = $('meta[property="og:image"]').attr('content') || '';
    const precoStr = $('.default-price span strong').first().text().replace(/[^\d,]/g, '').replace(',', '.');
    if (precoStr) preco = parseFloat(precoStr);
    
  } else if (urlFinal.includes('shopee.')) {
    // Shopee Fallbacks: tenta raspar as meta-tags injetadas
    nome = $('title').text().replace(' | Shopee Brasil', '').trim() || $('meta[property="og:title"]').attr('content') || $('meta[name="twitter:title"]').attr('content') || '';
    imagem = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content') || '';
    
    // As vezes a Shopee injeta o preço em meta tags, se não vier, o preço será zero.
    const priceMeta = $('meta[name="twitter:data1"]').attr('content') || $('meta[property="product:price:amount"]').attr('content');
    if (priceMeta) preco = parseFloat(priceMeta.replace(/[^\d,]/g, '').replace(',', '.'));
  }

  // 4. FALLBACK EXTREMAMENTE AGRESSIVO PARA NOME E IMAGEM
  if (!nome) {
    nome = $('meta[property="og:title"]').attr('content') || $('meta[name="twitter:title"]').attr('content') || $('title').text().trim() || '';
  }
  if (!imagem) {
    imagem = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content') || $('link[rel="image_src"]').attr('href') || '';
  }

  if (!nome && !imagem) {
    console.warn(`[SCRAPER HÍBRIDO] Falha crítica em: ${urlFinal}.`);
  }

  return { 
    nome: nome || '', 
    preco: preco || 0, 
    preco_original: preco_original || null, 
    imagem: imagem || '' 
  };
}