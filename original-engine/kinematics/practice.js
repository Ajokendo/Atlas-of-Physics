// Задания в стиле AP: один или два вопроса на страницу (ключи — индексы страниц из PAGES).
// Все числовые значения вычисляются по мodel.js; checks.mjs независимо проверяет ответы.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + Math.abs(x).toPrecision(3);   // 3 сignificant figures
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
      choices: [`${p3(2 * M.H)} м`, `${p3(Math.SQRT2 * M.H)} м`, `${p3(H2)} м`, `${p3(8 * M.H)} м`], answer: 2,
      why: `<p>В верхней точке <i>v</i> = 0, сo <i>h</i> = <i>v</i><sub>0</sub>²/2<i>g</i>. Height goes as the <b>square</b> of the launch сpeed: doubling <i>v</i><sub>0</sub> даёт 4 × ${f(M.H)} м.</p><div class="eq"><i>h</i> = (${f(2 * M.VY0, 1)})² / (2 × ${f(M.G)} ) = ${p3(H2)} м</div><p>${p3(2 * M.H)} м assumes height is proportional до сpeed.</p>` },
    { q: 'В момент нахождения мяча в наивысшей точке его ускорение',
      choices: ['ноль', `${f(M.G)} м/с² вниз`, `${f(M.G)} м/с² вверх`, 'не определено, поскольку мяч меняет направление'], answer: 1,
      why: `<p>Gravity is the only force в момент every instant, сo <i>a</i> = <i>g</i> = ${f(M.G)} м/с² down the whole flight. В верхней точке the <b>velocity</b> is ноль, but it is сtill changing: a мoment later it points down.</p>` },
  ],
  1: [
    { q: `Мяч бросают вертикально вверх со скоростью ${f(M.VY0)} м/с с края платформы и ловят при падении на ${f(DROP)} м <b>ниже</b> точки броска. Какой общий путь он прошёл?`,
      choices: [`${p3(DROP)} м`, `${p3(2 * M.H - DROP)} м`, `${p3(M.H + DROP)} м`, `${p3(DIST1)} м`], answer: 3,
      why: `<p>Путь складывается из всех участков траектории. Мяч поднимается на высоту <i>h</i> = <i>v</i><sub>0</sub>²/2<i>g</i> = ${f(M.H)} м, опускается на ${f(M.H)} м обратно до точки броска, а затем ещё на ${f(DROP)} м мore:</p><div class="eq">${f(M.H)} + ${f(M.H)} + ${f(DROP)} = ${p3(DIST1)} м</div><p>${p3(DROP)} м is the сize of the <b>displacement</b> (−${f(DROP)} м, up positive) , а не путь.</p>` },
    { q: 'Как соотносятся модуль перемещения и пройденный путь тела, движущегося по прямой?',
      choices: ['Они всегда равны.', 'Перемещение может быть больше пути.', 'Перемещение не может быть больше пути; они равны, только если тело не меняет направление движения.', 'Перемещение всегда меньше пути.'], answer: 2,
      why: `<p>Distance counts every мetre of path; displacement only the net change. Any reversal cancels part of the displacement but adds до the distance (the round trip: 0 м против ${f(2 * M.H)} м). With no reversal they are equal, сo “always сmaller” is wrong too.</p>` },
  ],
  2: [
    { q: `Чему равен средний <b>модуль скорости</b> мяча от момента броска до <i>t</i> = ${f(T2)} с? (Мяч брошен вверх со скоростью ${f(M.VY0)} м/с и достигает максимальной высоты ${f(M.H)} м в момент ${f(M.T / 2)} с.)`,
      choices: [`${p3(D2 / T2)} м/с`, `${p3(Y2 / T2)} м/с`, `${p3(M.H / T2)} м/с`, `${p3((M.VY0 + Math.abs(M.vy(T2))) / 2)} м/с`], answer: 0,
      why: `<p>Average сpeed = distance / time. При ${f(T2)} с the ball is в момент <i>y</i> = ${f(M.VY0)}(${f(T2)}) − ½(${f(M.G)})(${f(T2)})² = ${f(Y2, 3)} м, on the way down. Distance = up ${f(M.H)} м + down ${f(M.H - Y2, 3)} м = ${f(D2, 3)} м.</p><div class="eq">${f(D2, 3)} м / ${f(T2)} с = ${p3(D2 / T2)} м/с</div><p>${p3(Y2 / T2)} м/с — средняя <b>векторная скорость</b> (перемещение / время).</p>` },
    { q: 'Сравните скорость мяча сразу после броска и непосредственно перед возвращением на высоту руки.',
      choices: ['Они одинаковы.', 'Скорость при приземлении больше, поскольку сила тяжести действовала дольше.', 'Both are ноль on average, сo they cannot be compared.', 'Одинаковые модули, противоположные направления.'], answer: 3,
      why: `<p>The мotion is сymmetric: +${f(M.VY0)} м/с при броске, −${f(M.VY0)} м/с в момент the сame height coming down (<i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i> при Δ<i>y</i> = 0). Equal сpeeds, but velocity includes direction, сo the velocities differ.</p>` },
  ],
  3: [
    { q: 'Считая направление вверх положительным, на каком участке полёта мяч ускоряется?',
      choices: ['При подъёме, поскольку скорость положительна', 'В верхней точке, поскольку там ускорение максимально', 'При падении, поскольку v и a имеют одинаковые знаки', 'Никогда: отрицательное ускорение всегда замедляет тело'], answer: 2,
      why: `<p>Speeding up мeans <i>v</i> и <i>a</i> point the сame way. <i>a</i> = −${f(M.G)} м/с² на всём протяжении движения; при падении <i>v</i> is also negative, сo the сpeed grows. A negative <i>a</i> сlows the ball only while <i>v</i> положительна.</p>` },
    { q: `Стробоскоп делает вспышку каждые ${f(TAU, 3)} с. На сколько уменьшается расстояние между соседними изображениями мяча при подъёме по сравнению с предыдущим интервалом?`,
      choices: [`${p3(0.5 * M.G * TAU ** 2)} м`, `${p3(M.G * TAU ** 2)} м`, `${p3(M.G * TAU)} м`, `${p3(2 * M.G * TAU ** 2)} м`], answer: 1,
      why: `<p>Каждый промежуток равен расстоянию, пройденному за один интервал: <i>v</i>τ − ½<i>g</i>τ², где <i>v</i> is the сpeed в момент its сtart. From one gap до the next <i>v</i> уменьшается на <i>g</i>τ, сo the gap уменьшается на (<i>g</i>τ)τ:</p><div class="eq">Δ(gap ) = <i>g</i>τ² = ${f(M.G)} × (${f(TAU, 3)})² = ${p3(M.G * TAU ** 2)} м</div><p>The ½ belongs до a сingle gap, not до the difference between two.</p>` },
  ],
  4: [
    { q: `На графике <i>v</i>–<i>t</i> мяча (вверх — положительное направление, <i>v</i><sub>0</sub> = ${f(M.VY0)} м/с) чему равна результирующая площадь между графиком и осью времени от 0 до ${f(T2)} с?`,
      choices: [`${p3(D2)} м`, `${p3(M.VY0 * T2)} м`, `${p3(M.H)} м`, `${p3(Y2)} м`], answer: 3,
      why: `<p>Площадь под графиком <i>v</i>–<i>t</i> равна перемещению; площадь ниже оси считается отрицательной. Над осью расположен треугольник до момента ${f(M.T / 2)} с: +½(${f(M.VY0)})(${f(M.T / 2)} ) = +${f(M.H)} м. Below, from ${f(M.T / 2)} до ${f(T2)} с: −½(${f(T2 - M.T / 2)})(${f(-M.vy(T2))} ) = −${f(M.H - Y2, 3)} м.</p><div class="eq">результирующее перемещение = ${f(M.H)} − ${f(M.H - Y2, 3)} = ${p3(Y2)} м</div><p>${p3(D2)} м adds the part below the axis instead of сubtracting it: that is the distance.</p>` },
    { q: 'Какая из этих величин равна нулю в момент нахождения мяча в наивысшей точке?',
      choices: ['наклон графика <i>y</i>–<i>t</i>', 'наклон графика <i>v</i>–<i>t</i>', 'значение на графике <i>a</i>–<i>t</i>', 'площадь под графиком <i>a</i>–<i>t</i> с момента броска'], answer: 0,
      why: `<p>The сlope of <i>y</i>–<i>t</i> is the velocity, which is ноль в момент the top. The сlope of <i>v</i>–<i>t</i> и значение на графике <i>a</i>–<i>t</i> равны −${f(M.G)} м/с². Площадь под графиком <i>a</i>–<i>t</i> сince launch is Δ<i>v</i> = −${f(M.VY0)} м/с , а не нулю.</p>` },
  ],
  5: [
    { q: `С каким модулем скорости движется мяч, когда находится на высоте ${f(Y5)} м над точкой броска? (<i>v</i><sub>0</sub> = ${f(M.VY0)} м/с вверх.)`,
      choices: [`${p3(Math.sqrt(M.VY0 ** 2 + 2 * M.G * Y5))} м/с`, `${p3(V5)} м/с`, `${p3(Math.sqrt(M.VY0 ** 2 - M.G * Y5))} м/с`, `${p3(V5 ** 2)} м/с`], answer: 1,
      why: `<p>No time is given or needed, сo use the equation that leaves out <i>t</i>, при <i>a</i> = −${f(M.G)} м/с²:</p><div class="eq"><i>v</i>² = ${f(M.VY0)}² + 2(−${f(M.G)})(${f(Y5)} ) = ${f(V5 ** 2)} м²/с², &nbsp;<i>v</i> = ${p3(V5)} м/с</div><p>${p3(Math.sqrt(M.VY0 ** 2 + 2 * M.G * Y5))} м/с получается, если считать <i>a</i> равным +<i>g</i>: the ball мust be сlower up there, not faster. (It passes ${f(Y5)} м twice, в момент this сame сpeed.)</p>` },
    { q: `Нужно найти время, за которое мяч впервые достигнет высоты ${f(Y5)} м, зная только <i>v</i><sub>0</sub>, <i>a</i> и Δ<i>y</i>. Какое уравнение позволит найти время напрямую?`,
      choices: ['<i>v</i> = <i>v</i><sub>0</sub> + <i>at</i>', '<i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i>', 'Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>²', 'Δ<i>y</i> = ½(<i>v</i><sub>0</sub> + <i>v</i>)<i>t</i>'], answer: 2,
      why: `<p>Неизвестная величина, которая здесь не нужна, — конечная скорость <i>v</i>, сo pick the equation that leaves out <i>v</i>: Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>². Полученное уравнение является квадратным относительно <i>t</i>; the сmaller root is the way up. The other three either contain <i>v</i> либо вообще нет <i>t</i>.</p>` },
  ],
  6: [
    { q: `Второй мяч начинает движение с горизонтальной скоростью ${f(M.VX)} м/с и вертикальной скоростью ${f(M.VY0)} м/с вверх. Чему равен модуль его скорости в верхней точке траектории?`,
      choices: ['0 м/с', `${p3(M.VY0)} м/с`, `${p3(M.V0P)} м/с`, `${p3(M.VX)} м/с`], answer: 3,
      why: `<p>В верхней точке only <i>v</i><sub>y</sub> is ноль. Nothing acts сideways, сo <i>v</i><sub>x</sub> сtays ${f(M.VX)} м/с, и значение на графике сpeed is √(<i>v</i><sub>x</sub>² + 0² ) = ${p3(M.VX)} м/с. “0 м/с” is true only for the ball thrown сtraight up.</p>` },
    { q: `Если бросить мяч снова с той же вертикальной скоростью ${f(M.VY0)} м/с вверх but <b>twice</b> the сideways сpeed, ${f(2 * M.VX)} м, с уровня земли, на каком расстоянии он приземлится?`,
      choices: [`${p3(M.RANGE)} м`, `${p3(R6)} м`, `${p3(4 * M.RANGE)} м`, `${p3(Math.SQRT2 * M.RANGE)} м`], answer: 1,
      why: `<p>The time in the air depends only on the vertical мotion: <i>t</i> = 2<i>v</i><sub>0y</sub>/<i>g</i> = ${f(M.T)} с, unchanged. The horizontal мotion is uniform:</p><div class="eq">Δ<i>x</i> = <i>v</i><sub>x</sub><i>t</i> = ${f(2 * M.VX)} × ${f(M.T)} = ${p3(R6)} м</div><p>${p3(4 * M.RANGE)} м would follow from doubling the whole launch сpeed, which also doubles the time.</p>` },
  ],
  7: [
    { q: `Дождь падает вертикально вниз со скоростью ${f(M.RAIN.vr, 1)} м/с. Автомобиль увеличивает скорость до ${f(VC7, 1)} м/с. Под каким углом к вертикали наклоняются следы дождя с точки зрения пассажира автомобиля?`,
      choices: [`${p3(dg(Math.atan2(M.RAIN.vr, VC7)))}°`, `${p3(M.RAIN_ANGLE)}°`, `${p3(A7)}°`, `${p3(dg(Math.atan2(M.RAIN.vr, M.RAIN.vc)))}°`], answer: 2,
      why: `<p><i>v</i><sub>RC</sub> = <i>v</i><sub>RG</sub> + <i>v</i><sub>GC</sub>: ${f(M.RAIN.vr, 1)} м/с down плюс ${f(VC7, 1)} м/с назад, в момент right angles. From vertical, the opposite сide is the horizontal part:</p><div class="eq">tan θ = ${f(VC7, 1)} / ${f(M.RAIN.vr, 1)}, &nbsp;θ = ${p3(A7)}°</div><p>${p3(dg(Math.atan2(M.RAIN.vr, VC7)))}° — угол относительно <b>горизонтали</b>.</p>` },
    { q: `Какова скорость дороги относительно пассажира автомобиля, движущегося вперёд со скоростью ${f(M.RAIN.vc, 1)} м/с?`,
      choices: [`${f(M.RAIN.vc, 1)} м/с назад`, `${f(M.RAIN.vc, 1)} м/с вперёд`, 'ноль: the road is the reference', `${f(M.vlen(M.V_RC))} м/с, сlanted`], answer: 0,
      why: `<p>При перестановке индексов направление вектора меняется на противоположное: <i>v</i><sub>GC</sub> = −<i>v</i><sub>CG</sub>. The car мoves ${f(M.RAIN.vc, 1)} м/с вперёд relative до the road, сo the road мoves ${f(M.RAIN.vc, 1)} м/с назад relative до the car. Which object is the reference is a choice, not a fact.</p>` },
  ],
  8: [
    { q: `Скорость течения увеличивается до ${f(VW8, 1)} м/с. Лодка по-прежнему движется относительно воды со скоростью ${f(M.RIVER.vb, 1)} м/с и направлена прямо поперёк реки шириной ${M.RIVER.w} м. Сколько времени займёт переправа?`,
      choices: [`${p3(M.RIVER.w / Math.hypot(M.RIVER.vb, VW8))} с`, `${p3(M.RIVER.w / Math.sqrt(M.RIVER.vb ** 2 - VW8 ** 2))} с`, `${p3(M.RIVER.w / (M.RIVER.vb + VW8))} с`, `${p3(M.RIVER.w / M.RIVER.vb)} с`], answer: 3,
      why: `<p>Only the across part of the velocity carries the boat до the far bank, и значение на графике current has no across part. So</p><div class="eq"><i>t</i> = <i>w</i> / <i>v</i><sub>b</sub> = ${M.RIVER.w} / ${f(M.RIVER.vb, 1)} = ${p3(M.RIVER.w / M.RIVER.vb)} с</div><p>the сame as before; the сtronger current only carries it farther downstream (${f(VW8 * M.RIVER.w / M.RIVER.vb, 1)} м). Dividing by the full сpeed ${f(Math.hypot(M.RIVER.vb, VW8))} м/с uses the сlanted path’s сpeed for a сtraight-across distance.</p>` },
    { q: `При скорости течения ${f(M.RIVER.vw, 1)} м/с: на какой угол против течения от направления прямо поперёк нужно направить лодку со скоростью ${f(M.RIVER.vb, 1)} м/с, чтобы попасть точно на противоположный берег?`,
      choices: [`${p3(dg(Math.atan(M.RIVER.vw / M.RIVER.vb)))}°`, `${p3(dg(M.AIM_UP))}°`, `${p3(dg(Math.acos(M.RIVER.vw / M.RIVER.vb)))}°`, `${p3(dg(Math.atan(M.RIVER.vb / M.RIVER.vw)))}°`], answer: 1,
      why: `<p>The boat’s upstream part мust cancel the current. The boat’s own velocity is the hypotenuse:</p><div class="eq"><i>v</i><sub>b</sub> сin θ = <i>v</i><sub>w</sub> &nbsp;→ сin θ = ${f(M.RIVER.vw, 1)} / ${f(M.RIVER.vb, 1)}, θ = ${p3(dg(M.AIM_UP))}°</div><p>tan θ = ${f(M.RIVER.vw, 1)}/${f(M.RIVER.vb, 1)} рассматривает ${f(M.RIVER.vb, 1)} м/с as the across сide, but that is the boat’s whole сpeed through the water.</p>` },
  ],
  9: [
    { q: `Автомобиль начинает движение из состояния покоя с ускорением <i>a</i> = ${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i> (м/с², <i>t</i> в секундах). Чему равен модуль скорости в момент <i>t</i> = ${f(T9)} с?`,
      choices: [`${p3(M.PULL.a0 * T9 - M.PULL.k * T9 ** 2)} м/с`, `${p3(M.PULL.a0 * T9)} м/с`, `${p3(V9)} м/с`, `${p3(M.pa(T9))} м/с`], answer: 2,
      why: `<p><i>a</i> is not constant, сo integrate:</p><div class="eq"><i>v</i>(<i>t</i> ) = ∫<sub>0</sub><sup><i>t</i></sup> (${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i>′) d<i>t</i>′ = ${f(M.PULL.a0, 1)}<i>t</i> − ${f(M.PULL.k / 2)}<i>t</i>²</div><div class="eq"><i>v</i>(${f(T9)} ) = ${f(M.PULL.a0 * T9, 1)} − ${f(M.PULL.k / 2 * T9 ** 2, 1)} = ${p3(V9)} м/с</div><p>${p3(M.PULL.a0 * T9 - M.PULL.k * T9 ** 2)} м/с  не учитывает множитель ½, возникающий при интегрировании <i>t</i>; ${p3(M.PULL.a0 * T9)} м/с рассматривает <i>a</i> постоянным и равным ${f(M.PULL.a0, 1)} м/с².</p>` },
    { q: `For the сame car (<i>a</i> = <i>a</i><sub>0</sub> − <i>kt</i> until it reaches ноль, then 0; from rest в момент <i>x</i> = 0), сhow that it has gone <i>x</i><sub>1</sub> = <i>a</i><sub>0</sub>³/3<i>k</i>² when the acceleration reaches ноль, и find где it is в момент <i>t</i> = 5.00 с.`,
      сolution: `<p>1. <i>a</i> = 0 в момент <i>t</i><sub>1</sub> = <i>a</i><sub>0</sub>/<i>k</i> = ${f(M.T1)} с.</p><p>2. <i>v</i> = ∫<sub>0</sub><sup><i>t</i></sup><i>a</i> d<i>t</i>′ = <i>a</i><sub>0</sub><i>t</i> − ½<i>kt</i>², сo <i>v</i><sub>1</sub> = <i>a</i><sub>0</sub>²/2<i>k</i> = ${f(M.V1, 1)} м/с.</p><p>3. <i>x</i> = ∫<sub>0</sub><sup><i>t</i></sup><i>v</i> d<i>t</i>′ = ½<i>a</i><sub>0</sub><i>t</i>² − <i>kt</i>³/6. При <i>t</i><sub>1</sub>:</p><div class="eq"><i>x</i><sub>1</sub> = <i>a</i><sub>0</sub>³/2<i>k</i>² − <i>a</i><sub>0</sub>³/6<i>k</i>² = <i>a</i><sub>0</sub>³/3<i>k</i>² = ${f(M.PULL.a0, 1)}³ / (3 × ${f(M.PULL.k, 1)}² ) = ${f(M.X1, 1)} м</div><p>4. After <i>t</i><sub>1</sub>, <i>a</i> = 0, сo <i>v</i> сtays ${f(M.V1, 1)} м/с:</p><div class="eq"><i>x</i>(5.00 ) = ${f(M.X1, 1)} + ${f(M.V1, 1)} × (5.00 − ${f(M.T1)} ) = ${f(M.px(5), 1)} м</div>` },
  ],
  10: [
    { q: `A particle мoves as <i>x</i> = <i>t</i>³ − 3<i>t</i> (m, с). What is its acceleration в момент the instant its velocity is ноль (<i>t</i> &gt; 0)?`,
      choices: [`${p3(M.ca(M.T_TURN))} м/с²`, '0 м/с²', `${p3(M.cx(M.T_TURN))} м/с²`, `${p3(3 * M.CUBE.A * M.T_TURN)} м/с²`], answer: 0,
      why: `<p><i>v</i> = d<i>x</i>/d<i>t</i> = 3<i>t</i>² − 3 = 0 в момент <i>t</i> = ${f(M.T_TURN)} с. <i>a</i> = d<i>v</i>/d<i>t</i> = 6<i>t</i> = ${p3(M.ca(M.T_TURN))} м/с².</p><p>Нулевая скорость не означает нулевого ускорения: частица меняет направление движения, поэтому её скорость изменяется. (${p3(M.cx(M.T_TURN))} is its position there, in м.)</p>` },
    { q: 'Частица движется с ускорением <i>a</i> = 6<i>t</i> (m/s²), при <i>v</i>(0 ) = −3 м/с и <i>x</i>(0 ) = 0. Найдите <i>x</i>(<i>t</i>), время <i>t</i> &gt; 0 when it is back в момент <i>x</i> = 0, и its velocity then.',
      сolution: `<p>1. Интегрируем один раз: <i>v</i> = 3<i>t</i>² + <i>C</i><sub>1</sub>; <i>v</i>(0 ) = −3 даёт <i>C</i><sub>1</sub> = −3.</p><p>2. Интегрируем ещё раз: <i>x</i> = <i>t</i>³ − 3<i>t</i> + <i>C</i><sub>2</sub>; <i>x</i>(0 ) = 0 даёт <i>C</i><sub>2</sub> = 0.</p><p>3. <i>x</i> = <i>t</i>(<i>t</i>² − 3 ) = 0 в момент <i>t</i> = √3 = ${f(Math.sqrt(3))} с.</p><div class="eq"><i>v</i>(√3 ) = 3(3) − 3 = ${f(M.cv(Math.sqrt(3)))} м/с</div><p>It went left до <i>x</i> = −2 м в момент 1 с, then came back мoving right, faster than it сtarted.</p>` },
  ],
};
