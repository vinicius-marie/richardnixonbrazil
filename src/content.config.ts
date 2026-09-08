import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const httpsUrl = z.url().refine((value) => new URL(value).protocol === 'https:', {
  message: 'Use uma URL HTTPS.',
});

const imageSource = z.string().refine((value) => {
  if (value.startsWith('/uploads/')) {
    return !value.includes('\\') && !value.split('/').includes('..');
  }

  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:'
      && ['commons.wikimedia.org', 'upload.wikimedia.org'].includes(url.hostname)
    );
  } catch {
    return false;
  }
}, {
  message: 'Use uma imagem da Wikimedia ou um arquivo de /uploads/.',
});

const artigos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/artigos' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string().default('nixonbrazil'),
    category: z.enum([
      'Biografia',
      'Presidência',
      'Política externa',
      'Nixon e o Brasil',
      'Discursos',
      'Acervo',
    ]),
    cover: imageSource.optional(),
    coverAlt: z.string().optional(),
    coverCredit: z.string().optional(),
    coverRights: z.string().optional(),
    sourceUrl: httpsUrl.optional(),
    sources: z.array(httpsUrl).default([]),
    homePlacement: z.enum(['lead', 'rail', 'none']).default('none'),
    draft: z.boolean().default(true),
  }).superRefine((article, context) => {
    if (article.cover && !article.coverAlt?.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['coverAlt'],
        message: 'Informe o texto alternativo da imagem.',
      });
    }
  }),
});

const documentos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/documentos' }),
  schema: z.object({
    title: z.string(),
    originalTitle: z.string().optional(),
    date: z.coerce.date(),
    format: z.enum([
      'Memorando',
      'Discurso',
      'Comunicado',
      'Tratado',
      'Coleção',
      'Página institucional',
      'Fotografia',
      'Gravação',
      'Vídeo',
      'Lei',
    ]),
    category: z.enum(['Biografia', 'Presidência', 'Política externa', 'Nixon e o Brasil']),
    archive: z.string().optional(),
    reference: z.string().optional(),
    originalUrl: httpsUrl,
    translationStatus: z.enum([
      'Original em inglês',
      'Tradução em preparação',
      'Tradução editorial publicada',
    ]).default('Original em inglês'),
    description: z.string().optional(),
    sources: z.array(httpsUrl).default([]),
    people: z.array(z.string()).default([]),
    themes: z.array(z.string()).default([]),
    draft: z.boolean().default(true),
  }),
});

const paginas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/paginas' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    description: z.string(),
    lede: z.string(),
    updatedAt: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const cronologia = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cronologia' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
    summary: z.string(),
    category: z.enum(['Biografia', 'Campanhas', 'Presidência', 'Política externa', 'Pós-Presidência']),
    sourceUrl: httpsUrl,
    draft: z.boolean().default(true),
  }),
});

const discursos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/discursos' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    occasion: z.string(),
    description: z.string(),
    originalUrl: httpsUrl,
    translationStatus: z.enum(['Original em inglês', 'Tradução em preparação', 'Tradução editorial publicada']),
    draft: z.boolean().default(true),
  }),
});

const pessoas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pessoas' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    lifespan: z.string().optional(),
    description: z.string(),
    cover: imageSource.optional(),
    coverAlt: z.string().optional(),
    sourceUrl: httpsUrl,
    draft: z.boolean().default(true),
  }).superRefine((person, context) => {
    if (person.cover && !person.coverAlt?.trim()) {
      context.addIssue({ code: 'custom', path: ['coverAlt'], message: 'Informe o texto alternativo da imagem.' });
    }
  }),
});

const temas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/temas' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    sourceUrl: httpsUrl,
    draft: z.boolean().default(true),
  }),
});

const galerias = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/galerias' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    cover: imageSource,
    coverAlt: z.string(),
    coverCredit: z.string(),
    sourceUrl: httpsUrl,
    draft: z.boolean().default(true),
  }),
});

export const collections = {
  artigos,
  documentos,
  paginas,
  cronologia,
  discursos,
  pessoas,
  temas,
  galerias,
};
