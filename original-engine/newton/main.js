// Chapter 2: Newton's laws, on the shared book.
import { startBook } from '../engine/book.js';
import { buildWorld } from './world.js';
import { PAGES, PLATES, CH } from './pages.js';
import * as M from './model.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);

startBook({
  no: 2, PAGES, PLATES, clock0: 0,
  lookKeys: [],
  buildWorld(E) {
    const W = buildWorld(E);
    return { update: (s, look) => W.update(s.clock, look), labels: W.labels };
  },
  state: (clock, reduced) => {
    const c = reduced ? 1.0 / M.SLOW : clock;
    return { clock: c, car: M.loop(c, M.CAR.run), glide: M.loop(c, M.GLIDE_T), second: M.loop(c, M.PUSH_T), friction: M.loop(c, M.FRIC_T), third: M.loop(c, M.PAIR_T), incline: M.loop(c, M.INC_T), tug: M.loop(c, M.TUG.run), board: M.loop(c, M.BOARD.run), drag: M.loop(c, M.DRAG.run), honey: M.loop(c, M.HONEY.run) };
  },
  readout(s, page) {
    switch (page.scene) {
      case 'tension': { const th = M.hangAngle(s.clock * M.SLOW); return `одна нить: T ${f(M.W1)} Н\nдве нити под углом ${th.toFixed(1)}°: T ${f(M.tension2(th))} Н каждая`; }
      case 'plane': return `подъёмная сила ${f(M.PLANE.L / 1000)} кН   сила тяжести ${f(M.PLANE.W / 1000)} кН\nтяга ${f(M.PLANE.T / 1000)} кН   сопротивление ${f(M.PLANE.D / 1000)} кН   ΣF = 0`;
      case 'car': { const c = M.car(s.car.t); return `t ${f(s.car.t)} с   v ${f(c.v)} м/с\nтрение ${f(M.CAR.F)} Н   сопротивление ${f(c.D)} Н   a ${f(c.a)} м/с²`; }
      case 'rest': return `ΣF = ${f(M.FN)} − ${f(M.W1)} = 0 Н\na = 0 м/с²`;
      case 'glide': return `v ${f(M.V_GLIDE)} м/с   ΣF = 0 Н\na = 0 м/с²`;
      case 'second': { const t = s.second.t; return `t ${f(t)} с\n2 кг: v ${f(M.A1 * t)} м/с   4 кг: v ${f(M.A2 * t)} м/с`; }
      case 'friction': { const r = M.friction(s.friction.t); return `F ${f(r.F)} Н   f ${f(r.f)} Н (${r.kind === 'static' ? 'покой' : 'скольжение'})\nΣF ${f(r.F - r.f)} Н   a ${f(r.a)} м/с²`; }
      case 'third': { const t = s.third.t; return `t ${f(t)} с   a ${f(M.A_PAIR)} м/с²\nF_A→B ${f(M.CONTACT, 1)} Н   F_B→A ${f(M.CONTACT, 1)} Н`; }
      case 'incline': { const r = M.incline(s.incline.t); return `вдоль плоскости: s ${f(r.s)} м   v ${f(r.v)} м/с\na = g sin θ = ${f(M.A_INC)} м/с²`; }
      case 'tug': { const r = M.tug(s.tug.t); return `x_A ${f(r.xA)} м   x_B ${f(r.xB)} м\nx_cm ${f(0)} м   T ${M.TUG.T} Н на каждую нить`; }
      case 'board': { const r = M.board(s.board.t); return `t ${f(s.board.t)} с   F ${M.BOARD.F} Н   a_cm ${f(M.BOARD.aCm)} м/с²\nv блока ${f(r.vBlock)}   доски ${f(r.vBoard)}   центра масс ${f(M.xcm([M.BOARD.m, M.BOARD.Mb], [r.vBlock, r.vBoard]))} м/с`; }
      case 'drag': { const r = M.linDrag(s.drag.t); return `t ${f(s.drag.t)} с   v ${f(r.v)} м/с (${(100 * r.v / M.DRAG.vt).toFixed(1)}% от v_t)\nmg ${f(M.DRAG.W)} Н   bv ${f(r.D)} Н`; }
      case 'honey': { const r = M.honey(s.honey.t); return `погружение ${f(r.x * 100, 1)} см   v ${f(r.v * 100)} см/с\nmg ${f(M.HONEY.W * 1000, 1)} мН = bv ${f(M.HONEY.b * r.v * 1000, 1)} + B ${f(M.HONEY.B * 1000, 1)} мН`; }
    }
    return '';
  },
  onFrame(s, sheets) {
    // the friction chart's cursor follows the live push
    const r = M.friction(s.friction.t), th = M.hangAngle(s.clock * M.SLOW), cv = M.car(s.car.t);
    const put = (key, x, y) => { for (const el of sheets) el.querySelectorAll(`circle[data-cursor="${key}"]`).forEach(c => { c.setAttribute('cx', x); c.setAttribute('cy', y); }); };
    put('friction', CH.sx(Math.min(r.F, 12), 0, 12), CH.sy(r.f, 0, 12));
    put('tension', CH.sx(th, 10, 90), CH.sy(Math.min(M.tension2(th), 60), 0, 60));
    put('car', CH.sx(s.car.t, 0, 3.2), CH.sy(cv.v, 0, 10));
    put('tug', CH.sx(s.tug.t, 0, 1.7), CH.sy(0, -3, 2));
    put('board', CH.sx(s.board.t, 0, 1.1), CH.sy(M.BOARD.aCm * s.board.t, 0, 4.5));
    const ld = M.linDrag(s.drag.t);
    put('drag', CH.sx(s.drag.t, 0, 2), CH.sy(ld.v, 0, 4.5)); put('dragF', CH.sx(s.drag.t, 0, 2), CH.sy(ld.D, 0, 6));
  },
});
