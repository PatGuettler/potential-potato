import { type CourseSpec, mc, num, short, tf } from "./dsl";

const CCSS = "Common Core State Standards for Mathematics";
const s = (code: string) => `CCSS.MATH.CONTENT.${code}`;

export const mathElementary: CourseSpec[] = [
  {
    id: "math-k",
    title: "Kindergarten Math",
    subject: "mathematics",
    grade: 0,
    framework: CCSS,
    description: "Counting, comparing, and the first ideas of adding and taking away, built with objects, pictures, and lots of talk.",
    units: [
      {
        title: "Numbers to 20",
        description: "Count objects, say how many, and compare groups.",
        lessons: [
          {
            title: "Counting Objects to 20",
            summary: "Touch and count each object once. The last number you say tells how many.",
            objectives: ["Count up to 20 objects by touching each one once", "Tell how many are in a group by the last number counted"],
            vocab: [["count", "to say numbers in order, one for each thing"], ["how many", "the total number of things in a group"]],
            standards: [s("K.CC.B.4"), s("K.CC.B.5")],
            body: `
When we **count**, we say one number for each thing. We touch each object **one time**.

**Let's count apples:** 🍎 🍎 🍎 🍎 🍎
Touch and say: 1, 2, 3, 4, 5. The last number we said is **5**, so there are **5 apples**.

**Counting tips**
- Line things up in a row so you don't count anything twice.
- Move each object to the side after you count it.
- The order you count in does not matter. You get the same number every time!

**Counting past 10:** 11, 12, 13, 14, 15, 16, 17, 18, 19, 20.
Teen numbers are **ten and some more**. 14 is ten and four more.`,
            questions: [
              num("Count the stars: ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐. How many stars?", 7, "Touch each star once: 1, 2, 3, 4, 5, 6, 7. The last number is 7."),
              mc("What number comes after 12?", "13", ["11", "14", "21"], "When we count: 11, 12, **13**."),
              tf("If you count the same blocks in a different order, you get a different number.", false, "The number of blocks stays the same no matter what order you count them in."),
              mc("14 is ten and how many more?", "4", ["1", "10", "14"], "Fourteen is 10 and 4 more: 10 + 4 = 14."),
            ],
            guide: "Have students count real objects (counters, crayons) before the screen. Watch for skipping or double-counting and model moving each counted item aside.",
          },
          {
            title: "More, Fewer, and the Same",
            summary: "Compare two groups by matching or counting.",
            objectives: ["Decide if one group has more, fewer, or the same number of objects", "Compare two written numbers between 1 and 10"],
            vocab: [["more", "the bigger number of things"], ["fewer", "the smaller number of things"], ["equal", "the same number"]],
            standards: [s("K.CC.C.6"), s("K.CC.C.7")],
            body: `
We can **compare** two groups to see which has **more**.

**Way 1: Match them up.**
🐶 🐶 🐶 🐶
🦴 🦴 🦴
Give each dog one bone. One dog has no bone, so there are **more dogs** than bones. There are **fewer bones**.

**Way 2: Count them.** 4 dogs and 3 bones. 4 comes after 3 when we count, so **4 is more than 3**.

If both groups match up perfectly, they are **equal** (the same).

**Remember:** a number that comes *later* when we count is *more*.`,
            questions: [
              mc("Which is more: 6 or 9?", "9", ["6", "They are the same"], "9 comes after 6 when we count, so 9 is more."),
              mc("There are 5 cats and 5 hats. Are there more cats, more hats, or the same?", "The same", ["More cats", "More hats"], "5 and 5 are equal. Every cat gets a hat."),
              mc("Which group has fewer? 🍪🍪 or 🍪🍪🍪🍪", "🍪🍪", ["🍪🍪🍪🍪"], "2 is fewer than 4."),
              tf("8 is more than 3.", true, "8 comes after 3 when we count."),
            ],
          },
        ],
      },
      {
        title: "Adding and Taking Away",
        description: "Put groups together and take some away, within 10.",
        lessons: [
          {
            title: "Putting Together (Addition)",
            summary: "Adding means putting groups together and counting them all.",
            objectives: ["Show addition by putting two groups together", "Solve addition story problems within 10"],
            vocab: [["add", "to put groups together"], ["plus (+)", "the sign that means add"], ["equals (=)", "the sign that means 'is the same as'"]],
            standards: [s("K.OA.A.1"), s("K.OA.A.2")],
            body: `
**Story:** Mia has 3 red balloons. Her dad gives her 2 blue balloons. How many balloons does she have now?

🎈🎈🎈 and 🎈🎈 → put them together → 🎈🎈🎈🎈🎈

Count them all: **5 balloons**.

We write it like this: **3 + 2 = 5**
- **+** means *plus* (put together)
- **=** means *equals* (is the same as)

**Try it with fingers:** hold up 3 fingers on one hand and 2 on the other. Count all your fingers up: 5!`,
            questions: [
              num("2 + 2 = ?", 4, "Two and two more: 1, 2, 3, 4."),
              num("Sam has 4 crayons. He finds 3 more. How many crayons now?", 7, "4 + 3 = 7. Start at 4 and count on: 5, 6, 7."),
              num("5 + 0 = ?", 5, "Adding zero means adding nothing, so the number stays 5."),
              mc("Which sign means 'put together'?", "+", ["=", "−"], "The plus sign (+) means add."),
            ],
          },
          {
            title: "Taking Away (Subtraction)",
            summary: "Subtracting means taking some away and counting what is left.",
            objectives: ["Show subtraction as taking away", "Solve subtraction story problems within 10"],
            vocab: [["subtract", "to take away"], ["minus (−)", "the sign that means take away"], ["left", "how many are still there"]],
            standards: [s("K.OA.A.1"), s("K.OA.A.2")],
            body: `
**Story:** There are 6 frogs on a log. 2 frogs hop into the pond. How many frogs are still on the log?

🐸🐸🐸🐸🐸🐸 → 2 hop away → 🐸🐸🐸🐸

Count what is **left**: **4 frogs**.

We write: **6 − 2 = 4**
- **−** means *minus* (take away)

**Tip:** Cross out the ones that go away, then count the rest.

**Adding and subtracting are partners.** If 4 + 2 = 6, then 6 − 2 = 4.`,
            questions: [
              num("5 − 1 = ?", 4, "Five take away one leaves four."),
              num("There are 8 cookies. You eat 3. How many are left?", 5, "8 − 3 = 5. Count back from 8: 7, 6, 5."),
              num("7 − 7 = ?", 0, "If you take away all of them, none are left."),
              tf("If 3 + 4 = 7, then 7 − 4 = 3.", true, "Addition and subtraction undo each other."),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "math-1",
    title: "Grade 1 Math",
    subject: "mathematics",
    grade: 1,
    framework: CCSS,
    description: "Addition and subtraction within 20, place value with tens and ones, telling time, and equal shares.",
    units: [
      {
        title: "Addition, Subtraction, and Place Value",
        description: "Use strategies to add and subtract within 20 and understand tens and ones.",
        lessons: [
          {
            title: "Make a Ten to Add",
            summary: "Break apart a number to make 10, then add the rest.",
            objectives: ["Add within 20 using the make-a-ten strategy", "Explain why making a ten makes adding easier"],
            vocab: [["addend", "a number being added"], ["sum", "the answer to an addition problem"], ["make a ten", "a strategy: move some to one addend to reach 10"]],
            standards: [s("1.OA.C.6"), s("1.OA.B.3")],
            body: `
Adding to 10 is easy, so we can use 10 as a stepping stone.

**Example: 8 + 5**
1. 8 needs **2 more** to make 10.
2. Break 5 into **2 and 3**.
3. 8 + 2 = **10**
4. 10 + 3 = **13**

So **8 + 5 = 13**.

**Example: 9 + 6**
9 needs 1 more. Break 6 into 1 and 5. 9 + 1 = 10, and 10 + 5 = **15**.

**Ten-frame picture:** fill a ten-frame with 8 dots, put 2 of the 5 new dots in the empty spaces, and 3 dots spill over into a second frame.`,
            questions: [
              num("7 + 4 = ?", 11, "7 needs 3 to make 10. 4 = 3 + 1. 10 + 1 = 11."),
              mc("To solve 9 + 5 by making a ten, how should you break apart 5?", "1 and 4", ["2 and 3", "5 and 0"], "9 needs 1 more to make 10, so break 5 into 1 and 4."),
              num("8 + 6 = ?", 14, "8 + 2 = 10, then 10 + 4 = 14."),
              num("Lily has 9 stickers and gets 7 more. How many stickers now?", 16, "9 + 1 = 10, and 10 + 6 = 16."),
            ],
          },
          {
            title: "Tens and Ones",
            summary: "A two-digit number is made of tens and ones.",
            objectives: ["Represent two-digit numbers as tens and ones", "Compare two-digit numbers using >, <, and ="],
            vocab: [["digit", "one of the symbols 0–9"], ["tens place", "the digit that tells how many groups of ten"], ["ones place", "the digit that tells how many single ones"]],
            standards: [s("1.NBT.B.2"), s("1.NBT.B.3")],
            body: `
Ten ones can be bundled into **one ten**.

**The number 34**
- **3** is in the tens place → 3 tens = 30
- **4** is in the ones place → 4 ones = 4
- 30 + 4 = 34

With base-ten blocks: 3 long rods and 4 small cubes.

**Comparing numbers:** look at the tens first.
- 52 vs. 47 → 5 tens is more than 4 tens, so **52 > 47**.
- If the tens are the same, compare the ones: 63 vs. 68 → **63 < 68**.

**The alligator rule:** the open mouth of **>** or **<** faces the bigger number.`,
            questions: [
              num("How many tens are in 58?", 5, "58 = 5 tens and 8 ones."),
              num("What number is 7 tens and 2 ones?", 72, "7 tens = 70, plus 2 ones = 72."),
              mc("Which is true?", "41 > 39", ["41 < 39", "41 = 39"], "4 tens is more than 3 tens, so 41 is greater."),
              mc("Which sign makes this true? 65 __ 61", ">", ["<", "="], "Both have 6 tens. 5 ones is more than 1 one, so 65 > 61."),
            ],
          },
        ],
      },
      {
        title: "Time and Shapes",
        description: "Tell time to the hour and half hour, and split shapes into equal parts.",
        lessons: [
          {
            title: "Telling Time to the Hour and Half Hour",
            summary: "Read analog and digital clocks to the hour and half hour.",
            objectives: ["Tell time to the hour and half hour on an analog clock", "Match analog and digital times"],
            vocab: [["hour hand", "the short hand; points to the hour"], ["minute hand", "the long hand; points to the minutes"], ["half past", "30 minutes after the hour"]],
            standards: [s("1.MD.B.3")],
            body: `
A clock has two hands.
- The **short hand** is the **hour hand**.
- The **long hand** is the **minute hand**.

**On the hour:** the minute hand points straight up at **12**. If the hour hand points at 3, it is **3:00** ("three o'clock").

**Half past:** the minute hand points straight down at **6**. That is 30 minutes. The hour hand is halfway between two numbers. If it's between 4 and 5, it is **4:30** ("half past four").

**Digital clocks** show hours, then a colon, then minutes: 7:00, 7:30.`,
            questions: [
              mc("The minute hand points to 12 and the hour hand points to 8. What time is it?", "8:00", ["12:08", "8:30", "12:00"], "Minute hand on 12 means o'clock; hour hand on 8 → 8:00."),
              mc("The minute hand points to 6. How many minutes past the hour is it?", "30", ["6", "60", "15"], "When the long hand points to 6, it is half past: 30 minutes."),
              mc("Which hand is shorter?", "The hour hand", ["The minute hand"], "The short hand shows the hour."),
              mc("'Half past two' is the same as…", "2:30", ["2:00", "2:15", "12:30"], "Half past means 30 minutes after 2 o'clock."),
            ],
          },
          {
            title: "Halves and Fourths",
            summary: "Split circles and rectangles into equal shares.",
            objectives: ["Partition circles and rectangles into two and four equal shares", "Describe shares using halves, fourths, and quarters"],
            vocab: [["equal shares", "parts that are exactly the same size"], ["half", "one of 2 equal shares"], ["fourth / quarter", "one of 4 equal shares"]],
            standards: [s("1.G.A.3")],
            body: `
**Equal shares** are parts that are all the same size.

**Halves:** cut a sandwich down the middle into 2 equal parts. Each part is **one half**. Two halves make the **whole**.

**Fourths (quarters):** cut a pizza into 4 equal slices. Each slice is **one fourth**, also called **one quarter**. Four fourths make the whole.

**Watch out!** If the pieces are different sizes, they are **not** halves or fourths.

**Bigger or smaller?** If you share a pizza with more people, each piece is **smaller**. One fourth of a pizza is smaller than one half of the same pizza.`,
            questions: [
              num("How many halves make a whole?", 2, "Two equal halves make one whole."),
              num("A pizza is cut into fourths. How many slices are there?", 4, "Fourths means 4 equal shares."),
              tf("A cookie broken into one big piece and one small piece is cut in halves.", false, "Halves must be equal in size."),
              mc("Which piece is bigger from the same sandwich?", "One half", ["One fourth"], "Cutting into fewer pieces makes each piece bigger."),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "math-2",
    title: "Grade 2 Math",
    subject: "mathematics",
    grade: 2,
    framework: CCSS,
    description: "Place value to 1,000, fluent addition and subtraction within 100, money, and measuring length.",
    units: [
      {
        title: "Place Value and Operations",
        description: "Understand hundreds, tens, and ones and add and subtract within 100.",
        lessons: [
          {
            title: "Hundreds, Tens, and Ones",
            summary: "Read, write, and break apart three-digit numbers.",
            objectives: ["Represent three-digit numbers with hundreds, tens, and ones", "Write numbers in expanded form"],
            vocab: [["hundred", "10 tens"], ["expanded form", "a number written as the sum of its place values, like 300 + 40 + 5"]],
            standards: [s("2.NBT.A.1"), s("2.NBT.A.3")],
            body: `
Ten tens make **one hundred**.

**The number 345**
| Hundreds | Tens | Ones |
|---|---|---|
| 3 | 4 | 5 |

- 3 hundreds = **300**
- 4 tens = **40**
- 5 ones = **5**

**Expanded form:** 300 + 40 + 5 = 345

**Zero holds a place.** In 506 there are 5 hundreds, **0 tens**, and 6 ones. Without the zero it would look like 56!

**Number names:** 345 is read "three hundred forty-five."`,
            questions: [
              num("What is the value of the 7 in 472?", 70, "7 is in the tens place: 7 tens = 70."),
              num("Write 600 + 20 + 9 as a number.", 629, "6 hundreds, 2 tens, 9 ones = 629."),
              num("How many tens are in 300?", 30, "Each hundred is 10 tens, so 3 hundreds = 30 tens."),
              mc("Which number has 8 hundreds, 0 tens, and 3 ones?", "803", ["830", "83", "308"], "The zero holds the tens place: 803."),
            ],
          },
          {
            title: "Adding and Subtracting Within 100",
            summary: "Use place value to add and subtract two-digit numbers, including regrouping.",
            objectives: ["Add two-digit numbers with and without regrouping", "Subtract two-digit numbers with and without regrouping"],
            vocab: [["regroup", "trade 10 ones for 1 ten, or 1 ten for 10 ones"]],
            standards: [s("2.NBT.B.5"), s("2.OA.A.1")],
            body: `
**Add tens with tens and ones with ones.**

**36 + 47**
- Ones: 6 + 7 = 13 → that's 1 ten and 3 ones. Write 3, **regroup** the 1 ten.
- Tens: 3 + 4 + 1 (regrouped) = 8 tens
- Answer: **83**

**Subtracting: 52 − 28**
- Ones: you can't take 8 from 2, so **regroup**: trade 1 ten for 10 ones. Now 4 tens and 12 ones.
- Ones: 12 − 8 = 4
- Tens: 4 − 2 = 2
- Answer: **24**

**Check your work:** add your answer to the number you subtracted. 24 + 28 = 52 ✔`,
            questions: [
              num("25 + 34 = ?", 59, "Ones: 5 + 4 = 9. Tens: 2 + 3 = 5. Answer 59."),
              num("48 + 37 = ?", 85, "8 + 7 = 15 → 5 ones, regroup 1 ten. 4 + 3 + 1 = 8 tens. 85."),
              num("70 − 26 = ?", 44, "Regroup: 6 tens and 10 ones. 10 − 6 = 4, 6 − 2 = 4. 44."),
              num("A class read 63 books in May and 29 in June. How many more in May?", 34, "63 − 29 = 34."),
            ],
          },
        ],
      },
      {
        title: "Money and Measurement",
        description: "Solve problems with coins and bills and measure length in standard units.",
        lessons: [
          {
            title: "Counting Money",
            summary: "Find the value of a group of coins and solve money word problems.",
            objectives: ["Identify the value of pennies, nickels, dimes, and quarters", "Count mixed coins and solve word problems using ¢ and $"],
            vocab: [["penny", "1¢"], ["nickel", "5¢"], ["dime", "10¢"], ["quarter", "25¢"], ["dollar", "100¢ = $1.00"]],
            standards: [s("2.MD.C.8")],
            body: `
| Coin | Value |
|---|---|
| Penny | 1¢ |
| Nickel | 5¢ |
| Dime | 10¢ |
| Quarter | 25¢ |

**Count from the biggest coin to the smallest.**
2 quarters, 1 dime, 3 pennies:
25, 50 → 60 → 61, 62, 63. That's **63¢**.

**One dollar = 100¢.** You can write it as **$1.00**.
- 4 quarters = 100¢ = $1.00
- 10 dimes = $1.00

**Word problem:** A pencil costs 35¢. You pay with 2 quarters (50¢). Your change is 50 − 35 = **15¢**.`,
            questions: [
              num("How many cents is 3 dimes and 2 nickels?", 40, "30¢ + 10¢ = 40¢."),
              num("How many quarters make one dollar?", 4, "4 × 25¢ = 100¢ = $1.00."),
              num("You have 1 quarter, 1 dime, and 4 pennies. How many cents?", 39, "25 + 10 + 4 = 39¢."),
              num("A sticker costs 45¢. You pay 50¢. How many cents in change?", 5, "50 − 45 = 5¢."),
            ],
          },
          {
            title: "Measuring Length",
            summary: "Measure with rulers in inches and centimeters and compare lengths.",
            objectives: ["Measure objects using a ruler in inches and centimeters", "Find how much longer one object is than another"],
            vocab: [["inch", "a customary unit of length"], ["centimeter", "a metric unit of length; shorter than an inch"], ["foot", "12 inches"]],
            standards: [s("2.MD.A.1"), s("2.MD.A.4")],
            body: `
**How to measure with a ruler**
1. Line up one end of the object with the **0** mark (not the edge of the ruler!).
2. Read the number at the other end.

**Units**
- **Inch (in):** about the width of your thumb. 12 inches = **1 foot**.
- **Centimeter (cm):** about the width of your pinky fingernail.

The **same** pencil measures more centimeters than inches, because centimeters are smaller units. A 6-inch pencil is about 15 centimeters.

**Comparing:** A crayon is 9 cm. A marker is 14 cm. The marker is 14 − 9 = **5 cm longer**.`,
            questions: [
              num("How many inches are in 1 foot?", 12, "1 foot = 12 inches."),
              mc("Where should the end of the object line up on the ruler?", "At the 0 mark", ["At the 1 mark", "At the edge of the ruler"], "Start at 0 so you measure the whole length."),
              num("A ribbon is 23 cm. Another is 15 cm. How many cm longer is the first ribbon?", 8, "23 − 15 = 8 cm."),
              tf("A book measured in centimeters will have a bigger number than the same book measured in inches.", true, "Centimeters are smaller units, so it takes more of them."),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "math-3",
    title: "Grade 3 Math",
    subject: "mathematics",
    grade: 3,
    framework: CCSS,
    description: "Multiplication and division within 100, fractions as numbers, and area and perimeter.",
    units: [
      {
        title: "Multiplication and Division",
        description: "Understand multiplication as equal groups and division as fair sharing.",
        lessons: [
          {
            title: "Multiplication as Equal Groups",
            summary: "Multiplication is a fast way to add equal groups.",
            objectives: ["Interpret products as equal groups and arrays", "Use the commutative property to multiply"],
            vocab: [["factor", "a number being multiplied"], ["product", "the answer to a multiplication problem"], ["array", "objects arranged in equal rows and columns"]],
            standards: [s("3.OA.A.1"), s("3.OA.B.5"), s("3.OA.C.7")],
            body: `
**4 × 3** means **4 groups of 3**.

🍎🍎🍎 | 🍎🍎🍎 | 🍎🍎🍎 | 🍎🍎🍎
3 + 3 + 3 + 3 = 12, so **4 × 3 = 12**.

The numbers we multiply are **factors**; the answer is the **product**.

**Arrays:** 4 rows of 3 dots. Turn the array sideways and you get 3 rows of 4, still 12 dots. This is the **commutative property**: 4 × 3 = 3 × 4.

**Helpful facts**
- Any number × 1 = that number
- Any number × 0 = 0
- × 2 is doubling; × 10 adds a zero: 7 × 10 = 70
- × 5 products end in 0 or 5`,
            questions: [
              num("6 × 4 = ?", 24, "6 groups of 4: 4, 8, 12, 16, 20, 24."),
              mc("Which addition matches 5 × 3?", "3 + 3 + 3 + 3 + 3", ["5 + 3", "5 + 5 + 5 + 5 + 5", "3 + 5 + 3"], "5 groups of 3 means adding 3 five times."),
              num("A garden has 7 rows with 8 plants in each row. How many plants?", 56, "7 × 8 = 56."),
              tf("9 × 6 has the same product as 6 × 9.", true, "The commutative property: order doesn't change the product."),
              num("0 × 125 = ?", 0, "Zero groups of anything is zero."),
            ],
          },
          {
            title: "Division as Sharing",
            summary: "Division splits a total into equal groups.",
            objectives: ["Interpret quotients as equal shares or number of groups", "Use multiplication facts to divide"],
            vocab: [["dividend", "the total being divided"], ["divisor", "the number you divide by"], ["quotient", "the answer to a division problem"]],
            standards: [s("3.OA.A.2"), s("3.OA.B.6"), s("3.OA.A.3")],
            body: `
**12 ÷ 3** asks: if 12 things are shared equally into 3 groups, how many in each group?

🍪🍪🍪🍪 | 🍪🍪🍪🍪 | 🍪🍪🍪🍪 → **4 in each group**. So 12 ÷ 3 = 4.

It can also ask: how many groups of 3 can you make from 12? Also 4.

**Division and multiplication are a fact family.**
3 × 4 = 12, 4 × 3 = 12, 12 ÷ 3 = 4, 12 ÷ 4 = 3

**Think multiplication:** to find 42 ÷ 6, ask "6 times what is 42?" 6 × 7 = 42, so 42 ÷ 6 = **7**.

**Rules:** any number ÷ 1 = the number; a number ÷ itself = 1 (except 0).`,
            questions: [
              num("20 ÷ 4 = ?", 5, "4 × 5 = 20, so 20 ÷ 4 = 5."),
              num("36 students sit equally at 9 tables. How many at each table?", 4, "36 ÷ 9 = 4 because 9 × 4 = 36."),
              mc("Which multiplication fact helps solve 56 ÷ 8?", "8 × 7 = 56", ["8 × 8 = 64", "5 × 6 = 30", "7 × 7 = 49"], "56 ÷ 8 asks 8 × ? = 56. The answer is 7."),
              num("There are 30 crayons in boxes of 5. How many boxes?", 6, "30 ÷ 5 = 6."),
            ],
          },
        ],
      },
      {
        title: "Fractions and Area",
        description: "See fractions as numbers and measure area and perimeter.",
        lessons: [
          {
            title: "Understanding Fractions",
            summary: "A fraction names equal parts of a whole and a point on the number line.",
            objectives: ["Read and write unit fractions and fractions like 3/4", "Compare fractions with the same numerator or denominator"],
            vocab: [["numerator", "the top number: how many parts we have"], ["denominator", "the bottom number: how many equal parts make the whole"], ["unit fraction", "a fraction with 1 on top, like 1/4"]],
            standards: [s("3.NF.A.1"), s("3.NF.A.2"), s("3.NF.A.3")],
            body: `
A **fraction** describes equal parts of a whole.

**3/4** → the whole is cut into **4** equal parts (denominator), and we have **3** of them (numerator).

**On a number line:** split the space from 0 to 1 into 4 equal jumps. 3/4 is three jumps from 0.

**Comparing fractions**
- **Same denominator:** more pieces is more. 5/8 > 3/8.
- **Same numerator:** smaller pieces come from bigger denominators. 1/3 > 1/6, because thirds are bigger than sixths.

**Equivalent fractions** name the same amount: 1/2 = 2/4 = 4/8.
**Whole numbers as fractions:** 4/4 = 1, and 3 = 3/1.`,
            questions: [
              mc("In 5/6, what does the 6 tell us?", "The whole is split into 6 equal parts", ["We have 6 parts", "There are 6 wholes"], "The denominator tells how many equal parts make one whole."),
              mc("Which is greater?", "1/3", ["1/8"], "Thirds are bigger pieces than eighths."),
              mc("Which fraction is equivalent to 1/2?", "3/6", ["1/3", "2/3", "3/4"], "3 out of 6 equal parts is half of the whole."),
              num("How many fourths make one whole?", 4, "4/4 = 1."),
            ],
          },
          {
            title: "Area and Perimeter",
            summary: "Area covers the inside of a shape; perimeter goes around the outside.",
            objectives: ["Find the area of rectangles by multiplying side lengths", "Find perimeter by adding side lengths"],
            vocab: [["area", "the number of square units that cover a shape"], ["perimeter", "the distance around a shape"], ["square unit", "a square 1 unit on each side"]],
            standards: [s("3.MD.C.7"), s("3.MD.D.8")],
            body: `
**Area** is how many **square units** cover a shape.

A rectangle 5 units long and 3 units wide is covered by 3 rows of 5 squares: **5 × 3 = 15 square units**.

**Area of a rectangle = length × width**

**Perimeter** is the distance **around** a shape. Add all the side lengths.

The same 5 × 3 rectangle: 5 + 3 + 5 + 3 = **16 units**.

**Don't mix them up!**
- Carpet for a floor → area (square units)
- A fence around a yard → perimeter (units)

Two rectangles can have the **same area but different perimeters**: a 6 × 2 and a 4 × 3 rectangle both have area 12, but perimeters 16 and 14.`,
            questions: [
              num("What is the area of a rectangle 7 cm long and 4 cm wide (in square cm)?", 28, "Area = 7 × 4 = 28 square centimeters."),
              num("What is the perimeter of that same 7 cm by 4 cm rectangle (in cm)?", 22, "7 + 4 + 7 + 4 = 22 cm."),
              mc("You want to put a fence around a garden. Should you find area or perimeter?", "Perimeter", ["Area"], "A fence goes around the outside, which is perimeter."),
              num("A square has sides of 6 m. What is its area in square meters?", 36, "6 × 6 = 36."),
            ],
            writtenPrompt: "Draw two different rectangles that both have an area of 24 square units. Write their side lengths and perimeters. Which one would need less fencing?",
            rubric: "Two different rectangles with area 24 (e.g., 6×4, 8×3, 12×2, 24×1). Correct perimeter for each (6×4 → 20, 8×3 → 22, 12×2 → 28, 24×1 → 50). Identifies the rectangle with the smaller perimeter as needing less fencing.",
          },
        ],
      },
    ],
  },
  {
    id: "math-4",
    title: "Grade 4 Math",
    subject: "mathematics",
    grade: 4,
    framework: CCSS,
    description: "Factors and multiples, multi-digit multiplication, equivalent fractions, and decimals.",
    units: [
      {
        title: "Multi-Digit Operations",
        description: "Use factors, multiples, and place value to multiply larger numbers.",
        lessons: [
          {
            title: "Factors, Multiples, and Primes",
            summary: "Find factor pairs and decide whether a number is prime or composite.",
            objectives: ["Find all factor pairs of a whole number up to 100", "Determine whether a number is prime or composite"],
            vocab: [["factor", "a number that divides another evenly"], ["multiple", "the product of a number and a whole number"], ["prime", "a number greater than 1 with exactly two factors: 1 and itself"], ["composite", "a number with more than two factors"]],
            standards: [s("4.OA.B.4")],
            body: `
**Factors** of 12 are numbers that divide 12 evenly. List factor pairs:
1 × 12, 2 × 6, 3 × 4 → factors: **1, 2, 3, 4, 6, 12**

**Multiples** of 4: 4, 8, 12, 16, 20, … (skip-count by 4). 12 is a multiple of 4, and 4 is a factor of 12.

**Prime numbers** have exactly two factors: 1 and themselves.
2, 3, 5, 7, 11, 13, 17, 19, 23, 29 …

**Composite numbers** have more than two factors: 4, 6, 8, 9, 10, 12 …

**Special cases**
- **1** is neither prime nor composite (it has only one factor).
- **2** is the only even prime.

**Divisibility shortcuts:** even → divisible by 2; ends in 0 or 5 → by 5; digits add to a multiple of 3 → by 3 (e.g., 51: 5 + 1 = 6, so 51 = 3 × 17).`,
            questions: [
              mc("Which number is prime?", "13", ["15", "21", "27"], "13 has only the factors 1 and 13. 15 = 3×5, 21 = 3×7, 27 = 3×9."),
              num("How many factors does 18 have?", 6, "1, 2, 3, 6, 9, 18. That's 6 factors."),
              tf("1 is a prime number.", false, "A prime has exactly two factors. 1 has only one, so it is neither prime nor composite."),
              mc("Which is a multiple of 7?", "63", ["17", "27", "47"], "7 × 9 = 63."),
            ],
          },
          {
            title: "Multiplying Multi-Digit Numbers",
            summary: "Multiply using place value, area models, and partial products.",
            objectives: ["Multiply a 4-digit number by a 1-digit number", "Multiply two 2-digit numbers using partial products"],
            vocab: [["partial products", "products of each place value, added together"], ["area model", "a rectangle split by place value to show multiplication"]],
            standards: [s("4.NBT.B.5")],
            body: `
**Break numbers apart by place value**, multiply each part, then add.

**Example: 23 × 14**
Split 23 = 20 + 3 and 14 = 10 + 4.

| × | 20 | 3 |
|---|---|---|
| **10** | 200 | 30 |
| **4** | 80 | 12 |

Partial products: 200 + 30 + 80 + 12 = **322**

**Example: 1,234 × 3**
1,000 × 3 = 3,000
200 × 3 = 600
30 × 3 = 90
4 × 3 = 12
Total: **3,702**

**Estimate first** to check: 23 × 14 is close to 20 × 15 = 300, so 322 is reasonable.`,
            questions: [
              num("45 × 6 = ?", 270, "40 × 6 = 240 and 5 × 6 = 30. 240 + 30 = 270."),
              num("32 × 21 = ?", 672, "30×20 = 600, 30×1 = 30, 2×20 = 40, 2×1 = 2. Total 672."),
              num("2,105 × 4 = ?", 8420, "2,000×4 = 8,000; 100×4 = 400; 5×4 = 20. Total 8,420."),
              mc("Which is the best estimate for 48 × 52?", "2,500", ["250", "25,000", "1,000"], "Round to 50 × 50 = 2,500."),
            ],
          },
        ],
      },
      {
        title: "Fractions and Decimals",
        description: "Generate equivalent fractions and connect fractions to decimals.",
        lessons: [
          {
            title: "Equivalent Fractions",
            summary: "Multiply or divide the numerator and denominator by the same number.",
            objectives: ["Generate equivalent fractions using multiplication", "Compare fractions with unlike denominators using a common denominator or benchmark 1/2"],
            vocab: [["equivalent fractions", "fractions that name the same amount"], ["common denominator", "a shared denominator used to compare or add fractions"], ["simplest form", "a fraction whose numerator and denominator have no common factor except 1"]],
            standards: [s("4.NF.A.1"), s("4.NF.A.2")],
            body: `
Multiplying the top and bottom by the same number makes **equal-sized-but-more** pieces. The amount doesn't change.

**2/3 = (2 × 4)/(3 × 4) = 8/12**

You can also **divide** both by a common factor to simplify:
**10/15 = (10 ÷ 5)/(15 ÷ 5) = 2/3**

**Comparing 3/4 and 5/8**
Rewrite with a common denominator of 8: 3/4 = 6/8. Since 6/8 > 5/8, **3/4 > 5/8**.

**Benchmark 1/2:** 3/7 is less than half (half of 7 is 3.5), and 5/9 is more than half (half of 9 is 4.5), so 3/7 < 5/9.`,
            questions: [
              num("Fill in the blank: 3/5 = ?/20", 12, "5 × 4 = 20, so multiply the numerator by 4 too: 3 × 4 = 12."),
              mc("Which fraction is in simplest form and equal to 6/8?", "3/4", ["2/3", "6/4", "12/16"], "Divide top and bottom by 2."),
              mc("Which is greater: 2/3 or 3/5?", "2/3", ["3/5", "They are equal"], "With denominator 15: 10/15 vs 9/15."),
              tf("4/10 and 2/5 are equivalent fractions.", true, "Divide 4/10 by 2/2 to get 2/5."),
            ],
          },
          {
            title: "Decimals: Tenths and Hundredths",
            summary: "Write fractions with denominators of 10 and 100 as decimals.",
            objectives: ["Write tenths and hundredths as decimals", "Compare decimals to the hundredths place"],
            vocab: [["decimal", "a number with a decimal point that shows parts of a whole"], ["tenth", "one of 10 equal parts: 0.1"], ["hundredth", "one of 100 equal parts: 0.01"]],
            standards: [s("4.NF.C.6"), s("4.NF.C.7"), s("4.NF.C.5")],
            body: `
Decimals are another way to write fractions with denominators of 10 or 100.

| Fraction | Decimal | Words |
|---|---|---|
| 3/10 | 0.3 | three tenths |
| 47/100 | 0.47 | forty-seven hundredths |
| 5/100 | 0.05 | five hundredths |

**Tenths and hundredths are related:** 3/10 = 30/100, so 0.3 = 0.30.

**Money connection:** $0.75 is 75 hundredths of a dollar (75 cents).

**Comparing decimals:** line up the decimal points and compare place by place.
0.6 vs 0.58 → 0.60 vs 0.58 → 6 tenths > 5 tenths, so **0.6 > 0.58**.

A common mistake is thinking 0.58 > 0.6 because 58 > 6. Always compare the same places!`,
            questions: [
              mc("Which decimal equals 7/10?", "0.7", ["0.07", "7.0", "0.17"], "Seven tenths is 0.7."),
              mc("Which decimal equals 9/100?", "0.09", ["0.9", "9.0", "0.90"], "Nine hundredths: the 9 is in the hundredths place."),
              mc("Which is greatest?", "0.8", ["0.75", "0.08", "0.79"], "0.80 has 8 tenths; the others have 7 tenths or fewer."),
              tf("0.4 = 0.40", true, "4 tenths is the same as 40 hundredths."),
            ],
            writtenPrompt: "Maya says 0.35 is greater than 0.5 because 35 is greater than 5. Explain her mistake and show the correct comparison.",
            rubric: "Explains that you must compare the same place values (or rewrite 0.5 as 0.50). Shows that 0.5 = 50 hundredths, which is greater than 35 hundredths. Concludes 0.5 > 0.35.",
          },
        ],
      },
    ],
  },
  {
    id: "math-5",
    title: "Grade 5 Math",
    subject: "mathematics",
    grade: 5,
    framework: CCSS,
    description: "Adding and multiplying fractions, volume, and graphing on the coordinate plane.",
    units: [
      {
        title: "Fraction Operations",
        description: "Add fractions with unlike denominators and multiply fractions.",
        lessons: [
          {
            title: "Adding Fractions with Unlike Denominators",
            summary: "Find a common denominator, then add.",
            objectives: ["Add and subtract fractions with unlike denominators", "Solve word problems involving fractions"],
            vocab: [["least common denominator", "the smallest common multiple of the denominators"], ["mixed number", "a whole number and a fraction, like 1 3/4"]],
            standards: [s("5.NF.A.1"), s("5.NF.A.2")],
            body: `
You can only add fractions when the pieces are the **same size**, so first find a **common denominator**.

**Example: 1/3 + 1/4**
1. Common multiple of 3 and 4: **12**
2. 1/3 = 4/12 and 1/4 = 3/12
3. 4/12 + 3/12 = **7/12**

**Example: 5/6 − 1/4**
LCD of 6 and 4 is 12 → 10/12 − 3/12 = **7/12**

**Answers greater than 1:** 3/4 + 2/3 = 9/12 + 8/12 = 17/12 = **1 5/12**

**Check with estimation:** 3/4 and 2/3 are both more than 1/2, so their sum must be more than 1. ✔`,
            questions: [
              mc("1/2 + 1/3 = ?", "5/6", ["2/5", "1/6", "2/6"], "Common denominator 6: 3/6 + 2/6 = 5/6."),
              mc("3/4 − 1/8 = ?", "5/8", ["2/4", "1/2", "2/8"], "3/4 = 6/8; 6/8 − 1/8 = 5/8."),
              mc("2/5 + 1/2 = ?", "9/10", ["3/7", "3/10", "1"], "4/10 + 5/10 = 9/10."),
              mc("A recipe uses 2/3 cup of flour and 1/2 cup of sugar. How many cups in all?", "1 1/6", ["3/5", "1 1/3", "5/6"], "4/6 + 3/6 = 7/6 = 1 1/6."),
            ],
          },
          {
            title: "Multiplying Fractions",
            summary: "Multiply numerators, multiply denominators, and see why the product can be smaller.",
            objectives: ["Multiply a fraction by a whole number or a fraction", "Explain why multiplying by a fraction less than 1 gives a smaller product"],
            vocab: [["product", "the result of multiplication"], ["scaling", "resizing a quantity by multiplying"]],
            standards: [s("5.NF.B.4"), s("5.NF.B.5"), s("5.NF.B.6")],
            body: `
**"Of" means multiply.** Half of 8 = 1/2 × 8 = **4**.

**Fraction × fraction:** multiply straight across.
**2/3 × 3/4 = (2 × 3)/(3 × 4) = 6/12 = 1/2**

**Area model:** shade 3/4 of a rectangle one way and 2/3 the other way. The overlap is 6 of 12 boxes.

**Fraction × whole number:** 3/5 × 10 = 30/5 = **6**

**Scaling**
- Multiplying by a fraction **less than 1** makes the number **smaller**: 3/4 × 20 = 15
- Multiplying by a number **greater than 1** makes it **bigger**: 1 1/2 × 20 = 30

**Simplify first (optional):** 4/9 × 3/8 → cancel 4 with 8 and 3 with 9 → 1/3 × 1/2 = 1/6.`,
            questions: [
              mc("1/2 × 3/5 = ?", "3/10", ["4/7", "3/7", "1/10"], "Multiply across: (1×3)/(2×5) = 3/10."),
              num("What is 2/3 of 18?", 12, "18 ÷ 3 = 6, and 6 × 2 = 12."),
              tf("3/4 × 12 is greater than 12.", false, "Multiplying by a fraction less than 1 gives a smaller product: 9."),
              mc("A rectangle is 3/4 m long and 2/5 m wide. What is its area?", "3/10 m²", ["5/9 m²", "6/9 m²", "1 3/20 m²"], "3/4 × 2/5 = 6/20 = 3/10."),
            ],
          },
        ],
      },
      {
        title: "Volume and the Coordinate Plane",
        description: "Measure volume of rectangular prisms and graph points.",
        lessons: [
          {
            title: "Volume of Rectangular Prisms",
            summary: "Volume counts the cubic units that fill a solid: V = l × w × h.",
            objectives: ["Find volume by counting unit cubes and by using V = l × w × h", "Find the volume of figures made of two rectangular prisms"],
            vocab: [["volume", "the amount of space a solid takes up"], ["cubic unit", "a cube 1 unit on each edge"], ["base", "the bottom face of a prism"]],
            standards: [s("5.MD.C.3"), s("5.MD.C.5")],
            body: `
**Volume** tells how many **unit cubes** fill a solid.

A box 4 cm long, 3 cm wide, and 2 cm tall:
- One layer: 4 × 3 = 12 cubes
- 2 layers: 12 × 2 = **24 cubic centimeters (cm³)**

**V = length × width × height**  or  **V = B × h** (area of the base × height)

**Composite figures:** split into two prisms, find each volume, and add.
An L-shaped figure made of a 5 × 2 × 3 prism (30 cm³) and a 2 × 2 × 3 prism (12 cm³) has volume **42 cm³**.

**Units matter:** area uses square units (cm²); volume uses cubic units (cm³).`,
            questions: [
              num("Find the volume of a box 5 in long, 4 in wide, and 3 in tall (cubic inches).", 60, "5 × 4 × 3 = 60 in³."),
              num("A prism has a base area of 15 cm² and a height of 6 cm. What is its volume in cm³?", 90, "V = B × h = 15 × 6 = 90."),
              mc("Which unit is used for volume?", "cubic meters (m³)", ["square meters (m²)", "meters (m)"], "Volume measures 3-D space, so it uses cubic units."),
              num("A cube has edges of 3 ft. What is its volume in cubic feet?", 27, "3 × 3 × 3 = 27."),
            ],
          },
          {
            title: "The Coordinate Plane",
            summary: "Plot ordered pairs and interpret points in the first quadrant.",
            objectives: ["Plot and name points using ordered pairs (x, y)", "Interpret coordinate values in a real-world context"],
            vocab: [["origin", "the point (0, 0) where the axes meet"], ["x-coordinate", "how far to move right from the origin"], ["y-coordinate", "how far to move up from the origin"], ["ordered pair", "a pair of numbers (x, y) that locates a point"]],
            standards: [s("5.G.A.1"), s("5.G.A.2")],
            body: `
A **coordinate plane** is made of two number lines that meet at the **origin (0, 0)**:
- the **x-axis** runs left to right
- the **y-axis** runs up and down

**An ordered pair (x, y)** tells you how to find a point.
**(4, 2):** start at the origin, move **4 right**, then **2 up**.

**Order matters!** (4, 2) and (2, 4) are different points.
*Tip: "walk before you climb": go across first, then up.*

**Real-world graphs:** If x = hours worked and y = dollars earned, the point (3, 30) means **3 hours → $30**.

**Distance along a line:** from (2, 5) to (7, 5) the y-values match, so the distance is 7 − 2 = **5 units**.`,
            questions: [
              mc("To plot (3, 6), you start at the origin and…", "move 3 right, then 6 up", ["move 6 right, then 3 up", "move 3 up, then 6 right"], "The x-coordinate (3) comes first: across, then up."),
              mc("What are the coordinates of the origin?", "(0, 0)", ["(1, 1)", "(0, 1)", "(1, 0)"], "The axes meet at (0, 0)."),
              num("How far apart are the points (1, 4) and (9, 4)?", 8, "Same y-value, so subtract the x-values: 9 − 1 = 8."),
              tf("The points (2, 5) and (5, 2) are in the same place.", false, "Order matters: x first, then y."),
            ],
          },
        ],
      },
    ],
  },
];
