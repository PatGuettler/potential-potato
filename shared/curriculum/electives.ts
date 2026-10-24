import { type CourseSpec, mc, num, short, tf } from "./dsl";

const CSTA = "CSTA K–12 Computer Science Standards";
const NGSS_ETS = "Next Generation Science Standards: Engineering Design";

export const electives: CourseSpec[] = [
  {
    id: "cs-k2",
    title: "Computing Foundations",
    subject: "technology",
    grade: 0,
    gradeMax: 2,
    framework: CSTA,
    description: "Step-by-step thinking, unplugged algorithms, and staying safe online.",
    units: [
      {
        title: "Algorithms Everywhere",
        description: "Describe everyday tasks as step-by-step instructions and find patterns.",
        lessons: [
          {
            title: "Step-by-Step Instructions",
            summary: "An algorithm is a list of steps in the right order.",
            objectives: ["Put the steps of a daily task in order", "Explain why order matters in instructions"],
            vocab: [["algorithm", "a list of steps to do a task"], ["sequence", "the order of the steps"]],
            standards: ["1A-AP-08"],
            body: `
An **algorithm** is a list of **steps** to finish a job. You use algorithms every day!

**Brushing your teeth**
1. Wet the toothbrush.
2. Put toothpaste on it.
3. Brush all your teeth.
4. Rinse your mouth.

**Order matters!** What if you rinsed first and put toothpaste on last? It wouldn't work.

**Computers follow algorithms exactly.** They do just what you say, in the order you say it. If a step is missing, the computer can't guess what you meant.

**Try it:** Tell a partner how to draw a smiley face, one step at a time. Did they draw what you pictured?`,
            questions: [
              mc("What is an algorithm?", "A list of steps to do a task", ["A kind of robot", "A computer screen", "A video game"], "Algorithms are step-by-step instructions."),
              mc("Making a sandwich: what comes first?", "Get two slices of bread", ["Take a bite", "Cut the sandwich in half", "Put the plate away"], "You need bread before you can do the other steps."),
              tf("A computer can guess a step you forgot to tell it.", false, "Computers follow instructions exactly."),
              tf("The order of steps in an algorithm matters.", true, "Doing steps out of order can make the task fail."),
            ],
          },
          {
            title: "Patterns and Repeating",
            summary: "Spotting patterns lets us repeat steps instead of writing them over and over.",
            objectives: ["Find a repeating pattern", "Use 'repeat' to shorten instructions"],
            vocab: [["pattern", "something that repeats in a regular way"], ["loop", "repeating the same steps"]],
            standards: ["1A-AP-09", "1A-AP-10"],
            body: `
A **pattern** repeats: 🔴🔵🔴🔵🔴🔵

**Dance moves:** clap, stomp, clap, stomp, clap, stomp
Instead of saying all six moves, say: **repeat 3 times: clap, stomp**.

Repeating steps is called a **loop**. Loops make instructions **shorter** and easier to read.

**Robot walk:** to move a robot 5 squares, you could write "step" 5 times, or **repeat 5 times: step**.

**What comes next?** 🍎🍌🍎🍌🍎 … **🍌**!`,
            questions: [
              mc("What comes next? 🔺🟦🔺🟦🔺 …", "🟦", ["🔺", "🟢", "⭐"], "The pattern alternates triangle, square."),
              num("'Repeat 4 times: jump' makes you jump how many times?", 4, "The loop runs 4 times."),
              mc("Why do we use loops?", "To repeat steps without writing them again", ["To make instructions longer", "To stop the computer", "To change colors"], "Loops make instructions shorter."),
              tf("'Clap, clap, clap' can be written as 'repeat 3 times: clap'.", true, "That's a loop!"),
            ],
          },
        ],
      },
      {
        title: "Being Safe and Kind Online",
        description: "Protect personal information and use technology responsibly.",
        lessons: [
          {
            title: "Passwords and Private Information",
            summary: "Keep passwords secret and share personal information only with trusted adults.",
            objectives: ["Explain why passwords are kept private", "Identify information that should not be shared online"],
            vocab: [["password", "a secret word that protects an account"], ["private information", "facts about you like your address or phone number"]],
            standards: ["1A-NI-04"],
            body: `
A **password** is like a key to your house. Only you (and your grown-ups) should have it.

**Password rules**
- Don't share your password with friends.
- Make it hard to guess (not your name or "1234").
- Tell a trusted adult if someone asks for it.

**Private information** should stay private online:
- your full name
- your home address
- your phone number
- your school's name
- photos that show where you live

**If something online makes you feel uncomfortable**, stop and **tell a trusted adult** right away.`,
            questions: [
              mc("Who can you share your password with?", "A parent or trusted adult", ["Your best friend", "Anyone who asks", "People in a game chat"], "Only trusted adults should know it."),
              mc("Which is private information?", "Your home address", ["Your favorite color", "Your favorite animal", "Your favorite book"], "Your address tells people where you live."),
              tf("'1234' is a strong password.", false, "It is very easy to guess."),
              mc("Something online makes you feel scared. What should you do?", "Tell a trusted adult", ["Keep it a secret", "Reply to it", "Share it with friends"], "Trusted adults can help."),
            ],
          },
          {
            title: "Technology Then and Now",
            summary: "Technology changes how people live, learn, and talk to each other.",
            objectives: ["Compare how people did tasks before and after a technology", "Describe one good and one not-so-good effect of technology"],
            vocab: [["technology", "tools people make to solve problems"], ["computing device", "a machine like a tablet, phone, or computer"]],
            standards: ["1A-IC-16", "1A-CS-01"],
            body: `
**Technology** is any tool people invent to solve problems. A pencil is technology. So is a tablet!

**Then and now**
| Task | Long ago | Today |
|---|---|---|
| Talk to Grandma far away | write a letter (takes days) | video call (instant) |
| Find a book | visit the library | search online |
| Take a photo | film camera, wait for prints | phone camera, see it right away |

**Good effects:** we can learn new things, talk to faraway family, and get help fast.

**Things to watch out for:** too much screen time, less time playing outside, and sharing things we shouldn't.

**Balance is best:** use technology for good things and take breaks to move, play, and talk face-to-face.`,
            questions: [
              mc("Long ago, how did people send a message to someone far away?", "Wrote a letter", ["Sent a text", "Made a video call", "Sent an email"], "Letters took days to arrive."),
              tf("A pencil is a kind of technology.", true, "Technology is any tool made to solve a problem."),
              mc("Which is a good way to use technology?", "Video calling family who live far away", ["Playing games all night", "Sharing your password", "Skipping outdoor play every day"], "Technology helps us stay connected."),
              mc("Which is a computing device?", "A tablet", ["A crayon", "A chair", "A ball"], "Tablets are computers."),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cs-35",
    title: "Coding Foundations",
    subject: "technology",
    grade: 3,
    gradeMax: 5,
    framework: CSTA,
    description: "Block-based programming with sequences, loops, conditionals, events, and debugging.",
    units: [
      {
        title: "Sequences and Loops",
        description: "Write programs as ordered instructions and use loops to repeat.",
        lessons: [
          {
            title: "Programs and Sequences",
            summary: "A program is an algorithm written so a computer can run it.",
            objectives: ["Write a sequence of commands to solve a maze", "Decompose a task into smaller steps"],
            vocab: [["program", "an algorithm written in a language a computer understands"], ["command", "a single instruction"], ["decompose", "break a big problem into smaller parts"]],
            standards: ["1B-AP-08", "1B-AP-11"],
            body: `
A **program** is a set of instructions a computer can follow. Each instruction is a **command**.

**Maze challenge:** a robot at the start must reach the star.
\`\`\`
move forward
move forward
turn right
move forward
\`\`\`
The robot runs the commands **top to bottom, one at a time**.

**Decomposition:** big jobs are easier when you break them into parts. To program a game:
1. Draw the character.
2. Make it move with the arrow keys.
3. Add a goal.
4. Keep score.

**Precision matters:** "go to the star" is too vague for a computer. It needs exact steps.`,
            questions: [
              mc("In what order does a computer run commands in a simple program?", "Top to bottom, one at a time", ["All at once", "Bottom to top", "In random order"], "Programs run in sequence."),
              mc("Breaking a big problem into smaller parts is called…", "decomposition", ["debugging", "looping", "decorating"], "Decompose = break apart."),
              num("A robot runs: forward, forward, forward, turn left, forward. How many 'forward' commands are there?", 4, "Three forwards before the turn and one after."),
              tf("'Go to the star' is a precise enough command for a robot.", false, "Computers need exact, step-by-step commands."),
            ],
          },
          {
            title: "Loops",
            summary: "Loops repeat commands a set number of times or forever.",
            objectives: ["Use repeat loops to shorten programs", "Identify the repeating part of a pattern to put inside a loop"],
            vocab: [["loop", "a command that repeats other commands"], ["iteration", "one time through a loop"]],
            standards: ["1B-AP-10"],
            body: `
Drawing a square:
\`\`\`
move 100   turn 90
move 100   turn 90
move 100   turn 90
move 100   turn 90
\`\`\`
Eight commands! But the same two repeat 4 times:
\`\`\`
repeat 4:
    move 100
    turn 90
\`\`\`
**Same square, 3 lines.**

**Each time through the loop is an iteration.**

**More shapes**
- Triangle: repeat **3**, turn **120°**
- Hexagon: repeat **6**, turn **60°**
- Rule: turn = 360 ÷ number of sides

**Forever loops** keep going until the program stops, like a game that keeps checking for key presses.`,
            questions: [
              num("To draw a triangle with a loop, how many times should you repeat?", 3, "A triangle has 3 sides."),
              num("How many degrees should the turtle turn for each corner of a hexagon?", 60, "360 ÷ 6 = 60."),
              mc("Why use a loop to draw a square?", "It's shorter and easier to change", ["It draws a circle instead", "It makes the program slower", "Loops are required for all programs"], "One loop replaces eight commands."),
              tf("'repeat 5: jump' runs the jump command 5 times.", true, "That's 5 iterations."),
            ],
          },
        ],
      },
      {
        title: "Conditionals and Debugging",
        description: "Make decisions with if/else and find and fix bugs.",
        lessons: [
          {
            title: "Conditionals: If and Else",
            summary: "Conditionals let programs make decisions based on whether something is true.",
            objectives: ["Write if/else statements", "Predict a program's output for different inputs"],
            vocab: [["conditional", "an instruction that runs only if something is true"], ["condition", "a true-or-false question"], ["event", "something that happens, like a click, that starts code"]],
            standards: ["1B-AP-10"],
            body: `
**Conditionals** let programs decide what to do.

\`\`\`
if it is raining:
    take an umbrella
else:
    wear sunglasses
\`\`\`
The **condition** ("it is raining") is either **true** or **false**.

**In a game**
\`\`\`
if touching coin:
    score = score + 1
if touching lava:
    game over
\`\`\`

**Events** start code when something happens:
\`\`\`
when green flag clicked
when space key pressed
\`\`\`

**Combining conditions:** "if it's Saturday **and** it's sunny → go to the park." Both must be true.`,
            questions: [
              mc("Program: if score > 10, say 'You win!' else say 'Keep going'. Score is 7. What does it say?", "Keep going", ["You win!", "Nothing", "Both"], "7 is not greater than 10, so the else part runs."),
              mc("A condition is always…", "true or false", ["a number", "a color", "a loop"], "Conditions are yes/no questions."),
              mc("'When space key pressed' is an example of…", "an event", ["a loop", "a variable", "a bug"], "Events start code when something happens."),
              tf("With 'and', both conditions must be true for the code to run.", true, "That's how 'and' works."),
            ],
          },
          {
            title: "Debugging",
            summary: "A bug is a mistake in code. Debugging means finding and fixing it step by step.",
            objectives: ["Find and fix errors in a program", "Use a step-by-step strategy to test code"],
            vocab: [["bug", "a mistake in a program"], ["debug", "find and fix bugs"], ["test", "run a program to check that it works"]],
            standards: ["1B-AP-15", "1B-AP-12"],
            body: `
A **bug** is a mistake that makes a program do the wrong thing. Even expert programmers write bugs every day!

**Debugging strategy**
1. **Run** the program and watch what happens.
2. **Compare** what happened to what you expected.
3. **Find** the first step where it goes wrong.
4. **Fix** one thing at a time.
5. **Test** again.

**Example:** This should draw a square but draws a strange shape.
\`\`\`
repeat 4:
    move 100
    turn 45
\`\`\`
The bug: the turn should be **90°**, not 45°.

**Growth mindset:** a bug isn't a failure. It's a clue!`,
            questions: [
              mc("What is a bug?", "A mistake in a program", ["An insect inside a computer", "A type of loop", "A fast computer"], "Bugs make programs behave wrongly."),
              num("A 'square' program turns 45° each time. What should the turn be?", 90, "A square has 90° corners."),
              mc("What should you do after fixing a bug?", "Test the program again", ["Delete the program", "Add more bugs", "Stop working"], "Testing confirms the fix worked."),
              tf("Expert programmers never make bugs.", false, "Everyone writes bugs; debugging is part of programming."),
            ],
            writtenPrompt: "Describe a time something you built or made didn't work the first time (code, a craft, a recipe). How did you find the problem and fix it?",
            rubric: "Describes a specific problem. Explains how they noticed what went wrong (compared result to expectation). Describes a step-by-step fix and testing again. Shows a growth mindset about mistakes.",
          },
        ],
      },
    ],
  },
  {
    id: "cs-68",
    title: "Computer Science Discoveries",
    subject: "technology",
    grade: 6,
    gradeMax: 8,
    framework: CSTA,
    description: "Text-based programming with variables, conditionals, and loops; data representation; and cybersecurity.",
    units: [
      {
        title: "Programming Fundamentals",
        description: "Store data in variables and control program flow.",
        lessons: [
          {
            title: "Variables and Data Types",
            summary: "Variables store values that a program can use and change.",
            objectives: ["Create and update variables", "Distinguish numbers, strings, and booleans", "Trace the value of a variable through a program"],
            vocab: [["variable", "a named place to store a value"], ["string", "text, written in quotes"], ["boolean", "a value that is true or false"], ["assignment", "giving a variable a value with ="]],
            standards: ["2-AP-11"],
            body: `
A **variable** is a labeled box that holds a value.

\`\`\`javascript
let score = 0;          // number
let name = "Ava";       // string (text)
let gameOver = false;   // boolean
\`\`\`

**Updating variables**
\`\`\`javascript
score = score + 10;   // score is now 10
score = score * 2;    // score is now 20
\`\`\`
**=** means "assign" (store), not "equals." The right side is calculated first, then stored.

**Tracing a program**
\`\`\`javascript
let x = 5;
let y = x + 3;   // y = 8
x = y * 2;       // x = 16
\`\`\`

**Strings join with +:** "Hi, " + name → "Hi, Ava"

**Good names** describe the value: \`livesLeft\` is better than \`x\`.`,
            questions: [
              num("let a = 4; a = a + 6; a = a * 3; What is a?", 30, "4 + 6 = 10, then 10 × 3 = 30."),
              mc("Which data type is \"hello\"?", "string", ["number", "boolean", "loop"], "Text in quotes is a string."),
              mc("What does = do in: score = score + 1?", "Stores a new value in score", ["Checks if two things are equal", "Ends the program", "Prints score"], "= is the assignment operator."),
              mc("Which is the best variable name for the number of lives?", "livesLeft", ["x", "thing", "aaa"], "Descriptive names make code readable."),
            ],
            programmingLanguage: "javascript",
          },
          {
            title: "Conditionals and Loops in Code",
            summary: "Use if/else with comparison operators and for/while loops to control flow.",
            objectives: ["Write conditionals with comparison and logical operators", "Write for and while loops", "Predict program output"],
            vocab: [["comparison operator", "<, >, <=, >=, ===, !=="], ["logical operator", "&& (and), || (or), ! (not)"], ["for loop", "repeats a set number of times"], ["while loop", "repeats as long as a condition is true"]],
            standards: ["2-AP-12"],
            body: `
**Conditionals**
\`\`\`javascript
if (temperature > 30) {
  console.log("Hot!");
} else if (temperature > 15) {
  console.log("Nice");
} else {
  console.log("Cold");
}
\`\`\`
temperature = 20 → prints **"Nice"**

**Logical operators:** \`&&\` (and), \`||\` (or), \`!\` (not)
\`if (age >= 13 && hasPermission)\` → both must be true

**for loop**: repeat a known number of times
\`\`\`javascript
for (let i = 1; i <= 5; i++) {
  console.log(i);   // prints 1 2 3 4 5
}
\`\`\`

**while loop**: repeat while a condition is true
\`\`\`javascript
let n = 1;
while (n < 100) {
  n = n * 2;
}
// n ends at 128
\`\`\`
Careful: if the condition never becomes false, you get an **infinite loop**.`,
            questions: [
              mc("let x = 8; if (x > 10) { print('A') } else if (x > 5) { print('B') } else { print('C') }. Output?", "B", ["A", "C", "A and B"], "8 is not > 10, but it is > 5."),
              num("How many times does this run? for (let i = 0; i < 4; i++)", 4, "i takes the values 0, 1, 2, 3."),
              mc("Which is true when a = 5 and b = 3?", "a > 2 && b < 5", ["a < 2 || b > 5", "!(a > b)", "a === b"], "5 > 2 is true and 3 < 5 is true."),
              num("let n = 1; while (n < 20) { n = n * 3 }. What is n at the end?", 27, "1 → 3 → 9 → 27. 27 is not < 20, so the loop stops."),
            ],
            programmingLanguage: "javascript",
          },
        ],
      },
      {
        title: "Data and Cybersecurity",
        description: "Represent information in binary and protect it from threats.",
        lessons: [
          {
            title: "Binary and Data Representation",
            summary: "Computers store everything (numbers, text, images) as 0s and 1s.",
            objectives: ["Convert between binary and decimal for small numbers", "Explain how text and images are represented with bits"],
            vocab: [["bit", "a binary digit: 0 or 1"], ["byte", "8 bits"], ["binary", "base-2 number system"], ["pixel", "a single dot of color in an image"]],
            standards: ["2-DA-07"],
            body: `
Computers use **bits**: 0 (off) and 1 (on).

**Binary place values** double from right to left:
| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|

**Binary → decimal:** 1011 = 8 + 0 + 2 + 1 = **11**
**Decimal → binary:** 13 = 8 + 4 + 1 → **1101**

**How many values?** n bits can represent **2ⁿ** values. 1 byte (8 bits) = 256 values (0–255).

**Text:** each character has a number code. In ASCII, "A" = 65 = 01000001.

**Images:** a picture is a grid of **pixels**. Each pixel's color is stored as red, green, and blue values (0–255 each). That's 24 bits per pixel, so more than 16 million possible colors.

**Bigger files:** more pixels or more colors → more bits → larger files.`,
            questions: [
              num("What is binary 1010 in decimal?", 10, "8 + 0 + 2 + 0 = 10."),
              short("Write the decimal number 6 in binary.", ["110", "0110"], "6 = 4 + 2 → 110."),
              num("How many different values can 3 bits represent?", 8, "2³ = 8 (000 through 111)."),
              num("How many bits are in one byte?", 8, "1 byte = 8 bits."),
            ],
          },
          {
            title: "Cybersecurity Basics",
            summary: "Strong passwords, two-factor authentication, and spotting phishing protect your information.",
            objectives: ["Explain what makes a password strong", "Recognize phishing attempts", "Describe physical and digital security measures"],
            vocab: [["phishing", "a fake message designed to trick you into giving information"], ["two-factor authentication (2FA)", "a second proof of identity beyond a password"], ["encryption", "scrambling data so only authorized people can read it"]],
            standards: ["2-NI-05", "2-NI-06"],
            body: `
**Strong passwords**
- **Long** beats complex: a passphrase like \`purple-tiger-pizza-river\` is easier to remember and harder to crack than \`P@ss1\`.
- Use a **different password** for each account (a password manager helps).
- Never share passwords.

**Why length matters:** each added character multiplies the number of possible passwords. With 26 lowercase letters, 8 characters give 26⁸ ≈ 209 billion options; 12 characters give 26¹² ≈ 95 quadrillion.

**Two-factor authentication (2FA)** requires something you **know** (password) plus something you **have** (a code on your phone). Even a stolen password isn't enough.

**Phishing red flags**
- Urgent or scary language ("Your account will be deleted!")
- Misspelled sender addresses (paypa1.com)
- Unexpected links or attachments
- Requests for passwords or personal info

**Encryption** scrambles data so it can only be read with a key. Look for **https://** before entering information on a website.`,
            questions: [
              mc("Which password is strongest?", "correct-horse-battery-staple", ["password123", "Ab1!", "qwerty"], "Long passphrases have far more possible combinations."),
              mc("An email says 'Click now or your account will be closed!' from support@amaz0n-help.com. This is likely…", "phishing", ["a real security alert", "encryption", "two-factor authentication"], "Urgent language plus a fake domain are red flags."),
              tf("With 2FA, a stolen password alone is not enough to log in.", true, "The attacker also needs the second factor."),
              mc("What does https:// indicate?", "The connection is encrypted", ["The site is free", "The site has no ads", "The site is for kids"], "The 's' stands for secure (encrypted)."),
            ],
            writtenPrompt: "Write a short guide for a younger student explaining two ways to keep their accounts safe and how to recognize a phishing message.",
            rubric: "Two clear safety strategies (strong/unique passphrases, 2FA, not sharing passwords, password manager). At least two phishing red flags (urgency, suspicious sender, unexpected links, requests for info). Uses age-appropriate language.",
          },
        ],
      },
    ],
  },
  {
    id: "eng-68",
    title: "Engineering Design",
    subject: "engineering",
    grade: 6,
    gradeMax: 8,
    framework: NGSS_ETS,
    description: "Define problems with criteria and constraints, evaluate solutions, then prototype, test, and iterate.",
    units: [
      {
        title: "Defining and Designing",
        description: "Turn a need into a clearly defined problem and choose among possible solutions.",
        lessons: [
          {
            title: "Criteria and Constraints",
            summary: "Engineers define what success looks like (criteria) and the limits they must work within (constraints).",
            objectives: ["Write a problem statement with criteria and constraints", "Distinguish criteria from constraints"],
            vocab: [["criteria", "requirements a successful solution must meet"], ["constraints", "limits on the design, like cost, time, or materials"], ["engineering design process", "define → develop → optimize, repeated"]],
            standards: ["MS-ETS1-1"],
            body: `
**The engineering design process**
1. **Define** the problem
2. **Research** and brainstorm
3. **Develop** possible solutions
4. **Build** a prototype
5. **Test** and evaluate
6. **Improve** (iterate)

**Step 1 is the most important.** A clear problem statement includes:

**Criteria**: what the solution must **do** (measurable goals)
- Holds at least 500 g
- Keeps ice frozen for 2 hours

**Constraints**: the **limits** you must work within
- Budget of $10
- Only paper and tape
- Must fit in a 30 cm box
- Done in 3 class periods

**Example problem statement:** "Design a container that keeps an ice cube from melting for at least 60 minutes (criterion) using only materials from the supply table and costing less than $5 (constraints)."

**Consider people and the environment:** who will use it, is it safe, and what happens when it's thrown away?`,
            questions: [
              mc("'The bridge must hold 2 kg' is a…", "criterion", ["constraint", "prototype", "test"], "It describes what success looks like."),
              mc("'You may only use 20 popsicle sticks' is a…", "constraint", ["criterion", "result", "iteration"], "It limits the design."),
              mc("What is the first step of the engineering design process?", "Define the problem", ["Build a prototype", "Test the design", "Paint the final product"], "You need to know what problem you're solving."),
              tf("Constraints can include cost and time.", true, "Budget and deadlines are common constraints."),
            ],
          },
          {
            title: "Brainstorming and the Decision Matrix",
            summary: "Generate many ideas, then compare them systematically against the criteria.",
            objectives: ["Brainstorm multiple solutions", "Use a weighted decision matrix to select the best design"],
            vocab: [["brainstorming", "generating many ideas without judging them"], ["decision matrix", "a table that scores options against criteria"], ["trade-off", "giving up some of one quality to gain another"]],
            standards: ["MS-ETS1-2"],
            body: `
**Brainstorming rules:** go for quantity, build on others' ideas, and don't criticize yet. Wild ideas welcome!

**Decision matrix:** score each design (1–5) on each criterion, multiply by the criterion's **weight**, and add.

| Criterion (weight) | Design A | Design B | Design C |
|---|---|---|---|
| Strength (×3) | 4 → 12 | 5 → 15 | 3 → 9 |
| Cost (×2) | 3 → 6 | 2 → 4 | 5 → 10 |
| Ease of building (×1) | 4 → 4 | 2 → 2 | 4 → 4 |
| **Total** | **22** | **21** | **23** |

Design C wins even though it isn't the strongest, because it's cheap and easy to build.

**Trade-offs:** making a phone thinner might shrink its battery. Engineers balance competing criteria rather than maximizing just one.

**Combine ideas:** often the best design takes the strongest features of several brainstormed ideas.`,
            questions: [
              mc("During brainstorming, you should…", "generate many ideas without criticizing", ["choose the first idea", "only share perfect ideas", "build right away"], "Judging comes later."),
              num("A design scores 4 on strength (weight 3) and 2 on cost (weight 2). What is its weighted total?", 16, "4×3 + 2×2 = 12 + 4 = 16."),
              tf("The design with the highest score on one criterion always wins a decision matrix.", false, "Totals across all weighted criteria decide."),
              mc("A lighter bike frame that's less durable is an example of a…", "trade-off", ["constraint", "prototype", "test"], "Gaining one quality costs another."),
            ],
          },
        ],
      },
      {
        title: "Prototyping and Testing",
        description: "Build models, collect test data, and improve designs through iteration.",
        lessons: [
          {
            title: "Prototypes and Models",
            summary: "Prototypes let engineers test ideas cheaply before building the real thing.",
            objectives: ["Describe types of models (physical, computer, mathematical)", "Explain why engineers prototype early"],
            vocab: [["prototype", "an early working version of a design used for testing"], ["model", "a representation of a system, physical or digital"], ["scale model", "a smaller (or larger) copy with the same proportions"]],
            standards: ["MS-ETS1-4"],
            body: `
A **prototype** is an early, often rough, version built to **test an idea**.

**Types of models**
- **Physical:** cardboard mock-ups, 3D prints, clay
- **Computer:** CAD drawings and simulations (test a bridge virtually)
- **Mathematical:** equations that predict performance

**Why prototype early?** Fixing a problem is far cheaper on paper or cardboard than after manufacturing. A $5 cardboard prototype can reveal a flaw that would cost thousands to fix in steel.

**Scale models:** a 1:50 model bridge is 50 times smaller than the real one. If the real bridge is 100 m long, the model is 2 m.

**Fidelity:** start with low-fidelity prototypes (quick and cheap) and move to high-fidelity ones (closer to the final product) as the design improves.`,
            questions: [
              mc("Why do engineers build prototypes?", "To test ideas cheaply before final production", ["Because they are the final product", "To avoid testing", "To make designs more expensive"], "Prototypes reveal problems early."),
              num("A 1:20 scale model car is 25 cm long. How long is the real car in cm?", 500, "25 × 20 = 500 cm (5 m)."),
              mc("A bridge simulated in CAD software is a…", "computer model", ["physical model", "constraint", "criterion"], "It exists digitally."),
              tf("Early prototypes should be expensive and polished.", false, "Early prototypes are quick and cheap."),
            ],
          },
          {
            title: "Testing, Data, and Iteration",
            summary: "Fair tests produce data that guide improvements; designs get better through repeated cycles.",
            objectives: ["Design a fair test with controlled variables", "Analyze test data to identify the best design features", "Explain iteration"],
            vocab: [["iteration", "repeating the design cycle to improve"], ["controlled variable", "a factor kept the same in every test"], ["failure point", "where or when a design breaks"]],
            standards: ["MS-ETS1-3", "MS-ETS1-4"],
            body: `
**Fair tests:** change only **one variable** at a time and keep everything else the same.
Testing bridge designs? Use the same load, same span, same method of adding weight.

**Collect data:** run each test **multiple times** (at least 3) and average the results to reduce error.

| Design | Trial 1 | Trial 2 | Trial 3 | Average |
|---|---|---|---|---|
| Truss | 2.1 kg | 2.4 kg | 2.2 kg | **2.23 kg** |
| Arch | 1.6 kg | 1.8 kg | 1.7 kg | **1.70 kg** |

**Analyze failures:** *where* did it break? If every truss failed at the center joint, reinforce that joint.

**Iterate:** use what you learned to improve, then test again. The Wright brothers built and tested hundreds of wing designs in a homemade wind tunnel before their first flight.

**Combine the best features:** if Design A was strong and Design B was light, a new design might use A's structure with B's materials.`,
            questions: [
              mc("In a fair test of paper airplane wing shapes, which should stay the same?", "The type of paper and the throw method", ["The wing shape", "Nothing", "The person's mood"], "Only the variable being tested should change."),
              num("A design held 3.0, 3.6, and 3.3 kg in three trials. What is the average (kg)?", 3.3, "(3.0 + 3.6 + 3.3)/3 = 3.3.", { tolerance: 0.01 }),
              mc("Why run multiple trials?", "To reduce the effect of random error", ["To make the test take longer", "To change the variables", "Because the first trial is always wrong"], "Averaging gives more reliable data."),
              tf("Iteration means repeating the design cycle to improve a solution.", true, "Designs improve through repeated test-and-revise cycles."),
            ],
            writtenPrompt: "Your team's tower collapsed at 1.2 kg and the criterion is 2 kg. Describe how you would use your test data to plan the next iteration.",
            rubric: "Identifies the failure point from observations. Proposes a specific change targeting that failure (e.g., cross-bracing, wider base). Describes a fair re-test with controlled variables and multiple trials. Compares new data to the 2 kg criterion.",
          },
        ],
      },
    ],
  },
  {
    id: "csp",
    title: "Computer Science Principles",
    subject: "technology",
    grade: 9,
    gradeMax: 12,
    framework: CSTA,
    description: "Procedures and lists in Python, how the internet works, and the societal impact of computing. Aligned to AP CSP topics.",
    units: [
      {
        title: "Algorithms and Programming",
        description: "Write modular programs with procedures and process collections of data with lists.",
        lessons: [
          {
            title: "Procedures and Abstraction",
            summary: "Functions package reusable steps behind a name, with parameters and return values.",
            objectives: ["Define and call functions with parameters", "Distinguish printing from returning", "Explain how procedural abstraction manages complexity"],
            vocab: [["procedure / function", "a named group of instructions that can be reused"], ["parameter", "an input variable a function receives"], ["return value", "the output a function sends back"], ["abstraction", "hiding details to focus on what something does"]],
            standards: ["3A-AP-17", "3A-AP-18"],
            body: `
A **function** packages steps under a name so you can reuse them.

\`\`\`python
def area_of_rectangle(length, width):
    return length * width

print(area_of_rectangle(4, 5))   # 20
\`\`\`
- \`length\` and \`width\` are **parameters**.
- \`4\` and \`5\` are **arguments** (the actual values passed in).
- \`return\` sends a value back to the caller.

**return vs. print:** \`print\` shows something on screen; \`return\` gives a value back that the program can store and use:
\`total = area_of_rectangle(4, 5) + area_of_rectangle(2, 3)\` → **26**

**Procedural abstraction:** you can use \`sqrt()\` without knowing how it computes square roots. Good functions hide details and make programs easier to read, test, and fix.

**Decomposition:** a game might have \`move_player()\`, \`check_collisions()\`, and \`update_score()\`, each simple on its own.`,
            questions: [
              num("def f(x): return 2 * x + 1. What is f(5)?", 11, "2(5) + 1 = 11."),
              num("def add(a, b): return a + b. What is add(3, add(4, 5))?", 12, "Inner call: 9. Outer: 3 + 9 = 12."),
              mc("In def greet(name):, what is name?", "A parameter", ["A return value", "A loop", "A string literal"], "It's the input variable the function receives."),
              tf("A function that prints a value also returns it so it can be stored in a variable.", false, "Printing displays a value; only return sends it back."),
            ],
            programmingLanguage: "python",
          },
          {
            title: "Lists and Iteration",
            summary: "Lists store collections; loops traverse them to filter, count, and compute.",
            objectives: ["Create, index, and modify lists", "Traverse a list with a loop to compute a sum, average, or maximum", "Use lists to simplify solutions"],
            vocab: [["list", "an ordered collection of values"], ["index", "the position of an element (starts at 0 in Python)"], ["traversal", "visiting each element of a list in order"]],
            standards: ["3A-AP-14", "3A-AP-15"],
            body: `
A **list** holds many values in one variable.

\`\`\`python
scores = [88, 92, 75, 64, 99]
print(scores[0])      # 88 (indexes start at 0)
print(len(scores))    # 5
scores.append(81)     # add to the end
\`\`\`

**Traversal patterns**
\`\`\`python
total = 0
for s in scores:
    total = total + s
average = total / len(scores)
\`\`\`

**Filtering**
\`\`\`python
passing = []
for s in scores:
    if s >= 70:
        passing.append(s)
\`\`\`

**Finding the maximum**
\`\`\`python
best = scores[0]
for s in scores:
    if s > best:
        best = s
\`\`\`

**Why lists?** Without them you'd need score1, score2, … score500. Lists let the same code handle 5 values or 5 million.

*Note:* the AP exam's pseudocode starts list indexes at **1**; Python starts at **0**.`,
            questions: [
              num("nums = [3, 8, 2, 9]. In Python, what is nums[2]?", 2, "Index 0 is 3, index 1 is 8, index 2 is 2."),
              num("What does this print? total = 0; for n in [4, 5, 6]: total += n; print(total)", 15, "4 + 5 + 6 = 15."),
              num("vals = [10, 20, 30]; vals.append(40); What is len(vals)?", 4, "Appending adds one element."),
              mc("Which loop body counts how many items in a list are greater than 50?", "if x > 50: count = count + 1", ["count = x", "if x > 50: count = x", "count = count + x"], "Increment a counter each time the condition is true."),
            ],
            programmingLanguage: "python",
          },
        ],
      },
      {
        title: "The Internet and Impacts of Computing",
        description: "Explain how data travels across networks and evaluate computing's effects on society.",
        lessons: [
          {
            title: "How the Internet Works",
            summary: "Data is split into packets, addressed with IP, routed redundantly, and reassembled with TCP.",
            objectives: ["Describe packets, IP addresses, routers, and DNS", "Explain how redundancy makes the internet fault-tolerant", "Distinguish bandwidth and latency"],
            vocab: [["packet", "a small chunk of data with addressing information"], ["IP address", "a numeric address that identifies a device on a network"], ["DNS", "the system that translates domain names into IP addresses"], ["fault tolerance", "continuing to work when parts fail"]],
            standards: ["3A-NI-04"],
            body: `
**What happens when you visit a website?**
1. **DNS** translates \`example.com\` into an **IP address** like \`203.0.113.7\`.
2. Your request is split into **packets**, each labeled with the source and destination addresses.
3. **Routers** forward each packet toward its destination. Packets may take **different paths**.
4. **TCP** reassembles packets in order and requests any that went missing.
5. The server's response comes back the same way.

**Protocols** are agreed-upon rules: IP (addressing/routing), TCP (reliable delivery), HTTP/HTTPS (web pages), DNS (names).

**Fault tolerance:** the internet has **redundant** paths. If a router fails, packets route around it. The design traces back to ARPANET research in the 1960s.

**Bandwidth vs. latency**
- **Bandwidth:** how much data per second (Mbps), like the width of a pipe
- **Latency:** how long a packet takes to arrive (ms), like the length of the pipe

**IPv4 vs. IPv6:** IPv4 has 2³² ≈ 4.3 billion addresses, not enough. IPv6 uses 128 bits (2¹²⁸ addresses).`,
            questions: [
              mc("What does DNS do?", "Translates domain names into IP addresses", ["Encrypts web pages", "Speeds up your computer", "Stores your passwords"], "DNS is like the internet's phone book."),
              tf("All packets in a message must travel along the same path.", false, "Packets can take different routes and are reassembled at the destination."),
              mc("The internet keeps working when a router fails because of…", "redundant routing paths", ["faster bandwidth", "DNS caching", "larger packets"], "Redundancy provides fault tolerance."),
              num("IPv4 addresses are how many bits long?", 32, "IPv4 uses 32-bit addresses (about 4.3 billion)."),
            ],
          },
          {
            title: "Impacts of Computing and Data Privacy",
            summary: "Computing innovations bring benefits and harms, including bias, privacy loss, and the digital divide.",
            objectives: ["Evaluate beneficial and harmful effects of a computing innovation", "Explain how algorithmic bias arises", "Describe the digital divide"],
            vocab: [["digital divide", "unequal access to computing and the internet"], ["algorithmic bias", "systematic unfairness in a computer system's outputs"], ["PII", "personally identifiable information"], ["crowdsourcing", "getting input from many people online"]],
            standards: ["3A-IC-24", "3A-IC-25", "3A-IC-30"],
            body: `
Every computing innovation has **intended** and **unintended** effects, and they can be both **beneficial** and **harmful**.

**Example: GPS navigation**
- ✅ Saves time, helps emergency responders find people
- ⚠️ Tracks location data that can be sold or misused

**Algorithmic bias:** machine-learning systems learn from data. If the training data underrepresents some groups, the system can perform worse for them. One example is facial-recognition systems that misidentify people with darker skin at higher rates. Bias can enter through the **data**, the **design choices**, or the **people** building the system.

**Privacy and PII:** names, addresses, location history, and browsing habits can be combined to identify and profile individuals. Apps often collect more than they need.

**The digital divide:** access differs by income, geography (rural broadband), age, and disability. Students without home internet face a "homework gap."

**Positive impact at scale:** crowdsourcing (e.g., citizen-science projects classifying galaxies), open-source software, and accessible design reach millions.`,
            questions: [
              mc("A hiring algorithm trained mostly on past employees from one group ranks other applicants lower. This is an example of…", "algorithmic bias", ["the digital divide", "fault tolerance", "encryption"], "Biased training data leads to biased outputs."),
              mc("Which is personally identifiable information (PII)?", "Your home address", ["Your favorite movie genre", "The weather today", "A public library's hours"], "PII can identify a specific person."),
              mc("Rural students lacking broadband access illustrates…", "the digital divide", ["algorithmic bias", "crowdsourcing", "abstraction"], "Unequal access to technology."),
              tf("A computing innovation can be both beneficial and harmful.", true, "Most innovations have trade-offs."),
            ],
            writtenPrompt: "Choose a computing innovation you use (a social media app, a voice assistant, a fitness tracker). Describe one beneficial effect, one harmful effect, and one data privacy concern.",
            rubric: "Names a specific innovation. Gives a concrete benefit. Gives a concrete harm or unintended consequence. Identifies what data is collected and how it could be misused. Explains reasoning for each.",
          },
        ],
      },
    ],
  },
  {
    id: "eng-912",
    title: "Engineering Design & Robotics",
    subject: "engineering",
    grade: 9,
    gradeMax: 12,
    framework: NGSS_ETS,
    description: "Systems engineering, mechanical advantage, sensors and feedback control, and designing for real-world constraints.",
    units: [
      {
        title: "Mechanisms and Systems",
        description: "Analyze simple machines and break complex problems into subsystems.",
        lessons: [
          {
            title: "Simple Machines and Mechanical Advantage",
            summary: "Levers, pulleys, and gears trade force for distance (or speed) to make work easier.",
            objectives: ["Calculate mechanical advantage for levers, pulleys, and gear trains", "Explain the force–distance trade-off"],
            vocab: [["mechanical advantage (MA)", "output force ÷ input force"], ["gear ratio", "driven teeth ÷ driver teeth"], ["torque", "a turning force: force × lever arm"]],
            standards: ["HS-ETS1-2", "HS-PS2-1"],
            body: `
Machines don't create energy. They **trade force for distance**.
**Work in ≈ work out** (minus losses to friction).

**Mechanical advantage:** MA = output force ÷ input force

**Levers:** MA = effort arm ÷ load arm
A 2 m crowbar with the fulcrum 0.4 m from the load → effort arm 1.6 m → MA = 1.6/0.4 = **4**. A 100 N push lifts 400 N, but your hand moves 4× farther.

**Pulleys:** MA ≈ the number of rope segments supporting the load. A block-and-tackle with 4 supporting segments → MA = 4.

**Gears:** gear ratio = driven gear teeth ÷ driving gear teeth
- 12-tooth motor gear driving a 36-tooth wheel gear → ratio 3:1
- Output turns **3× slower** with **~3× the torque** (good for a robot climbing a ramp)
- Reverse it for speed instead of torque.

**Efficiency** = (work out ÷ work in) × 100%. Real machines are always below 100%.`,
            questions: [
              num("A lever has an effort arm of 3 m and a load arm of 0.5 m. What is its mechanical advantage?", 6, "3 ÷ 0.5 = 6."),
              num("A 10-tooth gear drives a 40-tooth gear. What is the gear ratio (driven ÷ driver)?", 4, "40 ÷ 10 = 4 (4:1)."),
              mc("Using a 4:1 gear reduction on a robot's wheels gives…", "more torque and less speed", ["more speed and less torque", "more speed and more torque", "no change"], "Gear reduction trades speed for torque."),
              tf("A machine with mechanical advantage of 5 reduces the total work you do by 5 times.", false, "Force is reduced, but you move 5× the distance. Work stays about the same."),
            ],
          },
          {
            title: "Systems Thinking and Subsystems",
            summary: "Break complex designs into subsystems with defined inputs, outputs, and interfaces.",
            objectives: ["Decompose a complex system into subsystems", "Describe inputs, processes, outputs, and feedback"],
            vocab: [["system", "interacting parts that work together for a purpose"], ["subsystem", "a smaller system within a larger one"], ["interface", "where subsystems connect and exchange energy, matter, or information"]],
            standards: ["HS-ETS1-2", "HS-ETS1-4"],
            body: `
**Systems thinking:** complex problems are solved by breaking them into smaller, manageable **subsystems**.

**A delivery robot's subsystems**
| Subsystem | Job |
|---|---|
| Power | battery, voltage regulation |
| Drivetrain | motors, gears, wheels |
| Sensing | cameras, distance sensors, encoders |
| Control | microcontroller running the program |
| Communication | Wi-Fi/Bluetooth link |
| Structure | chassis that holds it all |

**Input → Process → Output (+ Feedback)**
- Input: sensor detects an obstacle 30 cm ahead
- Process: controller decides to turn
- Output: motors change speed
- Feedback: sensor checks the new path

**Interfaces** are where problems hide: does the battery provide enough current for both motors at once? Does the sensor's mounting bracket fit the chassis?

**Real engineering teams** assign subsystems to sub-teams and agree on interfaces first. NASA's Mars rovers were designed this way, with each subsystem tested separately and then integrated.`,
            questions: [
              mc("A robot's motors, gears, and wheels make up which subsystem?", "Drivetrain", ["Sensing", "Power", "Communication"], "The drivetrain moves the robot."),
              mc("In a thermostat, the temperature sensor provides the…", "input", ["output", "process", "structure"], "The sensor measures conditions and feeds the controller."),
              tf("Many system failures happen at the interfaces between subsystems.", true, "That's why interfaces are defined and tested carefully."),
              mc("Why break a complex design into subsystems?", "To make it manageable and allow parallel work and testing", ["To make it more expensive", "To avoid testing", "Because subsystems never interact"], "Decomposition manages complexity."),
            ],
          },
        ],
      },
      {
        title: "Sensors, Control, and Real-World Design",
        description: "Use feedback control and evaluate designs against societal constraints.",
        lessons: [
          {
            title: "Sensors and Feedback Control",
            summary: "Closed-loop control compares a measured value to a target and adjusts automatically.",
            objectives: ["Distinguish open-loop and closed-loop control", "Explain proportional control and error", "Select appropriate sensors for a task"],
            vocab: [["open-loop control", "acts without measuring the result"], ["closed-loop control", "uses sensor feedback to adjust output"], ["error", "target value − measured value"], ["proportional control", "output proportional to the error"]],
            standards: ["HS-ETS1-2", "HS-ETS1-4"],
            body: `
**Open-loop:** a toaster runs for a set time whether the bread is pale or burnt. No feedback.

**Closed-loop:** a thermostat measures room temperature and turns the heat on or off to reach the target. It uses **feedback**.

**Error = target − measured**

**Proportional control (the P in PID):** output = Kp × error
A line-following robot: if the light sensor reads 20 units off the line's edge and Kp = 2, steer by 40. Small error → small correction; big error → big correction.
- Kp too small → sluggish
- Kp too big → overshoots and oscillates

**Common sensors**
| Sensor | Measures | Example use |
|---|---|---|
| Ultrasonic | distance | avoid obstacles |
| Encoder | wheel rotation | measure distance traveled |
| Gyroscope | rotation rate | turn exactly 90° |
| Light/color | reflected light | follow a line |
| Limit switch | contact | detect an arm reaching its end |

**Real systems:** cruise control, drone stabilization, and insulin pumps all use closed-loop control.`,
            questions: [
              mc("Which is a closed-loop system?", "A thermostat that turns the heater on when the room is cold", ["A microwave set to run for 2 minutes", "A light switch", "A wind-up toy"], "It measures and adjusts based on feedback."),
              num("A robot's target distance is 50 cm and its sensor reads 35 cm. What is the error (cm)?", 15, "Error = 50 − 35 = 15."),
              num("With proportional gain Kp = 3 and an error of 4, what is the control output?", 12, "Output = Kp × error = 3 × 4 = 12."),
              mc("Which sensor would you use to make a robot turn exactly 90°?", "Gyroscope", ["Ultrasonic", "Limit switch", "Light sensor"], "A gyroscope measures rotation."),
            ],
          },
          {
            title: "Designing for People, Cost, and the Environment",
            summary: "Real-world designs balance safety, reliability, cost, aesthetics, and social and environmental impacts.",
            objectives: ["Evaluate a design against societal and environmental criteria", "Apply human-centered design", "Weigh trade-offs to recommend a solution"],
            vocab: [["human-centered design", "designing around users' real needs and abilities"], ["life-cycle cost", "total cost including maintenance and disposal"], ["universal design", "designing so everyone can use a product, including people with disabilities"]],
            standards: ["HS-ETS1-1", "HS-ETS1-3"],
            body: `
Engineering problems rarely have one right answer. Designs must balance:
- **Safety & reliability**
- **Cost**, including **life-cycle cost** (build, operate, maintain, dispose)
- **Social impact:** who benefits, who might be harmed?
- **Environmental impact:** materials, energy use, recyclability
- **Aesthetics & usability**

**Human-centered design:** interview and observe real users *before* designing. Engineers designing a water pump for a village learned that women did most water collection, so pump height and handle force were redesigned for them.

**Universal design:** curb cuts were made for wheelchair users but help everyone pushing strollers, carts, and luggage.

**Global challenges** (NAE Grand Challenges): clean water, renewable energy, affordable medicine. These require weighing local cultural, economic, and environmental constraints.

**Ethics:** engineers have a responsibility to public safety. The 1986 Challenger disaster showed what happens when safety concerns are overridden by schedule pressure.`,
            questions: [
              mc("Curb cuts that help wheelchair users, parents with strollers, and travelers are an example of…", "universal design", ["open-loop control", "planned obsolescence", "a gear reduction"], "Designing for accessibility benefits everyone."),
              mc("Which cost includes maintenance and disposal?", "Life-cycle cost", ["Material cost", "Shipping cost", "Prototype cost"], "Life-cycle cost covers the whole lifespan."),
              tf("Human-centered design starts by understanding users' needs.", true, "Interview and observe users before designing."),
              mc("The Challenger disaster is often studied as a lesson in…", "engineering ethics and safety culture", ["gear ratios", "binary numbers", "DNS"], "Safety warnings were overridden by schedule pressure."),
            ],
            writtenPrompt: "Propose a design to help a local community solve a real problem (e.g., safe crossing near a school, clean drinking water at a park). Identify the users, two criteria, two constraints, and one trade-off you'd need to make.",
            rubric: "Clearly defined problem and specific users. Two measurable criteria. Two realistic constraints (cost, materials, regulations, time). A thoughtful trade-off with justification. Mentions safety, environmental, or social impact.",
          },
        ],
      },
    ],
  },
];
