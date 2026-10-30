// Chapter 9, page by page (after the AP Physics C: E&M organizer, Unit 1). Text and a chart on
// the left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, S, E_SCALE, F_SCALE, PL } from './world.js';

const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const sci = (x, n = 2) => { const p = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** p; return `${m.toFixed(n)} × 10<sup>${p < 0 ? '−' + -p : p}</sup>`; };
const cm = x => (x * 100).toFixed(0);
const kNC = x => (x / 1000).toFixed(2);

// ---------- small SVG charts for the left page ----------
const W = 420, H = 150, P = { l: 44, r: 14, t: 16, b: 30 };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursor, label }) {
  const sx = x => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = y => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const zero = y0 < 0 && y1 > 0 ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${zero}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursor ? `<circle class="cursor" r="4.5" data-cursor="${cursor}"/>` : ''}
  </svg>`;
}
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
const curve = (x0, x1, fn, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const x = x0 + (x1 - x0) * i / n; return [x, fn(x)]; });
const clip = (y, y1) => Math.min(y, y1);
// chart ranges shared with main.js (live cursors)
export const RANGE = {
  induce: { x0: 0, x1: Math.ceil(M.INDUCE.run), y0: -1, y1: 4 },
  coulomb: { x0: 15, x1: 50, y0: 0, y1: 4 },
  line: { x0: 10, x1: 40, y0: -0.4, y1: 0.3 },
  field: { x0: 5, x1: 35, y0: 0, y1: 4 },
  dipole: { x0: 10, x1: 50, y0: 0, y1: 2 },
  rod: { x0: 0, x1: 40, y0: 0, y1: 4 },
  ring: { x0: 0, x1: 60, y0: 0, y1: 1.5 },
  plates: { x0: 0, x1: 12, y0: 0, y1: 14 },
};
const at = (k, x = 0, y = 0.4) => [STATIONS[k] + x, y, 0];
const R = RANGE;

const pairF = r => M.coulomb(M.PAIR.q1, M.PAIR.q2, r);
const inducedSeries = () => curve(0, M.INDUCE.run, t => M.induce(t).Qnet / M.nC, 200);

export const PAGES = [
  {
    kicker: 'Глава 9', title: 'Электрический заряд', sub: 'счёт в электронах',
    body: `
      <p class="lede">Атом состоит из заряженных частиц: <b>протонов</b> (+) в ядре, <b>электронов</b> (−) вокруг него и нейтральных нейтронов. Одноимённые заряды отталкиваются, разноимённые — притягиваются.</p>
      <table class="data">
        <tr><th>частица</th><th>заряд</th><th>масса</th></tr>
        <tr><td>протон</td><td>+<i>e</i></td><td>${sci(M.MP)} кг</td></tr>
        <tr><td>электрон</td><td>−<i>e</i></td><td>${sci(M.ME)} кг</td></tr>
        <tr><td>нейтрон</td><td>0</td><td>≈ <i>m</i><sub>p</sub></td></tr>
      </table>
      <div class="eq">1 <i>e</i> = ${sci(M.QE)} Кл</div>
      <p>При равном числе протонов и электронов атом <b>нейтрален</b>. Избыток электронов даёт <b>отрицательный</b> заряд, недостаток — <b>положительный</b>. При электризации твёрдых тел перемещаются только электроны, а любой заряд кратен <i>e</i>.</p>
      <p><b>Закон сохранения заряда:</b> заряд не создаётся и не исчезает, а только переносится. Если потереть палочку мехом, одна из них получит +<i>q</i>, другая −<i>q</i>.</p>
      <p class="hintline">Нажмите на атомы, чтобы найти лишний и недостающий электрон.</p>`,
    cam: { target: at('charge', 0, 0.3), az: -14, el: 10, dist: 25 }, lit: 'atoms', scene: 'atoms', look: {},
    fig: 'Нейтральный, отрицательный и положительный заряды',
  },
  {
    kicker: '9.1', title: 'Электризация тел', sub: 'четыре способа перемещения электронов',
    body: `
      <p class="lede">При электризации заряд не возникает из ничего: электроны переходят на тело, с тела или перемещаются внутри него.</p>
      <table class="data">
        <tr><td><b>трение</b></td><td>трение меха о ПВХ: электроны переходят с одного тела на другое</td></tr>
        <tr><td><b>контакт</b></td><td>при соприкосновении заряд распределяется по металлу, но остаётся локальным на изоляторе</td></tr>
        <tr><td><b>влияние</b></td><td>без контакта: заряд смещает электроны в металле; заземление позволяет им уйти</td></tr>
        <tr><td><b>поляризация</b></td><td>молекулы диэлектрика смещают положительные и отрицательные заряды, образуя диполи</td></tr>
      </table>
      <p>Палочка с зарядом ${f(M.ROD.Q / M.nC, 0)} нКл приближается на расстояние ${cm(M.ROD.near)} см. Свободные электроны шара смещаются на дальнюю сторону; при заземлении они уходят. На шаре остаётся заряд <b>+${f(M.QG / M.nC)} нКл</b>, противоположный заряду палочки.</p>
      <div class="charts">${chart({ ...R.induce, xlabel: 'время (с)', ylabel: 'заряд шара (нКл)', cursor: 'induce', label: 'Изменение заряда шара в процессе электризации влиянием',
        series: [{ pts: inducedSeries() }] })}</div>
      <p class="hintline">Размер бусин показывает поверхностную плотность заряда σ. Нажмите на шар или воздушный шарик.</p>`,
    cam: { target: at('charging', -0.3, 0.4), az: -8, el: 8, dist: 32 }, lit: 'induce', scene: 'induce', look: {},
    fig: 'Электризация влиянием и поляризация',
  },
  {
    kicker: '9.2', title: 'Закон Кулона', sub: 'обратная квадратичная зависимость',
    body: `
      <p class="lede">Сила взаимодействия двух точечных зарядов пропорциональна произведению модулей зарядов и обратно пропорциональна квадрату расстояния между ними.</p>
      <div class="eq"><i>F</i> = <i>k</i>|<i>q</i><sub>1</sub><i>q</i><sub>2</sub>|/<i>r</i>²</div>
      <p><i>k</i> = 1/4πε<sub>0</sub> = ${sci(M.K)} Н·м²/Кл². Используйте модули зарядов |<i>q</i>|: знаки определяют только притяжение или отталкивание. Силы взаимодействия равны по модулю, даже если один заряд вдвое больше другого.</p>
      <div class="charts">${chart({ ...R.coulomb, xlabel: 'расстояние r (см)', ylabel: 'сила (Н)', cursor: 'coulomb', label: 'Зависимость силы от расстояния: обратная пропорциональность квадрату r',
        series: [{ pts: curve(15, 50, x => clip(pairF(x / 100), 4)) }], marks: [[20, pairF(0.2), `${f(pairF(0.2))} Н`], [40, pairF(0.4), `${f(pairF(0.4))} Н`, -46, -8]] })}</div>
      <p><b>Насколько велика сила?</b> Представим, что два человека массой ${M.PEOPLE.m} кг находятся на расстоянии 1 м друг от друга, и у каждого протонов на 1% больше, чем электронов: заряд каждого равен ${sci(M.PEOPLE.q)} Кл. Сила <i>F</i> = ${sci(M.PEOPLE.F)} Н была бы достаточной, чтобы сообщить Земле ускорение ${f(M.PEOPLE.a, 1)} м/с².</p>
      <p class="hintline">Масштаб изображения: ${S}×; масштаб сил — ${cm(F_SCALE.coulomb)} см на Н. Нажмите, чтобы увидеть взаимодействие одноимённых зарядов.</p>`,
    cam: { target: at('coulomb', 0, 0.1), az: -12, el: 8, dist: 13 }, lit: 'coulomb', scene: 'coulomb', look: {},
    fig: `+${M.PAIR.q1 / M.uC} мкКл и −${-M.PAIR.q2 / M.uC} мкКл`,
  },
  {
    kicker: '9.3', title: 'Равнодействующая сила', sub: 'точка равновесия зарядов',
    body: `
      <p class="lede">Если зарядов несколько, найдите силу от каждого из них, а затем сложите силы как векторы. Это <b>принцип суперпозиции</b>.</p>
      <p>Пробный заряд +${f(M.LINE.q0 / M.uC, 1)} мкКл находится между зарядами A (+${M.LINE.qA / M.uC} мкКл) и B (+${M.LINE.qB / M.uC} мкКл), расстояние между которыми ${cm(M.LINE.D)} см. Оба заряда отталкивают пробный заряд. Силы уравновешиваются в точке, где</p>
      <div class="eq sm"><i>kq</i><sub>A</sub>/<i>x</i>² = <i>kq</i><sub>B</sub>/(<i>d</i> − <i>x</i>)²  →  <i>x</i> = ${cm(M.LINE.xEq)} cm</div>
      <p>Точка равновесия всегда расположена <b>ближе к меньшему заряду</b>. Она не обязательно находится между зарядами: если сделать B отрицательным, точка сместится за B, на расстояние ${cm(M.LINE.xEqUnlike)} см.</p>
      <div class="charts">${chart({ ...R.line, xlabel: 'координата x (см)', ylabel: 'равнодействующая сила на q₀ (Н)', cursor: 'line', label: 'Равнодействующая сила на пробный заряд в зависимости от положения; ноль соответствует точке равновесия',
        series: [{ pts: curve(10, 40, x => Math.max(Math.min(M.lineForces(x / 100).net[0], 0.3), -0.4)) }], marks: [[M.LINE.xEq * 100, 0, `${cm(M.LINE.xEq)} cm`, 6, -8]] })}</div>
      <p class="hintline">Масштаб сил: ${f(F_SCALE.line, 0)} см на 0,01 Н. Нажмите, чтобы установить пробный заряд в точку равновесия.</p>`,
    cam: { target: at('line', 0, 0.3), az: -10, el: 8, dist: 15.5 }, lit: 'line', scene: 'line', look: {},
    fig: 'Пробный заряд между A и B',
  },
  {
    kicker: '9.4', title: 'Электрическое поле', sub: 'сила на единицу заряда',
    body: `
      <p class="lede">Заряд изменяет свойства окружающего пространства. На небольшой положительный <b>пробный заряд</b> <i>q</i><sub>0</sub>, помещённый в любую точку, действует сила. Напряжённость поля равна этой силе, делённой на заряд.</p>
      <div class="eq"><b>E</b> = <b>F</b>/<i>q</i><sub>0</sub> = (<i>kQ</i>/<i>r</i>²) <b>r̂</b></div>
      <p><b>r̂</b> направлен от <i>Q</i>. Для +<i>Q</i> поле направлено наружу, для −<i>Q</i> — к заряду. Единица напряжённости — Н/Кл.</p>
      <table class="data">
        <tr><td><b>силовые линии</b></td><td>показывают направление поля; чем они гуще, тем поле сильнее. Выходят из + и входят в −</td></tr>
        <tr><td><b>векторы поля</b></td><td>показывают также величину: ${f(M.pointMag(M.POINT.Q, 0.1), 0)}, ${f(M.pointMag(M.POINT.Q, 0.2), 0)}, ${f(M.pointMag(M.POINT.Q, 0.3), 0)} Н/Кл на расстояниях 10, 20 и 30 см</td></tr>
      </table>
      <div class="charts">${chart({ ...R.field, xlabel: 'расстояние r (см)', ylabel: 'E (кН/Кл)', cursor: 'field', label: 'Напряжённость поля в зависимости от расстояния: обратная пропорциональность квадрату r',
        series: [{ cls: 'curve total', pts: curve(5, 35, x => clip(M.pointMag(M.POINT.Q, x / 100) / 1000, 4)) }] })}</div>
      <p class="hintline">Каждый заряд показан отдельно, масштаб ${S}×; масштаб E — ${cm(E_SCALE.field * 100)} см на 100 Н/Кл. Стрелка силы на пробный заряд +${f(M.POINT.q0 / M.nC, 1)} нКл имеет ту же длину, что и E. Нажмите, чтобы увидеть r̂.</p>`,
    cam: { target: at('field', 0, 0.4), az: -8, el: 8, dist: 35 }, lit: 'point', scene: 'point', look: {},
    fig: `+${M.POINT.Q / M.nC} нКл и −${M.POINT.Q / M.nC} нКл`,
  },
  {
    kicker: '9.5', title: 'Электрический диполь', sub: 'поля складываются как векторы',
    body: `
      <p class="lede">Два противоположных заряда ±<i>q</i> расположены на расстоянии 2<i>a</i>. Напряжённость <b>E</b> в точке P — векторная сумма полей обоих зарядов.</p>
      <p><b>На оси диполя</b> оба поля направлены вдоль одной прямой, причём сильнее поле ближайшего заряда:</p>
      <div class="eq sm"><i>E</i> = <i>kq</i>/(<i>x</i>−<i>a</i>)² − <i>kq</i>/(<i>x</i>+<i>a</i>)² = 4<i>kqax</i>/(<i>x</i>²−<i>a</i>²)²</div>
      <p><b>На перпендикулярной биссектрисе</b> составляющие по <i>y</i> компенсируются, а составляющие по <i>x</i> складываются:</p>
      <div class="eq sm"><i>E</i> = 2 · <i>kq</i>/(<i>a</i>²+<i>y</i>²) · cos θ = 2<i>kqa</i>/(<i>a</i>²+<i>y</i>²)<sup>3/2</sup></div>
      <p>На больших расстояниях эти выражения приближаются к 4<i>kqa</i>/<i>x</i>³ и 2<i>kqa</i>/<i>y</i>³: поля почти компенсируются, поэтому E убывает пропорционально <b>1/<i>r</i>³</b>.</p>
      <div class="charts">${chart({ ...R.dipole, xlabel: 'расстояние от центра (см)', ylabel: 'E (кН/Кл)', cursor: 'dipole', label: 'Поле диполя на оси и биссектрисе в зависимости от расстояния, вместе с приближениями для больших расстояний',
        series: [{ cls: 'curve total', pts: curve(20, 50, x => clip(M.dipoleAxis(x / 100) / 1000, 2)), tag: [27, 1.0, 'ось'] }, { cls: 'curve trend', pts: curve(20, 50, x => clip(4 * M.K * M.DIPOLE.q * M.DIPOLE.a / (x / 100) ** 3 / 1000, 2)) },
          { cls: 'curve total', pts: curve(10, 50, x => clip(M.dipoleBisector(x / 100) / 1000, 2)), tag: [15.5, 0.75, 'биссектриса'] }, { cls: 'curve trend', pts: curve(14, 50, x => clip(2 * M.K * M.DIPOLE.q * M.DIPOLE.a / (x / 100) ** 3 / 1000, 2)) }] })}</div>
      <p class="hintline">Пунктир: 1/r³. Масштаб изображения ${S}×; E — ${cm(E_SCALE.dipole * 100)} см на 100 Н/Кл. Нажмите, чтобы разложить E на E₊ и E₋.</p>`,
    cam: { target: at('dipole', -0.6, 0.2), az: -10, el: 8, dist: 19 }, lit: 'dipole', scene: 'dipole', look: {},
    fig: `±${M.DIPOLE.q / M.nC} нКл, расстояние ${cm(2 * M.DIPOLE.a)} см`,
  },
  {
    kicker: '9.6', title: 'Заряженный стержень', sub: 'суммирование вкладов элементов',
    body: `
      <p class="lede">Разделим стержень на элементы длиной d<i>x</i>, каждый из которых несёт заряд d<i>q</i> = λ d<i>x</i>, где λ = <i>Q</i>/<i>L</i> = ${f(M.RODE.lambda / M.nC, 0)} нКл/м. Каждый элемент можно считать точечным зарядом; затем проинтегрируем их вклады.</p>
      <p><b>На оси стержня</b>, на расстоянии <i>a</i> за его концом:</p>
      <div class="eq sm"><i>E</i> = ∫<sub><i>a</i></sub><sup><i>a</i>+<i>L</i></sup> <i>k</i>λ d<i>x</i>/<i>x</i>² = <i>k</i>λ[1/<i>a</i> − 1/(<i>a</i>+<i>L</i>)] = <i>kQ</i>/<i>a</i>(<i>a</i>+<i>L</i>)</div>
      <p><b>На перпендикулярной биссектрисе</b>, на расстоянии <i>a</i> от середины, составляющие по <i>x</i> компенсируются:</p>
      <div class="eq sm"><i>E</i> = ∫ <i>k</i>λ<i>a</i> d<i>x</i>/(<i>x</i>²+<i>a</i>²)<sup>3/2</sup> = <i>kQ</i>/<i>a</i>√(<i>L</i>²/4 + <i>a</i>²)</div>
      <p>На большом расстоянии (<i>a</i> ≫ <i>L</i>) оба выражения переходят в <i>kQ</i>/<i>a</i>² — поле точечного заряда. Вблизи середины (<i>a</i> ≪ <i>L</i>) получаем 2<i>k</i>λ/<i>a</i>.</p>
      <div class="charts">${chart({ ...R.rod, xlabel: 'расстояние a (см)', ylabel: 'E (кН/Кл)', cursor: 'rod', label: 'Поле стержня на оси и биссектрисе в зависимости от расстояния, вместе с полем точечного заряда',
        series: [{ cls: 'curve total', pts: curve(2, 40, x => clip(M.rodAxis(x / 100) / 1000, 4)), tag: [3.5, 1.5, 'ось'] }, { cls: 'curve total', pts: curve(3, 40, x => clip(M.rodBisector(x / 100) / 1000, 4)), tag: [13, 2.0, 'биссектриса'] },
          { cls: 'curve trend', pts: curve(10, 40, x => clip(M.K * M.RODE.Q / (x / 100) ** 2 / 1000, 4)), tag: [24, 0.75, 'kQ/a²'] }] })}</div>
      <p class="hintline">Масштаб изображения ${S}×; E — ${cm(E_SCALE.rod * 100)} см на 100 Н/Кл. Нажмите, чтобы разделить стержень на ${M.RODE.slices} элементов.</p>`,
    cam: { target: at('rod', 0, 1.0), az: -10, el: 8, dist: 21 }, lit: 'rod', scene: 'rod', look: {},
    fig: `Заряд +${M.RODE.Q / M.nC} нКл на стержне длиной ${cm(M.RODE.L)} см`,
  },
  {
    kicker: '9.7', title: 'Заряженное кольцо', sub: 'и диск',
    body: `
      <p class="lede">Каждый элемент кольца находится на одинаковом расстоянии от точки P на его оси. Поперечные составляющие поля компенсируются, остаётся только осевая составляющая с cos φ = <i>z</i>/√(<i>z</i>²+<i>R</i>²).</p>
      <div class="eq sm"><i>E</i> = ∫<sub>0</sub><sup>2π</sup> <i>k</i>λ<i>R</i> d<i>θ</i> · <i>z</i>/(<i>z</i>²+<i>R</i>²)<sup>3/2</sup> = <i>kQz</i>/(<i>z</i>²+<i>R</i>²)<sup>3/2</sup></div>
      <p>В центре поле равно нулю; на большом расстоянии оно приближается к <i>kQ</i>/<i>z</i>². Между ними есть максимум при <i>z</i> = <i>R</i>/√2 = ${f(M.RING_ZMAX * 100, 1)} см.</p>
      <div class="charts">${chart({ ...R.ring, xlabel: 'расстояние z вдоль оси (см)', ylabel: 'E (кН/Кл)', cursor: 'ring', label: 'Напряжённость поля кольца на оси: ноль в центре, максимум, затем спад',
        series: [{ cls: 'curve total', pts: curve(0, 60, x => M.ringAxis(x / 100) / 1000) }, { cls: 'curve trend', pts: curve(31, 60, x => clip(M.K * M.RING.Q / (x / 100) ** 2 / 1000, 1.5)), tag: [44, 0.55, 'kQ/z²'] }], marks: [[M.RING_ZMAX * 100, M.ringAxis(M.RING_ZMAX) / 1000, 'R/√2', 6, -6]] })}</div>
      <p><b>Диск</b> можно представить как набор концентрических колец с зарядом d<i>q</i> = σ 2π<i>r</i> d<i>r</i>:</p>
      <div class="eq sm"><i>E</i> = (σ/2ε<sub>0</sub>)(1 − <i>z</i>/√(<i>z</i>²+<i>R</i>²))</div>
      <p>Непосредственно над центром диска поле равно σ/2ε<sub>0</sub>, а не нулю: заряд распределён по всей поверхности прямо под точкой P.</p>
      <p class="hintline">Масштаб изображения ${S}×; E — ${cm(E_SCALE.ring * 100)} см на 100 Н/Кл, d<i>E</i> ×2. Нажмите, чтобы увидеть элементы кольца.</p>`,
    cam: { target: at('ring', -0.4, 0.5), az: -30, el: 12, dist: 20 }, lit: 'ring', scene: 'ring', look: {},
    fig: `Кольцо с зарядом +${(M.RING.Q / M.nC).toFixed(0)} нКл, R = ${cm(M.RING.R)} см`,
  },
  {
    kicker: '9.8', title: 'Однородное электрическое поле', sub: 'снова движение брошенного тела',
    body: `
      <p class="lede">Между двумя большими разноимённо заряженными пластинами поле однородно и направлено от «плюса» к «минусу». На заряд действует постоянная сила, и он движется подобно брошенному телу.</p>
      <div class="eq"><i>F</i> = <i>qE</i> = <i>ma</i></div>
      <p>Электрон влетает со скоростью ${sci(M.PLATES.v0, 1)} м/с в поле с напряжённостью <i>E</i> = ${M.PLATES.E} Н/Кл. Сила, действующая на электрон, направлена <i>против</i> <b>E</b>, к положительной пластине.</p>
      <table class="data">
        <tr><td><i>a</i> = <i>eE</i>/<i>m</i><sub>e</sub></td><td>${sci(M.PLATES.a)} м/с², вверх</td></tr>
        <tr><td><i>t</i> = <i>L</i>/<i>v</i><sub>0</sub></td><td>${f(M.PLATES.tCross * 1e9, 1)} нс между пластинами длиной ${cm(M.PLATES.L)} см</td></tr>
        <tr><td><i>y</i> = ½<i>at</i>²</td><td>${f(M.PLATES.yExit * 1000, 2)} мм; угол вылета ${f(M.PLATES.angle, 1)}°</td></tr>
      </table>
      <p>Протон отклонился бы в противоположную сторону, причём его отклонение было бы в ${f(M.MP / M.ME, 0)} раз меньше: ${f(M.PLATES.yProton * 1e6, 1)} мкм.</p>
      <div class="charts">${chart({ ...R.plates, xlabel: 'x (см)', ylabel: 'y (мм)', cursor: 'plates', label: 'Траектория электрона: парабола между пластинами, затем прямая линия',
        series: [{ pts: curve(0, M.PLATES.run, t => [M.electron(t).x * 100, M.electron(t).y * 1000]).map(p => p[1]) }, { cls: 'curve trend', pts: [[M.PLATES.L * 100, 0], [M.PLATES.L * 100, 14]], tag: [M.PLATES.L * 100 - 3.6, 12, 'конец пластин'] }] })}</div>
      <p class="hintline">Анимация замедлена примерно в 10⁹ раз; масштаб изображения ${PL.S}×; E — ${f(PL.E * 100 * 1000, 0)} см на кН/Кл. Нажмите, чтобы увидеть v<sub>x</sub> и v<sub>y</sub>.</p>`,
    cam: { target: at('plates', -0.1, 0.5), az: -10, el: 5, dist: 17 }, lit: 'plates', scene: 'plates', look: {},
    fig: 'Электрон между заряженными пластинами',
  },
];

// ---------- click a scene: what it breaks into ----------
const ind = s => s.induce;
export const PLATES = {
  atoms: { text: `All three have the same nucleus: 6 protons, +6<i>e</i>. The negative ion has picked up one extra electron, pulled out here. The positive ion has lost one; the outline marks its empty place. Net charge is always (protons − electrons) × <i>e</i>. (A cartoon: a real atom is about 10⁻¹⁰ m across, its nucleus 100 000 times smaller, and electrons don’t orbit like planets.)`,
    facts: () => M.ATOMS.map(a => [a.name, `${a.p} − ${a.e} = ${a.p - a.e >= 0 ? (a.p - a.e ? '+' : '') : '−'}${Math.abs(a.p - a.e)} e = ${a.p === a.e ? '0' : (a.p > a.e ? '+' : '−') + sci(M.QE)} C`]) },
  induce: { text: `Bead size is the surface charge density σ on the sphere. With the rod near and nothing connected, σ is + on the near side and − on the far side, but it still adds up to zero: the electrons have only moved. Grounding lets the far-side electrons go. What stays is held by the rod, and spreads evenly once the rod leaves.`,
    facts: s => { const st = ind(s); return [['stage', st.stage], ['rod tip to centre', st.rod ? `${cm(st.dTip)} cm` : 'gone'], ['net charge on sphere', `${f(st.Qnet / M.nC)} nC`], ['after grounding', `−Σ q R/d = +${f(M.QG / M.nC)} nC`]]; } },
  balloon: { text: `The wall is an insulator, so its electrons can’t leave their molecules. Each molecule just stretches, its − end toward the + balloon. The − ends are nearer, so their attraction beats the repulsion of the + ends, and the balloon is pulled in. The stretch here grows with the balloon’s field.`,
    facts: s => { const g = s.balloonGap, r = g + M.BALLOON.r; return [['balloon charge', `+${M.BALLOON.q / M.nC} nC`], ['gap to the wall', `${f(g * 100, 1)} cm`], ['balloon’s field at the wall', `${kNC(M.K * M.BALLOON.q / (r * r))} kN/C`]]; } },
  coulomb: { text: `Underneath, a like pair at the same distance: it repels. The +4 μC charge feels the same size of force as the smaller one in both pairs. The product q₁q₂ sets the size of the force, and the signs set whether it attracts or repels.`,
    facts: s => { const r = s.pairR; return [['r', `${f(r * 100, 1)} cm`], ['F = k|q₁q₂|/r²', `${f(pairF(r))} N`], ['F at 2r', `${f(pairF(2 * r))} N (¼)`], ['unlike pair', 'attract'], ['like pair', 'repel']]; } },
  line: { text: `Parked at x<sub>eq</sub>, the two pushes are equal and opposite and the red net force vanishes. Nudge it either way and the nearer charge pushes it back: along this line the point is stable. The method: (1) decide where it can balance, from which way each force points; (2) set the forces equal and solve for the distance; (3) check that it is nearer the smaller charge.`,
    facts: () => { const r = M.lineForces(M.LINE.xEq); return [['x<sub>eq</sub>', `${cm(M.LINE.xEq)} cm from A`], ['F<sub>A</sub> there', `${f(r.FA[0], 3)} N →`], ['F<sub>B</sub> there', `${f(-r.FB[0], 3)} N ←`], ['net', `${f(Math.abs(r.net[0]), 3)} N`]]; } },
  point: { text: `The test charge stops at 20 cm. r̂ (grey) is a unit vector, length 1, pointing from the charge out through the test charge. The field is <i>kQ</i>/<i>r</i>² times r̂. With −Q the same formula gives −r̂, so the force on a positive test charge points inward.`,
    facts: () => { const r = 0.2, E = M.pointMag(M.POINT.Q, r); return [['r', `${f(r * 100, 1)} cm`], ['E = kQ/r²', `${f(E, 0)} N/C`], ['F = q₀E', `${sci(M.POINT.q0 * E)} N`], ['r̂', `(cos 22.5°, sin 22.5°) = (${f(Math.cos(M.POINT.ang))}, ${f(Math.sin(M.POINT.ang))})`]]; } },
  dipole: { text: `At each P the thin arrows are E₊ (from +q, pointing away) and E₋ (toward −q). On the axis they point opposite ways and the nearer one wins. On the bisector they are equal: the grey y parts cancel and the x parts add. The method for any set of charges: (1) find each charge’s field at P; (2) see which components cancel by symmetry; (3) compute the rest with sin and cos from side lengths; (4) add.`,
    facts: s => { const x = s.dipoleX, y = s.dipoleY, a = M.DIPOLE.a, k = M.K * M.DIPOLE.q; return [['axis: E₊ − E₋', `${f(k / (x - a) ** 2, 0)} − ${f(k / (x + a) ** 2, 0)} = ${f(M.dipoleAxis(x), 0)} N/C`], ['bisector: each', `${f(k / (a * a + y * y), 0)} N/C`], ['bisector: 2 E cos θ', `${f(M.dipoleBisector(y), 0)} N/C`]]; } },
  rod: { text: `Both P move in close. The rod pulled apart into ${M.RODE.slices} slices, each a point charge Q/${M.RODE.slices}. Their dE arrows at the upper P fan out symmetrically, so the sideways parts cancel. Their vector sum is already close to the integral; more, thinner slices make it exact. On the bisector the integrals use ∫x dx/(x²+a²)<sup>3/2</sup> = −1/(x²+a²)<sup>1/2</sup>, which gives E<sub>x</sub> = 0 between symmetric limits, and ∫dx/(x²+a²)<sup>3/2</sup> = x/a²(x²+a²)<sup>1/2</sup> for E<sub>y</sub>.`,
    facts: () => { const b = M.RODE.b0, sum = M.sumE(M.rodSlices(M.RODE.slices), [0, b, 0])[1]; return [['a (bisector)', `${f(b * 100, 1)} cm`], [`sum of ${M.RODE.slices} slices`, `${f(sum, 0)} N/C`], ['integral', `${f(M.rodBisector(b), 0)} N/C`], ['sideways', '0, cancelled']]; } },
  ring: { text: `P stops at the peak, z = R/√2. Each of the ${M.RING.beads} pieces gives a dE along its own line from the ring (dashed). Around the ring the sideways parts point every way and cancel; the parts along the axis all add. Each piece has the same <i>r</i> and the same cos φ, so the integral over θ is just 2π: E = 2π<i>k</i>λ<i>Rz</i>/(<i>z</i>²+<i>R</i>²)<sup>3/2</sup> = <i>kQz</i>/(<i>z</i>²+<i>R</i>²)<sup>3/2</sup>. For a disc, integrate these rings from <i>r</i> = 0 to <i>R</i> with ∫<i>r</i> d<i>r</i>/(<i>z</i>²+<i>r</i>²)<sup>3/2</sup> = −1/(<i>z</i>²+<i>r</i>²)<sup>1/2</sup>.`,
    facts: () => { const z = M.RING_ZMAX, dEm = M.K * M.RING.Q / M.RING.beads / (z * z + M.RING.R ** 2); return [['z', `${f(z * 100, 1)} cm`], ['each dE', `${f(dEm, 0)} N/C`], ['cos φ', f(z / Math.hypot(z, M.RING.R), 3)], ['E = Σ dE cos φ', `${f(M.ringAxis(z), 0)} N/C`]]; } },
  plates: { text: `The two velocity components, grey. v<sub>x</sub> never changes; v<sub>y</sub> grows steadily while the electron is between the plates, then both stay fixed. It is a projectile with the field playing gravity. The strobe outlines are equal times apart.`,
    facts: s => { const e = M.electron(s.plates.t); return [['t', `${f(s.plates.t * 1e9, 2)} ns`], ['v<sub>x</sub>', `${sci(e.vx)} m/s`], ['v<sub>y</sub>', `${sci(Math.max(e.vy, 1))} m/s`], ['y', `${f(e.y * 1000, 2)} mm`]]; } },
};
