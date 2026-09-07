/* ============================================================
   SETEMBRO AMARELO FDG — main.js
   Sem dependências externas. Tudo vanilla.
   ============================================================ */
(function () {
  'use strict';

  /* ==========================================================
     CONFIGURAÇÃO — ajuste aqui antes de publicar
     ========================================================== */
  var CONFIG = {
    // Número do WhatsApp comercial no formato internacional, só dígitos.
    // Ex.: 5511987654321  (55 = Brasil, 11 = DDD)
    whatsapp: '5500000000000',

    // Mês da campanha (0 = janeiro ... 8 = setembro) e último dia.
    campanhaMes: 8,
    campanhaDia: 30
  };

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ==========================================================
     1. HEADER — estado ao rolar
     ========================================================== */
  var header = $('#header');
  var topbar = $('#topbar');

  /* ==========================================================
     2. MENU MOBILE
     ========================================================== */
  var burger   = $('#burger');
  var nav      = $('#nav');
  var backdrop = $('#nav-backdrop');

  function openNav() {
    nav.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fechar menu');
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    backdrop.hidden = true;
    document.body.style.overflow = '';
  }
  function toggleNav() {
    nav.classList.contains('is-open') ? closeNav() : openNav();
  }

  if (burger) {
    burger.addEventListener('click', toggleNav);
    backdrop.addEventListener('click', closeNav);
    $$('#nav a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeNav(); burger.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 980 && nav.classList.contains('is-open')) closeNav();
    });
  }

  /* ==========================================================
     3. ROLAGEM SUAVE COM COMPENSAÇÃO DO HEADER
     ========================================================== */
  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      var offset = (header ? header.offsetHeight : 0) + 12;
      var y = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({ top: y < 0 ? 0 : y, behavior: reduced ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });

  /* ==========================================================
     4. REVEAL AO ROLAR
     ========================================================== */
  var revealables = $$('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); revealObs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { revealObs.observe(el); });
  }

  /* ==========================================================
     5. CONTADORES NUMÉRICOS
     ========================================================== */
  function animateCount(el) {
    var end    = parseFloat(el.getAttribute('data-count')) || 0;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dur    = 1500;

    if (reduced) { el.textContent = prefix + end.toLocaleString('pt-BR') + suffix; return; }

    var t0 = null;
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(end * eased);
      el.textContent = prefix + val.toLocaleString('pt-BR') + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var counters = $$('[data-count]');
  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCount);
  } else {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); countObs.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countObs.observe(el); });
  }

  /* ==========================================================
     6. SCROLLSPY DO MENU
     ========================================================== */
  var navLinks = $$('.nav__link');
  var spySections = navLinks
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  if (spySections.length && 'IntersectionObserver' in window) {
    var spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    spySections.forEach(function (s) { spyObs.observe(s); });
  }

  /* ==========================================================
     7. ACORDEÃO DO FAQ
     ========================================================== */
  $$('.acc__head').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var open  = btn.getAttribute('aria-expanded') === 'true';

      // fecha os demais (comportamento de acordeão único)
      $$('.acc__head').forEach(function (other) {
        if (other === btn) return;
        other.setAttribute('aria-expanded', 'false');
        var p = document.getElementById(other.getAttribute('aria-controls'));
        if (p) p.classList.remove('is-open');
      });

      btn.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('is-open', !open);
    });
  });

  /* ==========================================================
     8. MARQUEE DE LOGOS — duplica o grupo p/ loop contínuo
     ========================================================== */
  var track = $('#marquee-track');
  if (track && track.children.length === 1) {
    var clone = track.children[0].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  }

  /* ==========================================================
     9. CONTAGEM REGRESSIVA DA CAMPANHA
     ========================================================== */
  function campaignDeadline() {
    var now = new Date();
    var d = new Date(now.getFullYear(), CONFIG.campanhaMes, CONFIG.campanhaDia, 23, 59, 59);
    if (d.getTime() <= now.getTime()) {
      d = new Date(now.getFullYear() + 1, CONFIG.campanhaMes, CONFIG.campanhaDia, 23, 59, 59);
    }
    return d;
  }

  var deadline = campaignDeadline();
  var cdD = $('#cd-d'), cdH = $('#cd-h'), cdM = $('#cd-m'), cdS = $('#cd-s');
  var cdTop = $('#topbar-countdown');
  var pad = function (n) { return String(n).padStart(2, '0'); };

  function tick() {
    var diff = deadline.getTime() - Date.now();
    if (diff < 0) { deadline = campaignDeadline(); diff = deadline.getTime() - Date.now(); }

    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;

    if (cdD) cdD.textContent = pad(d);
    if (cdH) cdH.textContent = pad(h);
    if (cdM) cdM.textContent = pad(m);
    if (cdS) cdS.textContent = pad(sec);
    if (cdTop) cdTop.textContent = d + 'd ' + pad(h) + 'h ' + pad(m) + 'm';
  }
  tick();
  setInterval(tick, 1000);

  /* ==========================================================
     10. MÁSCARA DE TELEFONE (BR)
     ========================================================== */
  var tel = $('#f-tel');
  if (tel) {
    tel.addEventListener('input', function () {
      var v = tel.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10)      v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      else if (v.length > 6)  v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      else if (v.length > 2)  v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      else if (v.length > 0)  v = v.replace(/(\d{0,2})/, '($1');
      tel.value = v;
    });
  }

  /* ==========================================================
     11. FORMULÁRIO → WHATSAPP
     ========================================================== */
  var form   = $('#lead-form');
  var status = $('#form-status');

  function setError(input, msg) {
    var field = input.closest('.field') || input.closest('.consent');
    var box = document.querySelector('[data-err-for="' + input.id + '"]');
    if (field) field.classList.add('has-error');
    if (box) box.textContent = msg;
  }
  function clearError(input) {
    var field = input.closest('.field') || input.closest('.consent');
    var box = document.querySelector('[data-err-for="' + input.id + '"]');
    if (field) field.classList.remove('has-error');
    if (box) box.textContent = '';
  }

  function validate() {
    var ok = true, first = null;

    var required = [
      { el: $('#f-nome'),    msg: 'Informe seu nome.' },
      { el: $('#f-empresa'), msg: 'Informe o nome da empresa.' },
      { el: $('#f-email'),   msg: 'Informe um e-mail válido.' },
      { el: $('#f-tel'),     msg: 'Informe um WhatsApp com DDD.' },
      { el: $('#f-porte'),   msg: 'Selecione o tamanho da equipe.' }
    ];

    required.forEach(function (item) {
      var el = item.el;
      if (!el) return;
      clearError(el);
      var val = (el.value || '').trim();
      var bad = !val;

      if (!bad && el.id === 'f-email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
      if (!bad && el.id === 'f-tel')   bad = val.replace(/\D/g, '').length < 10;

      if (bad) { setError(el, item.msg); ok = false; first = first || el; }
    });

    var lgpd = $('#f-lgpd');
    clearError(lgpd);
    if (!lgpd.checked) {
      setError(lgpd, 'É necessário autorizar o contato para prosseguir.');
      ok = false; first = first || lgpd;
    }

    if (first) first.focus();
    return ok;
  }

  if (form) {
    // limpa o erro assim que o usuário corrige
    $$('#lead-form input, #lead-form select, #lead-form textarea').forEach(function (el) {
      el.addEventListener('input',  function () { clearError(el); });
      el.addEventListener('change', function () { clearError(el); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = '';
      status.className = 'form__status';

      // honeypot: bot preencheu o campo escondido
      if (form.website && form.website.value) return;

      if (!validate()) {
        status.textContent = 'Revise os campos destacados acima.';
        status.classList.add('is-err');
        return;
      }

      var formatos = $$('input[name="formato"]:checked').map(function (c) { return c.value; });

      var linhas = [
        'Olá! Vim pelo site do Setembro Amarelo FDG e gostaria de consultar a disponibilidade da agenda.',
        '',
        '• Nome: '     + $('#f-nome').value.trim(),
        '• Empresa: '  + $('#f-empresa').value.trim(),
        '• E-mail: '   + $('#f-email').value.trim(),
        '• WhatsApp: ' + $('#f-tel').value.trim(),
        '• Equipe: '   + $('#f-porte').value,
        '• Formato de interesse: ' + (formatos.length ? formatos.join(', ') : 'a definir')
      ];

      var msg = $('#f-msg').value.trim();
      if (msg) { linhas.push('• Contexto: ' + msg); }

      var url = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(linhas.join('\n'));
      var win = window.open(url, '_blank', 'noopener');

      status.classList.add('is-ok');
      status.textContent = win
        ? 'Tudo certo! Abrimos o WhatsApp em uma nova aba — é só enviar a mensagem.'
        : 'Solicitação pronta. Libere os pop-ups do navegador para abrir o WhatsApp.';

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { method: 'whatsapp_form' });
      }
    });
  }

  /* ==========================================================
     12. WHATSAPP FLUTUANTE (link direto)
     ========================================================== */
  var waFloat = $('#wa-float');
  if (waFloat) {
    waFloat.href = 'https://wa.me/' + CONFIG.whatsapp +
      '?text=' + encodeURIComponent('Olá! Vim pelo site do Setembro Amarelo FDG e quero consultar a agenda de setembro.');
    waFloat.target = '_blank';
    waFloat.rel = 'noopener';
  }

  /* ==========================================================
     13. VISIBILIDADE DOS FLUTUANTES + HEADER STUCK
     ========================================================== */
  var totop = $('#totop');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset;
    var barH = topbar ? topbar.offsetHeight : 0;

    if (header) header.classList.toggle('is-stuck', y > barH + 4);
    if (waFloat) waFloat.classList.toggle('is-visible', y > 620);
    if (totop)   totop.classList.toggle('is-visible', y > 900);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  if (totop) {
    totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ==========================================================
     14. ANO DO RODAPÉ
     ========================================================== */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

})();
