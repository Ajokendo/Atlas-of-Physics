// momentum/practice.js — AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from the model or from the givens; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const G = M.G;
const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const sg = (x, n = 2) => (x > 1e-12 ? '+' : '') + f(x, n);   // signed, for velocities on a track

// 0 · the ball and the cart; a ball bouncing back
const Bl = M.BALL, Ct = M.CART, vb = 3.0, dp0 = Bl.m * (Bl.v + vb);
// 1 · the wall pulse
const Wl = M.WALL;
// 2 · the egg on the floor
const Eg = M.EGG, Fhard = Eg.J / Eg.tauHard;
// 3–5 · the carts
const S = M.STICK, Bo = M.BOUNCE, X = M.BURST;
const K0s = M.ke(S.m1, S.u1) + M.ke(S.m2, S.u2), K1s = M.ke(S.m1 + S.m2, S.v1);
// 6 · the ballistic pendulum
const Pd = M.PEND, Kclay = M.ke(Pd.m, Pd.u), Kafter = M.ke(Pd.m + Pd.M, Pd.v);
// 7 · the crash
const Cr = M.CRASH;
// 8 · the shell
const Sh = M.SHELL;
// 9 · rods (Physics C): λ = λ0 x/L, and λ = λ0 x²/L²
const Rd = M.ROD, xq = 3 * Rd.L / 4, Mq = Rd.lam0 * Rd.L / 3;
// 10 · plates (Physics C)
const Tr = M.TRI, Se = M.SEMI;
// 11 · the L and the holed square (Physics C)
const Ll = M.ELL, Ho = M.HOLE;

