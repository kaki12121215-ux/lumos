/* Lumos 1.3.0 · animación al abrir y logo de la cabecera
   Tres animaciones: Amanecer, Espectro y Luz que se abre. La completa sale la primera vez
   que abres Lumos cada día; tocar la pantalla la salta. Con «Reducir movimiento», nada. */

/* El símbolo recortado a su caja (sol y línea), para usarlo pequeño */
L.MARCA = (id, w, h) => `<svg viewBox="6 22 88 62" width="${w}" height="${h}" aria-hidden="true" style="overflow:visible;display:block"><defs><radialGradient id="${id}a" cx="50%" cy="100%" r="80%"><stop offset="0" stop-color="#F2CB6B"/><stop offset=".55" stop-color="#F2A65A"/><stop offset="1" stop-color="#E9705E"/></radialGradient><clipPath id="${id}c"><rect x="0" y="0" width="100" height="69"/></clipPath></defs><g clip-path="url(#${id}c)"><path class="lm-xsol" d="M10 66 A40 40 0 0 1 90 66 Z" fill="url(#${id}a)"/></g><rect class="lm-xraya" x="10" y="74" width="80" height="7" rx="3.5" fill="currentColor"/></svg>`;

/* Cabecera del Hoy: símbolo y «Lumos» a la izquierda, ajustes a la derecha */
L.cabecera = () => `<div class="lm-cab" data-e><span class="lm-cab-logo" aria-label="Lumos">${L.MARCA('cab', 28, 20)}<span class="lm-cab-marca">Lumos</span></span><button class="lm-rb tq tq-i" data-a="ajustes" aria-label="Ajustes">${L.ic('ajustes', 19)}</button></div>`;
L.privado = () => `<p class="lm-privado" data-e>${L.ic('candado', 14)}<span>Solo lo ves tú</span></p>`;

L.INTROS = [['amanecer', 'Amanecer', 'El sol sale sobre la línea'], ['espectro', 'Espectro', 'Los colores de las emociones se juntan en el sol'], ['luz', 'Luz que se abre', 'Una luz en la oscuridad deja ver tu día'], ['no', 'Sin animación', 'Lumos se abre con un fundido']];

