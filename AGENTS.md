# AGENTS.md — autoridade do repositório

Este documento vale para qualquer agente (humano ou automático) que altere o nixonbrazil.
Nomes de branch **não** são evidência de estado atual.

## Autoridade

| Papel | Branch | Pode publicar? |
|---|---|---|
| Produção | `main` | Sim. Única origem do site público. |
| CMS editorial | `editorial` | Não. Só edição de conteúdo; entra na `main` por PR. |
| Recuperação quarentenada | `audit/nixon-recovery-2026-09-08` (PR #28) | Não. Inventário, não site. |
| Trabalho corrente | branch nova a partir de `origin/main` | Não, até o merge. |

**Nunca** usar como base de execução, só porque o nome parece relevante:

- `artigo/*`
- `revisao/*`
- `copilot/*`
- `redesign/*`
- `rebuild/*`
- `recovery/*`
- `feature/*`
- `agent/*`

Essas branches históricas estão **superadas** por squash-merges nas PRs #3–#26. O conteúdo útil já está na `main` ou, no caso da PR #19, na quarentena da PR #28.

Não apagar `main`, `editorial`, `audit/nixon-recovery-2026-09-08` nem branches Dependabot com PR aberta.

## Preflight obrigatório

Antes de qualquer alteração:

1. `git fetch origin --prune`
2. Resolver o SHA de `origin/main` (não confiar em SHA colado em prompt)
3. Inspecionar PRs abertas
4. Criar **uma** branch nova **diretamente** de `origin/main`
5. Verificar:
   - `merge-base(HEAD, origin/main) == origin/main`
   - `behind main == 0`
6. Se a verificação falhar: **parar**. Não “continuar a branch que parece mais próxima”.

O script `scripts/check-branch-authority.mjs` reproduz esse teste no CI. Não enfraquecer o teste para fazer uma PR passar.

## Publicação

- Só `main` dispara deploy (GitHub Pages).
- `npm run build` = `astro check` + `astro build` + `scripts/verify-site.mjs`.
- Não mesclar sem CI verde.
- Não fazer force-push em `main`.
- Não publicar `cronologia`, `discursos`, `pessoas`, `temas` ou `galerias` sem segundo gate editorial explícito.
- Não enfraquecer `scripts/verify-site.mjs` para tornar uma rota recuperada compilável.

## Identidade pública

Marca: **nixonbrazil**. Não renomear para “Arquivo Nixon”, “Cadernos 37” ou equivalente.
Língua: português. Registro: publicação histórica independente / arquivo presidencial compacto. Não é órgão oficial, advocacia nem enciclopédia genérica.

## Conteúdo histórico

Estados de maturidade (campo opcional `editorialStatus`):

`recovered` → `sourced` → `fact_checked` → `editorial_review` → `publishable` → `published`

`draft: true` continua sendo a trava de publicação. Entradas com `editorialStatus` em `recovered`, `sourced`, `fact_checked` ou `editorial_review` **não** podem ter `draft: false`.

Arquivos antigos sem o campo permanecem válidos (legado). Não migrar o corpus só para preencher o enum.

Fontes, nesta ordem: arquivo primário (Nixon Library/NARA, FRUS, Public Papers, registros oficiais) → literatura acadêmica → síntese institucional. Não usar resumo de SEO, blog genérico nem paráfrase de enciclopédia.

Não transformar item de cronologia, ficha de pessoa ou tema em miniartigo.

## Visual

Preservar a linguagem já publicada: marinho institucional, acento vermelho contido, serifada editorial, metadados em sans, fotografia de arquivo, whitespace, registro de biblioteca presidencial.

Refinar defeitos (A/B) e ajustes coerentes (C). Não redesenhar.

## PR #28

A PR #28 **não** substitui o site e **não** deve ser mesclada por atacado. É inventário arqueológico. Ver `docs/AUTHORITY.md`.
