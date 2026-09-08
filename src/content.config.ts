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

const editorialStatus = z.enum([
  'recovered',
  'sourced',
  'fact_checked',
  'editorial_review',
  'publishable',
  'published',
]).optional();

const unpublishedStatuses = new Set([
  'recovered',
  'sourced',
  'fact_checked',
  'editorial_review',
]);

function rejectUnreadyPublication(entry: { draft: boolean; editorialStatus?: string }, context: { addIssue: (issue: { code: 'custom'; path: string[]; message: string }) => void }) {
  if (entry.draft === false && entry.editorialStatus && unpublishedStatuses.has(entry.editorialStatus)) {
    context.addIssue({
      code: 'custom',
      path: ['draft'],
      message: 'Entradas recovered/sourced/fact_checked/editorial_review não podem ser publicadas.',
    });
  }
}

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
    editorialStatus,
    draft: z.boolean().default(true),
  }).superRefine((article, context) => {
    if (article.cover && !article.coverAlt?.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['coverAlt'],
        message: 'Informe o texto alternativo da imagem.',
      });
    }
    rejectUnreadyPublication(article, context);
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
    editorialStatus,
    draft: z.boolean().default(true),
  }).superRefine(rejectUnreadyPublication),
});

const paginas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/paginas' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    description: z.string(),
    lede: z.string(),
    updatedAt: z.coerce.date(),
    editorialStatus,
    draft: z.boolean().default(false),
  }).superRefine(rejectUnreadyPublication),
});

export const collections = { artigos, documentos, paginas };
