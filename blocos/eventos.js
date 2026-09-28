/* ============================================================================
   eventos.js — a camada que faz GA4 e Google Ads medirem de verdade.
   Cole VERBATIM em <script> antes de </body>. Não reescreva.

   Sem esta camada, "configurar GA4 e Ads" é só ter colado um script: haveria
   pageview e nada mais. É aqui que nasce a conversão que o Ads vai otimizar.

   CONTRATO COM O HTML — o modelo só precisa marcar os elementos:

     data-wa="hero"           em todo link de WhatsApp; o valor é a origem.
                              Origens em uso: flutuante, hero, catalogo,
                              revenda, consumidor, final.
     href="tel:…"             detectado sozinho, sem atributo.

   Nada aqui monta href: o link do WhatsApp é escrito no HTML e funciona com o
   JavaScript desligado. Este arquivo só observa.
   ========================================================================== */
(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  function empurrar(evento, dados) {
    window.dataLayer.push(Object.assign({ event: evento }, dados || {}));
  }

  /* --- WhatsApp: a conversão principal ------------------------------------ */
  document.addEventListener('click', function (e) {
    var alvo = e.target.closest('[data-wa]');
    if (!alvo) return;
    empurrar('whatsapp_click', {
      origem: alvo.getAttribute('data-wa') || 'indefinida',
      texto_botao: (alvo.textContent || '').trim().slice(0, 80) || alvo.getAttribute('aria-label') || ''
    });
  }, { passive: true });

  /* --- Telefone ------------------------------------------------------------ */
  document.addEventListener('click', function (e) {
    var alvo = e.target.closest('a[href^="tel:"]');
    if (alvo) empurrar('telefone_click', { numero: alvo.getAttribute('href').replace('tel:', '') });
  }, { passive: true });

  /* --- Profundidade de rolagem -------------------------------------------- */
  var marcos = [25, 50, 75, 100];
  var atingidos = {};
  var agendado = false;

  function medirRolagem() {
    agendado = false;
    var doc = document.documentElement;
    var rolavel = doc.scrollHeight - window.innerHeight;
    if (rolavel <= 0) return;
    var pct = ((window.scrollY || doc.scrollTop) / rolavel) * 100;
    for (var i = 0; i < marcos.length; i++) {
      var m = marcos[i];
      if (pct >= m && !atingidos[m]) {
        atingidos[m] = true;
        empurrar('scroll_depth', { profundidade: m });
      }
    }
  }

  window.addEventListener('scroll', function () {
    if (agendado) return;
    agendado = true;
    window.requestAnimationFrame(medirRolagem);
  }, { passive: true });

  /* --- Sinal de que a camada subiu ---------------------------------------- */
  empurrar('eventos_prontos', { modelo: document.documentElement.getAttribute('data-modelo') || '' });
})();
