# Manutenção

## Arquitetura

- `src/content/`: artigos, documentos e páginas em Markdown;
- `src/data/site.json`: home, navegação e rodapé;
- `src/pages/`: rotas;
- `src/components/`: elementos compartilhados;
- `.pages.yml`: formulários do Pages CMS;
- `.github/workflows/pages.yml`: teste e publicação.

Astro gera HTML estático em `dist/`. O site não mantém login de visitante, banco de dados ou servidor de aplicação.

## Ambiente local

```bash
git clone https://github.com/viniciusdaniel-law/nixon-brasil.git
cd nixon-brasil
npm ci
npm run dev
```

Antes de uma pull request:

```bash
npm run build
git diff --check
```

O build verifica tipos, rotas, links internos, metadados, feed, rascunhos e configuração editorial.

## Alterações de conteúdo

Use o Pages CMS para artigos, documentos, páginas institucionais, home, menu e rodapé. Mudanças de layout, CSS, componentes, schema ou workflow devem ser feitas em branch própria e revisadas por diff.

Ao cadastrar fonte ou imagem:

- prefira o documento original ou a instituição custodiante;
- registre data e identificador quando existirem;
- diferencie tradução, excerto e paráfrase;
- informe texto alternativo, crédito e direitos;
- não trate crédito como autorização de uso.

## Rotas novas

Uma seção pública só deve ser criada quando houver conteúdo suficiente para justificá-la. Para adicionar uma rota:

1. implemente a página em `src/pages/`;
2. inclua o destino no sitemap;
3. ligue a rota ao CMS, se for conteúdo editável;
4. acrescente uma verificação em `scripts/verify-site.mjs`;
5. teste em tela pequena e larga.

Cronologia, perfis, temas e galerias não devem ser expostos apenas para preencher uma taxonomia.

## Publicação e reversão

`main` é produção; `editorial` é a área de edição do CMS. Toda mudança entra por pull request com o check `build` aprovado. Use **Squash and merge**.

Se uma publicação causar regressão, reverta o commit de squash pelo GitHub. Não faça force-push em `main`.
