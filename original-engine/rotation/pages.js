// Chapter 7, page by page (after the AP Physics 1 organizer, Unit 8, with the AP Physics C additions). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, V_SCALE, A_SCALE, F_LIGHT, F_HEAVY, F_SHAPES, RACE_V, F_PAX, F_WRENCH, F_SLIP, P_SCALE, LP_SCALE } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const dg = r => (r * 180 / Math.PI).toFixed(1);
const cm = s => `${(s * 100).toFixed(s * 100 < 1 ? 1 : 0)} cm`;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
const sx = (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, zero = false }) {
  const X = x => sx(x, x0, x1), Y = y => sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${X(s.tag[0]) + 4}" y="${Y(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${X(x)}" cy="${Y(y)}" r="3.5"/><text class="ax" x="${X(x) + dx}" y="${Y(y) + dy}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${Y(0)}" y2="${Y(0)}"/>` : ''}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${Y(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${Y(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('')}
  </svg>`;
}
export const CH = { sx, sy };
const curvePts = (fn, a, b, n = 60) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// race: where the energy goes, a stacked bar per racer
function energyBars() {
  const bw = W - 150 - P.r, rowH = 30, top = 22, mgh = M.RACE.m * M.G * M.RACE.h;
  const rows = M.RACE.list.map((o, i) => {
    const kt = 1 / (1 + o.f), y = top + i * rowH;
    return `<text class="ax" x="${140}" y="${y + 14}" text-anchor="end">${o.name}</text>
      <rect class="bar" x="150" y="${y}" width="${(bw * kt).toFixed(1)}" height="18"/>
      <rect x="${(150 + bw * kt).toFixed(1)}" y="${y}" width="${(bw * (1 - kt)).toFixed(1)}" height="18" fill="#8a8a8f"/>
      <text class="ax" x="${155}" y="${y + 13}">${Math.round(kt * 100)}%</text>`;
  }).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${top + 4 * rowH + 22}" role="img" aria-label="Share of kinetic energy that is translational and rotational for each racer">
    <text class="lab" x="150" y="14">mgh = ${f(mgh)} J at the bottom →</text>${rows}
    <rect class="bar" x="150" y="${top + 4 * rowH + 4}" width="12" height="10"/><text class="ax" x="168" y="${top + 4 * rowH + 13}">½mv² (moving along)</text>
    <rect x="290" y="${top + 4 * rowH + 4}" width="12" height="10" fill="#8a8a8f"/><text class="ax" x="308" y="${top + 4 * rowH + 13}">½Iω² (spinning)</text>
  </svg>`;
}

const at = (k, dy = 0.5) => [STATIONS[k], dy, 0];
const R0 = M.ROD, PX = M.PAX.list, WR = M.WRENCH, B = M.BOWL, IM = M.IMP.list, HT = M.HIT;
const D = M.DOOR.cases, [ring, discS, sphere] = M.SHAPES.list, sk0 = M.skater(0.2), sk1 = M.skater(4);

export const PAGES = [
  {
    kicker: 'Глава 7', title: 'Вращение', sub: 'вращательное движение',
    body: `
      <p class="lede">Каждая точка вращающегося колеса за одно и то же время поворачивается на одинаковый <b>угол</b> θ (в радианах). Поэтому вращение всего колеса описывается угловыми величинами: ω = Δθ/Δt (рад/с), α = Δω/Δt (рад/с²).</p>
      <p>Положительным считается вращение против часовой стрелки. Это колесо разгоняется с угловым ускорением ${f(M.WHEEL.alpha, 1)} рад/с², а затем тормозит с таким же по модулю ускорением. При разгоне ω и α имеют <b>одинаковые знаки</b>, при торможении — <b>противоположные</b>. Уравнения кинематики применимы и здесь, если заменить x → θ, v → ω, a → α:</p>
      <table class="data eqs">
        <tr><td>ω = ω<sub>0</sub> + αt</td><td>без Δθ</td></tr>
        <tr><td>Δθ = ω<sub>0</sub>t + ½αt²</td><td>без ω</td></tr>
        <tr><td>ω² = ω<sub>0</sub>² + 2αΔθ</td><td>без t</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 4.8, y0: 0, y1: 4, xlabel: 'время (с)', ylabel: 'ω (рад/с)', cursors: ['wheelW'], label: 'Угловая скорость во времени: разгон и торможение',
        series: [{ pts: curvePts(t => M.wheel(t).w, 0, M.WHEEL.run, 48), tag: [0.5, 1.6, 'α > 0'] }, { cls: 'trend', pts: [], tag: [3.5, 2.4, 'α < 0'] }] })}</div>
      <p class="hintline">Нажмите на колесо, чтобы увидеть угол его поворота.</p>`,
    cam: { target: [STATIONS.wheel, 1.15, 0], az: -14, el: 6, dist: 7.2 }, lit: 'wheel', scene: 'wheel', look: {},
    fig: 'Колесо разгоняется, затем тормозит',
  },
  {
    kicker: '7.1', title: 'Два пассажира', sub: 'v = rω',
    body: `
      <p class="lede">На карусели оба пассажира имеют одинаковую ω. Пассажир у края движется по окружности большего радиуса за то же время, поэтому его линейная скорость выше: радиус вдвое больше — скорость тоже вдвое больше.</p>
      <table class="data">
        <tr><th></th><th>линейное</th><th>угловое</th><th>связь</th></tr>
        <tr><td>перемещение</td><td>Δx</td><td>Δθ</td><td>s = rΔθ</td></tr>
        <tr><td>скорость</td><td>v</td><td>ω</td><td>v = rω</td></tr>
        <tr><td>ускорение</td><td>a<sub>t</sub></td><td>α</td><td>a<sub>t</sub> = rα</td></tr>
      </table>
      <p>У каждого пассажира также есть центростремительное ускорение a<sub>c</sub> = rω², направленное к центру и обусловленное изменением направления скорости.</p>
      <div class="charts">${chart({ x0: 0, x1: 5, y0: 0, y1: 2.5, xlabel: 'время (с)', ylabel: 'скорость v (м/с)', cursors: ['disc1', 'disc2'], label: 'Скорость двух пассажиров во времени',
        series: [{ pts: curvePts(t => M.DISC.r2 * M.disc(t).w, 0, M.DISC.run, 50), tag: [3.3, 1.75, `r = ${M.DISC.r2} м`] }, { pts: curvePts(t => M.DISC.r1 * M.disc(t).w, 0, M.DISC.run, 50), tag: [3.75, 0.12, `r = ${M.DISC.r1} м`] }] })}</div>
      <p class="hintline">Нажмите, чтобы разложить ускорение каждого пассажира на составляющие. Масштаб v: ${cm(V_SCALE)} на м/с; a: ${cm(A_SCALE)} на м/с².</p>`,
    cam: { target: [STATIONS.disc, 0.7, 0], az: -10, el: 42, dist: 10.5 }, lit: 'disc', scene: 'disc', look: {},
    fig: 'Два пассажира, одна угловая скорость ω',
  },
  {
    kicker: '7.2', title: 'Момент силы', sub: 'что заставляет тело вращаться',
    body: `
      <p class="lede">Толчок поворачивает дверь, только если приложен на расстоянии от петли и не направлен вдоль двери. Вращательное действие силы характеризуется <b>моментом силы</b>, измеряемым в Н·м:</p>
      <div class="eq">τ = rF sin φ = F × lever arm</div>
      <p>Вектор r направлен от петли к точке приложения силы, а φ — угол между r и F. Дверь поворачивает только составляющая F sin φ, перпендикулярная двери.</p>
      <table class="data">
        <tr><th>одинаковая сила ${f(M.DOOR.F, 0)} Н</th><th>τ (Н·м)</th></tr>
        ${D.map(c => `<tr><td>${c.name}</td><td>${f(c.tau)}</td></tr>`).join('')}
      </table>
      <div class="charts">${chart({ x0: 0, x1: 180, y0: 0, y1: 10, xlabel: 'угол φ между r и F (°)', ylabel: 'τ (Н·м)', label: 'Зависимость момента силы от угла приложения при двух плечах',
        series: [{ pts: curvePts(p => M.torque(0.85, M.DOOR.F, p), 0, 180), tag: [122, 7.6, 'r = 0,85 м'] }, { pts: curvePts(p => M.torque(0.425, M.DOOR.F, p), 0, 180), tag: [118, 1.4, 'r = 0,425 м'] }],
        marks: [[90, D[0].tau, '', 0, 0], [90, D[1].tau, '', 0, 0], [30, D[2].tau, '30°', -26, -6]] })}</div>
      <p class="hintline">Нажмите на двери, чтобы показать плечо каждой силы. Масштаб стрелок: ${cm(F_LIGHT)} на ньютон.</p>`,
    cam: { target: [STATIONS.doors + 0.05, 0.6, -0.4], az: -14, el: 48, dist: 14.5 }, lit: 'doors', scene: 'doors', look: {},
    fig: 'Одинаковая сила, три момента',
  },
  {
    kicker: '7.3', title: 'Равновесие', sub: 'нет поступательного и вращательного ускорения',
    body: `
      <p class="lede">На мостике лежит ящик массой ${M.PLANK.m} кг, который медленно перемещают вдоль доски. Для равновесия необходимо, чтобы Σ<i>F</i> = 0 и Στ = 0.</p>
      <p>Рассчитайте моменты относительно точки, в которой исчезает неизвестная сила: опоры A, где у <i>F</i><sub>A</sub> нулевое плечо. Против часовой стрелки — плюс, по часовой — минус:</p>
      <div class="eq">L·F<sub>B</sub> − (L/2)·Mg − x·mg = 0</div>
      <p>Затем из Σ<i>F</i> = 0 получаем <i>F</i><sub>A</sub> = (M + m)g − <i>F</i><sub>B</sub>. Чем ближе ящик к опоре, тем большую нагрузку она принимает.</p>
      <div class="charts">${chart({ x0: 0, x1: 4, y0: 0, y1: 400, xlabel: 'координата ящика x от A (м)', ylabel: 'реакция опор (Н)', cursors: ['plankA', 'plankB'], label: 'Реакции опор в зависимости от положения ящика',
        series: [{ pts: curvePts(x => M.plank(x).FA, 0, 4, 4), tag: [3.55, M.plank(3.55).FA + 4, 'F<tspan baseline-shift="sub" font-size="8">A</tspan>'] }, { pts: curvePts(x => M.plank(x).FB, 0, 4, 4), tag: [3.55, M.plank(3.55).FB - 60, 'F<tspan baseline-shift="sub" font-size="8">B</tspan>'] }] })}</div>
      <p class="hintline">Нажмите на доску, чтобы увидеть моменты сил относительно A. Масштаб стрелок: ${cm(F_HEAVY)} на ньютон.</p>`,
    cam: { target: [STATIONS.plank, 1.3, 0], az: -14, el: 10, dist: 13 }, lit: 'plank', scene: 'plank', look: {},
    fig: `Доска массой ${M.PLANK.M} кг и ящик массой ${M.PLANK.m} кг`,
  },
  {
    kicker: '7.4', title: 'Лестница', sub: 'насколько низко она может наклониться?',
    body: `
      <p class="lede">Лестница массой ${M.LADDER.m} кг опирается на шероховатый пол и гладкую стену. Стена может только толкать лестницу перпендикулярно своей поверхности.</p>
      <p>Условия сил: <i>F</i><sub>N</sub> = mg и <i>f</i><sub>s</sub> = <i>F</i><sub>w</sub>. Запишем моменты относительно нижнего конца O: две силы приложены в этой точке и не создают момента.</p>
      <div class="eq">(L sin θ)·F<sub>w</sub> = (½L cos θ)·mg</div>
      <p>Чем ниже наклонена лестница, тем больше сила трения требуется внизу. Максимальная сила трения равна μ<sub>s</sub>mg, поэтому лестница начинает скользить при tan θ меньше 1/(2μ<sub>s</sub). Минимальный угол здесь ${dg(M.LADDER.thMin)}° при μ<sub>s</sub> = ${f(M.LADDER.muS)} и не зависит от массы и длины лестницы.</p>
      <div class="charts">${chart({ x0: 40, x1: 85, y0: 0, y1: 120, xlabel: 'угол наклона лестницы θ (°)', ylabel: 'необходимая сила трения (Н)', cursors: ['ladder'], label: 'Необходимая сила трения в зависимости от угла наклона лестницы',
        series: [{ pts: curvePts(d => Math.min(M.ladder(d * Math.PI / 180).f, 120), 41.2, 85) }, { cls: 'trend', pts: [[40, M.LADDER.muS * M.LADDER.W], [85, M.LADDER.muS * M.LADDER.W]], tag: [64, M.LADDER.muS * M.LADDER.W + 4, 'максимальная сила трения'] }],
        marks: [[dg(M.LADDER.thMin), M.LADDER.muS * M.LADDER.W, `θ<tspan baseline-shift="sub" font-size="8">min</tspan> = ${dg(M.LADDER.thMin)}°`, -62, 22]] })}</div>
      <p class="hintline">Нажмите на лестницу, чтобы увидеть плечи сил относительно O. Масштаб стрелок: ${cm(F_HEAVY)} на ньютон.</p>`,
    cam: { target: [STATIONS.ladder + 0.15, 1.45, 0], az: -18, el: 8, dist: 11.5 }, lit: 'ladder', scene: 'ladder', look: {},
    fig: 'Лестница на шероховатом полу',
  },
  {
    kicker: '7.5', title: 'Момент инерции', sub: 'Στ = Iα',
    body: `
      <p class="lede">Второй закон Ньютона для вращения записывается как Στ = Iα. <b>Момент инерции</b> I = Σmr² играет роль массы при поступательном движении; чем дальше масса от оси, тем больше её вклад.</p>
      <p>Каждое тело имеет массу ${f(M.SHAPES.M, 1)} кг и радиус ${f(M.SHAPES.R, 1)} м. На нить, намотанную по краю, действует одинаковая сила ${f(M.SHAPES.F, 1)} Н, создающая момент τ = ${f(M.SHAPES.tau)} Н·м.</p>
      <table class="data">
        <tr><th></th><th>I = fMR²</th><th>α = τ/I</th></tr>
        ${M.SHAPES.list.map(s => `<tr><td>${s.key}</td><td>${s.frac === '1' ? '' : s.frac}MR²</td><td>${f(s.alpha)} рад/с²</td></tr>`).join('')}
      </table>
      <div class="charts">${chart({ x0: 0, x1: 2.4, y0: 0, y1: 8, xlabel: 'время (с)', ylabel: 'ω (рад/с)', cursors: ['sh0', 'sh1', 'sh2'], label: 'Угловая скорость кольца, диска и шара',
        series: M.SHAPES.list.map(s => ({ pts: [[0, 0], [2.4, s.alpha * 2.4]], tag: [1.75, s.alpha * 1.75 + (s.key === 'sphere' ? 0.5 : s.key === 'disc' ? -0.3 : 0), s.key] })) })}</div>
      <p class="hintline">Нажмите на тела, чтобы разделить диск на кольца. Масштаб стрелок: ${cm(F_SHAPES)} на ньютон.</p>`,
    cam: { target: [STATIONS.inertia, 1.15, 0], az: -10, el: 22, dist: 10.2 }, lit: 'inertia', scene: 'inertia', look: {},
    fig: 'Одинаковый момент силы, три тела',
  },
  {
    kicker: '7.6 · AP Physics C', title: 'Суммирование момента инерции', sub: 'I = ∫ r² dm',
    body: `
      <p class="lede">Разделим тело на малые элементы dm и сложим их вклады r² dm: I = ∫ r² dm. Результат зависит от положения оси вращения.</p>
      <p>Однородный стержень (${f(R0.M, 1)} кг, ${f(R0.L, 1)} м) имеет линейную плотность λ = M/L, поэтому элемент длиной dx имеет массу dm = λ dx. Диск можно разбить на тонкие кольца с массой dm = σ·2πr dr, где σ = M/πR²:</p>
      <table class="data">
        <tr><td>стержень, ось через центр</td><td>∫<sub>−L/2</sub><sup>L/2</sup> λx² dx</td><td><sup>1</sup>⁄<sub>12</sub>ML²</td></tr>
        <tr><td>стержень, ось через конец</td><td>∫<sub>0</sub><sup>L</sup> λx² dx</td><td>⅓ML²</td></tr>
        <tr><td>диск, ось через центр</td><td>∫<sub>0</sub><sup>R</sup> r²·σ2πr dr</td><td>½MR²</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 1.2, y0: 0, y1: 1.8, xlabel: 'расстояние r от оси (м)', ylabel: 'dI/dr = λr² (кг·м)', cursors: ['integE', 'integC'], label: 'Вклад в момент инерции на метр стержня в зависимости от расстояния до оси',
        series: [{ cls: 'bar', pts: [[0, 0], ...curvePts(r => R0.lam * r * r, 0, 1.2, 40), [1.2, 0]] }, { pts: curvePts(r => R0.lam * r * r, 0, 1.2, 40), tag: [0.25, 1.0, `конец: площадь 0→L = ${f(R0.Iend, 2)}`] }, { cls: 'trend', pts: [[0.6, 0], [0.6, 1.8]], tag: [0.62, 0.15, `центр: 2 × (0→L/2) = ${f(R0.Icm, 2)}`] }] })}</div>
      <p class="hintline">Нажмите, чтобы раздвинуть элементы стержня и кольца диска и сравнить сумму с интегралом.</p>`,
    cam: { target: [STATIONS.integ - 0.3, 1.0, 0], az: -10, el: 22, dist: 14.5 }, lit: 'integ', scene: 'integ', look: {},
    fig: 'Элементы стержня и кольца диска',
  },
  {
    kicker: '7.7 · AP Physics C', title: 'Теорема Штейнера', sub: 'I = I<sub>cm</sub> + Md²',
    body: `
      <p class="lede">При переносе оси на расстояние d от центра масс момент инерции увеличивается на Md²:</p>
      <div class="eq">I = I<sub>cm</sub> + Md²</div>
      <p>При закреплении за конец d = L/2: <sup>1</sup>⁄<sub>12</sub>ML² + M(L/2)² = ⅓ML² (для двери на петлях: ⅓MW²). Поэтому тот же момент τ = ${f(M.PAX.tau)} Н·м раскручивает стержень в четыре раза медленнее.</p>
      <table class="data">
        <tr><th>ось проходит через</th><th>I<sub>cm</sub></th><th>Md²</th><th>I</th><th>α = τ/I</th></tr>
        ${PX.map(p => `<tr><td>${p.key}</td><td>${f(R0.Icm)}</td><td>${f(R0.M * p.d * p.d)}</td><td>${f(p.I)}</td><td>${f(p.alpha)}</td></tr>`).join('')}
      </table>
      <div class="charts">${chart({ x0: 0, x1: 2.4, y0: 0, y1: 4.5, xlabel: 'время (с)', ylabel: 'ω (рад/с)', cursors: ['pax0', 'pax1'], label: 'Угловая скорость двух стержней во времени',
        series: PX.map((p, i) => ({ pts: [[0, 0], [2.4, p.alpha * 2.4]], tag: i ? [1.25, p.alpha * 1.25 + 0.15, 'ось через конец'] : [0.75, 2.2, 'ось через центр'] })) })}</div>
      <p class="hintline">Нажмите на стержни, чтобы увидеть расстояние d. Масштаб стрелок: ${cm(F_PAX)} на ньютон.</p>`,
    cam: { target: [STATIONS.parallel - 0.45, 0.8, 0.15], az: -10, el: 55, dist: 11 }, lit: 'parallel', scene: 'parallel', look: {},
    fig: 'Одинаковый момент силы, две оси',
  },
  {
    kicker: '7.8', title: 'Работа и мощность', sub: 'W = τΔθ, P = τω',
    body: `
      <p class="lede">Сила ${f(WR.F, 0)} Н, приложенная к ключу длиной ${f(WR.r, 2)} м, поворачивает гайку. Рука движется по дуге s = rΔθ, поэтому совершаемая работа равна</p>
      <div class="eq">W = F·s = F·rΔθ = τΔθ</div>
      <p>Это вращательный аналог формулы W = Fd. Скорость совершения работы — мощность, аналог поступательной формулы P = Fv:</p>
      <div class="eq">P = τω</div>
      <p>Здесь τ = ${f(WR.tau, 0)} Н·м при постоянной угловой скорости ${f(WR.w, 1)} рад/с: P = ${f(WR.P, 0)} Вт, а поворот на 120° требует работы ${f(M.wrench(9).W, 1)} Дж. Трение в резьбе удерживает ω постоянной, поэтому работа превращается в тепло, а не в кинетическую энергию вращения. Без трения она перешла бы в ½Iω².</p>
      <div class="charts">${chart({ x0: 0, x1: 2.2, y0: 0, y1: 45, xlabel: 'угол поворота Δθ (рад)', ylabel: 'работа W (Дж)', cursors: ['wrench'], label: 'Работа в зависимости от угла поворота: наклон прямой равен τ',
        series: [{ pts: [[0, 0], [WR.stroke, WR.tau * WR.stroke]], tag: [0.95, WR.tau * 0.95 + 2, `наклон = τ = ${f(WR.tau, 0)} Н·м`] }],
        marks: [[WR.stroke, WR.tau * WR.stroke, '120°', -36, 4]] })}</div>
      <p class="hintline">Нажмите на ключ, чтобы увидеть радиус и дугу. Масштаб стрелки: ${cm(F_WRENCH)} на ньютон.</p>`,
    cam: { target: [STATIONS.wrench + 0.08, 0.15, 0.12], az: -14, el: 48, dist: 3.6 }, lit: 'wrench', scene: 'wrench', look: {},
    fig: 'Гаечный ключ на гайке',
  },
  {
    kicker: '7.9', title: 'Качение', sub: 'соревнование на наклонной плоскости',
    body: `
      <p class="lede">Шар, диск и кольцо скатываются без начальной скорости по наклонной плоскости под углом ${dg(M.RACE.theta)}°, рядом с бруском, который скользит по льду. Катящиеся тела расходуют часть энергии на вращение:</p>
      <div class="eq">mgh = ½mv² + ½Iω²</div>
      <p>При I = fmR² и ω = v/R получаем v² = 2gh/(1 + f). Масса и радиус сокращаются: чем меньше коэффициент формы f, тем быстрее тело. Первым приходит брусок, затем шар, диск и кольцо. При качении <i>вверх</i> энергия вращения позволяет подняться выше.</p>
      <div class="charts">${energyBars()}</div>
      <p class="hintline">Нажмите на тело, чтобы увидеть его движение при качении. Масштаб стрелок: ${cm(RACE_V)} на м/с.</p>`,
    cam: { target: [STATIONS.race + 0.15, 0.6, 0], az: -14, el: 36, dist: 12.5 }, lit: 'race', scene: 'race', look: {},
    fig: 'Брусок, шар, диск и кольцо',
  },
  {
    kicker: '7.10 · AP Physics C', title: 'Скольжение, затем качение', sub: 'боулингный шар',
    body: `
      <p class="lede">Шар для боулинга вылетает из рук со скоростью ${f(B.v0, 1)} м/с без вращения. Его нижняя точка скользит, поэтому сила трения μ<sub>k</sub>mg направлена назад: она замедляет поступательное движение и одновременно раскручивает шар, действуя на плече R.</p>
      <table class="data cols">
        <tr><th>поступательное движение: ΣF = ma</th><th>вращение: Στ = Iα, I = ⅖mR²</th></tr>
        <tr><td>v = v<sub>0</sub> − μ<sub>k</sub>g t</td><td>ω = (5μ<sub>k</sub>g / 2R) t</td></tr>
      </table>
      <p>Условие перехода к качению без проскальзывания: v = Rω:</p>
      <div class="eq">t* = 2v<sub>0</sub> / 7μ<sub>k</sub>g,&nbsp; v = <sup>5</sup>⁄<sub>7</sub>v<sub>0</sub></div>
      <p>При μ<sub>k</sub> = ${f(B.muK, 1)}: переход происходит через t* = ${f(B.tStar)} с и после перемещения на ${f(B.xStar)} м. Затем шар катится со скоростью ${f(B.vf)} м/с. ${f(0.5 * B.m * B.v0 ** 2 - M.bowl(9).K, 1)} Дж превращаются в тепло.</p>
      <div class="charts">${chart({ x0: 0, x1: 1.1, y0: 0, y1: 2.6, xlabel: 'время (с)', ylabel: 'скорость (м/с)', cursors: ['slipV', 'slipW'], label: 'Скорость шара v и скорость обода Rω во времени; при t* они совпадают',
        series: [{ pts: curvePts(t => M.bowl(t).v, 0, 1.1, 50), tag: [0.22, 2.0, 'v'] }, { pts: curvePts(t => B.R * M.bowl(t).w, 0, 1.1, 50), tag: [0.24, 0.15, 'Rω'] }],
        marks: [[B.tStar, B.vf, 't*', 4, 18]] })}</div>
      <p class="hintline">Нажмите на шар, чтобы увидеть скорость скольжения нижней точки. Масштаб v: ${cm(RACE_V)} на м/с; f: ${cm(F_SLIP)} на ньютон.</p>`,
    cam: { target: [STATIONS.slip, 0.15, 0], az: -8, el: 18, dist: 7.2 }, lit: 'slip', scene: 'slip', look: {},
    fig: 'Шар начинает движение скольжением',
  },
  {
    kicker: '7.11', title: 'Колодезный ворот', sub: 'поступательное и вращательное движение',
    body: `
      <p class="lede">Ведро массой ${f(M.WELL.m, 1)} кг подвешено на верёвке, намотанной на барабан массой ${f(M.WELL.M, 1)} кг (сплошной цилиндр). После отпускания ведро падает, а барабан начинает вращаться.</p>
      <table class="data cols">
        <tr><th>ведро: ΣF = ma</th><th>барабан: Στ = Iα, a = rα</th></tr>
        <tr><td>mg − T = ma</td><td>rT = ½Mr²·(a/r), so T = ½Ma</td></tr>
      </table>
      <div class="eq">a = mg / (m + ½M) = ${f(M.WELL.a)} м/с²</div>
      <p>T = ${f(M.WELL.T)} Н, меньше веса ведра. Чем массивнее барабан, тем медленнее падает ведро.</p>
      <div class="charts">${chart({ x0: 0, x1: 1.2, y0: 0, y1: 8, xlabel: 'время (с)', ylabel: 'скорость ведра (м/с)', cursors: ['well'], label: 'Скорость ведра во времени в сравнении со свободным падением',
        series: [{ pts: [[0, 0], [M.WELL.run, M.WELL.a * M.WELL.run]], tag: [0.78, M.WELL.a * 0.78 - 1.6, 'с барабаном'] }, { cls: 'trend', pts: [[0, 0], [0.64, M.G * 0.64]], tag: [0.5, M.G * 0.5 + 0.6, 'свободное падение'] }] })}</div>
      <p class="hintline">Нажмите на ворот, чтобы сравнить движение со свободным падением. Масштаб стрелок: ${cm(F_LIGHT)} на ньютон.</p>`,
    cam: { target: [STATIONS.well + 0.25, 2.05, 0], az: 22, el: 8, dist: 14 }, lit: 'well', scene: 'well', look: {},
    fig: 'Ведро и барабан с намотанной верёвкой',
  },
  {
    kicker: '7.12', title: 'Угловой импульс силы', sub: 'τΔt = ΔL',
    body: `
      <p class="lede">Вращающееся тело обладает <b>моментом импульса</b> L = Iω. Момент силы изменяет его так же, как сила изменяет линейный импульс p:</p>
      <div class="eq">Στ = ΔL/Δt, so τΔt = ΔL</div>
      <p>τΔt — это <b>угловой импульс силы</b>, равный площади под графиком τ–t. Два одинаковых диска (I = ½MR² = ${f(M.IMP.I, 0)} кг·м²) получают два воздействия на обод: A — сильное и короткое, B — слабое и длительное. Площади под графиками равны, поэтому конечные L и ω = ${f(IM[0].wf)} рад/с одинаковы.</p>
      <div class="charts">${chart({ x0: 0, x1: 3, y0: 0, y1: 300, xlabel: 'время (с)', ylabel: 'момент силы τ (Н·м)', cursors: ['impT0', 'impT1'], label: 'Момент силы во времени для двух воздействий: площади равны',
        series: [{ cls: 'bar', pts: [[0, 0], [0, IM[1].tau], [IM[1].dt, IM[1].tau], [IM[1].dt, 0]], tag: [1.55, IM[1].tau - 30, `B: ${IM[1].tau} × ${IM[1].dt} = ${IM[1].J}`] }, { pts: [[0, 0], [0, IM[0].tau], [IM[0].dt, IM[0].tau], [IM[0].dt, 0], [3, 0]], tag: [0.65, IM[0].tau - 50, `A: ${IM[0].tau} × ${IM[0].dt} = ${IM[0].J}`] }] })}</div>
      <p class="hintline">Нажмите на карусель, чтобы увидеть плечо силы. Масштаб стрелок: ${cm(F_HEAVY)} на ньютон.</p>`,
    cam: { target: [STATIONS.impulse, 0.5, 0.2], az: -10, el: 36, dist: 16.5 }, lit: 'impulse', scene: 'impulse', look: {},
    fig: 'Сильно и коротко, слабо и долго',
  },
  {
    kicker: '7.13', title: 'Вращение фигуриста', sub: 'момент импульса L = Iω',
    body: `
      <p class="lede">Если внешний момент сил отсутствует, <b>момент импульса</b> L = Iω не изменяется: I<sub>0</sub>ω<sub>0</sub> = I<sub>f</sub>ω<sub>f</sub>.</p>
      <p>Фигуристка вращается, держа в вытянутых руках грузы массой ${f(M.SKATE.m, 1)} кг, а затем поднимает руки над головой. Лёд почти не создаёт момента внешних сил. При приближении грузов к оси момент инерции I уменьшается, поэтому ω возрастает. Момент импульса L сохраняется, а K<sub>r</sub> увеличивается: фигуристка совершает работу руками.</p>
      <table class="data">
        <tr><th></th><th>руки в стороны</th><th>руки подняты</th></tr>
        <tr><td>I (кг·м²)</td><td>${f(sk0.I)}</td><td>${f(sk1.I)}</td></tr>
        <tr><td>ω (рад/с)</td><td>${f(sk0.w)}</td><td>${f(sk1.w)}</td></tr>
        <tr><td>L = Iω</td><td>${f(sk0.L)}</td><td>${f(sk1.L)}</td></tr>
        <tr><td>K<sub>r</sub> = ½Iω² (Дж)</td><td>${f(sk0.K)}</td><td>${f(sk1.K)}</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: +M.SKATE.run.toFixed(1), y0: 0, y1: 5, xlabel: 'время (с)', ylabel: 'ω (рад/с)', cursors: ['skater'], label: 'Угловая скорость фигуристки во времени',
        series: [{ pts: curvePts(t => M.skater(t).w, 0, M.SKATE.run, 120) }] })}</div>
      <p class="hintline">Нажмите на фигуристку, чтобы увидеть начальное положение грузов.</p>`,
    cam: { target: [STATIONS.skater, 1.3, 0], az: -16, el: 16, dist: 9.6 }, lit: 'skater', scene: 'skater', look: {},
    fig: 'Руки ближе к телу — вращение быстрее',
  },
  {
    kicker: '7.14 · AP Physics C', title: 'Момент импульса частицы', sub: 'L = r × p',
    body: `
      <p class="lede">Шар, движущийся по прямой, имеет момент импульса относительно точки O:</p>
      <div class="eq">L = r × p, |L| = mvr sin φ = mvr<sub>⊥</sub></div>
      <p>r<sub>⊥</sub> = d — расстояние от O до прямой движения. По мере движения шара r и φ меняются, но r sin φ остаётся равным d, поэтому <b>L постоянно</b> при прямолинейном движении. Затем шар ударяет по стержню массой ${f(HT.M, 1)} кг, закреплённому в точке O. Реакция шарнира не создаёт момента относительно O, поэтому момент импульса сохраняется:</p>
      <div class="eq">mv<sub>0</sub>d = −mv<sub>f</sub>d + ⅓ML²ω</div>
      <p>При упругом ударе шар массой ${f(HT.m, 1)} кг отскакивает со скоростью ${f(-HT.v1)} м/с, а стержень начинает вращаться с угловой скоростью ${f(HT.w)} рад/с.</p>
      <div class="charts">${chart({ x0: 0, x1: 2.1, y0: -0.4, y1: 1.4, zero: true, xlabel: 'время (с)', ylabel: 'L относительно O (кг·м²/с)', cursors: ['hitB', 'hitR', 'hitL'], label: 'Момент импульса шара, стержня и системы во времени',
        series: [{ pts: [[0, M.hit(0).Lb], [HT.tHit, M.hit(0).Lb], [HT.tHit, M.hit(9).Lb], [2.1, M.hit(9).Lb]], tag: [1.5, M.hit(9).Lb + 0.01, 'ball'] }, { cls: 'trend', pts: [[0, 0], [HT.tHit, 0], [HT.tHit, HT.I * HT.w], [2.1, HT.I * HT.w]], tag: [1.3, HT.I * HT.w + 0.02, 'rod'] }, { cls: 'curve total', pts: [[0, M.hit(0).L], [2.1, M.hit(0).L]], tag: [0.15, M.hit(0).L - 0.22, 'total'] }] })}</div>
      <p class="hintline">Нажмите, чтобы показать L в виде векторов. Масштаб p: ${cm(P_SCALE)} на кг·м/с.</p>`,
    cam: { target: [STATIONS.particle - 0.4, 0.15, 0.15], az: -14, el: 52, dist: 8.5 }, lit: 'particle', scene: 'particle', look: {},
    fig: 'Шар, ось и стержень',
  },
];

// ---------- click a scene: what it breaks into ----------
const turns = th => (th / (2 * Math.PI));
export const PLATES = {
  wheel: { text: `The dashed line is where the marked spoke started; the grey arc is the angle it has turned through since, θ, read in radians. The valve has travelled an arc s = rθ along the rim. Every point on the wheel turns through the same θ, but points farther out travel farther. One full turn is 2π rad of angular displacement, even though the valve is back where it started (zero linear displacement).`,
    facts: s => { const q = M.wheel(s.wheel.t); return [['θ', `${f(q.th)} rad = ${f(turns(q.th))} turns`], ['arc length s = rθ', `${f(M.WHEEL.R * q.th)} m`], ['ω', `${f(q.w)} rad/s`], ['α', `${f(q.a)} rad/s²`], ['rim speed v = rω', `${f(M.WHEEL.R * q.w)} m/s`]]; } },
  disc: { text: `Each rider’s acceleration splits in two. a<sub>t</sub> (along the path) changes her speed; it points forward while the ride speeds up and backward as it slows. a<sub>c</sub> (toward the middle) turns her round the circle and grows with ω². The red arrow is their sum, a = r√(ω⁴ + α²). Both double at twice the radius.`,
    facts: s => { const q = M.disc(s.disc.t), p1 = M.pointAt(M.DISC.r1, q), p2 = M.pointAt(M.DISC.r2, q); return [['ω, α (shared)', `${f(q.w)} rad/s, ${f(q.a)} rad/s²`], [`r = ${M.DISC.r1} m: v, a<sub>t</sub>, a<sub>c</sub>`, `${f(p1.v)}, ${f(p1.at)}, ${f(p1.ac)}`], [`r = ${M.DISC.r2} m: v, a<sub>t</sub>, a<sub>c</sub>`, `${f(p2.v)}, ${f(p2.at)}, ${f(p2.ac)}`]]; } },
  doors: { text: `Extend each force along its <b>line of action</b> (dashed). The <b>lever arm</b> r<sub>⊥</sub> is the shortest distance from the hinge to that line, meeting it square on. τ = F·r<sub>⊥</sub>. On the right-hand door the push splits into F<sub>⊥</sub>, which turns the door, and F<sub>∥</sub>, which pushes along it into the hinge and does nothing for the turning. Halve r, or tilt the push to 30° (sin 30° = ½), and the torque halves.`,
    facts: () => D.map(c => [c.name, `r⊥ = ${f(c.arm, 3)} m → τ = ${f(c.tau)} N·m`]) },
  plank: { text: `Torques about A. Each force turns the plank by (its distance from A) × (force). The plank’s weight acts at its middle, L/2; the crate’s at x; F<sub>B</sub> at L. F<sub>A</sub> acts at the pivot, so it has no torque. The weights turn it clockwise (−), F<sub>B</sub> counter-clockwise (+), and they cancel.`,
    facts: s => { const x = M.crateX(s.clock * M.SLOW), q = M.plank(x); return [['τ of F<sub>B</sub> (+)', `${f(M.PLANK.L)} × ${f(q.FB, 1)} = ${f(M.PLANK.L * q.FB, 0)} N·m`], ['τ of plank Mg (−)', `${f(M.PLANK.L / 2)} × ${f(M.PLANK.Wp, 1)} = ${f(M.PLANK.L / 2 * M.PLANK.Wp, 0)} N·m`], ['τ of crate mg (−)', `${f(x)} × ${f(M.PLANK.Wc, 1)} = ${f(x * M.PLANK.Wc, 0)} N·m`], ['Στ about A', '0 N·m'], ['F<sub>A</sub>, F<sub>B</sub>', `${f(q.FA, 1)} N, ${f(q.FB, 1)} N`]]; } },
  ladder: { text: `About the foot O, only two forces have torque. The wall force is horizontal, so extend it sideways: its lever arm is the height of the top, L sin θ. The weight is vertical, so extend it down: its lever arm is the sideways distance to the middle, ½L cos θ. F<sub>N</sub> and f<sub>s</sub> act at O itself and drop out.`,
    facts: s => { const th = M.ladderAngle(s.clock * M.SLOW), q = M.ladder(th); return [['θ', `${dg(th)}°`], ['F<sub>w</sub> × L sin θ', `${f(q.Fw * M.LADDER.L * Math.sin(th), 1)} N·m`], ['mg × ½L cos θ', `${f(M.LADDER.W * M.LADDER.L / 2 * Math.cos(th), 1)} N·m`], ['friction needed', `${f(q.f, 1)} N`], ['most available μ<sub>s</sub>F<sub>N</sub>', `${f(q.fMax, 1)} N`]]; } },
  inertia: { text: `The disc lifts apart into four thin rings of equal width. Each ring has all its mass at about one radius, so its I is about mr². The outer rings hold more mass <i>and</i> sit farther out, so they dominate. Adding them up gives ½MR², half of a ring with all the mass at the rim. A solid sphere has even more of its mass near the axis: ⅖MR².`,
    facts: () => M.discAsRings(4).map((r, k) => [`ring ${k + 1}: ${f(r.r0, 1)}–${f(r.r1, 1)} m, ${f(r.m, 3)} kg`, `I = ${f(r.I, 4)} kg·m²`]).concat([['sum', `${f(M.discAsRings(4).reduce((a, r) => a + r.I, 0), 4)} = ½MR²`]]) },
  race: { text: `Rolling without slipping, the point touching the ramp is momentarily at rest. The centre moves at v and the top at 2v: the whole disc is turning about the contact point. That is why ω = v/R. The box, sliding on ice, has no spin to pay for and arrives first. The energy split is the same for any mass or size: the sphere keeps 1/(1 + ⅖) = 71% as ½mv².`,
    facts: s => M.RACE.list.map(o => { const q = M.race(o, s.race.t), e = M.energy(o, q.v); return [o.name, `½mv² ${f(e.Kt)} J + ½Iω² ${f(e.Kr)} J`]; }) },
  well: { text: `The ghost is a bucket in free fall: with nothing to spin, it would fall at g. The rope pulls at the drum’s edge, distance r from the axle and square to it, so its torque is rT. That torque has to spin up the drum, so T stays below mg and the bucket falls at only ${f(M.WELL.a)} m/s². Two masses over a heavy pulley (Atwood’s machine) work the same way: a = (m<sub>1</sub> − m<sub>2</sub>)g / (m<sub>1</sub> + m<sub>2</sub> + ½M).`,
    facts: s => { const q = M.well(s.well.t); return [['bucket falls', `${f(q.y)} m at ${f(q.v)} m/s`], ['free fall would be', `${f(Math.min(0.5 * M.G * s.well.t ** 2, M.WELL.h))} m`], ['torque rT', `${f(M.WELL.R * M.WELL.T)} N·m`], ['drum ω', `${f(q.w)} rad/s`]]; } },
  skater: { text: `The ghost spheres mark where the weights were with arms out. Moving them in from r = ${f(M.SKATE.rOut)} m cuts 2mr² from ${f(2 * M.SKATE.m * M.SKATE.rOut ** 2)} to ${f(2 * M.SKATE.m * M.SKATE.rIn ** 2, 3)} kg·m². L = Iω doesn’t change, so ω rises by the same factor I falls.`,
    facts: s => { const q = M.skater(s.skater.t); return [['r', `${f(q.r)} m`], ['I', `${f(q.I)} kg·m²`], ['ω', `${f(q.w)} rad/s`], ['L = Iω', `${f(q.L, 3)} kg·m²/s`], ['K<sub>r</sub>', `${f(q.K)} J`]]; } },
  integ: { text: `The slices slide apart and the rings lift off. Each slice has the same mass dm = λΔx, but its share of I is r²dm, so the far slices count most: on the end-pinned rod the last slice is 19 times farther out than the first, so it counts 19² = 361 times as much. Add the slices up, Σr²Δm, and the sum closes in on the integral as the slices get thinner. The rings work the same way, but each ring’s mass grows with r too (dm = σ2πr dr), so I = ∫σ2πr³dr.`,
    facts: () => [[`${R0.N} slices, axis at the centre`, `Σr²Δm = ${f(M.rodSum(R0.N, 0), 4)} kg·m²`], ['integral ML²/12', `${f(R0.Icm, 4)} kg·m²`], [`${R0.N} slices, axis at the end`, `Σr²Δm = ${f(M.rodSum(R0.N, -R0.L / 2), 4)} kg·m²`], ['integral ML²/3', `${f(R0.Iend, 4)} kg·m²`], ['100 slices, centre', `${f(M.rodSum(100, 0), 5)} kg·m²`]] },
  parallel: { text: `The dashed line is a second axis through the end-pinned rod’s centre of mass, parallel to the pin. About that axis the rod has I<sub>cm</sub> = ML²/12, the same as the other rod. Measured from the pin, every piece sits at its position from the centre of mass plus d = L/2. Square and add: the cross terms cancel (about the centre of mass the pieces balance), leaving I<sub>cm</sub> + Md². The theorem only works from the centre-of-mass axis: I is smallest there.`,
    facts: s => PX.map(p => [`pinned at the ${p.key}: I<sub>cm</sub> + Md²`, `${f(R0.Icm)} + ${f(R0.M * p.d * p.d)} = ${f(p.I)} kg·m²`]).concat(PX.map(p => [`${p.key}: ω`, `${f(M.paxSpin(p, s.parallel.t).w)} rad/s`])) },
  wrench: { text: `The grey outline is where the stroke started. The hand’s path is the grey arc, s = rΔθ, and the push is always along it, square to the handle. So W = Fs = F·rΔθ = τΔθ: work is torque times angle (in radians). A wrench twice as long needs half the push for the same τ, but the hand travels twice as far: the same work.`,
    facts: s => { const q = M.wrench(s.wrench.t); return [['Δθ', `${f(q.th)} rad = ${dg(q.th)}°`], ['arc s = rΔθ', `${f(q.s, 3)} m`], ['F·s', `${f(WR.F * q.s, 1)} J`], ['τΔθ', `${f(q.W, 1)} J`], ['P = τω', `${f(q.P, 0)} W`]]; } },
  slip: { text: `The bottom of the ball moves at v − Rω (grey, at the floor). While that is not zero, the ball skids and kinetic friction points against it. v falls and Rω rises (the top grey arrow) until they meet; then the bottom is at rest, friction stops and the ball rolls. About the contact line friction has no torque, so mvR + Iω stays the same: mv<sub>0</sub>R = mvR + ⅖mR²(v/R) gives v = 5v<sub>0</sub>/7 again.`,
    facts: s => { const q = M.bowl(s.slip.t); return [['v', `${f(q.v)} m/s`], ['ω', `${f(q.w, 1)} rad/s`], ['bottom slides at v − Rω', `${f(q.vSlip)} m/s`], ['friction', q.slip ? `${f(B.f, 1)} N backward` : 'none: rolling'], ['K', `${f(q.K, 1)} J of ${f(0.5 * B.m * B.v0 ** 2, 1)} J`]]; } },
  impulse: { text: `Each push acts at the rim, square to the radius, so the lever arm is the full radius R = ${f(M.IMP.R, 1)} m and τ = FR. The hard push gives a big τ for a short time, the gentle one a small τ for longer. What counts for the final spin is τΔt, the area. After the push there is no torque (the bearing is smooth), so L stays put.`,
    facts: s => IM.map(p => { const q = M.imp(p, s.impulse.t); return [`${p.key}: τΔt = ${p.tau} × ${p.dt}`, `${p.J} kg·m²/s → L now ${f(q.L, 0)}, ω ${f(q.w)} rad/s`]; }) },
  particle: { text: `L about O drawn as vectors, up for counter-clockwise seen from above (right-hand rule). Before the hit, only the ball has L, mv<sub>0</sub>d. After it, the ball’s L points down (it moves the other way) and the rod’s points up. The blue total doesn’t change: the pin pushes on the rod at O itself, so it has no torque about O. Linear momentum is <i>not</i> conserved here: the pin pushes.`,
    facts: s => { const q = M.hit(s.particle.t); return [['r (O to ball)', `${f(q.r)} m`], ['r sin φ = r<sub>⊥</sub>', `${f(HT.d)} m`], ['L ball = mv r<sub>⊥</sub>', `${f(q.Lb, 3)} kg·m²/s`], ['L rod = Iω', `${f(q.Lr, 3)} kg·m²/s`], ['total', `${f(q.L, 3)} kg·m²/s`]]; } },
};
