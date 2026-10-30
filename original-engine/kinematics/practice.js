// Задания в стиле AP: один или два вопроса на страницу (ключи — индексы страниц из PAGES).
// Все числовые значения вычисляются по model.js; checks.mjs независимо проверяет ответы.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + Math.abs(x).toPrecision(3);   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const dg = r => r * 180 / Math.PI;

// 0 · бросок с большей начальной скоростью
const H2 = (2 * M.VY0) ** 2 / (2 * M.G);
// 1 · ловля при падении ниже точки броска
const DROP = 1.50, DIST1 = 2 * M.H + DROP;
// 2 · средние значения за первые 1,50 с
const T2 = 1.50, Y2 = M.y(T2), D2 = 2 * M.H - Y2;
// 3 · уменьшение промежутков на стробоскопической последовательности
const TAU = M.STROBE;
// 5 · скорость на высоте 3,00 м
const Y5 = 3.00, V5 = Math.sqrt(M.VY0 ** 2 - 2 * M.G * Y5);
// 6 · удвоенная горизонтальная скорость
const R6 = 2 * M.VX * M.T;
// 7 · автомобиль движется быстрее
const VC7 = 20.0, A7 = dg(Math.atan2(VC7, M.RAIN.vr));
// 8 · более сильное течение, лодка направлена прямо поперёк
const VW8 = 2.0;
// 9 · уменьшающееся ускорение автомобиля в момент 2,00 с
const T9 = 2.00, V9 = M.PULL.a0 * T9 - 0.5 * M.PULL.k * T9 ** 2;

