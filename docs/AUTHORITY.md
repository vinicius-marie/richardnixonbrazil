# Ledger de autoridade — 2026-09-08

Auditoria feita a partir de `git fetch origin`, não de SHA colado em prompt.

## Produção

- `origin/main`: `9ab69ca4c8eaf7ab7b6124c022369dfb34eb45b5`
- Mensagem: “Revê o artigo sobre Brasil e Estados Unidos”
- Site: [nixonbrazil.page](https://nixonbrazil.page)
- `editorial` está **idêntica** à `main` (ahead 0, behind 0)

## PR #28 — quarentena

- Branch: `audit/nixon-recovery-2026-09-08`
- Head: `513dcdac504d7e6f73c5e0a905b43d6625fe76e0`
- Base: `main` (merge-base = `origin/main`, behind 0, ahead 4)
- Estado: draft. **Não mesclar por atacado.**

Recuperado da PR #19, blobs originais, rotas **não** republicadas:

| Artefato | Classificação | Nota |
|---|---|---|
| Schemas `cronologia` / `discursos` / `pessoas` / `temas` / `galerias` | KEEP-AS-INFRASTRUCTURE | Só após segundo gate e sem enfraquecer o verificador |
| Campos opcionais `people` / `themes` em documentos | KEEP-AS-INFRASTRUCTURE | Relações futuras; inofensivos |
| `EditorialEntry.astro` | KEEP-AS-INFRASTRUCTURE | Componente para reativação futura |
| 10 itens de cronologia | KEEP-AS-RESEARCH-SEED | Adequados como índice, não como ensaio. `draft: false` hoje é prematuro; passar para `draft: true` + `editorialStatus: recovered` |
| 3 discursos | KEEP-AS-RESEARCH-SEED / NEEDS-EDITORIAL-EXPANSION | Comentário curto útil; tradução ainda “Original em inglês” |
| 4 pessoas | KEEP-AS-RESEARCH-SEED | Fichas de relevância, não biografias |
| 3 temas | KEEP-AS-RESEARCH-SEED | Definição de escopo; não publicar como dossiê completo |
| 1 galeria (China 1972) | NEEDS-PRIMARY-SOURCES | Capa Wikimedia/NARA ok; conjunto ainda insuficiente |
| Rotas públicas dessas coleções | DO-NOT-PUBLISH | `verify-site.mjs` deve continuar a bloquear |
| CMS dessas coleções | DO-NOT-PUBLISH | O verificador recusa labels Cronologia/Pessoas/Temas/Galerias |

### Cronologia — flags factuais

| Entrada | Juízo |
|---|---|
| 1913-01-09 nascimento | DOCUMENTED FACT (Nixon Library) |
| 1937-06-01 Direito | NEEDS-FACT-AUDIT: formatura em 1937 é fato; o dia 1º de junho parece placeholder |
| 1946-11-05 Câmara | DOCUMENTED FACT (eleição geral daquele dia) |
| 1952-11-04 vice | DOCUMENTED FACT (eleição) |
| 1968-11-05 presidência | DOCUMENTED FACT (301 votos eleitorais) |
| 1970-12-02 EPA | DOCUMENTED FACT (início de operação) |
| 1972-02-21 Pequim | DOCUMENTED FACT (chegada) |
| 1972-05-26 SALT I / ABM | DOCUMENTED FACT (assinatura em Moscou) |
| 1974-08-09 renúncia | DOCUMENTED FACT (eficácia; anúncio em 8/8) |
| 1994-04-22 morte | DOCUMENTED FACT |

Nenhum item recuperado foi tornado público nesta tarefa.

## Branches históricas vivas

Todas as `artigo/*` e `revisao/*` abaixo foram squash-merged (PRs #20–#26). O commit único de cada uma já está semanticamente na `main`. Diff da árvore contra `origin/main` só mostra atraso, não trabalho inédito.

| Branch | Tip | Ahead / behind | PR | Destino |
|---|---|---|---|---|
| `artigo/brasil-estados-unidos` | `eb93007` | 1 / 5 | #26 merged | arquivar e apagar |
| `artigo/china-1972` | `6c327c2` | 1 / 5 | #22 merged | arquivar e apagar |
| `artigo/eleicao-1968` | `52b18c4` | 1 / 5 | #25 merged | arquivar e apagar |
| `artigo/politica-ambiental` | `7ef6ffe` | 1 / 5 | #24 merged | arquivar e apagar |
| `artigo/salt-i` | `2d9b8be` | 1 / 5 | #23 merged | arquivar e apagar |
| `revisao/cms-institucional` | `38e0c24` | 1 / 6 | #21 merged | arquivar e apagar |
| `revisao/feed-e-repositorio` | `9de2f2e` | 1 / 7 | #20 merged | arquivar e apagar |
| `dependabot/npm_and_yarn/astro-7.2.9` | `820f34c` | 1 / 5 | #27 aberta | manter; rebasear depois |
| `editorial` | = main | 0 / 0 | — | manter |

Tags de arquivo propostas (não apagar a branch antes da tag):

- `archive/artigo-brasil-estados-unidos` → `eb93007`
- `archive/artigo-china-1972` → `6c327c2`
- `archive/artigo-eleicao-1968` → `52b18c4`
- `archive/artigo-politica-ambiental` → `7ef6ffe`
- `archive/artigo-salt-i` → `2d9b8be`
- `archive/revisao-cms-institucional` → `38e0c24`
- `archive/revisao-feed-e-repositorio` → `9de2f2e`

Não apagar nesta rodada. Só depois de a tag existir no remoto e de revisão humana.

## Correção factual desta tarefa

Em `src/content/paginas/brasil.md`, a advertência de Viron Vaky estava datada de **1971** e ligada ao documento FRUS E–10 d127.

d127 é o memorando Kissinger → Nixon de **15 de abril de 1970** (“FY-1970 Economic Assistance Program for Brazil”). A frase sobre alienar outros setores brasileiros está no memorando de cobertura de Vaky, citado nesse documento — não em 1971, e não em d128 (que trata da emenda Reuss / vendas militares).

A frase de Nixon de que o Brasil era “metade da América do Sul” está no memcon de 7 de dezembro de 1971 (d141). NSSM 67 é d120 (12 de julho de 1969). Esses dois pontos da página e do artigo já estavam corretos.

## O que esta branch deliberadamente não faz

- Não mescla a PR #28
- Não publica coleções recuperadas
- Não altera o limiar do verificador para passar rotas
- Não redesenha a homepage
- Não adiciona densidade falsa à home
- Não inventa “relação especial” Brasil–EUA
