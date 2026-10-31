// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + Math.abs(x).toPrecision(3);   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const G = M.G, sin = d => Math.sin(d * Math.PI / 180), cos = d => Math.cos(d * Math.PI / 180);
const TG = M.TUG, BD = M.BOARD, DR = M.DRAG;

// 0 · pressing down on the resting block
const PRESS = 5.0;
// 1 · strings at 25°
const TH1 = 25;
// 2 · hanging in an elevator moving up at constant speed
const VEL2 = 3.0;
// 3 · more thrust
const THRUST3 = 2400;
// 4 · distance in the push time
const X4 = 0.5 * M.A1 * M.PUSH_T ** 2;
// 5 · the car at highway speed, same forward push
const V5 = 30, D5 = M.CAR.k * V5 ** 2, A5 = (M.CAR.F - D5) / M.CAR.m;
// 6 · an 8.0 N push at rest; a 12.0 N push while sliding
const P6 = 8.0, P6b = 12.0, A6 = (P6b - M.F_K) / M.M1;
// 7 · the push moved to B's side
const C7 = M.M1 * M.PUSH / (M.M1 + M.M2);
// 8 · where the skaters meet, measured from A's start
const MEET = TG.d0 * TG.mB / TG.M;
// 9 · a harder pull on the board
const F9 = 24, ACM9 = F9 / BD.M, ABOARD9 = (F9 - BD.f) / BD.Mb;
// 10 · down the slope; with friction
const V10 = Math.sqrt(2 * M.A_INC * M.INC_LEN), A10 = G * (sin(M.THETA_DEG) - M.MU_K * cos(M.THETA_DEG));
// 11 · half of terminal speed; drag when a = g/4
const THALF = DR.tau * Math.log(2), D11 = 0.75 * DR.W;
// 12 · distance fallen in 1.00 s
const T12 = 1.00, X12 = M.linDrag(T12).x;