export const PRACTICE = {
  0: [
    { q: `Мяч бросают вертикально вверх со скоростью ${f(2 * M.VY0, 1)} м/с вместо ${f(M.VY0)} м/с. На какую высоту он поднимется? (Сопротивлением воздуха пренебречь.)`,
      choices: [`${p3(2 * M.H)} m`, `${p3(Math.SQRT2 * M.H)} m`, `${p3(H2)} m`, `${p3(8 * M.H)} m`], answer: 2,
      why: `<p>At the top <i>v</i> = 0, so <i>h</i> = <i>v</i><sub>0</sub>²/2<i>g</i>. Height goes as the <b>square</b> of the launch speed: doubling <i>v</i><sub>0</sub> gives 4 × ${f(M.H)} m.</p><div class="eq"><i>h</i> = (${f(2 * M.VY0, 1)})² / (2 × ${f(M.G)}) = ${p3(H2)} m</div><p>${p3(2 * M.H)} m assumes height is proportional to speed.</p>` },
    { q: 'В момент нахождения мяча в наивысшей точке его ускорение',
      choices: ['ноль', `${f(M.G)} m/s² вниз`, `${f(M.G)} m/s² вверх`, 'не определено, поскольку мяч меняет направление'], answer: 1,
      why: `<p>Gravity is the only force at every instant, so <i>a</i> = <i>g</i> = ${f(M.G)} m/s² down the whole flight. At the top the <b>velocity</b> is ноль, but it is still changing: a moment later it points down.</p>` },
  ],
  1: [
    { q: `Мяч бросают вертикально вверх со скоростью ${f(M.VY0)} m/s с края платформы и ловят при падении на ${f(DROP)} м <b>ниже</b> точки броска. Какой общий путь он прошёл?`,
      choices: [`${p3(DROP)} m`, `${p3(2 * M.H - DROP)} m`, `${p3(M.H + DROP)} m`, `${p3(DIST1)} m`], answer: 3,
      why: `<p>Distance adds up every leg of the path. It rises <i>h</i> = <i>v</i><sub>0</sub>²/2<i>g</i> = ${f(M.H)} m, falls ${f(M.H)} m back to the launch point, then ${f(DROP)} m more:</p><div class="eq">${f(M.H)} + ${f(M.H)} + ${f(DROP)} = ${p3(DIST1)} m</div><p>${p3(DROP)} m is the size of the <b>displacement</b> (−${f(DROP)} m, up positive), not the distance.</p>` },
    { q: 'Как соотносятся модуль перемещения и пройденный путь тела, движущегося по прямой?',
      choices: ['Они всегда равны.', 'Перемещение может быть больше пути.', 'Перемещение не может быть больше пути; они равны, только если тело не меняет направление движения.', 'Перемещение всегда меньше пути.'], answer: 2,
      why: `<p>Distance counts every metre of path; displacement only the net change. Any reversal cancels part of the displacement but adds to the distance (the round trip: 0 m against ${f(2 * M.H)} m). With no reversal they are equal, so “always smaller” is wrong too.</p>` },
  ],
  2: [
    { q: `Чему равен средний <b>модуль скорости</b> мяча от момента броска до <i>t</i> = ${f(T2)} с? (Мяч брошен вверх со скоростью ${f(M.VY0)} м/с и достигает максимальной высоты ${f(M.H)} м в момент ${f(M.T / 2)} с.)`,
      choices: [`${p3(D2 / T2)} m/s`, `${p3(Y2 / T2)} m/s`, `${p3(M.H / T2)} m/s`, `${p3((M.VY0 + Math.abs(M.vy(T2))) / 2)} m/s`], answer: 0,
      why: `<p>Average speed = distance / time. At ${f(T2)} s the ball is at <i>y</i> = ${f(M.VY0)}(${f(T2)}) − ½(${f(M.G)})(${f(T2)})² = ${f(Y2, 3)} m, on the way down. Distance = up ${f(M.H)} m + down ${f(M.H - Y2, 3)} m = ${f(D2, 3)} m.</p><div class="eq">${f(D2, 3)} m / ${f(T2)} s = ${p3(D2 / T2)} m/s</div><p>${p3(Y2 / T2)} m/s is the average <b>velocity</b> (displacement / time).</p>` },
    { q: 'Сравните скорость мяча сразу после броска и непосредственно перед возвращением на высоту руки.',
      choices: ['Они одинаковы.', 'Скорость при приземлении больше, поскольку сила тяжести действовала дольше.', 'Both are ноль on average, so they cannot be compared.', 'Одинаковые модули, противоположные направления.'], answer: 3,
      why: `<p>The motion is symmetric: +${f(M.VY0)} m/s at launch, −${f(M.VY0)} m/s at the same height coming down (<i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i> with Δ<i>y</i> = 0). Equal speeds, but velocity includes direction, so the velocities differ.</p>` },
  ],
  3: [
    { q: 'Считая направление вверх положительным, на каком участке полёта мяч ускоряется?',
      choices: ['При подъёме, поскольку скорость положительна', 'В верхней точке, поскольку там ускорение максимально', 'При падении, поскольку v и a имеют одинаковые знаки', 'Никогда: отрицательное ускорение всегда замедляет тело'], answer: 2,
      why: `<p>Speeding up means <i>v</i> and <i>a</i> point the same way. <i>a</i> = −${f(M.G)} m/s² throughout; on the way down <i>v</i> is also negative, so the speed grows. A negative <i>a</i> slows the ball only while <i>v</i> is positive.</p>` },
    { q: `Стробоскоп делает вспышку каждые ${f(TAU, 3)} с. На сколько уменьшается расстояние между соседними изображениями мяча при подъёме по сравнению с предыдущим интервалом?`,
      choices: [`${p3(0.5 * M.G * TAU ** 2)} m`, `${p3(M.G * TAU ** 2)} m`, `${p3(M.G * TAU)} m`, `${p3(2 * M.G * TAU ** 2)} m`], answer: 1,
      why: `<p>Each gap is the distance covered in one interval, <i>v</i>τ − ½<i>g</i>τ², where <i>v</i> is the speed at its start. From one gap to the next <i>v</i> drops by <i>g</i>τ, so the gap drops by (<i>g</i>τ)τ:</p><div class="eq">Δ(gap) = <i>g</i>τ² = ${f(M.G)} × (${f(TAU, 3)})² = ${p3(M.G * TAU ** 2)} m</div><p>The ½ belongs to a single gap, not to the difference between two.</p>` },
  ],
  4: [
    { q: `На графике <i>v</i>–<i>t</i> мяча (вверх — положительное направление, <i>v</i><sub>0</sub> = ${f(M.VY0)} м/с) чему равна результирующая площадь между графиком и осью времени от 0 до ${f(T2)} с?`,
      choices: [`${p3(D2)} m`, `${p3(M.VY0 * T2)} m`, `${p3(M.H)} m`, `${p3(Y2)} m`], answer: 3,
      why: `<p>Area under <i>v</i>–<i>t</i> is displacement; area below the axis counts negative. Above the axis, a triangle to ${f(M.T / 2)} s: +½(${f(M.VY0)})(${f(M.T / 2)}) = +${f(M.H)} m. Below, from ${f(M.T / 2)} to ${f(T2)} s: −½(${f(T2 - M.T / 2)})(${f(-M.vy(T2))}) = −${f(M.H - Y2, 3)} m.</p><div class="eq">net = ${f(M.H)} − ${f(M.H - Y2, 3)} = ${p3(Y2)} m</div><p>${p3(D2)} m adds the part below the axis instead of subtracting it: that is the distance.</p>` },
    { q: 'At the instant the ball is at its highest point, which of these is ноль?',
      choices: ['наклон графика <i>y</i>–<i>t</i>', 'наклон графика <i>v</i>–<i>t</i>', 'значение на графике <i>a</i>–<i>t</i>', 'площадь под графиком <i>a</i>–<i>t</i> с момента броска'], answer: 0,
      why: `<p>The slope of <i>y</i>–<i>t</i> is the velocity, which is ноль at the top. The slope of <i>v</i>–<i>t</i> and the <i>a</i>–<i>t</i> value are both −${f(M.G)} m/s². The area under <i>a</i>–<i>t</i> since launch is Δ<i>v</i> = −${f(M.VY0)} m/s, not ноль.</p>` },
  ],
  5: [
    { q: `С каким модулем скорости движется мяч, когда находится на высоте ${f(Y5)} м над точкой броска? (<i>v</i><sub>0</sub> = ${f(M.VY0)} м/с вверх.)`,
      choices: [`${p3(Math.sqrt(M.VY0 ** 2 + 2 * M.G * Y5))} m/s`, `${p3(V5)} m/s`, `${p3(Math.sqrt(M.VY0 ** 2 - M.G * Y5))} m/s`, `${p3(V5 ** 2)} m/s`], answer: 1,
      why: `<p>No time is given or needed, so use the equation that leaves out <i>t</i>, with <i>a</i> = −${f(M.G)} m/s²:</p><div class="eq"><i>v</i>² = ${f(M.VY0)}² + 2(−${f(M.G)})(${f(Y5)}) = ${f(V5 ** 2)} m²/s², &nbsp;<i>v</i> = ${p3(V5)} m/s</div><p>${p3(Math.sqrt(M.VY0 ** 2 + 2 * M.G * Y5))} m/s comes from taking <i>a</i> as +<i>g</i>: the ball must be slower up there, not faster. (It passes ${f(Y5)} m twice, at this same speed.)</p>` },
    { q: `Нужно найти время, за которое мяч впервые достигнет высоты ${f(Y5)} м, зная только <i>v</i><sub>0</sub>, <i>a</i> и Δ<i>y</i>. Какое уравнение позволит найти время напрямую?`,
      choices: ['<i>v</i> = <i>v</i><sub>0</sub> + <i>at</i>', '<i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i>', 'Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>²', 'Δ<i>y</i> = ½(<i>v</i><sub>0</sub> + <i>v</i>)<i>t</i>'], answer: 2,
      why: `<p>The unknown you don’t need is the final velocity <i>v</i>, so pick the equation that leaves out <i>v</i>: Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>². It is quadratic in <i>t</i>; the smaller root is the way up. The other three either contain <i>v</i> or contain no <i>t</i>.</p>` },
  ],
  6: [
    { q: `Второй мяч начинает движение с горизонтальной скоростью ${f(M.VX)} м/с и вертикальной скоростью ${f(M.VY0)} м/с вверх. Чему равен модуль его скорости в верхней точке траектории?`,
      choices: ['0 m/s', `${p3(M.VY0)} m/s`, `${p3(M.V0P)} m/s`, `${p3(M.VX)} m/s`], answer: 3,
      why: `<p>At the top only <i>v</i><sub>y</sub> is ноль. Nothing acts sideways, so <i>v</i><sub>x</sub> stays ${f(M.VX)} m/s, and the speed is √(<i>v</i><sub>x</sub>² + 0²) = ${p3(M.VX)} m/s. “0 m/s” is true only for the ball thrown straight up.</p>` },
    { q: `Если бросить мяч снова с той же вертикальной скоростью ${f(M.VY0)} m/s вверх but <b>twice</b> the sideways speed, ${f(2 * M.VX)} м, с уровня земли, на каком расстоянии он приземлится?`,
      choices: [`${p3(M.RANGE)} m`, `${p3(R6)} m`, `${p3(4 * M.RANGE)} m`, `${p3(Math.SQRT2 * M.RANGE)} m`], answer: 1,
      why: `<p>The time in the air depends only on the vertical motion: <i>t</i> = 2<i>v</i><sub>0y</sub>/<i>g</i> = ${f(M.T)} s, unchanged. The horizontal motion is uniform:</p><div class="eq">Δ<i>x</i> = <i>v</i><sub>x</sub><i>t</i> = ${f(2 * M.VX)} × ${f(M.T)} = ${p3(R6)} m</div><p>${p3(4 * M.RANGE)} m would follow from doubling the whole launch speed, which also doubles the time.</p>` },
  ],
  7: [
    { q: `Дождь падает вертикально вниз со скоростью ${f(M.RAIN.vr, 1)} м/с. Автомобиль увеличивает скорость до ${f(VC7, 1)} м/с. Под каким углом к вертикали наклоняются следы дождя с точки зрения пассажира автомобиля?`,
      choices: [`${p3(dg(Math.atan2(M.RAIN.vr, VC7)))}°`, `${p3(M.RAIN_ANGLE)}°`, `${p3(A7)}°`, `${p3(dg(Math.atan2(M.RAIN.vr, M.RAIN.vc)))}°`], answer: 2,
      why: `<p><i>v</i><sub>RC</sub> = <i>v</i><sub>RG</sub> + <i>v</i><sub>GC</sub>: ${f(M.RAIN.vr, 1)} m/s down plus ${f(VC7, 1)} m/s назад, at right angles. From vertical, the opposite side is the horizontal part:</p><div class="eq">tan θ = ${f(VC7, 1)} / ${f(M.RAIN.vr, 1)}, &nbsp;θ = ${p3(A7)}°</div><p>${p3(dg(Math.atan2(M.RAIN.vr, VC7)))}° is the angle from the <b>horizontal</b>.</p>` },
    { q: `Какова скорость дороги относительно пассажира автомобиля, движущегося вперёд со скоростью ${f(M.RAIN.vc, 1)} м/с?`,
      choices: [`${f(M.RAIN.vc, 1)} m/s назад`, `${f(M.RAIN.vc, 1)} m/s вперёд`, 'ноль: the road is the reference', `${f(M.vlen(M.V_RC))} m/s, slanted`], answer: 0,
      why: `<p>Swapping the letters flips the vector: <i>v</i><sub>GC</sub> = −<i>v</i><sub>CG</sub>. The car moves ${f(M.RAIN.vc, 1)} m/s вперёд relative to the road, so the road moves ${f(M.RAIN.vc, 1)} m/s назад relative to the car. Which object is the reference is a choice, not a fact.</p>` },
  ],
  8: [
    { q: `Скорость течения увеличивается до ${f(VW8, 1)} м/с. Лодка по-прежнему движется относительно воды со скоростью ${f(M.RIVER.vb, 1)} м/с и направлена прямо поперёк реки шириной ${M.RIVER.w} м. Сколько времени займёт переправа?`,
      choices: [`${p3(M.RIVER.w / Math.hypot(M.RIVER.vb, VW8))} s`, `${p3(M.RIVER.w / Math.sqrt(M.RIVER.vb ** 2 - VW8 ** 2))} s`, `${p3(M.RIVER.w / (M.RIVER.vb + VW8))} s`, `${p3(M.RIVER.w / M.RIVER.vb)} s`], answer: 3,
      why: `<p>Only the across part of the velocity carries the boat to the far bank, and the current has no across part. So</p><div class="eq"><i>t</i> = <i>w</i> / <i>v</i><sub>b</sub> = ${M.RIVER.w} / ${f(M.RIVER.vb, 1)} = ${p3(M.RIVER.w / M.RIVER.vb)} s</div><p>the same as before; the stronger current only carries it farther downstream (${f(VW8 * M.RIVER.w / M.RIVER.vb, 1)} m). Dividing by the full speed ${f(Math.hypot(M.RIVER.vb, VW8))} m/s uses the slanted path’s speed for a straight-across distance.</p>` },
    { q: `При скорости течения ${f(M.RIVER.vw, 1)} м/с: на какой угол против течения от направления прямо поперёк нужно направить лодку со скоростью ${f(M.RIVER.vb, 1)} м/с, чтобы попасть точно на противоположный берег?`,
      choices: [`${p3(dg(Math.atan(M.RIVER.vw / M.RIVER.vb)))}°`, `${p3(dg(M.AIM_UP))}°`, `${p3(dg(Math.acos(M.RIVER.vw / M.RIVER.vb)))}°`, `${p3(dg(Math.atan(M.RIVER.vb / M.RIVER.vw)))}°`], answer: 1,
      why: `<p>The boat’s upstream part must cancel the current. The boat’s own velocity is the hypotenuse:</p><div class="eq"><i>v</i><sub>b</sub> sin θ = <i>v</i><sub>w</sub> &nbsp;→ sin θ = ${f(M.RIVER.vw, 1)} / ${f(M.RIVER.vb, 1)}, θ = ${p3(dg(M.AIM_UP))}°</div><p>tan θ = ${f(M.RIVER.vw, 1)}/${f(M.RIVER.vb, 1)} treats ${f(M.RIVER.vb, 1)} m/s as the across side, but that is the boat’s whole speed through the water.</p>` },
  ],
  9: [
    { q: `Автомобиль начинает движение из состояния покоя с ускорением <i>a</i> = ${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i> (м/с², <i>t</i> в секундах). Чему равен модуль скорости в момент <i>t</i> = ${f(T9)} с?`,
      choices: [`${p3(M.PULL.a0 * T9 - M.PULL.k * T9 ** 2)} m/s`, `${p3(M.PULL.a0 * T9)} m/s`, `${p3(V9)} m/s`, `${p3(M.pa(T9))} m/s`], answer: 2,
      why: `<p><i>a</i> is not constant, so integrate:</p><div class="eq"><i>v</i>(<i>t</i>) = ∫<sub>0</sub><sup><i>t</i></sup> (${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i>′) d<i>t</i>′ = ${f(M.PULL.a0, 1)}<i>t</i> − ${f(M.PULL.k / 2)}<i>t</i>²</div><div class="eq"><i>v</i>(${f(T9)}) = ${f(M.PULL.a0 * T9, 1)} − ${f(M.PULL.k / 2 * T9 ** 2, 1)} = ${p3(V9)} m/s</div><p>${p3(M.PULL.a0 * T9 - M.PULL.k * T9 ** 2)} m/s forgets the ½ from integrating <i>t</i>; ${p3(M.PULL.a0 * T9)} m/s treats <i>a</i> as constant at ${f(M.PULL.a0, 1)} m/s².</p>` },
    { q: `For the same car (<i>a</i> = <i>a</i><sub>0</sub> − <i>kt</i> until it reaches ноль, then 0; from rest at <i>x</i> = 0), show that it has gone <i>x</i><sub>1</sub> = <i>a</i><sub>0</sub>³/3<i>k</i>² when the acceleration reaches ноль, and find where it is at <i>t</i> = 5.00 s.`,
      solution: `<p>1. <i>a</i> = 0 at <i>t</i><sub>1</sub> = <i>a</i><sub>0</sub>/<i>k</i> = ${f(M.T1)} s.</p><p>2. <i>v</i> = ∫<sub>0</sub><sup><i>t</i></sup><i>a</i> d<i>t</i>′ = <i>a</i><sub>0</sub><i>t</i> − ½<i>kt</i>², so <i>v</i><sub>1</sub> = <i>a</i><sub>0</sub>²/2<i>k</i> = ${f(M.V1, 1)} m/s.</p><p>3. <i>x</i> = ∫<sub>0</sub><sup><i>t</i></sup><i>v</i> d<i>t</i>′ = ½<i>a</i><sub>0</sub><i>t</i>² − <i>kt</i>³/6. At <i>t</i><sub>1</sub>:</p><div class="eq"><i>x</i><sub>1</sub> = <i>a</i><sub>0</sub>³/2<i>k</i>² − <i>a</i><sub>0</sub>³/6<i>k</i>² = <i>a</i><sub>0</sub>³/3<i>k</i>² = ${f(M.PULL.a0, 1)}³ / (3 × ${f(M.PULL.k, 1)}²) = ${f(M.X1, 1)} m</div><p>4. After <i>t</i><sub>1</sub>, <i>a</i> = 0, so <i>v</i> stays ${f(M.V1, 1)} m/s:</p><div class="eq"><i>x</i>(5.00) = ${f(M.X1, 1)} + ${f(M.V1, 1)} × (5.00 − ${f(M.T1)}) = ${f(M.px(5), 1)} m</div>` },
  ],
  10: [
    { q: `A particle moves as <i>x</i> = <i>t</i>³ − 3<i>t</i> (m, s). What is its acceleration at the instant its velocity is ноль (<i>t</i> &gt; 0)?`,
      choices: [`${p3(M.ca(M.T_TURN))} m/s²`, '0 m/s²', `${p3(M.cx(M.T_TURN))} m/s²`, `${p3(3 * M.CUBE.A * M.T_TURN)} m/s²`], answer: 0,
      why: `<p><i>v</i> = d<i>x</i>/d<i>t</i> = 3<i>t</i>² − 3 = 0 at <i>t</i> = ${f(M.T_TURN)} s. <i>a</i> = d<i>v</i>/d<i>t</i> = 6<i>t</i> = ${p3(M.ca(M.T_TURN))} m/s².</p><p>Zero velocity does not mean ноль acceleration: the particle is turning around, so its velocity is changing. (${p3(M.cx(M.T_TURN))} is its position there, in m.)</p>` },
    { q: 'A particle has <i>a</i> = 6<i>t</i> (m/s²), with <i>v</i>(0) = −3 m/s and <i>x</i>(0) = 0. Find <i>x</i>(<i>t</i>), the time <i>t</i> &gt; 0 when it is back at <i>x</i> = 0, and its velocity then.',
      solution: `<p>1. Integrate once: <i>v</i> = 3<i>t</i>² + <i>C</i><sub>1</sub>; <i>v</i>(0) = −3 gives <i>C</i><sub>1</sub> = −3.</p><p>2. Integrate again: <i>x</i> = <i>t</i>³ − 3<i>t</i> + <i>C</i><sub>2</sub>; <i>x</i>(0) = 0 gives <i>C</i><sub>2</sub> = 0.</p><p>3. <i>x</i> = <i>t</i>(<i>t</i>² − 3) = 0 at <i>t</i> = √3 = ${f(Math.sqrt(3))} s.</p><div class="eq"><i>v</i>(√3) = 3(3) − 3 = ${f(M.cv(Math.sqrt(3)))} m/s</div><p>It went left to <i>x</i> = −2 м в момент 1 s, then came back moving right, faster than it started.</p>` },
  ],
};