(() => {
  const SOL = 'cubic-bezier(.16,.8,.2,1)';
  let vivas = [], saltar = null, parado = false;
  const an = (el, k, o) => {
    if (parado) return Promise.resolve();
    const a = el.animate(k, { fill: 'both', ...o }); vivas.push(a);
    return a.finished.then(() => { try { a.commitStyles(); } catch (e) { } a.cancel(); }, () => { });
  };
  const espera = t => new Promise(r => { if (parado) return r(); const id = setTimeout(r, t); vivas.push({ cancel: () => { clearTimeout(id); r(); }, finish: () => { clearTimeout(id); r(); } }); });

  /* Lo que hay en el Hoy, escondido mientras dura la animación */
  let home = [], barra = null;
  const ocultarHome = () => {
    home = $$('#lm-vista .lm-pad > [data-e]'); barra = $('.lm-barra');
    home.forEach(e => { e.getAnimations().forEach(a => a.cancel()); e.style.opacity = 0; });
    if (barra) barra.style.opacity = 0;
    const lg = $('#lm-vista .lm-cab-logo svg'), mk = $('#lm-vista .lm-cab-marca');
    if (lg) lg.style.opacity = 0; if (mk) mk.style.opacity = 0;
  };
  const mostrarHome = (t0 = 0) => {
    home.forEach((e, i) => {
      if (e.classList.contains('lm-cab')) { e.style.opacity = ''; return; }
      an(e, [{ opacity: 0, translate: '0 12px' }, { opacity: 1, translate: '0 0' }], { duration: 520, delay: t0 + Math.min(i, 6) * 65, easing: L.E }).then(() => { e.style.opacity = ''; e.style.translate = ''; });
    });
    const mk = $('#lm-vista .lm-cab-marca');
    if (mk) an(mk, [{ opacity: 0, translate: '-8px 0' }, { opacity: 1, translate: '0 0' }], { duration: 460, delay: t0 + 140, easing: L.E }).then(() => { mk.style.opacity = ''; mk.style.translate = ''; });
    if (barra) an(barra, [{ opacity: 0, translate: '0 40px' }, { opacity: 1, translate: '0 0' }], { duration: 560, delay: t0 + 320, easing: L.E }).then(() => { barra.style.opacity = ''; barra.style.translate = ''; });
  };
  /* El logo grande viaja a su sitio de la cabecera */
  const viajar = async (big, dur = 740) => {
    const slot = $('#lm-vista .lm-cab-logo svg');
    if (!slot) { await an(big, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: L.S }); big.remove(); return; }
    const a = big.getBoundingClientRect(), b = slot.getBoundingClientRect();
    big.style.transformOrigin = '0 0';
    await an(big, [{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${b.left - a.left}px,${b.top - a.top}px) scale(${b.width / a.width})` }], { duration: dur, easing: L.E });
    slot.style.opacity = ''; big.remove();
  };
  const capas = () => {
    const sp = document.createElement('div'); sp.className = 'lm-intro'; document.body.appendChild(sp);
    const tp = document.createElement('div'); tp.className = 'lm-intro-top'; document.body.appendChild(tp);
    return [sp, tp];
  };
  const logoGrande = (tp, w) => {
    const big = document.createElement('div'); big.className = 'lm-intro-logo';
    const h = w * 62 / 88; Object.assign(big.style, { width: w + 'px', height: h + 'px', left: (innerWidth - w) / 2 + 'px', top: (innerHeight - h) / 2 - 40 + 'px' });
    big.innerHTML = L.MARCA('in' + Math.random().toString(36).slice(2, 6), w, h); tp.appendChild(big);
    return [big, $('.lm-xsol', big), $('.lm-xraya', big)];
  };
  const cy = () => innerHeight / 2 - 40 + 46 * 62 / 88 / 2;

  const amanecer = async (sp, tp) => {
    const glow = document.createElement('div'); glow.className = 'lm-intro-glow';
    Object.assign(glow.style, { width: '380px', height: '380px', left: (innerWidth - 380) / 2 + 'px', top: cy() - 220 + 'px', background: 'radial-gradient(circle,rgba(242,203,107,.75),rgba(242,166,90,.45) 45%,rgba(233,112,94,0) 70%)', opacity: 0 });
    sp.appendChild(glow);
    const [big, sol, raya] = logoGrande(tp, 132);
    sol.style.transform = 'translateY(48px)'; raya.style.transformOrigin = '50px 77px'; raya.style.transform = 'scaleX(0)';
    const word = document.createElement('div'); word.className = 'lm-intro-palabra'; word.textContent = 'Lumos'; word.style.top = innerHeight / 2 + 48 + 'px'; word.style.opacity = 0; tp.appendChild(word);
    an(raya, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 560, easing: L.E });
    an(sol, [{ transform: 'translateY(48px)' }, { transform: 'translateY(0)' }], { duration: 1000, delay: 260, easing: SOL });
    an(glow, [{ opacity: 0, scale: .5 }, { opacity: 1, scale: 1 }], { duration: 1300, delay: 300, easing: L.E });
    an(word, [{ opacity: 0, translate: '0 12px' }, { opacity: 1, translate: '0 0' }], { duration: 520, delay: 900, easing: L.E });
    await espera(1800);
    an(word, [{ opacity: 1 }, { opacity: 0, translate: '0 -6px' }], { duration: 220, easing: L.S });
    an(glow, [{ opacity: 1, scale: 1 }, { opacity: 0, scale: 1.7 }], { duration: 800, easing: L.E });
    an(sp, [{ opacity: 1 }, { opacity: 0 }], { duration: 560, delay: 120, easing: L.S });
    mostrarHome(260);
    await viajar(big, 760);
  };

  const espectro = async (sp, tp) => {
    const cols = [L.C.ten, L.C.ene, L.C.ale, L.C.ver, L.C.cal, L.C.baj, L.C.lil], x = innerWidth / 2, y = cy();
    const orbs = cols.map((c, i) => {
      const t = document.createElement('div'); t.innerHTML = L.orb(c, 150); const el = t.firstChild;
      const ang = (i / 7) * Math.PI * 2 - Math.PI / 2;
      Object.assign(el.style, { position: 'absolute', left: x - 75 + 'px', top: y - 75 + 'px', opacity: 0 });
      el._d = [Math.cos(ang) * 330, Math.sin(ang) * 330, Math.cos(ang) * 34, Math.sin(ang) * 34];
      el.style.transform = `translate(${el._d[0]}px,${el._d[1]}px)`; sp.appendChild(el); return el;
    });
    const [big, sol, raya] = logoGrande(tp, 120);
    big.style.opacity = 0; sol.style.transformOrigin = '50px 66px'; raya.style.transformOrigin = '50px 77px'; raya.style.transform = 'scaleX(0)';
    orbs.forEach((o, i) => an(o, [{ opacity: 0, transform: `translate(${o._d[0]}px,${o._d[1]}px) scale(.7)` }, { opacity: 1, transform: `translate(${o._d[2]}px,${o._d[3]}px) scale(1)` }], { duration: 1050, delay: i * 70, easing: L.E }));
    await espera(1250);
    orbs.forEach((o, i) => an(o, [{ scale: 1, opacity: 1 }, { scale: .25, opacity: 0 }], { duration: 480, delay: i * 25, easing: L.S }));
    an(big, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 120, easing: L.E });
    an(sol, [{ transform: 'scale(.6)' }, { transform: 'scale(1)' }], { duration: 620, delay: 120, easing: L.M });
    an(raya, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 520, delay: 300, easing: L.E });
    await espera(1050);
    an(sp, [{ opacity: 1 }, { opacity: 0 }], { duration: 520, easing: L.S });
    $$('#lm-vista .lm-cta .lm-orb').forEach((v, i) => { const op = getComputedStyle(v).opacity; an(v, [{ scale: .3, opacity: 0 }, { scale: 1, opacity: op }], { duration: 900, delay: 260 + i * 70, easing: L.E }).then(() => { v.style.opacity = ''; v.style.scale = ''; }); });
    mostrarHome(160);
    await viajar(big, 740);
  };

  const luz = async (sp, tp) => {
    sp.style.background = '#1B1512'; sp.style.zIndex = 40;
    const app = $('#lm-app'), cyp = (cy() / innerHeight * 100).toFixed(1) + '%';
    app.style.zIndex = 45; app.style.clipPath = `circle(0px at 50% ${cyp})`;
    const pt = document.createElement('div'); pt.className = 'lm-intro-glow';
    Object.assign(pt.style, { width: '60px', height: '60px', left: innerWidth / 2 - 30 + 'px', top: cy() - 52 + 'px', filter: 'blur(6px)', background: 'radial-gradient(circle,#FFF4D6,#F2CB6B 40%,rgba(242,166,90,0) 72%)', opacity: 0 });
    sp.appendChild(pt);
    const [big, sol, raya] = logoGrande(tp, 120);
    big.style.color = '#F4EEE4'; sol.style.transformOrigin = '50px 66px'; sol.style.transform = 'scale(0)'; raya.style.transformOrigin = '50px 77px'; raya.style.transform = 'scaleX(0)';
    await an(pt, [{ opacity: 0, scale: .3 }, { opacity: 1, scale: 1 }], { duration: 420, easing: L.E });
    await an(pt, [{ scale: 1 }, { scale: 1.35 }], { duration: 520, easing: 'ease-in-out' });
    an(pt, [{ scale: 1.35, opacity: 1 }, { scale: 4.5, opacity: .55 }], { duration: 760, easing: L.E });
    an(sol, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 720, easing: L.M });
    an(raya, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 560, delay: 220, easing: L.E });
    await espera(1050);
    an(app, [{ clipPath: `circle(0px at 50% ${cyp})` }, { clipPath: `circle(${Math.hypot(innerWidth, innerHeight)}px at 50% ${cyp})` }], { duration: 900, easing: 'cubic-bezier(.3,0,.1,1)' }).then(() => { app.style.clipPath = ''; });
    an(big, [{ color: '#F4EEE4' }, { color: getComputedStyle(document.body).color }], { duration: 500, delay: 120, easing: L.E });
    mostrarHome(280);
    await viajar(big, 760);
  };

  /* Arranca la animación sobre el Hoy ya pintado. Devuelve una promesa. */
  L.intro = async (op) => {
    if (!$('#lm-vista .lm-cab') || !{ amanecer, espectro, luz }[op]) return;
    const [sp, tp] = capas(); parado = false; ocultarHome(); vivas = [];
    let hecho = false;
    const limpiar = () => {
      if (hecho) return; hecho = true; parado = true;
      vivas.forEach(a => { try { a.cancel(); } catch (e) { } }); vivas = [];
      sp.remove(); tp.remove(); document.removeEventListener('pointerdown', saltar, true);
      const app = $('#lm-app'); app.style.clipPath = ''; app.style.zIndex = '';
      home.forEach(e => { e.style.opacity = ''; e.style.translate = ''; });
      if (barra) { barra.style.opacity = ''; barra.style.translate = ''; }
      $$('#lm-vista .lm-cab-logo svg, #lm-vista .lm-cab-marca, #lm-vista .lm-cta .lm-orb').forEach(e => { e.style.opacity = ''; e.style.translate = ''; e.style.scale = ''; });
    };
    /* tocar la pantalla la salta: lo que queda se funde en 200 ms */
    saltar = e => {
      e.preventDefault(); e.stopPropagation(); if (hecho || parado) return; parado = true;
      vivas.forEach(a => { try { a.cancel(); } catch (x) { } }); vivas = [];
      const ir = [sp, tp]; ir.forEach(x => x.animate([{ opacity: getComputedStyle(x).opacity }, { opacity: 0 }], { duration: 200, easing: L.S, fill: 'both' }));
      const app = $('#lm-app'); app.style.clipPath = ''; app.style.zIndex = '';
      home.forEach(x => { x.style.opacity = ''; x.style.translate = ''; x.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260 }); });
      if (barra) { barra.style.opacity = ''; barra.style.translate = ''; }
      $$('#lm-vista .lm-cab-logo svg, #lm-vista .lm-cab-marca, #lm-vista .lm-cta .lm-orb').forEach(x => { x.style.opacity = ''; x.style.translate = ''; x.style.scale = ''; });
      setTimeout(limpiar, 220);
    };
    document.addEventListener('pointerdown', saltar, true);
    try { await ({ amanecer, espectro, luz })[op](sp, tp); } catch (e) { }
    limpiar();
  };

  /* ¿Toca la animación completa? Primera vez del día, sin «Reducir movimiento» */
  L.introAlAbrir = () => {
    const p = L.d.perfil, op = p.intro || 'amanecer';
    if (op === 'no' || L.rm || p.cuidado || L.abrirPendiente) return false;
    if (L.d.introDia === L.hoy()) return false;
    L.d.introDia = L.hoy(); L.guardar();
    return op;
  };

  /* Ajustes > Animación al abrir */
  L.hojaIntro = alFin => {
    const act = L.d.perfil.intro || 'amanecer';
    const h = L.hoja(`<h2 data-e>Animación al abrir</h2><p class="lm-sub" data-e style="margin-bottom:12px">Sale la primera vez que abres Lumos cada día. Tocando la pantalla se salta.</p>
      ${L.INTROS.map(([k, n, d]) => `<button class="lm-hecho tq tq-g ${k === act ? 'lm-hecha' : ''}" data-a="el" data-k="${k}" data-e style="width:100%;text-align:left">${L.checkSvg(k === act)}<span><b style="display:block;font-weight:700">${n}</b><small style="color:var(--mu);font-size:13px">${d}</small></span></button>`).join('')}
      <button class="lm-btn lm-sec2 tq tq-g" data-a="ver" data-e style="margin-top:10px">Verla ahora</button>`, {
      el: t => {
        L.d.perfil.intro = t.dataset.k; L.guardar();
        $$('[data-a="el"]', h.el).forEach(b => { const on = b === t; if (b.classList.contains('lm-hecha') !== on) L.marcarCheck(b, on); });
        alFin?.();
      },
      ver: async (t, e, c) => {
        const op = L.d.perfil.intro || 'amanecer'; c();
        if (op === 'no' || L.rm) return L.toast(L.rm ? 'Con «Reducir movimiento» activado no hay animación' : 'Has elegido sin animación');
        await L.espera(450); await L.cerrarTodo(); if (L.tabActual !== 'hoy') await L.tab('hoy');
        $('#lm-vista').scrollTop = 0; await L.espera(250); L.intro(op);
      }
    });
  };
})();
