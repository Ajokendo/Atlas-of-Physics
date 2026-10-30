// Chapter 4, page by page (after the AP Physics 1 organizer, Unit 5). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, SC, BAR_COLORS } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const ST = STATIONS;
const INK = '#2c2c30', BLUE = '#4f7cbd', AMBER = '#bf9030', GREY = '#86868c';

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1, h = H) => P.t + (1 - (y - y0) / (y1 - y0)) * (h - P.t - P.b) };   // h: a chart may be shorter
function chart({ x0, x1, y0, y1, h: H = 170, series, xlabel, ylabel, marks = [], cursors = [], label, under = '', zero = false }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1, H);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}"${s.color ? ` style="stroke:${s.color}"` : ''} d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}"${s.color ? ` style="fill:${s.color}"` : ''}>${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    ${under}<rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>
    ${zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/><text class="ax" x="${P.l - 6}" y="${sy(0) + 4}" text-anchor="end">0</text>` : ''}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(([key, color]) => `<circle class="cursor" r="4.5" data-cursor="${key}"${color ? ` style="fill:${color}"` : ''}/>`).join('')}
  </svg>`;
}
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// live energy bars on the left page (the pendulum): heights set in main.js
export const BARS = { x: 70, w: 64, gap: 46, base: 150, top: 20 };
const barChart = (key, items, Emax) => `<svg class="chart" viewBox="0 0 ${W} ${H + 10}" role="img" aria-label="Energy bar chart, live">
  <line class="zero" x1="${BARS.x - 20}" x2="${BARS.x + items.length * (BARS.w + BARS.gap)}" y1="${BARS.base}" y2="${BARS.base}"/>
  <line class="grid" x1="${BARS.x - 20}" x2="${BARS.x + items.length * (BARS.w + BARS.gap)}" y1="${BARS.top}" y2="${BARS.top}"/>
  <text class="ax" x="${BARS.x - 26}" y="${BARS.top + 4}" text-anchor="end">${f(Emax)} J</text><text class="ax" x="${BARS.x - 26}" y="${BARS.base + 4}" text-anchor="end">0</text>
  ${items.map(([k, name, color], i) => `<rect data-bar="${key}-${k}" x="${BARS.x + i * (BARS.w + BARS.gap)}" width="${BARS.w}" y="${BARS.base}" height="0" style="fill:${color};stroke:#6c6c72;stroke-width:.8"/>
    <text class="lab" x="${BARS.x + i * (BARS.w + BARS.gap) + BARS.w / 2}" y="${BARS.base + 18}" text-anchor="middle">${name}</text>
    <text class="ax" data-val="${key}-${k}" x="${BARS.x + i * (BARS.w + BARS.gap) + BARS.w / 2}" y="${BARS.base - 6}" text-anchor="middle"></text>`).join('')}
</svg>`;

// chart ranges, shared with the live cursors in main.js
export const R = {
  pull: { x0: 0, x1: 3.2, y0: 0, y1: 70 },
  toss: { x0: 0, x1: 1.25, y0: -10, y1: 10 },
  car: { x0: 0, x1: 8, y0: 0, y1: 25 },
  drop: { x0: 0, x1: 3, y0: 0, y1: 16 },
  spring: { x0: 0, x1: 0.5, y0: 0, y1: 25 },
  slide: { x0: 0, x1: 2.2, y0: 0, y1: 18 },
  lift: { x0: 0, x1: 4.2, y0: 0, y1: 250 },
  push: { x0: 0, x1: 4, y0: 0, y1: 20, h: 140 },
  beadU: { x0: 0, x1: 6, y0: 0, y1: 4, h: 125 },
  beadF: { x0: 0, x1: 6, y0: -2, y1: 2, h: 110 },
  bondU: { x0: 0.13, x1: 0.34, y0: -1.2, y1: 0.4, h: 135 },
};
const P0 = M.pull(M.PULL.run), XS = M.SPRING.xmax;

export const PAGES = [
  {
    kicker: 'Глава 4', title: 'Работа', sub: 'действие силы на пути',
    body: `
      <p class="lede"><b>Работа</b> — это передача энергии телу или от тела под действием силы. Сила совершает работу, только если тело перемещается во время её действия.</p>
      <div class="eq"><i>W</i> = |<i>F</i>| |Δ<i>x</i>| cos θ</div>
      <p>θ — угол между силой и перемещением. Работа измеряется в джоулях: 1 Дж — работа силы 1 Н на пути 1 м.</p>
      <p>Верёвка тянет ящик массой ${f(M.PULL.m, 1)} кг с силой ${f(M.PULL.F, 0)} Н под углом ${M.PULL.deg}° к горизонтали по полу без трения. Вдоль движения направлена только составляющая <i>F</i> cos θ = ${f(M.PULL.Fx, 1)} Н. Составляющая <i>F</i> sin θ = ${f(M.PULL.Fy, 1)} Н направлена поперёк перемещения и работы не совершает. На пути ${f(P0.x)} м верёвка совершает работу ${f(P0.W, 1)} Дж — меньше, чем ${f(M.PULL.F * P0.x, 1)} Дж при горизонтальном натяжении.</p>
      <div class="charts">${chart({ ...R.pull, xlabel: 'перемещение Δx (м)', ylabel: 'работа верёвки (Дж)', cursors: [['pull']], label: 'Зависимость работы от перемещения',
        series: [{ cls: 'trend', pts: [[0, 0], [3.2, M.PULL.F * 3.2]], tag: [1.7, M.PULL.F * 1.7 + 3, 'θ = 0°'] }, { pts: [[0, 0], [3.2, M.PULL.Fx * 3.2]], tag: [2.45, M.PULL.Fx * 2.45 - 13, 'θ = 30°'] }] })}</div>
      <p class="hintline">Нажмите на ящик, чтобы разложить силу натяжения на составляющие. Масштаб стрелок: ${SC.pull.F * 100} см на ньютон.</p>`,
    cam: { target: [ST.pull + 0.75, 0.6, 0], az: -20, el: 12, dist: 17 }, lit: 'pull', scene: 'pull', look: {},
    fig: 'Сила тяги под углом 30°',
  },
  {
    kicker: '4.1', title: 'Положительная и отрицательная работа', sub: 'по направлению движения и против него',
    body: `
      <p class="lede">Сила, направленная по движению (θ &lt; 90°), совершает <b>положительную</b> работу: кинетическая энергия тела увеличивается. Сила, направленная против движения (θ &gt; 90°), совершает <b>отрицательную</b> работу: кинетическая энергия уменьшается.</p>
      <p>Мяч массой ${f(M.TOSS.m)} кг брошен вверх со скоростью ${f(M.TOSS.v0, 1)} м/с. При подъёме сила тяжести направлена против движения (θ = 180°) и к верхней точке, где мяч останавливается, совершает работу ${f(-M.TOSS.m * M.G * M.TOSS.h, 1)} Дж. При падении (θ = 0°) сила тяжести возвращает ${f(M.TOSS.m * M.G * M.TOSS.h, 1)} Дж. Энергии складываются: <i>K</i><sub>0</sub> + <i>W</i><sub>g</sub> = <i>K</i>.</p>
      <div class="charts">${chart({ ...R.toss, zero: true, xlabel: 'время (с)', ylabel: 'энергия (Дж)', cursors: [['tossK', BLUE], ['tossW']], label: 'Кинетическая энергия и работа силы тяжести во времени',
        series: [{ color: BLUE, pts: samples(40, 0, M.TOSS.run, t => M.toss(t).K), tag: [0.02, 7.2, 'K'] }, { pts: samples(40, 0, M.TOSS.run, t => M.toss(t).Wg), tag: [0.5, -9.6, 'работа силы тяжести'] }] })}</div>
      <p class="hintline">Масштаб стрелок: <b>v</b> — ${SC.toss.v * 100} см на м/с, <i>F</i><sub>g</sub> — ${SC.toss.F * 100} см/Н. Столбцы энергии: ${SC.toss.E * 100} см/Дж.</p>`,
    cam: { target: [ST.toss + 0.8, 1.25, 0], az: -16, el: 7, dist: 12 }, lit: 'toss', scene: 'toss', look: {},
    fig: 'Подъём против силы тяжести, падение по её направлению',
  },
  {
    kicker: '4.2', title: 'Силы, не совершающие работу', sub: 'перпендикулярные движению',
    body: `
      <p class="lede">Сила, перпендикулярная перемещению (угол 90°), не совершает работы, поскольку cos 90° = 0. Она может изменить направление движения, но не модуль скорости.</p>
      <p>Шар массой ${f(M.WHIRL.m)} кг на нити длиной ${f(M.WHIRL.r, 1)} м движется по гладкому столу со скоростью ${f(M.WHIRL.v, 1)} м/с. Нить тянет его к центру с силой <i>T</i> = ${f(M.WHIRL.T, 1)} Н, всегда перпендикулярной скорости. Кинетическая энергия остаётся равной ${f(M.WHIRL.K)} Дж.</p>
      <p>То же происходит со спутником на круговой орбите: сила тяготения направлена к планете и перпендикулярна скорости, поэтому работы не совершает. Не совершает работу и реакция опоры при движении по горизонтальному полу.</p>
      <div class="charts">${chart({ x0: 0, x1: 180, y0: -10, y1: 10, zero: true, xlabel: 'угол θ (°)', ylabel: 'работа силы 10 Н на пути 1 м (Дж)', label: 'Зависимость работы от угла',
        series: [{ pts: samples(60, 0, 180, d => M.work(10, 1, d)) }, { cls: 'trend', pts: [], tag: [20, 2.5, 'положительная'] }, { cls: 'trend', pts: [], tag: [120, -8, 'отрицательная'] }], marks: [[90, 0, 'ноль при 90°', 8, -8]] })}</div>
      <p class="hintline">Нажмите на шар, чтобы увидеть предыдущие положения. Масштаб: <b>v</b> — ${SC.whirl.v * 100} см на м/с; <i>T</i> — ${SC.whirl.F * 100} см/Н.</p>`,
    cam: { target: [ST.whirl, 0.1, 0], az: -14, el: 36, dist: 8.8 }, lit: 'whirl', scene: 'whirl', look: {},
    fig: 'Сила натяжения перпендикулярна скорости',
  },
  {
    kicker: '4.3', title: 'Кинетическая энергия', sub: 'теорема о работе и изменении энергии',
    body: `
      <p class="lede"><b>Кинетическая энергия</b> — энергия движения: <i>K</i> = ½<i>mv</i>². Это скалярная величина, измеряемая в джоулях; она не бывает отрицательной.</p>
      <p><b>Теорема о работе и изменении кинетической энергии</b>: работа равнодействующей сил равна изменению кинетической энергии.</p>
      <div class="eq"><i>W</i><sub>net</sub> = Δ<i>K</i> = ½<i>mv</i><sub>f</sub>² − ½<i>mv</i><sub>0</sub>²</div>
      <p>Дорога толкает автомобиль массой ${M.CAR.m} кг вперёд с силой ${f(M.CAR.F / 1000, 1)} кН (сопротивлением воздуха пренебрегаем). После перемещения на ${f(M.car(M.CAR.run).x)} м совершена работа ${f(M.car(M.CAR.run).Wnet / 1000)} кДж, а скорость автомобиля достигает ${f(M.car(M.CAR.run).v, 1)} м/с: ½ × ${M.CAR.m} × ${f(M.car(M.CAR.run).v, 1)}² = ${f(M.car(M.CAR.run).K / 1000)} кДж. Оба столбца энергии увеличиваются одинаково.</p>
      <div class="charts">${chart({ ...R.car, xlabel: 'расстояние (м)', ylabel: 'K = W_net (кДж)', cursors: [['car', BLUE]], label: 'Зависимость кинетической энергии от расстояния',
        series: [{ color: BLUE, pts: [[0, 0], [8, M.CAR.F * 8 / 1000]], tag: [3.2, M.CAR.F * 3.2 / 1000 + 3, 'наклон = F = 3,0 кН'] }] })}</div>
      <p class="hintline">Нажмите на автомобиль: сила тяжести и реакция опоры не совершают работы. Масштаб стрелок: 25 см на кН. Столбцы: 7,5 см на кДж.</p>`,
    cam: { target: [ST.car + 4.6, 1.0, 0], az: -16, el: 12, dist: 36 }, lit: 'car', scene: 'car', look: {},
    fig: 'Работа равнодействующей превращается в кинетическую энергию',
  },
  {
    kicker: '4.4', title: 'Потенциальная энергия тяжести', sub: 'энергия положения по высоте',
    body: `
      <p class="lede"><b>Потенциальная энергия</b> — запас энергии, зависящий от положения тела. Вблизи поверхности Земли</p>
      <div class="eq"><i>U</i><sub>g</sub> = <i>mg</i>Δ<i>y</i></div>
      <p>Здесь Δ<i>y</i> отсчитывается от произвольно выбранного уровня, на котором <i>U</i><sub>g</sub> = 0. Потенциальная энергия равна минимальной работе, необходимой для подъёма тела на эту высоту против силы тяжести.</p>
      <p>Шар массой ${f(M.DROP.m)} кг отпускают с высоты ${f(M.DROP.h, 1)} м: <i>U</i><sub>g</sub> = ${f(M.DROP.E, 1)} Дж, <i>K</i> = 0. При падении <i>U</i><sub>g</sub> превращается в <i>K</i>. Перед приземлением <i>K</i> = ${f(M.DROP.E, 1)} Дж, поэтому <i>v</i> = ${f(Math.sqrt(2 * M.G * M.DROP.h))} м/с. Таким образом, начальная потенциальная энергия превращается в конечную кинетическую: <i>U</i><sub>g0</sub> = <i>K</i><sub>f</sub>.</p>
      <div class="charts">${chart({ ...R.drop, xlabel: 'высота над землёй (м)', ylabel: 'энергия (Дж)', cursors: [['dropU', AMBER], ['dropK', BLUE]], label: 'Потенциальная и кинетическая энергия в зависимости от высоты',
        series: [{ cls: 'trend', pts: [[0, M.DROP.E], [3, M.DROP.E]], tag: [1.25, M.DROP.E - 1, 'E'] }, { color: AMBER, pts: [[0, 0], [3, M.DROP.E]], tag: [2.2, 8.5, 'U<tspan dy="3" font-size="8">g</tspan>'] }, { color: BLUE, pts: [[0, M.DROP.E], [3, 0]], tag: [0.35, 10.0, 'K'] }] })}</div>
      <p class="hintline">Нажмите на шар, чтобы изменить нулевой уровень. Масштаб столбцов: ${SC.drop.E * 100} см на джоуль.</p>`,
    cam: { target: [ST.drop + 0.7, 1.5, 0], az: -14, el: 6, dist: 14 }, lit: 'drop', scene: 'drop', look: {},
    fig: 'Потенциальная энергия превращается в скорость',
  },
  {
    kicker: '4.5', title: 'Потенциальная энергия пружины', sub: 'закон Гука',
    body: `
      <p class="lede">Пружина стремится вернуться к естественной длине. Чем сильнее её сжали или растянули, тем больше сила упругости.</p>
      <table class="data eqs"><tr><td><i>F</i><sub>s</sub> = −<i>k</i>Δ<i>x</i></td><td>противоположно Δx; <i>k</i> в Н/м</td></tr><tr><td><i>U</i><sub>s</sub> = ½<i>k</i>Δ<i>x</i>²</td><td>запасённая энергия</td></tr></table>
      <p>При <i>k</i> = ${M.SPRING.k} Н/м блок массой ${f(M.SPRING.m, 1)} кг (<i>K</i> = ${f(M.SPRING.E, 1)} Дж) останавливается при Δ<i>x</i> = ${f(XS)} м: вся энергия ${f(M.SPRING.E, 1)} Дж запасается в пружине, а затем возвращается. Работа равна <b>площади под графиком силы в зависимости от перемещения</b>; для <i>kx</i> это площадь треугольника ½ · Δ<i>x</i> · <i>k</i>Δ<i>x</i>.</p>
      <div class="charts">${chart({ ...R.spring, xlabel: 'сжатие Δx (м)', ylabel: 'сила упругости (Н)', cursors: [['spring']], label: 'Сила упругости в зависимости от сжатия; заштрихованная площадь равна запасённой энергии',
        under: `<path data-area="spring" style="fill:${BAR_COLORS.U};opacity:.45" d=""/>`, series: [{ pts: [[0, 0], [0.5, M.SPRING.k * 0.5]] }] })}</div>
      <p class="live" id="springlive"></p>
      <p class="hintline">Поверхность без трения. Масштаб стрелок: ${SC.spring.F * 100} см/Н. Столбцы: ${SC.spring.E * 100} см/Дж.</p>`,
    cam: { target: [ST.spring - 0.05, 0.6, 0], az: -14, el: 20, dist: 14 }, lit: 'spring', scene: 'spring', look: {},
    fig: 'Сжатие пружины',
  },
  {
    kicker: '4.6 · AP Physics C', title: 'Работа переменной силы', sub: 'площадь под графиком F(x)',
    body: `
      <p class="lede">Если сила меняется вдоль пути, разделим перемещение на узкие участки, для каждого вычислим <i>F</i>Δ<i>x</i>, а затем будем уменьшать ширину участков. Сумма стремится к <b>площади под графиком F(x)</b>:</p>
      <div class="eq"><i>W</i> = lim Σ <i>F</i>(<i>x</i><sub>i</sub>)Δ<i>x</i> = ∫ <i>F</i>(<i>x</i>) d<i>x</i></div>
      <p>На ящик массой ${f(M.PUSH.m, 1)} кг на гладком полу действует сила <i>F</i> = <i>F</i><sub>0</sub>(1 − <i>x</i>/<i>L</i>)(1 + 2<i>x</i>/<i>L</i>), которая уменьшается от ${M.PUSH.F0} Н до нуля при <i>L</i> = ${f(M.PUSH.L, 1)} м. Интегрирование даёт <i>W</i> = ⅚<i>F</i><sub>0</sub><i>L</i> = ${f(M.PUSH.W, 1)} Дж; вся эта работа переходит в кинетическую энергию.</p>
      <div class="charts">${chart({ ...R.push, xlabel: 'координата x (м)', ylabel: 'сила F(x) (Н)', cursors: [['push']], label: 'Сила в зависимости от координаты; площадь до ящика заштрихована и разделена на шесть полос',
        under: `<path data-area="push" style="fill:#86868c;opacity:.35" d=""/>` + Array.from({ length: 6 }, (_, i) => { const dx = M.PUSH.L / 6, x = i * dx, F = M.pushF(x + dx / 2), X = v => CH.sx(v, R.push.x0, R.push.x1), Y = v => CH.sy(v, R.push.y0, R.push.y1, R.push.h); return `<rect class="trend" x="${X(x)}" y="${Y(F)}" width="${X(dx) - X(0)}" height="${Y(0) - Y(F)}"/>`; }).join(''),
        series: [{ pts: [...samples(60, 0, M.PUSH.L, M.pushF), [R.push.x1, 0]] }] })}</div>
      <p class="hintline">6 полос (пунктир): ${f(M.pushStrips(6))} Дж; 64 полосы: ${f(M.pushStrips(64), 3)} Дж. Масштаб: ${SC.push.F * 100} см/Н.</p>`,
    cam: { target: [ST.push + 0.1, 0.8, 0], az: -12, el: 9, dist: 14.5 }, lit: 'push', scene: 'push', look: {},
    fig: 'Работа равна площади под графиком F(x)',
  },
  {
    kicker: '4.7', title: 'Закон сохранения энергии', sub: 'механическая энергия остаётся постоянной',
    body: `
      <p class="lede">Механическая энергия <i>E</i> = <i>K</i> + <i>U</i><sub>g</sub> + <i>U</i><sub>s</sub> сохраняется, если отсутствуют трение и сопротивление среды.</p>
      <div class="eq"><i>U</i><sub>g0</sub> + <i>U</i><sub>s0</sub> + <i>K</i><sub>0</sub> = <i>U</i><sub>gf</sub> + <i>U</i><sub>sf</sub> + <i>K</i><sub>f</sub></div>
      <p>Маятник массой ${f(M.PEND.m, 1)} кг на нити длиной ${f(M.PEND.L, 1)} м отпускают из положения под углом ${M.PEND.deg0}°. В крайних точках энергия полностью потенциальная: <i>U</i><sub>g</sub> = ${f(M.PEND.E)} Дж. В нижней точке она полностью кинетическая, а скорость равна ${f(Math.sqrt(2 * M.PEND.E / M.PEND.m))} м/с. Натяжение нити перпендикулярно движению и работы не совершает. Совет: сначала исключите нулевые слагаемые (<i>v</i> = 0 в крайних точках, Δ<i>y</i> = 0 в нижней точке).</p>
            <div class="charts">${barChart('pend', [['K', 'K', BAR_COLORS.K], ['U', 'U<tspan dy="3" font-size="8">g</tspan>', BAR_COLORS.U], ['E', 'E', BAR_COLORS.E]], M.PEND.E)}</div>
      <p class="hintline">Нажмите на маятник, чтобы разложить силу тяжести на составляющие. Масштаб стрелок: ${SC.pendulum.F * 100} см/Н. Столбцы: ${SC.pendulum.E * 100} см/Дж.</p>`,
    cam: { target: [ST.pendulum + 0.7, 1.8, 0], az: -10, el: 6, dist: 14 }, lit: 'pendulum', scene: 'pendulum', look: {},
    fig: 'Обмен кинетической и потенциальной энергией',
  },
  {
    kicker: '4.8 · AP Physics C', title: 'Сила через потенциальную энергию', sub: 'минус наклон графика U',
    body: `
      <p class="lede">Поскольку d<i>W</i> = <i>F</i> d<i>x</i> = −d<i>U</i>, консервативная сила равна <b>минус производной</b> потенциальной энергии <i>U</i>(<i>x</i>): она направлена в сторону уменьшения энергии и равна нулю там, где график <i>U</i> горизонтален.</p>
      <div class="eq"><i>F</i><sub>x</sub> = −d<i>U</i>/d<i>x</i></div>
      <p>Бусинка массой ${f(M.BEAD.m)} кг движется по гладкой проволоке; координата <i>x</i> отсчитывается вдоль проволоки: <i>U</i> = <i>mgh</i>(<i>x</i>).</p>
      <div class="charts">${chart({ ...R.beadU, xlabel: 'координата x вдоль проволоки (м)', ylabel: 'U (Дж) и касательная', cursors: [['beadU']], label: 'Потенциальная энергия вдоль проволоки и касательная в точке бусинки',
        under: `<line data-tangent="bead" class="curve" style="stroke:#e5484d;stroke-width:1.3"/>`,
        series: [{ cls: 'trend', pts: [[0, M.BEAD.E], [R.beadU.x1, M.BEAD.E]], tag: [5.3, M.BEAD.E - 0.55, 'E'] }, { pts: samples(120, 0, M.BEAD.len, M.beadU) }] })}
        ${chart({ ...R.beadF, zero: true, xlabel: 'координата x вдоль проволоки (м)', ylabel: 'F = −dU/dx (Н)', cursors: [['beadF']], label: 'Сила вдоль проволоки',
        series: [{ pts: samples(120, 0, M.BEAD.len, M.beadF) }], marks: [[M.BEAD.stable, 0, 'устойчивое', -16, 14], [M.BEAD.unstable, 0, 'неустойчивое', 6, -6]] })}</div>
      <p class="hintline">Нажмите на бусинку, чтобы увидеть касательную. Масштаб: ${SC.bead.F * 100} см/Н.</p>`,
    cam: { target: [ST.bead - 0.1, 0.85, 0], az: -10, el: 8, dist: 14.5 }, lit: 'bead', scene: 'bead', look: {},
    fig: 'Движение вниз по графику U',
  },
  {
    kicker: '4.9 · AP Physics C', title: 'Энергетические диаграммы', sub: 'точки поворота и равновесие',
    body: `
      <p class="lede">Проведите линию полной энергии <i>E</i>: расстояние от неё до графика <i>U</i>(<i>x</i>) равно <i>K</i>. Частица разворачивается в <b>точках поворота</b>, где <i>U</i> = <i>E</i>.</p>
      <table class="data eqs"><tr><td>устойчивое</td><td>минимум U, U″ &gt; 0: сила возвращает к равновесию</td></tr><tr><td>неустойчивое</td><td>максимум U, U″ &lt; 0: сила удаляет от равновесия (вершина)</td></tr><tr><td>нейтральное</td><td>U постоянно: сила отсутствует (правый конец проволоки)</td></tr></table>
      <p>Лёгкий атом связан с тяжёлым; полная энергия <i>E</i> = ${f(M.BOND.E / M.EV, 1)} эВ. Вблизи дна потенциальной ямы взаимодействие подобно пружине, <i>k</i> = <i>U</i>″:</p>
      <div class="eq">ω² = <i>U</i>″(<i>x</i><sub>0</sub>)/<i>m</i> → <i>T</i> = ${f(2 * Math.PI / M.BOND.w * 1e15, 1)} fs</div>
      <div class="charts">${chart({ ...R.bondU, xlabel: 'расстояние r (нм)', ylabel: 'U (эВ)', cursors: [['bondU']], zero: true, label: 'Потенциальная энергия связи, линия полной энергии и точки поворота',
        series: [{ cls: 'trend', pts: [[R.bondU.x0, M.BOND.E / M.EV], [R.bondU.x1, M.BOND.E / M.EV]], tag: [0.315, M.BOND.E / M.EV + 0.06, 'E'] }, { pts: samples(120, 0.1355, R.bondU.x1, r => M.bondU(r * 1e-9) / M.EV) }],
        marks: [[M.BOND.r1 * 1e9, M.BOND.E / M.EV, 'поворот', -32, 4], [M.BOND.r2 * 1e9, M.BOND.E / M.EV, 'поворот', 6, 14]] })}</div>
      <p class="hintline">Масштаб рисунка: 0,1 нм = 1 м; <i>F</i> — ${SC.bond.F * 100} см/нН. Анимация замедлена в ${(() => { const [a, e] = (1 / (M.SLOW * M.BOND.tscale)).toExponential(1).split('e+'); return `${a}×10<sup>${e}</sup>`; })()} раза.</p>`,
    cam: { target: [ST.bond - 0.45, 1.25, 0], az: -10, el: 6, dist: 12.5 }, lit: 'bond', scene: 'bond', look: {},
    fig: 'Частица в потенциальной яме',
  },
  {
    kicker: '4.10', title: 'Когда механическая энергия не сохраняется', sub: 'трение превращает её в тепло',
    body: `
      <p class="lede">Трение и сопротивление среды — это <b>силы сопротивления</b>. Они направлены против движения, поэтому их работа всегда отрицательна. Механическая энергия, которую они отнимают, превращается во внутреннюю (тепловую) энергию.</p>
      <div class="eq"><i>E</i><sub>mech,i</sub> = <i>E</i><sub>mech,f</sub> + |<i>W</i><sub>resistive</sub>|</div>
      <p>Блок массой ${f(M.SLIDE.m, 1)} кг скользит по шероховатому полу со скоростью ${f(M.SLIDE.v0, 1)} м/с. При μ<sub>k</sub> = ${f(M.SLIDE.mu)} сила трения равна <i>f</i> = μ<sub>k</sub><i>mg</i> = ${f(M.SLIDE.f)} Н. Блок останавливается через ${f(M.SLIDE.d)} м: |<i>W</i><sub>f</sub>| = <i>f</i>·<i>d</i> = ${f(M.SLIDE.E, 1)} Дж — это вся его кинетическая энергия <i>K</i>. Механическая энергия <i>E</i><sub>mech</sub> уменьшается до нуля, но полная энергия, включая тепло, сохраняется.</p>
      <div class="charts">${chart({ ...R.slide, xlabel: 'путь скольжения (м)', ylabel: 'энергия (Дж)', cursors: [['slideK', BLUE], ['slideT', GREY]], label: 'Кинетическая и тепловая энергия в зависимости от пути',
        series: [{ cls: 'trend', pts: [[0, M.SLIDE.E], [M.SLIDE.d, M.SLIDE.E]], tag: [0.85, M.SLIDE.E - 0.2, 'полная'] }, { color: BLUE, pts: [[0, M.SLIDE.E], [M.SLIDE.d, 0]], tag: [0.2, 11.5, 'K'] }, { color: GREY, pts: [[0, 0], [M.SLIDE.d, M.SLIDE.E]], tag: [1.45, 8.0, 'тепловая'] }] })}</div>
      <p class="hintline">Нажмите на блок. Масштаб стрелок: ${SC.slide.F * 100} см/Н. Столбцы: ${SC.slide.E * 100} см/Дж.</p>`,
    cam: { target: [ST.slide + 0.3, 0.55, 0], az: -16, el: 12, dist: 14 }, lit: 'slide', scene: 'slide', look: {},
    fig: 'Кинетическая энергия превращается в тепло',
  },
  {
    kicker: '4.11', title: 'Мощность', sub: 'скорость совершения работы',
    body: `
      <p class="lede"><b>Мощность</b> — это скорость совершения работы или преобразования энергии из одной формы в другую. Она измеряется в ваттах: 1 Вт = 1 Дж/с, а 1 лошадиная сила = ${M.HP} Вт.</p>
      <div class="eq"><i>P</i> = <i>W</i>/<i>t</i> = <i>F</i>Δ<i>x</i>/<i>t</i> = <i>Fv</i></div>
      <p>Оба ящика массой ${M.LIFT.m} кг поднимают на высоту ${f(M.LIFT.h, 1)} м с постоянной скоростью. Каждая верёвка натягивается с силой <i>T</i> = <i>mg</i> = ${f(M.LIFT.W, 0)} Н и совершает работу ${f(M.LIFT.work, 0)} Дж. Быстрый подъём занимает ${f(M.LIFT.tFast, 1)} с: мощность ${f(M.LIFT.Pfast, 0)} Вт. Медленный — ${f(M.LIFT.tSlow, 1)} с: мощность ${f(M.LIFT.Pslow, 0)} Вт. Работа одинакова, но мощность вдвое больше. Если известны скорость и время, часто удобнее всего использовать <i>P</i> = Δ<i>E</i>/<i>t</i>.</p>
            <div class="charts">${chart({ ...R.lift, xlabel: 'время (с)', ylabel: 'работа (Дж)', cursors: [['liftF'], ['liftS']], label: 'Работа во времени при быстром и медленном подъёме',
        series: [{ pts: [[0, 0], [M.LIFT.tFast, M.LIFT.work], [4.2, M.LIFT.work]], tag: [0.25, 160, 'быстро: наклон 98 Вт'] }, { cls: 'trend', pts: [[0, 0], [M.LIFT.tSlow, M.LIFT.work]], tag: [2.45, 95, 'медленно: 49 Вт'] }] })}</div>
      <p class="hintline">Короткими начальными и конечными участками пренебрегаем. Масштаб стрелок: ${SC.lift.F * 100} см на ньютон.</p>`,
    cam: { target: [ST.lift, 1.7, 0], az: -12, el: 6, dist: 14 }, lit: 'lift', scene: 'lift', look: {},
    fig: 'Одинаковая работа за половину времени',
  },
];

// ---------- click a scene: what it breaks into ----------
export const PLATES = {
  pull: { text: `The pull splits into two parts (grey). <i>F</i> cos θ lies along the displacement and does all the work. <i>F</i> sin θ points straight up, at 90° to the motion, and does none: it only makes the floor push up less. The rope’s work equals the box’s kinetic energy, because nothing else does work.`,
    facts: s => { const r = M.pull(s.pull.t); return [['F cos θ (along Δx)', `${f(M.PULL.Fx)} N`], ['F sin θ (across)', `${f(M.PULL.Fy)} N, no work`], ['Δx', `${f(r.x)} m`], ['W = F Δx cos θ', `${f(r.W)} J`], ['K = ½mv²', `${f(r.K)} J`]]; } },
  toss: { text: `Watch the angle between the weight and the velocity. Going up they are opposite (180°): gravity’s work is negative and the K bar shrinks. Coming down they agree (0°): the work is positive and K grows back. At every instant K = K<sub>0</sub> + W<sub>g</sub>.`,
    facts: s => { const r = M.toss(s.toss.t); return [['height', `${f(r.y)} m`], ['velocity', `${f(r.v)} m/s`], ['W by gravity so far', `${f(r.Wg)} J`], ['K = K₀ + W_g', `${f(M.toss(0).K)} + (${f(r.Wg)}) = ${f(r.K)} J`]]; } },
  whirl: { text: `Earlier moments, a quarter lap apart: at each one the tension (toward the peg) and the velocity (along the circle) meet at 90°. Over any small step the displacement is along <b>v</b>, so T·Δx·cos 90° = 0. The weight and the table’s push are vertical and do no work either.`,
    facts: () => [['tension T', `${f(M.WHIRL.T)} N`], ['angle between T and v', '90°'], ['work by T', '0 J'], ['speed', `${f(M.WHIRL.v)} m/s, constant`], ['K', `${f(M.WHIRL.K)} J, constant`]] },
  car: { text: `Weight and the normal force are vertical, at 90° to the motion, so they do no work and are set aside. The only force along Δx is the road’s push, and it is also the net force (red). Its work, F·Δx, is the whole change in kinetic energy.`,
    facts: s => { const r = M.car(s.car.t); return [['F (road, forward)', `${f(M.CAR.F / 1000)} kN`], ['Δx', `${f(r.x)} m`], ['W_net = F Δx', `${f(r.Wnet / 1000)} kJ`], ['v', `${f(r.v)} m/s`], ['K = ½mv²', `${f(r.K / 1000)} kJ`]]; } },
  drop: { text: `Move the zero up to ${f(M.DROP.ref2, 1)} m and every value of U<sub>g</sub> drops by mg × ${f(M.DROP.ref2, 1)} = ${f(M.DROP.m * M.G * M.DROP.ref2)} J. Below the new zero, U<sub>g</sub> is negative. But the <i>change</i> in U<sub>g</sub> during the fall is the same, so the speed you predict is the same. Choose whichever zero makes the arithmetic easiest.`,
    facts: s => { const r = M.drop(s.drop.t), m = M.DROP.m * M.G; return [['height', `${f(r.y)} m`], ['U_g, zero at ground', `${f(r.U)} J`], [`U_g, zero at ${f(M.DROP.ref2, 1)} m`, `${f(m * (r.y - M.DROP.ref2))} J`], ['ΔU_g since release', `${f(r.U - M.DROP.E)} J either way`], ['K', `${f(r.K)} J`]]; } },
  spring: { text: `The grey arrow is the compression Δx, measured from the spring’s natural length. The spring force F<sub>s</sub> = −kΔx points the other way. As the block slows, its K bar empties into the U<sub>s</sub> bar; at full compression it is all U<sub>s</sub>. The total never changes.`,
    facts: s => { const r = M.spring(s.spring.t); return [['compression Δx', `${f(r.x, 3)} m`], ['F_s = −kΔx', `${f(r.F)} N`], ['U_s = ½kΔx²', `${f(r.U)} J`], ['K = ½mv²', `${f(r.K)} J`], ['K + U_s', `${f(r.K + r.U)} J`]]; } },
  push: { text: `The area under F(x) comes apart into ${6} strips. Each is F(x<sub>i</sub>)·Δx, the work over one short step where the push hardly changes. Their sum, ${f(M.pushStrips(6))} J, is already close to the integral, ${f(M.PUSH.W)} J; thinner strips close the gap. The floor is level and smooth, so weight and the normal force do no work and the area is all kinetic energy.`,
    facts: s => { const r = M.push(s.push.t); return [['x', `${f(r.x)} m`], ['F(x)', `${f(r.F)} N`], ['W = ∫F dx so far', `${f(r.W)} J`], ['K = ½mv²', `${f(r.K)} J`], ['6-strip sum, whole push', `${f(M.pushStrips(6))} J`], ['∫₀ᴸ F dx', `${f(M.PUSH.W)} J`]]; } },
  bead: { text: `The dashed line is the tangent to the wire. Gravity splits into a part along the wire, mg sin θ, and a part across it, which the wire’s push takes up. Since U = mgh and dh/dx = sin θ along the wire, the part along it is exactly −dU/dx. At the valley floor and the hump top the tangent is level: no force, equilibrium.`,
    facts: s => { const r = M.bead(s.bead.t); return [['x along the wire', `${f(r.x)} m`], ['U = mgh', `${f(r.U)} J`], ['dU/dx (slope)', `${f(r.slope)} J/m`], ['F = −dU/dx', `${f(r.F)} N`], ['K + U', `${f(r.K + r.U, 3)} J`]]; } },
  bond: { text: `The bond is a Lennard-Jones model, U = ε[(r<sub>0</sub>/r)¹² − 2(r<sub>0</sub>/r)⁶], r<sub>0</sub> = ${f(M.BOND.r0 * 1e9)} nm; the heavy atom barely moves. Ghosts mark the turning points, where U = E and the atom stops. The blue dashed parabola is ½k(r − r<sub>0</sub>)² with k = U″(r<sub>0</sub>) = ${f(M.BOND.k, 0)} N/m: it fits the bottom of the well, which is why small vibrations are simple harmonic with ω² = U″/m. Higher up the real well is lopsided, steep inside and soft outside, so this swing is slower and spends longer stretched.`,
    facts: s => { const r = M.bond(s.bond.t); return [['r', `${f(r.r * 1e9, 4)} nm`], ['U', `${f(r.U / M.EV, 3)} eV`], ['K = E − U', `${f(r.K / M.EV, 3)} eV`], ['F = −dU/dr', `${f(r.F * 1e9)} nN`], ['k = U″(r₀)', `${f(M.BOND.k, 0)} N/m`], ['T small / this swing', `${f(2 * Math.PI / M.BOND.w * 1e15)} / ${f(M.BOND.period * 1e15)} fs`]]; } },
  pendulum: { text: `The weight splits into mg sin θ, along the path, and mg cos θ, along the string. Only mg sin θ does work: it slows the bob on the way up and speeds it on the way down. The tension and mg cos θ are across the motion and do none, which is why K + U<sub>g</sub> stays fixed.`,
    facts: s => { const r = M.pendulum(s.pendulum.t); return [['angle θ', `${f(r.th * 180 / Math.PI, 1)}°`], ['mg sin θ (along path)', `${f(r.Ftan)} N`], ['tension T', `${f(r.T)} N, no work`], ['K', `${f(r.K)} J`], ['U_g', `${f(r.U)} J`], ['K + U_g', `${f(r.K + r.U)} J`]]; } },
  slide: { text: `Weight and the normal force do no work and are set aside. Friction is the only force along the motion, and it points backwards: θ = 180°, so its work is −f·Δx. That negative work is exactly the kinetic energy lost, and it reappears as heat in the block and the floor.`,
    facts: s => { const r = M.slide(s.slide.t); return [['friction f = μk mg', `${f(M.SLIDE.f)} N`], ['Δx', `${f(r.x)} m`], ['W_f = −f Δx', `${f(r.Wf)} J`], ['K', `${f(r.K)} J`], ['thermal energy', `${f(r.Eth)} J`], ['K + thermal', `${f(r.K + r.Eth)} J`]]; } },
  lift: { text: `The grey arrows are each crate’s rise Δy. At steady speed the rope’s pull equals the weight, so each rope does W = mgΔy. Equal heights mean equal work; the faster crate gets there in half the time, so its rope delivers twice the power.`,
    facts: s => { const a = M.lift(s.lift.t, M.LIFT.vFast), b = M.lift(s.lift.t, M.LIFT.vSlow); return [['T = mg', `${f(M.LIFT.W, 1)} N`], ['fast: work so far', `${f(a.W, 0)} J, P ${f(a.P, 0)} W`], ['slow: work so far', `${f(b.W, 0)} J, P ${f(b.P, 0)} W`], ['P = Fv (fast)', `${f(M.LIFT.W, 0)} × ${f(M.LIFT.vFast, 1)} = ${f(M.LIFT.Pfast, 0)} W`]]; } },
};
