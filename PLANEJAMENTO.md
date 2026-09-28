# Planejamento da landing page — Marcos Massas

> **Estado:** o modelo 3 (Mesa farta) foi escolhido e virou a página de produção, em
> `modelos/03-mesa/index.html`. Ele carrega a logomarca, os dados reais de São Paulo e do WhatsApp,
> e **não tem formulário** — a conversão é exclusivamente WhatsApp.

Documento de estratégia. O conteúdo literal está em `conteudo/copy-base.md`; os fatos que não podem
ser inventados estão em `PRODUCT.md`; a medição está em `CONFIGURACAO-ANALYTICS.md`.

---

## 1. A decisão que a página precisa provocar

Um dono de lanchonete trocar de fornecedor é uma decisão de risco: se o salgado mudar de padrão, o
cliente dele reclama no balcão, não no nosso. Então a página não vende "qualidade" — isso todo
fornecedor promete. Ela vende **previsibilidade** e remove o atrito de começar.

Conversão = **conversa iniciada no WhatsApp**. Não é download, não é cadastro, não é ligação.

## 2. Público

**Primário — food service (B2B).** Lanchonete, padaria, bar, buffet, conveniência, cozinha
industrial. Decide rápido, compara preço, mas troca de fornecedor por constância e atendimento.
Está no celular, no meio do turno.

**Secundário — consumidor final.** Compra para o freezer, festa ou fim de semana. Entra na
página, mas não lidera: ganha um bloco próprio, claramente separado, para não diluir a mensagem B2B.

Essa separação em bloco é o que evita o erro clássico da LP híbrida: falar com os dois ao mesmo
tempo e não convencer nenhum.

## 3. Posicionamento

> Nhoques, esfihas e salgados do mesmo fornecedor.

O mecanismo é literal e verificável: a fábrica produz as três linhas. O comprador que hoje mantém
dois ou três fornecedores resolve tudo com **um pedido, uma entrega, uma nota**. Não é uma promessa
de marketing — é a descrição do que a empresa faz.

## 4. Objeções reais, e onde cada uma é respondida

Toda seção da página existe para derrubar uma objeção específica. Se uma seção não derruba nenhuma,
ela sai.

| Objeção do comprador | Onde a página responde |
|---|---|
| "Será que atendem minha cidade?" | Linha de apoio no hero, e a pergunta correspondente no FAQ |
| "O que exatamente vocês têm?" | Seção das três linhas, com os itens de catálogo nomeados |
| "Vai mudar de padrão depois do segundo pedido?" | Seção "o que muda quando é tudo da mesma fábrica" |
| "Qual o pedido mínimo? Vou ter que comprar demais?" | Hero, bloco de revenda e FAQ |
| "Quanto tempo demora para chegar?" | Hero, passo 3 do pedido e FAQ |
| "Quanto tempo dura no freezer?" | FAQ |
| "Emitem nota fiscal?" | Passo 3 e FAQ |
| "Vou ter que falar com representante?" | Seção do fornecedor único, item "você fala com quem produz" |
| "É trabalhoso pedir?" | Seção "como funciona o pedido" — foto do caderno, áudio ou texto |
| "Como recebo o preço?" | CTA final e FAQ — tabela pelo WhatsApp, sem cadastro |

## 5. Arquitetura da página

Ordem de leitura, e a função de conversão de cada seção:

| # | Seção | Função |
|---|---|---|
| 0 | **Cabeçalho** | Marca e orientação. Fixo no desktop, com âncoras para as quatro seções que respondem as objeções principais. No celular fica estático e só com a marca: quatro âncoras espremidas viram ruído, e 60px de tela a cada rolagem é caro num aparelho. Sem CTA próprio — o botão flutuante já é a via permanente, e dois botões idênticos na mesma tela competem entre si. |
| 1 | **Hero** | Diz o que é e para quem, em uma linha. Coloca a ação primária acima da dobra. |
| 2 | **As três linhas** | Prova que o catálogo é real, nomeando os itens. Substitui "temos variedade". |
| 3 | **Por que um fornecedor só** | O argumento central. Converte quem já tem fornecedor. |
| 4 | **Como funciona o pedido** | Remove o atrito de começar. Sequência real de 3 passos. |
| 5 | **Revenda e consumidor final** | Encaminha os dois públicos sem misturar as mensagens. |
| 6 | **Prova social** | Seis avaliações reais do Google, com 5 estrelas, transcritas na íntegra. Texto de verdade, não captura de tela: nítido em qualquer tela, lido por leitor de tela e pelo Google, e reflui no celular. |
| 7 | **FAQ** | Recolhe as objeções que sobraram, sem inchar as seções de cima. |
| 8 | **Chamada final** | Campo vermelho cheio, única cor plena da página. Segunda chance de conversão, para quem lê tudo antes de agir, com os dados que qualificam a decisão ao lado. |
| 9 | **Rodapé** | Dados de negócio e confiança. Reserva espaço para o botão flutuante. |

**Botão flutuante de WhatsApp** acompanha toda a rolagem, no canto inferior direito. Na prática é a
seção mais convertida da página, e por isso tem `origem: flutuante` própria na medição — dá para
saber quanto dele veio.

