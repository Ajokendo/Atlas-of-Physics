// Chapter 3: circular motion and gravitation, on the shared book.
import { startBook } from '../engine/book.js';
import { buildWorld } from './world.js';
import { PAGES, PLATES, CH } from './pages.js';
import * as M from './model.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);

startBook({
  no: 3, PAGES, PLATES, clock0: 0,
  lookKeys: [],
  buildWorld(E) {
    const W = buildWorld(E);
    return { update: s => W.update(s.clock), labels: W.labels };
  },
  state: (clock, reduced) => ({ clock: reduced ? M.STILL : clock }),
  readout(s, page) {
    const t = s.clock;
    switch (page.scene) {
      case 'whirl': { const p = M.uniform(M.BALL.r, M.V1, t); return `скорость ${f(M.V1)} м/с, направление ${f((p.phi * 180 / Math.PI + 90) % 360, 0)}°\na_c ${f(p.a)} м/с² к центру`; }
      case 'double': return `2,0 м/с: T ${f(M.tension(M.V1))} Н   4,0 м/с: T ${f(M.tension(M.V2))} Н\nF_N = mg ${f(M.BALL.m * M.G)} Н для каждого шара`;
      case 'flatcar': return `v ${f(M.CAR.v)} м/с   r ${M.CAR.r} м\nf_s ${f(M.CAR.f)} Н из ${f(M.CAR.fmax, 0)} Н максимально возможных`;
      case 'cone': return `T ${f(M.CONE.T)} Н   v ${f(M.CONE.v)} м/с\nΣF = T sin θ ${f(M.CONE.Tx)} Н`;
      case 'loop': { const q = M.loopState(t); return `${f((q.phi * 180 / Math.PI) % 360, 0)}° от нижней точки   v ${f(q.v)} м/с\nF_N ${f(q.N / 1000)} кН   mg ${f(M.LOOP.W / 1000)} кН`; }
      case 'bank': return `v ${f(M.BANK.v)} м/с   θ ${M.BANK.thetaDeg}°\nF_N ${f(M.BANK.N)} Н   F_N sin θ ${f(M.BANK.Nx)} Н`;
      case 'disc': return `ω ${f(M.DISC.w)} рад/с   T ${f(M.DISC.T)} с\nv₁ ${f(M.DISC.v1)} м/с   v₂ ${f(M.DISC.v2)} м/с`;
      case 'gravity': { const r = M.sep(t); return `r ${f(r)} м\nF ${f(M.gravF(M.SPHERES.m1, M.SPHERES.m2, r) * 1e6, 1)} мкН на каждую сферу`; }
      case 'orbit': return `t ${f(t * M.ORBIT_TIME / 3600, 1)} ч\nv₁ ${f(M.orbitV(M.SAT.r1) / 1000)} км/с   v₂ ${f(M.orbitV(M.SAT.r2) / 1000)} км/с`;
      case 'kepler': { const p = M.ELL.track.at(t * M.ORBIT_TIME); return `r ${f(p.r / M.EARTH.R)} R_E   v ${f(p.v / 1000)} км/с\nr·v⊥ ${((p.x * p.vy - p.y * p.vx) / 1e10).toFixed(3)} × 10¹⁰ м²/с`; }
      case 'orbitE': { const p = M.ELL.track.at(t * M.ORBIT_TIME), K = 0.5 * M.SAT_M * p.v ** 2, U = M.Ugrav(p.r); return `K ${f(K / 1e9, 1)} ГДж   U ${f(U / 1e9, 1)} ГДж\nE ${f((K + U) / 1e9, 2)} ГДж`; }
      case 'well': { const r = M.wellR(t); return `r ${f(r / M.EARTH.R)} R_E   U ${f(M.Ugrav(r) / 1e9, 1)} ГДж\nF ${f(M.GM * M.SAT_M / r ** 2 / 1000)} кН`; }
      case 'escape': return `v_esc ${f(M.LAUNCH.vesc / 1000)} км/с на расстоянии 2 R_E\nv_c ${f(M.LAUNCH.vc / 1000)} км/с`;
    }
    return '';
  },
  onFrame(s, sheets) {
    // chart cursors follow the live scene
    const t = s.clock;
    const put = (key, x, y) => { for (const el of sheets) el.querySelectorAll(`circle[data-cursor="${key}"]`).forEach(c => { c.setAttribute('cx', x); c.setAttribute('cy', y); }); };
    put('whirl', CH.sx(t % 5, 0, 5), CH.sy(M.uniform(M.BALL.r, M.V1, t % 5).vx, -3, 3));
    put('flatcar', CH.sx(M.CAR.v, 0, 12), CH.sy(M.CAR.f / 1000, 0, 16));
    const q = M.loopState(t); put('loop', CH.sx((q.phi * 180 / Math.PI) % 360, 0, 360), CH.sy(q.N / 1000, 0, 35));
    const p = M.ELL.track.at(t * M.ORBIT_TIME), d = p.th * 180 / Math.PI;
    put('kepler', CH.sx(d, 0, 360), CH.sy(p.v / 1000, 0, 8));
    put('orbitK', CH.sx(d, 0, 360), CH.sy(0.5 * M.SAT_M * p.v ** 2 / 1e9, -35, 25)); put('orbitU', CH.sx(d, 0, 360), CH.sy(M.Ugrav(p.r) / 1e9, -35, 25));
    const r = M.sep(t); put('gravity', CH.sx(r, 0.8, 3.2), CH.sy(M.gravF(M.SPHERES.m1, M.SPHERES.m2, r) * 1e6, 0, 220));
  },
});
