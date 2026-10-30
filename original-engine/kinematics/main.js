// Chapter 1: kinematics, on the shared book.
import { startBook } from '../engine/book.js';
import { buildWorld } from './world.js';
import { PAGES, PLATES, KR, KC } from './pages.js';
import * as M from './model.js';

const sgn = v => v > 1e-9 ? '+' : v < -1e-9 ? '−' : ' ';
const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
// breakdowns read the flight time (pages 1.7–1.10 read the whole state)
const plates = Object.fromEntries(Object.entries(PLATES).map(([k, p]) => [k, { text: p.text, facts: s => p.facts(s.t, s) }]));

startBook({
  no: 1, PAGES, PLATES: plates, clock0: 0.9 / M.SLOW,
  lookKeys: ['disp', 'strobe', 'proj', 'comp', 'level'],
  buildWorld(E) {
    const W = buildWorld(E);
    const labels = [
      { cls: 'vec', html: 'v', at: () => W.anchors.v() },
      { cls: 'vec red', html: 'a', at: () => W.anchors.a() },
      { cls: 'vec', html: 'v<sub>x</sub>', at: () => W.anchors.vx() },
      { cls: 'vec', html: 'v<sub>y</sub>', at: () => W.anchors.vy() },
      ...[0, 1, 2, 3, 4, 5].map(q => ({ cls: 'tick', html: q ? `${q} m` : '0', at: () => W.anchors.staff(q) })),
      ...[['boardX', 'координата <i>y</i> (м)'], ['boardV', 'скорость <i>v</i> (м/с)'], ['boardA', 'ускорение <i>a</i> (м/с²)']].flatMap(([k, t]) => [
        { cls: 'board', html: t, at: () => W.anchors.board(k, 'title') },
        { cls: 'axis', html: '<i>t</i> (с)', at: () => W.anchors.board(k, 'axis') },
      ]),
      ...W.labels2,
    ];
    return { update: (s, look) => { W.update(s.t, look, s.resting); W.update2(s); }, labels };
  },
  state: (clock, reduced) => {
    const c = reduced ? 3.0 : clock;
    return {
      ...(reduced ? { t: M.T * 0.3, resting: false } : M.flight(clock)),
      rain: c * M.RAIN.slow,
      river: M.loop(c * M.RIVER.rate, M.RIVER_RUN, 1.5),
      pull: M.loop(c * M.PULL.slow, M.PULL.run, 0.6),
      cube: M.loop(c * M.CUBE.slow, M.CUBE.run, 0.6),
    };
  },
  forceLook(selected, look) {
    if (selected === 'staff') look.disp = 1;
    if (selected === 'proj' || selected === 'projV' || selected === 'shadow') look.proj = 1;
  },
  readout(s, page) {
    switch (page.scene) {
      case 'rain': return `автомобиль ${f(M.RAIN.vc)} м/с   дождь ${f(M.RAIN.vr)} м/с вниз\nотносительно автомобиля: ${f(M.vlen(M.V_RC))} м/с, ${f(M.RAIN_ANGLE, 1)}° от вертикали`;
      case 'river': { const t = s.river.t, [ax] = M.boatPos(0, t), [, by] = M.boatPos(M.AIM_UP, t); return `t ${f(Math.min(t, M.RIVER_RUN), 1)} с\nпрямо поперёк: снос ${f(ax, 1)} м   против течения: переправа ${f(by, 1)} м`; }
      case 'pull': { const t = s.pull.t; return `t ${f(t)} с   x ${f(M.px(t)).padStart(5)} м\nv ${f(M.pv(t)).padStart(5)} м/с   a ${f(M.pa(t))} м/с²`; }
      case 'cube': { const t = s.cube.t; return `t ${f(t)} с   x ${f(M.cx(t)).padStart(5)} м\nv ${f(M.cv(t)).padStart(5)} м/с   a ${f(M.ca(t)).padStart(5)} м/с²`; }
    }
    const { t, resting } = s;
    const v = resting ? 0 : M.vy(t);
    return `t ${t.toFixed(2)} с   y ${M.y(t).toFixed(2).padStart(5)} м\nv ${sgn(v)}${Math.abs(v).toFixed(2)} м/с   a ${resting ? ' 0.00' : '−' + M.G.toFixed(2)} м/с²`;
  },
  onFrame(s, sheets) {
    const { t, resting } = s;
    const q = sel => sheets.flatMap(el => [...el.querySelectorAll(sel)]);
    const live = document.getElementById('live-sign');
    if (live) {
      const v = M.vy(t);
      live.textContent = resting ? 'сейчас: мяч покоится на земле между бросками' : Math.abs(v) < 0.05 ? 'сейчас: верхняя точка, v = 0, a = −9,80 м/с²'
        : v > 0 ? `сейчас: v = +${v.toFixed(2)}, a = −9,80 → знаки противоположны → замедление` : `сейчас: v = −${(-v).toFixed(2)}, a = −9,80 → знаки совпадают → ускорение`;
    }
    // live chart pieces: cursors, areas from 0 to now, tangents at now
    const cursor = (key, R, x, y) => q(`circle[data-cursor="${key}"]`).forEach(c => { c.setAttribute('cx', KC.sx(x, R)); c.setAttribute('cy', KC.sy(y, R)); });
    const area = (key, R, fn, t1) => q(`path[data-area="${key}"]`).forEach(p => {
      let d = `M${KC.sx(0, R)},${KC.sy(0, R)}`;
      for (let i = 0; i <= 60; i++) { const u = t1 * i / 60; d += `L${KC.sx(u, R).toFixed(1)},${KC.sy(fn(u), R).toFixed(1)}`; }
      p.setAttribute('d', d + `L${KC.sx(t1, R)},${KC.sy(0, R)}Z`);
    });
    const tangent = (key, R, fn, slope, t1, half) => q(`line[data-tan="${key}"]`).forEach(l => {
      // a short tangent, clipped to the chart frame
      let a = Math.max(R.x0, t1 - half), b = Math.min(R.x1, t1 + half);
      const y = u => fn(t1) + slope * (u - t1), uAt = yy => t1 + (yy - fn(t1)) / slope;
      if (Math.abs(slope) > 1e-9) for (const lim of [R.y0, R.y1]) { const u = uAt(lim); if (u > t1 && u < b) b = u; if (u < t1 && u > a) a = u; }
      l.setAttribute('x1', KC.sx(a, R)); l.setAttribute('y1', KC.sy(y(a), R)); l.setAttribute('x2', KC.sx(b, R)); l.setAttribute('y2', KC.sy(y(b), R));
    });
    if (q('[data-cursor="boatA"]').length) {
      const tw = s.river.t;
      cursor('boatA', KR.map, ...M.boatPos(0, tw)); cursor('boatB', KR.map, ...M.boatPos(M.AIM_UP, tw));
    }
    if (q('[data-cursor="pa"]').length) {
      const u = s.pull.t;
      area('pa', KR.pa, M.pa, u); cursor('pa', KR.pa, u, M.pa(u));
      area('pv', KR.pv, M.pv, u); tangent('pv', KR.pv, M.pv, M.pa(u), u, 0.8); cursor('pv', KR.pv, u, M.pv(u));
      tangent('px', KR.px, M.px, M.pv(u), u, 0.8); cursor('px', KR.px, u, M.px(u));
    }
    if (q('[data-cursor="cx"]').length) {
      const u = s.cube.t;
      tangent('cx', KR.cx, M.cx, M.cv(u), u, 0.35); cursor('cx', KR.cx, u, M.cx(u));
      area('cv', KR.cv, M.cv, u); cursor('cv', KR.cv, u, M.cv(u));
      area('ca', KR.ca, M.ca, u); cursor('ca', KR.ca, u, M.ca(u));
    }
  },
});
