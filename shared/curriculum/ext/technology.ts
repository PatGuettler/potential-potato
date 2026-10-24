import { mc, num, short, tf, type UnitSpec } from "../dsl";

export const techExt: Record<string, UnitSpec[]> = {
  "cs-k2": [
    {
      title: "Computers and Data",
      description: "Name the parts of a computer and sort information.",
      lessons: [
        {
          title: "Parts of a Computer",
          summary: "Computers take in information (input), think (process), and show results (output).",
          objectives: ["Name common computer parts", "Sort parts into input and output"],
          vocab: [["input", "how we give a computer information"], ["output", "how a computer shows us results"], ["screen", "where the computer shows pictures and words"]],
          standards: ["1A-CS-01", "1A-CS-02"],
          body: `
Computers have **parts** that work together.

**Input** (we tell the computer):
- ⌨️ Keyboard: type letters
- 🖱️ Mouse or trackpad: point and click
- 🎤 Microphone: talk
- 👆 Touch screen: tap

**Output** (the computer tells us):
- 🖥️ Screen: shows pictures and words
- 🔊 Speakers: make sounds
- 🖨️ Printer: puts words on paper

**Processing:** the computer's "brain" (the **processor**) follows instructions very fast.

**Take care of computers:** clean hands, no food or drinks nearby, carry tablets with two hands.`,
          questions: [
            mc("Which part do you type on?", "Keyboard", ["Speaker", "Printer", "Screen"], "The keyboard has letter keys."),
            mc("Speakers are…", "output", ["input", "a kind of mouse", "a keyboard"], "Speakers send sound out to us."),
            tf("A microphone is an input device.", true, "It takes your voice into the computer."),
            mc("Which is a good rule for using a computer?", "Keep food and drinks away", ["Eat over the keyboard", "Pull on the cords", "Carry a tablet with one finger"], "Spills can break computers."),
          ],
        },
        {
          title: "Collecting and Sorting Data",
          summary: "Data is information; we can collect it, sort it, and show it in a chart.",
          objectives: ["Collect data by asking a question", "Sort data into groups and make a picture graph"],
          vocab: [["data", "information we collect"], ["sort", "put things into groups"], ["chart", "a picture that shows data"]],
          standards: ["1A-DA-06", "1A-DA-07"],
          body: `
**Data** is information. Computers are great at storing and sorting data!

**Ask a question:** "What is your favorite fruit?"

| Fruit | Votes |
|---|---|
| 🍎 Apple | 🍎🍎🍎🍎 |
| 🍌 Banana | 🍌🍌🍌🍌🍌🍌 |
| 🍇 Grapes | 🍇🍇 |

**What does the data tell us?**
- Banana got the **most** votes (6).
- Grapes got the **fewest** (2).
- 12 friends voted in all.

**Sorting:** you can sort by color, size, or shape. Computers sort photos, songs, and emails the same way.`,
          questions: [
            mc("In the chart, which fruit is the favorite?", "Banana", ["Apple", "Grapes", "Orange"], "Banana has 6 votes."),
            num("How many more votes did banana get than grapes?", 4, "6 − 2 = 4."),
            mc("What is data?", "Information we collect", ["A kind of fruit", "A computer screen", "A game"], "Data means information."),
            tf("You can sort blocks by color.", true, "Color is one way to group things."),
          ],
        },
      ],
    },
    {
      title: "Debugging and Teamwork",
      description: "Find and fix mistakes and work well with a partner.",
      lessons: [
        {
          title: "Finding Bugs",
          summary: "A bug is a mistake in a program; debugging means finding and fixing it.",
          objectives: ["Find a mistake in a set of steps", "Fix the steps so they work"],
          vocab: [["bug", "a mistake in a program"], ["debug", "find and fix a mistake"], ["test", "try a program to see if it works"]],
          standards: ["1A-AP-14"],
          body: `
A **bug** is a mistake in the instructions.

**Making a sandwich:**
1. Get two slices of bread
2. Put the sandwich on a plate
3. Spread peanut butter

🐛 **Bug!** Step 2 happens too early. Fix: move "put on a plate" to the end.

**Robot path:** the robot needs to reach the 🍪.
➡️ ➡️ ⬆️ ➡️
If the robot ends one square short, one arrow is missing.

**Debugging steps**
1. **Run** the program and watch.
2. **Find** where it goes wrong.
3. **Fix** that step.
4. **Test** again!

Everyone makes bugs. Good programmers are good at finding them.`,
          questions: [
            mc("What is a bug?", "A mistake in a program", ["A real insect only", "A kind of robot", "A computer screen"], "In coding, a bug is an error."),
            mc("What should you do after fixing a bug?", "Test the program again", ["Throw it away", "Turn off the computer", "Hide it"], "Testing shows if the fix worked."),
            tf("Good programmers never make bugs.", false, "Everyone makes bugs; the skill is fixing them."),
            mc("The robot stops one square before the cookie. What is the bug?", "One step is missing", ["The cookie is wrong", "The robot is tired", "There are too many steps"], "Add one more move."),
          ],
        },
        {
          title: "Working Together and Giving Credit",
          summary: "Partners take turns as driver and navigator and give credit for others' ideas.",
          objectives: ["Take turns in pair programming roles", "Give credit when using someone else's idea"],
          vocab: [["driver", "the partner using the mouse and keyboard"], ["navigator", "the partner who helps plan and checks the work"], ["credit", "saying who made something"]],
          standards: ["1A-AP-12", "1A-IC-18"],
          body: `
**Pair programming:** two friends, one computer!

- 🚗 **Driver:** uses the mouse and keyboard.
- 🗺️ **Navigator:** reads the plan, spots bugs, gives ideas.
- 🔁 **Switch** jobs every few minutes.

**Kind words help:**
- "What if we try…?"
- "I think there might be a bug here."
- "Great idea!"

**Giving credit:** if a friend's idea helped your project, say so! "Maya thought of the jumping frog." Using someone's work without credit isn't fair.

**Everyone's ideas matter.** Teams with different ideas build better things.`,
          questions: [
            mc("Who uses the mouse in pair programming?", "The driver", ["The navigator", "Nobody", "The teacher only"], "The driver controls the computer."),
            mc("What does the navigator do?", "Helps plan and checks for bugs", ["Types everything", "Leaves the room", "Turns off the computer"], "The navigator guides and checks."),
            tf("If a friend's idea helps your project, you should give them credit.", true, "Giving credit is fair."),
            mc("Which is a kind thing to say to a partner?", "\"What if we try this?\"", ["\"Your idea is dumb.\"", "\"Give me the mouse!\"", "\"I'm doing it alone.\""], "Suggest instead of command."),
          ],
        },
      ],
    },
    {
      title: "Coding with Events",
      description: "Make programs react to clicks and choose with conditions.",
      lessons: [
        {
          title: "Events: When This Happens…",
          summary: "An event is something that happens, like a click, that starts code.",
          objectives: ["Identify events in apps and games", "Connect an event to an action"],
          vocab: [["event", "something that happens, like a tap or key press"], ["action", "what the program does"]],
          standards: ["1A-AP-10", "1A-AP-11"],
          body: `
An **event** is something that **happens**. Programs wait for events and then do something.

| Event | Action |
|---|---|
| 👆 Tap the cat | Cat says "Meow!" |
| ⬆️ Press the up arrow | Character jumps |
| 🏁 Click the green flag | Game starts |
| ⏰ Timer reaches 0 | "Time's up!" |

**In block code:**
\`when [space key] pressed → jump\`

**Events are everywhere:**
- Press a doorbell → it rings
- Tap an app → it opens
- Wave at a sensor → water turns on

**Try it:** make a sprite that changes color **when clicked**.`,
          questions: [
            mc("Tapping an app icon to open it is an…", "event", ["output only", "bug", "printer"], "The tap is an event."),
            mc("\"When space key pressed → jump.\" What is the event?", "Pressing the space key", ["Jumping", "The sprite", "The screen"], "The key press triggers the jump."),
            tf("A doorbell ringing when pressed is like an event in code.", true, "Press (event) → ring (action)."),
            mc("What starts many block-code programs?", "Clicking the green flag", ["Turning off the computer", "Unplugging the mouse", "Closing the window"], "The green flag is a start event."),
          ],
        },
        {
          title: "Conditions: If…Then",
          summary: "A condition lets a program choose what to do: if something is true, then do this.",
          objectives: ["Use if/then thinking in everyday choices", "Predict what a program does with a condition"],
          vocab: [["condition", "something that is true or false"], ["if/then", "if a condition is true, then do an action"]],
          standards: ["1A-AP-10"],
          body: `
We make **if/then** choices every day:
- **If** it is raining, **then** take an umbrella ☂️.
- **If** the light is red, **then** stop 🛑.

**If/then/else:**
- **If** it is cold, **then** wear a coat, **else** wear a T-shirt.

**In a game:**
\`if touching ⭐ then add 1 point\`
\`if touching 🔥 then lose a life\`

**Conditions are true or false.** "The cat is touching the star" is either true or false right now.

**Try it:** what happens if the cat touches the fire? It loses a life!`,
          questions: [
            mc("\"If it is raining, then take an umbrella.\" It is raining. What do you do?", "Take an umbrella", ["Wear sunglasses", "Go swimming", "Nothing"], "The condition is true, so do the action."),
            mc("\"If touching ⭐ then add 1 point.\" The cat touches a star. What happens?", "Add 1 point", ["Lose a life", "Game ends", "Nothing"], "The condition is true."),
            tf("A condition is either true or false.", true, "That's what lets programs choose."),
            mc("\"If cold, wear a coat, else wear a T-shirt.\" It is hot. What do you wear?", "A T-shirt", ["A coat", "Boots", "A hat and scarf"], "The condition is false, so use the else."),
          ],
        },
      ],
    },
    {
      title: "Digital Creativity",
      description: "Use code to draw pictures and tell stories.",
      lessons: [
        {
          title: "Drawing with Code",
          summary: "A pen that follows instructions can draw shapes, and loops make it faster.",
          objectives: ["Write steps to draw a square", "Use a repeat loop to draw shapes"],
          vocab: [["pen", "a tool in code that draws a line as it moves"], ["turn", "change direction"], ["repeat", "do the same steps again"]],
          standards: ["1A-AP-08", "1A-AP-11"],
          body: `
Imagine a turtle 🐢 with a pen on its tail. It draws as it walks!

**Drawing a square:**
\`move 10, turn right, move 10, turn right, move 10, turn right, move 10, turn right\`

That's a lot of steps! Use a **loop**:
\`repeat 4 [move 10, turn right]\`

**Other shapes**
| Shape | Repeat | Turn |
|---|---|---|
| Square | 4 | quarter turn |
| Triangle | 3 | one-third turn |
| Hexagon | 6 | one-sixth turn |

**Make art:** repeat a square 8 times, turning a little each time, and you get a flower pattern! 🌸`,
          questions: [
            num("How many times should you repeat to draw a square?", 4, "A square has 4 sides."),
            num("How many times should you repeat to draw a triangle?", 3, "A triangle has 3 sides."),
            tf("Using repeat makes a program shorter.", true, "You don't have to write the same steps again and again."),
            mc("What does the turtle's pen do as it moves?", "Draws a line", ["Erases the screen", "Plays music", "Takes a photo"], "The pen leaves a line behind."),
          ],
        },
        {
          title: "Telling Stories with Code",
          summary: "Programs can tell stories with characters, backgrounds, and a beginning, middle, and end.",
          objectives: ["Plan a story with a beginning, middle, and end", "Use code to make characters talk and move in order"],
          vocab: [["character (sprite)", "a person, animal, or object in a program"], ["background", "the scene behind the characters"], ["sequence", "the order things happen"]],
          standards: ["1A-AP-09", "1A-AP-15"],
          body: `
**Plan first!** Every story has:
- **Beginning:** who and where? 🐶 A puppy in a park.
- **Middle:** a problem! The puppy loses its ball.
- **End:** a solution. A bird finds the ball. 🐦

**Code the story**
1. Background: park 🌳
2. Puppy says "Where is my ball?" for 2 seconds
3. Bird flies to the puppy
4. Bird says "I found it!"
5. Puppy jumps 🎉

**Sequence matters!** If the bird says "I found it!" before the puppy loses the ball, the story doesn't make sense.

**Share your story** and ask a friend what they liked.`,
          questions: [
            mc("What should you do before coding a story?", "Plan the beginning, middle, and end", ["Turn off the screen", "Delete the characters", "Skip to the end"], "Planning makes coding easier."),
            mc("A character in a coding story is often called a…", "sprite", ["mouse", "keyboard", "printer"], "Sprites are characters in block coding."),
            tf("The order of steps in a story program does not matter.", false, "Sequence keeps the story making sense."),
            mc("What part of a story has the problem?", "The middle", ["The title", "The background", "The end only"], "Problems usually come in the middle."),
          ],
          writtenPrompt: "Plan a short coding story. Write who is in it, where it happens, the problem, and how it is solved.",
          rubric: "Names characters and setting (3) · Has a clear problem (3) · Has a solution (3) · Steps are in order (1)",
        },
      ],
    },
  ],
  "cs-35": [
    {
      title: "Variables and Events",
      description: "Store information in variables and make programs respond to events.",
      lessons: [
        {
          title: "Variables: Keeping Score",
          summary: "A variable stores a value, like a score, that can change while a program runs.",
          objectives: ["Create a variable and change its value", "Use variables to track score, lives, or time"],
          vocab: [["variable", "a named container for a value"], ["value", "the information stored in a variable"], ["initialize", "give a variable its starting value"]],
          standards: ["1B-AP-09"],
          body: `
A **variable** is like a labeled box that holds a value.

**In a game:**
\`\`\`
set score to 0        ← initialize
when touching coin:
    change score by 1
when touching enemy:
    change lives by -1
\`\`\`

**Tracing:** score starts at 0. Touch 3 coins → score = **3**.

**Why initialize?** If you forget \`set score to 0\`, the score from the last game carries over!

**Variables can hold:**
- numbers: score = 10
- words: playerName = "Sam"
- true/false: gameOver = false

**Good names:** \`lives\` is better than \`x\`.`,
          questions: [
            num("score starts at 5. It changes by 3, then by 2. What is score?", 10, "5 + 3 + 2 = 10."),
            mc("Why do we set score to 0 when the game starts?", "So the score from last game doesn't carry over", ["To make the game harder", "To end the game", "To add a sprite"], "Initializing resets the value."),
            mc("Which is the best name for a variable that counts lives?", "lives", ["x", "stuff", "abc"], "Names should describe the value."),
            num("lives starts at 3. The player is hit twice (change lives by -1 each time). What is lives?", 1, "3 − 1 − 1 = 1."),
          ],
        },
        {
          title: "Events and Interactive Programs",
          summary: "Event-driven programs wait for actions like clicks and key presses, then run code.",
          objectives: ["Write programs that respond to multiple events", "Explain how one event can trigger a message to another sprite"],
          vocab: [["event handler", "code that runs when an event happens"], ["broadcast", "sending a message that other sprites can respond to"]],
          standards: ["1B-AP-10"],
          body: `
**Event-driven** programs wait for something to happen.

\`\`\`
when green flag clicked → go to start, say "Ready!"
when right arrow pressed → move 10 steps
when this sprite clicked → play sound "pop"
when timer > 30 → broadcast "game over"
\`\`\`

**Broadcasting:** one sprite sends a message; others react.
\`\`\`
Cat:   when touching fish → broadcast "win"
Stage: when I receive "win" → switch backdrop to "celebration"
\`\`\`

**Real apps are event-driven:** a calculator waits for button presses; a game controller sends events for every button.

**Testing tip:** try every event. Does every key do what you expect?`,
          questions: [
            mc("What starts the code \"when right arrow pressed\"?", "Pressing the right arrow key", ["Clicking the green flag", "Starting the computer", "Saying hello"], "The key press is the event."),
            mc("Broadcasting lets…", "one sprite send a message other sprites react to", ["sprites delete themselves", "the computer shut down", "you change the font"], "Broadcasts coordinate sprites."),
            tf("A calculator app is an event-driven program.", true, "It waits for button presses."),
            mc("To test an event-driven game, you should…", "try every event and check the result", ["only click the green flag", "never press keys", "delete the events"], "Test each event handler."),
          ],
        },
      ],
    },
    {
      title: "Functions and Planning",
      description: "Break problems into reusable functions and plan with pseudocode and flowcharts.",
      lessons: [
        {
          title: "Functions: Reusable Code",
          summary: "A function is a named set of steps you can use again and again.",
          objectives: ["Define and call a function", "Explain how functions reduce repeated code"],
          vocab: [["function", "a named group of instructions"], ["call", "run a function by using its name"], ["decompose", "break a big problem into smaller parts"]],
          standards: ["1B-AP-11", "1B-AP-12"],
          body: `
A **function** is like a recipe with a name.

\`\`\`
define drawSquare:
    repeat 4:
        move 50
        turn right 90
\`\`\`

Now **call** it anywhere:
\`\`\`
drawSquare
move 80
drawSquare
\`\`\`

**Why functions?**
- No repeating the same code
- Easier to read: \`drawHouse\` tells you what it does
- Fix a bug once and it's fixed everywhere

**Decompose a house:**
- \`drawSquare\` (walls)
- \`drawTriangle\` (roof)
- \`drawDoor\`

Big problems become small, easy problems.`,
          questions: [
            mc("What is a function?", "A named group of instructions", ["A kind of computer", "A sprite costume", "A bug"], "Functions package steps under a name."),
            num("A program calls drawSquare 3 times. Each square has 4 sides. How many sides are drawn?", 12, "3 × 4 = 12."),
            tf("If you fix a bug inside a function, it's fixed everywhere the function is called.", true, "The code lives in one place."),
            mc("Breaking a big problem into smaller parts is called…", "decomposing", ["debugging", "broadcasting", "initializing"], "Decomposition makes problems manageable."),
          ],
        },
        {
          title: "Pseudocode and Flowcharts",
          summary: "Plan programs with plain-language steps and diagrams before coding.",
          objectives: ["Write pseudocode for a simple program", "Read and draw flowcharts with decisions and loops"],
          vocab: [["pseudocode", "program steps written in plain language"], ["flowchart", "a diagram showing the steps and decisions of a program"], ["algorithm", "a step-by-step plan to solve a problem"]],
          standards: ["1B-AP-08"],
          body: `
**Plan before you code!**

**Pseudocode** (plain-language steps):
\`\`\`
ask for a number
if the number is even
    say "Even!"
otherwise
    say "Odd!"
\`\`\`

**Flowchart shapes**
| Shape | Meaning |
|---|---|
| Oval | Start / End |
| Rectangle | Do a step |
| Diamond | Decision (yes/no) |
| Arrow | What comes next |

**Guessing game flowchart:** Start → pick secret number → ask for guess → ◇ correct? → **yes:** "You win!" → End / **no:** "Try again" → back to ask.

The arrow going back makes a **loop**.

**Why plan?** Finding a mistake on paper is faster than finding it in code.`,
          questions: [
            mc("In a flowchart, which shape shows a decision?", "Diamond", ["Oval", "Rectangle", "Circle"], "Diamonds have yes/no paths."),
            mc("What is pseudocode?", "Program steps written in plain language", ["A secret code", "A broken program", "A computer virus"], "It's planning language, not a real programming language."),
            tf("An arrow that goes back to an earlier step creates a loop.", true, "The steps repeat."),
            mc("In the guessing game, what happens if the guess is wrong?", "It says \"Try again\" and asks again", ["The game ends", "You win", "The computer turns off"], "The no-path loops back."),
          ],
        },
      ],
    },
    {
      title: "Data and Visualization",
      description: "Collect, organize, and visualize data to find patterns.",
      lessons: [
        {
          title: "Collecting and Visualizing Data",
          summary: "Organize data in tables and choose the right chart to show it.",
          objectives: ["Organize data in a table", "Choose bar, line, or pie charts appropriately"],
          vocab: [["data set", "a collection of related data"], ["bar graph", "compares amounts in categories"], ["line graph", "shows change over time"]],
          standards: ["1B-DA-06"],
          body: `
**Question:** How do students get to school?

| Way | Students |
|---|---|
| 🚌 Bus | 12 |
| 🚗 Car | 8 |
| 🚶 Walk | 5 |
| 🚲 Bike | 3 |

**Pick the right chart**
- **Bar graph:** compare categories (ways to get to school)
- **Line graph:** change over time (temperature each hour)
- **Pie chart:** parts of a whole (how I spend my day)

**Computers help!** Spreadsheets can turn a table into a chart in one click and update it when the data changes.

**Read the chart:** Bus is the most popular. 28 students in all. More students ride the bus than walk and bike combined (12 vs. 8).`,
          questions: [
            num("Using the table, how many students were surveyed?", 28, "12 + 8 + 5 + 3 = 28."),
            mc("Which chart best shows temperature change over a day?", "Line graph", ["Pie chart", "Bar graph", "Table only"], "Line graphs show change over time."),
            num("How many more students take the bus than walk?", 7, "12 − 5 = 7."),
            mc("Which chart shows parts of a whole?", "Pie chart", ["Line graph", "Flowchart", "Scatter plot"], "Each slice is part of the whole pie."),
          ],
        },
        {
          title: "Using Data to Make Predictions",
          summary: "Patterns in data help us make predictions, and more data makes them better.",
          objectives: ["Find patterns in data", "Make and test predictions based on data"],
          vocab: [["pattern", "something that repeats or trends in data"], ["prediction", "a guess about the future based on evidence"], ["trend", "a general direction data moves"]],
          standards: ["1B-DA-07"],
          body: `
**Plant growth (cm):**
| Day | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Height | 2 | 4 | 6 | 8 | ? |

**Pattern:** +2 cm each day → **predict 10 cm** on day 5.

**Weather apps** use huge amounts of past data to predict tomorrow.

**More data = better predictions.** If you flip a coin 3 times and get 3 heads, you might guess coins always land heads. Flip 100 times and you'll see it's about half and half.

**Be careful:** patterns can change. The plant won't grow 2 cm every day forever!

**Computers** find patterns in data too big for people, like which songs you might like next.`,
          questions: [
            num("Using the pattern, how tall will the plant be on day 6 (cm)?", 12, "Add 2 each day: 10 on day 5, 12 on day 6."),
            mc("Why do more data points make better predictions?", "Small samples can be misleading", ["Computers like big numbers", "More data is always correct", "It makes graphs prettier"], "Three flips can mislead; 100 shows the real pattern."),
            tf("A music app can use data about songs you like to predict new songs for you.", true, "That's a recommendation system."),
            mc("Sales: 10, 20, 30, 40. What is the trend?", "Increasing", ["Decreasing", "Staying the same", "Random"], "Each value goes up by 10."),
          ],
        },
      ],
    },
    {
      title: "The Internet and Digital Citizenship",
      description: "Learn how the internet works and how to be a responsible digital citizen.",
      lessons: [
        {
          title: "How the Internet Connects Us",
          summary: "The internet is a network of networks that sends information in small packets.",
          objectives: ["Describe the internet as connected networks", "Explain how information travels in packets"],
          vocab: [["network", "connected computers that share information"], ["packet", "a small piece of a message sent across the internet"], ["router", "a device that directs packets toward their destination"]],
          standards: ["1B-NI-04", "1B-NI-05"],
          body: `
The **internet** is a giant **network of networks** connecting billions of devices.

**Sending a photo to Grandma:**
1. Your photo is split into small **packets**.
2. Each packet has an address (like an envelope).
3. **Routers** pass packets along, choosing paths.
4. Packets may take **different routes**!
5. Grandma's device puts them back in order.

**How data travels:** Wi-Fi (radio waves), copper cables, and fiber-optic cables (light!) — including cables on the ocean floor between continents.

**Why packets?** If one packet gets lost, only that piece is resent, not the whole photo.

**The internet vs. the web:** the internet is the network; the World Wide Web is websites that travel over it.`,
          questions: [
            mc("What is a packet?", "A small piece of a message", ["A whole computer", "A website", "A password"], "Messages are split into packets."),
            mc("What does a router do?", "Directs packets toward their destination", ["Prints photos", "Stores passwords", "Makes websites"], "Routers are internet traffic directors."),
            tf("All packets from one message must take the same path.", false, "They can take different routes and are reassembled."),
            mc("How do internet cables cross oceans?", "On the ocean floor", ["On boats only", "Through the sky", "They don't"], "Undersea fiber cables connect continents."),
          ],
        },
        {
          title: "Digital Footprints and Copyright",
          summary: "What we post online can last a long time, and creators own their work.",
          objectives: ["Explain what a digital footprint is", "Use and credit others' work responsibly"],
          vocab: [["digital footprint", "the trail of information you leave online"], ["copyright", "the legal right of a creator to control their work"], ["Creative Commons", "licenses that let creators share work with permission"]],
          standards: ["1B-IC-20", "1B-IC-21", "1B-NI-05"],
          body: `
**Digital footprint:** everything you post, search, or share leaves a trail.
- Posts and photos can be copied and shared.
- Even "deleted" things may be saved somewhere.
- **Think before you post:** would you be OK with your teacher, grandparent, or future boss seeing it?

**Keep private:** full name with address, school, phone number, passwords.

**Copyright:** people who create music, art, videos, and writing **own** their work.
- Don't copy someone's drawing and say it's yours.
- Look for **Creative Commons** or public-domain images you're allowed to use.
- Always **give credit**: "Photo by Jordan Lee, CC BY."

**Your work is copyrighted too!**`,
          questions: [
            mc("What is a digital footprint?", "The trail of information you leave online", ["A shoe size", "A computer virus", "A type of mouse"], "Everything you do online leaves traces."),
            mc("Which information should you keep private online?", "Your home address", ["Your favorite color", "Your favorite book", "A drawing of a cat"], "Addresses can put you at risk."),
            tf("If you find a picture online, you can always use it without giving credit.", false, "Most work is copyrighted; give credit and check permission."),
            mc("Creative Commons licenses…", "let creators share work with certain permissions", ["make all work secret", "delete pictures", "are a kind of virus"], "They tell you how you may use the work."),
          ],
        },
      ],
    },
  ],
  "cs-68": [
    {
      title: "Functions and Lists",
      description: "Write functions with parameters and store collections of data in lists.",
      lessons: [
        {
          title: "Functions with Parameters and Return Values",
          summary: "Parameters let functions work with different inputs; return values send results back.",
          objectives: ["Define functions with parameters", "Use return values in expressions", "Trace function calls"],
          vocab: [["parameter", "a variable that receives a value when a function is called"], ["argument", "the actual value passed to a function"], ["return value", "the result a function sends back"]],
          standards: ["2-AP-14", "2-AP-13"],
          body: `
\`\`\`javascript
function area(width, height) {   // parameters
  return width * height;          // return value
}

let room = area(4, 5);   // arguments → room = 20
let hall = area(2, 10);  // hall = 20
\`\`\`

**Parameters** make functions flexible: one function, many inputs.

**Return** sends a result back so you can use it:
\`\`\`javascript
let total = area(3, 3) + area(2, 4);  // 9 + 8 = 17
\`\`\`

**Function with a decision:**
\`\`\`javascript
function grade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  return "Keep practicing";
}
grade(85)  // "B"
\`\`\`

**Tip:** a function should do **one** job well.`,
          questions: [
            num("function double(n) { return n * 2; } What is double(7)?", 14, "7 × 2 = 14."),
            num("Using area(w, h) = w × h, what is area(6, 3) + area(2, 2)?", 22, "18 + 4 = 22."),
            mc("In area(4, 5), what are 4 and 5?", "Arguments", ["Parameters", "Return values", "Loops"], "Arguments are the values passed in."),
            mc("Using grade(score), what does grade(72) return?", "\"Keep practicing\"", ["\"A\"", "\"B\"", "72"], "72 is below both cutoffs."),
          ],
          programmingLanguage: "javascript",
        },
        {
          title: "Lists (Arrays)",
          summary: "A list stores many values in order; loops let you process every item.",
          objectives: ["Create and access list elements by index", "Add and remove items", "Loop through a list to compute totals"],
          vocab: [["list (array)", "an ordered collection of values"], ["index", "the position of an item, starting at 0"], ["length", "the number of items in a list"]],
          standards: ["2-AP-11", "2-AP-13"],
          body: `
\`\`\`javascript
let scores = [85, 92, 78, 95];
scores[0]        // 85  (indexes start at 0!)
scores[3]        // 95
scores.length    // 4
\`\`\`

**Changing lists**
\`\`\`javascript
scores.push(88);     // add to end → [85, 92, 78, 95, 88]
scores[2] = 80;      // replace → [85, 92, 80, 95, 88]
scores.pop();        // remove last → [85, 92, 80, 95]
\`\`\`

**Loop through a list**
\`\`\`javascript
let total = 0;
for (let s of scores) {
  total = total + s;
}
let average = total / scores.length;  // 352 / 4 = 88
\`\`\`

**Lists are everywhere:** playlists, contact lists, high-score tables, shopping carts.`,
          questions: [
            num("let a = [10, 20, 30, 40]; What is a[2]?", 30, "Index 2 is the third item."),
            num("let a = [3, 6, 9]; a.push(12); What is a.length?", 4, "Push adds one item."),
            num("let n = [2, 4, 6]; let t = 0; for (let x of n) t = t + x; What is t?", 12, "2 + 4 + 6 = 12."),
            mc("What is the index of the first item in a JavaScript list?", "0", ["1", "-1", "It depends"], "Indexes start at 0."),
          ],
          programmingLanguage: "javascript",
        },
      ],
    },
    {
      title: "Algorithms and Testing",
      description: "Compare searching and sorting algorithms and test programs systematically.",
      lessons: [
        {
          title: "Searching and Sorting",
          summary: "Linear search checks every item; binary search halves a sorted list each step.",
          objectives: ["Compare linear and binary search", "Trace a simple sorting algorithm", "Count steps to compare efficiency"],
          vocab: [["linear search", "checking items one by one"], ["binary search", "repeatedly halving a sorted list"], ["efficiency", "how many steps an algorithm takes"]],
          standards: ["2-AP-10", "2-AP-13"],
          body: `
**Linear search:** check each item in order.
Finding 42 in [7, 19, 42, 3, 88]: check 7, 19, 42 → found in **3 steps**. Worst case for 1,000 items: **1,000 steps**.

**Binary search** (list must be **sorted**): check the middle, then throw away half.
Find 42 in [3, 7, 19, 42, 55, 88, 91]:
1. Middle is 42 → found!
For 1,000 sorted items: at most about **10 steps** (1000 → 500 → 250 → … → 1).

**Selection sort:** find the smallest, swap it to the front, repeat.
[5, 2, 8, 1] → [1, 2, 8, 5] → [1, 2, 8, 5] → [1, 2, 5, 8]

**Why it matters:** search engines and maps handle billions of items. A smarter algorithm can mean seconds instead of years.`,
          questions: [
            mc("What must be true for binary search to work?", "The list must be sorted", ["The list must be short", "The list must contain only even numbers", "The list must be unsorted"], "Halving only works if order tells you which half."),
            num("About how many steps does binary search need for 1,024 sorted items (at most)?", 10, "2¹⁰ = 1,024.", { tolerance: 1 }),
            mc("Linear search on 500 items, target is last. How many checks?", "500", ["1", "9", "250"], "It checks every item."),
            mc("After one pass of selection sort on [4, 9, 1, 7], the list is…", "[1, 9, 4, 7]", ["[4, 9, 1, 7]", "[1, 4, 7, 9]", "[9, 4, 1, 7]"], "Smallest (1) swaps with the first item (4)."),
          ],
        },
        {
          title: "Testing and Debugging",
          summary: "Systematic testing with normal, edge, and invalid cases finds bugs before users do.",
          objectives: ["Design test cases including edge cases", "Use debugging strategies like print statements and tracing"],
          vocab: [["test case", "a specific input with an expected output"], ["edge case", "an input at the boundary of what's allowed"], ["trace", "follow a program step by step to track values"]],
          standards: ["2-AP-17", "2-AP-19"],
          body: `
**Test before users find the bugs!**

\`\`\`javascript
function canRide(height) {
  return height > 48;   // must be at least 48 inches
}
\`\`\`

| Test | Input | Expected | Actual |
|---|---|---|---|
| Normal | 55 | true | true ✓ |
| Normal | 40 | false | false ✓ |
| **Edge** | **48** | **true** | **false ✗** |

🐛 The edge case found a bug: \`>\` should be \`>=\`.

**Kinds of test cases**
- **Normal:** typical inputs
- **Edge:** boundaries (0, empty list, exactly the limit)
- **Invalid:** wrong types (-5, "tall")

**Debugging strategies**
- Print values: \`console.log("height is", height)\`
- Trace by hand with a table
- Change one thing at a time
- **Rubber-duck debugging:** explain your code out loud line by line`,
          questions: [
            mc("Which test is an edge case for 'ages 13 to 17 allowed'?", "13", ["15", "30", "\"hello\""], "13 is right at the boundary."),
            mc("canRide(48) returns false but should return true. What's the fix?", "Change > to >=", ["Change 48 to 50", "Delete the function", "Change > to <"], ">= includes 48."),
            tf("Testing only normal inputs is enough to find most bugs.", false, "Many bugs hide at edges and invalid inputs."),
            mc("Explaining your code line by line out loud is called…", "rubber-duck debugging", ["pair sorting", "binary search", "compiling"], "Explaining often reveals the bug."),
          ],
          programmingLanguage: "javascript",
        },
      ],
    },
    {
      title: "Computing Systems and Networks",
      description: "Explain how hardware, software, and networks work together.",
      lessons: [
        {
          title: "Hardware and Software",
          summary: "Hardware components and software layers work together to run programs.",
          objectives: ["Describe the role of CPU, memory, and storage", "Distinguish system software from application software"],
          vocab: [["CPU", "the processor that executes instructions"], ["RAM", "fast, temporary memory for running programs"], ["operating system", "software that manages hardware and runs apps"]],
          standards: ["2-CS-01", "2-CS-02", "2-CS-03"],
          body: `
**Hardware** = physical parts. **Software** = instructions.

| Component | Job | Analogy |
|---|---|---|
| CPU | executes instructions (billions per second) | the chef |
| RAM | holds running programs; cleared when off | the countertop |
| Storage (SSD) | keeps files permanently | the pantry |
| GPU | draws graphics fast | a decorating specialist |
| Input/output | keyboard, screen, sensors | orders and plates |

**Software layers**
- **Operating system** (Windows, macOS, Android, iOS): manages memory, files, and devices
- **Applications:** browsers, games, word processors
- **Firmware:** low-level code built into devices

**Everything is binary:** at the bottom, all data and instructions are 1s and 0s.

**Troubleshooting:** restart (clears RAM), check connections, update software, check storage space.`,
          questions: [
            mc("Which component executes program instructions?", "CPU", ["RAM", "SSD", "Monitor"], "The CPU is the processor."),
            mc("What happens to data in RAM when a computer turns off?", "It's erased", ["It's saved forever", "It moves to the CPU", "It's printed"], "RAM is temporary memory."),
            tf("An operating system is an example of application software.", false, "It's system software."),
            mc("Which is an operating system?", "Android", ["Chrome browser", "Minecraft", "A spreadsheet"], "Android manages the phone's hardware."),
          ],
        },
        {
          title: "Networks and Protocols",
          summary: "Protocols like IP, TCP, and HTTP are rules that let devices communicate.",
          objectives: ["Explain the role of protocols", "Describe IP addresses, DNS, and HTTP", "Compare wired and wireless networks"],
          vocab: [["protocol", "an agreed set of rules for communication"], ["IP address", "a unique number identifying a device on a network"], ["DNS", "the system that translates domain names into IP addresses"]],
          standards: ["2-NI-04"],
          body: `
**Protocols** are rules everyone agrees on, so any device can talk to any other.

| Protocol | Job |
|---|---|
| IP | addresses and routes packets |
| TCP | makes sure all packets arrive, in order |
| HTTP/HTTPS | requests and delivers web pages |
| DNS | turns names into IP addresses |

**Visiting a website:**
1. You type \`example.com\`.
2. **DNS** looks up its IP address (like 93.184.216.34).
3. Your browser sends an **HTTP request** to that address.
4. The server sends back the page in packets.
5. **TCP** reassembles them; your browser displays the page.

**HTTPS** encrypts the data so others on the network can't read it (look for the 🔒).

**Wired vs. wireless:** Ethernet is faster and more reliable; Wi-Fi is convenient.`,
          questions: [
            mc("What does DNS do?", "Translates domain names into IP addresses", ["Encrypts passwords", "Makes Wi-Fi faster", "Stores photos"], "It's the internet's phone book."),
            mc("Which protocol makes sure packets arrive complete and in order?", "TCP", ["DNS", "HTML", "Wi-Fi"], "TCP handles reliable delivery."),
            tf("HTTPS encrypts data between your browser and the website.", true, "The S stands for secure."),
            mc("Why do we need protocols?", "So different devices can communicate using the same rules", ["To make computers heavier", "To slow down the internet", "To replace electricity"], "Shared rules make communication possible."),
          ],
        },
      ],
    },
    {
      title: "Computing and Society",
      description: "Protect privacy and design technology everyone can use.",
      lessons: [
        {
          title: "Privacy and Your Data",
          summary: "Apps collect data about you; you can control much of what you share.",
          objectives: ["Identify data that apps collect", "Use privacy settings and strong passwords", "Evaluate trade-offs of free services"],
          vocab: [["personal data", "information that identifies you"], ["privacy settings", "controls for who can see your information"], ["two-factor authentication", "a second check, like a code, beyond your password"]],
          standards: ["2-IC-23", "2-NI-05"],
          body: `
**What apps collect:** location, contacts, photos, what you click, how long you watch, your voice.

**"If the product is free, you might be the product."** Many free apps make money by showing ads targeted with your data.

**Protect yourself**
- Review **app permissions**: does a flashlight app need your location?
- Set accounts to **private**
- Use **strong passwords**: long passphrases like \`purple-tiger-eats-tacos-42\`
- Turn on **two-factor authentication**
- Don't reuse passwords

**Laws:** COPPA protects kids under 13 in the U.S.; apps need parental consent to collect their data.

**Trade-offs:** sharing location helps maps work but also reveals where you go.`,
          questions: [
            mc("Which is the strongest password?", "purple-tiger-eats-tacos-42", ["password123", "12345678", "myname"], "Long passphrases are hard to guess."),
            mc("A flashlight app asks for your contacts. What should you do?", "Deny the permission", ["Allow it", "Share your password", "Post about it"], "A flashlight doesn't need contacts."),
            tf("Two-factor authentication adds a second check beyond your password.", true, "Like a code sent to your phone."),
            mc("How do many free apps make money?", "Targeted ads using your data", ["Selling computers", "Charging the government", "They never make money"], "Your attention and data have value."),
          ],
        },
        {
          title: "Accessibility and Inclusive Design",
          summary: "Inclusive design makes technology usable by people of all abilities.",
          objectives: ["Identify accessibility features", "Evaluate an app for accessibility", "Explain how diverse teams create better technology"],
          vocab: [["accessibility", "designing so people with disabilities can use technology"], ["screen reader", "software that reads screen content aloud"], ["alt text", "a text description of an image"]],
          standards: ["2-IC-20", "2-IC-21", "2-AP-15"],
          body: `
About **1 in 4 U.S. adults** has a disability. Good design includes everyone.

**Accessibility features**
- **Screen readers** read text and image descriptions aloud
- **Captions** for videos
- **High contrast** and adjustable text size
- **Keyboard navigation** for people who can't use a mouse
- **Voice control**

**Design checklist**
- Images have **alt text**
- Color isn't the only signal (red/green look similar to colorblind users)
- Buttons are large enough to tap
- Text contrasts with the background

**The curb-cut effect:** sidewalk ramps were built for wheelchairs but help strollers, bikes, and suitcases. Captions help people in noisy places too.

**Diverse teams** notice needs others miss — early face-recognition systems failed on darker skin because test data wasn't diverse.`,
          questions: [
            mc("What does a screen reader do?", "Reads screen content aloud", ["Makes the screen brighter", "Takes screenshots", "Cleans the screen"], "It helps blind and low-vision users."),
            mc("Why shouldn't color be the only way to show an error?", "Colorblind users may not see the difference", ["Colors are expensive", "Computers can't show red", "It's against the law to use red"], "Add text or icons too."),
            tf("Captions only help people who are deaf.", false, "They help in noisy places, for language learners, and more."),
            mc("Alt text is…", "a written description of an image", ["a backup password", "a keyboard shortcut", "a type of font"], "Screen readers read alt text aloud."),
          ],
          writtenPrompt: "Pick an app or website you use. Evaluate it with the accessibility checklist and suggest two improvements.",
          rubric: "Names a specific app (2) · Applies at least three checklist items (4) · Suggests two concrete improvements (4)",
        },
      ],
    },
  ],
  csp: [
    {
      title: "Data",
      description: "Compress data and extract insight from large data sets.",
      lessons: [
        {
          title: "Data Compression",
          summary: "Lossless compression shrinks files without losing information; lossy compression trades quality for size.",
          objectives: ["Compare lossless and lossy compression", "Apply run-length encoding", "Choose a compression type for a scenario"],
          vocab: [["lossless compression", "reduces size with no information lost"], ["lossy compression", "reduces size by permanently discarding some information"], ["run-length encoding", "replacing repeated values with a count and value"]],
          standards: ["3A-DA-09", "3A-DA-10"],
          body: `
**Why compress?** Smaller files store more and transfer faster.

**Lossless:** the original can be perfectly reconstructed.
- **Run-length encoding (RLE):** \`WWWWWWBBBWW\` → \`6W3B2W\` (11 → 6 characters)
- ZIP files, PNG images
- Required for text, code, and spreadsheets — losing one character could break everything.

**Lossy:** permanently discards details people barely notice.
- JPEG photos, MP3/AAC audio, streaming video
- A 50 MB raw photo might become a 3 MB JPEG.

| Scenario | Choice |
|---|---|
| Source code | lossless |
| Medical X-ray | lossless |
| Streaming a movie | lossy |
| Posting a vacation photo | lossy |

**Compression ratio** = original ÷ compressed. 50 MB → 5 MB is **10:1**.

**Trade-off:** more compression = smaller file but (for lossy) lower quality.`,
          questions: [
            short("Compress AAAABBBCC using run-length encoding.", ["4A3B2C"], "4 A's, 3 B's, 2 C's."),
            mc("Which should use lossless compression?", "A computer program's source code", ["A streaming video", "A music stream", "A social media photo"], "Losing any character could break the code."),
            num("A 40 MB file compresses to 8 MB. What is the compression ratio (x:1)?", 5, "40 ÷ 8 = 5."),
            tf("Lossy compression can be fully reversed to the original file.", false, "Discarded data is gone."),
          ],
        },
        {
          title: "Extracting Insight from Data",
          summary: "Clean, filter, and analyze large data sets to answer questions and spot misleading conclusions.",
          objectives: ["Describe the data analysis process", "Clean and filter data", "Identify bias and misleading visualizations"],
          vocab: [["data cleaning", "fixing or removing incorrect, duplicate, or incomplete data"], ["filter", "selecting rows that meet a condition"], ["metadata", "data about data, like a photo's date and location"]],
          standards: ["3A-DA-11", "3A-DA-12"],
          body: `
**The analysis process**
1. **Ask** a question
2. **Collect** data
3. **Clean** it (fix typos, remove duplicates, handle blanks)
4. **Analyze**: filter, sort, group, summarize
5. **Visualize** and communicate

**Cleaning example:** "NY", "New York", and "new york" should be one value.

**Filtering:** "show only students in grade 10 with GPA > 3.5."

**Metadata:** a photo contains its date, camera, and often GPS location — even if the picture itself doesn't show where you were.

**Watch out**
- **Sampling bias:** surveying only your friends doesn't represent your school.
- **Misleading graphs:** a y-axis that starts at 95 instead of 0 makes a small change look huge.
- **Correlation ≠ causation.**

**Scale:** spreadsheets handle thousands of rows; programs handle millions.`,
          questions: [
            mc("\"CA\", \"California\", and \"calif.\" should be standardized. This step is…", "data cleaning", ["visualization", "compression", "encryption"], "Cleaning makes data consistent."),
            mc("A bar graph's y-axis starts at 98 instead of 0. This can…", "exaggerate small differences", ["make data more accurate", "compress the data", "remove bias"], "Truncated axes are misleading."),
            tf("A photo's metadata can reveal where it was taken.", true, "GPS coordinates are often embedded."),
            mc("Surveying only the basketball team about favorite sports is an example of…", "sampling bias", ["metadata", "lossless compression", "a fair sample"], "The sample doesn't represent everyone."),
          ],
        },
      ],
    },
    {
      title: "Algorithms and Simulation",
      description: "Analyze algorithm efficiency and model the world with simulations.",
      lessons: [
        {
          title: "Algorithm Efficiency",
          summary: "Compare algorithms by how their steps grow with input size; some problems are intractable.",
          objectives: ["Compare linear, logarithmic, and quadratic growth", "Distinguish reasonable from unreasonable time", "Describe heuristics and undecidable problems"],
          vocab: [["reasonable time", "polynomial growth (n, n², …)"], ["unreasonable time", "exponential or factorial growth"], ["heuristic", "an approach that finds a good-enough solution quickly"], ["undecidable problem", "a problem no algorithm can always solve"]],
          standards: ["3B-AP-11", "3A-AP-15"],
          body: `
**How do steps grow as the input (n) grows?**
| n | log₂ n | n | n² | 2ⁿ |
|---|---|---|---|---|
| 10 | ~3 | 10 | 100 | 1,024 |
| 100 | ~7 | 100 | 10,000 | 1.3 × 10³⁰ |

- **Binary search:** log n
- **Linear search:** n
- **Comparing every pair:** n²
- **Trying every subset:** 2ⁿ — **unreasonable**

**Traveling salesperson:** finding the shortest route through 20 cities by brute force takes about 10¹⁸ routes. Delivery companies use **heuristics** ("go to the nearest unvisited city") for good-enough routes in seconds.

**Undecidable problems:** Alan Turing proved no algorithm can determine whether every possible program will eventually stop (the **halting problem**).

**Parallel computing** splits work across processors. Speedup = sequential time ÷ parallel time — limited by the parts that can't be split.`,
          questions: [
            mc("Which grows fastest as n increases?", "2ⁿ", ["n²", "n", "log n"], "Exponential growth dominates."),
            mc("Using \"visit the nearest city next\" to plan a route is a…", "heuristic", ["brute-force search", "undecidable problem", "binary search"], "It finds a good, not perfect, answer quickly."),
            num("A task takes 60 seconds sequentially and 15 seconds in parallel. What is the speedup?", 4, "60 ÷ 15 = 4."),
            tf("The halting problem is undecidable.", true, "Turing proved no general algorithm can solve it."),
          ],
        },
        {
          title: "Simulations",
          summary: "Simulations model real systems with simplifying assumptions and random numbers.",
          objectives: ["Explain the purpose of simulations", "Identify assumptions and limitations", "Use random numbers to model chance"],
          vocab: [["simulation", "a program that models a real-world process"], ["assumption", "a simplification built into a model"], ["random number generator", "code that produces unpredictable values"]],
          standards: ["3A-AP-13", "3A-DA-12"],
          body: `
**Simulations** let us test ideas that are too expensive, slow, or dangerous to try for real: weather forecasts, flight training, disease spread, crash tests.

**Coin-flip simulation (pseudocode):**
\`\`\`
heads ← 0
REPEAT 1000 TIMES
    IF RANDOM(1, 2) = 1
        heads ← heads + 1
DISPLAY heads / 1000
\`\`\`
More trials → results closer to the theoretical 0.5.

**Assumptions simplify reality.** A disease model might assume everyone has the same number of contacts per day. Real people don't, so the model has **limitations**.

**Bias in simulations:** if assumptions are wrong or missing variables, results can mislead decisions.

**Refining:** compare results with real data, then adjust the model.`,
          questions: [
            mc("Why use a simulation instead of a real experiment?", "The real experiment may be too costly, slow, or dangerous", ["Simulations are always perfectly accurate", "Real experiments are illegal", "Computers need practice"], "Simulations are safe and cheap to run many times."),
            mc("RANDOM(1, 6) models…", "rolling a die", ["flipping a coin", "drawing a card from 52", "a yes/no vote"], "Six equally likely outcomes."),
            tf("A simulation's results can be biased by its assumptions.", true, "Simplifications may leave out important factors."),
            mc("Running a simulation more times usually…", "gives results closer to the expected probability", ["makes it less accurate", "changes the theoretical probability", "breaks it"], "Law of large numbers."),
          ],
        },
      ],
    },
    {
      title: "Cybersecurity",
      description: "Understand public-key encryption and defend against common attacks.",
      lessons: [
        {
          title: "Public-Key Encryption",
          summary: "Public-key cryptography lets strangers communicate securely without sharing a secret first.",
          objectives: ["Compare symmetric and asymmetric encryption", "Explain how public and private keys work", "Describe digital certificates"],
          vocab: [["symmetric encryption", "the same key encrypts and decrypts"], ["public key", "a key anyone can use to encrypt messages to you"], ["private key", "a secret key only you use to decrypt"], ["certificate authority", "a trusted organization that verifies websites' public keys"]],
          standards: ["3A-NI-07", "3A-NI-08"],
          body: `
**Symmetric encryption:** one shared key (like a Caesar cipher). Fast, but how do you share the key safely with a website you've never visited?

**Asymmetric (public-key) encryption** solves this:
- Your **public key** is like an open padlock you hand out to anyone.
- Your **private key** is the only key that opens it.
- Anyone can lock (encrypt) a message to you; only you can unlock it.

**Why it's secure:** it relies on problems that are easy one way and hard to reverse — like multiplying two huge primes (easy) versus factoring the product (practically impossible with today's computers).

**HTTPS in practice**
1. The site sends its public key in a **certificate** signed by a **certificate authority**.
2. Your browser uses it to agree on a shared symmetric key.
3. The rest of the session uses fast symmetric encryption.

**Digital signatures** reverse the process to prove who sent a message.`,
          questions: [
            mc("In public-key encryption, which key decrypts a message sent to you?", "Your private key", ["Your public key", "The sender's public key", "Any key"], "Only your private key can unlock it."),
            mc("What problem does public-key encryption solve?", "Sharing a secret key with someone you've never met", ["Making files smaller", "Speeding up Wi-Fi", "Storing passwords in plain text"], "No shared secret is needed in advance."),
            tf("It's safe to share your public key with anyone.", true, "It can only lock, not unlock."),
            mc("What does a certificate authority do?", "Verifies that a public key belongs to a website", ["Encrypts every packet", "Assigns IP addresses", "Blocks viruses"], "It vouches for the site's identity."),
          ],
        },
        {
          title: "Malware, Phishing, and Defense",
          summary: "Recognize common attacks and use layered defenses to protect systems.",
          objectives: ["Identify malware types and phishing techniques", "Apply defenses like MFA, updates, and backups"],
          vocab: [["malware", "software designed to harm or exploit systems"], ["phishing", "deceptive messages that trick people into revealing information"], ["ransomware", "malware that encrypts files and demands payment"], ["multifactor authentication", "requiring two or more kinds of proof of identity"]],
          standards: ["3A-NI-05", "3A-NI-06"],
          body: `
**Malware types**
| Type | Behavior |
|---|---|
| Virus | attaches to files, spreads when they run |
| Worm | spreads across networks on its own |
| Trojan | disguised as legitimate software |
| Ransomware | encrypts files, demands payment |
| Spyware/keylogger | secretly records activity |

**Phishing red flags**
- Urgency: "Your account will be closed in 24 hours!"
- Mismatched sender or link: \`paypa1-security.com\`
- Requests for passwords or gift cards
- Generic greetings: "Dear customer"

**Layered defense**
- **Multifactor authentication** (something you know + have + are)
- **Install updates** promptly — they patch known vulnerabilities
- **Back up** files (3-2-1 rule: 3 copies, 2 media, 1 offsite)
- Antivirus and firewalls
- **Verify** requests through a separate channel

Most breaches start with a human mistake, so training matters as much as technology.`,
          questions: [
            mc("An email says 'Act now or lose your account!' and links to paypa1.com. This is likely…", "phishing", ["a legitimate notice", "a firmware update", "encryption"], "Urgency plus a lookalike domain."),
            mc("Which malware spreads across networks without user action?", "Worm", ["Trojan", "Phishing email", "Spyware"], "Worms self-replicate."),
            tf("Installing software updates helps protect against malware.", true, "Updates patch known vulnerabilities."),
            mc("What is the best protection against losing files to ransomware?", "Regular offline backups", ["A longer screen name", "Turning off the monitor", "Deleting your email"], "You can restore without paying."),
          ],
        },
      ],
    },
    {
      title: "Building Software Together",
      description: "Design event-driven interfaces and collaborate with version control.",
      lessons: [
        {
          title: "Event-Driven Programming and User Interfaces",
          summary: "Interactive apps register handlers that run when users click, type, or swipe.",
          objectives: ["Write event handlers for UI elements", "Design interfaces using user feedback"],
          vocab: [["event handler", "a function that runs in response to an event"], ["user interface (UI)", "the parts of a program users see and interact with"], ["user experience (UX)", "how easy and satisfying a product is to use"]],
          standards: ["3A-AP-16", "3A-AP-17"],
          body: `
**Event-driven programs** don't run top to bottom — they wait for events.

\`\`\`javascript
const button = document.getElementById("add");
const counter = document.getElementById("count");
let count = 0;

button.addEventListener("click", () => {
  count = count + 1;
  counter.textContent = count;
});
\`\`\`

**Common events:** click, input (typing), submit, keydown, load, timer.

**UI design principles**
- **Feedback:** show something happened (button changes, message appears)
- **Consistency:** similar things look and act alike
- **Error prevention:** disable "Submit" until required fields are filled
- **Simplicity:** fewer choices make faster decisions

**User testing:** watch real people use your app without helping. Where do they hesitate? Iterate based on what you see.`,
          questions: [
            mc("In the code, when does count increase?", "Each time the button is clicked", ["Once when the page loads", "Every second", "Never"], "The handler runs on each click."),
            num("The button is clicked 5 times. What does the counter show?", 5, "count goes 1, 2, 3, 4, 5."),
            mc("Disabling Submit until fields are complete is an example of…", "error prevention", ["consistency", "compression", "encryption"], "It stops mistakes before they happen."),
            tf("The best way to test a UI is to explain to users exactly what to click.", false, "Observe without helping to find real problems."),
          ],
          programmingLanguage: "javascript",
        },
        {
          title: "Collaboration and Version Control",
          summary: "Teams use version control like Git to track changes and work on code together.",
          objectives: ["Explain commits, branches, and merges", "Describe a collaborative workflow", "Document code for others"],
          vocab: [["version control", "a system that records changes to files over time"], ["commit", "a saved snapshot of changes with a message"], ["branch", "an independent line of development"], ["merge", "combining changes from different branches"]],
          standards: ["3A-AP-22", "3A-AP-23", "3B-AP-20"],
          body: `
**Version control** (like Git) tracks every change, who made it, and why.

**Key ideas**
- **Commit:** a snapshot with a message ("Fix login bug when password is empty")
- **Branch:** work on a feature without breaking the main code
- **Merge:** bring the branch back when it's ready
- **Pull request:** ask teammates to review before merging

**Workflow**
1. Create a branch: \`add-dark-mode\`
2. Make changes and commit often
3. Open a pull request
4. Teammates review and suggest changes
5. Merge into \`main\`

**Merge conflicts** happen when two people change the same line — a person decides which version to keep.

**Good collaboration**
- Clear commit messages
- Comments explaining *why*, not *what*
- Give credit and respect licenses when using open-source code

Open-source projects like Linux have tens of thousands of contributors coordinated this way.`,
          questions: [
            mc("What is a commit?", "A saved snapshot of changes with a message", ["Deleting a file", "A type of bug", "A web browser"], "Commits record history."),
            mc("Why create a branch for a new feature?", "To work without breaking the main code", ["To delete old code", "To make the app faster", "To encrypt files"], "Branches isolate work."),
            tf("A merge conflict happens when two people change the same lines.", true, "A person must choose how to combine them."),
            mc("Which commit message is most helpful?", "\"Fix crash when cart is empty\"", ["\"stuff\"", "\"changes\"", "\"asdf\""], "Describe what changed and why."),
          ],
        },
      ],
    },
  ],
};
