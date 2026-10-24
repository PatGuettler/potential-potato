import { mc, num, short, tf, type UnitSpec } from "../dsl";

export const engineeringExt: Record<string, UnitSpec[]> = {
  "eng-68": [
    {
      title: "Materials and Manufacturing",
      description: "Choose materials by their properties and learn how products are made.",
      lessons: [
        {
          title: "Material Properties and Selection",
          summary: "Engineers choose materials by strength, weight, cost, and how they respond to forces and environments.",
          objectives: ["Describe key material properties", "Compare materials for a design need", "Use a selection matrix"],
          vocab: [["tensile strength", "how much pulling force a material can withstand"], ["density", "mass per unit volume"], ["ductile", "can be stretched or bent without breaking"], ["brittle", "breaks suddenly without bending"]],
          standards: ["MS-ETS1-2", "MS-PS1-3"],
          body: `
**Material families**
| Family | Examples | Strengths | Weaknesses |
|---|---|---|---|
| Metals | steel, aluminum, copper | strong, ductile, conduct heat and electricity | heavy (steel), can rust |
| Polymers | PLA, nylon, rubber | light, cheap, easy to shape | weaker, can melt |
| Ceramics | glass, brick, porcelain | hard, heat resistant | brittle |
| Composites | carbon fiber, fiberglass, plywood | strong and light | expensive, hard to recycle |
| Natural | wood, bamboo, cotton | renewable | vary, can rot |

**Bike frame trade-off**
- Steel: strong, cheap, heavy
- Aluminum: lighter, mid-price
- Carbon fiber: lightest, most expensive

**Density example:** aluminum is about 2.7 g/cm³; steel is about 7.8 g/cm³ — nearly 3× heavier for the same volume.

**Selection matrix:** score each material on weighted criteria (strength × 3, cost × 2, weight × 2…) and add them up.`,
          questions: [
            mc("Which material family is brittle and heat resistant?", "Ceramics", ["Metals", "Polymers", "Natural fibers"], "Think of a coffee mug: heat-resistant but shatters."),
            mc("Why are airplanes made largely of aluminum and composites rather than steel?", "They are much lighter for their strength", ["They're the cheapest materials", "They rust faster", "They're magnetic"], "Weight matters enormously in flight."),
            tf("A ductile material bends before it breaks.", true, "Copper wire is ductile."),
            num("A steel block has a volume of 10 cm³ and density 7.8 g/cm³. What is its mass (g)?", 78, "mass = density × volume."),
          ],
        },
        {
          title: "Manufacturing Processes",
          summary: "Products are made by cutting away, adding, forming, or joining material — each with trade-offs.",
          objectives: ["Compare subtractive, additive, forming, and joining processes", "Choose a process for a product", "Explain mass production and its trade-offs"],
          vocab: [["subtractive manufacturing", "removing material, like cutting or drilling"], ["additive manufacturing", "building objects layer by layer, like 3D printing"], ["injection molding", "forcing melted plastic into a mold"], ["assembly line", "a production system where each worker or machine does one step"]],
          standards: ["MS-ETS1-3", "MS-PS1-3"],
          body: `
| Process | How | Examples |
|---|---|---|
| **Subtractive** | cut, drill, mill, laser-cut | CNC-milled parts, wooden furniture |
| **Additive** | build layer by layer | 3D-printed prototypes |
| **Forming** | mold, cast, bend, stamp | plastic toys, car panels |
| **Joining** | weld, glue, screw, rivet | bridges, bicycles |

**Injection molding:** expensive mold (thousands of dollars), but each part costs pennies — perfect for making a million LEGO bricks.

**Choosing a process depends on quantity**
| Quantity | Best choice |
|---|---|
| 1–10 prototypes | 3D printing, hand tools |
| 100s | CNC, laser cutting |
| 100,000s | injection molding, stamping |

**Assembly lines:** Henry Ford's 1913 line cut Model T assembly time from about 12 hours to about 1.5 hours.

**Quality control:** inspect samples and measure tolerances (allowable variation, e.g., ±0.1 mm).`,
          questions: [
            mc("Laser-cutting a shape out of plywood is…", "subtractive manufacturing", ["additive manufacturing", "injection molding", "casting"], "Material is removed."),
            mc("For 500,000 identical plastic phone cases, which process is most cost-effective?", "Injection molding", ["3D printing", "Hand carving", "CNC milling each one"], "High mold cost, very low per-part cost."),
            tf("3D printing is a form of additive manufacturing.", true, "It builds objects layer by layer."),
            mc("A tolerance of ±0.1 mm means…", "a part can be up to 0.1 mm larger or smaller than designed", ["the part must be exactly 0.1 mm", "the part can be any size", "the part is 0.1 mm thick"], "Tolerance is allowable variation."),
          ],
        },
      ],
    },
    {
      title: "Digital Fabrication",
      description: "Model in 3D and prepare designs for printing and cutting.",
      lessons: [
        {
          title: "3D Modeling and Printing",
          summary: "Design objects in CAD, slice them into layers, and print prototypes.",
          objectives: ["Build 3D models from basic shapes", "Explain how slicing and printer settings affect a print", "Design for printability"],
          vocab: [["CAD", "computer-aided design software"], ["slicer", "software that converts a 3D model into printer layers"], ["infill", "the internal fill pattern and density of a print"], ["overhang", "a part of a model that extends out with nothing underneath"]],
          standards: ["MS-ETS1-4", "MS-ETS1-2"],
          body: `
**Workflow**
1. **Design** in CAD (Tinkercad, Onshape) by combining and subtracting shapes
2. **Export** as STL
3. **Slice:** set layer height, infill, supports
4. **Print** and inspect
5. **Iterate!**

**Key settings**
| Setting | Effect |
|---|---|
| Layer height (0.1–0.3 mm) | thinner = smoother but slower |
| Infill (10–100%) | more = stronger, heavier, slower |
| Supports | hold up overhangs; removed after |

**Design for printing**
- Overhangs steeper than about **45°** need supports.
- Put the flattest side on the bed.
- Walls at least 1–2 mm thick.
- Add small gaps (~0.2–0.4 mm) between parts that must fit together.

**Estimate time:** a 30 mm tall part at 0.2 mm layers has **150 layers**.`,
          questions: [
            num("A part is 24 mm tall printed at 0.2 mm layer height. How many layers?", 120, "24 ÷ 0.2 = 120."),
            mc("Which change makes a 3D print stronger?", "Increasing infill", ["Decreasing infill to 5%", "Removing walls", "Printing faster with no cooling"], "More internal material adds strength."),
            tf("Overhangs much steeper than 45° usually need supports.", true, "Plastic can't be printed on thin air."),
            mc("What does a slicer do?", "Converts a 3D model into printer layers and instructions", ["Cuts plastic with a blade", "Designs the model from scratch", "Paints the print"], "It produces G-code for the printer."),
          ],
        },
        {
          title: "Technical Drawings and Measurement",
          summary: "Engineers communicate designs with orthographic drawings, dimensions, and precise measurement.",
          objectives: ["Read and sketch orthographic views", "Dimension a drawing with units and scale", "Measure accurately with rulers and calipers"],
          vocab: [["orthographic projection", "front, top, and side views of an object"], ["isometric drawing", "a 3D-looking sketch at 30° angles"], ["scale", "the ratio of drawing size to real size"], ["caliper", "a precise measuring tool"]],
          standards: ["MS-ETS1-4", "CCSS.MATH.CONTENT.7.G.A.1"],
          body: `
**Orthographic views** show an object from straight on:
- **Front view** (usually the most descriptive)
- **Top view** (above the front)
- **Right side view** (to the right of the front)

**Isometric sketches** show three faces at once using 30° lines — good for quick ideas.

**Dimensions:** every feature needs a size, with units. Don't dimension the same thing twice.

**Scale**
- 1:2 → drawing is half the real size
- 2:1 → drawing is twice the real size
- A 1:50 floor plan: 4 cm on paper = **200 cm** (2 m) real

**Measuring**
- Rulers: about ±0.5 mm
- **Calipers:** about ±0.02 mm — measure outside, inside, and depth
- Measure twice, cut once!`,
          questions: [
            num("On a 1:20 scale drawing, a part measures 3 cm. What is its real length (cm)?", 60, "3 × 20 = 60."),
            mc("Which orthographic view is placed directly above the front view?", "Top view", ["Right side view", "Bottom view", "Isometric view"], "Standard third-angle layout."),
            tf("Calipers measure more precisely than a standard ruler.", true, "About ±0.02 mm vs. ±0.5 mm."),
            mc("An isometric drawing uses lines at…", "30° from horizontal", ["90° only", "45° from horizontal", "60° from vertical only"], "Isometric axes are 30° from horizontal."),
          ],
        },
      ],
    },
    {
      title: "Energy and Sustainable Design",
      description: "Design renewable energy devices and reduce environmental impact.",
      lessons: [
        {
          title: "Renewable Energy Design",
          summary: "Design and test devices that convert wind, sun, and water into useful energy.",
          objectives: ["Compare renewable energy sources", "Design and test a wind turbine or solar cooker", "Calculate efficiency"],
          vocab: [["renewable energy", "energy from sources that are naturally replenished"], ["efficiency", "useful energy out ÷ energy in"], ["turbine", "a machine that turns moving fluid into rotation"]],
          standards: ["MS-PS3-3", "MS-ETS1-4", "MS-ESS3-3"],
          body: `
| Source | How it works | Limitation |
|---|---|---|
| Solar | photovoltaic cells turn light into electricity | only when sunny |
| Wind | blades spin a generator | only when windy |
| Hydro | flowing water spins turbines | needs rivers, affects ecosystems |
| Geothermal | Earth's heat makes steam | only in certain regions |

**Design challenge: model wind turbine**
- **Variables to test:** number of blades, blade angle (pitch), blade length, material
- **Measure:** voltage from a small motor-generator, or the weight a turbine can lift
- **Fair test:** same fan distance and speed every trial

Typical findings: 3 blades balance power and stability; blade pitch around 20–30° often works well for small models.

**Efficiency** = useful output ÷ input × 100%
Real solar panels: about 20%. Large wind turbines: up to about 45%.

**Storage** (batteries, pumped hydro) solves the "sun doesn't always shine" problem.`,
            questions: [
              num("A device takes in 200 J and produces 50 J of useful energy. What is its efficiency (%)?", 25, "50 ÷ 200 × 100."),
              mc("In the wind turbine test, which should stay the same for a fair test?", "Fan distance and speed", ["Number of blades being tested", "Blade angle being tested", "Everything should change"], "Control variables stay constant."),
              tf("Solar panels produce electricity at night without batteries.", false, "They need light."),
              mc("Which renewable source is limited to certain geographic regions with underground heat?", "Geothermal", ["Solar", "Wind", "Biomass"], "Iceland and parts of the western U.S. are examples."),
            ],
        },
        {
          title: "Life-Cycle and Sustainable Design",
          summary: "Sustainable design considers a product's impact from raw materials to disposal.",
          objectives: ["Trace a product's life cycle", "Apply sustainable design strategies", "Evaluate trade-offs between design options"],
          vocab: [["life cycle", "stages from raw material to disposal"], ["design for disassembly", "making products easy to take apart for repair and recycling"], ["embodied energy", "total energy used to make a product"]],
          standards: ["MS-ESS3-3", "MS-ETS1-1", "MS-ETS1-3"],
          body: `
**Life cycle of a product**
1. **Raw materials** (mining, harvesting)
2. **Manufacturing**
3. **Transportation**
4. **Use** (energy, water, maintenance)
5. **End of life** (reuse, recycle, landfill)

**Example: a water bottle**
| | Single-use plastic | Stainless steel |
|---|---|---|
| Embodied energy | low per bottle | high (one bottle) |
| Uses | 1 | thousands |
| End of life | often landfill | recyclable |
After a few dozen uses, the steel bottle comes out ahead.

**Sustainable design strategies**
- Use less material (lightweighting)
- Choose recycled or renewable materials
- **Design for disassembly:** screws instead of glue
- Make it repairable and durable
- Reduce energy during use (LED vs. incandescent: about 75% less energy)

**Trade-offs are real:** the "greenest" choice depends on how a product is actually used.`,
          questions: [
            mc("Which design choice makes a product easier to repair and recycle?", "Using screws instead of glue", ["Gluing every part", "Mixing many materials together", "Sealing it permanently"], "Design for disassembly."),
            mc("Which life-cycle stage uses the most energy for a refrigerator?", "Use (years of running)", ["Raw materials", "Transportation", "Disposal"], "It runs 24/7 for 10+ years."),
            tf("A reusable item always has a lower environmental impact than a disposable one, even if used only once.", false, "It must be used enough times to make up for higher embodied energy."),
            num("An LED uses about 75% less energy than a 60 W incandescent bulb. About how many watts does it use?", 15, "60 × 0.25 = 15.", { tolerance: 1 }),
          ],
          writtenPrompt: "Choose a product in your home. Trace its life cycle and propose two design changes that would make it more sustainable.",
          rubric: "Describes all five life-cycle stages (5) · Two realistic design changes (4) · Notes a trade-off (1)",
        },
      ],
    },
    {
      title: "Engineering in Society",
      description: "Explore engineering careers and design solutions for real communities.",
      lessons: [
        {
          title: "Engineering Disciplines and Careers",
          summary: "Engineers specialize in fields from civil to biomedical, all using the design process to solve problems.",
          objectives: ["Describe major engineering disciplines", "Match problems to the engineers who solve them", "Explore pathways into engineering"],
          vocab: [["civil engineering", "designing infrastructure like bridges, roads, and water systems"], ["biomedical engineering", "applying engineering to medicine and health"], ["mechanical engineering", "designing machines and moving systems"]],
          standards: ["MS-ETS1-1"],
          body: `
| Discipline | Designs… |
|---|---|
| **Civil** | bridges, roads, buildings, water systems |
| **Mechanical** | engines, robots, HVAC, machines |
| **Electrical** | circuits, power grids, electronics |
| **Chemical** | processes for medicines, fuels, food |
| **Biomedical** | prosthetics, medical devices, implants |
| **Aerospace** | aircraft, rockets, satellites |
| **Environmental** | clean water, pollution control, recycling |
| **Computer/software** | hardware, apps, operating systems |

**Real engineers, real problems**
- Biomedical engineers designed 3D-printed prosthetic hands for children that cost about $50 instead of thousands.
- Environmental engineers design low-cost water filters for communities without clean water.

**Pathway:** strong math and science, hands-on projects (robotics, maker clubs), then a 4-year engineering degree. Engineering technicians often start with 2-year degrees.

**Engineering is teamwork:** most projects involve many disciplines working together.`,
          questions: [
            mc("Which engineer would design a new highway bridge?", "Civil", ["Biomedical", "Chemical", "Software"], "Infrastructure is civil engineering."),
            mc("Which engineer designs artificial knees?", "Biomedical", ["Aerospace", "Civil", "Environmental"], "Medical devices."),
            tf("Most large engineering projects involve multiple disciplines.", true, "A car needs mechanical, electrical, software, and more."),
            mc("An engineer designing a satellite's heat shield is most likely in…", "aerospace engineering", ["civil engineering", "chemical engineering", "environmental engineering"], "Spacecraft are aerospace."),
          ],
        },
        {
          title: "Community Design Challenge",
          summary: "Apply the full design process to a real problem in your community.",
          objectives: ["Interview users to define a problem", "Develop and evaluate multiple solutions", "Present a design with evidence"],
          vocab: [["stakeholder", "a person affected by a design"], ["empathy interview", "conversation to understand a user's needs"], ["pitch", "a short persuasive presentation of a design"]],
          standards: ["MS-ETS1-1", "MS-ETS1-2", "MS-ETS1-3", "MS-ETS1-4"],
          body: `
**The full process**
1. **Empathize:** interview **stakeholders** — "Tell me about a time when…"
2. **Define:** write a problem statement: "*Younger co-op students* need a way to *carry supplies between rooms* because *their bags are too heavy*."
3. **Ideate:** brainstorm at least 10 ideas — quantity first.
4. **Select:** decision matrix with weighted criteria.
5. **Prototype:** build quickly and cheaply.
6. **Test:** with real users; collect data.
7. **Iterate and present.**

**Example problems**
- Rainwater floods the co-op's garden beds
- Recycling bins aren't used correctly
- Younger kids can't reach the sink
- The library has no quiet reading space

**Pitch structure (2 minutes)**
- The problem (with a user quote)
- Your solution (show the prototype)
- Evidence from testing
- What you'd improve next`,
          questions: [
            mc("What is the first step of the design process in this challenge?", "Interviewing stakeholders", ["Building a prototype", "Presenting the pitch", "Buying materials"], "Understand the problem before solving it."),
            mc("During brainstorming you should…", "generate many ideas without judging them", ["pick the first idea", "criticize each idea immediately", "only allow the teacher's ideas"], "Quantity first, then evaluate."),
            tf("Testing a prototype with real users provides evidence for a design pitch.", true, "Data makes the pitch persuasive."),
            mc("A stakeholder is…", "anyone affected by the design", ["only the engineer", "a building material", "a kind of tool"], "Users, families, staff, and neighbors."),
          ],
          writtenPrompt: "Write a problem statement and describe your best solution for a real problem in your home, co-op, or neighborhood. Include who you talked to and how you would test the solution.",
          rubric: "Clear user-centered problem statement (3) · Evidence from a stakeholder (2) · Feasible solution (3) · Test plan with measurable criteria (2)",
        },
      ],
    },
  ],
  "eng-912": [
    {
      title: "Design Communication",
      description: "Model parts in parametric CAD and communicate with technical drawings.",
      lessons: [
        {
          title: "Parametric CAD Modeling",
          summary: "Parametric CAD builds models from constrained sketches and features that update when dimensions change.",
          objectives: ["Create fully constrained sketches", "Use extrude, revolve, fillet, and pattern features", "Build assemblies with mates"],
          vocab: [["parametric model", "a model driven by dimensions and constraints that can be edited"], ["constraint", "a rule like parallel, equal, or tangent in a sketch"], ["feature", "an operation that adds or removes material, like extrude"], ["assembly", "multiple parts positioned with mates"]],
          standards: ["HS-ETS1-2", "HS-ETS1-4"],
          body: `
**Parametric CAD** (Onshape, Fusion, SolidWorks) records how a model is built, so changing one dimension updates everything.

**Workflow**
1. **Sketch** on a plane: lines, arcs, circles
2. **Constrain:** horizontal, perpendicular, equal, coincident, tangent
3. **Dimension:** until the sketch is **fully defined** (no free movement)
4. **Feature:** extrude, revolve, cut, fillet, chamfer, shell, pattern
5. **Assemble:** mate parts (fastened, revolute, slider)

**Design intent:** if a bracket's holes should always be centered, constrain them to the midpoint — not a fixed distance from the edge. Then resizing keeps them centered.

**Variables/equations:** set \`wall = 3 mm\` once and reference it everywhere.

**Revolve** makes round parts (bottles, wheels) from a half-profile; **pattern** repeats features (bolt circles, gear teeth).`,
          questions: [
            mc("Why fully constrain a sketch?", "So geometry can't shift unexpectedly when edited", ["To make it render faster", "To change its color", "It isn't necessary"], "Fully defined sketches behave predictably."),
            mc("Which feature creates a wheel from a half-profile sketch?", "Revolve", ["Extrude", "Fillet", "Shell"], "Revolve spins a profile around an axis."),
            tf("In a parametric model, changing one dimension can update dependent features automatically.", true, "That's the power of parametric design."),
            mc("Repeating six bolt holes evenly around a circle uses a…", "circular pattern", ["chamfer", "shell", "loft"], "Patterns replicate features."),
          ],
        },
        {
          title: "Technical Drawings and Tolerances",
          summary: "Engineering drawings communicate exact geometry, dimensions, and tolerances for manufacturing.",
          objectives: ["Create multiview and section views", "Apply dimensions and tolerances", "Explain fits between mating parts"],
          vocab: [["section view", "a view showing the inside of a part as if cut"], ["tolerance", "allowable variation from a dimension"], ["clearance fit", "a fit that always leaves a gap between parts"], ["interference fit", "a fit where parts must be pressed together"]],
          standards: ["HS-ETS1-2", "CCSS.MATH.CONTENT.HSG.MG.A.3"],
          body: `
**A drawing is a contract** between designer and manufacturer.

**Standard elements**
- Front, top, right views (plus isometric for reference)
- **Section views** to show internal features (hatched where cut)
- Dimensions in mm (or inches), title block, scale, material

**Tolerances**
- 25.00 ± 0.05 mm → acceptable from **24.95 to 25.05**
- Tighter tolerance = higher cost. Only make critical dimensions tight.

**Fits between a shaft and a hole**
| Fit | Hole | Shaft | Result |
|---|---|---|---|
| Clearance | 10.10 | 9.95 | always a gap — slides |
| Interference | 9.98 | 10.02 | must be pressed in |

**Tolerance stack-up:** three parts each 20 ± 0.1 mm stacked together could total 59.7 to 60.3 mm.`,
          questions: [
            num("A dimension is 40.0 ± 0.2 mm. What is the maximum acceptable size (mm)?", 40.2, "40.0 + 0.2."),
            num("Three blocks, each 10 ± 0.05 mm, are stacked. What is the maximum total height (mm)?", 30.15, "3 × 10.05."),
            mc("A 12.00 mm shaft must slide freely in a hole. Which hole size gives a clearance fit?", "12.10 mm", ["11.90 mm", "11.98 mm", "11.95 mm"], "The hole must be larger than the shaft."),
            tf("Tighter tolerances usually increase manufacturing cost.", true, "Precision takes more time and better equipment."),
          ],
        },
      ],
    },
    {
      title: "Testing and Analysis",
      description: "Test materials and analyze designs with data.",
      lessons: [
        {
          title: "Stress, Strain, and Material Testing",
          summary: "Tensile tests measure how materials stretch and fail, giving engineers data for safe designs.",
          objectives: ["Calculate stress and strain", "Interpret a stress–strain curve", "Apply factor of safety"],
          vocab: [["stress", "force per unit area, σ = F/A"], ["strain", "change in length ÷ original length"], ["yield strength", "stress at which permanent deformation begins"], ["factor of safety", "ratio of failure load to expected load"]],
          standards: ["HS-ETS1-3", "HS-PS2-6"],
          body: `
**Stress:** σ = F / A (newtons per square meter = pascals)
A 2,000 N force on a rod with area 0.0001 m² → σ = **20,000,000 Pa = 20 MPa**

**Strain:** ε = ΔL / L₀ (no units)
A 200 mm bar stretches 0.4 mm → ε = **0.002**

**Stress–strain curve**
1. **Elastic region:** straight line; returns to shape when unloaded
2. **Yield point:** permanent deformation begins
3. **Ultimate strength:** maximum stress
4. **Fracture**

| Material | Yield strength (approx.) |
|---|---|
| Structural steel | 250 MPa |
| Aluminum 6061 | 275 MPa |
| PLA plastic | 50 MPa |

**Factor of safety (FoS)** = failure load ÷ working load. Elevators use FoS ≈ 10+; aircraft use ≈ 1.5 (weight matters, but testing is rigorous).

A beam that fails at 12,000 N with a working load of 3,000 N has **FoS = 4**.`,
          questions: [
            num("A 500 N force acts on an area of 0.001 m². What is the stress in Pa?", 500000, "500 ÷ 0.001 = 500,000 Pa."),
            num("A 100 mm bar stretches 0.5 mm. What is the strain?", 0.005, "0.5 ÷ 100."),
            num("A part fails at 9,000 N. The working load is 1,500 N. What is the factor of safety?", 6, "9,000 ÷ 1,500."),
            mc("In the elastic region of a stress–strain curve, a material…", "returns to its original shape when unloaded", ["is permanently bent", "has fractured", "has no stress"], "Elastic deformation is reversible."),
          ],
        },
        {
          title: "Design Optimization with Data",
          summary: "Use experiments and data analysis to improve designs systematically.",
          objectives: ["Design controlled experiments for prototypes", "Analyze data with averages and graphs", "Optimize using trade-off analysis"],
          vocab: [["optimization", "finding the best design within constraints"], ["independent variable", "the factor you change"], ["trade-off", "giving up some of one quality to gain another"], ["strength-to-weight ratio", "load supported ÷ structure weight"]],
          standards: ["HS-ETS1-3", "HS-ETS1-4"],
          body: `
**Optimization:** improve a design measurably within constraints.

**Example: balsa truss bridge**
| Version | Mass (g) | Max load (N) | Strength-to-weight |
|---|---|---|---|
| A (Warren) | 25 | 400 | 16 |
| B (Pratt) | 28 | 420 | 15 |
| C (Warren + bracing) | 30 | 600 | **20** |

C carries the most per gram — the best design for an efficiency competition.

**Good testing practice**
- Change **one variable** at a time
- Run **3+ trials** and average
- Record failure modes (where and how it broke)
- Graph results to see trends

**Trade-offs:** a stronger bridge may be heavier; a faster car may use more battery. Use weighted decision matrices or plot the **Pareto front** (designs where you can't improve one thing without worsening another).

**Simulation (FEA)** predicts stress before building, saving time and materials.`,
          questions: [
            num("A bridge with mass 40 g holds 800 N. What is its strength-to-weight ratio (N/g)?", 20, "800 ÷ 40."),
            mc("Why run at least three trials per design?", "To reduce the effect of random variation", ["To use more materials", "To make the data look bigger", "It isn't necessary"], "Averages are more reliable."),
            tf("When testing, you should change several variables at once to save time.", false, "Then you can't tell which change caused the result."),
            mc("FEA software is used to…", "predict stresses in a design before building it", ["draw cartoons", "write essays", "order materials"], "Finite element analysis simulates loads."),
          ],
        },
      ],
    },
    {
      title: "Managing Engineering Projects",
      description: "Plan schedules, budgets, and teams for real projects.",
      lessons: [
        {
          title: "Project Management and Gantt Charts",
          summary: "Engineers plan projects with task breakdowns, schedules, dependencies, and budgets.",
          objectives: ["Create a work breakdown structure", "Build a Gantt chart and identify the critical path", "Track a budget"],
          vocab: [["work breakdown structure", "a project split into smaller deliverables and tasks"], ["Gantt chart", "a bar chart showing tasks over time"], ["critical path", "the longest chain of dependent tasks, which sets the project length"], ["milestone", "a key checkpoint"]],
          standards: ["HS-ETS1-2", "HS-ETS1-3"],
          body: `
**Work breakdown structure** for a robot:
- Chassis → design, cut, assemble
- Electronics → wiring, sensors
- Code → drive, autonomous
- Testing → driver practice

**Dependencies:** you can't wire electronics until the chassis is built.

**Example tasks**
| Task | Days | Depends on |
|---|---|---|
| A. Design chassis | 3 | — |
| B. Build chassis | 4 | A |
| C. Write code | 5 | A |
| D. Wire electronics | 2 | B |
| E. Test | 3 | C, D |

**Critical path:** A → B → D → E = 3 + 4 + 2 + 3 = **12 days**
(A → C → E = 11 days, so C has 1 day of slack.)

**Gantt chart:** bars for each task across a calendar; milestones as diamonds.

**Budget:** track planned vs. actual costs; keep 10–15% contingency for surprises.`,
          questions: [
            num("Using the table, how many days is the critical path?", 12, "A + B + D + E = 12."),
            mc("Which task has slack in the example?", "C. Write code", ["B. Build chassis", "D. Wire electronics", "E. Test"], "Path A→C→E is 11 days, one less than the critical path."),
            tf("Delaying a task on the critical path delays the whole project.", true, "It has no slack."),
            num("A project budget is $2,000 with a 15% contingency. How much is the contingency ($)?", 300, "0.15 × 2,000."),
          ],
        },
        {
          title: "Teamwork, Documentation, and Ethics",
          summary: "Successful engineering teams communicate, document decisions, and uphold ethical responsibility to the public.",
          objectives: ["Use an engineering notebook effectively", "Apply team roles and conflict resolution", "Analyze an engineering ethics case"],
          vocab: [["engineering notebook", "a dated record of ideas, tests, and decisions"], ["code of ethics", "professional rules for responsible conduct"], ["whistleblower", "a person who reports wrongdoing"]],
          standards: ["HS-ETS1-3"],
          body: `
**Engineering notebooks** record ideas, sketches, calculations, test data, and decisions — dated, in ink, never torn out. They support patents and help teams remember *why* choices were made.

**Team roles:** project manager, design lead, build lead, programmer, documentation/communications. Rotate so everyone learns.

**Conflict resolution**
1. Focus on the problem, not the person.
2. Use data: "Let's test both designs."
3. Agree on decision rules ahead of time.

**Ethics: "hold paramount the safety, health, and welfare of the public"** (NSPE Code of Ethics).

**Case: Challenger (1986).** Engineers warned that O-ring seals could fail in cold temperatures. Managers launched anyway at about 36 °F. The shuttle broke apart 73 seconds after launch, killing all seven crew members.

**Lessons:** communicate risks clearly with data, escalate concerns, and never let schedule pressure override safety.`,
          questions: [
            mc("What is the top priority in engineering codes of ethics?", "Public safety, health, and welfare", ["Meeting the schedule", "Lowest cost", "Company profit"], "Safety is paramount."),
            mc("What caused the Challenger disaster?", "O-ring seals failed in cold temperatures", ["A software bug", "A lightning strike", "Running out of fuel"], "Engineers had warned about cold-weather O-ring performance."),
            tf("Pages should be torn out of an engineering notebook when ideas don't work.", false, "Failed ideas are valuable records."),
            mc("Two teammates disagree about a design. The best first step is to…", "test both options and compare data", ["let the loudest person decide", "quit the team", "pick randomly without discussion"], "Data resolves disagreements objectively."),
          ],
          writtenPrompt: "You're an engineer and discover a product your company is about to ship has a safety flaw that could injure users. Your manager says to ship it anyway to meet the deadline. What do you do? Justify your response using the engineering code of ethics.",
          rubric: "Identifies the ethical conflict (2) · Proposes concrete escalation steps (4) · Cites public safety as paramount (2) · Considers consequences (2)",
        },
      ],
    },
    {
      title: "Capstone Design",
      description: "Prototype, test, and present a complete engineering solution.",
      lessons: [
        {
          title: "Prototyping and Iteration",
          summary: "Move from low-fidelity to high-fidelity prototypes, testing and improving at each stage.",
          objectives: ["Choose prototype fidelity appropriate to the question", "Plan test protocols against criteria", "Document iterations"],
          vocab: [["low-fidelity prototype", "a quick, cheap model to test an idea"], ["high-fidelity prototype", "a model close to the final product"], ["test protocol", "a written procedure for testing"], ["iteration", "one cycle of design, build, test, improve"]],
          standards: ["HS-ETS1-2", "HS-ETS1-3"],
          body: `
**Prototype to answer a question.**
| Fidelity | Materials | Answers |
|---|---|---|
| Low | cardboard, foam, tape, paper | Does the idea make sense? Is the size right? |
| Medium | 3D prints, laser-cut wood | Does the mechanism work? |
| High | final materials and electronics | Does it meet all criteria? |

**Fail fast, fail cheap:** a cardboard mockup costs minutes; finding the same flaw in metal costs weeks.

**Test protocol example (backpack hook)**
- Criterion: holds 15 kg for 24 hours without bending more than 2 mm
- Procedure: hang 15 kg, measure deflection at 0, 1, and 24 hours
- Trials: 3 hooks
- Pass/fail recorded with photos

**Iteration log:** version, what changed, why, results. Dyson famously built over 5,000 prototypes of his bagless vacuum.`,
          questions: [
            mc("To quickly test whether a handle is a comfortable size, the best prototype is…", "a foam or cardboard mockup", ["a machined aluminum part", "the final injection-molded product", "a full computer simulation only"], "Low fidelity answers simple questions fast."),
            mc("A good test protocol includes…", "measurable criteria and repeatable steps", ["only opinions", "no data", "a different procedure each time"], "Repeatability makes results trustworthy."),
            tf("Finding design flaws early in low-fidelity prototypes saves time and money.", true, "Fail fast, fail cheap."),
            num("Dyson built about how many thousand prototypes of his vacuum?", 5, "Over 5,000 prototypes.", { tolerance: 1 }),
          ],
        },
        {
          title: "Presenting and Defending a Design",
          summary: "Communicate a design's value with evidence in a design review.",
          objectives: ["Structure a technical presentation", "Present data visually", "Respond to critical questions"],
          vocab: [["design review", "a formal evaluation of a design by peers and experts"], ["executive summary", "a brief overview of the most important points"], ["technical report", "a written document describing a design and its evidence"]],
          standards: ["HS-ETS1-3", "HS-ETS1-4"],
          body: `
**Design review presentation (8–10 minutes)**
1. **Problem and users** — why it matters
2. **Criteria and constraints**
3. **Concepts considered** and the decision matrix
4. **Final design** — CAD, photos, demo
5. **Testing evidence** — graphs vs. criteria
6. **Cost and manufacturability**
7. **Limitations and next steps**

**Data on slides**
- One graph, one message: "Version C held 50% more load"
- Mark the target criterion line on the graph

**Handling tough questions**
- Listen fully, then restate the question.
- Answer with evidence.
- "We didn't test that — here's how we would" is a strong answer.
- Never bluff.

**Technical report:** executive summary, background, methods, results, discussion, conclusion, references, appendices (drawings, code, raw data).`,
          questions: [
            mc("If a reviewer asks about something you didn't test, the best response is…", "acknowledge it and explain how you would test it", ["make up a result", "change the subject", "say it doesn't matter"], "Honesty builds credibility."),
            mc("Which part of a technical report gives a brief overview of the key findings?", "Executive summary", ["Appendix", "References", "Methods"], "Busy readers start there."),
            tf("A design presentation should include limitations and next steps.", true, "It shows honest, mature engineering."),
            mc("The best slide title for a test-results graph is…", "\"Version C held 50% more load than Version A\"", ["\"Graph\"", "\"Data\"", "\"Results stuff\""], "State the message."),
          ],
          writtenPrompt: "Write an executive summary (150–250 words) for an engineering project you completed or would like to complete: the problem, the solution, key test results, and next steps.",
          rubric: "Clear problem (2) · Solution described (2) · Quantitative results (3) · Next steps (2) · Concise and well organized (1)",
        },
      ],
    },
  ],
};
