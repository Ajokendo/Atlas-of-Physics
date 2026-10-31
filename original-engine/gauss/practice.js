// gauss/practice.js — AP Physics C style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here; a quantitative item keeps its choices' numbers in `nums` (in the units shown),
// and checks.mjs recomputes the keyed one by another route.
import * as M from './model.js';

const p = (x, d) => x.toFixed(d);
const g = (x, n = 3) => x.toPrecision(n);
const K = M.K, E0 = M.EPS0, PI = Math.PI;

// ---- page 0: the page's square at 60°; a field that grows across a square ----
const P0 = { th: 60 };
P0.F = M.flux(P0.th);
P0.nums = [M.FLUX.E * M.FLUX.A * Math.sin(P0.th * PI / 180), P0.F, M.FLUX.max, M.FLUX.E * M.FLUX.side * Math.cos(P0.th * PI / 180)];   // sin · right · face on · side not area
const P0b = { b: 3.0e4, s: 0.20 };
P0b.F = P0b.b * P0b.s ** 3 / 2;
P0b.nums = [P0b.b * P0b.s ** 3, P0b.b * P0b.s ** 3 / 3, P0b.b * P0b.s ** 2 / 2, P0b.F];   // E at the far edge × A · ∫y² · lost an s · right
// ---- page 1: a cube around the page's charge; E = c r inside a sphere ----
const P1 = { q: M.POINT.q };
P1.nums = [P1.q / (6 * E0), P1.q / E0, K * P1.q, P1.q / (2 * E0)];
const P1b = { c: 5.0e4, R: 0.10 };
P1b.q = 4 * PI * E0 * P1b.c * P1b.R ** 3;
P1b.nums = [E0 * P1b.c * P1b.R ** 3, 4 * PI * E0 * P1b.c * P1b.R ** 2, 4 / 3 * PI * E0 * P1b.c * P1b.R ** 3, P1b.q].map(q => q * 1e9);   // no 4π · lost an R · volume, not area · right
// ---- page 2: the page's line, at 5 cm; potential difference out to 20 cm ----
const lam = M.LINE.lam;
const P2 = { r: 0.05 };
P2.nums = [K * lam / P2.r, M.lineE(P2.r), 2 * K * lam / P2.r ** 2, lam / (2 * E0 * P2.r)];   // lost 2 · right · 1/r² · lost π
const P2b = { r1: 0.05, r2: 0.20 };
P2b.dV = 2 * K * lam * Math.log(P2b.r2 / P2b.r1);
P2b.nums = [2 * K * lam * (1 / P2b.r1 - 1 / P2b.r2), M.lineE(P2b.r1) * (P2b.r2 - P2b.r1), P2b.dV, M.lineE(P2b.r2) * (P2b.r2 - P2b.r1)];
// ---- page 3: two sheets ±σ; a slab with ρ = ρ₀|x|/d ----
const sg = M.SHEET.sigma;
const P3 = { nums: [sg / E0, sg / (2 * E0), 0, 2 * sg / E0] };      // field between the sheets, per choice
const P3b = { rho0: 4.0e-7, d: 0.05, x: 0.02 };
P3b.E = P3b.rho0 * P3b.x ** 2 / (2 * E0 * P3b.d);
P3b.nums = [2 * P3b.E, P3b.E, P3b.rho0 * P3b.x / (2 * E0), P3b.E / 2];   // one cap · right · ρ₀ uniform · lost a 2
// ---- page 4: field energy outside the page's metal sphere ----
const { Q, R } = M.SPH;
const P4 = { U: K * Q * Q / (2 * R) };
P4.nums = [2 * P4.U, P4.U / 2, P4.U / 3, P4.U].map(u => u * 1e6);   // kQ²/R · only out to 2R · surface density × sphere's volume · right
// ---- page 5: the page's insulating sphere at R/2 ----
const P5 = { r: R / 2 };
P5.E = M.iSphere.E(P5.r);
P5.nums = [K * Q / P5.r ** 2, P5.E, 0, 3 * P5.E];
// ---- page 6: the page's insulating rod at R/2 ----
const P6 = { r: M.ROD.R / 2 };
P6.E = M.iRod.E(P6.r);
P6.nums = [0, 2 * K * M.ROD.lam / P6.r, P6.E, M.ROD.lam * P6.r / (2 * E0 * M.ROD.R ** 2)];   // metal · outside formula · right · lost π
// ---- page 7: the page's ρ = br sphere at R/2; ρ = br² ----
const P7 = { r: R / 2 };
P7.E = M.nSphere.E(P7.r);
P7.nums = [M.nSphere.rho(P7.r) * P7.r / (3 * E0), M.iSphere.E(P7.r), P7.E, 4 * P7.E];   // local ρ as if uniform · uniform sphere · right · lost the 4
const P7b = { nums: [1 / 8, 1 / 32, 1 / 16, 1 / 4] };
// ---- page 8: the induced charge on the cage's right half ----
const P8 = { q: 3 * E0 * M.CAGE.E0 * PI * M.CAGE.R ** 2 };
P8.nums = [0, P8.q, 2 * P8.q, P8.q / 3].map(q => q * 1e9);   // net zero · right · σ_max × area · lost the 3

