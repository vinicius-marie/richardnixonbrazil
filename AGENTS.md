# Regras de manutenção

Este arquivo define invariantes operacionais do repositório.

## Autoridade

- `main` é a única origem de produção.
- `editorial` é a branch de edição do Pages CMS e só chega a `main` por pull request.
- Toda branch de trabalho deve nascer da `origin/main` atual.
- Branches históricas ou arquivadas nunca servem como base de execução.

## Preflight

Antes de alterar o repositório:

1. `git fetch origin --prune`
2. resolver o SHA atual de `origin/main`;
3. inspecionar pull requests abertas;
4. criar branch nova diretamente de `origin/main`;
5. confirmar `merge-base(HEAD, origin/main) == origin/main` e `behind main == 0`.

O CI executa `scripts/check-branch-authority.mjs`. Não enfraquecer esse gate para fazer uma branch passar.

## Publicação

- apenas `main` dispara o deploy do GitHub Pages;
- `npm run build` deve passar antes do merge;
- não fazer force-push em `main`;
- usar squash merge para mudanças do projeto;
- não publicar `cronologia`, `discursos`, `pessoas`, `temas` ou `galerias` sem novo gate editorial explícito;
- não reduzir as verificações de `scripts/verify-site.mjs` para tornar conteúdo imaturo publicável.

## Conteúdo

O campo opcional `editorialStatus` usa a sequência:

`recovered` → `sourced` → `fact_checked` → `editorial_review` → `publishable` → `published`

`draft: true` continua sendo a trava de publicação. Conteúdo em `recovered`, `sourced`, `fact_checked` ou `editorial_review` não pode ser publicado.

Prioridade de fontes: arquivo primário (Nixon Library/NARA, FRUS, Public Papers e registros oficiais) → literatura acadêmica → síntese institucional.

## Identidade visual e editorial

Preservar a marca **nixonbrazil**, a língua portuguesa e a linguagem visual já publicada: marinho institucional, acento vermelho contido, serifada editorial, metadados em sans, fotografia de arquivo e composição sóbria.

Refinar defeitos; não redesenhar sem decisão editorial explícita.