export const PRACTICE = {
  0: [
    { q: `Блок массой ${f(M.M1, 1)} кг покоится на полу. Вы нажимаете на него вертикально вниз с силой ${f(PRESS, 1)} Н. Чему равна сила нормальной реакции пола?`,
      choices: [`${p3(M.W1 + PRESS)} Н`, `${p3(M.W1)} Н`, `${p3(M.W1 - PRESS)} Н`, `${p3(PRESS)} Н`], answer: 0,
      why: `<p>Free-body diagram: weight ${f(M.W1, 1)} N down, your push ${f(PRESS, 1)} N down, normal force up. The block stays at rest, so Σ<i>F</i> = 0:</p><div class="eq"><i>F</i><sub>N</sub> = <i>mg</i> + <i>F</i><sub>push</sub> = ${f(M.W1, 1)} + ${f(PRESS, 1)} = ${p3(M.W1 + PRESS)} N</div><p>The normal force is whatever the surface must supply; it equals <i>mg</i> only when nothing else pushes vertically.</p>` },
    { q: `Брусок скользит по горизонтальной поверхности без трения и сопротивления воздуха с постоянной скоростью. Какие силы следует показать на диаграмме сил?`,
      choices: ['сила тяжести, реакция опоры и направленная вперёд сила, поддерживающая движение', 'только сила тяжести', 'реакция опоры и сила, направленная вперёд', 'только сила тяжести и реакция опоры'], answer: 3,
      why: `<p>Only things touching the block (and gravity) exert forces on it. The floor gives a normal force; Earth gives the weight. Nothing pushes it forward: its velocity stays the same because the net force is zero, not because something drives it.</p>` },
  ],
  1: [
    { q: `Блок массой ${f(M.M1, 1)} кг неподвижно подвешен на двух нитях, каждая из которых образует угол ${TH1}° с горизонталью. Чему равно натяжение каждой нити?`,
      choices: [`${p3(M.W1 / (2 * cos(TH1)))} Н`, `${p3(M.W1 / (2 * sin(TH1)))} Н`, `${p3(M.W1 / sin(TH1))} Н`, `${p3(M.W1 / 2)} Н`], answer: 1,
      why: `<p>The horizontal parts cancel. The two vertical parts hold the weight up:</p><div class="eq">2<i>T</i> sin θ = <i>mg</i> &nbsp;→ <i>T</i> = ${f(M.W1, 1)} / (2 sin ${TH1}°) = ${p3(M.W1 / (2 * sin(TH1)))} N</div><p>The angle is measured from the horizontal, so the vertical part is <i>T</i> sin θ, not <i>T</i> cos θ. Each string carries more than half the weight, ${p3(M.W1 / 2)} N.</p>` },
    { q: `Нити постепенно располагают всё ближе к горизонтальному положению, при этом блок по-прежнему висит неподвижно. Как изменяется натяжение нитей?`,
      choices: ['Уменьшается и стремится к нулю.', 'Остаётся равным половине веса.', 'Неограниченно возрастает; нити не могут быть строго горизонтальными.', 'Стремится к полной силе тяжести.'], answer: 2,
      why: `<p><i>T</i> = <i>mg</i>/(2 sin θ). As θ → 0, sin θ → 0 and <i>T</i> → ∞. Horizontal strings would have no vertical part at all, so no finite tension could hold the block up.</p>` },
  ],
  2: [
    { q: `Блок массой ${f(M.M1, 1)} кг подвешен на нити в лифте, который движется вверх с постоянной скоростью ${f(VEL2, 1)} м/с. Чему равно натяжение нити?`,
      choices: [`${p3(M.W1 + M.M1 * VEL2)} Н`, `${p3(M.M1 * VEL2)} Н`, `${p3(M.W1 - M.M1 * VEL2)} Н`, `${p3(M.W1)} Н`], answer: 3,
      why: `<p>Constant velocity means <i>a</i> = 0, so the block is in equilibrium: Σ<i>F</i> = <i>T</i> − <i>mg</i> = 0.</p><div class="eq"><i>T</i> = <i>mg</i> = ${f(M.M1, 1)} × ${f(G)} = ${p3(M.W1)} N</div><p>The speed never enters; a force changes velocity, it isn’t needed to keep it. (<i>mv</i> isn’t even a force.)</p>` },
    { q: `Шайба скользит по льду без трения с постоянной скоростью. Что необходимо, чтобы она продолжала двигаться?`,
      choices: ['Ничего: при нулевой равнодействующей скорость остаётся постоянной.', 'Постоянная сила вперёд, равная силе тяжести', 'Уменьшающаяся со временем сила вперёд', '«Сила инерции», которая со временем исчезает'], answer: 0,
      why: `<p>The first law: with Σ<i>F</i> = 0 the velocity stays constant, moving or not. Inertia is a property (resistance to changes in velocity), not a force, and it doesn’t wear off.</p>` },
  ],
  3: [
    { q: `Самолёт летит горизонтально с силой сопротивления ${M.PLANE.D} Н. Пилот увеличивает тягу до ${THRUST3} Н. Каково ускорение самолёта сразу после этого, пока сила сопротивления ещё не изменилась?`,
      choices: [`${p3(THRUST3 / M.PLANE.m)} м/с²`, `${p3(M.PLANE.D / M.PLANE.m)} м/с²`, `${p3((THRUST3 - M.PLANE.D) / M.PLANE.m)} м/с²`, `${p3((THRUST3 + M.PLANE.D) / M.PLANE.m)} м/с²`], answer: 2,
      why: `<p>Lift still cancels weight. Along the flight path the net force is thrust minus drag:</p><div class="eq"><i>a</i> = (${THRUST3} − ${M.PLANE.D}) / ${M.PLANE.m} = ${p3((THRUST3 - M.PLANE.D) / M.PLANE.m)} m/s² forward</div><p>Using the thrust alone ignores the drag that still acts.</p>` },
    { q: `Самолёт летит горизонтально с постоянной скоростью ${M.PLANE.v} м/с. Как соотносятся сила тяги и сила сопротивления воздуха?`,
      choices: ['Тяга больше, иначе самолёт замедлялся бы.', 'Они равны.', 'Тяга больше на величину силы тяжести самолёта.', 'Сопротивление больше, потому что самолёт движется.'], answer: 1,
      why: `<p>Constant velocity means zero net force (first law), so thrust = drag = ${M.PLANE.D} N. Thrust larger than drag would make the plane speed up, not merely keep moving.</p>` },
  ],
  4: [
    { q: `К блоку массой ${f(M.M1, 1)}, первоначально покоящемуся на поверхности без трения, прикладывают силу ${f(M.PUSH, 1)} Н. Какое расстояние он пройдёт за ${f(M.PUSH_T, 1)} с?`,
      choices: [`${p3(2 * X4)} м`, `${p3(0.5 * M.A2 * M.PUSH_T ** 2)} м`, `${p3(M.A1 * M.PUSH_T)} м`, `${p3(X4)} м`], answer: 3,
      why: `<p><i>a</i> = Σ<i>F</i>/<i>m</i> = ${f(M.PUSH, 1)}/${f(M.M1, 1)} = ${f(M.A1, 2)} m/s², constant, so</p><div class="eq">Δ<i>x</i> = ½<i>at</i>² = ½ × ${f(M.A1, 2)} × (${f(M.PUSH_T, 1)})² = ${p3(X4)} m</div><p>${p3(2 * X4)} m forgets the ½; ${p3(M.A1 * M.PUSH_T)} is the speed reached, in m/s.</p>` },
    { q: `Равнодействующая сила, действующая на тележку, увеличивается вдвое, и её масса также увеличивается вдвое. Что происходит с ускорением?`,
      choices: ['в 4 раза меньше', 'не изменяется', 'увеличивается в 2 раза', 'увеличивается в 4 раза'], answer: 1,
      why: `<p><i>a</i> = Σ<i>F</i>/<i>m</i> = (2Σ<i>F</i>)/(2<i>m</i>): the factors cancel.</p>` },
  ],
  5: [
    { q: `Автомобиль разгоняется по горизонтальной дороге. Какая внешняя сила толкает автомобиль вперёд?`,
      choices: ['сила двигателя, действующая на автомобиль', 'сила шин, действующая на дорогу', 'сила трения покоя со стороны дороги на шины', 'сила трения скольжения со стороны дороги на шины'], answer: 2,
      why: `<p>The engine is part of the car; internal forces can’t accelerate it. The tyres push back on the road and, by the third law, the road pushes the tyres forward. The tyre surface doesn’t slip on the road, so it is <b>static</b> friction. The tyres’ force on the road acts on the road, not the car.</p>` },
    { q: `Дорога действует на автомобиль с той же направленной вперёд силой ${f(M.CAR.F / 1000, 1)} кН. При скорости ${V5} м/с сила сопротивления равна ${f(D5, 0)} Н. Чему равно ускорение автомобиля?`,
      choices: [`${p3(M.CAR.F / M.CAR.m)} м/с²`, `${p3(A5)} м/с²`, `${p3((M.CAR.F + D5) / M.CAR.m)} м/с²`, `${p3(D5 / M.CAR.m)} м/с²`], answer: 1,
      why: `<p>Drag points backward, against the motion:</p><div class="eq"><i>a</i> = (<i>F</i> − <i>F</i><sub>d</sub>)/<i>m</i> = (${M.CAR.F} − ${f(D5, 0)}) / ${M.CAR.m} = ${p3(A5)} m/s²</div><p>${p3(M.CAR.F / M.CAR.m)} m/s² ignores the drag, which is why real cars accelerate more slowly at speed.</p>` },
  ],
  6: [
    { q: `Брусок массой ${f(M.M1, 1)} кг покоится на шероховатом полу (μs = ${f(M.MU_S)}, μk = ${f(M.MU_K)}). Вы толкаете его вбок с силой ${f(P6, 1)} Н. Чему равна сила трения, действующая на брусок?`,
      choices: [`${p3(M.F_SMAX)} Н`, `${p3(M.F_K)} Н`, `${p3(P6)} Н`, '0 Н'], answer: 2,
      why: `<p>The limit is μ<sub>s</sub><i>F</i><sub>N</sub> = ${f(M.MU_S)} × ${f(M.FN, 1)} = ${f(M.F_SMAX)} N. ${f(P6, 1)} N is below it, so the block stays put and static friction is just what balances the push: ${p3(P6)} N. μ<sub>s</sub><i>F</i><sub>N</sub> is the <b>maximum</b>, not the value.</p>` },
    { q: `Когда брусок начинает скользить, сила толчка возрастает до ${f(P6b, 1)} Н. Чему равно его ускорение?`,
      choices: [`${p3((P6b - M.F_SMAX) / M.M1)} м/с²`, `${p3(P6b / M.M1)} м/с²`, `${p3((P6b + M.F_K) / M.M1)} м/с²`, `${p3(A6)} м/с²`], answer: 3,
      why: `<p>Sliding, so kinetic friction μ<sub>k</sub><i>mg</i> = ${f(M.F_K)} N acts backward:</p><div class="eq"><i>a</i> = (${f(P6b, 1)} − ${f(M.F_K)}) / ${f(M.M1, 1)} = ${p3(A6)} m/s²</div><p>Static friction’s ${f(M.F_SMAX)} N limit no longer applies once it slides.</p>` },
  ],
  7: [
    { q: `Теперь ту же силу ${f(M.PUSH, 1)} Н прикладывают к блоку B массой ${f(M.M2, 1)}, толкая его в блок A массой ${f(M.M1, 1)} кг по поверхности без трения. С какой силой блоки давят друг на друга?`,
      choices: [`${p3(C7)} Н`, `${p3(M.CONTACT)} Н`, `${p3(M.PUSH)} Н`, `${p3(M.PUSH / 2)} Н`], answer: 0,
      why: `<p>Together: <i>a</i> = ${f(M.PUSH, 1)}/(${f(M.M1, 1)} + ${f(M.M2, 1)}) = ${f(M.A_PAIR, 2)} m/s². The contact force is the only horizontal force on A, so</p><div class="eq"><i>F</i><sub>BA</sub> = <i>m</i><sub>A</sub><i>a</i> = ${f(M.M1, 1)} × ${f(M.A_PAIR, 2)} = ${p3(C7)} N</div><p>Pushing the lighter block from behind needs only a small contact force; ${p3(M.CONTACT)} N was the answer with the push on A.</p>` },
    { q: `Блок покоится на столе. Какая сила является парой по третьему закону Ньютона к силе тяжести, с которой Земля притягивает блок вниз?`,
      choices: ['сила реакции стола, направленная вверх и действующая на брусок', 'сила притяжения, с которой брусок действует на Землю', 'сила, с которой брусок давит вниз на стол', 'сила, с которой стол давит вниз на пол'], answer: 1,
      why: `<p>A third-law pair is the same interaction seen from both sides: Earth pulls block, block pulls Earth, same size, opposite directions, on different objects. The table’s normal force also acts on the block, so it can’t be the partner, even though here it is equal in size.</p>` },
  ],
  8: [
    { q: `Два конькобежца A массой ${TG.mA} кг и B массой ${TG.mB} кг стоят на расстоянии ${f(TG.d0, 1)} м друг от друга на льду без трения и тянут лёгкую верёвку, пока не встретятся. На каком расстоянии от начальной точки A они встретятся?`,
      choices: [`${p3(TG.d0 / 2)} м`, `${p3(TG.d0 * TG.mA / TG.M)} м`, `${p3(MEET)} м`, `${p3(TG.d0 * TG.mA / TG.mB)} м`], answer: 2,
      why: `<p>Only internal forces act horizontally, so the centre of mass stays put; they meet there. From A:</p><div class="eq"><i>x</i><sub>cm</sub> = (<i>m</i><sub>A</sub> · 0 + <i>m</i><sub>B</sub> · <i>d</i>) / (<i>m</i><sub>A</sub> + <i>m</i><sub>B</sub>) = ${TG.mB} × ${f(TG.d0, 1)} / ${TG.M} = ${p3(MEET)} m</div><p>The lighter skater moves farther. ${p3(TG.d0 * TG.mA / TG.M)} m swaps the masses.</p>` },
    { q: `Какое утверждение верно для системы из двух конькобежцев и верёвки во время их сближения?`,
      choices: ['Центр масс перемещается в сторону более тяжёлого конькобежца.', 'Сила натяжения верёвки ускоряет центр масс системы.', 'Силы натяжения, действующие на A и B, компенсируют друг друга только при равных массах.', 'Центр масс остаётся в покое, поскольку силы натяжения являются внутренними.'], answer: 3,
      why: `<p>The rope pulls A and B with equal and opposite forces, both inside the system, so they add to zero whatever the masses. Weight and normal force cancel. With Σ<i>F</i><sub>ext</sub> = 0, <i>a</i><sub>cm</sub> = 0, and it started at rest.</p>` },
  ],
  9: [
    { q: `Силу тяги, приложенную к доске, увеличивают до ${F9} Н. Блок массой ${f(BD.m, 1)} кг продолжает скользить по доске массой ${f(BD.Mb, 1)} кг (μk = ${f(BD.mu_k)}). Чему равно ускорение блока?`,
      choices: [`${p3(ACM9)} м/с²`, `${p3(BD.aBlock)} м/с²`, `${p3(BD.mu_s * G)} м/с²`, `${p3(ABOARD9)} м/с²`], answer: 1,
      why: `<p>The only horizontal force on the block is kinetic friction, μ<sub>k</sub><i>mg</i> = ${f(BD.f)} N, whatever the pull:</p><div class="eq"><i>a</i> = μ<sub>k</sub><i>g</i> = ${f(BD.mu_k)} × ${f(G)} = ${p3(BD.aBlock)} m/s²</div><p>The rope pulls the board, not the block. ${p3(ACM9)} m/s² is the centre of mass.</p>` },
    { q: `При той же силе тяги ${F9} Н чему равно ускорение центра масс системы «блок + доска»?`,
      choices: [`${p3(F9 / BD.Mb)} м/с²`, `${p3(ABOARD9)} м/с²`, `${p3((F9 - BD.f) / BD.M)} м/с²`, `${p3(ACM9)} м/с²`], answer: 3,
      why: `<p>Friction between block and board is internal and cancels. The only horizontal external force is the pull:</p><div class="eq"><i>a</i><sub>cm</sub> = Σ<i>F</i><sub>ext</sub>/<i>M</i> = ${F9} / ${f(BD.M, 1)} = ${p3(ACM9)} m/s²</div><p>Check: (${f(BD.m, 1)} × ${f(BD.aBlock)} + ${f(BD.Mb, 1)} × ${f(ABOARD9)}) / ${f(BD.M, 1)} = ${f(ACM9)} m/s².</p>` },
  ],
  10: [
    { q: `Блок начинает скользить из состояния покоя вниз по наклонной плоскости длиной ${f(M.INC_LEN, 1)} м и углом ${M.THETA_DEG}°, трения нет. Какую скорость он будет иметь внизу?`,
      choices: [`${p3(Math.sqrt(2 * G * M.INC_LEN))} м/с`, `${p3(Math.sqrt(G * sin(M.THETA_DEG) * M.INC_LEN))} м/с`, `${p3(V10)} м/с`, `${p3(Math.sqrt(2 * G * cos(M.THETA_DEG) * M.INC_LEN))} м/с`], answer: 2,
      why: `<p>Along the slope <i>a</i> = <i>g</i> sin θ = ${f(M.A_INC)} m/s². From rest, with no time given:</p><div class="eq"><i>v</i> = √(2<i>aL</i>) = √(2 × ${f(M.A_INC)} × ${f(M.INC_LEN, 1)}) = ${p3(V10)} m/s</div><p>${p3(Math.sqrt(2 * G * M.INC_LEN))} m/s uses the full <i>g</i>, as if it fell ${f(M.INC_LEN, 1)} m straight down; cos θ is the part <b>into</b> the slope.</p>` },
    { q: `Теперь наклонная плоскость шероховатая, μk = ${f(M.MU_K)}. Чему равно ускорение блока, скользящего вниз?`,
      choices: [`${p3(M.A_INC)} м/с²`, `${p3(G * (sin(M.THETA_DEG) + M.MU_K * cos(M.THETA_DEG)))} м/с²`, `${p3(A10)} м/с²`, `${p3(G * (sin(M.THETA_DEG) - M.MU_K))} м/с²`], answer: 2,
      why: `<p>Friction is μ<sub>k</sub><i>F</i><sub>N</sub>, and on a slope <i>F</i><sub>N</sub> = <i>mg</i> cos θ. It points up the slope, against the sliding:</p><div class="eq"><i>a</i> = <i>g</i>(sin θ − μ<sub>k</sub> cos θ) = ${f(G)}(${f(sin(M.THETA_DEG), 3)} − ${f(M.MU_K)} × ${f(cos(M.THETA_DEG), 3)}) = ${p3(A10)} m/s²</div><p>${p3(G * (sin(M.THETA_DEG) - M.MU_K))} m/s² uses <i>F</i><sub>N</sub> = <i>mg</i>, true only on level ground.</p>` },
  ],
  11: [
    { q: `Мяч массой ${f(DR.m, 2)} кг (коэффициент линейного сопротивления b = ${f(DR.b)} кг/с) отпускают без начальной скорости. Через какое время его скорость достигнет половины предельной скорости?`,
      choices: [`${p3(DR.tau / 2)} с`, `${p3(THALF)} с`, `${p3(DR.tau)} с`, `${p3(Math.log(2))} с`], answer: 1,
      why: `<p>From <i>m</i> d<i>v</i>/d<i>t</i> = <i>mg</i> − <i>bv</i>, separating and integrating gives <i>v</i> = <i>v</i><sub>t</sub>(1 − e<sup>−<i>t</i>/τ</sup>), τ = <i>m</i>/<i>b</i> = ${f(DR.tau)} s. Set <i>v</i> = <i>v</i><sub>t</sub>/2:</p><div class="eq">e<sup>−<i>t</i>/τ</sup> = ½ &nbsp;→ <i>t</i> = τ ln 2 = ${f(DR.tau)} × ${f(Math.log(2), 3)} = ${p3(THALF)} s</div><p>Speed doesn’t grow linearly, so it isn’t τ/2; and at τ it already has 63%.</p>` },
    { q: `Для того же мяча, движение которого описывается уравнением m dv/dt = mg − bv и который начинает падать из состояния покоя, найдите ускорение a(t), продифференцировав v(t). Затем определите силу сопротивления в момент, когда a = g/4, и время, когда это произойдёт.`,
      solution: `<p>1. <i>v</i> = <i>v</i><sub>t</sub>(1 − e<sup>−<i>t</i>/τ</sup>), so <i>a</i> = d<i>v</i>/d<i>t</i> = (<i>v</i><sub>t</sub>/τ) e<sup>−<i>t</i>/τ</sup> = <i>g</i> e<sup>−<i>t</i>/τ</sup>, since <i>v</i><sub>t</sub>/τ = (<i>mg</i>/<i>b</i>)(<i>b</i>/<i>m</i>) = <i>g</i>.</p><p>2. From the ODE, <i>ma</i> = <i>mg</i> − <i>F</i><sub>d</sub>. With <i>a</i> = <i>g</i>/4:</p><div class="eq"><i>F</i><sub>d</sub> = <i>mg</i> − <i>mg</i>/4 = ¾<i>mg</i> = ¾ × ${f(DR.W, 2)} = ${f(D11, 2)} N</div><p>3. e<sup>−<i>t</i>/τ</sup> = ¼ gives <i>t</i> = τ ln 4 = ${f(DR.tau)} × ${f(Math.log(4), 3)} = ${f(DR.tau * Math.log(4), 3)} s. Check: <i>v</i> = ¾<i>v</i><sub>t</sub> = ${f(0.75 * DR.vt)} m/s and <i>bv</i> = ${f(DR.b * 0.75 * DR.vt, 2)} N.</p>` },
  ],
  12: [
    { q: `Какое расстояние пролетел вниз мяч с предельной скоростью vt = ${f(DR.vt)} м/с и постоянной времени τ = ${f(DR.tau)} с за ${f(T12)} с после отпускания из состояния покоя?`,
      choices: [`${p3(DR.vt * T12)} м`, `${p3(X12)} м`, `${p3(DR.vt * (T12 - DR.tau))} м`, `${p3(0.5 * G * T12 ** 2)} м`], answer: 1,
      why: `<p>Integrate the velocity:</p><div class="eq"><i>x</i> = ∫<sub>0</sub><sup><i>t</i></sup> <i>v</i><sub>t</sub>(1 − e<sup>−<i>t</i>′/τ</sup>) d<i>t</i>′ = <i>v</i><sub>t</sub>[<i>t</i> − τ(1 − e<sup>−<i>t</i>/τ</sup>)]</div><div class="eq">= ${f(DR.vt)} × [${f(T12)} − ${f(DR.tau)}(1 − e<sup>−${f(T12 / DR.tau, 1)}</sup>)] = ${p3(X12)} m</div><p>${p3(DR.vt * (T12 - DR.tau))} m is the late-time asymptote <i>v</i><sub>t</sub>(<i>t</i> − τ); at <i>t</i> = ${f(T12 / DR.tau, 1)}τ the e<sup>−<i>t</i>/τ</sup> term is not yet negligible. ${p3(0.5 * G * T12 ** 2)} m ignores drag.</p>` },
    { q: `Два мяча одинакового размера и формы падают до достижения предельной скорости; масса одного в четыре раза больше массы другого. Во сколько раз предельная скорость тяжёлого мяча больше при линейном сопротивлении (bv) и при квадратичном сопротивлении (kv²)?`,
      choices: ['линейное сопротивление — в 2 раза, квадратичное — в 4 раза', 'линейное сопротивление — в 4 раза, квадратичное — в 4 раза', 'линейное сопротивление — в 2 раза, квадратичное — в 2 раза', 'линейное сопротивление — в 4 раза, квадратичное — в 2 раза'], answer: 3,
      why: `<p>At terminal speed drag = <i>mg</i>. Linear: <i>bv</i><sub>t</sub> = <i>mg</i>, <i>v</i><sub>t</sub> = <i>mg</i>/<i>b</i> ∝ <i>m</i>, so 4×. Quadratic: <i>kv</i><sub>t</sub>² = <i>mg</i>, <i>v</i><sub>t</sub> = √(<i>mg</i>/<i>k</i>) ∝ √<i>m</i>, so 2×. Same size and shape keeps <i>b</i> and <i>k</i> the same.</p>` },
  ],
};
