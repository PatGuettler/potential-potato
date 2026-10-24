import { mc, num, short, tf, type UnitSpec } from "../dsl";

const s = (code: string) => `CCSS.MATH.CONTENT.${code}`;

export const mathElementaryExt: Record<string, UnitSpec[]> = {
  "math-k": [
    {
      title: "Shapes and Measurement",
      description: "Name flat and solid shapes and compare objects by length and weight.",
      lessons: [
        {
          title: "Flat Shapes and Solid Shapes",
          summary: "Circles, squares, and triangles are flat. Cubes, cones, and spheres are solid.",
          objectives: ["Name circles, triangles, squares, rectangles, and hexagons", "Tell flat (2D) shapes from solid (3D) shapes"],
          vocab: [["flat shape", "a shape you can draw on paper"], ["solid shape", "a shape you can hold, like a ball or a box"], ["side", "a straight line on a shape"], ["corner", "where two sides meet"]],
          standards: [s("K.G.A.2"), s("K.G.A.3"), s("K.G.B.4")],
          body: `
**Flat shapes** lie flat, like a drawing.
- **Circle:** round, no corners
- **Triangle:** 3 sides, 3 corners
- **Square:** 4 equal sides, 4 corners
- **Rectangle:** 4 sides, 4 corners, two long sides and two short sides
- **Hexagon:** 6 sides, 6 corners

**Solid shapes** you can hold.
- **Sphere:** a ball
- **Cube:** a block or a die
- **Cylinder:** a can
- **Cone:** an ice cream cone

**Shape hunt!** A clock is a circle. A door is a rectangle. A ball is a sphere.

Turning a shape doesn't change it: a triangle upside down is still a triangle.`,
          questions: [
            num("How many sides does a triangle have?", 3, "Tri means three: 3 sides and 3 corners."),
            mc("Which shape is a solid shape?", "Ball (sphere)", ["Circle", "Square", "Triangle"], "You can hold a ball; it is a solid shape."),
            mc("A soup can is shaped like a…", "Cylinder", ["Cone", "Cube", "Sphere"], "A can has two flat circles and a curved side."),
            tf("A square turned on its corner is still a square.", true, "Turning a shape doesn't change what it is."),
          ],
        },
        {
          title: "Comparing Length and Weight",
          summary: "Compare two objects to see which is longer, shorter, heavier, or lighter.",
          objectives: ["Compare lengths by lining objects up", "Compare weights using a balance"],
          vocab: [["longer", "goes farther from end to end"], ["heavier", "pulls down more on a balance"]],
          standards: [s("K.MD.A.1"), s("K.MD.A.2")],
          body: `
**Comparing length:** line up two objects at the **same starting point**.
✏️ pencil
🖍️ crayon
The pencil sticks out farther, so the pencil is **longer** and the crayon is **shorter**.

**Comparing weight:** use a **balance scale**.
- The side that goes **down** is **heavier**.
- The side that goes **up** is **lighter**.
- If it stays level, they weigh the **same**.

**Big isn't always heavy!** A big balloon is light. A small rock can be heavy.`,
          questions: [
            mc("To compare two pencils, you should…", "line them up at the same starting point", ["hold them far apart", "look at their colors", "smell them"], "Starting together lets you see which one sticks out farther."),
            mc("On a balance, the heavier side goes…", "down", ["up", "sideways"], "Heavier objects pull the balance down."),
            tf("A big balloon must be heavier than a small rock.", false, "Size and weight are different. Balloons are big but light."),
            mc("A rope is longer than a shoelace. Which is shorter?", "The shoelace", ["The rope", "They are the same"], "If the rope is longer, the shoelace is shorter."),
          ],
        },
      ],
    },
    {
      title: "Numbers to 100",
      description: "Understand teen numbers and count to 100 by ones and tens.",
      lessons: [
        {
          title: "Teen Numbers: Ten and Some More",
          summary: "Numbers 11 to 19 are one ten and some ones.",
          objectives: ["Show teen numbers as ten ones and some more ones", "Write equations like 10 + 4 = 14"],
          vocab: [["ten", "a group of 10 ones"], ["ones", "single things not in a group of ten"]],
          standards: [s("K.NBT.A.1")],
          body: `
Fill a **ten-frame** with 10 dots. Then add more dots outside.

**14** = a full ten-frame and **4** more → **10 + 4 = 14**

| Number | Ten and ones |
|---|---|
| 11 | 10 + 1 |
| 15 | 10 + 5 |
| 18 | 10 + 8 |
| 19 | 10 + 9 |

**The 1 in a teen number means one ten.** The second digit tells how many extra ones.

**Fingers trick:** show 10 fingers, then ask a friend to show the extra ones.`,
          questions: [
            num("10 + 6 = ?", 16, "One ten and six ones make 16."),
            mc("17 is ten and how many more?", "7", ["1", "10", "17"], "17 = 10 + 7."),
            num("What number is a full ten-frame and 2 more?", 12, "10 + 2 = 12."),
            mc("Which shows 13?", "10 + 3", ["3 + 1", "10 + 13", "1 + 3"], "13 is one ten and three ones."),
          ],
        },
        {
          title: "Counting to 100",
          summary: "Count to 100 by ones and by tens, and count on from any number.",
          objectives: ["Count to 100 by tens", "Count forward from a number other than 1"],
          vocab: [["count by tens", "10, 20, 30, …"], ["count on", "start at a number and keep counting"]],
          standards: [s("K.CC.A.1"), s("K.CC.A.2")],
          body: `
**Counting by tens:** 10, 20, 30, 40, 50, 60, 70, 80, 90, **100**!
That's 10 jumps of ten.

**Counting on:** you don't always have to start at 1. Start at **26**: 27, 28, 29, **30**, 31…

**After 9 comes a new ten.** 29 → 30, 59 → 60, 99 → 100.

**Hundred chart:** numbers go across in rows of 10. Going **down** one row adds **10**.

**Try it:** clap and count to 100 by tens, then count on from 47 to 55.`,
            questions: [
            mc("What comes next? 10, 20, 30, 40, …", "50", ["41", "45", "60"], "Counting by tens: 40 then 50."),
            num("What number comes right after 59?", 60, "After 9 ones comes a new ten: 60."),
            num("How many tens make 100?", 10, "10, 20, … 100 is ten jumps."),
            mc("Count on from 37: 38, 39, …", "40", ["30", "41", "310"], "39 is followed by 40."),
          ],
        },
      ],
    },
  ],
  "math-1": [
    {
      title: "Measurement and Data",
      description: "Measure length with units and organize data in charts.",
      lessons: [
        {
          title: "Measuring Length with Units",
          summary: "Measure by lining up same-size units end to end with no gaps.",
          objectives: ["Order three objects by length", "Measure length with same-size units"],
          vocab: [["unit", "a same-size piece used to measure"], ["length", "how long something is"]],
          standards: [s("1.MD.A.1"), s("1.MD.A.2")],
          body: `
To measure, line up **same-size units** (like paper clips or cubes) **end to end**.

**Rules for measuring**
1. Start at one end of the object.
2. No gaps between units.
3. No overlapping.
4. Count the units.

A pencil that is as long as **6 paper clips** is 6 paper clips long.

**Different units, different numbers.** The same pencil might be 6 paper clips long but only 3 crayons long, because crayons are bigger units.

**Ordering:** a book is longer than a crayon, and a crayon is longer than a paper clip, so the book is longer than the paper clip too.`,
          questions: [
            mc("When measuring with cubes, the cubes should…", "touch end to end with no gaps", ["have big gaps", "overlap", "be different sizes"], "Gaps or overlaps make the measurement wrong."),
            num("A ribbon is as long as 8 cubes. How many cubes long is it?", 8, "Count the units: 8."),
            mc("A shoe is 4 crayons long or 8 paper clips long. Why are the numbers different?", "Crayons are longer units than paper clips", ["The shoe changed size", "Someone counted wrong", "Paper clips are bigger"], "Bigger units mean fewer of them."),
            tf("If a rope is longer than a stick and the stick is longer than a pencil, the rope is longer than the pencil.", true, "Comparing through a middle object works."),
          ],
        },
        {
          title: "Organizing and Reading Data",
          summary: "Sort information into groups and answer questions with tally charts.",
          objectives: ["Organize data into up to three categories", "Answer how many, how many more, and how many less questions"],
          vocab: [["data", "information we collect"], ["tally mark", "a line used to count; |||| with a slash means 5"]],
          standards: [s("1.MD.C.4")],
          body: `
The class voted for a favorite fruit:

| Fruit | Tally | Total |
|---|---|---|
| 🍎 Apple | IIII/ III | 8 |
| 🍌 Banana | IIII/ | 5 |
| 🍇 Grapes | III | 3 |

**Reading the chart**
- Most votes: **apple** (8)
- Fewest votes: **grapes** (3)
- How many more chose apple than banana? 8 − 5 = **3**
- How many votes in all? 8 + 5 + 3 = **16**

**Tally tip:** draw four lines, then a slash for the fifth (IIII/). That makes groups of 5 easy to count.`,
          questions: [
            num("Using the chart, how many students chose banana?", 5, "The banana total is 5."),
            num("How many more students chose apple than grapes?", 5, "8 − 3 = 5."),
            num("How many students voted in all?", 16, "8 + 5 + 3 = 16."),
            mc("A tally of four lines with a slash (IIII/) shows…", "5", ["4", "6", "10"], "The slash is the fifth mark."),
          ],
        },
      ],
    },
    {
      title: "Adding and Subtracting Tens",
      description: "Use place value to add within 100 and find ten more or ten less.",
      lessons: [
        {
          title: "Adding Tens and Ones",
          summary: "Add tens to tens and ones to ones.",
          objectives: ["Add a two-digit number and a one-digit number", "Add a two-digit number and a multiple of 10"],
          vocab: [["place value", "the value of a digit based on its place"], ["multiple of ten", "10, 20, 30, …"]],
          standards: [s("1.NBT.C.4")],
          body: `
**Add like places:** tens with tens, ones with ones.

**34 + 20**
- Tens: 3 tens + 2 tens = 5 tens
- Ones: 4
- **54**

**45 + 3**
- Tens: 4 tens
- Ones: 5 + 3 = 8
- **48**

**Making a new ten:** 27 + 5 → 7 + 5 = 12 ones, which is 1 ten and 2 ones. So 2 tens + 1 ten = 3 tens, and **27 + 5 = 32**.

Base-ten blocks help: trade 10 small cubes for 1 rod.`,
          questions: [
            num("52 + 30 = ?", 82, "5 tens + 3 tens = 8 tens; 2 ones. 82."),
            num("61 + 7 = ?", 68, "1 + 7 = 8 ones; 6 tens stay. 68."),
            num("38 + 6 = ?", 44, "8 + 6 = 14 = 1 ten 4 ones. 3 + 1 = 4 tens. 44."),
            num("40 + 40 = ?", 80, "4 tens + 4 tens = 8 tens."),
          ],
        },
        {
          title: "Ten More and Ten Less",
          summary: "Adding or subtracting 10 changes only the tens digit.",
          objectives: ["Find 10 more or 10 less than a number mentally", "Subtract multiples of 10"],
          vocab: [["ten more", "add 10; the tens digit goes up by 1"], ["ten less", "subtract 10; the tens digit goes down by 1"]],
          standards: [s("1.NBT.C.5"), s("1.NBT.C.6")],
          body: `
When you add or subtract **10**, only the **tens** digit changes!

| Number | 10 less | 10 more |
|---|---|---|
| 46 | 36 | 56 |
| 72 | 62 | 82 |
| 15 | 5 | 25 |

**On a hundred chart,** move **down** a row for 10 more and **up** a row for 10 less.

**Subtracting tens:** 80 − 30 → 8 tens − 3 tens = **5 tens = 50**.

**Why does it work?** 10 is one ten, so you're adding or taking away one rod of base-ten blocks. The loose ones don't change.`,
          questions: [
            num("What is 10 more than 47?", 57, "The tens digit goes from 4 to 5."),
            num("What is 10 less than 83?", 73, "The tens digit goes from 8 to 7."),
            num("90 − 40 = ?", 50, "9 tens − 4 tens = 5 tens."),
            tf("10 more than 29 is 39.", true, "2 tens becomes 3 tens; the 9 ones stay."),
          ],
        },
      ],
    },
  ],
  "math-2": [
    {
      title: "Time and Data",
      description: "Tell time to five minutes and make picture and bar graphs.",
      lessons: [
        {
          title: "Telling Time to Five Minutes",
          summary: "Each number on the clock stands for 5 minutes on the minute hand.",
          objectives: ["Tell and write time to the nearest five minutes", "Use a.m. and p.m."],
          vocab: [["a.m.", "times from midnight to noon"], ["p.m.", "times from noon to midnight"], ["quarter past", "15 minutes after the hour"]],
          standards: [s("2.MD.C.7")],
          body: `
The **minute hand** counts by **fives** as it moves from number to number:
1 → 5 min, 2 → 10, 3 → 15, 4 → 20, … 11 → 55, 12 → 0 (o'clock)

**Reading 3:25**
- The hour hand is just past **3**.
- The minute hand points at **5** → 5 × 5 = **25** minutes.

**Special names**
- :15 → quarter past
- :30 → half past
- :45 → quarter to the next hour

**a.m. or p.m.?** Breakfast at 7:00 **a.m.** Dinner at 6:00 **p.m.**`,
          questions: [
            num("The minute hand points at 4. How many minutes past the hour is it?", 20, "4 × 5 = 20 minutes."),
            mc("The hour hand is just past 9 and the minute hand points at 9. What time is it?", "9:45", ["9:09", "9:30", "10:45"], "The 9 on the minute side is 45 minutes."),
            mc("Lunch at noon happens at 12:00…", "p.m.", ["a.m."], "Noon starts the p.m. hours."),
            mc("Quarter past 2 is…", "2:15", ["2:25", "2:45", "1:45"], "Quarter past means 15 minutes after."),
          ],
        },
        {
          title: "Picture Graphs and Bar Graphs",
          summary: "Draw and read graphs to compare data.",
          objectives: ["Draw a picture graph and a bar graph with up to four categories", "Solve put-together, take-apart, and compare problems using graphs"],
          vocab: [["bar graph", "a graph that uses bars to show amounts"], ["scale", "the numbers along the side of a bar graph"], ["key", "tells what each picture stands for"]],
          standards: [s("2.MD.D.10")],
          body: `
**Bar graph: pets in our class**
| Pet | Students |
|---|---|
| Dog | 9 |
| Cat | 6 |
| Fish | 3 |
| None | 4 |

Read a bar by looking at where it ends on the **scale**.

**Questions a graph answers**
- Which is most popular? Dog (9)
- How many more chose dog than cat? 9 − 6 = **3**
- How many students in all? 9 + 6 + 3 + 4 = **22**

**Picture graphs** use a symbol for each item. If the **key** says 🐾 = 2 pets, then 🐾🐾🐾 means **6** pets.`,
          questions: [
            num("Using the table, how many more students have a dog than fish?", 6, "9 − 3 = 6."),
            num("How many students are in the class in all?", 22, "9 + 6 + 3 + 4 = 22."),
            num("A key says each ⭐ = 2 books. How many books do ⭐⭐⭐⭐ stand for?", 8, "4 stars × 2 = 8."),
            mc("On a bar graph, the numbers along the side are called the…", "scale", ["key", "title", "tally"], "The scale tells how much each bar shows."),
          ],
        },
      ],
    },
    {
      title: "Toward Multiplication and Fractions",
      description: "Explore odd and even numbers, arrays, and equal shares.",
      lessons: [
        {
          title: "Odd, Even, and Arrays",
          summary: "Even numbers make pairs; arrays show equal rows.",
          objectives: ["Determine whether a group has an odd or even number of objects", "Use addition to find the total in an array"],
          vocab: [["even", "can be split into pairs with none left over"], ["odd", "one is left over when you make pairs"], ["array", "objects in equal rows and columns"]],
          standards: [s("2.OA.C.3"), s("2.OA.C.4")],
          body: `
**Odd or even?** Pair up the objects.
- 8 socks → 4 pairs, none left → **even**
- 7 socks → 3 pairs and 1 left over → **odd**

**Shortcut:** look at the ones digit.
- Ends in 0, 2, 4, 6, 8 → **even**
- Ends in 1, 3, 5, 7, 9 → **odd**

Every even number is a **doubles fact**: 6 = 3 + 3.

**Arrays:** 3 rows of 4 stars
⭐⭐⭐⭐
⭐⭐⭐⭐
⭐⭐⭐⭐
Add the rows: 4 + 4 + 4 = **12**. This is the start of multiplication!`,
          questions: [
            mc("Is 15 odd or even?", "Odd", ["Even"], "It ends in 5, so one is left over when pairing."),
            mc("Which number is even?", "36", ["21", "45", "17"], "36 ends in 6."),
            num("An array has 4 rows of 5 apples. How many apples?", 20, "5 + 5 + 5 + 5 = 20."),
            tf("Every even number can be written as a doubles fact.", true, "Even numbers split into two equal groups, like 8 = 4 + 4."),
          ],
        },
        {
          title: "Shapes and Equal Shares",
          summary: "Identify shapes by their attributes and split them into halves, thirds, and fourths.",
          objectives: ["Recognize triangles, quadrilaterals, pentagons, hexagons, and cubes by their attributes", "Partition shapes into halves, thirds, and fourths"],
          vocab: [["quadrilateral", "a shape with 4 sides"], ["third", "one of 3 equal shares"], ["angle", "the corner where two sides meet"]],
          standards: [s("2.G.A.1"), s("2.G.A.3")],
          body: `
**Shapes are named by their sides and angles.**
| Shape | Sides | Angles |
|---|---|---|
| Triangle | 3 | 3 |
| Quadrilateral | 4 | 4 |
| Pentagon | 5 | 5 |
| Hexagon | 6 | 6 |

Squares, rectangles, and trapezoids are all **quadrilaterals**.

**Equal shares**
- 2 equal parts → **halves**
- 3 equal parts → **thirds**
- 4 equal parts → **fourths**

**Equal shares don't have to be the same shape.** A square cut corner-to-corner makes two triangle halves; cut down the middle it makes two rectangle halves. Both are halves!

A whole is **2 halves**, **3 thirds**, or **4 fourths**.`,
            questions: [
            num("How many sides does a pentagon have?", 5, "Penta means five."),
            mc("A shape with 4 sides is a…", "quadrilateral", ["pentagon", "hexagon", "triangle"], "Quad means four."),
            num("How many thirds make a whole?", 3, "Three equal thirds make one whole."),
            tf("Two halves of the same square can be different shapes but still be equal shares.", true, "Triangle halves and rectangle halves of a square have the same area."),
          ],
        },
      ],
    },
  ],
  "math-3": [
    {
      title: "Multiplication Strategies",
      description: "Use properties of operations and solve two-step word problems.",
      lessons: [
        {
          title: "Properties of Multiplication",
          summary: "Commutative, associative, and distributive properties make hard facts easy.",
          objectives: ["Apply the commutative, associative, and distributive properties", "Use known facts to find unknown facts"],
          vocab: [["commutative property", "a × b = b × a"], ["associative property", "(a × b) × c = a × (b × c)"], ["distributive property", "a × (b + c) = a × b + a × c"]],
          standards: [s("3.OA.B.5"), s("3.OA.C.7")],
          body: `
**Commutative:** order doesn't matter. 6 × 4 = 4 × 6 = 24.

**Associative:** grouping doesn't matter. 3 × 5 × 2 = 3 × (5 × 2) = 3 × 10 = **30**. Look for a pair that makes 10!

**Distributive:** break a hard fact into easier facts.
**7 × 8** = 7 × (5 + 3) = (7 × 5) + (7 × 3) = 35 + 21 = **56**

**8 × 6** = (8 × 5) + (8 × 1) = 40 + 8 = **48**

**Using what you know:** If you know 6 × 6 = 36, then 6 × 7 = 36 + 6 = **42** (one more group of 6).

These properties are why you only need to memorize about half the times table.`,
          questions: [
            num("Use the distributive property: 9 × 7 = (9 × 5) + (9 × 2) = ?", 63, "45 + 18 = 63."),
            mc("Which shows the associative property?", "(2 × 5) × 4 = 2 × (5 × 4)", ["2 × 5 = 5 × 2", "2 × (5 + 4) = 10 + 8", "2 + 5 = 5 + 2"], "Only the grouping changes."),
            num("If 7 × 7 = 49, what is 7 × 8?", 56, "One more group of 7: 49 + 7 = 56."),
            num("Find 4 × 5 × 2 by grouping 5 × 2 first.", 40, "5 × 2 = 10, and 4 × 10 = 40."),
          ],
        },
        {
          title: "Two-Step Word Problems",
          summary: "Solve problems that take two operations, and check if the answer is reasonable.",
          objectives: ["Solve two-step problems using all four operations", "Represent problems with an equation using a letter for the unknown"],
          vocab: [["unknown", "the number you're trying to find"], ["estimate", "a close guess to check if an answer makes sense"]],
          standards: [s("3.OA.D.8")],
          body: `
**Step 1:** What do you need to find? **Step 2:** What do you need to find first?

**Example:** Maya buys 3 packs of 8 stickers. She gives away 5. How many does she have?
- First: 3 × 8 = 24 stickers
- Then: 24 − 5 = **19** stickers
- Equation: (3 × 8) − 5 = s → **s = 19**

**Example:** 42 cookies are shared equally by 6 kids. Each kid eats 2. How many cookies does each kid have left?
- 42 ÷ 6 = 7, then 7 − 2 = **5**

**Is it reasonable?** 3 × 8 is about 3 × 10 = 30; minus 5 is about 25. 19 is in the right neighborhood. ✓`,
          questions: [
            num("A box holds 4 rows of 6 crayons. 7 crayons are broken. How many are not broken?", 17, "4 × 6 = 24; 24 − 7 = 17."),
            num("Sam has $50. He buys 3 books for $9 each. How many dollars are left?", 23, "3 × 9 = 27; 50 − 27 = 23."),
            num("36 students ride in 4 vans equally. 2 students in each van are teachers' helpers. How many in each van are not helpers?", 7, "36 ÷ 4 = 9; 9 − 2 = 7."),
            mc("Which equation matches: 5 bags of 6 apples, then 4 more apples?", "(5 × 6) + 4 = a", ["5 + 6 + 4 = a", "(5 + 6) × 4 = a", "5 × (6 + 4) = a"], "First 5 groups of 6, then add 4."),
          ],
        },
      ],
    },
    {
      title: "Measurement",
      description: "Solve problems with time intervals, liquid volume, and mass.",
      lessons: [
        {
          title: "Elapsed Time",
          summary: "Find how much time passes using a number line or a clock.",
          objectives: ["Tell time to the nearest minute", "Solve elapsed-time problems with a number line"],
          vocab: [["elapsed time", "how much time passes from start to end"], ["number line", "a line marked with numbers used to count jumps"]],
          standards: [s("3.MD.A.1")],
          body: `
**Elapsed time** is how long something takes.

**Example:** Soccer starts at 3:20 and ends at 4:05. How long is practice?
Use a number line with jumps:
- 3:20 → 4:00 is **40 minutes**
- 4:00 → 4:05 is **5 minutes**
- Total: **45 minutes**

**Finding an end time:** A movie starts at 6:45 and lasts 1 hour 30 minutes.
- 6:45 + 1 hour = 7:45
- 7:45 + 30 minutes = **8:15**

**Tip:** jump to the next whole hour first. Remember there are **60 minutes in an hour**, not 100!`,
          questions: [
            num("Lunch starts at 11:40 and ends at 12:10. How many minutes is lunch?", 30, "11:40 → 12:00 is 20 min, plus 10 = 30."),
            mc("A trip starts at 9:15 and takes 2 hours 15 minutes. When does it end?", "11:30", ["11:15", "11:00", "12:30"], "9:15 + 2 h = 11:15, + 15 min = 11:30."),
            num("How many minutes are in one hour?", 60, "60 minutes = 1 hour."),
            num("Reading time runs from 2:50 to 3:35. How many minutes?", 45, "10 minutes to 3:00, then 35 more: 45."),
          ],
        },
        {
          title: "Liquid Volume and Mass",
          summary: "Measure liquids in liters and mass in grams and kilograms.",
          objectives: ["Estimate and measure liquid volume in liters", "Estimate and measure mass in grams and kilograms", "Solve one-step problems with volume and mass"],
          vocab: [["liter (L)", "a metric unit of liquid volume, about a large water bottle"], ["gram (g)", "a small unit of mass, about a paper clip"], ["kilogram (kg)", "1,000 grams, about a textbook"]],
          standards: [s("3.MD.A.2")],
          body: `
**Liquid volume** is how much liquid a container holds.
- A large water bottle holds about **1 liter (L)**.
- A bathtub holds about 150 liters.

**Mass** is how much matter is in an object.
- A paper clip ≈ **1 gram (g)**
- A pineapple ≈ **1 kilogram (kg)**
- **1 kg = 1,000 g**

**Choosing a unit:** use grams for light things (a pencil) and kilograms for heavy things (a dog).

**Problems:** A pitcher holds 3 L. How much do 4 pitchers hold? 4 × 3 = **12 L**.
A bag of apples has a mass of 2 kg and a bag of oranges 5 kg. Together: **7 kg**.`,
          questions: [
            mc("Which is the best unit for the mass of a horse?", "kilograms", ["grams", "liters", "centimeters"], "A horse is very heavy, so use kilograms."),
            num("How many grams are in 1 kilogram?", 1000, "Kilo means thousand."),
            num("Each jug holds 4 liters. How many liters do 5 jugs hold?", 20, "5 × 4 = 20 L."),
            mc("About how much liquid does a large water bottle hold?", "1 liter", ["1 gram", "100 liters", "1 kilogram"], "Liters measure liquid volume; a big bottle is about 1 L."),
          ],
        },
      ],
    },
  ],
  "math-4": [
    {
      title: "Rounding and Division",
      description: "Round multi-digit numbers and divide with remainders.",
      lessons: [
        {
          title: "Place Value and Rounding",
          summary: "Each place is ten times the place to its right. Round using the digit to the right.",
          objectives: ["Read and compare multi-digit numbers", "Round multi-digit numbers to any place"],
          vocab: [["round", "find a nearby, simpler number"], ["expanded form", "a number written as the sum of each digit's value"]],
          standards: [s("4.NBT.A.1"), s("4.NBT.A.2"), s("4.NBT.A.3")],
          body: `
In 47,382:
| Ten thousands | Thousands | Hundreds | Tens | Ones |
|---|---|---|---|---|
| 4 | 7 | 3 | 8 | 2 |

Each place is **10 times** the place to its right: the 7 is worth 7,000, which is 10 times 700.

**Rounding rule:** look at the digit to the **right** of the place you're rounding to.
- 5 or more → round **up**
- 4 or less → round **down**

**47,382 rounded to the nearest thousand:** the hundreds digit is 3 → round down → **47,000**
**47,382 to the nearest hundred:** tens digit is 8 → round up → **47,400**

**Why round?** To estimate quickly: 4,890 + 3,120 ≈ 5,000 + 3,000 = 8,000.`,
          questions: [
            num("Round 6,749 to the nearest hundred.", 6700, "The tens digit is 4, so round down."),
            num("Round 38,512 to the nearest thousand.", 39000, "The hundreds digit is 5, so round up."),
            num("What is the value of the 6 in 562,014?", 60000, "The 6 is in the ten-thousands place."),
            tf("In 3,333, the 3 in the thousands place is worth 10 times the 3 in the hundreds place.", true, "3,000 is 10 × 300."),
          ],
        },
        {
          title: "Dividing with Remainders",
          summary: "Divide multi-digit numbers and interpret what the remainder means.",
          objectives: ["Divide up to four-digit dividends by one-digit divisors", "Interpret remainders in word problems"],
          vocab: [["remainder", "what is left over after dividing equally"], ["quotient", "the answer to a division problem"]],
          standards: [s("4.NBT.B.6"), s("4.OA.A.3")],
          body: `
**Divide place by place** (partial quotients):
**852 ÷ 4**
- 800 ÷ 4 = 200
- 40 ÷ 4 = 10
- 12 ÷ 4 = 3
- 200 + 10 + 3 = **213**

**Remainders:** 29 ÷ 4 = 7 **R1** (4 × 7 = 28, with 1 left over).

**What do you do with the remainder? It depends on the question!**
- 30 students, 4 per car. How many cars? 30 ÷ 4 = 7 R2 → **8 cars** (round up so everyone rides).
- 30 cookies shared by 4 kids. How many does each get? **7** (the 2 left over aren't shared).
- How many cookies are left? **2** (the remainder is the answer).

**Check:** quotient × divisor + remainder = dividend → 7 × 4 + 2 = 30 ✓`,
          questions: [
            num("936 ÷ 3 = ?", 312, "900 ÷ 3 = 300, 30 ÷ 3 = 10, 6 ÷ 3 = 2."),
            short("What is 47 ÷ 5? Write it like 9 R2.", ["9 R2", "9r2", "9 r 2", "9R2"], "5 × 9 = 45, with 2 left over."),
            num("50 people are going on a trip. Each van holds 8. How many vans are needed?", 7, "50 ÷ 8 = 6 R2, so a 7th van carries the last 2."),
            num("A baker has 75 muffins and packs 6 per box. How many muffins are left over?", 3, "6 × 12 = 72; 75 − 72 = 3."),
          ],
        },
      ],
    },
    {
      title: "Angles and Measurement",
      description: "Measure angles and convert between units.",
      lessons: [
        {
          title: "Angles and Protractors",
          summary: "Angles are measured in degrees; a full turn is 360°.",
          objectives: ["Classify angles as acute, right, obtuse, or straight", "Measure and draw angles with a protractor", "Add angle measures"],
          vocab: [["degree (°)", "the unit for measuring angles; 1/360 of a full turn"], ["acute", "less than 90°"], ["obtuse", "between 90° and 180°"], ["right angle", "exactly 90°"]],
          standards: [s("4.MD.C.5"), s("4.MD.C.6"), s("4.MD.C.7")],
          body: `
An **angle** is made by two rays that share an endpoint (the **vertex**).

**A full turn is 360°.** A quarter turn is 90°.

| Type | Measure | Example |
|---|---|---|
| Acute | less than 90° | a slice of pizza tip |
| Right | exactly 90° | corner of a book |
| Obtuse | 90° to 180° | a reclining chair |
| Straight | exactly 180° | a straight line |

**Using a protractor**
1. Put the center point on the vertex.
2. Line up the 0° line with one ray.
3. Read where the other ray crosses the scale. (Use the scale that starts at 0 on your ray!)

**Angles add:** a 30° angle next to a 45° angle makes a **75°** angle.`,
          questions: [
            mc("An angle of 120° is…", "obtuse", ["acute", "right", "straight"], "Between 90° and 180° is obtuse."),
            num("How many degrees are in a right angle?", 90, "A quarter turn is 90°."),
            num("Two angles of 35° and 55° are side by side. What is the total angle in degrees?", 90, "35 + 55 = 90 (a right angle!)."),
            num("A straight angle is split into two parts. One is 110°. What is the other in degrees?", 70, "180 − 110 = 70."),
          ],
        },
        {
          title: "Converting Units of Measure",
          summary: "Convert larger units to smaller units within one system.",
          objectives: ["Know relative sizes of units (km, m, cm; kg, g; lb, oz; hr, min, sec)", "Convert from a larger unit to a smaller unit"],
          vocab: [["convert", "change from one unit to another"], ["conversion table", "a table showing equal amounts in two units"]],
          standards: [s("4.MD.A.1"), s("4.MD.A.2")],
          body: `
**Larger unit → smaller unit: multiply.**

| Measure | Conversion |
|---|---|
| Length (metric) | 1 km = 1,000 m; 1 m = 100 cm |
| Length (customary) | 1 ft = 12 in; 1 yd = 3 ft |
| Mass / weight | 1 kg = 1,000 g; 1 lb = 16 oz |
| Liquid | 1 L = 1,000 mL; 1 gal = 4 qt |
| Time | 1 hr = 60 min; 1 min = 60 sec |

**Examples**
- 5 ft = 5 × 12 = **60 in**
- 3 kg = 3 × 1,000 = **3,000 g**
- 4 hr = 4 × 60 = **240 min**

**Word problem:** A rope is 3 m long. Jess cuts off 45 cm. How much is left?
3 m = 300 cm → 300 − 45 = **255 cm**`,
          questions: [
            num("How many inches are in 4 feet?", 48, "4 × 12 = 48."),
            num("How many grams are in 6 kilograms?", 6000, "6 × 1,000 = 6,000."),
            num("How many minutes are in 3 hours?", 180, "3 × 60 = 180."),
            num("A board is 2 m long. You cut off 35 cm. How many cm are left?", 165, "200 − 35 = 165 cm."),
          ],
        },
      ],
    },
  ],
  "math-5": [
    {
      title: "Decimals",
      description: "Understand powers of ten and compute with decimals.",
      lessons: [
        {
          title: "Powers of Ten and Decimal Place Value",
          summary: "Multiplying by 10 shifts digits one place left; dividing shifts them right.",
          objectives: ["Explain patterns when multiplying or dividing by powers of 10", "Read, write, and compare decimals to thousandths"],
          vocab: [["power of ten", "10, 100, 1,000, … (10¹, 10², 10³)"], ["thousandths", "the third place after the decimal point"], ["exponent", "tells how many times to multiply a base by itself"]],
          standards: [s("5.NBT.A.1"), s("5.NBT.A.2"), s("5.NBT.A.3")],
          body: `
Each place is **10 times** the place to its right and **1/10** of the place to its left.

**Multiplying by powers of ten** moves digits **left**:
- 3.47 × 10 = 34.7
- 3.47 × 100 = 347
- 3.47 × 1,000 = 3,470

**Dividing** moves digits **right**:
- 52 ÷ 10 = 5.2
- 52 ÷ 100 = 0.52

**Exponents:** 10³ = 10 × 10 × 10 = 1,000. Multiplying by 10³ shifts **3** places.

**Comparing to thousandths:** 0.405 vs 0.45 → 0.405 vs 0.450 → **0.45 is greater**.
**Expanded form:** 2.563 = 2 + 0.5 + 0.06 + 0.003`,
          questions: [
            num("6.2 × 100 = ?", 620, "Multiplying by 100 shifts digits two places left."),
            num("45 ÷ 1,000 = ?", 0.045, "Dividing by 1,000 shifts three places right."),
            num("What is 10⁴?", 10000, "10 × 10 × 10 × 10 = 10,000."),
            mc("Which is greatest?", "0.6", ["0.599", "0.56", "0.066"], "0.600 has the most tenths."),
          ],
        },
        {
          title: "Operations with Decimals",
          summary: "Add, subtract, multiply, and divide decimals to hundredths.",
          objectives: ["Add and subtract decimals by lining up place values", "Multiply and divide decimals using place value reasoning"],
          vocab: [["decimal point", "separates whole numbers from parts of a whole"], ["placeholder zero", "a zero added to keep places lined up"]],
          standards: [s("5.NBT.B.7")],
          body: `
**Add and subtract:** line up the **decimal points**.
\`\`\`
  12.50
+  3.75
-------
  16.25
\`\`\`

**Multiply:** multiply as whole numbers, then place the decimal.
2.4 × 3 → 24 × 3 = 72 → one decimal place → **7.2**
0.5 × 0.6 → 5 × 6 = 30 → two decimal places → **0.30 = 0.3**

**Divide by a whole number:** 7.5 ÷ 3 = **2.5** (think 75 tenths ÷ 3 = 25 tenths).

**Estimate first:** 4.9 × 6.1 ≈ 5 × 6 = 30, so an answer of 29.89 is reasonable but 298.9 is not.

**Money:** 3 notebooks at $2.35 each = 3 × 2.35 = **$7.05**.`,
          questions: [
            num("4.6 + 2.75 = ?", 7.35, "4.60 + 2.75 = 7.35."),
            num("10 − 3.25 = ?", 6.75, "10.00 − 3.25 = 6.75."),
            num("1.2 × 0.4 = ?", 0.48, "12 × 4 = 48, two decimal places: 0.48."),
            num("Three friends split $12.60 equally. How many dollars does each pay?", 4.2, "12.60 ÷ 3 = 4.20."),
          ],
        },
      ],
    },
    {
      title: "Expressions and Fraction Division",
      description: "Write numerical expressions and divide with unit fractions.",
      lessons: [
        {
          title: "Order of Operations and Numerical Expressions",
          summary: "Use parentheses, brackets, and braces, and write expressions from words.",
          objectives: ["Evaluate expressions with parentheses, brackets, and braces", "Write simple expressions that record calculations"],
          vocab: [["expression", "numbers and operation symbols with no equals sign"], ["order of operations", "the agreed order for doing calculations"]],
          standards: [s("5.OA.A.1"), s("5.OA.A.2")],
          body: `
**Order of operations**
1. **Grouping symbols** first: ( ), [ ], { }, innermost first
2. **Multiply and divide**, left to right
3. **Add and subtract**, left to right

**Example:** 2 × [5 + (6 − 2)] = 2 × [5 + 4] = 2 × 9 = **18**

**Without parentheses:** 3 + 4 × 2 = 3 + 8 = **11** (not 14!)

**Words → expressions**
- "Add 8 and 7, then multiply by 2" → **2 × (8 + 7)**
- "3 times as large as 18,932 + 921" → **3 × (18,932 + 921)**. You can see it's 3 times bigger without calculating!`,
          questions: [
            num("Evaluate 6 + 3 × 4.", 18, "Multiply first: 12, then 6 + 12 = 18."),
            num("Evaluate (6 + 3) × 4.", 36, "Parentheses first: 9 × 4 = 36."),
            num("Evaluate 20 − [2 × (3 + 4)].", 6, "3 + 4 = 7; 2 × 7 = 14; 20 − 14 = 6."),
            mc("Which expression means 'subtract 5 from 12, then divide by 7'?", "(12 − 5) ÷ 7", ["12 − 5 ÷ 7", "5 − 12 ÷ 7", "(5 − 12) ÷ 7"], "Parentheses make the subtraction happen first."),
          ],
        },
        {
          title: "Dividing with Unit Fractions",
          summary: "Divide a whole number by a unit fraction, and a unit fraction by a whole number.",
          objectives: ["Divide a whole number by a unit fraction", "Divide a unit fraction by a whole number", "Solve real-world fraction division problems"],
          vocab: [["unit fraction", "a fraction with numerator 1, like 1/3"], ["reciprocal", "a number flipped: the reciprocal of 1/4 is 4"]],
          standards: [s("5.NF.B.7")],
          body: `
**Whole number ÷ unit fraction:** "How many fractions fit?"
**4 ÷ 1/3** → how many thirds are in 4 wholes? Each whole has 3 thirds → 4 × 3 = **12**

**Unit fraction ÷ whole number:** "Share the fraction."
**1/2 ÷ 4** → share half a pizza among 4 people → each gets **1/8**

**Check with multiplication**
- 12 × 1/3 = 4 ✓
- 1/8 × 4 = 1/2 ✓

**Word problems**
- How many 1/4-cup servings are in 3 cups of trail mix? 3 ÷ 1/4 = **12 servings**
- 1/3 of a pan of brownies is shared by 2 friends. Each gets 1/3 ÷ 2 = **1/6** of the pan.

**Pattern:** dividing by a unit fraction is the same as multiplying by its reciprocal.`,
          questions: [
            num("5 ÷ 1/2 = ?", 10, "There are 2 halves in each whole: 5 × 2 = 10."),
            mc("1/4 ÷ 2 = ?", "1/8", ["1/2", "2/4", "8"], "Sharing a fourth between 2 gives each an eighth."),
            num("How many 1/3-cup scoops are in 4 cups of flour?", 12, "4 ÷ 1/3 = 12."),
            mc("1/5 of a ribbon is cut into 3 equal pieces. What fraction of the ribbon is each piece?", "1/15", ["3/5", "1/8", "5/3"], "1/5 ÷ 3 = 1/15."),
          ],
        },
      ],
    },
  ],
};
