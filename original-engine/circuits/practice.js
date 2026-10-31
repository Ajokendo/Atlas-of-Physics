// circuits/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const { CU, E_CH } = M;

// ---- page 0: drift speed in a round copper wire; charge from a changing current ----
const P0 = { I: 3.0, D: 2.0e-3 };
const vd = A => P0.I / (CU.n * E_CH * A);
P0.v = vd(Math.PI * (P0.D / 2) ** 2);
P0.nums = [P0.v, vd(Math.PI * P0.D ** 2), vd(P0.D ** 2), vd((P0.D / 2) ** 2)].map(x => x * 1e3);   // right · diameter as radius · A = D² · forgot π
const P0b = { a: 4.0, b: 1.0, T: 4.0 };                     // I = a t − b t² (A), 0 to T
P0b.q = P0b.a * P0b.T ** 2 / 2 - P0b.b * P0b.T ** 3 / 3;
P0b.Imax = P0b.a ** 2 / (4 * P0b.b);
P0b.nums = [P0b.Imax * P0b.T, P0b.Imax * P0b.T / 2, P0b.q, P0b.a * P0b.T ** 2 / 2];   // peak × time · triangle · right · dropped the t² term
// ---- page 1: the page's thin nichrome wire; a tapered one ----
const { rho } = M.RES, L1 = 2.0, rA = M.RES.dThin / 2, rB = M.RES.dThick / 2;
const P1 = { R: M.rThin(L1) };
P1.nums = [rho * L1 / (Math.PI * M.RES.dThin ** 2), rho * L1 / rA ** 2, P1.R, rho * L1 / M.RES.dThin ** 2];   // diameter as radius · forgot π · right · A = d²
const P1b = { R: rho * L1 / (Math.PI * rA * rB) };
P1b.nums = [rho * L1 / (Math.PI * ((rA + rB) / 2) ** 2), (M.rThin(L1) + M.rThick(L1)) / 2, M.rThin(L1), P1b.R];   // mean radius · mean of the ends · thin end only · right
// ---- page 2: a hollow carbon cylinder, current flowing radially ----
const P2 = { rho: 3.5e-5, a: 0.010, b: 0.020, L: 0.050 };
P2.R = P2.rho * Math.log(P2.b / P2.a) / (2 * Math.PI * P2.L);
P2.nums = [P2.rho * (P2.b - P2.a) / (2 * Math.PI * P2.a * P2.L), P2.R, P2.rho * (P2.b - P2.a) / (2 * Math.PI * P2.b * P2.L), P2.rho * P2.L / (Math.PI * (P2.b ** 2 - P2.a ** 2))].map(x => x * 1e5);
// inner area only · right · outer area only · current along the axis instead
// ---- page 3: two of the page's bulbs in series; a ramped voltage ----
const { E: VB, R: RB } = M.BULB;
const P3 = { P: VB ** 2 / (2 * RB) };
P3.nums = [2 * VB ** 2 / RB, VB ** 2 / RB, P3.P, VB ** 2 / (4 * RB)];   // parallel · one bulb · right · each bulb
const P3b = { T: 10 };
P3b.E = VB ** 2 / RB * P3b.T / 3;
P3b.nums = [VB ** 2 / RB * P3b.T / 2, P3b.E, VB ** 2 / RB * P3b.T, (VB / 2) ** 2 / RB * P3b.T];   // average P linear · right · full P · P at the average V
// ---- page 4: the page's cell on 4 Ω; what r is best ----
const { E: EC, r: rC } = M.CELL, RL4 = 4;
const P4 = { V: EC * RL4 / (RL4 + rC) };
P4.nums = [EC, EC * rC / (RL4 + rC), P4.V, EC / 2];                 // ideal · the Ir drop · right · half
// ---- page 5: strips side by side ----
const P5 = { R0: 12 };
P5.R = P5.R0 / 2;                                                    // σ averages 2σ₀ across the width
P5.nums = [P5.R0 * Math.log(3) / 2, P5.R0 / 3, P5.R, P5.R0];         // strips in series · edge at 3σ₀ · right · σ₀ throughout
// ---- page 6: the page's combination with R₃ broken; R₃ as a variable resistor ----
const CB = M.COMBO;
const P6 = { I: CB.E / (CB.R1 + CB.R245) };
P6.nums = [CB.E / CB.Req, P6.I, CB.E / CB.R1, CB.E / CB.R245];      // unchanged · right · R₁ only · the 8 Ω only
const P6b = { R: CB.R1 * CB.R245 / (CB.R1 + CB.R245) };
P6b.nums = [P6b.R, CB.R1, CB.R245, CB.R1 + CB.R245];                 // right · R₁ only · the branch only · in series
// ---- page 7: the page's network with the 6 V battery replaced by a wire ----
const K7 = M.KIRCH, R345 = 1 / (1 / K7.R5 + 1 / (K7.R3 + K7.R4));
const P7 = { I: K7.E1 / (K7.R1 + K7.R2 + R345) };
const I1now = M.edgeI(K7, M.solve(K7.edges, 'bl'), 'R1');
P7.nums = [I1now, P7.I, K7.E1 / (K7.R1 + K7.R2), K7.E1 / (K7.R1 + K7.R2 + K7.R3 + K7.R4)].map(x => x * 1e3);   // unchanged · right · R₅ a short · R₅ ignored
const P7b = { dI: 1 / 44, E2zero: -2.4 };                            // from the solution below; checked numerically
// ---- page 8: the page's RC circuit ----
const { E: ER, tau } = M.RC, V8 = 9.0;
const P8 = { t: -tau * Math.log(1 - V8 / ER) };
P8.nums = [tau * Math.log(ER / V8), P8.t, tau * V8 / ER, tau];   // ln upside down · right · linear · τ
const P8b = { f: 1 - Math.exp(-2) };
P8b.nums = [(1 - Math.exp(-1)) * 100, P8b.f * 100, Math.exp(-1) * 100, 50];   // used e^(−t/RC) for the energy · right · what's left of q · half

