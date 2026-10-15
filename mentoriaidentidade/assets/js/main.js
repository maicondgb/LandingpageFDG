/* Identidade Inabalável · comportamento da página.
   Tudo aqui é enfeite: sem este arquivo a página continua inteira,
   com todo o texto à mostra e todos os botões funcionando. */
(() => {
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- revelação ao rolar ---------- */
  const ioRevela = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('visivel');
      ioRevela.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  document.querySelectorAll('.revela').forEach((el) => ioRevela.observe(el));

  /* ---------- nav ganha fundo depois do topo ---------- */
  const nav = document.querySelector('[data-nav]');
  const marcaNav = () => nav.classList.toggle('nav--rolou', scrollY > 30);
  marcaNav();
  addEventListener('scroll', marcaNav, { passive: true });

  /* ---------- conversa: balões um a um, com "digitando…" antes ---------- */
  const conversa = document.querySelector('[data-conversa]');
  if (conversa) {
    const baloes = [...conversa.querySelectorAll('.balao')];
    const digitando = conversa.querySelector('.digitando');
    const ioConversa = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      ioConversa.disconnect();
      if (reduz) { baloes.forEach((b) => b.classList.add('aparece')); return; }
      let t = 250;
      baloes.forEach((b, i) => {
        setTimeout(() => {
          conversa.style.setProperty('--y', b.offsetTop + 'px');
          digitando.classList.toggle('digitando--dir', i % 2 === 1);
          conversa.classList.add('digitando-on');
        }, t);
        t += 700;
        setTimeout(() => {
          conversa.classList.remove('digitando-on');
          b.classList.add('aparece');
        }, t);
        t += 280;
      });
    }, { threshold: 0.4 });
    ioConversa.observe(conversa);
  }

  /* ---------- linha do tempo que se desenha com a rolagem ---------- */
  const trilha = document.querySelector('[data-trilha]');
  if (trilha) {
    const trilho = trilha.parentElement;
    const passos = [...trilho.querySelectorAll('.passo')];
    let pendente = false;
    const atualiza = () => {
      pendente = false;
      const linha = innerHeight * 0.62;
      const r = trilho.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (linha - r.top) / r.height));
      trilha.style.setProperty('--p', p.toFixed(4));
      for (const passo of passos) {
        const no = passo.querySelector('.passo__no').getBoundingClientRect();
        passo.classList.toggle('alcancado', no.top + no.height / 2 < linha);
      }
    };
    const agenda = () => { if (!pendente) { pendente = true; requestAnimationFrame(atualiza); } };
    addEventListener('scroll', agenda, { passive: true });
    addEventListener('resize', agenda);
    atualiza();
  }

  /* ---------- pilares: acordeão no desktop ---------- */
  const painel = document.querySelector('[data-acordeao]');
  if (painel) {
    const pilares = [...painel.children];
    const desktop = matchMedia('(min-width: 900px)');
    painel.classList.add('acordeao-on');
    const ativa = (alvo) => pilares.forEach((p) => p.classList.toggle('ativo', p === alvo));
    pilares.forEach((p) => {
      p.addEventListener('mouseenter', () => { if (desktop.matches) ativa(p); });
      p.addEventListener('focus', () => ativa(p));
      p.addEventListener('click', () => ativa(p));
    });
  }

  /* ---------- carrosséis do celular: bolinhas acompanham o item ---------- */
  document.querySelectorAll('[data-carrossel]').forEach((lista) => {
    const pontos = document.querySelector(`[data-carrossel-pontos="${lista.dataset.carrossel}"]`);
    if (!pontos) return;
    const bolas = [...pontos.children];
    const itens = [...lista.children];
    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.intersectionRatio < 0.6) continue;
        const i = itens.indexOf(e.target);
        bolas.forEach((b, j) => b.classList.toggle('ativo', i === j));
      }
    }, { root: lista, threshold: [0.6] });
    itens.forEach((it) => io.observe(it));
  });

  /* ---------- FAQ: abre e fecha com animação de altura ---------- */
  document.querySelectorAll('.faq__item').forEach((item) => {
    const resumo = item.querySelector('summary');
    const corpo = item.querySelector('.faq__resposta');
    resumo.addEventListener('click', (ev) => {
      if (reduz || !corpo.animate) return;
      ev.preventDefault();
      if (item.open) {
        item.classList.add('fechando');
        const anim = corpo.animate(
          [{ height: corpo.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
          { duration: 260, easing: 'ease' }
        );
        anim.onfinish = () => { item.open = false; item.classList.remove('fechando'); };
      } else {
        item.open = true;
        corpo.animate(
          [{ height: '0px', opacity: 0 }, { height: corpo.offsetHeight + 'px', opacity: 1 }],
          { duration: 340, easing: 'cubic-bezier(.2,.7,.2,1)' }
        );
      }
    });
  });

  /* ---------- barra fixa: aparece fora do topo, some perto da oferta ---------- */
  const barra = document.querySelector('[data-barra]');
  if (barra) {
    const alvos = ['.hero', '#investimento', '#contato', '.rodape']
      .map((s) => document.querySelector(s)).filter(Boolean);
    const vistos = new Set(alvos);
    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) e.isIntersecting ? vistos.add(e.target) : vistos.delete(e.target);
      barra.classList.toggle('barra--visivel', vistos.size === 0);
    });
    alvos.forEach((a) => io.observe(a));
  }

  /* ---------- cliques nos botões de WhatsApp (para quem medir) ---------- */
  document.addEventListener('click', (ev) => {
    const cta = ev.target.closest('[data-cta]');
    if (!cta) return;
    (window.dataLayer = window.dataLayer || []).push({ event: 'clique_whatsapp', cta: cta.dataset.cta });
  });

  const ano = document.querySelector('[data-ano]');
  if (ano) ano.textContent = new Date().getFullYear();
})();
