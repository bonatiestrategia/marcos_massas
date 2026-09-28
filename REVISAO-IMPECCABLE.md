# Revisão dos 5 modelos — skill `impeccable` v4.3.1

> **Atualização:** o cliente escolheu o **modelo 3 (Mesa farta)** e ele virou a página de produção.
> Recebeu a logomarca, os dados reais (São Paulo, WhatsApp (11) 93953-0387), o catálogo definitivo
> com o nhoque liderando, e teve o formulário removido — a conversão passou a ser só WhatsApp.
> A chamada final virou campo vermelho cheio, trazendo a marca para dentro da página.
>
> Nova passada do detector no modelo 3: **11 achados**, sendo 10 o falso positivo de
> `cramped-padding` e 1 o `overused-font: fraunces` de sempre. O
> `gpt-thin-border-wide-shadow` foi eliminado. Sobre a Fraunces: com o logo, o campo vermelho e os
> marcadores amarelos, a identidade da página não repousa mais só na tipografia — o achado continua
> tecnicamente correto, mas perdeu peso prático. Segue como exceção aceita e documentada.
>
> Os modelos 1, 2, 4 e 5 ficaram congelados no estado desta revisão e servem como referência.

Passada de `audit` (checagem técnica medível, que documenta) seguida de `polish` (a correção, que
preserva o mundo visual de cada modelo). Conduzida na sessão principal, e não por subagentes, para
que os cinco fossem medidos pelo mesmo critério.

Ferramentas: detector empacotado do impeccable (`impeccable detect`), `blocos/verificar.mjs`
(Chromium via Playwright em 1440×900 e 390×844), e dois scripts de estrutura e de teclado em
`.verificacao/`.

---

## 1. Placar do audit

Cinco dimensões, 0–4, conforme `reference/audit.md`.

| Modelo | A11y | Perf. | Tematização | Responsivo | Integridade | Média |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| 1 · Massa viva | 4 | 3 | 4 | 4 | 4 | **3,8** |
| 2 · Balcão | 4 | 4 | 4 | 4 | 4 | **4,0** |
| 3 · Mesa farta | 4 | 3 | 4 | 4 | 3 | **3,6** |
| 4 · Forno | 4 | 3 | 4 | 4 | 4 | **3,8** |
| 5 · Encarte | 4 | 3 | 4 | 4 | 4 | **3,8** |

**Acessibilidade — 4 em todos.** Medido, não presumido: zero falhas de contraste nos dois
viewports, zero elementos focáveis sem anel de foco visível, nenhuma armadilha de teclado, nenhum
alvo de toque abaixo de 44×44, um único `h1` por página, hierarquia de títulos sem saltos,
`header`/`main`/`footer` presentes, os 6 campos de formulário rotulados, `lang="pt-BR"` e
`prefers-reduced-motion` respeitado nos cinco.

**Performance — 3 onde as fontes embutidas pesam.** Os cinco embutem as fontes em base64, o que
elimina a requisição externa e faz a página abrir sem rede — decisão correta para maquete, mas
base64 não é cacheável separadamente e infla o HTML: 275KB (modelo 3), 201KB (1), 195KB (5),
151KB (4), 124KB (2). **Para produção, sirva os `.woff2` como arquivos próprios com
`font-display: swap`** — está na lista de "o que fazer depois de escolher".

**Integridade — 3 no modelo 3** pelo único achado que a revisão decidiu não corrigir; ver §4.

---

## 2. O que o `polish` corrigiu

### Prioridade 1 — tarefa quebrada e estado enganoso

**O formulário perdia o lead em silêncio (modelos 1, 2 e 3).** Sem `action` e sem `preventDefault`,
enviar o formulário recarregava a página: o visitante via os campos limparem e concluía que tinha
dado certo. Ninguém recebia nada. O `polish` trata isso como prioridade 1, acima de qualquer questão
visual, e com razão — é o defeito que custa dinheiro.

Corrigido nos três, cada um na linguagem visual do seu modelo (etiqueta amarela de balcão no 2, nota
editorial no 3, massa de fubá no 1): o envio é interceptado, a validação nativa roda, e um aviso com
`role="status"` diz que o destino ainda não está configurado e aponta o WhatsApp. Os eventos
`form_start` e `form_submit` continuam subindo para o `dataLayer`. Os modelos 4 e 5 já haviam
resolvido isso sozinhos.