export const PRACTICE = {
  0: [
    { q: `Медный провод диаметром ${p(P0.D * 1e3, 1)} мм проводит ток ${p(P0.I, 1)} А (концентрация электронов <i>n</i> = 8,5 × 10<sup>28</sup> м<sup>−3</sup>). Чему равна дрейфовая скорость электронов?`,
      choices: P0.nums.map(x => `${p(x, 4)} мм/с`), answer: 0, nums: P0.nums,
      why: `<p>Площадь сечения вычисляем через <b>радиус</b>: <i>A</i> = π(${p(P0.D / 2 * 1e3, 1)} мм)<sup>2</sup> = ${p(Math.PI * (P0.D / 2) ** 2 * 1e6, 3)} мм². Тогда</p><div class="eq"><i>v</i><sub>d</sub> = <i>I</i>/<i>neA</i> = ${P0.I} / (8.5×10<sup>28</sup> × 1.60×10<sup>−19</sup> × ${p(Math.PI * (P0.D / 2) ** 2 * 1e6, 3)}×10<sup>−6</sup>) = ${p(P0.v * 1e3, 4)} мм/с</div><p>Если ошибочно принять диаметр за радиус, получится ${p(P0.nums[1], 4)} мм/с — скорость будет занижена в четыре раза.</p>` },
    { q: `Сила тока в проводе меняется по закону <i>I</i>(<i>t</i>) = ${p(P0b.a, 1)}<i>t</i> − ${p(P0b.b, 1)}<i>t</i><sup>2</sup> (А, время <i>t</i> — в секундах) от <i>t</i> = 0 до ${p(P0b.T, 1)} с. Какой заряд пройдёт через поперечное сечение провода?`,
      choices: P0b.nums.map(x => `${p(x, 1)} Кл`), answer: 2, nums: P0b.nums,
      why: `<div class="eq"><i>q</i> = ∫<i>I dt</i> = ∫<sub>0</sub><sup>${P0b.T}</sup> (${P0b.a}<i>t</i> − <i>t</i><sup>2</sup>) <i>dt</i> = ${p(P0b.a / 2, 0)}(${P0b.T})<sup>2</sup> − (${P0b.T})<sup>3</sup>/3 = ${p(P0b.a * P0b.T ** 2 / 2, 0)} − ${p(P0b.b * P0b.T ** 3 / 3, 2)} = ${p(P0b.q, 1)} Кл</div><p>Заряд равен площади под графиком <i>I</i>(<i>t</i>), параболой с максимумом ${p(P0b.Imax, 0)} А. Произведение максимального тока на время (${p(P0b.nums[0], 1)} Кл) завышает результат, а площадь треугольника (${p(P0b.nums[1], 1)} Кл) его занижает.</p>` },
  ],
  1: [
    { q: `Тонкий нихромовый провод из главы (ρ = 1,10 × 10<sup>−6</sup> Ом·м, <b>диаметр</b> ${p(M.RES.dThin * 1e3, 1)} мм) имеет длину ${p(L1, 1)} м. Чему равно его сопротивление?`,
      choices: P1.nums.map(x => `${p(x, 2)} Ом`), answer: 2, nums: P1.nums,
      why: `<div class="eq"><i>R</i> = ρ<i>L</i>/<i>A</i> = ρ<i>L</i>/π<i>r</i><sup>2</sup> = 1.10×10<sup>−6</sup> × ${L1} / (π × (${p(rA * 1e3, 2)}×10<sup>−3</sup>)<sup>2</sup>) = ${p(P1.R, 2)} Ом</div><p>Радиус вдвое меньше диаметра. Если подставить диаметр вместо радиуса, получится четверть правильного ответа: ${p(P1.nums[0], 2)} Ом.</p>` },
    { q: `Нихромовый стержень длиной ${p(L1, 1)} м имеет переменное сечение: радиус линейно увеличивается от ${p(rA * 1e3, 2)} мм на одном конце до ${p(rB * 1e3, 2)} мм на другом. Найдите сопротивление между концами.`,
      choices: P1b.nums.map(x => `${p(x, 2)} Ом`), answer: 3, nums: P1b.nums,
      why: `<p>Тонкие слои <i>dx</i> соединены последовательно; сопротивление каждого равно <i>dR</i> = ρ <i>dx</i>/π<i>r</i>(<i>x</i>)<sup>2</sup>, где <i>r</i> = <i>a</i> + (<i>b</i> − <i>a</i>)<i>x</i>/<i>L</i>, следовательно, <i>dx</i> = <i>L dr</i>/(<i>b</i> − <i>a</i>):</p><div class="eq"><i>R</i> = (ρ<i>L</i>/π(<i>b</i> − <i>a</i>)) ∫<sub><i>a</i></sub><sup><i>b</i></sup> <i>dr</i>/<i>r</i><sup>2</sup> = ρ<i>L</i>/π<i>ab</i> = ${p(P1b.R, 2)} Ом</div><p>Нельзя просто использовать средний радиус (${p(P1b.nums[0], 2)} Ом) или среднее сопротивление на концах (${p(P1b.nums[1], 2)} Ом): узкий конец влияет сильнее, но не определяет результат полностью.</p>` },
  ],
  2: [
    { q: 'В электрической цепи из главы (батарея 6 В, резистор 3 Ом, идеальные провода) чему равна разность потенциалов между концами провода, соединяющего положительную клемму батареи с резистором?',
      choices: ['6 В', '3 В', '2 В', '0 В'], answer: 3,
      why: '<p>У идеального провода <i>R</i> = 0, поэтому Δ<i>V</i> = <i>IR</i> = 0 независимо от силы тока. Все точки этого провода имеют потенциал положительной клеммы батареи; полное падение напряжения 6 В происходит на резисторе.</p>' },
    { q: `Через углеродную цилиндрическую оболочку (ρ = ${p(P2.rho * 1e5, 1)} × 10<sup>−5</sup> Ом·м; внутренний радиус ${p(P2.a * 100, 0)} см, внешний ${p(P2.b * 100, 0)} см, длина ${p(P2.L * 100, 0)} см) течёт ток <b>радиально</b> от внутренней поверхности к внешней. Найдите сопротивление оболочки.`,
      choices: P2.nums.map(x => `${p(x, 2)} × 10<sup>−5</sup> Ом`), answer: 1, nums: P2.nums,
      why: `<p>Тонкие цилиндрические слои соединены последовательно; каждый слой имеет толщину <i>dr</i> вдоль направления тока и площадь поперечного сечения 2π<i>rL</i>:</p><div class="eq"><i>R</i> = ∫<sub><i>a</i></sub><sup><i>b</i></sup> ρ <i>dr</i>/2π<i>rL</i> = (ρ/2π<i>L</i>) ln(<i>b</i>/<i>a</i>) = ${p(P2.R * 1e5, 2)} × 10<sup>−5</sup> Ом</div><p>Площадь сечения увеличивается с ростом <i>r</i>, поэтому ни расчёт по внутренней площади (${p(P2.nums[0], 2)}), ни по внешней (${p(P2.nums[2], 2)}) не даст правильного результата.</p>` },
  ],
  3: [
    { q: `Две лампы из главы (сопротивление каждой ${RB} Ом) соединены <b>последовательно</b> и подключены к батарее ${VB} В. Какова суммарная потребляемая мощность?`,
      choices: P3.nums.map(x => `${p(x, 1)} Вт`), answer: 2, nums: P3.nums,
      why: `<p>При последовательном соединении <i>R</i><sub>экв</sub> = ${2 * RB} Ом, поэтому</p><div class="eq"><i>P</i> = Δ<i>V</i><sup>2</sup>/<i>R</i><sub>eq</sub> = ${VB}<sup>2</sup>/${2 * RB} = ${p(P3.P, 1)} Вт</div><p>Это половина мощности одной лампы (${p(P3.nums[1], 1)} Вт): ток уменьшается вдвое, а каждая лампа получает четверть своей исходной мощности (${p(P3.nums[3], 1)} Вт). При параллельном соединении общая мощность составила бы ${p(P3.nums[0], 1)} Вт.</p>` },
    { q: `Напряжение на резисторе ${RB} Ом равномерно возрастает от 0 до ${VB} В за ${P3b.T} с. Сколько энергии за это время преобразуется в тепло?`,
      choices: P3b.nums.map(x => `${p(x, 1)} Дж`), answer: 1, nums: P3b.nums,
      why: `<p>Поскольку Δ<i>V</i> = (${VB}/${P3b.T})<i>t</i>, мощность <i>P</i> = Δ<i>V</i><sup>2</sup>/<i>R</i> растёт пропорционально <i>t</i><sup>2</sup>:</p><div class="eq"><i>E</i> = ∫<i>P dt</i> = ∫<sub>0</sub><sup><i>T</i></sup> (${VB}<i>t</i>/${P3b.T})<sup>2</sup>/${RB} <i>dt</i> = (${VB}<sup>2</sup>/${RB})·<i>T</i>/3 = ${p(P3b.E, 1)} Дж</div><p>Линейное усреднение мощности (${p(P3b.nums[0], 1)} Дж) или подстановка среднего напряжения (${p(P3b.nums[3], 1)} Дж) неверны, поскольку <i>P</i> зависит от Δ<i>V</i> квадратично.</p>` },
  ],
  4: [
    { q: `Батарея из главы (ℰ = ${EC} В, <i>r</i> = ${rC} Ом) питает лампу сопротивлением ${RL4} Ом. Чему равна разность потенциалов между клеммами батареи?`,
      choices: P4.nums.map(x => `${p(x, 1)} В`), answer: 2, nums: P4.nums,
      why: `<div class="eq"><i>I</i> = ℰ/(<i>R</i> + <i>r</i>) = ${EC}/${RL4 + rC} = ${p(EC / (RL4 + rC), 1)} А, &nbsp; Δ<i>V</i> = ℰ − <i>Ir</i> = ${EC} − ${p(EC / (RL4 + rC) * rC, 1)} = ${p(P4.V, 1)} В</div><p>ЭДС равна напряжению на клеммах только при отсутствии тока. Значение ${p(P4.nums[1], 1)} В — это падение напряжения <i>внутри</i> батареи.</p>` },
    { q: `Теперь сопротивление лампы фиксировано: <i>R</i> = ${RL4} Ом, а внутреннее сопротивление батареи <i>r</i> можно выбирать (ЭДС неизменна). При каком <i>r</i> лампа будет светить ярче всего?`,
      choices: [`<i>r</i> = ${2 * RL4} Ом`, `<i>r</i> = ${RL4} Ом, равно сопротивлению нагрузки`, `<i>r</i> = ${RL4 / 2} Ом`, '<i>r</i> = 0'], answer: 3,
      why: `<p><i>P</i> = ℰ<sup>2</sup><i>R</i>/(<i>R</i> + <i>r</i>)<sup>2</sup>; теперь переменной является <i>r</i>:</p><div class="eq"><i>dP</i>/<i>dr</i> = −2ℰ<sup>2</sup><i>R</i>/(<i>R</i> + <i>r</i>)<sup>3</sup> < 0</div><p>для любого <i>r</i>, поэтому мощность <i>P</i> максимальна при наименьшем внутреннем сопротивлении — нулевом. Условие <i>R</i> = <i>r</i> даёт максимум, когда меняют сопротивление <b>нагрузки</b> при неизменной батарее, а не наоборот.</p>` },
  ],
  5: [
    { q: 'К резисторам 2, 4 и 6 Ом из главы параллельно добавляют четвёртый резистор и подключают цепь к идеальной батарее 9 В. Что произойдёт: (i) с током в ветви 2 Ом и (ii) с током батареи?',
      choices: ['(i) increases; (ii) increases', '(i) stays the same; (ii) increases', '(i) decreases; (ii) increases', '(i) decreases; (ii) stays the same'], answer: 1,
      why: '<p>На каждой ветви по-прежнему полные 9 В, поэтому ток в ветви 2 Ом остаётся равным 9/2 = 4,5 А. Новая ветвь добавляет собственный ток, который также обеспечивает батарея: путей больше, <i>R</i><sub>экв</sub> меньше, общий ток больше. (При наличии внутреннего сопротивления напряжение на клеммах немного снизилось бы, а ток в прежней ветви слегка уменьшился.)</p>' },
    { q: `Стержень с однородной проводимостью σ<sub>0</sub> имел бы сопротивление ${P5.R0} Ом между концами. Но его проводимость линейно увеличивается <b>по ширине</b> от σ<sub>0</sub> на одном краю до 3σ<sub>0</sub> на другом. Найдите сопротивление между концами.`,
      choices: P5.nums.map(x => `${p(x, 2)} Ом`), answer: 2, nums: P5.nums,
      why: `<p>Продольные полосы шириной <i>dy</i> соединяют одни и те же концы стержня: они включены <b>параллельно</b>, поэтому складываются их проводимости:</p><div class="eq">1/<i>R</i> = ∫<sub>0</sub><sup><i>w</i></sup> σ(<i>y</i>)<i>t dy</i>/<i>L</i> = (σ<sub>0</sub><i>wt</i>/<i>L</i>)·∫<sub>0</sub><sup>1</sup>(1 + 2<i>u</i>) <i>du</i> = 2/<i>R</i><sub>0</sub></div><p><i>R</i> = ${P5.R0}/2 = ${p(P5.R, 2)} Ом. Если ошибочно считать полосы соединёнными последовательно, получится (ln 3/2)<i>R</i><sub>0</sub> = ${p(P5.nums[0], 2)} Ом.</p>` },
  ],
  6: [
    { q: `В смешанной цепи из главы (9 В; R<sub>1</sub> = 2 Ом, R<sub>3</sub> = 2 Ом, R<sub>2</sub> + R<sub>4</sub> + R<sub>5</sub> = ${CB.R245} Ом) резистор R<sub>3</sub> перегорает и размыкает ветвь. Чему станет равен ток через R<sub>1</sub>?`,
      choices: P6.nums.map(x => `${p(x, 2)} А`), answer: 1, nums: P6.nums,
      why: `<p>После размыкания R<sub>3</sub> резистор R<sub>1</sub> и участок ${CB.R245} Ом соединены последовательно:</p><div class="eq"><i>I</i> = 9 V / (2 + ${CB.R245}) Ω = ${p(P6.I, 2)} А</div><p>Это меньше прежних ${p(P6.nums[0], 2)} А: удаление параллельной ветви <i>увеличивает</i> эквивалентное сопротивление <i>R</i><sub>экв</sub>.</p>` },
    { q: 'Резистор R<sub>3</sub> заменяют переменным резистором <i>x</i>, остальные элементы не меняются. При каком значении <i>x</i> мощность на нём максимальна?',
      choices: P6b.nums.map(x => `${p(x, 1)} Ом`), answer: 0, nums: P6b.nums,
      why: `<p>Если смотреть со стороны <i>x</i>, остальная цепь представляет собой R<sub>1</sub> с батареей, параллельно которым включён участок ${CB.R245} Ом. Напряжение холостого хода равно ℰ<sub>th</sub> = 9 × ${CB.R245}/${CB.R1 + CB.R245} = ${p(9 * CB.R245 / (CB.R1 + CB.R245), 1)} В, а эквивалентное сопротивление <i>R</i><sub>th</sub> = 2 × ${CB.R245}/(2 + ${CB.R245}) = ${p(P6b.R, 1)} Ом. Тогда</p><div class="eq"><i>P</i>(<i>x</i>) = ℰ<sub>th</sub><sup>2</sup><i>x</i>/(<i>R</i><sub>th</sub> + <i>x</i>)<sup>2</sup>, &nbsp; <i>dP</i>/<i>dx</i> = 0 → <i>x</i> = <i>R</i><sub>th</sub> = ${p(P6b.R, 1)} Ом</div><p>Если взять только R<sub>1</sub> (2 Ом), будет проигнорировано, что участок ${CB.R245} Ом также подключён параллельно <i>x</i>.</p>` },
  ],
  7: [
    { q: `В электрической цепи из главы батарею ${K7.E2} В заменяют обычным проводом. Чему станет равен ток <i>I</i><sub>1</sub> через батарею ${K7.E1} В?`,
      choices: P7.nums.map(x => `${p(x, 0)} мА`), answer: 1, nums: P7.nums,
      why: `<p>После удаления одной батареи цепь упрощается: R<sub>3</sub> + R<sub>4</sub> = ${K7.R3 + K7.R4} Ом соединены параллельно с R<sub>5</sub> = ${K7.R5} Ом, что даёт ${p(R345, 3)} Ом. Этот участок соединён последовательно с R<sub>1</sub> + R<sub>2</sub> = ${K7.R1 + K7.R2} Ом:</p><div class="eq"><i>I</i><sub>1</sub> = ${K7.E1} В / ${p(K7.R1 + K7.R2 + R345, 3)} Ом = ${p(P7.I * 1e3, 0)} мА</div><p>Ток уменьшился с ${p(I1now * 1e3, 0)} мА. По принципу суперпозиции батарея 6 В (положительный вывод снизу) ранее добавляла ${p((I1now - P7.I) * 1e3, 0)} мА к <i>I</i><sub>1</sub>. Если считать R<sub>5</sub> коротким замыканием, получится ${p(P7.nums[2], 0)} мА; если полностью исключить его — ${p(P7.nums[3], 0)} мА.</p>` },
    { q: `Развёрнутый ответ. В цепи из главы считайте ЭДС второй батареи ℰ<sub>2</sub> (положительный вывод внизу, как на рисунке) переменной. Используя два контурных уравнения и <i>I</i><sub>1</sub> = <i>I</i><sub>2</sub> + <i>I</i><sub>3</sub>, найдите <i>dI</i><sub>3</sub>/<i>d</i>ℰ<sub>2</sub> и значение ℰ<sub>2</sub>, при котором <i>I</i><sub>3</sub> = 0.`,
      solution: `<p>Контур 1: 20<i>I</i><sub>1</sub> + 5<i>I</i><sub>2</sub> = 12. Контур 2: 40<i>I</i><sub>3</sub> − 5<i>I</i><sub>2</sub> = ℰ<sub>2</sub>. Подставим <i>I</i><sub>1</sub> = <i>I</i><sub>2</sub> + <i>I</i><sub>3</sub> в первое уравнение:</p><div class="eq">25<i>I</i><sub>2</sub> + 20<i>I</i><sub>3</sub> = 12 &nbsp;→&nbsp; <i>I</i><sub>2</sub> = (12 − 20<i>I</i><sub>3</sub>)/25</div><div class="eq">40<i>I</i><sub>3</sub> − (12 − 20<i>I</i><sub>3</sub>)/5 = ℰ<sub>2</sub> &nbsp;→&nbsp; <i>I</i><sub>3</sub> = (ℰ<sub>2</sub> + 2.4)/44</div><p>Следовательно, <i>dI</i><sub>3</sub>/<i>d</i>ℰ<sub>2</sub> = 1/44 А/В = ${p(P7b.dI * 1e3, 1)} мА на вольт. Цепь линейна, поэтому это верно при любом ℰ<sub>2</sub>. При ℰ<sub>2</sub> = 6 В получаем <i>I</i><sub>3</sub> = 8,4/44 = ${p(8.4 / 44, 3)} А — значение из главы. Ток <i>I</i><sub>3</sub> станет нулевым при ℰ<sub>2</sub> = ${p(P7b.E2zero, 1)} В: это батарея 2,4 В с положительным выводом <b>сверху</b>, которая точно компенсирует действие батареи 12 В на R<sub>5</sub>.</p>`, val: P7b },
  ],
  8: [
    { q: `В RC-цепи из главы (ℰ = ${ER} В, τ = <i>RC</i> = ${p(tau, 1)} с) изначально разряженный конденсатор заряжается. Через какое время напряжение на нём достигнет ${p(V8, 1)} В?`,
      choices: P8.nums.map(x => `${p(x, 2)} с`), answer: 1, nums: P8.nums,
      why: `<div class="eq">Δ<i>V</i><sub>C</sub> = ℰ(1 − e<sup>−<i>t</i>/τ</sup>) &nbsp;→&nbsp; <i>t</i> = −τ ln(1 − Δ<i>V</i><sub>C</sub>/ℰ) = ${p(tau, 1)} с × ln ${p(ER / (ER - V8), 0)} = ${p(P8.t, 2)} с</div><p>Зависимость не линейна (${p(P8.nums[2], 2)} с): по мере зарядки скорость увеличения напряжения уменьшается. За одно τ напряжение достигает лишь 63 % от ${ER} В.</p>` },
    { q: 'Теперь полностью заряженный конденсатор разряжается через <i>R</i>. Какая доля его запасённой энергии превратится в тепло в резисторе за одну постоянную времени?',
      choices: P8b.nums.map(x => `${p(x, 1)} %`), answer: 1, nums: P8b.nums,
      why: `<p>Ток равен <i>I</i><sub>0</sub>e<sup>−<i>t</i>/τ</sup>, поэтому мощность <i>I</i><sup>2</sup><i>R</i> убывает вдвое быстрее по показателю экспоненты:</p><div class="eq"><i>E</i> = ∫<sub>0</sub><sup>τ</sup> <i>I</i><sub>0</sub><sup>2</sup><i>R</i> e<sup>−2<i>t</i>/τ</sup> <i>dt</i> = ½<i>I</i><sub>0</sub><sup>2</sup><i>R</i>τ(1 − e<sup>−2</sup>) = <i>U</i><sub>0</sub>(1 − e<sup>−2</sup>)</div><p>(½<i>I</i><sub>0</sub><sup>2</sup><i>R</i>τ = <i>Q</i><sup>2</sup>/2<i>C</i> = <i>U</i><sub>0</sub>.) Получаем ${p(P8b.f * 100, 1)} %. Заряд уменьшился до 36,8 %, но энергия пропорциональна <i>q</i><sup>2</sup>: остаётся лишь e<sup>−2</sup> = ${p(Math.exp(-2) * 100, 1)} %.</p>` },
  ],
};
