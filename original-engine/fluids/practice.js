// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + (Math.abs(x) >= 1000 ? Math.abs(x).toFixed(0) : Math.abs(x).toPrecision(3));   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const G = M.G, RHO = M.RHO;
const AL = M.MATERIALS.find(m => m.key === 'al'), ICEM = M.MATERIALS.find(m => m.key === 'ice');
const BU = M.BUOY, PA = M.PASCAL, FL = M.FLOW, BE = M.BERN, TK = M.TANK;
const eq = s => `<div class="eq">${s}</div>`;

// 0 · a 5.0 cm ice cube
const S0 = 0.05, M0 = ICEM.rho * S0 ** 3;
// 1 · standing on one shoe
const A1 = M.SHOE.w * M.SHOE.l, P1 = M.PERSON.W / A1;
// 2 · the lake floor
const D2 = M.LAKE.depth, P2 = M.pAt(D2);
// 3 · a car lift: pistons of radius 2.0 cm and 10.0 cm, a 12 000 N car
const R3a = 0.020, R3b = 0.100, W3 = 12000, F3 = W3 * (R3a / R3b) ** 2;
const D3 = PA.stroke * PA.A1 / PA.A2;
// 4 · the cube all the way under
const T4 = BU.W - BU.Fb;
// 5 · wood in sea water; the steel ball on the floor
const FR5 = M.WOOD.rho / M.RHO_SEA, N5 = M.BALL.W - M.BALL.Fb;
// 6 · narrowing to 10 cm radius; filling a 1000 L tank from the wide part
const R6 = 0.10, V6 = FL.v1 * (FL.r1 / R6) ** 2, T6 = 1.0 / FL.Q;
// 7 · Bernoulli at the three points
const [B1, B2, B3] = BE.pts;
// 8 · the jet when the water is 0.60 m above the hole
const H8 = 0.60, X8 = 2 * Math.sqrt(H8 * TK.yh);
const kPa = (x, n = 1) => `${(x / 1000).toFixed(n)} kPa`;