O verificador ganhou uma checagem permanente disso — preenche o formulário, envia, e reprova se a
página navegar sem destino ou se nada avisar o visitante.

### Prioridade 3 — semântica

- **Modelo 5 não tinha `<main>`.** Quem usa leitor de tela perdia o alvo de "pular para o conteúdo".
  Adicionado `<main id="conteudo">` envolvendo o conteúdo entre o cabeçalho e o rodapé.
- **Modelo 2 não tinha `<header>`.** A placa da casa estava dentro do `<main>`. Promovida a
  `<header>`, fora do conteúdo principal.

### Prioridade 4 — cor e profundidade

- **Cinza sobre cor (modelo 3).** O painel amarelo do formulário usava a tinta secundária da página
  (`#5f524e`, saturação 0,10 — cinza-morno na prática). O craft floor é explícito: em superfície
  colorida, a tinta secundária se tinge da matiz ou da tinta principal, nunca cinza. Corrigido com
  um override **escopado ao painel** (`#5c4e22`, 7,3:1) em vez de trocar a tinta da página inteira,
  que seria redesenho e não refinamento.
- **A sombra do botão flutuante era genérica — e o defeito era meu, não dos agentes.** O bloco que
  entreguei aos cinco tinha borda de 1px com sombra de 20–26px de desfoque: a combinação que o
  detector identifica como "cara de template". Reescrita para deslocamento maior e menos névoa
  (`0 7px 11px -6px`), que lê como elevação real. Corrigido no bloco de origem e propagado aos
  cinco, preservando a tinta que cada modelo deu à própria sombra.

---

## 3. Achados verificados em contexto e recusados

O `audit` manda verificar cada achado do detector e nomear os falsos positivos. **32 dos 44 achados
restantes são o mesmo falso positivo.**

| Achado | Ocorr. | Veredito |
|---|:--:|---|
| `cramped-padding` | 32 | **Falso positivo.** O detector mede a seção full-bleed contra o wrapper interno. Confirmado no código: `.secao` tem `padding-block` de até 104px e o `.envelope` interno tem `padding-inline`. É a arquitetura correta de seção full-bleed com conteúdo contido. |
| `organic-clip-path` (1) | 2 | **Falso positivo.** A regra proíbe máscara geométrica fingindo o contorno de um objeto fotográfico. Estes polígonos são a borda irregular do rolo abrindo a massa — o momento de motion do modelo, abstrato e autoral. |
| `clipped-overflow-container` (1) | 1 | **Falso positivo.** É `main { overflow-x: clip }`, a forma correta de conter as massas que sangram além da viewport sem criar barra de rolagem. O verificador confirma zero scroll horizontal. |
| `cream-palette` (1) | 1 | **Falso positivo.** `#fffdf7` é branco com um véu de farinha, não o bege `#F4F1EA` do tell — e o acento é o vermelho da marca, não terracota. |
| `cream-palette` (4) | 1 | **Exceção intencional.** `#f6efdf` é derivado do amarelo da marca, mais quente e saturado que o creme genérico, e é cortado por duas câmaras escuras. Dos três eixos do tell, nenhum se fecha. |
| `nested-cards` (2) | 2 | **Exceção intencional.** É a construção do próprio letreiro esmaltado: a placa com moldura pintada e parafusos. Verificado na captura. |
| `radial-halo` (4) | 1 | **Exceção intencional.** É a brasa na boca do forno, o efeito pretendido. Verificado na captura. |
| `side-tab` (1) | 1 | **Exceção intencional.** Faixa de 3px na borda inferior, feita de elipses — o rastro de farinha do mundo do modelo. A regra do craft floor mira borda colorida lateral em card. |
| `gpt-thin-border-wide-shadow` (4) | 1 | **Exceção verificada.** `--sombra-2: 0 14px 34px -18px` tem deslocamento real de 14px e spread negativo forte: é elevação direcional, não halo. Satisfaz o craft floor. |
| `em-dash-overuse` (4) | 1 | **Some sozinho.** Dos 12 travessões, 7 estão em rótulos de moldura de placeholder ("Logotipo de cliente 1 — proporção 3:2"), que saem quando as fotos reais entrarem, e 1 está dentro de um comentário HTML. Os 3 em prosa são travessão legítimo em português. |

