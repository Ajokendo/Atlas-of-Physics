// Chapter 15, page by page (after the AP Physics C E&M organizer, Unit 8). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS as ST } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const GREY = '#86868c';

// ---------- small SVG charts for the left page: two quantities, one axis each side ----------
const W = 420, HH = 160, P = { l: 44, r: 44, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (HH - P.t - P.b) };
function chart({ L, Rt, series, xlabel, ylabel, rlabel, marks = [], cursors = [], label, under = '' }) {
  const { x0, x1 } = L, sx = x => CH.sx(x, x0, x1), sy = (y, a = L) => CH.sy(y, a.y0, a.y1);
  const paths = series.map(s => { const a = s.r ? Rt : L, c = s.r ? GREY : null;
    return `<path class="curve"${c ? ` style="stroke:${c}"` : ''} d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y, a).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1], a) - 6}"${c ? ` style="fill:${c}"` : ''}>${s.tag[2]}</text>` : ''); }).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const zero = L.y0 < 0 ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  return `<svg class="chart" viewBox="0 0 ${W} ${HH}" role="img" aria-label="${label}">
    ${under}<rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${HH - P.t - P.b}"/>${zero}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(L.y1) + 4}" text-anchor="end">${L.y1}</text><text class="ax" x="${P.l - 6}" y="${sy(L.y0) + 4}" text-anchor="end">${L.y0}</text>
    <text class="ax" x="${W - P.r + 6}" y="${sy(Rt.y1, Rt) + 4}" style="fill:${GREY}">${Rt.y1}</text><text class="ax" x="${W - P.r + 6}" y="${sy(Rt.y0, Rt) + 4}" style="fill:${GREY}">${Rt.y0}</text>
    <text class="ax" x="${P.l}" y="${HH - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${HH - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="lab" x="${W - P.r - 6}" y="${P.t + 13}" text-anchor="end" style="fill:${GREY}">${rlabel}</text>
    <text class="ax" x="${(P.l + W - P.r) / 2}" y="${HH - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(([key, r]) => `<circle class="cursor" r="4.5" data-cursor="${key}"${r ? ` style="fill:${GREY}"` : ''}/>`).join('')}
  </svg>`;
}
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// chart ranges (left and right axes), shared with the live cursors in main.js
export const R = {
  phi0: { x0: 0, x1: 6, y0: -40, y1: 40 }, emf0: { x0: 0, x1: 6, y0: -45, y1: 45 },
  i1: { x0: 0, x1: 6, y0: -2, y1: 2 }, emf2: { x0: 0, x1: 6, y0: -0.3, y1: 0.3 },
  phiW: { x0: 0, x1: 3, y0: 0, y1: 1.5 }, emfW: { x0: 0, x1: 3, y0: 0, y1: 2 },
  phiX: { x0: 0, x1: 2, y0: -40, y1: 40 }, emfX: { x0: 0, x1: 2, y0: -60, y1: 60 },
  v: { x0: 0, x1: 5, y0: 0, y1: 1 }, pw: { x0: 0, x1: 5, y0: 0, y1: 0.2 },
  iS: { x0: 0, x1: 4, y0: -2, y1: 2 }, eS: { x0: 0, x1: 4, y0: -6, y1: 6 },
  iRL: { x0: 0, x1: 8, y0: -3, y1: 3 }, vRL: { x0: 0, x1: 8, y0: -12, y1: 12 },
  qLC: { x0: 0, x1: +(2 * M.LC.T * 1e3).toFixed(2), y0: -100, y1: 100 }, iLC: { x0: 0, x1: +(2 * M.LC.T * 1e3).toFixed(2), y0: -100, y1: 100 },
};
// live energy bars (the LC circuit): heights set in main.js, full height = the total Q²/2C
export const BARS = { x: 90, w: 56, gap: 50, base: 112, top: 16 };
const barChart = (key, items, top) => `<svg class="chart" viewBox="0 0 ${W} ${BARS.base + 26}" role="img" aria-label="Динамическая столбчатая диаграмма энергии">
  <line class="zero" x1="${BARS.x - 20}" x2="${BARS.x + items.length * (BARS.w + BARS.gap) - BARS.gap + 20}" y1="${BARS.base}" y2="${BARS.base}"/>
  <line class="grid" x1="${BARS.x - 20}" x2="${BARS.x + items.length * (BARS.w + BARS.gap) - BARS.gap + 20}" y1="${BARS.top}" y2="${BARS.top}" style="stroke:#d4d4d0;stroke-dasharray:3 3"/>
  <text class="ax" x="${BARS.x - 26}" y="${BARS.top + 4}" text-anchor="end">${top}</text><text class="ax" x="${BARS.x - 26}" y="${BARS.base + 4}" text-anchor="end">0</text>
  ${items.map(([k, name, color], i) => `<rect data-bar="${key}-${k}" x="${BARS.x + i * (BARS.w + BARS.gap)}" width="${BARS.w}" y="${BARS.base}" height="0" style="fill:${color};stroke:#6c6c72;stroke-width:.8"/>
    <text class="lab" x="${BARS.x + i * (BARS.w + BARS.gap) + BARS.w / 2}" y="${BARS.base + 18}" text-anchor="middle">${name}</text>
    <text class="ax" data-val="${key}-${k}" x="${BARS.x + i * (BARS.w + BARS.gap) + BARS.w / 2}" y="${BARS.base - 6}" text-anchor="middle"></text>`).join('')}
</svg>`;
const sq = k => `one grid square = ${k}`;
const two = (l, r, o) => `<div class="charts">${chart({ L: R[l], Rt: R[r], cursors: [[l], [r, 1]], ...o })}</div>`;

