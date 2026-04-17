< align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</

Este repositório reúne o backend Node.js com MongoDB e o frontend Angular para gestão de hemoterapia.

## Estrutura do projeto

- `server/` - backend Express + Mongoose que expõe endpoints de `collection`, `transfusion` e `therapeutic`
- `angular-frontend/` - frontend Angular com formulários reativos e integração com o backend
- `.env.example` - exemplo de configuração de ambiente para o backend

## Requisitos

- Node.js 18+ ou superior
- MongoDB acessível via `MONGO_URI`

## Configuração

1. Instale dependências do backend:
   `npm install`
2. Instale dependências do frontend Angular:
   `cd angular-frontend && npm install`
3. Copie o arquivo de ambiente:
   `cp .env.example .env`
4. Atualize `MONGO_URI` no arquivo `.env` para apontar ao seu MongoDB
5. Verifique as variáveis opcionais para produção:
   - `NODE_ENV=production`
   - `API_KEY` para proteger endpoints da API
   - `ENCRYPTION_KEY` para encriptação de campos sensíveis em banco de dados
   - `CORS_ORIGIN` para o domínio do frontend
   - `MONGO_MAX_POOL_SIZE` e `MONGO_MIN_POOL_SIZE`

## Executando o projeto

- Backend:
  `npm run server`

- Frontend Angular:
  `cd angular-frontend && npm start`

## Build para produção

- Instale dependências no root e no frontend Angular:
  `npm install`
  `cd angular-frontend && npm install`
- Build de produção para todos os frontends e backend:
  `npm run build`
- Build apenas do frontend Angular:
  `cd angular-frontend && npm run build`
- Build do frontend React (root):
  `npm run build:react`

## Executando em produção

- Backend em modo de produção:
  `npm run start:prod`

> Se o diretório `angular-frontend/dist/angular-frontend` existir e `NODE_ENV=production`, o backend Express serve o build Angular automaticamente.

## Health check

- Verifique se o backend está ativo com:
  `GET http://localhost:4000/api/health`

## Notas de produção

- Em produção, publique o build de `angular-frontend/dist/` em um servidor de arquivos estáticos ou configure um proxy reverso para `http://localhost:4000/api`
- Garanta que `MONGO_URI` e `ENCRYPTION_KEY` estejam protegidos e não commitados ao repositório
- O backend aplica validação de esquema nas rotas da API e usa compressão para melhorar o desempenho
- Auditoria de solicitações API é gravada em `server/logs/audit.log`

## Docker

- Build da imagem:
  `docker build -t blood-bank-management .`
- Executar localmente:
  `docker run -p 4000:4000 -e MONGO_URI=mongodb://host.docker.internal:27017/bloodbank blood-bank-management`
- Com Docker Compose:
  `docker compose up --build`

## GitHub Deployment

Este repositório agora inclui um workflow GitHub Actions em `.github/workflows/ci-and-deploy.yml`.

- `build` valida e gera os builds React e Angular
- `docker-deploy` constrói e envia a imagem Docker para o GitHub Container Registry quando um push é feito em `main`

Para usar o deploy automático, basta habilitar o workflow no GitHub. O `GITHUB_TOKEN` já é usado para autenticação com o registry.
