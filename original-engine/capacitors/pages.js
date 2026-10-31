// Chapter 12, page by page (after the AP Physics C E&M organizer, Unit 4). Text and a chart on
// the left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS as ST } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const pF = c => f(c * 1e12, 1);
const BLUE = '#3d63a8', GREY = '#86868c';

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, under = '' }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}"${s.color ? ` style="stroke:${s.color}"` : ''} d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}"${s.color ? ` style="fill:${s.color}"` : ''}>${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    ${under}<rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(([key, color]) => `<circle class="cursor" r="4.5" data-cursor="${key}"${color ? ` style="fill:${color}"` : ''}/>`).join('')}
  </svg>`;
}
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
const area = (R, pts) => `<path d="M${CH.sx(pts[0][0], R.x0, R.x1)},${CH.sy(0, R.y0, R.y1)}${pts.map(([x, y]) => `L${CH.sx(x, R.x0, R.x1).toFixed(1)},${CH.sy(y, R.y0, R.y1).toFixed(1)}`).join('')}L${CH.sx(pts[pts.length - 1][0], R.x0, R.x1)},${CH.sy(0, R.y0, R.y1)}Z" style="fill:#dfe7f6;stroke:none"/>`;

// chart ranges, shared with the live cursors in main.js
export const R = {
  charge: { x0: 0, x1: 100, y0: 0, y1: 800 },
  gap: { x0: 0, x1: 10, y0: 0, y1: 20 },
  sph: { x0: 0, x1: 25, y0: 0, y1: 2500 },
  cyl: { x0: 0, x1: 10, y0: 0, y1: 5000 },
  fill: { x0: 0, x1: 800, y0: 0, y1: 120 },
  slab: { x0: 0, x1: 1, y0: 0, y1: 2500 },
  energy: { x0: 0, x1: 1, y0: 0, y1: 3.5 },
  probe: { x0: -28, x1: 28, y0: 0, y1: 3500 },
};
const RS = R.sph, RC = R.cyl;
const sphCurve = samples(120, 0, 25, r => M.sphE(r / 100)), cylCurve = samples(200, 0, 10, r => M.cylE(r / 100));
const S = M.SER, PA = M.PAR, u = x => (x * 1e6).toFixed(0);

// a bar chart of the charge on each capacitor, series against parallel
const qBars = (() => {
  const bars = [['C₁', S.Q1, 0], ['C₂', S.Q2, 1], ['C₁', PA.Q1, 3], ['C₂', PA.Q2, 4]], base = 140, top = 24, max = 40e-6, bw = 46, x0 = 70;
  return `<svg class="chart" viewBox="0 0 ${W} ${H + 10}" role="img" aria-label="Charge on each capacitor, series and parallel">
    <line class="zero" x1="${x0 - 20}" x2="${x0 + 5.6 * (bw + 16)}" y1="${base}" y2="${base}"/>
    ${bars.map(([n, q, i]) => { const h = (base - top) * q / max, x = x0 + i * (bw + 16); return `<rect class="bar" x="${x}" y="${base - h}" width="${bw}" height="${h}"/><text class="ax" x="${x + bw / 2}" y="${base - h - 6}" text-anchor="middle">${u(q)} мкКл</text><text class="lab" x="${x + bw / 2}" y="${base + 16}" text-anchor="middle">${n}</text>`; }).join('')}
    <text class="ax" x="${x0 + (bw + 16) - 8}" y="${base + 32}" text-anchor="middle">series: same Q</text>
    <text class="ax" x="${x0 + 3.5 * (bw + 16) + bw / 2}" y="${base + 32}" text-anchor="middle">parallel: Q adds</text>
  </svg>`;
})();

const dielTable = `<table class="data">${[0, 2, 4, 6].map(i => `<tr><td>${M.DIELECTRICS[i][0]}</td><td>${M.DIELECTRICS[i][1]}</td><td>${M.DIELECTRICS[i + 1][0]}</td><td>${M.DIELECTRICS[i + 1][1]}</td></tr>`).join('')}</table>`;
const full = { iso: M.slab(1, false), con: M.slab(1, true) };

const steps = rows => `<table class="data eqs">${rows.map(([e, n]) => `<tr><td>${e}</td><td>${n}</td></tr>`).join('')}</table>`;

export const PAGES = [
  {
    kicker: 'Глава 12', title: 'Конденсаторы', sub: 'разделённые заряды',
    body: `
      <p class="lede"><b>Конденсатор</b> — это два проводника, разделённые промежутком. Батарея переносит заряд с одного проводника на другой, оставляя на них +<i>Q</i> и −<i>Q</i>; между обкладками возникает электрическое поле.</p>
      <p>При увеличении напряжения вдвое заряд также удваивается. Их отношение — <b>электроёмкость</b> — остаётся неизменным:</p>
      <div class="eq"><i>C</i> = <i>Q</i> / Δ<i>V</i></div>
      <p>Измеряется в фарадах (1 Ф = 1 Кл/В) и не бывает отрицательной. Электроёмкость зависит только от <b>геометрии</b> проводников и материала между ними. Размер этих пластин — 20 × 20 см, расстояние между ними — 5 см: <i>C</i> = ${pF(M.C0)} pF.</p>
      <div class="charts">${chart({ ...R.charge, xlabel: 'ΔV (В)', ylabel: 'Q (пКл)', cursors: [['charge']], label: 'Зависимость заряда от напряжения: наклон прямой равен C',
        series: [{ pts: [[0, 0], [100, M.Q0 * 1e12]], tag: [58, M.C0 * 58e12 - 190, `наклон = C = ${pF(M.C0)} пФ`] }] })}</div>
      <p class="hintline">Одна силовая линия на пару зарядов ±. Нажмите на пластины. Изображение выполнено в масштабе.</p>`,
    cam: { target: [ST.plates, 1.4, 0], az: 24, el: 16, dist: 10.5 }, lit: 'plates', scene: 'plates', look: {},
    fig: 'Изменение напряжения батареи',
  },
  {
    kicker: '12.1', title: 'Плоский конденсатор', sub: 'закон Гаусса, затем ΔV и C',
    body: `
      <p class="lede">Всегда три шага: находим <i>E</i> по закону Гаусса, Δ<i>V</i> — интегрированием, затем <i>C</i> = <i>Q</i>/Δ<i>V</i>.</p>
      ${steps([
        ['<i>EA</i> = σ<i>A</i>/ε<sub>0</sub>', undefined],
        ['<i>E</i> = σ/ε<sub>0</sub> = <i>Q</i>/ε<sub>0</sub><i>A</i>', undefined],
        ['Δ<i>V</i> = −∫<sub><i>d</i></sub><sup>0</sup> <i>E ds</i> = <i>Ed</i>', 'E постоянно'],
        ['<i>C</i> = <i>Q</i>/Δ<i>V</i> = <b>ε<sub>0</sub><i>A</i>/<i>d</i></b>', 'Q сокращается'],
      ])}
      <p>При изменении расстояния заряд <i>Q</i> остаётся постоянным: <i>E</i> сохраняется равным ${f(M.E0, 0)} В/м, Δ<i>V</i> = <i>Ed</i> увеличивается, а <i>C</i> уменьшается обратно пропорционально <i>d</i>.</p>
      <div class="charts">${chart({ ...R.gap, xlabel: 'зазор d (см)', ylabel: 'C (пФ)', cursors: [['gap']], label: 'Зависимость электроёмкости от расстояния между пластинами',
        series: [{ pts: samples(80, 1.8, 10, d => M.cPlate(M.PLATE.A, d / 100) * 1e12) }] })}</div>
      <p class="hintline">Нажмите на гауссов цилиндр, чтобы извлечь его.</p>`,
    cam: { target: [ST.pillbox, 1.45, 0], az: 24, el: 15, dist: 11 }, lit: 'pillbox', scene: 'gap', look: {},
    fig: 'Постоянный заряд, изменяющийся зазор',
  },
  {
    kicker: '12.2', title: 'Две сферы', sub: 'шар внутри сферической оболочки',
    body: `
      <p class="lede">Внутренний шар (<i>a</i> = ${M.SPH.a * 100} cm, +<i>Q</i>) находится внутри оболочки (<i>b</i> = ${M.SPH.b * 100} cm, −<i>Q</i>), cut in half.</p>
      ${steps([
        ['<i>E</i>·4π<i>r</i><sup>2</sup> = <i>Q</i>/ε<sub>0</sub>', 'закон Гаусса, a < r < b'],
        ['Δ<i>V</i> = −∫<sub><i>b</i></sub><sup><i>a</i></sup> <i>Q dr</i>/4πε<sub>0</sub><i>r</i><sup>2</sup>', 'E·ds = E dr'],
        ['&nbsp;&nbsp;&nbsp;&nbsp;= <i>Q</i>(<i>b</i> − <i>a</i>)/4πε<sub>0</sub><i>ab</i>', ''],
        ['<i>C</i> = <b>4πε<sub>0</sub><i>ab</i>/(<i>b</i> − <i>a</i>)</b>', `${pF(M.SPH.C)} pF`],
      ])}
      <p>При <i>b</i> → ∞ получаем <i>C</i> → 4πε<sub>0</sub><i>a</i> — электроёмкость одиночной сферы. Заштрихованная область соответствует Δ<i>V</i> = ${M.V0} В.</p>
      <div class="charts">${chart({ ...RS, xlabel: 'r (см)', ylabel: 'E (В/м)', cursors: [['sph']], label: 'Напряжённость в зависимости от радиуса; вне зазора поле равно нулю', under: area(RS, sphCurve.filter(([r]) => r >= 10 && r <= 20)), series: [{ pts: sphCurve }] })}</div>
      <p class="hintline">Нажмите, чтобы раскрыть оболочку. Масштаб стрелок: 2 см на кВ/м.</p>`,
    cam: { target: [ST.sphere, 2.2, 0], az: 14, el: 12, dist: 17 }, lit: 'sphere', scene: 'sphere', look: {},
    fig: 'E ∝ 1/r² между оболочками',
  },
  {
    kicker: '12.3', title: 'Два цилиндра', sub: 'стержень внутри трубки',
    body: `
      <p class="lede">Стержень радиусом (<i>a</i> = ${M.CYL.a * 100} см) расположен внутри трубки радиусом (<i>b</i> = ${M.CYL.b * 100} см). Длина <i>L</i> = ${M.CYL.L * 100} см. Это модель короткого коаксиального кабеля.</p>
      ${steps([
        ['<i>E</i>·2π<i>rL</i> = <i>Q</i>/ε<sub>0</sub>', 'закон Гаусса, только боковая поверхность'],
        ['Δ<i>V</i> = −∫<sub><i>b</i></sub><sup><i>a</i></sup> <i>Q dr</i>/2πε<sub>0</sub><i>rL</i>', 'E·ds = E dr'],
        ['&nbsp;&nbsp;&nbsp;&nbsp;= (<i>Q</i>/2πε<sub>0</sub><i>L</i>) ln(<i>b</i>/<i>a</i>)', '∫dr/r = ln r'],
        ['<i>C</i> = <b>2πε<sub>0</sub><i>L</i>/ln(<i>b</i>/<i>a</i>)</b>', `${pF(M.CYL.C)} pF`],
      ])}
      <p><i>E</i> ∝ 1/<i>r</i> — поле убывает медленнее, чем 1/<i>r</i><sup>2</sup>, поэтому в формуле появляется логарифм. Ёмкость пропорциональна длине: ${f(M.CYL.C / M.CYL.L * 1e12, 0)} пФ на метр.</p>
      <div class="charts">${chart({ ...RC, xlabel: 'r (см)', ylabel: 'E (В/м)', cursors: [['cyl']], label: 'Напряжённость в зависимости от радиуса коаксиальной системы', under: area(RC, cylCurve.filter(([r]) => r >= 2 && r <= 8)), series: [{ pts: cylCurve }] })}</div>
      <p class="hintline">Нажмите, чтобы сдвинуть трубку. Масштаб стрелок: 1 см на кВ/м.</p>`,
    cam: { target: [ST.coax, 1.5, 0], az: 16, el: 14, dist: 14 }, lit: 'coax', scene: 'coax', look: {},
    fig: 'E ∝ 1/r внутри трубки',
  },
  {
    kicker: '12.4', title: 'Запасённая энергия', sub: 'работа по зарядке конденсатора',
    body: `
      <p class="lede">Каждый элемент заряда <i>dq</i> переносится от − к + против уже существующего поля, при разности потенциалов Δ<i>V</i> = <i>q</i>/<i>C</i>. Для первых порций требуется почти нулевая работа, для последних — полное напряжение ${M.V0} В.</p>
      <div class="eq"><i>U</i> = ∫<sub>0</sub><sup><i>Q</i></sup> <i>q</i>/<i>C</i> <i>dq</i> = <i>Q</i><sup>2</sup>/2<i>C</i></div>
      <p>= ½<i>Q</i>Δ<i>V</i> = ½<i>C</i>Δ<i>V</i><sup>2</sup>: площадь треугольника под графиком равна ${f(M.U0 * 1e9, 1)} нДж. Энергия хранится в электрическом поле с <b>объёмной плотностью энергии</b> (Дж/м³).</p>
      <div class="eq"><i>u</i> = ½ε<sub>0</sub><i>E</i><sup>2</sup></div>
      <div class="charts">${chart({ ...R.fill, xlabel: 'перенесённый заряд q (пКл)', ylabel: 'ΔV (В)', cursors: [['fill']], label: 'Напряжение в зависимости от перенесённого заряда; площадь под графиком — запасённая энергия',
        under: `<path data-area="fill" style="fill:#dfe7f6"/>`, series: [{ pts: [[0, 0], [800, 800e-12 / M.C0]] }] })}</div>
      <p class="live" id="filllive"></p>
      <p class="hintline">Синяя заливка в зазоре темнеет с ростом u. Нажмите на пластины.</p>`,
    cam: { target: [ST.energy + 0.4, 1.45, 0], az: 24, el: 14, dist: 12 }, lit: 'energy', scene: 'energy', look: {},
    fig: 'Постепенная зарядка конденсатора',
  },
  {
    kicker: '12.5', title: 'Последовательное и параллельное соединения', sub: 'одинаковый Q или одинаковое ΔV',
    body: `
      <p class="lede">${M.CIRC.C1 * 1e6} мкФ and ${M.CIRC.C2 * 1e6} µF on ${M.CIRC.V} V. Plate area is drawn ∝ <i>C</i>; one mark is 2 µC.</p>
      <table class="data cols">
        <tr><th>последовательно</th><th>параллельно</th></tr>
        <tr><td>одинаковый <i>Q</i> на каждом</td><td>одинаковое Δ<i>V</i> на каждом</td></tr>
        <tr><td>Δ<i>V</i> = Δ<i>V</i><sub>1</sub> + Δ<i>V</i><sub>2</sub></td><td><i>Q</i> = <i>Q</i><sub>1</sub> + <i>Q</i><sub>2</sub></td></tr>
        <tr><td>1/<i>C</i><sub>eq</sub> = 1/<i>C</i><sub>1</sub> + 1/<i>C</i><sub>2</sub></td><td><i>C</i><sub>eq</sub> = <i>C</i><sub>1</sub> + <i>C</i><sub>2</sub></td></tr>
        <tr><td>${f(S.C * 1e6)} µF: ${f(S.V1, 0)} V + ${f(S.V2, 0)} V</td><td>${f(PA.C * 1e6, 0)} µF: ${u(PA.Q1)} + ${u(PA.Q2)} µC</td></tr>
      </table>
      <p>При последовательном соединении провод между конденсаторами образует нейтральный участок: заряд +<i>Q</i> на одном конце означает −<i>Q</i> на другом. На меньшем конденсаторе приходится большая часть напряжения; при параллельном соединении больший конденсатор накапливает больше заряда.</p>
      <div class="charts">${qBars}</div>
      <p class="hintline">Нажмите на схему, чтобы увидеть заряды и напряжения.</p>`,
    cam: { target: [ST.circuits, 1.6, 0], az: 16, el: 9, dist: 19 }, lit: 'series', scene: 'circuits', look: {},
    fig: '2 мкФ и 4 мкФ при напряжении 9 В',
  },
  {
    kicker: '12.6', title: 'Диэлектрики', sub: 'изолятор между обкладками',
    body: `
      <p class="lede">Диэлектрик между обкладками <b>поляризуется</b>: на каждый молекулярный диполь действует момент сил τ = <i>p</i>×<i>E</i> = <i>pE</i> sin θ, поворачивающий его в положение с минимальной энергией <i>U</i> = −<i>p</i>·<i>E</i>.</p>
      <p>На поверхностях диэлектрика возникают <b>связанные заряды</b>; созданное ими поле <i>E</i><sub>ind</sub> направлено против поля пластин:</p>
      <div class="eq"><i>E</i> = <i>E</i><sub>0</sub> − <i>E</i><sub>ind</sub> = <i>E</i><sub>0</sub>/κ</div>
      <p>При постоянном <i>Q</i> напряжение Δ<i>V</i> уменьшается в κ раз, а электроёмкость <i>C</i> = κε<sub>0</sub><i>A</i>/<i>d</i> возрастает в κ раз (κ ≥ 1).</p>
      ${dielTable}
      <div class="charts">${chart({ ...R.slab, xlabel: 'заполненная доля зазора', ylabel: 'E (В/м)', cursors: [['slab']], label: 'Напряжённость в зависимости от глубины введения диэлектрика',
        series: [{ pts: samples(60, 0, 1, x => M.slab(x, false).E) }], marks: [[1, full.iso.E, `E₀/κ`, -46, -8]] })}</div>`,
    cam: { target: [ST.slab, 1.85, 0], az: 26, el: 13, dist: 11.5 }, lit: 'slab', scene: 'slab', look: {},
    fig: 'Диэлектрик с κ = 3, конденсатор отключён от батареи',
  },
  {
    kicker: '12.7', title: 'Подключён или отключён', sub: 'какую величину фиксирует батарея',
    body: `
      <p class="lede">Когда диэлектрик введён частично, он и воздух рядом с ним образуют два параллельно соединённых конденсатора: <i>C</i> = <i>C</i><sub>0</sub>(1 + (κ − 1)<i>x</i>). При половинном заполнении <i>C</i> = <i>C</i><sub>0</sub>/2 · (1 + κ).</p>
      <table class="data">
        <tr><th>диэлектрик введён полностью</th><th>подключён</th><th>отключён</th></tr>
        <tr><td>постоянная величина</td><td>Δ<i>V</i> = ${M.V0} V</td><td><i>Q</i> = ${f(M.Q0 * 1e12, 0)} pC</td></tr>
        <tr><td><i>Q</i></td><td>κ<i>Q</i><sub>0</sub> = ${f(full.con.Q * 1e12, 0)} pC</td><td><i>Q</i><sub>0</sub></td></tr>
        <tr><td>Δ<i>V</i>, <i>E</i></td><td>без изменений</td><td>÷ κ (${f(full.iso.V, 1)} V)</td></tr>
        <tr><td><i>U</i></td><td>× κ (${f(full.con.U * 1e9, 1)} нДж)</td><td>÷ κ (${f(full.iso.U * 1e9, 1)} нДж)</td></tr>
      </table>
      <p>При подключённой батарее на обкладки поступает дополнительный заряд в той области, куда входит диэлектрик. Батарея совершает работу Δ<i>V</i>·Δ<i>Q</i>, вдвое превышающую прирост запасённой энергии. В обоих случаях пластины втягивают диэлектрик внутрь.</p>
      <div class="charts">${chart({ ...R.energy, xlabel: 'заполненная доля зазора', ylabel: 'U / U₀', cursors: [['enA'], ['enB', GREY]], label: 'Запасённая энергия в зависимости от глубины введения диэлектрика: батарея подключена и отключена',
        series: [{ pts: samples(60, 0, 1, x => M.slab(x, true).U / M.U0), tag: [0.3, 1.75, 'подключён'] }, { pts: samples(60, 0, 1, x => M.slab(x, false).U / M.U0), color: GREY, tag: [0.6, 0.55, 'отключён'] }] })}</div>
      <p class="hintline">Нажмите на любой из конденсаторов.</p>`,
    cam: { target: [ST.compare, 1.75, 0], az: 24, el: 11, dist: 16.5 }, lit: 'battery', scene: 'compare', look: {},
    fig: 'Батарея подключена (слева) и отключена (справа)',
  },
  {
    kicker: '12.8', title: 'Проводники', sub: 'электростатическое равновесие',
    body: `
      <p class="lede">Нейтральная металлическая сфера находится в поле ${M.COND.E0} В/м. Свободные электроны перемещаются так, что созданное ими поле внутри металла компенсирует внешнее. В результате:</p>
      <ul class="rules">
        <li>внутри металла <i>E</i> = 0;</li>
        <li>избыточный заряд находится на поверхности;</li>
        <li>непосредственно снаружи поле <i>E</i> перпендикулярно поверхности и <i>E</i> = σ/ε<sub>0</sub>;</li>
        <li>весь проводник имеет одинаковый потенциал.</li>
      </ul>
      <p>Здесь σ = 3ε<sub>0</sub><i>E</i><sub>0</sub> cos θ; полный заряд сферы равен нулю, а на полюсах <i>E</i> = 3<i>E</i><sub>0</sub>. Металлическая пластина толщиной <i>t</i>, помещённая в конденсатор, оставляет два последовательно соединённых зазора: <i>C</i> = ε<sub>0</sub><i>A</i>/(<i>d</i> − <i>t</i>).</p>
      <div class="charts">${chart({ ...R.probe, xlabel: 'координата вдоль оси (см)', ylabel: 'E (В/м)', cursors: [['probe']], label: 'Напряжённость вдоль оси сферы',
        series: [{ pts: samples(160, -28, -10.0001, x => M.condAxisE(x / 100)) }, { pts: [[-10, 0], [10, 0]] }, { pts: samples(160, 10.0001, 28, x => M.condAxisE(x / 100)) }] })}</div>
      <p class="hintline">Нажмите на сферу, чтобы сделать разрез. Силовые линии построены по физической модели.</p>`,
    cam: { target: [ST.conductor, 1.8, 0], az: 40, el: 10, dist: 19 }, lit: 'conductor', scene: 'conductor', look: {},
    fig: 'Нейтральная металлическая сфера во внешнем поле',
  },
];

// ---------- click a scene: what it breaks into ----------
const sph = r => [['Гауссов радиус r', `${f(r * 100, 1)} cm`], ['E(r) = Q/4πε₀r²', `${f(M.sphE(r), 0)} V/m`], ['flux E·4πr²', `${f(M.sphE(r) * 4 * Math.PI * r * r, 1)} V·m`], ['Q/ε₀', `${f(M.SPH.Q / M.EPS0, 1)} V·m`]];
export const PLATES = {
  plates: { text: `Каждая пластина создаёт поле σ/2ε₀, направленное от положительной пластины и к отрицательной (серые стрелки). Между пластинами поля сонаправлены и складываются до σ/ε₀. Снаружи они направлены противоположно и компенсируют друг друга. Поэтому поле сосредоточено в зазоре.`,
    facts: s => { const r = M.charging(s.charge.t); return [['ΔV', `${f(r.V, 1)} В`], ['Q = CΔV', `${f(r.Q * 1e12, 0)} пКл`], ['каждая пластина σ/2ε₀', `${f(r.E / 2, 0)} В/м`], ['между пластинами: сумма', `${f(r.E, 0)} В/м`], ['снаружи: разность', '0 В/м']]; } },
  pillbox: { text: `Цилиндрическая гауссова поверхность пересекает положительную пластину. На её внешнем основании поле равно нулю, а боковая поверхность параллельна полю. Поэтому поток проходит только через основание внутри зазора: E·A. Внутри поверхности заключён заряд σA. По закону Гаусса: EA = σA/ε₀.`,
    facts: s => { const r = M.gapScene(s.gap.t), A = M.PILLBOX.A; return [['площадь поверхности A', `${f(A * 1e4, 1)} см²`], ['поток E·A', `${f(r.E * A, 3)} В·м`], ['q_внутр/ε₀', `${f(M.Q0 / M.PLATE.A * A / M.EPS0, 3)} В·м`], ['зазор d', `${f(r.d * 100, 1)} см`], ['ΔV = Ed', `${f(r.V, 0)} В`], ['C = ε₀A/d', `${pF(r.C)} пФ`]]; } },
  sphere: { text: `После раскрытия оболочки видны внутренний шар и гауссова сфера между проводниками. При любом её радиусе поток остаётся равным Q/ε₀, поэтому напряжённость E убывает как 1/r².`,
    facts: s => sph(M.gaussR(s.sweep.t, M.SPH.a, M.SPH.b)) },
  coax: { text: `После сдвига трубки видны стержень и гауссов цилиндр. Поток проходит только через боковую поверхность площадью 2πrL, поэтому E = Q/2πε₀rL и убывает как 1/r.`,
    facts: s => { const r = M.gaussR(s.sweep.t, M.CYL.a, M.CYL.b); return [['гауссов радиус r', `${f(r * 100, 1)} см`], ['E(r)', `${f(M.cylE(r), 0)} В/м`], ['поток E·2πrL', `${f(M.cylE(r) * 2 * Math.PI * r * M.CYL.L, 1)} В·м`], ['Q/ε₀', `${f(M.CYL.Q / M.EPS0, 1)} В·м`], ['C', `${pF(M.CYL.C)} пФ`]]; } },
  energy: { text: `Энергия распределена по объёму зазора A × d с плотностью u = ½ε₀E². Умножив плотность на объём, получим ½CΔV².`,
    facts: s => { const r = M.filling(s.fill.t), vol = M.PLATE.A * M.PLATE.d; return [['E', `${f(r.E, 0)} В/м`], ['u = ½ε₀E²', `${f(r.u * 1e6, 2)} мкДж/м³`], ['объём Ad', `${f(vol * 1e6, 0)} см³`], ['u·Ad', `${f(r.u * vol * 1e9, 2)} нДж`], ['Q²/2C', `${f(r.U * 1e9, 2)} нДж`]]; } },
  series: { text: `Батарея перемещает по цепи заряд ${u(S.Q)} мкКл. Две внутренние обкладки и соединяющий их провод образуют нейтральный узел: на одной стороне −${u(S.Q)} мкКл, на другой +${u(S.Q)} мкКл. Напряжение на каждом конденсаторе равно Q/C, а их сумма составляет ${M.CIRC.V} В.`,
    facts: () => [['C_экв', `${f(S.C * 1e6)} мкФ`], ['Q на каждом', `${u(S.Q)} мкКл`], ['ΔV₁ = Q/C₁', `${f(S.V1, 1)} В`], ['ΔV₂ = Q/C₂', `${f(S.V2, 1)} В`], ['энергия ½C_эквV²', `${f(S.U * 1e6, 0)} мкДж`]] },
  parallel: { text: `Оба конденсатора подключены непосредственно к батарее, поэтому напряжение на каждом равно ${M.CIRC.V} В. Заряд каждого определяется формулой Q = CΔV, а батарея обеспечивает суммарный заряд.`,
    facts: () => [['C_экв', `${f(PA.C * 1e6, 0)} мкФ`], ['ΔV на каждом', `${M.CIRC.V} В`], ['Q₁ = C₁ΔV', `${u(PA.Q1)} мкКл`], ['Q₂ = C₂ΔV', `${u(PA.Q2)} мкКл`], ['энергия ½C_эквV²', `${f(PA.U * 1e6, 0)} мкДж`]] },
  slab: { text: `Внутри диэлектрика: свободные заряды пластин создавали бы поле E₀ (серая стрелка справа). Связанные заряды на поверхностях диэлектрика создают поле Eинд (серая стрелка слева). Их сумма даёт результирующее поле E (синее). Оно одинаково в диэлектрике и в соседнем воздушном зазоре, поскольку оба участка имеют одну и ту же разность потенциалов ΔV.`,
    facts: s => { const x = M.fillOf(s.slide.t), r = M.slab(x, false); return [['диэлектрик введён', `${f(x * 100, 0)} %`], ['E₀ = σ_своб/ε₀ (вклад пластин)', `${f(r.Efree, 0)} В/м`], ['E_ind = σ_связ/ε₀', `${f(r.Eind, 0)} В/м`], ['E = E₀ − E_ind', `${f(r.E, 0)} В/м`], ['ΔV', `${f(r.V, 1)} В`], ['C', `${pF(r.C)} пФ`]]; } },
  battery: { text: `Батарея поддерживает постоянное напряжение ΔV = ${M.V0} В, поэтому E = ΔV/d не меняется. По мере введения диэлектрика на обращённые к нему обкладки поступает заряд, пока его количество не увеличится в κ раз.`,
    facts: s => { const r = M.slab(M.fillOf(s.slide.t), true); return [['C', `${pF(r.C)} пФ`], ['Q', `${f(r.Q * 1e12, 0)} пКл`], ['ΔV', `${f(r.V, 1)} В`], ['E', `${f(r.E, 0)} В/м`], ['U', `${f(r.U * 1e9, 1)} нДж`]]; } },
  isolated: { text: `Заряд не может поступать на обкладки или уходить с них, поэтому Q остаётся постоянным. Заряды перераспределяются ближе к диэлектрику, напряжённость поля во всём зазоре уменьшается, а вместе с ней уменьшается и ΔV.`,
    facts: s => { const r = M.slab(M.fillOf(s.slide.t), false); return [['C', `${pF(r.C)} пФ`], ['Q', `${f(r.Q * 1e12, 0)} пКл`], ['ΔV', `${f(r.V, 1)} В`], ['E', `${f(r.E, 0)} В/м`], ['U', `${f(r.U * 1e9, 1)} нДж`]]; } },
  conductor: { text: `В разрезе видно: внутри проводника нет избыточного заряда и электрического поля — заряд находится на поверхности. Для гауссовой поверхности, целиком расположенной в металле, E = 0, следовательно, заключённый заряд равен нулю. То же верно для полой оболочки: поэтому металлический корпус экранирует внутреннее пространство.`,
    facts: s => { const x = M.probeX(s.clock); return [['положение пробного заряда', `${f(x * 100, 1)} см`], ['E в этой точке', `${f(M.condAxisE(x), 0)} В/м`], ['E внутри', '0 В/м'], ['σ на полюсах', `±${f(M.condSigma(0) * 1e9, 1)} нКл/м²`], ['E на полюсах = σ/ε₀', `${f(M.condSigma(0) / M.EPS0, 0)} В/м`]]; } },
};
