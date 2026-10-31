// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + Math.abs(x).toPrecision(3);   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const G = M.G, rad = d => d * Math.PI / 180, RE = M.EARTH.R, GM = M.GM, m = M.SAT_M;
const B = M.BALL;

// 0 · twice the speed
const AC0 = M.ac(M.V2, B.r);
// 1 · half the string
const T1 = B.m * M.V1 ** 2 / (B.r / 2);
// 2 · a wet road
const MU2 = 0.40, V2MAX = Math.sqrt(MU2 * G * M.CAR.r);
// 3 · the cone at 60°
const TH3 = 60, R3 = M.CONE.L * Math.sin(rad(TH3)), V3 = Math.sqrt(R3 * G * Math.tan(rad(TH3))), T3 = M.CONE.m * G / Math.cos(rad(TH3));
// 4 · the loop's top at 9.0 м/с
const L = M.LOOP, V4 = 9.0, Н4 = L.m * (V4 ** 2 / L.r - G);
// 5 · a wider banked curve
const R5 = 40, V5 = Math.sqrt(R5 * G * Math.tan(M.BANK.th));
// 6 · a record turntable
const RPM6 = 100 / 3, R6 = 0.15, V6 = R6 * RPM6 * 2 * Math.PI / 60;
// 7 · g one Earth radius up
const G7 = M.EARTH.g / 4;
// 8 · orbit at 3 R_E
const V8 = Math.sqrt(GM / (3 * RE));
// 9 · an ellipse from 2 R_E to 4 R_E
const RP9 = 2 * RE, RA9 = 4 * RE, VP9 = M.visViva(RP9, (RP9 + RA9) / 2), VA9 = VP9 * RP9 / RA9;
// 10 · the page's ellipse: K at apogee from energy
const KP = 0.5 * m * M.ELL.vp ** 2, UP = M.Ugrav(M.ELL.rp), UA = M.Ugrav(M.ELL.ra), KA = KP + UP - UA;
// 11 · gravity's work from 4 R_E in to 2 R_E; ΔU to 100 km
const W11 = GM * m * (1 / (2 * RE) - 1 / (4 * RE)), H11 = 100e3, DU11 = GM * m * (1 / RE - 1 / (RE + H11)), MGH11 = m * M.EARTH.g * H11;
// 12 · escape from 4 R_E; from a circular orbit at 2 R_E
const VE12 = M.vEsc(4 * RE), R12 = 2 * RE;
const ГДж = x => f(x / 1e9, 2);

