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
| `G-XXXXXXXXXX` | GA4 → Admin → Fluxos de dados → ID da métrica | só no modo sem GTM |
| `AW-XXXXXXXXX` | Google Ads → Ferramentas → Conversões | só no modo sem GTM |
| `[CLARITY_ID]` | Clarity → Settings → Setup | só no modo sem GTM |
| `[WHATSAPP]` | número com DDI e DDD, só dígitos | `5511999999999` |

O carregador do GTM detecta o placeholder e **não faz a requisição** enquanto o ID não for real —
o `dataLayer` continua ativo e os eventos continuam sendo empurrados. Substituiu, funciona.

Substituição em lote:

```bash
sed -i 's/GTM-XXXXXXX/GTM-SEUID/g' index.html
```

## 2. Search Console — já configurado

**Propriedade:** `https://www.marcosmassas.com.br/` (prefixo de URL).
**Método:** arquivo HTML, que é o recomendado pelo Google.

O arquivo **`google2dd807b122c45b74.html`** está na raiz do repositório, com os 53 bytes exatos que
o Google gerou. Como o site é o `index.html` da raiz, ele é servido em
`https://www.marcosmassas.com.br/google2dd807b122c45b74.html` assim que o site for publicado.

### O que falta fazer

1. **Publicar o site.** A verificação busca o arquivo pela internet — enquanto não houver nada no ar
   naquele endereço, clicar em VERIFICAR falha.
2. **Clicar em VERIFICAR** no Search Console, com a página já publicada.
3. **Enviar o sitemap** quando existir.

### Três coisas que derrubam a verificação

- **Apagar o arquivo.** O Google revalida de tempos em tempos. O próprio painel avisa: *"para
  continuar verificado, não remova o arquivo, mesmo após a verificação bem-sucedida."*
- **"Clean URLs" da hospedagem.** Vercel e Netlify, na configuração padrão, redirecionam
  `/arquivo.html` para `/arquivo`. O Google busca o `.html`, leva um 301 e reprova — com o arquivo
  no lugar certo. Desligue o *clean URLs* ou use também a tag HTML (abaixo).
- **Trocar `www` por raiz.** `www.marcosmassas.com.br` e `marcosmassas.com.br` são propriedades
  diferentes para o Search Console. A propriedade criada é a com `www`, e o `canonical` da página
  aponta para ela. Para cobrir as duas de uma vez, o caminho é uma **propriedade de domínio**, que
  se verifica por DNS e vale para todas as variações.

### Segundo método, opcional

Verificar por dois métodos ao mesmo tempo é mais seguro: se um cair, o outro segura. Para adicionar
a tag HTML, pegue o `content` em Search Console → Verificar propriedade → **Tag HTML** e acrescente
no `<head>` do `index.html`:

```html
<meta name="google-site-verification" content="COLE_O_CONTENT_AQUI">
```

O token da tag é **diferente** do nome do arquivo — são valores independentes.

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
