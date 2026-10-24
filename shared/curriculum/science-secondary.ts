import { type CourseSpec, mc, num, short, tf } from "./dsl";

const NGSS = "Next Generation Science Standards";

export const scienceSecondary: CourseSpec[] = [
  {
    id: "sci-6",
    title: "Grade 6 Earth & Space Science",
    subject: "science",
    grade: 6,
    framework: NGSS,
    description: "The Earth–sun–moon system, seasons, plate tectonics, and the rock cycle.",
    units: [
      {
        title: "Earth in Space",
        description: "Model the Earth–sun–moon system to explain lunar phases, eclipses, and seasons.",
        lessons: [
          {
            title: "Moon Phases and Eclipses",
            summary: "The moon's phases come from how much of its lit half we see; eclipses happen when shadows line up.",
            objectives: ["Explain the cause of lunar phases", "Distinguish solar and lunar eclipses using a model"],
            vocab: [["lunar phase", "the shape of the lit part of the moon seen from Earth"], ["waxing", "the lit part we see is growing"], ["waning", "the lit part we see is shrinking"], ["eclipse", "when one body moves into the shadow of another"]],
            standards: ["MS-ESS1-1"],
            body: `
The moon makes no light of its own. The sun **always lights half** of the moon. As the moon orbits Earth (about every **29.5 days**), we see different amounts of that lit half.

**Phase sequence:** new moon → waxing crescent → first quarter → waxing gibbous → **full moon** → waning gibbous → third quarter → waning crescent → new moon

- **New moon:** the moon is between Earth and the sun; the lit side faces away from us.
- **Full moon:** Earth is between the sun and moon; we see the whole lit side.

**Common misconception:** phases are **not** caused by Earth's shadow.

**Eclipses**
- **Solar eclipse:** the moon passes between the sun and Earth, casting its shadow on Earth. Can only happen at **new moon**.
- **Lunar eclipse:** Earth passes between the sun and moon, and Earth's shadow falls on the moon. Can only happen at **full moon**.

Eclipses don't happen every month because the moon's orbit is tilted about 5° relative to Earth's orbit.`,
            questions: [
              mc("What causes the phases of the moon?", "How much of the moon's sunlit half we can see from Earth", ["Earth's shadow covering the moon", "Clouds blocking the moon", "The moon changing size"], "Half the moon is always lit; our viewing angle changes as it orbits."),
              mc("A solar eclipse can only happen during which phase?", "New moon", ["Full moon", "First quarter", "Waning gibbous"], "The moon must be between the sun and Earth."),
              num("About how many days does it take to go from one full moon to the next?", 29.5, "The lunar (synodic) month is about 29.5 days.", { tolerance: 0.6 }),
              tf("There is a lunar eclipse every full moon.", false, "The moon's tilted orbit usually carries it above or below Earth's shadow."),
            ],
          },
          {
            title: "The Reason for the Seasons",
            summary: "Seasons are caused by Earth's 23.5° tilt, not by distance from the sun.",
            objectives: ["Explain how Earth's axial tilt causes seasons", "Relate the angle of sunlight to the amount of energy received"],
            vocab: [["axis", "the imaginary line Earth spins around"], ["solstice", "the day with the longest or shortest daylight"], ["equinox", "a day with about equal day and night everywhere"]],
            standards: ["MS-ESS1-1"],
            body: `
Earth's axis is **tilted about 23.5°**, and it stays pointed the same direction in space as Earth orbits the sun.

**When the Northern Hemisphere tilts toward the sun (June):**
- Sunlight hits more **directly** (higher angle), concentrating energy on a smaller area.
- Days are **longer**, so there's more time to heat up.
→ **Summer** in the north, **winter** in the south.

Six months later (December), the north tilts away → winter in the north, summer in the south.

**Misconception:** Seasons are **not** caused by being closer to the sun. Earth is actually **closest** to the sun in early **January**, which is winter in the Northern Hemisphere!

**Key dates (Northern Hemisphere)**
| Date | Event |
|---|---|
| ~June 21 | Summer solstice (longest day) |
| ~Sept 22 | Autumn equinox |
| ~Dec 21 | Winter solstice (shortest day) |
| ~Mar 20 | Spring equinox |`,
            questions: [
              mc("What causes Earth's seasons?", "The tilt of Earth's axis", ["Earth's changing distance from the sun", "The moon's gravity", "Changes in the sun's brightness"], "The 23.5° tilt changes the angle and duration of sunlight."),
              num("By about how many degrees is Earth's axis tilted?", 23.5, "Earth's axial tilt is about 23.5°.", { tolerance: 0.6 }),
              mc("When it is summer in the Northern Hemisphere, it is ___ in the Southern Hemisphere.", "winter", ["summer", "spring", "autumn"], "The hemispheres tilt opposite ways relative to the sun."),
              tf("Earth is closest to the sun during Northern Hemisphere summer.", false, "Earth is closest in early January."),
            ],
          },
        ],
      },
      {
        title: "Earth's Systems",
        description: "Use evidence to explain plate tectonics and the cycling of Earth's materials.",
        lessons: [
          {
            title: "Plate Tectonics",
            summary: "Earth's lithosphere is broken into moving plates; their boundaries create mountains, earthquakes, and volcanoes.",
            objectives: ["Analyze evidence for plate motion", "Describe what happens at divergent, convergent, and transform boundaries"],
            vocab: [["lithosphere", "Earth's rigid outer layer, broken into plates"], ["divergent boundary", "plates move apart"], ["convergent boundary", "plates move together"], ["transform boundary", "plates slide past each other"]],
            standards: ["MS-ESS2-3", "MS-ESS2-2"],
            body: `
Earth's outer shell, the **lithosphere**, is broken into large **tectonic plates** that move a few centimeters per year, about as fast as your fingernails grow.

**Evidence plates move**
- **Fossils:** the same reptile fossils (Mesosaurus) appear in both South America and Africa.
- **Fitting coastlines:** South America and Africa fit like puzzle pieces.
- **Rock layers and mountain belts** match across oceans.
- **Seafloor ages:** rock is youngest at mid-ocean ridges and older farther away.

**Plate boundaries**
| Boundary | Motion | Features |
|---|---|---|
| Divergent | apart | mid-ocean ridges, rift valleys |
| Convergent | together | mountains (Himalayas), trenches, volcanoes |
| Transform | sliding past | earthquakes (San Andreas Fault) |

**What drives the plates?** Heat from Earth's interior creates slow **convection currents** in the mantle.`,
            questions: [
              mc("At which boundary do plates slide past each other?", "Transform", ["Divergent", "Convergent", "Subduction"], "The San Andreas Fault is a transform boundary."),
              mc("The Himalayas formed at which kind of boundary?", "Convergent", ["Divergent", "Transform"], "The Indian and Eurasian plates collided."),
              mc("Seafloor rock is youngest…", "at mid-ocean ridges", ["near continents", "in the deepest trenches", "everywhere equally"], "New crust forms where plates pull apart at ridges."),
              tf("Matching fossils on continents separated by oceans are evidence of plate movement.", true, "The continents were once joined."),
            ],
          },
          {
            title: "The Rock Cycle",
            summary: "Igneous, sedimentary, and metamorphic rocks transform into one another, driven by Earth's internal heat and the sun.",
            objectives: ["Classify rocks as igneous, sedimentary, or metamorphic by how they form", "Model the processes that move rock through the cycle"],
            vocab: [["igneous", "rock formed from cooled magma or lava"], ["sedimentary", "rock formed from compacted and cemented sediment"], ["metamorphic", "rock changed by heat and pressure"]],
            standards: ["MS-ESS2-1"],
            body: `
Rocks are constantly recycled.

**Three rock types**
- **Igneous:** forms when **magma or lava cools**. Fast cooling (lava at the surface) → small crystals (basalt, obsidian). Slow cooling underground → large crystals (granite).
- **Sedimentary:** forms when **sediments** (bits of rock, shells) are deposited in layers, **compacted**, and **cemented**. Often contains fossils (sandstone, limestone, shale).
- **Metamorphic:** forms when existing rock is changed by **heat and pressure** without melting (marble from limestone, slate from shale).

**Processes**
- weathering & erosion → sediments
- compaction & cementation → sedimentary rock
- heat & pressure → metamorphic rock
- melting → magma → cooling → igneous rock

**Energy sources:** the **sun** drives weathering and erosion (through water and wind); Earth's **internal heat** drives melting and metamorphism.`,
            questions: [
              mc("Granite has large crystals. How did it most likely form?", "Magma cooled slowly underground", ["Lava cooled quickly at the surface", "Sediments were cemented together", "Heat and pressure changed limestone"], "Slow cooling gives crystals time to grow."),
              mc("Which rock type most often contains fossils?", "Sedimentary", ["Igneous", "Metamorphic"], "Organisms get buried in layers of sediment."),
              mc("Marble forms when limestone is exposed to…", "heat and pressure", ["rapid cooling", "weathering", "evaporation"], "Marble is a metamorphic rock."),
              tf("Any type of rock can become any other type over time.", true, "That's the rock cycle."),
            ],
            writtenPrompt: "Trace one possible path for a grain of sand that starts in a granite mountain and ends up as part of a metamorphic rock. Name each process.",
            rubric: "Granite (igneous) is weathered into sediment; erosion carries the sand; deposition in layers; compaction and cementation form sandstone (sedimentary); burial with heat and pressure turns it into quartzite (metamorphic). Names at least four processes in a logical order.",
          },
        ],
      },
    ],
  },
  {
    id: "sci-7",
    title: "Grade 7 Life Science",
    subject: "science",
    grade: 7,
    framework: NGSS,
    description: "Cells and body systems, photosynthesis and cellular respiration, and energy flow in ecosystems.",
    units: [
      {
        title: "Cells and Body Systems",
        description: "Investigate cells as the basic unit of life and how cells form tissues, organs, and systems.",
        lessons: [
          {
            title: "Cells: The Building Blocks of Life",
            summary: "All living things are made of cells, and organelles each do a job.",
            objectives: ["State the three parts of the cell theory", "Describe the functions of major organelles", "Compare plant and animal cells"],
            vocab: [["cell", "the smallest unit of life"], ["organelle", "a structure inside a cell with a specific job"], ["nucleus", "contains DNA and controls cell activities"], ["mitochondria", "release energy from food through cellular respiration"]],
            standards: ["MS-LS1-1", "MS-LS1-2"],
            body: `
**Cell theory**
1. All living things are made of one or more **cells**.
2. The cell is the basic unit of **structure and function** in living things.
3. All cells come from **existing cells**.

**Organelles and their jobs**
| Organelle | Function |
|---|---|
| Cell membrane | controls what enters and leaves the cell |
| Nucleus | holds DNA; directs cell activities |
| Cytoplasm | gel that holds organelles |
| Mitochondria | release energy from sugar (cellular respiration) |
| Ribosomes | build proteins |
| Vacuole | stores water and materials |
| **Cell wall** (plants) | rigid support and protection |
| **Chloroplasts** (plants) | capture sunlight to make sugar (photosynthesis) |

**Plant vs. animal cells:** both have a membrane, nucleus, cytoplasm, mitochondria, and ribosomes. **Only plant cells** have a cell wall, chloroplasts, and a large central vacuole.

**Unicellular vs. multicellular:** bacteria are a single cell; you are made of about **30 trillion** cells.`,
            questions: [
              mc("Which organelle releases energy from food?", "Mitochondria", ["Nucleus", "Cell wall", "Ribosome"], "Mitochondria carry out cellular respiration."),
              mc("Which structure is found in plant cells but NOT animal cells?", "Chloroplast", ["Mitochondria", "Nucleus", "Cell membrane"], "Chloroplasts capture light energy for photosynthesis."),
              tf("According to cell theory, cells can arise from nonliving matter.", false, "All cells come from existing cells."),
              short("Which organelle contains the cell's DNA?", ["nucleus", "the nucleus"], "The nucleus holds DNA and directs the cell's activities."),
            ],
          },
          {
            title: "Levels of Organization and Body Systems",
            summary: "Cells form tissues, tissues form organs, and organs work together in systems.",
            objectives: ["Order the levels of organization from cell to organism", "Explain how body systems interact to keep an organism alive"],
            vocab: [["tissue", "a group of similar cells doing the same job"], ["organ", "a structure made of different tissues working together"], ["organ system", "organs that work together for a major function"], ["homeostasis", "keeping stable internal conditions"]],
            standards: ["MS-LS1-3", "MS-LS1-8"],
            body: `
**Levels of organization**
**cell → tissue → organ → organ system → organism**

Example: muscle cell → muscle tissue → heart → circulatory system → you

**Major body systems**
- **Circulatory:** heart and blood vessels deliver oxygen and nutrients
- **Respiratory:** lungs take in oxygen and remove carbon dioxide
- **Digestive:** breaks food into nutrients
- **Nervous:** brain, spinal cord, and nerves send signals
- **Muscular & skeletal:** support and movement

**Systems work together.** When you run:
- Muscles need more energy → cells need more **oxygen and glucose**.
- The **respiratory** system breathes faster to bring in oxygen.
- The **circulatory** system pumps faster to deliver it.
- The **nervous** system coordinates it all.

This teamwork maintains **homeostasis**: stable conditions like body temperature (~37 °C).`,
            questions: [
              mc("Which list is in order from simplest to most complex?", "cell → tissue → organ → organ system", ["tissue → cell → organ → organ system", "organ → tissue → cell → organism", "cell → organ → tissue → organism"], "Cells build tissues, which build organs, which form systems."),
              mc("Which system delivers oxygen to cells?", "Circulatory", ["Digestive", "Skeletal", "Nervous"], "Blood carries oxygen from the lungs to cells."),
              tf("During exercise, the respiratory and circulatory systems both speed up.", true, "They work together to deliver more oxygen to muscles."),
              mc("The heart is an example of a(n)…", "organ", ["cell", "tissue", "organ system"], "It's made of several tissue types working together."),
            ],
            writtenPrompt: "Explain how at least three body systems work together when you eat a meal and then go for a run.",
            rubric: "Digestive system breaks food into nutrients (glucose). Circulatory system carries nutrients and oxygen to cells. Respiratory system brings in oxygen and removes CO₂. Muscular/nervous systems use the energy and coordinate movement. Mentions cells using oxygen and glucose for energy.",
          },
        ],
      },
      {
        title: "Energy in Living Systems",
        description: "Trace matter and energy through photosynthesis, respiration, and ecosystems.",
        lessons: [
          {
            title: "Photosynthesis and Cellular Respiration",
            summary: "Plants store the sun's energy in sugar; nearly all organisms release it through respiration.",
            objectives: ["Write the word equations for photosynthesis and cellular respiration", "Explain how the two processes are connected"],
            vocab: [["photosynthesis", "using light energy to make glucose from CO₂ and water"], ["cellular respiration", "releasing energy from glucose using oxygen"], ["glucose", "a sugar that stores chemical energy"]],
            standards: ["MS-LS1-6", "MS-LS1-7"],
            body: `
**Photosynthesis** (in chloroplasts of plants and algae)
**carbon dioxide + water + light energy → glucose + oxygen**
6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂

**Cellular respiration** (in mitochondria of plants AND animals)
**glucose + oxygen → carbon dioxide + water + energy (ATP)**

**They're mirror images.**
- Photosynthesis **stores** energy in glucose; respiration **releases** it.
- The products of one are the reactants of the other.

**Common misconceptions**
- *"Plants don't do respiration."* They do! Plants respire all the time, day and night.
- *"Plants get food from soil."* Plants make their food. Soil provides water and minerals, not most of their mass.

**Matter is conserved:** the carbon atoms in your muscles were once CO₂ in the air, captured by a plant.`,
            questions: [
              mc("What are the products of photosynthesis?", "Glucose and oxygen", ["Carbon dioxide and water", "Oxygen and water", "Glucose and carbon dioxide"], "CO₂ + H₂O + light → glucose + O₂."),
              mc("Where does cellular respiration take place?", "Mitochondria", ["Chloroplasts", "Cell wall", "Vacuole"], "Mitochondria release energy from glucose."),
              tf("Plants carry out cellular respiration.", true, "Plants need energy too, so they respire in their mitochondria."),
              mc("Which gas do plants take in for photosynthesis?", "Carbon dioxide", ["Oxygen", "Nitrogen", "Helium"], "CO₂ provides the carbon to build glucose."),
            ],
            writtenPrompt: "A student says, 'Plants make oxygen and animals use it, so plants don't need oxygen.' Do you agree? Use what you know about photosynthesis and respiration to explain.",
            rubric: "Disagrees. Explains that plants also perform cellular respiration in mitochondria, which uses oxygen and glucose to release energy. Notes photosynthesis produces more oxygen than plants use, so there is a net release during daylight. Uses correct reactants and products.",
          },
          {
            title: "Energy Flow in Ecosystems",
            summary: "Energy flows one way through food webs while matter cycles; only about 10% of energy passes to the next level.",
            objectives: ["Model energy flow through trophic levels", "Apply the 10% rule", "Explain how matter cycles in ecosystems"],
            vocab: [["trophic level", "a feeding level in a food chain"], ["energy pyramid", "a model showing energy decreasing at each level"], ["10% rule", "about 10% of energy passes to the next trophic level"]],
            standards: ["MS-LS2-3", "MS-LS2-1"],
            body: `
**Trophic levels**
1. **Producers** (plants)
2. **Primary consumers** (herbivores)
3. **Secondary consumers** (carnivores that eat herbivores)
4. **Tertiary consumers** (top predators)

**The 10% rule:** only about **10%** of the energy at one level is passed to the next. The rest is used for life processes or lost as **heat**.

If grass captures 10,000 kJ: grasshoppers get ~1,000 kJ → frogs ~100 kJ → snakes ~10 kJ

That's why food chains rarely have more than 4–5 levels, and why there are far fewer hawks than mice.

**Energy flows; matter cycles.** Energy enters as sunlight and leaves as heat: a one-way trip. But atoms (carbon, nitrogen) are reused over and over as decomposers return them to the soil and air.

**Populations and resources:** when resources are limited, populations compete. If a predator disappears, its prey population may boom and then crash after overeating its food.`,
            questions: [
              num("Producers in an ecosystem contain 50,000 kJ of energy. About how much reaches primary consumers (kJ)?", 5000, "About 10% passes up: 50,000 × 0.10 = 5,000 kJ."),
              mc("Where does most of the energy at each trophic level go?", "Used for life processes and lost as heat", ["Passed to the next level", "Stored in the soil", "Turned into sunlight"], "Only about 10% is passed on."),
              tf("Matter cycles in an ecosystem, but energy flows in one direction.", true, "Atoms are reused; energy eventually leaves as heat."),
              mc("Why are there fewer top predators than herbivores?", "Less energy is available at higher trophic levels", ["Predators are slower", "Herbivores are bigger", "Predators don't need energy"], "Each level has about 10% of the energy of the one below."),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "sci-8",
    title: "Grade 8 Physical Science",
    subject: "science",
    grade: 8,
    framework: NGSS,
    description: "Atoms and chemical reactions, conservation of mass, Newton's laws, and kinetic and potential energy.",
    units: [
      {
        title: "Matter and Chemical Reactions",
        description: "Model atoms and molecules and analyze chemical reactions.",
        lessons: [
          {
            title: "Atoms, Elements, and Molecules",
            summary: "All matter is made of atoms; elements combine to form molecules and compounds.",
            objectives: ["Describe the parts of an atom", "Distinguish elements, molecules, and compounds", "Read basic information from the periodic table"],
            vocab: [["atom", "the smallest particle of an element"], ["element", "a pure substance made of one kind of atom"], ["compound", "two or more elements chemically bonded"], ["molecule", "two or more atoms bonded together"]],
            standards: ["MS-PS1-1"],
            body: `
**Atoms** are the building blocks of matter.

| Particle | Charge | Location |
|---|---|---|
| Proton | + | nucleus |
| Neutron | 0 | nucleus |
| Electron | − | around the nucleus |

The number of **protons** (the **atomic number**) identifies the element. Every carbon atom has 6 protons.

**Elements** contain only one kind of atom: oxygen (O), iron (Fe), gold (Au). About 118 are known and listed on the **periodic table**.

**Molecules** are atoms bonded together: O₂ (two oxygen atoms), H₂O (two hydrogen, one oxygen).

**Compounds** are molecules with **different** elements. Water (H₂O) and carbon dioxide (CO₂) are compounds; O₂ is a molecule but not a compound.

**Reading a formula:** in C₆H₁₂O₆ (glucose), there are 6 carbon, 12 hydrogen, and 6 oxygen atoms. **24 atoms** in all.`,
            questions: [
              mc("Which particle determines what element an atom is?", "Proton", ["Neutron", "Electron", "Nucleus"], "The atomic number is the number of protons."),
              num("How many atoms are in one molecule of CO₂?", 3, "1 carbon + 2 oxygen = 3 atoms."),
              mc("Which is a compound?", "H₂O", ["O₂", "Fe", "N₂"], "Water contains two different elements."),
              mc("Electrons have what charge?", "Negative", ["Positive", "Neutral"], "Electrons are negatively charged."),
            ],
          },
          {
            title: "Chemical Reactions and Conservation of Mass",
            summary: "In a chemical reaction atoms rearrange into new substances, but no atoms are created or destroyed.",
            objectives: ["Identify evidence of a chemical reaction", "Explain conservation of mass using atoms", "Balance simple chemical equations"],
            vocab: [["reactants", "substances that go into a reaction"], ["products", "new substances formed in a reaction"], ["conservation of mass", "total mass of reactants equals total mass of products"]],
            standards: ["MS-PS1-2", "MS-PS1-5"],
            body: `
In a **chemical reaction**, atoms are **rearranged** to form new substances with **new properties**.

**Evidence of a chemical change**
- gas produced (bubbles)
- color change
- temperature change (heat or cold released)
- precipitate (a solid forms from liquids)
- light given off

**Reactants → Products**
2H₂ + O₂ → 2H₂O

**Conservation of mass:** atoms aren't created or destroyed, so the **mass of the reactants equals the mass of the products**.
- Left side: 4 H and 2 O
- Right side: 4 H and 2 O ✔

**Balancing:** change the **coefficients** (big numbers in front), never the subscripts.
CH₄ + 2O₂ → CO₂ + 2H₂O
C: 1 = 1, H: 4 = 4, O: 4 = 4 ✔

**Open systems:** if a gas escapes, it can *look* like mass was lost, but it just left the container.`,
            questions: [
              mc("Which is evidence of a chemical change?", "Bubbles form when two liquids mix", ["Ice melts", "Paper is cut", "Water boils"], "Gas production signals new substances forming."),
              num("If 12 g of reactants react completely in a sealed container, what is the mass of the products in grams?", 12, "Mass is conserved."),
              mc("Balance: __H₂ + O₂ → 2H₂O. What coefficient goes in front of H₂?", "2", ["1", "3", "4"], "2H₂ gives 4 H atoms, matching 2H₂O."),
              tf("When balancing equations, you can change subscripts.", false, "Changing subscripts changes the substance. Change only coefficients."),
            ],
          },
        ],
      },
      {
        title: "Forces and Energy",
        description: "Apply Newton's laws and analyze kinetic and potential energy.",
        lessons: [
          {
            title: "Newton's Laws of Motion",
            summary: "Inertia, F = ma, and action–reaction pairs explain how forces change motion.",
            objectives: ["State and apply Newton's three laws", "Use F = ma to calculate force, mass, or acceleration"],
            vocab: [["inertia", "an object's resistance to changes in motion"], ["acceleration", "change in velocity over time"], ["newton (N)", "the unit of force: 1 kg·m/s²"]],
            standards: ["MS-PS2-1", "MS-PS2-2"],
            body: `
**First law (inertia):** An object at rest stays at rest, and an object in motion stays in motion at the same speed and direction, **unless an unbalanced force acts on it**.
*Example:* passengers lurch forward when a car brakes suddenly.

**Second law: F = m × a**
- More force → more acceleration
- More mass → less acceleration (for the same force)
*Example:* pushing a 2 kg cart with 10 N → a = F/m = 10/2 = **5 m/s²**

**Third law (action–reaction):** For every action force there is an **equal and opposite** reaction force.
*Example:* a rocket pushes gas down; the gas pushes the rocket up. When you push a wall, the wall pushes back on you.

**Important:** action–reaction forces act on **different objects**, so they don't cancel each other out.`,
            questions: [
              num("What force is needed to accelerate a 4 kg object at 3 m/s²? (newtons)", 12, "F = ma = 4 × 3 = 12 N."),
              num("A 20 N force acts on a 5 kg object. What is its acceleration in m/s²?", 4, "a = F/m = 20/5 = 4 m/s²."),
              mc("A passenger keeps moving forward when a bus stops suddenly. Which law explains this?", "First law (inertia)", ["Second law", "Third law"], "The passenger's body tends to keep moving."),
              mc("When you jump, Earth pushes you up. This is an example of…", "Newton's third law", ["Newton's first law", "Newton's second law", "conservation of mass"], "You push down on Earth; Earth pushes up on you."),
            ],
          },
          {
            title: "Kinetic and Potential Energy",
            summary: "Kinetic energy depends on mass and speed; potential energy depends on position. Energy transforms but is conserved.",
            objectives: ["Describe how kinetic energy depends on mass and speed", "Explain energy transformations between potential and kinetic energy"],
            vocab: [["kinetic energy", "energy of motion: KE = ½mv²"], ["gravitational potential energy", "stored energy due to height: PE = mgh"], ["conservation of energy", "energy is not created or destroyed, only transformed"]],
            standards: ["MS-PS3-1", "MS-PS3-2", "MS-PS3-5"],
            body: `
**Kinetic energy (KE)** is the energy of motion: **KE = ½ m v²**
- Double the **mass** → double the KE.
- Double the **speed** → **four times** the KE (because speed is squared).
That's why speed matters so much in car crashes.

**Gravitational potential energy (PE)** is stored energy due to height: **PE = m g h** (g ≈ 9.8 m/s² on Earth)
A 2 kg book on a 1.5 m shelf: PE = 2 × 9.8 × 1.5 ≈ **29.4 J**

**Energy transformations on a roller coaster**
- Top of the first hill: maximum PE, little KE
- Bottom: PE has become KE → fastest speed
- Climbing again: KE turns back into PE

**Conservation of energy:** total energy stays the same. Some is converted to heat and sound by friction, which is why the coaster can't climb higher than its first hill.`,
            questions: [
              mc("If a car's speed doubles, its kinetic energy…", "becomes four times as large", ["doubles", "stays the same", "is cut in half"], "KE depends on v², and 2² = 4."),
              num("What is the kinetic energy of a 2 kg ball moving at 3 m/s? (joules)", 9, "KE = ½ × 2 × 3² = 9 J."),
              mc("At what point does a roller coaster have the most kinetic energy?", "At the bottom of the biggest drop", ["At the top of the first hill", "While stopped at the station", "Halfway up a hill"], "Potential energy has been converted to kinetic energy."),
              tf("Friction destroys energy.", false, "Friction transforms kinetic energy into heat and sound; total energy is conserved."),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "biology",
    title: "Biology",
    subject: "science",
    grade: 9,
    framework: NGSS,
    description: "DNA and protein synthesis, the cell cycle, Mendelian genetics, and evolution by natural selection.",
    units: [
      {
        title: "From Molecules to Organisms",
        description: "Explain how DNA codes for proteins and how cells divide.",
        lessons: [
          {
            title: "DNA and Protein Synthesis",
            summary: "DNA's base sequence is transcribed into mRNA and translated into proteins.",
            objectives: ["Describe the structure of DNA", "Explain transcription and translation", "Use a codon chart to translate mRNA"],
            vocab: [["nucleotide", "a DNA/RNA building block: sugar, phosphate, and base"], ["transcription", "copying DNA into mRNA in the nucleus"], ["translation", "building a protein from mRNA at a ribosome"], ["codon", "a three-base mRNA sequence that codes for one amino acid"]],
            standards: ["HS-LS1-1", "HS-LS3-1"],
            body: `
**DNA structure:** a double helix of nucleotides. The bases pair up:
**A–T** and **C–G** (in RNA, **U** replaces T, so A–U).

**Central dogma:** DNA → RNA → protein

**1. Transcription** (nucleus): an enzyme reads a gene and builds a complementary **mRNA** strand.
DNA template: **TAC GGA CTT** → mRNA: **AUG CCU GAA**

**2. Translation** (ribosome): the ribosome reads mRNA three bases at a time (**codons**). tRNA molecules bring the matching **amino acids**.
AUG → methionine (start), CCU → proline, GAA → glutamic acid

The chain of amino acids folds into a **protein** that does a job: enzymes, hormones, structural proteins like keratin.

**Mutations:** a change in the DNA sequence can change the protein. In sickle-cell disease, a single base change swaps one amino acid in hemoglobin.`,
            questions: [
              mc("In DNA, adenine (A) pairs with…", "thymine (T)", ["cytosine (C)", "guanine (G)", "uracil (U)"], "A–T and C–G."),
              short("What is the mRNA complement of the DNA template strand ATG?", ["UAC"], "A→U, T→A, G→C, so ATG → UAC."),
              mc("Where does translation occur?", "At the ribosome", ["In the nucleus", "In the mitochondria", "In the cell membrane"], "Ribosomes read mRNA and build proteins."),
              num("How many bases make up one codon?", 3, "Each codon is three nucleotides long."),
            ],
          },
          {
            title: "The Cell Cycle and Mitosis",
            summary: "Cells copy their DNA and divide to make two identical cells; uncontrolled division is cancer.",
            objectives: ["Describe the stages of the cell cycle and mitosis", "Explain why mitosis produces identical cells", "Connect cell-cycle regulation to cancer"],
            vocab: [["interphase", "the growth phase when DNA is copied"], ["mitosis", "division of the nucleus into two identical nuclei"], ["cytokinesis", "division of the cytoplasm"], ["chromosome", "a condensed strand of DNA and protein"]],
            standards: ["HS-LS1-4"],
            body: `
**The cell cycle**
1. **Interphase** (most of the cycle): the cell grows and **copies its DNA** (S phase).
2. **Mitosis:** the nucleus divides.
3. **Cytokinesis:** the cytoplasm splits, making two cells.

**Phases of mitosis (PMAT)**
- **Prophase:** chromosomes condense; the nuclear envelope breaks down; spindle forms
- **Metaphase:** chromosomes line up in the **middle**
- **Anaphase:** sister chromatids are pulled **apart** to opposite poles
- **Telophase:** two new nuclei form

**Result:** two **genetically identical** daughter cells, each with the same number of chromosomes as the parent (46 in human body cells).

**Purpose:** growth, repair (healing a cut), and asexual reproduction.

**Regulation:** checkpoints stop the cycle if DNA is damaged. When these controls fail, cells divide uncontrollably and can form a **tumor**. This is cancer.`,
            questions: [
              mc("During which phase do chromosomes line up in the middle of the cell?", "Metaphase", ["Prophase", "Anaphase", "Telophase"], "M for middle."),
              mc("When is DNA copied?", "Interphase (S phase)", ["Prophase", "Metaphase", "Cytokinesis"], "DNA replication happens before mitosis begins."),
              num("A human skin cell with 46 chromosomes divides by mitosis. How many chromosomes does each daughter cell have?", 46, "Mitosis produces identical cells with the same chromosome number."),
              tf("Cancer can result when cell-cycle checkpoints fail.", true, "Uncontrolled division leads to tumors."),
            ],
          },
        ],
      },
      {
        title: "Heredity and Evolution",
        description: "Predict inheritance patterns and explain how populations evolve.",
        lessons: [
          {
            title: "Mendelian Genetics and Punnett Squares",
            summary: "Alleles are inherited from each parent; Punnett squares predict offspring probabilities.",
            objectives: ["Use genotype and phenotype vocabulary correctly", "Complete monohybrid Punnett squares and state ratios"],
            vocab: [["allele", "a version of a gene"], ["genotype", "the alleles an organism has (e.g., Bb)"], ["phenotype", "the observable trait (e.g., brown eyes)"], ["homozygous / heterozygous", "two same alleles (BB, bb) / two different alleles (Bb)"]],
            standards: ["HS-LS3-1", "HS-LS3-3"],
            body: `
You inherit **one allele** for each gene from each parent.

- **Dominant** alleles (capital letter, **B**) show up whenever present.
- **Recessive** alleles (lowercase, **b**) show up only when there are two (**bb**).

**Genotype vs. phenotype:** BB and Bb both give a **brown** phenotype; only bb gives **blue**.

**Punnett square:** Bb × Bb
|   | **B** | **b** |
|---|---|---|
| **B** | BB | Bb |
| **b** | Bb | bb |

- Genotype ratio: **1 BB : 2 Bb : 1 bb**
- Phenotype ratio: **3 brown : 1 blue** (75% brown, 25% blue)

**Test cross:** to find whether a brown-eyed individual is BB or Bb, cross it with bb. Any blue offspring reveals it was Bb.

**Beyond Mendel:** incomplete dominance (red × white → pink snapdragons), codominance (AB blood type), and traits controlled by many genes (height).`,
            questions: [
              num("In a cross of Bb × Bb, what percent of offspring are expected to show the recessive phenotype?", 25, "Only bb (1 of 4 boxes) shows the recessive trait."),
              mc("Which genotype is heterozygous?", "Tt", ["TT", "tt", "T"], "Heterozygous means two different alleles."),
              mc("A cross of BB × bb produces offspring that are all…", "Bb", ["BB", "bb", "half BB and half bb"], "Every offspring gets one B and one b."),
              num("In a cross of Bb × bb, what percent of offspring are expected to be bb?", 50, "Half the boxes are Bb and half are bb."),
            ],
          },
          {
            title: "Natural Selection",
            summary: "Variation, inheritance, overproduction, and differential survival lead to adaptation over generations.",
            objectives: ["Explain the conditions required for natural selection", "Use evidence to explain how a population changes over time"],
            vocab: [["natural selection", "individuals with helpful inherited traits survive and reproduce more"], ["adaptation", "an inherited trait that improves survival or reproduction"], ["fitness", "an organism's ability to survive and reproduce"]],
            standards: ["HS-LS4-2", "HS-LS4-4", "HS-LS4-1"],
            body: `
Charles Darwin proposed that populations change through **natural selection**.

**Four conditions**
1. **Variation:** individuals differ in traits.
2. **Inheritance:** traits are passed from parents to offspring.
3. **Overproduction:** more offspring are born than can survive.
4. **Differential survival and reproduction:** individuals with helpful traits leave more offspring.

Over many generations, helpful traits become **more common**. This is **adaptation**.

**Example: antibiotic resistance.** A few bacteria have a mutation that resists an antibiotic. The drug kills the rest; the resistant ones survive and multiply. Soon most of the population is resistant. This is why you should finish prescribed antibiotics.

**Key point:** individuals **don't** evolve or change on purpose. **Populations** change as the frequency of traits shifts.

**Evidence for evolution:** the fossil record, similar anatomy (homologous structures like whale flippers and human arms), DNA similarities, and direct observation (finch beaks, peppered moths).`,
            questions: [
              mc("Which is NOT required for natural selection?", "Individuals choosing to change their traits", ["Variation in traits", "Traits that can be inherited", "More offspring than can survive"], "Individuals can't change their inherited traits on purpose."),
              mc("Antibiotic-resistant bacteria become common because…", "resistant bacteria survive and reproduce while others die", ["bacteria decide to become resistant", "antibiotics create new bacteria", "all bacteria become resistant at once"], "The antibiotic selects for existing resistant variants."),
              tf("Individual organisms evolve during their lifetimes.", false, "Populations evolve over generations."),
              mc("Whale flippers and human arms have similar bones. These are…", "homologous structures", ["vestigial structures", "analogous structures", "mutations"], "Similar structure inherited from a common ancestor."),
            ],
            writtenPrompt: "A population of brown and green beetles lives on green leaves, and birds eat the beetles they can see. Predict what happens to the population over many generations, using the four conditions of natural selection.",
            rubric: "Variation: brown and green beetles. Inheritance: color is passed on. Overproduction and predation: birds eat the more visible brown beetles. Differential survival: green beetles survive and reproduce more. Result: the proportion of green beetles increases over generations. Notes that the population changes, not individuals.",
          },
        ],
      },
    ],
  },
  {
    id: "chemistry",
    title: "Chemistry",
    subject: "science",
    grade: 10,
    framework: NGSS,
    description: "Atomic structure, periodic trends, balancing equations, and stoichiometry with moles.",
    units: [
      {
        title: "Atoms and the Periodic Table",
        description: "Use atomic structure to explain patterns on the periodic table.",
        lessons: [
          {
            title: "Atomic Structure and Isotopes",
            summary: "Protons, neutrons, and electrons determine an element's identity, mass, and chemistry.",
            objectives: ["Determine protons, neutrons, and electrons from atomic number and mass number", "Explain isotopes and average atomic mass"],
            vocab: [["atomic number (Z)", "the number of protons"], ["mass number (A)", "protons + neutrons"], ["isotope", "atoms of the same element with different numbers of neutrons"], ["valence electrons", "electrons in the outermost energy level"]],
            standards: ["HS-PS1-1", "HS-PS1-8"],
            body: `
**Atomic number (Z)** = number of **protons**; it defines the element.
**Mass number (A)** = protons + neutrons.
**Neutrons = A − Z**

**Example: chlorine-37** (Z = 17)
- protons: 17
- neutrons: 37 − 17 = **20**
- electrons (neutral atom): 17

**Isotopes** have the same number of protons but different neutrons: carbon-12, carbon-13, carbon-14.

**Average atomic mass** is a weighted average of isotopes:
Chlorine is ~75.8% Cl-35 and ~24.2% Cl-37
(0.758 × 35) + (0.242 × 37) ≈ **35.5 amu**, which matches the periodic table.

**Ions** form when atoms gain or lose electrons.
- Na loses 1 e⁻ → Na⁺ (10 electrons)
- O gains 2 e⁻ → O²⁻ (10 electrons)

**Valence electrons** (outer shell) control how an atom bonds.`,
            questions: [
              num("How many neutrons are in an atom of iron-56 (Z = 26)?", 30, "56 − 26 = 30."),
              num("How many electrons does a Mg²⁺ ion have? (Mg has Z = 12)", 10, "12 − 2 = 10 electrons."),
              mc("Carbon-12 and carbon-14 differ in their number of…", "neutrons", ["protons", "electrons", "atomic number"], "Isotopes differ only in neutron count."),
              tf("The atomic number tells you the number of protons.", true, "Z = number of protons."),
            ],
          },
          {
            title: "Periodic Trends",
            summary: "Atomic radius, ionization energy, and electronegativity change predictably across periods and down groups.",
            objectives: ["Describe trends in atomic radius, ionization energy, and electronegativity", "Explain trends using nuclear charge and electron shielding"],
            vocab: [["period", "a horizontal row of the periodic table"], ["group", "a vertical column; elements with similar properties"], ["ionization energy", "energy needed to remove an electron"], ["electronegativity", "an atom's pull on shared electrons in a bond"]],
            standards: ["HS-PS1-1", "HS-PS1-2"],
            body: `
Elements in the same **group** have the same number of valence electrons, so they behave similarly. Group 1 (alkali metals) all react vigorously with water; Group 18 (noble gases) are unreactive.

**Trends**
| Property | Across a period → | Down a group ↓ |
|---|---|---|
| Atomic radius | decreases | increases |
| Ionization energy | increases | decreases |
| Electronegativity | increases | decreases |

**Why?**
- **Across a period**, protons are added to the nucleus but electrons go into the same shell. The stronger **nuclear charge** pulls electrons closer → smaller atoms that hold electrons more tightly.
- **Down a group**, each row adds a new electron **shell**. Inner electrons **shield** the outer ones, so atoms get bigger and lose electrons more easily.

**Bottom line:** **fluorine** is the most electronegative element; **francium/cesium** are the largest and most easily ionized (most reactive metals).`,
            questions: [
              mc("Which element has the largest atomic radius?", "K (potassium)", ["Na (sodium)", "Li (lithium)", "H (hydrogen)"], "Atomic radius increases down a group."),
              mc("Which element has the highest electronegativity?", "F (fluorine)", ["Cl (chlorine)", "O (oxygen)", "Na (sodium)"], "Electronegativity increases up and to the right; fluorine is highest."),
              mc("Moving left to right across a period, ionization energy generally…", "increases", ["decreases", "stays the same"], "Greater nuclear charge holds electrons more tightly."),
              tf("Elements in the same group have the same number of valence electrons.", true, "That's why they have similar chemical properties."),
            ],
          },
        ],
      },
      {
        title: "Chemical Reactions and Stoichiometry",
        description: "Balance equations and calculate quantities using moles.",
        lessons: [
          {
            title: "Balancing Equations and Reaction Types",
            summary: "Balanced equations obey conservation of mass; reactions fall into recognizable types.",
            objectives: ["Balance chemical equations", "Classify synthesis, decomposition, single replacement, double replacement, and combustion reactions"],
            vocab: [["coefficient", "the number in front of a formula showing how many units"], ["combustion", "a reaction with O₂ that releases energy, often producing CO₂ and H₂O"], ["precipitate", "an insoluble solid formed in a reaction"]],
            standards: ["HS-PS1-2", "HS-PS1-7"],
            body: `
A balanced equation has the **same number of each atom** on both sides.

**Steps**
1. Write correct formulas.
2. Count atoms of each element on both sides.
3. Adjust **coefficients** (never subscripts).
4. Balance elements that appear in only one compound first; leave H and O for last.

**Example:** __Al + __O₂ → __Al₂O₃
→ **4Al + 3O₂ → 2Al₂O₃**

**Reaction types**
| Type | Pattern | Example |
|---|---|---|
| Synthesis | A + B → AB | 2Na + Cl₂ → 2NaCl |
| Decomposition | AB → A + B | 2H₂O₂ → 2H₂O + O₂ |
| Single replacement | A + BC → AC + B | Zn + 2HCl → ZnCl₂ + H₂ |
| Double replacement | AB + CD → AD + CB | AgNO₃ + NaCl → AgCl + NaNO₃ |
| Combustion | fuel + O₂ → CO₂ + H₂O | CH₄ + 2O₂ → CO₂ + 2H₂O |`,
            questions: [
              mc("Balance: __N₂ + __H₂ → __NH₃", "1, 3, 2", ["1, 1, 2", "2, 3, 2", "1, 3, 1"], "N₂ + 3H₂ → 2NH₃ gives 2 N and 6 H on each side."),
              mc("2KClO₃ → 2KCl + 3O₂ is which type of reaction?", "Decomposition", ["Synthesis", "Combustion", "Single replacement"], "One compound breaks into simpler substances."),
              mc("Which is a combustion reaction?", "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O", ["NaCl → Na + Cl₂", "Fe + S → FeS", "HCl + NaOH → NaCl + H₂O"], "A hydrocarbon burns in oxygen to make CO₂ and H₂O."),
              num("In 2Al₂O₃, how many oxygen atoms are there?", 6, "2 × 3 = 6."),
            ],
          },
          {
            title: "Moles and Stoichiometry",
            summary: "The mole connects atoms to grams; mole ratios from balanced equations predict amounts.",
            objectives: ["Calculate molar mass", "Convert between grams and moles", "Use mole ratios to solve stoichiometry problems"],
            vocab: [["mole (mol)", "6.022 × 10²³ particles"], ["molar mass", "the mass of one mole of a substance in g/mol"], ["mole ratio", "the ratio of coefficients in a balanced equation"]],
            standards: ["HS-PS1-7"],
            body: `
A **mole** is **6.022 × 10²³** particles (Avogadro's number), just like a dozen is 12.

**Molar mass** = sum of the atomic masses in the formula (g/mol).
H₂O: 2(1.01) + 16.00 = **18.02 g/mol**
CO₂: 12.01 + 2(16.00) = **44.01 g/mol**

**Grams ↔ moles:** moles = mass ÷ molar mass
36.04 g of water = 36.04 ÷ 18.02 = **2.00 mol**

**Stoichiometry roadmap**
**grams A → moles A → (mole ratio) → moles B → grams B**

**Example:** 2H₂ + O₂ → 2H₂O. How many grams of water from 4.04 g of H₂?
- 4.04 g ÷ 2.02 g/mol = 2.00 mol H₂
- mole ratio H₂O : H₂ = 2 : 2 → 2.00 mol H₂O
- 2.00 × 18.02 = **36.04 g H₂O**

**Limiting reactant:** the reactant that runs out first determines how much product forms.`,
            questions: [
              num("What is the molar mass of CO₂ in g/mol? (C = 12.01, O = 16.00)", 44.01, "12.01 + 2(16.00) = 44.01.", { tolerance: 0.05 }),
              num("How many moles are in 88.02 g of CO₂?", 2, "88.02 ÷ 44.01 = 2.00 mol.", { tolerance: 0.02 }),
              num("In N₂ + 3H₂ → 2NH₃, how many moles of NH₃ form from 6 mol of H₂?", 4, "Mole ratio 2 NH₃ : 3 H₂ → 6 × 2/3 = 4 mol."),
              mc("Which reactant determines the maximum amount of product?", "The limiting reactant", ["The excess reactant", "The catalyst", "The reactant with the largest molar mass"], "Once the limiting reactant runs out, the reaction stops."),
            ],
            writtenPrompt: "Propane burns according to C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. Calculate the mass of CO₂ produced from 44.1 g of propane (molar mass 44.1 g/mol). Show each step of the roadmap.",
            rubric: "44.1 g ÷ 44.1 g/mol = 1.00 mol C₃H₈. Mole ratio 3 CO₂ : 1 C₃H₈ → 3.00 mol CO₂. 3.00 × 44.01 g/mol ≈ 132 g CO₂. Units shown at each step.",
          },
        ],
      },
    ],
  },
  {
    id: "physics",
    title: "Physics",
    subject: "science",
    grade: 11,
    framework: NGSS,
    description: "Kinematics, Newton's second law, momentum, and conservation of energy.",
    units: [
      {
        title: "Motion and Forces",
        description: "Describe motion mathematically and connect it to net force.",
        lessons: [
          {
            title: "Kinematics: Describing Motion",
            summary: "Displacement, velocity, and acceleration describe motion; the kinematic equations predict it.",
            objectives: ["Distinguish distance from displacement and speed from velocity", "Interpret position–time and velocity–time graphs", "Solve problems with constant acceleration"],
            vocab: [["displacement", "change in position, with direction"], ["velocity", "displacement per unit time, with direction"], ["acceleration", "rate of change of velocity"], ["free fall", "motion under gravity alone; a = 9.8 m/s² downward"]],
            standards: ["HS-PS2-1"],
            body: `
**Scalars vs. vectors**
- Distance (scalar) vs. **displacement** (vector): walk 3 m east then 3 m west → distance 6 m, displacement **0 m**.
- Speed (scalar) vs. **velocity** (vector).

**Acceleration:** a = Δv / Δt. A car going from 0 to 20 m/s in 4 s accelerates at **5 m/s²**.

**Kinematic equations (constant acceleration)**
- v = v₀ + at
- Δx = v₀t + ½at²
- v² = v₀² + 2aΔx

**Free fall:** a = g ≈ 9.8 m/s² downward.
A ball dropped from rest falls Δx = ½(9.8)(2²) = **19.6 m** in 2 s.

**Graphs**
- Position–time: **slope = velocity**
- Velocity–time: **slope = acceleration**; **area under the curve = displacement**`,
            questions: [
              num("A runner goes from 2 m/s to 8 m/s in 3 s. What is her acceleration in m/s²?", 2, "(8 − 2)/3 = 2 m/s²."),
              num("A rock is dropped from rest. How fast is it falling after 3 s? (g = 9.8 m/s², answer in m/s)", 29.4, "v = gt = 9.8 × 3 = 29.4 m/s.", { tolerance: 0.05 }),
              mc("On a velocity–time graph, the slope represents…", "acceleration", ["displacement", "position", "force"], "Slope = Δv/Δt = acceleration."),
              num("You walk 5 m north, then 5 m south. What is your displacement in meters?", 0, "You end where you started."),
            ],
          },
          {
            title: "Newton's Second Law and Free-Body Diagrams",
            summary: "Net force equals mass times acceleration; free-body diagrams organize the forces.",
            objectives: ["Draw free-body diagrams", "Apply ΣF = ma to find acceleration or unknown forces", "Distinguish mass from weight"],
            vocab: [["net force (ΣF)", "the vector sum of all forces on an object"], ["weight", "the force of gravity on an object: W = mg"], ["normal force", "the support force a surface exerts perpendicular to it"]],
            standards: ["HS-PS2-1"],
            body: `
**Newton's second law:** **ΣF = ma**. The **net** force, not any single force, determines acceleration.

**Free-body diagram:** draw the object as a dot and every force as an arrow.
Common forces: weight (mg, down), normal force (perpendicular to the surface), friction (opposes motion), tension, applied force.

**Example:** A 10 kg box is pulled with 50 N to the right; friction is 20 N to the left.
ΣF = 50 − 20 = 30 N → a = 30/10 = **3 m/s²** to the right.

**Mass vs. weight**
- Mass (kg) is the amount of matter; it's the same everywhere.
- Weight (N) is the force of gravity: **W = mg**. A 60 kg person weighs 588 N on Earth but only ~97 N on the Moon (g = 1.62 m/s²).

**Equilibrium:** if ΣF = 0, the object is at rest **or** moving at constant velocity.`,
            questions: [
              num("A 5 kg cart is pushed with 30 N while friction is 10 N. What is its acceleration in m/s²?", 4, "ΣF = 20 N; a = 20/5 = 4 m/s²."),
              num("What is the weight in newtons of a 50 kg student on Earth? (g = 9.8 m/s²)", 490, "W = mg = 50 × 9.8 = 490 N."),
              tf("An object moving at constant velocity has zero net force acting on it.", true, "No acceleration means ΣF = 0."),
              mc("An astronaut travels from Earth to the Moon. Her mass…", "stays the same", ["decreases", "increases", "becomes zero"], "Mass doesn't depend on location; weight does."),
            ],
          },
        ],
      },
      {
        title: "Momentum and Energy",
        description: "Apply conservation laws to collisions and energy transformations.",
        lessons: [
          {
            title: "Momentum and Collisions",
            summary: "Momentum p = mv is conserved in collisions when no external force acts.",
            objectives: ["Calculate momentum and impulse", "Apply conservation of momentum to collisions", "Explain how safety devices reduce force"],
            vocab: [["momentum (p)", "mass × velocity"], ["impulse", "force × time = change in momentum"], ["elastic collision", "kinetic energy is conserved"], ["inelastic collision", "objects stick or kinetic energy is lost"]],
            standards: ["HS-PS2-2", "HS-PS2-3"],
            body: `
**Momentum:** p = m·v (kg·m/s). A 1,000 kg car at 20 m/s has p = **20,000 kg·m/s**.

**Impulse:** J = F·Δt = Δp
To stop the same change in momentum with **less force**, increase the **time**. That's how airbags, crumple zones, and bending your knees when landing protect you.

**Conservation of momentum:** in a closed system, total momentum before = total momentum after.
**m₁v₁ + m₂v₂ = m₁v₁′ + m₂v₂′**

**Perfectly inelastic example:** A 2 kg cart at 3 m/s hits and sticks to a 1 kg cart at rest.
Before: 2(3) + 1(0) = 6 kg·m/s
After: (2 + 1)v′ = 6 → **v′ = 2 m/s**

**Elastic collisions** (like billiard balls) conserve both momentum **and** kinetic energy. Inelastic collisions conserve momentum but convert some kinetic energy to heat, sound, and deformation.`,
            questions: [
              num("What is the momentum of a 0.5 kg ball moving at 10 m/s? (kg·m/s)", 5, "p = 0.5 × 10 = 5 kg·m/s."),
              num("A 4 kg cart at 5 m/s collides and sticks to a 1 kg cart at rest. What is their final speed in m/s?", 4, "20 kg·m/s ÷ 5 kg = 4 m/s."),
              mc("Airbags reduce injury mainly by…", "increasing the time over which momentum changes", ["reducing the passenger's mass", "increasing the passenger's momentum", "eliminating the impulse"], "Same Δp over a longer time means less force."),
              tf("Momentum is conserved in inelastic collisions.", true, "Momentum is conserved in all collisions in a closed system; kinetic energy is not."),
            ],
          },
          {
            title: "Work, Energy, and Power",
            summary: "Work transfers energy; mechanical energy is conserved without friction; power is the rate of work.",
            objectives: ["Calculate work, kinetic energy, and potential energy", "Apply conservation of mechanical energy", "Calculate power"],
            vocab: [["work", "W = F·d (force along the direction of motion)"], ["joule (J)", "the unit of energy: 1 N·m"], ["power", "rate of doing work: P = W/t, in watts"]],
            standards: ["HS-PS3-1", "HS-PS3-2"],
            body: `
**Work:** W = F·d·cos θ. Pushing a box 5 m with 40 N along the floor does **200 J** of work. Carrying a box horizontally at constant speed does **no work** on it (force is perpendicular to motion).

**Kinetic energy:** KE = ½mv²
**Gravitational potential energy:** PE = mgh

**Conservation of mechanical energy** (no friction): KE + PE stays constant.
A 2 kg ball dropped from 5 m:
PE at top = 2(9.8)(5) = 98 J → KE at bottom = 98 J → ½(2)v² = 98 → **v ≈ 9.9 m/s**

Notice the mass cancels: every object dropped from 5 m hits at ~9.9 m/s (ignoring air).

**Work–energy theorem:** net work = ΔKE.

**Power:** P = W/t (watts, W = J/s). Lifting a 600 N person up 3 m of stairs in 4 s: P = (600 × 3)/4 = **450 W**.`,
            questions: [
              num("How much work is done pushing a crate 8 m with a 25 N horizontal force? (joules)", 200, "W = 25 × 8 = 200 J."),
              num("What is the potential energy of a 3 kg object 10 m above the ground? (g = 9.8; joules)", 294, "PE = 3 × 9.8 × 10 = 294 J."),
              num("A motor does 1,200 J of work in 6 s. What is its power in watts?", 200, "P = 1200/6 = 200 W."),
              tf("Carrying a backpack horizontally at constant speed does no work on the backpack.", true, "The upward force is perpendicular to the horizontal motion."),
            ],
            writtenPrompt: "A roller coaster car starts from rest at the top of a 45 m hill. Ignoring friction, find its speed at the bottom. Then explain why a real coaster's speed would be lower.",
            rubric: "Sets mgh = ½mv², mass cancels: v = √(2gh) = √(2 × 9.8 × 45) ≈ 29.7 m/s. Explains that friction and air resistance convert some mechanical energy into heat and sound, so less becomes kinetic energy.",
          },
        ],
      },
    ],
  },
  {
    id: "env-science",
    title: "Environmental Science",
    subject: "science",
    grade: 12,
    framework: NGSS,
    description: "Biodiversity, population dynamics, climate science, and sustainable resource use.",
    units: [
      {
        title: "Ecosystems and Biodiversity",
        description: "Analyze biodiversity, ecosystem services, and population growth.",
        lessons: [
          {
            title: "Biodiversity and Ecosystem Services",
            summary: "Biodiversity makes ecosystems resilient and provides services humans depend on.",
            objectives: ["Define the three levels of biodiversity", "Explain how biodiversity supports ecosystem stability", "Evaluate human impacts on biodiversity"],
            vocab: [["biodiversity", "the variety of life: genetic, species, and ecosystem diversity"], ["ecosystem services", "benefits people get from ecosystems"], ["keystone species", "a species with an outsized effect on its ecosystem"], ["HIPPO", "main threats: Habitat loss, Invasive species, Pollution, Population growth, Overharvesting"]],
            standards: ["HS-LS2-6", "HS-LS2-7", "HS-LS4-6"],
            body: `
**Three levels of biodiversity**
1. **Genetic:** variation within a species (helps populations adapt to disease)
2. **Species:** the number and variety of species
3. **Ecosystem:** the variety of habitats (forests, wetlands, reefs)

**Why it matters: ecosystem services**
- **Provisioning:** food, fresh water, timber, medicine (≈ half of modern drugs come from natural compounds)
- **Regulating:** pollination, flood control, water purification, climate regulation
- **Cultural:** recreation, spiritual value
- **Supporting:** soil formation, nutrient cycling

**Resilience:** diverse ecosystems recover from disturbances better, like a diversified investment portfolio.

**Keystone species:** when sea otters were hunted out of kelp forests, sea urchins exploded and destroyed the kelp. Returning otters restored the forest.

**Threats (HIPPO):** Habitat loss is the #1 driver of extinction, followed by invasive species, pollution, human population growth, and overharvesting.`,
            questions: [
              mc("Which is the leading cause of biodiversity loss worldwide?", "Habitat loss", ["Volcanic eruptions", "Meteor impacts", "Natural predation"], "Habitat destruction is the top threat."),
              mc("Bees pollinating crops is an example of which type of ecosystem service?", "Regulating", ["Provisioning", "Cultural", "Supporting"], "Pollination regulates plant reproduction."),
              tf("Ecosystems with higher biodiversity tend to be more resilient to disturbances.", true, "More species means more ways to fill ecological roles."),
              mc("Removing sea otters led to the loss of kelp forests. Sea otters are a…", "keystone species", ["invasive species", "producer", "decomposer"], "Their removal changed the whole ecosystem."),
            ],
          },
          {
            title: "Population Growth and Carrying Capacity",
            summary: "Populations grow exponentially until limiting factors cap them at carrying capacity.",
            objectives: ["Compare exponential and logistic growth", "Identify density-dependent and density-independent limiting factors", "Apply these ideas to human population"],
            vocab: [["carrying capacity (K)", "the maximum population an environment can sustain"], ["logistic growth", "S-shaped growth that levels off at K"], ["limiting factor", "a resource or condition that limits population size"]],
            standards: ["HS-LS2-1", "HS-LS2-2", "HS-ESS3-1"],
            body: `
**Exponential growth (J-curve):** with unlimited resources, populations multiply at a constant rate. Bacteria doubling every 20 minutes go from 1 to over 16 million in 8 hours.

**Logistic growth (S-curve):** as resources run short, growth slows and the population levels off at the **carrying capacity (K)**.

**Limiting factors**
| Density-dependent | Density-independent |
|---|---|
| competition for food | natural disasters |
| predation | extreme weather |
| disease | human habitat destruction |

Density-dependent factors get **stronger** as populations get crowded; density-independent ones affect populations regardless of size.

**Overshoot:** a population that exceeds K can damage its resources and crash. Reindeer introduced to St. Matthew Island grew to about 6,000 and then crashed to fewer than 50 after overgrazing the lichen.

**Human population:** about 8 billion and growing more slowly than in the past. Our carrying capacity depends on technology and consumption.`,
            questions: [
              mc("A population levels off at the environment's carrying capacity. This is…", "logistic growth", ["exponential growth", "linear growth", "a population crash"], "Logistic growth forms an S-shaped curve."),
              mc("Which is a density-dependent limiting factor?", "Disease spreading through a crowded population", ["A hurricane", "A wildfire", "A drought"], "Disease spreads faster when individuals are close together."),
              num("Bacteria double every hour. Starting with 100, how many are there after 5 hours?", 3200, "100 × 2⁵ = 3,200."),
              tf("A population can temporarily exceed its carrying capacity.", true, "This is overshoot, often followed by a crash."),
            ],
          },
        ],
      },
      {
        title: "Climate and Sustainability",
        description: "Interpret climate evidence and evaluate solutions for sustainable resource use.",
        lessons: [
          {
            title: "The Greenhouse Effect and Climate Change",
            summary: "Greenhouse gases trap heat; rising CO₂ from fossil fuels is warming the planet.",
            objectives: ["Explain the greenhouse effect", "Analyze evidence that recent warming is caused by human activity", "Describe impacts of climate change"],
            vocab: [["greenhouse gas", "a gas that absorbs and re-emits infrared radiation (CO₂, CH₄, H₂O, N₂O)"], ["climate", "average weather over 30+ years"], ["feedback loop", "a change that amplifies (positive) or dampens (negative) itself"]],
            standards: ["HS-ESS2-4", "HS-ESS3-5", "HS-ESS3-6"],
            body: `
**The greenhouse effect is natural and necessary.**
1. Sunlight (mostly visible light) passes through the atmosphere and warms Earth's surface.
2. The surface emits **infrared** radiation (heat).
3. **Greenhouse gases** absorb and re-emit some of that heat back toward the surface.
Without it, Earth would average about **−18 °C** instead of about **15 °C**.

**The enhanced greenhouse effect:** burning fossil fuels and clearing forests has raised CO₂ from about **280 ppm** before the Industrial Revolution to **over 420 ppm** today.

**Evidence of human-caused warming**
- Global temperature has risen about **1.1–1.2 °C** since the late 1800s.
- The extra CO₂ has the chemical fingerprint of fossil fuels.
- Natural factors (solar output, volcanoes) don't explain the recent trend.

**Impacts:** sea-level rise, more intense heat waves and heavy rainfall, ocean acidification, shifting habitats.

**Feedback example:** melting Arctic ice exposes dark ocean that absorbs more sunlight → more warming → more melting (positive feedback).`,
            questions: [
              mc("Which type of radiation do greenhouse gases absorb?", "Infrared", ["Visible light", "X-rays", "Radio waves"], "Earth's surface emits infrared heat, which greenhouse gases absorb."),
              num("Atmospheric CO₂ before the Industrial Revolution was about how many ppm?", 280, "Roughly 280 ppm, versus over 420 ppm today.", { tolerance: 10 }),
              tf("Without any greenhouse effect, Earth would be much colder.", true, "About −18 °C on average instead of ~15 °C."),
              mc("Melting sea ice leading to more warming is an example of…", "a positive feedback loop", ["a negative feedback loop", "the ozone hole", "weathering"], "The change amplifies itself."),
            ],
          },
          {
            title: "Energy Resources and Sustainability",
            summary: "Compare energy sources by cost, emissions, and reliability, and design sustainable solutions.",
            objectives: ["Compare renewable and nonrenewable energy sources using evidence", "Evaluate a solution to reduce human impact using criteria and trade-offs"],
            vocab: [["sustainability", "meeting present needs without compromising future generations"], ["carbon footprint", "total greenhouse gases caused by an activity"], ["life-cycle assessment", "analyzing impacts from production to disposal"]],
            standards: ["HS-ESS3-2", "HS-ESS3-4", "HS-ETS1-3"],
            body: `
**Sustainability** means meeting today's needs without compromising future generations.

**Comparing electricity sources**
| Source | Lifecycle CO₂ (g/kWh, approx.) | Notes |
|---|---|---|
| Coal | ~820 | cheap infrastructure, high pollution |
| Natural gas | ~490 | flexible, still emits CO₂ |
| Solar PV | ~40 | intermittent; costs fell ~90% in a decade |
| Wind | ~11 | intermittent; land use and wildlife concerns |
| Nuclear | ~12 | reliable; waste storage and cost |
| Hydro | ~24 | reliable; habitat disruption |
*(Medians from IPCC lifecycle assessments.)*

**Trade-offs:** there is no perfect source. Engineers weigh cost, reliability, emissions, land use, and safety.

**Solutions beyond generation**
- **Efficiency:** LED bulbs use about 75% less energy than incandescent bulbs.
- **Storage:** batteries smooth out solar and wind variability.
- **Policy & behavior:** carbon pricing, public transit, reducing food waste.

**Systems thinking:** an electric car is only as clean as the grid that charges it, but it gets cleaner as the grid does.`,
            questions: [
              mc("Which source has the lowest lifecycle CO₂ emissions per kWh in the table?", "Wind", ["Coal", "Natural gas", "Solar PV"], "Wind ≈ 11 g/kWh."),
              mc("A major challenge for solar and wind power is…", "intermittency (they don't generate all the time)", ["they emit large amounts of CO₂", "they will run out", "they can't produce electricity"], "Storage and grid management address this."),
              tf("Improving energy efficiency is a way to reduce environmental impact.", true, "Using less energy for the same task reduces emissions."),
              mc("Analyzing a product's impact from raw materials through disposal is called a…", "life-cycle assessment", ["carbon tax", "food web", "feedback loop"], "It accounts for the whole life of the product."),
            ],
            writtenPrompt: "Propose a plan to cut your school's electricity-related emissions by 30%. Describe two strategies, the evidence that they'll work, and one trade-off for each.",
            rubric: "Two concrete strategies (e.g., LED retrofit, solar panels, smart thermostats, behavior campaign). Supports each with evidence (LEDs ~75% less energy; solar's low emissions). Identifies a realistic trade-off for each (upfront cost, roof space, maintenance, behavior change). Shows rough reasoning toward the 30% goal.",
          },
        ],
      },
    ],
  },
];
