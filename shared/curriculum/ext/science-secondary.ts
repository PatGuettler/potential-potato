import { mc, num, short, tf, type UnitSpec } from "../dsl";

export const scienceSecondaryExt: Record<string, UnitSpec[]> = {
  "sci-6": [
    {
      title: "Weather and Climate Systems",
      description: "Explain how air masses, winds, and ocean currents drive weather and climate.",
      lessons: [
        {
          title: "Air Masses and Fronts",
          summary: "Weather changes when air masses with different temperature and humidity meet at fronts.",
          objectives: ["Describe the four main types of air masses", "Predict the weather at cold, warm, and stationary fronts", "Read a basic weather map"],
          vocab: [["air mass", "a huge body of air with similar temperature and humidity"], ["front", "the boundary between two air masses"], ["air pressure", "the weight of air pressing down"]],
          standards: ["MS-ESS2-5"],
          body: `
An **air mass** takes on the properties of where it forms:
| Type | Forms over | Properties |
|---|---|---|
| Maritime tropical (mT) | warm ocean | warm, humid |
| Continental tropical (cT) | desert | hot, dry |
| Maritime polar (mP) | cold ocean | cool, humid |
| Continental polar (cP) | northern land | cold, dry |

**Fronts** form where air masses meet:
- **Cold front:** cold air pushes under warm air, lifting it fast → tall clouds, thunderstorms, then cooler, clearer weather.
- **Warm front:** warm air slides over cold air → steady rain or drizzle for hours, then warmer.
- **Stationary front:** neither moves → days of clouds and rain.

**Pressure:** low pressure → rising air → clouds and storms. High pressure → sinking air → clear skies.

On weather maps, cold fronts are **blue triangles**; warm fronts are **red half-circles**.`,
          questions: [
            mc("An air mass that forms over the Gulf of Mexico is likely…", "warm and humid", ["cold and dry", "hot and dry", "cold and humid"], "Maritime tropical: over warm water."),
            mc("What weather usually comes with a cold front?", "Thunderstorms followed by cooler, clearer weather", ["Days of light drizzle", "No change at all", "Steady warming"], "Warm air is lifted quickly, forming tall storm clouds."),
            tf("High-pressure systems usually bring clear skies.", true, "Sinking air prevents clouds from forming."),
            mc("On a weather map, blue triangles show a…", "cold front", ["warm front", "high-pressure center", "stationary front"], "Blue triangles point the way the cold air moves."),
          ],
        },
        {
          title: "Global Winds and Ocean Currents",
          summary: "Uneven heating and Earth's rotation create global winds and currents that move heat around the planet.",
          objectives: ["Explain how uneven heating causes wind", "Describe the Coriolis effect", "Explain how ocean currents affect regional climate"],
          vocab: [["convection", "circulation caused by warm fluid rising and cool fluid sinking"], ["Coriolis effect", "the curving of moving air and water due to Earth's rotation"], ["Gulf Stream", "a warm current flowing from the Gulf of Mexico across the Atlantic"]],
          standards: ["MS-ESS2-6"],
          body: `
**The sun heats Earth unevenly:** the equator gets more direct sunlight than the poles.

**Convection:** warm air at the equator rises; cooler air flows in to replace it. This creates **wind**.

**The Coriolis effect:** Earth spins, so winds curve — right in the Northern Hemisphere, left in the Southern. This makes global wind belts:
- **Trade winds** (near the equator) blow from the east.
- **Westerlies** (mid-latitudes, including most of the U.S.) blow from the west — that's why U.S. weather usually moves west to east.

**Ocean currents** act like conveyor belts of heat.
- The **Gulf Stream** carries warm water to Europe. London is much milder than Calgary, Canada, at a similar latitude.
- The cold **California Current** keeps San Francisco summers cool and foggy.

**Deep currents** are driven by differences in temperature and saltiness (density).`,
          questions: [
            mc("What causes wind?", "Uneven heating of Earth's surface", ["The moon's gravity", "Earthquakes", "Ocean salt"], "Warm air rises and cooler air moves in."),
            mc("Why does U.S. weather usually move from west to east?", "The prevailing westerlies", ["The trade winds", "The Gulf Stream", "Mountains push it"], "Mid-latitude winds blow from the west."),
            tf("The Gulf Stream makes Western Europe warmer than it would otherwise be.", true, "It carries tropical heat northeast."),
            mc("In the Northern Hemisphere, the Coriolis effect curves winds to the…", "right", ["left", "up", "it has no effect"], "Earth's rotation deflects moving air right in the north."),
          ],
        },
      ],
    },
    {
      title: "Space and Earth's Resources",
      description: "Model gravity's role in the solar system and examine resources and hazards.",
      lessons: [
        {
          title: "Gravity and the Solar System",
          summary: "Gravity holds planets in orbit and shaped the solar system; scale models show its vast size.",
          objectives: ["Explain gravity's role in orbits", "Compare the scale of objects in the solar system", "Describe how the solar system formed"],
          vocab: [["gravity", "the force of attraction between masses"], ["orbit", "the path of one object around another"], ["astronomical unit (AU)", "Earth's average distance from the sun, about 150 million km"]],
          standards: ["MS-ESS1-2", "MS-ESS1-3"],
          body: `
**Gravity** pulls every mass toward every other mass. More mass → stronger pull. More distance → weaker pull.

**Why don't planets fall into the sun?** They're moving sideways fast. Gravity bends their path into an **orbit** — like a ball swung on a string.

**Formation:** about 4.6 billion years ago, gravity pulled a cloud of gas and dust together. Most became the sun; leftover material clumped into planets, moons, and asteroids.

**Scale is huge!** If the sun were a basketball:
- Earth would be a peppercorn 26 m away
- Jupiter a large marble 135 m away
- Neptune a peppercorn 780 m away

**Data:**
| Planet | Distance (AU) | Year length |
|---|---|---|
| Mercury | 0.4 | 88 days |
| Earth | 1.0 | 365 days |
| Jupiter | 5.2 | 12 years |
| Neptune | 30 | 165 years |

Farther planets move slower and have longer paths, so their years are longer.`,
          questions: [
            mc("What keeps planets in orbit around the sun?", "Gravity", ["Magnetism", "Wind", "Sunlight pressure"], "The sun's gravity bends planets' paths."),
            mc("Which planet has the longest year?", "Neptune", ["Mercury", "Earth", "Jupiter"], "It's farthest and moves slowest."),
            tf("The gravitational force between two objects gets weaker as they move farther apart.", true, "Gravity decreases with distance."),
            num("Jupiter is 5.2 AU from the sun. About how many million km is that? (1 AU ≈ 150 million km)", 780, "5.2 × 150 = 780.", { tolerance: 5 }),
          ],
        },
        {
          title: "Natural Resources and Hazards",
          summary: "Resources like minerals, groundwater, and fossil fuels are unevenly distributed; hazard data helps predict risk.",
          objectives: ["Explain why resources are unevenly distributed", "Use data to forecast natural hazards"],
          vocab: [["nonrenewable resource", "a resource that forms much slower than we use it"], ["mineral", "a naturally occurring inorganic solid with a crystal structure"], ["hazard map", "a map showing where hazards are likely"]],
          standards: ["MS-ESS3-1", "MS-ESS3-2"],
          body: `
**Resources are uneven** because they form through specific geologic processes.
- **Oil and gas** formed from ancient sea organisms buried in sedimentary basins (Texas, Saudi Arabia).
- **Metal ores** concentrate near old volcanic activity (copper in Chile and Arizona).
- **Groundwater** collects in porous rock layers called **aquifers** (Ogallala Aquifer under the Great Plains).

**Nonrenewable** resources took millions of years to form; once used, they're gone on human timescales.

**Forecasting hazards with data**
- Earthquakes cluster along faults → hazard maps guide building codes.
- Volcanoes swell and release gas before eruptions.
- Hurricanes are tracked by satellites days in advance.
- Floodplain maps show where water goes in a 100-year flood.

Scientists can't predict the exact day of an earthquake, but they can estimate **probability** over decades.`,
          questions: [
            mc("Why is oil found in some places and not others?", "It forms only in certain buried sedimentary basins", ["It falls from space", "People put it there", "It forms everywhere equally"], "Specific geology created oil deposits."),
            mc("Which natural hazard can scientists track days in advance?", "Hurricanes", ["Earthquakes", "Meteor strikes", "Sinkholes"], "Satellites follow hurricanes as they form."),
            tf("Fossil fuels are renewable because new ones form every year.", false, "They take millions of years to form."),
            mc("An underground layer of rock that holds water is an…", "aquifer", ["ore", "fault", "basin"], "Aquifers supply wells."),
          ],
        },
      ],
    },
  ],
  "sci-7": [
    {
      title: "Heredity",
      description: "Compare reproduction strategies and explain how genes and mutations affect traits.",
      lessons: [
        {
          title: "Sexual and Asexual Reproduction",
          summary: "Asexual reproduction makes identical copies; sexual reproduction mixes genes and creates variation.",
          objectives: ["Compare asexual and sexual reproduction", "Explain why genetic variation helps populations"],
          vocab: [["asexual reproduction", "one parent produces genetically identical offspring"], ["sexual reproduction", "two parents each contribute half the genes"], ["genetic variation", "differences in genes among individuals"]],
          standards: ["MS-LS3-2", "MS-LS1-4"],
          body: `
| | Asexual | Sexual |
|---|---|---|
| Parents | 1 | 2 |
| Offspring | identical (clones) | genetically unique |
| Speed | fast | slower |
| Examples | bacteria splitting, strawberry runners, potato eyes, starfish regrowing | humans, dogs, flowering plants |

**Advantage of asexual:** fast and needs no partner — great in a stable environment.

**Advantage of sexual:** **variation**. If a disease strikes, some individuals may have genes that resist it.

**Real example:** In the 1950s, nearly all export bananas were one clone (Gros Michel). A fungus wiped them out. Today's Cavendish bananas are also clones and face a similar threat.

**Each parent gives half:** you got 23 chromosomes from each parent — 46 total.`,
          questions: [
            mc("Which is an example of asexual reproduction?", "A bacterium splitting in two", ["A puppy born to two dogs", "A flower pollinated by a bee", "A human baby"], "One parent, identical copies."),
            mc("What is the main advantage of sexual reproduction?", "Genetic variation", ["Speed", "Needing only one parent", "Identical offspring"], "Variation helps populations survive change."),
            num("Humans have 46 chromosomes. How many come from each parent?", 23, "Each parent contributes half."),
            tf("Banana clones are all vulnerable to the same disease.", true, "With identical genes, none may resist it."),
          ],
        },
        {
          title: "Genes, Proteins, and Mutations",
          summary: "Genes code for proteins; mutations change proteins and can be harmful, helpful, or neutral.",
          objectives: ["Explain the gene → protein → trait relationship", "Classify mutations by their effects"],
          vocab: [["gene", "a segment of DNA that codes for a protein"], ["protein", "a molecule that does work in cells and builds structures"], ["mutation", "a change in the DNA sequence"]],
          standards: ["MS-LS3-1"],
          body: `
**DNA → genes → proteins → traits**

A **gene** is a set of instructions for building a **protein**. Proteins build your body and run your cells:
- Keratin → hair and nails
- Hemoglobin → carries oxygen in blood
- Melanin-making enzymes → skin and eye color

**Mutations** are changes in DNA. They can come from copying errors, UV light, or chemicals.

| Effect | Example |
|---|---|
| Harmful | Sickle-cell: one changed letter makes hemoglobin fold wrong |
| Helpful | Lactase persistence: lets adults digest milk |
| Neutral | Many mutations don't change the protein at all |

**Only mutations in sex cells** (eggs and sperm) are passed to offspring. A sunburn mutation in a skin cell isn't inherited.`,
          questions: [
            mc("What does a gene code for?", "A protein", ["A cell", "An organ", "A chromosome"], "Genes are instructions for proteins."),
            mc("Sickle-cell disease is caused by a mutation that changes…", "the shape of hemoglobin", ["the number of fingers", "the color of eyes", "bone length"], "Misfolded hemoglobin bends red blood cells."),
            tf("All mutations are harmful.", false, "Many are neutral and some are helpful."),
            mc("Which mutation could be passed to a child?", "One in an egg cell", ["One in a skin cell from sunburn", "One in a muscle cell", "One in a liver cell"], "Only sex-cell mutations are inherited."),
          ],
        },
      ],
    },
    {
      title: "Ecosystem Dynamics",
      description: "Analyze interactions among organisms and the value of biodiversity.",
      lessons: [
        {
          title: "Ecosystem Interactions",
          summary: "Predation, competition, and symbiosis follow patterns across all ecosystems.",
          objectives: ["Classify interactions as predation, competition, mutualism, commensalism, or parasitism", "Predict how interactions affect populations"],
          vocab: [["mutualism", "both species benefit"], ["commensalism", "one benefits, the other is unaffected"], ["parasitism", "one benefits, the other is harmed"], ["competition", "organisms vie for the same limited resource"]],
          standards: ["MS-LS2-2", "MS-LS2-1"],
          body: `
| Interaction | Effect (+ helps, − harms, 0 neither) | Example |
|---|---|---|
| Predation | + / − | wolves eat elk |
| Competition | − / − | lions and hyenas compete for zebras |
| Mutualism | + / + | bees get nectar, flowers get pollinated |
| Commensalism | + / 0 | barnacles ride on whales |
| Parasitism | + / − | ticks feed on deer |

**Predator–prey cycles:** more hares → more lynx (more food) → fewer hares (eaten) → fewer lynx (starve) → hares recover. The graphs rise and fall, with predators lagging behind prey.

**Limiting factors** — food, water, space — cap how large a population can grow (its **carrying capacity**).

These same patterns appear in deserts, oceans, and forests everywhere.`,
          questions: [
            mc("Clownfish hide in sea anemones and clean them. This is…", "mutualism", ["parasitism", "competition", "predation"], "Both benefit."),
            mc("A tapeworm living in a dog's intestine is an example of…", "parasitism", ["mutualism", "commensalism", "competition"], "The tapeworm benefits; the dog is harmed."),
            tf("In predator–prey cycles, predator populations usually peak after prey populations.", true, "Predators respond to food supply with a delay."),
            mc("Two bird species eat the same seeds on an island. This is…", "competition", ["mutualism", "commensalism", "predation"], "Both need the same limited resource."),
          ],
        },
        {
          title: "Biodiversity and Ecosystem Services",
          summary: "Biodiverse ecosystems are more stable and provide services people depend on.",
          objectives: ["Explain how changes to one part of an ecosystem affect others", "Evaluate solutions for protecting biodiversity"],
          vocab: [["keystone species", "a species with an outsized effect on its ecosystem"], ["ecosystem services", "benefits people get from nature, like clean water and pollination"], ["invasive species", "a non-native species that spreads and causes harm"]],
          standards: ["MS-LS2-4", "MS-LS2-5"],
          body: `
**Biodiversity makes ecosystems resilient.** If one species declines, others can fill its role.

**Keystone species:** when wolves returned to Yellowstone in 1995, elk stopped overgrazing riverbanks. Willows regrew, beavers returned, and rivers changed shape. One species reshaped the whole park.

**Ecosystem services**
- 🐝 Pollination: about 1 of every 3 bites of food depends on pollinators
- 🌳 Forests clean air and store carbon
- 🌾 Wetlands filter water and absorb floods
- 🐟 Coral reefs protect coasts and feed millions

**Threats:** habitat loss, invasive species (zebra mussels, kudzu), pollution, overharvesting, climate change.

**Evaluating solutions:** wildlife corridors, protected areas, removing invasive species, sustainable fishing limits. Good solutions balance ecological, economic, and social needs.`,
          questions: [
            mc("What happened when wolves returned to Yellowstone?", "Elk overgrazing decreased and riverbanks recovered", ["All elk disappeared", "Nothing changed", "Rivers dried up"], "Wolves changed elk behavior, letting plants regrow."),
            mc("Which is an ecosystem service?", "Wetlands filtering water", ["Building a dam", "A water treatment plant", "Bottled water"], "Nature provides this for free."),
            tf("Ecosystems with more biodiversity tend to recover better from disturbances.", true, "More species means more backups."),
            mc("Zebra mussels spreading through the Great Lakes are an example of…", "an invasive species", ["a keystone species", "mutualism", "an ecosystem service"], "They're non-native and cause harm."),
          ],
        },
      ],
    },
  ],
  "sci-8": [
    {
      title: "Waves and Fields",
      description: "Describe wave properties and investigate electric and magnetic forces.",
      lessons: [
        {
          title: "Wave Properties",
          summary: "Waves transfer energy; amplitude, wavelength, and frequency describe them.",
          objectives: ["Identify amplitude, wavelength, and frequency", "Relate amplitude to energy", "Describe how waves reflect, absorb, and transmit"],
          vocab: [["amplitude", "the height of a wave; relates to energy"], ["wavelength", "the distance from crest to crest"], ["frequency", "the number of waves per second, in hertz (Hz)"]],
          standards: ["MS-PS4-1", "MS-PS4-2"],
          body: `
A **wave** transfers **energy** without moving matter along with it.

**Parts of a wave**
- **Crest** (top) and **trough** (bottom)
- **Amplitude:** height from the middle → bigger amplitude = **more energy** (louder sound, brighter light)
- **Wavelength (λ):** crest to crest
- **Frequency (f):** waves per second (Hz) → higher frequency = higher pitch

**Shorter wavelength ↔ higher frequency** (for the same speed).

**Types**
- **Mechanical waves** need a medium: sound, water waves, earthquake waves.
- **Electromagnetic waves** travel through empty space: light, radio, X-rays.

**When waves hit a material** they can be **reflected** (echo, mirror), **absorbed** (dark shirt warming in sun), or **transmitted** (light through glass). **Refraction** bends waves as they change speed (a straw looks bent in water).`,
          questions: [
            mc("Which wave property is related to how loud a sound is?", "Amplitude", ["Wavelength", "Frequency", "Speed"], "Bigger amplitude = more energy = louder."),
            mc("A higher-pitched sound has a higher…", "frequency", ["amplitude", "wavelength", "mass"], "Pitch depends on frequency."),
            tf("Sound can travel through empty space.", false, "Sound needs a medium; space is a vacuum."),
            mc("A straw looks bent in a glass of water because of…", "refraction", ["reflection", "absorption", "amplitude"], "Light bends as it changes speed."),
          ],
        },
        {
          title: "Electricity and Magnetism",
          summary: "Electric and magnetic forces act at a distance and can be strengthened by design.",
          objectives: ["Identify factors that affect electric and magnetic force strength", "Build and test an electromagnet"],
          vocab: [["electric charge", "a property of matter that is positive or negative"], ["magnetic field", "the region around a magnet where its force acts"], ["electromagnet", "a magnet made by electric current in a coil of wire"]],
          standards: ["MS-PS2-3", "MS-PS2-5"],
          body: `
**Electric forces:** like charges repel, opposite charges attract. Rub a balloon on your hair: electrons move to the balloon, and it sticks to a wall.

**Magnetic forces:** like poles repel, opposite poles attract. Magnetic **fields** can be seen with iron filings.

**Both act at a distance** — no touching needed.

**Electromagnets:** a current in a coil of wire makes a magnetic field. Make it **stronger** by:
1. Adding **more coils** of wire
2. Using **more current** (more batteries)
3. Adding an **iron core** inside the coil

**Investigation:** wrap a nail with 10, 20, then 30 coils. Count how many paper clips each lifts. That's a fair test: change one variable, keep others the same.

**Uses:** junkyard cranes, speakers, MRI machines, maglev trains, door locks.`,
          questions: [
            mc("Which change makes an electromagnet stronger?", "Adding more coils of wire", ["Removing the iron core", "Using less current", "Using plastic wire"], "More coils strengthen the field."),
            mc("Two north poles placed near each other will…", "repel", ["attract", "do nothing", "become south poles"], "Like poles repel."),
            tf("A charged balloon can attract small bits of paper without touching them.", true, "Electric forces act at a distance."),
            mc("In the nail investigation, the independent variable is…", "the number of coils", ["the number of paper clips lifted", "the battery type", "the size of the nail"], "It's the variable you change on purpose."),
          ],
        },
      ],
    },
    {
      title: "Thermal Energy",
      description: "Relate temperature, mass, and thermal energy and design devices that control heat transfer.",
      lessons: [
        {
          title: "Thermal Energy and Temperature",
          summary: "Temperature measures average particle motion; thermal energy depends on temperature and mass.",
          objectives: ["Distinguish temperature from thermal energy", "Explain how mass and material affect energy needed to change temperature"],
          vocab: [["temperature", "the average kinetic energy of particles"], ["thermal energy", "the total kinetic energy of all particles in an object"], ["specific heat", "energy needed to raise 1 g of a substance by 1 °C"]],
          standards: ["MS-PS3-4"],
          body: `
**Temperature** = how fast particles move on **average**.
**Thermal energy** = the **total** energy of all particles.

A bathtub of warm water has **more thermal energy** than a cup of hot tea, even though the tea's temperature is higher — the tub has far more particles.

**Specific heat:** some materials need more energy to warm up.
| Material | Specific heat (J/g·°C) |
|---|---|
| Water | 4.18 |
| Aluminum | 0.90 |
| Iron | 0.45 |

That's why sand at the beach gets hot fast but the water stays cool.

**Investigation:** heat 100 g and 200 g of water with the same heater for 2 minutes. The 100 g sample rises about **twice as much** in temperature.`,
          questions: [
            mc("Which has more thermal energy?", "A swimming pool at 25 °C", ["A cup of cocoa at 80 °C", "They're equal", "Neither has thermal energy"], "More mass means more total particle energy."),
            mc("Why does beach sand heat faster than ocean water?", "Water has a higher specific heat", ["Sand is wetter", "Water reflects all sunlight", "Sand has more mass"], "Water needs much more energy per degree."),
            tf("Temperature measures the average kinetic energy of particles.", true, "That's the definition."),
            mc("Using the same heater, which warms the most in 2 minutes?", "100 g of water", ["200 g of water", "500 g of water", "All the same"], "Less mass → bigger temperature change."),
          ],
        },
        {
          title: "Heat Transfer and Insulation Design",
          summary: "Heat moves by conduction, convection, and radiation; engineers design to slow or speed it.",
          objectives: ["Identify conduction, convection, and radiation", "Design and test a device that minimizes heat transfer"],
          vocab: [["conduction", "heat transfer by direct contact"], ["convection", "heat transfer by moving fluids"], ["radiation", "heat transfer by electromagnetic waves"], ["insulator", "a material that slows heat transfer"]],
          standards: ["MS-PS3-3", "MS-ETS1-4"],
          body: `
Heat always flows from **hot to cold**.

| Method | How | Example |
|---|---|---|
| Conduction | direct contact | a metal spoon gets hot in soup |
| Convection | moving liquids or gases | warm air rising from a heater |
| Radiation | electromagnetic waves | feeling the sun's warmth |

**Conductors** (metals) transfer heat quickly. **Insulators** (foam, wool, air pockets, plastic) slow it.

**Engineering challenge: keep an ice cube frozen the longest.**
- Criteria: ice cube lasts 60+ minutes; fits in a cup
- Constraints: only cardboard, foil, cotton, foam, tape; $2 budget
- Design ideas: trap air (stops conduction and convection), shiny foil (reflects radiation)
- Test, measure meltwater, improve

**A thermos** uses all three ideas: a vacuum layer (no conduction or convection) and shiny walls (reflect radiation).`,
          questions: [
            mc("Feeling warmth from a campfire across the room is mostly…", "radiation", ["conduction", "convection", "insulation"], "Infrared waves travel through the air."),
            mc("Why does a puffy jacket keep you warm?", "Trapped air slows heat transfer", ["It makes heat", "It conducts heat away", "It reflects all light"], "Air pockets are insulators."),
            tf("Heat flows from colder objects to warmer objects.", false, "Heat flows from hot to cold."),
            mc("The vacuum layer in a thermos stops…", "conduction and convection", ["radiation only", "gravity", "evaporation only"], "With no particles, conduction and convection can't occur."),
          ],
        },
      ],
    },
  ],
  biology: [
    {
      title: "Matter and Energy in Living Systems",
      description: "Trace energy and carbon through organisms and ecosystems.",
      lessons: [
        {
          title: "Energy Flow and the Carbon Cycle",
          summary: "Energy flows one way through ecosystems while carbon cycles between living things and the environment.",
          objectives: ["Apply the 10% rule to energy pyramids", "Trace carbon through photosynthesis, respiration, and combustion", "Explain human effects on the carbon cycle"],
          vocab: [["trophic level", "a feeding position in a food chain"], ["carbon sink", "a reservoir that absorbs more carbon than it releases"], ["biomass", "the total mass of living matter"]],
          standards: ["HS-LS2-4", "HS-LS2-5"],
          body: `
**Energy flows one way.** About **10%** of energy passes to the next trophic level; the rest is lost as heat through respiration.

| Level | Energy |
|---|---|
| Producers (grass) | 10,000 kcal |
| Primary consumers (rabbits) | 1,000 kcal |
| Secondary consumers (foxes) | 100 kcal |
| Tertiary consumers (eagles) | 10 kcal |

That's why there are fewer top predators and why food chains rarely exceed 4–5 levels.

**Carbon cycles.**
- **Photosynthesis** removes CO₂ from the air → sugar in plants.
- **Respiration** (all organisms) releases CO₂.
- **Decomposition** returns carbon from dead matter.
- **Ocean** absorbs CO₂ (a major sink).
- **Fossil fuels** store ancient carbon; **combustion** releases it fast.

Since 1850, burning fossil fuels has raised atmospheric CO₂ from about 280 ppm to over 420 ppm.`,
          questions: [
            num("Producers store 50,000 kcal. Using the 10% rule, how many kcal reach secondary consumers?", 500, "50,000 → 5,000 → 500."),
            mc("Which process removes CO₂ from the atmosphere?", "Photosynthesis", ["Respiration", "Combustion", "Decomposition"], "Plants use CO₂ to build sugar."),
            tf("Most energy at each trophic level is lost as heat.", true, "About 90% is used or lost."),
            mc("What is the main reason atmospheric CO₂ has risen since 1850?", "Burning fossil fuels", ["More photosynthesis", "Volcanoes only", "Ocean cooling"], "Combustion releases stored ancient carbon."),
          ],
        },
        {
          title: "Photosynthesis and Cellular Respiration in Depth",
          summary: "Chloroplasts store energy in glucose; mitochondria release it as ATP.",
          objectives: ["Write the equations for photosynthesis and respiration", "Describe the stages of each process", "Compare aerobic and anaerobic respiration"],
          vocab: [["ATP", "the cell's energy currency"], ["chloroplast", "organelle where photosynthesis occurs"], ["mitochondrion", "organelle where aerobic respiration occurs"], ["fermentation", "anaerobic process that makes small amounts of ATP"]],
          standards: ["HS-LS1-5", "HS-LS1-7"],
          body: `
**Photosynthesis** (chloroplasts):
6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂
1. **Light reactions** (thylakoids): capture light, split water, release O₂, make ATP and NADPH.
2. **Calvin cycle** (stroma): use ATP and NADPH to build glucose from CO₂.

**Cellular respiration** (cytoplasm + mitochondria):
C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ~36 ATP
1. **Glycolysis** (cytoplasm): glucose → 2 pyruvate, 2 ATP
2. **Krebs cycle** (mitochondrial matrix): releases CO₂, makes electron carriers
3. **Electron transport chain** (inner membrane): makes most ATP; O₂ is the final electron acceptor

**Without oxygen — fermentation:**
- Muscles: lactic acid (the burn during a sprint)
- Yeast: ethanol + CO₂ (bread rises)
Only **2 ATP** per glucose vs. about 36 aerobically.

The two processes are near mirror images — the products of one are the reactants of the other.`,
          questions: [
            mc("Where does the Calvin cycle occur?", "Stroma of the chloroplast", ["Thylakoid membrane", "Mitochondrial matrix", "Cytoplasm"], "Glucose is built in the stroma."),
            mc("What is the final electron acceptor in the electron transport chain?", "Oxygen", ["Glucose", "Carbon dioxide", "Water"], "O₂ accepts electrons and forms water."),
            num("About how many ATP does fermentation produce per glucose?", 2, "Only glycolysis's 2 ATP."),
            tf("Yeast fermentation produces carbon dioxide, which makes bread rise.", true, "Ethanol and CO₂ are products."),
          ],
        },
      ],
    },
    {
      title: "Inheritance and Regulation",
      description: "Explain meiosis and how organisms maintain stable internal conditions.",
      lessons: [
        {
          title: "Meiosis and Genetic Variation",
          summary: "Meiosis makes four unique haploid gametes; crossing over and independent assortment create variation.",
          objectives: ["Compare mitosis and meiosis", "Explain sources of genetic variation in meiosis", "Describe effects of nondisjunction"],
          vocab: [["haploid", "having one set of chromosomes (n)"], ["diploid", "having two sets of chromosomes (2n)"], ["crossing over", "exchange of DNA between homologous chromosomes"], ["nondisjunction", "chromosomes fail to separate properly"]],
          standards: ["HS-LS3-2", "HS-LS3-1"],
          body: `
| | Mitosis | Meiosis |
|---|---|---|
| Purpose | growth, repair | make gametes |
| Divisions | 1 | 2 |
| Daughter cells | 2 diploid, identical | 4 haploid, unique |

**Sources of variation in meiosis**
1. **Crossing over** (prophase I): homologous chromosomes swap segments.
2. **Independent assortment** (metaphase I): each pair lines up randomly. With 23 pairs, that's 2²³ ≈ **8.4 million** combinations per parent.
3. **Random fertilization:** any sperm × any egg → about 70 trillion combinations.

**Mutations** add new alleles.

**Nondisjunction:** chromosomes fail to separate, giving a gamete an extra or missing chromosome. Trisomy 21 (three copies of chromosome 21) causes Down syndrome.`,
          questions: [
            num("A cell with 46 chromosomes undergoes meiosis. How many chromosomes are in each gamete?", 23, "Gametes are haploid."),
            mc("Crossing over occurs during…", "prophase I", ["anaphase II", "telophase of mitosis", "interphase"], "Homologs pair up and swap DNA in prophase I."),
            mc("How many cells result from meiosis?", "4 haploid cells", ["2 diploid cells", "2 haploid cells", "4 diploid cells"], "Two divisions produce four haploid cells."),
            tf("Independent assortment refers to the random orientation of chromosome pairs in metaphase I.", true, "Each pair lines up independently."),
          ],
        },
        {
          title: "Homeostasis and Feedback",
          summary: "Organisms use feedback loops to keep internal conditions stable.",
          objectives: ["Distinguish negative and positive feedback", "Explain how body systems interact to maintain homeostasis"],
          vocab: [["homeostasis", "maintaining stable internal conditions"], ["negative feedback", "a response that reverses a change"], ["positive feedback", "a response that amplifies a change"]],
          standards: ["HS-LS1-3", "HS-LS1-2"],
          body: `
**Homeostasis** keeps body temperature near 37 °C, blood glucose near 90 mg/dL, and blood pH near 7.4.

**Negative feedback** (most common): reverses a change.
- **Temperature:** too hot → sweat and dilate skin vessels; too cold → shiver and constrict vessels.
- **Blood sugar:** after a meal, glucose rises → pancreas releases **insulin** → cells absorb glucose → level falls. Between meals, **glucagon** raises it.

**Positive feedback** (rare): amplifies a change until an endpoint.
- Childbirth: contractions → oxytocin → stronger contractions → birth.
- Blood clotting.

**Systems interact:** during exercise, muscles need more O₂ → respiratory rate rises (respiratory system) and heart rate rises (circulatory system) → nervous system coordinates.

**When homeostasis fails:** type 1 diabetes — the pancreas makes too little insulin.`,
          questions: [
            mc("Shivering when cold is an example of…", "negative feedback", ["positive feedback", "no feedback", "mutation"], "It reverses the drop in temperature."),
            mc("Which hormone lowers blood glucose?", "Insulin", ["Glucagon", "Oxytocin", "Adrenaline"], "Insulin helps cells absorb glucose."),
            tf("Childbirth contractions are regulated by positive feedback.", true, "Each contraction triggers stronger ones."),
            mc("During exercise, which systems work together to deliver more oxygen?", "Respiratory and circulatory", ["Digestive and skeletal", "Reproductive and immune", "Excretory and integumentary"], "Breathing and heart rate increase together."),
          ],
        },
      ],
    },
  ],
  chemistry: [
    {
      title: "Bonding and Interactions",
      description: "Explain chemical bonding and the forces between molecules.",
      lessons: [
        {
          title: "Ionic and Covalent Bonding",
          summary: "Atoms transfer electrons to form ionic bonds or share them to form covalent bonds.",
          objectives: ["Predict bond type from electronegativity and element position", "Draw Lewis structures for simple molecules", "Relate bond type to properties"],
          vocab: [["ionic bond", "attraction between oppositely charged ions after electron transfer"], ["covalent bond", "a shared pair of electrons"], ["electronegativity", "an atom's pull on shared electrons"], ["valence electron", "an electron in the outermost shell"]],
          standards: ["HS-PS1-1", "HS-PS1-2"],
          body: `
Atoms bond to reach a stable **octet** (8 valence electrons).

**Ionic bonds:** metal + nonmetal. Electrons **transfer**.
Na (1 valence e⁻) gives an electron to Cl (7 valence e⁻) → Na⁺ and Cl⁻ → NaCl
- High melting points, brittle crystals, conduct electricity when dissolved

**Covalent bonds:** nonmetal + nonmetal. Electrons are **shared**.
- H₂O: oxygen shares one pair with each hydrogen
- Double bond: O=O; triple bond: N≡N
- Lower melting points, often gases or liquids

**Polar covalent:** unequal sharing. Oxygen is more electronegative than hydrogen, so in water O is slightly negative (δ⁻) and H slightly positive (δ⁺).

**Electronegativity difference** (rough guide): < 0.5 nonpolar, 0.5–1.7 polar covalent, > 1.7 ionic.

**Metallic bonds:** a "sea" of shared electrons → conductivity and malleability.`,
          questions: [
            mc("Which compound has ionic bonds?", "KBr", ["CO₂", "CH₄", "H₂O"], "K is a metal, Br is a nonmetal."),
            num("How many valence electrons does a neutral oxygen atom have?", 6, "Oxygen is in group 16."),
            mc("In a water molecule, which atom carries a partial negative charge?", "Oxygen", ["Hydrogen", "Neither", "Both equally"], "Oxygen is more electronegative."),
            tf("Ionic compounds conduct electricity when dissolved in water.", true, "Free-moving ions carry charge."),
          ],
        },
        {
          title: "Intermolecular Forces and Properties",
          summary: "Forces between molecules determine boiling point, solubility, and surface tension.",
          objectives: ["Rank intermolecular forces by strength", "Predict relative boiling points", "Explain 'like dissolves like'"],
          vocab: [["intermolecular force", "an attraction between molecules"], ["hydrogen bond", "strong attraction between H bonded to N, O, or F and a lone pair on another molecule"], ["London dispersion force", "weak temporary attraction present in all molecules"]],
          standards: ["HS-PS1-3"],
          body: `
**Intermolecular forces (IMFs)** are attractions *between* molecules (weaker than bonds *within* them).

From strongest to weakest:
1. **Hydrogen bonding** — H attached to N, O, or F (water, ammonia)
2. **Dipole–dipole** — between polar molecules (HCl)
3. **London dispersion** — all molecules; stronger in larger molecules

**Stronger IMFs → higher boiling point.**
| Substance | Molar mass | Boiling point |
|---|---|---|
| CH₄ | 16 | −162 °C |
| H₂S | 34 | −60 °C |
| H₂O | 18 | **100 °C** |

Water is lighter than H₂S but boils much higher because of hydrogen bonding.

**Like dissolves like:** polar dissolves polar (sugar in water); nonpolar dissolves nonpolar (oil in gasoline). Oil and water don't mix.

**Other effects:** surface tension (water striders), ice floating (H-bonds form an open lattice), capillary action.`,
          questions: [
            mc("Which intermolecular force is strongest?", "Hydrogen bonding", ["London dispersion", "Dipole–dipole", "They're all equal"], "H-bonds are the strongest IMF."),
            mc("Why does water have an unusually high boiling point?", "Hydrogen bonding", ["It has a high molar mass", "It's ionic", "It has no IMFs"], "H-bonds take a lot of energy to break."),
            tf("Oil doesn't dissolve in water because oil is nonpolar.", true, "Like dissolves like."),
            mc("Which substance has the highest boiling point?", "Octane (C₈H₁₈)", ["Methane (CH₄)", "Ethane (C₂H₆)", "Propane (C₃H₈)"], "Larger molecules have stronger dispersion forces."),
          ],
        },
      ],
    },
    {
      title: "Kinetics and Equilibrium",
      description: "Explain what affects reaction rates and how equilibrium responds to change.",
      lessons: [
        {
          title: "Reaction Rates and Collision Theory",
          summary: "Reactions happen when particles collide with enough energy and the right orientation.",
          objectives: ["Explain collision theory", "Predict effects of temperature, concentration, surface area, and catalysts on rate"],
          vocab: [["activation energy", "the minimum energy needed for a reaction"], ["catalyst", "a substance that speeds a reaction without being used up"], ["collision theory", "reactions require effective collisions"]],
          standards: ["HS-PS1-5", "HS-PS1-4"],
          body: `
**Collision theory:** particles must collide (1) with enough energy (≥ **activation energy**) and (2) in the right orientation.

**What speeds up a reaction?**
| Factor | Why |
|---|---|
| Higher temperature | faster particles → more collisions, more with enough energy |
| Higher concentration | more particles → more collisions |
| Greater surface area | more exposed particles (powder vs. chunk) |
| Catalyst | lowers activation energy |

**Rule of thumb:** a 10 °C increase roughly doubles many reaction rates.

**Examples**
- Food spoils slower in the fridge (lower temperature).
- Grain dust can explode; a pile of grain can't (surface area).
- Enzymes are biological catalysts: catalase breaks down H₂O₂ millions of times faster.
- Catalytic converters reduce car pollution.

**Energy diagrams** show activation energy as a hill; a catalyst makes a lower path.`,
          questions: [
            mc("Why does crushing a tablet make it dissolve faster?", "It increases surface area", ["It raises temperature", "It adds a catalyst", "It lowers concentration"], "More exposed particles."),
            mc("What does a catalyst do?", "Lowers activation energy", ["Raises activation energy", "Gets used up", "Changes the products"], "It provides an easier pathway."),
            tf("Refrigerating food slows reactions that cause spoilage.", true, "Lower temperature means fewer effective collisions."),
            num("A reaction rate doubles for every 10 °C rise. How many times faster is it at 40 °C than at 20 °C?", 4, "Two doublings: 2 × 2 = 4."),
          ],
        },
        {
          title: "Chemical Equilibrium and Le Châtelier's Principle",
          summary: "At equilibrium, forward and reverse rates are equal; a system shifts to counteract stress.",
          objectives: ["Describe dynamic equilibrium", "Predict shifts using Le Châtelier's principle", "Apply equilibrium to industrial design"],
          vocab: [["dynamic equilibrium", "forward and reverse reactions occur at equal rates"], ["Le Châtelier's principle", "a system at equilibrium shifts to relieve a stress"], ["reversible reaction", "a reaction that can proceed in both directions (⇌)"]],
          standards: ["HS-PS1-6"],
          body: `
**Dynamic equilibrium:** a reversible reaction where forward and reverse rates are **equal**. Concentrations stay constant, but reactions continue.

**Le Châtelier's principle:** if you stress a system at equilibrium, it **shifts to relieve the stress**.

**Haber process:** N₂ + 3H₂ ⇌ 2NH₃ + heat
| Stress | Shift |
|---|---|
| Add N₂ | right (more NH₃) |
| Remove NH₃ | right |
| Increase pressure | right (4 gas molecules → 2) |
| Increase temperature | left (reaction is exothermic) |
| Add catalyst | no shift — reaches equilibrium faster |

**Engineering trade-off:** low temperature favors NH₃ but is slow. Industry uses about 450 °C, high pressure (~200 atm), an iron catalyst, and removes NH₃ continuously. This process makes fertilizer that feeds about half the world.

**In your body:** CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻ helps keep blood pH stable.`,
          questions: [
            mc("For N₂ + 3H₂ ⇌ 2NH₃ + heat, what happens if temperature increases?", "Shifts left", ["Shifts right", "No shift", "The reaction stops"], "Adding heat favors the endothermic (reverse) direction."),
            mc("Adding a catalyst to a system at equilibrium…", "doesn't shift the equilibrium", ["shifts it right", "shifts it left", "stops the reaction"], "Catalysts speed both directions equally."),
            tf("At equilibrium, both forward and reverse reactions have stopped.", false, "They continue at equal rates."),
            mc("Increasing pressure on N₂ + 3H₂ ⇌ 2NH₃ shifts the equilibrium…", "right, toward fewer gas molecules", ["left, toward more gas molecules", "nowhere", "it depends on color"], "4 moles of gas → 2 moles."),
          ],
        },
      ],
    },
  ],
  physics: [
    {
      title: "Waves and Electricity",
      description: "Use wave equations and analyze electric circuits.",
      lessons: [
        {
          title: "The Wave Equation",
          summary: "Wave speed equals frequency times wavelength: v = fλ.",
          objectives: ["Use v = fλ to solve problems", "Compare sound and electromagnetic waves", "Explain how wave behavior enables technology"],
          vocab: [["period", "time for one complete wave, T = 1/f"], ["electromagnetic spectrum", "the range of EM waves from radio to gamma rays"], ["Doppler effect", "change in observed frequency due to relative motion"]],
          standards: ["HS-PS4-1", "HS-PS4-3"],
          body: `
**v = fλ** (speed = frequency × wavelength)

**Sound in air:** v ≈ 343 m/s
A 686 Hz tone: λ = 343 / 686 = **0.5 m**

**Light in a vacuum:** c = 3.0 × 10⁸ m/s
FM radio at 100 MHz: λ = 3×10⁸ / 1×10⁸ = **3 m**

**Period:** T = 1/f. A 50 Hz wave has T = 0.02 s.

**Electromagnetic spectrum** (long λ → short λ):
radio → microwaves → infrared → visible → ultraviolet → X-rays → gamma
Higher frequency = more energy per photon (that's why UV causes sunburn and X-rays require shielding).

**Doppler effect:** an approaching ambulance sounds higher pitched; receding, lower. Astronomers use it to measure the expansion of the universe (redshift).`,
          questions: [
            num("A wave has frequency 5 Hz and wavelength 2 m. What is its speed (m/s)?", 10, "v = 5 × 2."),
            num("Sound travels at 340 m/s. What is the wavelength (m) of a 170 Hz sound?", 2, "λ = 340/170."),
            mc("Which EM wave has the highest energy?", "Gamma rays", ["Radio waves", "Visible light", "Infrared"], "Highest frequency, highest energy."),
            num("What is the period (s) of a wave with frequency 4 Hz?", 0.25, "T = 1/f = 1/4."),
          ],
        },
        {
          title: "Charge, Current, and Ohm's Law",
          summary: "Current is the flow of charge; voltage pushes it and resistance limits it: V = IR.",
          objectives: ["Apply Coulomb's law qualitatively", "Use Ohm's law and power equations", "Analyze series and parallel circuits"],
          vocab: [["current (I)", "rate of charge flow, in amperes"], ["voltage (V)", "electric potential difference, in volts"], ["resistance (R)", "opposition to current, in ohms (Ω)"], ["power (P)", "rate of energy use, P = IV"]],
          standards: ["HS-PS2-4", "HS-PS3-1"],
          body: `
**Coulomb's law:** F = kq₁q₂/r². Like gravity, it's an inverse-square law: double the distance → ¼ the force.

**Ohm's law: V = IR**
A 12 V battery across a 4 Ω resistor: I = 12/4 = **3 A**

**Power: P = IV = I²R**
That circuit uses P = 3 × 12 = **36 W**

**Series circuits:** one path. R_total = R₁ + R₂ + … Current is the same everywhere. One bulb out → all out.

**Parallel circuits:** multiple paths. 1/R_total = 1/R₁ + 1/R₂ + … Voltage is the same across each branch. Adding branches **lowers** total resistance and raises total current. Homes are wired in parallel.

**Example:** two 6 Ω resistors
- Series: 12 Ω
- Parallel: 3 Ω`,
          questions: [
            num("A 9 V battery is connected to a 3 Ω resistor. What is the current (A)?", 3, "I = V/R = 9/3."),
            num("A device draws 2 A at 120 V. What is its power (W)?", 240, "P = IV = 2 × 120."),
            num("What is the total resistance (Ω) of 4 Ω and 6 Ω in series?", 10, "Add them."),
            num("What is the total resistance (Ω) of two 10 Ω resistors in parallel?", 5, "1/R = 1/10 + 1/10 = 2/10."),
          ],
        },
      ],
    },
    {
      title: "Fields and Forces at a Distance",
      description: "Model gravitational orbits and electromagnetic induction.",
      lessons: [
        {
          title: "Universal Gravitation and Orbits",
          summary: "Newton's law of gravitation explains falling apples, orbiting moons, and Kepler's laws.",
          objectives: ["Apply Newton's law of universal gravitation", "Relate orbital speed and radius", "Describe Kepler's laws"],
          vocab: [["universal gravitation", "F = Gm₁m₂/r²"], ["orbital period", "time for one complete orbit"], ["ellipse", "an oval-shaped orbit with two foci"]],
          standards: ["HS-PS2-4", "HS-ESS1-4"],
          body: `
**Newton's law of universal gravitation:**
F = G m₁m₂ / r², with G = 6.67 × 10⁻¹¹ N·m²/kg²

- Double one mass → double the force.
- Double the distance → **¼** the force (inverse square).

**Why the ISS "floats":** astronauts aren't weightless — gravity there is still about 90% of surface gravity. They're in **free fall**, moving sideways fast enough (~7.7 km/s) to keep missing Earth.

**Kepler's laws**
1. Orbits are **ellipses** with the sun at one focus.
2. Planets sweep equal areas in equal times (faster when closer).
3. T² ∝ r³ — farther planets have much longer years.

**Applications:** GPS satellites, geostationary weather satellites (24-hour orbit at ~36,000 km), and planning missions to Mars.`,
          questions: [
            mc("If the distance between two masses triples, the gravitational force becomes…", "1/9 as strong", ["1/3 as strong", "3 times stronger", "9 times stronger"], "Inverse square: 1/3² = 1/9."),
            mc("Why do astronauts on the ISS appear weightless?", "They are in continuous free fall", ["There is no gravity in orbit", "The station blocks gravity", "They are too far from Earth"], "They fall around Earth."),
            tf("According to Kepler, a planet moves fastest when it is closest to the sun.", true, "Equal areas in equal times."),
            mc("If one of two masses doubles, the gravitational force…", "doubles", ["halves", "quadruples", "stays the same"], "Force is proportional to each mass."),
          ],
        },
        {
          title: "Electromagnetism and Generators",
          summary: "Moving charges make magnetic fields, and changing magnetic fields make currents.",
          objectives: ["Describe how currents produce magnetic fields", "Explain electromagnetic induction", "Analyze motors and generators as energy converters"],
          vocab: [["electromagnetic induction", "producing current by changing a magnetic field through a coil"], ["generator", "converts mechanical energy into electrical energy"], ["motor", "converts electrical energy into mechanical energy"], ["transformer", "changes AC voltage using coils"]],
          standards: ["HS-PS2-5", "HS-PS3-3"],
          body: `
**Ørsted (1820):** a current-carrying wire deflects a compass. **Current → magnetic field.**

**Faraday (1831):** moving a magnet through a coil makes current. **Changing magnetic field → current.** This is **electromagnetic induction**.

More current is induced with:
- more coils
- a stronger magnet
- faster motion

**Generators:** turbines spin coils in magnetic fields (steam, wind, water) → electricity. Nearly all grid power comes from this.

**Motors:** current in a coil inside a magnet → force → spinning. The reverse of a generator.

**Transformers:** AC in one coil induces AC in another. Step-up transformers raise voltage for long-distance transmission (less energy lost as heat); step-down transformers lower it for homes.
Vₛ/Vₚ = Nₛ/Nₚ. A 10:1 step-down transformer turns 1,200 V into **120 V**.`,
          questions: [
            mc("A generator converts…", "mechanical energy to electrical energy", ["electrical energy to mechanical energy", "chemical energy to light", "heat to sound"], "Spinning coils produce current."),
            mc("Which change would increase the current induced in a coil?", "Moving the magnet faster", ["Using fewer coils", "Holding the magnet still", "Using a weaker magnet"], "Faster change in magnetic field → more current."),
            num("A transformer has 500 primary turns and 50 secondary turns. If the input is 2,400 V, what is the output (V)?", 240, "2400 × 50/500 = 240."),
            tf("A steady, unchanging magnetic field induces a current in a stationary coil.", false, "The field must change."),
          ],
        },
      ],
    },
  ],
  "env-science": [
    {
      title: "Water and Air",
      description: "Manage water resources and analyze air pollution.",
      lessons: [
        {
          title: "Water Resources and Management",
          summary: "Fresh water is limited and unevenly distributed; sustainable management balances many users.",
          objectives: ["Describe major water uses and sources", "Evaluate water conservation and management strategies"],
          vocab: [["aquifer", "an underground layer of rock that stores water"], ["watershed", "the land area that drains into a river or lake"], ["desalination", "removing salt from seawater"]],
          standards: ["HS-ESS3-1", "HS-ESS3-4"],
          body: `
**Global water use:**
| Sector | Share |
|---|---|
| Agriculture | ~70% |
| Industry | ~20% |
| Domestic | ~10% |

**Groundwater depletion:** the Ogallala Aquifer supplies about 30% of U.S. irrigation water. In parts of Kansas and Texas, it's being pumped far faster than it refills — some wells have run dry.

**The Colorado River** supplies 40 million people across seven states and Mexico; it often no longer reaches the sea.

**Solutions**
- **Drip irrigation:** delivers water to roots, using 30–50% less than flood irrigation
- **Water pricing** and tiered rates
- **Recycled wastewater** for irrigation (and drinking, in places like Singapore)
- **Desalination:** reliable, but energy-intensive and produces brine
- **Protecting watersheds** naturally filters water (New York City saves billions by protecting its Catskills watershed instead of building a filtration plant)`,
          questions: [
            num("About what percent of global freshwater use goes to agriculture?", 70, "Irrigation is the largest use.", { tolerance: 5 }),
            mc("Which irrigation method uses the least water?", "Drip irrigation", ["Flood irrigation", "Sprinklers at noon", "Furrow irrigation"], "It delivers water directly to roots."),
            tf("Desalination requires large amounts of energy.", true, "Removing salt is energy-intensive."),
            mc("The land area that drains into a river is its…", "watershed", ["aquifer", "floodplain", "delta"], "All water in a watershed flows to the same outlet."),
          ],
        },
        {
          title: "Air Pollution and the Ozone Layer",
          summary: "Pollutants from combustion harm health; global cooperation repaired the ozone layer.",
          objectives: ["Identify major air pollutants and their sources", "Distinguish ground-level ozone from stratospheric ozone", "Evaluate the Montreal Protocol as a policy model"],
          vocab: [["particulate matter (PM2.5)", "tiny particles that penetrate deep into lungs"], ["smog", "air pollution formed when sunlight reacts with emissions"], ["CFCs", "chlorofluorocarbons, chemicals that destroy stratospheric ozone"]],
          standards: ["HS-ESS3-4", "HS-ESS3-6"],
          body: `
**Major air pollutants**
| Pollutant | Main source | Effect |
|---|---|---|
| PM2.5 | combustion, wildfires | lung and heart disease |
| NOₓ | vehicles, power plants | smog, acid rain |
| SO₂ | coal burning | acid rain |
| CO | incomplete combustion | blocks oxygen in blood |
| Ground-level O₃ | sunlight + NOₓ + VOCs | smog, asthma |

**Ozone: good up high, bad nearby.**
- **Stratospheric ozone** (15–35 km up) absorbs UV radiation and protects life.
- **Ground-level ozone** is a harmful pollutant.

**The ozone hole:** CFCs from refrigerants and spray cans broke down stratospheric ozone over Antarctica. The **Montreal Protocol (1987)** phased out CFCs; every UN country signed. The ozone layer is projected to recover by about 2066 over Antarctica — a model of global environmental cooperation.

**Clean Air Act (1970):** U.S. emissions of six common pollutants fell about 78% while the economy grew.`,
          questions: [
            mc("What does stratospheric ozone do?", "Absorbs harmful UV radiation", ["Causes smog", "Causes acid rain", "Produces oxygen"], "It shields Earth's surface from UV."),
            mc("Which chemicals damaged the ozone layer?", "CFCs", ["CO₂", "Methane", "Water vapor"], "Chlorine from CFCs destroys ozone."),
            tf("Ground-level ozone is beneficial to human health.", false, "It's a lung irritant and smog component."),
            mc("Acid rain is mainly caused by…", "SO₂ and NOₓ", ["CO₂ and O₂", "PM2.5 only", "CFCs"], "These form sulfuric and nitric acids."),
          ],
        },
      ],
    },
    {
      title: "Food and Waste",
      description: "Evaluate sustainable agriculture and circular approaches to waste.",
      lessons: [
        {
          title: "Sustainable Agriculture",
          summary: "Farming practices can protect soil, water, and biodiversity while feeding a growing population.",
          objectives: ["Describe environmental impacts of conventional agriculture", "Evaluate sustainable farming practices"],
          vocab: [["monoculture", "growing a single crop over a large area"], ["cover crop", "a crop planted to protect and enrich soil between harvests"], ["integrated pest management (IPM)", "combining methods to control pests with minimal chemicals"]],
          standards: ["HS-ESS3-2", "HS-LS2-7"],
          body: `
**Challenge:** feed nearly 10 billion people by 2050 without destroying the land and water we depend on.

**Impacts of conventional farming**
- **Soil erosion:** bare fields lose topsoil; the 1930s Dust Bowl is the extreme example.
- **Fertilizer runoff:** excess nitrogen flows down the Mississippi and creates a **dead zone** in the Gulf of Mexico.
- **Monocultures** reduce biodiversity and are vulnerable to pests.
- **Habitat loss:** agriculture uses about half of Earth's habitable land.

**Sustainable practices**
- **Cover crops** and **no-till farming** hold soil and build organic matter
- **Crop rotation** breaks pest cycles and restores nitrogen (legumes)
- **IPM:** beneficial insects, crop rotation, targeted spraying only when needed
- **Precision agriculture:** GPS and sensors apply exactly the water and fertilizer needed
- **Reducing food waste:** about one-third of food produced is wasted

**Diet matters:** producing 1 kg of beef requires far more land and water than 1 kg of beans.`,
          questions: [
            mc("What causes the Gulf of Mexico dead zone?", "Fertilizer runoff", ["Oil spills only", "Overfishing", "Cold water"], "Excess nutrients cause algal blooms that use up oxygen."),
            mc("Planting legumes in a crop rotation helps because they…", "add nitrogen to the soil", ["remove all pests", "need no water", "grow in the dark"], "Legumes host nitrogen-fixing bacteria."),
            tf("About one-third of food produced worldwide is wasted.", true, "Reducing waste is a major sustainability lever."),
            mc("Which practice reduces soil erosion?", "Cover crops", ["Leaving fields bare in winter", "Plowing every week", "Monoculture"], "Roots hold soil in place."),
          ],
        },
        {
          title: "Waste and the Circular Economy",
          summary: "A circular economy designs out waste by reusing, repairing, and recycling materials.",
          objectives: ["Compare linear and circular economies", "Evaluate waste management options using the waste hierarchy", "Design a solution to reduce waste"],
          vocab: [["circular economy", "an economy that keeps materials in use as long as possible"], ["waste hierarchy", "reduce > reuse > recycle > recover > dispose"], ["life-cycle analysis", "assessing environmental impact from raw material to disposal"]],
          standards: ["HS-ESS3-3", "HS-ETS1-3"],
          body: `
**Linear economy:** take → make → use → throw away.
**Circular economy:** design products to be reused, repaired, remanufactured, and recycled.

**Waste hierarchy** (best to worst):
1. **Reduce** — avoid making waste
2. **Reuse** — refillable bottles, repair cafés
3. **Recycle** — turn materials into new products
4. **Recover** — compost or waste-to-energy
5. **Dispose** — landfill

**U.S. facts:** each person produces about 2 kg of trash per day. Only about 9% of plastic ever made has been recycled.

**Life-cycle analysis** compares options fairly. A cotton tote must be reused many times to beat a plastic bag on total impact — but only if it's actually reused.

**Circular examples:** aluminum cans (recycled endlessly, saving 95% of the energy of new aluminum), modular phones, clothing take-back programs, composting food waste.`,
          questions: [
            mc("According to the waste hierarchy, which is best?", "Reduce", ["Recycle", "Landfill", "Incinerate"], "Avoiding waste in the first place is best."),
            num("Recycling aluminum saves about what percent of the energy needed to make new aluminum?", 95, "Recycled aluminum needs only about 5% of the energy.", { tolerance: 2 }),
            tf("A linear economy keeps materials in use as long as possible.", false, "That describes a circular economy."),
            mc("A life-cycle analysis evaluates…", "impacts from raw materials through disposal", ["only the price", "only recycling rates", "only manufacturing"], "It covers the product's whole life."),
          ],
          writtenPrompt: "Choose one product your family throws away every week. Propose a circular redesign or system that keeps it in use, and explain the trade-offs (cost, convenience, environmental impact).",
          rubric: "Identifies a specific product (2) · Describes a realistic circular solution (4) · Explains at least two trade-offs (4)",
        },
      ],
    },
  ],
};
