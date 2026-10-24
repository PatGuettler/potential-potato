import { mc, num, short, tf, type UnitSpec } from "../dsl";

const n = (code: string) => code;

export const scienceElementaryExt: Record<string, UnitSpec[]> = {
  "sci-k": [
    {
      title: "Living Things and Their Places",
      description: "See how living things change their surroundings and how people can help.",
      lessons: [
        {
          title: "Animals Change Their Homes",
          summary: "Plants and animals change the places where they live to get what they need.",
          objectives: ["Give examples of animals changing their environment", "Explain why living things change their surroundings"],
          vocab: [["environment", "everything around a living thing"], ["burrow", "a hole an animal digs to live in"], ["dam", "a wall that holds back water"]],
          standards: [n("K-ESS2-2")],
          body: `
Living things **change the places** where they live.

- 🦫 **Beavers** cut down trees and build **dams**. The stream turns into a pond!
- 🐿️ **Squirrels** bury nuts. Some nuts grow into new trees.
- 🐜 **Ants** dig tunnels under the ground.
- 🌳 **Tree roots** can crack sidewalks as they grow.
- 🐦 **Birds** gather twigs to build nests.

**People change places too.** We build houses, roads, and farms.

**Why?** Every living thing needs food, water, and shelter. Changing the environment helps them get these things.

**Look outside:** can you find a hole, a nest, or a path made by an animal?`,
          questions: [
            mc("What do beavers build that turns a stream into a pond?", "A dam", ["A nest", "A tunnel", "A road"], "Beaver dams hold back water."),
            mc("How can tree roots change a sidewalk?", "They can crack it as they grow", ["They paint it", "They make it longer", "They make it wet"], "Growing roots push up and crack sidewalks."),
            tf("Only people change the places where they live.", false, "Animals and plants change their surroundings too."),
            mc("Why do animals dig burrows?", "To have shelter", ["To find paint", "To make noise", "To grow taller"], "A burrow is a safe home."),
          ],
        },
        {
          title: "Taking Care of Earth",
          summary: "People can reduce, reuse, and recycle to protect land, water, air, and animals.",
          objectives: ["Name ways people can reduce their impact on Earth", "Sort items into reuse and recycle"],
          vocab: [["reduce", "use less"], ["reuse", "use again"], ["recycle", "make old things into new things"], ["litter", "trash left on the ground"]],
          standards: [n("K-ESS3-3")],
          body: `
People use Earth's land, water, and air. We can help keep them clean!

**The three R's**
- ♻️ **Reduce:** use less. Turn off the water while brushing your teeth.
- 🔁 **Reuse:** use again. Fill a water bottle instead of buying new ones.
- 🗑️ **Recycle:** paper, cans, and plastic bottles can be made into new things.

**Other ways to help**
- Pick up litter so animals don't eat it.
- Turn off lights when you leave a room.
- Plant flowers and trees.
- Walk or ride a bike for short trips.

**Small things add up!** If every child in your class turns off one light, that saves a lot of energy.`,
          questions: [
            mc("Turning off the water while you brush your teeth is a way to…", "reduce", ["recycle", "litter", "waste"], "Using less water is reducing."),
            mc("Which item can usually be recycled?", "A soda can", ["A banana peel", "A rock", "A puddle"], "Metal cans are recycled into new cans."),
            tf("Litter can hurt animals.", true, "Animals can eat or get trapped in trash."),
            mc("Using a lunch box every day instead of paper bags is…", "reusing", ["recycling", "littering", "wasting"], "You use the same lunch box again and again."),
          ],
        },
      ],
    },
    {
      title: "Weather and Sunlight",
      description: "Prepare for severe weather and design ways to block the sun.",
      lessons: [
        {
          title: "Severe Weather Safety",
          summary: "Forecasts help people get ready for storms, tornadoes, blizzards, and floods.",
          objectives: ["Name types of severe weather", "Describe how forecasts help people stay safe"],
          vocab: [["forecast", "a prediction of the weather"], ["tornado", "a spinning funnel of wind"], ["blizzard", "a big snowstorm with strong wind"]],
          standards: [n("K-ESS3-2"), n("K-PS3-1")],
          body: `
Sometimes weather is **dangerous**.

| Weather | What it is | Stay safe |
|---|---|---|
| ⛈️ Thunderstorm | lightning and loud thunder | go inside |
| 🌪️ Tornado | spinning wind | go to a basement or inside room |
| 🌨️ Blizzard | lots of snow and wind | stay home and warm |
| 🌊 Flood | too much water | move to high ground |
| 🌀 Hurricane | huge storm from the ocean | follow grown-ups' plan |

**Weather forecasters** use tools to predict storms. They warn us on TV, radio, and phones so families can get ready.

**Ready kit:** flashlight, water, snacks, and a blanket.

**Remember:** "When thunder roars, go indoors!"`,
          questions: [
            mc("Where should you go during a tornado?", "A basement or inside room", ["Outside to watch", "Up a tree", "In a pool"], "Low inside rooms are safest."),
            mc("Who predicts the weather?", "Weather forecasters", ["Chefs", "Dentists", "Pilots"], "Forecasters use tools to predict storms."),
            tf("You should go inside when you hear thunder.", true, "When thunder roars, go indoors!"),
            mc("What is a good thing to keep in a ready kit?", "A flashlight", ["A kite", "Ice cream", "Sunglasses"], "Storms can turn off the lights."),
          ],
        },
        {
          title: "Designing Shade",
          summary: "Sunlight warms Earth's surface; structures like umbrellas and tents block the sun.",
          objectives: ["Observe that sunlight warms surfaces", "Design and test a structure that makes shade"],
          vocab: [["shade", "a cooler spot where sunlight is blocked"], ["structure", "something built"], ["design", "a plan for making something"]],
          standards: [n("K-PS3-1"), n("K-PS3-2"), n("K-2-ETS1-1")],
          body: `
**Sunlight warms things up.** Touch a slide in the sun: it's hot! Touch a slide in the shade: it's cooler.

**Shade** happens when something blocks the sunlight.
- 🌳 Trees
- ⛱️ Umbrellas
- ⛺ Tents
- 🧢 Hats

**Be an engineer!** Problem: an ice cube melts fast in the sun. Can you build a shade to slow it down?
1. **Plan:** pick materials like paper, foil, sticks, or cloth.
2. **Build** a little roof over the ice cube.
3. **Test:** put one ice cube in the sun and one under your shade.
4. **Compare:** which melted slower?

Which material made the best shade? Thick things that block light usually work best.`,
          questions: [
            mc("Where would a metal slide feel coolest?", "In the shade", ["In the sun", "Next to a fire", "In a hot car"], "Shade blocks sunlight's warming."),
            mc("What makes shade?", "Something that blocks sunlight", ["A mirror on the ground", "A glass of water", "A flashlight"], "Blocking light creates shade."),
            tf("An ice cube will melt slower in the shade than in the sun.", true, "Less sunlight means less warming."),
            mc("To test your shade fairly, you should…", "put one ice cube in sun and one under the shade", ["use only one ice cube", "put both in the freezer", "eat the ice cubes"], "Comparing shows if the shade helped."),
          ],
        },
      ],
    },
  ],
  "sci-1": [
    {
      title: "Survival and Signals",
      description: "Learn how body parts help living things survive and how people send signals.",
      lessons: [
        {
          title: "Body Parts for Survival",
          summary: "Plants and animals have parts that help them survive, and people copy these ideas.",
          objectives: ["Describe how plant and animal parts help them survive", "Give examples of inventions inspired by nature"],
          vocab: [["survive", "stay alive"], ["structure", "a body part with a job"], ["mimic", "copy"]],
          standards: [n("1-LS1-1")],
          body: `
Every living thing has **parts** that help it survive.

**Animals**
- 🦔 A porcupine's **quills** protect it.
- 🦅 An eagle's sharp **eyes** spot food from far away.
- 🐢 A turtle's **shell** keeps it safe.
- 🦆 A duck's **webbed feet** help it swim.

**Plants**
- 🌵 Cactus **spines** keep animals from eating it.
- 🌳 **Roots** take in water and hold the plant in place.

**People copy nature!**
- Swim **flippers** copy duck feet.
- **Velcro** was invented after a man saw burrs stuck to his dog.
- **Helmets** work like turtle shells.`,
          questions: [
            mc("What do a turtle's shell and a bike helmet have in common?", "Both protect", ["Both help you swim", "Both make food", "Both help you see"], "Both are hard coverings for protection."),
            mc("Which invention copies duck feet?", "Swim flippers", ["Sunglasses", "Umbrellas", "Shoes with wheels"], "Flippers push water like webbed feet."),
            tf("Plant roots help hold a plant in the ground.", true, "Roots anchor the plant and take in water."),
            mc("How do a cactus's spines help it survive?", "They keep animals from eating it", ["They make it grow fast", "They help it swim", "They make it smell good"], "Sharp spines protect the cactus."),
          ],
        },
        {
          title: "Communicating with Light and Sound",
          summary: "People use light and sound to send messages over a distance.",
          objectives: ["Describe ways people use light and sound to communicate", "Design a simple signal code"],
          vocab: [["signal", "a sign that sends a message"], ["code", "a set of signals with meanings"], ["communicate", "share information"]],
          standards: [n("1-PS4-4"), n("1-PS4-1")],
          body: `
People use **light** and **sound** to send messages, even far away.

**Light signals**
- 🚦 Traffic lights: red means stop, green means go
- 🔦 Flashlight blinks
- 🗼 Lighthouses warn ships about rocks

**Sound signals**
- 🔔 School bells
- 🚒 Sirens say "move out of the way!"
- 🥁 Long ago, drums sent messages between villages

**Make a code!** With a partner, use a flashlight:
- 1 blink = "yes"
- 2 blinks = "no"
- 3 blinks = "come here"

**Sound makes things vibrate.** Put your hand on your throat and hum: you can feel it buzz!`,
          questions: [
            mc("What does a red traffic light mean?", "Stop", ["Go", "Turn around", "Speed up"], "Red means stop."),
            mc("Why does a lighthouse shine a light?", "To warn ships about danger", ["To help plants grow", "To cook food", "To scare birds"], "Lighthouses guide ships safely."),
            tf("Sound is made when things vibrate.", true, "Vibrations make sound."),
            mc("A fire truck's siren is a…", "sound signal", ["light signal only", "smell signal", "taste signal"], "Sirens use sound to warn people."),
          ],
        },
      ],
    },
    {
      title: "Patterns in the Sky and Light",
      description: "Watch the moon change shape and explore mirrors and reflection.",
      lessons: [
        {
          title: "The Moon's Changing Shape",
          summary: "The moon seems to change shape in a pattern that repeats about every month.",
          objectives: ["Describe the pattern of the moon's phases", "Predict the next phase"],
          vocab: [["phase", "the shape of the moon we see"], ["full moon", "when we see the whole lit side"], ["new moon", "when we can't see the moon"]],
          standards: [n("1-ESS1-1")],
          body: `
The moon doesn't make its own light. It **reflects sunlight**.

As the moon moves around Earth, we see different amounts of its lit side. These shapes are called **phases**.

🌑 New moon → 🌒 Crescent → 🌓 Half → 🌔 Gibbous → 🌕 **Full moon** → 🌖 → 🌗 → 🌘 → 🌑

- The lit part **grows** for about two weeks.
- Then it **shrinks** for about two weeks.
- The pattern **repeats about every month** (29½ days).

**Moon journal:** draw the moon every night for a month. You'll see the pattern yourself!

**Fun fact:** the moon can sometimes be seen in the daytime.`,
          questions: [
            mc("Where does the moon's light come from?", "The sun", ["The moon makes it", "Street lights", "Stars"], "The moon reflects sunlight."),
            mc("What phase comes after a crescent that is growing?", "Half moon", ["New moon", "Full moon", "No moon"], "The lit part keeps growing."),
            tf("The moon's phases repeat about every month.", true, "The full cycle takes about 29½ days."),
            mc("When we see the whole round moon, it is a…", "full moon", ["new moon", "crescent moon", "half moon"], "We see the entire lit side."),
          ],
        },
        {
          title: "Mirrors and Reflection",
          summary: "Light bounces off mirrors and shiny surfaces; some materials let light through.",
          objectives: ["Describe how mirrors reflect light", "Sort materials as transparent, translucent, or opaque"],
          vocab: [["reflect", "bounce back"], ["transparent", "lets all light through, like clear glass"], ["translucent", "lets some light through, like wax paper"], ["opaque", "blocks light, like wood"]],
          standards: [n("1-PS4-3"), n("1-PS4-2")],
          body: `
**Mirrors reflect light.** Light bounces off them like a ball off a wall. That's how you see yourself!

**Try it:** shine a flashlight at a mirror. Where does the light spot land? Move the mirror to make the light go a new way.

**What happens when light hits different things?**
| Material | Light? | Example |
|---|---|---|
| Transparent | goes through | clear glass, plastic wrap |
| Translucent | some goes through | wax paper, frosted glass |
| Opaque | blocked | wood, cardboard, your hand |
| Reflective | bounces | mirror, foil, spoon |

**Opaque things make shadows** because they block light.

We can only **see** things when light reaches our eyes.`,
          questions: [
            mc("What does a mirror do to light?", "Reflects it", ["Eats it", "Makes it colder", "Turns it into sound"], "Light bounces off a mirror."),
            mc("A window lets light through. It is…", "transparent", ["opaque", "reflective only", "dark"], "Clear glass lets light through."),
            mc("Which material is opaque?", "Cardboard", ["Clear plastic", "Air", "Window glass"], "Cardboard blocks light."),
            tf("You can see objects in a completely dark room with no light.", false, "We need light to see."),
          ],
        },
      ],
    },
  ],
  "sci-2": [
    {
      title: "Materials and Habitats",
      description: "Build with small pieces and explore the variety of life in different habitats.",
      lessons: [
        {
          title: "Building from Small Pieces",
          summary: "Objects can be taken apart and the pieces used to build something new.",
          objectives: ["Explain that objects are made of smaller pieces", "Describe how the same pieces can make different objects"],
          vocab: [["piece", "a small part of something bigger"], ["build", "put pieces together"], ["material", "what something is made of"]],
          standards: [n("2-PS1-3"), n("2-PS1-2")],
          body: `
Big things are made from **small pieces**.

- 🧱 A wall is made of bricks.
- 🏠 A house is made of boards, nails, and windows.
- 🧩 A puzzle is made of pieces.

**Same pieces, new object!** With 10 blocks, you can build:
- a tower
- a bridge
- a car

The blocks don't change. Only the **shape** of what you built changes.

**Picking the right material:** builders choose materials for their **properties**.
- Wood is strong and easy to cut → good for houses
- Glass is clear → good for windows
- Rubber is bendy → good for tires

**Try it:** build a boat, then take it apart and build an animal with the same pieces.`,
          questions: [
            tf("The same set of blocks can be used to build different things.", true, "Pieces can be rearranged."),
            mc("Why are windows made of glass?", "Glass is clear", ["Glass is bendy", "Glass is soft", "Glass is fuzzy"], "Clear glass lets light in."),
            mc("A brick wall is made of…", "many small bricks", ["one giant brick", "water", "paper"], "Small pieces build the wall."),
            mc("Which material is best for a bike tire?", "Rubber", ["Glass", "Paper", "Stone"], "Rubber bends and grips the road."),
          ],
        },
        {
          title: "Habitats and Biodiversity",
          summary: "Different habitats are home to many different kinds of plants and animals.",
          objectives: ["Compare the living things found in different habitats", "Explain why biodiversity matters"],
          vocab: [["habitat", "the place where a plant or animal lives"], ["biodiversity", "the variety of living things in a place"]],
          standards: [n("2-LS4-1")],
          body: `
A **habitat** is a home for plants and animals.

| Habitat | Plants | Animals |
|---|---|---|
| 🌊 Ocean | seaweed | fish, whales, crabs |
| 🌳 Forest | oak trees, ferns | deer, owls, squirrels |
| 🏜️ Desert | cactus | lizards, snakes, camels |
| ❄️ Arctic | moss | polar bears, seals |
| 🌴 Rainforest | vines, giant trees | monkeys, parrots, frogs |

**Biodiversity** means lots of different kinds of living things. Rainforests have the most!

**Look in your backyard.** Count how many kinds of plants and bugs you find. Compare it with a parking lot. Which has more biodiversity?

Biodiversity matters because living things depend on each other for food and shelter.`,
          questions: [
            mc("Which habitat has the most kinds of living things?", "Rainforest", ["Desert", "Arctic", "Parking lot"], "Rainforests have the most biodiversity."),
            mc("Where would you find a polar bear?", "Arctic", ["Desert", "Rainforest", "Pond"], "Polar bears live where it is very cold."),
            mc("What does biodiversity mean?", "Many kinds of living things in a place", ["A big rock", "A weather pattern", "One kind of animal"], "Bio means life; diversity means variety."),
            tf("A backyard garden usually has more kinds of living things than a parking lot.", true, "Plants provide food and shelter for many living things."),
          ],
        },
      ],
    },
    {
      title: "A Changing Earth",
      description: "See how Earth changes quickly and slowly, and how people slow erosion.",
      lessons: [
        {
          title: "Fast and Slow Changes",
          summary: "Some Earth events happen in minutes; others take thousands of years.",
          objectives: ["Sort Earth events as fast or slow", "Give examples of each"],
          vocab: [["erosion", "when water or wind moves rock and soil"], ["landslide", "rock and dirt sliding down a hill"], ["canyon", "a deep valley carved by a river"]],
          standards: [n("2-ESS1-1")],
          body: `
Earth is always changing, sometimes **fast** and sometimes **slow**.

**Fast changes** (minutes to days)
- 🌋 Volcanoes erupt
- 🌍 Earthquakes shake the ground
- ⛰️ Landslides
- 🌊 Floods

**Slow changes** (hundreds to millions of years)
- 🏜️ The Grand Canyon was carved by the Colorado River over millions of years
- 🪨 Wind and rain wear down mountains
- 🧊 Glaciers slowly carve valleys

**Clue from rocks:** a smooth river rock was once rough. Water rubbed it smooth over a long, long time.`,
          questions: [
            mc("Which change happens fast?", "An earthquake", ["A canyon forming", "A mountain wearing down", "A glacier carving a valley"], "Earthquakes happen in seconds to minutes."),
            mc("How long did it take the river to carve the Grand Canyon?", "Millions of years", ["One day", "One week", "One year"], "Slow erosion over millions of years."),
            tf("A smooth river rock was made smooth by water over a long time.", true, "Rubbing by water and sand slowly smooths rocks."),
            mc("A landslide is a…", "fast change", ["slow change", "change that never happens", "kind of weather"], "Landslides happen quickly."),
          ],
        },
        {
          title: "Stopping Erosion",
          summary: "Plants, walls, and other designs can slow wind and water from changing land.",
          objectives: ["Explain how wind and water cause erosion", "Compare solutions that slow erosion"],
          vocab: [["erosion", "moving soil and rock by wind or water"], ["retaining wall", "a wall that holds soil in place"], ["roots", "plant parts that hold soil"]],
          standards: [n("2-ESS2-1"), n("K-2-ETS1-3")],
          body: `
**Wind and water carry soil away.** This is **erosion**. It can damage homes, roads, and farms.

**Ways people slow erosion**
- 🌱 **Plant grass and trees:** roots hold soil like a net
- 🧱 **Retaining walls** hold back hills
- 🪨 **Big rocks** along beaches break up waves
- 🌾 **Windbreaks** (rows of trees) slow wind on farms
- 🏗️ **Sandbags** stop floodwater

**Test it!** Fill two trays with soil. Plant grass seeds in one. After the grass grows, pour water on both. Which tray loses more soil?

The bare tray loses more. Roots hold soil in place!`,
          questions: [
            mc("How do plant roots stop erosion?", "They hold soil in place", ["They make rain", "They push soil away", "They make soil hot"], "Roots hold soil like a net."),
            mc("Which would protect a beach house from waves?", "A row of big rocks", ["A paper fence", "A sandcastle", "A pile of leaves"], "Big rocks break up waves."),
            tf("Wind can cause erosion.", true, "Wind blows soil and sand away."),
            mc("In the tray test, which tray loses more soil?", "The tray with no plants", ["The tray with grass", "They lose the same", "Neither loses soil"], "Without roots, water washes soil away."),
          ],
        },
      ],
    },
  ],
  "sci-3": [
    {
      title: "Traits and Fossils",
      description: "Explore inherited traits and what fossils tell us about the past.",
      lessons: [
        {
          title: "Inherited Traits and the Environment",
          summary: "Living things inherit traits from their parents, but the environment can change traits too.",
          objectives: ["Distinguish inherited traits from those influenced by the environment", "Explain variation among offspring"],
          vocab: [["trait", "a feature of a living thing"], ["inherited", "passed down from parents"], ["variation", "differences among individuals"]],
          standards: [n("3-LS3-1"), n("3-LS3-2")],
          body: `
**Inherited traits** come from parents:
- Eye color
- A dog's fur color
- The shape of a leaf

Offspring look **similar** to their parents but not exactly the same. Puppies in one litter can have different spots. This is **variation**.

**The environment can change traits too:**
- A plant without enough sunlight grows tall, thin, and pale.
- A person who lifts weights builds stronger muscles.
- Flamingos are pink because of the shrimp they eat!
- Hydrangea flowers are blue or pink depending on the soil.

**Learned behaviors** (like riding a bike or reading) are not inherited.`,
          questions: [
            mc("Which trait is inherited?", "Eye color", ["Knowing how to swim", "A scar", "Speaking Spanish"], "Eye color is passed from parents."),
            mc("Why are flamingos pink?", "Because of the food they eat", ["They paint themselves", "Their eggs are pink", "The sun colors them"], "Shrimp and algae in their diet turn them pink."),
            tf("Puppies from the same parents always look exactly alike.", false, "Offspring show variation."),
            mc("A plant grown in a dark closet is pale and thin. This shows…", "the environment can affect traits", ["the plant inherited paleness", "plants don't need light", "the seed was bad"], "Lack of light changed how it grew."),
          ],
        },
        {
          title: "Fossils: Clues to the Past",
          summary: "Fossils show what organisms and environments were like long ago.",
          objectives: ["Explain how fossils form", "Use fossils to infer past environments"],
          vocab: [["fossil", "the remains or traces of an ancient living thing preserved in rock"], ["extinct", "no longer living anywhere on Earth"], ["sediment", "sand, mud, and bits of rock that settle in layers"]],
          standards: [n("3-LS4-1")],
          body: `
**How fossils form**
1. A plant or animal dies and is buried by mud or sand (**sediment**).
2. Over millions of years, more layers pile on and harden into rock.
3. Minerals replace the bones or shells, turning them to stone.
4. Erosion or digging uncovers the fossil.

**Kinds of fossils:** bones, shells, footprints, leaf prints, even insects trapped in amber.

**Fossils tell stories**
- A fish fossil on a mountaintop → that land was once under water.
- Palm tree fossils in Antarctica → it was once warm there.
- Dinosaur fossils → animals that are now **extinct**.

**Deeper rock layers are usually older**, so fossils in lower layers lived earlier.`,
          questions: [
            mc("A seashell fossil is found in a desert. What does that tell us?", "The area was once covered by water", ["Shells can walk", "It always was a desert", "Someone dropped it yesterday"], "Sea animals lived where the land was once under water."),
            mc("Which fossils are usually older?", "Ones in deeper rock layers", ["Ones near the surface", "Ones that are bigger", "Ones that are lighter"], "Lower layers formed first."),
            tf("A footprint preserved in rock can be a fossil.", true, "Trace fossils include footprints and burrows."),
            mc("An animal that no longer lives anywhere on Earth is…", "extinct", ["endangered", "a fossil fuel", "a habitat"], "Dinosaurs are extinct."),
          ],
        },
      ],
    },
    {
      title: "Survival in Groups and Changing Habitats",
      description: "See how groups help animals survive and what happens when habitats change.",
      lessons: [
        {
          title: "Living in Groups",
          summary: "Many animals survive better by living and working together in groups.",
          objectives: ["Give examples of animals that live in groups", "Explain how groups help members survive"],
          vocab: [["herd", "a group of grazing animals"], ["colony", "a group of insects, like ants or bees, living together"], ["predator", "an animal that hunts other animals"]],
          standards: [n("3-LS2-1")],
          body: `
Many animals live in **groups**. Groups help them survive.

| Group | Animal | How it helps |
|---|---|---|
| Pack | wolves | hunt big prey together |
| Herd | zebras | many eyes watch for lions |
| School | fish | confuses predators |
| Colony | bees | jobs: queen, workers, guards |
| Pod | dolphins | care for young together |

**Honeybee colonies** have up to 60,000 bees. Workers gather nectar, nurses feed babies, and guards protect the hive.

**Penguins huddle** to stay warm in Antarctic storms, taking turns on the cold outside edge.

**Not all animals live in groups.** Tigers and bears mostly live alone.`,
          questions: [
            mc("How does living in a herd help zebras?", "More eyes watch for predators", ["They can fly", "They never eat", "They grow faster"], "Many zebras can spot danger sooner."),
            mc("Why do penguins huddle?", "To stay warm", ["To hide food", "To fly", "To build nests"], "Sharing body heat keeps them warm."),
            tf("All animals live in groups.", false, "Tigers and bears mostly live alone."),
            mc("Wolves hunt in a…", "pack", ["school", "colony", "pod"], "A wolf group is a pack."),
          ],
        },
        {
          title: "When Habitats Change",
          summary: "When environments change, some organisms survive, some move, and some die.",
          objectives: ["Explain how organisms are suited to their habitats", "Predict effects of habitat change and evaluate solutions"],
          vocab: [["adaptation", "a trait that helps an organism survive where it lives"], ["habitat loss", "when a habitat is destroyed or changed"], ["migrate", "move to a new place"]],
          standards: [n("3-LS4-3"), n("3-LS4-4")],
          body: `
**Adaptations** help organisms survive in their habitat.
- Camels store fat in their humps for long trips without food.
- Arctic foxes have thick white fur.
- Cactuses store water.

**When a habitat changes:**
- Some organisms **survive** because their traits still work.
- Some **move** (migrate) to new places.
- Some **die out**.

**Example:** a wetland is drained to build houses. Frogs and ducks lose their homes.

**Solutions people use**
- Wildlife bridges over highways
- Protected parks and refuges
- Replanting forests
- Building new wetlands

**Think:** if a forest becomes a field, which animals would do well? Which would struggle?`,
          questions: [
            mc("Which adaptation helps an arctic fox?", "Thick white fur", ["Thin skin", "Webbed feet", "Bright red color"], "Thick fur keeps it warm; white blends with snow."),
            mc("A forest is cut down. What might happen to the owls that lived there?", "They move or die out", ["They turn into fish", "Nothing changes", "They grow bigger"], "Losing habitat forces animals to move or die."),
            tf("A wildlife bridge helps animals cross highways safely.", true, "It reconnects habitats split by roads."),
            mc("Which is an adaptation of a cactus?", "Storing water", ["Growing fur", "Swimming", "Hunting"], "Cactuses store water for dry times."),
          ],
        },
      ],
    },
  ],
  "sci-4": [
    {
      title: "Structures and Senses",
      description: "Explore internal and external structures and how animals process information.",
      lessons: [
        {
          title: "Plant and Animal Structures",
          summary: "Internal and external structures help plants and animals grow, survive, and reproduce.",
          objectives: ["Describe functions of internal and external structures", "Argue how a structure supports survival"],
          vocab: [["internal", "inside the body"], ["external", "outside the body"], ["function", "the job a structure does"]],
          standards: [n("4-LS1-1")],
          body: `
**Structures** are parts with jobs (**functions**).

**Animals**
| Structure | Internal/External | Function |
|---|---|---|
| Heart | internal | pumps blood |
| Lungs | internal | take in oxygen |
| Skeleton | internal | support and protection |
| Claws | external | grab and dig |
| Feathers | external | warmth and flight |

**Plants**
| Structure | Function |
|---|---|
| Roots | take in water, anchor |
| Stem | carry water and food, support |
| Leaves | make food from sunlight |
| Flowers | make seeds (reproduce) |
| Thorns | protection |

**Structures work together as systems.** The heart, blood, and vessels make the circulatory system.`,
          questions: [
            mc("What is the function of a plant's leaves?", "Make food from sunlight", ["Hold the plant in the ground", "Make seeds", "Protect from animals"], "Leaves carry out photosynthesis."),
            mc("Which is an internal structure?", "Lungs", ["Claws", "Feathers", "Shell"], "Lungs are inside the body."),
            tf("Flowers help plants reproduce.", true, "Flowers make seeds."),
            mc("What does the skeleton do?", "Supports and protects the body", ["Pumps blood", "Digests food", "Makes food from sunlight"], "Bones give the body shape and protect organs."),
          ],
        },
        {
          title: "Senses and Information",
          summary: "Animals receive information through senses, process it in the brain, and respond.",
          objectives: ["Describe how senses gather information", "Model the path from sense to brain to response"],
          vocab: [["sense", "a way of receiving information: sight, hearing, touch, smell, taste"], ["nerve", "a pathway carrying signals to and from the brain"], ["stimulus", "something that causes a response"]],
          standards: [n("4-LS1-2"), n("4-PS4-2")],
          body: `
**Senses** collect information. **Nerves** carry it to the **brain**. The brain decides how to **respond**.

**Example:** touching a hot stove
1. Skin feels heat (sense)
2. Nerves send a signal to the brain/spinal cord
3. You pull your hand away (response) — in less than a second!

**Animal super senses**
- 🦇 Bats use **echolocation**: they hear echoes of their squeaks.
- 🦈 Sharks smell a drop of blood from far away.
- 🐍 Some snakes sense heat from warm animals.
- 🦅 Hawks see a mouse from high in the sky.

**How eyes see:** light bounces off an object and enters your eye. Your eye sends the image to your brain.

**Memories** help animals respond better next time.`,
          questions: [
            mc("What carries signals from the senses to the brain?", "Nerves", ["Bones", "Blood", "Muscles"], "Nerves are the body's messengers."),
            mc("How do bats find insects in the dark?", "Echolocation", ["Smelling flowers", "Bright eyes", "Glowing wings"], "They listen to echoes."),
            tf("We see an object when light from it enters our eyes.", true, "Light reflects into our eyes."),
            mc("You hear a fire alarm and walk outside. Walking outside is the…", "response", ["stimulus", "sense", "nerve"], "The alarm is the stimulus; walking out is the response."),
          ],
        },
      ],
    },
    {
      title: "Mapping Earth and Natural Hazards",
      description: "Read maps for patterns and reduce the impact of earthquakes and volcanoes.",
      lessons: [
        {
          title: "Maps and Earth's Features",
          summary: "Maps show patterns: mountains, volcanoes, and earthquakes often line up along plate edges.",
          objectives: ["Read physical maps and keys", "Identify patterns in the locations of Earth's features"],
          vocab: [["map key", "explains the symbols and colors on a map"], ["plate", "a giant slab of Earth's crust"], ["ocean trench", "a deep valley in the ocean floor"]],
          standards: [n("4-ESS2-2")],
          body: `
**Maps** show where things are. A **key** tells what colors and symbols mean.

**Physical maps** show land features:
- Brown → mountains
- Green → low land
- Blue → water (darker = deeper)

**Patterns!** Put earthquakes and volcanoes on a world map. They form lines!
- The **Ring of Fire** circles the Pacific Ocean. It has 75% of the world's volcanoes.
- These lines mark the edges of Earth's **plates**.
- Mountain ranges (Andes, Rockies, Himalayas) form where plates push together.
- Deep **ocean trenches** form where one plate slides under another.

**Topographic maps** use lines to show how high land is. Close lines mean steep.`,
          questions: [
            mc("What does a map key do?", "Explains what symbols and colors mean", ["Unlocks the map", "Shows the time", "Measures weight"], "The key decodes the map."),
            mc("Where are most volcanoes and earthquakes found?", "Along the edges of plates", ["In the middle of plates", "Only at the poles", "Randomly everywhere"], "Plate boundaries are active."),
            tf("The Ring of Fire surrounds the Pacific Ocean.", true, "It has most of Earth's volcanoes."),
            mc("On a topographic map, lines close together mean…", "steep land", ["flat land", "water", "a city"], "Elevation changes quickly."),
          ],
        },
        {
          title: "Earthquakes and Volcanoes: Staying Safe",
          summary: "Engineers design solutions to reduce damage from earthquakes, volcanoes, tsunamis, and floods.",
          objectives: ["Describe natural hazards", "Compare engineering solutions that reduce their impact"],
          vocab: [["natural hazard", "a natural event that can harm people"], ["seismometer", "a tool that measures earthquakes"], ["tsunami", "a giant ocean wave caused by an undersea earthquake"]],
          standards: [n("4-ESS3-2"), n("3-5-ETS1-2")],
          body: `
**Natural hazards** can't be stopped, but engineers reduce the damage.

| Hazard | Solution |
|---|---|
| Earthquake | buildings with flexible frames and shock-absorbing bases |
| Volcano | monitoring gas and ground swelling, evacuation plans |
| Tsunami | warning buoys, sirens, sea walls, evacuation routes |
| Flood | levees, dams, raised houses |
| Landslide | retaining walls, plant roots |

**Seismometers** measure earthquakes. Scientists use them to send warnings.

**Japan** builds skyscrapers that sway instead of breaking. Some sit on giant rubber pads!

**Compare solutions:** which is better for a town near a volcano, a strong wall or a good evacuation plan? Lava and ash can't be stopped by most walls, so evacuation and warnings save the most lives.`,
          questions: [
            mc("What does a seismometer measure?", "Earthquakes", ["Rain", "Wind speed", "Temperature"], "Seismo means shaking."),
            mc("How do some buildings survive earthquakes?", "Flexible frames and shock-absorbing bases", ["Glass walls", "Being very tall and stiff", "Paper roofs"], "Flexing absorbs shaking energy."),
            tf("A tsunami is caused by an undersea earthquake.", true, "The quake pushes up huge amounts of water."),
            mc("Which solution protects towns from river floods?", "Levees", ["Seismometers", "Rubber pads", "Wind turbines"], "Levees are walls along rivers."),
          ],
        },
      ],
    },
  ],
  "sci-5": [
    {
      title: "Properties of Matter",
      description: "Identify materials by their properties and investigate mixtures.",
      lessons: [
        {
          title: "Identifying Materials by Properties",
          summary: "Scientists identify materials by measurable properties like hardness, magnetism, and conductivity.",
          objectives: ["Measure and describe properties of materials", "Use properties to identify unknown substances"],
          vocab: [["property", "a characteristic you can observe or measure"], ["conductor", "a material that lets heat or electricity flow"], ["solubility", "how well a substance dissolves"]],
          standards: [n("5-PS1-3")],
          body: `
Every material has **properties** that help identify it.

| Property | Test |
|---|---|
| Color, shine | look |
| Hardness | scratch test |
| Magnetism | does a magnet attract it? |
| Conductivity | does electricity or heat flow through it? |
| Solubility | does it dissolve in water? |
| Reflectivity | does it reflect light? |

**Mystery powders!** Three white powders: sugar, salt, and baking soda.
- Add vinegar: baking soda **fizzes**.
- Add water: sugar and salt dissolve; look at crystals with a magnifier: salt crystals are cubes.
- Add iodine: cornstarch turns **dark blue/black**.

**Metals** are usually shiny, good conductors, and some (iron, nickel) are magnetic.`,
          questions: [
            mc("Which test would separate iron filings from sand?", "A magnet", ["Water", "Color", "Smell"], "Iron is magnetic; sand isn't."),
            mc("Which white powder fizzes with vinegar?", "Baking soda", ["Sugar", "Salt", "Flour"], "Baking soda reacts with acid."),
            tf("Copper is a good conductor of electricity.", true, "That's why wires use copper."),
            mc("Solubility describes…", "how well something dissolves", ["how heavy something is", "how shiny something is", "how hard something is"], "Soluble substances dissolve."),
          ],
        },
        {
          title: "Mixtures and Solutions",
          summary: "Mixtures combine substances without changing them; total weight stays the same.",
          objectives: ["Distinguish mixtures, solutions, and new substances", "Show that weight is conserved when mixing"],
          vocab: [["mixture", "two or more substances combined that keep their own properties"], ["solution", "a mixture where one substance dissolves evenly"], ["conservation of matter", "matter is not created or destroyed"]],
          standards: [n("5-PS1-4"), n("5-PS1-2")],
          body: `
A **mixture** combines substances that keep their own properties.
- Trail mix 🥜: you can pick out each piece
- Sand and iron filings: separate with a magnet

A **solution** is a mixture where one thing **dissolves** evenly.
- Salt water: the salt seems to disappear, but you can taste it
- Evaporate the water and the salt comes back!

**New substances** form in **chemical reactions**: baking soda + vinegar makes a gas (bubbles).

**Conservation of matter**
- 100 g water + 10 g salt = **110 g** salt water
- Weight is the same before and after, even when something dissolves or reacts (in a closed container).

**Separating mixtures:** filter, magnet, sieve, evaporation.`,
          questions: [
            num("50 g of water and 5 g of sugar are mixed. What is the total mass in grams?", 55, "Mass is conserved: 50 + 5 = 55."),
            mc("How can you get salt back from salt water?", "Evaporate the water", ["Use a magnet", "Freeze it", "Shake it"], "When water evaporates, salt is left behind."),
            mc("Which is a solution?", "Sugar dissolved in tea", ["Trail mix", "Sand and rocks", "A salad"], "Sugar dissolves evenly."),
            tf("When sugar dissolves in water, the sugar is destroyed.", false, "It's still there; matter is conserved."),
          ],
        },
      ],
    },
    {
      title: "Earth's Systems",
      description: "Model how Earth's spheres interact and where Earth's water is found.",
      lessons: [
        {
          title: "Earth's Four Spheres",
          summary: "The geosphere, hydrosphere, atmosphere, and biosphere interact to shape Earth.",
          objectives: ["Name and describe Earth's four spheres", "Describe interactions between spheres"],
          vocab: [["geosphere", "rock and soil"], ["hydrosphere", "all water"], ["atmosphere", "the air around Earth"], ["biosphere", "all living things"]],
          standards: [n("5-ESS2-1")],
          body: `
Earth has four main systems (**spheres**):

| Sphere | What it includes |
|---|---|
| 🪨 Geosphere | rocks, soil, mountains |
| 💧 Hydrosphere | oceans, rivers, ice, groundwater |
| 💨 Atmosphere | air, clouds, weather |
| 🌱 Biosphere | plants, animals, people |

**The spheres interact!**
- Rain (atmosphere) erodes mountains (geosphere).
- Plants (biosphere) release oxygen into the air (atmosphere).
- Oceans (hydrosphere) warm the air and make hurricanes (atmosphere).
- Tree roots (biosphere) break apart rocks (geosphere).
- Volcanoes (geosphere) put ash into the air (atmosphere).

**One event can affect all four.** A volcano erupts → ash fills the air → blocks sunlight → plants struggle → ash settles on land and in rivers.`,
          questions: [
            mc("Which sphere includes clouds?", "Atmosphere", ["Geosphere", "Biosphere", "Hydrosphere"], "Clouds are part of the air system.", "Clouds are made of water droplets, but they float in the air."),
            mc("Tree roots break apart rocks. Which two spheres interact?", "Biosphere and geosphere", ["Atmosphere and hydrosphere", "Hydrosphere and geosphere", "Atmosphere and biosphere"], "Living roots and rock."),
            tf("Plants releasing oxygen is an interaction between the biosphere and atmosphere.", true, "Plants add oxygen to the air."),
            mc("Oceans belong to which sphere?", "Hydrosphere", ["Geosphere", "Atmosphere", "Biosphere"], "Hydro means water."),
          ],
        },
        {
          title: "Where Is Earth's Water?",
          summary: "Most of Earth's water is salty ocean; only a tiny part is fresh liquid water we can use.",
          objectives: ["Describe the distribution of Earth's water", "Explain why conserving fresh water matters"],
          vocab: [["fresh water", "water with little salt"], ["glacier", "a huge, slow-moving mass of ice"], ["groundwater", "water stored underground in soil and rock"]],
          standards: [n("5-ESS2-2"), n("5-ESS3-1")],
          body: `
Earth looks blue from space, but most water isn't drinkable!

| Where | Share of Earth's water |
|---|---|
| Oceans (salt) | about **97%** |
| Glaciers and ice caps | about 2% |
| Groundwater | about 1% |
| Lakes, rivers, air | less than 0.1% |

**Only about 1% is fresh liquid water** people can easily use.

**Picture it:** if all Earth's water were 100 cups, 97 would be salty. About 2 would be frozen. Less than 1 cup is ready to use!

**Saving water**
- Fix leaky faucets
- Take shorter showers
- Water gardens in the morning
- Collect rainwater

Many places, like deserts, depend on **groundwater** pumped from wells.`,
          questions: [
            num("About what percent of Earth's water is in the oceans?", 97, "Most water is salty ocean water.", { tolerance: 1 }),
            mc("Where is most of Earth's fresh water?", "Glaciers and ice caps", ["Rivers", "Lakes", "Clouds"], "Most fresh water is frozen."),
            tf("Most of Earth's water is safe to drink without treatment.", false, "97% is salty; much fresh water is frozen."),
            mc("Which saves water?", "Fixing a leaky faucet", ["Running the sprinkler at noon", "Taking long showers", "Leaving the hose on"], "Leaks waste lots of water."),
          ],
        },
      ],
    },
  ],
};
