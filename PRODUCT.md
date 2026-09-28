# PRODUCT.md — Marcos Massas

> Verdade de produto. Este arquivo governa fatos, não estética.
> Campos marcados `[INDEFINIDO]` **não podem ser inventados** por nenhum modelo, agente ou copy.

## Platform

`web`

## Stack

HTML + CSS estáticos, um `index.html` autocontido por modelo. Sem build, sem framework, sem
dependência em runtime. Escolha registrada nesta sessão para permitir comparação lado a lado de 5
maquetes abrindo com duplo clique.

## O que a empresa é

Marcos Massas fabrica e vende **nhoques, esfihas e salgados**. O **nhoque é o carro-chefe** e
lidera a comunicação. Fabricação própria; vende para
revenda (food service) e também direto ao consumidor final.

## Usuário primário e a cena real de uso

**Dono ou gerente de lanchonete, padaria, bar, buffet ou conveniência**, procurando fornecedor.

A cena: ele está **no celular, no meio do turno**, com o balcão funcionando. Ele não vai ler uma
página inteira. Ele quer, em segundos, saber (1) se atendem a cidade dele, (2) o que exatamente
está no catálogo, (3) como falar com um humano agora. O primeiro toque real é quase sempre o
WhatsApp, não um formulário — e quase nunca no desktop.

**Usuário secundário:** consumidor final da região comprando para casa, festa ou
freezer. Importa, mas não lidera a página.

## Mecanismo — o que diferencia

Fábrica própria das três linhas ao mesmo tempo. O comprador de food service resolve salgado, nhoque
e esfiha com **um fornecedor, um pedido, uma entrega** — em vez de três. Constância de padrão e de
rendimento entre pedidos é o que ele realmente compra, mais do que preço unitário.

## O trabalho da landing page

Modo **Persuade**. O visitante decide e age. Sucesso = conversa iniciada no WhatsApp.

- Conversão **única**: WhatsApp, com mensagem pré-preenchida por seção.
- **Não há formulário.** Decisão do cliente: a página inteira converge para o WhatsApp. Nenhuma
  conversão de `form_submit` deve ser configurada — conversão que nunca dispara engana o lance do Ads.
- **Botão flutuante de WhatsApp fixo no canto inferior direito.**

## Logomarca

Oval vermelho com degradê, "MARCOS" em letra cartunesca amarela contornada de preto e "Massas" em
branco contornado. Mark popular, de balcão. Fonte: PDF vetorial do cliente; extraído em
`imagens/logo-marcos-massas.png` (388×212) e `imagens/favicon.png`.

O degradê pertence ao oval e **não se repete** em nenhum outro elemento da página.

## Compromissos de marca (não negociáveis)

| Papel | Hex |
|---|---|
| Primária — vermelho | `#e61e20` |
| Secundária — amarelo | `#f6e20d` |
| Branco | `#ffffff` |
| Cinza | `#e5e5e5` |

Nome da marca: **Marcos Massas**.

## Decisão de catálogo registrada

O **enroladinho de presunto e queijo** fica listado na linha de **Esfihas**, cujo apoio diz
"Fechadas". Levantei que ele não é esfiha, e o cliente optou por manter assim.
**Não é erro de digitação — não mover para Salgados.**

Depois disso o cliente tirou "Abertas" do apoio: a linha só tem esfihas fechadas. Isso reduziu o
atrito, porque o enroladinho é de fato um item fechado.

## Restrição estética declarada pelo cliente

**Nenhum modelo com estética industrial.** Sem estêncil de caixa, sem fita de sinalização, sem
ficha técnica como sistema visual, sem paleta de galpão. Pelo menos um modelo deve ser
explicitamente **orgânico**.

## Fatos confirmados pelo cliente

| Fato | Valor |
|---|---|
| Cidade-sede | **São Paulo** |
| Região atendida | **Região metropolitana de São Paulo** |
| WhatsApp | **(11) 93953-0387** — nos links `wa.me`, `5511939530387` |
| Endereço | **Rua Manuel Soares, 4A — Jardim Piratininga, São Paulo, SP** |
| Horário | **Segunda a sexta, das 7h às 17h** (`Mo-Fr 07:00-17:00` no schema.org) |
| CEP | **03716-190** — confirma São Paulo capital, zona leste |
| CNPJ | **32.734.348/0001-07** — dígitos verificadores conferidos |
| Pedido mínimo | **20 pacotes mistos** |
| Prazo de entrega | **Até 2 dias** após o pedido confirmado |
| Por embalagem | nhoques **500 g** · esfihas **8 unidades** · salgados **25 unidades** |
| Validade | **3 meses** congelado a −18 °C · **2 dias** na geladeira depois de descongelado |
| Esfihas | **Só fechadas** — a linha não tem esfiha aberta |
| Embalagem | **Plástico, não caixa.** A página não deve falar em "caixa fechada" |
| Salgados | **Já vão fritos e congelados** — o cliente só aquece. *Corrige a informação anterior de que iam crus para fritar.* |

## Fatos indefinidos — usar placeholder, nunca inventar

| Fato | Placeholder |
|---|---|
| Anos de operação | `[ANOS_MERCADO]` |
| Nº de clientes atendidos | `[QTD_CLIENTES]` |
| Domínio do site | `[DOMINIO]` |

**Proibido em qualquer modelo:** preço, nome de cliente, depoimento, selo, certificação, número de
unidades vendidas, prazo ou percentual que não venha desta tabela. A prova social **já tem material real**: seis avaliações públicas do Google, transcritas
verbatim (grafia, espaçamento e emoji preservados — são palavras de terceiros). **Não inventar nota
média nem total de avaliações**: só existem estas seis.

## Ativos indisponíveis nesta sessão

**Duas fotos já foram entregues pelo cliente** e estão na seção de públicos:
`imagens/negocio.jpg` (cozinha profissional) e `imagens/casa.jpg` (mesa em família). As duas em
16:9, que é a proporção nativa dos arquivos originais.

Os demais lugares que pedem foto seguem com **moldura de placeholder, proporção exata e rótulo
visível**. A lista de fotos a produzir está
em `PLANEJAMENTO.md`.

## Medição

GTM como contêiner único; GA4, Google Ads e Clarity disparados dentro dele. Search Console por meta
tag. Eventos em `blocos/eventos.js`. Detalhes em `CONFIGURACAO-ANALYTICS.md`.
