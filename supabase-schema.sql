-- Rode isso uma vez no Supabase: painel do projeto → SQL Editor → New query → colar → Run

create table if not exists kv_store (
  key text primary key,
  value text not null,
  atualizado_em timestamptz default now()
);

-- Deixa a tabela acessível pela chave "anon" (a chave pública usada pelo app).
-- Como o app já tem sua própria trava por PIN dentro dele, isso é suficiente
-- para uso interno da equipe. Não é segurança de nível bancário: qualquer pessoa
-- com o link do Supabase e a chave anon (que fica visível no código do site)
-- tecnicamente poderia ler/escrever direto na tabela. Para uma equipe de confiança,
-- isso é uma proteção razoável — se quiser mais rigor no futuro, dá pra adicionar
-- autenticação de verdade no Supabase depois.

alter table kv_store enable row level security;

create policy "permitir tudo com a chave anon"
  on kv_store
  for all
  using (true)
  with check (true);