// Lenz's four cases, from the model at mid-run
const lenzRows = M.CASES.map(c => {
  const r = M.lenzCase(c, M.LENZ.run * 0.6), Bdir = r.Bx < 0 ? '←' : '→', grows = c.move === 'in';
  return `<tr><td>${c.name}</td><td>${Bdir} ${grows ? 'growing' : 'shrinking'}</td><td>${f(r.emf * 1e6, 1)} µV</td><td>${r.emf > 0 ? '←' : '→'}</td></tr>`;
}).join('');
const steps = rows => `<table class="data eqs">${rows.map(([e, n]) => `<tr><td>${e}</td><td>${n}</td></tr>`).join('')}</table>`;

export const PAGES = [
  {
    kicker: 'Глава 15', title: 'Электромагнитная индукция', sub: 'изменение магнитного потока создаёт ЭДС',
    body: `
      <p class="lede">Электрический ток создаёт магнитное поле. Фарадей открыл и обратное явление: <b>изменяющийся</b> магнитный поток через контур вызывает в нём электрический ток.</p>
      <div class="eq">Φ<sub><i>B</i></sub> = ∫<i>B</i>·<i>dA</i> &nbsp;&nbsp; ε = −<i>d</i>Φ<sub><i>B</i></sub>/<i>dt</i></div>
      <p>Магнитный поток — это интеграл магнитного поля по поверхности, натянутой на контур; измеряется в веберах (Тл·м²). Для катушки с <i>N</i> витками ε = −<i>N d</i>Φ/<i>dt</i>. ЭДС равна циркуляции ∮<i>E</i>·<i>ds</i> <b>индуцированного электрического поля</b>, линии которого замкнуты; такое поле не является потенциальным. Здесь магнит приближается к контуру и удаляется от него, а ЭДС равна отрицательному наклону графика Φ.</p>
      ${two('phi0', 'emf0', { xlabel: 't (с)', ylabel: 'Φ (мкВб)', rlabel: 'ε (мкВ)', label: 'Магнитный поток через контур и ЭДС в зависимости от времени',
        series: [{ pts: samples(160, 0, 6, t => M.fluxScene(t).Phi * 1e6) }, { r: 1, pts: samples(160, 0, 6, t => M.fluxScene(t).emf * 1e6) }] })}
      <p class="hintline">Нажмите на контур, чтобы рассмотреть поток B·dA по отдельным участкам. 1 м = 10 клеток; ${sq('5 mA')}.</p>`,
    cam: { target: [ST.flux + 1.0, 1.7, 0], az: 30, el: 12, dist: 13 }, lit: 'flux', scene: 'flux', look: {},
    fig: 'Магнит входит в контур и выходит из него',
  },
  {
    kicker: '15.1', title: 'Правило Ленца', sub: 'индуцированный ток противодействует изменению',
    body: `
      <p class="lede">Знак минус означает, что индукционный ток создаёт поле <i>B</i><sub>ind</sub>, которое <b>противодействует изменению</b> магнитного потока, а не самому потоку.</p>
      <table class="data"><tr><th>случай</th><th>B у контура</th><th>ε</th><th>B<sub>ind</sub></th></tr>${lenzRows}</table>
      <ul class="rules">
        <li>поток увеличивается: <i>B</i><sub>ind</sub> направлено против <i>B</i>;</li>
        <li>поток уменьшается: <i>B</i><sub>ind</sub> направлено вдоль <i>B</i>;</li>
        <li>правило правой руки определяет направление тока <i>I</i>, создающего <i>B</i><sub>ind</sub>.</li>
      </ul>
      <p>Это проявление закона сохранения энергии: контур отталкивает приближающийся полюс и притягивает удаляющийся, поэтому для поддержания движения нужно совершать работу. В сплошном металле аналогичное торможение создаёт <b>вихревые токи</b>, нагревающие материал. Вектор площади направлен влево: Φ > 0, когда <i>B</i> направлено влево.</p>
      <p class="hintline">Нажмите на контур, чтобы увидеть его собственное поле (пунктир). <i>I</i> и пунктирные стрелки показывают только направление; ${sq('10 mT')}.</p>`,
    cam: { target: [ST.lenz - 0.35, 2.1, 0], az: 26, el: 8, dist: 21 }, lit: 'nIn', scene: 'lenz', look: {},
    fig: 'Полюс N или S приближается или удаляется',
  },
  {
    kicker: '15.2', title: 'Взаимная индукция', sub: 'изменение одного тока создаёт ЭДС в другой катушке',
    body: `
      <p class="lede">Изменение тока в катушке 1 изменяет магнитное поле, пронизывающее катушку 2. Магнитный поток пропорционален <i>I</i><sub>1</sub>, поэтому</p>
      <div class="eq">ε<sub>2</sub> = −<i>N</i><sub>2</sub><i>d</i>Φ<sub>2</sub>/<i>dt</i> = −<i>M dI</i><sub>1</sub>/<i>dt</i></div>
      <p><b>Взаимная индуктивность</b> <i>M</i> зависит от геометрии катушек: для этих катушек со 100 витками она равна ${f(M.COILS.M * 1e6, 0)} мкГн. <b>Железный сердечник</b> проводит магнитный поток через обе обмотки; магнитная проницаемость μ<sub>r</sub> ≈ ${M.CORE.muR}, поэтому <i>M</i> = ${f(M.CORE.M * 1e3, 0)} мГн. По мере роста <i>I</i>(<i>t</i>) поле <i>B</i>(<i>t</i>) усиливается и направлено влево, а <i>B</i><sub>ind</sub> — вправо.</p>
      ${two('i1', 'emf2', { xlabel: 't (с)', ylabel: 'I₁ (А)', rlabel: 'ε₂ (мВ)', label: 'Ток в катушке 1 и ЭДС в катушке 2 в зависимости от времени',
        series: [{ pts: samples(120, 0, 6, t => M.coilsScene(t).I1) }, { r: 1, pts: samples(120, 0, 6, t => M.coilsScene(t).emf * 1e3) }] })}
      <p class="hintline">Нажмите на любой из контуров. ${sq('4 А')} в катушке 1, 0,5 мА в катушке 2, 0,25 Тл в сердечнике.</p>`,
    cam: { target: [ST.mutual, 1.95, 0], az: 26, el: 10, dist: 13.5 }, lit: 'mutual', scene: 'mutual', look: {},
    fig: 'Две катушки и железный сердечник',
  },
  {
    kicker: '15.3', title: 'Контур рядом с проводом', sub: 'движение в область более слабого поля',
    body: `
      <p class="lede">Контур размером ${M.WIRE.b * 100} × ${M.WIRE.a * 100} см удаляется от провода, по которому течёт ток ${M.WIRE.I} А, со скоростью ${M.WIRE.v * 100} см/с. Поле <i>B</i> = μ<sub>0</sub><i>I</i>/2π<i>r</i> неоднородно, поэтому просуммируем его вклад по узким полосам:</p>
      ${steps([
        ['Φ = ∫<sub><i>r</i></sub><sup><i>r</i>+<i>a</i></sup> (μ<sub>0</sub><i>I</i>/2π<i>s</i>) <i>b ds</i>', 'strips'],
        ['&nbsp;&nbsp;&nbsp;= (μ<sub>0</sub><i>Ib</i>/2π) ln((<i>r</i> + <i>a</i>)/<i>r</i>)', ''],
        ['ε = μ<sub>0</sub><i>Iabv</i> / 2π<i>r</i>(<i>r</i> + <i>a</i>)', '−<i>d</i>Φ/<i>dt</i>'],
      ])}
      <p>Под проводом поле <i>B</i> направлено в плоскость страницы и ослабевает. Поэтому индуцированный ток течёт по часовой стрелке, создавая поле в плоскость страницы.</p>
      ${two('phiW', 'emfW', { xlabel: 't (с)', ylabel: 'Φ (мкВб)', rlabel: 'ε (мкВ)', label: 'Магнитный поток и ЭДС в зависимости от времени',
        series: [{ pts: samples(90, 0, 3, t => M.wireScene(t).Phi * 1e6) }, { r: 1, pts: samples(90, 0, 2.999, t => M.wireScene(t).emf * 1e6) }] })}
      <p class="hintline">Нажмите на контур, чтобы увидеть полосы. ⊗ площадь ∝ <i>B</i>. ${sq('0.4 mA')}.</p>`,
    cam: { target: [ST.wire - 0.3, 2.2, 0], az: 6, el: 6, dist: 17 }, lit: 'wire', scene: 'wire', look: {},
    fig: 'Длинный провод и удаляющийся контур',
  },
  {
    kicker: '15.4', title: 'ЭДС движения', sub: 'проводник движется в магнитном поле',
    body: `
      <p class="lede">Металлический стержень движется со скоростью <i>v</i> в магнитном поле <i>B</i>. Заряды внутри него также движутся и испытывают силу <i>F</i> = <i>qv</i>×<i>B</i>, направленную вдоль стержня.</p>
      <p>Свободные заряды перемещаются, пока на одном конце не накопится положительный, а на другом — отрицательный заряд. Созданное ими поле <i>E</i> противодействует дальнейшему разделению; движение зарядов прекращается, когда</p>
      <div class="eq"><i>qE</i> = <i>qvB</i> &nbsp;→&nbsp; ε = <i>EL</i> = <i>BLv</i></div>
      <table class="data">
        <tr><td><i>B</i>, <i>L</i>, <i>v</i></td><td>${M.BAR.B} Тл, ${M.BAR.L * 100} см, ${M.BAR.v} м/с</td></tr>
        <tr><td><i>E</i> = <i>vB</i></td><td>${f(M.BAR.E, 2)} В/м</td></tr>
        <tr><td>ε = <i>BLv</i></td><td>${f(M.BAR.emf, 2)} В</td></tr>
      </table>
      <p>Цепь не замкнута, поэтому после разделения зарядов <b>ток не течёт</b>. Когда стержень останавливается, заряды снова распределяются равномерно.</p>
      <p class="hintline">Нажмите на стержень, чтобы увидеть две силы, действующие на один заряд. 1 м = 4 клетки; ${sq('0.25 V/m')}.</p>`,
    cam: { target: [ST.bar, 1.75, 0], az: 8, el: 6, dist: 15 }, lit: 'bar', scene: 'bar', look: {},
    fig: 'Стержень движется со скоростью 0,5 м/с в поле 0,4 Тл',
  },
  {
    kicker: '15.5', title: 'Контур пересекает поле', sub: 'вклад дают только стороны на границе поля',
    body: `
      <p class="lede">Контур размером ${M.CROSS.w * 100} × ${M.CROSS.h * 100} см пересекает область магнитного поля шириной ${M.CROSS.W * 100} см с индукцией ${M.CROSS.B} Тл. Скорость движения контура — ${M.CROSS.v} м/с.</p>
      <table class="data">
        <tr><th>этап</th><th>Φ</th><th>ε</th></tr>
        <tr><td>входит</td><td>увеличивается</td><td>−<i>Bhv</i> = −${f(M.CROSS.B * M.CROSS.h * M.CROSS.v * 1e3, 0)} мВ</td></tr>
        <tr><td>полностью внутри</td><td>постоянен <i>Bhw</i></td><td>0</td></tr>
        <tr><td>выходит</td><td>уменьшается</td><td>+${f(M.CROSS.B * M.CROSS.h * M.CROSS.v * 1e3, 0)} мВ</td></tr>
      </table>
      <p>В однородном поле на обе вертикальные стороны действует ЭДС <i>BLv</i>, причём направления соответствующих эффектов противоположны и в полном контуре компенсируются. Ток течёт только тогда, когда одна сторона находится внутри поля, а другая — снаружи: ${f(M.CROSS.B * M.CROSS.h * M.CROSS.v / M.CROSS.R * 1e3, 0)} мА при сопротивлении ${M.CROSS.R} Ом.</p>
      ${two('phiX', 'emfX', { xlabel: 't (с)', ylabel: 'Φ (мВб)', rlabel: 'ε (мВ)', label: 'Магнитный поток и ЭДС в зависимости от времени',
        series: [{ pts: samples(200, 0, 2, t => M.crossScene(t).Phi * 1e3) }, { r: 1, pts: samples(400, 0, 1.999, t => M.crossScene(t).emf * 1e3) }] })}
      <p class="hintline">Нажмите на контур, чтобы увидеть силу, действующую на каждую его сторону. ${sq('0.2 A')}.</p>`,
    cam: { target: [ST.crossing, 1.75, 0], az: 6, el: 6, dist: 15 }, lit: 'crossing', scene: 'crossing', look: {},
    fig: 'Вход в поле, движение внутри и выход',
  },
  {
    kicker: '15.6', title: 'Стержень на рельсах', sub: 'ЭДС движения в замкнутой цепи',
    body: `
      <p class="lede">Рельсы, соединённые резистором, замыкают электрическую цепь. Стержню сообщают начальную скорость ${M.RAIL.v0} м/с, после чего его отпускают.</p>
      ${steps([
        ['Φ = <i>BLx</i>, &nbsp;ε = <i>BLv</i>, &nbsp;<i>I</i> = <i>BLv</i>/<i>R</i>', 'counterclockwise'],
        ['<i>F</i> = <i>ILB</i> = <i>B</i><sup>2</sup><i>L</i><sup>2</sup><i>v</i>/<i>R</i>', 'backward'],
        ['<i>v</i> = <i>v</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup>, &nbsp;τ = <i>mR</i>/<i>B</i><sup>2</sup><i>L</i><sup>2</sup>', `${f(M.RAIL.tau, 1)} s`],
      ])}
      <p>Сила торможения растёт со скоростью, поэтому стержень замедляется экспоненциально и проходит по инерции ещё ${f(M.RAIL.v0 * M.RAIL.tau * 100, 0)} см. Мощность торможения <i>Fv</i> в точности равна <i>I</i><sup>2</sup><i>R</i>: вся кинетическая энергия ${f(0.5 * M.RAIL.m * M.RAIL.v0 ** 2 * 1e3, 0)} мДж превращается в тепло.</p>
      ${two('v', 'pw', { xlabel: 't (с)', ylabel: 'v (м/с)', rlabel: 'P = I²R (Вт)', label: 'Скорость стержня и рассеиваемая мощность в зависимости от времени; заштрихованная площадь — выделившееся тепло',
        under: `<path data-area="pw" style="fill:#e4e4e8"/>`, series: [{ pts: samples(100, 0, 5, t => M.railScene(t).v) }, { r: 1, pts: samples(100, 0, 5, t => M.railScene(t).P) }], marks: [[M.RAIL.tau, M.RAIL.v0 / Math.E, 'v₀/e at τ']] })}
      <p class="live" id="raillive"></p>
      <p class="hintline">Нажмите на электрическую цепь. ${sq('2 A')}, or 0.25 N.</p>`,
    cam: { target: [ST.rails, 1.7, 0], az: 6, el: 7, dist: 15.5 }, lit: 'rails', scene: 'rails', look: {},
    fig: 'Торможение собственным индуцированным током',
  },
  {
    kicker: '15.7', title: 'Индуктивность', sub: 'катушка противодействует изменению собственного тока',
    body: `
      <p class="lede">Ток в катушке создаёт магнитный поток через её собственные витки. При изменении тока меняется и поток, в результате чего возникает <b>ЭДС самоиндукции</b>, препятствующая этому изменению.</p>
      ${steps([
        ['<i>L</i> = <i>N</i>Φ/<i>I</i>, &nbsp;ε<sub><i>L</i></sub> = −<i>L dI</i>/<i>dt</i>', 'henries, H'],
        ['<i>B</i> = μ<sub>0</sub><i>nI</i> → <i>L</i> = μ<sub>0</sub><i>N</i><sup>2</sup><i>A</i>/ℓ', `${f(M.SOL.L * 1e3, 2)} mH`],
        ['<i>U</i> = ½<i>LI</i><sup>2</sup>, &nbsp;<i>u</i> = <i>B</i><sup>2</sup>/2μ<sub>0</sub>', 'stored'],
      ])}
      <p>Катушка содержит ${M.SOL.N} витков, её длина — ${M.SOL.len * 100} см, радиус — ${M.SOL.r * 100} см. Для такой короткой катушки приближение μ<sub>0</sub><i>nI</i> завышает поле на ${f((1 - M.solCentreB(1) / (M.MU0 * M.SOL.n)) * 100, 0)} %. При увеличении тока от 0 до ${M.SOL.Imax} А за ${M.SOL.ramp} с ЭДС самоиндукции ε<sub><i>L</i></sub> = ${f(-M.SOL.L * M.SOL.Imax / M.SOL.ramp * 1e3, 2)} мВ; при постоянном токе она равна нулю. Индуктивность сглаживает резкие изменения тока.</p>
      ${two('iS', 'eS', { xlabel: 't (с)', ylabel: 'I (А)', rlabel: 'ε_L (мВ)', label: 'Ток и ЭДС самоиндукции в зависимости от времени',
        series: [{ pts: samples(200, 0, 4, t => M.solCurrent(t).I) }, { r: 1, pts: samples(400, 0, 3.999, t => M.solScene(t).emfL * 1e3) }] })}
      <p class="hintline">Показаны 25 из 400 витков. Нажмите, чтобы увидеть поток через один виток. ${sq('5 mT')}.</p>`,
    cam: { target: [ST.solenoid, 1.85, 0], az: 22, el: 12, dist: 11.5 }, lit: 'solenoid', scene: 'solenoid', look: {},
    fig: 'Соленоид с нарастающим током',
  },
  {
    kicker: '15.8', title: 'RL-цепи', sub: 'нарастание и спад тока, τ = L/R',
    body: `
      <p class="lede">${M.RL.E} V, ${M.RL.R} Ω, ${M.RL.L} H. Around the loop ε − <i>IR</i> − <i>L dI</i>/<i>dt</i> = 0, so</p>
      <div class="eq"><i>I</i> = (ε/<i>R</i>)(1 − <i>e</i><sup>−<i>t</i>/τ</sup>), &nbsp;τ = <i>L</i>/<i>R</i></div>
      <p>Вначале катушка ведёт себя как <b>разомкнутый выключатель</b>: <i>I</i> = 0, и всё напряжение ${M.RL.E} В приложено к ней. Через некоторое время она становится <b>обычным проводом</b>: <i>I</i> = ε/<i>R</i> = ${f(M.RL.Imax, 0)} А. Если отключить батарею, катушка поддерживает ток <i>I</i><sub>0</sub><i>e</i><sup>−<i>t</i>/τ</sup>, а энергия ½<i>LI</i><sup>2</sup> = ${f(0.5 * M.RL.L * M.RL.Imax ** 2, 0)} Дж превращается в тепло. τ = ${f(M.RL.tau, 1)} с.</p>
      ${two('iRL', 'vRL', { xlabel: 't (с)', ylabel: 'I (А)', rlabel: 'ΔV (В)', label: 'Ток и напряжение на катушке в зависимости от времени: нарастание и спад',
        series: [{ pts: samples(320, 0, 7.999, t => M.rlScene(t).I) }, { r: 1, pts: samples(320, 0, 7.999, t => M.rlScene(t).VL), tag: [4.6, -8.5, 'L dI/dt'] }],
        marks: [[M.RL.tau, M.rlScene(M.RL.tau).I, '63 %'], [M.RL.phase + M.RL.tau, M.rlScene(M.RL.phase + M.RL.tau).I, '37 %']] })}
      <p class="hintline">Чёрная линия: <i>I</i>, а <i>IR</i> показано по правой шкале. Нажмите на цепь, чтобы увидеть каждое ΔV. ${sq('4 A')}.</p>`,
    cam: { target: [ST.rl - 0.15, 1.75, 0], az: 8, el: 8, dist: 14 }, lit: 'rl', scene: 'rl', look: {},
    fig: '12 В, 4 Ом, 2 Гн',
  },
  {
    kicker: '15.9', title: 'Колебания в LC-контуре', sub: 'перетекание заряда через катушку',
    body: `
      <p class="lede">Charge a ${f(M.LC.C * 1e6, 0)} µF capacitor to ${f(M.LC.Q * 1e6, 0)} µC and connect it to a ${f(M.LC.L * 1e3, 0)} mH coil. The charge flows off through the coil, overshoots, charges the plates the other way, and flows back.</p>
      ${steps([
        ['<i>q</i>/<i>C</i> + <i>L dI</i>/<i>dt</i> = 0', 'loop rule'],
        ['<i>L d</i><sup>2</sup><i>q</i>/<i>dt</i><sup>2</sup> + <i>q</i>/<i>C</i> = 0', '<i>I</i> = <i>dq</i>/<i>dt</i>'],
        ['<i>q</i> = <i>Q</i> cos ω<i>t</i>, &nbsp;<i>I</i> = −ω<i>Q</i> sin ω<i>t</i>', `ω = 1/√(<i>LC</i>) = ${f(M.LC.w, 0)} rad/s`],
      ])}
      <p>The period is <i>T</i> = 2π√(<i>LC</i>) = ${f(M.LC.T * 1e3, 2)} ms (${f(M.LC.f, 0)} Hz); the figure runs ${Math.round(M.LC.slow / 10) * 10}× slower. The current peaks, ω<i>Q</i> = ${f(M.LC.Imax * 1e3, 0)} mA, as <i>q</i> passes 0, and is zero when the plates are full: a quarter period apart. The coil’s back emf is what carries the current past <i>q</i> = 0.</p>
      ${two('qLC', 'iLC', { xlabel: 't (мс)', ylabel: 'q (мкКл)', rlabel: 'I (мА)', label: 'Заряд верхней обкладки и ток в зависимости от времени',
        series: [{ pts: samples(200, 0, 2 * M.LC.T * 1e3, t => M.lcScene(t * 1e-3).q * 1e6) }, { r: 1, pts: samples(200, 0, 2 * M.LC.T * 1e3, t => M.lcScene(t * 1e-3).I * 1e3) }],
        marks: [[M.LC.T * 1e3, 100, 'T', 6, 14]] })}
      <div class="eq"><i>q</i><sup>2</sup>/2<i>C</i> + ½<i>LI</i><sup>2</sup> = <i>Q</i><sup>2</sup>/2<i>C</i> = ${f(M.LC.U * 1e3, 2)} mJ</div>
      <div class="charts">${barChart('lc', [['UE', 'U_E = q²/2C', '#8fb0f0'], ['UB', 'U_B = ½LI²', '#c4c4c8'], ['U', 'total', '#f7f7f4']], `${f(M.LC.U * 1e3, 2)} mJ`)}</div>
      <table class="data"><tr><th>mass on a spring</th><th>LC circuit</th></tr>
        <tr><td><i>x</i>, &nbsp;<i>v</i></td><td><i>q</i>, &nbsp;<i>I</i></td></tr>
        <tr><td><i>m</i>, &nbsp;<i>k</i></td><td><i>L</i>, &nbsp;1/<i>C</i></td></tr>
        <tr><td>½<i>kx</i><sup>2</sup>, &nbsp;½<i>mv</i><sup>2</sup></td><td><i>q</i><sup>2</sup>/2<i>C</i>, &nbsp;½<i>LI</i><sup>2</sup></td></tr></table>
      <p class="hintline">Нажмите на пластины или катушку, чтобы увидеть запасённую в них энергию. ${sq('10 kV/m (E), 2 mT (B), 100 mA (I)')}.</p>`,
    cam: { target: [ST.lc + 0.3, 1.8, 0], az: 8, el: 8, dist: 12.5 }, lit: 'lcCap', scene: 'lc', look: {},
    fig: '25 мкФ, 40 мГн, 100 мкКл',
  },
];

