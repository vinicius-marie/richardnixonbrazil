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
  }),
});

export const collections = { artigos, documentos, paginas };