export const PRACTICE = {
  0: [
    { q: `Мяч массой ${f(Bl.m, 1)} кг и тележка массой ${f(Ct.m, 1)} кг имеют одинаковый импульс. Чему равно отношение кинетической энергии мяча к кинетической энергии тележки?`,
      choices: [f(1, 1), f(Bl.m / Ct.m), f(Ct.m / Bl.m, 1), f(Math.sqrt(Ct.m / Bl.m), 1)], answer: 2,
      why: `<p>With the same <i>p</i>, <i>K</i> = <i>p</i>²/2<i>m</i>, so <i>K</i><sub>ball</sub>/<i>K</i><sub>cart</sub> = <i>m</i><sub>cart</sub>/<i>m</i><sub>ball</sub> = ${f(Ct.m, 1)}/${f(Bl.m, 1)} = ${f(Ct.m / Bl.m, 1)}. Check: ${f(M.ke(Bl.m, Bl.v), 1)} J against ${f(M.ke(Ct.m, Ct.v), 1)} J. Equal momentum does not mean equal energy.</p>` },
    { q: `Мяч массой ${f(Bl.m, 1)} кг движется на восток со скоростью ${f(Bl.v, 1)} м/с, затем отскакивает назад на запад со скоростью ${f(vb, 1)} м/с. Чему равен модуль изменения его импульса?`,
      choices: [f(Bl.m * (Bl.v - vb)) + ' kg·m/s', f(Bl.m * Bl.v) + ' kg·m/s', f(dp0) + ' kg·m/s', f(Bl.v + vb) + ' kg·m/s'], answer: 2,
      why: `<p>Take east as +. Δ<i>p</i> = <i>m</i>(<i>v</i><sub>f</sub> − <i>v</i><sub>0</sub>) = ${f(Bl.m, 1)} × (−${f(vb, 1)} − ${f(Bl.v, 1)}) = −${f(dp0)} kg·m/s, so |Δ<i>p</i>| = ${f(dp0)} kg·m/s. Subtracting the speeds (${f(Bl.m * (Bl.v - vb))}) ignores that the velocity reversed.</p>` },
  ],
  1: [
    { q: `Стена изменяет скорость мяча массой ${f(Wl.m, 1)} кг с +${f(Wl.v, 1)} м/с на −${f(Wl.v, 1)} м/с за ${f(Wl.tau)} с. Чему равен модуль средней силы, действующей на мяч?`,
      choices: [`${f(Wl.m * Wl.v / Wl.tau, 1)} N`, `${f(Wl.J / Wl.tau, 1)} N`, `${f(Wl.J * Wl.tau, 2)} N`, `${f(Wl.Fpk, 1)} N`], answer: 1,
      why: `<div class="eq"><i>F</i><sub>avg</sub> = |Δ<i>p</i>|/Δ<i>t</i> = 2<i>mv</i>/Δ<i>t</i> = ${f(Wl.J, 1)} / ${f(Wl.tau)} = ${f(Wl.J / Wl.tau, 1)} N</div><p>${f(Wl.m * Wl.v / Wl.tau, 1)} N only stops the ball; it must also come back. ${f(Wl.Fpk, 1)} N is the peak of the pulse, not its average.</p>` },
    { q: `Сила стены изменяется по закону F(t) = Fpk sin(πt/τ) при 0 ≤ t ≤ τ, где Fpk = ${f(Wl.Fpk, 1)} Н и τ = ${f(Wl.tau)} с. Какой импульс силы получает мяч?`,
      choices: [`${f(Wl.Fpk * Wl.tau / 2)} N·s`, `${f(Wl.Fpk * Wl.tau)} N·s`, `${f(Wl.Fpk * Wl.tau / Math.PI)} N·s`, `${f(2 * Wl.Fpk * Wl.tau / Math.PI)} N·s`], answer: 3,
      why: `<div class="eq"><i>J</i> = ∫<sub>0</sub><sup>τ</sup> <i>F</i><sub>pk</sub> sin(π<i>t</i>/τ) d<i>t</i> = <i>F</i><sub>pk</sub>(τ/π)[−cos(π<i>t</i>/τ)]<sub>0</sub><sup>τ</sup> = 2<i>F</i><sub>pk</sub>τ/π = ${f(2 * Wl.Fpk * Wl.tau / Math.PI)} N·s</div><p>It matches 2<i>mv</i> = ${f(Wl.J)} N·s. <i>F</i><sub>pk</sub>τ treats the peak as if it lasted the whole time; <i>F</i><sub>pk</sub>τ/2 is the area of a triangle, not a sine arch.</p>` },
  ],
  2: [
    { q: `Яйцо массой ${f(Eg.m, 3)} кг ударяется о пол со скоростью ${f(Eg.v0, 1)} м/с и останавливается за ${f(Eg.tauHard)} с, не отскакивая. Чему равен модуль средней равнодействующей силы?`,
      choices: [`${f(Fhard)} N`, `${f(2 * Fhard, 1)} N`, `${f(Eg.J, 3)} N`, `${f(M.ke(Eg.m, Eg.v0) / Eg.tauHard)} N`], answer: 0,
      why: `<div class="eq"><i>F</i><sub>net</sub>Δ<i>t</i> = Δ<i>p</i> &nbsp;⇒&nbsp; <i>F</i><sub>net</sub> = <i>mv</i>/Δ<i>t</i> = ${f(Eg.J, 3)} / ${f(Eg.tauHard)} = ${f(Fhard)} N</div><p>It stops without bouncing, so Δ<i>p</i> = <i>mv</i>, not 2<i>mv</i>. ${f(M.ke(Eg.m, Eg.v0) / Eg.tauHard)} N divides an energy by a time (that is a power).</p>` },
    { q: `По сравнению с падением на пол, при падении на подушку яйцо испытывает…`,
      choices: ['a smaller impulse and a smaller average force', 'a larger impulse over a longer time', 'the same average force over a longer time', 'the same impulse and a smaller average force'], answer: 3,
      why: '<p>Either way the egg goes from <i>v</i> to 0, so Δ<i>p</i>, the impulse, is the same. The pillow stretches Δ<i>t</i>, so <i>F</i> = Δ<i>p</i>/Δ<i>t</i> is smaller.</p>' },
  ],
  3: [
    { q: `Считаем направление вправо положительным. Тележка массой ${f(S.m1, 1)} кг движется со скоростью ${sg(S.u1, 1)} м/с, а тележка массой ${f(S.m2, 1)} кг — со скоростью ${sg(S.u2, 1)} м/с. Они сталкиваются и сцепляются. Какова их общая скорость после столкновения?`,
      choices: [`${sg((S.m1 * S.u1 - S.m2 * S.u2) / (S.m1 + S.m2))} m/s`, `${sg((S.u1 + S.u2) / 2)} m/s`, `${sg(S.v1)} m/s`, `${sg(S.m1 * S.u1 + S.m2 * S.u2)} m/s`], answer: 2,
      why: `<div class="eq"><i>v</i>′ = (<i>m</i>₁<i>v</i>₁ + <i>m</i>₂<i>v</i>₂)/(<i>m</i>₁ + <i>m</i>₂) = (${f(S.m1 * S.u1, 1)} − ${f(-S.m2 * S.u2, 1)})/${f(S.m1 + S.m2, 1)} = ${sg(S.v1)} m/s</div><p>The second cart moves left, so its momentum is negative: adding it as +${f(-S.m2 * S.u2, 1)} gives ${sg((S.m1 * S.u1 - S.m2 * S.u2) / (S.m1 + S.m2))} m/s. Averaging the velocities ignores the masses.</p>` },
    { q: `Сколько кинетической энергии теряется при этом столкновении?`,
      choices: [`${f(K1s)} J`, `${f(K0s)} J`, '0 J', `${f(K0s - K1s)} J`], answer: 3,
      why: `<p>Before: ½(${f(S.m1, 1)})(${f(S.u1, 1)})² + ½(${f(S.m2, 1)})(${f(S.u2, 1)})² = ${f(K0s)} J. After: ½(${f(S.m1 + S.m2, 1)})(${f(S.v1, 1)})² = ${f(K1s)} J. Lost: ${f(K0s - K1s)} J, to heat, sound and dents. Momentum is conserved; kinetic energy is not.</p>` },
  ],
  4: [
    { q: `Считаем направление вправо положительным. Тележка массой ${f(Bo.m1, 1)} кг со скоростью ${sg(Bo.u1, 1)} м/с сталкивается с покоящейся тележкой массой ${f(Bo.m2, 1)} кг. Столкновение абсолютно упругое. Какова скорость первой тележки массой ${f(Bo.m1, 1)} кг после столкновения?`,
      choices: [`${sg(-Bo.v1)} m/s`, `${sg(Bo.v1)} m/s`, `${f(0)} m/s`, `${sg(Bo.m1 * Bo.u1 / (Bo.m1 + Bo.m2))} m/s`], answer: 1,
      why: `<p>In an elastic collision the relative velocity reverses: <i>v</i>₂′ − <i>v</i>₁′ = ${f(Bo.u1, 1)} m/s. With momentum, ${f(Bo.m1, 1)} × ${f(Bo.u1, 1)} = ${f(Bo.m1, 1)}<i>v</i>₁′ + ${f(Bo.m2, 1)}<i>v</i>₂′:</p><div class="eq"><i>v</i>₁′ = (<i>m</i>₁ − <i>m</i>₂)<i>v</i>₁/(<i>m</i>₁ + <i>m</i>₂) = ${sg(Bo.v1)} m/s, &nbsp; <i>v</i>₂′ = ${sg(Bo.v2)} m/s</div><p>The lighter cart bounces back. ${sg(Bo.m1 * Bo.u1 / (Bo.m1 + Bo.m2))} m/s is the sticking answer.</p>` },
    { q: `Если вместо этого движущаяся тележка сталкивается с такой же неподвижной тележкой при абсолютно упругом столкновении, то после столкновения…`,
      choices: ['both move on at half the speed', 'the first stops and the second moves off at the first’s speed', 'the first bounces back at its original speed', 'both stop'], answer: 1,
      why: '<p>With <i>m</i>₁ = <i>m</i>₂, <i>v</i>₁′ = (<i>m</i>₁ − <i>m</i>₂)<i>v</i>₁/(<i>m</i>₁ + <i>m</i>₂) = 0 and <i>v</i>₂′ = <i>v</i>₁. Moving on together at half speed would conserve momentum but lose half the kinetic energy, so it is not elastic.</p>' },
  ],
  5: [
    { q: `Пружина между двумя неподвижными тележками массой ${f(X.m1, 1)} кг и ${f(X.m2, 1)} кг высвобождает ${f(X.Q, 1)} Дж энергии. С какой скоростью начинает двигаться тележка массой ${f(X.m2, 1)} кг?`,
      choices: [`${f(-X.v1)} m/s`, `${f(Math.sqrt(2 * X.Q / X.m2))} m/s`, `${f(Math.sqrt(2 * X.Q / (X.m1 + X.m2)))} m/s`, `${f(X.v2)} m/s`], answer: 3,
      why: `<p>Momentum stays zero: <i>m</i>₁<i>v</i>₁′ = −<i>m</i>₂<i>v</i>₂′, so the ${f(X.m1, 1)} kg cart is ${f(X.m2 / X.m1, 0)} times as fast. Energy: ½<i>m</i>₁(${f(X.m2 / X.m1, 0)}<i>v</i>)² + ½<i>m</i>₂<i>v</i>² = ${f(X.Q, 1)} J gives <i>v</i> = ${f(X.v2)} m/s (and ${f(-X.v1)} m/s for the light cart).</p><p>${f(Math.sqrt(2 * X.Q / X.m2))} m/s gives all the energy to one cart, which would break momentum conservation.</p>` },
    { q: `При таком разлёте чему равно отношение кинетической энергии тележки массой ${f(X.m1, 1)} кг к кинетической энергии тележки массой ${f(X.m2, 1)} кг?`,
      choices: [f(X.m1 / X.m2), f(1, 1), f(X.m2 / X.m1, 1), f((X.m2 / X.m1) ** 2, 1)], answer: 2,
      why: `<p>Equal and opposite momenta, and <i>K</i> = <i>p</i>²/2<i>m</i>, so the ratio is <i>m</i>₂/<i>m</i>₁ = ${f(X.m2 / X.m1, 1)}: ${f(M.ke(X.m1, X.v1), 1)} J against ${f(M.ke(X.m2, X.v2), 1)} J. The light cart takes most of the spring’s energy.</p>` },
  ],
  6: [
    { q: `Комок глины массой ${f(Pd.m, 1)} кг движется со скоростью ${f(Pd.u, 0)} м/с и прилипает к блоку массой ${f(Pd.M, 1)} кг. На какую высоту поднимется блок после столкновения?`,
      choices: [`${f(Pd.dy * 100, 1)} cm`, `${f(Kclay / ((Pd.m + Pd.M) * G) * 100, 1)} cm`, `${f(Pd.v ** 2 / G * 100, 1)} cm`, `${f(Pd.u ** 2 / (2 * G) * 100, 0)} cm`], answer: 0,
      why: `<p>The hit: momentum, <i>v</i>′ = <i>mu</i>/(<i>m</i> + <i>M</i>) = ${f(Pd.m * Pd.u, 1)}/${f(Pd.m + Pd.M, 1)} = ${f(Pd.v, 3)} m/s. The swing: energy, Δ<i>y</i> = <i>v</i>′²/2<i>g</i> = ${f(Pd.dy * 100, 1)} cm.</p><p>${f(Kclay / ((Pd.m + Pd.M) * G) * 100, 1)} cm assumes the clay’s kinetic energy survives the hit; most of it is lost when the clay sticks.</p>` },
    { q: `Какая доля кинетической энергии глины теряется при столкновении?`,
      choices: [`${f(100 * Pd.m / (Pd.m + Pd.M), 1)}%`, '0%', `${f(100 * (1 - Kafter / Kclay), 1)}%`, '50.0%'], answer: 2,
      why: `<p>Before: ½(${f(Pd.m, 1)})(${f(Pd.u, 0)})² = ${f(Kclay, 1)} J. After: ½(${f(Pd.m + Pd.M, 1)})(${f(Pd.v, 3)})² = ${f(Kafter)} J. Kept: <i>m</i>/(<i>m</i> + <i>M</i>) = ${f(100 * Pd.m / (Pd.m + Pd.M), 1)}%, so ${f(100 * (1 - Kafter / Kclay), 1)}% is lost.</p>` },
  ],
  7: [
    { q: `Автомобиль массой ${Cr.m1} кг, движущийся на восток со скоростью ${f(Cr.v1, 0)} м/с, и грузовик массой ${Cr.m2} кг, движущийся на север со скоростью ${f(Cr.v2, 0)} м/с, сцепляются при столкновении. С какой скоростью движется образовавшаяся система сразу после удара?`,
      choices: [`${f((Cr.px + Cr.py) / (Cr.m1 + Cr.m2))} m/s`, `${f(Cr.v)} m/s`, `${f((Cr.v1 + Cr.v2) / 2, 1)} m/s`, `${f(Math.hypot(Cr.v1, Cr.v2), 1)} m/s`], answer: 1,
      why: `<p>Each direction separately: <i>v</i>′<sub>x</sub> = ${Cr.px}/${Cr.m1 + Cr.m2} = ${f(Cr.vx)} m/s, <i>v</i>′<sub>y</sub> = ${Cr.py}/${Cr.m1 + Cr.m2} = ${f(Cr.vy)} m/s.</p><div class="eq"><i>v</i>′ = √(${f(Cr.vx)}² + ${f(Cr.vy)}²) = ${f(Cr.v)} m/s</div><p>${f((Cr.px + Cr.py) / (Cr.m1 + Cr.m2))} m/s adds the momenta as if they pointed the same way.</p>` },
    { q: `В каком направлении движется образовавшаяся после столкновения система?`,
      choices: [`${f(90 - Cr.angle, 1)}° north of east`, `${f(Math.atan2(Cr.v2, Cr.v1) * 180 / Math.PI, 1)}° north of east`, `${f(Math.atan2(Cr.v1, Cr.v2) * 180 / Math.PI, 1)}° north of east`, `${f(Cr.angle, 1)}° north of east`], answer: 3,
      why: `<div class="eq">tan θ = <i>p</i><sub>y</sub>/<i>p</i><sub>x</sub> = ${Cr.py}/${Cr.px} &nbsp;⇒&nbsp; θ = ${f(Cr.angle, 1)}° north of east</div><p>Use the momenta, not the speeds: the slow truck is eight times heavier, so it wins. ${f(Math.atan2(Cr.v2, Cr.v1) * 180 / Math.PI, 1)}° uses the speeds.</p>` },
  ],
  8: [
    { q: `Снаряд летит со скоростью ${f(Sh.v0, 0)} м/с под углом ${Sh.deg}° и до взрыва имел дальность полёта R = ${f(Sh.R)} м. В верхней точке траектории он распадается на две равные части; задняя половина падает вертикально вниз. Где приземлится передняя половина?`,
      choices: [`${f(Sh.R / 2)} m`, `${f(Sh.R)} m`, `${f(1.5 * Sh.R)} m`, `${f(2 * Sh.R)} m`], answer: 2,
      why: `<p>The centre of mass still lands at <i>R</i>, as if nothing happened. The rear half lands at <i>R</i>/2 = ${f(Sh.R / 2)} m, and the halves are equal, so the front half lands as far beyond <i>R</i>: <i>x</i> = 2<i>R</i> − <i>R</i>/2 = 3<i>R</i>/2 = ${f(1.5 * Sh.R)} m.</p><p>Directly: it leaves the top at 2<i>v</i><sub>x</sub> and falls for the same time, so it covers twice the remaining <i>R</i>/2.</p>` },
    { q: `Каково ускорение центра масс системы от момента взрыва до приземления первой части?`,
      choices: ['zero', '<i>g</i>, downward', '2<i>g</i>, downward', 'forward, from the burst'], answer: 1,
      why: '<p>The burst forces are internal and cancel in pairs. The only outside force is still the total weight, <i>Mg</i>, so <i>a</i><sub>cm</sub> = <i>g</i> downward, exactly as before the burst.</p>' },
  ],
  9: [
    { q: `Стержень расположен вдоль оси x от x = 0 до L = ${f(Rd.L, 1)} м; его линейная плотность λ(x) = λ0x/L. Где находится центр масс стержня?`,
      choices: [`<i>x</i> = ${f(Rd.L / 2)} m`, `<i>x</i> = ${f(Rd.L / 3, 3)} m`, `<i>x</i> = ${f(Rd.xN)} m`, `<i>x</i> = ${f(3 * Rd.L / 4)} m`], answer: 2,
      why: `<div class="eq"><i>M</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>/<i>L</i> d<i>x</i> = λ<sub>0</sub><i>L</i>/2, &nbsp; ∫<i>x</i> d<i>m</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>²/<i>L</i> d<i>x</i> = λ<sub>0</sub><i>L</i>²/3</div><div class="eq"><i>x</i><sub>cm</sub> = (λ<sub>0</sub><i>L</i>²/3)/(λ<sub>0</sub><i>L</i>/2) = 2<i>L</i>/3 = ${f(Rd.xN)} m</div><p>Toward the dense end. <i>L</i>/3 measures from the wrong end; <i>L</i>/2 ignores the density.</p>` },
    { q: `Развёрнутый ответ. Стержень длиной L = ${f(Rd.L, 1)} м расположен от x = 0 до x = L и имеет линейную плотность λ(x) = λ0x²/L², где λ0 = ${f(Rd.lam0, 1)} кг/м. Найдите массу стержня и координату его центра масс.`,
      solution: `<p>Slice it into d<i>m</i> = λ d<i>x</i>:</p><div class="eq"><i>M</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>²/<i>L</i>² d<i>x</i> = λ<sub>0</sub><i>L</i>/3 = ${f(Rd.lam0, 1)} × ${f(Rd.L, 1)}/3 = ${f(Mq)} kg</div><div class="eq">∫<i>x</i> d<i>m</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>³/<i>L</i>² d<i>x</i> = λ<sub>0</sub><i>L</i>²/4</div><div class="eq"><i>x</i><sub>cm</sub> = (λ<sub>0</sub><i>L</i>²/4)/(λ<sub>0</sub><i>L</i>/3) = 3<i>L</i>/4 = ${f(xq)} m</div><p>Further toward the dense end than the linear rod’s 2<i>L</i>/3, as it should be: more of the mass is near <i>x</i> = <i>L</i>.</p>` },
  ],
  10: [
    { q: `Однородная полукруглая пластина имеет радиус R = ${f(Se.R, 1)} м. На каком расстоянии от прямого края находится её центр масс?`,
      choices: [`${f(Se.R / 2, 3)} m`, `${f(2 * Se.R / Math.PI, 3)} m`, `${f(Se.R / 3, 3)} m`, `${f(Se.ucm, 3)} m`], answer: 3,
      why: `<p>Strips parallel to the diameter, width 2√(<i>R</i>² − <i>u</i>²):</p><div class="eq"><i>u</i><sub>cm</sub> = ∫<sub>0</sub><sup><i>R</i></sup> 2<i>u</i>√(<i>R</i>² − <i>u</i>²) d<i>u</i> / (π<i>R</i>²/2) = (2<i>R</i>³/3)/(π<i>R</i>²/2) = 4<i>R</i>/3π = ${f(Se.ucm, 3)} m</div><p><i>R</i>/2 ignores that the strips narrow away from the edge; 2<i>R</i>/π = ${f(2 * Se.R / Math.PI, 3)} m is for a thin semicircular wire, whose mass is all at the rim.</p>` },
    { q: `Однородная треугольная пластина имеет высоту h = ${f(Tr.h, 1)} м над основанием. На какой высоте над основанием находится её центр масс?`,
      choices: [`${f(Tr.h / 2, 3)} m`, `${f(Tr.ucm, 3)} m`, `${f(2 * Tr.h / 3, 3)} m`, `${f(Tr.h / 4, 3)} m`], answer: 1,
      why: `<p>Strips parallel to the base are <i>w</i> = <i>b</i>(1 − <i>u</i>/<i>h</i>) wide: wide at the base, zero at the apex.</p><div class="eq"><i>u</i><sub>cm</sub> = ∫<sub>0</sub><sup><i>h</i></sup> <i>u</i>·<i>b</i>(1 − <i>u</i>/<i>h</i>) d<i>u</i> / (<i>bh</i>/2) = (<i>bh</i>²/6)/(<i>bh</i>/2) = <i>h</i>/3 = ${f(Tr.ucm, 3)} m</div><p>2<i>h</i>/3 is the distance from the apex.</p>` },
  ],
  11: [
    { q: `Г-образная фигура состоит из плеча A массой ${f(Ll.pA.m)} кг с центром при x = ${f(Ll.pA.c[0])} м и плеча B массой ${f(Ll.pB.m)} кг с центром при x = ${f(Ll.pB.c[0])} м. Чему равна координата x центра масс всей фигуры?`,
      choices: [`${f((Ll.pA.c[0] + Ll.pB.c[0]) / 2, 3)} m`, `${f(Ll.pA.c[0], 3)} m`, `${f((Ll.pB.m * Ll.pA.c[0] + Ll.pA.m * Ll.pB.c[0]) / Ll.M, 3)} m`, `${f(Ll.cm[0], 3)} m`], answer: 3,
      why: `<div class="eq"><i>x</i><sub>cm</sub> = (${f(Ll.pA.m)} × ${f(Ll.pA.c[0])} + ${f(Ll.pB.m)} × ${f(Ll.pB.c[0])})/${f(Ll.M)} = ${f(Ll.cm[0], 3)} m</div><p>Weight each centre by its own mass. ${f((Ll.pA.c[0] + Ll.pB.c[0]) / 2, 3)} m is the plain average of the centres, right only for equal masses.</p>` },
    { q: `Развёрнутый ответ. Начиная с xcm = (1/M)∫x dm, обоснуйте, почему отверстие можно учитывать как массу со знаком минус. Затем найдите центр масс квадратной пластины со стороной ${f(Ho.s, 1)} м и поверхностной плотностью σ = ${f(M.SIGMA, 1)} кг/м², центрированной в начале координат, если в ней имеется отверстие радиусом ${f(Ho.r, 1)} м с центром при x = ${f(Ho.c[0])} м.`,
      solution: `<p>An integral over a region splits over its parts. The plate is the full square minus the disc, so</p><div class="eq">∫<sub>plate</sub> <i>x</i> d<i>m</i> = ∫<sub>square</sub> <i>x</i> d<i>m</i> − ∫<sub>disc</sub> <i>x</i> d<i>m</i> = <i>m</i><sub>full</sub><i>x</i><sub>full</sub> − <i>m</i><sub>plug</sub><i>x</i><sub>plug</sub></div><p>and likewise <i>M</i> = <i>m</i><sub>full</sub> − <i>m</i><sub>plug</sub>: the hole enters exactly like a mass −<i>m</i><sub>plug</sub> at its centre.</p><p><i>m</i><sub>full</sub> = σ<i>s</i>² = ${f(Ho.mFull)} kg at <i>x</i> = 0; <i>m</i><sub>plug</sub> = σπ<i>r</i>² = ${f(Ho.mPlug, 3)} kg at <i>x</i> = ${f(Ho.c[0])} m; <i>M</i> = ${f(Ho.M, 3)} kg.</p><div class="eq"><i>x</i><sub>cm</sub> = (0 − ${f(Ho.mPlug, 3)} × ${f(Ho.c[0])})/${f(Ho.M, 3)} = ${f(Ho.cm[0] * 100)} cm</div><p>Negative: the centre of mass moves away from the hole.</p>` },
  ],
};