// ---------- click a scene: what it breaks into ----------
const lenzPlate = c => ({
  text: c.move === 'in'
    ? `Полюс ${c.pole} приближается, поэтому магнитный поток через контур увеличивается. Возникающий ток создаёт собственное поле (пунктир), направленное противоположно исходному. Ближняя сторона контура становится одноимённым полюсом ${c.pole}, поэтому магнит отталкивается.`
    : `Полюс ${c.pole} удаляется, поэтому магнитный поток через контур уменьшается. Теперь ток создаёт поле (пунктир), направленное так же, как исходное, компенсируя уменьшение потока. Ближняя сторона контура становится разноимённым полюсом ${c.pole === 'N' ? 'S' : 'N'} и притягивает магнит обратно.`,
  facts: s => { const r = M.lenzCase(c, s.lenz.t); return [['расстояние', `${f(r.d * 100, 1)} см`], ['B в центре', `${f(Math.abs(r.Bx) * 1e3, 2)} мТл ${r.Bx < 0 ? '←' : '→'}`], ['Φ (вектор площади ←)', `${f(r.Phi * 1e6, 2)} мкВб`], ['ε = −dΦ/dt', `${f(r.emf * 1e6, 2)} мкВ`], ['I = ε/R (R = 10 мОм)', `${f(r.I * 1e3, 2)} мА`]]; },
});
export const PLATES = {
  flux: { text: `Натяните плоскую поверхность на контур и разделите её на маленькие участки dA. Для каждого участка B·dA равно нормальной составляющей поля, умноженной на площадь участка (серые стрелки показывают компоненту вдоль оси контура). Сумма всех вкладов даёт Φ. Вблизи магнита стрелки длинные; по мере его удаления они почти исчезают.`,
    facts: s => { const r = M.fluxScene(s.flux.t); return [['расстояние до магнита', `${f(r.d * 100, 1)} см`], ['B в центре', `${f(r.Bc * 1e3, 2)} мТл`], ['Φ = ∫B·dA', `${f(r.Phi * 1e6, 2)} мкВб`], ['ε = −dΦ/dt', `${f(r.emf * 1e6, 1)} мкВ`], ['I = ε/R (R = 10 мОм)', `${f(r.I * 1e3, 2)} мА`]]; } },
  ...Object.fromEntries(M.CASES.map(c => [c.key, lenzPlate(c)])),
  mutual: { text: `Силовые линии поля первой катушки (они становятся слабее вместе с её током) проходят через вторую катушку. Поток через каждый виток второй катушки равен MI₁/N₂. Пока I₁ растёт, ток во второй катушке создаёт поле противоположного направления (пунктир); когда I₁ уменьшается, направление поля совпадает с ним.`,
    facts: s => { const r = M.coilsScene(s.coil.t); return [['I₁', `${f(r.I1, 2)} А`], ['dI₁/dt', `${f(r.dI1, 2)} А/с`], ['M', `${f(M.COILS.M * 1e6, 0)} мкГн`], ['ε₂ = −M dI₁/dt', `${f(r.emf * 1e3, 3)} мВ`], ['I₂ (R = 1 Ом)', `${f(r.I2 * 1e3, 3)} мА`]]; } },
  core: { text: `Вторичная катушка приподнята, чтобы был виден сердечник. Железо направляет магнитный поток, поэтому одинаковый Φ = BA проходит через каждый виток обеих обмоток. ЭДС вторичной обмотки в N₂ раз больше ЭДС одного витка; ε₂/ε₁ = N₂/N₁ — так трансформатор повышает или понижает напряжение.`,
    facts: s => { const r = M.coreScene(s.coil.t); return [['I₁', `${f(r.I1, 3)} А`], ['B = μᵣμ₀N₁I₁/ℓ', `${f(r.B, 3)} Тл`], ['без железного сердечника', `${f(r.Bair * 1e3, 3)} мТл`], ['Φ на один виток', `${f(r.Phi * 1e6, 1)} мкВб`], ['ε₂ = −N₂ dΦ/dt', `${f(r.emf2 * 1e3, 2)} мВ`], ['ε₂/ε₁', `${f(r.emf2 / (r.emf1 || 1e-30), 2)}`]]; } },
  wire: { text: `Поле B меняется поперёк контура, но не вдоль провода. Разделим контур на полосы, параллельные проводу, шириной b и высотой dr (оттенок показывает величину поля). Поток через каждую полоску равен B(r)·b dr; интегрирование даёт логарифм. Иначе говоря, ближняя сторона пересекает поле со скоростью, соответствующей Bближ·bv, дальняя — Bдаль·bv, а разность определяет ЭДС ε.`,
    facts: s => { const r = M.wireScene(s.wire.t); return [['r (ближняя сторона)', `${f(r.r * 100, 1)} см`], ['B ближнее', `${f(r.Bnear * 1e6, 0)} мкТл`], ['B дальнее', `${f(r.Bfar * 1e6, 0)} мкТл`], ['Φ', `${f(r.Phi * 1e6, 3)} мкВб`], ['ε = (B_near − B_far)bv', `${f(r.emf * 1e6, 3)} мкВ`], ['I (R = 10 мОм)', `${f(r.I * 1e3, 3)} мА`]]; } },
  bar: { text: `Показан положительный заряд внутри стержня. Магнитная сила qv×B толкает его вверх вдоль стержня; электрическое поле E, созданное зарядами на концах, действует вниз с силой qE. В равновесии заряд движется вместе со стержнем. Работа на единицу заряда вдоль стержня равна vB·L = ε.`,
    facts: s => { const r = M.barScene(s.bar.t, s.bar.resting); return [['v', `${f(r.v, 2)} м/с`], ['qvB (заряд одного протона)', `${(r.Fmag).toExponential(2)} Н`], ['qE', `${(M.E_CHARGE * r.E).toExponential(2)} Н`], ['E = vB', `${f(r.E, 2)} В/м`], ['ε = BLv', `${f(r.emf, 3)} В`], ['ток', '0']]; } },
  crossing: { text: `На каждой вертикальной стороне, находящейся в магнитном поле, сила v×B перемещает заряд вдоль стороны и создаёт ЭДС BLv. Когда в поле находится только одна сторона, эта ЭДС вызывает ток в контуре. Когда обе стороны внутри поля, ЭДС на них направлены противоположно и компенсируются: ε = 0, хотя контур продолжает двигаться.`,
    facts: s => { const r = M.crossScene(s.cross.t); return [['передняя сторона', r.inLead ? 'в поле' : 'снаружи'], ['задняя сторона', r.inTrail ? 'в поле' : 'снаружи'], ['BLv для каждой стороны', `${f(r.sideEmf * 1e3, 0)} мВ`], ['Φ', `${f(r.Phi * 1e3, 1)} мВб`], ['ε в контуре', `${f(r.emf * 1e3, 0)} мВ`], ['I = ε/R', `${f(r.I * 1e3, 0)} мА`]]; } },
  rails: { text: `Закрашенная площадь Lx — часть контура, через которую проходит магнитный поток; она увеличивается при движении стержня. Индуцированный ток течёт вверх по стержню, а сила ILB направлена назад (красная стрелка — единственная горизонтальная сила и равнодействующая). Тормозящая мощность Fv превращается в тепло на резисторе.`,
    facts: s => { const r = M.railScene(s.rail.t); return [['v', `${f(r.v, 3)} м/с`], ['ε = BLv', `${f(r.emf, 3)} В`], ['I = ε/R', `${f(r.I, 3)} А`], ['F = ILB', `${f(r.F, 3)} Н`], ['Fv', `${f(r.F * r.v, 4)} Вт`], ['I²R', `${f(r.P, 4)} Вт`], ['выделившееся тепло', `${f(r.heat * 1e3, 1)} мДж`]]; } },
  solenoid: { text: `Внутри длинной катушки поле B = μ₀nI однородно, поэтому каждый виток охватывает поток Φ = BA (закрашенный виток). Все N витков вместе охватывают поток NΦ, а отношение NΦ/I равно индуктивности. При изменении I меняется NΦ, и ЭДС самоиндукции −L dI/dt направлена так, чтобы противодействовать этому изменению: при росте тока она положительна на входе тока.`,
    facts: s => { const r = M.solScene(s.sol.t); return [['I', `${f(r.I, 2)} А`], ['B = μ₀nI', `${f(r.B * 1e3, 2)} мТл`], ['Φ на виток = BA', `${f(r.Phi * 1e6, 2)} мкВб`], ['NΦ = LI', `${f(r.NPhi * 1e3, 3)} мВб`], ['ε_L = −L dI/dt', `${f(r.emfL * 1e3, 2)} мВ`], ['U = ½LI²', `${f(r.U * 1e3, 2)} мДж`]]; } },
  rl: { text: `Обойдём контур по направлению тока: подъём потенциала на батарее (+ε, пока она подключена), падение на резисторе (−IR), падение на катушке (−L dI/dt). Сумма всегда равна нулю. При нарастании тока катушка принимает на себя часть напряжения, не приходящуюся на резистор; при спадании сама становится источником тока.`,
    facts: s => { const r = M.rlScene(s.rl.t); return [[r.growing ? 'нарастание, t' : 'спад, t', `${f(r.s, 2)} с`], ['I', `${f(r.I, 3)} А`], ['ε (батарея)', `${f(r.emfBat, 1)} В`], ['IR', `${f(r.VR, 2)} В`], ['L dI/dt', `${f(r.VL, 2)} В`], ['U = ½LI²', `${f(r.U, 2)} Дж`], ['мощность тепловых потерь I²R', `${f(r.P, 2)} Вт`]]; } },
  lcCap: { text: `Энергия запасена в поле между обкладками (чем темнее заливка, тем больше энергия). ΔV = q/C, а U_E = q²/2C = ½CΔV². Когда конденсатор разряжается через катушку, заливка бледнеет; затем она появляется снова, когда обкладки заряжаются с противоположной полярностью и направление E меняется.`,
    facts: s => { const r = M.lcScene(s.lc.t); return [['t (реальное)', `${f(s.lc.t * 1e3, 2)} мс`], ['q (верхняя обкладка)', `${f(r.q * 1e6, 1)} мкКл`], ['ΔV = q/C', `${f(r.V, 2)} В`], ['E = ΔV/d (d = 1 мм)', `${f(r.E / 1e3, 2)} кВ/м`], ['U_E = q²/2C', `${f(r.UE * 1e3, 3)} мДж`], ['U_E + U_B', `${f((r.UE + r.UB) * 1e3, 3)} мДж`]]; } },
  lcCoil: { text: `Энергия запасена в магнитном поле катушки (закрашенная область). U_B = ½LI² достигает максимума, когда q проходит через ноль. ЭДС самоиндукции катушки в каждый момент уравновешивает ΔV конденсатора, поэтому L dI/dt = −q/C: она замедляет ток во время зарядки обкладок и поддерживает его во время разрядки.`,
    facts: s => { const r = M.lcScene(s.lc.t); return [['I = dq/dt', `${f(r.I * 1e3, 1)} мА`], ['dI/dt = −q/LC', `${f(r.dI, 0)} А/с`], ['L dI/dt', `${f(M.LC.L * r.dI, 2)} В`], ['B = LI/NA (1600 витков)', `${f(r.B * 1e3, 3)} мТл`], ['U_B = ½LI²', `${f(r.UB * 1e3, 3)} мДж`], ['U_E + U_B', `${f((r.UE + r.UB) * 1e3, 3)} мДж`]]; } },
};
