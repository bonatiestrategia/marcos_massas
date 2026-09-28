# Briefing comum dos 5 modelos — leia antes de escrever qualquer linha

Você constrói **um** dos 5 modelos de landing page da Marcos Massas. Os outros 4 estão sendo
construídos em paralelo por outros agentes, sobre exatamente este mesmo conteúdo. O que diferencia
o seu é **só o design**.

## Leia exatamente estes arquivos, e nenhum outro

1. `.claude/skills/frontend-design/SKILL.md` — o processo de design que você vai seguir
2. `.claude/skills/impeccable/reference/craft-floor.md` — o piso de qualidade e os banimentos
3. `PRODUCT.md` — verdade de produto e o que não pode ser inventado
4. `conteudo/copy-base.md` — o texto da página, literal
5. `blocos/analytics-head.html`, `blocos/analytics-body.html`, `blocos/eventos.js`,
   `blocos/whatsapp-flutuante.html` — para colar

**Não leia mais nada.** A pasta `.claude/skills/impeccable/reference/` tem 35 arquivos; ler o resto
é gasto puro. Não pesquise na web. Não explore o repositório.

## Escopo travado

Você escreve **um único arquivo**: o `index.html` que o seu pacote nomeia. Autocontido — CSS em
`<style>` no `<head>`, ícones em SVG inline.

**Proibido:** criar ou editar qualquer arquivo fora do seu diretório; tocar na raiz, em `blocos/`,
`conteudo/`, `.claude/` ou `.agents/`; rodar `git`; instalar dependência.

## Processo — as duas passadas do frontend-design, obrigatórias

**Passada 1 — plano.** Antes de qualquer HTML, escreva um plano curto:
- 4 a 6 hex nomeados (as 4 da marca mais o que você derivar)
- as tipografias e o papel de cada uma
- o conceito de layout, com wireframe ASCII
- os princípios do que torna *este* modelo único

**Revisão.** Releia o plano contra o briefing. Qualquer parte que você produziria igual para
qualquer outra página do ramo é default, não decisão — reescreva e **declare o que mudou e por quê**.

**Passada 2 — código.** Só agora escreva o HTML, seguindo o plano revisado.

## Conteúdo

Use `conteudo/copy-base.md` **literalmente**. Não reescreva o texto, não invente headline nova, não
acrescente seção. A ordem das 9 seções está em `copy-base.md` e no `PLANEJAMENTO.md`.

**Nunca invente** preço, prazo, depoimento, logotipo, selo, número de clientes ou anos de mercado.
Os placeholders `[ASSIM]` ficam visíveis no HTML de propósito.

**Imagens:** não há fotografia disponível. Todo lugar que pede foto recebe uma **moldura de
placeholder com a proporção exata** (use `aspect-ratio`) e um **rótulo visível** dizendo o que vai
ali. A moldura pertence ao seu mundo visual — não é um retângulo cinza genérico. E não é um
retângulo arredondado com sombra fingindo ser conteúdo, que é banido.

## Colar verbatim — não reescreva estes blocos

| Bloco | Onde |
|---|---|
| `blocos/analytics-head.html` | dentro do `<head>`, o mais alto possível |
| `blocos/analytics-body.html` | primeiro elemento depois de `<body>` |
| `blocos/whatsapp-flutuante.html` | antes de `</body>` |
| `blocos/eventos.js` | dentro de um `<script>` antes de `</body>`, depois do bloco do botão |

Do bloco do botão flutuante você pode reescrever **apenas os valores das variáveis CSS em `:root`**
para encaixar no seu mundo. Estrutura, atributos de acessibilidade e `data-wa` ficam como estão.

## Contrato do HTML

- `<html lang="pt-BR" data-modelo="SEU-SLUG">`
- Todo link de WhatsApp leva `data-wa="<origem>"` — origens: `hero`, `catalogo`, `revenda`,
  `consumidor`, `final` (o `flutuante` já vem no bloco). Cada um com a mensagem pré-preenchida da
  tabela no fim do `copy-base.md`, com `target="_blank" rel="noopener"`.
