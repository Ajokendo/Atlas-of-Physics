// potential/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const g = (x, n = 3) => x.toPrecision(n);
const s = x => (x < 0 ? '−' : x > 0 ? '+' : '') + Math.abs(x);   // signed, with a real minus
const K = M.K, nC = M.nC;

// ---- page 0: the page's pair brought from 40 см to 10 см ----
const { q1, q2, r0, r1 } = M.PAIR;
const P0 = { W: K * q1 * q2 * (1 / r1 - 1 / r0) };
P0.nums = [K * q1 * q2 / r1, P0.W, K * q1 * q2 / r1 ** 2 * (r0 - r1), K * q1 * q2 / (r0 - r1)].map(x => x * 1e6);   // from ∞ · right · F(r₁)Δr · 1/Δr
// ---- page 1: the page's square; charging a sphere ----
const P1 = { U: M.SQ.U, a: M.SQ.a, q: M.SQ.q };
P1.nums = [4 * K * P1.q ** 2 / P1.a, 2 * P1.U, P1.U, (4 + 2 * Math.SQRT2) * K * P1.q ** 2 / P1.a].map(x => x * 1e6);   // sides only · every pair twice · right · diagonal a/√2
const P1b = { Q: 2 * nC, R: 0.15 };
P1b.U = K * P1b.Q ** 2 / (2 * P1b.R);
P1b.nums = [2 * P1b.U, P1b.U / 2, P1b.U, P1b.U / P1b.R].map(x => x * 1e6);   // Q × final В · ¼ · right · extra 1/R
// ---- page 2: the page's A → C; E = 3x² ----
const P2 = { W: -M.UNI.q * (M.Vuni(M.UNI.C) - M.Vuni(M.UNI.A)) };
P2.L = Math.hypot(M.UNI.C[0] - M.UNI.A[0], M.UNI.C[2] - M.UNI.A[2]);
P2.nums = [-P2.W, 0, M.UNI.q * M.UNI.E * P2.L, P2.W].map(x => x * 1e9);   // sign · "path ⟂ somewhere" · full length · right
const P2b = { c: 3, x: 2 };
P2b.dV = -P2b.c * P2b.x ** 3 / 3;
P2b.nums = [-P2b.dV, -P2b.c * P2b.x ** 2 * P2b.x, P2b.dV, -P2b.c * P2b.x ** 2 * P2b.x / 2];   // sign · E(x)·x · right · mean of end fields
// ---- page 3: the page's hill where В = 90 В; В = 3x²y − y³ ----
const P3 = { V: 90 };
P3.r = K * M.HILL.Q / P3.V;
P3.E = P3.V / P3.r;
P3.nums = [P3.V, P3.E, P3.E / 2, 2 * P3.E];
const P3b = { x: 1, y: 2 };
P3b.Ex = -6 * P3b.x * P3b.y; P3b.Ey = -(3 * P3b.x ** 2 - 3 * P3b.y ** 2);
P3b.E = Math.hypot(P3b.Ex, P3b.Ey);
P3b.nums = [Math.abs(P3b.Ex) + Math.abs(P3b.Ey), Math.abs(P3b.Ex), P3b.E, Math.abs(P3b.Ey)];
// ---- page 4: the page's dipole at P ----
const P4 = { V: M.VdipAxis(M.DIP.axisX) };
P4.nums = [-P4.V, 0, P4.V, -2 * M.DIP.a * K * M.DIP.q / M.DIP.axisX ** 2];   // sign · bisector habit · right · far-field
// ---- page 5: the page's rod at a = 10 см ----
const { L: rL, Q: rQ, lam: rlam } = M.ROD;
const P5 = { a: 0.10 };
P5.V = M.VrodAxis(P5.a);
P5.nums = [K * rQ / P5.a, K * rQ / (P5.a + rL / 2), K * rlam * Math.log10((P5.a + rL) / P5.a), P5.V];   // all at the end · all at the middle · log₁₀ · right
P5.E = K * rQ / (P5.a * (P5.a + rL));
P5.nums2 = [P5.E, P5.V / P5.a, K * rQ / P5.a ** 2, K * rlam / P5.a];   // right · В/a · point at the end · kλ/a
// ---- page 6: the page's ring at z = 20 см; the half-ring's field at its centre ----
const P6 = { z: 0.20 };
P6.V = M.Vring(P6.z);
P6.nums = [K * M.RING.Q / P6.z, P6.V, K * M.RING.Q * P6.z / (M.RING.R ** 2 + P6.z ** 2) ** 1.5, K * M.RING.Q / M.RING.R];   // point · right · that's E · centre
const P6b = { E: 2 * K * M.ARC.Q / (Math.PI * M.ARC.R ** 2) };
P6b.nums = [K * M.ARC.Q / M.ARC.R ** 2, P6b.E / 2, P6b.E, 0];   // as a point · lost 2 · right · ring symmetry
// ---- page 7: the page's insulating sphere at R/2; two connected spheres ----
const P7 = { r: M.SPH.R / 2 };
P7.V = M.Vins(P7.r);
P7.nums = [K * M.SPH.Q / P7.r, P7.V, M.Vcond(P7.r), M.Vins(0)];   // point · right · conductor · centre
const P7b = { nums: [1 / 3, 3, 1, 1 / 9] };
// ---- page 8: the page's proton; an electron falling toward +1 нКл ----
const P8 = { v: M.ACC.vp };
P8.nums = [Math.sqrt(M.E_CH * M.ACC.dV / M.M_P), M.speed(M.E_CH, M.ACC.Vhi, M.M_P), P8.v, M.speed(M.E_CH, M.ACC.dV, M.M_E)].map(v => v / 1e3);   // lost 2 · used 7 В · right · electron
const P8b = { Q: 1 * nC, ra: 0.10, rb: 0.05 };
P8b.dV = K * P8b.Q * (1 / P8b.rb - 1 / P8b.ra);
P8b.v = M.speed(M.E_CH, P8b.dV, M.M_E);
P8b.nums = [M.speed(M.E_CH, K * P8b.Q / P8b.rb, M.M_E), P8b.v, P8b.v / Math.SQRT2, M.speed(M.E_CH, P8b.dV, M.M_P)].map(v => v / 1e6);   // В at the end only · right · lost 2 · proton mass

