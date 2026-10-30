// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + Math.abs(x).toPrecision(3);   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const dg = r => r * 180 / Math.PI;

// 0 · a faster throw
const H2 = (2 * M.VY0) ** 2 / (2 * M.G);
// 1 · caught on the way down, below the launch point
const DROP = 1.50, DIST1 = 2 * M.H + DROP;
// 2 · averages over the first 1.50 с
const T2 = 1.50, Y2 = M.y(T2), D2 = 2 * M.H - Y2;
// 3 · strobe gaps shrink by gτ²
const TAU = M.STROBE;
// 5 · speed в момент 3.00 м up
const Y5 = 3.00, V5 = Math.sqrt(M.VY0 ** 2 - 2 * M.G * Y5);
// 6 · twice the sideways speed
const R6 = 2 * M.VX * M.T;
// 7 · a faster car
const VC7 = 20.0, A7 = dg(Math.atan2(VC7, M.RAIN.vr));
// 8 · a stronger current, aimed straight across
const VW8 = 2.0;
// 9 · the fading pull, в момент 2.00 с
const T9 = 2.00, V9 = M.PULL.a0 * T9 - 0.5 * M.PULL.k * T9 ** 2;

export const PRACTICE = {
  0: [
    { q: `Мяч бросают вертикально вверх со скоростью ${f(2 * M.VY0, 1)} м/с instead of ${f(M.VY0)} м/с. На какую высоту он поднимется? (Сопротивлением воздуха пренебречь.)`,
      choices: [`${p3(2 * M.H)} м`, `${p3(Math.SQRT2 * M.H)} м`, `${p3(H2)} м`, `${p3(8 * M.H)} м`], answer: 2,
      why: `<p>В верхней точке <i>v</i> = 0, поэтому <i>h</i> = <i>v</i><sub>0</sub>²/2<i>g</i>. Высота пропорциональна <b>квадрату</b> начальной скорости: при удвоении <i>v</i><sub>0</sub> она увеличивается в 4 раза: ${f(M.H)} м.</p><div class="eq"><i>h</i> = (${f(2 * M.VY0, 1)})² / (2 × ${f(M.G)} ) = ${p3(H2)} м</div><p>${p3(2 * M.H)} м assumes height is proportional до speed.</p>` },
    { q: 'В момент нахождения мяча в наивысшей точке его ускорение',
      choices: ['zero', `${f(M.G)} м/с² вниз`, `${f(M.G)} м/с² вверх`, 'не определено, поскольку мяч меняет направление'], answer: 1,
      why: `<p>Сила тяжести действует на мяч в каждый момент, поэтому <i>a</i> = <i>g</i> = ${f(M.G)} м/с² вниз на протяжении всего полёта. В верхней точке <b>скорость</b> равна нулю, но продолжает изменяться: мгновение спустя она направлена вниз.</p>` },
  ],
  1: [
    { q: `Мяч бросают вертикально вверх со скоростью ${f(M.VY0)} м/с с края платформы и ловят при падении на ${f(DROP)} м <b>below</b> the launch point. Whв момент total distance did it travel?`,
      choices: [`${p3(DROP)} м`, `${p3(2 * M.H - DROP)} м`, `${p3(M.H + DROP)} м`, `${p3(DIST1)} м`], answer: 3,
      why: `<p>Путь складывается из всех участков траектории. Мяч поднимается на высоту <i>h</i> = <i>v</i><sub>0</sub>²/2<i>g</i> = ${f(M.H)} м, опускается на ${f(M.H)} м обратно до точки броска, а затем ещё на ${f(DROP)} м more:</p><div class="eq">${f(M.H)} + ${f(M.H)} + ${f(DROP)} = ${p3(DIST1)} м</div><p>${p3(DROP)} м is the size of the <b>displacement</b> (−${f(DROP)} м, up positive), not the distance.</p>` },
    { q: 'Как соотносятся модуль перемещения и пройденный путь тела, движущегося по прямой?',
      choices: ['Они всегда равны.', 'Перемещение может быть больше пути.', 'Перемещение не может быть больше пути; они равны, только если тело не меняет направление движения.', 'Перемещение всегда меньше пути.'], answer: 2,
      why: `<p>Путь учитывает всю длину траектории, а перемещение — только итоговое изменение положения. При смене направления часть перемещения компенсируется, но путь увеличивается (движение туда и обратно: 0 м против ${f(2 * M.H)} м). With no reversal they are equal, so “always smaller” is wrong too.</p>` },
  ],
  2: [
    { q: `Чему равен средний <b>модуль скорости</b> мяча от момента броска до <i>t</i> = ${f(T2)} с? (Мяч брошен вверх со скоростью ${f(M.VY0)} м/с и tops out в момент ${f(M.H)} м в момент ${f(M.T / 2)} с.)`,
      choices: [`${p3(D2 / T2)} м/с`, `${p3(Y2 / T2)} м/с`, `${p3(M.H / T2)} м/с`, `${p3((M.VY0 + Math.abs(M.vy(T2))) / 2)} м/с`], answer: 0,
      why: `<p>Средняя путевая скорость = путь / время. В момент ${f(T2)} с the ball is в момент <i>y</i> = ${f(M.VY0)}(${f(T2)}) − ½(${f(M.G)})(${f(T2)})² = ${f(Y2, 3)} м, on the way down. Distance = up ${f(M.H)} м + down ${f(M.H - Y2, 3)} м = ${f(D2, 3)} м.</p><div class="eq">${f(D2, 3)} м / ${f(T2)} с = ${p3(D2 / T2)} м/с</div><p>${p3(Y2 / T2)} м/с is the average <b>velocity</b> (displacement / time).</p>` },
    { q: 'Сравните скорость мяча сразу после броска и непосредственно перед возвращением на высоту руки.',
      choices: ['Они одинаковы.', 'Скорость при приземлении больше, поскольку сила тяжести действовала дольше.', 'Обе средние скорости равны нулю, поэтому сравнить их нельзя.', 'Одинаковые модули, противоположные направления.'], answer: 3,
      why: `<p>Движение симметрично: +${f(M.VY0)} м/с в момент launch, −${f(M.VY0)} м/с в момент the same height coming down (<i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i> при Δ<i>y</i> = 0). Модули скоростей равны, но векторы скорости различаются направлением.</p>` },
  ],
  3: [
    { q: 'Считая направление вверх положительным, на каком участке полёта мяч ускоряется?',
      choices: ['При подъёме, поскольку скорость положительна', 'В верхней точке, поскольку там ускорение максимально', 'При падении, поскольку v и a имеют одинаковые знаки', 'Никогда: отрицательное ускорение всегда замедляет тело'], answer: 2,
      why: `<p>Модуль скорости увеличивается, когда векторы <i>v</i> и <i>a</i> направлены одинаково. <i>a</i> = −${f(M.G)} м/с² throughout; on the way down <i>v</i> is also negative, so the speed grows. A negative <i>a</i> slows the ball only while <i>v</i> is positive.</p>` },
    { q: `Стробоскоп делает вспышку каждые ${f(TAU, 3)} с. On the way up, by how much does each gap between successive images shrink compared with the one before?`,
      choices: [`${p3(0.5 * M.G * TAU ** 2)} м`, `${p3(M.G * TAU ** 2)} м`, `${p3(M.G * TAU)} м`, `${p3(2 * M.G * TAU ** 2)} м`], answer: 1,
      why: `<p>Каждый промежуток равен расстоянию, пройденному за один интервал: <i>v</i>τ − ½<i>g</i>τ², где <i>v</i> — скорость в начале интервала. От одного промежутка к следующему <i>v</i> уменьшается на <i>g</i>τ, поэтому расстояние между изображениями уменьшается на (<i>g</i>τ)τ:</p><div class="eq">Δ(gap ) = <i>g</i>τ² = ${f(M.G)} × (${f(TAU, 3)})² = ${p3(M.G * TAU ** 2)} м</div><p>Множитель ½ относится к одному промежутку, а не к разности двух соседних промежутков.</p>` },
  ],
  4: [
    { q: `На графике <i>v</i>–<i>t</i> мяча (вверх — положительное направление, <i>v</i><sub>0</sub> = ${f(M.VY0)} м/с), whв момент is the net area between the line и the time axis from 0 до ${f(T2)} с?`,
      choices: [`${p3(D2)} м`, `${p3(M.VY0 * T2)} м`, `${p3(M.H)} м`, `${p3(Y2)} м`], answer: 3,
      why: `<p>Площадь под графиком <i>v</i>–<i>t</i> равна перемещению; площадь ниже оси считается отрицательной. Над осью расположен треугольник до момента ${f(M.T / 2)} с: +½(${f(M.VY0)})(${f(M.T / 2)} ) = +${f(M.H)} м. Below, from ${f(M.T / 2)} до ${f(T2)} с: −½(${f(T2 - M.T / 2)})(${f(-M.vy(T2))} ) = −${f(M.H - Y2, 3)} м.</p><div class="eq">net = ${f(M.H)} − ${f(M.H - Y2, 3)} = ${p3(Y2)} м</div><p>${p3(D2)} м adds the part below the axis instead of subtracting it: thв момент is the distance.</p>` },
    { q: 'Какая из перечисленных величин равна нулю в момент нахождения мяча в наивысшей точке?',
      choices: ['наклон графика <i>y</i>–<i>t</i>', 'наклон графика <i>v</i>–<i>t</i>', 'значение на графике <i>a</i>–<i>t</i>', 'площадь под графиком <i>a</i>–<i>t</i> с момента броска'], answer: 0,
      why: `<p>Наклон графика <i>y</i>–<i>t</i> равен скорости, которая в верхней точке равна нулю. Наклон графика <i>v</i>–<i>t</i> и значение на графике <i>a</i>–<i>t</i> равны −${f(M.G)} м/с². The area under <i>a</i>–<i>t</i> since launch is Δ<i>v</i> = −${f(M.VY0)} м/с, not zero.</p>` },
  ],
  5: [
    { q: `С каким модулем скорости движется мяч, когда находится на высоте ${f(Y5)} м above the launch point? (<i>v</i><sub>0</sub> = ${f(M.VY0)} м/с up.)`,
      choices: [`${p3(Math.sqrt(M.VY0 ** 2 + 2 * M.G * Y5))} м/с`, `${p3(V5)} м/с`, `${p3(Math.sqrt(M.VY0 ** 2 - M.G * Y5))} м/с`, `${p3(V5 ** 2)} м/с`], answer: 1,
      why: `<p>Время не задано и не требуется, поэтому используем уравнение, в котором отсутствует <i>t</i>, при <i>a</i> = −${f(M.G)} м/с²:</p><div class="eq"><i>v</i>² = ${f(M.VY0)}² + 2(−${f(M.G)})(${f(Y5)} ) = ${f(V5 ** 2)} м²/с², &nbsp;<i>v</i> = ${p3(V5)} м/с</div><p>${p3(Math.sqrt(M.VY0 ** 2 + 2 * M.G * Y5))} м/с comes from taking <i>a</i> as +<i>g</i>: the ball must be slower up there, not faster. (It passes ${f(Y5)} м twice, в момент this same speed.)</p>` },
    { q: `You want the time for the ball до first reach ${f(Y5)} м, knowing only <i>v</i><sub>0</sub>, <i>a</i> и Δ<i>y</i>. Which equation gets it in one step?`,
      choices: ['<i>v</i> = <i>v</i><sub>0</sub> + <i>at</i>', '<i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i>', 'Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>²', 'Δ<i>y</i> = ½(<i>v</i><sub>0</sub> + <i>v</i>)<i>t</i>'], answer: 2,
      why: `<p>Неизвестная величина, которая здесь не нужна, — конечная скорость <i>v</i>. Поэтому выберите уравнение, в котором отсутствует <i>v</i>: Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>² Это квадратное уравнение относительно <i>t</i>; меньший корень соответствует подъёму. В трёх остальных уравнениях присутствует <i>v</i> либо вообще нет <i>t</i>.</p>` },
  ],
  6: [
    { q: `Второй мяч начинает движение с горизонтальной скоростью ${f(M.VX)} м/с sideways и ${f(M.VY0)} м/с up. Whв момент is its speed в момент the top of its path?`,
      choices: ['0 м/с', `${p3(M.VY0)} м/с`, `${p3(M.V0P)} м/с`, `${p3(M.VX)} м/с`], answer: 3,
      why: `<p>В верхней точке только <i>v</i><sub>y</sub> равна нулю. По горизонтали силы не действуют, поэтому <i>v</i><sub>x</sub> остаётся равной ${f(M.VX)} м/с, и the speed is √(<i>v</i><sub>x</sub>² + 0² ) = ${p3(M.VX)} м/с. “0 м/с” is true only for the ball thrown straight up.</p>` },
    { q: `Если бросить мяч снова с той же вертикальной скоростью ${f(M.VY0)} м/с вверх but <b>twice</b> the sideways speed, ${f(2 * M.VX)} м/с, from level ground. How far away does it land?`,
      choices: [`${p3(M.RANGE)} м`, `${p3(R6)} м`, `${p3(4 * M.RANGE)} м`, `${p3(Math.SQRT2 * M.RANGE)} м`], answer: 1,
      why: `<p>Время полёта зависит только от вертикального движения: <i>t</i> = 2<i>v</i><sub>0y</sub>/<i>g</i> = ${f(M.T)} с, unchanged. The horizontal motion is uniform:</p><div class="eq">Δ<i>x</i> = <i>v</i><sub>x</sub><i>t</i> = ${f(2 * M.VX)} × ${f(M.T)} = ${p3(R6)} м</div><p>${p3(4 * M.RANGE)} м would follow from doubling the whole launch speed, which also doubles the time.</p>` },
  ],
  7: [
    { q: `Rain опускается на straight down в момент ${f(M.RAIN.vr, 1)} м/с. The car speeds up до ${f(VC7, 1)} м/с. At whв момент angle from vertical do the streaks slant, seen from the car?`,
      choices: [`${p3(dg(Math.atan2(M.RAIN.vr, VC7)))}°`, `${p3(M.RAIN_ANGLE)}°`, `${p3(A7)}°`, `${p3(dg(Math.atan2(M.RAIN.vr, M.RAIN.vc)))}°`], answer: 2,
      why: `<p><i>v</i><sub>RC</sub> = <i>v</i><sub>RG</sub> + <i>v</i><sub>GC</sub>: ${f(M.RAIN.vr, 1)} м/с down plus ${f(VC7, 1)} м/с backward, в момент right angles. From vertical, the opposite side is the horizontal part:</p><div class="eq">tan θ = ${f(VC7, 1)} / ${f(M.RAIN.vr, 1)}, &nbsp;θ = ${p3(A7)}°</div><p>${p3(dg(Math.atan2(M.RAIN.vr, VC7)))}° — угол относительно <b>горизонтали</b>.</p>` },
    { q: `Какова скорость дороги относительно пассажира автомобиля, движущегося вперёд со скоростью ${f(M.RAIN.vc, 1)} м/с, whв момент is the velocity of the road?`,
      choices: [`${f(M.RAIN.vc, 1)} м/с backward`, `${f(M.RAIN.vc, 1)} м/с forward`, 'ноль: дорога является системой отсчёта', `${f(M.vlen(M.V_RC))} м/с, slanted`], answer: 0,
      why: `<p>При перестановке индексов направление вектора меняется на противоположное: <i>v</i><sub>GC</sub> = −<i>v</i><sub>CG</sub>. Автомобиль движется ${f(M.RAIN.vc, 1)} м/с forward relative до the road, so the road moves ${f(M.RAIN.vc, 1)} м/с backward relative до the car. Which object is the reference is a choice, not a fact.</p>` },
  ],
  8: [
    { q: `The current rises до ${f(VW8, 1)} м/с. The boв момент still does ${f(M.RIVER.vb, 1)} м/с through the water, aimed straight across the ${M.RIVER.w} м river. How long does it take до cross?`,
      choices: [`${p3(M.RIVER.w / Math.hypot(M.RIVER.vb, VW8))} с`, `${p3(M.RIVER.w / Math.sqrt(M.RIVER.vb ** 2 - VW8 ** 2))} с`, `${p3(M.RIVER.w / (M.RIVER.vb + VW8))} с`, `${p3(M.RIVER.w / M.RIVER.vb)} с`], answer: 3,
      why: `<p>Only the across part of the velocity carries the boв момент до the far bank, и the current has no across part. So</p><div class="eq"><i>t</i> = <i>w</i> / <i>v</i><sub>b</sub> = ${M.RIVER.w} / ${f(M.RIVER.vb, 1)} = ${p3(M.RIVER.w / M.RIVER.vb)} с</div><p>the same as before; the stronger current only carries it farther downstream (${f(VW8 * M.RIVER.w / M.RIVER.vb, 1)} м). Dividing by the full speed ${f(Math.hypot(M.RIVER.vb, VW8))} м/с uses the slanted path’s speed for a straight-across distance.</p>` },
    { q: `При скорости течения ${f(M.RIVER.vw, 1)} м/с current: how far upstream of straight across must the ${f(M.RIVER.vb, 1)} м/с boв момент point до land directly opposite?`,
      choices: [`${p3(dg(Math.atan(M.RIVER.vw / M.RIVER.vb)))}°`, `${p3(dg(M.AIM_UP))}°`, `${p3(dg(Math.acos(M.RIVER.vw / M.RIVER.vb)))}°`, `${p3(dg(Math.atan(M.RIVER.vb / M.RIVER.vw)))}°`], answer: 1,
      why: `<p>Составляющая скорости лодки против течения должна компенсировать скорость течения. Скорость лодки относительно воды является гипотенузой:</p><div class="eq"><i>v</i><sub>b</sub> sin θ = <i>v</i><sub>w</sub> &nbsp;→ sin θ = ${f(M.RIVER.vw, 1)} / ${f(M.RIVER.vb, 1)}, θ = ${p3(dg(M.AIM_UP))}°</div><p>tan θ = ${f(M.RIVER.vw, 1)}/${f(M.RIVER.vb, 1)} рассматривает ${f(M.RIVER.vb, 1)} м/с as the across side, but thв момент is the boat’s whole speed through the water.</p>` },
  ],
  9: [
    { q: `Автомобиль начинает движение из состояния покоя с ускорением <i>a</i> = ${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i> (m/s², <i>t</i> in с). Whв момент is its speed в момент <i>t</i> = ${f(T9)} с?`,
      choices: [`${p3(M.PULL.a0 * T9 - M.PULL.k * T9 ** 2)} м/с`, `${p3(M.PULL.a0 * T9)} м/с`, `${p3(V9)} м/с`, `${p3(M.pa(T9))} м/с`], answer: 2,
      why: `<p><i>a</i> непостоянно, поэтому проинтегрируем:</p><div class="eq"><i>v</i>(<i>t</i> ) = ∫<sub>0</sub><sup><i>t</i></sup> (${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i>′) d<i>t</i>′ = ${f(M.PULL.a0, 1)}<i>t</i> − ${f(M.PULL.k / 2)}<i>t</i>²</div><div class="eq"><i>v</i>(${f(T9)} ) = ${f(M.PULL.a0 * T9, 1)} − ${f(M.PULL.k / 2 * T9 ** 2, 1)} = ${p3(V9)} м/с</div><p>${p3(M.PULL.a0 * T9 - M.PULL.k * T9 ** 2)} м/с не учитывает множитель ½, возникающий при интегрировании <i>t</i>; ${p3(M.PULL.a0 * T9)} м/с рассматривает <i>a</i> as constant в момент ${f(M.PULL.a0, 1)} м/с².</p>` },
    { q: `Для того же автомобиля (<i>a</i> = <i>a</i><sub>0</sub> − <i>kt</i> до момента, когда оно станет равным нулю, затем 0; автомобиль начинает движение из состояния покоя при <i>x</i> = 0), докажите, что к этому моменту он прошёл путь <i>x</i><sub>1</sub> = <i>a</i><sub>0</sub>³/3<i>k</i>² к моменту обнуления ускорения, и найдите координату автомобиля при <i>t</i> = 5.00 с.`,
      solution: `<p>1. <i>a</i> = 0 в момент <i>t</i><sub>1</sub> = <i>a</i><sub>0</sub>/<i>k</i> = ${f(M.T1)} с.</p><p>2. <i>v</i> = ∫<sub>0</sub><sup><i>t</i></sup><i>a</i> d<i>t</i>′ = <i>a</i><sub>0</sub><i>t</i> − ½<i>kt</i>², поэтому <i>v</i><sub>1</sub> = <i>a</i><sub>0</sub>²/2<i>k</i> = ${f(M.V1, 1)} м/с.</p><p>3. <i>x</i> = ∫<sub>0</sub><sup><i>t</i></sup><i>v</i> d<i>t</i>′ = ½<i>a</i><sub>0</sub><i>t</i>² − <i>kt</i>³/6. При <i>t</i><sub>1</sub>:</p><div class="eq"><i>x</i><sub>1</sub> = <i>a</i><sub>0</sub>³/2<i>k</i>² − <i>a</i><sub>0</sub>³/6<i>k</i>² = <i>a</i><sub>0</sub>³/3<i>k</i>² = ${f(M.PULL.a0, 1)}³ / (3 × ${f(M.PULL.k, 1)}² ) = ${f(M.X1, 1)} м</div><p>4. После <i>t</i><sub>1</sub> ускорение <i>a</i> = 0, поэтому скорость <i>v</i> остаётся равной ${f(M.V1, 1)} м/с:</p><div class="eq"><i>x</i>(5.00 ) = ${f(M.X1, 1)} + ${f(M.V1, 1)} × (5.00 − ${f(M.T1)} ) = ${f(M.px(5), 1)} м</div>` },
  ],
  10: [
    { q: `Частица движется по закону <i>x</i> = <i>t</i>³ − 3<i>t</i> (m, с). Whв момент is its acceleration в момент the instant its velocity is zero (<i>t</i> &gt; 0)?`,
      choices: [`${p3(M.ca(M.T_TURN))} м/с²`, '0 м/с²', `${p3(M.cx(M.T_TURN))} м/с²`, `${p3(3 * M.CUBE.A * M.T_TURN)} м/с²`], answer: 0,
      why: `<p><i>v</i> = d<i>x</i>/d<i>t</i> = 3<i>t</i>² − 3 = 0 в момент <i>t</i> = ${f(M.T_TURN)} с. <i>a</i> = d<i>v</i>/d<i>t</i> = 6<i>t</i> = ${p3(M.ca(M.T_TURN))} м/с².</p><p>Нулевая скорость не означает нулевого ускорения: частица меняет направление движения, поэтому её скорость изменяется. (${p3(M.cx(M.T_TURN))} is its position there, in м.)</p>` },
    { q: 'Частица движется с ускорением <i>a</i> = 6<i>t</i> (м/с²), при начальных условиях <i>v</i>(0 ) = −3 м/с и <i>x</i>(0 ) = 0. Найдите <i>x</i>(<i>t</i>), время <i>t</i> &gt; 0 when it is back в момент <i>x</i> = 0, и its velocity then.',
      solution: `<p>1. Интегрируем один раз: <i>v</i> = 3<i>t</i>² + <i>C</i><sub>1</sub>; <i>v</i>(0 ) = −3 даёт <i>C</i><sub>1</sub> = −3.</p><p>2. Интегрируем ещё раз: <i>x</i> = <i>t</i>³ − 3<i>t</i> + <i>C</i><sub>2</sub>; <i>x</i>(0 ) = 0 даёт <i>C</i><sub>2</sub> = 0.</p><p>3. <i>x</i> = <i>t</i>(<i>t</i>² − 3 ) = 0 в момент <i>t</i> = √3 = ${f(Math.sqrt(3))} с.</p><div class="eq"><i>v</i>(√3 ) = 3(3) − 3 = ${f(M.cv(Math.sqrt(3)))} м/с</div><p>It went left до <i>x</i> = −2 м в момент 1 с, then came back moving right, faster than it started.</p>` },
  ],
};
