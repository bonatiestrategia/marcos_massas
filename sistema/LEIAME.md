# Controle de Marmitas

Sistema para organizar custos, preços e vendas de marmitas congeladas.
Funciona no celular e no computador pelo mesmo link, e guarda os dados numa
planilha do Google Drive da dona do negócio.

## Telas

| Tela | Para que serve |
|---|---|
| **Vendas** | Registrar pedidos, ver o que falta receber e entregar, mandar o resumo pelo WhatsApp. Tem também a lista de **Clientes** com o histórico de cada um. |
| **Marmitas** | O cardápio. Mostra custo, lucro e margem de cada marmita e avisa quando a margem está baixa. |
| **Receitas** | Preparações com vários ingredientes (ex.: purê). Calcula o custo por 100 g. |
| **Ingredientes** | Tudo o que é comprado: ingredientes, embalagens e temperos, com preço, perda na limpeza e rendimento no cozimento. |
| **Resultado** | DRE do mês: vendas, custo das marmitas, custos fixos e lucro. Mostra também os sabores mais vendidos e os melhores clientes. |

## Como os custos são calculados

1. **Ingrediente pronto** = preço pago ÷ quantidade do pacote ÷ (1 − perda na limpeza) ÷ fator de cozimento.
   Ex.: frango a R$ 19,90/kg, perde 6,5% na limpeza e fica com 72% do peso depois de grelhado: o kg pronto custa R$ 29,56.
2. **Receita** = soma dos ingredientes da leva ÷ quanto a leva rende pronta.
3. **Marmita** = soma dos componentes (peso pronto) + temperos + embalagem.
4. **Pedido** guarda o custo do dia em que foi feito. Se um preço mudar depois, o histórico e o DRE dos meses passados não mudam.
5. **Margem** = (preço − custo) ÷ preço. Acima de 40% é boa; entre 25% e 40% é apertada; abaixo de 25% é baixa.

Os temperos entram como um valor fixo por marmita (começa em R$ 0,40). Depois
de um mês, o ideal é somar tudo o que foi gasto com temperos e óleo e dividir
pelo número de marmitas feitas, e atualizar esse valor na tela de Ingredientes.

## Instalação (uma vez só, uns 10 minutos)

Faça tudo **logado na conta Google de quem vai usar o sistema**.

### 1. Criar a planilha
1. Abra [sheets.new](https://sheets.new) para criar uma planilha em branco.
2. Dê um nome a ela, por exemplo **Marmitas – Sistema**.

### 2. Colar o código
1. Na planilha, vá em **Extensões → Apps Script**.
2. No arquivo **Código.gs** que já vem aberto, apague tudo e cole o conteúdo do arquivo [`Code.gs`](Code.gs).
3. Clique no **+** ao lado de "Arquivos", escolha **HTML** e dê o nome **Index** (exatamente assim, com I maiúsculo).
4. Apague o conteúdo que vem pronto e cole o conteúdo do arquivo [`Index.html`](Index.html).
5. Clique no ícone de disquete para **salvar**.

### 3. Ajustar o fuso horário
1. Ainda no Apps Script, clique na engrenagem (**Configurações do projeto**).
2. Em **Fuso horário**, escolha **(GMT-03:00) Horário de Brasília** (ou o da cidade).

### 4. Publicar o app
1. Clique em **Implantar → Nova implantação**.
2. Na engrenagem ao lado de "Selecione o tipo", escolha **App da Web**.
3. Preencha:
   - **Descrição:** Controle de Marmitas
   - **Executar como:** Eu
   - **Quem pode acessar:** Somente eu
4. Clique em **Implantar** e depois em **Autorizar acesso**.
5. O Google vai mostrar um aviso de "app não verificado". Isso é normal para um app feito para uso próprio. Clique em **Avançado → Acessar Controle de Marmitas (não seguro)** e depois em **Permitir**.
6. Copie o **URL do app da Web**. Esse é o link do sistema.

### 5. Abrir no computador e no celular
- **Computador:** abra o link e salve nos favoritos.
- **Celular (Android):** abra o link no Chrome, logado na mesma conta Google. No menu ⋮, toque em **Adicionar à tela inicial**.
- **iPhone:** abra o link no Safari, toque em **Compartilhar → Adicionar à Tela de Início**.

Na primeira vez que o link é aberto, o sistema cria as abas na planilha e já
cadastra os ingredientes, a receita do purê e as duas marmitas que passamos.

## Uso no dia a dia

- **Preço de ingrediente mudou?** Tela Ingredientes → toque no ingrediente → altere o preço → Salvar. Receitas e marmitas recalculam sozinhas.
- **Quer o rendimento exato da cozinha?** No ingrediente, abra "Calcular pelo teste de rendimento" e digite os três pesos (como comprou, limpo, pronto).
- **Cliente pediu quantidades diferentes?** No pedido, toque em "Ajustar quantidades para este cliente". O sistema mostra o custo e sugere um preço com a mesma margem do cardápio.
- **Custos fixos:** na tela Resultado, clique em "+ Gás", "+ Energia elétrica" etc. e digite o valor do mês. No mês seguinte, use "Copiar custos do mês anterior".
- **Algo parou de ser usado?** Abra e clique em "Desativar". Ele some das listas, mas continua nos pedidos antigos.

## Cuidados

- A planilha é o banco de dados. Pode abrir para consultar, mas **não renomeie as abas nem as colunas**.
- **Backup:** de vez em quando, na planilha, use **Arquivo → Fazer uma cópia**.
- Se der erro ao salvar, confira a internet e tente de novo.

## Atualizar o sistema depois

Quando houver uma versão nova do código:
1. Abra a planilha → **Extensões → Apps Script** e cole o código novo nos arquivos.
2. Vá em **Implantar → Gerenciar implantações** → lápis (editar) → em "Versão", escolha **Nova versão** → **Implantar**.

O link continua o mesmo.

## Dar acesso a outra pessoa (opcional)

Com "Quem pode acessar: Somente eu", só a dona da conta usa o sistema. Para
outra pessoa usar também:
1. Compartilhe a planilha com ela como **Editor**.
2. Em **Gerenciar implantações**, mude para **Executar como: Usuário que acessa o app da Web** e **Quem pode acessar: Qualquer pessoa com Conta do Google**.

Assim, só quem tem acesso à planilha consegue ver e salvar dados.

## Testar sem instalar

Abrir o `Index.html` direto no navegador mostra o **modo demonstração**, com
alguns pedidos de exemplo. Nesse modo os dados ficam só naquele navegador e
não vão para planilha nenhuma.