---

## 4. O achado que não foi corrigido, e por quê

**`overused-font: fraunces` — modelo 3.** O detector marca a Fraunces como uma das faces mais
recorrentes em página gerada por IA. O achado é legítimo: quem vê muita landing page reconhece.

Não corrigi, e a razão é de método. O `polish` do impeccable é explícito: *"polish é refinamento,
nunca redesenho disfarçado. Se o conceito estiver errado, diga — não contrabandeie um substituto."*
A Fraunces não é um detalhe do modelo 3; ela é a voz dele, com os eixos SOFT e WONK escolhidos para
dar terminais macios em vez de didone de passarela. Trocar a face refaz a identidade do modelo, e
isso é decisão sua, não minha.

**Se você escolher o modelo 3, decida isto primeiro:** manter a Fraunces (ela funciona, e o risco é
parecer familiar) ou substituí-la por uma serifada de mesmo temperamento e menos rodada. É um
pedido de meia hora, mas é redesenho da identidade, não polimento.

---

## 5. Os cinco lado a lado

| # | Modelo | Distinção | Força | Risco |
|---|---|---|---|---|
| 1 | **Massa viva** | Contornos de massa, textura de farinha, nada de grade | O único genuinamente orgânico — atende o pedido nominal do cliente. Hero com personalidade real. | O mais pesado (201KB) e o que mais depende de foto boa para não parecer vazio. |
| 2 | **Balcão** | Grade de azulejo com rejunte real, letreiro esmaltado | **Nota mais alta do audit (4,0)** e o mais leve (124KB). Reconhecimento imediato para dono de lanchonete. | Ação primária e secundária com peso quase igual no hero. |
| 3 | **Mesa farta** | Editorial, imagem liderando, muito ar | O mais calmo e o mais premium dos cinco. | Usa a marca de menos: vermelho e amarelo quase não aparecem na dobra. E o hero fica vazio até a foto real chegar. |
| 4 | **Forno** | Câmaras escuras, arco, geometria estrutural | O mundo visual mais próprio — nenhum concorrente tem isso. Piso claro para leitura, escuro só onde o texto é curto. | O mais elaborado, portanto o mais caro de manter depois. |
| 5 | **Encarte** | Faixas chapadas, densidade alta, display condensado | O mais comercial e o mais B2B. Resolveu bem o problema central: a vaga do preço virou a chamada para pedir a tabela. | O mais barulhento. Se a marca quiser parecer premium, este não é o caminho. |

### Recomendação

**Modelo 2 (Balcão)** para ir ao ar, e **modelo 5 (Encarte)** como o teste A/B contra ele.

O Balcão porque é o que melhor casa com a cena real de uso do `PRODUCT.md`: o comprador está atrás
de um balcão igual ao que a página desenha, no celular, no meio do turno. O reconhecimento acontece
antes da leitura. É também o de maior nota técnica e o mais leve — o que importa em campanha paga,
onde cada 100KB custa conversão. E é o modelo que usa vermelho e amarelo com naturalidade, porque
são de fato as cores desse universo.

O Encarte como desafiante porque ataca pelo lado oposto — densidade e urgência comercial em vez de
reconhecimento afetivo — e essa é a comparação que ensina alguma coisa. Dois modelos parecidos em
teste A/B não respondem nada.

**Antes de publicar, corrija a hierarquia do hero do Balcão:** "Falar no WhatsApp" e "Pedir a tabela
de preços" ocupam peças de mesmo tamanho. A ação primária precisa vencer com folga — é ela que o
Google Ads vai otimizar.

---

## 6. O que a revisão não fez

**`critique` completo.** O comando exige, por contrato, dois subagentes isolados por alvo (revisão
de design e evidência de detector, sem se verem) — 10 subagentes para os cinco modelos. Rodei
`audit` + `polish`, que é revisão e correção. Se quiser o `critique` com pontuação heurística,
proponho rodá-lo apenas no modelo que você escolher.

**Trocar a Fraunces do modelo 3.** É redesenho, e a decisão é sua (§4).

**Otimizar as fontes para produção.** Base64 é a escolha certa para maquete que abre por duplo
clique e a errada para página publicada. Trocar por `.woff2` servidos como arquivo entra na lista de
publicação, não na revisão das maquetes.
