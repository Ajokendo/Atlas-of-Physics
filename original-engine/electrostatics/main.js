// Chapter 9: electrostatics, on the shared book.
import { startBook } from '../engine/book.js';
import { buildWorld } from './world.js';
import { PAGES, PLATES, CH, RANGE } from './pages.js';
import * as M from './model.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);

startBook({
  no: 9, PAGES, PLATES, clock0: 0,
  lookKeys: [],
  buildWorld(E) {
    const W = buildWorld(E);
    return { update: s => W.update(s), labels: W.labels };
  },
  state: (clock, reduced) => {
    const c = reduced ? 3.2 : clock;
    const pl = M.loop(c, M.PLATES.show * 1.45);
    return {
      clock: c,
      induce: M.induce(reduced ? 6.5 : c % (M.INDUCE.run + M.REST)),
      balloonGap: M.balloonGap(c), pairR: M.pairR(c), lineX: M.lineX(c), testR: M.testR(c),
      dipoleX: M.dipoleX(c), dipoleY: M.dipoleY(c), rodA: M.rodA(c), rodB: M.rodB(c), ringZ: M.ringZ(c),
      plates: { t: pl.t / M.PLATES.show * M.PLATES.tCross },     // real seconds: 4 ns shown in 3.2 s
    };
  },
  readout(s, page) {
    switch (page.scene) {
      case 'atoms': return `нейтральный 0   ион −1e   ион +1e\n1 e = 1,60 × 10⁻¹⁹ Кл`;
      case 'induce': { const st = s.induce; return `${({approach:'палочка приближается', ground:'шар заземлён', remove:'палочка удалена'}[st.stage] || st.stage)}\nзаряд шара ${f(st.Qnet / M.nC)} нКл   палочка ${st.rod ? `на расстоянии ${f(st.dTip * 100, 0)} см` : 'удалена'}`; }
      case 'coulomb': return `r ${f(s.pairR * 100, 1)} см\nF ${f(M.coulomb(M.PAIR.q1, M.PAIR.q2, s.pairR))} Н на каждый заряд, притяжение`;
      case 'line': { const r = M.lineForces(s.lineX); return `x ${f(s.lineX * 100, 1)} см   F_A ${f(r.FA[0], 3)} Н   F_B ${f(r.FB[0], 3)} Н\nΣF ${f(r.net[0], 3)} Н`; }
      case 'point': { const E = M.pointMag(M.POINT.Q, s.testR); return `r ${f(s.testR * 100, 1)} см   E ${f(E, 0)} Н/Кл\nF = q₀E = ${f(M.POINT.q0 * E * 1e9, 1)} × 10⁻⁹ Н`; }
      case 'dipole': return `ось x = ${f(s.dipoleX * 100, 1)} см: E ${f(M.dipoleAxis(s.dipoleX), 0)} Н/Кл\nбиссектриса y = ${f(s.dipoleY * 100, 1)} см: E ${f(M.dipoleBisector(s.dipoleY), 0)} Н/Кл`;
      case 'rod': return `ось a = ${f(s.rodA * 100, 1)} см: E ${f(M.rodAxis(s.rodA), 0)} Н/Кл\nбиссектриса a = ${f(s.rodB * 100, 1)} см: E ${f(M.rodBisector(s.rodB), 0)} Н/Кл`;
      case 'ring': return `z ${f(s.ringZ * 100, 1)} см   E ${f(M.ringAxis(s.ringZ), 0)} Н/Кл\nмаксимум ${f(M.ringAxis(M.RING_ZMAX), 0)} Н/Кл при ${f(M.RING_ZMAX * 100, 1)} см`;
      case 'plates': { const e = M.electron(s.plates.t); return `t ${f(s.plates.t * 1e9)} нс   x ${f(e.x * 100)} см   y ${f(e.y * 1000)} мм\n${e.inside ? `a ${(M.PLATES.a / 1e14).toFixed(2)} × 10¹⁴ м/с² вверх` : 'за пластинами: прямая линия'}`; }
    }
    return '';
  },
  onFrame(s, sheets) {
    const put = (key, x, y) => { const r = RANGE[key]; for (const el of sheets) el.querySelectorAll(`circle[data-cursor="${key}"]`).forEach(c => { c.setAttribute('cx', CH.sx(Math.min(Math.max(x, r.x0), r.x1), r.x0, r.x1)); c.setAttribute('cy', CH.sy(Math.min(Math.max(y, r.y0), r.y1), r.y0, r.y1)); }); };
    const tI = s.clock % (M.INDUCE.run + M.REST);
    put('induce', tI, s.induce.Qnet / M.nC);
    put('coulomb', s.pairR * 100, M.coulomb(M.PAIR.q1, M.PAIR.q2, s.pairR));
    put('line', s.lineX * 100, M.lineForces(s.lineX).net[0]);
    put('field', s.testR * 100, M.pointMag(M.POINT.Q, s.testR) / 1000);
    put('dipole', s.dipoleX * 100, M.dipoleAxis(s.dipoleX) / 1000);
    put('rod', s.rodA * 100, M.rodAxis(s.rodA) / 1000);
    put('ring', s.ringZ * 100, M.ringAxis(s.ringZ) / 1000);
    const e = M.electron(s.plates.t); put('plates', e.x * 100, e.y * 1000);
  },
});
