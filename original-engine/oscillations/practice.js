// oscillations/practice.js — AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from the model or from the givens; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const G = M.G, TAU = 2 * Math.PI;
const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const sg = (x, n = 2) => (x > 1e-12 ? '+' : '') + f(x, n);

// 1 · Hooke: the block at x = −0.20 m and at +0.25 m
const x1 = -0.20, x1b = 0.25;
// 2 · speed at x = 0.30 m
const x2 = 0.30, v2 = M.W * Math.sqrt(M.A ** 2 - x2 ** 2);
// 3 · energy at x = A/2
const K3 = 0.5 * M.K * (M.A ** 2 - (M.A / 2) ** 2);
// 4 · a 0.50 kg block on the same spring; the 1.0 kg block's spring force at the bottom
const m4 = 0.50, d4 = m4 * G / M.K, Fbot = M.K * (M.D + M.HANG.A);
// 5 · the 1.5 m pendulum on the Moon; its fastest speed
const gMoon = 1.62, Tmoon = TAU * Math.sqrt(M.PEND.L / gMoon), vmax5 = M.vmaxPendulum(M.PEND.L, M.PEND.th0);
// 6 · doubling the period; a pendulum for 3.0 s
const k6 = M.K / 4, T6 = 3.0, L6 = G * (T6 / TAU) ** 2, TL = M.periodPendulum(M.DOUBLE.L);
// 8 · the pushed start (Physics C)
const St = M.STARTS[1], t8 = (Math.PI / 2 - St.phi) / M.W;
// 9 · the rod and the hoop (Physics C)
const R = M.ROD, H = M.HOOP;
// 10 · the torsion pendulum (Physics C)
const Ts = M.TORS, wT = TAU / Ts.T;
// 11 · the car with 300 kg aboard; the swing
const C = M.CAR, m11 = C.m + 300, T11 = M.periodSpring(m11, C.k), Sw = M.SWING;

