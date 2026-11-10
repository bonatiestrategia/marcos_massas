/**
 * Sistema de gestão de marmitas — servidor (Google Apps Script).
 *
 * Os dados ficam na própria planilha onde este script está instalado,
 * uma aba por tabela. O app (Index.html) chama as funções públicas
 * abaixo via google.script.run.
 */

// Colunas de cada aba. A ordem define a ordem das colunas na planilha.
var TABELAS = {
  Ingredientes: ['id', 'nome', 'categoria', 'unidade', 'qtdPacote', 'preco', 'perdaLimpeza', 'fatorCoccao', 'ativo', 'atualizadoEm'],
  Receitas: ['id', 'nome', 'rendimento', 'itens', 'ativo', 'atualizadoEm'],
  Marmitas: ['id', 'nome', 'tamanho', 'preco', 'itens', 'ativo', 'atualizadoEm'],
  Clientes: ['id', 'nome', 'telefone', 'endereco', 'obs', 'ativo', 'atualizadoEm'],
  Pedidos: ['id', 'data', 'clienteId', 'clienteNome', 'itens', 'subtotal', 'desconto', 'taxaEntrega', 'total', 'custoTotal', 'pagamento', 'pago', 'entregue', 'obs', 'atualizadoEm'],
  CustosFixos: ['id', 'mes', 'descricao', 'valor', 'atualizadoEm']
};

// Colunas guardadas como texto puro, para a planilha não converter
// "2026-11" em data nem telefone em número.
var COLUNAS_TEXTO = ['id', 'nome', 'categoria', 'unidade', 'itens', 'clienteId', 'clienteNome', 'telefone',
  'endereco', 'obs', 'data', 'mes', 'descricao', 'pagamento', 'atualizadoEm'];
var COLUNAS_JSON = ['itens'];
var COLUNAS_SIM_NAO = ['ativo', 'pago', 'entregue'];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Controle de Marmitas')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

/** Lê todas as tabelas de uma vez. Cria as abas que ainda não existem. */
function carregarTudo() {
  garantirAbas_();
  var saida = {};
  Object.keys(TABELAS).forEach(function (nome) { saida[nome] = ler_(nome); });
  return saida;
}

/** Cria ou atualiza um registro (procura pelo id). Devolve o registro salvo. */
function salvar(tabela, registro) {
  validarTabela_(tabela);
  var trava = LockService.getScriptLock();
  trava.waitLock(20000);
  try {
    var aba = aba_(tabela);
    registro.atualizadoEm = new Date().toISOString();
    var linha = linhaDoId_(aba, registro.id);
    if (linha < 0) linha = aba.getLastRow() + 1;
    formatarTexto_(aba, tabela, linha, 1);
    aba.getRange(linha, 1, 1, TABELAS[tabela].length).setValues([paraLinha_(tabela, registro)]);
    return registro;
  } finally {
    trava.releaseLock();
  }
}

/** Apaga um registro de verdade (usado em pedidos e custos fixos). */
function excluir(tabela, id) {
  validarTabela_(tabela);
  var trava = LockService.getScriptLock();
  trava.waitLock(20000);
  try {
    var aba = aba_(tabela);
    var linha = linhaDoId_(aba, id);
    if (linha > 0) aba.deleteRow(linha);
    return id;
  } finally {
    trava.releaseLock();
  }
}

/**
 * Grava os dados iniciais, mas só se a planilha estiver vazia.
 * Assim nunca sobrescreve o que ela já cadastrou.
 */
function popularInicial(dados) {
  garantirAbas_();
  var trava = LockService.getScriptLock();
  trava.waitLock(20000);
  try {
    var vazia = Object.keys(TABELAS).every(function (nome) { return aba_(nome).getLastRow() <= 1; });
    if (!vazia) return false;
    var agora = new Date().toISOString();
    Object.keys(dados).forEach(function (tabela) {
      if (!TABELAS[tabela] || !dados[tabela].length) return;
      var aba = aba_(tabela);
      var linhas = dados[tabela].map(function (r) { r.atualizadoEm = agora; return paraLinha_(tabela, r); });
      formatarTexto_(aba, tabela, 2, linhas.length);
      aba.getRange(2, 1, linhas.length, TABELAS[tabela].length).setValues(linhas);
    });
    return true;
  } finally {
    trava.releaseLock();
  }
}

// ---------- funções internas ----------

function validarTabela_(tabela) {
  if (!TABELAS[tabela]) throw new Error('Tabela desconhecida: ' + tabela);
}

function aba_(nome) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nome);
}

function garantirAbas_() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(TABELAS).forEach(function (nome) {
    var aba = planilha.getSheetByName(nome);
    if (!aba) {
      aba = planilha.insertSheet(nome);
      var cab = TABELAS[nome];
      aba.getRange(1, 1, 1, cab.length).setValues([cab]).setFontWeight('bold');
      aba.setFrozenRows(1);
    }
  });
}

function linhaDoId_(aba, id) {
  var ultima = aba.getLastRow();
  if (ultima < 2) return -1;
  var ids = aba.getRange(2, 1, ultima - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

function formatarTexto_(aba, tabela, linhaInicial, qtdLinhas) {
  TABELAS[tabela].forEach(function (col, i) {
    if (COLUNAS_TEXTO.indexOf(col) >= 0) {
      aba.getRange(linhaInicial, i + 1, qtdLinhas, 1).setNumberFormat('@');
    }
  });
}

function paraLinha_(tabela, r) {
  return TABELAS[tabela].map(function (col) {
    var v = r[col];
    if (v === undefined || v === null) return '';
    if (COLUNAS_JSON.indexOf(col) >= 0) return JSON.stringify(v);
    if (COLUNAS_SIM_NAO.indexOf(col) >= 0) return v ? 'sim' : 'não';
    if (COLUNAS_TEXTO.indexOf(col) >= 0) return String(v);
    return v;
  });
}

function ler_(tabela) {
  var aba = aba_(tabela);
  var cab = TABELAS[tabela];
  var ultima = aba.getLastRow();
  if (ultima < 2) return [];
  var valores = aba.getRange(2, 1, ultima - 1, cab.length).getValues();
  var fuso = Session.getScriptTimeZone();
  return valores.filter(function (l) { return l[0] !== ''; }).map(function (l) {
    var r = {};
    cab.forEach(function (col, i) {
      var v = l[i];
      if (v instanceof Date) v = Utilities.formatDate(v, fuso, col === 'mes' ? 'yyyy-MM' : 'yyyy-MM-dd');
      if (COLUNAS_JSON.indexOf(col) >= 0) {
        try { v = v ? JSON.parse(v) : []; } catch (e) { v = []; }
      } else if (COLUNAS_SIM_NAO.indexOf(col) >= 0) {
        v = v === true || String(v).toLowerCase() === 'sim' || String(v).toLowerCase() === 'true';
      } else if (COLUNAS_TEXTO.indexOf(col) >= 0) {
        v = String(v);
      } else {
        v = v === '' ? 0 : Number(String(v).replace(',', '.'));
      }
      r[col] = v;
    });
    return r;
  });
}
