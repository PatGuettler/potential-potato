import { type CourseSpec, mc, num, short, tf } from "./dsl";

const CCSS = "Common Core State Standards for Mathematics";
const s = (code: string) => `CCSS.MATH.CONTENT.${code}`;

export const mathSecondary: CourseSpec[] = [
  {
    id: "math-6",
    title: "Grade 6 Math",
    subject: "mathematics",
    grade: 6,
    framework: CCSS,
    description: "Ratios, rates, and percents; writing and solving one-variable expressions and equations.",
    units: [
      {
        title: "Ratios and Rates",
        description: "Use ratio reasoning, unit rates, and percents to solve real-world problems.",
        lessons: [
          {
            title: "Ratios and Unit Rates",
            summary: "Describe relationships between quantities and find rates per one unit.",
            objectives: ["Write ratios in three forms (a to b, a:b, a/b)", "Find and use unit rates to compare"],
            vocab: [["ratio", "a comparison of two quantities"], ["rate", "a ratio comparing quantities with different units"], ["unit rate", "a rate with a denominator of 1, like 60 miles per hour"]],
            standards: [s("6.RP.A.1"), s("6.RP.A.2"), s("6.RP.A.3.B")],
            body: `
A **ratio** compares two quantities. In a class with 12 girls and 15 boys, the ratio of girls to boys is
**12 to 15**, **12:15**, or **12/15**, which simplifies to **4:5**.

**Equivalent ratios** come from multiplying or dividing both parts by the same number: 4:5 = 8:10 = 12:15.

A **rate** compares different units: 150 miles in 3 hours.
The **unit rate** is the amount for **1** unit: 150 ÷ 3 = **50 miles per hour**.

**Comparing prices with unit rates**
- Store A: 6 juice boxes for $4.50 → $4.50 ÷ 6 = **$0.75 each**
- Store B: 8 juice boxes for $5.60 → $5.60 ÷ 8 = **$0.70 each**
Store B is the better buy.

**Ratio tables** organize equivalent ratios:
| Cups of flour | 2 | 4 | 6 |
|---|---|---|---|
| Cups of sugar | 1 | 2 | 3 |`,
            questions: [
              mc("A bag has 8 red and 12 blue marbles. What is the ratio of red to blue in simplest form?", "2:3", ["3:2", "8:20", "2:5"], "8:12 — divide both by 4 to get 2:3."),
              num("A car travels 240 miles on 8 gallons. How many miles per gallon?", 30, "240 ÷ 8 = 30 miles per gallon."),
              mc("Which is the better buy?", "12 oz for $3.00", ["8 oz for $2.40", "They cost the same per ounce"], "$3.00 ÷ 12 = $0.25/oz vs $2.40 ÷ 8 = $0.30/oz."),
              num("A recipe uses 3 cups of flour for every 2 eggs. How many cups of flour for 8 eggs?", 12, "8 eggs is 4 × 2 eggs, so use 4 × 3 = 12 cups."),
            ],
          },
          {
            title: "Percents",
            summary: "A percent is a rate per 100. Find a percent of a quantity and the whole from a part.",
            objectives: ["Find a percent of a number", "Find the whole given a part and the percent"],
            vocab: [["percent", "a ratio that compares a number to 100"], ["part", "the portion of the whole being considered"], ["whole", "the total amount (100%)"]],
            standards: [s("6.RP.A.3.C")],
            body: `
**Percent** means "per hundred." 35% = 35/100 = 0.35.

**Find a percent of a number:** convert the percent to a decimal and multiply.
**25% of 80** = 0.25 × 80 = **20**

**Mental math benchmarks**
- 50% = half; 25% = a quarter; 10% = move the decimal one place left
- 10% of 70 = 7, so 30% of 70 = 21

**Find the whole from a part:** 18 is 30% of what number?
- 30% → 18, so 10% → 6, so 100% → **60**
- Or solve 0.30 × w = 18 → w = 18 ÷ 0.30 = 60

**What percent?** 12 out of 40 = 12/40 = 0.30 = **30%**`,
            questions: [
              num("What is 20% of 150?", 30, "0.20 × 150 = 30."),
              num("What percent is 9 out of 36?", 25, "9/36 = 1/4 = 25%.", { hint: "Simplify the fraction first." }),
              num("15 is 25% of what number?", 60, "25% is one fourth, so the whole is 15 × 4 = 60."),
              mc("Which is equal to 0.07?", "7%", ["70%", "0.7%", "700%"], "0.07 = 7/100 = 7%."),
            ],
          },
        ],
      },
      {
        title: "Expressions and Equations",
        description: "Write and evaluate expressions with variables, and solve one-step equations.",
        lessons: [
          {
            title: "Writing and Evaluating Expressions",
            summary: "Use variables to write expressions and evaluate them with the order of operations.",
            objectives: ["Write expressions from verbal descriptions", "Evaluate expressions using the order of operations", "Identify terms, coefficients, and constants"],
            vocab: [["variable", "a letter that stands for an unknown number"], ["coefficient", "the number multiplied by a variable, like 5 in 5x"], ["term", "a part of an expression separated by + or −"]],
            standards: [s("6.EE.A.2"), s("6.EE.A.2.C"), s("6.EE.A.3")],
            body: `
A **variable** stands for a number. **3n + 4** means "3 times a number, plus 4."

**Words → expressions**
| Words | Expression |
|---|---|
| 5 more than x | x + 5 |
| 7 less than y | y − 7 |
| twice a number | 2n |
| a number divided by 4 | n ÷ 4 or n/4 |

**Parts of 4x + 9:** two **terms** (4x and 9); **coefficient** 4; **constant** 9.

**Evaluate** by substituting, then use the **order of operations** (parentheses, exponents, multiply/divide left to right, add/subtract left to right).

If x = 3: **2x² + 5 = 2(3²) + 5 = 2(9) + 5 = 23**

**Equivalent expressions:** 3(x + 2) = 3x + 6 by the **distributive property**.`,
            questions: [
              mc("Which expression means '6 less than a number n'?", "n − 6", ["6 − n", "6n", "n + 6"], "'Less than' reverses the order: start with n, then subtract 6."),
              num("Evaluate 4a + 7 when a = 5.", 27, "4(5) + 7 = 20 + 7 = 27."),
              num("Evaluate 3(x + 2)² when x = 1.", 27, "Parentheses first: 1 + 2 = 3. Exponent: 3² = 9. Multiply: 3 × 9 = 27."),
              mc("Which is equivalent to 5(2y + 3)?", "10y + 15", ["10y + 3", "7y + 8", "2y + 15"], "Distribute: 5·2y = 10y and 5·3 = 15."),
            ],
          },
          {
            title: "Solving One-Step Equations",
            summary: "Use inverse operations to keep an equation balanced and find the unknown.",
            objectives: ["Solve equations of the form x + p = q and px = q", "Check a solution by substitution"],
            vocab: [["equation", "a statement that two expressions are equal"], ["solution", "a value that makes an equation true"], ["inverse operations", "operations that undo each other, like + and −"]],
            standards: [s("6.EE.B.5"), s("6.EE.B.7")],
            body: `
An **equation** is like a balanced scale. Whatever you do to one side, do to the other.

**Use inverse operations to get the variable alone.**

**x + 9 = 23** → subtract 9 from both sides → **x = 14**
**y − 4 = 10** → add 4 → **y = 14**
**6m = 42** → divide by 6 → **m = 7**
**k/3 = 8** → multiply by 3 → **k = 24**

**Always check:** substitute back in. 6(7) = 42 ✔

**Word problem:** Jalen saved some money, then earned $35 more. Now he has $120. How much did he start with?
s + 35 = 120 → s = **85**`,
            questions: [
              num("Solve: x + 17 = 40", 23, "Subtract 17 from both sides: x = 23."),
              num("Solve: 8n = 56", 7, "Divide both sides by 8: n = 7."),
              num("Solve: w/5 = 9", 45, "Multiply both sides by 5: w = 45."),
              num("Tickets cost $12 each. A group paid $84. How many tickets did they buy?", 7, "12t = 84 → t = 84 ÷ 12 = 7."),
            ],
            writtenPrompt: "Write your own word problem that can be solved with the equation 4x = 52. Then solve it and explain what x means in your story.",
            rubric: "Story involves four equal groups or a rate of 4 (e.g., 4 friends share $52). Solves x = 13. States what x represents in context with units. Checks: 4 × 13 = 52.",
          },
        ],
      },
    ],
  },
  {
    id: "math-7",
    title: "Grade 7 Math",
    subject: "mathematics",
    grade: 7,
    framework: CCSS,
    description: "Proportional relationships, percent problems, operations with rational numbers, two-step equations, and circles.",
    units: [
      {
        title: "Proportional Relationships",
        description: "Recognize and represent proportional relationships and solve percent problems.",
        lessons: [
          {
            title: "Proportional Relationships and the Constant of Proportionality",
            summary: "Two quantities are proportional when their ratio is always the same: y = kx.",
            objectives: ["Decide whether a table or graph shows a proportional relationship", "Find the constant of proportionality k and write y = kx"],
            vocab: [["proportional", "two quantities whose ratio is constant"], ["constant of proportionality (k)", "the constant ratio y/x"]],
            standards: [s("7.RP.A.2.A"), s("7.RP.A.2.B"), s("7.RP.A.2.C")],
            body: `
Two quantities are **proportional** if **y ÷ x** is the same for every pair.

| Hours (x) | 1 | 2 | 3 | 5 |
|---|---|---|---|---|
| Pay (y) | $15 | $30 | $45 | $75 |

Every ratio y/x = 15, so pay is proportional to hours. The **constant of proportionality** is **k = 15**, and the equation is **y = 15x**.

**On a graph,** a proportional relationship is a **straight line through the origin (0, 0)**. The point (1, k) is on the line: here (1, 15).

**Not proportional:** a gym charges a $20 sign-up fee plus $10 per visit. y = 10x + 20. The ratios y/x are 30, 20, 16.67… — they change, and the line does **not** pass through the origin.`,
            questions: [
              mc("Which equation shows a proportional relationship?", "y = 4x", ["y = 4x + 1", "y = x + 4", "y = 4"], "Proportional relationships have the form y = kx."),
              num("A table shows x = 3, y = 21 and x = 5, y = 35. What is k?", 7, "21/3 = 7 and 35/5 = 7."),
              tf("A proportional relationship's graph always passes through the origin.", true, "When x = 0, y = k·0 = 0."),
              num("Lemons cost $0.40 each. Using y = 0.4x, how many dollars do 15 lemons cost?", 6, "0.4 × 15 = 6."),
            ],
          },
          {
            title: "Percent Increase, Discounts, and Tax",
            summary: "Solve multistep percent problems with tax, tips, markups, and discounts.",
            objectives: ["Find sale prices, tax, and tips", "Calculate percent increase and decrease"],
            vocab: [["discount", "an amount taken off the original price"], ["markup", "an amount added to the cost"], ["percent change", "(new − original) ÷ original × 100%"]],
            standards: [s("7.RP.A.3")],
            body: `
**Discount:** A $60 jacket is 25% off.
- Discount: 0.25 × 60 = $15 → Sale price: 60 − 15 = **$45**
- Shortcut: you pay 75%, so 0.75 × 60 = $45

**Tax:** $45 with 8% sales tax → 1.08 × 45 = **$48.60**

**Tip:** 20% tip on a $35 meal → 0.20 × 35 = $7 → total **$42**

**Percent change**
**percent change = (new − original) ÷ original × 100%**
- Price rose from $50 to $65: (65 − 50) ÷ 50 = 0.30 → **30% increase**
- Enrollment fell from 400 to 340: (340 − 400) ÷ 400 = −0.15 → **15% decrease**

**Careful:** a 10% increase followed by a 10% decrease does **not** return to the start. 100 → 110 → 99.`,
            questions: [
              num("A $80 pair of shoes is 15% off. What is the sale price in dollars?", 68, "0.85 × 80 = 68."),
              num("A town's population grew from 2,000 to 2,500. What is the percent increase?", 25, "(2500 − 2000)/2000 = 0.25 = 25%."),
              num("A $40 meal plus a 15% tip costs how many dollars in total?", 46, "0.15 × 40 = 6; 40 + 6 = 46."),
              tf("Raising a price 20% and then lowering it 20% gives back the original price.", false, "Example: 100 → 120 → 96. The second 20% is taken from a larger number."),
            ],
          },
        ],
      },
      {
        title: "Equations and Geometry",
        description: "Solve two-step equations and find circumference and area of circles.",
        lessons: [
          {
            title: "Two-Step Equations",
            summary: "Undo addition or subtraction first, then multiplication or division.",
            objectives: ["Solve equations of the form px + q = r and p(x + q) = r", "Write and solve two-step equations from word problems"],
            vocab: [["two-step equation", "an equation that needs two inverse operations to solve"]],
            standards: [s("7.EE.B.4.A"), s("7.NS.A.3")],
            body: `
To solve **px + q = r**, reverse the order of operations: **undo + or − first, then × or ÷**.

**3x + 7 = 25**
- Subtract 7: 3x = 18
- Divide by 3: **x = 6**
- Check: 3(6) + 7 = 25 ✔

**Negative numbers:** −2x − 5 = 11 → −2x = 16 → **x = −8**

**Parentheses:** 4(x − 3) = 20
- Divide by 4: x − 3 = 5 → **x = 8**  *(or distribute: 4x − 12 = 20)*

**Word problem:** A plumber charges $45 to visit plus $30 per hour. The bill was $165. How many hours?
45 + 30h = 165 → 30h = 120 → **h = 4**`,
            questions: [
              num("Solve: 5x + 4 = 39", 7, "5x = 35, x = 7."),
              num("Solve: −3y + 2 = 20", -6, "−3y = 18, y = −6."),
              num("Solve: 2(n + 5) = 26", 8, "n + 5 = 13, n = 8."),
              num("A phone plan costs $25 a month plus $0.10 per text. A bill is $32. How many texts were sent?", 70, "25 + 0.10t = 32 → 0.10t = 7 → t = 70."),
            ],
          },
          {
            title: "Circumference and Area of Circles",
            summary: "Use π to find the distance around a circle and the space inside it.",
            objectives: ["Use C = πd and C = 2πr to find circumference", "Use A = πr² to find area", "Choose the correct formula for a real-world situation"],
            vocab: [["radius (r)", "distance from the center to the circle"], ["diameter (d)", "distance across through the center; d = 2r"], ["pi (π)", "the ratio of circumference to diameter, about 3.14"]],
            standards: [s("7.G.B.4")],
            body: `
For **every** circle, circumference ÷ diameter is the same number: **π ≈ 3.14159**.

**Circumference (distance around)**
**C = πd = 2πr**
A wheel with diameter 20 in: C = π(20) ≈ **62.8 in**

**Area (space inside)**
**A = πr²**
A pizza with radius 7 in: A = π(7²) = 49π ≈ **153.9 in²**

**Diameter vs. radius:** if you're given the diameter, divide by 2 before using A = πr².
A 10 cm circle (diameter) has r = 5 → A = 25π ≈ 78.5 cm².

**Why does A = πr² make sense?** Cut a circle into thin wedges and rearrange them into a near-rectangle with height r and base half the circumference (πr). Area ≈ r × πr = πr².`,
            questions: [
              num("Find the circumference of a circle with diameter 10 cm. Use π ≈ 3.14.", 31.4, "C = πd = 3.14 × 10 = 31.4 cm.", { tolerance: 0.05 }),
              num("Find the area of a circle with radius 3 m. Use π ≈ 3.14. (square meters)", 28.26, "A = πr² = 3.14 × 9 = 28.26 m².", { tolerance: 0.05 }),
              mc("You want to know how much fabric covers a round table. Which formula?", "A = πr²", ["C = πd", "C = 2πr", "d = 2r"], "Covering a surface is area."),
              num("A circle has circumference 18.84 ft. What is its diameter (π ≈ 3.14)?", 6, "d = C ÷ π = 18.84 ÷ 3.14 = 6 ft.", { tolerance: 0.01 }),
            ],
            writtenPrompt: "A 12-inch pizza (diameter) costs $12 and a 16-inch pizza costs $18. Which is the better deal per square inch? Show your work.",
            rubric: "Finds radius 6 and 8. Areas: 36π ≈ 113.1 in² and 64π ≈ 201.1 in². Cost per square inch ≈ $0.106 and ≈ $0.090. Concludes the 16-inch pizza is the better deal and explains using area, not diameter.",
          },
        ],
      },
    ],
  },
  {
    id: "math-8",
    title: "Grade 8 Math",
    subject: "mathematics",
    grade: 8,
    framework: CCSS,
    description: "Linear equations and functions, slope, the Pythagorean theorem, and volume of curved solids.",
    units: [
      {
        title: "Linear Equations and Functions",
        description: "Solve multi-step linear equations and model with linear functions.",
        lessons: [
          {
            title: "Slope and Slope-Intercept Form",
            summary: "Slope is the rate of change. y = mx + b describes every non-vertical line.",
            objectives: ["Calculate slope from two points, a table, or a graph", "Write and interpret y = mx + b in context"],
            vocab: [["slope (m)", "rise over run; the rate of change"], ["y-intercept (b)", "where the line crosses the y-axis; the starting value"], ["linear function", "a function whose graph is a straight line"]],
            standards: [s("8.EE.B.5"), s("8.EE.B.6"), s("8.F.B.4")],
            body: `
**Slope** measures steepness: how much y changes for each 1-unit change in x.

**m = (y₂ − y₁) / (x₂ − x₁)**

Through (1, 3) and (4, 12): m = (12 − 3)/(4 − 1) = 9/3 = **3**

**Kinds of slope**
- Positive: rises left to right
- Negative: falls left to right
- Zero: horizontal line (y = 5)
- Undefined: vertical line (x = 2)

**Slope-intercept form: y = mx + b**
- m = slope (rate of change)
- b = y-intercept (starting value when x = 0)

**In context:** A taxi charges $3 plus $2 per mile: **y = 2x + 3**. The slope 2 means $2 per mile; the intercept 3 is the base fare. A 7-mile ride costs 2(7) + 3 = **$17**.`,
            questions: [
              num("Find the slope of the line through (2, 5) and (6, 13).", 2, "(13 − 5)/(6 − 2) = 8/4 = 2."),
              num("What is the y-intercept of y = −4x + 9?", 9, "In y = mx + b, b = 9."),
              mc("A line falls from left to right. Its slope is…", "negative", ["positive", "zero", "undefined"], "As x increases, y decreases."),
              mc("A plant is 4 cm tall and grows 1.5 cm per week. Which equation models its height h after w weeks?", "h = 1.5w + 4", ["h = 4w + 1.5", "h = 5.5w", "h = 1.5 + 4"], "Starting value 4 (intercept), rate 1.5 per week (slope)."),
            ],
          },
          {
            title: "Solving Multi-Step Linear Equations",
            summary: "Distribute, combine like terms, and move variables to one side.",
            objectives: ["Solve linear equations with variables on both sides", "Identify equations with one solution, no solution, or infinitely many solutions"],
            vocab: [["like terms", "terms with the same variable raised to the same power"], ["identity", "an equation true for every value (infinitely many solutions)"]],
            standards: [s("8.EE.C.7.A"), s("8.EE.C.7.B")],
            body: `
**Strategy**
1. Distribute to remove parentheses.
2. Combine like terms on each side.
3. Move variable terms to one side and constants to the other.
4. Divide by the coefficient.

**Example:** 3(x + 4) = 5x − 6
- 3x + 12 = 5x − 6
- 12 + 6 = 5x − 3x → 18 = 2x → **x = 9**

**How many solutions?**
- **One solution:** you end with x = a number.
- **No solution:** variables cancel and you get a false statement. 2x + 5 = 2x + 1 → 5 = 1 ✘
- **Infinitely many:** variables cancel and you get a true statement. 4(x + 2) = 4x + 8 → 8 = 8 ✔`,
            questions: [
              num("Solve: 7x − 4 = 3x + 20", 6, "4x = 24, x = 6."),
              num("Solve: 2(3x − 1) = 4x + 10", 6, "6x − 2 = 4x + 10 → 2x = 12 → x = 6."),
              mc("How many solutions does 5x + 3 = 5x − 2 have?", "No solution", ["One solution", "Infinitely many"], "The x-terms cancel, leaving 3 = −2, which is false."),
              mc("How many solutions does 3(x − 2) = 3x − 6 have?", "Infinitely many", ["One solution", "No solution"], "Both sides are identical after distributing."),
            ],
          },
        ],
      },
      {
        title: "Geometry in Three Dimensions",
        description: "Apply the Pythagorean theorem and find volumes of cylinders, cones, and spheres.",
        lessons: [
          {
            title: "The Pythagorean Theorem",
            summary: "In a right triangle, a² + b² = c².",
            objectives: ["Use the Pythagorean theorem to find missing side lengths", "Apply the theorem to real-world and coordinate problems"],
            vocab: [["hypotenuse", "the longest side of a right triangle, opposite the right angle"], ["legs", "the two sides that form the right angle"]],
            standards: [s("8.G.B.6"), s("8.G.B.7"), s("8.G.B.8")],
            body: `
In any **right triangle** with legs a and b and hypotenuse c:

**a² + b² = c²**

**Find the hypotenuse:** legs 6 and 8 → 36 + 64 = 100 → c = √100 = **10**

**Find a leg:** hypotenuse 13, leg 5 → 5² + b² = 13² → 25 + b² = 169 → b² = 144 → **b = 12**

**Pythagorean triples** (whole-number right triangles): 3-4-5, 5-12-13, 8-15-17, and multiples like 6-8-10.

**Real world:** A 10-ft ladder leans against a wall with its base 6 ft from the wall. How high does it reach? 6² + h² = 10² → h² = 64 → **h = 8 ft**.

**Distance on a grid:** from (1, 2) to (4, 6), the horizontal leg is 3 and the vertical leg is 4, so the distance is **5**.`,
            questions: [
              num("A right triangle has legs 9 and 12. How long is the hypotenuse?", 15, "81 + 144 = 225; √225 = 15."),
              num("A right triangle has hypotenuse 17 and one leg 8. How long is the other leg?", 15, "289 − 64 = 225; √225 = 15."),
              tf("A triangle with sides 4, 5, and 6 is a right triangle.", false, "4² + 5² = 41, but 6² = 36. Not equal."),
              num("What is the distance between (0, 0) and (5, 12)?", 13, "Legs 5 and 12: 25 + 144 = 169; √169 = 13."),
            ],
          },
          {
            title: "Volume of Cylinders, Cones, and Spheres",
            summary: "Use formulas to find the volume of curved solids.",
            objectives: ["Find the volume of cylinders, cones, and spheres", "Explain the relationship between the volumes of a cone and a cylinder"],
            vocab: [["cylinder", "a solid with two parallel circular bases"], ["cone", "a solid with a circular base that narrows to a point"], ["sphere", "the set of all points the same distance from a center"]],
            standards: [s("8.G.C.9")],
            body: `
| Solid | Volume |
|---|---|
| Cylinder | V = πr²h |
| Cone | V = (1/3)πr²h |
| Sphere | V = (4/3)πr³ |

**Cylinder:** r = 3 cm, h = 10 cm → V = π(9)(10) = 90π ≈ **282.7 cm³**

**Cone with the same base and height:** V = (1/3)(90π) = 30π ≈ **94.2 cm³**.
A cone holds exactly **one third** of the matching cylinder. It takes three cones of water to fill the cylinder.

**Sphere:** r = 6 in → V = (4/3)π(216) = 288π ≈ **904.8 in³**

**Leave answers in terms of π** for exact values, or multiply by 3.14 for an approximation.`,
            questions: [
              mc("What is the exact volume of a cylinder with radius 2 and height 5?", "20π", ["10π", "4π", "40π"], "V = π(2²)(5) = 20π."),
              mc("A cone and cylinder have the same radius and height. The cone's volume is…", "one third of the cylinder's", ["half of the cylinder's", "the same as the cylinder's", "three times the cylinder's"], "V_cone = (1/3)πr²h."),
              mc("What is the exact volume of a sphere with radius 3?", "36π", ["12π", "27π", "108π"], "(4/3)π(27) = 36π."),
              num("A cylindrical can has r = 4 cm and h = 10 cm. Using π ≈ 3.14, what is its volume in cm³?", 502.4, "3.14 × 16 × 10 = 502.4.", { tolerance: 0.1 }),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "algebra-1",
    title: "Algebra I",
    subject: "mathematics",
    grade: 9,
    framework: CCSS,
    description: "Linear inequalities, systems of equations, factoring, and solving quadratic equations.",
    units: [
      {
        title: "Linear Inequalities and Systems",
        description: "Solve and graph inequalities and systems of linear equations.",
        lessons: [
          {
            title: "Solving Linear Inequalities",
            summary: "Solve like an equation, but flip the sign when multiplying or dividing by a negative.",
            objectives: ["Solve multi-step linear inequalities", "Graph solutions on a number line", "Write inequalities to model constraints"],
            vocab: [["inequality", "a statement that compares expressions using <, >, ≤, or ≥"], ["solution set", "all values that make an inequality true"]],
            standards: [s("HSA.REI.B.3"), s("HSA.CED.A.1")],
            body: `
Solve inequalities the same way as equations, with **one big exception**:

> **When you multiply or divide both sides by a negative number, reverse the inequality sign.**

**Example:** 3x − 5 ≤ 16 → 3x ≤ 21 → **x ≤ 7**

**Example with a flip:** −4x + 2 > 18 → −4x > 16 → divide by −4 and flip → **x < −4**

*Why flip?* 2 < 5, but multiplying both by −1 gives −2 and −5, and −2 > −5.

**Graphing on a number line**
- < or > → open circle (the endpoint is not included)
- ≤ or ≥ → closed circle (the endpoint is included)

**Modeling:** You have $50 and buy a $14 shirt. Socks cost $6 a pair. How many pairs can you buy?
14 + 6p ≤ 50 → 6p ≤ 36 → **p ≤ 6**. At most 6 pairs.`,
            questions: [
              mc("Solve: 2x + 7 > 19", "x > 6", ["x < 6", "x > 13", "x ≥ 6"], "2x > 12, x > 6."),
              mc("Solve: −3x ≤ 12", "x ≥ −4", ["x ≤ −4", "x ≥ 4", "x ≤ 4"], "Divide by −3 and reverse the sign."),
              mc("Which inequality uses a closed circle on a number line?", "x ≥ 2", ["x > 2", "x < 2", "x ≠ 2"], "≥ includes the endpoint."),
              num("Movie tickets cost $9. You have $60 and must spend $6 on parking. What is the most tickets you can buy?", 6, "6 + 9t ≤ 60 → t ≤ 6."),
            ],
          },
          {
            title: "Systems of Linear Equations",
            summary: "Find the point where two lines meet using graphing, substitution, or elimination.",
            objectives: ["Solve systems by substitution and elimination", "Interpret the solution of a system in context", "Recognize systems with no solution or infinitely many solutions"],
            vocab: [["system of equations", "two or more equations with the same variables"], ["substitution", "replacing a variable with an equivalent expression"], ["elimination", "adding or subtracting equations to cancel a variable"]],
            standards: [s("HSA.REI.C.6"), s("HSA.REI.C.5"), s("HSA.CED.A.3")],
            body: `
A **solution** to a system makes **both** equations true. On a graph it is where the lines **intersect**.

**Substitution**
y = 2x + 1 and 3x + y = 16
→ 3x + (2x + 1) = 16 → 5x = 15 → x = 3 → y = 7. Solution **(3, 7)**.

**Elimination**
2x + 3y = 13 and 4x − 3y = 5
Add the equations: 6x = 18 → x = 3 → 2(3) + 3y = 13 → y = 7/3.

**Special cases**
- Parallel lines (same slope, different intercept) → **no solution**
- Same line → **infinitely many solutions**

**Application:** Adult tickets cost $8 and child tickets $5. 120 tickets sold for $750.
a + c = 120 and 8a + 5c = 750 → 8a + 5(120 − a) = 750 → 3a = 150 → **a = 50, c = 70**.`,
            questions: [
              mc("Solve: y = x + 2 and y = 3x − 4", "(3, 5)", ["(2, 4)", "(5, 3)", "(1, 3)"], "x + 2 = 3x − 4 → 6 = 2x → x = 3, y = 5."),
              num("Solve by elimination: x + y = 10 and x − y = 4. What is x?", 7, "Add: 2x = 14, x = 7 (and y = 3)."),
              mc("How many solutions does y = 2x + 3, y = 2x − 1 have?", "No solution", ["One", "Infinitely many"], "Same slope, different intercepts: parallel lines never meet."),
              num("A farm has chickens and cows: 30 heads and 74 legs. How many cows?", 7, "c + w = 30 and 2c + 4w = 74 → 2w = 14 → w = 7 cows (23 chickens)."),
            ],
          },
        ],
      },
      {
        title: "Quadratic Equations",
        description: "Factor quadratic expressions and solve quadratic equations.",
        lessons: [
          {
            title: "Factoring Quadratics",
            summary: "Rewrite x² + bx + c as a product of two binomials and solve using the zero product property.",
            objectives: ["Factor trinomials of the form x² + bx + c", "Factor a difference of squares", "Solve quadratic equations by factoring"],
            vocab: [["trinomial", "a polynomial with three terms"], ["zero product property", "if ab = 0, then a = 0 or b = 0"], ["roots / zeros", "solutions of a quadratic equation; x-intercepts of its graph"]],
            standards: [s("HSA.SSE.A.2"), s("HSA.SSE.B.3.A"), s("HSA.REI.B.4.B")],
            body: `
To factor **x² + bx + c**, find two numbers that **multiply to c** and **add to b**.

**x² + 7x + 12** → 3 and 4 (3·4 = 12, 3 + 4 = 7) → **(x + 3)(x + 4)**

**x² − 2x − 15** → −5 and 3 → **(x − 5)(x + 3)**

**Difference of squares:** a² − b² = (a − b)(a + b)
x² − 49 = **(x − 7)(x + 7)**

**Greatest common factor first:** 3x² + 12x = **3x(x + 4)**

**Solving with the zero product property**
x² + x − 20 = 0 → (x + 5)(x − 4) = 0 → x + 5 = 0 or x − 4 = 0 → **x = −5 or x = 4**

Those solutions are the **x-intercepts** of the parabola y = x² + x − 20.`,
            questions: [
              mc("Factor: x² + 9x + 20", "(x + 4)(x + 5)", ["(x + 2)(x + 10)", "(x − 4)(x − 5)", "(x + 9)(x + 20)"], "4 · 5 = 20 and 4 + 5 = 9."),
              mc("Factor: x² − 36", "(x − 6)(x + 6)", ["(x − 6)²", "(x − 18)(x + 2)", "(x − 36)(x + 1)"], "Difference of squares: x² − 6²."),
              mc("Solve: x² − 5x + 6 = 0", "x = 2 or x = 3", ["x = −2 or x = −3", "x = 1 or x = 6", "x = 5 or x = 6"], "(x − 2)(x − 3) = 0."),
              num("The equation x² − 8x + 16 = 0 has one repeated solution. What is it?", 4, "(x − 4)² = 0, so x = 4."),
            ],
          },
          {
            title: "The Quadratic Formula",
            summary: "Solve any quadratic ax² + bx + c = 0, and use the discriminant to predict the number of solutions.",
            objectives: ["Apply the quadratic formula", "Use the discriminant to determine the number of real solutions"],
            vocab: [["quadratic formula", "x = (−b ± √(b² − 4ac)) / 2a"], ["discriminant", "b² − 4ac; tells how many real solutions"]],
            standards: [s("HSA.REI.B.4.A"), s("HSA.REI.B.4.B")],
            body: `
For **ax² + bx + c = 0**:

**x = (−b ± √(b² − 4ac)) / (2a)**

**Example:** 2x² + 3x − 2 = 0 → a = 2, b = 3, c = −2
- b² − 4ac = 9 − 4(2)(−2) = 9 + 16 = 25
- x = (−3 ± 5)/4 → **x = 1/2 or x = −2**

**The discriminant (b² − 4ac)**
| Value | Real solutions | Graph |
|---|---|---|
| Positive | 2 | crosses the x-axis twice |
| Zero | 1 | touches the x-axis once |
| Negative | 0 | never touches the x-axis |

**Application:** A ball's height is h = −16t² + 64t. When does it land? −16t² + 64t = 0 → −16t(t − 4) = 0 → t = 0 (launch) or **t = 4 seconds**.`,
            questions: [
              num("For 3x² − 4x + 5 = 0, what is the discriminant?", -44, "(−4)² − 4(3)(5) = 16 − 60 = −44."),
              mc("How many real solutions does x² + 6x + 9 = 0 have?", "One", ["Two", "None"], "Discriminant = 36 − 36 = 0."),
              mc("Use the quadratic formula to solve x² − 4x − 5 = 0.", "x = 5 or x = −1", ["x = −5 or x = 1", "x = 4 or x = 5", "x = 2 ± √5"], "Discriminant 16 + 20 = 36; x = (4 ± 6)/2."),
              num("The positive solution of x² + 2x − 8 = 0 is…", 2, "(x + 4)(x − 2) = 0, so x = 2 (the other root is −4)."),
            ],
            writtenPrompt: "A rectangular garden is 3 m longer than it is wide and has an area of 70 m². Write a quadratic equation, solve it, and explain why you reject one of the solutions.",
            rubric: "Writes w(w + 3) = 70 or w² + 3w − 70 = 0. Factors (w + 10)(w − 7) = 0 or uses the formula. Finds w = 7, length 10. Rejects w = −10 because a width can't be negative.",
          },
        ],
      },
    ],
  },
  {
    id: "geometry",
    title: "Geometry",
    subject: "mathematics",
    grade: 10,
    framework: CCSS,
    description: "Triangle theorems, similarity, right triangle trigonometry, and circles.",
    units: [
      {
        title: "Triangles",
        description: "Prove and use triangle angle relationships, congruence, and similarity.",
        lessons: [
          {
            title: "Triangle Angle Theorems and Congruence",
            summary: "Interior angles sum to 180°, and SSS, SAS, ASA, AAS, and HL prove triangles congruent.",
            objectives: ["Apply the triangle angle sum and exterior angle theorems", "Identify congruence criteria (SSS, SAS, ASA, AAS, HL)"],
            vocab: [["congruent", "same size and shape"], ["exterior angle", "an angle formed by one side and the extension of an adjacent side"], ["CPCTC", "corresponding parts of congruent triangles are congruent"]],
            standards: [s("HSG.CO.C.10"), s("HSG.CO.B.8"), s("HSG.SRT.B.5")],
            body: `
**Triangle Angle Sum Theorem:** the interior angles of a triangle add to **180°**.
If two angles are 50° and 65°, the third is 180 − 115 = **65°**.

**Exterior Angle Theorem:** an exterior angle equals the **sum of the two remote interior angles**.
Remote interior angles 40° and 75° → exterior angle **115°**.

**Proving triangles congruent**
| Criterion | What matches |
|---|---|
| SSS | three pairs of sides |
| SAS | two sides and the included angle |
| ASA | two angles and the included side |
| AAS | two angles and a non-included side |
| HL | hypotenuse and a leg (right triangles only) |

**Not valid:** SSA (two sides and a non-included angle) and AAA (proves similarity, not congruence).

Once triangles are proven congruent, **CPCTC** lets you conclude any other pair of matching parts is congruent.`,
            questions: [
              num("Two angles of a triangle measure 48° and 77°. What is the third angle in degrees?", 55, "180 − 48 − 77 = 55."),
              num("The remote interior angles are 35° and 60°. What is the exterior angle in degrees?", 95, "35 + 60 = 95."),
              mc("Which is NOT a valid congruence criterion?", "SSA", ["SAS", "ASA", "HL"], "SSA can produce two different triangles (the ambiguous case)."),
              tf("If all three angles of two triangles match (AAA), the triangles must be congruent.", false, "AAA guarantees similarity: same shape, possibly different size."),
            ],
          },
          {
            title: "Similar Triangles",
            summary: "Similar triangles have equal angles and proportional sides.",
            objectives: ["Prove triangles similar using AA, SAS~, and SSS~", "Use proportions to find missing side lengths"],
            vocab: [["similar", "same shape; corresponding angles equal and sides proportional"], ["scale factor", "the ratio of corresponding side lengths"]],
            standards: [s("HSG.SRT.A.2"), s("HSG.SRT.A.3"), s("HSG.SRT.B.5")],
            body: `
Triangles are **similar (~)** when corresponding angles are congruent and corresponding sides are **proportional**.

**Similarity shortcuts**
- **AA:** two pairs of congruent angles (the third pair must match, since angles sum to 180°)
- **SAS~:** two pairs of proportional sides and the included angles congruent
- **SSS~:** all three pairs of sides proportional

**Finding a missing side:** △ABC ~ △DEF with AB = 6, DE = 9, BC = 8. Find EF.
Scale factor = 9/6 = 1.5 → EF = 8 × 1.5 = **12**

**Indirect measurement:** A 6-ft person casts a 4-ft shadow while a tree casts a 30-ft shadow. The sun's rays make similar triangles:
6/4 = h/30 → **h = 45 ft**

**Area scales by the square of the scale factor:** if lengths double, area becomes 4 times as large.`,
            questions: [
              num("△PQR ~ △XYZ. PQ = 5, XY = 15, QR = 7. Find YZ.", 21, "Scale factor 15/5 = 3, so YZ = 7 × 3 = 21."),
              mc("Which is enough to prove two triangles similar?", "Two pairs of congruent angles", ["One pair of congruent angles", "One pair of proportional sides", "Two sides congruent"], "AA similarity."),
              num("A flagpole casts a 24-ft shadow when a 5-ft person casts a 4-ft shadow. How tall is the flagpole in feet?", 30, "5/4 = h/24 → h = 30."),
              num("Two similar triangles have a scale factor of 3. If the smaller has area 10 cm², what is the area of the larger in cm²?", 90, "Area scales by 3² = 9: 10 × 9 = 90."),
            ],
          },
        ],
      },
      {
        title: "Right Triangles and Circles",
        description: "Use trigonometric ratios and circle relationships.",
        lessons: [
          {
            title: "Right Triangle Trigonometry",
            summary: "SOH-CAH-TOA relates the angles of a right triangle to the ratios of its sides.",
            objectives: ["Define sine, cosine, and tangent as ratios", "Use trig ratios to find missing sides and angles"],
            vocab: [["sine", "opposite ÷ hypotenuse"], ["cosine", "adjacent ÷ hypotenuse"], ["tangent", "opposite ÷ adjacent"], ["angle of elevation", "the angle from horizontal up to a line of sight"]],
            standards: [s("HSG.SRT.C.6"), s("HSG.SRT.C.7"), s("HSG.SRT.C.8")],
            body: `
For an acute angle θ in a right triangle:

**SOH-CAH-TOA**
- **sin θ = Opposite / Hypotenuse**
- **cos θ = Adjacent / Hypotenuse**
- **tan θ = Opposite / Adjacent**

**Find a side:** angle 30°, hypotenuse 10, find the opposite side.
sin 30° = x/10 → x = 10 × 0.5 = **5**

**Find an angle:** opposite 7, adjacent 7 → tan θ = 1 → θ = tan⁻¹(1) = **45°**

**Complementary angles:** sin θ = cos(90° − θ). For example, sin 30° = cos 60° = 0.5.

**Angle of elevation:** From 50 m away, the top of a building is at a 40° angle of elevation.
tan 40° = h/50 → h = 50 × 0.839 ≈ **42 m**

**Special triangles**
- 45-45-90: sides x, x, x√2
- 30-60-90: sides x, x√3, 2x`,
            questions: [
              mc("In a right triangle, which ratio is opposite over adjacent?", "tangent", ["sine", "cosine", "secant"], "TOA: tan = opposite/adjacent."),
              num("A right triangle has hypotenuse 20 and a 30° angle. How long is the side opposite the 30° angle?", 10, "sin 30° = 0.5, so 20 × 0.5 = 10."),
              num("If sin θ = 0.6, what is cos(90° − θ)?", 0.6, "sin θ = cos(90° − θ) for complementary angles."),
              num("In a 45-45-90 triangle each leg is 6. What is the hypotenuse? (round to the nearest tenth)", 8.5, "6√2 ≈ 8.49.", { tolerance: 0.05 }),
            ],
          },
          {
            title: "Arcs and Angles in Circles",
            summary: "Central angles equal their arcs; inscribed angles are half their arcs.",
            objectives: ["Relate central angles, inscribed angles, and intercepted arcs", "Find arc length using proportions"],
            vocab: [["central angle", "an angle with its vertex at the center of a circle"], ["inscribed angle", "an angle with its vertex on the circle"], ["arc length", "the distance along an arc: (θ/360) × 2πr"]],
            standards: [s("HSG.C.A.2"), s("HSG.C.B.5")],
            body: `
**Central angle = measure of its intercepted arc.**
A central angle of 80° intercepts an 80° arc.

**Inscribed Angle Theorem:** an inscribed angle is **half** its intercepted arc.
An arc of 100° → inscribed angle **50°**.

**Consequences**
- An angle inscribed in a **semicircle** is a **right angle** (half of 180°).
- Inscribed angles that intercept the same arc are congruent.
- Opposite angles of an inscribed quadrilateral are supplementary.

**Arc length** is a fraction of the circumference:
**L = (θ / 360°) × 2πr**
r = 9, θ = 120° → L = (1/3)(18π) = **6π ≈ 18.8**

**Sector area:** (θ/360°) × πr²`,
            questions: [
              num("An inscribed angle intercepts an arc of 140°. What is the angle in degrees?", 70, "Half of 140 is 70."),
              num("A central angle measures 65°. What is its intercepted arc in degrees?", 65, "Central angles equal their arcs."),
              tf("An angle inscribed in a semicircle is always 90°.", true, "It intercepts a 180° arc, and half of 180° is 90°."),
              mc("What is the exact arc length for a 90° arc in a circle of radius 8?", "4π", ["2π", "8π", "16π"], "(90/360)(2π·8) = (1/4)(16π) = 4π."),
            ],
            writtenPrompt: "Explain, using the Inscribed Angle Theorem, why every triangle drawn with one side as a circle's diameter is a right triangle.",
            rubric: "States that the angle opposite the diameter is an inscribed angle. The diameter intercepts a 180° arc (semicircle). By the Inscribed Angle Theorem the angle is half of 180°, which is 90°. Concludes the triangle is a right triangle.",
          },
        ],
      },
    ],
  },
  {
    id: "algebra-2",
    title: "Algebra II",
    subject: "mathematics",
    grade: 11,
    framework: CCSS,
    description: "Exponential and logarithmic functions, complex numbers, and polynomial division.",
    units: [
      {
        title: "Exponential and Logarithmic Functions",
        description: "Model growth and decay and solve exponential equations with logarithms.",
        lessons: [
          {
            title: "Exponential Growth and Decay",
            summary: "Quantities that change by a constant percent follow y = a(1 ± r)ᵗ.",
            objectives: ["Write exponential models from a context", "Distinguish linear from exponential growth", "Interpret the growth/decay factor"],
            vocab: [["exponential function", "a function of the form y = a·bˣ"], ["growth factor", "b > 1; the multiplier per time period"], ["half-life", "time for a quantity to decay to half its amount"]],
            standards: [s("HSF.LE.A.1"), s("HSF.LE.A.2"), s("HSF.IF.C.8.B")],
            body: `
**Linear** functions change by a constant **amount**. **Exponential** functions change by a constant **factor**.

**y = a(1 + r)ᵗ** (growth) or **y = a(1 − r)ᵗ** (decay)
- a = initial amount
- r = rate as a decimal
- t = number of time periods

**Growth:** $1,000 invested at 5% per year → y = 1000(1.05)ᵗ. After 10 years: 1000(1.05)¹⁰ ≈ **$1,628.89**

**Decay:** A car worth $25,000 loses 15% per year → y = 25000(0.85)ᵗ. After 3 years ≈ **$15,353**

**Half-life:** A 200 mg dose with a half-life of 6 hours → y = 200(1/2)^(t/6). After 18 hours: 200(1/8) = **25 mg**

**Reading a model:** y = 50(1.08)ᵗ has initial value 50 and grows **8%** per period. y = 50(0.92)ᵗ decays 8% per period.`,
            questions: [
              mc("Which function shows exponential decay?", "y = 300(0.75)ᵗ", ["y = 300(1.25)ᵗ", "y = 300 − 0.75t", "y = 0.75t + 300"], "A base between 0 and 1 means decay."),
              num("y = 400(1.06)ᵗ models a population. What is the growth rate in percent?", 6, "1.06 = 1 + 0.06, so 6% per period."),
              num("A 80 g sample has a half-life of 5 years. How many grams remain after 15 years?", 10, "15 years = 3 half-lives: 80 → 40 → 20 → 10."),
              tf("A quantity that increases by 3 every year is growing exponentially.", false, "A constant amount added each period is linear growth."),
            ],
          },
          {
            title: "Logarithms",
            summary: "A logarithm is an exponent: log_b(x) = y means bʸ = x.",
            objectives: ["Convert between exponential and logarithmic form", "Use properties of logarithms", "Solve exponential equations using logarithms"],
            vocab: [["logarithm", "the exponent to which a base must be raised to produce a number"], ["common log", "log base 10, written log x"], ["natural log", "log base e, written ln x"]],
            standards: [s("HSF.LE.A.4"), s("HSF.BF.B.5")],
            body: `
**log_b(x) = y  ⟺  bʸ = x**

- log₂(8) = 3 because 2³ = 8
- log(1000) = 3 because 10³ = 1000
- log₅(1) = 0 because 5⁰ = 1

**Properties**
| Property | Rule |
|---|---|
| Product | log_b(MN) = log_b M + log_b N |
| Quotient | log_b(M/N) = log_b M − log_b N |
| Power | log_b(Mᵏ) = k·log_b M |
| Change of base | log_b x = log x / log b |

**Solving exponential equations:** take the log of both sides.
3ˣ = 50 → x·log 3 = log 50 → x = log 50 / log 3 ≈ **3.56**

**Application:** How long until $1,000 at 5% doubles? 2000 = 1000(1.05)ᵗ → 2 = 1.05ᵗ → t = log 2 / log 1.05 ≈ **14.2 years**`,
            questions: [
              num("Evaluate log₃(81).", 4, "3⁴ = 81."),
              mc("Rewrite 2⁵ = 32 in logarithmic form.", "log₂(32) = 5", ["log₅(32) = 2", "log₃₂(2) = 5", "log₂(5) = 32"], "The base stays the base; the exponent is the log's value."),
              mc("Simplify log(4) + log(25).", "2", ["log(29)", "100", "log(100)²"], "Product rule: log(100) = 2."),
              num("Solve 2ˣ = 64.", 6, "2⁶ = 64."),
            ],
          },
        ],
      },
      {
        title: "Polynomials and Complex Numbers",
        description: "Work with imaginary numbers and divide polynomials.",
        lessons: [
          {
            title: "Complex Numbers",
            summary: "Define i = √−1 and perform arithmetic with a + bi.",
            objectives: ["Simplify powers of i", "Add, subtract, and multiply complex numbers", "Find complex solutions to quadratic equations"],
            vocab: [["imaginary unit (i)", "the number whose square is −1"], ["complex number", "a number of the form a + bi"], ["complex conjugate", "a + bi and a − bi"]],
            standards: [s("HSN.CN.A.1"), s("HSN.CN.A.2"), s("HSN.CN.C.7")],
            body: `
The **imaginary unit** is defined by **i² = −1** (so i = √−1).

**Square roots of negatives:** √−25 = 5i

**Powers of i repeat every 4:** i¹ = i, i² = −1, i³ = −i, i⁴ = 1.
To simplify iⁿ, divide n by 4 and use the remainder: i²³ → 23 = 4·5 + 3 → i³ = **−i**

**Arithmetic with a + bi**
- (3 + 2i) + (1 − 5i) = **4 − 3i**
- (2 + 3i)(4 − i) = 8 − 2i + 12i − 3i² = 8 + 10i + 3 = **11 + 10i**
- (a + bi)(a − bi) = a² + b² — conjugates multiply to a real number.

**Quadratics with no real roots:** x² + 4x + 13 = 0
x = (−4 ± √(16 − 52))/2 = (−4 ± √−36)/2 = **−2 ± 3i**`,
            questions: [
              mc("Simplify i²⁶.", "−1", ["1", "i", "−i"], "26 = 4·6 + 2, so i²⁶ = i² = −1."),
              mc("(5 − 2i) − (3 + 4i) = ?", "2 − 6i", ["2 + 2i", "8 + 2i", "2 − 2i"], "5 − 3 = 2 and −2i − 4i = −6i."),
              num("Multiply (3 + 4i)(3 − 4i). The result is a real number. What is it?", 25, "3² + 4² = 9 + 16 = 25."),
              mc("Solve x² + 9 = 0.", "x = ±3i", ["x = ±3", "x = ±9i", "No solution"], "x² = −9 → x = ±√−9 = ±3i."),
            ],
          },
          {
            title: "Polynomial Division and the Remainder Theorem",
            summary: "Divide polynomials and use P(a) to test for factors.",
            objectives: ["Divide polynomials using long or synthetic division", "Apply the Remainder and Factor Theorems"],
            vocab: [["synthetic division", "a shortcut for dividing by x − a"], ["Remainder Theorem", "the remainder of P(x) ÷ (x − a) is P(a)"], ["Factor Theorem", "x − a is a factor of P(x) exactly when P(a) = 0"]],
            standards: [s("HSA.APR.B.2"), s("HSA.APR.B.3"), s("HSA.APR.D.6")],
            body: `
**Remainder Theorem:** when P(x) is divided by **(x − a)**, the remainder is **P(a)**.

P(x) = x³ − 4x² + x + 6 divided by (x − 2):
P(2) = 8 − 16 + 2 + 6 = **0** → remainder 0.

**Factor Theorem:** if P(a) = 0, then **(x − a) is a factor**. So (x − 2) is a factor of P.

**Synthetic division** (divide by x − 2):
\`\`\`
2 |  1   -4    1    6
  |       2   -4   -6
  -------------------
     1   -2   -3    0
\`\`\`
Quotient: x² − 2x − 3 = (x − 3)(x + 1)

So **P(x) = (x − 2)(x − 3)(x + 1)** with zeros 2, 3, and −1.

**Why it matters:** factoring higher-degree polynomials lets you find every x-intercept of the graph.`,
            questions: [
              num("What is the remainder when x² + 3x − 5 is divided by (x − 2)?", 5, "P(2) = 4 + 6 − 5 = 5."),
              tf("(x + 1) is a factor of x³ + 1.", true, "P(−1) = −1 + 1 = 0."),
              mc("Divide x² − 9x + 20 by (x − 4).", "x − 5", ["x + 5", "x − 4", "x − 16"], "x² − 9x + 20 = (x − 4)(x − 5)."),
              num("If P(3) = 0, which value of a makes (x − a) a factor of P(x)?", 3, "Factor Theorem: x − 3 is a factor."),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "precalculus",
    title: "Precalculus",
    subject: "mathematics",
    grade: 12,
    framework: CCSS,
    description: "The unit circle and trigonometric identities, sequences and series: preparation for calculus.",
    units: [
      {
        title: "Trigonometric Functions",
        description: "Extend trigonometry to all angles using radians and the unit circle.",
        lessons: [
          {
            title: "Radians and the Unit Circle",
            summary: "Measure angles in radians and read sine and cosine from the unit circle.",
            objectives: ["Convert between degrees and radians", "Use the unit circle to evaluate sine and cosine of special angles"],
            vocab: [["radian", "the angle that cuts off an arc equal in length to the radius"], ["unit circle", "a circle of radius 1 centered at the origin"], ["reference angle", "the acute angle between the terminal side and the x-axis"]],
            standards: [s("HSF.TF.A.1"), s("HSF.TF.A.2"), s("HSF.TF.A.3")],
            body: `
A **radian** is the angle whose arc length equals the radius. A full circle is **2π radians = 360°**.

**Converting**
- degrees → radians: multiply by **π/180** (90° = π/2)
- radians → degrees: multiply by **180/π** (5π/6 = 150°)

**The unit circle:** for an angle θ, the point on the circle is **(cos θ, sin θ)**.

| θ | 0 | π/6 | π/4 | π/3 | π/2 |
|---|---|---|---|---|---|
| cos θ | 1 | √3/2 | √2/2 | 1/2 | 0 |
| sin θ | 0 | 1/2 | √2/2 | √3/2 | 1 |

**Other quadrants:** use the reference angle and signs ("All Students Take Calculus": all positive in QI, sine in QII, tangent in QIII, cosine in QIV).
cos(2π/3) = −1/2 (QII, reference π/3)

**Periodicity:** sine and cosine repeat every 2π, so sin(θ + 2π) = sin θ.`,
            questions: [
              mc("Convert 120° to radians.", "2π/3", ["π/3", "3π/4", "4π/3"], "120 × π/180 = 2π/3."),
              num("Convert 3π/4 radians to degrees.", 135, "(3π/4)(180/π) = 135°."),
              num("What is sin(π/2)?", 1, "The point at π/2 on the unit circle is (0, 1)."),
              mc("What is cos(π)?", "−1", ["0", "1", "1/2"], "At π the point is (−1, 0)."),
            ],
          },
          {
            title: "Trigonometric Identities",
            summary: "Use the Pythagorean identity and others to simplify expressions and find exact values.",
            objectives: ["Prove and apply sin²θ + cos²θ = 1", "Find a trig value given another value and the quadrant"],
            vocab: [["identity", "an equation true for all values of the variable"], ["Pythagorean identity", "sin²θ + cos²θ = 1"]],
            standards: [s("HSF.TF.C.8"), s("HSF.TF.C.9")],
            body: `
Because the point (cos θ, sin θ) is on the unit circle x² + y² = 1:

**sin²θ + cos²θ = 1**

Dividing by cos²θ gives **1 + tan²θ = sec²θ**; dividing by sin²θ gives **1 + cot²θ = csc²θ**.

**Finding exact values:** sin θ = 3/5 and θ is in Quadrant II. Find cos θ.
cos²θ = 1 − 9/25 = 16/25 → cos θ = ±4/5 → in QII cosine is negative → **cos θ = −4/5**

**Simplifying:** (1 − cos²θ)/sin θ = sin²θ/sin θ = **sin θ**

**Sum formulas** (used for exact values like 75°):
- sin(A + B) = sin A cos B + cos A sin B
- cos(A + B) = cos A cos B − sin A sin B
sin 75° = sin(45° + 30°) = (√6 + √2)/4`,
            questions: [
              num("If cos θ = 0.8 and θ is in Quadrant I, what is sin θ?", 0.6, "sin²θ = 1 − 0.64 = 0.36, sin θ = 0.6."),
              mc("Simplify sin²x + cos²x + tan²x.", "sec²x", ["1", "2", "csc²x"], "sin²x + cos²x = 1, and 1 + tan²x = sec²x."),
              tf("sin(A + B) = sin A + sin B for all angles A and B.", false, "Example: sin(90°) = 1, but sin 45° + sin 45° ≈ 1.414."),
              mc("If sin θ = −5/13 in Quadrant III, what is cos θ?", "−12/13", ["12/13", "−5/12", "5/12"], "cos² = 1 − 25/169 = 144/169; cosine is negative in QIII."),
            ],
          },
        ],
      },
      {
        title: "Sequences and Series",
        description: "Model patterns with arithmetic and geometric sequences and sum them.",
        lessons: [
          {
            title: "Arithmetic and Geometric Sequences",
            summary: "Arithmetic sequences add a constant; geometric sequences multiply by one.",
            objectives: ["Write explicit and recursive formulas", "Identify arithmetic vs. geometric sequences"],
            vocab: [["arithmetic sequence", "each term adds a common difference d"], ["geometric sequence", "each term multiplies by a common ratio r"], ["explicit formula", "a rule that gives the nth term directly"]],
            standards: [s("HSF.BF.A.2"), s("HSF.IF.A.3"), s("HSF.LE.A.2")],
            body: `
**Arithmetic:** add the same **common difference d**.
5, 8, 11, 14, … (d = 3)
**aₙ = a₁ + (n − 1)d** → a₂₀ = 5 + 19(3) = **62**

**Geometric:** multiply by the same **common ratio r**.
3, 6, 12, 24, … (r = 2)
**aₙ = a₁ · rⁿ⁻¹** → a₁₀ = 3 · 2⁹ = **1,536**

**Recursive form** describes each term from the previous one:
- arithmetic: aₙ = aₙ₋₁ + 3, a₁ = 5
- geometric: aₙ = 2·aₙ₋₁, a₁ = 3

**Connection to functions:** arithmetic sequences are linear functions on the whole numbers; geometric sequences are exponential functions.

**Test:** check whether consecutive terms have a constant **difference** (arithmetic) or a constant **ratio** (geometric).`,
            questions: [
              num("Find the 15th term of 7, 11, 15, 19, …", 63, "a₁₅ = 7 + 14(4) = 63."),
              num("Find the 6th term of 2, 6, 18, 54, …", 486, "a₆ = 2 · 3⁵ = 486."),
              mc("Which sequence is geometric?", "100, 50, 25, 12.5, …", ["1, 4, 9, 16, …", "10, 7, 4, 1, …", "2, 4, 7, 11, …"], "Each term is multiplied by 1/2."),
              num("An arithmetic sequence has a₁ = 4 and a₁₀ = 31. What is d?", 3, "31 = 4 + 9d → d = 3."),
            ],
          },
          {
            title: "Series and Sums",
            summary: "Add the terms of a sequence, and find when an infinite geometric series converges.",
            objectives: ["Find sums of finite arithmetic and geometric series", "Determine when an infinite geometric series has a sum and compute it"],
            vocab: [["series", "the sum of the terms of a sequence"], ["sigma notation", "Σ, a compact way to write a sum"], ["converge", "approach a finite value"]],
            standards: [s("HSA.SSE.B.4")],
            body: `
**Finite arithmetic series:** Sₙ = n(a₁ + aₙ)/2
1 + 2 + 3 + … + 100 = 100(1 + 100)/2 = **5,050**

**Finite geometric series:** Sₙ = a₁(1 − rⁿ)/(1 − r)
3 + 6 + 12 + … (8 terms) = 3(1 − 2⁸)/(1 − 2) = 3(255) = **765**

**Infinite geometric series:** if **|r| < 1**, the terms shrink toward 0 and the series **converges**:
**S = a₁ / (1 − r)**
1/2 + 1/4 + 1/8 + … = (1/2)/(1 − 1/2) = **1**

If |r| ≥ 1, the series **diverges** (has no finite sum).

**Repeating decimals:** 0.333… = 3/10 + 3/100 + … = (3/10)/(1 − 1/10) = **1/3**

**Looking ahead:** infinite sums are the heart of calculus — limits, integrals, and Taylor series.`,
            questions: [
              num("Find the sum 2 + 4 + 6 + … + 40.", 420, "20 terms: 20(2 + 40)/2 = 420."),
              num("Find the sum of the infinite series 9 + 3 + 1 + 1/3 + …", 13.5, "a₁ = 9, r = 1/3: 9/(2/3) = 13.5."),
              tf("The infinite series 1 + 2 + 4 + 8 + … has a finite sum.", false, "r = 2, so |r| ≥ 1 and the series diverges."),
              num("Find the sum of the first 5 terms of 1, 3, 9, 27, …", 121, "(1 − 3⁵)/(1 − 3) = (1 − 243)/(−2) = 121."),
            ],
            writtenPrompt: "A ball is dropped from 10 m and each bounce reaches 60% of the previous height. Find the total vertical distance the ball travels before it comes to rest. Explain your series.",
            rubric: "Initial drop 10 m. Each bounce goes up and down: 2 × (6 + 3.6 + 2.16 + …). Uses an infinite geometric series with a₁ = 6, r = 0.6: sum = 6/0.4 = 15, doubled is 30. Total = 10 + 30 = 40 m. Explains that the series converges because |r| < 1.",
          },
        ],
      },
    ],
  },
];
