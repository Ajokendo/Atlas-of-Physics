// Chapter 4: work, energy and power, on the shared book.
import { startBook } from '../engine/book.js';
import { buildWorld } from './world.js';
import { PAGES, PLATES, CH, R, BARS } from './pages.js';
import * as M from './model.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);

startBook({
  no: 4, PAGES, PLATES, clock0: 0,
  lookKeys: [],
  buildWorld(E) {
    const W = buildWorld(E);
    return { update: s => W.update(s), labels: W.labels };
  },
  state: (clock, reduced) => {
    const c = reduced ? 1.0 / M.SLOW : clock, L = run => M.loop(c, run);
    return { clock: c, pull: L(M.PULL.run), toss: L(M.TOSS.run), car: L(M.CAR.run), drop: L(M.DROP.run), spring: L(M.SPRING.run), pendulum: { t: c * M.SLOW }, slide: L(M.SLIDE.run), lift: L(M.LIFT.run),
      push: L(M.PUSH.run), bead: { t: c * M.SLOW }, bond: { t: c * M.SLOW * M.BOND.tscale } };
  },
  readout(s, page) {
    switch (page.scene) {
      case 'pull': { const r = M.pull(s.pull.t); return `Δx ${f(r.x)} м   v ${f(r.v)} м/с\nW = F Δx cos θ = ${f(r.W)} Дж   K ${f(r.K)} Дж`; }
      case 'toss': { const r = M.toss(s.toss.t); return `y ${f(r.y)} м   v ${f(r.v)} м/с\nW_g ${f(r.Wg)} Дж   K ${f(r.K)} Дж`; }
      case 'whirl': return `v ${f(M.WHIRL.v)} м/с   T ${f(M.WHIRL.T)} Н   θ 90°\nW_T = 0 Дж   K ${f(M.WHIRL.K)} Дж`;
      case 'car': { const r = M.car(s.car.t); return `Δx ${f(r.x)} м   v ${f(r.v)} м/с\nW_net ${f(r.Wnet / 1000)} кДж   K ${f(r.K / 1000)} кДж`; }
      case 'drop': { const r = M.drop(s.drop.t); return `y ${f(r.y)} м   v ${f(r.v)} м/с\nU_g ${f(r.U)} Дж + K ${f(r.K)} Дж = ${f(r.U + r.K)} Дж`; }
      case 'spring': { const r = M.spring(s.spring.t); return `Δx ${f(r.x, 3)} м   F_s ${f(r.F)} Н\nK ${f(r.K)} Дж + U_s ${f(r.U)} Дж = ${f(r.K + r.U)} Дж`; }
      case 'pendulum': { const r = M.pendulum(s.pendulum.t); return `θ ${f(r.th * 180 / Math.PI, 1)}°   v ${f(r.v)} м/с\nK ${f(r.K)} Дж + U_g ${f(r.U)} Дж = ${f(r.K + r.U)} Дж`; }
      case 'push': { const r = M.push(s.push.t); return `x ${f(r.x)} м   F ${f(r.F)} Н   v ${f(r.v)} м/с\nW = ∫F dx ${f(r.W)} Дж   K ${f(r.K)} Дж`; }
      case 'bead': { const r = M.bead(s.bead.t); return `x ${f(r.x)} м   dU/dx ${f(r.slope)} Дж/м   F ${f(r.F)} Н\nK ${f(r.K)} Дж + U ${f(r.U)} Дж = ${f(r.K + r.U)} Дж`; }
      case 'bond': { const r = M.bond(s.bond.t); return `r ${f(r.r * 1e9, 4)} нм   F ${f(r.F * 1e9)} нН\nK ${f(r.K / M.EV, 3)} эВ + U ${f(r.U / M.EV, 3)} эВ = ${f((r.K + r.U) / M.EV, 3)} эВ`; }
      case 'slide': { const r = M.slide(s.slide.t); return `Δx ${f(r.x)} м   v ${f(r.v)} м/с\nK ${f(r.K)} Дж + тепло ${f(r.Eth)} Дж = ${f(r.K + r.Eth)} Дж`; }
      case 'lift': { const a = M.lift(s.lift.t, M.LIFT.vFast), b = M.lift(s.lift.t, M.LIFT.vSlow); return `t ${f(s.lift.t)} с\nбыстро: W ${f(a.W, 0)} Дж, P ${f(a.P, 0)} Вт   медленно: W ${f(b.W, 0)} Дж, P ${f(b.P, 0)} Вт`; }
    }
    return '';
  },
  onFrame(s, sheets) {
    const q = sel => sheets.flatMap(el => [...el.querySelectorAll(sel)]);
    const put = (key, r, x, y) => q(`circle[data-cursor="${key}"]`).forEach(c => { c.setAttribute('cx', CH.sx(x, r.x0, r.x1)); c.setAttribute('cy', CH.sy(y, r.y0, r.y1, r.h)); });
    const pu = M.pull(s.pull.t); put('pull', R.pull, pu.x, pu.W);
    const to = M.toss(s.toss.t); put('tossK', R.toss, s.toss.t, to.K); put('tossW', R.toss, s.toss.t, to.Wg);
    const ca = M.car(s.car.t); put('car', R.car, ca.x, ca.K / 1000);
    const dr = M.drop(s.drop.t); put('dropU', R.drop, dr.y, dr.U); put('dropK', R.drop, dr.y, dr.K);
    const sl = M.slide(s.slide.t); put('slideK', R.slide, sl.x, sl.K); put('slideT', R.slide, sl.x, sl.Eth);
    put('liftF', R.lift, s.lift.t, M.lift(s.lift.t, M.LIFT.vFast).W); put('liftS', R.lift, s.lift.t, M.lift(s.lift.t, M.LIFT.vSlow).W);
    // spring: the cursor rides the line, the shaded triangle under it is the stored energy
    const sp = M.spring(s.spring.t), Rs = R.spring, X = v => CH.sx(v, Rs.x0, Rs.x1), Y = v => CH.sy(v, Rs.y0, Rs.y1);
    put('spring', Rs, sp.x, -sp.F);
    q('path[data-area="spring"]').forEach(p => p.setAttribute('d', `M${X(0)},${Y(0)}L${X(sp.x)},${Y(0)}L${X(sp.x)},${Y(-sp.F)}Z`));
    q('#springlive').forEach(el => { el.textContent = `заштрихованная площадь ½·${f(sp.x, 3)}·${f(-sp.F, 1)} = ${f(sp.U)} Дж = U_s`; });
    // push: the area under F(x) up to the crate is the work so far
    { const r = M.push(s.push.t), Rp = R.push, X = v => CH.sx(v, Rp.x0, Rp.x1), Y = v => CH.sy(v, Rp.y0, Rp.y1, Rp.h), xe = Math.min(r.x, M.PUSH.L);
      put('push', Rp, Math.min(r.x, Rp.x1), r.F);
      const pts = Array.from({ length: 41 }, (_, i) => { const x = xe * i / 40; return `L${X(x).toFixed(1)},${Y(M.pushF(x)).toFixed(1)}`; }).join('');
      q('path[data-area="push"]').forEach(p => p.setAttribute('d', `M${X(0)},${Y(0)}${pts}L${X(xe)},${Y(0)}Z`));
    }
    // bead: the tangent to U(x) at the bead; its slope is −F
    { const r = M.bead(s.bead.t), Ru = R.beadU, X = v => CH.sx(v, Ru.x0, Ru.x1), Y = v => CH.sy(v, Ru.y0, Ru.y1, Ru.h), hw = 0.7;
      put('beadU', Ru, r.x, r.U); put('beadF', R.beadF, r.x, r.F);
      q('line[data-tangent="bead"]').forEach(l => { l.setAttribute('x1', X(r.x - hw)); l.setAttribute('y1', Y(r.U - hw * r.slope)); l.setAttribute('x2', X(r.x + hw)); l.setAttribute('y2', Y(r.U + hw * r.slope)); });
    }
    { const r = M.bond(s.bond.t); put('bondU', R.bondU, r.r * 1e9, r.U / M.EV); }
    // pendulum: live energy bars
    const pe = M.pendulum(s.pendulum.t), span = BARS.base - BARS.top;
    for (const [k, v] of [['K', pe.K], ['U', pe.U], ['E', pe.K + pe.U]]) {
      const h = span * v / M.PEND.E;
      q(`rect[data-bar="pend-${k}"]`).forEach(r => { r.setAttribute('y', BARS.base - h); r.setAttribute('height', h); });
      q(`text[data-val="pend-${k}"]`).forEach(t => { t.setAttribute('y', BARS.base - h - 6); t.textContent = `${f(v)} Дж`; });
    }
  },
});
