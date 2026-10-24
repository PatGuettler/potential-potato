import { mc, num, short, tf, type CourseSpec } from "../dsl";

const NGSS_ETS = "Next Generation Science Standards: Engineering Design";

export const engineeringCourses: CourseSpec[] = [
  {
    id: "eng-k2",
    title: "Engineering Explorers K–2",
    subject: "engineering",
    grade: 0,
    gradeMax: 2,
    framework: NGSS_ETS,
    description: "Young engineers ask questions, imagine, plan, build, and improve — with pushes and pulls, strong structures, and smart materials.",
    units: [
      {
        title: "Thinking Like an Engineer",
        description: "Learn the engineering design steps and solve simple problems.",
        lessons: [
          {
            title: "What Do Engineers Do?",
            summary: "Engineers solve problems by designing and building things that help people.",
            objectives: ["Explain what engineers do", "Name things engineers designed"],
            vocab: [["engineer", "a person who designs things to solve problems"], ["problem", "something that needs to be fixed or made better"], ["design", "a plan for something you will build"]],
            standards: ["K-2-ETS1-1"],
            body: `
**Engineers solve problems!** They design things that make life better.

**Look around — engineers designed:**
- 🌉 Bridges to cross rivers
- 🚲 Bikes to get around
- 🪥 Toothbrushes to keep teeth clean
- 🏠 Houses to keep us safe and warm
- 📱 Tablets and phones

**The engineering steps**
1. **Ask:** What is the problem?
2. **Imagine:** Think of ideas.
3. **Plan:** Draw your best idea.
4. **Create:** Build it!
5. **Improve:** Test it and make it better.

**You are an engineer** when you build a block tower that won't fall or a fort that keeps the rain out!`,
            questions: [
              mc("What do engineers do?", "Solve problems by designing things", ["Only fix cars", "Paint pictures", "Grow plants"], "Engineers design solutions."),
              mc("What is the first step for an engineer?", "Ask: What is the problem?", ["Build right away", "Throw it away", "Go home"], "Understand the problem first."),
              tf("A bridge was designed by engineers.", true, "Engineers design bridges."),
              mc("After you build and test, what do you do?", "Improve it", ["Give up", "Hide it", "Forget it"], "Engineers make designs better."),
            ],
          },
          {
            title: "Plan, Build, Test",
            summary: "Drawing a plan before building helps engineers make good designs.",
            objectives: ["Draw a simple plan before building", "Test a design and tell what happened"],
            vocab: [["plan", "a drawing that shows what you will build"], ["test", "try something to see if it works"], ["materials", "the things you build with"]],
            standards: ["K-2-ETS1-2", "K-2-ETS1-3"],
            body: `
**Problem:** Teddy needs a bed! 🧸

**Plan:** Draw it first. Label the parts:
- a box for the bed
- a soft cloth for a blanket
- a paper pillow

**Pick materials:** boxes, cloth, paper, tape, cotton balls.

**Build** following your plan.

**Test:** Does Teddy fit? Is it soft? Does it stay together?

**Compare with a friend:** Whose bed is softer? Whose is stronger? Different designs can both work!

**Improve:** add more cotton balls for a softer pillow.`,
            questions: [
              mc("Why draw a plan before building?", "To decide what to build and how", ["To waste paper", "Because it's the last step", "To skip building"], "A plan guides your build."),
              mc("Which is a material?", "Tape", ["A plan", "A test", "A problem"], "Materials are what you build with."),
              tf("Two different designs can both solve the same problem.", true, "There are many good solutions."),
              mc("Teddy doesn't fit in the bed. What should you do?", "Make the bed bigger", ["Give up", "Make it smaller", "Paint it"], "Improve the design."),
            ],
          },
        ],
      },
      {
        title: "Pushes and Pulls",
        description: "Explore how forces move objects and design ways to change motion.",
        lessons: [
          {
            title: "Pushes and Pulls Make Things Move",
            summary: "A push or pull can start, stop, or change the direction of an object.",
            objectives: ["Describe pushes and pulls", "Compare strong and gentle forces"],
            vocab: [["force", "a push or a pull"], ["motion", "moving from one place to another"], ["direction", "the way something moves"]],
            standards: ["K-PS2-1", "K-PS2-2"],
            body: `
A **force** is a **push** or a **pull**.

- ⚽ **Kick** a ball → push
- 🚪 **Open** a drawer → pull
- 🛝 **Swing** → push to go higher

**Bigger push = goes farther or faster.** A gentle tap rolls a ball a little. A big kick sends it far!

**Forces change direction:** a ball rolling toward you — kick it and it goes the other way.

**Forces can stop things:** catching a ball stops it.

**Try it:** roll a ball down a ramp. Make the ramp steeper. Does the ball go farther?`,
            questions: [
              mc("Opening a door toward you is a…", "pull", ["push", "spin", "jump"], "Pulling brings it toward you."),
              mc("Which makes a ball go farther?", "A big push", ["A tiny tap", "No push", "Holding it still"], "Stronger forces cause more motion."),
              tf("A push can change the direction an object moves.", true, "Kick a rolling ball to send it a new way."),
              mc("What is a force?", "A push or a pull", ["A color", "A shape", "A sound"], "Forces move things."),
            ],
          },
          {
            title: "Design a Ball Mover",
            summary: "Engineers design ramps and pushers to move a ball to a target.",
            objectives: ["Design a way to move a ball to a target", "Test and improve the design"],
            vocab: [["ramp", "a slanted surface"], ["target", "where you want something to go"], ["improve", "make better"]],
            standards: ["K-PS2-2", "K-2-ETS1-3"],
            body: `
**Challenge:** get a ball into a cup 🥤 across the table — without touching the ball with your hands after it starts!

**Ideas**
- A **ramp** made from a book and a ruler
- A **paper tube** to guide it
- A **pusher** made from a craft stick

**Test it!** Did it reach the cup?
- Too short? Make the ramp **steeper**.
- Rolled past? Make it **less steep** or add a **wall**.
- Went sideways? Add **sides** to the ramp.

**Count:** try 5 times. How many times did it reach the cup? Make a change and try 5 more times!`,
            questions: [
              mc("The ball stops before the cup. What could help?", "Make the ramp steeper", ["Make the ramp flat", "Use no ramp", "Hide the cup"], "Steeper ramps give more speed."),
              mc("The ball rolls off the side. What could help?", "Add walls to the ramp", ["Remove the ramp", "Use a bigger ball", "Turn off the lights"], "Walls guide the ball."),
              num("The ball reached the cup 3 times out of 5. How many times did it miss?", 2, "5 − 3 = 2."),
              tf("Engineers test a design more than once.", true, "Several tests show if it really works."),
            ],
          },
        ],
      },
      {
        title: "Strong Structures",
        description: "Build towers and bridges that hold up weight.",
        lessons: [
          {
            title: "Building Strong Towers",
            summary: "Wide bases and strong shapes make towers stand tall without falling.",
            objectives: ["Explain why wide bases are stable", "Build and test a tower"],
            vocab: [["structure", "something built"], ["base", "the bottom part"], ["stable", "steady, not falling over"]],
            standards: ["K-2-ETS1-2", "2-PS1-3"],
            body: `
**Challenge:** build the tallest tower that can stand on its own!

**Tips from engineers**
- **Wide base:** a big bottom is steady — like a pyramid 🔺.
- **Triangles are strong:** they don't squish.
- **Heavy at the bottom, light at the top.**

**Materials:** cups, index cards, craft sticks, clay.

**Test:** measure how tall it is with blocks or a ruler. Blow gently like a breeze — does it stand?

**Look around:** the Eiffel Tower is wide at the bottom and narrow at the top!`,
            questions: [
              mc("Which tower is most stable?", "One with a wide base", ["One with a tiny base", "One that is heavy at the top", "One balanced on a point"], "Wide bases are steady."),
              mc("Which shape is very strong in structures?", "Triangle", ["Circle made of string", "Wobbly square", "A line"], "Triangles keep their shape."),
              tf("A tower should be heavier at the top than at the bottom.", false, "Heavy at the bottom is steadier."),
              mc("The Eiffel Tower is…", "wide at the bottom, narrow at the top", ["narrow at the bottom, wide at the top", "the same width everywhere", "a circle"], "That makes it stable."),
            ],
          },
          {
            title: "Bridges That Hold",
            summary: "Bridges carry weight across a gap; folding and shaping paper makes it stronger.",
            objectives: ["Build a bridge across a gap", "Discover how shape changes strength"],
            vocab: [["bridge", "a structure that goes over a gap"], ["gap", "an empty space between two things"], ["load", "the weight a structure holds"]],
            standards: ["K-2-ETS1-1", "K-2-ETS1-3"],
            body: `
**Challenge:** make a paper bridge between two books that holds pennies.

**Flat paper:** sags with just a few pennies.

**Fold it!**
- Fold the paper like an **accordion** (zigzag) 🪗
- Roll it into **tubes**
- Fold up the **sides** like walls

**Test:** add pennies one at a time. Count how many it holds!

| Bridge | Pennies held |
|---|---|
| Flat | 3 |
| Folded sides | 20 |
| Accordion | 50+ |

**Same paper, different shape, much stronger!**`,
            questions: [
              mc("Which paper bridge holds the most pennies in the table?", "Accordion", ["Flat", "Folded sides", "They're all the same"], "Zigzag folds add strength."),
              num("How many more pennies did folded sides hold than flat?", 17, "20 − 3 = 17."),
              tf("Changing the shape of paper can make it stronger.", true, "Folds make paper stiffer."),
              mc("The weight a bridge holds is called the…", "load", ["gap", "base", "plan"], "Load is the weight."),
            ],
          },
        ],
      },
      {
        title: "Smart Materials",
        description: "Choose materials for a purpose and design for sun and weather.",
        lessons: [
          {
            title: "Choosing the Best Material",
            summary: "Engineers pick materials that are right for the job: waterproof, strong, soft, or bendy.",
            objectives: ["Test materials for a property", "Choose the best material for a job"],
            vocab: [["waterproof", "doesn't let water through"], ["absorb", "soak up"], ["property", "what something is like: hard, soft, bendy"]],
            standards: ["2-PS1-1", "2-PS1-2"],
            body: `
**Problem:** a toy needs a raincoat! ☔

**Test materials:** drip water on each one. Does it soak through?
| Material | Waterproof? |
|---|---|
| Paper towel | ❌ absorbs |
| Cotton cloth | ❌ soaks through |
| Plastic bag | ✅ |
| Aluminum foil | ✅ |

**Best for a raincoat:** plastic — waterproof **and** bendy.

**Other jobs, other materials**
- Soak up a spill → paper towel (absorbs)
- Build a strong tower → wood
- Make a soft pillow → cotton

**There is no "best" material for everything — only the best for the job.**`,
            questions: [
              mc("Which material is best for a raincoat?", "Plastic", ["Paper towel", "Cotton balls", "Tissue paper"], "Plastic is waterproof and bendy."),
              mc("Which material is best for cleaning up a spill?", "Paper towel", ["Plastic wrap", "Aluminum foil", "A rock"], "It absorbs water."),
              tf("The best material depends on the job.", true, "Different jobs need different properties."),
              mc("Waterproof means…", "water can't get through", ["it soaks up water", "it is made of water", "it melts in water"], "Waterproof keeps water out."),
            ],
          },
          {
            title: "Design for Sun and Weather",
            summary: "Engineers design structures to protect people and things from sun, rain, and wind.",
            objectives: ["Design a structure to protect from weather", "Test how well it works"],
            vocab: [["shelter", "a place that protects from weather"], ["sunlight", "light and warmth from the sun"], ["protect", "keep safe"]],
            standards: ["K-PS3-2", "K-ESS3-2", "K-2-ETS1-1"],
            body: `
**Challenge:** keep a toy animal dry, shady, and safe from wind!

**Think about each problem**
- ☀️ **Sun:** a roof that blocks light (cardboard, cloth)
- 🌧️ **Rain:** a slanted roof so water runs off (plastic, foil)
- 💨 **Wind:** heavy base or walls (tape it down, add clay)

**Build and test**
1. Shine a lamp on it — is it shady inside?
2. Sprinkle water on top — is the toy dry?
3. Use a fan — does it stay standing?

**Real engineers** design bus stops, playground shades, and houses the same way!

**Improve:** which test did it fail? Change one thing and try again.`,
            questions: [
              mc("Why make a roof slanted?", "So rain runs off", ["So it falls down", "To let rain in", "To catch the sun"], "Water flows down slants."),
              mc("Which helps a shelter stay put in wind?", "A heavy base", ["A paper-thin base", "No base", "Wheels"], "Weight keeps it steady."),
              tf("A playground shade structure blocks sunlight.", true, "It makes cooler shade."),
              mc("Your shelter got wet in the water test. What should you do?", "Change the roof material and test again", ["Give up", "Skip that test", "Make the roof smaller"], "Improve and retest."),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "eng-35",
    title: "Engineering Explorers 3–5",
    subject: "engineering",
    grade: 3,
    gradeMax: 5,
    framework: NGSS_ETS,
    description: "Define problems with criteria and constraints, build with simple machines and circuits, program robots, and run fair tests.",
    units: [
      {
        title: "The Engineering Design Process",
        description: "Define problems precisely and compare solutions fairly.",
        lessons: [
          {
            title: "Defining Problems: Criteria and Constraints",
            summary: "Good engineers define what success looks like (criteria) and what limits they face (constraints).",
            objectives: ["Write criteria and constraints for a problem", "Explain why clear problem statements matter"],
            vocab: [["criteria", "what a design must do to be successful"], ["constraints", "limits on a design, like time, money, or materials"], ["client", "the person an engineer designs for"]],
            standards: ["3-5-ETS1-1"],
            body: `
**Problem:** the co-op's little kids need a way to carry 6 crayons to art class.

**Criteria** (what it must do):
- Holds 6 crayons
- Easy for a 5-year-old to open
- Doesn't spill when carried

**Constraints** (limits):
- Use only paper, tape, and string
- Build in 30 minutes
- Costs less than $1

**Why it matters:** if you don't know the criteria, you can't tell if your design succeeded!

**Talk to your client:** ask the little kids what they need. Maybe they want a handle!

**Real example:** NASA engineers designing a Mars rover had constraints on weight (it must fit in the rocket) and criteria like surviving −100 °F nights.`,
            questions: [
              mc("'Must be built in 30 minutes' is a…", "constraint", ["criterion", "material", "client"], "It's a limit."),
              mc("'Must hold 6 crayons' is a…", "criterion", ["constraint", "budget", "test"], "It describes success."),
              tf("Talking to the client helps engineers understand the problem.", true, "Clients know what they need."),
              mc("Which is a constraint for a Mars rover?", "It must fit inside the rocket", ["It should take photos", "It should find rocks", "It should drive"], "Size and weight are limits."),
            ],
          },
          {
            title: "Comparing Solutions",
            summary: "Use a decision matrix to compare ideas fairly against criteria.",
            objectives: ["Generate multiple solutions", "Score solutions with a decision matrix"],
            vocab: [["decision matrix", "a table for scoring ideas against criteria"], ["brainstorm", "come up with many ideas quickly"], ["trade-off", "giving up one thing to get another"]],
            standards: ["3-5-ETS1-2"],
            body: `
**Brainstorm first:** 5+ ideas before choosing!

**Crayon carrier ideas — decision matrix (score 1–3)**
| Idea | Holds 6 | Easy to open | No spills | Total |
|---|---|---|---|---|
| Paper envelope | 3 | 3 | 1 | 7 |
| Folded box with lid | 3 | 2 | 3 | **8** |
| Rolled tube with cap | 2 | 1 | 3 | 6 |

**Winner:** folded box (8 points).

**Trade-offs:** the envelope is easiest to open but spills. The box is a little harder to open but doesn't spill.

**Weighting:** if "no spills" matters most, count it double!`,
            questions: [
              num("Using the matrix, what is the total score for the envelope?", 7, "3 + 3 + 1 = 7."),
              mc("Which idea won the decision matrix?", "Folded box with lid", ["Paper envelope", "Rolled tube with cap", "It was a tie"], "It scored 8."),
              tf("You should brainstorm several ideas before choosing one.", true, "More ideas mean better choices."),
              mc("The envelope opens easily but spills. This is a…", "trade-off", ["constraint", "client", "material"], "Gaining one thing, losing another."),
            ],
          },
        ],
      },
      {
        title: "Simple Machines",
        description: "Use levers, pulleys, wheels, and inclined planes to make work easier.",
        lessons: [
          {
            title: "Levers and Pulleys",
            summary: "Levers and pulleys let us lift heavy loads with less force.",
            objectives: ["Identify the fulcrum, load, and effort on a lever", "Explain how pulleys change force and direction"],
            vocab: [["lever", "a bar that pivots on a fulcrum"], ["fulcrum", "the point a lever turns on"], ["pulley", "a wheel with a rope that changes the direction or amount of force"], ["mechanical advantage", "how much a machine multiplies your force"]],
            standards: ["3-5-ETS1-2", "3-PS2-1"],
            body: `
**Levers:** a bar + a **fulcrum** (pivot)
- **Seesaw:** fulcrum in the middle
- **Crowbar:** pushing the long end lifts a heavy object at the short end
- **Moving the fulcrum closer to the load** makes lifting easier

**Rule of thumb:** effort × effort distance = load × load distance
A 10 N push 2 m from the fulcrum can lift a **20 N** load 1 m from the fulcrum.

**Pulleys**
- **Fixed pulley** (flagpole): changes direction — pull down to lift up
- **Movable pulley:** halves the force needed
- **Block and tackle** (many pulleys): cranes lift tons

**Nothing is free:** with less force, you pull the rope a longer distance.`,
            questions: [
              mc("On a seesaw, where is the fulcrum?", "In the middle", ["At one end", "Under the left seat only", "There isn't one"], "The seesaw pivots at the center."),
              num("Effort of 5 N is 4 m from the fulcrum. What load (N) can be lifted 1 m from the fulcrum?", 20, "5 × 4 = load × 1."),
              mc("What does a fixed pulley on a flagpole do?", "Changes the direction of force", ["Doubles your force", "Makes the flag heavier", "Nothing"], "Pull down to raise the flag."),
              tf("Using a movable pulley, you pull the rope farther but with less force.", true, "Force is traded for distance."),
            ],
          },
          {
            title: "Wheels, Axles, and Inclined Planes",
            summary: "Wheels reduce friction and ramps reduce the force needed to raise objects.",
            objectives: ["Explain how wheels and axles work", "Compare ramps of different slopes"],
            vocab: [["wheel and axle", "a wheel attached to a rod that turn together"], ["inclined plane", "a ramp"], ["friction", "a force that resists sliding"], ["wedge", "two inclined planes back to back"]],
            standards: ["3-PS2-1", "3-5-ETS1-2"],
            body: `
**Wheel and axle:** dragging a heavy box is hard because of **friction**. Put it on wheels and it rolls easily!
- Doorknobs, screwdrivers, steering wheels, bike pedals

**Inclined plane (ramp):** lifting a box straight up is hard. Pushing it up a ramp takes less force — but a longer distance.
| Ramp | Length | Force needed |
|---|---|---|
| Steep | 1 m | more |
| Gentle | 3 m | less |

**Wheelchair ramps** are long and gentle for this reason.

**Wedge:** two ramps back to back — knives, axes, doorstops.
**Screw:** a ramp wrapped around a post — jar lids, bolts.

**Six simple machines:** lever, pulley, wheel and axle, inclined plane, wedge, screw.`,
            questions: [
              mc("Which ramp needs less force to push a box up?", "A long, gentle ramp", ["A short, steep ramp", "No ramp", "A vertical wall"], "Gentle slopes need less force."),
              mc("An axe is an example of a…", "wedge", ["pulley", "wheel and axle", "lever only"], "A wedge splits things."),
              tf("Wheels reduce friction compared to dragging.", true, "Rolling has much less friction."),
              num("How many simple machines are there?", 6, "Lever, pulley, wheel and axle, inclined plane, wedge, screw."),
            ],
          },
        ],
      },
      {
        title: "Structures Under Stress",
        description: "Design bridges and earthquake-resistant towers.",
        lessons: [
          {
            title: "Bridge Engineering",
            summary: "Beam, arch, truss, and suspension bridges handle forces in different ways.",
            objectives: ["Compare bridge types", "Identify tension and compression", "Build and test a bridge"],
            vocab: [["tension", "a pulling force that stretches"], ["compression", "a pushing force that squeezes"], ["truss", "a frame of triangles"], ["span", "the distance a bridge crosses"]],
            standards: ["3-5-ETS1-1", "3-5-ETS1-3"],
            body: `
**Forces in structures**
- **Compression:** squeezing (columns, arches)
- **Tension:** stretching (cables, ropes)

| Bridge | How it works | Span |
|---|---|---|
| **Beam** | simple slab on supports | short |
| **Arch** | curve pushes force into the ground (compression) | medium |
| **Truss** | triangles spread forces | medium–long |
| **Suspension** | cables in tension hold the deck | very long |

The Golden Gate Bridge is a suspension bridge spanning about **1,280 m**.

**Challenge:** build a bridge from 20 craft sticks and glue spanning 30 cm. Test by hanging weights from the middle. Record the load when it fails — and where it broke!

**Triangles** are key: push on a square and it squishes into a diamond; a triangle holds its shape.`,
            questions: [
              mc("Suspension bridge cables are in…", "tension", ["compression", "neither", "friction"], "Cables are pulled."),
              mc("Which bridge type uses many triangles?", "Truss", ["Beam", "Suspension", "Floating"], "Trusses are triangle frames."),
              tf("An arch carries loads mainly through compression.", true, "The curve pushes forces down into the supports."),
              mc("Which bridge type crosses the longest distances?", "Suspension", ["Beam", "Arch", "Log"], "Golden Gate, for example."),
            ],
          },
          {
            title: "Earthquake-Resistant Towers",
            summary: "Engineers design buildings with wide bases, bracing, and flexible connections to survive shaking.",
            objectives: ["Explain how earthquakes affect buildings", "Design and test a tower on a shake table"],
            vocab: [["shake table", "a platform that simulates earthquake shaking"], ["cross-bracing", "diagonal supports that stiffen a frame"], ["base isolation", "flexible pads that separate a building from ground shaking"]],
            standards: ["4-ESS3-2", "3-5-ETS1-3"],
            body: `
**Earthquakes shake buildings side to side.** Tall, stiff, top-heavy buildings can topple.

**Design strategies**
- **Wide, heavy base**
- **Cross-bracing** (X-shapes) stops the frame from leaning
- **Base isolation:** rubber or spring pads let the ground move under the building
- **Tuned mass damper:** Taipei 101 has a 660-ton steel ball near the top that sways opposite the building!

**Shake table challenge**
- Build: marshmallows and spaghetti (or toothpicks and clay)
- Criteria: at least 30 cm tall, holds a small book on top, survives 15 seconds of shaking
- Test → note where it fails → improve

**Pattern you'll notice:** towers with triangles and wide bases do best.`,
            questions: [
              mc("What do X-shaped cross-braces do?", "Stop the frame from leaning", ["Make the building taller", "Add decoration", "Make it lighter"], "Diagonals stiffen frames."),
              mc("How does base isolation protect a building?", "Flexible pads let the ground move under it", ["It makes the building taller", "It glues the building to the ground", "It adds windows"], "Less shaking reaches the building."),
              tf("A top-heavy tower is more likely to fall in an earthquake.", true, "Weight up high makes it tip."),
              mc("Taipei 101 uses a giant steel ball to…", "reduce swaying", ["make electricity", "look pretty", "hold water"], "A tuned mass damper counteracts motion."),
            ],
          },
        ],
      },
      {
        title: "Energy and Motion Machines",
        description: "Build circuits and energy-powered vehicles.",
        lessons: [
          {
            title: "Simple Circuits",
            summary: "A complete loop of conductors lets electricity flow from a battery to light a bulb or spin a motor.",
            objectives: ["Build a complete circuit", "Identify conductors and insulators", "Add a switch to a circuit"],
            vocab: [["circuit", "a complete path for electricity"], ["conductor", "a material that lets electricity flow"], ["insulator", "a material that blocks electricity"], ["switch", "opens or closes a circuit"]],
            standards: ["4-PS3-2", "4-PS3-4"],
            body: `
**A circuit needs a complete loop:**
battery (+) → wire → bulb → wire → battery (−)

If there's a gap, electricity stops. That's an **open circuit**.

**Conductors vs. insulators**
| Conductors ✅ | Insulators ❌ |
|---|---|
| copper, aluminum foil, paper clips, graphite | plastic, rubber, wood, glass |

Wires are copper inside (conductor) with plastic outside (insulator) to keep us safe.

**Switches** open and close the loop — like a drawbridge for electricity.

**Test materials:** put each item in a gap in your circuit. Does the bulb light?

**Safety:** only use small batteries for experiments. **Never** play with wall outlets.`,
            questions: [
              mc("Why doesn't the bulb light in an open circuit?", "There's a gap in the loop", ["The battery is too new", "The bulb is too bright", "Wires are too short"], "Electricity needs a complete path."),
              mc("Which is a conductor?", "Aluminum foil", ["Rubber band", "Plastic spoon", "Wooden stick"], "Metals conduct electricity."),
              tf("A switch opens and closes a circuit.", true, "It controls the flow."),
              mc("Why do wires have plastic coatings?", "Plastic is an insulator that keeps us safe", ["To make them heavier", "To make electricity faster", "For decoration only"], "Insulation prevents shocks."),
            ],
          },
          {
            title: "Rubber-Band and Balloon Cars",
            summary: "Stored energy in stretched rubber bands or balloons can be turned into motion.",
            objectives: ["Explain stored (potential) and motion (kinetic) energy", "Design and test a vehicle for distance"],
            vocab: [["potential energy", "stored energy"], ["kinetic energy", "energy of motion"], ["axle", "the rod a wheel spins on"]],
            standards: ["4-PS3-1", "4-PS3-3", "4-PS3-4"],
            body: `
**Energy changes form!**
- Wind a rubber band → **potential (stored) energy**
- Let go → wheels spin → **kinetic (motion) energy**

**Balloon car:** air rushes out the back, pushing the car forward (action–reaction).

**Design challenge:** build a car that travels the farthest.
**Materials:** cardboard, straws, skewers (axles), bottle caps (wheels), rubber bands or balloons.

**Variables to test**
- More rubber band winds
- Bigger wheels
- Lighter body
- Less friction (straws as axle holders)

**Data**
| Trial | Winds | Distance (cm) |
|---|---|---|
| 1 | 10 | 120 |
| 2 | 20 | 230 |
| 3 | 30 | 310 |

More stored energy → farther distance.`,
            questions: [
              mc("A tightly wound rubber band has…", "potential energy", ["no energy", "only sound energy", "only light energy"], "Stored energy."),
              mc("Which change would likely make the car go farther?", "Reducing friction at the axles", ["Adding heavy rocks", "Using square wheels", "Fewer winds"], "Less friction wastes less energy."),
              num("Using the data, how much farther did the car go with 20 winds than 10 winds (cm)?", 110, "230 − 120 = 110."),
              tf("A balloon car moves because air pushes out the back.", true, "Action–reaction pushes the car forward."),
            ],
          },
        ],
      },
      {
        title: "Robotics Basics",
        description: "Learn what robots are and program one to complete tasks.",
        lessons: [
          {
            title: "What Is a Robot?",
            summary: "Robots sense, think, and act using sensors, a controller, and motors.",
            objectives: ["Identify the sense–think–act cycle", "Name robot parts and their jobs"],
            vocab: [["robot", "a machine that senses, decides, and acts on its own"], ["sensor", "a part that gathers information"], ["actuator", "a part that moves, like a motor"], ["controller", "the robot's brain"]],
            standards: ["3-5-ETS1-1", "1B-CS-01"],
            body: `
**A robot can sense, think, and act.**

| Step | Robot part | Human version |
|---|---|---|
| **Sense** | sensors (touch, light, distance, sound) | eyes, ears, skin |
| **Think** | controller (computer) | brain |
| **Act** | motors, lights, speakers | muscles, voice |

**Robot vacuum example**
1. **Sense:** bump sensor hits a chair
2. **Think:** "I bumped something — turn!"
3. **Act:** motors turn the wheels

**Is it a robot?**
- Toaster: no — it doesn't sense and decide (just a timer)
- Self-driving car: yes
- Remote-control car: no — a person makes the decisions

**Robots help people:** factories, surgery, Mars exploration, warehouses, and cleaning floors.`,
            questions: [
              mc("What does a robot's sensor do?", "Gathers information", ["Moves the wheels", "Stores batteries", "Paints the robot"], "Sensors are like eyes and ears."),
              mc("Which is the robot's 'brain'?", "Controller", ["Motor", "Wheel", "Sensor"], "It makes decisions."),
              tf("A remote-control car is a robot because it moves.", false, "A person makes all the decisions."),
              mc("What are the three things a robot does?", "Sense, think, act", ["Eat, sleep, play", "Run, jump, swim", "Read, write, draw"], "The sense–think–act cycle."),
            ],
          },
          {
            title: "Programming a Robot",
            summary: "Robots follow programs with sequences, loops, and sensor-based decisions.",
            objectives: ["Write a sequence of robot commands", "Use loops and if/then with sensors"],
            vocab: [["program", "instructions for a robot or computer"], ["loop", "repeat steps"], ["conditional", "if/then decision based on a sensor"]],
            standards: ["1B-AP-10", "3-5-ETS1-3"],
            body: `
**Drive a square:**
\`\`\`
repeat 4 times:
    move forward 50 cm
    turn right 90°
\`\`\`

**Use a sensor to make decisions:**
\`\`\`
forever:
    if distance sensor < 10 cm:
        stop
        turn right 90°
    else:
        move forward
\`\`\`
The robot avoids walls on its own!

**Line follower:**
\`\`\`
if light sensor sees black:
    turn left
else:
    turn right
\`\`\`
It wiggles along the edge of a black line.

**Debugging robots:** real robots aren't perfect — wheels slip and batteries weaken. Test, measure, and adjust numbers (like turning 88° instead of 90°).`,
            questions: [
              num("To drive a triangle, how many times should the loop repeat?", 3, "A triangle has 3 sides."),
              mc("In the wall-avoiding program, what happens when an object is 5 cm away?", "The robot stops and turns", ["The robot speeds up", "Nothing changes", "The robot beeps forever"], "5 < 10, so the if part runs."),
              tf("Real robots may need small adjustments because wheels can slip.", true, "Testing reveals real-world differences."),
              mc("A line-following robot uses which sensor?", "Light sensor", ["Sound sensor", "Temperature sensor", "Touch sensor only"], "It detects dark vs. light surfaces."),
            ],
          },
        ],
      },
      {
        title: "Testing and Sharing Designs",
        description: "Run fair tests and present engineering work.",
        lessons: [
          {
            title: "Fair Tests and Data",
            summary: "Change one variable, keep others the same, and repeat trials for reliable results.",
            objectives: ["Identify independent, dependent, and controlled variables", "Calculate averages from repeated trials"],
            vocab: [["variable", "something that can change in a test"], ["fair test", "a test where only one variable changes"], ["average", "the total divided by the number of trials"]],
            standards: ["3-5-ETS1-3"],
            body: `
**Question:** Do bigger wheels make the car go farther?

- **Change (independent variable):** wheel size
- **Measure (dependent variable):** distance traveled
- **Keep the same (controlled):** same car, same ramp, same starting point, same surface

**Repeat trials** because results vary:
| Wheels | Trial 1 | Trial 2 | Trial 3 | Average |
|---|---|---|---|---|
| Small | 140 | 150 | 145 | **145** |
| Large | 190 | 210 | 200 | **200** |

**Average** = total ÷ number of trials = (190 + 210 + 200) ÷ 3 = 200 cm

**Conclusion:** larger wheels went about 55 cm farther on average.

**Unfair test:** testing small wheels on carpet and large wheels on tile — you can't tell what caused the difference!`,
            questions: [
              num("Trials of 12, 15, and 18 cm. What is the average (cm)?", 15, "45 ÷ 3 = 15."),
              mc("In the wheel test, what is the independent variable?", "Wheel size", ["Distance", "The ramp", "The surface"], "It's what you change on purpose."),
              tf("Testing one car on carpet and another on tile is a fair test.", false, "The surface must stay the same."),
              mc("Why repeat trials?", "Results vary, so averages are more reliable", ["To use more time", "To get the answer you want", "It's not needed"], "Repetition reduces random errors."),
            ],
          },
          {
            title: "Presenting Your Design",
            summary: "Engineers share designs with drawings, data, and honest reflections.",
            objectives: ["Organize an engineering presentation", "Give and receive constructive feedback"],
            vocab: [["presentation", "sharing your work with an audience"], ["feedback", "helpful comments to improve work"], ["reflection", "thinking about what worked and what to change"]],
            standards: ["3-5-ETS1-2", "3-5-ETS1-3"],
            body: `
**Engineering presentation (3 minutes)**
1. **The problem:** what did you solve? Who needed it?
2. **Criteria and constraints**
3. **Your design:** show a drawing and the real thing
4. **Testing:** show your data table or graph
5. **Improvements:** what did you change after testing?
6. **Next time:** what would you do differently?

**Giving feedback — "I like, I wish, I wonder"**
- **I like** how you used triangles for strength.
- **I wish** the handle was bigger for little hands.
- **I wonder** if foil would keep it drier.

**Receiving feedback:** listen, say thank you, and write down ideas. Feedback makes designs better!

**Failures are data:** explaining what didn't work shows you think like a real engineer.`,
            questions: [
              mc("Which is a helpful 'I wish' comment?", "\"I wish the lid was easier to open.\"", ["\"I wish you didn't build it.\"", "\"It's bad.\"", "\"I wish I was done.\""], "Specific and kind."),
              mc("What should you show to prove your design works?", "Test data", ["Only a drawing", "Your favorite color", "Nothing"], "Data is evidence."),
              tf("Explaining what didn't work is part of a good engineering presentation.", true, "Failures teach lessons."),
              mc("When you receive feedback, you should…", "listen and write down ideas", ["argue right away", "ignore it", "leave"], "Feedback helps you improve."),
            ],
            writtenPrompt: "Write a short reflection on something you built: what was the problem, what worked, what didn't, and what would you change next time?",
            rubric: "States the problem (2) · Describes what worked (2) · Describes what didn't work (3) · Specific improvement (3)",
          },
        ],
      },
    ],
  },
  {
    id: "eng-elec-68",
    title: "Electricity & Electronics",
    subject: "engineering",
    grade: 6,
    gradeMax: 8,
    framework: NGSS_ETS,
    description: "From static charge to sensors: build circuits, apply Ohm's law, explore motors and generators, and design real electronic devices.",
    units: [
      {
        title: "Electric Charge and Current",
        description: "Understand static electricity and the basics of current, voltage, and resistance.",
        lessons: [
          {
            title: "Static Electricity",
            summary: "Rubbing materials transfers electrons, building up charges that attract or repel.",
            objectives: ["Explain how objects become charged", "Predict attraction and repulsion", "Explain lightning as static discharge"],
            vocab: [["electron", "a tiny negatively charged particle"], ["static electricity", "a buildup of charge on an object"], ["discharge", "a sudden flow of built-up charge"]],
            standards: ["MS-PS2-3", "MS-PS2-5"],
            body: `
**Atoms** have protons (+), neutrons (0), and electrons (−). Electrons can move between objects.

**Rubbing transfers electrons**
- Rub a balloon on hair → electrons move to the balloon
- Balloon: **negative**; hair: **positive**

**Rules**
- Opposite charges **attract** (balloon sticks to the wall)
- Like charges **repel** (hairs stand apart)

**Discharge:** touching a doorknob after walking on carpet — zap! Built-up electrons jump all at once.

**Lightning** is a giant discharge: charges separate in storm clouds, then jump to the ground. A bolt can be about 5 times hotter than the sun's surface.

**Engineering uses:** photocopiers, air purifiers, and spray painting cars all use static charge.`,
            questions: [
              mc("After rubbing a balloon on hair, the balloon is…", "negatively charged", ["positively charged", "neutral", "magnetic"], "It gains electrons."),
              mc("Two negatively charged balloons will…", "repel", ["attract", "stick together", "do nothing"], "Like charges repel."),
              tf("Lightning is a form of static discharge.", true, "Built-up charge jumps to the ground."),
              mc("Which particle moves when objects become charged by rubbing?", "Electrons", ["Protons", "Neutrons", "Whole atoms"], "Electrons transfer."),
            ],
          },
          {
            title: "Current, Voltage, and Resistance",
            summary: "Voltage pushes charge, current is the flow, and resistance slows it down.",
            objectives: ["Define voltage, current, and resistance with units", "Use the water-pipe analogy", "Measure with a multimeter"],
            vocab: [["voltage", "electrical push, measured in volts (V)"], ["current", "flow of charge, measured in amps (A)"], ["resistance", "opposition to current, measured in ohms (Ω)"], ["multimeter", "a tool that measures voltage, current, and resistance"]],
            standards: ["MS-PS3-5", "MS-PS2-3"],
            body: `
**Water-pipe analogy**
| Electricity | Water |
|---|---|
| Voltage (V) | water pressure |
| Current (A) | flow rate |
| Resistance (Ω) | narrow pipe |

**More voltage → more current.** **More resistance → less current.**

**Typical values**
- AA battery: 1.5 V
- Phone charger: 5 V
- U.S. wall outlet: 120 V (dangerous!)
- LED: about 0.02 A (20 mA)

**Measuring with a multimeter**
- **Voltage:** probes across a component (parallel)
- **Current:** meter in the path (series)
- **Resistance:** with power off

**Resistor color codes** show resistance: brown-black-red = 1,000 Ω (1 kΩ).`,
            questions: [
              mc("What unit measures current?", "Amps", ["Volts", "Ohms", "Watts"], "Current is in amperes."),
              mc("In the water analogy, voltage is like…", "water pressure", ["a narrow pipe", "the flow rate", "the water tank's color"], "Pressure pushes water like voltage pushes charge."),
              tf("Increasing resistance decreases current (at the same voltage).", true, "Resistance opposes flow."),
              num("How many volts do three 1.5 V batteries in series provide?", 4.5, "Series voltages add."),
            ],
          },
        ],
      },
      {
        title: "Circuit Design",
        description: "Build series and parallel circuits and use switches safely.",
        lessons: [
          {
            title: "Series and Parallel Circuits",
            summary: "Series circuits have one path; parallel circuits have multiple paths.",
            objectives: ["Build and compare series and parallel circuits", "Predict bulb brightness and behavior when a bulb is removed"],
            vocab: [["series circuit", "components connected in one path"], ["parallel circuit", "components on separate branches"], ["short circuit", "an unintended low-resistance path"]],
            standards: ["MS-PS3-5", "MS-ETS1-2"],
            body: `
**Series:** one loop
- Bulbs share the voltage → each is **dimmer**
- One bulb out → **all go out**
- Old holiday lights worked this way

**Parallel:** separate branches
- Each bulb gets full voltage → **brighter**
- One bulb out → **others stay on**
- Homes are wired in parallel

| | Series | Parallel |
|---|---|---|
| Paths | 1 | many |
| Bulb brightness | dimmer | brighter |
| One bulb removed | all off | others stay on |
| Battery life | longer | shorter |

**Short circuit:** a wire connecting battery terminals directly — huge current, heat, danger. Fuses and circuit breakers protect against this.`,
            questions: [
              mc("In a series circuit, if one bulb burns out…", "all the bulbs go out", ["the others get brighter", "nothing changes", "only that bulb goes out"], "The single path is broken."),
              mc("Homes are wired in parallel because…", "each device works independently", ["it uses less wire", "it's cheaper", "lights are dimmer"], "One device off doesn't affect others."),
              tf("Bulbs in parallel are usually brighter than the same bulbs in series.", true, "Each gets the full voltage."),
              mc("What protects homes from short circuits?", "Fuses and circuit breakers", ["Light bulbs", "Switches only", "Paint"], "They cut power when current is too high."),
            ],
          },
          {
            title: "Switches and Electrical Safety",
            summary: "Switches control circuits; safety devices and habits protect people from shocks and fires.",
            objectives: ["Wire switches to control circuits", "Explain fuses, breakers, and GFCIs", "Practice electrical safety rules"],
            vocab: [["fuse", "a wire that melts to break a circuit when current is too high"], ["circuit breaker", "a switch that trips automatically on overload"], ["GFCI", "an outlet that cuts power if current leaks, like through a person"]],
            standards: ["MS-ETS1-1", "MS-PS3-5"],
            body: `
**Switches**
- **Push button:** on only while pressed (doorbell)
- **Toggle:** stays on or off (light switch)
- **Two-way switches:** control one light from two places (top and bottom of stairs)

**Safety devices**
| Device | Protects against |
|---|---|
| Fuse | overload (melts once) |
| Circuit breaker | overload (resettable) |
| GFCI outlet | shock near water (bathrooms, kitchens) |
| Grounding (3rd prong) | shocks from faulty appliances |

**Safety rules**
- Never mix water and electricity
- Don't overload outlets or daisy-chain power strips
- Pull plugs, not cords
- Replace frayed cords
- Stay far from downed power lines — call 911
- Only experiment with low-voltage batteries`,
            questions: [
              mc("Which device should be used near a bathroom sink?", "GFCI outlet", ["Regular two-prong outlet", "Extension cord", "Push button"], "It cuts power if current leaks."),
              mc("What's the difference between a fuse and a circuit breaker?", "A breaker can be reset; a fuse must be replaced", ["A fuse can be reset", "They're unrelated", "A breaker makes light"], "Fuses melt once."),
              tf("It's safe to approach a downed power line if it isn't sparking.", false, "It may still be live — stay away and call 911."),
              mc("A doorbell uses which kind of switch?", "Push button", ["Toggle", "Two-way", "Dimmer"], "It works only while pressed."),
            ],
          },
        ],
      },
      {
        title: "Electrical Calculations",
        description: "Use Ohm's law and calculate power and energy costs.",
        lessons: [
          {
            title: "Ohm's Law",
            summary: "Voltage equals current times resistance: V = I × R.",
            objectives: ["Use V = IR to find voltage, current, or resistance", "Choose a resistor to protect an LED"],
            vocab: [["Ohm's law", "V = I × R"], ["resistor", "a component that limits current"], ["milliamp (mA)", "one-thousandth of an amp"]],
            standards: ["MS-PS3-5", "CCSS.MATH.CONTENT.8.EE.C.7"],
            body: `
**V = I × R**
- I = V ÷ R
- R = V ÷ I

**Ohm's triangle:** cover the one you want — V on top, I and R on the bottom.

**Examples**
- 9 V across 3 Ω → I = 9 ÷ 3 = **3 A**
- 2 A through 6 Ω → V = 2 × 6 = **12 V**
- 5 V with 0.5 A → R = 5 ÷ 0.5 = **10 Ω**

**Protecting an LED**
An LED needs about 2 V and 20 mA (0.02 A). With a 5 V supply, the resistor must drop 3 V:
R = 3 ÷ 0.02 = **150 Ω**
Without a resistor, the LED burns out!`,
            questions: [
              num("A 12 V battery is connected to a 4 Ω resistor. What is the current (A)?", 3, "I = 12 ÷ 4."),
              num("A current of 0.5 A flows through 20 Ω. What is the voltage (V)?", 10, "V = 0.5 × 20."),
              num("A 6 V source drives 2 A. What is the resistance (Ω)?", 3, "R = 6 ÷ 2."),
              num("An LED circuit needs the resistor to drop 4 V at 0.02 A. What resistance (Ω)?", 200, "4 ÷ 0.02 = 200."),
            ],
          },
          {
            title: "Power and Energy Costs",
            summary: "Power is the rate of energy use; kilowatt-hours determine your electric bill.",
            objectives: ["Calculate power with P = V × I", "Calculate energy in kilowatt-hours", "Estimate the cost of running appliances"],
            vocab: [["power", "rate of energy use, in watts (W)"], ["kilowatt-hour (kWh)", "energy used by 1,000 W for one hour"], ["phantom load", "power used by devices when turned off but plugged in"]],
            standards: ["MS-PS3-5", "MS-ETS1-1"],
            body: `
**Power: P = V × I**
A 120 V microwave drawing 10 A → P = **1,200 W**

**Energy: E = P × t**
- In kWh: (watts ÷ 1,000) × hours
- 1,200 W microwave for 0.5 h → 1.2 × 0.5 = **0.6 kWh**

**Cost:** energy × price. At $0.15/kWh, 0.6 kWh costs **$0.09**.

**Monthly cost of a 60 W bulb on 5 hours a day:**
0.06 kW × 5 h × 30 days = 9 kWh → 9 × $0.15 = **$1.35**
A 9 W LED: 1.35 kWh → **$0.20**

**Phantom loads:** TVs, game consoles, and chargers can draw power even when "off" — up to 5–10% of a home's electricity.`,
            questions: [
              num("A device draws 2 A at 120 V. What is its power (W)?", 240, "P = 120 × 2."),
              num("A 1,000 W heater runs for 3 hours. How many kWh does it use?", 3, "1 kW × 3 h."),
              num("At $0.20 per kWh, how much does 5 kWh cost ($)?", 1, "5 × 0.20 = $1.00."),
              mc("Which saves the most energy?", "Replacing incandescent bulbs with LEDs", ["Leaving chargers plugged in", "Running a heater with windows open", "Using a bigger TV"], "LEDs use about 85% less energy."),
            ],
          },
        ],
      },
      {
        title: "Electromagnetism",
        description: "Build electromagnets, motors, and generators.",
        lessons: [
          {
            title: "Electromagnets",
            summary: "Current through a coil creates a magnetic field that can be turned on and off.",
            objectives: ["Build an electromagnet", "Test factors that affect its strength", "Describe uses of electromagnets"],
            vocab: [["electromagnet", "a magnet made by electric current"], ["coil", "wire wound in loops"], ["core", "the material inside a coil, often iron"]],
            standards: ["MS-PS2-3", "MS-PS2-5"],
            body: `
**Build one:** wrap insulated wire around an iron nail, connect the ends to a battery, and pick up paper clips!

**Make it stronger**
1. More **coils** of wire
2. More **current** (higher voltage)
3. An **iron core**

**Investigation data**
| Coils | Paper clips lifted |
|---|---|
| 10 | 3 |
| 20 | 7 |
| 30 | 11 |

**Advantages over permanent magnets:** turn on/off, adjust strength.

**Uses**
- Junkyard cranes lift cars, then drop them
- Speakers and headphones
- MRI machines
- Maglev trains float above tracks
- Electric door locks and doorbells`,
            questions: [
              mc("Which change makes an electromagnet stronger?", "Adding more coils", ["Using fewer coils", "Removing the iron core", "Using a weaker battery"], "More coils = stronger field."),
              num("Using the data, about how many paper clips did each additional 10 coils add?", 4, "3 → 7 → 11."),
              tf("An electromagnet can be turned off.", true, "Stop the current and the field disappears."),
              mc("Why do junkyards use electromagnets instead of permanent magnets?", "They can release the metal by turning off", ["They're lighter", "They're cheaper to make", "They don't need electricity"], "On to lift, off to drop."),
            ],
          },
          {
            title: "Motors and Generators",
            summary: "Motors turn electricity into motion; generators turn motion into electricity.",
            objectives: ["Explain how a motor works", "Explain how a generator works", "Describe energy transformations"],
            vocab: [["motor", "converts electrical energy into motion"], ["generator", "converts motion into electrical energy"], ["induction", "creating current by moving a magnet near a coil"]],
            standards: ["MS-PS2-3", "MS-PS3-5"],
            body: `
**Motor:** electrical → mechanical energy
- Current flows through a coil inside a magnet
- The coil becomes an electromagnet and is pushed by the permanent magnets
- It spins!
- Found in: fans, drills, electric cars, washing machines

**Generator:** mechanical → electrical energy
- Spin a coil near magnets (or a magnet near a coil)
- Moving magnetism **induces** current
- Found in: power plants, wind turbines, hand-crank flashlights

**Same device, opposite directions!** Spin a small motor's shaft by hand and it produces a little voltage.

**Power plants:** steam (from coal, gas, nuclear), water, or wind spins a turbine → generator → electricity.

**Regenerative braking:** electric cars use their motors as generators when slowing down, recharging the battery.`,
            questions: [
              mc("A motor converts…", "electrical energy into motion", ["motion into electricity", "light into heat", "sound into motion"], "Motors make things spin."),
              mc("A wind turbine contains a…", "generator", ["motor only", "battery only", "light bulb"], "Wind spins it to make electricity."),
              tf("Electric cars can recharge their batteries while braking.", true, "Regenerative braking uses the motor as a generator."),
              mc("Moving a magnet near a coil to make current is called…", "induction", ["conduction", "insulation", "reflection"], "Electromagnetic induction."),
            ],
          },
        ],
      },
      {
        title: "Electronic Components",
        description: "Use LEDs, resistors, diodes, and sensors.",
        lessons: [
          {
            title: "LEDs, Resistors, and Diodes",
            summary: "Diodes let current flow one way; LEDs are diodes that make light and need resistors.",
            objectives: ["Identify LED polarity", "Explain why LEDs need current-limiting resistors", "Read resistor color codes"],
            vocab: [["diode", "a component that lets current flow only one way"], ["LED", "light-emitting diode"], ["polarity", "which side is positive and which is negative"], ["anode", "the positive (longer) leg of an LED"]],
            standards: ["MS-PS3-5", "MS-ETS1-2"],
            body: `
**Diodes** are one-way valves for electricity.

**LEDs (light-emitting diodes)**
- **Long leg = anode (+)**, short leg = cathode (−)
- Backwards → no light (no damage at low voltage)
- Need a **resistor** to limit current, or they burn out
- Use about 85% less energy than incandescent bulbs and last 25× longer

**Resistor color code** (first three bands)
| Color | Digit |
|---|---|
| Black 0 | Brown 1 |
| Red 2 | Orange 3 |
| Yellow 4 | Green 5 |
| Blue 6 | Violet 7 |
| Gray 8 | White 9 |

Bands: digit, digit, number of zeros.
**Brown-black-red** = 1, 0, two zeros = **1,000 Ω**
**Red-red-brown** = 2, 2, one zero = **220 Ω**

**Breadboards** let you build circuits without soldering.`,
            questions: [
              mc("Which LED leg is positive?", "The longer leg", ["The shorter leg", "Either one", "Neither"], "The anode is longer."),
              num("What is the resistance (Ω) of a resistor with bands yellow-violet-red?", 4700, "4, 7, two zeros."),
              tf("An LED connected backwards in a low-voltage circuit won't light.", true, "Diodes conduct only one way."),
              mc("Why does an LED need a resistor?", "To limit current so it doesn't burn out", ["To make it change color", "To make it brighter", "To store energy"], "Too much current destroys LEDs."),
            ],
          },
          {
            title: "Sensors in Electronics",
            summary: "Sensors change resistance or voltage in response to light, temperature, motion, or touch.",
            objectives: ["Describe common electronic sensors", "Explain how a voltage divider reads a sensor", "Match sensors to applications"],
            vocab: [["photoresistor (LDR)", "resistance changes with light"], ["thermistor", "resistance changes with temperature"], ["voltage divider", "two resistors that split voltage, used to read sensors"]],
            standards: ["MS-ETS1-1", "MS-PS4-3"],
            body: `
**Sensors convert real-world conditions into electrical signals.**

| Sensor | Responds to | Example use |
|---|---|---|
| Photoresistor (LDR) | light | automatic streetlights |
| Thermistor | temperature | thermostats |
| PIR | body heat motion | security lights |
| Ultrasonic | distance (echoes) | parking sensors |
| Pushbutton | touch | keyboards |
| Accelerometer | tilt and motion | phones rotating the screen |

**Voltage divider:** an LDR and a fixed resistor in series. As light changes, the LDR's resistance changes, so the voltage between them changes. A microcontroller reads that voltage.

**LDR behavior:** bright light → low resistance; dark → high resistance.

**Analog vs. digital:** a thermistor gives a range of values (analog); a button is just on/off (digital).`,
            questions: [
              mc("Which sensor would an automatic night-light use?", "Photoresistor", ["Thermistor", "Accelerometer", "Pushbutton"], "It detects light levels."),
              mc("In darkness, a photoresistor's resistance is…", "high", ["low", "zero", "unchanged"], "Less light → more resistance."),
              tf("A pushbutton is a digital sensor.", true, "It's either pressed or not."),
              mc("Car parking sensors usually use…", "ultrasonic sensors", ["thermistors", "photoresistors", "PIR sensors"], "They measure distance with sound echoes."),
            ],
          },
        ],
      },
      {
        title: "Design Projects",
        description: "Apply electronics to real design problems.",
        lessons: [
          {
            title: "Design an Automatic Night-Light",
            summary: "Combine a light sensor, transistor or microcontroller, and LED to make a light that turns on in the dark.",
            objectives: ["Define criteria and constraints for an electronic product", "Build and test a sensor-controlled circuit", "Iterate to meet specifications"],
            vocab: [["transistor", "an electronic switch controlled by a small current"], ["threshold", "the level at which a circuit switches"], ["specification", "a precise, measurable requirement"]],
            standards: ["MS-ETS1-1", "MS-ETS1-2", "MS-ETS1-4"],
            body: `
**Client need:** a younger sibling is afraid of the dark but parents don't want a light on all day.

**Specifications**
- Turns on when the room is dark; off in daylight
- Runs on batteries for at least a week of nights
- Costs under $5 in parts
- Safe: no exposed high voltage

**Circuit options**
1. **Transistor circuit:** LDR + resistor voltage divider controls a transistor that switches the LED.
2. **Microcontroller:** read the LDR with an analog pin; \`if light < 300: LED on\`.

**Testing**
- Measure the light level where it switches (threshold)
- Adjust with a potentiometer or code value
- Test battery life (measure current; battery mAh ÷ mA = hours)

**Battery life example:** 2,000 mAh battery, 20 mA LED → **100 hours** ≈ 10 nights of 10 hours.`,
            questions: [
              num("A 1,500 mAh battery powers a 15 mA circuit. How many hours will it last?", 100, "1,500 ÷ 15."),
              mc("What does the transistor do in the night-light?", "Acts as a switch for the LED", ["Measures light", "Stores energy", "Makes sound"], "A small signal controls a larger current."),
              tf("'Turns on in the dark' is more specific than 'works well.'", true, "Specifications must be measurable."),
              mc("The light turns on too early in the evening. What should you adjust?", "The switching threshold", ["The battery color", "The LED's shape", "Nothing"], "Change the potentiometer or code value."),
            ],
          },
          {
            title: "Home Energy Audit",
            summary: "Measure and analyze home electricity use, then design a plan to reduce it.",
            objectives: ["Inventory appliances and estimate energy use", "Identify the biggest energy users", "Propose and justify savings"],
            vocab: [["energy audit", "a systematic review of how energy is used"], ["standby power", "energy used by devices when not in active use"], ["payback period", "time for savings to repay an upgrade's cost"]],
            standards: ["MS-ESS3-3", "MS-PS3-5", "MS-ETS1-3"],
            body: `
**Step 1: Inventory** (find wattage on labels)
| Appliance | Watts | Hours/day | kWh/month |
|---|---|---|---|
| Refrigerator | 150 avg | 24 | 108 |
| Gaming console | 150 | 3 | 13.5 |
| LED bulbs (10) | 90 total | 5 | 13.5 |
| Clothes dryer | 3,000 | 1 | 90 |

kWh/month = watts × hours × 30 ÷ 1,000

**Step 2: Find the big users** — heating, cooling, water heating, dryers, and fridges usually top the list.

**Step 3: Propose changes**
- Air-dry clothes (saves ~90 kWh/month here)
- Smart power strips for standby loads
- Upgrade old appliances (ENERGY STAR)
- Adjust the thermostat 2–3 degrees

**Payback period** = cost ÷ yearly savings. A $30 smart strip saving $15/year pays back in **2 years**.`,
            questions: [
              num("A 100 W TV runs 4 hours a day for 30 days. How many kWh is that?", 12, "100 × 4 × 30 ÷ 1,000."),
              num("An upgrade costs $120 and saves $40 per year. What is the payback period (years)?", 3, "120 ÷ 40."),
              mc("In the table, which appliance uses the most energy per month?", "Refrigerator", ["Gaming console", "LED bulbs", "Clothes dryer"], "108 kWh vs. 90 for the dryer."),
              tf("Devices plugged in but turned off can still use electricity.", true, "That's standby or phantom power."),
            ],
            writtenPrompt: "Do an energy audit of three appliances in your home. Calculate each one's monthly kWh and propose one change that would save the most energy.",
            rubric: "Three appliances with wattage and hours (3) · Correct kWh calculations (4) · Justified recommendation (3)",
          },
        ],
      },
    ],
  },
];
