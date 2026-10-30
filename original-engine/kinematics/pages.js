// The chapter, page by page: text on the left, and for the figure on the right the camera,
// the one lit thing and what is shown. Every number comes from model.js.
import * as M from './model.js';
import { ST, RAIN_V, RIV, PULLS } from './world.js';

const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const tau = M.STROBE;
const deg = r => (r * 180 / Math.PI).toFixed(1);

// ---------- small SVG charts for pages 1.7–1.10 (live parts are updated in main.js) ----------
const CW = 420, CH = 86, CP = { l: 40, r: 12, t: 9, b: 19 };
export const KR = {
  rain: { x0: 0, x1: 30, y0: 0, y1: 90 },
  map: { x0: -2, x1: 16, y0: 0, y1: 24 },
  pa: { x0: 0, x1: 5, y0: 0, y1: 6 }, pv: { x0: 0, x1: 5, y0: 0, y1: 12 }, px: { x0: 0, x1: 5, y0: 0, y1: 45 },
  cx: { x0: 0, x1: 2, y0: -3, y1: 3 }, cv: { x0: 0, x1: 2, y0: -3, y1: 9 }, ca: { x0: 0, x1: 2, y0: 0, y1: 12 },
};
export const KC = {
  sx: (x, R) => CP.l + (x - R.x0) / (R.x1 - R.x0) * (CW - CP.l - CP.r),
  sy: (y, R) => CP.t + (1 - (y - R.y0) / (R.y1 - R.y0)) * (CH - CP.t - CP.b),
};
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
function kchart(R, { series, xlabel, ylabel, label, live = '', marks = [] }) {
  const sx = x => KC.sx(x, R), sy = y => KC.sy(y, R);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const zero = R.y0 < 0 ? `<line class="zero" x1="${CP.l}" x2="${CW - CP.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  const fmt = v => (v < 0 ? '−' : '') + Math.abs(v);
  return `<svg class="chart" viewBox="0 0 ${CW} ${CH}" role="img" aria-label="${label}">
    <rect class="frame" x="${CP.l}" y="${CP.t}" width="${CW - CP.l - CP.r}" height="${CH - CP.t - CP.b}"/>${zero}${live}${paths}${mk}
    <text class="ax" x="${CP.l - 6}" y="${sy(R.y1) + 4}" text-anchor="end">${fmt(R.y1)}</text><text class="ax" x="${CP.l - 6}" y="${sy(R.y0) + 4}" text-anchor="end">${fmt(R.y0)}</text>
    <text class="ax" x="${CP.l}" y="${CH - 7}">${R.x0}</text><text class="ax" x="${CW - CP.r}" y="${CH - 7}" text-anchor="end">${R.x1}</text>
    <text class="lab" x="${CP.l + 6}" y="${CP.t + 13}">${ylabel}</text><text class="ax" x="${(CP.l + CW - CP.r) / 2}" y="${CH - 7}" text-anchor="middle">${xlabel}</text>
  </svg>`;
}
// live pieces: a shaded area (filled by main.js), a red tangent, a cursor
const AREA = k => `<path data-area="${k}" style="fill:rgba(229,72,77,.18);stroke:none"/>`;
const TAN = k => `<line data-tan="${k}" style="stroke:#e5484d;stroke-width:1.4"/>`;
const CUR = k => `<circle class="cursor" r="4.5" data-cursor="${k}"/>`;

export const PAGES = [
  {
    kicker: 'Глава 1', title: 'Кинематика', sub: 'описание движения',
    body: `
      <p class="lede">Кинематика описывает движение с помощью трёх величин: положения тела, его скорости и изменения скорости. Она не рассматривает причины движения.</p>
      <p>В этой главе мы рассмотрим мяч, брошенный вертикально вверх со скоростью ${f(M.VY0)} м/с. После того как мяч покидает руку, на него действует только сила тяжести — это <b>свободное падение</b>. Это верно и при подъёме, и при падении.</p>
      <p>Мяч поднимается в течение ${f(M.T / 2)} с, достигает высоты ${f(M.H)} м и приземляется через ${f(M.T)} с после броска. Анимация показана в половинном темпе.</p>`,
    cam: { target: [-1.0, 2.7, 0], az: 22, el: 7, dist: 21 }, lit: 'ball', look: { strobe: 1, level: 1 },
    fig: 'Мяч, брошенный вертикально вверх',
  },
  {
    kicker: '1.1', title: 'Положение', sub: 'перемещение и путь',
    body: `
      <p class="lede"><b>Положение</b> <i>y</i> — координата мяча относительно начала отсчёта. Здесь начало отсчёта совпадает с точкой броска, а направление вверх считается положительным.</p>
      <p><b>Перемещение</b> Δ<i>y</i> = <i>y</i><sub>f</sub> − <i>y</i><sub>0</sub> — изменение координаты. Это векторная величина: у неё есть модуль и направление (чёрная стрелка рядом с осью).</p>
      <p><b>Путь</b> — полная длина траектории. Это скалярная величина, которая не бывает отрицательной.</p>
      <table class="data">
        <tr><th></th><th>перемещение</th><th>путь</th></tr>
        <tr><td>старт → верхняя точка</td><td>+${f(M.H)} m</td><td>${f(M.H)} m</td></tr>
        <tr><td>старт → приземление</td><td>0.00 m</td><td>${f(2 * M.H)} m</td></tr>
      </table>`,
    cam: { target: [-0.3, 2.9, 0], az: -16, el: 6, dist: 15 }, lit: 'staff', look: { disp: 1 },
    fig: 'Ось положения',
  },
  {
    kicker: '1.2', title: 'Скорость', sub: 'векторная скорость и модуль скорости',
    body: `
      <p class="lede"><b>Скорость</b> <i>v</i> = Δ<i>y</i>/Δ<i>t</i> показывает, как быстро изменяется координата, и имеет направление. <b>Модуль скорости</b> — величина скорости без указания направления.</p>
      <p>Стрелка показывает скорость. В начале она равна +${f(M.VY0)} м/с, в верхней точке уменьшается до нуля, а затем направлена вниз и возрастает по модулю до −${f(M.VY0)} м/с при приземлении. Модули скоростей в начале и конце одинаковы, но направления противоположны.</p>
      <p>То же различие сохраняется для средних значений за весь полёт:</p>
      <table class="data">
        <tr><td>средняя векторная скорость</td><td>Δ<i>y</i>/Δ<i>t</i> = 0 / ${f(M.T)} = 0 m/s</td></tr>
        <tr><td>средняя путевая скорость</td><td>путь/Δ<i>t</i> = ${f(2 * M.H)} / ${f(M.T)} = ${f(2 * M.H / M.T)} m/s</td></tr>
      </table>`,
    cam: { target: [0.1, 3.0, 0.2], az: 24, el: 8, dist: 18 }, lit: 'vArrow', look: {},
    fig: 'Скорость',
  },
  {
    kicker: '1.3', title: 'Ускорение', sub: 'скорость изменения скорости',
    body: `
      <p class="lede"><b>Ускорение</b> <i>a</i> = Δ<i>v</i>/Δ<i>t</i>. Для этого мяча ускорение равно −${f(M.G)} м/с² на всём протяжении движения: при подъёме, в верхней точке и при падении. Красная стрелка не меняется.</p>
      <p>Полупрозрачные изображения мяча образуют стробоскопическую последовательность с интервалом ${f(tau, 1)} с. При подъёме расстояния между изображениями уменьшаются на <i>g</i>τ² = ${f(M.G * tau * tau)} м за каждый интервал. При падении мяч проходит те же высоты в обратном порядке.</p>
      <p><b>Ускоряется или замедляется?</b> Сравните знаки. Если <i>v</i> и <i>a</i> имеют разные знаки, мяч замедляется (при подъёме). Если знаки совпадают — ускоряется (при падении). В обоих случаях это ускоренное движение.</p>
      <p class="live" id="live-sign"></p>`,
    cam: { target: [0.1, 2.75, 0], az: -6, el: 5, dist: 15.5 }, lit: 'aArrow', look: { strobe: 1 },
    fig: 'Стробоскопическая последовательность, интервал ' + tau.toFixed(1) + ' с',
  },
  {
    kicker: '1.4', title: 'Графики движения', sub: 'наклоны и площади',
    body: `
      <p class="lede">Три графика описывают один и тот же полёт. График координаты построен в масштабе: высота на нём соответствует реальной высоте мяча.</p>
      <ul class="rules">
        <li>наклон графика <i>x</i>–<i>t</i> = скорость</li>
        <li>наклон графика <i>v</i>–<i>t</i> = ускорение</li>
        <li>площадь под графиком <i>v</i>–<i>t</i> = перемещение</li>
        <li>площадь под графиком <i>a</i>–<i>t</i> = изменение скорости</li>
      </ul>
      <p>Постоянное ускорение даёт горизонтальную линию на графике <i>a</i>–<i>t</i>, прямую на графике <i>v</i>–<i>t</i> и параболу на графике <i>x</i>–<i>t</i>.</p>
      <p class="hintline">Нажмите на график, чтобы увидеть его наклон и площадь.</p>`,
    cam: { target: [-7.6, 3.0, -1.0], az: 0, el: 3, dist: 40 }, lit: 'boardX', look: { level: 1 },
    fig: 'Координата, скорость и ускорение во времени',
  },
  {
    kicker: '1.5', title: 'Кинематические уравнения', sub: 'только при постоянном ускорении',
    body: `
      <p class="lede">Движение описывают пять величин: Δ<i>y</i>, <i>v</i><sub>0</sub>, <i>v</i>, <i>a</i>, <i>t</i>. В каждом уравнении отсутствует одна из них. Выберите уравнение без той величины, которую вы не знаете и которая вам не нужна.</p>
      <table class="data eqs">
        <tr><th>уравнение</th><th>не содержит</th></tr>
        <tr><td><i>v</i> = <i>v</i><sub>0</sub> + <i>at</i></td><td>Δ<i>y</i></td></tr>
        <tr><td>Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>²</td><td><i>v</i></td></tr>
        <tr><td><i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i></td><td><i>t</i></td></tr>
        <tr><td>Δ<i>y</i> = ½(<i>v</i><sub>0</sub> + <i>v</i>)<i>t</i></td><td><i>a</i></td></tr>
        <tr><td>Δ<i>y</i> = <i>vt</i> − ½<i>at</i>²</td><td><i>v</i><sub>0</sub></td></tr>
      </table>
      <p>Какую максимальную высоту достигнет мяч? В верхней точке <i>v</i> = 0, время <i>t</i> не требуется: 0 = ${f(M.VY0)}² + 2(−${f(M.G)})Δ<i>y</i>, откуда Δ<i>y</i> = ${f(M.H)} м.</p>`,
    cam: { target: [-3.2, 3.1, -0.4], az: 20, el: 15, dist: 34 }, lit: 'ball', look: { level: 1 },
    fig: 'Один полёт — пять величин',
  },
  {
    kicker: '1.6', title: 'Движение тела, брошенного под углом', sub: 'два движения одновременно',
    body: `
      <p class="lede">Второй мяч бросают одновременно с первым: начальная вертикальная скорость равна ${f(M.VY0)} м/с, горизонтальная — ${f(M.VX)} м/с.</p>
      <p>It stays level with the first ball the whole way and lands at the same moment. The vertical motion is free fall, and the sideways скорость doesn’t change it. Its shadow on the floor moves in equal ${f(M.VX * tau)} m steps: the horizontal motion is uniform.</p>
      <table class="data cols">
        <tr><th>горизонтальное · равномерное</th><th>вертикальное · свободное падение</th></tr>
        <tr><td><i>v</i><sub>x</sub> = ${f(M.VX)} m/s</td><td><i>v</i><sub>0</sub> = ${f(M.VY0)} m/s, <i>v</i> = −${f(M.VY0)} m/s</td></tr>
        <tr><td>Δ<i>x</i> = <i>v</i><sub>x</sub><i>t</i> = ${f(M.RANGE, 1)} m</td><td><i>a</i> = −${f(M.G)} m/s², Δ<i>y</i> = 0</td></tr>
        <tr><td><i>t</i> = ${f(M.T)} s</td><td><i>t</i> = ${f(M.T)} s</td></tr>
      </table>
      <p>At the top only the vertical part <i>v</i><sub>y</sub> is zero. The ball still moves sideways at ${f(M.VX)} m/s.</p>`,
    cam: { target: [4.6, 2.7, 0.6], az: -16, el: 13, dist: 33 }, lit: 'projV', look: { proj: 1, comp: 1 },
    fig: 'Одинаковая высота в каждый момент',
  },
  {
    kicker: '1.7', title: 'Системы отсчёта', sub: 'скорость зависит от наблюдателя',
    body: `
      <p class="lede">Every velocity is measured relative to something. Rain falls ${f(M.RAIN.vr, 1)} m/s straight down relative to the road; from a car doing ${f(M.RAIN.vc, 1)} m/s it slants at ${f(M.vlen(M.V_RC))} m/s.</p>
      <p>Write <i>v</i><sub>AB</sub> for “A relative to B” (R rain, C car, G ground). Velocities chain, inner letters matching:</p>
      <div class="eq"><i>v</i><sub>AC</sub> = <i>v</i><sub>AB</sub> + <i>v</i><sub>BC</sub></div>
      <p>So <i>v</i><sub>RC</sub> = <i>v</i><sub>RG</sub> + <i>v</i><sub>GC</sub>, added tip to tail. Swapping letters flips the arrow: from the car the road moves backward, <i>v</i><sub>GC</sub> = −<i>v</i><sub>CG</sub>. The two parts are at right angles, so |<i>v</i><sub>RC</sub>| = √(${f(M.RAIN.vc, 1)}² + ${f(M.RAIN.vr, 1)}²) = ${f(M.vlen(M.V_RC))} m/s, at tan θ = ${f(M.RAIN.vc, 1)}/${f(M.RAIN.vr, 1)}, θ = ${f(M.RAIN_ANGLE, 1)}° from vertical. Faster car, more slant:</p>
      <div class="charts">${kchart(KR.rain, { xlabel: 'скорость автомобиля (м/с)', ylabel: 'угол θ от вертикали (°)', label: 'The rain’s slant, seen from the car, against the car’s скорость',
        series: [{ pts: samples(60, 0, 30, M.rainAngleAt) }], marks: [[M.RAIN.vc, M.RAIN_ANGLE, `${f(M.RAIN_ANGLE, 1)}°`, 8, 16]] })}</div>
      <p class="hintline">Масштаб 1:1. Длина стрелок ${(RAIN_V * 100).toFixed(0)} cm per m/s. ¼ скорость. Click the triangle for the angle.</p>`,
    cam: { target: [ST.rain + 11, 2.3, 0], az: -8, el: 10, dist: 60 }, lit: 'rainSum', look: {}, scene: 'rain',
    fig: 'Один дождь — две системы отсчёта',
  },
  {
    kicker: '1.8', title: 'Переправа через реку', sub: 'сложение векторов скоростей',
    body: `
      <p class="lede">A boat’s velocity relative to the shore is its velocity through the water plus the water’s velocity relative to the shore:</p>
      <div class="eq"><i>v</i><sub>BS</sub> = <i>v</i><sub>BW</sub> + <i>v</i><sub>WS</sub></div>
      <p>Both boats do ${f(M.RIVER.vb, 1)} m/s through water flowing at ${f(M.RIVER.vw, 1)} m/s, поперёк ${M.RIVER.w} m.</p>
      <table class="data">
        <tr><th>m/s, s, m</th><th>направлена прямо поперёк</th><th>aimed ${deg(M.AIM_UP)}° против течения</th></tr>
        <tr><td>скорость</td><td>√(${f(M.RIVER.vb, 1)}² + ${f(M.RIVER.vw, 1)}²) = ${f(M.vlen(M.vBS(0)))}</td><td>√(${f(M.RIVER.vb, 1)}² − ${f(M.RIVER.vw, 1)}²) = ${f(M.vlen(M.vBS(M.AIM_UP)))}</td></tr>
        <tr><td>время</td><td>${M.RIVER.w}/${f(M.RIVER.vb, 1)} = ${f(M.crossTime(0), 1)} s</td><td>${M.RIVER.w}/${f(M.vBS(M.AIM_UP)[1], 1)} = ${f(M.crossTime(M.AIM_UP), 1)} s</td></tr>
        <tr><td>снос течением</td><td>${f(M.RIVER.vw, 1)} × ${f(M.crossTime(0), 1)} = ${f(M.снос течением(0), 1)} m</td><td>0 m</td></tr>
      </table>
      <p>Only the поперёк part gets a boat over, so прямо поперёк is fastest; the current just carries it по течению. To land opposite, turn против течения until sin θ = ${f(M.RIVER.vw, 1)}/${f(M.RIVER.vb, 1)}.</p>
      <div class="charts">${kchart(KR.map, { xlabel: 'по течению (m)', ylabel: 'поперёк (m)', label: 'Траектории обеих лодок, вид сверху',
        live: CUR('boatA') + CUR('boatB'), series: [{ pts: [[0, 0], [M.снос течением(0), M.RIVER.w]], tag: [8.6, 12.5, 'прямо поперёк'] }, { pts: [[0, 0], [0, M.RIVER.w]], tag: [0.3, 3, 'против течения'] }] })}</div>
      <p class="hintline">Drawn 1 m = ${(RIV.s * 100).toFixed(0)} cm. Arrows ${(RIV.v * 100).toFixed(0)} cm per m/s. Shown at ${M.RIVER.rate}× скорость.</p>`,
    cam: { target: [ST.river - 1.7, 0, 0.3], az: -4, el: 44, dist: 40 }, lit: 'boatA', look: {}, scene: 'river',
    fig: 'Направление лодки и снос течением',
  },
  {
    kicker: '1.9 · AP Physics C', title: 'Кинематика с применением анализа', sub: 'переменное ускорение',
    body: `
      <p class="lede">Уравнения из раздела 1.5 применимы при постоянном <i>a</i>. Здесь ускорение автомобиля <i>a</i> = ${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i> м/с² уменьшается до нуля в момент <i>t</i><sub>1</sub> = ${f(M.T1)} с, поэтому используем интегрирование. Автомобиль начинает движение из состояния покоя в точке отсчёта: <i>v</i><sub>0</sub> = 0, <i>x</i><sub>0</sub> = 0.</p>
      <div class="eq"><i>v</i> = <i>v</i><sub>0</sub> + ∫<i>a</i> d<i>t</i> = ${f(M.PULL.a0, 1)}<i>t</i> − ${f(M.PULL.k / 2)}<i>t</i>² &nbsp;→ ${f(M.V1, 1)} m/s</div>
      <div class="eq"><i>x</i> = <i>x</i><sub>0</sub> + ∫<i>v</i> d<i>t</i> = ${f(M.PULL.a0 / 2, 1)}<i>t</i>² − ${f(M.PULL.k / 6)}<i>t</i>³ &nbsp;→ ${f(M.X1, 1)} m</div>
      <div class="charts">
        ${kchart(KR.pa, { xlabel: 't (с)', ylabel: 'a (м/с²) · площадь = Δv', label: 'Ускорение во времени; заштрихована площадь', live: AREA('pa') + CUR('pa'), series: [{ pts: samples(100, 0, 5, M.pa) }] })}
        ${kchart(KR.pv, { xlabel: 't (с)', ylabel: 'v (м/с) · площадь = Δx, наклон = a', label: 'Скорость against время, area shaded', live: AREA('pv') + TAN('pv') + CUR('pv'), series: [{ pts: samples(100, 0, 5, M.pv) }] })}
        ${kchart(KR.px, { xlabel: 't (с)', ylabel: 'x (м) · наклон = v', label: 'Положение against время with its tangent', live: TAN('px') + CUR('px'), series: [{ pts: samples(100, 0, 5, M.px) }] })}
      </div>
      <p class="hintline">Shaded = integrals, red = derivatives. 1 m drawn as ${(PULLS.s * 100).toFixed(0)} cm.</p>`,
    cam: { target: [ST.pull + 4.4, 0.3, 0], az: -8, el: 24, dist: 22 }, lit: 'pull', look: {}, scene: 'pull',
    fig: 'a = ' + M.PULL.a0.toFixed(1) + ' − ' + M.PULL.k.toFixed(1) + 't',
  },
  {
    kicker: '1.10 · AP Physics C', title: 'Движение по закону x(t)', sub: 'дифференцирование и интегрирование',
    body: `
      <p class="lede">Если известна функция <i>x</i>(<i>t</i>), продифференцируйте её. Для <i>x</i> = <i>t</i>³ − 3<i>t</i>:</p>
      <div class="eq"><i>v</i> = 3<i>t</i>² − 3 &nbsp;&nbsp; <i>a</i> = 6<i>t</i></div>
      <p>It starts left at ${f(-M.cv(0))} m/s and turns at <i>t</i> = ${f(M.T_TURN)} s, <i>x</i> = ${f(M.cx(M.T_TURN))} m. Over 2 s: перемещение ${f(M.cx(2))} m, путь ${f(M.cdist(2))} m.</p>
      <p><b>Восстановление исходной функции</b> требует начальных условий: from <i>a</i> = 6<i>t</i>, <i>v</i> = 3<i>t</i>² + <i>C</i><sub>1</sub> and <i>x</i> = <i>t</i>³ + <i>C</i><sub>1</sub><i>t</i> + <i>C</i><sub>2</sub>; <i>v</i>(0) = −3 and <i>x</i>(0) = 0 give <i>C</i><sub>1</sub> = −3, <i>C</i><sub>2</sub> = 0.</p>
      <div class="charts">
        ${kchart(KR.cx, { xlabel: 't (с)', ylabel: 'x (м) · наклон = v', label: 'Координата во времени', live: TAN('cx') + CUR('cx'), series: [{ pts: samples(100, 0, 2, M.cx) }] })}
        ${kchart(KR.cv, { xlabel: 't (с)', ylabel: 'v (м/с) · площадь = Δx', label: 'Скорость во времени; заштрихована знаковая площадь', live: AREA('cv') + CUR('cv'), series: [{ pts: samples(100, 0, 2, M.cv) }] })}
        ${kchart(KR.ca, { xlabel: 't (с)', ylabel: 'a (м/с²) · площадь = Δv', label: 'Ускорение against время, area shaded', live: AREA('ca') + CUR('ca'), series: [{ pts: samples(100, 0, 2, M.ca) }] })}
      </div>
      <p class="hintline">Каждые 0,2 с; обратный путь показан впереди.</p>`,
    cam: { target: [ST.cube + 0.25, 0.25, 0], az: -6, el: 28, dist: 19.5 }, lit: 'bead', look: {}, scene: 'cube',
    fig: 'x = t³ − 3t',
  },
];

// ---------- click a concept: what it breaks into ----------
const sign = v => v > 1e-9 ? '+' : v < -1e-9 ? '−' : '';
export const PLATES = {
  ball: { text: `Мяч движется в условиях свободного падения. После броска его ничто не толкает вверх: он поднимается по инерции, а сила тяжести изменяет скорость на ${M.G.toFixed(2)} м/с каждую секунду.`,
    facts: t => [['время', `${t.toFixed(2)} s`], ['координата y', `${M.y(t).toFixed(2)} m`], ['скорость v', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['ускорение a', `−${M.G.toFixed(2)} m/s²`]] },
  staff: { text: `Вертикальная линия — ось координат, её нулевая отметка совпадает с точкой броска. Короткая метка показывает высоту мяча; чёрная стрелка обозначает перемещение от начала отсчёта. При приземлении перемещение становится равным нулю, хотя общий путь мяча составляет ${(2 * M.H).toFixed(2)} м.`,
    facts: t => [['координата y', `${M.y(t).toFixed(2)} m`], ['перемещение', `${sign(M.y(t))}${Math.abs(M.y(t)).toFixed(2)} m`], ['путь so far', `${M.путь(t).toFixed(2)} m`]] },
  vArrow: { text: `Длина стрелки соответствует модулю скорости, а её направление определяется знаком скорости. Масштаб постоянен: при удвоении скорости длина стрелки также удваивается.`,
    facts: t => [['velocity', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['скорость', `${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['направление', M.vy(t) > 1e-9 ? 'up' : M.vy(t) < -1e-9 ? 'down' : 'none, for an instant']] },
  aArrow: { text: `Ускорение одинаково в каждый момент времени, поэтому эта стрелка не меняется. Мяч замедляется или ускоряется в зависимости от того, совпадает ли знак скорости со знаком ускорения.`,
    facts: t => [['acceleration', `−${M.G.toFixed(2)} m/s²`], ['velocity', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['so the ball is', M.vy(t) > 1e-9 ? 'slowing down' : M.vy(t) < -1e-9 ? 'скоростьing up' : 'at the top']] },
  boardX: { text: `Красная линия — касательная в данный момент. Её наклон (отношение изменения координаты к изменению времени) равен скорости: большой в начале, нулевой в верхней точке и большой отрицательный при приземлении.`,
    facts: t => [['наклон = v', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`]] },
  boardV: { text: `Это прямая линия, поэтому её наклон (ускорение) постоянен. Заштрихованная площадь между графиком и нулевой линией равна перемещению за прошедшее время. Площадь ниже нуля считается отрицательной, поэтому к моменту приземления две части взаимно компенсируются.`,
    facts: t => [['наклон = a', `−${M.G.toFixed(2)} m/s²`], ['area = Δy', `${sign(M.areaUnderV(t))}${Math.abs(M.areaUnderV(t)).toFixed(2)} m`]] },
  boardA: { text: `Горизонтальная линия означает постоянное ускорение. Заштрихованная площадь равна изменению скорости за прошедшее время: a·t.`,
    facts: t => [['площадь = Δv', `${t > 0 ? '−' : ''}${(M.G * t).toFixed(2)} m/s`], ['v = v₀ + Δv', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`]] },
  proj: { text: `Одновременно происходят два независимых движения: равномерное горизонтальное и вертикальное движение под действием силы тяжести. Каждое из них можно рассматривать как отдельную одномерную задачу. Общее для них только время.`,
    facts: t => [['x', `${M.x(t).toFixed(2)} m`], ['y', `${M.y(t).toFixed(2)} m`], ['время', `${t.toFixed(2)} s`]] },
  projV: { text: `Вектор скорости складывается из неизменной горизонтальной составляющей и вертикальной составляющей, которая ведёт себя так же, как скорость первого мяча. Сложив эти векторы по правилу треугольника, получим исходную стрелку.`,
    facts: t => [['vₓ', `${M.VX.toFixed(2)} m/s`], ['v_y', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['скорость √(vₓ² + v_y²)', `${Math.hypot(M.VX, M.vy(t)).toFixed(2)} m/s`]] },
  shadow: { text: `Свет, направленный строго сверху, проецирует движение на пол. Остаётся только горизонтальная составляющая: за равные промежутки времени тело проходит одинаковые расстояния, поскольку по горизонтали силы не действуют.`,
    facts: t => [['Δx so far', `${M.x(t).toFixed(2)} m`], ['step per ' + M.STROBE.toFixed(1) + ' s', `${(M.VX * M.STROBE).toFixed(2)} m`]] },
  rainRoad: { text: `Относительно дороги каждая капля падает вертикально вниз со скоростью ${M.RAIN.vr.toFixed(1)} м/с, а автомобиль движется под дождём со скоростью ${M.RAIN.vc.toFixed(1)} м/с. В этой системе отсчёта наклона нет.`,
    facts: () => [['car, v_CG', `${M.RAIN.vc.toFixed(2)} m/s forward`], ['rain, v_RG', `${M.RAIN.vr.toFixed(2)} m/s down`], ['a drop’s path', 'vertical']] },
  rainCar: { text: `Относительно автомобиля сам автомобиль покоится. Дорога движется назад со скоростью ${M.RAIN.vc.toFixed(1)} м/с. Каждая капля продолжает двигаться вниз и одновременно смещается назад вместе с дорогой, поэтому след дождя наклонён.`,
    facts: () => [['rain, v_RC', `${M.vlen(M.V_RC).toFixed(2)} m/s`], ['slant from vertical', `${M.RAIN_ANGLE.toFixed(1)}°`], ['road, v_GC', `${M.RAIN.vc.toFixed(2)} m/s backward`], ['car', '0 m/s']] },
  rainSum: { text: `Сложение по правилу треугольника: сначала возьмите скорость дождя относительно земли, затем прибавьте скорость земли относительно автомобиля. Вектор от начала первой стрелки до конца последней — скорость дождя относительно автомобиля.`,
    facts: () => [['forward part', `${M.V_RC[0].toFixed(2).replace('-', '−')} m/s`], ['up part', `${M.V_RC[1].toFixed(2).replace('-', '−')} m/s`], ['|v_RC|', `${M.vlen(M.V_RC).toFixed(2)} m/s`], ['tan θ = 10.0 / 7.0', `θ = ${M.RAIN_ANGLE.toFixed(1)}°`]] },
  river: { text: `Вода движется относительно берега со скоростью ${M.RIVER.vw.toFixed(1)} м/с. Любой плавающий объект — лист или лодка — переносится течением с этой скоростью, одновременно совершая собственное движение относительно воды.`,
    facts: (t, s) => [['current, v_WS', `${M.RIVER.vw.toFixed(2)} m/s по течению`], ['width', `${M.RIVER.w} m`], ['время', `${s.river.t.toFixed(1)} s`]] },
  boatA: { text: `Если лодка направлена прямо поперёк реки, она достигает противоположного берега за время w/v_b = ${M.crossTime(0).toFixed(1)} с — это минимальное время переправы. Однако течение сносит её на ${M.снос течением(0).toFixed(1)} м вниз по реке. Направление лодки и направление её движения относительно берега различаются.`,
    facts: (t, s) => boatFacts(0, с.river.t) },
  boatB: { text: `Если направить лодку на ${deg(M.AIM_UP)}° против течения, её составляющая скорости против течения (${M.RIVER.vb.toFixed(1)} sin θ = ${M.RIVER.vw.toFixed(1)} м/с) компенсирует скорость потока. Лодка достигнет противоположного берега строго напротив точки старта, но её поперечная скорость составит лишь ${M.vBS(M.AIM_UP)[1].toFixed(1)} м/с, поэтому переправа займёт ${M.crossTime(M.AIM_UP).toFixed(1)} с.`,
    facts: (t, s) => boatFacts(M.AIM_UP, с.river.t) },
  pull: { text: `Ускорение непостоянно, поэтому кинематические уравнения из раздела 1.5 здесь неприменимы. Изменение скорости равно площади под графиком a–t, а перемещение — площади под графиком v–t. Расстояния между последовательными положениями продолжают увеличиваться, но прирост постепенно уменьшается; когда a = 0, эти расстояния становятся одинаковыми.`,
    facts: (t, s) => { const u = с.pull.t; return [['время', `${u.toFixed(2)} s`], ['x = ∫v dt', `${M.px(u).toFixed(2)} m`], ['v = ∫a dt', `${M.pv(u).toFixed(2)} m/s`], ['a', `${M.pa(u).toFixed(2)} m/s²`]]; } },
  pullA: { text: `a = ${M.PULL.a0.toFixed(1)} − ${M.PULL.k.toFixed(1)}t: наклон графика v–t, который постепенно уменьшается до нуля в момент t₁ = ${M.T1.toFixed(2)} с. Скорость изменения ускорения da/dt = −${M.PULL.k.toFixed(1)} м/с³ называется рывком.`,
    facts: (t, s) => { const u = с.pull.t; return [['a = dv/dt', `${M.pa(u).toFixed(2)} m/s²`], ['da/dt', u < M.T1 ? `−${M.PULL.k.toFixed(2)} m/s³` : '0'], ['area so far = v', `${M.pv(u).toFixed(2)} m/s`]]; } },
  bead: { text: `x = t³ − 3t. Однократное дифференцирование даёт скорость, двукратное — ускорение. В точке разворота v = 0, но a = ${M.ca(M.T_TURN).toFixed(1)} м/с²: нулевая скорость не означает нулевое ускорение.`,
    facts: (t, s) => { const u = с.cube.t, v = M.cv(u), a = M.ca(u); return [['время', `${u.toFixed(2)} s`], ['x', `${f(M.cx(u))} m`], ['v = 3t² − 3', `${f(v)} m/s`], ['a = 6t', `${f(a)} m/s²`], ['so it is', Math.abs(v) < 0.02 ? 'turning around' : v * a > 0 ? 'скоростьing up' : a === 0 ? 'a = 0, for an instant' : 'slowing down']]; } },
  cubeLine: { text: `Чёрная стрелка показывает перемещение от начального положения. Частица проходит 2 м влево, а затем 4 м вправо: через 2 с перемещение равно +2 м, тогда как пройденный путь составляет 6 м.`,
    facts: (t, s) => { const u = с.cube.t; return [['position x', `${f(M.cx(u))} m`], ['перемещение', `${f(M.cx(u))} m`], ['путь so far', `${M.cdist(u).toFixed(2)} m`]]; } },
};
function boatFacts(phi, t) {
  const tt = Math.min(t, M.crossTime(phi)), [dx, dy] = M.boatPos(phi, t);
  return [['время', `${tt.toFixed(1)} s`], ['поперёк', `${dy.toFixed(1)} of ${M.RIVER.w} m`], ['по течению', `${Math.abs(dx) < 0.05 ? '0.0' : dx.toFixed(1)} m`], ['скорость |v_BS|', `${M.vlen(M.vBS(phi)).toFixed(2)} m/s`], ['lands', `${M.crossTime(phi).toFixed(1)} s, ${Math.abs(M.снос течением(phi)) < 0.05 ? '0.0' : M.снос течением(phi).toFixed(1)} m down`]];
}

