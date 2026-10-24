import { mc, num, short, tf, type UnitSpec } from "../dsl";

const s = (code: string) => `CCSS.MATH.CONTENT.${code}`;

export const mathSecondaryExt: Record<string, UnitSpec[]> = {
  "math-6": [
    {
      title: "The Number System",
      description: "Divide fractions and work with positive and negative numbers.",
      lessons: [
        {
          title: "Dividing Fractions by Fractions",
          summary: "Dividing by a fraction is the same as multiplying by its reciprocal.",
          objectives: ["Divide fractions using the reciprocal", "Interpret fraction division in context"],
          vocab: [["reciprocal", "a fraction flipped; the reciprocal of 3/4 is 4/3"], ["quotient", "the result of division"]],
          standards: [s("6.NS.A.1")],
          body: `
**Question:** How many 3/4-cup servings are in 6 cups? That's **6 ÷ 3/4**.

**Keep, change, flip:** keep the first number, change ÷ to ×, flip the second.
6 ÷ 3/4 = 6 × 4/3 = 24/3 = **8 servings**

**Fraction ÷ fraction:** 2/3 ÷ 1/6 = 2/3 × 6/1 = 12/3 = **4**
Check: four 1/6 pieces make 4/6 = 2/3 ✓

**Why does flipping work?** Dividing asks "how many groups?" There are 4/3 groups of 3/4 in every 1, so 6 wholes hold 6 × 4/3 groups.

**Mixed numbers:** convert first. 2 1/2 ÷ 1/4 = 5/2 × 4 = **10**`,
          questions: [
            mc("3/4 ÷ 1/8 = ?", "6", ["3/32", "1/6", "4"], "3/4 × 8/1 = 24/4 = 6."),
            mc("2/5 ÷ 2/3 = ?", "3/5", ["4/15", "5/3", "4/5"], "2/5 × 3/2 = 6/10 = 3/5."),
            num("How many 1/3-mile laps make 4 miles?", 12, "4 ÷ 1/3 = 4 × 3 = 12."),
            num("A 3 1/2 ft board is cut into 1/2 ft pieces. How many pieces?", 7, "7/2 ÷ 1/2 = 7/2 × 2 = 7."),
          ],
        },
        {
          title: "Integers and the Number Line",
          summary: "Negative numbers describe values below zero; absolute value is distance from zero.",
          objectives: ["Represent quantities with positive and negative numbers", "Order integers and find absolute value", "Plot points in all four quadrants"],
          vocab: [["integer", "a whole number or its opposite: …, −2, −1, 0, 1, 2, …"], ["opposite", "the same distance from 0 on the other side"], ["absolute value", "distance from 0, written |x|"]],
          standards: [s("6.NS.C.5"), s("6.NS.C.6"), s("6.NS.C.7")],
          body: `
**Negative numbers in real life**
- Temperature: −8 °F is 8 degrees below zero
- Elevation: −86 m is below sea level (Death Valley)
- Money: −$20 is a $20 debt

**On a number line,** numbers increase to the right. So **−3 > −7** because −3 is farther right.

**Opposites:** 5 and −5 are opposites. The opposite of the opposite is the number itself: −(−4) = 4.

**Absolute value** is distance from 0 (always positive or zero):
|−9| = 9, |9| = 9, |0| = 0

**Coordinate plane:** (−3, 2) means 3 left, 2 up (Quadrant II). Points (4, 1) and (4, −1) are reflections across the x-axis.`,
          questions: [
            mc("Which is greater, −2 or −6?", "−2", ["−6"], "−2 is to the right of −6 on the number line."),
            num("What is |−15|?", 15, "Absolute value is distance from zero."),
            num("The temperature was −4 °F and rose 10 degrees. What is it now (°F)?", 6, "−4 + 10 = 6."),
            mc("In which quadrant is (−5, −2)?", "Quadrant III", ["Quadrant I", "Quadrant II", "Quadrant IV"], "Both coordinates negative: Quadrant III."),
          ],
        },
      ],
    },
    {
      title: "Geometry and Statistics",
      description: "Find areas of polygons and summarize data distributions.",
      lessons: [
        {
          title: "Area of Triangles and Polygons",
          summary: "A triangle is half of a parallelogram: A = ½bh.",
          objectives: ["Find areas of triangles, parallelograms, and trapezoids", "Decompose polygons into simpler shapes"],
          vocab: [["base", "any side used with its height"], ["height", "the perpendicular distance from the base to the opposite side or vertex"], ["parallelogram", "a quadrilateral with two pairs of parallel sides"]],
          standards: [s("6.G.A.1")],
          body: `
| Shape | Area |
|---|---|
| Rectangle | A = bh |
| Parallelogram | A = bh |
| Triangle | A = ½bh |
| Trapezoid | A = ½(b₁ + b₂)h |

**Why ½ for triangles?** Two copies of any triangle fit together into a parallelogram.

**Height is perpendicular** to the base, not the slanted side!

**Example:** triangle with base 10 cm and height 6 cm → A = ½ × 10 × 6 = **30 cm²**
**Trapezoid:** bases 8 and 12, height 5 → A = ½ × 20 × 5 = **50 units²**

**Composite shapes:** split an L-shaped room into two rectangles, find each area, and add.`,
          questions: [
            num("Find the area of a triangle with base 14 and height 9.", 63, "½ × 14 × 9 = 63."),
            num("Find the area of a parallelogram with base 7 and height 4.", 28, "A = bh = 28."),
            num("A trapezoid has bases 6 and 10 and height 4. What is its area?", 32, "½ × (6 + 10) × 4 = 32."),
            tf("For a triangle, you should use the length of the slanted side as the height.", false, "Height must be perpendicular to the base."),
          ],
        },
        {
          title: "Mean, Median, and Variability",
          summary: "Summarize data with a center (mean, median) and spread (range, IQR, MAD).",
          objectives: ["Calculate mean, median, and range", "Choose an appropriate measure of center", "Describe variability using interquartile range"],
          vocab: [["mean", "the sum divided by the count"], ["median", "the middle value when data is ordered"], ["outlier", "a value far from the rest"], ["interquartile range (IQR)", "Q3 − Q1, the spread of the middle half"]],
          standards: [s("6.SP.A.3"), s("6.SP.B.5")],
          body: `
**Data:** quiz scores 6, 7, 7, 8, 9, 10, 2

**Mean** = (6 + 7 + 7 + 8 + 9 + 10 + 2) ÷ 7 = 49 ÷ 7 = **7**
**Median:** order the data: 2, 6, 7, **7**, 8, 9, 10 → **7**
**Range:** 10 − 2 = **8**

**Outliers pull the mean.** If the 2 were a 9, the mean would rise to 8, but the median wouldn't move much. Use the **median** when there are outliers (like house prices).

**Quartiles:** Q1 is the median of the lower half, Q3 of the upper half.
In 2, 6, 7, 7, 8, 9, 10: Q1 = 6, Q3 = 9 → **IQR = 3**

A **box plot** shows min, Q1, median, Q3, and max.`,
          questions: [
            num("Find the mean of 4, 8, 10, 6.", 7, "28 ÷ 4 = 7."),
            num("Find the median of 3, 11, 5, 9, 7.", 7, "Ordered: 3, 5, 7, 9, 11."),
            num("Find the range of 12, 30, 18, 25.", 18, "30 − 12 = 18."),
            mc("Home prices in a town include one mansion worth 10 times the others. Which measure best describes a typical home?", "Median", ["Mean", "Range", "Maximum"], "The median isn't pulled by the outlier."),
          ],
        },
      ],
    },
  ],
  "math-7": [
    {
      title: "Operations with Rational Numbers",
      description: "Add, subtract, multiply, and divide positive and negative numbers.",
      lessons: [
        {
          title: "Adding and Subtracting Integers",
          summary: "Use the number line and the rule 'subtracting is adding the opposite.'",
          objectives: ["Add integers with the same and different signs", "Subtract by adding the opposite", "Find distance between numbers as an absolute value"],
          vocab: [["additive inverse", "a number's opposite; they sum to 0"], ["zero pair", "a positive and negative of the same size, like +1 and −1"]],
          standards: [s("7.NS.A.1")],
          body: `
**Adding on a number line:** start at the first number; move right for positive, left for negative.
- 5 + (−8): start at 5, move 8 left → **−3**
- −4 + (−6): move further left → **−10**

**Rules**
- Same signs: add the absolute values, keep the sign. −3 + (−9) = **−12**
- Different signs: subtract the absolute values, keep the sign of the larger. −11 + 4 = **−7**

**Subtracting = adding the opposite**
- 6 − 10 = 6 + (−10) = **−4**
- 3 − (−5) = 3 + 5 = **8**

**Zero pairs:** 7 + (−7) = 0.

**Distance between −3 and 5** = |5 − (−3)| = **8**`,
          questions: [
            num("−9 + 4 = ?", -5, "Different signs: 9 − 4 = 5, keep the negative."),
            num("−6 + (−7) = ?", -13, "Same signs: add and keep negative."),
            num("4 − (−9) = ?", 13, "Subtracting a negative is adding: 4 + 9."),
            num("What is the distance between −12 and 3 on a number line?", 15, "|3 − (−12)| = 15."),
          ],
        },
        {
          title: "Multiplying and Dividing Rational Numbers",
          summary: "Signs follow patterns: same signs give positive, different signs give negative.",
          objectives: ["Multiply and divide integers and rational numbers", "Convert fractions to terminating or repeating decimals"],
          vocab: [["rational number", "a number that can be written as a fraction of integers"], ["repeating decimal", "a decimal with digits that repeat forever, like 0.333…"]],
          standards: [s("7.NS.A.2")],
          body: `
**Sign rules (× and ÷)**
| Signs | Result |
|---|---|
| + and + | + |
| − and − | + |
| + and − | − |

- (−4)(−6) = **24**
- (−3)(5) = **−15**
- −42 ÷ 7 = **−6**
- −36 ÷ (−9) = **4**

**Why is negative × negative positive?** Look at the pattern: (−3)(2) = −6, (−3)(1) = −3, (−3)(0) = 0, (−3)(−1) = **3**. Each step adds 3.

**Rational numbers as decimals:** divide the numerator by the denominator.
- 3/8 = 0.375 (terminates)
- 2/3 = 0.666… = 0.6̅ (repeats)

**Context:** A diver descends 2.5 m per minute. After 4 minutes: 4 × (−2.5) = **−10 m**.`,
          questions: [
            num("(−7)(−8) = ?", 56, "Same signs give a positive product."),
            num("−63 ÷ 9 = ?", -7, "Different signs give a negative quotient."),
            num("(−2)(−3)(−4) = ?", -24, "(−2)(−3) = 6, then 6 × (−4) = −24."),
            mc("Which fraction is a repeating decimal?", "5/6", ["1/4", "3/5", "7/8"], "5/6 = 0.8333…; the others terminate."),
          ],
        },
      ],
    },
    {
      title: "Probability and Angles",
      description: "Find probabilities of events and use angle relationships.",
      lessons: [
        {
          title: "Probability",
          summary: "Probability measures how likely an event is, from 0 (impossible) to 1 (certain).",
          objectives: ["Find theoretical probability of simple events", "Compare theoretical and experimental probability", "Find probabilities of compound events with lists and tree diagrams"],
          vocab: [["probability", "favorable outcomes ÷ total possible outcomes"], ["sample space", "the set of all possible outcomes"], ["experimental probability", "based on actual trials"]],
          standards: [s("7.SP.C.5"), s("7.SP.C.6"), s("7.SP.C.7"), s("7.SP.C.8")],
          body: `
**P(event) = favorable outcomes ÷ total outcomes**

A bag has 3 red, 5 blue, and 2 green marbles (10 total).
- P(red) = 3/10
- P(not blue) = 5/10 = **1/2**
- P(purple) = 0 (impossible)

**Experimental vs. theoretical:** Flip a coin 20 times and get 13 heads → experimental P(heads) = 13/20. Theoretical is 1/2. With more trials, results usually get closer to 1/2.

**Compound events:** Flip a coin and roll a die. The sample space has 2 × 6 = **12** outcomes.
P(heads and a 6) = **1/12**

**Tree diagrams** and organized lists help you count outcomes without missing any.`,
          questions: [
            mc("A die is rolled. What is P(even number)?", "1/2", ["1/6", "1/3", "2/3"], "3 even numbers out of 6."),
            num("How many outcomes are there when flipping two coins?", 4, "HH, HT, TH, TT."),
            mc("A spinner has 8 equal sections, 3 of them yellow. What is P(not yellow)?", "5/8", ["3/8", "1/8", "3/5"], "5 non-yellow sections out of 8."),
            tf("An event with probability 0.95 is very likely.", true, "Close to 1 means very likely."),
          ],
        },
        {
          title: "Angle Relationships",
          summary: "Use supplementary, complementary, vertical, and adjacent angles to find unknowns.",
          objectives: ["Identify supplementary, complementary, vertical, and adjacent angles", "Write and solve equations to find unknown angles"],
          vocab: [["complementary", "two angles that sum to 90°"], ["supplementary", "two angles that sum to 180°"], ["vertical angles", "opposite angles formed by intersecting lines; they are equal"]],
          standards: [s("7.G.B.5")],
          body: `
**Complementary:** sum to 90°. If one is 35°, the other is **55°**.
**Supplementary:** sum to 180°. If one is 110°, the other is **70°**.
**Vertical angles** (across from each other where lines cross) are **equal**.

**Writing equations:** Two angles are supplementary. One is 3x and the other is 2x + 30.
3x + 2x + 30 = 180 → 5x = 150 → x = 30 → angles are **90° and 90°**.

**Around a point** angles sum to **360°**.

**Triangles:** the three interior angles sum to **180°**.`,
          questions: [
            num("What is the complement of a 28° angle (degrees)?", 62, "90 − 28 = 62."),
            num("What is the supplement of a 125° angle (degrees)?", 55, "180 − 125 = 55."),
            num("Two lines cross. One angle is 47°. What is its vertical angle (degrees)?", 47, "Vertical angles are equal."),
            num("Angles x and 2x are complementary. What is x (degrees)?", 30, "3x = 90, x = 30."),
          ],
        },
      ],
    },
  ],
  "math-8": [
    {
      title: "Exponents and Roots",
      description: "Use integer exponents, scientific notation, and square and cube roots.",
      lessons: [
        {
          title: "Integer Exponents and Scientific Notation",
          summary: "Exponent rules simplify expressions; scientific notation writes very large and small numbers.",
          objectives: ["Apply properties of integer exponents", "Write and compute with numbers in scientific notation"],
          vocab: [["scientific notation", "a × 10ⁿ with 1 ≤ a < 10"], ["negative exponent", "a⁻ⁿ = 1/aⁿ"]],
          standards: [s("8.EE.A.1"), s("8.EE.A.3"), s("8.EE.A.4")],
          body: `
**Exponent rules**
| Rule | Example |
|---|---|
| aᵐ · aⁿ = aᵐ⁺ⁿ | 2³ · 2⁴ = 2⁷ |
| aᵐ ÷ aⁿ = aᵐ⁻ⁿ | 5⁶ ÷ 5² = 5⁴ |
| (aᵐ)ⁿ = aᵐⁿ | (3²)³ = 3⁶ |
| a⁰ = 1 | 7⁰ = 1 |
| a⁻ⁿ = 1/aⁿ | 2⁻³ = 1/8 |

**Scientific notation:** a × 10ⁿ where 1 ≤ a < 10
- 5,900,000 = **5.9 × 10⁶**
- 0.00042 = **4.2 × 10⁻⁴**

**Multiplying:** (3 × 10⁴)(2 × 10⁵) = 6 × 10⁹
**Dividing:** (8 × 10⁷) ÷ (4 × 10²) = 2 × 10⁵

**Scale:** Earth is about 1.5 × 10⁸ km from the sun; a red blood cell is about 8 × 10⁻⁶ m wide.`,
          questions: [
            num("Simplify 2⁴ · 2³ and give the value.", 128, "2⁷ = 128."),
            mc("What is 3⁻²?", "1/9", ["−9", "−6", "9"], "3⁻² = 1/3² = 1/9."),
            mc("Write 72,000,000 in scientific notation.", "7.2 × 10⁷", ["72 × 10⁶", "7.2 × 10⁶", "0.72 × 10⁸"], "Move the decimal 7 places."),
            mc("(6 × 10³)(4 × 10²) = ?", "2.4 × 10⁶", ["24 × 10⁶", "2.4 × 10⁵", "10 × 10⁵"], "24 × 10⁵ = 2.4 × 10⁶."),
          ],
        },
        {
          title: "Square Roots, Cube Roots, and Irrational Numbers",
          summary: "Roots undo powers; some roots are irrational and never terminate or repeat.",
          objectives: ["Evaluate square and cube roots of perfect squares and cubes", "Identify rational and irrational numbers", "Estimate irrational numbers"],
          vocab: [["square root", "a number that times itself gives the original"], ["irrational number", "a number that can't be written as a fraction; its decimal never ends or repeats"], ["perfect square", "a number like 49 that is an integer squared"]],
          standards: [s("8.EE.A.2"), s("8.NS.A.1"), s("8.NS.A.2")],
          body: `
**Square roots:** √49 = 7 because 7² = 49. Also solves x² = 49 → x = ±7.
**Cube roots:** ∛64 = 4 because 4³ = 64. Solves x³ = 64 → x = 4.

**Rational vs. irrational**
- Rational: can be written as a fraction. 0.75, −3, 1/3, √25 = 5
- Irrational: decimal never ends or repeats. √2 ≈ 1.41421…, π ≈ 3.14159…

**√ of a non-perfect square is irrational:** √10, √20, √50.

**Estimating √30:** 5² = 25 and 6² = 36, so √30 is between 5 and 6, closer to 5 (≈ 5.48).

**Repeating decimals are rational:** 0.444… = 4/9.`,
          questions: [
            num("√144 = ?", 12, "12 × 12 = 144."),
            num("∛125 = ?", 5, "5 × 5 × 5 = 125."),
            mc("Which number is irrational?", "√7", ["√16", "0.25", "2/3"], "7 isn't a perfect square, so √7 never ends or repeats."),
            mc("√55 is between which two whole numbers?", "7 and 8", ["5 and 6", "6 and 7", "8 and 9"], "7² = 49 and 8² = 64."),
          ],
        },
      ],
    },
    {
      title: "Systems and Transformations",
      description: "Solve systems of equations and describe rigid motions.",
      lessons: [
        {
          title: "Systems of Linear Equations",
          summary: "The solution of a system is where two lines intersect.",
          objectives: ["Solve systems graphically and by substitution", "Interpret systems with no solution or infinitely many"],
          vocab: [["system of equations", "two or more equations solved together"], ["intersection", "the point where lines cross"]],
          standards: [s("8.EE.C.8.A"), s("8.EE.C.8.B"), s("8.EE.C.8.C")],
          body: `
A **system** is two equations at once. The solution makes **both** true.

**Graphically:** graph both lines. The crossing point is the solution.

**Substitution:** y = 2x and x + y = 12
x + 2x = 12 → 3x = 12 → **x = 4, y = 8**

**Real-world:** Gym A: $30 + $5/visit. Gym B: $10/visit. When do they cost the same?
30 + 5v = 10v → 30 = 5v → **v = 6 visits** (both $60). After 6 visits, Gym A is cheaper.

**Special cases**
- Parallel lines (same slope, different intercept): **no solution**
- Same line: **infinitely many solutions**`,
          questions: [
            mc("Solve: y = x + 3 and y = 2x + 1", "(2, 5)", ["(1, 4)", "(3, 6)", "(5, 2)"], "x + 3 = 2x + 1 → x = 2, y = 5."),
            num("Solve: y = 3x and x + y = 20. What is x?", 5, "x + 3x = 20 → x = 5."),
            mc("y = 4x + 2 and y = 4x − 3 have…", "no solution", ["one solution", "infinitely many solutions"], "Same slope, different intercepts: parallel."),
            num("Plan A: $20 + $2 per ride. Plan B: $4 per ride. After how many rides do they cost the same?", 10, "20 + 2r = 4r → r = 10."),
          ],
        },
        {
          title: "Transformations",
          summary: "Translations, reflections, and rotations keep shape and size; dilations change size.",
          objectives: ["Describe translations, reflections, rotations, and dilations on the coordinate plane", "Distinguish congruent from similar figures"],
          vocab: [["translation", "a slide"], ["reflection", "a flip over a line"], ["rotation", "a turn around a point"], ["dilation", "a resizing by a scale factor"]],
          standards: [s("8.G.A.1"), s("8.G.A.3"), s("8.G.A.4")],
          body: `
**Rigid motions** keep the same shape and size (images are **congruent**):
| Transformation | Rule example |
|---|---|
| Translation 3 right, 2 down | (x, y) → (x + 3, y − 2) |
| Reflection over x-axis | (x, y) → (x, −y) |
| Reflection over y-axis | (x, y) → (−x, y) |
| Rotation 90° counterclockwise about origin | (x, y) → (−y, x) |
| Rotation 180° about origin | (x, y) → (−x, −y) |

**Dilations** change size but keep shape (images are **similar**):
Scale factor 2 about the origin: (x, y) → (2x, 2y). A side of 3 becomes 6.

**Example:** reflect A(4, −1) over the y-axis → **A′(−4, −1)**.`,
          questions: [
            mc("Translate (2, 5) 4 left and 3 up.", "(−2, 8)", ["(6, 8)", "(−2, 2)", "(6, 2)"], "x − 4 = −2, y + 3 = 8."),
            mc("Reflect (3, −7) over the x-axis.", "(3, 7)", ["(−3, −7)", "(−3, 7)", "(7, 3)"], "Reflecting over the x-axis negates y."),
            mc("Rotate (1, 4) 180° about the origin.", "(−1, −4)", ["(4, 1)", "(−4, 1)", "(1, −4)"], "180° negates both coordinates."),
            tf("A dilation with scale factor 3 produces a congruent figure.", false, "It produces a similar figure, three times as large."),
          ],
        },
      ],
    },
  ],
  "algebra-1": [
    {
      title: "Functions",
      description: "Use function notation and compare linear and exponential growth.",
      lessons: [
        {
          title: "Function Notation, Domain, and Range",
          summary: "A function assigns exactly one output to each input; f(x) names the output.",
          objectives: ["Determine whether a relation is a function", "Evaluate functions using f(x) notation", "Identify domain and range"],
          vocab: [["function", "a rule that gives exactly one output for each input"], ["domain", "the set of allowed inputs"], ["range", "the set of resulting outputs"]],
          standards: [s("HSF.IF.A.1"), s("HSF.IF.A.2"), s("HSF.IF.B.5")],
          body: `
A **function** gives **exactly one output** for each input.

**Vertical line test:** a graph is a function if no vertical line crosses it more than once. A circle fails; a parabola passes.

**Function notation:** f(x) = 3x − 2
- f(4) = 3(4) − 2 = **10**
- f(−1) = −5
- If f(x) = 13, then 3x − 2 = 13 → x = 5

**Domain and range**
- f(x) = √x: domain x ≥ 0, range y ≥ 0
- A taxi fare f(m) = 2.5m + 3 for m miles: domain m ≥ 0 (no negative miles!)

**Reading graphs:** f(2) is the y-value on the graph when x = 2.`,
          questions: [
            num("If f(x) = x² − 4, what is f(3)?", 5, "9 − 4 = 5."),
            num("If g(x) = 2x + 7 and g(x) = 19, what is x?", 6, "2x + 7 = 19 → x = 6."),
            tf("The relation {(1, 2), (1, 5), (3, 4)} is a function.", false, "The input 1 has two different outputs."),
            mc("What is the domain of f(x) = √(x − 3)?", "x ≥ 3", ["x ≥ 0", "all real numbers", "x ≤ 3"], "The expression under the root can't be negative."),
          ],
        },
        {
          title: "Linear vs. Exponential Models",
          summary: "Linear models add a constant; exponential models multiply by a constant.",
          objectives: ["Distinguish linear from exponential situations", "Write linear and exponential models from tables"],
          vocab: [["linear growth", "increases by a constant difference"], ["exponential growth", "increases by a constant ratio"], ["common ratio", "the factor multiplied each step"]],
          standards: [s("HSF.LE.A.1"), s("HSF.LE.A.2"), s("HSF.LE.A.3")],
          body: `
| x | Linear (+5) | Exponential (×2) |
|---|---|---|
| 0 | 3 | 3 |
| 1 | 8 | 6 |
| 2 | 13 | 12 |
| 3 | 18 | 24 |
| 4 | 23 | 48 |

**Linear:** y = 5x + 3 (constant **difference** of 5)
**Exponential:** y = 3 · 2ˣ (constant **ratio** of 2)

**Exponential always wins eventually.** At x = 10: linear gives 53, exponential gives 3,072.

**Recognizing context**
- "Increases by $50 each month" → linear
- "Grows 8% per year" → exponential: y = a(1.08)ᵗ
- "Halves every 5 years" → exponential decay`,
          questions: [
            mc("A table goes 2, 6, 18, 54. This is…", "exponential", ["linear", "neither"], "Each term is multiplied by 3."),
            mc("Which models 'a $200 investment that grows 5% per year'?", "y = 200(1.05)ᵗ", ["y = 200 + 5t", "y = 200(0.05)ᵗ", "y = 1.05t + 200"], "Grows by a constant percent: exponential."),
            num("For y = 4 · 3ˣ, what is y when x = 3?", 108, "4 × 27 = 108."),
            tf("A quantity that grows by 10 each year will eventually be passed by one that doubles each year.", true, "Exponential growth always overtakes linear growth."),
          ],
        },
      ],
    },
    {
      title: "Polynomials and Data",
      description: "Operate on polynomials and model data with lines of best fit.",
      lessons: [
        {
          title: "Polynomial Operations",
          summary: "Add, subtract, and multiply polynomials by combining like terms and distributing.",
          objectives: ["Add and subtract polynomials", "Multiply polynomials, including binomials"],
          vocab: [["polynomial", "a sum of terms like 3x², −2x, 5"], ["degree", "the highest exponent"], ["binomial", "a polynomial with two terms"]],
          standards: [s("HSA.APR.A.1"), s("HSA.SSE.A.1")],
          body: `
**Add/subtract:** combine like terms.
(3x² + 2x − 5) + (x² − 6x + 1) = **4x² − 4x − 4**
(5x² − x) − (2x² + 3x) = 5x² − x − 2x² − 3x = **3x² − 4x**

**Multiply a monomial:** 2x(3x − 4) = **6x² − 8x**

**Multiply binomials (FOIL / area model):**
(x + 3)(x + 5) = x² + 5x + 3x + 15 = **x² + 8x + 15**

**Special products**
- (a + b)² = a² + 2ab + b² → (x + 4)² = x² + 8x + 16
- (a − b)(a + b) = a² − b² → (x − 6)(x + 6) = x² − 36

**Closure:** adding, subtracting, or multiplying polynomials always gives another polynomial.`,
          questions: [
            mc("(2x² + 3x) + (4x² − 5x) = ?", "6x² − 2x", ["6x² + 8x", "6x⁴ − 2x²", "2x² − 2x"], "2x² + 4x² = 6x²; 3x − 5x = −2x."),
            mc("(x + 2)(x − 7) = ?", "x² − 5x − 14", ["x² + 5x − 14", "x² − 14", "x² − 9x − 14"], "x² − 7x + 2x − 14."),
            mc("(x − 3)² = ?", "x² − 6x + 9", ["x² + 9", "x² − 9", "x² − 3x + 9"], "(a − b)² = a² − 2ab + b²."),
            num("What is the degree of 5x⁴ − 2x² + 7?", 4, "The highest exponent is 4."),
          ],
        },
        {
          title: "Scatter Plots and Lines of Best Fit",
          summary: "Model two-variable data with a line and interpret slope, intercept, and correlation.",
          objectives: ["Describe association in scatter plots", "Interpret slope and intercept of a fitted line", "Distinguish correlation from causation"],
          vocab: [["scatter plot", "a graph of paired data points"], ["correlation coefficient (r)", "a number from −1 to 1 measuring linear strength"], ["residual", "actual − predicted value"]],
          standards: [s("HSS.ID.B.6"), s("HSS.ID.C.7"), s("HSS.ID.C.8"), s("HSS.ID.C.9")],
          body: `
**Scatter plots** show whether two variables are related.
- Positive association: both increase (study time and test score)
- Negative association: one increases as the other decreases (car age and value)
- No association: no pattern

**Line of best fit:** ŷ = 4.5x + 62 for hours studied (x) and score (ŷ).
- **Slope 4.5:** each extra hour is associated with about 4.5 more points.
- **Intercept 62:** predicted score with 0 hours.
- Predict 6 hours: 4.5(6) + 62 = **89**

**Correlation coefficient r:** close to 1 → strong positive; close to −1 → strong negative; near 0 → weak.

**Residuals:** a student who studied 6 hours and scored 85 has residual 85 − 89 = **−4**.

**Correlation ≠ causation:** ice cream sales and sunburns rise together because of a third factor: hot weather.`,
          questions: [
            num("Using ŷ = 3x + 20, predict ŷ when x = 10.", 50, "3(10) + 20 = 50."),
            mc("Which r value shows the strongest relationship?", "−0.92", ["0.45", "0.10", "−0.30"], "|−0.92| is closest to 1."),
            num("A point's actual value is 72 and the predicted value is 75. What is the residual?", -3, "72 − 75 = −3."),
            tf("A strong correlation proves that one variable causes the other.", false, "A third variable or coincidence could explain it."),
          ],
        },
      ],
    },
  ],
  geometry: [
    {
      title: "Transformations and Coordinate Geometry",
      description: "Use rigid motions and coordinates to prove geometric relationships.",
      lessons: [
        {
          title: "Rigid Motions and Congruence",
          summary: "Two figures are congruent if a sequence of rigid motions maps one onto the other.",
          objectives: ["Represent transformations as functions on the plane", "Use rigid motions to define and test congruence"],
          vocab: [["rigid motion", "a transformation preserving distance and angle measure"], ["image", "the result of a transformation"], ["line of symmetry", "a reflection line mapping a figure onto itself"]],
          standards: [s("HSG.CO.A.2"), s("HSG.CO.A.5"), s("HSG.CO.B.6")],
          body: `
**Transformations are functions:** input a point, output its image.
- Translation by ⟨a, b⟩: (x, y) → (x + a, y + b)
- Reflection over y = x: (x, y) → (y, x)
- Rotation 90° counterclockwise: (x, y) → (−y, x)

**Rigid motions preserve** distances and angle measures, so they map figures to **congruent** images.

**Definition of congruence:** figures are congruent if and only if a **sequence of rigid motions** maps one onto the other. This is why SSS, SAS, and ASA work: they guarantee such a sequence exists.

**Symmetry:** a regular hexagon has **6 lines of symmetry** and **rotational symmetry** of 60°.

**Composition:** reflecting over two parallel lines is equivalent to a translation.`,
          questions: [
            mc("Reflect (2, −5) over the line y = x.", "(−5, 2)", ["(5, −2)", "(−2, 5)", "(2, 5)"], "Reflection over y = x swaps coordinates."),
            num("How many lines of symmetry does a square have?", 4, "Two through midpoints and two diagonals."),
            tf("A dilation is a rigid motion.", false, "Dilations change size, so they don't preserve distance."),
            num("What is the smallest rotation (in degrees) that maps a regular pentagon onto itself?", 72, "360 ÷ 5 = 72."),
          ],
        },
        {
          title: "Coordinate Proofs: Distance, Midpoint, and Slope",
          summary: "Prove properties of figures algebraically using coordinates.",
          objectives: ["Use the distance and midpoint formulas", "Use slopes to prove lines parallel or perpendicular", "Classify figures using coordinates"],
          vocab: [["distance formula", "d = √((x₂−x₁)² + (y₂−y₁)²)"], ["midpoint", "((x₁+x₂)/2, (y₁+y₂)/2)"], ["perpendicular slopes", "negative reciprocals; their product is −1"]],
          standards: [s("HSG.GPE.B.4"), s("HSG.GPE.B.5"), s("HSG.GPE.B.7")],
          body: `
**Distance:** d = √((x₂ − x₁)² + (y₂ − y₁)²)
From (1, 2) to (7, 10): √(36 + 64) = √100 = **10**

**Midpoint:** M = ((x₁ + x₂)/2, (y₁ + y₂)/2)
Of (−2, 4) and (6, 0): **(2, 2)**

**Slopes**
- Parallel lines have **equal** slopes.
- Perpendicular lines have slopes whose product is **−1** (e.g., 2/3 and −3/2).

**Coordinate proof:** Show ABCD with A(0,0), B(4,1), C(5,5), D(1,4) is a parallelogram.
- Slope AB = 1/4 and slope DC = 1/4 → parallel
- Slope AD = 4 and slope BC = 4 → parallel
Two pairs of parallel sides → **parallelogram**. (All sides are √17, so it's also a rhombus!)`,
          questions: [
            num("Find the distance between (0, 0) and (6, 8).", 10, "√(36 + 64) = 10."),
            mc("Find the midpoint of (3, −1) and (9, 7).", "(6, 3)", ["(12, 6)", "(3, 4)", "(6, 4)"], "((3+9)/2, (−1+7)/2)."),
            mc("A line has slope −4. What slope is perpendicular to it?", "1/4", ["4", "−1/4", "−4"], "Negative reciprocal: −4 × 1/4 = −1."),
            tf("Two lines with slopes 3/5 and 3/5 are parallel (if distinct).", true, "Equal slopes mean parallel lines."),
          ],
        },
      ],
    },
    {
      title: "Area and Volume",
      description: "Develop and apply formulas for area, surface area, and volume.",
      lessons: [
        {
          title: "Area of Polygons and Circles",
          summary: "Derive area formulas and find areas of regular polygons and sectors.",
          objectives: ["Explain the circle area formula informally", "Find areas of regular polygons using apothems", "Find areas of sectors"],
          vocab: [["apothem", "the distance from a regular polygon's center to a side"], ["sector", "a pie-slice region of a circle"], ["regular polygon", "a polygon with all sides and angles equal"]],
          standards: [s("HSG.GMD.A.1"), s("HSG.C.B.5")],
          body: `
**Regular polygon area:** A = ½ × apothem × perimeter
A regular hexagon with side 6 and apothem 3√3 ≈ 5.2: P = 36 → A ≈ ½(5.2)(36) ≈ **93.5**

**Circle area A = πr²:** slice a circle into many thin wedges and rearrange them into a near-parallelogram with base πr and height r → area πr².

**Sector area** is a fraction of the circle:
A = (θ/360°) × πr²
r = 10, θ = 72° → A = (1/5)(100π) = **20π ≈ 62.8**

**Shaded-region problems:** area of a square minus an inscribed circle. Square side 10 → 100 − 25π ≈ **21.5**`,
          questions: [
            mc("What is the exact area of a sector with radius 6 and central angle 90°?", "9π", ["36π", "3π", "18π"], "(90/360)(36π) = 9π."),
            num("A regular polygon has apothem 4 and perimeter 30. What is its area?", 60, "½ × 4 × 30 = 60."),
            mc("A circle has area 49π. What is its radius?", "7", ["49", "14", "√7"], "πr² = 49π → r = 7."),
            num("A 12 × 12 square has a circle of diameter 12 inside. Using π ≈ 3.14, what is the area outside the circle? (round to tenths)", 30.96, "144 − 36π ≈ 144 − 113.04 = 30.96.", { tolerance: 0.1 }),
          ],
        },
        {
          title: "Volume and Surface Area of Solids",
          summary: "Use Cavalieri's principle and formulas for prisms, pyramids, cylinders, cones, and spheres.",
          objectives: ["Apply volume formulas for prisms, pyramids, cylinders, cones, and spheres", "Find surface area using nets", "Explain Cavalieri's principle"],
          vocab: [["surface area", "the total area of all faces of a solid"], ["Cavalieri's principle", "solids with equal heights and equal cross-sections at every level have equal volumes"], ["lateral area", "area of the sides, not the bases"]],
          standards: [s("HSG.GMD.A.1"), s("HSG.GMD.A.3"), s("HSG.MG.A.1")],
          body: `
| Solid | Volume | Surface area |
|---|---|---|
| Prism | Bh | 2B + Ph |
| Cylinder | πr²h | 2πr² + 2πrh |
| Pyramid | ⅓Bh | B + ½Pℓ |
| Cone | ⅓πr²h | πr² + πrℓ |
| Sphere | (4/3)πr³ | 4πr² |

(B = base area, P = base perimeter, ℓ = slant height)

**Cavalieri's principle:** a stack of coins has the same volume whether straight or slanted, because every cross-section has the same area.

**Example:** cylinder r = 3, h = 8 → V = 72π ≈ 226.2; SA = 18π + 48π = **66π ≈ 207.3**

**Modeling:** a silo is a cylinder topped with a hemisphere. Add the two volumes.`,
          questions: [
            mc("What is the exact surface area of a sphere with radius 5?", "100π", ["25π", "500π/3", "50π"], "4π(25) = 100π."),
            num("A rectangular prism is 4 × 5 × 6. What is its surface area?", 148, "2(20 + 24 + 30) = 148."),
            mc("A pyramid and a prism share the same base and height. The pyramid's volume is…", "one third of the prism's", ["half", "the same", "twice"], "V = ⅓Bh."),
            mc("What is the exact volume of a cone with r = 3 and h = 10?", "30π", ["90π", "10π", "45π"], "⅓π(9)(10) = 30π."),
          ],
        },
      ],
    },
  ],
  "algebra-2": [
    {
      title: "Rational and Radical Functions",
      description: "Simplify rational expressions and solve radical equations.",
      lessons: [
        {
          title: "Rational Expressions and Equations",
          summary: "Simplify, multiply, and solve equations with polynomial fractions, watching for excluded values.",
          objectives: ["Simplify rational expressions and state restrictions", "Solve rational equations and check for extraneous solutions"],
          vocab: [["rational expression", "a fraction of polynomials"], ["excluded value", "an x that makes a denominator zero"], ["extraneous solution", "an algebraic answer that doesn't satisfy the original equation"]],
          standards: [s("HSA.APR.D.6"), s("HSA.REI.A.2")],
          body: `
**Simplify by factoring:**
(x² − 9)/(x² + 5x + 6) = (x − 3)(x + 3)/((x + 2)(x + 3)) = **(x − 3)/(x + 2)**, x ≠ −3, −2

**Excluded values** make a denominator 0. They're restrictions even after canceling.

**Solving:** multiply both sides by the LCD.
3/x + 1/2 = 2 → multiply by 2x: 6 + x = 4x → **x = 2** ✓

**Extraneous solutions:**
x/(x − 1) = 1/(x − 1) + 2 → x = 1 + 2(x − 1) → x = 2x − 1 → x = 1
But x = 1 makes the denominator 0, so it's **extraneous**. No solution.

**Graphs** of rational functions have vertical asymptotes at excluded values that don't cancel.`,
          questions: [
            mc("Simplify (x² − 4)/(x − 2).", "x + 2, x ≠ 2", ["x − 2", "x + 2 for all x", "x² − 2"], "(x − 2)(x + 2)/(x − 2), with x ≠ 2."),
            num("Solve 6/x = 2/3.", 9, "Cross-multiply: 2x = 18 → x = 9."),
            mc("Which value is excluded from (x + 1)/(x² − 25)?", "x = 5 and x = −5", ["x = −1", "x = 25", "x = 0"], "x² − 25 = 0 when x = ±5."),
            tf("Every solution found by multiplying by the LCD must be checked.", true, "It might make a denominator zero (extraneous)."),
          ],
        },
        {
          title: "Rational Exponents and Radical Equations",
          summary: "Rewrite roots as fractional exponents and solve equations with radicals.",
          objectives: ["Convert between radical form and rational exponents", "Solve radical equations and identify extraneous solutions"],
          vocab: [["rational exponent", "an exponent written as a fraction, like x^(1/2)"], ["index", "the small number on a radical, like 3 in ∛"]],
          standards: [s("HSN.RN.A.1"), s("HSN.RN.A.2"), s("HSA.REI.A.2")],
          body: `
**Rational exponents:** x^(m/n) = ⁿ√(xᵐ) = (ⁿ√x)ᵐ
- 8^(1/3) = ∛8 = **2**
- 27^(2/3) = (∛27)² = 3² = **9**
- 16^(−1/2) = 1/√16 = **1/4**

All exponent rules still apply: x^(1/2) · x^(1/3) = x^(5/6).

**Solving radical equations:** isolate the radical, then raise both sides to the index.
√(x + 3) = 5 → x + 3 = 25 → **x = 22** ✓

**Check for extraneous solutions:**
√(2x + 3) = x → 2x + 3 = x² → x² − 2x − 3 = 0 → x = 3 or x = −1
Check: √9 = 3 ✓; √1 = 1 ≠ −1 ✗ → only **x = 3**`,
          questions: [
            num("Evaluate 32^(1/5).", 2, "2⁵ = 32."),
            num("Evaluate 9^(3/2).", 27, "(√9)³ = 3³ = 27."),
            num("Solve √(x − 4) = 6.", 40, "x − 4 = 36 → x = 40."),
            mc("Which is equivalent to ∛(x²)?", "x^(2/3)", ["x^(3/2)", "x^6", "x^(1/6)"], "The index is the denominator."),
          ],
        },
      ],
    },
    {
      title: "Probability and Statistics",
      description: "Model data with the normal distribution and compute conditional probability.",
      lessons: [
        {
          title: "The Normal Distribution",
          summary: "Many measurements follow a bell curve described by a mean and standard deviation.",
          objectives: ["Apply the 68–95–99.7 rule", "Compute and interpret z-scores"],
          vocab: [["standard deviation (σ)", "a measure of spread around the mean"], ["normal distribution", "a symmetric, bell-shaped distribution"], ["z-score", "how many standard deviations a value is from the mean"]],
          standards: [s("HSS.ID.A.4"), s("HSS.ID.A.2")],
          body: `
A **normal distribution** is symmetric and bell-shaped, centered at the mean μ.

**The 68–95–99.7 rule**
- About **68%** of data falls within 1σ of the mean
- About **95%** within 2σ
- About **99.7%** within 3σ

**Example:** adult heights with μ = 170 cm and σ = 8 cm
- 68% are between 162 and 178 cm
- 95% are between 154 and 186 cm

**z-score:** z = (x − μ)/σ
A 186-cm person: z = (186 − 170)/8 = **2**, which is taller than about 97.5% of people.

**Comparing across tests:** a 90 on a test with μ = 80, σ = 5 (z = 2) beats a 92 on a test with μ = 85, σ = 7 (z = 1).`,
          questions: [
            num("About what percent of normally distributed data falls within 1 standard deviation of the mean?", 68, "68–95–99.7 rule.", { tolerance: 1 }),
            num("μ = 50 and σ = 4. What is the z-score of 58?", 2, "(58 − 50)/4 = 2."),
            mc("Test scores have μ = 75 and σ = 10. About 95% of scores fall between…", "55 and 95", ["65 and 85", "45 and 105", "70 and 80"], "Two standard deviations either side."),
            tf("A z-score of −1.5 means the value is below the mean.", true, "Negative z-scores are below the mean."),
          ],
        },
        {
          title: "Conditional Probability and Independence",
          summary: "P(A | B) is the probability of A given that B happened; independent events don't affect each other.",
          objectives: ["Compute conditional probabilities from two-way tables", "Determine whether events are independent", "Apply the multiplication rule"],
          vocab: [["conditional probability", "P(A | B) = P(A and B) / P(B)"], ["independent events", "P(A | B) = P(A)"], ["two-way table", "a table of counts for two categorical variables"]],
          standards: [s("HSS.CP.A.2"), s("HSS.CP.A.3"), s("HSS.CP.A.4"), s("HSS.CP.B.6")],
          body: `
**Two-way table** (200 students):
| | Plays sport | No sport | Total |
|---|---|---|---|
| Grade 9 | 40 | 60 | 100 |
| Grade 10 | 50 | 50 | 100 |
| Total | 90 | 110 | 200 |

**P(sport | grade 9)** = 40/100 = **0.40**
**P(grade 9 | sport)** = 40/90 ≈ **0.44** (order matters!)

**Formula:** P(A | B) = P(A and B) / P(B)

**Independence:** A and B are independent if P(A | B) = P(A).
P(sport) = 90/200 = 0.45 but P(sport | grade 9) = 0.40, so grade and sport are **not** independent here.

**Multiplication rule:** P(A and B) = P(A) · P(B | A). For independent events, P(A and B) = P(A) · P(B). Two fair coin heads: 0.5 × 0.5 = **0.25**.`,
          questions: [
            num("Using the table, what is P(sport | grade 10)? (as a decimal)", 0.5, "50/100 = 0.5."),
            mc("Using the table, what is P(grade 10 | no sport)?", "50/110", ["50/100", "50/200", "60/110"], "Of the 110 with no sport, 50 are in grade 10."),
            num("A fair die is rolled twice. What is P(two 6s)? (as a fraction's decimal, round to 3 places)", 0.028, "1/6 × 1/6 = 1/36 ≈ 0.028.", { tolerance: 0.001 }),
            tf("If P(A | B) = P(A), then A and B are independent.", true, "Knowing B doesn't change the probability of A."),
          ],
        },
      ],
    },
  ],
  precalculus: [
    {
      title: "Vectors and Matrices",
      description: "Represent quantities with vectors and organize data with matrices.",
      lessons: [
        {
          title: "Vectors",
          summary: "Vectors have magnitude and direction; add them tip to tail or by components.",
          objectives: ["Find the magnitude and direction of a vector", "Add vectors and multiply by scalars", "Solve problems involving velocity and force"],
          vocab: [["vector", "a quantity with magnitude and direction"], ["component form", "⟨x, y⟩"], ["magnitude", "length of a vector: √(x² + y²)"], ["scalar", "a real number that scales a vector"]],
          standards: [s("HSN.VM.A.1"), s("HSN.VM.A.2"), s("HSN.VM.B.4"), s("HSN.VM.B.5")],
          body: `
A **vector** has **magnitude** (size) and **direction**. Velocity and force are vectors; speed and mass are scalars.

**Component form:** v = ⟨3, 4⟩
- Magnitude: ‖v‖ = √(3² + 4²) = **5**
- Direction: θ = tan⁻¹(4/3) ≈ **53.1°**

**From magnitude and angle:** ‖v‖ = 10 at 30° → ⟨10 cos 30°, 10 sin 30°⟩ ≈ ⟨8.66, 5⟩

**Adding:** ⟨2, 5⟩ + ⟨−1, 3⟩ = **⟨1, 8⟩** (tip-to-tail on a graph)
**Scalar multiplication:** 3⟨2, −1⟩ = **⟨6, −3⟩**

**Application:** A plane flies ⟨0, 500⟩ km/h (north) with a wind of ⟨60, 0⟩ (east). Ground velocity = ⟨60, 500⟩, speed ≈ **503.6 km/h**.`,
          questions: [
            num("What is the magnitude of ⟨6, 8⟩?", 10, "√(36 + 64) = 10."),
            mc("⟨4, −2⟩ + ⟨−1, 5⟩ = ?", "⟨3, 3⟩", ["⟨5, 3⟩", "⟨3, −7⟩", "⟨−4, −10⟩"], "Add components."),
            mc("2⟨−3, 7⟩ = ?", "⟨−6, 14⟩", ["⟨−1, 9⟩", "⟨−6, 7⟩", "⟨6, −14⟩"], "Multiply each component by 2."),
            tf("Speed is a vector quantity.", false, "Speed is a scalar; velocity (with direction) is a vector."),
          ],
        },
        {
          title: "Matrices",
          summary: "Matrices organize data and transform points; multiply rows by columns.",
          objectives: ["Add and multiply matrices", "Use matrices to represent transformations", "Find the determinant of a 2 × 2 matrix"],
          vocab: [["matrix", "a rectangular array of numbers"], ["dimensions", "rows × columns"], ["determinant", "ad − bc for a 2 × 2 matrix"]],
          standards: [s("HSN.VM.C.6"), s("HSN.VM.C.8"), s("HSN.VM.C.10"), s("HSN.VM.C.12")],
          body: `
A **matrix** is a grid of numbers. [[1, 2], [3, 4]] is 2 × 2 (2 rows, 2 columns).

**Adding:** add matching entries (same dimensions required).

**Multiplying:** row × column, then add.
[[1, 2], [3, 4]] × [[5], [6]] = [[1·5 + 2·6], [3·5 + 4·6]] = **[[17], [39]]**

**Order matters:** AB ≠ BA in general.

**Determinant (2 × 2):** for [[a, b], [c, d]], det = **ad − bc**.
det [[3, 1], [2, 4]] = 12 − 2 = **10**
If det = 0, the matrix has no inverse.

**Transformations:** [[0, −1], [1, 0]] rotates points 90° counterclockwise. Applied to (2, 1): (0·2 − 1·1, 1·2 + 0·1) = **(−1, 2)**.`,
          questions: [
            num("Find the determinant of [[5, 2], [3, 4]].", 14, "5·4 − 2·3 = 14."),
            mc("What are the dimensions of a matrix with 3 rows and 2 columns?", "3 × 2", ["2 × 3", "6 × 1", "3 × 3"], "Rows × columns."),
            mc("[[1, 0], [0, 2]] × [[3], [4]] = ?", "[[3], [8]]", ["[[4], [6]]", "[[3], [4]]", "[[6], [4]]"], "Row 1: 3; row 2: 8."),
            tf("Matrix multiplication is always commutative (AB = BA).", false, "Order usually matters."),
          ],
        },
      ],
    },
    {
      title: "Limits and Rates of Change",
      description: "Preview calculus with limits and instantaneous rates of change.",
      lessons: [
        {
          title: "Introduction to Limits",
          summary: "A limit describes the value a function approaches as x approaches a number.",
          objectives: ["Estimate limits from tables and graphs", "Evaluate limits algebraically by substitution and factoring", "Describe limits at infinity"],
          vocab: [["limit", "the value f(x) approaches as x approaches a"], ["one-sided limit", "a limit from the left or right only"], ["asymptote", "a line a graph approaches"]],
          standards: ["AP Calculus readiness: LIM-1.A", "AP Calculus readiness: LIM-1.D"],
          body: `
**lim(x→a) f(x) = L** means f(x) gets arbitrarily close to L as x gets close to a.

**Direct substitution** works for polynomials: lim(x→3) (x² + 1) = **10**

**Factor and cancel** for 0/0 forms:
lim(x→2) (x² − 4)/(x − 2) = lim(x→2) (x + 2) = **4**
The function isn't defined at x = 2, but the limit still exists!

**Tables:** for f(x) = sin(x)/x, values at x = 0.1, 0.01, 0.001 approach **1**.

**One-sided limits:** if the left and right limits differ, the limit **does not exist**.

**Limits at infinity:** lim(x→∞) 1/x = **0**; lim(x→∞) (3x + 1)/(x − 2) = **3** (ratio of leading coefficients).`,
          questions: [
            num("Evaluate lim(x→4) (2x + 3).", 11, "Substitute: 2(4) + 3 = 11."),
            num("Evaluate lim(x→3) (x² − 9)/(x − 3).", 6, "Factor: (x + 3) → 6."),
            num("Evaluate lim(x→∞) (5x² + 1)/(x² − 7).", 5, "Leading coefficients: 5/1."),
            tf("If a function is undefined at x = a, its limit at a cannot exist.", false, "The limit depends on nearby values, not the value at a."),
          ],
        },
        {
          title: "Average and Instantaneous Rate of Change",
          summary: "Average rate is the slope of a secant line; instantaneous rate is the limit of those slopes.",
          objectives: ["Compute average rate of change over an interval", "Estimate instantaneous rate of change using shrinking intervals", "Interpret rate of change in context"],
          vocab: [["average rate of change", "(f(b) − f(a)) / (b − a)"], ["secant line", "a line through two points on a curve"], ["tangent line", "a line touching a curve at one point with the curve's instantaneous slope"]],
          standards: [s("HSF.IF.B.6"), "AP Calculus readiness: CHA-1.A"],
          body: `
**Average rate of change** over [a, b] = (f(b) − f(a))/(b − a), the slope of the **secant line**.

**Example:** a ball's height h(t) = −16t² + 64t.
From t = 1 to t = 2: (h(2) − h(1))/(2 − 1) = (64 − 48)/1 = **16 ft/s**

**Instantaneous rate:** shrink the interval.
| Interval | Average rate |
|---|---|
| [1, 2] | 16 |
| [1, 1.1] | 30.4 |
| [1, 1.01] | 31.84 |
| [1, 1.001] | 31.984 |

The rates approach **32 ft/s**, the instantaneous velocity at t = 1. That limit is the **derivative**, the central idea of calculus.

**Interpretation:** positive rate → increasing; negative → decreasing; zero → a peak or valley (here, at t = 2 the ball is at its highest).`,
          questions: [
            num("f(x) = x². What is the average rate of change from x = 1 to x = 3?", 4, "(9 − 1)/(3 − 1) = 4."),
            num("A car travels 150 miles from hour 2 to hour 5. What is its average speed (mph)?", 50, "150/3 = 50."),
            mc("The instantaneous rate of change at a point is the slope of the…", "tangent line", ["secant line", "x-axis", "asymptote"], "The tangent line touches at one point."),
            num("For h(t) = −16t² + 64t, what is the average rate of change from t = 2 to t = 3 (ft/s)?", -16, "(48 − 64)/1 = −16: the ball is falling."),
          ],
        },
      ],
    },
  ],
};
