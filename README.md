# Studio Aroeira OS — colocando no ar

Este é o mesmo sistema que a gente construiu no Claude, adaptado para rodar fora
dele, com um banco de dados de verdade (Supabase) no lugar do armazenamento
interno do Claude.

## Passo 1 — Criar o projeto no Supabase (gratuito)

1. Acesse **supabase.com** e crie uma conta (dá pra usar login do Google)
2. Crie um novo projeto — escolha uma senha de banco e a região mais próxima (South America)
3. Espere uns 2 minutos até o projeto terminar de ser criado
4. No menu lateral, vá em **SQL Editor** → **New query**
5. Abra o arquivo `supabase-schema.sql` (está nesta pasta), copie todo o conteúdo, cole no editor e clique em **Run**
6. Vá em **Project Settings** (ícone de engrenagem) → **API**
7. Copie dois valores: **Project URL** e a chave **anon public**

## Passo 2 — Configurar o projeto localmente

Você vai precisar do [Node.js](https://nodejs.org) instalado no computador (versão 18 ou mais recente).

1. Baixe/extraia esta pasta no seu computador
2. Abra um terminal dentro dela e rode:
   ```
   npm install
   ```
3. Copie o arquivo `.env.example` e renomeie a cópia para `.env`
4. Abra o `.env` e cole os dois valores que você copiou do Supabase:
   ```
   VITE_SUPABASE_URL=https://seuprojetoaqui.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```
5. Teste localmente:
   ```
   npm run dev
   ```
   Abre em `http://localhost:5173`. Confira se dá pra criar o primeiro acesso de administração e se os dados continuam lá depois de atualizar a página (F5). Se sim, o Supabase está funcionando certo.

## Passo 3 — Subir pro GitHub

1. Crie um repositório novo no GitHub (pode ser privado) — **sem** marcar a opção de criar README, já temos um
2. No terminal, dentro da pasta do projeto:
   ```
   git init
   git add .
   git commit -m "primeira versão"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
   git push -u origin main
   ```
   (troque `SEU-USUARIO` e `NOME-DO-REPOSITORIO` pelos seus dados)

   **Atenção:** o arquivo `.env` não vai junto (o `.gitignore` já exclui ele de propósito, pra sua chave não ficar pública no código). As chaves vão pro GitHub Pages de outro jeito, no próximo passo.

## Passo 4 — Publicar no GitHub Pages

1. No seu repositório do GitHub, vá em **Settings → Pages**
2. Em "Build and deployment" → "Source", escolha **GitHub Actions**
3. Ainda em Settings, vá em **Secrets and variables → Actions → New repository secret** e crie dois segredos:
   - `VITE_SUPABASE_URL` → cole a URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY` → cole a chave anon
4. Abra o arquivo `vite.config.js` e confira se o `base` está com o nome exato do seu repositório (ex.: se o repositório é `studio-aroeira`, tem que estar `base: "/studio-aroeira/"`) — se precisar corrigir, salve, e mande de novo com `git add . && git commit -m "ajuste" && git push`
5. Isso já dispara a publicação automaticamente (o arquivo `.github/workflows/deploy.yml` já está pronto pra isso). Acompanhe em **Actions**, na aba do repositório — quando ficar verde, seu site está no ar
6. O link fica: `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

A partir daqui, toda vez que você mandar uma alteração (`git push`), o site se atualiza sozinho em 1-2 minutos.

## O que muda no dia a dia

- O login por PIN, o painel, tudo continua igual
- Os dados agora ficam guardados no Supabase — acessíveis de qualquer navegador, qualquer aparelho, sem precisar do Claude aberto
- "Adicionar à tela de início" no celular continua funcionando do mesmo jeito

## Se algo der errado

Como eu não consigo testar essa conversão sem internet aqui no meu ambiente, é possível que apareça algum erro na hora de rodar `npm install` ou `npm run dev` — normalmente é falta de alguma dependência ou versão do Node desatualizada. Se acontecer, me manda a mensagem de erro exata (print ou texto) que eu ajudo a resolver.