## 6. Estratégia de CTA

**Primária, repetida:** falar no WhatsApp, com mensagem pré-preenchida diferente por seção. Quem
clica em "ver o catálogo" já chega escrevendo sobre catálogo; quem clica no CTA final já chega
falando da lista. Isso encurta a conversa e aumenta a chance de resposta.

**Não há ação secundária.** O cliente optou por remover o formulário: a página inteira converge
para o WhatsApp. O custo dessa escolha é real e vale registrar — quem está no desktop e não quer
abrir o WhatsApp fica sem caminho alternativo. Em troca, não há nenhuma disputa de atenção com a
ação principal, o que é a vantagem de ter uma só.

## 7. Plano de medição

Detalhes de implementação em `CONFIGURACAO-ANALYTICS.md`.

**Métrica de norte:** `whatsapp_click`. É a conversão principal no GA4 e a que o Ads otimiza.

**Métricas de apoio:** `scroll_depth` e `origem` — esta última responde qual seção da página
realmente gera contato. Não existe evento de formulário: a página não tem um, e configurar uma
conversão que nunca dispara engana o lance do Ads.

**A primeira pergunta a responder depois de publicar:** quanto do `whatsapp_click` vem do botão
flutuante contra o hero. Se o flutuante dominar com folga, o hero não está convencendo e o problema
é de copy, não de design.

## 8. Ativos que o cliente precisa produzir

> **Duas já chegaram.** As fotos 8 e 9 estão na página. Vieram em 1408×768 (1,83), então essas duas
> molduras usam **16:9** em vez de 4:3 — cortar para 4:3 comeria 27% da largura e, na foto de casa,
> decepava a família ou a anfitriã. Os PNG de 1,7 MB foram convertidos para JPEG de ~127 KB.

Nenhuma foto foi inventada. Cada lugar que pede imagem está com **moldura de placeholder rotulada,
na proporção final**. Lista para produção:

| # | Foto | Proporção | Onde entra |
|---|---|---|---|
| 1 | Balcão montado com as três linhas servidas | 4:3 | Hero |
| 2 | Bandeja de salgados crus congelados, vista de cima | 1:1 | Linha de salgados |
| 3 | Nhoque fresco polvilhado, close | 1:1 | Linha de nhoques |
| 4 | Esfihas saindo do forno | 1:1 | Linha de esfihas |
| 5 | Entrega ou embalagem com etiqueta — **o produto é embalado em plástico, não em caixa** | 3:2 | Como funciona o pedido |
| ~~8~~ | ~~Um negócio servindo os nossos produtos~~ — **entregue** (`imagens/negocio.jpg`) | 16:9 | Para o seu negócio |
| ~~9~~ | ~~Alguém cozinhando em casa~~ — **entregue** (`imagens/casa.jpg`) | 16:9 | Para a sua casa |
| 10 | Pedido montado, pronto para sair — sobre o campo vermelho, então uma foto de fundo claro ou recortada funciona melhor | 4:3 | Chamada final |
| 6 | 4 logotipos de clientes de balcão | 3:2 | Prova social |
| ~~7~~ | ~~2 depoimentos~~ — **entregue**: 6 avaliações do Google, transcritas verbatim | — | Prova social |

**Já preenchidos:** cidade (São Paulo), região atendida (região metropolitana de São Paulo),
WhatsApp ((11) 93953-0387), endereço completo (Rua Manuel Soares, 4A — Jardim Piratininga, São Paulo/SP, CEP 03716-190),
horário (segunda a sexta, das 7h às 17h) e CNPJ (32.734.348/0001-07).

**Ainda a preencher:** só os identificadores de medição — `[CLARITY_ID]`, `[DOMINIO]` e
`[TOKEN_SEARCH_CONSOLE]`. Todo o conteúdo da página está completo.

Enquanto não vierem, os placeholders ficam visíveis de propósito. Uma landing page de captação com
prazo ou depoimento inventado não é um rascunho — é um problema jurídico e de reputação.

## 9. Os 5 modelos

Cinco mundos visuais sobre exatamente o mesmo conteúdo e a mesma medição, para a escolha ser de
design e não de conteúdo.

| # | Modelo | Ideia |
|---|---|---|
| 1 | **Massa viva** | Orgânico: formas da massa e da farinha, contornos irregulares, feitura à mão |
| 2 | **Balcão** | O balcão real: azulejo, letreiro esmaltado, etiqueta de preço |
| 3 | **Mesa farta** | Editorial gastronômico: mesa vista de cima, o produto lidera |
| 4 | **Forno** | Herança árabe-brasileira da esfiha e o calor do forno |
| 5 | **Encarte** | O encarte brasileiro de atacado: o mais comercial e o mais B2B |

Nenhum deles usa estética industrial — restrição declarada pelo cliente.

## 10. Depois de escolher um modelo

1. Preencher os dados reais e trocar as molduras pelas fotos.
2. Publicar em domínio próprio com HTTPS.
3. Substituir os IDs de medição e validar no modo de visualização do GTM.
4. Verificar a propriedade no Search Console.
5. Marcar `whatsapp_click` como conversão principal e importar no Ads.
6. Só então subir campanha. Campanha em página sem conversão configurada gasta sem aprender.
