**My First Worker — Cron de Clima**

Este repositório contém um Cloudflare Worker que executa um trabalho agendado (cron) a cada 5 minutos para buscar o clima atual e persistir o resultado em um KV Namespace. Também expõe um endpoint HTTP `GET /weather` que retorna o último resultado salvo.

**Quick Commands**

- **Criar KV namespace:** cria um namespace chamado `weather` e retorna um `id`.

```powershell
wrangler kv namespace create "weather"
```

- **Adicionar secret (API key):** cole a chave quando solicitado. Não deixe essa chave em `wrangler.jsonc`.

```powershell
wrangler secret put WEATHER_API_KEY
```

- **Verificar login/usuário:**

```powershell
wrangler whoami
wrangler login
```

- **Deploy (publicação):**

```powershell
npm run deploy
// ou
wrangler deploy
```

- **Tailing (logs) para ver execução do cron):**

```powershell
wrangler tail
```

- **Executar em desenvolvimento (dev server):**

```powershell
npm run dev
// ou
wrangler dev
```

- **Consultar endpoint `/weather`:** (após o primeiro run do cron — aguarde até 5 minutos)

```powershell
# Local (dev):
curl http://localhost:8787/weather

# Production (após deploy):
curl https://<your-worker>.workers.dev/weather
```

**Observações Importantes**

- O cron está configurado como `*/5 * * * *` no arquivo `wrangler.jsonc` (executa a cada 5 minutos).
- A binding KV usada no código é `WEATHER_KV`. O `id` do namespace deve estar em `wrangler.jsonc` sob `kv_namespaces`.
- A `WEATHER_API_KEY` deve ser criada via `wrangler secret put` (já não é mais armazenada em `vars`).
- Se houver problemas de permissão/erro com `wrangler`, confirme sua sessão com `wrangler whoami` e faça `wrangler login` se necessário.
- Verifique os limites da API de clima do provedor que você usa (chamadas por dia = 288 se rodar a cada 5 minutos).

**Sugestões adicionais**

- Adicionar CORS no `fetch` handler se você vai chamar `/weather` do navegador.
- Ajustar o formato do JSON persistido no KV se quiser somente campos específicos.
- Adicionar monitoramento/alerts se a chamada externa falhar repetidamente.

Arquivo principal do Worker: `src/index.js`
Configuração do Wrangler: `wrangler.jsonc`

---
Gerado automaticamente pelo assistente para ajudar com deploy e verificação.
