# Revisão de qualidade da página — skill `impeccable` v4.3.1

Revisão técnica do site da Marcos Massas: uma passada de `audit` (checagem medível, que documenta)
seguida de `polish` (a correção, que preserva o mundo visual em vez de redesenhar).

> **De onde isto vem.** A revisão nasceu comparando **cinco direções visuais** construídas em
> paralelo sobre o mesmo conteúdo, medidas pelo mesmo critério. O cliente escolheu a direção
> **Mesa farta**, que virou o site. As outras quatro saíram do repositório; quem quiser revê-las
> encontra no histórico do Git. Este documento ficou só com o que vale para a página entregue.

Ferramentas: detector empacotado do impeccable (`impeccable detect`), `blocos/verificar.mjs`
(Chromium via Playwright em 1440×900 e 390×844) e dois scripts de estrutura e de teclado.

---

## 1. Placar do audit

Cinco dimensões, 0–4, conforme `reference/audit.md`.

| A11y | Performance | Tematização | Responsivo | Integridade | Média |
|:--:|:--:|:--:|:--:|:--:|:--:|
| 4 | 3 | 4 | 4 | 3 | **3,6** |

**Acessibilidade — 4.** Medido, não presumido: zero falhas de contraste nos dois viewports, zero
elementos focáveis sem anel de foco visível, nenhuma armadilha de teclado, nenhum alvo de toque
abaixo de 44×44, um único `h1`, hierarquia de títulos sem saltos, `header`/`main`/`footer`
presentes, todas as imagens com texto alternativo, `lang="pt-BR"` e `prefers-reduced-motion`
respeitado.

**Performance — 3, e é o ponto fraco conhecido.** As fontes e as sete fotos estão embutidas em
base64, o que faz a página abrir com dois cliques e sem rede — decisão certa para o arquivo que o
cliente examina, errada para página publicada: base64 não é cacheável separadamente e infla o HTML
para 1,6 MB. **Antes de publicar, servir as fotos como `imagens/*.webp` e as fontes como `.woff2`
com `font-display: swap`.** Está na lista de publicação do `PLANEJAMENTO.md`.

**Integridade — 3** pelo único achado que a revisão decidiu não corrigir; ver §3.

---

## 2. O que o `polish` corrigiu

**O formulário perdia o lead em silêncio.** Sem `action` e sem `preventDefault`, enviar o formulário
recarregava a página: o visitante via os campos limparem e concluía que tinha dado certo. Ninguém
recebia nada. O `polish` trata isso como prioridade 1, acima de qualquer questão visual — tarefa
quebrada vence estética. Corrigido com interceptação honesta e `role="status"`.

*Nota posterior:* o formulário **saiu inteiro** quando o cliente decidiu concentrar a conversão no
WhatsApp. A correção deixou de existir junto, mas a checagem que ela gerou ficou: `verificar.mjs`
passou a testar honestidade de formulário sempre que houver um na página.

**Contraste do vermelho.** Branco sobre `#e61e20` dá **4,59:1** — passa por 0,09 de margem, apertado
demais para texto pequeno. Superfícies com texto miúdo usam `--vermelho-tinta` (`#c9161b`, 5,81:1).

**Duas lacunas estruturais de acessibilidade** encontradas na varredura e corrigidas: `<main>` e
`<header>` ausentes em modelos irmãos, o que motivou incluir a checagem de landmarks no verificador.

---

## 3. Achados do detector verificados em contexto

O `audit` manda verificar cada achado e nomear os falsos positivos. Na última passada foram
**11 achados**, sendo 10 o mesmo falso positivo.

| Achado | Ocorr. | Veredito |
|---|:--:|---|
| `cramped-padding` | 10 | **Falso positivo.** O detector mede a seção full-bleed contra o wrapper interno. Confirmado no código: `.secao` tem `padding-block` de até 104px e o `.envelope` interno tem `padding-inline`. É a arquitetura correta de seção full-bleed com conteúdo contido. |
| `overused-font: fraunces` | 1 | **Exceção aceita.** Ver abaixo. |
| `gpt-thin-border-wide-shadow` | 0 | **Eliminado.** Era defeito meu, no bloco do botão flutuante: filete de 1px com sombra de 20–26px de desfoque. A sombra passou a ter deslocamento real e spread negativo forte — elevação direcional, não halo. |

### O achado que não foi corrigido, e por quê

**`overused-font: fraunces`.** O detector marca a Fraunces como uma das faces mais recorrentes em
página gerada por IA. O achado é legítimo: quem vê muita landing page reconhece.

Não corrigi, e a razão é de método. O `polish` do impeccable é explícito: *"polish é refinamento,
nunca redesenho disfarçado. Se o conceito estiver errado, diga — não contrabandeie um substituto."*
A Fraunces não é um detalhe da página; ela é a voz dela, com os eixos SOFT e WONK escolhidos para
dar terminais macios em vez de didone de passarela. Trocar a face refaz a identidade, e isso é
decisão do cliente, não minha.

**O que mudou desde então:** com a logomarca no cabeçalho, o campo vermelho da chamada final e os
marcadores amarelos, a identidade da página não repousa mais só na tipografia. O achado continua
tecnicamente correto, mas perdeu peso prático. Segue como exceção aceita e documentada.

---

## 4. Duas críticas da revisão original, hoje resolvidas

Quando esta direção foi avaliada contra as outras quatro, ela levou duas ressalvas. Ambas caíram no
caminho até virar site:

- **"Usa a marca de menos — vermelho e amarelo quase não aparecem."** Resolvido pela decisão de
  puxar a marca para dentro da página: a chamada final virou campo vermelho cheio, o amarelo passou
  a marcar rendimento e dados de apoio, e a logomarca entrou no cabeçalho e no rodapé.
- **"O hero fica vazio até a foto real chegar."** Resolvido: as sete fotos do cliente estão na
  página e nenhuma moldura de placeholder sobrou.

*Registro honesto:* minha recomendação na comparação dos cinco foi outra direção. O cliente escolheu
esta, e as duas ressalvas que eu tinha levantado contra ela foram endereçadas.

---

## 5. O que a revisão não fez

**`critique` completo.** O comando exige, por contrato, dois subagentes isolados por alvo — revisão
de design e evidência de detector, sem se verem. Rodei `audit` + `polish`, que é revisão e correção.
Se quiser o `critique` com pontuação heurística na página final, é um pedido à parte.

**Trocar a Fraunces.** É redesenho da identidade, e a decisão é do cliente (§3).

**Otimizar fontes e imagens para produção.** Base64 é a escolha certa para um arquivo que abre por
duplo clique e a errada para página publicada. A troca entra na lista de publicação, não na revisão.
