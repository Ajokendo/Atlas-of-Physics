// Chapter 5, page by page (after the AP Physics 1 organizer, Unit 6). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, P_SCALE, F_WALL, F_EGG, EGG_ZOOM, CRASH_SCALE, W_SCALE, W_PLATE } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const k = (x, n = 0) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const cm = s => `${(s * 100).toFixed(0)} cm`;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 140, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const d = pts => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('');
  const paths = series.map(s => (s.fill ? `<path class="area" d="${d(s.pts)}L${sx(s.pts.at(-1)[0]).toFixed(1)},${sy(0).toFixed(1)}L${sx(s.pts[0][0]).toFixed(1)},${sy(0).toFixed(1)}Z"/>` : '') +
    `<path class="${s.cls || 'curve'}" d="${d(s.pts)}"/>` + (s.tag ? `<text class="lab${s.cls === 'total' ? ' blue' : ''}" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}"${s.tag[3] ? ' text-anchor="end"' : ''}>${s.tag[2]}</text>` : '')).join('');
  const zero = y0 < 0 && y1 > 0 ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  const mk = marks.map(([x, y, t]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + 6}" y="${sy(y) + 14}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${zero}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(c => `<circle class="cursor" r="4.5" data-cursor="${c}"/>`).join('')}
  </svg>`;
}
const samples = (a, b, n, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// collision pages: momentum of each cart and the total, against time
export const COLL_T = { y0: -3, y1: 7 };
const momChart = (c, key, tags) => chart({
  x0: 0, x1: c.run, ...COLL_T, xlabel: 'время (с)', ylabel: 'импульс (кг·м/с)', cursors: [key], label: 'Momentum of each cart and the total against time',
  series: [
    { pts: [[0, c.m1 * c.u1], [c.tc, c.m1 * c.u1], [c.tc, c.m1 * c.v1], [c.run, c.m1 * c.v1]], tag: [tags[0][0], tags[0][1], 'p₁'] },
    { pts: [[0, c.m2 * c.u2], [c.tc, c.m2 * c.u2], [c.tc, c.m2 * c.v2], [c.run, c.m2 * c.v2]], tag: [tags[1][0], tags[1][1], 'p₂'] },
    { cls: 'total', pts: [[0, c.m1 * c.u1 + c.m2 * c.u2], [c.run, c.m1 * c.u1 + c.m2 * c.u2]], tag: [c.run - 0.03, c.m1 * c.u1 + c.m2 * c.u2, 'P, total', 1] },
  ] });
const collTable = c => { const K0 = M.ke(c.m1, c.u1) + M.ke(c.m2, c.u2), K1 = M.ke(c.m1, c.v1) + M.ke(c.m2, c.v2); return `
  <table class="data">
    <tr><th>кг·м/с, Дж</th><th><i>p</i>₁</th><th><i>p</i>₂</th><th><i>P</i> total</th><th><i>KE</i></th></tr>
    <tr><td>до столкновения</td><td>${f(c.m1 * c.u1, 1)}</td><td>${f(c.m2 * c.u2, 1)}</td><td>${f(c.m1 * c.u1 + c.m2 * c.u2, 1)}</td><td>${f(K0)}</td></tr>
    <tr><td>после столкновения</td><td>${f(c.m1 * c.v1, 1)}</td><td>${f(c.m2 * c.v2, 1)}</td><td>${f(c.m1 * c.v1 + c.m2 * c.v2, 1)}</td><td>${f(K1)}</td></tr>
  </table>`; };

const Wl = M.WALL, Eg = M.EGG, S = M.STICK, B = M.BOUNCE, X = M.BURST, Pd = M.PEND, C = M.CRASH, Sh = M.SHELL;
const deg = r => (r * 180 / Math.PI).toFixed(1);
// a real bullet: 10 g into 2.0 kg, swinging to the same angle
export const BULLET = ((0.01 + 2.0) / 0.01) * Math.sqrt(2 * M.G * Pd.L * (1 - Math.cos(Pd.theta)));

// tip-to-tail sketch of the crash momenta, to scale
const vecSketch = (() => {
  const s = 0.0016, ox = 190, oy = 128, ax = ox + C.px * s, ay = oy - C.py * s;
  const head = (x1, y1, x2, y2, cls) => { const a = Math.atan2(y2 - y1, x2 - x1), L = 9; return `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2 - 6 * Math.cos(a)}" y2="${y2 - 6 * Math.sin(a)}"/><path class="${cls}h" d="M${x2},${y2}L${x2 - L * Math.cos(a - 0.4)},${y2 - L * Math.sin(a - 0.4)}L${x2 - L * Math.cos(a + 0.4)},${y2 - L * Math.sin(a + 0.4)}Z"/>`; };
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Momentum vectors added tip to tail">
    ${head(ox, oy, ax, oy, 'vk')}${head(ax, oy, ax, ay, 'vk')}${head(ox, oy, ax, ay, 'vb')}
    <text class="lab" x="${ox - 4}" y="${oy + 6}" text-anchor="end">p_car ${k(C.px)}</text>
    <text class="lab" x="${ax + 8}" y="${(oy + ay) / 2}">p_truck ${k(C.py)}</text>
    <text class="lab blue" x="${(ox + ax) / 2 - 8}" y="${(oy + ay) / 2 - 6}" text-anchor="end">P ${k(C.P)}</text>
    <text class="ax" x="${W - 14}" y="20" text-anchor="end">kg·m/s · east → north ↑</text>
  </svg>`;
})();

const shellChart = chart({
  x0: 0, x1: 14, y0: 0, y1: 5, xlabel: 'координата x (м)', ylabel: 'высота (м)', cursors: ['shell'], label: 'Траектории снаряда, двух его половин и центра масс',
  series: [
    { cls: 'trend', pts: samples(0, Sh.run, 40, t => 0).map(([t]) => M.shell(t).cm), tag: [Sh.R * 0.62, Sh.H * 0.55, 'centre of mass'] },
    { pts: samples(0, Sh.ta, 20, t => 0).map(([t]) => M.shell(t).cm) },
    { pts: samples(Sh.ta, Sh.run, 20, t => 0).map(([t]) => M.shell(t).a), tag: [Sh.R / 2 - 0.15, 0.9, 'rear half', 1] },
    { pts: samples(Sh.ta, Sh.run, 20, t => 0).map(([t]) => M.shell(t).b), tag: [10.3, 3.0, 'front half'] },
  ],
  marks: [[Sh.R / 2, 0, 'R/2'], [Sh.R, 0, 'R'], [1.5 * Sh.R, 0, '3R/2']],
});


// continuous bodies: λ(x) with the moment x·λ(x) shaded; strip sums converging
const Rd = M.ROD, Tr = M.TRI, Se = M.SEMI, Ll = M.ELL, Ho = M.HOLE;
const rodChart = chart({
  x0: 0, x1: Rd.L, y0: 0, y1: 3, xlabel: 'координата x вдоль стержня (м)', ylabel: 'λ (кг/м) и x·λ (кг)', cursors: ['rodL', 'rodM'], label: 'Линейная плотность и её момент вдоль стержня; отмечена точка равновесия',
  series: [
    { fill: true, pts: samples(0, Rd.L, 40, x => x * M.lam('N', x)), tag: [0.95, 1.25, 'x·λ: area = ∫x dm', 1] },
    { pts: samples(0, Rd.L, 2, x => M.lam('N', x)), tag: [1.97, 1.02, 'λ: area = M', 1] },
    { cls: 'trend', pts: [[Rd.xN, 0], [Rd.xN, 3]] },
  ],
  marks: [[Rd.xN, 2.92, 'x_cm = 2L/3']] });
const NS = Array.from({ length: 12 }, (_, i) => i + 1);
const stripChart = chart({
  x0: 1, x1: 12, y0: 0.95, y1: 1.55, xlabel: 'число полос n', ylabel: 'сумма по полосам ÷ точное значение', label: 'При увеличении числа полос сумма приближается к интегральному значению центра масс',
  series: [
    { pts: NS.map(n => [n, M.stripSum(M.triW, Tr.h, n) / Tr.ucm]), tag: [11.8, 1.44, 'upper: triangle', 1] },
    { pts: NS.map(n => [n, M.stripSum(M.semiW, Se.R, n) / Se.ucm]), tag: [11.8, 1.36, 'lower: semicircle', 1] },
    { cls: 'trend', pts: [[1, 1], [12, 1]], tag: [11.8, 1.0, 'the integral', 1] },
  ],
  });
const xy = c => `(${f(c[0])}, ${f(c[1])})`;

export const PAGES = [
  {
    kicker: 'Глава 5', title: 'Импульс тела', sub: 'насколько трудно остановить движение',
    body: `
      <p class="lede"><b>Импульс тела</b> характеризует, насколько трудно остановить движущееся тело: это произведение массы на скорость, векторная величина, измеряемая в кг·м/с.</p>
      <div class="eq"><i>p</i> = <i>mv</i></div>
      <p>Лёгкий быстрый шар и тяжёлая медленная тележка могут иметь одинаковый импульс:</p>
      <table class="data">
        <tr><th></th><th>масса</th><th>скорость</th><th>импульс</th><th>КЭ</th></tr>
        <tr><td>шар</td><td>${f(M.BALL.m, 1)} кг</td><td>${f(M.BALL.v, 1)} м/с</td><td>${f(M.p(M.BALL.m, M.BALL.v), 1)} кг·м/с</td><td>${f(M.ke(M.BALL.m, M.BALL.v), 1)} Дж</td></tr>
        <tr><td>тележка</td><td>${f(M.CART.m, 1)} кг</td><td>${f(M.CART.v, 1)} м/с</td><td>${f(M.p(M.CART.m, M.CART.v), 1)} кг·м/с</td><td>${f(M.ke(M.CART.m, M.CART.v), 1)} Дж</td></tr>
      </table>
      <p>Однако кинетическая энергия у них разная: <i>K</i> = <i>p</i>²/2<i>m</i>, поэтому у более лёгкого тела она больше. Изменение импульса равно Δ<i>p</i> = <i>m</i>Δ<i>v</i>.</p>
      <div class="charts">${chart({ x0: 0, x1: 5, y0: 0, y1: 4, xlabel: 'скорость (м/с)', ylabel: 'импульс (кг·м/с)', label: 'Зависимость импульса от скорости для масс 0,5 и 2 кг',
        series: [{ pts: [[0, 0], [2, 4]], tag: [1.75, 3.0, '2.0 kg', 1] }, { pts: [[0, 0], [5, 2.5]], tag: [4.1, 2.05, '0.5 kg'] }, { cls: 'trend', pts: [[0, 2], [5, 2]] }],
        marks: [[M.CART.v, 2, 'cart'], [M.BALL.v, 2, 'ball']] })}</div>
      <p class="hintline">Масштаб стрелок импульса: ${cm(P_SCALE)} на кг·м/с. Нажмите, чтобы сложить скорости.</p>`,
    cam: { target: [STATIONS.mom + 0.3, 0.4, 0], az: -14, el: 16, dist: 16 }, lit: 'mom', scene: 'mom', look: {},
    fig: 'Одинаковый p при разных m и v',
  },
  {
    kicker: '5.1', title: 'Импульс силы', sub: 'сила, действующая в течение времени',
    body: `
      <p class="lede">Если сила действует на тело в течение некоторого времени, его импульс изменяется. Произведение силы на время её действия называется <b>импульсом силы</b>.</p>
      <div class="eq"><i>J</i> = <i>F</i>Δ<i>t</i> = Δ<i>p</i></div>
      <p>Шар массой ${f(Wl.m, 1)} кг ударяется о стену со скоростью +${f(Wl.v, 1)} м/с и отскакивает со скоростью −${f(Wl.v, 1)} м/с: Δ<i>p</i> = −${f(Wl.J, 1)} кг·м/с. Изменение вдвое больше первоначального импульса, поскольку шар должен остановиться <i>и</i> полететь обратно.</p>
      <p>Сила со стороны стены нарастает и уменьшается в течение ${f(Wl.tau, 2)} с, достигая максимума ${f(Wl.Fpk, 0)} Н. <b>Площадь под графиком силы от времени</b> равна импульсу силы: ${f(Wl.J, 1)} Н·с. Это то же самое, что постоянная сила ${f(Wl.Favg, 0)} Н в течение ${f(Wl.tau, 2)} с. Направление импульса совпадает с направлением силы — от стены.</p>
      <div class="charts">${chart({ x0: 0.15, x1: 0.35, y0: 0, y1: 50, xlabel: 'время (с)', ylabel: 'сила стены (Н)', cursors: ['wall'], label: 'Сила, действующая на шар, во времени; заштрихованная площадь — импульс силы',
        series: [{ fill: true, pts: samples(0.15, 0.35, 80, t => -M.wall(t).F), tag: [0.287, 30, `площадь = ${f(Wl.J, 1)} Н·с`] }] })}</div>
      <p>AP Physics C: при переменной силе импульс равен интегралу <i>J</i> = ∫<i>F</i> d<i>t</i>. Для данного импульса силы:</p>
      <div class="eq">∫<sub>0</sub><sup>τ</sup> <i>F</i><sub>pk</sub> sin(π<i>t</i>/τ) d<i>t</i> = 2<i>F</i><sub>pk</sub>τ/π = ${f(Wl.J, 1)} Н·с</div>
      <p class="hintline">Скорость анимации: ${M.SLOW_HIT}×. Масштаб силы: ${cm(F_WALL)} на ньютон. Нажмите, чтобы увидеть Δp.</p>`,
    cam: { target: [STATIONS.wall - 0.55, 0.6, 0], az: -14, el: 12, dist: 7.2 }, lit: 'wall', scene: 'wall', look: {},
    fig: 'Сила стены разворачивает шар',
  },
  {
    kicker: '5.2', title: 'Меньшая сила', sub: 'то же Δp за большее время',
    body: `
      <p class="lede">Два яйца падают с высоты ${f(Eg.h * 100, 0)} см и ударяются о поверхность со скоростью ${f(Eg.v0, 1)} м/с. Импульс каждого должен уменьшиться на ${f(Eg.J, 2)} кг·м/с, поэтому необходимый импульс силы одинаков.</p>
      <p>Подушка сжимается, и остановка занимает ${f(Eg.tauSoft, 2)} с; на твёрдом полу — ${f(Eg.tauHard, 2)} с. Произведение <i>F</i>Δ<i>t</i> неизменно, поэтому время в шесть раз меньше означает силу в шесть раз больше:</p>
      <table class="data">
        <tr><th></th><th>время остановки</th><th>средняя равнодействующая</th><th>максимум</th></tr>
        <tr><td>подушка</td><td>${f(Eg.tauSoft, 2)} s</td><td>${f(Eg.J / Eg.tauSoft)} N</td><td>${f(Math.PI * Eg.J / (2 * Eg.tauSoft))} N</td></tr>
        <tr><td>пол</td><td>${f(Eg.tauHard, 2)} s</td><td>${f(Eg.J / Eg.tauHard)} N</td><td>${f(Math.PI * Eg.J / (2 * Eg.tauHard))} N</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 0.2, y0: 0, y1: 8, xlabel: 'время после удара (с)', ylabel: 'равнодействующая сила (Н)', cursors: ['eggS', 'eggH'], label: 'Два импульса силы с одинаковой площадью под графиком',
        series: [{ fill: true, pts: samples(0, Eg.tauSoft, 60, t => M.pulse(t, Eg.J, Eg.tauSoft, Eg.m).F).concat([[0.2, 0]]), tag: [0.075, 1.4, 'подушка'] },
                 { fill: true, pts: samples(0, Eg.tauHard, 30, t => M.pulse(t, Eg.J, Eg.tauHard, Eg.m).F).concat([[0.2, 0]]), tag: [0.034, 5.2, 'пол: та же площадь'] }] })}</div>
      <p>Подушки безопасности, зоны деформации автомобиля и сгибание коленей не могут изменить Δ<i>p</i>, но увеличивают Δ<i>t</i>.</p>
      <p class="hintline">Масштаб изображения: ${EGG_ZOOM}× натуральной величины; скорость анимации ${M.SLOW_HIT}×. Красная стрелка — равнодействующая сила; масштаб ${cm(F_EGG * EGG_ZOOM)} на ньютон. Нажмите для сравнения.</p>`,
    cam: { target: [STATIONS.eggs, 1.05, 0], az: -10, el: 10, dist: 10.5 }, lit: 'eggs', scene: 'eggs', look: {},
    fig: 'То же Δp, но за большее время',
  },
  {
    kicker: '5.3', title: 'Закон сохранения импульса', sub: 'неупругий удар: тележки слипаются',
    body: `
      <p class="lede">Рассмотрим обе тележки как одну <b>замкнутую систему</b>, на которую не действует внешняя равнодействующая сила. Полный импульс системы не изменяется.</p>
      <p>Тележки сообщают друг другу равные и противоположные импульсы силы: сколько импульса теряет одна, столько получает другая.</p>
      <div class="eq"><i>m</i>₁<i>v</i>₁ + <i>m</i>₂<i>v</i>₂ = (<i>m</i>₁ + <i>m</i>₂)<i>v</i>′</div>
      <p>Тележка массой ${f(S.m1, 1)} кг со скоростью ${f(S.u1, 1)} м/с сталкивается с тележкой массой ${f(S.m2, 1)} кг, движущейся со скоростью ${f(S.u2, 1)} м/с. После сцепления они движутся вместе со скоростью <i>v</i>′ = ${f(S.m1 * S.u1 + S.m2 * S.u2, 1)}/${f(S.m1 + S.m2, 1)} = ${f(S.v1, 1)} м/с. Это <b>абсолютно неупругий удар</b>: часть кинетической энергии превращается в тепло, звук и деформацию.</p>
      ${collTable(S)}
      <div class="charts">${momChart(S, 'stick', [[0.05, 6.1], [0.05, -1.5]])}</div>
      <p class="hintline">Синий вектор: полный импульс <i>P</i>. Диск: центр масс. Нажмите для сравнения.</p>`,
    cam: { target: [STATIONS.stick - 0.4, 0.6, 0], az: -12, el: 14, dist: 17 }, lit: 'stick', scene: 'stick', look: {},
    fig: 'Δp = 0, ΔKE < 0',
  },
  {
    kicker: '5.4', title: 'Упругие столкновения', sub: 'тележки отскакивают друг от друга',
    body: `
      <p class="lede">Если тележки разлетаются после столкновения и кинетическая энергия не теряется, удар называется <b>упругим</b>: сохраняются и импульс, <i>и</i> кинетическая энергия.</p>
      <p>Тележка массой ${f(B.m1, 1)} кг со скоростью ${f(B.u1, 1)} м/с сталкивается с неподвижной тележкой массой ${f(B.m2, 1)} кг. Две неизвестные — два уравнения:</p>
      <table class="data eqs">
        <tr><td><i>m</i>₁<i>v</i>₁ + <i>m</i>₂<i>v</i>₂ = <i>m</i>₁<i>v</i>₁′ + <i>m</i>₂<i>v</i>₂′</td><td>Δ<i>p</i> = 0</td></tr>
        <tr><td>½<i>m</i>₁<i>v</i>₁² + ½<i>m</i>₂<i>v</i>₂² = ½<i>m</i>₁<i>v</i>₁′² + ½<i>m</i>₂<i>v</i>₂′²</td><td>Δ<i>KE</i> = 0</td></tr>
      </table>
      <p>Получаем <i>v</i>₁′ = ${f(B.v1, 1)} м/с и <i>v</i>₂′ = ${f(B.v2, 1)} м/с. Импульсы силы равны по модулю и противоположны: ${f(B.m2 * B.v2, 1)} Н·с. Меньшая масса получает большее изменение скорости Δ<i>v</i>.</p>
      ${collTable(B)}
      <div class="charts">${momChart(B, 'bounce', [[0.05, 4.1], [0.05, -1.0]])}</div>`,
    cam: { target: [STATIONS.bounce - 0.5, 0.6, 0], az: -12, el: 14, dist: 17 }, lit: 'bounce', scene: 'bounce', look: {},
    fig: 'Δp = 0, ΔKE = 0',
  },
  {
    kicker: '5.5', title: 'Взрыв', sub: 'тела разлетаются из состояния покоя',
    body: `
      <p class="lede">Две тележки покоятся рядом; между ними сжимают пружину и отпускают её. Начальный полный импульс равен нулю и остаётся нулевым.</p>
      <div class="eq">(<i>m</i>₁ + <i>m</i>₂)<i>v</i> = <i>m</i>₁<i>v</i>₁′ + <i>m</i>₂<i>v</i>₂′</div>
      <p>Поскольку начальная скорость <i>v</i> = 0, импульсы тележек равны по модулю и противоположны по направлению. Поэтому тележка массой ${f(X.m1, 1)} кг движется втрое быстрее тележки массой ${f(X.m2, 1)} кг. Энергия пружины ${f(X.Q, 1)} Дж превращается в кинетическую энергию: КЭ <i>увеличивается</i>.</p>
      ${collTable(X)}
      <table class="data">
        <tr><th>тип взаимодействия</th><th>Δ<i>p</i></th><th>Δ<i>KE</i></th><th>особенность</th></tr>
        <tr><td>неупругий</td><td>0</td><td>&lt; 0</td><td>потеря КЭ; максимальная при сцеплении</td></tr>
        <tr><td>упругий</td><td>0</td><td>0</td><td>тела отскакивают, КЭ сохраняется</td></tr>
        <tr><td>взрыв</td><td>0</td><td>&gt; 0</td><td>тела начинают вместе, затем разлетаются</td></tr>
      </table>
      <p class="hintline">Центр масс остаётся на месте. Нажмите, чтобы сравнить состояния до и после.</p>`,
    cam: { target: [STATIONS.burst - 0.8, 0.6, 0], az: -12, el: 14, dist: 17 }, lit: 'burst', scene: 'burst', look: {},
    fig: 'Δp = 0, ΔKE > 0',
  },
  {
    kicker: '5.6', title: 'Баллистический маятник', sub: 'сначала импульс, затем энергия',
    body: `
      <p class="lede">Комок пластилина массой ${f(Pd.m, 1)} кг со скоростью ${f(Pd.u, 0)} м/с застревает в блоке массой ${f(Pd.M, 1)} кг, подвешенном на нити длиной ${f(Pd.L, 1)} м. Блок начинает подниматься. Два этапа — два закона:</p>
      <table class="data">
        <tr><th>этап</th><th>закон</th><th>значение</th></tr>
        <tr><td>удар</td><td>Δ<i>p</i> = 0: <i>mv</i> = (<i>m</i>+<i>M</i>)<i>v</i>′</td><td><i>v</i>′ = ${f(Pd.v)} м/с</td></tr>
        <tr><td>подъём</td><td>Δ<i>E</i> = 0: ½<i>v</i>′² = <i>g</i>Δ<i>y</i></td><td>Δ<i>y</i> = ${f(Pd.dy * 100, 1)} см</td></tr>
      </table>
      <p>При самом ударе механическая энергия не сохраняется (${f(M.ke(Pd.m, Pd.u), 1)} Дж → ${f(M.ke(Pd.m + Pd.M, Pd.v))} Дж), а при последующем подъёме не сохраняется импульс (натяжение нити и сила тяжести являются внешними силами). Поскольку Δ<i>y</i> = <i>L</i>(1 − cos θ), получаем θ = ${deg(Pd.theta)}°:</p>
      <div class="eq"><i>v</i> = ((<i>m</i> + <i>M</i>)/<i>m</i>) √(2<i>gL</i>(1 − cos θ))</div>
      <div class="charts">${chart({ x0: 0, x1: 2.4, y0: 0, y1: 2, xlabel: 'время после удара (с)', ylabel: 'энергия (Дж)', cursors: ['pendK', 'pendU'], label: 'Кинетическая и потенциальная энергия при подъёме',
        series: [{ pts: samples(0, Pd.T, 60, t => M.pend(Pd.lead + t).K), tag: [0.1, 1.15, 'KE'] }, { pts: samples(0, Pd.T, 60, t => M.pend(Pd.lead + t).U), tag: [Pd.T / 4 - 0.12, 1.15, 'Ug'] }, { cls: 'trend', pts: [[0, M.ke(Pd.m + Pd.M, Pd.v)], [2.4, M.ke(Pd.m + Pd.M, Pd.v)]], tag: [2.36, 1.72, 'total', 1] }] })}</div>
      <p class="hintline">Нажмите, чтобы отметить Δy, L и θ, а также увидеть другие способы найти v′.</p>`,
    cam: { target: [STATIONS.pend + 0.2, 1.25, 0], az: -10, el: 8, dist: 7.4 }, lit: 'pend', scene: 'pend', look: {},
    fig: 'При ударе Δp = 0, при подъёме ΔE = 0',
  },
  {
    kicker: '5.7', title: 'Две размерности', sub: 'столкновение на перекрёстке',
    body: `
      <p class="lede">Автомобиль массой ${k(C.m1)} кг движется на восток со скоростью ${f(C.v1, 0)} м/с, а грузовик массой ${k(C.m2)} кг — на север со скоростью ${f(C.v2, 0)} м/с. Они сталкиваются и сцепляются. Импульс сохраняется отдельно по каждой оси.</p>
      <table class="data">
        <tr><th>восток (<i>x</i>)</th><th>север (<i>y</i>)</th></tr>
        <tr><td><i>m</i>₁<i>v</i>₁ = (<i>m</i>₁+<i>m</i>₂)<i>v</i>′<sub>x</sub></td><td><i>m</i>₂<i>v</i>₂ = (<i>m</i>₁+<i>m</i>₂)<i>v</i>′<sub>y</sub></td></tr>
        <tr><td>${k(C.px)} = ${k(C.m1 + C.m2)} <i>v</i>′<sub>x</sub></td><td>${k(C.py)} = ${k(C.m1 + C.m2)} <i>v</i>′<sub>y</sub></td></tr>
        <tr><td><i>v</i>′<sub>x</sub> = ${f(C.vx)} м/с</td><td><i>v</i>′<sub>y</sub> = ${f(C.vy)} м/с</td></tr>
      </table>
      <p>Сложим векторы импульса, приставляя начало одного к концу другого: <i>P</i> = √(<i>p</i><sub>x</sub>² + <i>p</i><sub>y</sub>²) = ${k(C.P)} кг·м/с. Тогда <i>v</i>′ = <i>P</i>/(<i>m</i>₁+<i>m</i>₂) = ${f(C.v)} м/с под углом ${C.angle.toFixed(1)}° к востоку в сторону севера. Складывать модули скоростей нельзя.</p>
      <div class="charts">${vecSketch}</div>
      <p class="hintline">Масштаб стрелок: ${cm(CRASH_SCALE)} на 1000 кг·м/с. Нажмите, чтобы сложить векторы, приставляя их друг к другу.</p>`,
    cam: { target: [STATIONS.crash + 0.5, 0, -1.5], az: -10, el: 50, dist: 58 }, lit: 'crash', scene: 'crash', look: {},
    fig: 'p автомобиля + p грузовика = P',
  },
  {
    kicker: '5.8', title: 'Центр масс', sub: 'движется так, будто ничего не произошло',
    body: `
      <p class="lede"><b>Центр масс</b> — это среднее положение системы, взвешенное по массам её частей. Внутренние силы не могут изменить его движение: на предыдущих страницах центр масс тележек продолжал двигаться прямо через все столкновения.</p>
      <div class="eq"><i>x</i><sub>cm</sub> = (<i>m</i>₁<i>x</i>₁ + <i>m</i>₂<i>x</i>₂) / (<i>m</i>₁ + <i>m</i>₂)</div>
      <p>Снаряд массой ${f(Sh.m, 1)} кг запускают со скоростью ${f(Sh.v0, 0)} м/с под углом ${Sh.deg}° к горизонту. В верхней точке он распадается на две равные части. Задняя половина останавливается и падает на расстояние <i>R</i>/2. Передняя получает весь импульс по горизонтали: <i>v</i>₂′ = ((<i>m</i>₁+<i>m</i>₂)/<i>m</i>₂)<i>v</i><sub>x</sub> = ${f(Sh.v2, 1)} м/с и приземляется на расстоянии 3<i>R</i>/2. Центр масс приземляется на расстоянии <i>R</i> = ${f(Sh.R)} м, как если бы взрыва не было.</p>
      <div class="charts">${shellChart}</div>
      <p>Обратите внимание: обе части получают равные и противоположные импульсы силы, поэтому более лёгкая часть получает большее изменение скорости Δ<i>v</i>.</p>`,
    cam: { target: [STATIONS.shell + 0.2, 2.4, 0], az: -6, el: 8, dist: 44 }, lit: 'shell', scene: 'shell', look: {},
    fig: 'Центр масс приземляется на расстоянии R',
  },
  {
    kicker: '5.9 · AP Physics C', title: 'Сплошные тела', sub: 'нахождение центра масс интегрированием',
    body: `
      <p class="lede">Разделим сплошной стержень на элементы массой d<i>m</i> = λ d<i>x</i>, где λ — масса единицы длины. Умножим массу каждого элемента на его координату и проинтегрируем.</p>
      <div class="eq"><i>x</i><sub>cm</sub> = (1/<i>M</i>) ∫ <i>x</i> d<i>m</i></div>
      <table class="data">
        <tr><th>стержень длиной ${f(Rd.L, 1)} м</th><th><i>M</i> = ∫λ d<i>x</i></th><th><i>x</i><sub>cm</sub></th></tr>
        <tr><td>λ = ${f(Rd.lamU, 1)} кг/м</td><td>λ<i>L</i> = ${f(Rd.MU, 1)} кг</td><td><i>L</i>/2 = ${f(Rd.xU)} м</td></tr>
        <tr><td>λ = λ₀<i>x</i>/<i>L</i>, λ₀ = ${f(Rd.lam0, 1)}</td><td>λ₀<i>L</i>/2 = ${f(Rd.MN, 1)} кг</td><td>2<i>L</i>/3 = ${f(Rd.xN)} м</td></tr>
      </table>
      <div class="eq">∫<i>x</i> d<i>m</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>²/<i>L</i> d<i>x</i> = λ<sub>0</sub><i>L</i>²/3</div>
      <p>Разделив на <i>M</i> = λ₀<i>L</i>/2, получаем 2<i>L</i>/3 — точку за серединой стержня. Каждый стержень можно уравновесить на опоре в точке <i>x</i><sub>cm</sub>, где суммарный момент сил тяжести ∫(<i>x</i> − <i>x</i><sub>cm</sub>)<i>g</i> d<i>m</i> = 0.</p>
      <div class="charts">${rodChart}</div>
      <p class="hintline">Чем темнее участок, тем выше плотность. Нажмите, чтобы увидеть срезы (масштаб ${cm(W_SCALE)} на Н).</p>`,
    cam: { target: [STATIONS.rods + 0.1, 0.4, 0], az: -14, el: 22, dist: 9.4 }, lit: 'rods', scene: 'rods', look: {},
    fig: 'Равновесие в точке x_cm',
  },
  {
    kicker: '5.10 · AP Physics C', title: 'Пластины', sub: 'разбиение на полосы',
    body: `
      <p class="lede">Разделим пластину (σ = ${f(M.SIGMA, 1)} кг/м²) на полосы, параллельные её краю. Полоса на расстоянии <i>u</i> от края и шириной <i>w</i>(<i>u</i>) имеет массу d<i>m</i> = σ<i>w</i> d<i>u</i>.</p>
      <div class="eq"><i>u</i><sub>cm</sub> = (1/<i>M</i>) ∫ <i>u</i> σ<i>w</i>(<i>u</i>) d<i>u</i></div>
      <table class="data">
        <tr><th>пластина</th><th><i>w</i>(<i>u</i>)</th><th><i>u</i><sub>cm</sub></th></tr>
        <tr><td>треугольник, <i>h</i> = ${f(Tr.h, 1)} м</td><td><i>b</i>(1 − <i>u</i>/<i>h</i>)</td><td><i>h</i>/3 = ${f(Tr.ucm)} м</td></tr>
        <tr><td>полукруг, <i>R</i> = ${f(Se.R, 1)} м</td><td>2√(<i>R</i>² − <i>u</i>²)</td><td>4<i>R</i>/3π = ${f(Se.ucm)} м</td></tr>
      </table>
      <div class="eq">∫<sub>0</sub><sup><i>R</i></sup> 2<i>u</i>√(<i>R</i>² − <i>u</i>²) d<i>u</i> = 2<i>R</i>³/3</div>
      <p>Деление на площадь π<i>R</i>²/2 даёт 4<i>R</i>/3π. Треугольник можно рассматривать как стержень с предыдущей страницы, повёрнутый на бок: от вершины ширина полос увеличивается по закону λ₀<i>x</i>/<i>L</i>. Суммы по полосам приближаются к точному значению:</p>
      <div class="charts">${stripChart}</div>
      <p class="hintline">Опоры расположены в центрах масс. Нажмите, чтобы разделить пластину на полосы (масштаб ${cm(W_PLATE)} на Н).</p>`,
    cam: { target: [STATIONS.plates + 0.05, 0.3, 0], az: -10, el: 22, dist: 10.6 }, lit: 'plates', scene: 'plates', look: {},
    fig: 'u_cm = (1/M)∫u dm',
  },
  {
    kicker: '5.11 · AP Physics C', title: 'Составные тела и отверстия', sub: 'складываем части, вычитаем пустоты',
    body: `
      <p class="lede">Если тело состоит из простых частей, умножьте массу каждой части на координаты её центра масс и сложите результаты. Отверстие можно учитывать как часть с отрицательной массой.</p>
      <div class="eq"><i>x</i><sub>cm</sub> = (<i>m</i><sub>A</sub><i>x</i><sub>A</sub> + <i>m</i><sub>B</sub><i>x</i><sub>B</sub>)/(<i>m</i><sub>A</sub> + <i>m</i><sub>B</sub>)</div>
      <table class="data">
        <tr><th>L-образная фигура, от внутреннего угла</th><th>масса</th><th>(<i>x</i>, <i>y</i>), м</th></tr>
        <tr><td>часть A, ${f(Ll.A.a1 - Ll.A.a0, 1)} × ${f(Ll.A.b1 - Ll.A.b0, 1)} м</td><td>${f(Ll.pA.m)} кг</td><td>${xy(Ll.pA.c)}</td></tr>
        <tr><td>часть B, ${f(Ll.B.a1 - Ll.B.a0, 1)} × ${f(Ll.B.b1 - Ll.B.b0, 1)} м</td><td>${f(Ll.pB.m)} кг</td><td>${xy(Ll.pB.c)}</td></tr>
        <tr><td>вся L-образная фигура</td><td>${f(Ll.M)} кг</td><td>${xy(Ll.cm)}</td></tr>
      </table>
      <p>Эта точка находится в пустоте, а не внутри L-образной фигуры. Как кольцо или бумеранг, фигуру нельзя уравновесить на опоре в этой точке, но если подвесить её на нити, она повернётся так, чтобы центр масс оказался прямо под точкой подвеса.</p>
      <div class="eq"><i>x</i><sub>cm</sub> = (<i>m</i><sub>full</sub><i>x</i><sub>full</sub> − <i>m</i><sub>plug</sub><i>x</i><sub>plug</sub>)/<i>M</i></div>
      <p>Из квадратной пластины со стороной ${f(Ho.s, 1)} м (масса ${f(Ho.mFull)} кг) удаляют круг радиусом ${f(Ho.r, 1)} м (масса ${f(Ho.mPlug)} кг) с центром в ${xy(Ho.c)}. Получаем <i>x</i><sub>cm</sub> = <i>y</i><sub>cm</sub> = −${f(Ho.mPlug)}×${f(Ho.c[0])}/${f(Ho.M)} = ${f(Ho.cm[0], 3)} м; центр масс смещается на ${f(Math.hypot(...Ho.cm) * 100, 1)} см от центра в сторону, противоположную отверстию.</p>
      <p class="hintline">Нажмите, чтобы разъединить L-образную фигуру и вынуть круглый фрагмент.</p>`,
    cam: { target: [STATIONS.parts + 0.05, 1.22, 0], az: -12, el: 14, dist: 10.2 }, lit: 'parts', scene: 'parts', look: {},
    fig: 'За пределами материала',
  },
];

// ---------- click a scene: what it breaks into ----------
const collFacts = c => s => { const r = M.track(c, s[c === S ? 'stick' : c === B ? 'bounce' : 'burst'].t); return [
  ['p₁', `${f(r.p1)} kg·m/s`], ['p₂', `${f(r.p2)} kg·m/s`], ['total P', `${f(r.P)} kg·m/s`], ['kinetic energy', `${f(r.K)} J`], ['centre of mass velocity', `${f(r.P / (c.m1 + c.m2))} m/s`]]; };
export const PLATES = {
  mom: { text: `The grey arrows are the velocities: the ball’s is four times longer. The black momentum arrows are the same length, because the cart has four times the mass. Momentum is mass and velocity together.`,
    facts: () => [['ball: 0.5 kg × 4.0 m/s', `${f(M.p(M.BALL.m, M.BALL.v))} kg·m/s`], ['cart: 2.0 kg × 1.0 m/s', `${f(M.p(M.CART.m, M.CART.v))} kg·m/s`], ['ball KE = p²/2m', `${f(M.ke(M.BALL.m, M.BALL.v))} J`], ['cart KE = p²/2m', `${f(M.ke(M.CART.m, M.CART.v))} J`]] },
  wall: { text: `Momentum before (right) and after (left). The change Δp = p<sub>after</sub> − p<sub>before</sub> is twice as long as either and points away from the wall, the same way as the wall’s push. That change is the impulse.`,
    facts: s => { const w = M.wall(s.wall.t); return [['p before', `+${f(Wl.m * Wl.v)} kg·m/s`], ['p after', `−${f(Wl.m * Wl.v)} kg·m/s`], ['Δp = J', `−${f(Wl.J)} N·s`], ['contact time', `${f(Wl.tau)} s`], ['force now', `${f(Math.abs(w.F), 1)} N`]]; } },
  eggs: { text: `The grey arrows are the two impulses: identical, because both eggs lose the same momentum. What differs is how long that takes, and so how hard the push has to be.`,
    facts: () => [['impulse, each', `${f(Eg.J, 3)} N·s`], ['pillow: J / Δt', `${f(Eg.J / Eg.tauSoft)} N for ${f(Eg.tauSoft)} s`], ['floor: J / Δt', `${f(Eg.J / Eg.tauHard)} N for ${f(Eg.tauHard)} s`], ['force ratio', `${f(Eg.tauSoft / Eg.tauHard, 1)}×`]] },
  stick: { text: `Above, the momenta before and after, laid tip to tail. Each row adds up to the same blue total. Cart 2’s momentum even changes sign; the total doesn’t change at all.`, facts: collFacts(S) },
  bounce: { text: `Before: all the momentum is in cart 1. After: cart 1’s is negative and cart 2’s is bigger than the total. Tip to tail, both rows still add up to the same blue arrow.`, facts: collFacts(B) },
  burst: { text: `Before: nothing. After: two equal and opposite arrows that add up to nothing. The total momentum is zero throughout, so the centre of mass never moves.`, facts: collFacts(X) },
  pend: { text: `The dashed lines mark the bottom and top of the swing, Δy apart. From the triangle, cos θ = (L − Δy)/L, so Δy = L(1 − cos θ). Other ways to find v′ after a hit: the block slides to a stop on a rough floor, v′ = √(2μ<sub>k</sub>gΔx); it squeezes a spring, v′ = √(kΔx²/(m+M)); it flies off a table, v′ = Δx/√(2Δy/g).`,
    facts: s => { const q = M.pend(s.pend.t); return [['v′ after the hit', `${f(Pd.v)} m/s`], ['Δy = v′²/2g', `${f(Pd.dy * 100, 1)} cm`], ['θ max', `${deg(Pd.theta)}°`], ['angle now', `${deg(q.th)}°`], ['KE + Ug now', `${f(q.K + q.U)} J`], ['a 10 g bullet into 2.0 kg, same θ', `${f(BULLET, 0)} m/s`]]; } },
  crash: { text: `The car’s momentum points east, the truck’s north. Placed tip to tail they make a right triangle; the blue hypotenuse is the total, which the wreck carries away at ${C.angle.toFixed(1)}° north of east.`,
    facts: () => [['p car (east)', `${k(C.px)} kg·m/s`], ['p truck (north)', `${k(C.py)} kg·m/s`], ['total P', `${k(C.P)} kg·m/s`], ['v′ = P/(m₁+m₂)', `${f(C.v)} m/s`], ['direction', `${C.angle.toFixed(1)}° north of east`], ['KE', `${k(C.K0 / 1000)} kJ → ${k(C.K1 / 1000)} kJ`]] },
  shell: { text: `Gravity, an outside force, bends everyone’s path, so the vertical momentum keeps changing. The burst is internal: at that instant the total momentum (blue) is the same before and after, all of it now in the front half.`,
    facts: s => { const q = M.shell(s.shell.t); return [['x of the centre of mass', `${f(q.cm[0])} m`], ['before the burst: m·vx', `${f(Sh.m * Sh.vx)} kg·m/s`], ['after: (m/2)·v₂′', `${f(Sh.m / 2 * Sh.v2)} kg·m/s`], ['lands at', `${f(Sh.R / 2)} m and ${f(1.5 * Sh.R)} m`]]; } },

  rods: { text: `Each slice is drawn at its own centre of mass with its weight d<i>m</i>·<i>g</i> (${cm(W_SCALE)} per newton). On the uniform rod the ten weights are equal; on the other they grow with <i>x</i>, so fewer, heavier slices on the right balance more, lighter ones on the left. About the knife edge the two sides’ torques are equal.`,
    facts: () => { const sl = M.rodSlices('N'), g = M.G, L = sl.filter(q => q.x < Rd.xN).reduce((a, q) => a + (Rd.xN - q.x) * q.dm * g, 0), Rr = sl.filter(q => q.x >= Rd.xN).reduce((a, q) => a + (q.x - Rd.xN) * q.dm * g, 0);
      return [['uniform: each slice', `${f(M.rodSlices('U')[0].dm, 3)} kg`], ['λ₀x/L: first and last slice', `${f(sl[0].dm, 3)} kg, ${f(sl.at(-1).dm, 3)} kg`], ['x_cm, uniform / λ₀x/L', `${f(Rd.xU)} m / ${f(Rd.xN)} m`], ['torque of the left slices', `${f(L, 3)} N·m`], ['torque of the right slices', `${f(Rr, 3)} N·m`]]; } },
  plates: { text: `Eight strips each, every one drawn at its own centre of mass with its weight (${cm(W_PLATE)} per newton). The wide strips near the base or diameter are heaviest, which is why the balance point sits closer to that edge than to the far tip.`,
    facts: () => { const t = M.plateStrips(Tr), c = M.plateStrips(Se); return [['triangle: M = σbh/2', `${f(Tr.M)} kg`], ['triangle: heaviest / lightest strip', `${f(t[0].dm, 3)} / ${f(t.at(-1).dm, 3)} kg`], ['semicircle: M = σπR²/2', `${f(Se.M)} kg`], ['semicircle: heaviest / lightest strip', `${f(c[0].dm, 3)} / ${f(c.at(-1).dm, 3)} kg`], ['8 rectangles: triangle, semicircle', `${f(M.stripSum(M.triW, Tr.h, 8), 3)}, ${f(M.stripSum(M.semiW, Se.R, 8), 3)} m`], ['the integrals: h/3, 4R/3π', `${f(Tr.ucm, 3)}, ${f(Se.ucm, 3)} m`]]; } },
  parts: { text: `Pulled apart, each arm is a point mass at its own centre (the small discs). The L’s centre of mass lies on the line between them, closer to the heavier arm, and it stays put as they part. Lifted out, the plug is the negative mass: the square’s centre, the plug’s centre and the plate’s centre of mass lie on one line, with the balance point on the far side from the hole.`,
    facts: () => [['arm A', `${f(Ll.pA.m)} kg at ${xy(Ll.pA.c)} m`], ['arm B', `${f(Ll.pB.m)} kg at ${xy(Ll.pB.c)} m`], ['the L', `${f(Ll.M)} kg at ${xy(Ll.cm)} m`], ['full square − plug', `${f(Ho.mFull)} − ${f(Ho.mPlug)} = ${f(Ho.M)} kg`], ['holed plate x_cm, y_cm', `${f(Ho.cm[0], 3)}, ${f(Ho.cm[1], 3)} m`]] },
};
