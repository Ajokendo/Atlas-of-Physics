// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + (Math.abs(x) >= 1000 ? Math.abs(x).toFixed(0) : Math.abs(x).toPrecision(3));   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const G = M.G, sin = d => Math.sin(d * Math.PI / 180), cos = d => Math.cos(d * Math.PI / 180), tan = d => Math.tan(d * Math.PI / 180);
const W = M.WHEEL, DS = M.DISC, DR = M.DOOR, PL = M.PLANK, LD = M.LADDER, SH = M.SHAPES, RD = M.ROD, WR = M.WRENCH, B = M.BOWL, WL = M.WELL, IM = M.IMP, SK = M.SKATE, HT = M.HIT;

// 0 · turns while speeding up
const Q0 = { th: 0.5 * W.alpha * W.tUp ** 2 };
Q0.оборотов = Q0.th / (2 * Math.PI);
// 1 · the edge rider at 1.6 s
const Q1 = { t: 1.6 };
Q1.p = M.pointAt(DS.r2, M.disc(Q1.t));
// 2 · the handle push at 30°, and α from the square push
const Q2 = { phi: 30 };
Q2.tau = M.torque(DR.cases[0].r, DR.F, Q2.phi);
Q2.alpha = DR.cases[0].tau / DR.I;
// 3 · crate 1.0 m from A
const Q3 = { x: 1.0 };
Q3.q = M.plank(Q3.x);
// 4 · ladder at 60°
const Q4 = { th: 60 };
Q4.f = M.ladder(Q4.th * Math.PI / 180).f;
// 5 · the disc after 2.0 s
const Q5 = { t: 2.0, disc: SH.list[1] };
Q5.w = Q5.disc.alpha * Q5.t;
// 6 · a rod whose density grows from one end, λ = Cx: I = ½ML²; an annulus R/2 → R: ⅝MR²
const Q6 = { I: 0.5 * RD.M * RD.L ** 2, Iann: 5 / 8 * SH.M * SH.R ** 2 };
// 7 · rod axis 0.30 m from one end; the end-pinned rod released from horizontal
const Q7 = { e: 0.30 };
Q7.d = RD.L / 2 - Q7.e;
Q7.I = RD.Icm + RD.M * Q7.d ** 2;
Q7.wBot = Math.sqrt(3 * G / RD.L);
// 8 · one 120° stroke
const Q8 = { W: WR.tau * WR.stroke };
// 9 · the disc at the bottom; h from the ramp
const Q9 = { h: M.RACE.h };
Q9.v = Math.sqrt(2 * G * Q9.h / 1.5);
// 10 · the bowling ball
const Q10 = { vf: 5 * B.v0 / 7, xStar: 12 * B.v0 ** 2 / (49 * B.muK * G) };
// 11 · bucket after the full 2.0 m
const Q11 = { v: Math.sqrt(2 * WL.a * WL.h) };
// 12 · a 100 Н rim push for 0.90 s; a triangular torque pulse
const Q12 = { F: 100, dt: 0.9, peak: 200, T: 1.2 };
Q12.w = Q12.F * IM.R * Q12.dt / IM.I;
Q12.J = 0.5 * Q12.peak * Q12.T;
// 13 · the skater
const Q13 = { I0: M.inertia(SK.rOut), I1: M.inertia(SK.rIn) };
Q13.w = Q13.I0 * SK.w0 / Q13.I1;
Q13.wNoBody = (2 * SK.m * SK.rOut ** 2) * SK.w0 / (2 * SK.m * SK.rIn ** 2);
// 14 · the ball sticks to the rod; a ball dropped beside O
const Q14 = { w: HT.m * HT.v0 * HT.d / (HT.I + HT.m * HT.d ** 2), dLdt: HT.m * G * HT.d };

const eq = s => `<div class="eq">${s}</div>`;

