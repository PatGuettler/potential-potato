/** 20 mathematics lessons: arithmetic through intro calculus */
export const mathematicsLessons = [
  {
    id: "math001",
    title: "Number Systems and Order of Operations",
    summary: "Whole numbers, integers, rationals, and PEMDAS for correct calculation.",
    difficulty: "Easy",
    estimatedMinutes: 25,
    tags: "arithmetic|pemdas|numbers",
    content: `**Number sets (expanding):**
- **Natural numbers** ℕ: 1, 2, 3, … (sometimes include 0)
- **Integers** ℤ: …, −2, −1, 0, 1, 2, …
- **Rational numbers** ℚ: fractions a/b where b ≠ 0
- **Real numbers** ℝ: include irrationals like √2, π

**Order of operations (PEMDAS / BODMAS):**
1. **P**arentheses (and other grouping)
2. **E**xponents
3. **M**ultiplication and **D**ivision left to right
4. **A**ddition and **S**ubtraction left to right

Example: 3 + 4 × 2 = 3 + 8 = 11 (not 14)

**Absolute value** |x| is distance from zero on the number line.`,
    answerGuide: `Division by zero undefined. Fractions require common denominator for addition. Negative times negative is positive.`,
    answer: `Students should name ℕ, ℤ, ℚ examples, apply PEMDAS to 2 + 3 × (4 − 1), and define absolute value.`,
  },
  {
    id: "math002",
    title: "Fractions, Decimals, and Percents",
    summary: "Convert between forms and solve practical percent problems.",
    difficulty: "Easy",
    estimatedMinutes: 30,
    tags: "fractions|decimals|percent",
    content: `**Fractions** represent parts of a whole: a/b (b ≠ 0).

**Equivalent fractions:** multiply/divide numerator and denominator by same nonzero number.

**Addition/subtraction:** common denominator first.

**Multiplication:** (a/b)(c/d) = ac/bd  
**Division:** multiply by reciprocal (a/b) ÷ (c/d) = (a/b)(d/c)

**Decimals** are base-10 fractions (0.25 = 25/100 = 1/4).

**Percent** means per hundred: 35% = 35/100 = 0.35

**Percent problems:**
- Part = percent × whole
- Percent change = (new − old) / old × 100%`,
    answerGuide: `Simplify fractions. Repeating decimals 0.333… = 1/3. Tax/tip word problems. Percent increase vs decrease sign.`,
    answer: `Students should add 1/3 + 1/6, convert 3/8 to decimal and percent, and solve: 20% of 150 is what number?`,
  },
  {
    id: "math003",
    title: "Algebraic Expressions and Equations",
    summary: "Variables, like terms, simplifying, and solving one-step equations.",
    difficulty: "Easy",
    estimatedMinutes: 30,
    tags: "algebra|expressions|equations",
    content: `**Variables** (x, y) stand for unknown or changing quantities.

**Expression** — no equals sign (3x + 2)  
**Equation** — states equality (3x + 2 = 11)

**Like terms** have same variable part; combine: 2x + 5x = 7x; constants separate from x terms.

**Distributive property:** a(b + c) = ab + ac

**Solving linear equations:** isolate variable using inverse operations
- Example: x + 5 = 12 → x = 7
- 3x = 15 → x = 5
- 2x + 1 = 9 → 2x = 8 → x = 4

**Check solutions** by substitution.`,
    answerGuide: `Balanced equation metaphor (scale). No dividing by zero. Translating words: "five more than x" → x + 5.`,
    answer: `Students should simplify 4x + 3 − x + 7, solve 5x − 2 = 18, and verify by substitution.`,
  },
  {
    id: "math004",
    title: "Ratios and Proportions",
    summary: "Compare quantities, solve proportions, and apply to maps and recipes.",
    difficulty: "Easy",
    estimatedMinutes: 25,
    tags: "ratios|proportions|applications",
    content: `**Ratio** compares two quantities a:b (order matters).

**Equivalent ratios** scale both parts (3:4 = 6:8).

**Rate** is ratio with different units (60 miles / 2 hours = 30 mi/h).

**Proportion** states two ratios equal: a/b = c/d  
Cross-multiply: ad = bc (when b,d ≠ 0)

**Scale drawings:** map scale 1 cm : 5 km means multiply map distance by 5 to get real distance.

**Unit rate** — per one unit (price per item).

**Direct proportion:** quantities rise together (more hours → more pay at fixed wage).`,
    answerGuide: `Set up consistent units. Inverse proportion preview (speed vs time for fixed distance). 3:4 ≠ 4:3.`,
    answer: `Students should simplify ratio 12:8, solve 3/5 = x/20 for x, and solve a map scale word problem.`,
  },
  {
    id: "math005",
    title: "Graphing on the Coordinate Plane",
    summary: "Plot points, read coordinates, and interpret basic graphs.",
    difficulty: "Easy",
    estimatedMinutes: 25,
    tags: "graphing|coordinates|plane",
    content: `The **Cartesian plane** has horizontal **x-axis** and vertical **y-axis** meeting at **origin (0,0)**.

**Ordered pair (x, y)** — x horizontal, y vertical ("run, then rise").

**Quadrants** I (+,+), II (−,+), III (−,−), IV (+,−)

**Table → graph:** Choose x values, compute y from rule, plot points, connect if linear pattern.

**Intercepts:** x-intercept where y=0; y-intercept where x=0.

**Real graphs:** distance vs time, temperature vs day — identify trends (increasing, decreasing, constant).`,
    answerGuide: `Common error: swapping x and y. Discrete data vs continuous curves. Label axes with units.`,
    answer: `Students should plot (3, −2), name quadrant, graph y = 2x + 1 from a small table, and read intercepts.`,
  },
  {
    id: "math006",
    title: "Basic Probability",
    summary: "Experimental vs theoretical probability and compound events introduction.",
    difficulty: "Easy",
    estimatedMinutes: 30,
    tags: "probability|statistics|chance",
    content: `**Probability** measures likelihood from 0 (impossible) to 1 (certain).

**Theoretical (equally likely outcomes):** P(event) = favorable outcomes / total outcomes  
Fair die: P(rolling 4) = 1/6

**Experimental:** relative frequency from trials (more trials → closer to theoretical often)

**Complement:** P(not A) = 1 − P(A)

**Independent events:** outcomes don't affect each other — P(A and B) = P(A)×P(B) for independent

**Sample space** lists all outcomes (tree diagrams help).

**Mutually exclusive** events cannot both happen — P(A or B) = P(A)+P(B) if mutually exclusive.`,
    answerGuide: `Gambler's fallacy false. Small samples vary more. Cards without replacement is dependent (preview).`,
    answer: `Students should compute P(even) on die, P(not A) given P(A)=0.3, and find P(two heads) for two fair coin flips.`,
  },
  {
    id: "math007",
    title: "Linear Equations in One Variable",
    summary: "Solve multi-step equations and model word problems.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "algebra|linear|equations",
    content: `**Linear equation in one variable:** ax + b = c form after simplification.

**Steps:**
1. Simplify both sides (distribute, combine like terms)
2. Move variable terms one side, constants other (add/subtract)
3. Divide by coefficient of variable

Example: 3(2x − 1) = 2x + 7 → 6x − 3 = 2x + 7 → 4x = 10 → x = 2.5

**Word problems:** Define variable, write equation from story (consecutive integers, perimeter, age problems).

**Special cases:**
- **Identity** — infinitely many solutions (both sides same)
- **Contradiction** — no solution (e.g., x = x + 1 simplified)`,
    answerGuide: `Check extraneous from multiplying by variable if introduced later. Units in word problems. Inequality version similar.`,
    answer: `Students should solve 4x − 7 = 2x + 5 and a perimeter problem: rectangle width x, length x+3, perimeter 42, find x.`,
  },
  {
    id: "math008",
    title: "Geometry: Angles and Triangles",
    summary: "Angle types, triangle sum, Pythagorean theorem, and area formulas.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "geometry|triangles|pythagorean",
    content: `**Angles:** acute (<90°), right (90°), obtuse (90–180°), straight (180°). Complementary sum 90°; supplementary sum 180°.

**Triangle angle sum:** interior angles sum to **180°**.

**Types:** equilateral (3 equal sides, 60° each), isosceles (2 equal sides), scalene.

**Pythagorean theorem (right triangle):** a² + b² = c² where c is hypotenuse.  
Example: legs 3 and 4 → c = 5.

**Areas:**
- Triangle: A = ½bh
- Rectangle: A = lw
- Circle: A = πr²; circumference C = 2πr

**π ≈ 3.14159** — irrational constant.`,
    answerGuide: `Hypotenuse only opposite right angle. Units squared for area. 3-4-5 triple generalizes 3k-4k-5k.`,
    answer: `Students should find missing angle in triangle with 65° and 48°, use Pythagorean theorem for legs 5 and 12, and compute area of triangle base 10 height 6.`,
  },
  {
    id: "math009",
    title: "Slope and Linear Functions",
    summary: "Rate of change, slope-intercept form, and graph lines.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "algebra|slope|linear-functions",
    content: `A **linear function** graphs as a straight line: **y = mx + b**

**m = slope** = rise/run = (y₂−y₁)/(x₂−x₁) — rate of change

**b = y-intercept** — value when x = 0

**Positive slope** rises left to right; **negative** falls; **zero** horizontal; **undefined** vertical line x = k

**Parallel lines** — equal slopes  
**Perpendicular lines** — slopes multiply to −1 (m₁·m₂ = −1)

**Point-slope form:** y − y₁ = m(x − x₁)

**Modeling:** Fixed cost + per-unit cost → C = mx + b`,
    answerGuide: `Vertical line not a function in x→y form. Slope from table of differences. Interpolate along line between points.`,
    answer: `Students should find slope through (1,2) and (4,8), write equation with m=−3, b=5, and interpret slope as dollars per item in a cost model.`,
  },
  {
    id: "math010",
    title: "Systems of Linear Equations",
    summary: "Solve by graphing, substitution, and elimination.",
    difficulty: "Medium",
    estimatedMinutes: 40,
    tags: "algebra|systems|elimination",
    content: `A **system** is two (or more) equations with same variables.

**Solution** is ordered pair satisfying **both** — geometrically intersection of lines.

**Graphing:** Plot both lines; estimate intersection (may be approximate).

**Substitution:** Solve one equation for a variable, plug into other.

**Elimination:** Add/subtract equations to cancel a variable (multiply first if needed).

Example:
x + y = 10
x − y = 2  
Add → 2x = 12 → x = 6, y = 4

**Cases:** one solution (transversing lines), none (parallel), infinitely many (same line).`,
    answerGuide: `Check solution in both originals. Word problems: two unknowns need two independent equations. Matrix methods later.`,
    answer: `Students should solve {x+y=7, x−y=1} by elimination and interpret solution as intersection point.`,
  },
  {
    id: "math011",
    title: "Exponents and Scientific Notation",
    summary: "Laws of exponents and express very large/small numbers.",
    difficulty: "Medium",
    estimatedMinutes: 30,
    tags: "exponents|scientific-notation|powers",
    content: `**Exponent rules** (a,m,n positive integers; extend to rationals later):
- a^m · a^n = a^(m+n)
- (a^m)^n = a^(mn)
- (ab)^n = a^n b^n
- a^0 = 1 (a ≠ 0)
- a^(−n) = 1/a^n

**Scientific notation:** a × 10^n where 1 ≤ |a| < 10  
Example: 300,000,000 = 3 × 10^8  
0.00042 = 4.2 × 10^(−4)

**Operations:** multiply coefficients, add exponents on 10; divide subtract exponents.

**Applications:** Astronomy distances, microscopic sizes, chemistry (Avogadro scale).`,
    answerGuide: `Negative exponent not negative base. 10^0 = 1. Engineering notation uses exponents multiples of 3. Significant figures with sci notation.`,
    answer: `Students should simplify x³·x⁴, write 0.00056 in scientific notation, and multiply (2×10³)(3×10⁵).`,
  },
  {
    id: "math012",
    title: "Statistics: Center and Spread",
    summary: "Mean, median, mode, range, and interpret data sets fairly.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "statistics|mean|median",
    content: `**Measures of center:**
- **Mean** — sum / count (sensitive to outliers)
- **Median** — middle value when sorted (robust)
- **Mode** — most frequent value

**Spread:**
- **Range** = max − min
- **Interquartile range (IQR)** = Q3 − Q1 (middle 50% spread)
- **Standard deviation** (intro) — typical distance from mean

**Five-number summary:** min, Q1, median, Q3, max → **box plot**

**Misleading graphs:** truncated y-axis exaggerates changes; always read scales.

**Sampling:** Random sample represents population; bias if sample flawed.`,
    answerGuide: `Mean of grouped data uses midpoints. Outlier definition (1.5×IQR rule) optional. Categorical data uses mode not mean.`,
    answer: `Students should compute mean and median of a small data set, identify outlier effect on mean, and read a box plot quartiles.`,
  },
  {
    id: "math013",
    title: "Polynomials and Factoring",
    summary: "Add, multiply polynomials, and factor quadratics by grouping/GCF.",
    difficulty: "Medium",
    estimatedMinutes: 40,
    tags: "polynomials|factoring|algebra",
    content: `**Polynomial** — sum of terms a_n x^n + … + a_1 x + a_0

**Degree** — highest exponent with nonzero coefficient

**Operations:**
- Add/subtract like terms
- Multiply using distributive property (FOIL for binomials)

**Factoring reverses multiplication:**
- **GCF** first: 6x² + 9x = 3x(2x + 3)
- **Trinomial x² + bx + c** find numbers multiplying to c and adding to b
- **Difference of squares:** a² − b² = (a+b)(a−b)

**Zero product property:** If AB = 0, then A=0 or B=0 — solves factored equations.`,
    answerGuide: `Prime polynomials over integers. Complete square preview for quadratics. Sign chart for factored inequalities later.`,
    answer: `Students should multiply (x+3)(x−2), factor x²+5x+6, and solve x²+5x+6=0 by factoring.`,
  },
  {
    id: "math014",
    title: "Quadratic Functions and Equations",
    summary: "Parabolas, vertex, factoring, and quadratic formula.",
    difficulty: "Hard",
    estimatedMinutes: 45,
    tags: "quadratics|parabolas|formula",
    content: `**Standard form:** y = ax² + bx + c (a ≠ 0) — graph is **parabola**

**Vertex form:** y = a(x − h)² + k with vertex (h, k)  
**Axis of symmetry:** x = −b/(2a)

**Direction:** a > 0 opens up (minimum); a < 0 opens down (maximum)

**Solving ax² + bx + c = 0:**
1. Factoring if easy
2. **Quadratic formula:** x = (−b ± √(b²−4ac)) / (2a)
**Discriminant** D = b²−4ac: D>0 two real roots; D=0 one; D<0 no real roots

**Projectile motion** height often quadratic in time (neglecting air resistance).`,
    answerGuide: `Complete the square derives vertex form. Imaginary roots if D<0 (intro mention). Applications: max area with fixed perimeter.`,
    answer: `Students should find vertex of y = x² − 4x + 3, solve x² − 4x + 3 = 0 by factoring, and use quadratic formula for x² + 2x − 5 = 0.`,
  },
  {
    id: "math015",
    title: "Introduction to Trigonometry",
    summary: "Sine, cosine, tangent in right triangles and unit circle preview.",
    difficulty: "Hard",
    estimatedMinutes: 40,
    tags: "trigonometry|right-triangle|sohcahtoa",
    content: `For **right triangles** relative to acute angle θ:

**SOHCAHTOA:**
- sin θ = opposite/hypotenuse
- cos θ = adjacent/hypotenuse
- tan θ = opposite/adjacent

**Pythagorean identity:** sin²θ + cos²θ = 1

**Common angles (exact):**
- 30°: sin=1/2, cos=√3/2
- 45°: sin=cos=√2/2
- 60°: sin=√3/2, cos=1/2

**Inverse trig** finds angle from ratio.

**Applications:** heights, distances, forces at angles.

**Unit circle (preview):** angles on circle radius 1; x=cos θ, y=sin θ.`,
    answerGuide: `Calculator in degree vs radian mode. Angles of elevation/depression word problems. Only right triangle definitions at this level.`,
    answer: `Students should find sin and cos of 30°, solve right triangle given hypotenuse 10 and angle 40° opposite side, and state SOHCAHTOA meanings.`,
  },
  {
    id: "math016",
    title: "Radicals and Rational Exponents",
    summary: "Simplify square roots, rationalize denominators, and connect to fractional exponents.",
    difficulty: "Hard",
    estimatedMinutes: 35,
    tags: "radicals|roots|exponents",
    content: `**Square root** √a is nonnegative number whose square is a (a ≥ 0 for real).

**Properties (√a real):**
- √(ab) = √a · √b
- √(a/b) = √a / √b (b>0)

**Simplify:** √50 = √(25·2) = 5√2

**Rational exponents:** a^(1/n) = ⁿ√a  
a^(m/n) = (ⁿ√a)^m

**Rationalize denominator:** 3/√2 = 3√2/2 multiply top and bottom by √2

**Extraneous solutions:** Squaring both sides when solving √(x+5)=x−1 can introduce false roots — **check** in original.`,
    answerGuide: `Even roots of negatives non-real. Cube root of −8 is −2. Domain restrictions on radical equations.`,
    answer: `Students should simplify √72, write 8^(2/3) as radical, rationalize 5/√3, and solve √(x)=3 checking solution.`,
  },
  {
    id: "math017",
    title: "Combinatorics and Counting",
    summary: "Fundamental counting principle, permutations, and combinations.",
    difficulty: "Hard",
    estimatedMinutes: 40,
    tags: "combinatorics|permutations|combinations",
    content: `**Fundamental counting principle:** If one choice has m options and another n options independent, together m×n ways.

**Factorial n!** = n×(n−1)×…×1; 0! = 1

**Permutation** — order matters: arrange r from n: P(n,r) = n!/(n−r)!  
Example: 3-letter codes from ABCDE without repeat: 5×4×3 = 60

**Combination** — order doesn't matter: C(n,r) = n! / (r!(n−r)!)  
Example: choose 3 students from 10: C(10,3) = 120

**With/without replacement** changes counts.

**Probability link:** favorable outcomes / total outcomes when equally likely.`,
    answerGuide: `Distinguish permutation vs combination keywords (arrange vs choose). Overcounting in Venn problems. Binomial coefficient notation C(n,r).`,
    answer: `Students should apply counting principle (4 shirts × 3 pants), compute C(5,2), and explain when order matters using one example each.`,
  },
  {
    id: "math018",
    title: "Exponential and Logarithmic Functions",
    summary: "Growth/decay models and inverse relationship of exp and log.",
    difficulty: "Hard",
    estimatedMinutes: 45,
    tags: "exponential|logarithms|growth",
    content: `**Exponential function:** f(x) = a·b^x (b>0, b≠1)

**Growth** b>1; **decay** 0<b<1

**Compound interest:** A = P(1 + r/n)^(nt)

**Logarithm** is inverse of exponential: if b^y = x then log_b(x) = y

**Common log** base 10; **natural log ln** base e ≈ 2.718

**Properties:**
- log(ab) = log a + log b
- log(a^n) = n log a

**Solve:** 2^x = 32 → x = 5; 10^x = 1000 → x = 3

**Half-life** decay: N = N₀(1/2)^(t/h)`,
    answerGuide: `Continuous growth A=Pe^(rt) with e. Change of base formula. log(0) undefined. Exponential beats polynomial for large x.`,
    answer: `Students should graph y=2^x key points, solve 3^x=81, use log properties on log(2)+log(5), and write decay model with half-life.`,
  },
  {
    id: "math019",
    title: "Introduction to Limits",
    summary: "Intuitive limits, continuity, and foundation for calculus.",
    difficulty: "Hard",
    estimatedMinutes: 45,
    tags: "calculus|limits|continuity",
    content: `**Calculus** studies change and accumulation.

**Limit (intuitive):** Value f(x) approaches as x approaches a (possibly without reaching a).

Example: lim(x→2) (x²−4)/(x−2) = lim(x→2) (x+2) = 4 (cancel factor first)

**One-sided limits** from left/right; limit exists if both agree.

**Continuity at a:** f(a) defined, lim(x→a) f(x) exists, and they equal f(a)

**Types of discontinuity:** removable (hole), jump, infinite

**Applications:** instantaneous velocity as limit of average velocity; tangent slope as limit of secant slopes.`,
    answerGuide: `Limit laws for sums/products. Notation lim_{x→a}. Piecewise functions check left/right. ε-δ definition is formal advanced.`,
    answer: `Students should evaluate lim(x→3) (x²−9)/(x−3), define continuity at a point in words, and explain limit idea for tangent slope.`,
  },
  {
    id: "math020",
    title: "Introduction to Derivatives",
    summary: "Rate of change, derivative as slope of tangent, and basic rules.",
    difficulty: "Hard",
    estimatedMinutes: 45,
    tags: "calculus|derivatives|rates",
    content: `**Derivative** f′(x) measures instantaneous rate of change of f at x.

**Geometric meaning:** slope of tangent line to y=f(x) at point x.

**Definition:** f′(x) = lim(h→0) [f(x+h) − f(x)] / h

**Basic rules (power rule):** if f(x)=x^n then f′(x)=n x^(n−1)  
Examples: d/dx (x³) = 3x²; d/dx (5x²) = 10x

**Constant rule:** derivative of constant is 0  
**Sum rule:** (f+g)′ = f′ + g′

**Applications:**
- Velocity v(t) = s′(t) if s is position
- Marginal cost approximates cost of one more unit

**Higher derivatives** — acceleration is second derivative of position.`,
    answerGuide: `Differentiability implies continuity but not converse. Notation dy/dx Leibniz. Product/quotient/chain rules come next course. Interpret signs: f′>0 increasing.`,
    answer: `Students should find derivative of x⁴ and 7x²−3x, interpret f′(2)>0 as increasing at x=2, and state derivative as velocity if s(t) is position.`,
  },
];
