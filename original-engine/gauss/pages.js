// Chapter 10, page by page (after the AP Physics C E&M organizer, Unit 2). Text and an E(r) chart on
// the left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, SC, Y0 } from './world.js';

const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const nC = q => f(q * 1e9, 2);
const arrowNote = s => `Масштаб стрелок: ${f(s, 1)} клетки на кН/Кл. Одна клетка сетки соответствует 10 см.`;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], vlines = [], zero = false, cursor, cursors = [], label }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(Math.min(Math.max(y, y0), y1)).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const vl = vlines.map(([x, t]) => `<line class="grid" x1="${sx(x)}" x2="${sx(x)}" y1="${P.t}" y2="${H - P.b}"/><text class="ax" x="${sx(x)}" y="${H - 9}" text-anchor="middle">${t}</text>`).join('');
  const mk = marks.map(([x, y, t]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + 6}" y="${sy(y) + 14}">${t}</text>`).join('');
  const z = zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  const cs = [cursor, ...cursors].filter(Boolean).map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${z}${vl}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2 + 40}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cs}
  </svg>`;
}
const curve = (fn, a, b, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
// chart ranges, shared with main.js for the live cursors
export const R = {
  flux: { x0: 0, x1: 180, y0: -80, y1: 80 },
  point: { x0: 0, x1: 26, y0: 0, y1: 2 },
  line: { x0: 0, x1: 22, y0: 0, y1: 0.8 },
  sheet: { x0: -15, x1: 15, y0: -0.5, y1: 0.5 },
  sphere: { x0: 0, x1: 26, y0: 0, y1: 2 },
  rod: { x0: 0, x1: 17, y0: 0, y1: 0.8 },
  cage: { x0: -40, x1: 40, y0: 0, y1: 3.2 },
};
const kE = fn => r => fn(r / 100) / 1000;     // r in cm → E in kN/C
const sphereChart = (fn, cursor, extra = []) => chart({ ...R.sphere, xlabel: 'r (см)', ylabel: 'E (кН/Кл)', cursor, label: 'Напряжённость поля в зависимости от расстояния до центра',
  vlines: [[10, 'R']], series: [...extra, { pts: curve(kE(fn), 0.001, 26, 120) }] });

export const PAGES = [
  {
    kicker: 'Глава 10', title: 'Поток электрического поля', sub: 'сколько поля проходит через поверхность',
    body: `
      <p class="lede"><b>Поток</b> Φ электрического поля через поверхность характеризует, насколько много поля проходит сквозь неё. Его можно представить как число силовых линий, пересекающих поверхность.</p>
      <div class="eq">Φ = <b>E</b> · <b>A</b> = <i>EA</i> cos θ</div>
      <p>Вектор площади <b>A</b> перпендикулярен поверхности, а его модуль равен площади поверхности. θ — угол между <b>E</b> и <b>A</b>. Чем сильнее поле, больше площадь и прямее поверхность обращена к полю, тем больше поток. Единицы: Н·м²/Кл.</p>
      <p>Квадрат со стороной ${f(M.FLUX.side * 100, 0)} см поворачивается в однородном поле напряжённостью ${f(M.FLUX.E / 1000, 1)} кН/Кл. При перпендикулярном положении поток Φ = ${f(M.FLUX.max, 0)} Н·м²/Кл; при положении ребром к полю он равен нулю; после поворота за 90° становится отрицательным. Поток однородного поля через любую <i>замкнутую</i> поверхность равен нулю.</p>
      <div class="charts">${chart({ ...R.flux, zero: true, xlabel: 'θ (°)', ylabel: 'Φ (Н·м²/Кл)', cursor: 'flux', label: 'Поток в зависимости от угла поворота', series: [{ pts: curve(M.flux, 0, 180) }] })}</div>
      <p class="hintline">Нажмите на квадрат, чтобы разложить <b>E</b> на составляющие. ${arrowNote(SC.flux)}</p>`,
    cam: { target: [STATIONS.flux + 0.3, Y0 - 0.2, 0], az: -16, el: 26, dist: 17 }, lit: 'flux', scene: 'flux', look: {},
    fig: 'Квадрат поворачивается в однородном поле',
  },
  {
    kicker: '10.1', title: 'Закон Гаусса', sub: 'поток наружу равен заряду внутри',
    body: `
      <p class="lede">Через любую <b>замкнутую</b> поверхность полный поток наружу равен заключённому внутри заряду, делённому на ε<sub>0</sub>.</p>
      <div class="eq">∮ <b>E</b> · d<b>A</b> = <i>q</i><sub>enc</sub> / ε<sub>0</sub></div>
      <p>d<b>A</b> направлен наружу. Радиус сферы меняется, но Φ остаётся равным ${f(M.POINT.flux, 0)} Н·м²/Кл: поле <i>E</i> убывает как 1/<i>r</i>², а площадь 4π<i>r</i>² растёт как <i>r</i>². На сфере <b>E</b> ∥ d<b>A</b>, а <i>E</i> постоянно, поэтому</p>
      <div class="eq"><i>E</i> · 4π<i>r</i>² = <i>q</i>/ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = <i>kq</i>/<i>r</i>²</div>
      <p>Это закон Кулона. Внутри коробки нет заряда: каждая силовая линия, входящая в неё, выходит наружу, поэтому поток равен нулю.</p>
      <div class="charts">${chart({ ...R.point, xlabel: 'r (см)', ylabel: 'E (кН/Кл)', cursor: 'point', label: 'Поле точечного заряда в зависимости от расстояния', series: [{ pts: curve(kE(M.pointE), 6.5, 26) }] })}</div>
      <p class="hintline">Нажмите на сферу, чтобы увидеть d<b>A</b>, или на коробку, чтобы рассмотреть каждую грань. ${arrowNote(SC.point)}</p>`,
    cam: { target: [STATIONS.gauss + 1.2, Y0, 0], az: -10, el: 14, dist: 29 }, lit: 'gauss', scene: 'gauss', look: {},
    fig: `q = ${nC(M.POINT.q)} нКл, две замкнутые поверхности`,
  },
  {
    kicker: '10.2', title: 'Заряженная нить', sub: 'цилиндрическая поверхность вокруг неё',
    body: `
      <p class="lede">Бесконечная линия несёт заряд λ на единицу длины. По симметрии <b>E</b> направлено перпендикулярно от линии, поэтому окружим её соосным цилиндром радиуса <i>r</i> и длины <i>L</i>.</p>
      <p>Разделим поверхность на две крышки и боковую цилиндрическую часть. На крышках <b>E</b> ⊥ d<b>A</b>, поэтому поток равен нулю. На боковой поверхности <b>E</b> ∥ d<b>A</b>, а <i>E</i> постоянно:</p>
      <div class="eq"><i>E</i> · 2π<i>rL</i> = λ<i>L</i>/ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = 2<i>k</i>λ/<i>r</i></div>
      <p><i>L</i> сокращается, а поле убывает как 1/<i>r</i> — медленнее, чем поле точечного заряда. Здесь λ = ${nC(M.LINE.lam)} нКл/м, поэтому на расстоянии 10 см <i>E</i> = ${f(M.lineE(0.1), 0)} Н/Кл.</p>
      <div class="charts">${chart({ ...R.line, xlabel: 'r (см)', ylabel: 'E (кН/Кл)', cursor: 'line', label: 'Поле заряженной линии в зависимости от расстояния', series: [{ pts: curve(kE(M.lineE), 4.5, 22) }] })}</div>
      <p class="hintline">Нажмите на цилиндр, чтобы снять его крышки. ${arrowNote(SC.line)}</p>`,
    cam: { target: [STATIONS.line, Y0, 0], az: -32, el: 18, dist: 23 }, lit: 'line', scene: 'line', look: {},
    fig: 'Крышки и боковая поверхность',
  },
  {
    kicker: '10.3', title: 'Заряженные листы и пластины', sub: 'гауссов цилиндр пересекает поверхность',
    body: `
      <p class="lede">Небольшой цилиндр пересекает каждую поверхность. Его боковая часть параллельна <b>E</b>, поэтому поток проходит только через крышки, а заключённый заряд равен σ<i>A</i>.</p>
      <table class="data">
        <tr><th></th><th>непроводящий лист</th><th>металлическая пластина</th></tr>
        <tr><td>поток наружу</td><td>через обе крышки: 2<i>EA</i></td><td>через одну крышку: <i>EA</i></td></tr>
        <tr><td>откуда <i>E</i> =</td><td>σ/2ε<sub>0</sub> = ${f(M.SHEET.E, 0)} Н/Кл</td><td>σ/ε<sub>0</sub> = ${f(M.PLATE.E, 0)} Н/Кл</td></tr>
      </table>
      <p>Внутри металла <i>E</i> = 0, поэтому внутренняя крышка цилиндра не несёт потока. Здесь σ = ${nC(M.SHEET.sigma)} нКл/м² — заряд на единицу площади листа и <i>каждой стороны</i> пластины. Ни одно из полей не зависит от расстояния: поле однородно.</p>
      <div class="charts">${chart({ ...R.sheet, zero: true, xlabel: 'высота над серединой (см)', ylabel: 'E (кН/Кл, вверх)', label: 'Поле листа и пластины в зависимости от высоты',
        series: [{ cls: 'trend', pts: [[-15, -M.SHEET.E / 1000], [0, -M.SHEET.E / 1000], [0, M.SHEET.E / 1000], [15, M.SHEET.E / 1000]], tag: [-14, -M.SHEET.E / 1000 + 0.1, 'лист'] },
          { pts: [[-15, -M.PLATE.E / 1000], [-3, -M.PLATE.E / 1000], [-3, 0], [3, 0], [3, M.PLATE.E / 1000], [15, M.PLATE.E / 1000]], tag: [5, M.PLATE.E / 1000 - 0.16, 'пластина'] }] })}</div>
      <p class="hintline">Нажмите на лист или пластину, чтобы открыть гауссов цилиндр. ${arrowNote(SC.sheet)}</p>`,
    cam: { target: [(STATIONS.sheet + STATIONS.plate) / 2, Y0, 0], az: -10, el: 24, dist: 30 }, lit: 'sheet', scene: 'sheet', look: {},
    fig: 'Непроводящий лист и металлическая пластина',
  },
  {
    kicker: '10.4', title: 'Металлическая сфера', sub: 'внутри и снаружи',
    body: `
      <p class="lede">В проводнике заряд распределяется по <b>поверхности</b>. Гауссова сфера внутри металла не заключает внутри себя заряд.</p>
      <table class="data">
        <tr><td><i>r</i> &lt; <i>R</i></td><td><i>q</i><sub>enc</sub> = 0</td><td><i>E</i> = 0</td></tr>
        <tr><td><i>r</i> &gt; <i>R</i></td><td><i>q</i><sub>enc</sub> = <i>Q</i></td><td><i>E</i> · 4π<i>r</i>² = <i>Q</i>/ε<sub>0</sub> → <i>E</i> = <i>kQ</i>/<i>r</i>²</td></tr>
      </table>
      <p>Снаружи сфера действует как точечный заряд, расположенный в её центре. На поверхности поле скачком возрастает от 0 до <i>kQ</i>/<i>R</i>² = ${f(M.cSphere.E(M.SPH.R), 0)} Н/Кл. Здесь <i>Q</i> = ${nC(M.SPH.Q)} нКл и <i>R</i> = ${f(M.SPH.R * 100, 0)} см. Часть сферы удалена, чтобы показать её внутреннее устройство.</p>
      <div class="charts">${sphereChart(M.cSphere.E, 'csphere')}</div>
      <p class="hintline">Нажмите на сферу, чтобы увидеть заряд, заключённый гауссовой поверхностью. ${arrowNote(SC.sphere)}</p>`,
    cam: { target: [STATIONS.csphere, Y0, 0], az: -24, el: 16, dist: 16 }, lit: 'csphere', scene: 'csphere', look: {},
    fig: 'Заряд только на поверхности',
  },
  {
    kicker: '10.5', title: 'Диэлектрическая сфера', sub: 'заряд распределён по всему объёму',
    body: `
      <p class="lede">В диэлектрике заряд не перемещается свободно. Здесь он равномерно распределён по объёму: ρ = <i>Q</i>/(⁴⁄₃π<i>R</i>³) = ${f(M.SPH.rho * 1e6, 3)} мкКл/м³.</p>
      <p>Внутри сферы <i>q</i><sub>enc</sub> = ρ⁴⁄₃π<i>r</i>³: внутри используем текущий радиус <i>r</i>, снаружи — полный радиус <i>R</i>.</p>
      <table class="data eqs">
        <tr><td><i>E</i> · 4π<i>r</i>² = ρ⁴⁄₃π<i>r</i>³/ε<sub>0</sub></td><td><i>E</i> = ρ<i>r</i>/3ε<sub>0</sub>, внутри</td></tr>
        <tr><td><i>E</i> · 4π<i>r</i>² = ρ⁴⁄₃π<i>R</i>³/ε<sub>0</sub></td><td><i>E</i> = <i>kQ</i>/<i>r</i>², снаружи</td></tr>
      </table>
      <p><i>E</i> линейно растёт до максимума на поверхности, затем убывает как 1/<i>r</i>². Снаружи поле совпадает с полем металлической сферы с теми же <i>Q</i> и <i>R</i>. Если сфера полая, внутри полости <i>E</i> = 0.</p>
      <div class="charts">${sphereChart(M.iSphere.E, 'isphere')}</div>
      <p class="hintline">Нажмите на сферу, чтобы увидеть заключённый заряд. ${arrowNote(SC.sphere)}</p>`,
    cam: { target: [STATIONS.isphere, Y0, 0], az: -24, el: 16, dist: 16 }, lit: 'isphere', scene: 'isphere', look: {},
    fig: 'E ∝ r внутри, 1/r² снаружи',
  },
  {
    kicker: '10.6', title: 'Заряженные цилиндры', sub: 'проводник и диэлектрик',
    body: `
      <p class="lede">Два длинных цилиндра радиуса <i>R</i> = ${f(M.ROD.R * 100, 0)} см имеют одинаковую линейную плотность заряда λ = ${nC(M.ROD.lam)} нКл/м. Вокруг каждого расположим соосную гауссову цилиндрическую поверхность; через её крышки поток не проходит.</p>
      <table class="data">
        <tr><th></th><th>проводник (σ на поверхности)</th><th>диэлектрик (ρ в объёме)</th></tr>
        <tr><td><i>r</i> &lt; <i>R</i></td><td><i>E</i> = 0</td><td><i>E</i> = ρ<i>r</i>/2ε<sub>0</sub></td></tr>
        <tr><td><i>r</i> &gt; <i>R</i></td><td><i>E</i> = σ<i>R</i>/ε<sub>0</sub><i>r</i></td><td><i>E</i> = ρ<i>R</i>²/2ε<sub>0</sub><i>r</i></td></tr>
      </table>
      <p>Внутри диэлектрика <i>q</i><sub>enc</sub> = ρπ<i>r</i>²<i>L</i>, а <i>E</i> · 2π<i>rL</i> = <i>q</i><sub>enc</sub>/ε<sub>0</sub>. Снаружи поле обоих цилиндров равно 2<i>k</i>λ/<i>r</i>, как у линейного заряда. Внутри полого диэлектрического цилиндра или сферы <i>E</i> = 0.</p>
      <div class="charts">${chart({ ...R.rod, xlabel: 'r (см)', ylabel: 'E (кН/Кл)', cursors: ['crod', 'irod'], label: 'Поле цилиндров в зависимости от расстояния', vlines: [[5, 'R']],
        series: [{ cls: 'trend', pts: curve(kE(M.cRod.E), 0.001, 17, 120), tag: [1.2, 0.07, 'проводник'] }, { pts: curve(kE(M.iRod.E), 0.001, 17, 120), tag: [1.6, 0.36, 'диэлектрик'] }] })}</div>
      <p class="hintline">Нажмите на цилиндр, чтобы увидеть заключённый заряд. ${arrowNote(SC.rod)}</p>`,
    cam: { target: [(STATIONS.crod + STATIONS.irod) / 2, Y0 + 0.3, 0], az: -12, el: 14, dist: 19 }, lit: 'irod', scene: 'rods', look: {},
    fig: 'Слева проводник, справа диэлектрик',
  },
  {
    kicker: '10.7', title: 'Неравномерное распределение заряда', sub: 'ρ(r) = br',
    body: `
      <p class="lede">Если ρ зависит от <i>r</i>, суммируем заряды тонких сферических слоёв, каждый из которых содержит ρ(<i>r</i>) · 4π<i>r</i>² d<i>r</i>.</p>
      <div class="eq"><i>q</i><sub>enc</sub> = ∫<sub>0</sub><sup><i>r</i></sup> <i>br</i>′ · 4π<i>r</i>′² d<i>r</i>′ = π<i>br</i>⁴</div>
      <p>Внутри <i>E</i> · 4π<i>r</i>² = π<i>br</i>⁴/ε<sub>0</sub>, откуда <i>E</i> = <i>br</i>²/4ε<sub>0</sub>. Снаружи <i>E</i> = <i>bR</i>⁴/4ε<sub>0</sub><i>r</i>². Здесь <i>b</i> = ${f(M.SPH.b * 1e6, 2)} мкКл/м⁴; полный заряд тот же — ${nC(M.SPH.Q)} нКл.</p>
      <table class="data"><tr><th>ρ(r)</th><td>const</td><td>br</td><td>br²</td><td>br³</td></tr><tr><th>E внутри ∝</th><td>r</td><td>r²</td><td>r³</td><td>r⁴</td></tr></table>
      <div class="charts">${sphereChart(M.nSphere.E, 'nsphere', [{ cls: 'trend', pts: curve(kE(M.iSphere.E), 0.001, 10, 40), tag: [3.5, 0.95, 'uniform'] }])}</div>
      <p class="hintline">К центру сферы точки, обозначающие заряд, становятся реже. ${arrowNote(SC.sphere)}</p>`,
    cam: { target: [STATIONS.nsphere, Y0, 0], az: -24, el: 16, dist: 16 }, lit: 'nsphere', scene: 'nsphere', look: {},
    fig: 'Плотность заряда растёт к поверхности',
  },
  {
    kicker: '10.8', title: 'Проводники', sub: 'электростатическое равновесие: клетка Фарадея',
    body: `
      <p class="lede">Когда заряды в проводнике приходят в равновесие:</p>
      <ol class="rules">
        <li><i>E</i> = 0 во всех точках внутри металла.</li>
        <li>Избыточный заряд находится на поверхности.</li>
        <li>Сразу за поверхностью <b>E</b> перпендикулярно ей, а <i>E</i> = σ/ε<sub>0</sub>.</li>
        <li>Внутри полой оболочки без зарядов электрического поля нет: это <b>клетка Фарадея</b>.</li>
      </ol>
      <p>Незаряженная оболочка находится в однородном поле ${f(M.CAGE.E0 / 1000, 1)} кН/Кл. Электроны смещаются влево, оставляя правую сторону положительно заряженной. Созданное ими поле компенсирует <b>E</b><sub>0</sub> внутри металла и искривляет силовые линии так, что у поверхности они становятся перпендикулярными ей. (Если по проводу течёт ток, поле <i>E</i> внутри него не равно нулю.)</p>
      <div class="charts">${chart({ ...R.cage, xlabel: 'x (см)', ylabel: 'E (кН/Кл)', label: 'Поле вдоль оси оболочки', vlines: [[-14, '−R'], [14, 'R']],
        series: [{ pts: curve(x => M.len(M.cageField([x / 100, 0, 0])) / 1000, -40, 40, 400) }] })}</div>
      <p class="hintline">Нажмите на оболочку, чтобы увидеть гауссову поверхность внутри металла. ${arrowNote(SC.cage)}</p>`,
    cam: { target: [STATIONS.cage, Y0, 0], az: -18, el: 14, dist: 21 }, lit: 'cage', scene: 'cage', look: {},
    fig: 'Внутри оболочки поля нет',
  },
];

// ---------- click a scene: what it breaks into ----------
const rNow = (s, sc) => M.breathe(s.clock, sc.rMin, sc.rMax, sc.T);
const sphereFacts = model => s => { const r = rNow(s, M.SPH); return [['Радиус гауссовой поверхности r', `${f(r * 100, 1)} см (R = ${f(M.SPH.R * 100, 0)} см)`], ['Заряд внутри поверхности q<sub>enc</sub>', `${nC(model.qenc(r))} нКл`], ['Поток q<sub>enc</sub>/ε<sub>0</sub>', `${f(model.qenc(r) / M.EPS0, 1)} Н·м²/Кл`], ['E = поток / 4πr²', `${f(model.E(r), 0)} Н/Кл`]]; };
const rodFacts = model => s => { const r = rNow(s, M.ROD); return [['Радиус гауссовой поверхности r', `${f(r * 100, 1)} cm (R = ${f(M.ROD.R * 100, 0)} cm)`], ['Длина цилиндра L', `${f(M.ROD.L * 100, 0)} см`], ['Заряд внутри поверхности q<sub>enc</sub>', `${f(model.qenc(r) * 1e12, 0)} пКл`], ['E = q<sub>enc</sub>/(ε<sub>0</sub> 2πrL)', `${f(model.E(r), 0)} Н/Кл`]]; };
export const PLATES = {
  flux: { text: `<b>E</b> раскладывается на составляющую вдоль <b>A</b>, <i>E</i> cos θ, и составляющую в плоскости поверхности, <i>E</i> sin θ, которая проходит вдоль неё. Поток создаёт только первая составляющая. То же можно представить так: проекция квадрата на плоскость, перпендикулярную полю, имеет площадь <i>A</i> cos θ (пунктир).`,
    facts: s => { const d = M.fluxAngle(s.clock); return [['θ', `${f(d, 1)}°`], ['E cos θ', `${f(M.FLUX.E * Math.cos(d * Math.PI / 180), 0)} Н/Кл`], ['A', `${f(M.FLUX.A, 3)} м²`], ['Φ = EA cos θ', `${f(M.flux(d), 1)} Н·м²/Кл`]]; } },
  gauss: { text: `Каждый малый элемент d<b>A</b> (чёрный) направлен наружу, вдоль <b>E</b> (синего). Поэтому на каждом элементе <b>E</b> · d<b>A</b> = <i>E</i> d<i>A</i>. Поскольку <i>E</i> одинаково во всех точках сферы, ∮ <i>E</i> d<i>A</i> = <i>E</i> · 4π<i>r</i>².`,
    facts: s => { const r = rNow(s, M.POINT); return [['r', `${f(r * 100, 1)} см`], ['E = kq/r²', `${f(M.pointE(r), 0)} Н/Кл`], ['4πr²', `${f(4 * Math.PI * r * r, 4)} м²`], ['Φ = E · 4πr²', `${f(M.pointE(r) * 4 * Math.PI * r * r, 1)} Н·м²/Кл`], ['q/ε<sub>0</sub>', `${f(M.POINT.flux, 1)} Н·м²/Кл`]]; } },
  box: { text: `Шесть граней раздвинуты; на каждой указано значение потока в Н·м²/Кл, рассчитанное по полю заряда. Поток входит (−) через ближайшую к заряду грань и выходит (+) через остальные пять. Их сумма равна нулю: внутри коробки нет заряда.`,
    facts: () => { const b = M.boxFaces(); return [['ближняя грань (вход)', `${f(b[1], 1)} Н·м²/Кл`], ['дальняя грань', `${f(b[0], 1)} Н·м²/Кл`], ['четыре боковые грани', `${f(b[2] + b[3] + b[4] + b[5], 1)} Н·м²/Кл`], ['суммарный поток', `${f(Math.abs(b.reduce((a, c) => a + c)) < 0.05 ? 0 : b.reduce((a, c) => a + c), 1)} Н·м²/Кл`]]; } },
  line: { text: `Крышки сняты. На крышках поле направлено вдоль их плоскости (серые стрелки), поэтому <b>E</b> ⊥ d<b>A</b> и поток через них равен нулю. Весь поток проходит через боковую цилиндрическую поверхность, где <b>E</b> ∥ d<b>A</b>.`,
    facts: s => { const r = rNow(s, M.LINE); return [['r', `${f(r * 100, 1)} см`], ['площадь боковой поверхности 2πrL', `${f(2 * Math.PI * r * M.LINE.L, 4)} м²`], ['E = 2kλ/r', `${f(M.lineE(r), 0)} Н/Кл`], ['поток через боковую поверхность', `${f(M.lineE(r) * 2 * Math.PI * r * M.LINE.L, 2)} Н·м²/Кл`], ['λL/ε<sub>0</sub>', `${f(M.LINE.lam * M.LINE.L / M.EPS0, 2)} Н·м²/Кл`]]; } },
  sheet: { text: `Торцевые крышки выступают наружу. Через каждую проходит наружу поток <i>EA</i>; через боковую поверхность поток равен нулю. 2<i>EA</i> = σ<i>A</i>/ε<sub>0</sub>, поэтому <i>E</i> = σ/2ε<sub>0</sub> независимо от высоты цилиндра Гаусса.`,
    facts: () => [['σ', `${nC(M.SHEET.sigma)} нКл/м²`], ['площадь крышки A', `${f(M.SHEET.Abox * 1e4, 1)} см²`], ['q<sub>enc</sub> = σA', `${f(M.SHEET.sigma * M.SHEET.Abox * 1e12, 1)} пКл`], ['E = σ/2ε<sub>0</sub>', `${f(M.SHEET.E, 0)} Н/Кл`]] },
  plate: { text: `Внутренняя крышка находится внутри проводника, где <i>E</i> = 0, поэтому поток проходит только через внешнюю крышку: <i>EA</i> = σ<i>A</i>/ε<sub>0</sub>. При той же σ поле вдвое сильнее, чем у одного листа.`,
    facts: () => [['σ на каждой поверхности', `${nC(M.PLATE.sigma)} нКл/м²`], ['E внутри металла', '0'], ['E снаружи = σ/ε<sub>0</sub>', `${f(M.PLATE.E, 0)} Н/Кл`]] },
  csphere: { text: `Металлическая сфера становится прозрачной. Внутри неё гауссова сфера не охватывает заряд: поток и поле равны нулю. Когда гауссова сфера становится больше металлической, она охватывает весь заряд <i>Q</i> (красная оболочка), и <i>E</i> = <i>kQ</i>/<i>r</i>².`, facts: sphereFacts(M.cSphere) },
  isphere: { text: `Красный шар показывает заряд, охваченный гауссовой сферой. Внутри изолятора он растёт пропорционально <i>r</i>³, тогда как площадь поверхности растёт пропорционально <i>r</i>², поэтому <i>E</i> растёт пропорционально <i>r</i>. Снаружи охваченный заряд равен полному заряду <i>Q</i>.`, facts: sphereFacts(M.iSphere) },
  nsphere: { text: `Красная область показывает охваченный заряд, равный π<i>br</i>⁴: внешние слои содержат всё больше заряда, поэтому он растёт как <i>r</i>⁴. Следовательно, <i>E</i> = <i>q</i><sub>enc</sub>/(4π<i>r</i>²ε<sub>0</sub>) растёт как <i>r</i>².`, facts: sphereFacts(M.nSphere) },
  crod: { text: `Металлический цилиндр становится прозрачным. Цилиндр Гаусса внутри проводника не охватывает заряд. Снаружи он охватывает заряд σ · 2π<i>RL</i> (красная область), и <i>E</i> · 2π<i>rL</i> = σ2π<i>RL</i>/ε<sub>0</sub>.`, facts: rodFacts(M.cRod) },
  irod: { text: `Красная сердцевина — заряд внутри цилиндра Гаусса: ρπ<i>r</i>²<i>L</i> при <i>r</i> &lt; <i>R</i>. Разделив его на ε<sub>0</sub> и площадь боковой поверхности 2π<i>rL</i>, получаем <i>E</i> = ρ<i>r</i>/2ε<sub>0</sub>.`, facts: rodFacts(M.iRod) },
  cage: { text: `Пунктиром показана гауссова сфера внутри металла. На ней <i>E</i> = 0, поэтому охваченный суммарный заряд равен нулю: на внутренней стенке нет заряда, а в полости отсутствует поле. Стрелки у поверхности перпендикулярны ей: направлены внутрь на стороне − и наружу на стороне +.`,
    facts: () => [['E<sub>0</sub>', `${f(M.CAGE.E0, 0)} Н/Кл`], ['σ на положительном полюсе', `${f(M.cageSigma(1) * 1e9, 2)} нКл/м²`], ['Поле на полюсе: E = σ/ε<sub>0</sub>', `${f(M.cageSigma(1) / M.EPS0, 0)} N/C`], ['Поле внутри полости', '0'], ['суммарный заряд оболочки', '0']] },
};