const frac = x => ({ [1 / 3]: '1/3', 3: '3', 1: '1', [1 / 9]: '1/9' })[x];

export const PRACTICE = {
  0: [
    { q: `Какую работу нужно совершить, чтобы перенести показанный заряд +${q2 / nC} нКл с расстояния ${p(r0 * 100, 0)} см на расстояние ${p(r1 * 100, 0)} см от неподвижного заряда +${q1 / nC} нКл, если в начале и конце заряд покоится?`,
      choices: P0.nums.map(x => `${p(x, 3)} мкДж`), answer: 1, nums: P0.nums,
      why: `<p>Вы совершаете работу против силы <i>F</i> = <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>/<i>r</i>², которая увеличивается по мере сближения зарядов, поэтому необходимо выполнить интегрирование:</p><div class="eq"><i>W</i> = −∫<sub><i>r</i><sub>0</sub></sub><sup><i>r</i><sub>1</sub></sup> <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>/<i>r</i>² d<i>r</i> = <i>kq</i><sub>1</sub><i>q</i><sub>2</sub>(1/<i>r</i><sub>1</sub> − 1/<i>r</i><sub>0</sub>) = Δ<i>U</i> = ${p(P0.W * 1e6, 3)} мкДж</div><p><i>kq</i><sub>1</sub><i>q</i><sub>2</sub>/<i>r</i><sub>1</sub> (${p(P0.nums[0], 3)} мкДж) — это работа при переносе заряда из бесконечности, а не с расстояния ${p(r0 * 100, 0)} см.</p>` },
    { q: `Две частицы взаимодействуют с потенциальной энергией U(r) = A/r² − B/r (A, B > 0). При каком расстоянии между ними сила взаимодействия равна нулю?`,
      choices: ['<i>A</i>/<i>B</i>', '√(<i>A</i>/<i>B</i>)', '<i>B</i>/2<i>A</i>', '2<i>A</i>/<i>B</i>'], answer: 3,
      why: '<p><i>F</i> = −d<i>U</i>/d<i>r</i>, поэтому приравняем наклон графика к нулю:</p><div class="eq">d<i>U</i>/d<i>r</i> = −2<i>A</i>/<i>r</i>³ + <i>B</i>/<i>r</i>² = 0 &nbsp;→&nbsp; <i>r</i> = 2<i>A</i>/<i>B</i></div><p><i>A</i>/<i>B</i> соответствует условию <i>U</i> = 0, а не нулевому наклону графика. При 2<i>A</i>/<i>B</i> <i>U</i> достигает минимума, поэтому равновесие устойчиво.</p>' },
  ],
  1: [
    { q: `Четыре заряда +${P1.q / nC} нКл расположены в вершинах квадрата со стороной ${p(P1.a * 100, 0)} см. Чему равна электрическая потенциальная энергия этой системы зарядов?`,
      choices: P1.nums.map(x => `${p(x, 3)} мкДж`), answer: 2, nums: P1.nums,
      why: `<p>Всего шесть пар: четыре пары зарядов находятся на расстоянии <i>a</i>, а две диагональные пары — на расстоянии √2<i>a</i>.</p><div class="eq"><i>U</i> = 4<i>kq</i>²/<i>a</i> + 2<i>kq</i>²/√2<i>a</i> = (4 + √2)<i>kq</i>²/<i>a</i> = ${p(P1.U * 1e6, 3)} мкДж</div><p>Суммирование <i>qV</i> по каждому заряду учитывает каждую пару дважды (${p(P1.nums[1], 3)} мкДж); диагональ равна √2<i>a</i>, а не <i>a</i>/√2.</p>` },
    { q: `Металлический шар радиусом ${p(P1b.R * 100, 0)} см заряжают до ${p(P1b.Q / nC, 1)} нКл, постепенно перенося малые заряды dq из бесконечности. Какую полную работу необходимо совершить?`,
      choices: P1b.nums.map(x => `${p(x, 3)} мкДж`), answer: 2, nums: P1b.nums,
      why: `<p>Когда на шаре находится заряд <i>q</i>, его потенциал равен <i>kq</i>/<i>R</i>, а для переноса малого заряда d<i>q</i> требуется работа (<i>kq</i>/<i>R</i>) d<i>q</i>:</p><div class="eq"><i>W</i> = ∫<sub>0</sub><sup><i>Q</i></sup> (<i>kq</i>/<i>R</i>) d<i>q</i> = <i>kQ</i>²/2<i>R</i> = ${p(P1b.U * 1e6, 3)} мкДж</div><p>Произведение <i>Q</i> на конечный потенциал (${p(P1b.nums[0], 3)} мкДж) предполагает, что каждый элемент d<i>q</i> переносится при полном конечном потенциале; в начале переносу почти не препятствовало отталкивание.</p>` },
  ],
  2: [
    { q: `Заряд +${M.UNI.q / nC} нКл перемещается из точки A в точку C в однородном поле напряжённостью ${M.UNI.E} Н/Кл, причём VC − VA = −10 В. Какую работу совершает электрическое поле над зарядом?`,
      choices: P2.nums.map(x => `${s(+p(x, 1))} нДж`), answer: 3, nums: P2.nums,
      why: `<div class="eq"><i>W</i><sub>field</sub> = −Δ<i>U</i> = −<i>q</i>Δ<i>V</i> = −(${M.UNI.q / nC} нКл)(−10 В) = +${p(P2.W * 1e9, 1)} нДж</div><p>Траектория не имеет значения: учитывается только проекция перемещения ${p(M.UNI.C[0] * 100, 0)} см вдоль <b>E</b>, а не ${p(P2.L * 100, 1)} см по прямой траектории (${p(P2.nums[2], 1)} нДж). Положительный заряд, движущийся по направлению <b>E</b>, теряет потенциальную энергию <i>U</i>, поэтому поле совершает положительную работу.</p>` },
    { q: `Поле направлено вдоль +x и имеет вид E = ${P2b.c}x² (Н/Кл, x в метрах). Чему равно В(${P2b.x} м) − В(0)?`,
      choices: P2b.nums.map(x => `${s(x)} В`), answer: 2, nums: P2b.nums,
      why: `<div class="eq">Δ<i>V</i> = −∫<sub>0</sub><sup>${P2b.x}</sup> ${P2b.c}<i>x</i>² d<i>x</i> = −<i>x</i>³ |<sub>0</sub><sup>${P2b.x}</sup> = ${s(P2b.dV)} В</div><p>При движении по направлению <b>E</b> потенциал <i>V</i> уменьшается, поэтому ответ отрицательный. <i>E</i>(${P2b.x}) × ${P2b.x} м = ${-P2b.nums[1]} В ошибочно предполагает, что максимальная напряжённость сохраняется на всём пути.</p>` },
  ],
  3: [
    { q: `На изображённом холме расположен заряд +${M.HILL.Q / nC} нКл. В точке, где V = ${P3.V} В, чему равен модуль электрического поля?`,
      choices: P3.nums.map(x => `${p(x, 0)} Н/Кл`), answer: 1, nums: P3.nums,
      why: `<p>Сначала найдём расстояние: <i>r</i> = <i>kQ</i>/<i>V</i> = ${p(K * M.HILL.Q, 2)}/${P3.V} = ${p(P3.r * 100, 2)} см. Затем определим наклон графика потенциала:</p><div class="eq"><i>E</i> = −d<i>V</i>/d<i>r</i> = <i>kQ</i>/<i>r</i>² = <i>V</i>/<i>r</i> = ${p(P3.E, 0)} Н/Кл</div><p><i>V</i> и <i>E</i> имеют разные единицы измерения и физический смысл: ${P3.V} В — это высота холма, ${p(P3.E, 0)} Н/Кл — крутизна его склона.</p>` },
    { q: `В области пространства потенциал V(x, y) = 3x²y − y³ (вольты, метры). Чему равен модуль E в точке (1 м, 2 м)?`,
      choices: P3b.nums.map(x => `${p(x, 1)} Н/Кл`), answer: 2, nums: P3b.nums,
      why: `<p><b>E</b> = −∇<i>V</i>; найдём компоненты поля:</p><div class="eq"><i>E<sub>x</sub></i> = −∂<i>V</i>/∂<i>x</i> = −6<i>xy</i> = ${s(P3b.Ex)} Н/Кл, &nbsp;<i>E<sub>y</sub></i> = −(3<i>x</i>² − 3<i>y</i>²) = ${s(P3b.Ey)} Н/Кл</div><div class="eq">|<b>E</b>| = √(${P3b.Ex ** 2} + ${P3b.Ey ** 2}) = ${p(P3b.E, 1)} Н/Кл</div><p>Компоненты складываются векторно, а не как скалярные числа (${p(P3b.nums[0], 1)}).</p>` },
  ],
  4: [
    { q: `Для изображённого диполя (+${M.DIP.q / nC} нКл при x = −${p(M.DIP.a * 100, 0)} см, −${M.DIP.q / nC} нКл при x = +${p(M.DIP.a * 100, 0)} см) найдите потенциал в точке P на оси при x = ${p(M.DIP.axisX * 100, 0)} см.`,
      choices: P4.nums.map(x => `${x === 0 ? '0' : s(+p(x, 1))} В`), answer: 2, nums: P4.nums,
      why: `<p>Сложим два вклада <i>kq</i>/<i>r</i> с учётом знаков зарядов:</p><div class="eq"><i>V</i> = <i>kq</i>/${p((M.DIP.axisX + M.DIP.a), 2)} − <i>kq</i>/${p((M.DIP.axisX - M.DIP.a), 2)} = ${p(K * M.DIP.q / (M.DIP.axisX + M.DIP.a), 1)} − ${p(K * M.DIP.q / (M.DIP.axisX - M.DIP.a), 1)} = ${s(+p(P4.V, 1))} В</div><p>Точка P ближе к отрицательному заряду, поэтому <i>V</i> &lt; 0. <i>V</i> = 0 выполняется на биссектрисе, но не в данной точке; приближение для далёкого поля −2<i>akq</i>/<i>x</i>² (${p(P4.nums[3], 1)} В) применимо при <i>x</i> ≫ <i>a</i>.</p>` },
    { q: `Далеко от диполя на его оси, со стороны заряда −q, потенциал приблизительно равен V ≈ −2akq/x². Чему равно электрическое поле в этой области?`,
      choices: ['4<i>akq</i>/<i>x</i>³, направлено от диполя', '2<i>akq</i>/<i>x</i>³, направлено к диполю', '4<i>akq</i>/<i>x</i>³, направлено к диполю', '2<i>akq</i>/<i>x</i>², направлено от диполя'], answer: 2,
      why: '<div class="eq"><i>E<sub>x</sub></i> = −d<i>V</i>/d<i>x</i> = −d/d<i>x</i>(−2<i>akq x</i><sup>−2</sup>) = −4<i>akq</i>/<i>x</i>³</div><p>Отрицательный знак означает направление вдоль −<i>x</i>, обратно к диполю. Это закономерно: более близкий заряд −<i>q</i> притягивает положительный пробный заряд сильнее, чем удалённый +<i>q</i> отталкивает его. <b>E</b> направлено от большего потенциала к меньшему; ближе к диполю <i>V</i> ниже (более отрицательно).</p>' },
  ],
  5: [
    { q: `Изображённый стержень имеет заряд +${rQ / nC} нКл и длину ${p(rL * 100, 0)} см. Чему равен потенциал на его оси на расстоянии ${p(P5.a * 100, 0)} см за одним из концов?`,
      choices: P5.nums.map(x => `${p(x, 1)} В`), answer: 3, nums: P5.nums,
      why: `<div class="eq"><i>V</i> = ∫<sub><i>a</i></sub><sup><i>a</i>+<i>L</i></sup> <i>k</i>λ d<i>x</i>/<i>x</i> = <i>k</i>λ ln((<i>a</i> + <i>L</i>)/<i>a</i>) = ${p(K * rlam, 1)} × ln ${p((P5.a + rL) / P5.a, 0)} = ${p(P5.V, 1)} В</div><p>Интеграл от 1/<i>x</i> равен натуральному логарифму; использование десятичного логарифма дало бы ${p(P5.nums[2], 1)} В. Если считать, что весь заряд сосредоточен в середине стержня (${p(P5.nums[1], 1)} В) такое приближение допустимо только на большом расстоянии.</p>` },
    { q: `Используя V(a) на оси стержня, найдите напряжённость электрического поля на расстоянии ${p(P5.a * 100, 0)} см за его концом.`,
      choices: P5.nums2.map(x => `${p(x, 0)} Н/Кл`), answer: 0, nums: P5.nums2,
      why: `<div class="eq"><i>E</i> = −d<i>V</i>/d<i>a</i> = −<i>k</i>λ[1/(<i>a</i> + <i>L</i>) − 1/<i>a</i>] = <i>kQ</i>/(<i>a</i>(<i>a</i> + <i>L</i>)) = ${p(P5.E, 0)} Н/Кл</div><p>направлено от стержня. <i>V</i>/<i>a</i> (${p(P5.nums2[1], 0)} Н/Кл) было бы верно только при зависимости <i>V</i> ∝ 1/<i>a</i>; здесь необходимо взять производную.</p>` },
  ],
  6: [
    { q: `Кольцо на рисунке имеет заряд +${M.RING.Q / nC} нКл и радиус R = ${p(M.RING.R * 100, 0)} см. Чему равен потенциал на его оси на расстоянии ${p(P6.z * 100, 0)} см от центра?`,
      choices: P6.nums.map(x => `${p(x, 1)} В`), answer: 1, nums: P6.nums,
      why: `<p>Каждый элемент заряда d<i>q</i> находится на расстоянии √(<i>R</i>² + <i>z</i>²) = ${p(Math.hypot(M.RING.R, P6.z) * 100, 0)} см, а потенциал <i>V</i> — скалярная величина, поэтому разлагать его на компоненты не нужно:</p><div class="eq"><i>V</i> = <i>kQ</i>/√(<i>R</i>² + <i>z</i>²) = ${p(K * M.RING.Q, 2)}/${p(Math.hypot(M.RING.R, P6.z), 2)} = ${p(P6.V, 1)} В</div><p>${p(P6.nums[2], 1)} — это напряжённость поля <i>kQz</i>/(<i>R</i>² + <i>z</i>²)<sup>3/2</sup> в Н/Кл; множитель cos относится к <b>E</b>, а не к <i>V</i>.</p>` },
    { q: `Полукольцо с зарядом +${M.ARC.Q / nC} нКл и радиусом R = ${p(M.ARC.R * 100, 0)} см имеет в центре потенциал V = kQ/R. Чему равен модуль электрического поля в центре?`,
      choices: P6b.nums.map(x => `${x ? p(x, 0) : '0'} Н/Кл`), answer: 2, nums: P6b.nums,
      why: `<p>При λ = <i>Q</i>/π<i>R</i> каждый элемент d<i>q</i> = λ<i>R</i> dθ создаёт вклад <i>k</i>λ dθ/<i>R</i>. Отсчитываем θ от оси симметрии: поперечные составляющие компенсируются, а остальные складываются:</p><div class="eq"><i>E</i> = ∫<sub>−π/2</sub><sup>π/2</sup> (<i>k</i>λ/<i>R</i>) cos θ dθ = 2<i>k</i>λ/<i>R</i> = 2<i>kQ</i>/π<i>R</i>² = ${p(P6b.E, 0)} Н/Кл</div><p>В отличие от потенциала <i>V</i>, напряжённость <b>E</b> не равна просто <i>kQ</i>/<i>R</i>² (${p(P6b.nums[0], 0)} Н/Кл): вклады отдельных элементов направлены по-разному. Нулевое поле получается только для полного кольца.</p>` },
  ],
  7: [
    { q: `Изолирующий шар на рисунке равномерно заряжен положительным зарядом +${M.SPH.Q / nC} нКл и имеет радиус R = ${p(M.SPH.R * 100, 0)} см. Чему равен потенциал на расстоянии ${p(P7.r * 100, 0)} см от его центра?`,
      choices: P7.nums.map(x => `${p(x, 1)} В`), answer: 1, nums: P7.nums,
      why: `<p>Двигаясь от бесконечности к центру, получаем: −∫<i>E</i> d<i>r</i>: интегрирование поля снаружи даёт <i>kQ</i>/<i>R</i>; внутри шара <i>E</i> = <i>kQr</i>/<i>R</i>³ добавляет ещё один вклад:</p><div class="eq"><i>V</i>(<i>r</i>) = <i>kQ</i>/<i>R</i> + ∫<sub><i>r</i></sub><sup><i>R</i></sup> <i>kQr</i>′/<i>R</i>³ d<i>r</i>′ = (<i>kQ</i>/<i>R</i>)(3/2 − <i>r</i>²/2<i>R</i>²) = ${p(P7.V, 1)} В</div><p><i>kQ</i>/<i>r</i> (${p(P7.nums[0], 1)} В) соответствует предположению, что весь заряд находится внутри радиуса <i>r</i>; ${p(P7.nums[2], 1)} В — потенциал металлического шара, внутри которого <i>E</i> = 0.</p>` },
    { q: `Два металлических шара радиусами R1 = 3R2 находятся далеко друг от друга и соединены тонкой проволокой, после чего их заряжают. Чему равно отношение поверхностных плотностей заряда σ1/σ2?`,
      choices: P7b.nums.map(frac), answer: 0, nums: P7b.nums,
      why: '<p>После соединения шары образуют единый проводник с одинаковым потенциалом: <i>kQ</i><sub>1</sub>/<i>R</i><sub>1</sub> = <i>kQ</i><sub>2</sub>/<i>R</i><sub>2</sub>, поэтому <i>Q</i><sub>1</sub>/<i>Q</i><sub>2</sub> = <i>R</i><sub>1</sub>/<i>R</i><sub>2</sub> = 3. Тогда</p><div class="eq">σ<sub>1</sub>/σ<sub>2</sub> = (<i>Q</i><sub>1</sub>/<i>R</i><sub>1</sub>²)/(<i>Q</i><sub>2</sub>/<i>R</i><sub>2</sub>²) = 3 × (1/3)² = 1/3</div><p>Большой шар несёт больший заряд, но он распределён по большей площади: плотность заряда выше там, где поверхность проводника имеет более сильную кривизну.</p>' },
  ],
  8: [
    { q: `Протон начинает движение из состояния покоя у пластины с потенциалом ${M.ACC.Vhi} В и пересекает область поля к пластине с потенциалом ${M.ACC.Vlo} В. С какой скоростью он прибывает?`,
      choices: P8.nums.map(x => `${p(x, 1)} км/с`), answer: 2, nums: P8.nums,
      why: `<div class="eq"><i>e</i>Δ<i>V</i> = ½<i>mv</i>² &nbsp;→&nbsp; <i>v</i> = √(2<i>e</i>Δ<i>V</i>/<i>m</i><sub>p</sub>) = √(2 × ${M.E_CH.toExponential(2).replace('e-', ' × 10<sup>−')}</sup> × ${M.ACC.dV}/${M.M_P.toExponential(2).replace('e-', ' × 10<sup>−')}</sup>) = ${p(P8.v / 1e3, 1)} км/с</div><p>Учитывается только <b>разность потенциалов</b>, ${M.ACC.dV} В, а не ${M.ACC.Vhi} В начальной пластины. ${p(P8.nums[3], 0)} км/с — скорость электрона при той же энергии 6 эВ.</p>` },
    { q: `Электрон начинает движение из состояния покоя на расстоянии ${p(P8b.ra * 100, 0)} см от неподвижного заряда +${P8b.Q / nC} нКл и притягивается к нему. Какова скорость электрона, когда расстояние уменьшится до ${p(P8b.rb * 100, 0)} см?`,
      choices: P8b.nums.map(x => `${p(x, 2)} × 10<sup>6</sup> м/с`), answer: 1, nums: P8b.nums,
      why: `<p>По мере приближения сила увеличивается, поэтому воспользуемся законом сохранения энергии, который уже учитывает интеграл ∫<i>F</i> d<i>r</i>:</p><div class="eq">Δ<i>V</i> = <i>kQ</i>(1/<i>r</i><sub>b</sub> − 1/<i>r</i><sub>a</sub>) = ${p(P8b.dV, 1)} В, &nbsp;<i>v</i> = √(2<i>e</i>Δ<i>V</i>/<i>m</i><sub>e</sub>) = ${p(P8b.v / 1e6, 2)} × 10<sup>6</sup> м/с</div><p>Использование потенциала <i>V</i> на расстоянии ${p(P8b.rb * 100, 0)} см (${p(K * P8b.Q / P8b.rb, 0)} В) не учитывает, что движение началось с расстояния ${p(P8b.ra * 100, 0)} см, а не из бесконечности.</p>` },
  ],
};