const fr = x => ({ 0.125: '1/8', 0.03125: '1/32', 0.0625: '1/16', 0.25: '1/4' })[x];

export const PRACTICE = {
  0: [
    { q: `Квадрат со стороной ${p(M.FLUX.side * 100, 0)} см находится в однородном электрическом поле напряжённостью ${p(M.FLUX.E / 1000, 1)} кН/Кл. Вектор площади образует с E угол ${P0.th}°. Чему равен электрический поток через квадрат?`,
      choices: P0.nums.map(x => `${p(x, 1)} N·m²/C`), answer: 1, nums: P0.nums,
      why: `<div class="eq">Φ = <i>EA</i> cos θ = ${M.FLUX.E} × ${p(M.FLUX.A, 3)} m² × cos ${P0.th}° = ${p(P0.F, 1)} N·m²/C</div><p>θ is measured from the <b>area vector</b> (the normal), so it is cos, not sin; sin would be right only if θ were the angle to the surface itself.</p>` },
    { q: `Поле E = by x̂, где b = ${p(P0b.b / 1e4, 1)} × 10⁴ Н/(Кл·м), проходит через квадрат со стороной ${p(P0b.s * 100, 0)} см в плоскости yz, при 0 ≤ y ≤ ${p(P0b.s, 2)} м. Чему равен поток через квадрат, если нормаль направлена вдоль +x̂?`,
      choices: P0b.nums.map(x => `${g(x)} N·m²/C`), answer: 3, nums: P0b.nums,
      why: `<p><i>E</i> changes across the square, so cut it into strips of width d<i>y</i> and length <i>s</i>, each with flux <i>E</i>(<i>y</i>) <i>s</i> d<i>y</i>:</p><div class="eq">Φ = ∫<sub>0</sub><sup><i>s</i></sup> <i>by</i> · <i>s</i> d<i>y</i> = <i>bs</i>³/2 = ${g(P0b.F)} N·m²/C</div><p>Using the field at the far edge for the whole square gives twice this, ${g(P0b.nums[0])}.</p>` },
  ],
  1: [
    { q: `Заряд ${p(P1.q * 1e9, 1)} нКл расположен в центре куба. Чему равен электрический поток через одну грань куба?`,
      choices: P1.nums.map(x => `${p(x, 1)} N·m²/C`), answer: 0, nums: P1.nums,
      why: `<p>Gauss: the whole cube carries <i>q</i>/ε<sub>0</sub> = ${p(P1.nums[1], 0)} N·m²/C. By symmetry each of the six faces gets the same share:</p><div class="eq">Φ<sub>face</sub> = <i>q</i>/6ε<sub>0</sub> = ${p(P1.nums[0], 1)} N·m²/C</div><p><i>kq</i> = ${p(P1.nums[2], 2)} has units of N·m²/C too, but it is <i>q</i>/4πε<sub>0</sub>, not a flux through anything.</p>` },
    { q: `В некоторой области поле радиальное и задаётся выражением E = cr, где c = ${p(P1b.c / 1e4, 1)} × 10⁴ Н/(Кл·м). Какой заряд находится внутри сферы радиусом ${p(P1b.R * 100, 0)} см с центром в начале координат?`,
      choices: P1b.nums.map(x => `${g(x)} nC`), answer: 3, nums: P1b.nums,
      why: `<p>On the sphere <b>E</b> ∥ d<b>A</b> and <i>E</i> = <i>cR</i> everywhere, so</p><div class="eq">∮<b>E</b> · d<b>A</b> = <i>cR</i> · 4π<i>R</i>² = <i>q</i><sub>enc</sub>/ε<sub>0</sub> &nbsp;→&nbsp; <i>q</i><sub>enc</sub> = 4πε<sub>0</sub><i>cR</i>³ = ${g(P1b.q * 1e9)} nC</div><p>The surface is 4π<i>R</i>², not ⁴⁄₃π<i>R</i>³: the flux is an area integral.</p>` },
  ],
  2: [
    { q: `Линейный заряд на рисунке имеет плотность λ = ${p(lam * 1e9, 1)} нКл/м. Чему равна напряжённость поля на расстоянии ${p(P2.r * 100, 0)} см от него?`,
      choices: P2.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P2.nums,
      why: `<p>A coaxial cylinder: no flux through the caps, <i>E</i> · 2π<i>rL</i> = λ<i>L</i>/ε<sub>0</sub>, so</p><div class="eq"><i>E</i> = λ/2πε<sub>0</sub><i>r</i> = 2<i>k</i>λ/<i>r</i> = ${p(P2.nums[1], 0)} N/C</div><p>A line’s field falls as 1/<i>r</i>, not 1/<i>r</i>² (${p(P2.nums[2], 0)} N/C).</p>` },
    { q: `На сколько выше электрический потенциал на расстоянии ${p(P2b.r1 * 100, 0)} см от этой линии по сравнению с потенциалом на расстоянии ${p(P2b.r2 * 100, 0)} см?`,
      choices: P2b.nums.map(x => `${p(x, 1)} V`), answer: 2, nums: P2b.nums,
      why: `<div class="eq"><i>V</i>(<i>r</i><sub>1</sub>) − <i>V</i>(<i>r</i><sub>2</sub>) = ∫<sub><i>r</i><sub>1</sub></sub><sup><i>r</i><sub>2</sub></sup> (2<i>k</i>λ/<i>r</i>) d<i>r</i> = 2<i>k</i>λ ln(<i>r</i><sub>2</sub>/<i>r</i><sub>1</sub>) = ${p(2 * K * lam, 2)} × ln ${p(P2b.r2 / P2b.r1, 0)} = ${p(P2b.dV, 1)} V</div><p>1/<i>r</i> integrates to a logarithm. The point-charge habit, 1/<i>r</i><sub>1</sub> − 1/<i>r</i><sub>2</sub>, gives ${p(P2b.nums[0], 1)} V; <i>E</i> × distance with the near field, ${p(P2b.nums[1], 1)} V, ignores that <i>E</i> falls.</p>` },
  ],
  3: [
    { q: `Два больших параллельных непроводящих листа несут заряды +σ и −σ, где σ = ${p(sg * 1e9, 1)} нКл/м². Чему равна напряжённость электрического поля?`,
      choices: [`${p(P3.nums[0], 0)} N/C between them, 0 outside`, `${p(P3.nums[1], 0)} N/C between them and outside`, `0 between them, ${p(P3.nums[0], 0)} N/C outside`, `${p(P3.nums[3], 0)} N/C between them, 0 outside`], answer: 0, nums: P3.nums,
      why: `<p>Each sheet alone gives σ/2ε<sub>0</sub> = ${p(P3.nums[1], 0)} N/C on both sides, away from + and toward −. Between the sheets the two point the same way and add; outside they point opposite ways and cancel:</p><div class="eq"><i>E</i> = σ/2ε<sub>0</sub> + σ/2ε<sub>0</sub> = σ/ε<sub>0</sub> = ${p(P3.nums[0], 0)} N/C between</div>` },
    { q: `Толстая непроводящая плита занимает область −d ≤ x ≤ d, где d = ${p(P3b.d * 100, 0)} см, а плотность заряда ρ = ρ0|x|/d; ρ0 = ${p(P3b.rho0 * 1e7, 1)} × 10⁻⁷ Кл/м³. Чему равно поле при x = ${p(P3b.x * 100, 0)} см?`,
      choices: P3b.nums.map(x => `${g(x)} N/C`), answer: 1, nums: P3b.nums,
      why: `<p>Use a pillbox of cap area <i>A</i> from −<i>x</i> to <i>x</i>. By symmetry the field leaves through <b>both</b> caps:</p><div class="eq">2<i>EA</i> = (1/ε<sub>0</sub>) · 2<i>A</i>∫<sub>0</sub><sup><i>x</i></sup> ρ<sub>0</sub><i>x</i>′/<i>d</i> d<i>x</i>′ = <i>A</i>ρ<sub>0</sub><i>x</i>²/ε<sub>0</sub><i>d</i> &nbsp;→&nbsp; <i>E</i> = ρ<sub>0</sub><i>x</i>²/2ε<sub>0</sub><i>d</i> = ${g(P3b.E)} N/C</div><p>Counting only one cap doubles it (${g(P3b.nums[0])} N/C).</p>` },
  ],
  4: [
    { q: `Металлический шар с зарядом +Q находится в центре толстой концентрической металлической оболочки с суммарным зарядом −3Q. Какой заряд находится на внешней поверхности оболочки?`,
      choices: ['−3<i>Q</i>', '−<i>Q</i>', '+<i>Q</i>', '−2<i>Q</i>'], answer: 3,
      why: '<p>A Gaussian sphere inside the shell’s metal has <i>E</i> = 0 on it, so it encloses zero charge: the inner surface must hold −<i>Q</i> to cancel the sphere’s +<i>Q</i>. The rest of the shell’s −3<i>Q</i> goes to the outer surface: −3<i>Q</i> − (−<i>Q</i>) = −2<i>Q</i>.</p>' },
    { q: `Сколько энергии запасено в электрическом поле вне показанного металлического шара (Q = ${p(Q * 1e9, 1)} нКл, R = ${p(R * 100, 0)} см)? (Плотность энергии поля равна ε0E²/2.)`,
      choices: P4.nums.map(x => `${g(x)} μJ`), answer: 3, nums: P4.nums,
      why: `<p>Inside the metal <i>E</i> = 0. Outside, add shells of volume 4π<i>r</i>² d<i>r</i>:</p><div class="eq"><i>U</i> = ∫<sub><i>R</i></sub><sup>∞</sup> (ε<sub>0</sub>/2)(<i>kQ</i>/<i>r</i>²)² 4π<i>r</i>² d<i>r</i> = <i>kQ</i>²/2<i>R</i> = ${g(P4.U * 1e6)} μJ</div><p>Stopping at 2<i>R</i> gives only half (${g(P4.nums[1])} μJ): the field far out still holds energy. The surface energy density times the sphere’s volume (${g(P4.nums[2])} μJ) puts the energy in the wrong place: there is none inside the metal.</p>` },
  ],
  5: [
    { q: `Изолирующий шар (Q = ${p(Q * 1e9, 1)} нКл) равномерно заряжен по объёму и имеет радиус R = ${p(R * 100, 0)} см. Чему равна напряжённость поля на расстоянии ${p(P5.r * 100, 0)} см от его центра?`,
      choices: P5.nums.map(x => `${p(x, 0)} N/C`), answer: 1, nums: P5.nums,
      why: `<p>A Gaussian sphere of radius <i>r</i> holds <i>Q</i>(<i>r</i>/<i>R</i>)³ = <i>Q</i>/8:</p><div class="eq"><i>E</i> · 4π<i>r</i>² = <i>Q</i>(<i>r</i>/<i>R</i>)³/ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = <i>kQr</i>/<i>R</i>³ = ${p(P5.E, 0)} N/C</div><p>Zero is the <i>metal</i> sphere; <i>kQ</i>/<i>r</i>² counts charge that lies outside the Gaussian sphere.</p>` },
    { q: `Изолирующая сферическая оболочка имеет внутренний радиус a, внешний радиус b и равномерную объёмную плотность заряда ρ. Найдите E(r) во всех трёх областях пространства.`,
      solution: '<p>Spherical symmetry: on a Gaussian sphere of radius <i>r</i>, <i>E</i> · 4π<i>r</i>² = <i>q</i><sub>enc</sub>/ε<sub>0</sub>, with <i>q</i><sub>enc</sub> = ∫ ρ 4π<i>r</i>′² d<i>r</i>′ over the charged part inside.</p><div class="eq"><i>r</i> &lt; <i>a</i>: &nbsp;<i>q</i><sub>enc</sub> = 0, &nbsp;<i>E</i> = 0</div><div class="eq"><i>a</i> &lt; <i>r</i> &lt; <i>b</i>: &nbsp;<i>q</i><sub>enc</sub> = ∫<sub><i>a</i></sub><sup><i>r</i></sup> ρ4π<i>r</i>′² d<i>r</i>′ = ⁴⁄₃πρ(<i>r</i>³ − <i>a</i>³), &nbsp;<i>E</i> = ρ(<i>r</i>³ − <i>a</i>³)/3ε<sub>0</sub><i>r</i>²</div><div class="eq"><i>r</i> &gt; <i>b</i>: &nbsp;<i>E</i> = ρ(<i>b</i>³ − <i>a</i>³)/3ε<sub>0</sub><i>r</i>² = <i>kQ</i>/<i>r</i>²</div><p>Check: at <i>r</i> = <i>a</i> the middle form is 0 and at <i>r</i> = <i>b</i> it meets the outside form, so <i>E</i> is continuous. With <i>a</i> = 0 it becomes the solid sphere’s ρ<i>r</i>/3ε<sub>0</sub>.</p>' },
  ],
  6: [
    { q: `Изолирующий стержень на рисунке имеет равномерную линейную плотность заряда λ = ${p(M.ROD.lam * 1e9, 1)} нКл/м и радиус R = ${p(M.ROD.R * 100, 0)} см. Чему равна напряжённость поля на расстоянии ${p(P6.r * 100, 1)} см от его оси?`,
      choices: P6.nums.map(x => `${p(x, 0)} N/C`), answer: 2, nums: P6.nums,
      why: `<p>A coaxial cylinder of radius <i>r</i>, length <i>L</i> holds λ<i>L</i>(<i>r</i>/<i>R</i>)²:</p><div class="eq"><i>E</i> · 2π<i>rL</i> = λ<i>L</i><i>r</i>²/<i>R</i>²ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = 2<i>k</i>λ<i>r</i>/<i>R</i>² = ${p(P6.E, 0)} N/C</div><p>2<i>k</i>λ/<i>r</i> (${p(P6.nums[1], 0)} N/C) holds only outside, where all of λ is enclosed; 0 is the metal rod.</p>` },
    { q: `Длинный изолирующий цилиндр радиусом R имеет плотность заряда ρ = ρ0r/R. Чему равна напряжённость поля внутри цилиндра (r < R)?`,
      choices: ['ρ<sub>0</sub><i>r</i>/2ε<sub>0</sub>', 'ρ<sub>0</sub><i>r</i>²/3ε<sub>0</sub><i>R</i>', 'ρ<sub>0</sub><i>r</i>²/2ε<sub>0</sub><i>R</i>', 'ρ<sub>0</sub><i>r</i>³/3ε<sub>0</sub><i>R</i>²'], answer: 1,
      why: '<p>Add thin cylindrical shells, each of volume 2π<i>r</i>′<i>L</i> d<i>r</i>′:</p><div class="eq"><i>q</i><sub>enc</sub> = ∫<sub>0</sub><sup><i>r</i></sup> (ρ<sub>0</sub><i>r</i>′/<i>R</i>) 2π<i>r</i>′<i>L</i> d<i>r</i>′ = 2πρ<sub>0</sub><i>Lr</i>³/3<i>R</i></div><div class="eq"><i>E</i> · 2π<i>rL</i> = <i>q</i><sub>enc</sub>/ε<sub>0</sub> &nbsp;→&nbsp; <i>E</i> = ρ<sub>0</sub><i>r</i>²/3ε<sub>0</sub><i>R</i></div><p>ρ<sub>0</sub><i>r</i>²/2ε<sub>0</sub><i>R</i> puts the local ρ(<i>r</i>) into the uniform-rod result instead of integrating.</p>' },
  ],
  7: [
    { q: `Сфера на рисунке имеет плотность заряда ρ = br, где Q = ${p(Q * 1e9, 1)} нКл, R = ${p(R * 100, 0)} см и b = ${p(M.SPH.b * 1e6, 2)} мкКл/м⁴. Чему равна напряжённость поля на расстоянии ${p(P7.r * 100, 0)} см от центра?`,
      choices: P7.nums.map(x => `${p(x, 0)} N/C`), answer: 2, nums: P7.nums,
      why: `<div class="eq"><i>q</i><sub>enc</sub> = ∫<sub>0</sub><sup><i>r</i></sup> <i>br</i>′ 4π<i>r</i>′² d<i>r</i>′ = π<i>br</i>⁴, &nbsp;<i>E</i> = π<i>br</i>⁴/(4πε<sub>0</sub><i>r</i>²) = <i>br</i>²/4ε<sub>0</sub> = ${p(P7.E, 0)} N/C</div><p>Only <i>Q</i>/16 is inside <i>R</i>/2, since the charge crowds outward. The uniform sphere with the same <i>Q</i> gives ${p(P7.nums[1], 0)} N/C; plugging ρ(<i>r</i>) into ρ<i>r</i>/3ε<sub>0</sub> gives ${p(P7.nums[0], 0)} N/C.</p>` },
    { q: `Сфера радиусом R имеет плотность заряда ρ = br². Какая доля полного заряда находится внутри сферы радиусом r = R/2?`,
      choices: P7b.nums.map(fr), answer: 1, nums: P7b.nums,
      why: '<div class="eq"><i>q</i>(<i>r</i>) = ∫<sub>0</sub><sup><i>r</i></sup> <i>br</i>′² 4π<i>r</i>′² d<i>r</i>′ = ⁴⁄₅π<i>br</i>⁵ &nbsp;→&nbsp; <i>q</i>(<i>R</i>/2)/<i>q</i>(<i>R</i>) = (½)⁵ = 1/32</div><p>1/8 is the uniform sphere’s (½)³; 1/16 is ρ = <i>br</i>’s (½)⁴.</p>' },
  ],
  8: [
    { q: `Точечный заряд +q расположен не в центре полости нейтральной толстой металлической сферической оболочки. Чему равно электрическое поле снаружи оболочки?`,
      choices: ['zero', '<i>kq</i>/<i>r</i>², with <i>r</i> measured from the charge', '<i>kq</i>/<i>r</i>², with <i>r</i> measured from the shell’s centre', 'stronger on the side nearer the charge'], answer: 2,
      why: '<p>−<i>q</i> gathers on the inner surface, unevenly, so that the field in the metal is zero. That shields the outside from where the charge is. The +<i>q</i> left on the outer surface feels no field from inside, so it spreads evenly like charge on an isolated sphere. Outside, Gauss with a concentric sphere gives <i>kq</i>/<i>r</i>² from the <b>shell’s</b> centre.</p>' },
    { q: `Незаряженная сферическая оболочка радиусом R = ${p(M.CAGE.R * 100, 0)} см находится в поле напряжённостью ${p(M.CAGE.E0 / 1000, 1)} кН/Кл; поверхностная плотность индуцированного заряда σ = 3ε0E0 cos θ. Чему равен полный заряд на обращённой по направлению поля полусфере (cos θ > 0)?`,
      choices: P8.nums.map(x => `${x ? g(x) : '0'} nC`), answer: 1, nums: P8.nums,
      why: `<p>Rings of width <i>R</i> dθ have area 2π<i>R</i>² sin θ dθ:</p><div class="eq"><i>q</i> = ∫<sub>0</sub><sup>π/2</sup> 3ε<sub>0</sub><i>E</i><sub>0</sub> cos θ · 2π<i>R</i>² sin θ dθ = 3πε<sub>0</sub><i>E</i><sub>0</sub><i>R</i>² = ${g(P8.q * 1e9)} nC</div><p>The other half holds −${g(P8.q * 1e9)} nC, so the shell stays neutral; σ<sub>max</sub> × the half’s area (${g(P8.nums[2])} nC) ignores that σ falls to 0 at the rim.</p>` },
  ],
};