export const PRACTICE = {
  0: [
    { q: `Алюминиевый куб с ребром 10 см (ρ = ${AL.rho} кг/м³) разрезали на восемь одинаковых маленьких кубиков. Чему равна плотность каждого маленького кубика?`,
      choices: [`${AL.rho / 8} kg/m³`, `${AL.rho / 2} kg/m³`, `${AL.rho} kg/m³`, `${AL.rho * 8} kg/m³`], answer: 2,
      why: `<p>Each piece has ⅛ of the mass and ⅛ of the volume, so ρ = m/V is unchanged. Density belongs to the material, not to the object.</p>` },
    { q: `Чему равна масса ледяного кубика с ребром ${f(S0 * 100, 1)} см? (ρ льда = ${ICEM.rho} кг/м³.)`,
      choices: [`${p3(ICEM.mass / 2)} kg`, `${p3(M0)} kg`, `${p3(ICEM.mass / 4)} kg`, `${p3(ICEM.rho * (S0 * 10) ** 3)} kg`], answer: 1,
      why: `<p>Convert to metres first: V = (${f(S0, 2)} m)³ = ${f(S0 ** 3 * 1e4, 2)} × 10<sup>−4</sup> m³.</p>${eq(`m = ρV = ${ICEM.rho} × ${f(S0 ** 3 * 1e4, 2)} × 10<sup>−4</sup> = ${p3(M0)} kg`)}<p>Halving the side cuts the volume to ⅛, not ½: the 10 cm cube’s ${f(ICEM.mass, 3)} kg becomes ${p3(M0)} kg.</p>` },
  ],
  1: [
    { q: `Человек массой ${M.PERSON.m} кг стоит на одной ноге; площадь подошвы обуви составляет ${f(M.SHOE.w * 100, 0)} см × ${f(M.SHOE.l * 100, 0)} см. Какое давление он оказывает на снег?`,
      choices: [`${kPa(M.P_SHOE)}`, `${kPa(M.PERSON.m / A1, 2)}`, `${kPa(2 * P1)}`, `${kPa(P1)}`], answer: 3,
      why: `${eq(`P = F/A = mg / A = ${f(M.PERSON.W, 0)} N / ${f(A1, 3)} m² = ${kPa(P1)}`)}<p>Half the area of two shoes, so twice their ${kPa(M.P_SHOE)}. ${kPa(M.PERSON.m / A1, 2)} divides the mass, not the weight, by the area.</p>` },
    { q: `Вы вдавливаете гвоздь в дерево, прикладывая к его шляпке площадью 1 см² силу ${M.NAIL.F} Н; гвоздь не ускоряется. Сравните давление, которое острие оказывает на дерево, с давлением большого пальца на шляпку.`,
      choices: ['the same force and the same pressure', 'a larger force and a larger pressure', 'the same force and a much larger pressure', 'a smaller force and a larger pressure'], answer: 2,
      why: `<p>The nail is in equilibrium (and nearly massless), so the wood pushes back with the same ${M.NAIL.F} N. The tip’s area is 200 times smaller, so the pressure is 200 times larger: ${f(M.NAIL.F / M.NAIL.tip / 1e6, 0)} MPa against ${f(M.NAIL.F / M.NAIL.head / 1e3, 0)} kPa.</p>` },
  ],
  2: [
    { q: `Чему равно абсолютное давление на дне озера на глубине ${D2} м? (Атмосферное давление P0 = ${kPa(M.P0)}.)`,
      choices: [`${kPa(M.gauge(D2))}`, `${kPa(P2)}`, `${kPa(M.P0)}`, `${kPa(2 * M.P0)}`], answer: 1,
      why: `${eq(`<i>P</i> = <i>P</i><sub>0</sub> + ρ<i>gh</i> = ${kPa(M.P0)} + ${RHO} × ${f(G)} × ${D2} = ${kPa(M.P0)} + ${kPa(M.gauge(D2))} = ${kPa(P2)}`)}<p>${kPa(M.gauge(D2))} is the gauge pressure: it leaves out the atmosphere on the surface.</p>` },
    { q: `Высокая узкая ваза, широкая миска и конусообразный сосуд, сужающийся кверху, наполнены водой до одинаковой глубины. Каково давление на дне каждого сосуда?`,
      choices: ['greatest in the wide bowl, which holds the most water', 'greatest in the cone, where water is squeezed in', 'greatest in the thin vase', 'the same in all three'], answer: 3,
      why: '<p><i>P</i> = <i>P</i><sub>0</sub> + ρ<i>gh</i> depends only on depth below the open surface, not on the shape or the amount of water. The walls carry the difference in weight.</p>' },
  ],
  3: [
    { q: `Гидравлический подъёмник имеет поршни радиусами ${f(R3a * 100, 1)} см и ${f(R3b * 100, 1)} см. Какую силу нужно приложить к малому поршню, чтобы удержать автомобиль весом ${W3} Н на большом поршне?`,
      choices: [`${p3(W3 * R3a / R3b)} N`, `${p3(F3)} N`, `${p3(W3)} N`, `${p3(W3 * (R3b / R3a) ** 2)} N`], answer: 1,
      why: `<p>The same Δ<i>P</i> acts on both pistons, so <i>F</i><sub>1</sub>/<i>A</i><sub>1</sub> = <i>F</i><sub>2</sub>/<i>A</i><sub>2</sub>, and area goes as r²:</p>${eq(`<i>F</i><sub>1</sub> = ${W3} × (${f(R3a * 100, 1)} / ${f(R3b * 100, 1)})² = ${p3(F3)} N`)}<p>${p3(W3 * R3a / R3b)} N uses the ratio of radii instead of areas.</p>` },
    { q: `В гидравлическом прессе малый поршень площадью ${f(PA.A1 * 1e4, 0)} см² опускают на ${f(PA.stroke * 100, 0)} см. На сколько поднимется большой поршень площадью ${f(PA.A2 * 1e4, 0)} см²?`,
      choices: [`${p3(PA.stroke * 100 * PA.r1 / PA.r2)} cm`, `${p3(PA.stroke * 100)} cm`, `${p3(PA.stroke * 100 * PA.A2 / PA.A1)} cm`, `${p3(D3 * 100)} cm`], answer: 3,
      why: `<p>Water can’t be squeezed, so the volume pushed down comes up: <i>A</i><sub>1</sub><i>d</i><sub>1</sub> = <i>A</i><sub>2</sub><i>d</i><sub>2</sub>.</p>${eq(`<i>d</i><sub>2</sub> = ${f(PA.stroke * 100, 0)} cm × ${f(PA.A1 * 1e4, 0)} / ${f(PA.A2 * 1e4, 0)} = ${p3(D3 * 100)} cm`)}<p>Sixteen times the force through one sixteenth of the distance: the work in equals the work out.</p>` },
  ],
  4: [
    { q: `Алюминиевый куб с ребром ${f(BU.s * 100, 0)} см и весом ${f(BU.W, 0)} Н подвешен на нити и полностью погружён в воду. Чему равно натяжение нити?`,
      choices: [`${p3(BU.W)} N`, `${p3(BU.Fb)} N`, `${p3(BU.W + BU.Fb)} N`, `${p3(T4)} N`], answer: 3,
      why: `${eq(`<i>F</i><sub>b</sub> = ρ<sub>water</sub><i>Vg</i> = ${RHO} × ${f(BU.V, 3)} × ${f(G)} = ${f(BU.Fb, 0)} N`)}${eq(`<i>T</i> = <i>W</i> − <i>F</i><sub>b</sub> = ${f(BU.W, 0)} − ${f(BU.Fb, 0)} = ${p3(T4)} N`)}<p>The buoyant force uses the <b>water’s</b> density, not aluminium’s; ${p3(BU.Fb)} N is the buoyant force, not the tension.</p>` },
    { q: `Когда куб полностью погружён в воду, его опускают ещё глубже. Как изменится выталкивающая сила?`,
      choices: ['increases, because the pressure is greater deeper down', 'decreases, because there is more water above it', 'stays the same', 'increases until it equals the weight'], answer: 2,
      why: '<p>Deeper, the pressure on the top and the bottom face both rise by the same ρgΔh. Their difference, ρgs, and so <i>F</i><sub>b</sub> = ρ<i>Vg</i>, does not change. (Water is taken as incompressible.)</p>' },
  ],
  5: [
    { q: `Деревянный блок плотностью ${M.WOOD.rho} кг/м³ плавает в морской воде плотностью ${M.RHO_SEA} кг/м³ вместо пресной воды. Какая доля объёма блока находится под водой?`,
      choices: [`${f(100 * M.WOOD.rho / RHO, 1)}%`, `${f(100 * (1 - FR5), 1)}%`, `${f(100 * FR5, 1)}%`, `${f(100 * (1 - M.WOOD.rho / RHO), 1)}%`], answer: 2,
      why: `<p>Floating, <i>F</i><sub>b</sub> = <i>W</i>: ρ<sub>sea</sub><i>V</i><sub>under</sub><i>g</i> = ρ<sub>wood</sub><i>Vg</i>.</p>${eq(`<i>V</i><sub>under</sub>/<i>V</i> = ${M.WOOD.rho} / ${M.RHO_SEA} = ${f(100 * FR5, 1)}%`)}<p>Denser water holds it up with less volume, so a little less than the ${f(100 * M.WOOD.rho / RHO, 1)}% in fresh water. ${f(100 * (1 - FR5), 1)}% is the part above.</p>` },
    { q: `Стальной шар радиусом ${f(M.BALL.r, 2)} м и плотностью ${M.BALL.rho} кг/м³ лежит на дне бассейна. С какой силой дно давит на шар вверх?`,
      choices: [`${p3(M.BALL.W)} N`, `${p3(N5)} N`, `${p3(M.BALL.Fb)} N`, `${p3(M.BALL.W + M.BALL.Fb)} N`], answer: 1,
      why: `${eq(`V = ⁴⁄₃πr³ = ${f(M.BALL.V, 4)} m³, W = ρ<sub>steel</sub>Vg = ${f(M.BALL.W, 0)} N, <i>F</i><sub>b</sub> = ρ<sub>water</sub>Vg = ${f(M.BALL.Fb, 0)} N`)}${eq(`<i>F</i><sub>N</sub> = W − <i>F</i><sub>b</sub> = ${p3(N5)} N`)}<p>The water still pushes up on a sunken ball; the floor only supplies the rest.</p>` },
  ],
  6: [
    { q: `Вода движется со скоростью ${f(FL.v1, 1)} м/с по трубе радиусом ${f(FL.r1 * 100, 0)} см, а затем попадает в участок трубы радиусом ${f(R6 * 100, 0)} см. Какова скорость воды на этом участке?`,
      choices: [`${p3(FL.v1 * FL.r1 / R6)} m/s`, `${p3(V6)} m/s`, `${p3(FL.v1 * (R6 / FL.r1) ** 2)} m/s`, `${p3(FL.v1 * R6 / FL.r1)} m/s`], answer: 1,
      why: `${eq(`<i>A</i><sub>1</sub><i>v</i><sub>1</sub> = <i>A</i><sub>2</sub><i>v</i><sub>2</sub> → <i>v</i><sub>2</sub> = <i>v</i><sub>1</sub>(r<sub>1</sub>/r<sub>2</sub>)² = ${f(FL.v1, 1)} × 3² = ${p3(V6)} m/s`)}<p>Area goes as r², so a third of the radius is a ninth of the area. ${p3(FL.v1 * FL.r1 / R6)} m/s uses the radius ratio.</p>` },
    { q: `За какое время широкая труба радиусом ${f(FL.r1 * 100, 0)} см, по которой вода течёт со скоростью ${f(FL.v1, 1)} м/с, заполнит резервуар объёмом 1000 л?`,
      choices: [`${p3(1.0 / (Math.PI * (2 * FL.r1) ** 2 * FL.v1))} s`, `${p3(1.0 / (2 * Math.PI * FL.r1 * FL.v1))} s`, `${p3(T6)} s`, `${p3(1.0 / (FL.r1 ** 2 * FL.v1))} s`], answer: 2,
      why: `${eq(`<i>Q</i> = <i>Av</i> = π(${f(FL.r1, 2)})² × ${f(FL.v1, 1)} = ${f(FL.Q, 4)} m³/s`)}${eq(`t = V/Q = 1.000 m³ / ${f(FL.Q, 4)} m³/s = ${p3(T6)} s`)}<p>1000 L is 1 m³. Using the 60 cm diameter as the radius gives an area four times too big.</p>` },
  ],
  7: [
    { q: `В трубе вода движется со скоростью ${f(B1.v, 1)} м/с, а манометрическое давление в широкой части равно ${kPa(B1.P, 0)}. В узкой части скорость возрастает до ${f(B2.v, 1)} м/с. Каково манометрическое давление в узкой части, если высота не меняется?`,
      choices: [`${kPa(B1.P + (B2.P - B1.P) * -1, 0)}`, `${kPa(B1.P, 0)}`, `${kPa(B1.P * B1.v / B2.v, 1)}`, `${kPa(B2.P, 0)}`], answer: 3,
      why: `${eq(`<i>P</i><sub>2</sub> = <i>P</i><sub>1</sub> + ½ρ(<i>v</i><sub>1</sub>² − <i>v</i><sub>2</sub>²) = ${kPa(B1.P, 0)} + ½ × ${RHO} × (${f(B1.v, 0)}² − ${f(B2.v, 0)}²) = ${kPa(B2.P, 0)}`)}<p>Fast flow, low pressure. ${kPa(B1.P + (B2.P - B1.P) * -1, 0)} has the sign flipped: the water speeds up because the pressure behind it is higher.</p>` },
    { q: `Затем труба с водой, движущейся со скоростью ${f(B3.v, 1)} м/с, поднимается на высоту ${f(BE.H, 1)} м. Чему равно манометрическое давление в верхнем широком участке трубы?`,
      choices: [`${kPa(B1.P + RHO * G * BE.H)}`, `${kPa(B3.P)}`, `${kPa(B1.P)}`, `${kPa(B1.P - 2 * RHO * G * BE.H)}`], answer: 1,
      why: `<p>Same speed as point 1, so the ½ρv² terms cancel:</p>${eq(`<i>P</i><sub>3</sub> = <i>P</i><sub>1</sub> − ρ<i>g</i>Δy = ${kPa(B1.P, 0)} − ${RHO} × ${f(G)} × ${f(BE.H, 1)} = ${kPa(B3.P)}`)}<p>Raising the water costs pressure, just as diving deeper adds it.</p>` },
  ],
  8: [
    { q: `Уровень воды над отверстием поднимают в четыре раза. Как изменится скорость истечения струи из отверстия?`,
      choices: ['at the same speed', `√2 times as fast`, 'twice as fast', 'four times as fast'], answer: 2,
      why: '<p><i>v</i> = √(2<i>gh</i>): four times <i>h</i> gives √4 = 2 times the speed, the same as a stone dropped from four times the height.</p>' },
    { q: `Отверстие находится на высоте ${f(TK.yh, 2)} м над полом. На каком расстоянии от резервуара упадёт струя, если уровень воды находится на ${f(H8, 2)} м выше отверстия?`,
      choices: [`${p3(Math.sqrt(H8 * TK.yh))} m`, `${p3(X8)} m`, `${p3(M.jetRange(TK.h0))} m`, `${p3(Math.sqrt(2 * H8 * TK.yh))} m`], answer: 1,
      why: `${eq(`<i>v</i> = √(2 × ${f(G)} × ${f(H8, 2)}) = ${f(M.torricelli(H8))} m/s, t = √(2 × ${f(TK.yh, 2)} / ${f(G)}) = ${f(M.jetFlight, 3)} s`)}${eq(`x = vt = 2√(h y<sub>hole</sub>) = ${p3(X8)} m`)}<p>${p3(M.jetRange(TK.h0))} m is the range with the tank full (${f(TK.h0, 1)} m), not now.</p>` },
  ],
};
