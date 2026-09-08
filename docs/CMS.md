# Pages CMS

O painel edita a branch `editorial`. Salvar conteúdo ali não altera o site público.

## Acesso

1. Entre em [app.pagescms.org](https://app.pagescms.org/) com o GitHub.
2. Autorize somente `viniciusdaniel-law/nixon-brasil`.
3. Confirme que a branch selecionada é `editorial`.

O menu possui quatro áreas:

- **Artigos**;
- **Documentos do acervo**;
- **Páginas institucionais**;
- **Configurações do site**.

## Artigos

Preencha título, resumo, data, categoria e texto. A assinatura padrão é `nixonbrazil`; use uma assinatura pessoal somente depois da revisão do autor indicado.

Na página inicial:

- `lead` seleciona a matéria principal — deve existir apenas uma;
- `rail` envia o artigo para a lista lateral;
- `none` publica sem destaque na home.

Imagem de capa exige texto alternativo, crédito e situação de direitos. URLs de fontes devem usar HTTPS. Mantenha **Rascunho** ativo enquanto o texto não estiver pronto.

O campo **Maturidade editorial** é opcional. Entradas `recovered`, `sourced`, `fact_checked` ou `editorial_review` não podem ser publicadas (`Rascunho` desligado). Conteúdo já público pode permanecer sem o campo.

## Acervo

Cada entrada deve informar título, data, formato, tema, arquivo de origem e URL do documento. Referências de caixa, pasta ou código arquivístico só devem ser preenchidas quando confirmadas pela instituição de custódia.

O campo de texto serve para contexto, comentário ou tradução. A página pública do documento mostra essa informação e conduz ao original.

## Páginas e configurações

Biografia, Nixon e o Brasil e Sobre o projeto são arquivos únicos. O painel não permite criar uma segunda página com o mesmo papel.

Configurações do site controla a apresentação da home, os links do menu e a descrição do rodapé. Não altere uma URL interna sem confirmar que a rota existe.

## Publicar

1. Revise as alterações na branch `editorial`.
2. Abra a [comparação `editorial` → `main`](https://github.com/viniciusdaniel-law/nixon-brasil/compare/main...editorial?expand=1).
3. Crie a pull request.
4. Aguarde o check `build`.
5. Leia o diff e a prévia.
6. Use **Squash and merge**.
7. Sincronize `editorial` com `main` antes da próxima edição.

Para retirar conteúdo sem apagar o histórico, ative **Rascunho** e publique a alteração pelo mesmo fluxo.
