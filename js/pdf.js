/* Lumos 1.2.0 · PDF hecho a mano (sin librerías): texto, rectángulos y varias páginas */
'use strict';
L.PDF = class {
  constructor() { this.W = 595.28; this.H = 841.89; this.M = 46; this.paginas = []; this.nueva(); }
  nueva() { this.ops = []; this.paginas.push(this.ops); this.y = this.H - this.M; }
  static texto(s) {
    s = String(s ?? '').replace(/[→]/g, '->').replace(/[−–—]/g, '-').replace(/…/g, '...').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/€/g, 'EUR');
    let o = ''; for (const ch of s) { const c = ch.codePointAt(0); o += c < 256 && !(c >= 0x80 && c < 0xa0) ? ch : '?'; }
    return o.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }
  static rgb(h) { if (Array.isArray(h)) return h; const [r, g, b] = L.hx(h); return [r / 255, g / 255, b / 255]; }
  ancho(s, t, negrita) { return String(s).length * t * (negrita ? .56 : .51); }
  t(x, y, s, t = 10, negrita = false, color = '#2B2420') { const [r, g, b] = L.PDF.rgb(color); this.ops.push(`BT /F${negrita ? 2 : 1} ${t} Tf ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg ${x.toFixed(2)} ${y.toFixed(2)} Td (${L.PDF.texto(s)}) Tj ET`); }
  r(x, y, w, h, color) { const [r, g, b] = L.PDF.rgb(color); this.ops.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`); }
  linea(y, color = '#E4DDD2') { this.r(this.M, y, this.W - 2 * this.M, .6, color); }
  partir(s, t, w, negrita) {
    const out = []; String(s || '').split('\n').forEach(par => {
      let l = ''; par.split(/\s+/).forEach(p => { const n = l ? l + ' ' + p : p; if (this.ancho(n, t, negrita) > w && l) { out.push(l); l = p; } else l = n; });
      out.push(l);
    }); return out;
  }
  sitio(h) { if (this.y - h < this.M + 20) this.nueva(); }
  parrafo(s, t = 10, negrita = false, color = '#2B2420', x = this.M, w = this.W - 2 * this.M, inter = 1.42) {
    this.partir(s, t, w, negrita).forEach(l => { this.sitio(t * inter); this.y -= t * inter; this.t(x, this.y, l, t, negrita, color); });
  }
  titulo(s) { this.sitio(40); this.y -= 22; this.t(this.M, this.y, s, 13, true); this.y -= 6; this.linea(this.y); this.y -= 2; }
  /* tabla sencilla: columnas con ancho; la última celda que haga falta se parte en líneas */
  tabla(cab, filas, anchos, t = 8.4) {
    const fila = (cels, negrita, fondo) => {
      const ls = cels.map((c, i) => this.partir(c, t, anchos[i] - 6, negrita)), n = Math.max(...ls.map(l => l.length)), h = n * t * 1.32 + 6;
      this.sitio(h); if (fondo) this.r(this.M, this.y - h, this.W - 2 * this.M, h, fondo);
      let x = this.M; ls.forEach((l, i) => { l.forEach((tx, k) => this.t(x + 3, this.y - 4 - t - k * t * 1.32 + 1.5, tx, t, negrita, negrita ? '#2B2420' : '#3A322C')); x += anchos[i]; });
      this.y -= h; this.linea(this.y, '#EDE7DD');
    };
    fila(cab, true, '#F4EEE4'); filas.forEach(f => fila(f, false));
  }
  salida() {
    const objs = [], add = s => { objs.push(s); return objs.length; };
    const cat = add(''), pags = add(''), f1 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'), f2 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    const kids = [], tot = this.paginas.length;
    this.paginas.forEach((ops, i) => {
      const pie = `BT /F1 8 Tf 0.55 0.5 0.45 rg ${this.M} 24 Td (${L.PDF.texto(`Lumos ${L.VERSION} · página ${i + 1} de ${tot}`)}) Tj ET`;
      const cont = ops.join('\n') + '\n' + pie;
      const c = add(`<< /Length ${cont.length} >>\nstream\n${cont}\nendstream`);
      kids.push(add(`<< /Type /Page /Parent ${pags} 0 R /MediaBox [0 0 ${this.W} ${this.H}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${c} 0 R >>`));
    });
    objs[cat - 1] = `<< /Type /Catalog /Pages ${pags} 0 R >>`;
    objs[pags - 1] = `<< /Type /Pages /Kids [${kids.map(k => k + ' 0 R').join(' ')}] /Count ${kids.length} >>`;
    let s = '%PDF-1.4\n%\xe2\xe3\xcf\xd3\n'; const off = [];
    objs.forEach((o, i) => { off.push(s.length); s += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const x = s.length;
    s += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + off.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('');
    s += `trailer\n<< /Size ${objs.length + 1} /Root ${cat} 0 R >>\nstartxref\n${x}\n%%EOF`;
    const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 255;
    return b;
  }
};
/* comparte el PDF (hoja de compartir del iPhone) o lo descarga */
L.entregarPDF = (bytes, nombre) => {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  let file = null; try { file = new File([blob], nombre, { type: 'application/pdf' }); } catch (e) { }
  if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({ files: [file], title: nombre }).catch(() => { });
    return;
  }
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};
