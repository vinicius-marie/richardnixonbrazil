import { getCollection } from 'astro:content';

export async function GET({ site }: { site: URL }) {
  const base = import.meta.env.BASE_URL;
  const staticRoutes = ['', 'biografia/', 'presidencia/', 'politica-externa/', 'brasil/', 'acervo/', 'artigos/', 'sobre/', 'assinar/'];
  const articles = (await getCollection('artigos', ({ data }) => !data.draft))
    .sort((a, b) => a.id.localeCompare(b.id, 'pt-BR'));
  const urls = [
    ...staticRoutes.map((route) => new URL(`${base}${route}`, site).toString()),
    ...articles.map((article) => new URL(`${base}artigos/${article.id}/`, site).toString()),
  ];
  const body = urls.map((url) => `<url><loc>${url}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
