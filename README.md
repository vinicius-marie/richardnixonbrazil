# Nixon Brasil

[nixonbrazil.page](https://nixonbrazil.page) é uma publicação histórica independente sobre Richard Nixon, sua Presidência, a política externa do período e as relações entre Estados Unidos e Brasil.

Artigos e fichas documentais são escritos em Markdown. O site usa Astro, é compilado pelo GitHub Actions e publicado no GitHub Pages. O Pages CMS oferece um painel para edição de conteúdo sem manter servidor ou banco de dados.

## Conteúdo

- **Artigos:** ensaios e dossiês com autoria, data e fontes.
- **Acervo:** documentos com referência, instituição de origem e situação da tradução.

O painel trabalha na branch `editorial`. A publicação ocorre somente depois de uma pull request para `main` e do check `build`.

## Desenvolvimento

Requer Node.js 24.

```bash
npm ci
npm run dev
```

Validação completa:

```bash
npm run build
```

Instruções: [uso do CMS](docs/CMS.md), [manutenção](docs/GUIA-DE-EDICAO.md) e [domínio](docs/DOMINIO.md).

O projeto não possui vínculo com a Richard Nixon Foundation, a Richard Nixon Presidential Library, a NARA ou o governo dos Estados Unidos. Consulte [LICENSE.md](LICENSE.md) para direitos do código, dos textos e dos materiais de terceiros.
