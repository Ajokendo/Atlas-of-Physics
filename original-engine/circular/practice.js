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
// 4 · the loop's top at 9.0 m/s
const L = M.LOOP, V4 = 9.0, N4 = L.m * (V4 ** 2 / L.r - G);
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
const GJ = x => f(x / 1e9, 2);

export const PRACTICE = {
  0: [
    { q: `Шар движется по окружности с постоянной скоростью. Куда направлено его ускорение?`,
      choices: ['along its velocity, tangent to the circle', 'toward the centre of the circle', 'away from the centre', 'nowhere: constant speed means zero acceleration'], answer: 1,
      why: `<p>Velocity is a vector; its direction keeps turning toward the centre, so Δ<i>v</i> (and <i>a</i>) points to the centre, ⟂ <i>v</i>. Constant <b>speed</b> means no part of <i>a</i> along <i>v</i>, not zero <i>a</i>.</p>` },
    { q: `Шар движется по той же окружности радиусом ${f(R, 1)} м со скоростью ${f(V2, 1)} м/с вместо ${f(V1, 1)} м/с. Чему равно его центростремительное ускорение?`,
      choices: [`${p3(2 * M.ac(M.V1, B.r))} m/s²`, `${p3(M.ac(M.V1, B.r))} m/s²`, `${p3(AC0)} m/s²`, `${p3(M.ac(M.V1, B.r) / 2)} m/s²`], answer: 2,
      why: `<div class="eq"><i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i> = (${f(M.V2, 1)})² / ${f(B.r)} = ${p3(AC0)} m/s²</div><p>Speed is squared: twice the speed gives four times the ${f(M.ac(M.V1, B.r))} m/s², not twice.</p>` },
  ],
  1: [
    { q: `Шар массой ${f(M.m, 1)} кг по-прежнему движется со скоростью ${f(M.v, 1)} м/с, но длина нити уменьшена вдвое — до ${f(M.r / 2, 1)} м. Чему равно натяжение нити?`,
      choices: [`${p3(T1)} N`, `${p3(T1 / 4)} N`, `${p3(2 * T1)} N`, `${p3(T1 / 2)} N`], answer: 0,
      why: `<p>On a smooth table the tension is the only horizontal force, so it is the whole centripetal force:</p><div class="eq"><i>T</i> = <i>mv</i>²/<i>r</i> = ${f(B.m)} × (${f(M.V1, 1)})² / ${f(B.r / 2)} = ${p3(T1)} N</div><p>Halving <i>r</i> at the same speed doubles <i>T</i> (from ${f(M.tension(M.V1))} N).</p>` },
    { q: `Если смотреть сверху, нить обрывается в момент, когда шар движется по окружности. Как будет двигаться шар сразу после обрыва?`,
      choices: ['along a spiral outward', 'straight out from the centre, along the old string', 'in a straight line along the tangent at that point', 'on the same circle, slowing down'], answer: 2,
      why: `<p>With the string gone there is no horizontal force, so (first law) the ball keeps the velocity it had: tangent to the circle, in a straight line. There is no outward force to fling it radially.</p>` },
  ],
  2: [
    { q: `В дождливую погоду коэффициент статического трения шин уменьшается до ${f(MU, 2)}. С какой максимальной скоростью автомобиль может пройти плоский поворот радиусом ${f(R, 1)} м?`,
      choices: [`${p3(M.CAR.vmax)} m/s`, `${p3(M.CAR.vmax / 2)} m/s`, `${p3(MU2 * G * M.CAR.r)} m/s`, `${p3(V2MAX)} m/s`], answer: 3,
      why: `<p>At the limit, the most static friction can give is exactly the centripetal force needed: μ<sub>s</sub><i>mg</i> = <i>mv</i>²/<i>r</i>.</p><div class="eq"><i>v</i><sub>max</sub> = √(μ<sub>s</sub><i>gr</i>) = √(${f(MU2)} × ${f(G)} × ${M.CAR.r}) = ${p3(V2MAX)} m/s</div><p>Halving μ<sub>s</sub> divides <i>v</i><sub>max</sub> by √2, not 2.</p>` },
    { q: `Грузовик вдвое тяжелее автомобиля проходит тот же плоский поворот на тех же шинах с максимально возможной скоростью. Как его максимальная скорость соотносится с максимальной скоростью автомобиля?`,
      choices: ['half as large', '1/√2 as large', 'the same', '√2 times as large'], answer: 2,
      why: `<p>μ<sub>s</sub><i>mg</i> = <i>mv</i>²/<i>r</i>: the mass is on both sides and cancels, <i>v</i><sub>max</sub> = √(μ<sub>s</sub><i>gr</i>). The truck needs twice the friction, but its doubled weight lets the road supply twice as much.</p>` },
  ],
  3: [
    { q: `Шар массой ${f(M.m, 1)} кг на нити длиной ${f(M.L, 1)} м раскручивают быстрее, пока нить не образует угол ${TH}° с вертикалью. С какой скоростью движется шар?`,
      choices: [`${p3(Math.sqrt(M.CONE.L * G * Math.tan(rad(TH3))))} m/s`, `${p3(Math.sqrt(R3 * G / Math.tan(rad(TH3))))} m/s`, `${p3(V3)} m/s`, `${p3(Math.sqrt(G * M.CONE.L))} m/s`], answer: 2,
      why: `<p>The radius is the horizontal reach, <i>r</i> = <i>L</i> sin θ = ${f(R3, 3)} m, not <i>L</i>. From <i>g</i> tan θ = <i>v</i>²/<i>r</i>:</p><div class="eq"><i>v</i> = √(<i>rg</i> tan θ) = √(${f(R3, 3)} × ${f(G)} × ${f(Math.tan(rad(TH3)), 3)}) = ${p3(V3)} m/s</div><p>${p3(Math.sqrt(R3 * G / Math.tan(rad(TH3))))} m/s uses tan of the angle from the horizontal.</p>` },
    { q: `Для того же шара нить образует угол ${TH}° с вертикалью. Чему равно натяжение нити?`,
      choices: [`${p3(T3)} N`, `${p3(M.CONE.m * G * Math.cos(rad(TH3)))} N`, `${p3(M.CONE.m * G / Math.sin(rad(TH3)))} N`, `${p3(M.CONE.m * G)} N`], answer: 0,
      why: `<p>Nothing accelerates vertically, so the string’s vertical part holds up the weight:</p><div class="eq"><i>T</i> cos θ = <i>mg</i> &nbsp;→ <i>T</i> = ${f(M.CONE.m * G, 2)} / cos ${TH3}° = ${p3(T3)} N</div><p>The tension must be <b>larger</b> than <i>mg</i>, because only part of it points up; <i>mg</i> cos θ goes the wrong way.</p>` },
  ],
  4: [
    { q: `Тележка массой ${f(M.m, 1)} кг проходит верхнюю точку петли радиусом ${f(M.R, 1)} м вверх дном со скоростью ${f(M.v, 1)} м/с. С какой силой рельс давит на тележку?`,
      choices: [`${p3(L.m * (V4 ** 2 / L.r + G) / 1000)} kN`, `${p3(N4 / 1000)} kN`, `${p3(L.m * V4 ** 2 / L.r / 1000)} kN`, `${p3(L.W / 1000)} kN`], answer: 1,
      why: `<p>At the top both forces point down, toward the centre, and together they supply <i>mv</i>²/<i>r</i>:</p><div class="eq"><i>F</i><sub>N</sub> + <i>mg</i> = <i>mv</i>²/<i>r</i> &nbsp;→ <i>F</i><sub>N</sub> = ${L.m}(${f(V4 ** 2 / L.r, 2)} − ${f(G)}) = ${f(N4, 0)} N = ${p3(N4 / 1000)} kN</div><p>Adding <i>mg</i> instead is the <b>bottom</b>-of-the-loop equation.</p>` },
    { q: `Какова минимальная скорость тележки в верхней точке петли радиусом ${f(M.R, 1)} м, при которой она не потеряет контакт с рельсом?`,
      choices: [`${p3(Math.sqrt(2 * G * L.r))} m/s`, `${p3(G * L.r)} m/s`, `${p3(Math.sqrt(G * L.r / 2))} m/s`, `${p3(L.vmin)} m/s`], answer: 3,
      why: `<p>Slower means less push from the track. The limit is <i>F</i><sub>N</sub> = 0, with gravity alone supplying the centripetal force:</p><div class="eq"><i>mg</i> = <i>mv</i>²/<i>r</i> &nbsp;→ <i>v</i><sub>min</sub> = √(<i>gr</i>) = √(${f(G)} × ${f(L.r, 1)}) = ${p3(L.vmin)} m/s</div><p>The mass cancels; slower than this, gravity pulls the cart inside the circle and it leaves the track.</p>` },
  ],
  5: [
    { q: `Поворот радиусом ${f(R, 1)} м имеет такой же угол наклона ${TH}°. С какой скоростью автомобиль может пройти его без трения?`,
      choices: [`${p3(M.BANK.v)} m/s`, `${p3(Math.sqrt(R5 * G))} m/s`, `${p3(R5 * G * Math.tan(M.BANK.th))} m/s`, `${p3(V5)} m/s`], answer: 3,
      why: `<p>Vertical: <i>F</i><sub>N</sub> cos θ = <i>mg</i>. Horizontal: <i>F</i><sub>N</sub> sin θ = <i>mv</i>²/<i>r</i>. Divide:</p><div class="eq">tan θ = <i>v</i>²/(<i>rg</i>) &nbsp;→ <i>v</i> = √(${R5} × ${f(G)} × tan ${M.BANK.thetaDeg}°) = ${p3(V5)} m/s</div><p>Four times the radius, twice the speed of the ${f(M.BANK.v)} m/s on the ${M.BANK.r} m curve.</p>` },
    { q: `На обледенелом (лишённом трения) наклонном повороте автомобиль движется быстрее расчётной скорости для данного угла наклона. Что произойдёт?`,
      choices: ['It drifts up the bank, toward the outside of the curve.', 'It slides down the bank, toward the inside.', 'It follows the curve, because the normal force grows to match.', 'It stops turning and moves straight down the slope.'], answer: 0,
      why: `<p>With no friction the normal force must both hold the car up (<i>F</i><sub>N</sub> cos θ = <i>mg</i>) and turn it, so its horizontal part is fixed at <i>mg</i> tan θ. A faster car needs more than that, so it can’t follow the circle and drifts to a larger radius, up the bank.</p>` },
  ],
  6: [
    { q: `Пластинка вращается со скоростью 33⅓ об/мин. С какой линейной скоростью движется пылинка на расстоянии ${f(r, 2)} м от центра?`,
      choices: [`${p3(R6 * RPM6 / 60)} m/s`, `${p3(V6)} m/s`, `${p3(R6 * RPM6)} m/s`, `${p3(2 * R6 * RPM6 * 2 * Math.PI / 60)} m/s`], answer: 1,
      why: `<p>Convert to rad/s first: ω = 33⅓ × 2π/60 = ${f(RPM6 * 2 * Math.PI / 60, 3)} rad/s. Then</p><div class="eq"><i>v</i> = <i>r</i>ω = ${f(R6)} × ${f(RPM6 * 2 * Math.PI / 60, 3)} = ${p3(V6)} m/s</div><p><i>v</i> = <i>r</i>ω only works with ω in rad/s; ${p3(R6 * RPM6)} uses rpm directly, ${p3(R6 * RPM6 / 60)} uses rev/s and forgets 2π.</p>` },
    { q: `Два блока находятся на расстояниях ${f(r1, 2)} м и ${f(r2, 2)} м от центра вращающегося диска. Во сколько раз центростремительное ускорение внешнего блока больше, чем внутреннего?`,
      choices: ['half as large', 'the same', 'twice as large', 'four times as large'], answer: 2,
      why: `<p>Both share one ω, so <i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i> = <i>r</i>ω² grows in proportion to <i>r</i>. (Using <i>v</i>²/<i>r</i>, <i>v</i> doubles but so does <i>r</i>: 4/2 = 2, not 4.)</p>` },
  ],
  7: [
    { q: `Два шара притягиваются с силой F. Массу одного шара увеличивают втрое, а расстояние между центрами увеличивают вдвое. Чему станет равна сила притяжения?`,
      choices: [`${(3 / 4).toFixed(3)} <i>F</i>`, `${(3 / 2).toFixed(2)} <i>F</i>`, `${(3 / 8).toFixed(3)} <i>F</i>`, `${(3 * 4).toFixed(1)} <i>F</i>`], answer: 0,
      why: `<p><i>F</i> ∝ <i>m</i><sub>1</sub><i>m</i><sub>2</sub>/<i>r</i>²: multiply the factors, 3 × 1 / 2² = ¾. Forgetting to square <i>r</i> gives 1.5 <i>F</i>.</p>` },
    { q: `Чему равно ускорение свободного падения на высоте, равной радиусу Земли над её поверхностью? У поверхности g = ${f(G, 2)} м/с².`,
      choices: [`${p3(M.EARTH.g / 2)} m/s²`, `${p3(G7)} m/s²`, `${p3(M.EARTH.g / 9)} m/s²`, `${p3(M.EARTH.g)} m/s²`], answer: 1,
      why: `<p>One radius <b>above the surface</b> is 2<i>R</i><sub>E</sub> from the centre, and <i>g</i> = <i>GM</i>/<i>r</i>² falls as 1/<i>r</i>²:</p><div class="eq"><i>g</i>′ = ${f(M.EARTH.g)} / 2² = ${p3(G7)} m/s²</div><p>Halving it treats gravity as 1/<i>r</i>.</p>` },
  ],
  8: [
    { q: `Спутник B движется по круговой орбите радиусом вдвое больше радиуса орбиты спутника A вокруг той же планеты. Во сколько раз период обращения B больше периода A?`,
      choices: [`${p3(Math.SQRT2)}`, `${p3(2)}`, `${p3(4)}`, `${p3(2 ** 1.5)}`], answer: 3,
      why: `<p>Kepler’s third law, <i>T</i>² ∝ <i>r</i>³, so <i>T</i> ∝ <i>r</i><sup>3/2</sup>: 2<sup>3/2</sup> = ${p3(2 ** 1.5)}. (Compare 2 <i>R</i><sub>E</sub> and 4 <i>R</i><sub>E</sub> in the table: ${f(M.orbitT(M.SAT.r1) / 3600)} h and ${f(M.orbitT(M.SAT.r2) / 3600)} h.)</p>` },
    { q: `С какой скоростью движется спутник по круговой орбите радиусом 3RE? (GME = ${GM} × 10¹⁴ м³/с², RE = ${RE} × 10⁶ м.)`,
      choices: [`${p3(Math.sqrt(GM / RE) / 3 / 1000)} km/s`, `${p3(Math.sqrt(2 * GM / (3 * RE)) / 1000)} km/s`, `${p3(V8 / 1000)} km/s`, `${p3(Math.sqrt(GM / RE) / 1000)} km/s`], answer: 2,
      why: `<p>Gravity is the centripetal force: <i>GMm</i>/<i>r</i>² = <i>mv</i>²/<i>r</i>, so</p><div class="eq"><i>v</i> = √(<i>GM</i>/<i>r</i>) = √(${f(GM / 1e14)} × 10<sup>14</sup> / ${f(3 * RE / 1e7, 3)} × 10<sup>7</sup>) = ${p3(V8 / 1000)} km/s</div><p><i>v</i> ∝ 1/√<i>r</i>, not 1/<i>r</i>; the √2 version is the escape speed.</p>` },
  ],
  9: [
    { q: `Орбита спутника изменяется от перигея на расстоянии 2RE до апогея на расстоянии 4RE от центра Земли. В перигее скорость равна ${vP} км/с. Какова скорость в апогее?`,
      choices: [`${p3(VP9 * (RP9 / RA9) ** 2 / 1000)} km/s`, `${p3(VA9 / 1000)} km/s`, `${p3(VP9 * Math.sqrt(RP9 / RA9) / 1000)} km/s`, `${p3(2 * VP9 / 1000)} km/s`], answer: 1,
      why: `<p>Angular momentum about the Earth is conserved (gravity has no torque about it), and at both ends <i>v</i> ⟂ <i>r</i>:</p><div class="eq"><i>r</i><sub>p</sub><i>v</i><sub>p</sub> = <i>r</i><sub>a</sub><i>v</i><sub>a</sub> &nbsp;→ <i>v</i><sub>a</sub> = ${f(VP9 / 1000)} × 2/4 = ${p3(VA9 / 1000)} km/s</div><p>√(<i>GM</i>/<i>r</i>) scaling (${p3(VP9 * Math.sqrt(RP9 / RA9) / 1000)} km/s) only holds between <b>circular</b> orbits.</p>` },
    { q: `Какая величина остаётся одинаковой в перигее и апогее спутника, движущегося по эллиптической орбите?`,
      choices: ['its speed', 'its kinetic energy', 'its angular momentum about the Earth’s centre', 'the gravitational force on it'], answer: 2,
      why: `<p>Gravity points at the Earth’s centre, so it exerts no torque about it and <i>L</i> = <i>mvr</i><sub>⊥</sub> stays constant. Speed and kinetic energy are largest at perigee; the force is largest there too (smaller <i>r</i>).</p>` },
  ],
  10: [
    { q: `На изображённой орбите спутник массой ${f(M.m, 1)} кг в перигее имеет кинетическую энергию K = ${f(Kp, 1)} ГДж и потенциальную энергию U = ${f(Up, 1)} ГДж. В апогее U = ${f(Ua, 1)} ГДж. Чему равна кинетическая энергия K в апогее?`,
      choices: [`${p3(KP / 1e9)} GJ`, `${p3(KP / 3 / 1e9)} GJ`, `${p3(KA / 1e9)} GJ`, `${p3((KP - UP + UA) / 1e9)} GJ`], answer: 2,
      why: `<p>Only gravity acts and it is conservative, so <i>K</i> + <i>U</i> is the same at both ends:</p><div class="eq"><i>K</i><sub>a</sub> = <i>K</i><sub>p</sub> + <i>U</i><sub>p</sub> − <i>U</i><sub>a</sub> = ${GJ(KP)} + (${GJ(UP)}) − (${GJ(UA)}) = ${p3(KA / 1e9)} GJ</div><p>Check: a third the speed, so a ninth the kinetic energy. ${p3((KP - UP + UA) / 1e9)} GJ comes from a sign slip on the negative <i>U</i>’s.</p>` },
    { q: `Что происходит с энергиями системы «спутник — Земля», когда спутник движется от перигея к апогею?`,
      choices: ['K decreases, U increases (gets less negative), E stays the same', 'K decreases, U decreases, E decreases', 'K stays the same, U increases, E increases', 'K and U both increase, so E increases'], answer: 0,
      why: `<p>Climbing out, gravity has a part against <i>v</i> and does negative work, so <i>K</i> falls. <i>U</i> = −<i>GMm</i>/<i>r</i> rises toward zero by the same amount. No outside force does work, so <i>E</i> = <i>K</i> + <i>U</i> is constant.</p>` },
  ],
  11: [
    { q: `Какую работу совершает сила тяжести над спутником массой ${f(M.m, 1)} кг, когда он падает с орбиты r = 4RE на орбиту r = 2RE? (GME = ${GM} × 10¹⁴ м³/с².)`,
      choices: [`${p3(-W11 / 1e9)} GJ`, `${p3(W11 / 1e9)} GJ`, `${p3(m * G * 2 * RE / 1e9)} GJ`, `${p3(2 * W11 / 1e9)} GJ`], answer: 1,
      why: `<p>The force varies with <i>r</i>, so integrate. Gravity points inward, <i>F</i><sub>r</sub> = −<i>GMm</i>/<i>r</i>²:</p><div class="eq"><i>W</i> = ∫<sub>4<i>R</i></sub><sup>2<i>R</i></sup> (−<i>GMm</i>/<i>r</i>²) d<i>r</i> = <i>GMm</i>[1/<i>r</i>]<sub>4<i>R</i></sub><sup>2<i>R</i></sup> = <i>GMm</i>/4<i>R</i> = ${p3(W11 / 1e9)} GJ</div><p>Positive: force and displacement both point in. <i>mgh</i> with <i>h</i> = 2<i>R</i><sub>E</sub> (${p3(m * G * 2 * RE / 1e9)} GJ) assumes <i>g</i> stays ${f(G)} m/s² all the way up.</p>` },
    { q: `Найдите точное изменение потенциальной энергии тела массой ${f(m, 1)} кг при подъёме с поверхности Земли на высоту h = ${f(h, 1)} км. Сравните результат с приближением mgh и покажите, что относительная разница составляет примерно h/RE.`,
      solution: `<p>1. Δ<i>U</i> = −∫<sub><i>R</i></sub><sup><i>R</i>+<i>h</i></sup> <i>F</i><sub>r</sub> d<i>r</i> = ∫<sub><i>R</i></sub><sup><i>R</i>+<i>h</i></sup> <i>GMm</i>/<i>r</i>² d<i>r</i> = <i>GMm</i>(1/<i>R</i> − 1/(<i>R</i> + <i>h</i>)) = <i>GMmh</i> / [<i>R</i>(<i>R</i> + <i>h</i>)].</p><div class="eq">Δ<i>U</i> = ${f(DU11 / 1e9, 4)} GJ</div><p>2. With <i>g</i> = <i>GM</i>/<i>R</i>² = ${f(M.EARTH.g)} m/s²: <i>mgh</i> = <i>GMmh</i>/<i>R</i>² = ${f(MGH11 / 1e9, 4)} GJ.</p><p>3. Ratio: <i>mgh</i>/Δ<i>U</i> = (<i>R</i> + <i>h</i>)/<i>R</i> = 1 + <i>h</i>/<i>R</i> = 1 + ${f(H11 / 1000, 0)}/${f(RE / 1000, 0)} = ${f(MGH11 / DU11, 4)}. So <i>mgh</i> is ${f(100 * (MGH11 / DU11 - 1), 1)}% high, because it keeps <i>g</i> at its surface value all the way up.</p>` },
  ],
  12: [
    { q: `Чему равна скорость убегания с расстояния 4RE от центра Земли? (GME = ${GM} × 10¹⁴ м³/с², RE = ${RE} × 10⁶ м.)`,
      choices: [`${p3(M.orbitV(4 * RE) / 1000)} km/s`, `${p3(VE12 / 1000)} km/s`, `${p3(M.vEsc(RE) / 4 / 1000)} km/s`, `${p3(2 * M.orbitV(4 * RE) / 1000)} km/s`], answer: 1,
      why: `<p>To just reach infinity, <i>E</i> = ½<i>mv</i>² − <i>GMm</i>/<i>r</i> = 0:</p><div class="eq"><i>v</i><sub>esc</sub> = √(2<i>GM</i>/<i>r</i>) = √(2 × ${f(GM / 1e14)} × 10<sup>14</sup> / ${f(4 * RE / 1e7, 3)} × 10<sup>7</sup>) = ${p3(VE12 / 1000)} km/s</div><p>It is √2 × the circular speed there (${p3(M.orbitV(4 * RE) / 1000)} km/s), not 2 ×; and it scales as 1/√<i>r</i>, not 1/<i>r</i>.</p>` },
    { q: `Спутник массой ${f(m, 1)} кг движется по круговой орбите радиусом r = 2RE. Покажите, что K = −U/2, затем найдите минимальную энергию, которую нужно сообщить спутнику для ухода из поля тяготения, и необходимое увеличение скорости при одном импульсе в касательном направлении.`,
      solution: `<p>1. Circular orbit: <i>GMm</i>/<i>r</i>² = <i>mv</i>²/<i>r</i>, so <i>K</i> = ½<i>mv</i>² = <i>GMm</i>/2<i>r</i> = −<i>U</i>/2, and <i>E</i> = <i>K</i> + <i>U</i> = −<i>GMm</i>/2<i>r</i>.</p><div class="eq"><i>E</i> = −${f(GM / 1e14)} × 10<sup>14</sup> × ${m} / (2 × ${f(R12 / 1e7, 3)} × 10<sup>7</sup>) = ${GJ(M.circE(R12))} GJ</div><p>2. Escape needs <i>E</i> ≥ 0 (equivalently, enough <i>K</i> to supply the work ∫<sub><i>r</i></sub><sup>∞</sup> <i>GMm</i>/<i>r</i>′² d<i>r</i>′ = <i>GMm</i>/<i>r</i> against gravity). So add at least ${GJ(-M.circE(R12))} GJ.</p><p>3. Speeds: <i>v</i><sub>c</sub> = √(<i>GM</i>/<i>r</i>) = ${f(M.orbitV(R12) / 1000)} km/s, <i>v</i><sub>esc</sub> = √(2<i>GM</i>/<i>r</i>) = ${f(M.vEsc(R12) / 1000)} km/s, so a boost of ${f((M.vEsc(R12) - M.orbitV(R12)) / 1000)} km/s along <i>v</i>.</p>` },
  ],
};
