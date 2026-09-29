# Configuração de medição — GTM, GA4, Google Ads, Search Console e Clarity

O site já sai com a camada de medição inteira montada. O que falta é trocar os placeholders por
IDs reais e criar as tags dentro do GTM. Nada aqui exige mexer no HTML além da substituição.

## A arquitetura, e por que ela é assim

**O GTM é o contêiner único.** GA4, Google Ads e Clarity disparam **dentro** dele. A tentação é
colar os quatro scripts na página; o resultado é pageview e conversão contados duas vezes, e o Ads
otimizando em cima de número inflado. Por isso o bloco "modo sem GTM" em `blocos/analytics-head.html`
está comentado — ele é a alternativa para quem **não** vai usar GTM, nunca um complemento.

O Search Console fica de fora dessa regra: verificação de propriedade é meta tag no `<head>`, não
passa por gerenciador de tags.

## 1. Substituir os placeholders

No `index.html`:

| Placeholder | Onde pegar | Formato |
|---|---|---|
| `GTM-XXXXXXX` | GTM → Admin → ID do contêiner | `GTM-ABC1234` |
| `[TOKEN_SEARCH_CONSOLE]` | Search Console → propriedade de prefixo de URL → tag HTML | string longa |
| `G-XXXXXXXXXX` | GA4 → Admin → Fluxos de dados → ID da métrica | só no modo sem GTM |
| `AW-XXXXXXXXX` | Google Ads → Ferramentas → Conversões | só no modo sem GTM |
| `[CLARITY_ID]` | Clarity → Settings → Setup | só no modo sem GTM |
| `[WHATSAPP]` | número com DDI e DDD, só dígitos | `5511999999999` |
| `[DOMINIO]` | domínio publicado | `marcosmassas.com.br` |

O carregador do GTM detecta o placeholder e **não faz a requisição** enquanto o ID não for real —
o `dataLayer` continua ativo e os eventos continuam sendo empurrados. Substituiu, funciona.

Substituição em lote:

```bash
cd modelos
grep -rl 'GTM-XXXXXXX' . | xargs sed -i 's/GTM-XXXXXXX/GTM-SEUID/g'
grep -rl '\[WHATSAPP\]' . | xargs sed -i 's/\[WHATSAPP\]/5511999999999/g'
```

## 2. Search Console

1. Adicione a propriedade **prefixo de URL** com o domínio final.
2. Escolha verificação por **tag HTML** e copie o `content`.
3. Cole em `[TOKEN_SEARCH_CONSOLE]`. A meta já está no `<head>`.
4. Publique, verifique, e envie o sitemap quando existir.

## 3. GTM — as tags a criar

Crie o contêiner **Web** e, dentro dele:

**Variáveis** (Variáveis definidas pelo usuário → Variável de camada de dados):
`origem`, `texto_botao`, `profundidade`

**Acionadores** (Evento personalizado, nome exatamente igual):
`whatsapp_click` · `telefone_click` · `scroll_depth`

**Tags:**

| Tag | Tipo | Acionador |
|---|---|---|
| GA4 — configuração | Google Tag, ID `G-XXXXXXXXXX` | Initialization — All Pages |
| GA4 — whatsapp_click | Evento do GA4, nome `whatsapp_click`, parâmetros `origem` e `texto_botao` | `whatsapp_click` |
| GA4 — scroll_depth | Evento do GA4, parâmetro `profundidade` | `scroll_depth` |
| Ads — conversão WhatsApp | Google Ads Conversion Tracking, ID `AW-XXXXXXXXX` + rótulo | `whatsapp_click` |
| Clarity | HTML personalizado, snippet do Clarity | All Pages |

Use o **modo de visualização** do GTM antes de publicar: clique no botão flutuante e confirme que
`whatsapp_click` chega com `origem: flutuante`.

## 4. GA4 — marcar a conversão

Admin → Eventos → marque `whatsapp_click` como **evento principal**. Só depois disso o Ads consegue
importar.

A página não tem formulário: a conversão é o WhatsApp e mais nada. Não crie um evento
`form_submit` — conversão configurada que nunca dispara suja o painel e engana o lance do Ads.

Registre também `origem` como **dimensão personalizada** (escopo de evento) — é o que responde qual
seção da página gera contato, e o botão flutuante costuma ser a que mais gera.

## 5. Google Ads — importar a conversão

Ferramentas → Conversões → Nova → **Importar** → Google Analytics 4 → selecione `whatsapp_click`.

Esta é a única conversão da página, e é a certa: é o objetivo real de negócio. Use `origem` para
ler depois qual seção gerou cada contato.

Consent Mode v2 já está declarado antes de qualquer tag, com `ad_user_data` e `ad_personalization` —
requisito para remarketing e para conversões modeladas.

## 6. Clarity

Crie o projeto, e prefira ligá-lo **pelo GTM** (tag de HTML personalizado, All Pages). Em
Settings → Google Analytics integration, conecte o GA4: as gravações passam a ser filtráveis pelos
mesmos eventos.

## 7. O que conferir depois de publicar

- GTM em modo de visualização: `consent_default_definido` dispara **antes** de qualquer tag.
- Tempo real do GA4: clique no botão flutuante e veja `whatsapp_click` com `origem: flutuante`.
- Confirme que **não existe** nenhuma tag ou conversão de `form_submit`: a página não tem formulário.
- Ads → Conversões: status **Ativa, registrando conversões** (leva algumas horas).
- Clarity: a primeira gravação aparece em poucos minutos.
- Search Console: propriedade verificada.
- Confirme que o bloco "modo sem GTM" continua comentado. É a origem número um de contagem dupla.

## Eventos que a página emite

| Evento | Quando | Parâmetros |
|---|---|---|
| `whatsapp_click` | clique em qualquer link de WhatsApp | `origem`, `texto_botao` |
| `telefone_click` | clique em link `tel:` | `numero` |
| `scroll_depth` | 25%, 50%, 75%, 100% | `profundidade` |
| `eventos_prontos` | camada de eventos carregada | `modelo` |
| `gtm_nao_configurado` | ID do GTM ainda é placeholder | `aviso` |

Valores de `origem`: `flutuante`, `hero`, `catalogo`, `revenda`, `consumidor`, `final`.