export const PRACTICE = {
  0: [
    { q: 'Шар движется по окружности с постоянной скоростью. Куда направлено его ускорение?',
      choices: ['по направлению скорости, по касательной к окружности', 'к центру окружности', 'от центра окружности', 'не направлено: постоянная скорость означает нулевое ускорение'], answer: 1,
      why: `<p>Скорость — векторная величина: её направление постоянно поворачивается к центру, поэтому Δ<i>v</i> (и <i>a</i>) направлено к центру и перпендикулярно <i>v</i>. Постоянство <b>модуля скорости</b> означает, что у <i>a</i> нет составляющей вдоль <i>v</i>, но само ускорение не равно нулю.</p>` },
    { q: `Шар движется по окружности радиусом ${f(B.r)} м со скоростью ${f(M.V2, 1)} м/с вместо ${f(M.V1, 1)} м/с. Чему равно его центростремительное ускорение?`,
      choices: [`${p3(2 * M.ac(M.V1, B.r))} м/с²`, `${p3(M.ac(M.V1, B.r))} м/с²`, `${p3(AC0)} м/с²`, `${p3(M.ac(M.V1, B.r) / 2)} м/с²`], answer: 2,
      why: `<div class="eq"><i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i> = (${f(M.V2, 1)})² / ${f(B.r)} = ${p3(AC0)} м/с²</div><p>Скорость входит в квадрате: при удвоении скорости центростремительное ускорение увеличивается в четыре раза — ${f(M.ac(M.V1, B.r))} м/с², not twice.</p>` },
  ],
  1: [
    { q: `Шар массой ${f(B.m)} кг движется со скоростью ${f(M.V1, 1)} м/с, но длина нити уменьшена вдвое — до ${f(B.r / 2)} м. Чему равно натяжение нити?`,
      choices: [`${p3(T1)} Н`, `${p3(T1 / 4)} Н`, `${p3(2 * T1)} Н`, `${p3(T1 / 2)} Н`], answer: 0,
      why: `<p>На гладком столе сила натяжения — единственная горизонтальная сила, поэтому она целиком обеспечивает центростремительную силу:</p><div class="eq"><i>T</i> = <i>mv</i>²/<i>r</i> = ${f(B.m)} × (${f(M.V1, 1)})² / ${f(B.r / 2)} = ${p3(T1)} Н</div><p>При уменьшении <i>r</i> вдвое при той же скорости натяжение <i>T</i> удваивается (с ${f(M.tension(M.V1))} Н).</p>` },
    { q: 'Если смотреть сверху, нить обрывается в момент, когда шар движется по окружности. Как будет двигаться шар сразу после обрыва?',
      choices: ['по спирали наружу', 'по прямой от центра, вдоль прежнего направления нити', 'по прямой, по касательной к окружности в данной точке', 'по той же окружности, замедляясь'], answer: 2,
      why: `<p>После обрыва нити горизонтальная сила исчезает, поэтому по первому закону Ньютона шар сохраняет прежнюю скорость: движется по прямой, касательной к окружности. Никакой силы, выбрасывающей его радиально наружу, нет.</p>` },
  ],
  2: [
    { q: `В дождливую погоду коэффициент статического трения шин уменьшается до ${f(MU2)}. С какой максимальной скоростью автомобиль может пройти плоский поворот радиусом ${M.CAR.r} м?`,
      choices: [`${p3(M.CAR.vmax)} м/с`, `${p3(M.CAR.vmax / 2)} м/с`, `${p3(MU2 * G * M.CAR.r)} м/с`, `${p3(V2MAX)} м/с`], answer: 3,
      why: `<p>На пределе максимальная сила трения покоя в точности равна необходимой центростремительной силе: μ<sub>s</sub><i>mg</i> = <i>mv</i>²/<i>r</i>.</p><div class="eq"><i>v</i><sub>max</sub> = √(μ<sub>s</sub><i>gr</i>) = √(${f(MU2)} × ${f(G)} × ${M.CAR.r}) = ${p3(V2MAX)} м/с</div><p>Уменьшение μ<sub>s</sub> вдвое уменьшает <i>v</i><sub>max</sub> в √2 раза, а не в 2 раза.</p>` },
    { q: 'Грузовик вдвое тяжелее автомобиля проходит тот же плоский поворот на тех же шинах с максимально возможной скоростью. Как его максимальная скорость соотносится с максимальной скоростью автомобиля?',
      choices: ['в 2 раза меньше', 'в √2 раза меньше', 'одинаковое', 'в √2 раза больше'], answer: 2,
      why: `<p>Из μ<sub>s</sub><i>mg</i> = <i>mv</i>²/<i>r</i> масса сокращается, поскольку входит в обе части уравнения; <i>v</i><sub>max</sub> = √(μ<sub>s</sub><i>gr</i>). Грузовику требуется вдвое большая сила трения, но его удвоенный вес позволяет дороге обеспечить такую силу.</p>` },
  ],
  3: [
    { q: `Шар массой ${f(M.CONE.m)} кг на нити длиной ${f(M.CONE.L, 1)} м раскручивают быстрее, пока нить не образует угол ${TH3}° с вертикалью. С какой скоростью движется шар?`,
      choices: [`${p3(Math.sqrt(M.CONE.L * G * Math.tan(rad(TH3))))} м/с`, `${p3(Math.sqrt(R3 * G / Math.tan(rad(TH3))))} м/с`, `${p3(V3)} м/с`, `${p3(Math.sqrt(G * M.CONE.L))} м/с`], answer: 2,
      why: `<p>The radius is the horizontal reach, <i>r</i> = <i>L</i> sin θ = ${f(R3, 3)} m, not <i>L</i>. From <i>g</i> tan θ = <i>v</i>²/<i>r</i>:</p><div class="eq"><i>v</i> = √(<i>rg</i> tan θ) = √(${f(R3, 3)} × ${f(G)} × ${f(Math.tan(rad(TH3)), 3)}) = ${p3(V3)} м/с</div><p>${p3(Math.sqrt(R3 * G / Math.tan(rad(TH3))))} м/с uses tan of the angle from the horizontal.</p>` },
    { q: `Для того же шара нить образует угол ${TH3}° с вертикалью. Чему равно натяжение нити?`,
      choices: [`${p3(T3)} Н`, `${p3(M.CONE.m * G * Math.cos(rad(TH3)))} Н`, `${p3(M.CONE.m * G / Math.sin(rad(TH3)))} Н`, `${p3(M.CONE.m * G)} Н`], answer: 0,
      why: `<p>Nothing accelerates vertically, so the string’s vertical part holds up the weight:</p><div class="eq"><i>T</i> cos θ = <i>mg</i> &nbsp;→ <i>T</i> = ${f(M.CONE.m * G, 2)} / cos ${TH3}° = ${p3(T3)} Н</div><p>The tension must be <b>larger</b> than <i>mg</i>, because only part of it points up; <i>mg</i> cos θ goes the wrong way.</p>` },
  ],
  4: [
    { q: `Тележка массой ${L.m} кг проходит верхнюю точку петли радиусом ${f(L.r, 1)} м вверх дном со скоростью ${f(V4, 1)} м/с. С какой силой рельс давит на тележку?`,
      choices: [`${p3(L.m * (V4 ** 2 / L.r + G) / 1000)} кН`, `${p3(N4 / 1000)} кН`, `${p3(L.m * V4 ** 2 / L.r / 1000)} кН`, `${p3(L.W / 1000)} кН`], answer: 1,
      why: `<p>At the top both forces point down, toward the centre, and together they supply <i>mv</i>²/<i>r</i>:</p><div class="eq"><i>F</i><sub>N</sub> + <i>mg</i> = <i>mv</i>²/<i>r</i> &nbsp;→ <i>F</i><sub>N</sub> = ${L.m}(${f(V4 ** 2 / L.r, 2)} − ${f(G)}) = ${f(N4, 0)} Н = ${p3(N4 / 1000)} кН</div><p>Adding <i>mg</i> instead is the <b>bottom</b>-of-the-loop equation.</p>` },
    { q: `Какова минимальная скорость тележки в верхней точке петли радиусом ${f(L.r, 1)} м, при которой она не потеряет контакт с рельсом?`,
      choices: [`${p3(Math.sqrt(2 * G * L.r))} м/с`, `${p3(G * L.r)} м/с`, `${p3(Math.sqrt(G * L.r / 2))} м/с`, `${p3(L.vmin)} м/с`], answer: 3,
      why: `<p>Slower means less push from the track. The limit is <i>F</i><sub>N</sub> = 0, with gravity alone supplying the centripetal force:</p><div class="eq"><i>mg</i> = <i>mv</i>²/<i>r</i> &nbsp;→ <i>v</i><sub>min</sub> = √(<i>gr</i>) = √(${f(G)} × ${f(L.r, 1)}) = ${p3(L.vmin)} м/с</div><p>The mass cancels; slower than this, gravity pulls the cart inside the circle and it leaves the track.</p>` },
  ],
  5: [
    { q: `Поворот радиусом ${R5} м имеет угол наклона ${M.BANK.thetaDeg}°. С какой скоростью автомобиль может пройти его без трения?`,
      choices: [`${p3(M.BANK.v)} м/с`, `${p3(Math.sqrt(R5 * G))} м/с`, `${p3(R5 * G * Math.tan(M.BANK.th))} м/с`, `${p3(V5)} м/с`], answer: 3,
      why: `<p>Vertical: <i>F</i><sub>N</sub> cos θ = <i>mg</i>. Horizontal: <i>F</i><sub>N</sub> sin θ = <i>mv</i>²/<i>r</i>. Divide:</p><div class="eq">tan θ = <i>v</i>²/(<i>rg</i>) &nbsp;→ <i>v</i> = √(${R5} × ${f(G)} × tan ${M.BANK.thetaDeg}°) = ${p3(V5)} м/с</div><p>Four times the radius, twice the speed of the ${f(M.BANK.v)} м/с on the ${M.BANK.r} m curve.</p>` },
    { q: 'На обледенелом повороте без трения автомобиль движется быстрее расчётной скорости для данного наклона дороги. Что произойдёт?',
      choices: ['Автомобиль смещается вверх по виражу, к внешней стороне поворота.', 'Автомобиль скользит вниз по виражу, к внутренней стороне поворота.', 'Автомобиль продолжает двигаться по дуге, поскольку реакция опоры увеличивается до нужного значения.', 'Автомобиль перестаёт поворачивать и движется прямо вниз по наклонной плоскости.'], answer: 0,
      why: `<p>With no friction the normal force must both hold the car up (<i>F</i><sub>N</sub> cos θ = <i>mg</i>) and turn it, so its horizontal part is fixed at <i>mg</i> tan θ. A faster car needs more than that, so it can’t follow the circle and drifts to a larger radius, up the bank.</p>` },
  ],
  6: [
    { q: `Пластинка вращается со скоростью 33⅓ об/мин. С какой линейной скоростью движется пылинка на расстоянии ${f(R6)} м от центра?`,
      choices: [`${p3(R6 * RPM6 / 60)} м/с`, `${p3(V6)} м/с`, `${p3(R6 * RPM6)} м/с`, `${p3(2 * R6 * RPM6 * 2 * Math.PI / 60)} м/с`], answer: 1,
      why: `<p>Convert to rad/s first: ω = 33⅓ × 2π/60 = ${f(RPM6 * 2 * Math.PI / 60, 3)} rad/s. Then</p><div class="eq"><i>v</i> = <i>r</i>ω = ${f(R6)} × ${f(RPM6 * 2 * Math.PI / 60, 3)} = ${p3(V6)} м/с</div><p><i>v</i> = <i>r</i>ω only works with ω in rad/s; ${p3(R6 * RPM6)} uses rpm directly, ${p3(R6 * RPM6 / 60)} uses rev/s and forgets 2π.</p>` },
    { q: `Два блока находятся на расстояниях ${f(M.DISC.r1)} м и ${f(M.DISC.r2)} м от центра вращающегося диска. Во сколько раз центростремительное ускорение внешнего блока больше, чем внутреннего?`,
      choices: ['в 2 раза меньше', 'одинаковое', 'в 2 раза больше', 'в 4 раза больше'], answer: 2,
      why: `<p>Both share one ω, so <i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i> = <i>r</i>ω² grows in proportion to <i>r</i>. (Using <i>v</i>²/<i>r</i>, <i>v</i> doubles but so does <i>r</i>: 4/2 = 2, not 4.)</p>` },
  ],
  7: [
    { q: 'Два шара притягиваются с силой F. Массу одного из них увеличивают втрое, а расстояние между центрами удваивают. Как изменится сила притяжения?',
      choices: [`${(3 / 4).toFixed(3)} <i>F</i>`, `${(3 / 2).toFixed(2)} <i>F</i>`, `${(3 / 8).toFixed(3)} <i>F</i>`, `${(3 * 4).toFixed(1)} <i>F</i>`], answer: 0,
      why: `<p><i>F</i> ∝ <i>m</i><sub>1</sub><i>m</i><sub>2</sub>/<i>r</i>²: multiply the factors, 3 × 1 / 2² = ¾. Forgetting to square <i>r</i> gives 1.5 <i>F</i>.</p>` },
    { q: `Чему равно ускорение свободного падения на высоте, равной радиусу Земли над её поверхностью? У поверхности g = ${f(M.EARTH.g)} м/с².`,
      choices: [`${p3(M.EARTH.g / 2)} м/с²`, `${p3(G7)} м/с²`, `${p3(M.EARTH.g / 9)} м/с²`, `${p3(M.EARTH.g)} м/с²`], answer: 1,
      why: `<p>One radius <b>above the surface</b> is 2<i>R</i><sub>E</sub> from the centre, and <i>g</i> = <i>GM</i>/<i>r</i>² falls as 1/<i>r</i>²:</p><div class="eq"><i>g</i>′ = ${f(M.EARTH.g)} / 2² = ${p3(G7)} м/с²</div><p>Halving it treats gravity as 1/<i>r</i>.</p>` },
  ],
  8: [
    { q: 'Спутник B движется по круговой орбите радиусом вдвое больше радиуса орбиты спутника A вокруг той же планеты. Во сколько раз период обращения B больше периода A?',
      choices: [`${p3(Math.SQRT2)}`, `${p3(2)}`, `${p3(4)}`, `${p3(2 ** 1.5)}`], answer: 3,
      why: `<p>Kepler’s third law, <i>T</i>² ∝ <i>r</i>³, so <i>T</i> ∝ <i>r</i><sup>3/2</sup>: 2<sup>3/2</sup> = ${p3(2 ** 1.5)}. (Compare 2 <i>R</i><sub>E</sub> and 4 <i>R</i><sub>E</sub> in the table: ${f(M.orbitT(M.SAT.r1) / 3600)} h and ${f(M.orbitT(M.SAT.r2) / 3600)} h.)</p>` },
    { q: `С какой скоростью движется спутник по круговой орбите радиусом 3 R_E? (GM_E = ${f(GM / 1e14)} × 10¹⁴ м³/с², R_E = ${f(RE / 1e6)} × 10⁶ м.)`,
      choices: [`${p3(Math.sqrt(GM / RE) / 3 / 1000)} км/с`, `${p3(Math.sqrt(2 * GM / (3 * RE)) / 1000)} км/с`, `${p3(V8 / 1000)} км/с`, `${p3(Math.sqrt(GM / RE) / 1000)} км/с`], answer: 2,
      why: `<p>Gravity is the centripetal force: <i>GMm</i>/<i>r</i>² = <i>mv</i>²/<i>r</i>, so</p><div class="eq"><i>v</i> = √(<i>GM</i>/<i>r</i>) = √(${f(GM / 1e14)} × 10<sup>14</sup> / ${f(3 * RE / 1e7, 3)} × 10<sup>7</sup>) = ${p3(V8 / 1000)} км/с</div><p><i>v</i> ∝ 1/√<i>r</i>, not 1/<i>r</i>; the √2 version is the escape speed.</p>` },
  ],
  9: [
    { q: `Орбита спутника проходит от перигея на расстоянии 2 R_E до апогея на расстоянии 4 R_E от центра Земли. В перигее скорость равна ${f(VP9 / 1000)} км/с. Какова скорость в апогее?`,
      choices: [`${p3(VP9 * (RP9 / RA9) ** 2 / 1000)} км/с`, `${p3(VA9 / 1000)} км/с`, `${p3(VP9 * Math.sqrt(RP9 / RA9) / 1000)} км/с`, `${p3(2 * VP9 / 1000)} км/с`], answer: 1,
      why: `<p>Angular momentum about the Earth is conserved (gravity has no torque about it), and at both ends <i>v</i> ⟂ <i>r</i>:</p><div class="eq"><i>r</i><sub>p</sub><i>v</i><sub>p</sub> = <i>r</i><sub>a</sub><i>v</i><sub>a</sub> &nbsp;→ <i>v</i><sub>a</sub> = ${f(VP9 / 1000)} × 2/4 = ${p3(VA9 / 1000)} км/с</div><p>√(<i>GM</i>/<i>r</i>) scaling (${p3(VP9 * Math.sqrt(RP9 / RA9) / 1000)} км/с) only holds between <b>circular</b> orbits.</p>` },
    { q: 'Какая величина остаётся одинаковой в перигее и апогее спутника, движущегося по эллиптической орбите?',
      choices: ['его скорость', 'его кинетическая энергия', 'его момент импульса относительно центра Земли', 'сила гравитационного притяжения, действующая на него'], answer: 2,
      why: `<p>Gravity points at the Earth’s centre, so it exerts no torque about it and <i>L</i> = <i>mvr</i><sub>⊥</sub> stays constant. Speed and kinetic energy are largest at perigee; the force is largest there too (smaller <i>r</i>).</p>` },
  ],
  10: [
    { q: `На изображённой орбите спутник массой ${m} кг в перигее имеет кинетическую энергию K = ${GJ(KP)} ГДж и потенциальную энергию U = ${GJ(UP)} ГДж. В апогее U = ${GJ(UA)} ГДж. Чему равна кинетическая энергия K в апогее?`,
      choices: [`${p3(KP / 1e9)} ГДж`, `${p3(KP / 3 / 1e9)} ГДж`, `${p3(KA / 1e9)} ГДж`, `${p3((KP - UP + UA) / 1e9)} ГДж`], answer: 2,
      why: `<p>Only gravity acts and it is conservative, so <i>K</i> + <i>U</i> is the same at both ends:</p><div class="eq"><i>K</i><sub>a</sub> = <i>K</i><sub>p</sub> + <i>U</i><sub>p</sub> − <i>U</i><sub>a</sub> = ${GJ(KP)} + (${GJ(UP)}) − (${GJ(UA)}) = ${p3(KA / 1e9)} ГДж</div><p>Check: a third the speed, so a ninth the kinetic energy. ${p3((KP - UP + UA) / 1e9)} ГДж comes from a sign slip on the negative <i>U</i>’s.</p>` },
    { q: 'Что происходит с энергиями системы «спутник — Земля», когда спутник движется от перигея к апогею?',
      choices: ['K уменьшается, U увеличивается (становится менее отрицательной), E остаётся неизменной', 'K уменьшается, U уменьшается, E уменьшается', 'K не изменяется, U увеличивается, E увеличивается', 'K и U увеличиваются, поэтому E увеличивается'], answer: 0,
      why: `<p>Climbing out, gravity has a part against <i>v</i> and does negative work, so <i>K</i> falls. <i>U</i> = −<i>GMm</i>/<i>r</i> rises toward zero by the same amount. Нo outside force does work, so <i>E</i> = <i>K</i> + <i>U</i> is constant.</p>` },
  ],
  11: [
    { q: `Какую работу совершает сила тяжести над спутником массой ${m} кг при переходе с орбиты r = 4 R_E на орбиту r = 2 R_E? (GM_E = ${f(GM / 1e14)} × 10¹⁴ м³/с².)`,
      choices: [`${p3(-W11 / 1e9)} ГДж`, `${p3(W11 / 1e9)} ГДж`, `${p3(m * G * 2 * RE / 1e9)} ГДж`, `${p3(2 * W11 / 1e9)} ГДж`], answer: 1,
      why: `<p>The force varies with <i>r</i>, so integrate. Gravity points inward, <i>F</i><sub>r</sub> = −<i>GMm</i>/<i>r</i>²:</p><div class="eq"><i>W</i> = ∫<sub>4<i>R</i></sub><sup>2<i>R</i></sup> (−<i>GMm</i>/<i>r</i>²) d<i>r</i> = <i>GMm</i>[1/<i>r</i>]<sub>4<i>R</i></sub><sup>2<i>R</i></sup> = <i>GMm</i>/4<i>R</i> = ${p3(W11 / 1e9)} ГДж</div><p>Positive: force and displacement both point in. <i>mgh</i> with <i>h</i> = 2<i>R</i><sub>E</sub> (${p3(m * G * 2 * RE / 1e9)} ГДж) assumes <i>g</i> stays ${f(G)} м/с² all the way up.</p>` },
    { q: `Найдите точное изменение потенциальной энергии тела массой ${m} кг при подъёме с поверхности Земли на высоту h = ${f(H11 / 1000, 0)} км. Сравните результат с приближением mgh и покажите, что относительная разница составляет примерно h/R_E.`,
      solution: `<p>1. Δ<i>U</i> = −∫<sub><i>R</i></sub><sup><i>R</i>+<i>h</i></sup> <i>F</i><sub>r</sub> d<i>r</i> = ∫<sub><i>R</i></sub><sup><i>R</i>+<i>h</i></sup> <i>GMm</i>/<i>r</i>² d<i>r</i> = <i>GMm</i>(1/<i>R</i> − 1/(<i>R</i> + <i>h</i>)) = <i>GMmh</i> / [<i>R</i>(<i>R</i> + <i>h</i>)].</p><div class="eq">Δ<i>U</i> = ${f(DU11 / 1e9, 4)} ГДж</div><p>2. With <i>g</i> = <i>GM</i>/<i>R</i>² = ${f(M.EARTH.g)} м/с²: <i>mgh</i> = <i>GMmh</i>/<i>R</i>² = ${f(MGH11 / 1e9, 4)} ГДж.</p><p>3. Ratio: <i>mgh</i>/Δ<i>U</i> = (<i>R</i> + <i>h</i>)/<i>R</i> = 1 + <i>h</i>/<i>R</i> = 1 + ${f(H11 / 1000, 0)}/${f(RE / 1000, 0)} = ${f(MGH11 / DU11, 4)}. So <i>mgh</i> is ${f(100 * (MGH11 / DU11 - 1), 1)}% high, because it keeps <i>g</i> at its surface value all the way up.</p>` },
  ],
  12: [
    { q: `Чему равна скорость убегания с расстояния 4 R_E от центра Земли? (GM_E = ${f(GM / 1e14)} × 10¹⁴ м³/с², R_E = ${f(RE / 1e6)} × 10⁶ м.)`,
      choices: [`${p3(M.orbitV(4 * RE) / 1000)} км/с`, `${p3(VE12 / 1000)} км/с`, `${p3(M.vEsc(RE) / 4 / 1000)} км/с`, `${p3(2 * M.orbitV(4 * RE) / 1000)} км/с`], answer: 1,
      why: `<p>To just reach infinity, <i>E</i> = ½<i>mv</i>² − <i>GMm</i>/<i>r</i> = 0:</p><div class="eq"><i>v</i><sub>esc</sub> = √(2<i>GM</i>/<i>r</i>) = √(2 × ${f(GM / 1e14)} × 10<sup>14</sup> / ${f(4 * RE / 1e7, 3)} × 10<sup>7</sup>) = ${p3(VE12 / 1000)} км/с</div><p>It is √2 × the circular speed there (${p3(M.orbitV(4 * RE) / 1000)} км/с), not 2 ×; and it scales as 1/√<i>r</i>, not 1/<i>r</i>.</p>` },
    { q: `Спутник массой ${m} кг движется по круговой орбите радиусом r = 2 R_E. Покажите, что K = −U/2, найдите минимальную энергию для ухода из поля тяготения и необходимое увеличение скорости при одном импульсе по касательной.`,
      solution: `<p>1. Circular orbit: <i>GMm</i>/<i>r</i>² = <i>mv</i>²/<i>r</i>, so <i>K</i> = ½<i>mv</i>² = <i>GMm</i>/2<i>r</i> = −<i>U</i>/2, and <i>E</i> = <i>K</i> + <i>U</i> = −<i>GMm</i>/2<i>r</i>.</p><div class="eq"><i>E</i> = −${f(GM / 1e14)} × 10<sup>14</sup> × ${m} / (2 × ${f(R12 / 1e7, 3)} × 10<sup>7</sup>) = ${GJ(M.circE(R12))} ГДж</div><p>2. Escape needs <i>E</i> ≥ 0 (equivalently, enough <i>K</i> to supply the work ∫<sub><i>r</i></sub><sup>∞</sup> <i>GMm</i>/<i>r</i>′² d<i>r</i>′ = <i>GMm</i>/<i>r</i> against gravity). So add at least ${GJ(-M.circE(R12))} ГДж.</p><p>3. Speeds: <i>v</i><sub>c</sub> = √(<i>GM</i>/<i>r</i>) = ${f(M.orbitV(R12) / 1000)} км/с, <i>v</i><sub>esc</sub> = √(2<i>GM</i>/<i>r</i>) = ${f(M.vEsc(R12) / 1000)} км/с, so a boost of ${f((M.vEsc(R12) - M.orbitV(R12)) / 1000)} км/с along <i>v</i>.</p>` },
  ],
};
