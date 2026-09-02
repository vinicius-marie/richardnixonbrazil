# Segurança

## Arquitetura

O nixonbrazil é gerado como site estático. Não possui banco de dados público, sessão de usuário, formulário de autenticação, chave de API ou execução de código no servidor.

## Regras operacionais

Nunca adicionar ao repositório ou ao frontend:

- senhas;
- tokens do GitHub;
- chaves de APIs;
- credenciais SMTP;
- segredos OAuth;
- dados pessoais de assinantes.

Segredos futuros devem ser armazenados apenas em **Settings → Secrets and variables → Actions**. Se uma credencial for exposta, revogue-a antes de remover o arquivo ou editar o histórico.

## CMS

O Pages CMS autentica pelo GitHub. A capacidade de editar depende das permissões concedidas ao usuário no repositório. Visitantes do site não recebem acesso de escrita.

Dependências são atualizadas pelo Dependabot. O workflow de publicação executa build e auditoria de vulnerabilidades antes do deploy.

Não publique credenciais, dados pessoais ou detalhes exploráveis em uma issue.
