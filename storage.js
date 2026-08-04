// Adaptador de armazenamento — substitui o window.storage que só existe dentro do Claude.
//
// shared = true  -> dados da equipe inteira, guardados no Supabase (banco na nuvem)
// shared = false -> preferências deste aparelho/navegador, guardadas em localStorage
//
// Mantém a mesma "forma" de resposta do window.storage original, então o resto
// do app (App.jsx) quase não precisou mudar — só trocamos "window.storage." por "storage.".

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    "Faltam as variáveis VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY. Confira o arquivo .env (veja .env.example)."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TABELA = "kv_store";

export const storage = {
  async get(key, shared = false) {
    if (!shared) {
      const raw = window.localStorage.getItem(key);
      if (raw === null) throw new Error(`chave "${key}" não encontrada`);
      return { key, value: raw, shared };
    }
    const { data, error } = await supabase.from(TABELA).select("value").eq("key", key).maybeSingle();
    if (error) throw error;
    if (!data) throw new Error(`chave "${key}" não encontrada`);
    return { key, value: data.value, shared };
  },

  async set(key, value, shared = false) {
    if (!shared) {
      window.localStorage.setItem(key, value);
      return { key, value, shared };
    }
    const { error } = await supabase.from(TABELA).upsert({ key, value, atualizado_em: new Date().toISOString() });
    if (error) {
      // eslint-disable-next-line no-console
      console.error("Erro ao salvar no Supabase:", error);
      return null;
    }
    return { key, value, shared };
  },

  async delete(key, shared = false) {
    if (!shared) {
      window.localStorage.removeItem(key);
      return { key, deleted: true, shared };
    }
    const { error } = await supabase.from(TABELA).delete().eq("key", key);
    if (error) {
      // eslint-disable-next-line no-console
      console.error("Erro ao apagar no Supabase:", error);
      return null;
    }
    return { key, deleted: true, shared };
  },

  async list(prefix = "", shared = false) {
    if (!shared) {
      const keys = Object.keys(window.localStorage).filter((k) => k.startsWith(prefix));
      return { keys, prefix, shared };
    }
    const { data, error } = await supabase.from(TABELA).select("key").ilike("key", `${prefix}%`);
    if (error) {
      // eslint-disable-next-line no-console
      console.error("Erro ao listar no Supabase:", error);
      return null;
    }
    return { keys: (data || []).map((d) => d.key), prefix, shared };
  },
};
