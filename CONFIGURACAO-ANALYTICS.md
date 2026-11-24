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

## 1. Placeholders

### Já preenchidos

| O quê | Valor |
|---|---|
| Contêiner do GTM | **`GTM-N66FVFHZ`** — instalado em 24/11/2026 |
| WhatsApp | `5511939530387` |
| Domínio | `https://www.marcosmassas.com.br/` |

### Os que restam — e por que não são urgentes

| Placeholder | Onde é usado |
|---|---|
| `G-XXXXXXXXXX` | só no bloco "modo sem GTM", que está comentado |
| `AW-XXXXXXXXX` | só no bloco "modo sem GTM", que está comentado |
| `[CLARITY_ID]` | só no bloco "modo sem GTM", que está comentado |

**Os três estão dentro de um bloco comentado e não afetam a página.** Com o GTM ativo, o GA4, o
Google Ads e o Clarity entram como **tags dentro do contêiner** (seção 3), não como scripts na
página. Preencher esses placeholders só faria sentido se o GTM fosse abandonado — e aí o bloco 3 do
`<head>` teria que sair junto, senão tudo conta em dobro.

### Como o carregador se comporta

O carregador do GTM detecta um ID ainda em placeholder (`GTM-XXXX...`) e **não faz a requisição**:
o `dataLayer` segue ativo, os eventos seguem sendo empurrados, e nenhuma requisição quebrada
aparece no console. Com o ID real, ele injeta o script normalmente.

## 2. Search Console — VERIFICADO

**Propriedade:** `https://www.marcosmassas.com.br/` (prefixo de URL).
**Método:** arquivo HTML. **Verificado em 24/11/2026.**
**Hospedagem:** Vercel, publicando o branch padrão do repositório. DNS no Registro.br.

O arquivo **`google2dd807b122c45b74.html`** está na raiz do repositório, com os 53 bytes exatos que
o Google gerou. Como o site é o `index.html` da raiz, ele é servido em
`https://www.marcosmassas.com.br/google2dd807b122c45b74.html`.

### O que falta fazer

1. **Adicionar um segundo método de verificação** — ver abaixo. Recomendação do próprio Google.
2. **Enviar o sitemap** quando existir.

### Duas coisas que derrubam a verificação

- **Apagar o arquivo.** O Google revalida de tempos em tempos. O próprio painel avisa: *"para
  continuar verificado, não remova o arquivo, mesmo após a verificação bem-sucedida."*
- **"Clean URLs" da hospedagem.** Vercel e Netlify podem redirecionar `/arquivo.html` para
  `/arquivo`; aí o Google busca o `.html`, leva um 301 e reprova — com o arquivo no lugar certo.
  **Nesta instalação não ocorre:** testado no ar, a URL com `.html` responde direto. Mas é a
  primeira coisa a conferir se alguém mexer nas configurações da Vercel.

### `www` x domínio raiz — resolvido e consistente

Confirmado no painel da Vercel: **`www.marcosmassas.com.br` é o domínio de produção**, e
`marcosmassas.com.br` responde com **308** redirecionando para ele. Tudo aponta para o mesmo
endereço:

| Onde | Valor |
|---|---|
| Domínio de produção na Vercel | `www.marcosmassas.com.br` |
| Propriedade no Search Console | `https://www.marcosmassas.com.br/` |
| `canonical` do `index.html` | `https://www.marcosmassas.com.br/` |
| `url` do JSON-LD | `https://www.marcosmassas.com.br/` |

Como o redirecionamento é 308 (permanente), o Google consolida os sinais no `www` sozinho.

> **Cuidado ao diagnosticar isto no navegador:** o Chrome **esconde o `www.`** na barra de endereço.
> Uma URL que parece estar na raiz pode estar no `www`. Para ver o endereço real, clique na barra
> (ele se expande) ou confira no painel da Vercel, que é a fonte da verdade.

*Opcional, não urgente:* uma **propriedade de domínio** no Search Console, verificada por TXT no
DNS, cobriria `www`, raiz, `http` e `https` num relatório só. Com o 308 no lugar, isso deixou de
resolver um problema e passou a ser só conveniência.

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
