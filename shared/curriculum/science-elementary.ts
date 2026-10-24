import { type CourseSpec, mc, num, short, tf } from "./dsl";

const NGSS = "Next Generation Science Standards";

export const scienceElementary: CourseSpec[] = [
  {
    id: "sci-k",
    title: "Kindergarten Science",
    subject: "science",
    grade: 0,
    framework: NGSS,
    description: "What living things need, how sunlight warms the Earth, weather, and pushes and pulls.",
    units: [
      {
        title: "Living Things and Their Needs",
        description: "Observe what plants and animals need and where they live.",
        lessons: [
          {
            title: "What Living Things Need",
            summary: "Plants and animals need food, water, and air to live and grow.",
            objectives: ["Tell what plants need to live", "Tell what animals need to live"],
            vocab: [["living", "something that grows, needs food and water, and makes more of its kind"], ["shelter", "a safe place to live"]],
            standards: ["K-LS1-1"],
            body: `
**Living things** grow and change. Plants, animals, and people are all living things.

**What do animals need?**
- **Food** to eat
- **Water** to drink
- **Air** to breathe
- **Shelter**, a safe place to live

**What do plants need?**
- **Sunlight**
- **Water**
- **Air**
- Space to grow (and nutrients from soil)

Plants make their own food using sunlight! Animals must find or catch their food.

**Is it living?** A rock does not eat, drink, or grow, so it is **not living**. A tree grows and needs water, so it **is living**.`,
            questions: [
              mc("What do plants need to make their food?", "Sunlight", ["Darkness", "Toys", "Rocks"], "Plants use sunlight to make their own food."),
              tf("A rock is a living thing.", false, "A rock does not grow, eat, or drink."),
              mc("Which of these do animals need?", "Water", ["Television", "Paint", "Sand toys"], "All animals need water."),
              mc("Where does a rabbit find shelter?", "In a burrow", ["On a cloud", "Inside a car tire", "In the ocean"], "Rabbits dig burrows underground to stay safe."),
            ],
          },
          {
            title: "Where Animals Live",
            summary: "Animals live in places that give them what they need.",
            objectives: ["Match animals to the places they live", "Explain that a habitat gives an animal food, water, and shelter"],
            vocab: [["habitat", "the natural home of a plant or animal"]],
            standards: ["K-ESS3-1"],
            body: `
A **habitat** is a home that gives a plant or animal everything it needs.

**Some habitats**
- 🌊 **Ocean:** fish, whales, crabs
- 🌲 **Forest:** deer, owls, squirrels
- 🏜️ **Desert:** camels, lizards, cactuses
- 🧊 **Arctic:** polar bears, seals

Animals live where they can find **food**, **water**, and **shelter**.

**Body parts help animals live in their habitats.**
- A fish has **gills** to breathe underwater.
- A polar bear has **thick fur** to stay warm.
- A camel can go a long time without drinking water.

**People change habitats too.** We build houses and roads, so we should take care of the places animals live.`,
            questions: [
              mc("Which animal lives in the ocean?", "Whale", ["Camel", "Squirrel", "Owl"], "Whales live in the ocean."),
              mc("Why does a polar bear have thick fur?", "To stay warm in the cold Arctic", ["To swim faster in warm water", "To climb trees", "To hide in the sand"], "Thick fur keeps the polar bear warm."),
              tf("A habitat gives an animal food, water, and shelter.", true, "That's what makes it a home."),
              mc("Which habitat is very dry and sandy?", "Desert", ["Ocean", "Forest", "Arctic"], "Deserts get very little rain."),
            ],
          },
        ],
      },
      {
        title: "Weather and Motion",
        description: "Notice how sunlight and weather change, and how pushes and pulls move things.",
        lessons: [
          {
            title: "Sunlight and Weather",
            summary: "The sun warms the Earth. Weather can be sunny, cloudy, rainy, windy, or snowy.",
            objectives: ["Observe that sunlight warms the Earth's surface", "Describe different kinds of weather"],
            vocab: [["weather", "what the air outside is like: hot, cold, wet, dry, windy"], ["temperature", "how hot or cold something is"]],
            standards: ["K-PS3-1", "K-ESS2-1"],
            body: `
The **sun** gives us light and **warmth**.

**Try it:** Touch a sidewalk in the sun and one in the shade. The sunny sidewalk feels **warmer**. Sunlight warms things up!

**Weather** is what it is like outside each day.
- ☀️ Sunny
- ☁️ Cloudy
- 🌧️ Rainy
- 💨 Windy
- ❄️ Snowy

**Weather has patterns.** It is usually warmer in the afternoon than in the early morning. Summer is usually warmer than winter.

**Staying safe:** wear a hat and sunscreen on sunny days and a coat on cold days.`,
            questions: [
              mc("Which feels warmer on a sunny day?", "A rock in the sun", ["A rock in the shade"], "Sunlight warms the rock."),
              mc("What kind of weather has falling water drops?", "Rainy", ["Sunny", "Windy", "Foggy"], "Rain is water falling from clouds."),
              tf("It is usually warmer in the afternoon than early in the morning.", true, "The sun has been shining on the ground all day."),
              mc("What should you wear to protect your skin on a very sunny day?", "Sunscreen and a hat", ["A raincoat", "Mittens", "Snow boots"], "These protect you from too much sun."),
            ],
          },
          {
            title: "Pushes and Pulls",
            summary: "A push or a pull can make things move, stop, or change direction.",
            objectives: ["Show that a push or pull can change how something moves", "Compare strong and gentle pushes"],
            vocab: [["push", "to move something away from you"], ["pull", "to move something toward you"], ["force", "a push or a pull"]],
            standards: ["K-PS2-1", "K-PS2-2"],
            body: `
A **force** is a **push** or a **pull**.

- **Push:** kicking a ball, pushing a swing, opening a door away from you
- **Pull:** pulling a wagon, opening a drawer, tug-of-war

**Forces change motion.** A push or pull can make something:
- **start moving** (kick a ball)
- **stop** (catch a ball)
- **change direction** (hit a ball with a bat)

**Stronger force, bigger change.** A gentle push makes a toy car roll a little. A **strong** push makes it roll **farther and faster**.

**Try it:** Roll a ball into a wall. The wall **pushes back** and the ball bounces the other way!`,
            questions: [
              mc("Opening a drawer toward you is a…", "Pull", ["Push"], "Moving something toward you is a pull."),
              mc("What happens if you push a toy car harder?", "It goes farther and faster", ["It stops", "It goes slower", "Nothing changes"], "A stronger push makes a bigger change."),
              tf("A push or pull can make a moving ball change direction.", true, "Hitting a ball with a bat changes its direction."),
              mc("Which is a push?", "Kicking a ball", ["Pulling a wagon", "Tug-of-war", "Opening a drawer toward you"], "Kicking moves the ball away from you."),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "sci-1",
    title: "Grade 1 Science",
    subject: "science",
    grade: 1,
    framework: NGSS,
    description: "Light and sound, patterns in the sky, and how young plants and animals are like their parents.",
    units: [
      {
        title: "Light and Sound",
        description: "Investigate how sound is made and how light lets us see.",
        lessons: [
          {
            title: "Sound and Vibrations",
            summary: "Sound is made when things vibrate.",
            objectives: ["Show that vibrating materials make sound", "Show that sound can make materials vibrate"],
            vocab: [["vibrate", "to move back and forth very quickly"], ["sound", "something we hear, made by vibrations"]],
            standards: ["1-PS4-1"],
            body: `
Put your fingers on your throat and hum. Can you feel it buzzing? That is a **vibration**!

**All sounds come from vibrations**: things moving back and forth very fast.
- A plucked guitar string vibrates.
- A hit drum skin vibrates.
- When you talk, parts of your throat vibrate.

**Sound makes things vibrate, too.** Put rice on a drum and tap it. The rice jumps!

**Loud and soft**
- A **big** vibration (hit the drum hard) makes a **loud** sound.
- A **small** vibration (tap gently) makes a **soft** sound.

When the vibrating stops, the sound stops.`,
            questions: [
              mc("What makes sound?", "Vibrations", ["Colors", "Shadows", "Smells"], "All sounds are made by vibrating objects."),
              mc("How do you make a drum sound louder?", "Hit it harder", ["Hit it softer", "Paint it", "Stop hitting it"], "A bigger vibration makes a louder sound."),
              tf("When a guitar string stops vibrating, the sound stops.", true, "No vibration, no sound."),
              mc("Rice on a drum jumps when you tap the drum. Why?", "The drum skin vibrates", ["The rice is hungry", "It is windy", "Light hits it"], "The vibrating drum makes the rice move."),
            ],
          },
          {
            title: "Light and Seeing",
            summary: "We can see things only when light shines on them. Some materials block light.",
            objectives: ["Explain that objects can be seen only when lit", "Sort materials as transparent, translucent, or opaque"],
            vocab: [["transparent", "lets almost all light through, like clear glass"], ["translucent", "lets some light through, like wax paper"], ["opaque", "blocks light, like wood"], ["shadow", "a dark shape made when an object blocks light"]],
            standards: ["1-PS4-2", "1-PS4-3"],
            body: `
In a completely dark room, you cannot see anything. **We need light to see!** Light bounces off objects and into our eyes.

**Light sources** make their own light: the sun, a flashlight, a lamp, fire.

**Materials and light**
- **Transparent:** light goes right through (clear glass, water)
- **Translucent:** some light goes through (wax paper, tissue paper)
- **Opaque:** blocks light (wood, a book, your hand)

**Shadows** form when an **opaque** object blocks light. Your shadow is on the side of you away from the sun.

**Mirrors** bounce light. That's how we see our reflection.`,
            questions: [
              mc("Which material is transparent?", "Clear glass", ["Cardboard", "A brick", "A wooden door"], "Light passes right through clear glass."),
              tf("You can see a toy in a room with no light at all.", false, "We need light to see objects."),
              mc("A shadow forms when…", "an object blocks light", ["light passes through glass", "you close your eyes", "it rains"], "Opaque objects block light and make shadows."),
              mc("Which is a light source?", "A flashlight", ["A mirror", "The moon's rocks", "A window"], "A flashlight makes its own light."),
            ],
          },
        ],
      },
      {
        title: "Patterns in the Sky and Living Things",
        description: "Notice patterns of the sun and moon and how offspring resemble parents.",
        lessons: [
          {
            title: "Patterns of the Sun and Moon",
            summary: "The sun, moon, and stars move across the sky in patterns we can predict.",
            objectives: ["Describe the pattern of the sun rising and setting", "Compare the amount of daylight in different seasons"],
            vocab: [["sunrise", "when the sun first appears in the morning"], ["sunset", "when the sun goes down in the evening"], ["season", "a part of the year with its own weather pattern"]],
            standards: ["1-ESS1-1", "1-ESS1-2"],
            body: `
**The sun's daily pattern**
- The sun **rises in the east** in the morning.
- It is **highest** in the sky around noon.
- It **sets in the west** in the evening.

The sun doesn't really move. The **Earth spins**, which makes it look like the sun is moving.

**The moon** can be seen at night and sometimes during the day. Its shape seems to change over about a month.

**Stars** are always in the sky, but we can only see them at night when the sun's light isn't so bright.

**Seasons and daylight**
- **Summer:** long days, short nights
- **Winter:** short days, long nights

That's why it's still light outside at dinnertime in summer, but dark in winter.`,
            questions: [
              mc("Where does the sun rise?", "In the east", ["In the west", "In the north", "Straight up"], "The sun rises in the east and sets in the west."),
              mc("Which season has the longest days?", "Summer", ["Winter", "All seasons are the same"], "Summer days have the most daylight."),
              tf("Stars are in the sky during the day, but we can't see them.", true, "The sun is so bright it hides the stars."),
              mc("What makes the sun look like it moves across the sky?", "The Earth spinning", ["The sun walking", "Clouds pushing it", "The moon pulling it"], "Earth turns once each day."),
            ],
          },
          {
            title: "Parents and Their Young",
            summary: "Young plants and animals are like their parents, but not exactly the same.",
            objectives: ["Compare young animals and plants to their parents", "Describe how some animal parents help their young survive"],
            vocab: [["offspring", "the young of a plant or animal"], ["trait", "a feature, like fur color or leaf shape"]],
            standards: ["1-LS3-1", "1-LS1-2"],
            body: `
**Offspring** are the babies or young of plants and animals.

**Young look like their parents, but not exactly.**
- Puppies are dogs like their parents, but they may have different spots or colors.
- A sunflower seed grows into a sunflower, but each flower is a little different.

**Some young change a lot as they grow.** A caterpillar doesn't look like a butterfly yet. A tadpole doesn't look like a frog yet!

**Parents help their young survive.**
- Birds bring food to their chicks.
- A mother cat carries kittens to keep them safe.
- Penguin dads keep eggs warm on their feet.

These behaviors help the young stay safe, warm, and fed.`,
            questions: [
              tf("A puppy will grow up to be a dog.", true, "Offspring become the same kind of animal as their parents."),
              mc("A tadpole grows up to become a…", "Frog", ["Fish", "Turtle", "Bird"], "Tadpoles change into frogs."),
              mc("How do bird parents help their chicks?", "They bring them food", ["They teach them to swim", "They build them toys", "They leave them alone"], "Feeding helps chicks survive and grow."),
              tf("Every kitten in a litter looks exactly like its mother.", false, "Young are similar to their parents but have small differences."),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "sci-2",
    title: "Grade 2 Science",
    subject: "science",
    grade: 2,
    framework: NGSS,
    description: "Properties of matter, heating and cooling, what plants need, and Earth's land and water.",
    units: [
      {
        title: "Properties of Matter",
        description: "Describe and classify materials, and see how heating and cooling change them.",
        lessons: [
          {
            title: "Describing Materials",
            summary: "Materials can be sorted by properties like color, texture, hardness, and whether they bend or float.",
            objectives: ["Describe and classify materials by their observable properties", "Choose the best material for a job"],
            vocab: [["property", "a feature you can observe, like color or hardness"], ["material", "what an object is made of"], ["flexible", "able to bend without breaking"]],
            standards: ["2-PS1-1", "2-PS1-2"],
            body: `
Everything is made of **matter**. We describe matter by its **properties**.

**Properties you can observe**
- **Color:** red, clear, brown
- **Texture:** smooth, rough, fuzzy
- **Hardness:** hard like a rock or soft like cotton
- **Flexibility:** does it bend? (rubber bends, glass doesn't)
- **Does it float or sink?**
- **Solid, liquid, or gas?**

**Choosing materials for a job**
- A raincoat should be **waterproof** → plastic or rubber
- A window should be **transparent** → glass
- A pillow should be **soft** → cotton or feathers

Engineers choose materials based on their properties.`,
            questions: [
              mc("Which material is best for a window?", "Glass", ["Wood", "Cardboard", "Metal"], "Glass is transparent, so light can come in."),
              mc("Which word describes how sandpaper feels?", "Rough", ["Smooth", "Flexible", "Transparent"], "Sandpaper has a rough texture."),
              tf("A rubber band is flexible.", true, "Rubber bends and stretches."),
              mc("Why are raincoats made of plastic?", "Plastic is waterproof", ["Plastic is soft", "Plastic is heavy", "Plastic is see-through"], "Waterproof materials keep you dry."),
            ],
          },
          {
            title: "Heating and Cooling",
            summary: "Heating and cooling can change materials. Some changes can be reversed and some cannot.",
            objectives: ["Describe how heating and cooling change materials", "Tell whether a change can be reversed"],
            vocab: [["melt", "change from solid to liquid by heating"], ["freeze", "change from liquid to solid by cooling"], ["reversible", "a change that can be undone"]],
            standards: ["2-PS1-4"],
            body: `
**Heating** and **cooling** can change matter.

**Reversible changes** can be undone:
- Ice **melts** into water when heated. Water **freezes** back into ice when cooled.
- Chocolate melts in your hand and gets hard again in the fridge.

**Irreversible changes** cannot be undone:
- **Cooking an egg.** You can't uncook it!
- **Baking a cake.** The batter can't turn back into batter.
- **Burning paper.** It turns to ash.

**Ask yourself:** "Can I get the original material back?" If yes, it's reversible.`,
            questions: [
              mc("What happens to ice when it is heated?", "It melts into water", ["It freezes", "It turns to wood", "It disappears forever"], "Heating turns solid ice into liquid water."),
              mc("Which change can NOT be reversed?", "Cooking an egg", ["Melting ice", "Freezing juice", "Melting chocolate"], "A cooked egg can't become raw again."),
              tf("Freezing water into ice is a reversible change.", true, "The ice can melt back into water."),
              mc("Water turning into ice is called…", "Freezing", ["Melting", "Boiling", "Burning"], "Cooling a liquid into a solid is freezing."),
            ],
          },
        ],
      },
      {
        title: "Plants and Earth's Surface",
        description: "Investigate what plants need and describe land and water on Earth.",
        lessons: [
          {
            title: "What Plants Need and How Seeds Travel",
            summary: "Plants need sunlight and water. Animals help move pollen and seeds.",
            objectives: ["Plan a test to see if plants need sunlight and water", "Explain how animals help plants pollinate and spread seeds"],
            vocab: [["pollen", "a powder flowers need to make seeds"], ["pollinate", "move pollen from flower to flower"], ["seed dispersal", "how seeds are carried to new places"]],
            standards: ["2-LS2-1", "2-LS2-2"],
            body: `
**A fair test:** Grow two bean plants the same way, but put one in a dark closet. After a week, the one in the dark is pale and weak. **Plants need sunlight!** Do the same with water: the plant with no water wilts.

**Pollination:** Flowers need pollen from other flowers to make seeds. **Bees, butterflies, and hummingbirds** carry pollen as they drink nectar.

**Seed dispersal:** Plants can't walk, so seeds travel in other ways:
- **Wind:** dandelion seeds float like parachutes.
- **Animals:** burrs stick to fur; birds eat berries and drop seeds far away.
- **Water:** coconuts float to new beaches.

Spreading out helps new plants find space, light, and water.`,
            questions: [
              mc("Which animal helps pollinate flowers?", "Bee", ["Fish", "Snake", "Worm"], "Bees carry pollen from flower to flower."),
              mc("How do dandelion seeds travel?", "By wind", ["By water", "By sticking to fur", "They walk"], "Their fluffy parachutes catch the wind."),
              tf("A plant kept in a dark closet will grow just as well as one in sunlight.", false, "Plants need sunlight to make food."),
              mc("In a fair test of whether plants need water, what should be different between the two plants?", "Only the water", ["The pot, soil, and light", "Everything", "Nothing"], "Change one thing at a time so you know what caused the result."),
            ],
          },
          {
            title: "Earth's Land and Water",
            summary: "Earth has many landforms and bodies of water, and most of Earth's water is salty ocean.",
            objectives: ["Identify landforms and bodies of water", "Explain where water is found on Earth as a solid and liquid"],
            vocab: [["landform", "a natural shape of land, like a mountain or valley"], ["glacier", "a huge, slow-moving body of ice"]],
            standards: ["2-ESS2-2", "2-ESS2-3"],
            body: `
**Landforms** are the shapes of the land.
- **Mountain:** very high land with steep sides
- **Hill:** rounded land, lower than a mountain
- **Valley:** low land between hills or mountains
- **Plain:** large, flat land
- **Island:** land with water all around it

**Bodies of water**
- **Ocean:** huge, **salty** water. It covers most of Earth!
- **River:** fresh water flowing to a lake or ocean
- **Lake:** fresh water with land all around it
- **Pond:** a small lake

**Water can be solid or liquid.** Ice is found in **glaciers** and at the North and South Poles.

**Maps** show where land and water are. Blue usually means water.`,
            questions: [
              mc("Which body of water is salty?", "Ocean", ["River", "Lake", "Pond"], "Ocean water is salty; rivers and lakes are usually fresh."),
              mc("Land with water all around it is a…", "Island", ["Valley", "Mountain", "Plain"], "An island is surrounded by water."),
              tf("Most of Earth's surface is covered by water.", true, "Oceans cover about 70% of Earth."),
              mc("Where is a lot of Earth's frozen water found?", "In glaciers and at the poles", ["In deserts", "In rivers", "In volcanoes"], "Ice sheets and glaciers hold frozen water."),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "sci-3",
    title: "Grade 3 Science",
    subject: "science",
    grade: 3,
    framework: NGSS,
    description: "Balanced and unbalanced forces, magnets, life cycles, and weather and climate.",
    units: [
      {
        title: "Forces and Interactions",
        description: "Investigate balanced and unbalanced forces and magnetic forces.",
        lessons: [
          {
            title: "Balanced and Unbalanced Forces",
            summary: "Unbalanced forces change an object's motion; balanced forces don't.",
            objectives: ["Explain the difference between balanced and unbalanced forces", "Predict motion when forces act on an object"],
            vocab: [["balanced forces", "equal forces in opposite directions; motion doesn't change"], ["unbalanced forces", "forces that don't cancel; motion changes"], ["friction", "a force that slows things down when surfaces rub"]],
            standards: ["3-PS2-1", "3-PS2-2"],
            body: `
A **force** is a push or pull. More than one force can act on an object at the same time.

**Balanced forces:** In tug-of-war, if both teams pull with the **same strength**, the rope **doesn't move**. The forces cancel out.

**Unbalanced forces:** If one team pulls harder, the rope moves **toward the stronger team**. Unbalanced forces **change motion**: they can start, stop, speed up, slow down, or turn an object.

**Gravity** pulls everything down toward Earth. A book on a table doesn't fall because the table pushes up just as hard (balanced).

**Friction** slows things down. A ball rolls farther on smooth tile than on thick carpet because carpet has more friction.

**Patterns let us predict motion:** a swinging pendulum goes back and forth in a regular rhythm.`,
            questions: [
              mc("Two teams pull a rope with equal force. What happens?", "The rope does not move", ["The rope moves left", "The rope moves right", "The rope breaks"], "Equal and opposite forces are balanced."),
              tf("Unbalanced forces can change an object's speed or direction.", true, "That's what makes forces unbalanced."),
              mc("Where will a toy car roll the farthest?", "On a smooth wooden floor", ["On thick carpet", "On grass", "In sand"], "Smooth surfaces have less friction."),
              mc("Which force pulls objects toward the ground?", "Gravity", ["Friction", "Magnetism", "Wind"], "Gravity pulls everything toward Earth."),
            ],
          },
          {
            title: "Magnets",
            summary: "Magnets attract some metals and push or pull other magnets without touching.",
            objectives: ["Describe how magnets attract and repel", "Identify materials that are attracted to magnets"],
            vocab: [["attract", "pull toward"], ["repel", "push away"], ["poles", "the ends of a magnet, north and south"]],
            standards: ["3-PS2-3", "3-PS2-4"],
            body: `
Magnets can push or pull **without touching**!

**Magnet poles:** every magnet has a **north (N)** and a **south (S)** pole.
- **Opposite poles attract:** N pulls toward S.
- **Like poles repel:** N pushes away N, and S pushes away S.

**What do magnets attract?** Things made of **iron** or **steel**, like paper clips and nails.
Magnets do **not** attract wood, plastic, glass, paper, aluminum foil, or most coins.

**Distance matters:** the closer a magnet is, the stronger its pull.

**Magnets solve problems**
- Refrigerator doors stay closed with magnets.
- Magnetic latches on cabinets
- A compass needle is a tiny magnet that points north.`,
            questions: [
              mc("What happens when two north poles are brought together?", "They repel (push apart)", ["They attract (pull together)", "Nothing happens"], "Like poles repel."),
              mc("Which object will a magnet pick up?", "A steel paper clip", ["A plastic spoon", "A wooden block", "A rubber eraser"], "Magnets attract iron and steel."),
              tf("A magnet's pull gets stronger as it gets closer to an object.", true, "Magnetic force is stronger at shorter distances."),
              mc("A north pole and a south pole will…", "attract", ["repel", "do nothing"], "Opposite poles attract."),
            ],
          },
        ],
      },
      {
        title: "Life Cycles and Climate",
        description: "Compare life cycles and distinguish weather from climate.",
        lessons: [
          {
            title: "Life Cycles",
            summary: "All living things are born, grow, reproduce, and die, but their life cycles differ.",
            objectives: ["Describe the stages of plant and animal life cycles", "Compare complete and incomplete metamorphosis"],
            vocab: [["life cycle", "the stages a living thing goes through from birth to death"], ["metamorphosis", "a big change in body form during a life cycle"], ["larva", "the young form of an insect, like a caterpillar"]],
            standards: ["3-LS1-1"],
            body: `
Every organism has a **life cycle**: it is born, grows, reproduces (makes offspring), and dies.

**Plant life cycle:** seed → seedling → adult plant → flower → new seeds

**Butterfly (complete metamorphosis): 4 stages**
1. **Egg**
2. **Larva** (caterpillar): eats and grows
3. **Pupa** (chrysalis): body changes completely inside
4. **Adult** butterfly

**Grasshopper (incomplete metamorphosis): 3 stages**
egg → **nymph** (looks like a small adult without wings) → adult

**Frog:** egg → tadpole (gills, tail) → froglet → adult frog (lungs, legs)

**Mammals** like humans are born looking like small versions of their parents and grow larger.`,
            questions: [
              num("How many stages are in a butterfly's life cycle?", 4, "Egg, larva, pupa, adult."),
              mc("A caterpillar is which stage of the butterfly life cycle?", "Larva", ["Egg", "Pupa", "Adult"], "The caterpillar is the larva."),
              mc("Which animal goes through incomplete metamorphosis?", "Grasshopper", ["Butterfly", "Beetle", "Moth"], "Grasshoppers go egg → nymph → adult."),
              tf("All living things have a life cycle.", true, "Every organism is born, grows, reproduces, and dies."),
            ],
          },
          {
            title: "Weather and Climate",
            summary: "Weather is day to day; climate is the typical weather of a place over many years.",
            objectives: ["Distinguish weather from climate", "Use data tables to describe typical weather in a season"],
            vocab: [["weather", "conditions of the air at a certain time and place"], ["climate", "the usual weather pattern of a place over many years"], ["precipitation", "water falling from clouds: rain, snow, sleet, hail"]],
            standards: ["3-ESS2-1", "3-ESS2-2", "3-ESS3-1"],
            body: `
**Weather** is what the air is like **right now**: temperature, wind, clouds, and precipitation. It can change hour by hour.

**Climate** is the **typical** weather of a place over **many years**.
- Phoenix, Arizona has a hot, dry climate.
- Seattle, Washington has a mild, rainy climate.

**Meteorologists** use tools to measure weather:
| Tool | Measures |
|---|---|
| Thermometer | temperature |
| Rain gauge | precipitation |
| Anemometer | wind speed |
| Wind vane | wind direction |

**Using data:** If a town averaged 2 inches of rain every July for 30 years, we can predict July will probably be dry there.

**Weather hazards** like floods, hurricanes, and blizzards can't be stopped, but people reduce damage with levees, storm shelters, and warnings.`,
            questions: [
              mc("'It is raining right now' describes…", "weather", ["climate"], "Weather is about current conditions."),
              mc("Which tool measures temperature?", "Thermometer", ["Rain gauge", "Wind vane", "Anemometer"], "Thermometers measure how hot or cold it is."),
              mc("'Deserts get very little rain most years' describes…", "climate", ["weather"], "Climate describes long-term patterns."),
              tf("People can reduce flood damage by building levees.", true, "Levees hold back rising water."),
            ],
            writtenPrompt: "Your town is planning a field trip in October. Explain whether you would use weather or climate information to choose a date a month ahead, and what information you'd look for.",
            rubric: "Uses climate data (typical October conditions over many years) for planning ahead; notes weather forecasts are only reliable a few days out. Mentions specific data like average temperature or rainfall. Could add: check the weather forecast just before the trip.",
          },
        ],
      },
    ],
  },
  {
    id: "sci-4",
    title: "Grade 4 Science",
    subject: "science",
    grade: 4,
    framework: NGSS,
    description: "Energy transfer, waves, Earth's changing surface, and natural resources.",
    units: [
      {
        title: "Energy and Waves",
        description: "Trace how energy moves and describe wave patterns.",
        lessons: [
          {
            title: "Energy Transfer",
            summary: "Energy moves from place to place through sound, light, heat, electricity, and collisions.",
            objectives: ["Describe ways energy is transferred", "Explain that faster objects have more energy"],
            vocab: [["energy", "the ability to cause change or do work"], ["collision", "when moving objects bump into each other"], ["electric circuit", "a complete path that electricity flows through"]],
            standards: ["4-PS3-1", "4-PS3-2", "4-PS3-3"],
            body: `
**Energy** is the ability to make things move or change.

**Energy of motion:** a **faster** object has **more energy**. A fast baseball can break a window; a slowly rolled one can't.

**Energy moves from place to place**
- **Collisions:** a bowling ball transfers energy to the pins.
- **Heat:** a hot stove warms a pan.
- **Light:** sunlight warms the ground.
- **Sound:** a drum's vibrations travel to your ears.
- **Electricity:** a battery sends energy through wires to light a bulb.

**Circuits:** electricity only flows if the path is **complete** (a closed circuit). An open switch breaks the path and the bulb turns off.

**Energy changes form:** a flashlight changes stored chemical energy (battery) → electrical energy → light and heat.`,
            questions: [
              mc("Which has more energy?", "A ball rolling fast", ["The same ball rolling slowly"], "Faster objects have more energy of motion."),
              mc("A light bulb in a circuit goes out when the switch is opened because…", "the path for electricity is broken", ["the battery is full", "light needs wires", "the bulb gets cold"], "Electricity needs a closed (complete) circuit."),
              tf("Sound is a way energy travels.", true, "Vibrations carry energy through air to your ears."),
              mc("In a flashlight, the battery's stored energy becomes…", "light and heat", ["sound only", "magnetism", "nothing"], "Chemical → electrical → light (and some heat)."),
            ],
          },
          {
            title: "Waves",
            summary: "Waves are patterns of motion with amplitude and wavelength that carry energy.",
            objectives: ["Describe waves using amplitude and wavelength", "Explain that waves carry energy without moving the material along with them"],
            vocab: [["wave", "a repeating disturbance that carries energy"], ["amplitude", "the height of a wave from its rest position"], ["wavelength", "the distance from one peak to the next"]],
            standards: ["4-PS4-1", "4-PS4-3"],
            body: `
A **wave** is a repeating pattern of motion that **carries energy**.

**Parts of a wave**
- **Crest:** the top
- **Trough:** the bottom
- **Amplitude:** how tall the wave is from its middle (rest) position
- **Wavelength:** distance from one crest to the next

**Waves move energy, not stuff.** A cork floating on a pond bobs **up and down** as waves pass, but it stays in about the same place.

**Bigger amplitude = more energy.** Tall ocean waves can knock you over; small ripples can't.

**Waves send information:** sound waves carry voices, light waves carry pictures, and radio waves carry signals to phones. Even Morse code uses patterns of on/off signals.`,
            questions: [
              mc("The distance from one crest to the next is the…", "wavelength", ["amplitude", "trough", "frequency"], "Wavelength is crest-to-crest distance."),
              mc("Which wave carries the most energy?", "The one with the biggest amplitude", ["The one with the smallest amplitude", "They all carry the same"], "Taller waves carry more energy."),
              tf("A cork on a pond travels across the pond with each wave.", false, "It bobs up and down; the wave's energy moves past it."),
              mc("The lowest point of a wave is called the…", "trough", ["crest", "amplitude", "peak"], "Crest is the top; trough is the bottom."),
            ],
          },
        ],
      },
      {
        title: "Earth's Changing Surface and Resources",
        description: "Explain how Earth's surface changes and how we use its resources.",
        lessons: [
          {
            title: "Weathering, Erosion, and Rock Layers",
            summary: "Water, ice, wind, and plants break down and move rock; layers record Earth's history.",
            objectives: ["Distinguish weathering from erosion", "Use rock layers and fossils as evidence of change over time"],
            vocab: [["weathering", "breaking rock into smaller pieces"], ["erosion", "moving rock and soil from one place to another"], ["deposition", "dropping sediment in a new place"], ["fossil", "remains or traces of ancient life preserved in rock"]],
            standards: ["4-ESS1-1", "4-ESS2-1", "4-ESS2-2"],
            body: `
**Weathering** breaks rock into smaller pieces:
- **Water** freezes in cracks, expands, and splits rocks (ice wedging).
- **Plant roots** grow into cracks and push rock apart.
- **Wind** carrying sand wears rock down.

**Erosion** carries the pieces away: rivers, waves, glaciers, and wind move sediment.
**Deposition** drops it somewhere new, building deltas and beaches.

**The Grand Canyon** formed over millions of years as the Colorado River eroded rock.

**Rock layers tell a story**
- Lower layers are usually **older**; upper layers are **younger**.
- **Fossils** show what lived there. Fish fossils on a mountaintop mean the area was once under water!`,
            questions: [
              mc("Ice splitting a rock apart is an example of…", "weathering", ["erosion", "deposition", "a fossil"], "Breaking rock into pieces is weathering."),
              mc("A river carrying sand downstream is an example of…", "erosion", ["weathering", "deposition", "melting"], "Erosion moves sediment."),
              tf("In undisturbed rock layers, the bottom layers are usually the oldest.", true, "Layers stack up over time, so the oldest are on the bottom."),
              mc("Seashell fossils found in a desert are evidence that…", "the area was once covered by water", ["seashells live in sand", "someone dropped them there yesterday", "deserts get lots of rain"], "Marine fossils show the land was once under the sea."),
            ],
          },
          {
            title: "Natural Resources and Energy",
            summary: "We get energy from renewable and nonrenewable resources, each with effects on the environment.",
            objectives: ["Classify energy resources as renewable or nonrenewable", "Describe how using resources affects the environment"],
            vocab: [["natural resource", "something from nature that people use"], ["renewable", "can be replaced naturally in a short time"], ["nonrenewable", "takes millions of years to form; can run out"], ["fossil fuel", "coal, oil, or natural gas formed from ancient living things"]],
            standards: ["4-ESS3-1", "4-ESS3-2"],
            body: `
**Natural resources** come from Earth: water, soil, trees, minerals, and energy sources.

**Renewable energy** (won't run out)
- ☀️ **Solar:** sunlight
- 💨 **Wind:** turbines
- 💧 **Hydroelectric:** moving water through dams
- 🌋 **Geothermal:** heat from inside Earth

**Nonrenewable energy** (can run out)
- **Fossil fuels:** coal, oil, natural gas. They formed over millions of years from ancient plants and animals.
- **Nuclear:** uranium

**Trade-offs**
- Burning fossil fuels pollutes the air and adds carbon dioxide.
- Wind and solar are cleaner but depend on weather and need lots of space.

**Reduce risks from natural hazards:** engineers design earthquake-resistant buildings and tsunami warning systems.`,
            questions: [
              mc("Which energy source is renewable?", "Wind", ["Coal", "Oil", "Natural gas"], "Wind is replaced naturally and won't run out."),
              mc("Fossil fuels formed from…", "ancient plants and animals", ["melted ice", "volcanic glass", "sunlight stored in rocks today"], "They formed over millions of years from buried living things."),
              tf("Solar energy comes from the sun.", true, "Solar panels turn sunlight into electricity."),
              mc("What is one downside of burning coal?", "It pollutes the air", ["It never runs out", "It needs wind", "It only works at night"], "Burning coal releases pollutants and carbon dioxide."),
            ],
            writtenPrompt: "Your school wants to use a renewable energy source. Pick solar, wind, or hydroelectric and explain one benefit and one challenge for your school.",
            rubric: "Chooses a renewable source. Gives a correct benefit (e.g., doesn't run out, less pollution). Gives a realistic challenge tied to the choice (solar: cloudy days/roof space; wind: needs steady wind/space/noise; hydro: needs a river/dam). Connects to the school setting.",
          },
        ],
      },
    ],
  },
  {
    id: "sci-5",
    title: "Grade 5 Science",
    subject: "science",
    grade: 5,
    framework: NGSS,
    description: "Particles of matter and conservation of mass, food webs, gravity, and patterns of the sun and stars.",
    units: [
      {
        title: "Matter and Ecosystems",
        description: "Model matter as tiny particles and trace matter through food webs.",
        lessons: [
          {
            title: "Matter Is Made of Particles",
            summary: "All matter is made of particles too small to see, and mass is conserved when matter changes.",
            objectives: ["Use a particle model to explain dissolving and evaporation", "Show that total mass stays the same during physical and chemical changes"],
            vocab: [["particle", "a tiny piece of matter too small to see"], ["dissolve", "mix completely into a liquid so particles spread out"], ["conservation of mass", "matter is not created or destroyed; total mass stays the same"]],
            standards: ["5-PS1-1", "5-PS1-2", "5-PS1-4"],
            body: `
All matter is made of **particles** too small to see, even with a regular microscope.

**Evidence for particles**
- **Dissolving:** stir sugar into water and it seems to disappear, but the water tastes sweet. The sugar particles spread out between water particles.
- **Smells:** you can smell cookies from another room because particles travel through the air.
- **Inflating a ball:** air particles fill the ball and push on its walls.

**Conservation of mass:** When matter changes, the **total mass stays the same**.
- 100 g of water + 10 g of salt = **110 g** of salt water.
- Melting 50 g of ice gives **50 g** of water.
- In a sealed bag, baking soda and vinegar fizz, but the bag's mass doesn't change. (In an open cup, the gas escapes, so the mass seems to drop.)`,
            questions: [
              num("You dissolve 15 g of sugar in 200 g of water. What is the total mass in grams?", 215, "Mass is conserved: 200 + 15 = 215 g."),
              mc("Sugar 'disappears' in water because…", "its particles spread out among the water particles", ["it is destroyed", "it turns into air", "it sinks and hides"], "The particles are still there, just too small and spread out to see."),
              tf("When 40 g of ice melts, you get 40 g of water.", true, "Changing state doesn't change mass."),
              mc("Baking soda and vinegar react in an open cup and the mass goes down. Why?", "A gas escaped into the air", ["Mass was destroyed", "The cup got lighter", "Vinegar disappears"], "The gas carried mass away. In a sealed bag, mass stays the same."),
            ],
          },
          {
            title: "Food Webs and the Flow of Matter",
            summary: "Plants make food from air and water; matter moves among producers, consumers, and decomposers.",
            objectives: ["Explain that plants get the materials they need mostly from air and water", "Model how matter moves through a food web"],
            vocab: [["producer", "an organism that makes its own food, like a plant"], ["consumer", "an organism that eats other organisms"], ["decomposer", "an organism that breaks down dead matter, like fungi"], ["food web", "connected food chains in an ecosystem"]],
            standards: ["5-LS1-1", "5-LS2-1", "5-PS3-1"],
            body: `
**Where does a tree get its mass?** Not mostly from soil! Plants build their bodies mainly from **carbon dioxide (from the air)** and **water**, using energy from **sunlight**.

**Roles in an ecosystem**
- **Producers** (plants, algae) make food using sunlight.
- **Consumers** eat other organisms:
  - herbivores eat plants (rabbit)
  - carnivores eat animals (hawk)
  - omnivores eat both (bear)
- **Decomposers** (fungi, bacteria, worms) break down dead things and return nutrients to the soil.

**Food chain:** grass → grasshopper → frog → snake → hawk
The arrows show the direction **matter and energy flow**.

**Energy comes from the sun.** The energy in all food can be traced back to sunlight captured by producers.

A **food web** shows many connected chains. Removing one organism affects the others.`,
            questions: [
              mc("Most of a tree's mass comes from…", "air and water", ["soil", "sunlight itself", "fertilizer"], "Plants use carbon dioxide from the air and water to build sugars."),
              mc("Which organism is a decomposer?", "Mushroom", ["Grass", "Rabbit", "Hawk"], "Fungi like mushrooms break down dead matter."),
              mc("In grass → rabbit → fox, what does the arrow show?", "The direction matter and energy flow", ["Which animal is biggest", "Who is faster", "Where they live"], "Energy moves from the eaten to the eater."),
              tf("The energy in a hamburger can be traced back to the sun.", true, "Cows eat grass, and grass captured energy from sunlight."),
            ],
          },
        ],
      },
      {
        title: "Earth and Space",
        description: "Explain gravity, the sun as a star, and daily and seasonal patterns.",
        lessons: [
          {
            title: "Gravity and the Sun as a Star",
            summary: "Gravity pulls objects toward Earth's center. The sun looks brighter than other stars because it is much closer.",
            objectives: ["Support the claim that gravity pulls objects down toward Earth's center", "Explain why the sun appears brighter than other stars"],
            vocab: [["gravity", "the force that pulls objects toward each other"], ["star", "a huge ball of hot gas that gives off light"], ["light-year", "the distance light travels in one year"]],
            standards: ["5-PS2-1", "5-ESS1-1"],
            body: `
**Gravity** is a force that pulls objects toward each other. Earth's gravity pulls everything **toward the center of the Earth**: that's "down" no matter where you stand on the globe.

When you drop a ball in Australia or Alaska, it falls toward the ground, toward Earth's center.

**The sun is a star.** It's an average-sized star, but it looks huge and bright because it is **close**: about 150 million km away.

The next closest star, Proxima Centauri, is about **4.2 light-years** away, more than 250,000 times farther than the sun. Many stars are actually bigger and brighter than the sun but look like tiny dots because they're so far.

**Apparent brightness depends on distance.** A flashlight looks brighter up close than across a football field, even though it gives off the same light.`,
            questions: [
              mc("Which direction does gravity pull objects on Earth?", "Toward Earth's center", ["Toward the North Pole", "Toward the sun", "Sideways"], "'Down' everywhere means toward the center of Earth."),
              mc("Why does the sun look brighter than other stars?", "It is much closer to Earth", ["It is the biggest star in the universe", "It is the only star that makes light", "Other stars are turned off in the day"], "Distance makes faraway stars look dim."),
              tf("The sun is a star.", true, "It is a medium-sized star."),
              mc("Two identical flashlights are turned on. One is 1 m away and one is 100 m away. Which looks brighter?", "The one 1 m away", ["The one 100 m away", "They look the same"], "Closer light sources appear brighter."),
            ],
          },
          {
            title: "Day, Night, Shadows, and Seasons",
            summary: "Earth's rotation causes day and night and moving shadows; its orbit changes which stars we see.",
            objectives: ["Use data to describe patterns in shadow length and direction", "Explain day/night and the seasonal appearance of stars"],
            vocab: [["rotation", "spinning on an axis; one rotation = one day"], ["revolution", "traveling around another object; one revolution around the sun = one year"], ["axis", "an imaginary line an object spins around"]],
            standards: ["5-ESS1-2"],
            body: `
**Earth rotates** (spins) once every **24 hours**. The side facing the sun has **day**; the side facing away has **night**.

**Shadows change during the day**
| Time | Sun position | Shadow |
|---|---|---|
| Morning | low in the east | long, pointing west |
| Noon | high in the sky | short |
| Evening | low in the west | long, pointing east |

**Earth revolves** around the sun once a **year** (about 365 days). As we travel, the night side of Earth faces different parts of space, so we see **different constellations in different seasons**. Orion is easy to see on winter evenings but not in summer.

**The moon** revolves around Earth about once a month, which is why its shape seems to change.`,
            questions: [
              num("How many hours does it take Earth to rotate once?", 24, "One rotation = one day = about 24 hours."),
              mc("When are shadows shortest?", "Around noon", ["Early morning", "Evening", "Midnight"], "The sun is highest around midday."),
              mc("Why do we see different constellations in different seasons?", "Earth revolves around the sun", ["Stars move around Earth", "The moon blocks some stars", "Stars turn off in summer"], "Our night side faces different directions in space throughout the year."),
              mc("In the morning, a shadow points…", "west", ["east", "straight down", "north"], "The sun is in the east, so shadows stretch to the west."),
            ],
            writtenPrompt: "Describe how the shadow of a flagpole changes from morning to evening, and explain what causes the change.",
            rubric: "Morning: long, points west. Noon: short. Evening: long, points east. Explains that Earth's rotation changes the sun's apparent position in the sky; a higher sun makes shorter shadows.",
          },
        ],
      },
    ],
  },
];
