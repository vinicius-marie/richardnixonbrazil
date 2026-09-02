import { access, readFile, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { extname, join } from 'node:path';

const requiredRoutes = [
  'dist/index.html',
  'dist/biografia/index.html',
  'dist/presidencia/index.html',
  'dist/politica-externa/index.html',
  'dist/brasil/index.html',
  'dist/acervo/index.html',
  'dist/artigos/index.html',
  'dist/sobre/index.html',
  'dist/assinar/index.html',
  'dist/404.html',
  'dist/rss.xml',
  'dist/sitemap.xml',
  'dist/robots.txt',
];

for (const route of requiredRoutes) {
  await access(route, constants.R_OK);
}

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  }));
  return nested.flat();
}

const [
  header,
  config,
  cms,
  pageSource,
  globalCss,
  homeCss,
  layout,
  workflow,
  contentConfig,
  articleNames,
  siteSettings,
] = await Promise.all([
  readFile('src/components/Header.astro', 'utf8'),
  readFile('astro.config.mjs', 'utf8'),
  readFile('.pages.yml', 'utf8'),
  readFile('src/pages/index.astro', 'utf8'),
  readFile('src/styles/global.css', 'utf8'),
  readFile('src/styles/home.css', 'utf8'),
  readFile('src/layouts/BaseLayout.astro', 'utf8'),
  readFile('.github/workflows/pages.yml', 'utf8'),
  readFile('src/content.config.ts', 'utf8'),
  readdir('src/content/artigos'),
  readFile('src/data/site.json', 'utf8'),
]);

if (!config.includes("site: 'https://nixonbrazil.page'")) {
  throw new Error('O domínio canônico não está definido no Astro.');
}

const desktopNav = header.indexOf('class="main-nav desktop-nav"');
const mobileMenu = header.indexOf('<details class="nav-menu">');
if (desktopNav < 0 || mobileMenu < 0 || desktopNav > mobileMenu || !header.includes('class="main-nav mobile-nav"')) {
  throw new Error('As navegações de desktop e celular devem ser independentes.');
}

if (!globalCss.includes('.desktop-nav { display: none; }') || !globalCss.includes('.nav-menu[open] .mobile-nav')) {
  throw new Error('Os estados responsivos do menu não estão definidos.');
}

const mobileHero = /@media \(max-width: 700px\)[\s\S]*?\.hero-media\s*\{[\s\S]*?position:\s*relative;/.test(homeCss);
if (!mobileHero || !homeCss.includes('.hero { min-height: 0; }')) {
  throw new Error('A fotografia e o texto do hero devem ocupar zonas separadas no celular.');
}

if (
  workflow.includes('workflow_dispatch:')
  || !workflow.includes("if: github.event_name == 'push' && github.ref == 'refs/heads/main'")
  || !workflow.includes('npm ci --ignore-scripts --no-audit --no-fund')
) {
  throw new Error('A publicação deve ocorrer exclusivamente após push na main.');
}

if (
  !layout.includes('"script-src \'self\'"')
  || layout.includes("'unsafe-inline'")
  || !layout.includes('<meta name="referrer" content="no-referrer"')
) {
  throw new Error('A política de conteúdo e referência não está endurecida.');
}

if (!contentConfig.includes('sourceUrl: httpsUrl') || !contentConfig.includes('originalUrl: httpsUrl')) {
  throw new Error('Links editoriais externos devem aceitar apenas HTTPS.');
}

if (!cms.includes('name: homePlacement') || !pageSource.includes("homePlacement === 'lead'")) {
  throw new Error('A posição dos artigos na página inicial não está ligada ao CMS.');
}

const parsedSiteSettings = JSON.parse(siteSettings);
if (!Array.isArray(parsedSiteSettings.navigation) || parsedSiteSettings.navigation.length < 4) {
  throw new Error('O menu editável do site está ausente ou vazio.');
}

const articleSources = await Promise.all(
  articleNames
    .filter((name) => extname(name) === '.md')
    .map((name) => readFile(join('src/content/artigos', name), 'utf8')),
);
const leadCount = articleSources.filter((source) => source.includes('homePlacement: "lead"')).length;
if (leadCount !== 1) {
  throw new Error(`A página inicial precisa de uma matéria principal; foram encontradas ${leadCount}.`);
}

for (const [index, name] of articleNames.filter((entry) => extname(entry) === '.md').entries()) {
  if (articleSources[index].includes('draft: false')) {
    await access(join('dist/artigos', name.replace(/\.md$/, ''), 'index.html'), constants.R_OK);
  }
}

const generatedFiles = await filesIn('dist');
const htmlFiles = generatedFiles.filter((file) => extname(file) === '.html');

if (htmlFiles.length !== 15) {
  throw new Error(`O build deveria gerar 15 páginas HTML; gerou ${htmlFiles.length}.`);
}

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');

  if (!/<title>[^<]+<\/title>/.test(html)) {
    throw new Error(`Página sem título: ${file}`);
  }
  if (!/<meta name="description" content="[^"]+">/.test(html)) {
    throw new Error(`Página sem descrição: ${file}`);
  }
  if (!/<link rel="canonical" href="https:\/\/nixonbrazil\.page\//.test(html)) {
    throw new Error(`URL canônica incorreta: ${file}`);
  }
  if (!html.includes('rel="alternate" type="application/rss+xml"') || html.includes('fonts.googleapis.com')) {
    throw new Error(`RSS ou política de fontes incorreta: ${file}`);
  }
  if (html.includes('viniciusdaniel-law.github.io/nixon-brasil')) {
    throw new Error(`Endereço antigo encontrado: ${file}`);
  }
  if (!html.includes('http-equiv="Content-Security-Policy"') || !html.includes('name="referrer" content="no-referrer"')) {
    throw new Error(`Política de segurança ausente: ${file}`);
  }
  if (/(?:href|src)="(?:javascript:|data:text\/html|http:)/i.test(html)) {
    throw new Error(`Protocolo inseguro encontrado: ${file}`);
  }

  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/\brel="[^"]*\bnoreferrer\b/.test(match[0])) {
      throw new Error(`Link externo sem noreferrer: ${file}`);
    }
  }

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]*"/.test(match[0])) {
      throw new Error(`Imagem sem texto alternativo: ${file}`);
    }
  }

  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    const [, attributes, body] = match;
    const isJsonLd = /type="application\/ld\+json"/.test(attributes);
    const hasSource = /\bsrc="[^"]+"/.test(attributes);
    if (!isJsonLd && !hasSource && body.trim()) {
      throw new Error(`JavaScript executável inline encontrado: ${file}`);
    }
  }

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith('/') || href.startsWith('//')) continue;

    const pathname = href.split(/[?#]/, 1)[0];
    const target = pathname === '/'
      ? 'dist/index.html'
      : pathname.endsWith('/')
        ? join('dist', pathname, 'index.html')
        : join('dist', pathname);

    await access(target, constants.R_OK).catch(() => {
      throw new Error(`Link interno sem destino em ${file}: ${href}`);
    });
  }
}

for (const route of ['videos', 'cronologia', 'discursos', 'pessoas', 'temas', 'galerias']) {
  if (generatedFiles.some((file) => file.startsWith(`dist/${route}/`))) {
    throw new Error(`Seção sem acervo suficiente foi publicada: ${route}.`);
  }
}

console.log(`Site verificado: ${htmlFiles.length} páginas, feed, metadados e navegação.`);