export const PRACTICE = {
  0: [
    { q: `Колесо начинает вращаться из состояния покоя с угловым ускорением ${f(W.alpha, 1)} рад/с² в течение ${f(W.tUp, 1)} с. Сколько оборотов оно совершит за это время?`,
      choices: [`${p3(Q0.th / Math.PI)} оборотов`, `${p3(Q0.th)} оборотов`, `${p3(Q0.rev)} оборотов`, `${p3(Q0.th * 2 * Math.PI)} оборотов`], answer: 2,
      why: `<p>При постоянном α и начале вращения из состояния покоя: Δθ = ½αt², в радианах. Затем разделим на 2π рад в одном обороте.</p>${eq(`Δθ = ½ × ${f(W.alpha, 1)} × ${f(W.tUp, 1)}² = ${f(Q0.th)} рад = ${f(Q0.th)} / 2π = ${p3(Q0.rev)} оборотов`)}<p>${p3(Q0.th)} оборотов не учитывает, что ½αt² даёт угол в радианах; ${p3(Q0.th / Math.PI)} оборотов не учитывает множитель ½.</p>` },
    { q: `Положительным считается вращение против часовой стрелки. Колесо вращается против часовой стрелки и тормозит. Какие знаки имеют угловая скорость ω и угловое ускорение α?`,
      choices: ['ω > 0, α > 0', 'ω < 0, α < 0', 'ω < 0, α > 0', 'ω > 0, α < 0'], answer: 3,
      why: '<p>Колесо вращается против часовой стрелки, поэтому ω > 0. Оно замедляется, следовательно, α направлено противоположно ω: α < 0. Знак ω задаёт направление вращения, а α показывает, как изменяется ω.</p>' },
  ],
  1: [
    { q: `Карусель вращается с постоянной угловой скоростью ω. Во сколько раз центростремительное ускорение пассажира на расстоянии ${DS.r2} м от центра больше ускорения пассажира на расстоянии ${DS.r1} м?`,
      choices: ['1 (одинаковые ω и ускорение)', '4', '2', '½'], answer: 2,
      why: '<p>У обоих пассажиров одинаковая ω, а <i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i> = <i>r</i>ω². При постоянной ω ускорение пропорционально <i>r</i>: при удвоении радиуса ускорение также удваивается.</p><p>4 получается, если в выражении <i>v</i>²/<i>r</i> удвоить <i>v</i>, но забыть об изменении знаменателя <i>r</i>.</p>' },
    { q: `Карусель начинает вращаться из состояния покоя с угловым ускорением α = ${f(DS.alpha, 1)} рад/с². Чему равен модуль полного ускорения пассажира на расстоянии ${DS.r2} м от центра в момент t = ${f(Q1.t, 1)} с?`,
      choices: [`${p3(Q1.p.at)} м/с²`, `${p3(Q1.p.ac)} м/с²`, `${p3(Q1.p.a)} м/с²`, `${p3(Q1.p.at + Q1.p.ac)} м/с²`], answer: 2,
      why: `<p>ω = αt = ${f(DS.alpha * Q1.t)} рад/с. Ускорение состоит из двух взаимно перпендикулярных составляющих:</p>${eq(`<i>a</i><sub>t</sub> = rα = ${f(Q1.p.at)} м/с², <i>a</i><sub>c</sub> = rω² = ${f(Q1.p.ac)} м/с²`)}${eq(`<i>a</i> = √(${f(Q1.p.at)}² + ${f(Q1.p.ac)}²) = ${p3(Q1.p.a)} м/с²`)}<p>Они перпендикулярны, поэтому складываются как векторы, а не как числа (${p3(Q1.p.at + Q1.p.ac)}).</p>` },
  ],
  2: [
    { q: `К ручке двери на расстоянии ${f(DR.cases[0].r, 2)} м от петли прикладывают силу ${f(DR.F, 0)} Н под углом ${Q2.phi}° к плоскости двери. Какой крутящий момент создаёт эта сила относительно петли?`,
      choices: [`${p3(DR.F * DR.cases[0].r)} Н·м`, `${p3(Q2.tau)} Н·м`, `${p3(DR.F * DR.cases[0].r * cos(Q2.phi))} Н·м`, '0 Н·м'], answer: 1,
      why: `<p>φ — это угол между <b>r</b> (направленным вдоль двери) и <b>F</b>, в данном случае ${Q2.phi}°.</p>${eq(`τ = rF sin φ = ${f(DR.cases[0].r)} × ${f(DR.F, 0)} × sin ${Q2.phi}° = ${p3(Q2.tau)} Н·м`)}<p>${p3(DR.F * DR.cases[0].r * cos(Q2.phi))} Н·м использует cos: это составляющая силы вдоль двери, направленная к петле.</p>` },
    { q: `Дверь массой ${DR.M} кг и шириной ${f(DR.W, 1)} м (I = ⅓MW²) толкают перпендикулярно в ручку, создавая момент τ = ${f(DR.cases[0].tau, 1)} Н·м. Чему равно угловое ускорение двери?`,
      choices: [`${p3(DR.cases[0].tau / (DR.M * DR.W ** 2))} рад/с²`, `${p3(DR.cases[0].tau / (DR.M * DR.W ** 2 / 2))} рад/с²`, `${p3(DR.cases[0].tau / (DR.M * DR.W ** 2 / 12))} рад/с²`, `${p3(Q2.alpha)} рад/с²`], answer: 3,
      why: `${eq(`I = ⅓MW² = ⅓ × ${DR.M} × ${f(DR.W, 1)}² = ${f(DR.I)} кг·м²`)}${eq(`α = τ/I = ${f(DR.cases[0].tau, 1)} / ${f(DR.I)} = ${p3(Q2.alpha)} рад/с²`)}<p>Дверь вращается вокруг края, а не вокруг середины, поэтому <sup>1</sup>⁄<sub>12</sub>MW² (относительно центра) даёт слишком большое α.</p>` },
  ],
  3: [
    { q: `Ящик массой ${PL.m} кг стоит на расстоянии ${f(Q3.x, 1)} м от опоры A на доске длиной ${f(PL.L, 1)} м и массой ${PL.M} кг. С какой силой доска давит на опору B?`,
      choices: [`${p3(Q3.q.FA)} Н`, `${p3((PL.Wp + PL.Wc) / 2)} Н`, `${p3(Q3.x * PL.Wc / PL.L)} Н`, `${p3(Q3.q.FB)} Н`], answer: 3,
      why: `<p>Запишем моменты сил относительно точки A, где у <i>F</i><sub>A</sub> плечо равно нулю:</p>${eq(`${f(PL.L, 1)}·<i>F</i><sub>B</sub> = ${f(PL.L / 2, 1)} × ${f(PL.Wp, 0)} + ${f(Q3.x, 1)} × ${f(PL.Wc, 0)} → <i>F</i><sub>B</sub> = ${p3(Q3.q.FB)} Н`)}<p>Ящик расположен ближе к A, поэтому опора A воспринимает большую нагрузку (${p3(Q3.q.FA)} Н) а опора B — меньшую. ${p3(Q3.x * PL.Wc / PL.L)} Н не учитывает собственный вес доски.</p>` },
    { q: `Ящик медленно перемещают по доске от опоры A к опоре B. Как изменяются силы реакции опор?`,
      choices: ['<i>F</i><sub>A</sub> falls, <i>F</i><sub>B</sub> rises, their sum stays the same', '<i>F</i><sub>A</sub> rises, <i>F</i><sub>B</sub> falls', 'обе не изменяются: общий вес остаётся прежним', '<i>F</i><sub>A</sub> falls, <i>F</i><sub>B</sub> rises, their sum rises'], answer: 0,
      why: '<p>Из условия Σ<i>F</i> = 0 сумма реакций равна (M + m)g. Из условия Στ относительно A = 0 получаем <i>F</i><sub>B</sub> = [(L/2)Mg + x·mg]/L, которая увеличивается с ростом x. Поэтому <i>F</i><sub>B</sub> возрастает, а <i>F</i><sub>A</sub> уменьшается на ту же величину.</p>' },
  ],
  4: [
    { q: `Лестница массой ${LD.m} кг опирается на гладкую стену и образует угол ${Q4.th}° с полом. Какая сила трения должна действовать со стороны пола?`,
      choices: [`${p3(LD.W / tan(Q4.th))} Н`, `${p3(Q4.f)} Н`, `${p3(LD.muS * LD.W)} Н`, `${p3(LD.W * tan(Q4.th) / 2)} Н`], answer: 1,
      why: `<p>Запишем моменты сил относительно нижнего конца лестницы: (L sin θ)<i>F</i><sub>w</sub> = (½L cos θ)mg, откуда <i>F</i><sub>w</sub> = mg / (2 tan θ). ΣF<sub>x</sub> = 0 показывает, что сила трения равна <i>F</i><sub>w</sub>:</p>${eq(`<i>f</i> = ${f(LD.W, 0)} / (2 tan ${Q4.th}°) = ${p3(Q4.f)} Н`)}<p>${p3(LD.muS * LD.W)} Н — это <b>максимальная</b> сила трения покоя, а не фактическая сила трения.</p>` },
    { q: `Лестницу заменяют вдвое более тяжёлой, но такой же длины, и ставят на тот же пол. Изменится ли минимальный угол, при котором она не скользит?`,
      choices: ['больше', 'меньше', 'без изменений', 'больше, только если лестница также длиннее'], answer: 2,
      why: '<p>Необходимая сила трения, mg/(2 tan θ), и максимальная сила трения, μ<sub>s</sub>mg, обе пропорциональны m. Приравнивая их, получаем tan θ<sub>min</sub> = 1/(2μ<sub>s</sub>): в выражении нет ни m, ни L.</p>' },
  ],
  5: [
    { q: `Кольцо, диск и сплошной шар имеют одинаковые массы и радиусы, и к ним приложены одинаковые крутящие моменты. Расположите их по убыванию углового ускорения.`,
      choices: ['кольцо, диск, шар', 'шар, диск, кольцо', 'диск, шар, кольцо', 'одинаковые'], answer: 1,
      why: '<p>α = τ/I, где I = MR² (ring), ½MR² (disc), ⅖MR² (sphere). У шара масса в среднем расположена ближе всего к оси, поэтому его момент инерции минимален, а угловое ускорение максимально.</p>' },
    { q: `Диск массой ${f(SH.M, 1)} кг и радиусом ${f(SH.R, 1)} м начинает вращаться из состояния покоя. К нити, намотанной на его обод, прикладывают силу ${f(SH.F, 1)} Н. Какова угловая скорость диска через ${f(Q5.t, 1)} с?`,
      choices: [`${p3(SH.F / Q5.disc.I * Q5.t)} рад/с`, `${p3(SH.tau / (SH.M * SH.R ** 2) * Q5.t)} рад/с`, `${p3(SH.tau / (0.4 * SH.M * SH.R ** 2) * Q5.t)} рад/с`, `${p3(Q5.w)} рад/с`], answer: 3,
      why: `${eq(`τ = FR = ${f(SH.tau)} Н·м, I = ½MR² = ${f(Q5.disc.I)} кг·м²`)}${eq(`α = τ/I = ${f(Q5.disc.alpha)} рад/с², ω = αt = ${p3(Q5.w)} рад/с`)}<p>${p3(SH.F / Q5.disc.I * Q5.t)} рад/с ошибочно использует силу вместо момента силы. момент силы.</p>` },
  ],
  6: [
    { q: `Стержень массой ${f(RD.M, 1)} кг и длиной ${f(RD.L, 1)} м становится плотнее к одному концу: λ = Cx, где x отсчитывается от лёгкого конца O. Чему равен момент инерции относительно перпендикулярной оси через O?`,
      choices: [`${p3(RD.M * RD.L ** 2 / 3)} кг·м²`, `${p3(Q6.I)} кг·м²`, `${p3(RD.M * RD.L ** 2 / 4)} кг·м²`, `${p3(RD.M * RD.L ** 2)} кг·м²`], answer: 1,
      why: `<p>Сначала выразим C через массу, затем проинтегрируем r² dm, учитывая dm = Cx dx:</p>${eq(`M = ∫<sub>0</sub><sup>L</sup> Cx dx = ½CL² → C = 2M/L²`)}${eq(`I = ∫<sub>0</sub><sup>L</sup> x²·Cx dx = ¼CL⁴ = ½ML² = ${p3(Q6.I)} кг·м²`)}<p>Больше, чем у однородного стержня (⅓ML² = ${p3(RD.M * RD.L ** 2 / 3)}): большая часть массы расположена дальше от оси. Выражение ¼ML² получается, если не подставить C = 2M/L².</p>` },
    { q: `Плоская шайба (кольцо) массой M имеет внутренний радиус R/2 и внешний радиус R. Используя I = ∫r² dm, покажите, что относительно центральной оси I = ⅝MR², и вычислите его при M = ${f(SH.M, 1)} кг и R = ${f(SH.R, 1)} м.`,
      solution: `<p>Mass per area σ = M / [π(R² − R²/4)] = 4M / (3πR²). A ring at r of width dr has dm = σ·2πr dr.</p>${eq(`I = ∫<sub>R/2</sub><sup>R</sup> r²·σ2πr dr = 2πσ [r⁴/4]<sub>R/2</sub><sup>R</sup> = 2πσ · (15/64)R⁴`)}${eq(`I = 2π · 4M/(3πR²) · 15R⁴/64 = (120/192)MR² = ⅝MR²`)}${eq(`I = ⅝ × ${f(SH.M, 1)} × ${f(SH.R, 1)}² = ${p3(Q6.Iann)} кг·м²`)}<p>Результат находится между значениями для диска (½MR²) и кольца (MR²), как и должно быть: отверстие смещает массу дальше от оси.</p>` },
  ],
  7: [
    { q: `Стержень массой ${f(RD.M, 1)} кг и длиной ${f(RD.L, 1)} м имеет момент инерции относительно центра масс Icm = ${f(RD.Icm)} кг·м². Он вращается вокруг перпендикулярной оси на расстоянии ${f(Q7.e, 2)} м от одного конца. Чему равен его момент инерции относительно этой оси?`,
      choices: [`${p3(RD.Icm + RD.M * Q7.d)} кг·м²`, `${p3(RD.M * Q7.d ** 2)} кг·м²`, `${p3(RD.Iend + RD.M * Q7.e ** 2)} кг·м²`, `${p3(Q7.I)} кг·м²`], answer: 3,
      why: `<p>The theorem works from the centre-of-mass axis, so d is measured from the centre: d = ${f(RD.L / 2, 2)} − ${f(Q7.e, 2)} = ${f(Q7.d, 2)} m.</p>${eq(`I = I<sub>cm</sub> + Md² = ${f(RD.Icm)} + ${f(RD.M, 1)} × ${f(Q7.d, 2)}² = ${p3(Q7.I)} кг·м²`)}<p>${p3(RD.Iend + RD.M * Q7.e ** 2)} adds Md² to the end value, but the end is not the centre of mass.</p>` },
    { q: `Стержень закреплён на одном конце и отпущен из горизонтального положения. Используя теорему Штейнера, найдите I, запишите Στ = Iα как дифференциальное уравнение для угла θ ниже горизонтали и проинтегрируйте его, чтобы найти ω при прохождении нижней точки.`,
      solution: `<p>I = <sup>1</sup>⁄<sub>12</sub>ML² + M(L/2)² = ⅓ML². Gravity acts at the centre, L/2 from the pin, with lever arm (L/2)cos θ:</p>${eq(`⅓ML² · d²θ/dt² = Mg(L/2) cos θ`)}${eq(`d²θ/dt² = (3g / 2L) cos θ`)}<p>Write d²θ/dt² = ω dω/dθ and integrate from θ = 0, ω = 0:</p>${eq(`∫<sub>0</sub><sup>ω</sup> ω dω = (3g/2L) ∫<sub>0</sub><sup>θ</sup> cos θ dθ → ω² = (3g/L) sin θ`)}${eq(`at the bottom, θ = 90°: ω = √(3g/L) = √(3 × ${f(G)} / ${f(RD.L, 1)}) = ${p3(Q7.wBot)} рад/с`)}<p>Check by energy: the centre drops L/2, so Mg(L/2) = ½(⅓ML²)ω², the same result. α is not constant, so ω² = 2αΔθ does not apply.</p>` },
  ],
  8: [
    { q: `Сила ${f(WR.F, 0)} Н, приложенная перпендикулярно к гаечному ключу длиной ${f(WR.r, 2)} м, поворачивает гайку на 120°. Какую работу совершает сила?`,
      choices: [`${p3(WR.tau)} J`, `${p3(WR.F * WR.stroke)} J`, `${p3(Q8.W)} J`, `${p3(WR.tau * 120)} J`], answer: 2,
      why: `${eq(`W = τΔθ = (${f(WR.r, 2)} × ${f(WR.F, 0)}) × 2π/3 = ${f(WR.tau, 0)} × ${f(WR.stroke, 3)} = ${p3(Q8.W)} J`)}<p>Δθ must be in radians. ${p3(WR.tau * 120)} J multiplies by 120 degrees.</p>` },
    { q: `Для той же гайки требуется тот же крутящий момент. Если длину ключа увеличить вдвое, как изменятся необходимая сила и работа за поворот на 120°?`,
      choices: ['half the push, half the work', 'half the push, the same work', 'the same push, twice the work', 'half the push, twice the work'], answer: 1,
      why: '<p>τ = rF: double r, halve F. W = τΔθ: same τ, same angle, same work. The hand travels twice as far with half the force.</p>' },
  ],
  9: [
    { q: `Диск с моментом инерции I = ½mR² скатывается из состояния покоя без проскальзывания по наклонной плоскости длиной ${f(M.RACE.len, 1)} м и углом ${(M.RACE.theta * 180 / Math.PI).toFixed(0)}°. Какова его скорость внизу?`,
      choices: [`${p3(Math.sqrt(2 * G * Q9.h))} м/с`, `${p3(Math.sqrt(2 * G * Q9.h / 1.4))} м/с`, `${p3(Math.sqrt(G * Q9.h))} м/с`, `${p3(Q9.v)} м/с`], answer: 3,
      why: `<p>h = ${f(M.RACE.len, 1)} sin ${(M.RACE.theta * 180 / Math.PI).toFixed(0)}° = ${f(Q9.h, 3)} m. With ω = v/R:</p>${eq(`mgh = ½mv² + ½(½mR²)(v/R)² = ¾mv² → v = √(4gh/3) = ${p3(Q9.v)} м/с`)}<p>${p3(Math.sqrt(2 * G * Q9.h))} м/с is the sliding box, which spends nothing on spin.</p>` },
    { q: `Сплошной шар (I = ⅖MR²), полый шар (I = ⅔MR²) и кольцо (I = MR²) скатываются без проскальзывания из состояния покоя по одной наклонной плоскости. В каком порядке они достигнут низа?`,
      choices: ['ring, hollow sphere, solid sphere', 'all together', 'solid sphere, hollow sphere, ring', 'hollow sphere, solid sphere, ring'], answer: 2,
      why: '<p>a = g sin θ / (1 + f) with I = fMR². Smallest f, least energy spent on spin, fastest: solid (0.4), then hollow (0.67), then ring (1). Mass and radius cancel.</p>' },
  ],
  10: [
    { q: `Шар для боулинга покидает руку со скоростью ${f(B.v0, 1)} м/с без вращения и скользит, пока не начинает катиться без проскальзывания. Какова его скорость в этот момент?`,
      choices: [`${p3(B.v0)} м/с`, `${p3(Q10.vf)} м/с`, `${p3(B.v0 / Math.sqrt(1.4))} м/с`, `${p3(2 * B.v0 / 7)} м/с`], answer: 1,
      why: `<p>About the contact line friction has no torque, so mvR + Iω stays at mv<sub>0</sub>R. Rolling, ω = v/R:</p>${eq(`mv<sub>0</sub>R = mvR + ⅖mR²(v/R) → v = <sup>5</sup>⁄<sub>7</sub>v<sub>0</sub> = ${p3(Q10.vf)} м/с`)}<p>${p3(B.v0 / Math.sqrt(1.4))} м/с assumes kinetic energy is conserved, but kinetic friction turns some of it into heat while the ball skids.</p>` },
    { q: `Запишите v(t) и ω(t) во время скольжения шара (μk = ${f(B.muK, 1)}), найдите момент t*, когда v = Rω, и проинтегрируйте v(t), чтобы определить путь скольжения.`,
      solution: `<p>Friction μ<sub>k</sub>mg acts backward at the bottom:</p>${eq(`m dv/dt = −μ<sub>k</sub>mg → v = v<sub>0</sub> − μ<sub>k</sub>g t`)}${eq(`⅖mR² dω/dt = μ<sub>k</sub>mgR → ω = (5μ<sub>k</sub>g / 2R) t`)}${eq(`v<sub>0</sub> − μ<sub>k</sub>g t* = <sup>5</sup>⁄<sub>2</sub>μ<sub>k</sub>g t* → t* = 2v<sub>0</sub> / 7μ<sub>k</sub>g = ${f(B.tStar, 3)} с`)}${eq(`x* = ∫<sub>0</sub><sup>t*</sup> (v<sub>0</sub> − μ<sub>k</sub>g t) dt = v<sub>0</sub>t* − ½μ<sub>k</sub>g t*²`)}${eq(`x* = 12v<sub>0</sub>² / 49μ<sub>k</sub>g = ${p3(Q10.xStar)} м`)}<p>Neither depends on R or m.</p>` },
  ],
  11: [
    { q: `Ведро массой ${f(WL.m, 1)} кг падает из состояния покоя, разматывая верёвку с барабана массой ${f(WL.M, 1)} кг (сплошной цилиндр). Какова скорость ведра после падения на ${f(WL.h, 1)} м?`,
      choices: [`${p3(Math.sqrt(2 * G * WL.h))} м/с`, `${p3(Math.sqrt(2 * WL.m * G / (WL.m + WL.M) * WL.h))} м/с`, `${p3(Q11.v)} м/с`, `${p3(Math.sqrt(WL.a * WL.h))} м/с`], answer: 2,
      why: `${eq(`a = mg / (m + ½M) = ${f(WL.m * G, 1)} / ${f(WL.m + WL.M / 2, 1)} = ${f(WL.a)} м/с²`)}${eq(`v = √(2ah) = √(2 × ${f(WL.a)} × ${f(WL.h, 1)}) = ${p3(Q11.v)} м/с`)}<p>${p3(Math.sqrt(2 * G * WL.h))} м/с is free fall, ignoring the energy the drum takes; ${p3(Math.sqrt(2 * WL.m * G / (WL.m + WL.M) * WL.h))} м/с treats the drum like a hoop (I = MR²).</p>` },
    { q: `Чему равно натяжение верёвки во время падения ведра?`,
      choices: ['equal to the bucket’s weight', 'greater than the bucket’s weight', 'less than the bucket’s weight but more than zero', 'zero, since the bucket is falling'], answer: 2,
      why: `<p>The bucket accelerates downward, so mg − T = ma > 0: T < mg. But the rope must pull on the drum to spin it up (rT = Iα), so T > 0. Here T = ${f(WL.T)} Н against mg = ${f(WL.m * G, 1)} Н.</p>` },
  ],
  12: [
    { q: `Карусель (I = ${f(IM.I, 0)} кг·м², R = ${f(IM.R, 1)} м) начинает вращаться из состояния покоя. К её краю по касательной прикладывают силу ${Q12.F} Н в течение ${f(Q12.dt, 2)} с. Какова конечная угловая скорость?`,
      choices: [`${p3(Q12.F * Q12.dt / IM.I)} рад/с`, `${p3(Q12.w)} рад/с`, `${p3(Q12.F * IM.R * Q12.dt / (IM.M * IM.R ** 2))} рад/с`, `${p3(Q12.F * IM.R / IM.I)} рад/с`], answer: 1,
      why: `${eq(`ΔL = τΔt = (${Q12.F} × ${f(IM.R, 1)}) × ${f(Q12.dt, 2)} = ${f(Q12.F * IM.R * Q12.dt, 0)} кг·м²/s`)}${eq(`ω = ΔL / I = ${f(Q12.F * IM.R * Q12.dt, 0)} / ${f(IM.I, 0)} = ${p3(Q12.w)} рад/с`)}<p>${p3(Q12.F * Q12.dt / IM.I)} рад/с uses FΔt (linear impulse) instead of τΔt; ${p3(Q12.F * IM.R / IM.I)} is τ/I, the angular acceleration, not ω.</p>` },
    { q: `Крутящий момент на колесе равномерно возрастает от нуля до ${Q12.peak} Н·м за ${f(Q12.T / 2, 1)} с, а затем равномерно уменьшается до нуля к моменту ${f(Q12.T, 1)} с. На сколько изменится угловой момент колеса?`,
      choices: [`${p3(Q12.peak)} кг·м²/s`, `${p3(Q12.peak * Q12.T)} кг·м²/s`, `${p3(Q12.peak / Q12.T)} кг·м²/s`, `${p3(Q12.J)} кг·м²/s`], answer: 3,
      why: `<p>ΔL is the area under the τ–t graph, here a triangle:</p>${eq(`ΔL = ½ × ${f(Q12.T, 1)} s × ${Q12.peak} Н·м = ${p3(Q12.J)} кг·м²/s`)}<p>${p3(Q12.peak * Q12.T)} treats it as a rectangle; ${p3(Q12.peak / Q12.T)} is a slope, not an area.</p>` },
  ],
  13: [
    { q: `Фигуристка с моментом инерции тела Ibody = ${f(SK.Ib, 1)} кг·м² вращается с угловой скоростью ${f(SK.w0, 1)} рад/с, держа грузы массой ${f(SK.m, 1)} кг на расстоянии ${f(SK.rOut, 2)} м от оси, и подтягивает их до расстояния ${f(SK.rIn, 2)} м. Какой станет её угловая скорость?`,
      choices: [`${p3(SK.w0 * SK.rOut / SK.rIn)} рад/с`, `${p3(Q13.wNoBody)} рад/с`, `${p3(Q13.w)} рад/с`, `${p3(SK.w0)} рад/с`], answer: 2,
      why: `${eq(`I<sub>0</sub> = ${f(SK.Ib, 1)} + 2 × ${f(SK.m, 1)} × ${f(SK.rOut, 2)}² = ${f(Q13.I0)} кг·м², I<sub>f</sub> = ${f(SK.Ib, 1)} + 2 × ${f(SK.m, 1)} × ${f(SK.rIn, 2)}² = ${f(Q13.I1, 3)} кг·м²`)}${eq(`ω<sub>f</sub> = I<sub>0</sub>ω<sub>0</sub> / I<sub>f</sub> = ${p3(Q13.w)} рад/с`)}<p>${p3(Q13.wNoBody)} рад/с leaves out her body’s ${f(SK.Ib, 1)} кг·м², which does not change.</p>` },
    { q: `Что происходит с вращательной кинетической энергией фигуристки, когда она подтягивает грузы к оси?`,
      choices: ['stays the same, because L is conserved', 'decreases, because I decreases', 'increases, because the ice exerts a torque', 'increases, because her arms do work on the weights'], answer: 3,
      why: `<p>K = L²/2I. L is fixed and I falls, so K rises: here from ${f(M.skater(0.5).K)} J to ${f(M.skater(3.5).K)} J. The energy comes from her muscles pulling the weights inward against their tendency to fly out. The ice gives (almost) no torque, which is why L holds.</p>` },
  ],
  14: [
    { q: `Шар массой ${f(HT.m, 1)} кг, движущийся со скоростью ${f(HT.v0, 1)} м/с, ударяется о стержень (I = ⅓ML² = ${f(HT.I, 2)} кг·м²) на расстоянии ${f(HT.d, 1)} м от шарнира O и прилипает к нему. Какова угловая скорость стержня сразу после удара?`,
      choices: [`${p3(HT.m * HT.v0 * HT.d / HT.I)} рад/с`, `${p3(Q14.w)} рад/с`, `${p3(HT.m * HT.v0 * HT.d / (HT.M * HT.L ** 2 / 12 + HT.m * HT.d ** 2))} рад/с`, `${p3(HT.m * HT.v0 / (HT.m + HT.M) / HT.d)} рад/с`], answer: 1,
      why: `<p>The pin pushes, so linear momentum is not conserved; but the pin has no torque about O, so L about O is:</p>${eq(`mv<sub>0</sub>d = (I + md²)ω → ω = ${f(HT.m * HT.v0 * HT.d, 2)} / (${f(HT.I, 2)} + ${f(HT.m * HT.d ** 2, 2)}) = ${p3(Q14.w)} рад/с`)}<p>${p3(HT.m * HT.v0 * HT.d / HT.I)} forgets the ball now turns with the rod; ${p3(HT.m * HT.v0 / (HT.m + HT.M) / HT.d)} conserves linear momentum, which the pin spoils.</p>` },
    { q: `Шар массой ${f(HT.m, 1)} кг отпускают из состояния покоя в точке, расположенной на расстоянии ${f(HT.d, 1)} м сбоку от O в той же вертикальной плоскости. С какой скоростью изменяется его угловой момент относительно точки O во время падения?`,
      choices: [`${p3(Q14.dLdt / 2)} кг·м²/s²`, `${p3(2 * Q14.dLdt)} кг·м²/s²`, `${p3(Q14.dLdt)} кг·м²/s²`, '0: it moves in a straight line'], answer: 2,
      why: `<p>With O at the origin and the ball at (d, y), p = (0, −mgt). Then</p>${eq(`L = xp<sub>y</sub> − yp<sub>x</sub> = −d·mgt → |dL/dt| = mgd = ${f(HT.m, 1)} × ${f(G)} × ${f(HT.d, 1)} = ${p3(Q14.dLdt)} кг·м²/s²`)}<p>That is the torque of gravity about O, d·mg. A straight line keeps L constant only when no force acts: here the speed grows.</p>` },
  ],
};
