/** 20 engineering lessons: design, mechanics, materials, systems */
export const engineeringLessons = [
  {
    id: "eng001",
    title: "What Is Engineering?",
    summary: "Branches of engineering and how engineers apply math and science to design solutions.",
    difficulty: "Easy",
    estimatedMinutes: 25,
    tags: "introduction|disciplines|design",
    content: `**Engineering** uses science, mathematics, and practical judgment to design and build useful systems under constraints (cost, safety, time, environment).

**Major branches:**
- **Civil** — infrastructure (bridges, water systems)
- **Mechanical** — machines, thermal systems, manufacturing
- **Electrical** — power, electronics, communications
- **Chemical** — processes, materials, energy conversion
- **Computer / Software** — computing systems
- **Biomedical** — medical devices and health technology

**Engineers** follow codes and standards, document decisions, test prototypes, and iterate.

**Difference from science:** Scientists often seek understanding; engineers prioritize **meeting human needs** with reliable solutions.`,
    answerGuide: `Ethics and public safety (PE licensure, codes). Interdisciplinary projects common. Failure analysis (case studies) motivates rigor.`,
    answer: `Students should define engineering, name three branches with examples, list typical constraints, and contrast engineering goals with pure science research.`,
  },
  {
    id: "eng002",
    title: "The Engineering Design Process",
    summary: "Define problems, brainstorm, prototype, test, and improve designs.",
    difficulty: "Easy",
    estimatedMinutes: 30,
    tags: "design-process|iteration|problem-solving",
    content: `A structured **design process** improves outcomes:

1. **Identify need / define problem** — who is the user? what requirements (must-have vs nice-to-have)?
2. **Research** — existing solutions, materials, regulations
3. **Specify criteria & constraints** — performance targets, budget, safety, sustainability
4. **Brainstorm solutions** — many ideas; defer judgment
5. **Select approach** — decision matrix scoring concepts
6. **Prototype** — sketch, CAD model, physical model
7. **Test & evaluate** — collect data vs criteria
8. **Iterate** — refine weak points
9. **Communicate** — drawings, reports, presentations

**Iteration** is expected — first design rarely final.

**Documentation** preserves rationale for future teams.`,
    answerGuide: `Emphasize user-centered design. Failure modes considered early (FMEA preview). Prototype fidelity matches questions (paper vs 3D print).`,
    answer: `Students should list design steps in order, define criteria vs constraints, explain prototyping and iteration, and give one example metric to test.`,
  },
  {
    id: "eng003",
    title: "Measurement and SI Units",
    summary: "Use metric units, prefixes, and significant figures in engineering work.",
    difficulty: "Easy",
    estimatedMinutes: 25,
    tags: "units|measurement|si",
    content: `Engineers use the **International System (SI)** for consistent communication.

**Base units:** meter (m), kilogram (kg), second (s), ampere (A), kelvin (K), mole (mol), candela (cd)

**Derived units:**
- Force: **newton (N)** = kg·m/s²
- Pressure: **pascal (Pa)** = N/m²
- Power: **watt (W)** = J/s

**Prefixes:** kilo (10³), centi (10⁻²), milli (10⁻³), micro (10⁻⁶)

**Significant figures** reflect measurement precision; don't over-report digits.

**Unit conversion:** Factor-label method cancels units (km/h to m/s).

**Always label axes and include units in calculations** — naked numbers cause errors.`,
    answerGuide: `US customary units still appear in some US projects; convert carefully. 9.81 m/s² for g. Dimensional analysis checks equations.`,
    answer: `Students should name SI base units for length, mass, time, define newton and watt, convert 1 km to m, and explain significant figures briefly.`,
  },
  {
    id: "eng004",
    title: "Simple Machines",
    summary: "Levers, inclined planes, wheels, pulleys, and mechanical advantage.",
    difficulty: "Easy",
    estimatedMinutes: 25,
    tags: "mechanics|simple-machines|advantage",
    content: `**Simple machines** redirect or multiply force (trade distance for force).

**Types:**
- **Lever** — fulcrum; classes 1–3
- **Inclined plane** — raises load with longer path
- **Wheel and axle** — rotates together
- **Pulley** — changes direction; block and tackle increases mechanical advantage
- **Screw** — inclined plane wrapped around cylinder
- **Wedge** — splits or holds

**Mechanical advantage (ideal)** = output force / input force = distance_in / distance_out (no friction)

**Efficiency** = useful work out / work in × 100% — friction lowers real MA.

**Compound machines** combine simple machines (bicycle, crane).`,
    answerGuide: `Conservation of energy: you never get more work out than in. MA can reduce force but increase distance moved. Real pulleys have bearing friction.`,
    answer: `Students should define mechanical advantage, name four simple machines, explain force–distance tradeoff, and note friction reduces efficiency.`,
  },
  {
    id: "eng005",
    title: "Engineering Drawings and Sketches",
    summary: "Orthographic views, scale, and clear technical communication.",
    difficulty: "Easy",
    estimatedMinutes: 30,
    tags: "drawings|communication|cad-prep",
    content: `Technical drawings communicate **size, shape, and features** unambiguously.

**Orthographic projection:** front, top, side views aligned

**Isometric sketch:** 3D appearance; not true length unless scaled carefully

**Dimensioning:** arrows, extension lines, units, tolerances (±)

**Title block:** part name, scale (1:2), material, date, drafter

**Symbols:** centerlines, hidden lines (dashed), section views cut internals

**CAD (Computer-Aided Design)** tools (Fusion 360, SolidWorks, Onshape) create precise models and drawings.

**Standards:** ASME Y14.5 (GD&T) governs advanced tolerancing — intro awareness only.`,
    answerGuide: `Sketch freehand first in design class. Scale chosen so part fits sheet. Never dimension to hidden lines. CAD parametric models update dimensions.`,
    answer: `Students should explain orthographic vs isometric, read a simple dimension with units, describe title block info, and state why drawings beat photos for manufacturing.`,
  },
  {
    id: "eng006",
    title: "Engineering Materials Overview",
    summary: "Metals, polymers, ceramics, composites, and selecting materials for applications.",
    difficulty: "Easy",
    estimatedMinutes: 30,
    tags: "materials|properties|selection",
    content: `**Material properties** guide selection:

- **Strength** — stress before failure (yield, ultimate)
- **Stiffness** — elastic modulus (resistance to bending)
- **Toughness** — absorb energy without brittle fracture
- **Hardness** — scratch/wear resistance
- **Density** — mass per volume
- **Corrosion resistance**
- **Thermal/electrical conductivity**

**Classes:**
- **Metals/alloys** (steel, aluminum, copper) — strong, conductive
- **Polymers** (PE, ABS, nylon) — light, moldable
- **Ceramics** — hard, heat-resistant, brittle
- **Composites** (carbon fiber epoxy) — high strength-to-weight

**Lifecycle:** mining, processing, use, recycling/disposal — **sustainability** criterion.`,
    answerGuide: `Steel vs aluminum in cars. Thermoplastics vs thermosets. Material property charts (Ashby) optional. Safety factor multiplies loads.`,
    answer: `Students should list five properties, match metal/polymer/composite to typical uses, and explain two selection criteria beyond strength (weight, corrosion).`,
  },
  {
    id: "eng007",
    title: "Workplace and Lab Safety",
    summary: "PPE, hazard identification, and safe tool use in engineering environments.",
    difficulty: "Easy",
    estimatedMinutes: 20,
    tags: "safety|ppe|lab",
    content: `Engineering work includes physical, chemical, and electrical hazards.

**General practices:**
- Risk assessment before starting
- **PPE:** safety glasses, closed-toe shoes, hearing protection, gloves matched to hazard
- Know location of **eyewash/showers**, fire extinguishers, exits

**Shop tools:** Guards stay on; secure workpieces; never bypass interlocks; training before power tools

**Electrical:** De-energize before servicing; lockout/tagout; avoid water near circuits

**Chemical:** Read SDS; never mix unknowns; proper ventilation

**Reporting:** Near-misses and injuries reported to prevent recurrence

**Ethics:** Do not disable safety systems to "save time."`,
    answerGuide: `MSDS/SDS sections: hazards, first aid. Machine shop dress code. Buddy system for heavy lifts. Digital safety: ergonomic breaks.`,
    answer: `Students should list three PPE items and when used, define SDS purpose, and give two shop rules (guards, training) plus one electrical safety rule.`,
  },
  {
    id: "eng008",
    title: "Forces and Free-Body Diagrams",
    summary: "Represent forces on objects and apply equilibrium for static systems.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "statics|forces|diagrams",
    content: `**Force** is a vector (magnitude + direction), unit **newton (N)**.

**Common forces in diagrams:**
- **Weight (W=mg)** downward
- **Normal force (N)** perpendicular to contact surface
- **Friction (f)** parallel to surface; static vs kinetic
- **Tension (T)** along ropes/cables
- **Applied push/pull (F)**

**Free-body diagram (FBD):** Isolate one body; draw arrows for external forces only.

**Static equilibrium (no acceleration):**
- ΣF_x = 0, ΣF_y = 0
- Στ = 0 (torques) for extended bodies

**Moments (torque):** τ = r × F; lever arm perpendicular to force.

**Newton's third law** pairs act on different bodies — not on same FBD.`,
    answerGuide: `Choose coordinate axes wisely. Sign conventions consistent. Distributed loads simplified to equivalent point force for intro.`,
    answer: `Students should draw an FBD for a block on a table with weight and normal force, state equilibrium equations, and define torque with lever arm.`,
  },
  {
    id: "eng009",
    title: "Structures and Loads",
    summary: "Tension, compression, beams, bridges, and why shapes matter.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "structures|civil|loads",
    content: `Structures carry **loads** to supports safely.

**Load types:**
- **Dead load** — permanent weight (structure itself)
- **Live load** — variable (people, vehicles, snow)
- **Environmental** — wind, earthquake, thermal

**Internal forces:**
- **Tension** — stretching (cables, truss members in tension)
- **Compression** — squeezing (columns); slender columns may **buckle**
- **Bending** in beams — compression on one side, tension on other

**Shapes:** I-beams put material far from neutral axis; triangles stable in trusses; arches convert loads to compression.

**Factor of safety (design factor):** design capacity > expected maximum load.

**Materials + geometry** together determine capacity.`,
    answerGuide: `Truss zero-force members optional. Deflection serviceability limit. Famous failures (Tacoma Narrows) discuss resonance/wind.`,
    answer: `Students should define dead vs live load, contrast tension and compression, explain why I-beams are efficient, and define factor of safety.`,
  },
  {
    id: "eng010",
    title: "Basic Electrical Circuits for Engineers",
    summary: "Ohm's law, series/parallel resistors, and power in DC circuits.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "electrical|circuits|ohm",
    content: `**DC circuit analysis** tools:

**Ohm's law:** V = I R

**Series:** I same; V_total = V₁+V₂; R_eq = R₁+R₂

**Parallel:** V same; I_total = I₁+I₂; 1/R_eq = 1/R₁+1/R₂

**Power:** P = V I = I²R = V²/R (watts)

**Kirchhoff's laws (preview):**
- **KCL** — current into junction equals out
- **KVL** — voltage drops around loop sum to zero

**Practical:** LED needs current-limiting resistor; batteries have internal resistance.

**Safety:** Never exceed component ratings; power dissipation heats resistors.`,
    answerGuide: `Multimeter measures V and I. Breadboard prototyping. Short circuit draws excessive current. Color code for resistors optional.`,
    answer: `Students should solve V=IR for one resistor, find equivalent resistance of two series and two parallel resistors, and compute power with P=VI.`,
  },
  {
    id: "eng011",
    title: "Fluid Mechanics Introduction",
    summary: "Pressure, buoyancy, continuity, and Bernoulli idea for moving fluids.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "fluids|pressure|bernoulli",
    content: `**Fluids** include liquids and gases.

**Pressure (P)** = force / area (Pa = N/m²). In static liquid: **P = ρgh** (ρ density, h depth)

**Pascal's principle:** Pressure applied to confined fluid transmits equally — hydraulic lifts.

**Buoyancy:** Upward force equals weight of displaced fluid (**Archimedes**); objects float if average density < fluid.

**Continuity (steady flow):** A₁v₁ = A₂v₂ for incompressible flow in a pipe.

**Bernoulli (ideal, along streamline):** Higher speed ↔ lower pressure — explains lift on airfoils (with viscosity corrections in real wings).

**Viscosity** causes drag in pipes and past objects.`,
    answerGuide: `Gauge vs absolute pressure. Atmospheric pressure ≈ 101 kPa. Cavitation when local pressure drops below vapor pressure. Reynolds number preview.`,
    answer: `Students should define pressure with units, use P=ρgh for depth increase, explain buoyancy, and state continuity equation meaning.`,
  },
  {
    id: "eng012",
    title: "CAD and Parametric Modeling",
    summary: "Constraints, features, assemblies, and exporting for manufacturing.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "cad|modeling|manufacturing",
    content: `**CAD** creates accurate 3D models for design and manufacturing.

**Parametric modeling:**
- **Sketch** 2D profiles with dimensions
- **Constraints** (parallel, perpendicular, equal length) maintain intent when dimensions change
- **Features** extrude, revolve, fillet, hole patterns

**Assemblies** position parts; check **interference** and motion (mates)

**Drawings** auto-generated from model; update when model changes

**Export formats:**
- **STL** for 3D printing (mesh)
- **STEP** for machining/CAM interchange

**Design intent:** Model so changes propagate logically (hole always centered on face).

**Simulation add-ons:** stress analysis (FEA) validates before building.`,
    answerGuide: `Sketch fully constrained before extrude. Version control CAD files. Tolerance stack-up from assemblies. CAM toolpaths from solid models.`,
    answer: `Students should explain sketch→feature workflow, define constraint and parametric change, name STL vs STEP purpose, and describe design intent.`,
  },
  {
    id: "eng013",
    title: "Robotics and Automation",
    summary: "Sensors, actuators, control, and programmable automation in industry.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "robotics|automation|control",
    content: `**Robot** — programmable machine performing physical tasks.

**Components:**
- **Sensors** (encoders, cameras, LIDAR, limit switches) gather state
- **Actuators** (motors, pneumatics, servos) produce motion
- **Controller** (PLC, microcontroller, industrial PC) runs program loop

**Control loop:**
1. Sense
2. Decide (software / logic)
3. Act

**Degrees of freedom** — independent motions (arm joints)

**Industrial automation:** Repetitive assembly, welding, packaging — improves consistency; requires safety guarding (fences, light curtains).

**Collaborative robots (cobots)** work near humans with force limits.

**Ethics/jobs:** Automation shifts skill demands toward maintenance and programming.`,
    answerGuide: `Open-loop vs closed-loop (feedback). PID control preview. G-code for 3D printers related. Safety standards ISO 10218 mention.`,
    answer: `Students should list sensor, actuator, controller roles, describe sense-decide-act loop, and give one factory automation benefit and one safety measure.`,
  },
  {
    id: "eng014",
    title: "Renewable Energy Systems",
    summary: "Solar, wind, hydro, and grid integration at an introductory level.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "energy|renewable|sustainability",
    content: `**Renewable energy** comes from replenished natural flows.

**Solar photovoltaic:** Cells convert sunlight to DC electricity; **inverter** to AC; output depends on irradiance, panel area, efficiency (typical modules ~15–22%).

**Wind:** Turbines extract kinetic energy; power rises with wind speed (cube relationship in ideal range); site dependent.

**Hydropower:** Gravitational potential of water drives turbines — reliable where geography allows.

**Geothermal / biomass** fill regional niches.

**Grid challenges:** Intermittency — storage (batteries), demand response, transmission upgrades.

**Life-cycle:** Manufacturing and disposal have impacts — systems thinking required.

**Efficiency vs conservation:** Reduce demand AND improve supply.`,
    answerGuide: `Capacity factor differs from peak rating. Net metering policies vary. Carbon intensity of grid affects electric vehicle benefits.`,
    answer: `Students should describe solar and wind energy conversion, explain intermittency, and name two grid integration strategies (storage, transmission).`,
  },
  {
    id: "eng015",
    title: "Quality Control and Testing",
    summary: "Specifications, inspection, statistical sampling, and continuous improvement.",
    difficulty: "Medium",
    estimatedMinutes: 30,
    tags: "quality|testing|manufacturing",
    content: `**Quality control (QC)** ensures products meet **specifications**.

**Specification** — measurable tolerances (shaft diameter 20.0 ± 0.1 mm)

**Inspection tools:** calipers, micrometers, CMM (coordinate measuring machine), go/no-go gauges

**Destructive vs non-destructive testing (NDT):** ultrasound, X-ray for internal flaws without breaking part

**Sampling:** Test subset of batch (AQL concepts at intro) — balance cost vs risk

**Process control charts** track measurements over time; detect drift before scrap

**Continuous improvement (Kaizen, Six Sigma overview):** Reduce variation, root-cause analysis (5 Whys), corrective actions

**Reliability testing:** accelerated life tests for electronics`,
    answerGuide: `ISO 9001 quality management system. Defect vs defectives. Poka-yoke (mistake-proofing) examples. Feedback loop to design.`,
    answer: `Students should define specification and tolerance, contrast destructive vs NDT, explain why sampling is used, and describe a control chart purpose.`,
  },
  {
    id: "eng016",
    title: "Stress, Strain, and Elastic Modulus",
    summary: "Normal stress and strain, Hooke's law, and material stiffness.",
    difficulty: "Hard",
    estimatedMinutes: 40,
    tags: "mechanics|materials|stress",
    content: `**Normal stress (σ)** = force / area (Pa or MPa) — tension (+) or compression (−) by convention.

**Normal strain (ε)** = change in length / original length (dimensionless)

**Hooke's law (elastic region):** σ = E ε  
**E** = **Young's modulus** (stiffness of material)

**Stress–strain curve:** elastic region → yield point → plastic deformation → ultimate strength → fracture

**Safety factor:** allowable stress = yield strength / SF

**Poisson's ratio (ν):** lateral strain / axial strain (steel ~0.3)

**Shear stress (τ)** and **shear modulus (G)** for torsion and shear loads (intro mention).`,
    answerGuide: `Units: MPa common in US texts. Brittle vs ductile materials. Concentration at holes — stress risers. Elastic vs plastic permanent deformation.`,
    answer: `Students should define stress and strain with formulas, state Hooke's law, identify elastic vs plastic regions on a curve, and explain safety factor.`,
  },
  {
    id: "eng017",
    title: "Feedback Control Systems",
    summary: "Open vs closed loop, setpoints, sensors, and PID control intuition.",
    difficulty: "Hard",
    estimatedMinutes: 45,
    tags: "control|feedback|systems",
    content: `**Control systems** regulate outputs (temperature, speed, position).

**Open-loop:** No measurement of output — toaster timer (approximate)

**Closed-loop (feedback):** Sensor measures output; controller adjusts input to reduce **error** = setpoint − measured

**Block diagram:** setpoint → controller → plant → output → sensor → back

**PID controller components:**
- **P** proportional to current error
- **I** integral of error (removes steady-state offset)
- **D** derivative (dampens oscillations)

**Stability:** Poor tuning causes oscillation or slow response.

**Examples:** Thermostat, cruise control, drone attitude control, industrial oven zones.`,
    answerGuide: `Overshoot vs rise time tradeoff. Ziegler-Nichols tuning mention optional. Digital sampling and delay affect stability.`,
    answer: `Students should contrast open vs closed loop with examples, define setpoint and error, and describe roles of P, I, D qualitatively.`,
  },
  {
    id: "eng018",
    title: "Thermodynamics for Engineers",
    summary: "Laws of thermodynamics, heat engines, and efficiency limits.",
    difficulty: "Hard",
    estimatedMinutes: 45,
    tags: "thermodynamics|energy|engines",
    content: `**Thermodynamics** governs energy conversion in engines and power plants.

**First law:** Energy conserved — ΔU = Q − W (closed system)

**Second law:** Natural processes increase total entropy; heat flows spontaneously hot → cold

**Heat engine:** Converts heat Q_h from hot reservoir to work W, rejects Q_c to cold reservoir  
**Thermal efficiency η = W / Q_h = 1 − Q_c/Q_h

**Carnot maximum efficiency:** η_Carnot = 1 − T_c/T_h (temperatures in **kelvin**)

**Refrigerator/heat pump:** Moves heat from cold to hot with work input; COP measures performance

**Entropy** quantifies dispersal of energy — real processes are **irreversible** (friction, mixing)

**Power generation:** Steam cycles, gas turbines, combined cycle improve overall efficiency`,
    answerGuide: `Kelvin scale required for Carnot formula. Perpetual motion machines impossible. Entropy production in real components. Enthalpy for flow systems advanced.`,
    answer: `Students should state first and second laws, define heat engine efficiency, write Carnot efficiency formula with kelvin temps, and explain why 100% efficiency is impossible.`,
  },
  {
    id: "eng019",
    title: "Systems Engineering",
    summary: "Holistic design of complex systems with requirements, interfaces, and trade studies.",
    difficulty: "Hard",
    estimatedMinutes: 40,
    tags: "systems|requirements|integration",
    content: `**Systems engineering** coordinates large interdisciplinary projects (aircraft, satellites, transportation networks).

**Key activities:**
- **Stakeholder requirements** → verified **system requirements**
- **Architecture** — partition into subsystems with clear **interfaces**
- **Trade studies** — score alternatives against weighted criteria (cost, risk, performance)
- **Verification & validation (V&V):** built right vs right thing
- **Risk management** — identify, mitigate, monitor

**Lifecycle:** concept → development → production → operations → retirement

**Emergent behavior:** Whole system properties not obvious from parts alone (reliability, latency)

**Model-Based Systems Engineering (MBSE)** uses diagrams/models to track requirements and interfaces.`,
    answerGuide: `INCOSE handbook reference optional. Interface control documents (ICD). Human factors in systems. Examples: Apollo, GPS constellation.`,
    answer: `Students should define system requirements and interface, explain trade study purpose, contrast verification vs validation, and give one emergent property example.`,
  },
  {
    id: "eng020",
    title: "Engineering Economics and Decisions",
    summary: "Cost estimates, benefit-cost thinking, and choosing between design options.",
    difficulty: "Hard",
    estimatedMinutes: 35,
    tags: "economics|decisions|project",
    content: `Engineering decisions include **economic** factors, not only technical performance.

**Cost categories:**
- **Capital (CAPEX)** — initial purchase/construction
- **Operating (OPEX)** — energy, maintenance, labor

**Life-cycle cost (LCC)** sums costs over service life (with discounting in advanced courses).

**Benefit-cost analysis** compares monetized benefits to costs for public projects (safety time savings, reduced emissions).

**Payback period** — time for savings to recover extra upfront cost (simple, ignores time value of money).

**Decision matrix:** Weight criteria (performance, cost, risk, sustainability); score options objectively.

**Uncertainty:** Sensitivity analysis shows how conclusions change if assumptions shift.

**Ethics:** Lowest bid not always best value if quality/safety suffers.`,
    answerGuide: `Present value introduces discount rate r. Depreciation tax effects for firms. Risk premium for innovative tech. Triple bottom line: people, planet, profit.`,
    answer: `Students should distinguish CAPEX and OPEX, define life-cycle cost concept, use a weighted decision matrix example, and explain payback period limitation.`,
  },
];