export const PRACTICE = {
  0: [
    { q: `Брусок совершает колебания с амплитудой A = ${f(M.A)} м. Какой путь он проходит за один полный период?`,
      choices: ['0 м', `${f(M.A)} м`, `${f(2 * M.A)} м`, `${f(4 * M.A)} м`], answer: 3,
      why: `<p>From +<i>A</i> to −<i>A</i> is 2<i>A</i>, and back again is another 2<i>A</i>: 4<i>A</i> = ${f(4 * M.A)} m. Its <i>displacement</i> over a period is 0, since it ends where it started.</p>` },
    { q: `Период колебаний равен ${f(M.T0, 3)} с. Чему равна частота?`,
      choices: [`${f(M.T0)} Гц`, `${f(M.F0, 3)} Гц`, `${f(M.W)} Гц`, `${f(1 / M.W, 3)} Гц`], answer: 1,
      why: `<div class="eq"><i>f</i> = 1/<i>T</i> = 1/${f(M.T0, 3)} = ${f(M.F0, 3)} Гц</div><p>${f(M.W)} is ω = 2π<i>f</i> in рад/с, the angular frequency, not cycles per second.</p>` },
  ],
  1: [
    { q: `Считаем направление вправо от положения равновесия положительным. Пружина имеет жёсткость k = ${M.K} Н/м, а брусок находится в точке x = ${f(x1)} м. Чему равна сила упругости, действующая на него?`,
      choices: [`${sg(-M.K * x1)} Н`, `${sg(M.K * x1)} Н`, `${sg(-M.K / x1, 1)} Н`, `${sg(-0.5 * M.K * x1)} Н`], answer: 0,
      why: `<div class="eq"><i>F</i><sub>s</sub> = −<i>k</i>Δ<i>x</i> = −${M.K} × (${f(x1)}) = ${sg(-M.K * x1)} Н</div><p>Squashed to the left, the spring pushes right, toward equilibrium. ${sg(M.K * x1)} Н drops the minus sign.</p>` },
    { q: `Чему равно ускорение бруска массой ${f(M.M1, 1)} кг в точке x = ${sg(x1b)} м?`,
      choices: [`${sg(M.K * x1b / M.M1)} м/с²`, `${sg(-M.W * x1b)} м/с²`, `${sg(-M.AMAX)} м/с²`, `${sg(-M.K * x1b / M.M1)} м/с²`], answer: 3,
      why: `<div class="eq"><i>a</i> = −(<i>k</i>/<i>m</i>)<i>x</i> = −(${M.K}/${f(M.M1, 1)}) × ${f(x1b)} = ${sg(-M.K * x1b / M.M1)} м/с²</div><p>The acceleration is not constant: ${sg(-M.AMAX)} м/с² is its value only at <i>x</i> = +<i>A</i>. −ω<i>x</i> forgets to square ω.</p>` },
  ],
  2: [
    { q: `В какой момент времени брусок находится в положении x = +A?`,
      choices: ['<i>v</i> = 0 and <i>a</i> = 0', '<i>v</i> is greatest and <i>a</i> = 0', '<i>v</i> = 0 and <i>a</i> is greatest, toward −<i>x</i>', '<i>v</i> = 0 and <i>a</i> is greatest, toward +<i>x</i>'], answer: 2,
      why: '<p>The <i>x</i>–<i>t</i> graph has a peak there: zero slope, so <i>v</i> = 0. And <i>a</i> = −ω²<i>x</i> is largest in size and points back toward equilibrium, −<i>x</i>.</p>' },
    { q: `При амплитуде A = ${f(M.A)} м и угловой частоте ω = ${f(M.W, 1)} рад/с с какой скоростью движется брусок в точке x = ${f(x2)} м?`,
      choices: [`${f(M.VMAX)} м/с`, `${f(M.W * x2)} м/с`, `${f(v2)} м/с`, `${f(M.W * (M.A - x2))} м/с`], answer: 2,
      why: `<p>From energy, ½<i>mv</i>² = ½<i>k</i>(<i>A</i>² − <i>x</i>²), so</p><div class="eq"><i>v</i> = ω√(<i>A</i>² − <i>x</i>²) = ${f(M.W, 1)} × √(${f(M.A ** 2)} − ${f(x2 ** 2)}) = ${f(v2)} м/с</div><p>${f(M.VMAX)} м/с is the speed only at <i>x</i> = 0.</p>` },
  ],
  3: [
    { q: `Полная энергия колебаний ½kA² = ${f(M.E)} Дж. Чему равна кинетическая энергия бруска при x = A/2?`,
      choices: [`${f(M.E / 2)} Дж`, `${f(K3)} Дж`, `${f(M.E - K3)} Дж`, `${f(M.E)} Дж`], answer: 1,
      why: `<div class="eq"><i>U</i> = ½<i>k</i>(<i>A</i>/2)² = ¼ × ½<i>kA</i>² = ${f(M.E - K3)} Дж &nbsp;⇒&nbsp; <i>K</i> = ${f(M.E)} − ${f(M.E - K3)} = ${f(K3)} Дж</div><p>Halfway out is not half the energy: <i>U</i> grows as <i>x</i>². ${f(M.E - K3)} Дж is the spring’s share.</p>` },
    { q: `Амплитуду колебаний увеличивают вдвое. Как изменятся полная энергия и максимальная скорость?`,
      choices: ['энергия ×2, максимальная скорость ×2', 'энергия ×4, максимальная скорость ×2', 'энергия ×4, максимальная скорость ×4', 'энергия ×2, максимальная скорость ×√2'], answer: 1,
      why: '<p><i>E</i> = ½<i>kA</i>² grows 4×. <i>v</i><sub>max</sub> = ω<i>A</i>, and ω = √(<i>k</i>/<i>m</i>) does not change, so it doubles (4× the kinetic energy ⇒ 2× the speed).</p>' },
  ],
  4: [
    { q: `Брусок массой ${f(m4)} кг подвешивают к той же пружине жёсткостью ${M.K} Н/м. На сколько растянется пружина в новом положении равновесия?`,
      choices: [`${f(m4 / M.K, 4)} м`, `${f(M.D, 3)} м`, `${f(M.K / (m4 * G), 2)} м`, `${f(d4, 3)} м`], answer: 3,
      why: `<div class="eq"><i>kd</i> = <i>mg</i> &nbsp;⇒&nbsp; <i>d</i> = ${f(m4)} × ${f(G)} / ${M.K} = ${f(d4, 3)} м</div><p>Half the mass, half the sag (${f(M.D, 3)} m was for ${f(M.M1, 1)} kg). ${f(m4 / M.K, 4)} m forgets <i>g</i>: it uses mass, not weight; ${f(M.K / (m4 * G), 2)} m turns the formula upside down.</p>` },
    { q: `Брусок массой ${f(M.M1, 1)} кг колеблется на ${f(M.HANG.A)} м относительно положения равновесия (статическое удлинение пружины равно ${f(M.D, 3)} м). Чему равна сила пружины в нижней точке?`,
      choices: [`${f(M.WEIGHT)} Н`, `${f(Fbot)} Н`, `${f(M.K * M.HANG.A)} Н`, `${f(M.K * (M.D - M.HANG.A))} Н`], answer: 1,
      why: `<p>At the bottom the spring is stretched <i>d</i> + <i>A</i> = ${f(M.D + M.HANG.A, 4)} m:</p><div class="eq"><i>F</i><sub>s</sub> = <i>k</i>(<i>d</i> + <i>A</i>) = ${M.K} × ${f(M.D + M.HANG.A, 4)} = ${f(Fbot)} Н</div><p>That is ${f(M.K * M.HANG.A)} Н more than the weight: a net ${f(M.K * M.HANG.A)} Н upward, back toward equilibrium. ${f(M.K * (M.D - M.HANG.A))} Н is the force at the top.</p>` },
  ],
  5: [
    { q: `Маятник длиной ${f(M.PEND.L, 1)} м имеет период ${f(M.P_T)} с на Земле. Его переносят на Луну, где g = ${f(gMoon)} м/с². Чему будет равен его период?`,
      choices: [`${f(Tmoon)} с`, `${f(M.P_T)} с`, `${f(M.P_T * G / gMoon, 1)} с`, `${f(M.P_T * Math.sqrt(gMoon / G), 3)} с`], answer: 0,
      why: `<div class="eq"><i>T</i> = 2π√(<i>L</i>/<i>g</i>) = 2π√(${f(M.PEND.L, 1)}/${f(gMoon)}) = ${f(Tmoon)} с</div><p>Weaker gravity, slower swing, but only by √(${f(G)}/${f(gMoon)}) = ${f(Math.sqrt(G / gMoon))}, not by the full ratio ${f(G)}/${f(gMoon)} = ${f(G / gMoon)}, which gives ${f(M.P_T * G / gMoon, 1)} s.</p>` },
    { q: `Тот же маятник отпускают из состояния покоя под углом ${(M.PEND.th0 / M.DEG).toFixed(0)}° к вертикали. С какой скоростью груз проходит нижнюю точку?`,
      choices: [`${f(Math.sqrt(2 * G * M.PEND.L * Math.sin(M.PEND.th0)))} м/с`, `${f(Math.sqrt(2 * G * M.PEND.L))} м/с`, `${f(Math.sqrt(G * M.PEND.L * (1 - Math.cos(M.PEND.th0))), 3)} м/с`, `${f(vmax5, 3)} м/с`], answer: 3,
      why: `<p>It drops Δ<i>y</i> = <i>L</i>(1 − cos θ<sub>0</sub>) = ${f(M.PEND.L * (1 - Math.cos(M.PEND.th0)) * 100, 2)} см.</p><div class="eq"><i>v</i> = √(2<i>g</i>Δ<i>y</i>) = ${f(vmax5, 3)} м/с</div><p>√(2<i>gL</i>) would need a drop of the whole string length; sin θ<sub>0</sub> gives a sideways distance, not a height.</p>` },
  ],
  6: [
    { q: `Брусок массой ${f(M.DOUBLE.m, 1)} кг на пружине жёсткостью ${M.K} Н/м имеет период ${f(M.periodSpring(M.DOUBLE.m, M.K))} с. Какой должна стать жёсткость пружины, чтобы период удвоился?`,
      choices: [`${f(M.K / 2, 1)} Н/м`, `${f(2 * M.K, 1)} Н/м`, `${f(k6, 1)} Н/м`, `${f(4 * M.K, 1)} Н/м`], answer: 2,
      why: `<p><i>T</i> ∝ 1/√<i>k</i>. For 2<i>T</i>, √(<i>k</i><sub>new</sub>) must be half of √<i>k</i>, so <i>k</i><sub>new</sub> = <i>k</i>/4 = ${f(k6, 1)} Н/м. Halving <i>k</i> only gives √2 × the period; a stiffer spring makes it shorter.</p>` },
    { q: `Маятник длиной ${f(M.DOUBLE.L)} м имеет период ${f(TL)} с. Какой должна быть его длина, чтобы период стал равен ${f(T6, 1)} с?`,
      choices: [`${f(M.DOUBLE.L * T6 / TL)} м`, `${f(G * T6 / TAU)} м`, `${f(G * T6 ** 2 / 4, 1)} м`, `${f(L6)} м`], answer: 3,
      why: `<div class="eq"><i>L</i> = <i>g</i>(<i>T</i>/2π)² = ${f(G)} × (${f(T6, 1)}/2π)² = ${f(L6)} м</div><p>Or by proportion: <i>L</i> ∝ <i>T</i>², so ${f(M.DOUBLE.L)} × (${f(T6, 1)}/${f(TL)})² = ${f(L6)} m. Scaling <i>L</i> by the time ratio itself gives ${f(M.DOUBLE.L * T6 / TL)} m.</p>` },
  ],
  7: [
    { q: `Горизонтальный пружинный маятник оттягивают перед отпусканием вдвое дальше, чем раньше. Как изменятся его период и максимальная скорость?`,
      choices: ['период не изменится, максимальная скорость удвоится', 'период удвоится, максимальная скорость не изменится', 'обе величины не изменятся', 'период ×√2, максимальная скорость удвоится'], answer: 0,
      why: '<p><i>T</i> = 2π√(<i>m</i>/<i>k</i>) has no <i>A</i> in it. Twice the distance, twice the force, twice the acceleration: it covers twice the ground in the same time, so <i>v</i><sub>max</sub> = ω<i>A</i> doubles.</p>' },
    { q: `Какое изменение приведёт к изменению периода простых маятниковых часов?`,
      choices: ['груз в четыре раза большей массы', 'уменьшение угла отклонения с 8° до 4°', 'перенос маятника на Луну', 'начало движения с толчка вместо отпускания из состояния покоя'], answer: 2,
      why: '<p><i>T</i> = 2π√(<i>L</i>/<i>g</i>) depends only on <i>L</i> and <i>g</i>. Mass cancels (<i>ma</i> = −<i>mg</i> sin θ), small amplitudes all give the same period, and a push only changes the amplitude.</p>' },
  ],
  8: [
    { q: `Брусок массой ${f(M.M1, 1)} кг на пружине жёсткостью ${M.K} Н/м начинает движение из положения x0 = ${f(St.x0)} м со скоростью v0 = ${f(St.v0, 1)} м/с. Чему равна амплитуда колебаний?`,
      choices: [`${f(St.A, 3)} м`, `${f(St.x0, 3)} м`, `${f(St.x0 + Math.abs(St.v0) / M.W, 3)} м`, `${f(Math.hypot(St.x0, St.v0), 3)} м`], answer: 0,
      why: `<p>ω = √(<i>k</i>/<i>m</i>) = ${f(M.W, 1)} рад/с. From energy, ½<i>kA</i>² = ½<i>kx</i><sub>0</sub>² + ½<i>mv</i><sub>0</sub>²:</p><div class="eq"><i>A</i> = √(<i>x</i><sub>0</sub>² + (<i>v</i><sub>0</sub>/ω)²) = √(${f(St.x0)}² + ${f(Math.abs(St.v0) / M.W)}²) = ${f(St.A, 3)} м</div><p>The push adds energy, so <i>A</i> &gt; <i>x</i><sub>0</sub>. The two parts add as squares, not directly; √(<i>x</i><sub>0</sub>² + <i>v</i><sub>0</sub>²) mixes metres with metres per second.</p>` },
    { q: `Развёрнутый ответ. Покажите, что функция x = A cos(ωt + φ) является решением уравнения m d²x/dt² = −kx. Для описанного выше толкнутого бруска найдите фазу φ и первый момент времени, когда он проходит через x = 0.`,
      solution: `<p>Differentiate twice: d<i>x</i>/d<i>t</i> = −<i>A</i>ω sin(ω<i>t</i> + φ), d²<i>x</i>/d<i>t</i>² = −<i>A</i>ω² cos(ω<i>t</i> + φ) = −ω²<i>x</i>. This equals −(<i>k</i>/<i>m</i>)<i>x</i> for every <i>t</i> if ω = √(<i>k</i>/<i>m</i>) = ${f(M.W, 1)} рад/с.</p><p>At <i>t</i> = 0: <i>A</i> cos φ = ${f(St.x0)} m and −<i>A</i>ω sin φ = ${f(St.v0, 1)} м/с, so tan φ = −<i>v</i><sub>0</sub>/ω<i>x</i><sub>0</sub> = ${f(-St.v0 / (M.W * St.x0), 3)} with cos φ &gt; 0:</p><div class="eq">φ = ${f(St.phi / M.DEG, 1)}° = ${f(St.phi, 3)} rad, &nbsp; <i>A</i> = ${f(St.A, 3)} м</div><p>It first reaches <i>x</i> = 0 when ω<i>t</i> + φ = π/2:</p><div class="eq"><i>t</i> = (π/2 − φ)/ω = (${f(Math.PI / 2, 3)} − ${f(St.phi, 3)})/${f(M.W, 1)} = ${f(t8, 3)} с</div><p>Sooner than a quarter period (${f(M.T0 / 4, 3)} s), because it starts closer and already moving toward equilibrium.</p>` },
  ],
  9: [
    { q: `Однородный стержень длиной ${f(R.L, 1)} м совершает малые колебания вокруг оси, проходящей через один конец. Чему равен период колебаний?`,
      choices: [`${f(M.periodPendulum(R.L))} с`, `${f(M.periodPendulum(R.L / 2))} с`, `${f(R.T)} с`, `${f(M.periodPhysical(R.m, R.d, R.Icm))} с`], answer: 2,
      why: `<p><i>I</i> about the end = <i>I</i><sub>cm</sub> + <i>m</i>(<i>L</i>/2)² = <i>mL</i>²/12 + <i>mL</i>²/4 = <i>mL</i>²/3, and <i>d</i> = <i>L</i>/2:</p><div class="eq"><i>T</i> = 2π√(<i>I</i>/<i>mgd</i>) = 2π√(2<i>L</i>/3<i>g</i>) = ${f(R.T)} с</div><p>${f(M.periodPendulum(R.L / 2))} s treats it as a bob at its centre of mass; ${f(M.periodPhysical(R.m, R.d, R.Icm))} s uses <i>I</i><sub>cm</sub> instead of <i>I</i> about the pivot.</p>` },
    { q: `Развёрнутый ответ. Тонкое кольцо радиусом R = ${f(H.R)} м подвешено за обод на гвозде. Найдите момент инерции относительно точки подвеса, запишите уравнение движения для малых колебаний в плоскости кольца и определите период.`,
      solution: `<p>About its centre every bit of a hoop is at distance <i>R</i>: <i>I</i><sub>cm</sub> = ∫<i>R</i>² d<i>m</i> = <i>mR</i>². The nail is <i>d</i> = <i>R</i> from the centre, so by parallel axes <i>I</i> = <i>mR</i>² + <i>mR</i>² = 2<i>mR</i>².</p><p>Gravity acts at the centre: τ = −<i>mgR</i> sin θ ≈ −<i>mgR</i>θ. With τ = <i>I</i>α:</p><div class="eq">d²θ/d<i>t</i>² = −(<i>mgR</i>/2<i>mR</i>²)θ = −(<i>g</i>/2<i>R</i>)θ</div><p>SHM with ω = √(<i>g</i>/2<i>R</i>), independent of mass:</p><div class="eq"><i>T</i> = 2π√(2<i>R</i>/<i>g</i>) = 2π√(${f(2 * H.R)}/${f(G)}) = ${f(H.T)} с</div><p>The same as a simple pendulum as long as the hoop is wide (${f(2 * H.R)} m).</p>` },
  ],
  10: [
    { q: `Диск массой ${f(Ts.M, 1)} кг на проволоке совершает колебания с периодом ${f(Ts.T)} с. Его заменяют диском той же массы, но вдвое большего радиуса. Каким станет новый период?`,
      choices: [`${f(Ts.T)} с`, `${f(Ts.T * Math.SQRT2)} с`, `${f(2 * Ts.T)} с`, `${f(4 * Ts.T, 1)} с`], answer: 2,
      why: `<p><i>I</i> = ½<i>MR</i>² grows 4× with twice the radius, and <i>T</i> = 2π√(<i>I</i>/κ) grows √4 = 2×: ${f(2 * Ts.T)} s. Same wire, same κ.</p>` },
    { q: `Развёрнутый ответ. Диск (I = ${f(Ts.I, 3)} кг·м², κ = ${Ts.kappa} Н·м/рад) поворачивают на ${(Ts.th0 / M.DEG).toFixed(0)}° и отпускают из состояния покоя. Запишите θ(t), найдите максимальный крутящий момент и максимальную угловую скорость.`,
      solution: `<p><i>I</i> d²θ/d<i>t</i>² = −κθ, so θ = θ<sub>0</sub> cos(ω<i>t</i>) with ω = √(κ/<i>I</i>) = √(${Ts.kappa}/${f(Ts.I, 3)}) = ${f(wT, 3)} рад/с and θ<sub>0</sub> = ${(Ts.th0 / M.DEG).toFixed(0)}° = ${f(Ts.th0, 3)} rad (released from rest, so φ = 0). Нo small-angle step: τ = −κθ holds at any twist.</p><div class="eq">|τ|<sub>max</sub> = κθ<sub>0</sub> = ${Ts.kappa} × ${f(Ts.th0, 3)} = ${f(Ts.kappa * Ts.th0, 3)} Н·м &nbsp;(at the ends)</div><div class="eq">|dθ/d<i>t</i>|<sub>max</sub> = θ<sub>0</sub>ω = ${f(Ts.th0, 3)} × ${f(wT, 3)} = ${f(Ts.th0 * wT, 2)} рад/с &nbsp;(passing θ = 0)</div><p>θ must be in radians: the torque law and ω both assume it.</p>` },
  ],
  11: [
    { q: `Автомобиль массой ${C.m} кг колеблется на пружинах с периодом ${f(C.T, 3)} с (амортизаторы отключены). В него садятся пассажиры общей массой 300 кг. Каким станет новый период?`,
      choices: [`${f(C.T, 3)} с`, `${f(C.T * m11 / C.m, 3)} с`, `${f(C.T * Math.sqrt(C.m / m11), 3)} с`, `${f(T11, 3)} с`], answer: 3,
      why: `<div class="eq"><i>T</i> = 2π√(<i>m</i>/<i>k</i>) = 2π√(${m11}/${C.k}) = ${f(T11, 3)} с</div><p>Heavier car, slower bounce, by √(${m11}/${C.m}) = ${f(Math.sqrt(m11 / C.m), 3)}, not by the mass ratio itself.</p>` },
    { q: `Чтобы толкать ребёнка на качелях длиной ${f(Sw.L, 1)} м один раз за полный цикл, через какое время следует повторять толчок?`,
      choices: [`${f(Sw.T / 2)} с`, `${f(Sw.T)} с`, `${f(TAU * Math.sqrt(G / Sw.L), 1)} с`, `${f(Math.sqrt(Sw.L / G), 3)} с`], answer: 1,
      why: `<div class="eq"><i>T</i> = 2π√(<i>L</i>/<i>g</i>) = 2π√(${f(Sw.L, 1)}/${f(G)}) = ${f(Sw.T)} с</div><p>The child returns to your hands once per full period. Half of it, ${f(Sw.T / 2)} s, is when the child is at the far end. The child’s mass and (small) amplitude don’t matter.</p>` },
  ],
};
