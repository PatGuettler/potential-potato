/** 20 science lessons: biology, chemistry, physics, earth science */
export const scienceLessons = [
  {
    id: "sci001",
    title: "The Scientific Method",
    summary: "Learn how scientists ask questions, test ideas, and build reliable knowledge.",
    difficulty: "Easy",
    estimatedMinutes: 25,
    tags: "scientific-method|inquiry|basics",
    content: `The scientific method is a systematic way to investigate the natural world.

**Typical steps:**
1. **Observe** a phenomenon and ask a clear question.
2. **Research** what is already known.
3. **Hypothesis** — propose a testable explanation.
4. **Experiment** — design a fair test with one changed variable (independent variable) and measure outcomes (dependent variable). Keep other conditions the same (controlled variables).
5. **Analyze** data using tables, graphs, and statistics where appropriate.
6. **Conclusion** — state whether evidence supports or refutes the hypothesis.
7. **Communicate** results so others can replicate the work.

**Key ideas:**
- A hypothesis must be **falsifiable** (it can be shown wrong by evidence).
- **Peer review** helps catch errors before ideas are widely accepted.
- Scientific knowledge is **provisional** — it improves when new evidence appears.`,
    answerGuide: `Emphasize: testable hypothesis, controlled experiments, replication. Distinguish hypothesis (educated guess) from theory (well-supported explanation) and law (description of a pattern). Common error: "proving" a hypothesis — scientists support or fail to support it.`,
    answer: `Students should describe the scientific method as a cycle of observation, question, hypothesis, controlled experiment, data analysis, and conclusion. They should define a hypothesis as a testable explanation, identify independent and dependent variables, and explain why replication and peer review increase reliability.`,
  },
  {
    id: "sci002",
    title: "States of Matter",
    summary: "Understand solids, liquids, gases, and how particles behave in each state.",
    difficulty: "Easy",
    estimatedMinutes: 20,
    tags: "matter|particles|phase",
    content: `Matter is made of tiny particles (atoms or molecules) in constant motion.

**States at ordinary conditions:**
- **Solid** — particles are closely packed in a fixed arrangement; shape and volume are definite.
- **Liquid** — particles are close but can slide past each other; definite volume, variable shape.
- **Gas** — particles are far apart and move freely; volume and shape expand to fill their container.

**Phase changes** (temperature/pressure change energy):
- Melting (solid → liquid), freezing (liquid → solid)
- Vaporization/boiling (liquid → gas), condensation (gas → liquid)
- Sublimation (solid → gas), deposition (gas → solid)

**Plasma** is a high-energy state with ionized particles (e.g., in stars and fluorescent lights).`,
    answerGuide: `Link particle spacing and motion to macroscopic properties. Energy is absorbed during melting/vaporization and released during freezing/condensation (latent heat at phase-change temperature).`,
    answer: `Students should compare solids, liquids, and gases using particle spacing and motion. They should name phase changes and note that temperature/pressure determine state. Example: ice melts at 0°C at standard pressure when energy is added.`,
  },
  {
    id: "sci003",
    title: "Cell Structure and Function",
    summary: "Explore the basic parts of cells and how they support life.",
    difficulty: "Easy",
    estimatedMinutes: 30,
    tags: "biology|cells|life",
    content: `The **cell** is the smallest unit of life. All living organisms are made of one or more cells.

**Cell theory (core ideas):**
1. All living things are composed of cells.
2. The cell is the basic unit of structure and function.
3. New cells come from existing cells.

**Prokaryotic cells** (bacteria, archaea) lack a membrane-bound nucleus.
**Eukaryotic cells** (plants, animals, fungi, protists) have a nucleus and organelles.

**Common organelles (eukaryotes):**
- **Nucleus** — stores DNA; controls activities
- **Mitochondria** — aerobic respiration; ATP energy
- **Ribosomes** — protein synthesis
- **Cell membrane** — controls entry/exit
- **Chloroplasts** (plants) — photosynthesis
- **Cell wall** (plants, fungi, bacteria) — structural support

**Unicellular** organisms are one cell; **multicellular** organisms have specialized cell types.`,
    answerGuide: `Contrast prokaryote vs eukaryote. Plant cells have chloroplasts and cell walls; animal cells do not. ATP is the cell's energy currency from cellular respiration.`,
    answer: `Students should state cell theory, compare prokaryotic and eukaryotic cells, and describe functions of nucleus, mitochondria, ribosomes, and membrane. They should give one plant-only structure (chloroplast or cell wall).`,
  },
  {
    id: "sci004",
    title: "Earth's Internal Structure",
    summary: "Learn the layers inside Earth and how we know about them.",
    difficulty: "Easy",
    estimatedMinutes: 25,
    tags: "earth-science|geology|layers",
    content: `Earth is layered by composition and by physical behavior.

**By composition:**
- **Crust** — thin outer rock (continental and oceanic)
- **Mantle** — hot, mostly solid rock that flows slowly
- **Core** — mostly iron and nickel; **outer core** is liquid, **inner core** is solid

**By physical behavior (rheology):**
- **Lithosphere** — rigid plates (crust + upper mantle)
- **Asthenosphere** — weaker, ductile mantle below plates

**Evidence for structure:**
- Seismic waves change speed and reflect at boundaries (Mohorovičić discontinuity, core-mantle boundary)
- Meteorite composition suggests an iron-rich core
- Earth's magnetic field is generated by motion in the liquid outer core (geodynamo)`,
    answerGuide: `Oceanic crust is thinner and denser than continental crust. Plate tectonics acts on the lithosphere. P-waves travel through liquid; S-waves do not pass through the outer core.`,
    answer: `Students should list crust, mantle, and core, note liquid outer core and solid inner core, and cite seismic waves as evidence. They should connect the outer core to Earth's magnetic field.`,
  },
  {
    id: "sci005",
    title: "Forms of Energy",
    summary: "Identify energy types and how energy transforms while total energy is conserved.",
    difficulty: "Easy",
    estimatedMinutes: 25,
    tags: "physics|energy|conservation",
    content: `**Energy** is the capacity to do work or transfer heat.

**Common forms:**
- **Kinetic** — motion (KE = ½mv²)
- **Gravitational potential** — height in a field (PE = mgh near Earth's surface)
- **Thermal** — random motion of particles (temperature related)
- **Chemical** — stored in bonds (food, fuels, batteries)
- **Electrical** — moving charges and fields
- **Light (electromagnetic)** — radiation
- **Nuclear** — binding energy in atomic nuclei

**Law of conservation of energy:** In an isolated system, total energy stays constant; it transforms between forms. In real systems, some mechanical energy often becomes thermal energy (friction) — not "lost," but spread out.`,
    answerGuide: `Distinguish energy from force. Efficiency is useful output divided by total input. Units: joule (J) in SI.`,
    answer: `Students should define energy, list at least four forms with examples, and state conservation of energy. Example: a falling book converts gravitational potential energy to kinetic energy (and some thermal from air resistance).`,
  },
  {
    id: "sci006",
    title: "Photosynthesis",
    summary: "How plants capture light energy to build sugars and release oxygen.",
    difficulty: "Easy",
    estimatedMinutes: 30,
    tags: "biology|plants|energy",
    content: `**Photosynthesis** converts light energy into chemical energy stored in sugars.

**Overall equation (simplified):**
6 CO₂ + 6 H₂O + light energy → C₆H₁₂O₆ + 6 O₂

**Where it occurs:** Chloroplasts, mainly in leaf mesophyll cells. **Chlorophyll** absorbs red and blue light (green light is mostly reflected).

**Two main stages:**
1. **Light-dependent reactions** (thylakoid membranes) — light splits water; produces ATP, NADPH, and O₂ as a by-product.
2. **Calvin cycle** (stroma) — uses ATP and NADPH to fix CO₂ into carbohydrates.

**Ecological role:** Producers form the base of most food webs; photosynthesis also shapes atmospheric O₂ and CO₂ levels.`,
    answerGuide: `Reactants: CO₂ and H₂O. Products: glucose (or other sugars) and O₂. Oxygen comes from water splitting, not from CO₂. Connect to food chains and carbon cycle.`,
    answer: `Students should write the balanced summary equation, state that chloroplasts/chlorophyll are required, and explain that plants produce O₂ and organic molecules while consuming CO₂. They should place photosynthesis at the base of food webs.`,
  },
  {
    id: "sci007",
    title: "The Water Cycle",
    summary: "Follow water as it moves through oceans, air, land, and living things.",
    difficulty: "Easy",
    estimatedMinutes: 25,
    tags: "earth-science|water|cycle",
    content: `Water cycles through Earth's **hydrosphere**, **atmosphere**, **biosphere**, and **geosphere**.

**Main processes:**
1. **Evaporation** — liquid water → water vapor (sun-driven; also **transpiration** from plants)
2. **Condensation** — vapor forms liquid droplets (clouds)
3. **Precipitation** — rain, snow, sleet, hail
4. **Collection/runoff** — water flows in rivers and soaks into **groundwater**

**Energy source:** Solar radiation powers evaporation. Gravity drives precipitation and runoff.

**Importance:** Distributes fresh water, moves nutrients, regulates regional climate. About 97% of Earth's water is in oceans; most fresh water is ice or groundwater.`,
    answerGuide: `Include transpiration as biological evaporation. Groundwater and aquifers are part of collection. Human use (irrigation, reservoirs) alters but does not replace the cycle.`,
    answer: `Students should describe evaporation, condensation, precipitation, and collection in order, name solar energy as the driver, and explain why the cycle matters for life and climate.`,
  },
  {
    id: "sci008",
    title: "Newton's Laws of Motion",
    summary: "Apply three fundamental laws that predict how forces affect motion.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "physics|forces|motion",
    content: `**First law (inertia):** If net force on an object is zero, its velocity stays constant (including rest).

**Second law:** Net force equals mass times acceleration: **F_net = ma** (SI: newtons, kilograms, m/s²).

**Third law:** Forces occur in equal-and-opposite pairs on different objects: if A pushes B, B pushes A with the same magnitude and opposite direction.

**Free-body diagrams** show forces as arrows (gravity, normal force, friction, tension, applied pushes/pulls).

**Friction:** Static friction prevents start of motion; kinetic friction opposes sliding. On smooth surfaces friction is smaller.

**Weight vs mass:** Weight = mg (force, newtons); mass (kg) is amount of matter.`,
    answerGuide: `Net force causes acceleration, not motion itself. Third-law pairs act on different bodies — they do not cancel on one object. g ≈ 9.8 m/s² near Earth's surface.`,
    answer: `Students should state all three laws in their own words, use F=ma with correct units, draw a simple free-body diagram, and give a third-law example (rocket exhaust pushes rocket forward).`,
  },
  {
    id: "sci009",
    title: "Atomic Structure",
    summary: "Protons, neutrons, electrons, and how the periodic table is organized.",
    difficulty: "Medium",
    estimatedMinutes: 30,
    tags: "chemistry|atoms|periodic-table",
    content: `Atoms contain a dense **nucleus** (protons + neutrons) surrounded by **electrons**.

**Subatomic particles:**
- **Proton** — positive charge, defines atomic number Z
- **Neutron** — no charge, contributes to mass number A
- **Electron** — negative charge, occupies orbitals/energy levels; in neutral atoms, electron count = proton count

**Isotopes** — same Z, different neutron number (e.g., carbon-12 vs carbon-14).

**Periodic table:**
- Rows = **periods** (energy levels)
- Columns = **groups** with similar valence electron patterns
- Metals, metalloids, nonmetals show distinct properties

**Ions** form when atoms gain or lose electrons (cations +, anions −).`,
    answerGuide: `Atomic number = protons. Mass number ≈ protons + neutrons. Electrons determine chemical behavior. Avoid saying electrons orbit in fixed circles — use energy levels/orbitals at intro level.`,
    answer: `Students should identify proton, neutron, electron charges and locations, define atomic number and isotope, and explain that the periodic table is organized by increasing atomic number with repeating chemical properties in groups.`,
  },
  {
    id: "sci010",
    title: "Ecosystems and Food Webs",
    summary: "Energy flow, roles of organisms, and interactions in ecosystems.",
    difficulty: "Medium",
    estimatedMinutes: 30,
    tags: "biology|ecology|energy",
    content: `An **ecosystem** includes living (**biotic**) and nonliving (**abiotic**) parts interacting in an area.

**Trophic levels:**
- **Producers** (autotrophs) — photosynthesis or chemosynthesis
- **Primary consumers** — herbivores
- **Secondary/tertiary consumers** — carnivores/omnivores
- **Decomposers** — recycle nutrients (bacteria, fungi)

**Food chains** show one path; **food webs** show multiple linked chains.

**Energy rule:** Roughly **10%** of energy transfers to the next level; the rest is lost mainly as heat in metabolism — limits chain length.

**Biomass pyramids** usually narrow at the top for terrestrial systems.

**Abiotic factors:** sunlight, water, temperature, soil, nutrients shape distribution of life.`,
    answerGuide: `Nutrients (N, P, carbon) cycle; energy flows one way. Keystone species disproportionately affect community structure. Habitat vs niche distinction is useful.`,
    answer: `Students should define producer/consumer/decomposer, contrast food chain and web, explain ~10% energy transfer, and list three abiotic factors affecting ecosystems.`,
  },
  {
    id: "sci011",
    title: "Plate Tectonics",
    summary: "How Earth's lithospheric plates move and shape earthquakes, volcanoes, and mountains.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "earth-science|tectonics|geology",
    content: `Earth's **lithosphere** is broken into plates that move slowly on the **asthenosphere**.

**Three plate boundaries:**
- **Divergent** — plates separate (mid-ocean ridges, rift valleys); new crust forms
- **Convergent** — plates collide (subduction zones, continental collision); earthquakes and volcanoes common
- **Transform** — plates slide past (e.g., San Andreas Fault); earthquakes

**Driving mechanism:** Mantle **convection** plus slab pull at subduction zones move plates (rates ~ cm/year).

**Evidence:** Continent shapes fit, matching fossils/rock ages across oceans, seafloor spreading stripes, earthquake/volcano patterns.

**Continental drift** was proposed by Wegener; plate tectonics explains the mechanism.`,
    answerGuide: `Oceanic crust subducts under continental crust because it is denser. Himalayas from continental collision. Hot spots (Hawaii) are volcanic chains over mantle plumes.`,
    answer: `Students should describe three boundary types with one landform or hazard each, cite seafloor spreading or fossil evidence, and state that mantle convection helps drive plate motion.`,
  },
  {
    id: "sci012",
    title: "Acids, Bases, and pH",
    summary: "Measure acidity, common lab acids/bases, and neutralization reactions.",
    difficulty: "Medium",
    estimatedMinutes: 30,
    tags: "chemistry|acids|ph",
    content: `**Acids** increase H⁺ concentration in water; **bases** increase OH⁻ (or accept H⁺).

**pH scale** (0–14 at 25°C, pure water pH 7):
- pH < 7 acidic; pH > 7 basic; pH 7 neutral
- Each pH unit is a **tenfold** change in H⁺ activity

**Indicators** (litmus, phenolphthalein, universal indicator) show approximate pH.

**Neutralization:** Acid + base → salt + water  
Example: HCl + NaOH → NaCl + H₂O

**Safety:** Strong acids/bases are corrosive; always add acid to water when diluting, never the reverse.

**Everyday examples:** Stomach acid (HCl), soap bases, vinegar (acetic acid), baking soda (base).`,
    answerGuide: `Logarithmic pH scale is challenging — emphasize factor-of-10 steps. Buffers resist pH change (blood bicarbonate). Arrhenius model is sufficient at this level.`,
    answer: `Students should define acid and base using H⁺/OH⁻, interpret pH numbers, describe neutralization products, and give two household examples with approximate acidic/basic character.`,
  },
  {
    id: "sci013",
    title: "Waves and Sound",
    summary: "Properties of waves and how sound travels through matter.",
    difficulty: "Medium",
    estimatedMinutes: 30,
    tags: "physics|waves|sound",
    content: `A **wave** transfers energy without transferring matter.

**Types:**
- **Transverse** — particle motion perpendicular to direction (light, string waves)
- **Longitudinal** — particle motion parallel to direction (**sound** in air)

**Key terms:**
- **Wavelength (λ)** — distance between repeating points
- **Frequency (f)** — cycles per second (hertz, Hz)
- **Amplitude** — maximum displacement; relates to loudness for sound
- **Wave speed:** v = fλ

**Sound** needs a medium (solids, liquids, gases); it cannot travel through a vacuum. Speed in air ≈ 343 m/s at room temperature.

**Pitch** is perceived frequency; **loudness** relates to amplitude. Ultrasound (>20 kHz) and infrasound (<20 Hz) are outside human hearing.`,
    answerGuide: `Echo is reflected sound. Doppler effect shifts frequency when source or observer moves. Protect hearing from prolonged high amplitude.`,
    answer: `Students should define wavelength, frequency, and amplitude, use v=fλ, explain why sound needs a medium, and contrast pitch and loudness.`,
  },
  {
    id: "sci014",
    title: "DNA, Genes, and Heredity",
    summary: "How genetic information is stored and passed from parents to offspring.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "biology|genetics|dna",
    content: `**DNA** (deoxyribonucleic acid) stores hereditary information in a sequence of four bases: A, T, C, G (paired A–T, C–G in the double helix).

**Gene** — a segment of DNA that codes for a functional product (often a protein).

**Chromosomes** — long DNA molecules with proteins; humans have 23 pairs in most body cells.

**Mitosis** — produces two genetically identical diploid cells for growth/repair.

**Meiosis** — produces gametes with half the chromosome number; **crossing over** and random assortment increase genetic variation.

**Mendelian inheritance (single gene):**
- **Alleles** — alternate forms of a gene
- **Dominant** allele can mask **recessive** in heterozygotes
- Punnett squares predict offspring ratios for simple traits`,
    answerGuide: `Diploid (2n) vs haploid (n). Somatic vs gamete. DNA → RNA → protein is central dogma (intro level). Not all traits are single-gene (height is polygenic).`,
    answer: `Students should describe DNA's role, define gene and allele, contrast mitosis and meiosis, and use a Punnett square for a monohybrid cross (e.g., Bb × Bb).`,
  },
  {
    id: "sci015",
    title: "Chemical Reactions and Equations",
    summary: "Represent reactions with balanced equations and recognize reaction types.",
    difficulty: "Hard",
    estimatedMinutes: 40,
    tags: "chemistry|reactions|equations",
    content: `A **chemical reaction** rearranges atoms to form new substances.

**Chemical equation:** reactants → products  
Example: 2H₂ + O₂ → 2H₂O

**Balancing** uses coefficients so atom counts match on both sides (never change subscripts).

**Reaction types:**
- **Synthesis** A + B → AB
- **Decomposition** AB → A + B
- **Single replacement** A + BC → AC + B
- **Double replacement** AB + CD → AD + CB
- **Combustion** fuel + O₂ → CO₂ + H₂O (hydrocarbons; incomplete combustion can produce CO)

**Evidence of reaction:** color change, gas bubbles, precipitate, temperature change.

**Conservation of mass:** Total mass of closed system unchanged (atoms are rearranged).`,
    answerGuide: `Coefficients multiply entire formulas. Ionic equations and net ionic forms come later. Oxidation–reduction can be introduced via combustion and single replacement.`,
    answer: `Students should balance a simple equation (e.g., Fe + O₂ → Fe₂O₃), name two reaction types with examples, list three signs a reaction occurred, and state the law of conservation of mass.`,
  },
  {
    id: "sci016",
    title: "Electricity and Simple Circuits",
    summary: "Voltage, current, resistance, and series vs parallel circuits.",
    difficulty: "Hard",
    estimatedMinutes: 40,
    tags: "physics|electricity|circuits",
    content: `Electric **current (I)** is flow of charge (amperes, A). **Voltage (V)** is energy per charge (volts). **Resistance (R)** opposes current (ohms, Ω).

**Ohm's law (many conductors):** V = IR

**Circuit elements:**
- **Battery** — provides potential difference
- **Resistor** — limits current
- **Switch** — opens/closes path

**Series:** one path — current same everywhere; voltages add; resistances add: R_total = R₁ + R₂

**Parallel:** branches — voltage same across branches; currents split; 1/R_total = 1/R₁ + 1/R₂

**Power:** P = IV (watts)

**Safety:** Household current can be lethal; water lowers resistance of skin; use insulated tools and GFCI protection.`,
    answerGuide: `Conventional current is + to −. Electron flow is opposite. Short circuit: very low resistance path. Fuses/breakers limit current.`,
    answer: `Students should define V, I, R with units, apply V=IR to one resistor, compare series vs parallel brightness of two identical bulbs qualitatively, and state P=IV.`,
  },
  {
    id: "sci017",
    title: "Climate and the Greenhouse Effect",
    summary: "Earth's energy balance, natural greenhouse effect, and human climate drivers.",
    difficulty: "Hard",
    estimatedMinutes: 40,
    tags: "earth-science|climate|atmosphere",
    content: `**Climate** is long-term average weather; **weather** is short-term conditions.

**Earth's energy balance:**
- Incoming **shortwave** solar radiation is partly reflected (clouds, ice, aerosols).
- Absorbed energy warms surface; Earth emits **longwave** infrared radiation.

**Natural greenhouse effect:** Atmospheric gases (H₂O, CO₂, CH₄, N₂O) absorb outgoing IR and re-emit energy, keeping Earth's mean surface temperature habitable (~15°C average).

**Enhanced greenhouse effect:** Burning fossil fuels and land-use change increase atmospheric CO₂ and CH₄, strengthening IR absorption — observed **global mean temperature rise** since industrial era, with corroborating evidence: ocean heat content, ice loss, sea-level rise, earlier springs.

**Mitigation/adaptation:** Reduce emissions (efficiency, renewables), protect forests, prepare infrastructure for extremes.`,
    answerGuide: `Distinguish correlation vs causation using multiple independent lines of evidence. Weather events ≠ climate trend. Methane is potent but shorter-lived than CO₂.`,
    answer: `Students should contrast weather and climate, explain natural greenhouse effect vs enhanced effect, name two greenhouse gases and a human source of CO₂, and list two observed impacts of recent warming.`,
  },
  {
    id: "sci018",
    title: "Thermodynamics Essentials",
    summary: "Heat, temperature, laws of thermodynamics, and entropy at an introductory level.",
    difficulty: "Hard",
    estimatedMinutes: 45,
    tags: "physics|thermodynamics|heat",
    content: `**Temperature** measures average kinetic energy of particles (not the same as heat).

**Heat (Q)** is energy transferred due to temperature difference (joules). Flows hot → cold until equilibrium.

**Specific heat capacity (c):** Q = mcΔT — how much energy raises 1 kg by 1°C.

**Zeroth law:** Thermal equilibrium is transitive (thermometers work).

**First law:** ΔU = Q − W — internal energy change equals heat added minus work done **by** system.

**Second law:** Natural processes increase total **entropy** of universe; heat engines cannot be 100% efficient. **Carnot** sets ideal maximum efficiency bounded by hot/cold reservoir temperatures.

**Third law:** Entropy approaches a minimum as temperature approaches absolute zero (0 K).`,
    answerGuide: `Entropy is dispersal of energy/microstates — qualitative OK. Refrigerators move heat from cold to hot with work input. Perpetual motion machines violate laws.`,
    answer: `Students should distinguish heat and temperature, use Q=mcΔT, state first law in words, and explain second law as energy spreading out (engines waste some energy as heat).`,
  },
  {
    id: "sci019",
    title: "Evolution by Natural Selection",
    summary: "How populations change over generations through variation, selection, and inheritance.",
    difficulty: "Hard",
    estimatedMinutes: 40,
    tags: "biology|evolution|natural-selection",
    content: `**Evolution** is change in heritable traits in populations over time.

**Natural selection requirements:**
1. **Variation** in traits
2. **Heritability** (genetic component)
3. **Differential reproduction** (fitness differences)
4. **Time** across generations

**Result:** Alleles that improve survival/reproduction in a given environment become more common — **adaptation**.

**Other mechanisms:** genetic drift (chance, strong in small populations), gene flow (migration), mutation (ultimate source of new alleles).

**Speciation** can occur when populations are reproductively isolated (geographic, behavioral, temporal barriers).

**Evidence:** Fossils, comparative anatomy, embryology, molecular DNA sequences, observed selection (antibiotic resistance). **Common ancestry** explains unity and diversity of life.`,
    answerGuide: `Evolution is change in populations, not individuals "trying" to evolve. Fitness is reproductive success in an environment. "Survival of the fittest" is misleading without reproduction.`,
    answer: `Students should list four requirements for natural selection, define adaptation, name two evidence sources for evolution, and explain antibiotic resistance as selection on bacteria.`,
  },
  {
    id: "sci020",
    title: "The Periodic Table and Bonding",
    summary: "Predict properties and bond types using periodic trends and valence electrons.",
    difficulty: "Hard",
    estimatedMinutes: 40,
    tags: "chemistry|periodic-table|bonding",
    content: `**Periodic trends** (general, same period/group):
- **Atomic radius** decreases across a period; increases down a group
- **Metallic character** decreases across a period
- **Electronegativity** increases across a period (F is most electronegative)

**Valence electrons** (outer shell) guide bonding:
- **Ionic bonding** — electron transfer metal + nonmetal → ions (NaCl)
- **Covalent bonding** — electron sharing nonmetals (H₂O, CO₂)
- **Metallic bonding** — delocalized electrons in metals

**Lewis dot structures** show valence electrons for small molecules.

**Polarity:** Unequal sharing when electronegativity differs; polar molecules interact strongly with water.

**States at room conditions** relate to bond strength and intermolecular forces (later: hydrogen bonding in water explains high boiling point).`,
    answerGuide: `Noble gases are largely unreactive (full valence shell). Transition metals show variable oxidation states. Intro only — VSEPR and MO theory are advanced.`,
    answer: `Students should describe one periodic trend with direction, contrast ionic and covalent bonding with examples, and explain that valence electrons determine how atoms bond.`,
  },
];
