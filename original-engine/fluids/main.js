// Chapter 8: fluids, on the shared book.
import { startBook } from '../engine/book.js';
import { buildWorld } from './world.js';
import { PAGES, PLATES, CURSORS } from './pages.js';
import * as M from './model.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const kPa = (p, n = 1) => `${f(p / 1000, n)} кПа`;

startBook({
  no: 8, PAGES, PLATES, clock0: 0,
  lookKeys: [],
  buildWorld(E) {
    const W = buildWorld(E);
    return { update: s => W.update(s.clock), labels: W.labels };
  },
  // everything the pages and plates read, straight from the model (a reduced-motion reader gets one still moment)
  state: (clock, reduced) => {
    const c = reduced ? 5.0 : clock, Vt = M.PIPE1.vol;
    return { clock: c, st4: M.buoy(M.buoyBottom(c)), slab6: M.PIPE1.sOfVol(((0.04 * Vt + M.FLOW.Q * c) % Vt + Vt) % Vt), h8: M.tankH(M.loop(c, M.TANK.Tdrain).t) };
  },
  readout(s, page) {
    switch (page.scene) {
      case 'density': return `одинаковый объём ${f(M.CUBE_V * 1000, 1)} л\nмасса от ${f(M.MATERIALS[0].mass)} до ${f(M.MATERIALS[4].mass)} кг`;
      case 'pressure': return `W ${f(M.PERSON.W, 0)} Н\nобувь ${kPa(M.P_SHOE)}   снегоступы ${kPa(M.P_SNOW, 2)}`;
      case 'depth': { const d = M.diveDepth(s.clock); return `h ${f(d)} м   избыточное ${kPa(M.gauge(d))}\nабсолютное ${kPa(M.pAt(d))} = ${f(M.pAt(d) / M.P0)} атм`; }
      case 'pascal': { const p = M.pascal(s.clock); return `ΔP ${kPa(M.PASCAL.dP, 2)}   F₁ ${M.PASCAL.F1} Н   F₂ ${f(M.PASCAL.F2, 0)} Н\nd₁ ${f(p.d1 * 100, 1)} см   d₂ ${f(p.d2 * 100, 2)} см`; }
      case 'buoy': { const b = s.st4; return `погружение ${f(b.h * 100, 1)} см   F_b ${f(b.Fb, 1)} Н\nW ${f(M.BUOY.W, 1)} Н   T ${f(b.T, 1)} Н`; }
      case 'float': return `дерево: погружено на ${f(100 * M.WOOD.draft / M.WOOD.s, 0)}%   лёд: ${f(100 * M.ICE.draft / M.ICE.s, 1)}%\nстальной шар F_N ${f(M.BALL.N, 0)} Н   осадка корабля ${f(M.SHIP.draft * 100, 1)} см`;
      case 'continuity': { const A = M.PIPE1.area(s.slab6); return `Q ${f(M.FLOW.Q * 1000, 1)} л/с\nтёмный объём: A ${f(A, 4)} м²   v ${f(M.FLOW.Q / A)} м/с`; }
      case 'bernoulli': return M.BERN.pts.map((p, k) => `${k + 1}: v ${f(p.v, 1)} м/с  P ${kPa(p.P)}`).join('\n');
      case 'torricelli': { const v = M.torricelli(s.h8); return `h ${f(s.h8)} м   v ${f(v)} м/с\nдальность ${f(M.jetRange(s.h8))} м`; }
    }
    return '';
  },
  onFrame(s, sheets) {
    const d = M.diveDepth(s.clock), b = s.st4, A = M.PIPE1.area(s.slab6);
    const vals = { depth: [d, M.pAt(d) / 1000], gauge: [d, M.gauge(d) / 1000], fb: [M.BUOY.L0 - b.yb, b.Fb], T: [M.BUOY.L0 - b.yb, b.T], flow: [A, M.FLOW.Q / A], tank: [s.h8, M.torricelli(s.h8)] };
    for (const el of sheets) el.querySelectorAll('circle[data-cursor]').forEach(c => {
      const k = c.dataset.cursor; if (!vals[k] || !CURSORS[k]) return;
      const [cx, cy] = CURSORS[k](...vals[k]); c.setAttribute('cx', cx); c.setAttribute('cy', cy);
    });
  },
});
