// Chapter 12: capacitors and conductors, on the shared book.
import { startBook } from '../engine/book.js';
import { buildWorld } from './world.js';
import { PAGES, PLATES, CH, R } from './pages.js';
import * as M from './model.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);

startBook({
  no: 12, PAGES, PLATES, clock0: 0,
  lookKeys: [],
  buildWorld(E) {
    const W = buildWorld(E);
    return { update: s => W.update(s), labels: W.labels };
  },
  state: (clock, reduced) => {
    const c = reduced ? 3 : clock, L = run => M.loop(c, run);
    return { clock: c, charge: { t: c % M.CHARGE_T }, gap: { t: c % M.GAP_T }, sweep: { t: c % M.SWEEP_T }, fill: L(M.FILL_T), slide: { t: c % M.SLIDE_T } };
  },
  readout(s, page) {
    switch (page.scene) {
      case 'plates': { const r = M.charging(s.charge.t); return `ΔV ${f(r.V, 1)} В   Q ${f(r.Q * 1e12, 0)} пКл\nC = Q/ΔV = ${f(M.C0 * 1e12)} пФ`; }
      case 'gap': { const r = M.gapScene(s.gap.t); return `d ${f(r.d * 100, 1)} см   E ${f(r.E, 0)} В/м\nΔV ${f(r.V, 0)} В   C ${f(r.C * 1e12)} пФ`; }
      case 'sphere': { const r = M.gaussR(s.sweep.t, M.SPH.a, M.SPH.b); return `r ${f(r * 100, 1)} см   E ${f(M.sphE(r), 0)} В/м\nC ${f(M.SPH.C * 1e12)} пФ при ${M.V0} В`; }
      case 'coax': { const r = M.gaussR(s.sweep.t, M.CYL.a, M.CYL.b); return `r ${f(r * 100, 1)} см   E ${f(M.cylE(r), 0)} В/м\nC ${f(M.CYL.C * 1e12)} пФ при ${M.V0} В`; }
      case 'energy': { const r = M.filling(s.fill.t); return `q ${f(r.q * 1e12, 0)} пКл   ΔV ${f(r.V, 1)} В\nU = q²/2C = ${f(r.U * 1e9)} нДж`; }
      case 'circuits': return `последовательно: C_экв ${f(M.SER.C * 1e6)} мкФ   Q ${f(M.SER.Q * 1e6, 0)} мкКл\nпараллельно: C_экв ${f(M.PAR.C * 1e6, 0)} мкФ   Q ${f(M.PAR.Q * 1e6, 0)} мкКл`;
      case 'slab': { const x = M.fillOf(s.slide.t), r = M.slab(x, false); return `диэлектрик введён на ${f(x * 100, 0)} %   E ${f(r.E, 0)} В/м\nΔV ${f(r.V, 1)} В   C ${f(r.C * 1e12)} пФ`; }
      case 'compare': { const x = M.fillOf(s.slide.t), a = M.slab(x, true), b = M.slab(x, false); return `подключён: Q ${f(a.Q * 1e12, 0)} пКл  ΔV ${f(a.V, 0)} В\nотключён: Q ${f(b.Q * 1e12, 0)} пКл  ΔV ${f(b.V, 1)} В`; }
      case 'conductor': { const x = M.probeX(s.clock); return `пробный заряд: x = ${f(x * 100, 1)} см\nE ${f(M.condAxisE(x), 0)} В/м`; }
    }
    return '';
  },
  onFrame(s, sheets) {
    const q = sel => sheets.flatMap(el => [...el.querySelectorAll(sel)]);
    const put = (key, r, x, y) => q(`circle[data-cursor="${key}"]`).forEach(c => { c.setAttribute('cx', CH.sx(x, r.x0, r.x1)); c.setAttribute('cy', CH.sy(y, r.y0, r.y1)); });
    const ch = M.charging(s.charge.t); put('charge', R.charge, ch.V, ch.Q * 1e12);
    const g = M.gapScene(s.gap.t); put('gap', R.gap, g.d * 100, g.C * 1e12);
    const rs = M.gaussR(s.sweep.t, M.SPH.a, M.SPH.b); put('sph', R.sph, rs * 100, M.sphE(rs));
    const rc = M.gaussR(s.sweep.t, M.CYL.a, M.CYL.b); put('cyl', R.cyl, rc * 100, M.cylE(rc));
    const fi = M.filling(s.fill.t), Rf = R.fill, X = v => CH.sx(v, Rf.x0, Rf.x1), Y = v => CH.sy(v, Rf.y0, Rf.y1), qp = fi.q * 1e12;
    put('fill', Rf, qp, fi.V);
    q('path[data-area="fill"]').forEach(p => p.setAttribute('d', `M${X(0)},${Y(0)}L${X(qp)},${Y(0)}L${X(qp)},${Y(fi.V)}Z`));
    q('#filllive').forEach(el => { el.textContent = `заштрихованная площадь ½·${f(qp, 0)} пКл·${f(fi.V, 1)} В = ${f(fi.U * 1e9)} нДж = U`; });
    const x = M.fillOf(s.slide.t);
    put('slab', R.slab, x, M.slab(x, false).E);
    put('enA', R.energy, x, M.slab(x, true).U / M.U0); put('enB', R.energy, x, M.slab(x, false).U / M.U0);
    const px = M.probeX(s.clock); put('probe', R.probe, px * 100, M.condAxisE(px));
  },
});
