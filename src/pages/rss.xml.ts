import { getCollection } from 'astro:content';

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

export async function GET({ site }: { site: URL }) {
  const base = import.meta.env.BASE_URL;
  const articles = (await getCollection('artigos', ({ data }) => !data.draft))
    .sort((a, b) => (
      b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
      || a.id.localeCompare(b.id, 'pt-BR')
    ));

  const items = articles.map((article) => {
    const link = new URL(`${base}artigos/${article.id}/`, site).toString();
    return `<item><title>${escapeXml(article.data.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${article.data.publishedAt.toUTCString()}</pubDate><description>${escapeXml(article.data.description)}</description></item>`;
  }).join('');

  const home = new URL(base, site).toString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>nixonbrazil</title><link>${home}</link><description>Richard Nixon em português</description><language>pt-BR</language>${items}</channel></rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