- O formulário leva `data-form-orcamento`, e os campos usam os `name` da tabela do `copy-base.md`.
- O `<footer>` leva a classe `mm-rodape`. **Sem isso o botão flutuante cobre o fim da página no
  celular** — é o defeito mais comum deste componente.
- `<title>` e `<meta name="description">` do `copy-base.md`.

## Restrições de design

- **Cores:** `#e61e20` vermelho, `#f6e20d` amarelo, `#ffffff` branco, `#e5e5e5` cinza. Vermelho e
  amarelo são fortes: use hierarquia, não onipresença. Você pode derivar tons mais escuros ou mais
  claros dessas matizes para texto e superfície — o que não pode é trazer uma matiz estrangeira
  como protagonista.
- **Contraste ≥ 4.5:1** em texto de corpo e placeholder, ≥ 3:1 em texto grande. Texto sobre
  `#f6e20d` precisa ser tinta escura. Branco sobre `#e61e20` dá ~4.4:1 e **reprova** em texto
  pequeno — escureça o vermelho para texto pequeno sobre ele, ou aumente o corpo. Meça, não presuma.
- **Duas famílias tipográficas no máximo**, do Google Fonts, escolhidas para esta direção. Sempre
  com pilha de fallback real. Proibido usar face de display do sistema (Impact, Arial Black) como
  voz de display.
- **Responsivo até 390px.** Nenhum scroll horizontal. Alvos de toque ≥ 44×44.
- **Foco de teclado visível** em tudo, tematizado pela paleta. `prefers-reduced-motion` respeitado.
- **Um único momento de motion autoral.** Não uma entrada fade-up idêntica em cada seção — isso é o
  default genérico e se lê como gerado por IA.
- **Superfícies do navegador** tematizadas: `::selection`, `caret-color`, anel de foco.
- **Ícones em SVG autoral**, traço e peso consistentes. **Sem emoji.**

## Banidos (craft floor + frontend-design)

Kicker/eyebrow acima de heading · numeração 01/02/03 onde não há sequência real (a seção "como
funciona o pedido" **é** sequência — lá pode) · cards iguais de ícone+título+texto como estrutura da
página · card dentro de card · gradient text · glass/blur decorativo · `border-left` colorido acima
de 1px · `box-shadow: 4px 4px 0` fora de um mundo neobrutalista de verdade · monospace como fantasia
de "técnico" · destacar uma única palavra do headline em outra cor · ALL-CAPS em labels · fundo creme
`#F4F1EA` com serifada de alto contraste e acento terracota `#D97757` · sparkline, anel de progresso
e retângulo arredondado com sombra fingindo conteúdo.

**E, por decisão do cliente: nenhuma estética industrial em nenhum dos cinco.** Sem estêncil de
caixa, sem fita de sinalização, sem ficha técnica como sistema visual, sem paleta de galpão.

## Verificação — uma rodada em lote, no máximo duas

Já existe um verificador pronto. **Não escreva o seu.**

```bash
cd /home/user/marcos_massas
node blocos/verificar.mjs modelos/SEU-DIRETORIO/index.html
```

Ele roda desktop (1440×900) e mobile (390×844) num render só e devolve JSON com: erros de console,
scroll horizontal e os culpados, falhas de contraste com o valor medido, alvos de toque pequenos,
estado do botão flutuante, se o botão cobre o fim da página, se o clique empurra `whatsapp_click`
para o `dataLayer`, e a integridade da camada de medição. As capturas ficam em
`.verificacao/<seu-modelo>/`.

**Disciplina:** rode **uma vez**, olhe as capturas, corrija **tudo** o que ele apontou de uma vez,
rode **no máximo mais uma vez** para confirmar, e pare. Não entre em laço de auto-QA — é aí que se
queima token sem melhorar o resultado. Termine com `"erros": 0`.

## Relatório final — curto

1. O plano de design (paleta nomeada, tipografia, conceito de layout)
2. O que a revisão contra o briefing mudou, e por quê
3. As fontes escolhidas e por que estas
4. Qual é o seu único momento de motion
5. O resultado final do verificador (erros e avisos)
6. O que ficou como placeholder

**Não cole o HTML no relatório.**
