import { mc, num, short, tf, type CourseSpec } from "../dsl";

const NGSS_ETS = "Next Generation Science Standards: Engineering Design";

export const engineeringCourses2: CourseSpec[] = [
  {
    id: "eng-robo-68",
    title: "Robotics & Automation",
    subject: "engineering",
    grade: 6,
    gradeMax: 8,
    framework: NGSS_ETS,
    description: "Design, build, and program robots: drivetrains, gears, sensors, feedback control, and automation in the real world.",
    units: [
      {
        title: "Robot Systems",
        description: "Understand robot subsystems and how robots are used.",
        lessons: [
          {
            title: "Robots in the Real World",
            summary: "Robots perform dangerous, repetitive, and precise tasks in industry, medicine, and exploration.",
            objectives: ["Describe uses of robots across industries", "Evaluate benefits and drawbacks of automation"],
            vocab: [["automation", "using machines to perform tasks without constant human control"], ["industrial robot", "a programmable robot arm used in manufacturing"], ["autonomous", "able to operate without human control"]],
            standards: ["MS-ETS1-1", "2-IC-20"],
            body: `
**Where robots work**
| Field | Example |
|---|---|
| Manufacturing | welding car bodies, packaging |
| Warehouses | moving shelves to workers |
| Medicine | surgical robots for precise, minimally invasive surgery |
| Exploration | Mars rovers, deep-sea robots |
| Agriculture | robotic milking, weeding, fruit picking |
| Homes | robot vacuums, lawn mowers |
| Disaster response | bomb disposal, searching collapsed buildings |

**The "3 D's":** robots are best for jobs that are **dull, dirty, or dangerous** — plus jobs needing extreme precision.

**Automation trade-offs**
- ✅ Safer workplaces, consistent quality, 24/7 operation
- ❌ Some jobs disappear; high upfront cost; new skills needed
- ➕ New jobs: robot technicians, programmers, designers

**Mars rover Perseverance** drives itself because radio signals take up to 20 minutes each way between Earth and Mars.`,
            questions: [
              mc("Which task is best suited to a robot?", "Welding the same joint thousands of times", ["Comforting a scared child", "Writing a novel", "Judging an art contest"], "Repetitive, precise, and hazardous."),
              mc("Why must Mars rovers be partly autonomous?", "Radio signals take many minutes to travel each way", ["Mars has no radio waves", "NASA has no drivers", "Rovers are too fast"], "Real-time remote control is impossible."),
              tf("Automation can eliminate some jobs while creating new ones.", true, "Technicians and programmers are needed."),
              mc("The '3 D's' robots are best for are…", "dull, dirty, dangerous", ["dark, dry, distant", "dance, draw, drive", "daily, digital, direct"], "Classic automation guideline."),
            ],
          },
          {
            title: "Robot Subsystems",
            summary: "Robots combine structure, drivetrain, power, sensors, control, and manipulators into one system.",
            objectives: ["Identify robot subsystems and their functions", "Explain how subsystems interact"],
            vocab: [["subsystem", "a part of a larger system with its own job"], ["drivetrain", "the parts that make a robot move"], ["end effector", "the tool at the end of a robot arm, like a gripper"], ["chassis", "the robot's frame"]],
            standards: ["MS-ETS1-2", "2-CS-02"],
            body: `
| Subsystem | Job | Examples |
|---|---|---|
| **Structure/chassis** | holds everything together | aluminum frame, plastic beams |
| **Drivetrain** | moves the robot | wheels, tracks, motors, gears |
| **Power** | supplies energy | batteries, voltage regulators |
| **Sensors** | gather information | distance, color, gyro, touch |
| **Control** | makes decisions | microcontroller, program |
| **Manipulator** | interacts with objects | arms, grippers, claws |
| **Communication** | links to people or other robots | Bluetooth, radio |

**Systems thinking:** changing one subsystem affects others.
- Heavier arm → need stronger motors → bigger battery → heavier robot → slower!

**Competition robots** (FIRST LEGO League, VEX IQ) have all these subsystems, scaled down.

**Design tip:** build and test subsystems separately, then integrate.`,
            questions: [
              mc("Which subsystem includes wheels and motors?", "Drivetrain", ["Sensors", "Control", "Communication"], "It moves the robot."),
              mc("A gripper on a robot arm is called an…", "end effector", ["accelerometer", "chassis", "drivetrain"], "The tool at the end of the arm."),
              tf("Adding a heavy arm can affect the robot's speed and battery life.", true, "Subsystems interact."),
              mc("What is the 'brain' subsystem?", "Control (microcontroller)", ["Chassis", "Battery", "Wheels"], "It runs the program."),
            ],
          },
        ],
      },
      {
        title: "Mechanical Design",
        description: "Build drivetrains and use gears to trade speed for torque.",
        lessons: [
          {
            title: "Drivetrains and Chassis",
            summary: "Drivetrain choice determines how a robot moves, turns, and handles terrain.",
            objectives: ["Compare drivetrain types", "Explain how wheel size affects speed and distance", "Calculate distance per rotation"],
            vocab: [["differential drive", "steering by spinning left and right wheels at different speeds"], ["omni wheel", "a wheel with rollers that can slide sideways"], ["circumference", "distance around a circle, C = πd"]],
            standards: ["MS-ETS1-2", "MS-PS2-2"],
            body: `
**Drivetrain types**
| Type | Pros | Cons |
|---|---|---|
| Differential (tank-style) | simple, turns in place | can't move sideways |
| Tracks | great traction on rough ground | slower, more friction |
| Omni/mecanum | moves in any direction | less pushing power, complex |

**Differential steering**
- Both wheels forward → straight
- Left faster than right → curves right
- Left forward, right backward → spins in place

**Distance per rotation = wheel circumference = π × diameter**
A 5.6 cm wheel: C = 3.14 × 5.6 ≈ **17.6 cm** per rotation
To travel 88 cm: 88 ÷ 17.6 = **5 rotations**

**Center of gravity:** keep heavy parts (batteries) low and centered to prevent tipping.`,
            questions: [
              num("A wheel has diameter 10 cm. About how far does it travel in one rotation (cm)? Use π ≈ 3.14.", 31.4, "C = 3.14 × 10.", { tolerance: 0.2 }),
              num("A wheel travels 20 cm per rotation. How many rotations to go 100 cm?", 5, "100 ÷ 20."),
              mc("To spin in place with differential drive, the wheels should…", "turn in opposite directions", ["both go forward", "both stop", "both go backward"], "Left forward, right backward."),
              tf("Placing batteries high on a robot improves stability.", false, "Low and centered weight prevents tipping."),
            ],
          },
          {
            title: "Gears and Gear Ratios",
            summary: "Gears trade speed for torque; gear ratios predict how output speed and force change.",
            objectives: ["Calculate gear ratios", "Predict speed and torque changes", "Choose gearing for a task"],
            vocab: [["gear ratio", "driven teeth ÷ driving teeth"], ["torque", "turning force"], ["driving gear", "the gear attached to the motor"], ["driven gear", "the gear that receives motion"]],
            standards: ["MS-ETS1-2", "MS-PS2-2"],
            body: `
**Gear ratio = driven teeth ÷ driving teeth**

**Small gear drives large gear** (12 → 36 teeth): ratio 3:1
- Output is **3× slower**
- Output has **3× more torque** (great for lifting arms)

**Large gear drives small gear** (36 → 12): ratio 1:3
- Output is **3× faster**
- Output has **⅓ the torque** (great for spinning flywheels)

**Direction:** two meshed gears turn in **opposite** directions. Add an idler gear in between to keep the same direction.

**Compound gears** multiply ratios: 3:1 then 5:1 = **15:1**

**You can't get something for nothing:** speed × torque stays (roughly) constant — gearing trades one for the other.

**Choosing:** a robot arm lifting heavy objects → high torque (gear down). A race robot → high speed (gear up).`,
            questions: [
              num("A 10-tooth motor gear drives a 40-tooth gear. What is the gear ratio (x:1)?", 4, "40 ÷ 10."),
              mc("With a 4:1 gear-down ratio, the output shaft is…", "4 times slower with 4 times more torque", ["4 times faster with more torque", "the same speed", "4 times faster with less torque only"], "Speed is traded for torque."),
              num("Two stages of 3:1 and 4:1 are combined. What is the total ratio (x:1)?", 12, "3 × 4."),
              tf("Two directly meshed gears turn in opposite directions.", true, "Add an idler to reverse that."),
            ],
          },
        ],
      },
      {
        title: "Sensors and Feedback",
        description: "Use sensors to perceive the environment and control behavior.",
        lessons: [
          {
            title: "Robot Sensors",
            summary: "Distance, color, touch, and gyro sensors let robots perceive their surroundings.",
            objectives: ["Choose sensors for robot tasks", "Interpret sensor readings", "Calibrate sensors"],
            vocab: [["ultrasonic sensor", "measures distance with sound echoes"], ["gyro sensor", "measures rotation and heading"], ["calibration", "adjusting a sensor so readings are accurate"], ["encoder", "counts motor rotations"]],
            standards: ["MS-ETS1-2", "2-CS-02"],
            body: `
| Sensor | Measures | Task |
|---|---|---|
| Touch/bump | contact | detect walls |
| Ultrasonic | distance | avoid obstacles |
| Color/light | reflected light, color | follow lines, sort objects |
| Gyro | rotation angle | turn exactly 90° |
| Encoder (rotation sensor) | wheel rotations | drive exact distances |
| Camera | images | recognize objects |

**Ultrasonic math:** sound travels ~343 m/s. An echo returning in 0.002 s → round trip 0.686 m → object is **0.343 m** away.

**Calibration:** light sensors read differently in different rooms. Measure "black" and "white" on the actual mat, then use the midpoint as your threshold.
Black = 10, white = 70 → threshold = **40**

**Sensor noise:** readings jump around. Average several readings for stability.`,
            questions: [
              num("A light sensor reads 8 on black and 72 on white. What threshold (midpoint) should you use?", 40, "(8 + 72) ÷ 2."),
              mc("Which sensor helps a robot turn exactly 90°?", "Gyro sensor", ["Touch sensor", "Color sensor", "Microphone"], "It measures rotation."),
              mc("Which sensor would a robot use to sort red and blue blocks?", "Color sensor", ["Gyro", "Ultrasonic", "Touch"], "It detects color."),
              tf("Sensors should be calibrated in the environment where the robot will operate.", true, "Lighting and surfaces vary."),
            ],
          },
          {
            title: "Feedback Control",
            summary: "Closed-loop control uses sensor feedback to correct errors; proportional control scales the correction.",
            objectives: ["Compare open-loop and closed-loop control", "Implement proportional line following", "Tune a control constant"],
            vocab: [["open-loop control", "acting without checking results"], ["closed-loop control", "using sensor feedback to adjust actions"], ["error", "the difference between target and actual value"], ["proportional control", "correction = gain × error"]],
            standards: ["MS-ETS1-4", "2-AP-13"],
            body: `
**Open loop:** "drive forward 3 seconds." If a wheel slips or the battery is low, the robot ends up in the wrong place.

**Closed loop:** "drive until the distance sensor reads 10 cm." The robot checks and adjusts.

**Bang-bang control** (on/off):
\`\`\`
if light < 40: turn left
else: turn right
\`\`\`
Works, but wobbles.

**Proportional (P) control:** correction proportional to error.
\`\`\`
error = light - 40
turn = Kp * error
left_motor = 30 + turn
right_motor = 30 - turn
\`\`\`
Reading 50 → error 10 → with Kp = 0.8, turn = **8**

**Tuning Kp**
- Too small → sluggish, drifts off the line
- Too large → overshoots and oscillates
- Just right → smooth and fast

**Everyday feedback:** thermostats, cruise control, your hand catching a ball.`,
            questions: [
              num("Target is 40, reading is 55, Kp = 0.5. What is the turn correction?", 7.5, "error 15 × 0.5."),
              mc("A thermostat that turns heat on below 68 °F is an example of…", "closed-loop control", ["open-loop control", "no control", "a gear ratio"], "It uses temperature feedback."),
              mc("If a line follower oscillates wildly, you should…", "decrease Kp", ["increase Kp", "remove the sensor", "add more wheels"], "Too much gain causes overshoot."),
              tf("Open-loop control automatically corrects for wheel slip.", false, "It doesn't check results."),
            ],
          },
        ],
      },
      {
        title: "Programming Robots",
        description: "Write structured programs and autonomous routines.",
        lessons: [
          {
            title: "Structured Robot Programs",
            summary: "Functions, loops, and variables make robot programs reliable and easy to change.",
            objectives: ["Write reusable functions for robot actions", "Use variables for tunable values", "Debug robot behavior systematically"],
            vocab: [["function", "a named, reusable block of code"], ["constant", "a fixed named value, like WHEEL_DIAMETER"], ["state", "the current mode a robot is in"]],
            standards: ["2-AP-13", "2-AP-14"],
            body: `
**Messy:** copy-pasted motor commands everywhere.
**Structured:** functions with parameters.

\`\`\`python
WHEEL_CM = 17.6   # distance per rotation

def drive_cm(distance, speed=50):
    rotations = distance / WHEEL_CM
    motors.run_rotations(rotations, speed)

def turn_degrees(angle):
    gyro.reset()
    while gyro.angle() < angle:
        motors.spin_right(30)
    motors.stop()

# Mission
drive_cm(50)
turn_degrees(90)
drive_cm(30)
\`\`\`

**Benefits**
- Change WHEEL_CM once if you swap wheels
- Readable missions
- Test each function separately

**Debugging robots**
1. Reproduce the problem consistently
2. Display sensor values on screen
3. Slow it down
4. Change one thing at a time`,
            questions: [
              num("With WHEEL_CM = 17.6, how many rotations does drive_cm(88) run?", 5, "88 ÷ 17.6."),
              mc("Why store wheel size in a named constant?", "So you change it in one place if wheels change", ["It makes the robot faster", "Constants use less battery", "It's required by robots"], "Single source of truth."),
              tf("Displaying sensor values on the robot's screen helps with debugging.", true, "You see what the robot 'sees.'"),
              mc("Why reset the gyro before turning?", "So the turn is measured from 0", ["To recharge it", "To make it heavier", "It isn't necessary"], "Otherwise previous angles add up."),
            ],
            programmingLanguage: "python",
          },
          {
            title: "Autonomous Missions and State Machines",
            summary: "Robots complete multi-step missions by switching between states based on sensor events.",
            objectives: ["Design a state machine for a robot task", "Plan an autonomous mission", "Handle errors and timeouts"],
            vocab: [["state machine", "a model where a system is in one state at a time and switches on events"], ["transition", "a change from one state to another"], ["timeout", "a time limit that prevents getting stuck"]],
            standards: ["2-AP-10", "2-AP-13", "MS-ETS1-4"],
            body: `
**Warehouse robot state machine**
| State | Action | Transition |
|---|---|---|
| SEARCH | drive and scan | object seen → APPROACH |
| APPROACH | drive toward object | distance < 5 cm → GRAB |
| GRAB | close gripper | gripped → RETURN |
| RETURN | follow line home | reached base → DROP |
| DROP | open gripper | done → SEARCH |

\`\`\`python
state = "SEARCH"
while True:
    if state == "SEARCH":
        spin_slowly()
        if camera.sees_object(): state = "APPROACH"
    elif state == "APPROACH":
        drive_forward()
        if distance() < 5: state = "GRAB"
    # ...
\`\`\`

**Timeouts:** if SEARCH lasts more than 10 seconds, try a new area — never get stuck forever.

**Mission planning:** sketch the field, list tasks with points, estimate time for each, and order them for the best score.`,
            questions: [
              mc("In the state machine, what happens when the robot is in APPROACH and distance < 5 cm?", "It switches to GRAB", ["It switches to SEARCH", "It stops forever", "It switches to DROP"], "That's the transition rule."),
              mc("Why add timeouts to robot states?", "To avoid getting stuck forever", ["To make the robot slower", "To save code", "They're decorative"], "Real conditions can fail."),
              tf("A robot in a state machine is in exactly one state at a time.", true, "That's the definition."),
              mc("Which state comes after RETURN?", "DROP", ["SEARCH", "GRAB", "APPROACH"], "Reach base, then drop."),
            ],
            programmingLanguage: "python",
          },
        ],
      },
      {
        title: "Robotics Engineering Projects",
        description: "Build a robot arm and complete a full design challenge.",
        lessons: [
          {
            title: "Robot Arms and Manipulators",
            summary: "Robot arms use joints and linkages to position grippers; degrees of freedom define their reach.",
            objectives: ["Count degrees of freedom", "Compare gripper designs", "Calculate torque on an arm joint"],
            vocab: [["degree of freedom (DOF)", "an independent way a mechanism can move"], ["servo", "a motor that moves to a precise angle"], ["workspace", "the region an arm can reach"]],
            standards: ["MS-ETS1-2", "MS-PS2-2"],
            body: `
**Degrees of freedom:** each joint that rotates or slides adds one DOF.
- Your arm (shoulder, elbow, wrist) has 7 DOF.
- Many industrial arms have **6 DOF** — enough to reach any position and orientation in their workspace.

**Grippers**
| Type | Good for |
|---|---|
| Two-finger claw | blocks, general objects |
| Suction cup | flat, smooth items (boxes, glass) |
| Soft/flexible fingers | fruit, delicate objects |
| Magnetic | steel parts |

**Torque on a joint = force × distance**
Holding a 2 N object at the end of a 0.3 m arm: τ = 2 × 0.3 = **0.6 N·m**
Longer arm or heavier object → more torque → need a stronger motor or gearing.

**Servos** rotate to precise angles (0–180°) — ideal for arm joints.

**Counterweights** reduce the torque the motor must supply.`,
            questions: [
              num("A 5 N load is held 0.2 m from a joint. What is the torque (N·m)?", 1, "5 × 0.2."),
              mc("Which gripper is best for picking up a sheet of glass?", "Suction cup", ["Two-finger claw", "Magnetic", "Hook"], "Flat, smooth surface."),
              tf("Doubling the arm length doubles the torque needed to hold the same load.", true, "τ = F × d."),
              num("An arm has a rotating base, shoulder, elbow, and wrist. How many degrees of freedom?", 4, "One per joint."),
            ],
          },
          {
            title: "Robot Design Challenge",
            summary: "Apply the design process to build, program, and refine a robot for a competition task.",
            objectives: ["Plan a robot strategy around scoring rules", "Prototype and test iteratively", "Document and present the robot"],
            vocab: [["strategy", "a plan for scoring the most points"], ["iteration", "a cycle of build, test, and improve"], ["engineering notebook", "a dated record of design decisions and tests"]],
            standards: ["MS-ETS1-1", "MS-ETS1-2", "MS-ETS1-3", "MS-ETS1-4"],
            body: `
**Challenge:** in 2 minutes, move as many cubes as possible into the goal zone.
| Action | Points |
|---|---|
| Cube in goal | 5 |
| Cube stacked | +3 |
| Robot parked at end | 10 |

**1. Strategy:** which actions give the most points per second? Parking (10 pts) may be quick and reliable — do it every time!

**2. Design:** sketch 3 concepts (scoop, claw, conveyor). Use a decision matrix.

**3. Build and test subsystems:** drivetrain first, then manipulator.

**4. Program:** autonomous routine + driver controls.

**5. Iterate:** run 10 practice matches, record scores and failures.
| Match | Cubes | Parked | Score |
|---|---|---|---|
| 1 | 4 | no | 20 |
| 5 | 6 | yes | 40 |

**6. Document** in your engineering notebook and present to judges.

**Reliability beats complexity:** a simple robot that works every time often wins.`,
            questions: [
              num("Using the scoring table, what score does a robot get for 5 cubes in the goal and parking?", 35, "5 × 5 + 10."),
              mc("Why might a team practice parking every match?", "It's reliable, quick points", ["It's worth zero", "Judges require it", "It uses less battery"], "10 points for little time."),
              tf("A simple, reliable robot can outperform a complex, unreliable one.", true, "Consistency wins matches."),
              mc("What should a team record during practice matches?", "Scores and failures to guide improvements", ["Only the final score of the season", "Nothing", "Only the robot's color"], "Data drives iteration."),
            ],
            writtenPrompt: "Write an engineering notebook entry for one design iteration of a robot: the problem you noticed, the change you made, test results before and after, and what you'll try next.",
            rubric: "Clear problem (2) · Specific change (2) · Before/after data (4) · Next step (2)",
          },
        ],
      },
      {
        title: "Automation and Society",
        description: "Explore AI-powered robots and the future of work.",
        lessons: [
          {
            title: "Autonomous Vehicles and Smart Machines",
            summary: "Self-driving cars and drones combine sensors, maps, and AI to navigate safely.",
            objectives: ["Describe the sensing and decision systems in autonomous vehicles", "Explain levels of driving automation", "Evaluate safety and ethical questions"],
            vocab: [["lidar", "laser-based sensor that maps surroundings in 3D"], ["sensor fusion", "combining data from multiple sensors"], ["levels of automation", "a 0–5 scale from no automation to full self-driving"]],
            standards: ["MS-ETS1-1", "2-IC-20"],
            body: `
**How a self-driving car "sees"**
- **Cameras:** read signs, lanes, traffic lights
- **Radar:** measures speed and distance, works in rain
- **Lidar:** laser pulses build a 3D map
- **GPS + maps:** know where it is
- **Sensor fusion:** combine all of these for a reliable picture

**Levels of driving automation (SAE)**
| Level | Who drives |
|---|---|
| 0 | human only |
| 1–2 | driver assistance (cruise control, lane keeping) — human must watch |
| 3 | car drives in some conditions; human takes over when asked |
| 4 | car drives itself in defined areas |
| 5 | car drives itself everywhere |

**Delivery drones and sidewalk robots** use the same ideas.

**Big questions**
- How safe is "safe enough"? About 40,000 people die in U.S. traffic crashes each year, mostly from human error.
- Who is responsible in a crash?
- How should vehicles handle unpredictable situations?`,
            questions: [
              mc("Which sensor builds a 3D map using laser pulses?", "Lidar", ["Camera", "Radar", "Microphone"], "Light detection and ranging."),
              mc("Combining camera, radar, and lidar data is called…", "sensor fusion", ["calibration", "gear reduction", "encoding"], "Fusion makes perception more reliable."),
              tf("At SAE Level 2, the human driver must still pay attention at all times.", true, "Level 2 is driver assistance only."),
              num("What is the highest SAE level of driving automation?", 5, "Level 5 is full automation everywhere."),
            ],
          },
          {
            title: "The Future of Work and Automation",
            summary: "Automation changes jobs; people who can design, maintain, and work alongside robots are in demand.",
            objectives: ["Analyze how automation changes jobs", "Identify skills for future careers", "Debate policies for an automated economy"],
            vocab: [["cobot", "a collaborative robot designed to work safely alongside people"], ["reskilling", "learning new skills for a different job"], ["job displacement", "losing a job because of automation or other change"]],
            standards: ["2-IC-20", "MS-ETS1-1"],
            body: `
**History repeats:** ATMs were expected to eliminate bank tellers. Instead, banks opened more branches and tellers shifted to customer service.

**What's changing**
- Routine, repetitive tasks are most automatable (data entry, assembly).
- Tasks needing creativity, empathy, judgment, and complex hands-on work are harder to automate.

**Cobots** work beside people: a robot lifts heavy parts while a person does detailed assembly.

**Growing careers**
- Robotics technician
- Automation engineer
- Data analyst
- Maintenance and repair specialist
- Roles combining tech with care, teaching, and trades

**Future-ready skills:** problem-solving, programming basics, communication, teamwork, adaptability, and learning how to learn.

**Policy debates:** retraining programs, education changes, safety nets for displaced workers, and who benefits from productivity gains.`,
            questions: [
              mc("Which job task is most easily automated?", "Entering the same data into forms all day", ["Counseling a grieving family", "Designing a new product", "Repairing a unique antique"], "Routine and repetitive."),
              mc("A cobot is…", "a robot designed to work safely alongside people", ["a robot cop", "a coding bot", "a type of battery"], "Collaborative robot."),
              tf("ATMs completely eliminated bank teller jobs.", false, "Teller roles shifted toward customer service."),
              mc("Which skill is most valuable as automation grows?", "Adaptability and learning new skills", ["Doing only one repetitive task", "Avoiding technology", "Memorizing phone numbers"], "Change is constant."),
            ],
            writtenPrompt: "Choose a job in your community. Explain which tasks might be automated in the next 20 years, which won't, and what skills a worker could build to stay valuable.",
            rubric: "Names a specific job (2) · Identifies automatable tasks (3) · Identifies human-centered tasks (3) · Recommends skills (2)",
          },
        ],
      },
    ],
  },
  {
    id: "poe",
    title: "Principles of Engineering",
    subject: "engineering",
    grade: 9,
    gradeMax: 12,
    framework: NGSS_ETS,
    description: "The physics and math behind engineering: statics, materials, thermodynamics, fluids, kinematics, and lessons from engineering failures.",
    units: [
      {
        title: "Statics",
        description: "Analyze forces on structures at rest.",
        lessons: [
          {
            title: "Forces, Vectors, and Equilibrium",
            summary: "Structures at rest have balanced forces and moments; vectors resolve forces into components.",
            objectives: ["Resolve forces into x and y components", "Apply ΣF = 0 and ΣM = 0", "Draw free-body diagrams"],
            vocab: [["vector", "a quantity with magnitude and direction"], ["free-body diagram", "a sketch showing all forces on an object"], ["moment", "a turning effect, force × perpendicular distance"], ["equilibrium", "a state where net force and net moment are zero"]],
            standards: ["HS-PS2-1", "HS-ETS1-2"],
            body: `
**Resolving vectors:** a 100 N force at 30° above horizontal
- Fₓ = 100 cos 30° ≈ **86.6 N**
- Fᵧ = 100 sin 30° = **50 N**

**Equilibrium conditions**
- ΣFₓ = 0
- ΣFᵧ = 0
- ΣM = 0 (moments about any point)

**Example: simply supported beam**
A 6 m beam with supports at each end and a 1,200 N load 2 m from the left support.
- ΣM about left: R_B × 6 − 1,200 × 2 = 0 → **R_B = 400 N**
- ΣFᵧ: R_A + 400 − 1,200 = 0 → **R_A = 800 N**
The support closer to the load carries more.

**Free-body diagrams:** isolate the object, draw every force (weight, supports, applied loads) with direction and point of action.`,
            questions: [
              num("A 200 N force acts at 60° above horizontal. What is its vertical component (N)? (sin 60° ≈ 0.866)", 173.2, "200 × 0.866.", { tolerance: 0.5 }),
              num("A 10 m beam has supports at each end and a 2,000 N load at its center. What is each support's reaction (N)?", 1000, "Symmetric: half each."),
              num("A 4 m beam with end supports has a 900 N load 1 m from the left. What is the right support's reaction (N)?", 225, "R_B × 4 = 900 × 1."),
              tf("An object in equilibrium has zero net force and zero net moment.", true, "Both conditions must hold."),
            ],
          },
          {
            title: "Truss Analysis",
            summary: "Trusses carry loads through members in tension or compression, solved with the method of joints.",
            objectives: ["Identify tension and compression members", "Apply the method of joints", "Explain why triangles are rigid"],
            vocab: [["truss", "a structure of members joined in triangles"], ["member", "a single straight piece of a truss"], ["method of joints", "solving forces by applying equilibrium at each joint"], ["zero-force member", "a member carrying no load under a given loading"]],
            standards: ["HS-ETS1-2", "HS-PS2-1"],
            body: `
**Why triangles?** A triangle's shape is fixed by its side lengths. A square can collapse into a parallelogram.

**Assumptions:** members connect at pin joints; loads act only at joints; members carry only axial force — **tension** (pulling) or **compression** (pushing).

**Method of joints**
1. Find support reactions using equilibrium of the whole truss.
2. Start at a joint with ≤ 2 unknowns.
3. Apply ΣFₓ = 0 and ΣFᵧ = 0.
4. Move to the next joint.

**Example:** a symmetric triangular truss, 1,000 N at the apex, base members horizontal, sides at 45°.
- Each support: **500 N** up
- At a support joint: F_side sin 45° = 500 → F_side ≈ **707 N (compression)**
- F_base = F_side cos 45° = **500 N (tension)**

**Design insight:** compression members can buckle, so they need to be thicker; tension members can be thin cables.`,
            questions: [
              num("A symmetric truss carries 1,600 N at its apex. What is each support's vertical reaction (N)?", 800, "Half the load each."),
              mc("Which member type can be replaced by a cable?", "Tension member", ["Compression member", "Any member", "None"], "Cables can only pull."),
              tf("Compression members risk buckling and often need larger cross-sections.", true, "Long, slender columns buckle."),
              mc("Why are trusses built from triangles?", "Triangles are rigid and can't change shape without changing side lengths", ["Triangles use more material", "Triangles look better", "Squares are too strong"], "Geometric rigidity."),
            ],
          },
        ],
      },
      {
        title: "Strength of Materials",
        description: "Quantify material behavior and select materials.",
        lessons: [
          {
            title: "Stress, Strain, and Young's Modulus",
            summary: "Young's modulus relates stress to strain in the elastic region: E = σ/ε.",
            objectives: ["Calculate stress, strain, and modulus of elasticity", "Predict elongation under load", "Compare stiffness of materials"],
            vocab: [["Young's modulus (E)", "stiffness: stress ÷ strain in the elastic region"], ["elongation", "change in length under load"], ["stiffness", "resistance to deformation"]],
            standards: ["HS-PS2-6", "HS-ETS1-3"],
            body: `
**σ = F/A**   **ε = ΔL/L₀**   **E = σ/ε**

| Material | E (GPa) |
|---|---|
| Steel | 200 |
| Aluminum | 69 |
| Wood (along grain) | ~11 |
| Nylon | ~3 |

**Steel is about 3× stiffer than aluminum.**

**Predicting elongation:** ΔL = F·L₀ / (A·E)
A 2 m steel rod, area 1 × 10⁻⁴ m², under 20,000 N:
ΔL = (20,000 × 2) / (1×10⁻⁴ × 200×10⁹) = 40,000 / 2×10⁷ = **0.002 m = 2 mm**

**Stiffness vs. strength**
- **Stiff** = doesn't deform much (high E)
- **Strong** = doesn't fail (high yield/ultimate strength)
Glass is stiff but brittle; rubber is flexible but tough.`,
            questions: [
              num("A material has stress 100 MPa and strain 0.001. What is E in GPa?", 100, "100 MPa / 0.001 = 100,000 MPa = 100 GPa."),
              num("A rod 1 m long stretches 0.5 mm. What is the strain?", 0.0005, "0.0005 m / 1 m."),
              mc("Under the same stress, which stretches most?", "Nylon", ["Steel", "Aluminum", "Wood"], "Lowest Young's modulus."),
              tf("A stiff material is always strong.", false, "Glass is stiff but breaks easily."),
            ],
          },
          {
            title: "Material Selection",
            summary: "Engineers select materials by balancing mechanical, thermal, cost, and environmental properties.",
            objectives: ["Use property charts and selection matrices", "Calculate specific strength", "Justify material choices for a design"],
            vocab: [["specific strength", "strength ÷ density"], ["corrosion", "chemical deterioration, like rust"], ["fatigue", "failure from repeated loading below yield strength"]],
            standards: ["HS-ETS1-3", "HS-PS1-2"],
            body: `
**Key properties:** strength, stiffness, density, toughness, fatigue resistance, corrosion resistance, thermal conductivity, cost, recyclability.

**Specific strength = strength ÷ density** — crucial when weight matters.
| Material | Strength (MPa) | Density (g/cm³) | Specific strength |
|---|---|---|---|
| Steel | 400 | 7.8 | 51 |
| Aluminum 6061 | 310 | 2.7 | 115 |
| Titanium alloy | 900 | 4.4 | 205 |
| Carbon fiber | 1,500 | 1.6 | 940 |

**Applications**
- Bridges: steel (cheap, strong, weldable)
- Aircraft: aluminum, titanium, composites
- Marine: stainless steel, bronze (corrosion)
- Bicycle frames: all of the above, by price point

**Fatigue:** a paper clip bent back and forth breaks well below its yield strength. Aircraft are inspected for fatigue cracks on a strict schedule.`,
            questions: [
              num("A material has strength 600 MPa and density 3 g/cm³. What is its specific strength?", 200, "600 ÷ 3."),
              mc("For a racing bicycle where weight matters most, which material has the best specific strength?", "Carbon fiber", ["Steel", "Aluminum", "Wood"], "Highest strength-to-weight."),
              tf("Repeated loading below yield strength can still cause failure.", true, "That's fatigue."),
              mc("Which property matters most for a boat propeller?", "Corrosion resistance", ["Electrical conductivity", "Transparency", "Magnetism"], "Saltwater corrodes many metals."),
            ],
          },
        ],
      },
      {
        title: "Thermodynamics and Energy",
        description: "Analyze heat flow and energy efficiency.",
        lessons: [
          {
            title: "Heat Transfer and Insulation",
            summary: "Conduction through walls depends on area, temperature difference, and R-value.",
            objectives: ["Calculate conductive heat loss with R-values", "Compare insulating materials", "Recommend insulation upgrades"],
            vocab: [["R-value", "resistance to heat flow; higher insulates better"], ["U-factor", "rate of heat transfer; U = 1/R"], ["thermal conductivity", "how easily a material conducts heat"]],
            standards: ["HS-PS3-4", "HS-ETS1-3"],
            body: `
**Heat loss through a wall (U.S. units):**
Q = A × ΔT / R  (BTU per hour)

**Example:** 200 ft² wall, inside 70 °F, outside 20 °F, R-13 insulation
Q = 200 × 50 / 13 ≈ **769 BTU/h**

Upgrade to R-21: Q = 200 × 50 / 21 ≈ **476 BTU/h** (38% less)

**R-values add in layers:** drywall R-0.5 + R-13 batts + sheathing R-0.6 + siding R-0.6 ≈ R-14.7

**Typical R-values**
| Material | R per inch |
|---|---|
| Fiberglass batts | ~3.2 |
| Spray foam (closed cell) | ~6.5 |
| Wood | ~1.25 |
| Single-pane glass (total) | ~0.9 |

**Windows** are often the weak point — double-pane windows roughly double R-value.

**Air leaks** can matter as much as insulation: seal gaps around doors, windows, and outlets.`,
            questions: [
              num("A 100 ft² wall has ΔT = 40 °F and R = 20. What is the heat loss (BTU/h)?", 200, "100 × 40 / 20."),
              num("Layers of R-0.5, R-19, and R-0.5 are combined. What is the total R-value?", 20, "R-values add."),
              mc("Which upgrade reduces heat loss through a wall the most?", "Increasing R-value from 11 to 30", ["Decreasing R-value", "Painting the wall", "Adding a mirror"], "Higher R = less heat flow."),
              tf("A higher U-factor means better insulation.", false, "U = 1/R; lower U is better."),
            ],
          },
          {
            title: "Energy, Work, Power, and Efficiency",
            summary: "Energy is conserved, but every real machine loses some as heat; efficiency measures useful output.",
            objectives: ["Calculate work, power, and efficiency", "Trace energy conversions in a system", "Compare efficiencies of technologies"],
            vocab: [["work", "force × distance moved in the direction of the force (joules)"], ["power", "work ÷ time (watts)"], ["efficiency", "useful energy out ÷ total energy in"]],
            standards: ["HS-PS3-1", "HS-PS3-3"],
            body: `
**Work:** W = F × d
Lifting 500 N up 3 m → W = **1,500 J**

**Power:** P = W / t
Doing it in 5 s → P = **300 W**

**Efficiency:** η = useful output / input × 100%
A motor uses 2,000 J of electrical energy to do 1,500 J of lifting → η = **75%**

**Typical efficiencies**
| Device | Efficiency |
|---|---|
| Electric motor | 85–95% |
| Gasoline car engine | 20–35% |
| Coal power plant | ~33% |
| LED | ~40% (light out per electrical in) |
| Incandescent bulb | ~5% |
| Solar panel | 18–23% |

**Systems multiply losses:** 90% × 80% × 95% = **68.4%** overall.

**Where does lost energy go?** Mostly heat from friction and electrical resistance.`,
            questions: [
              num("A 200 N crate is lifted 4 m. How much work is done (J)?", 800, "200 × 4."),
              num("800 J of work is done in 4 s. What is the power (W)?", 200, "800 ÷ 4."),
              num("A system has stages of 90% and 50% efficiency. What is the overall efficiency (%)?", 45, "0.9 × 0.5 = 0.45."),
              mc("Which device is most efficient at converting energy to motion?", "Electric motor", ["Gasoline engine", "Coal power plant", "Incandescent bulb"], "85–95%."),
            ],
          },
        ],
      },
      {
        title: "Fluid Systems",
        description: "Apply hydraulics, pneumatics, and buoyancy.",
        lessons: [
          {
            title: "Hydraulics and Pascal's Principle",
            summary: "Pressure applied to a confined fluid is transmitted equally, multiplying force in hydraulic systems.",
            objectives: ["Calculate pressure", "Apply Pascal's principle to hydraulic lifts", "Compare hydraulic and pneumatic systems"],
            vocab: [["pressure", "force per unit area, P = F/A"], ["Pascal's principle", "pressure in a confined fluid is transmitted equally in all directions"], ["pneumatics", "systems powered by compressed gas"]],
            standards: ["HS-PS2-1", "HS-ETS1-2"],
            body: `
**Pressure:** P = F / A

**Pascal's principle:** P₁ = P₂ → F₁/A₁ = F₂/A₂

**Hydraulic lift**
- Small piston: 0.01 m², push with 200 N → P = 20,000 Pa
- Large piston: 0.5 m² → F₂ = 20,000 × 0.5 = **10,000 N**
- **Mechanical advantage** = A₂/A₁ = **50**

**Trade-off:** the small piston moves 50× farther than the large one. Work in ≈ work out.

**Hydraulics vs. pneumatics**
| | Hydraulic (liquid) | Pneumatic (air) |
|---|---|---|
| Fluid | oil | compressed air |
| Compressible? | almost not | yes |
| Force | very high | moderate |
| Uses | excavators, car brakes, aircraft controls | air tools, factory grippers, dental drills |

**Car brakes:** your foot's force is multiplied hydraulically to clamp all four wheels.`,
            questions: [
              num("A force of 300 N acts on 0.02 m². What is the pressure (Pa)?", 15000, "300 ÷ 0.02."),
              num("A hydraulic lift has pistons of 0.01 m² and 0.4 m². What is the mechanical advantage?", 40, "0.4 ÷ 0.01."),
              num("With that lift, a 150 N input force produces what output force (N)?", 6000, "150 × 40."),
              tf("Pneumatic systems use air, which is compressible.", true, "That makes them springier than hydraulics."),
            ],
          },
          {
            title: "Buoyancy and Floating Design",
            summary: "Archimedes' principle explains why ships float: buoyant force equals the weight of displaced fluid.",
            objectives: ["Apply Archimedes' principle", "Determine whether an object floats", "Design a floating structure for a payload"],
            vocab: [["buoyant force", "upward force exerted by a fluid"], ["Archimedes' principle", "buoyant force equals the weight of fluid displaced"], ["displacement", "volume of fluid pushed aside by an object"]],
            standards: ["HS-PS2-1", "HS-ETS1-2"],
            body: `
**Archimedes' principle:** buoyant force = weight of displaced fluid
F_b = ρ_fluid × V_displaced × g

Fresh water: ρ = 1,000 kg/m³ (g ≈ 9.8 m/s²)

**Floats if** average density < fluid density.

**Why steel ships float:** the hull encloses lots of air, so the ship's **average** density is less than water's.

**Example:** a boat displaces 2 m³ of fresh water.
F_b = 1,000 × 2 × 9.8 = **19,600 N** → it can weigh up to 19,600 N (≈ 2,000 kg) total.

**Saltwater** (ρ ≈ 1,025 kg/m³) gives slightly more buoyancy — ships ride higher at sea.

**Design challenge:** a foil boat carrying pennies. Wider, flatter hulls displace more water before sinking. Spread the load evenly to avoid tipping.`,
            questions: [
              num("An object displaces 0.05 m³ of fresh water. What is the buoyant force (N)? (g = 9.8)", 490, "1,000 × 0.05 × 9.8."),
              mc("A block has density 800 kg/m³. In fresh water it will…", "float", ["sink", "hover exactly halfway forever", "dissolve"], "800 < 1,000."),
              tf("Steel ships float because their average density, including air in the hull, is less than water's.", true, "Shape matters, not just material."),
              mc("Why do ships ride slightly higher in saltwater?", "Saltwater is denser", ["Saltwater is warmer", "Saltwater has less gravity", "Waves push them up"], "Higher density → more buoyancy per volume."),
            ],
          },
        ],
      },
      {
        title: "Kinematics",
        description: "Model motion for engineering design.",
        lessons: [
          {
            title: "Linear Kinematics",
            summary: "Equations of motion predict position, velocity, and acceleration for constant acceleration.",
            objectives: ["Apply the kinematic equations", "Interpret position–time and velocity–time graphs", "Calculate stopping distances"],
            vocab: [["displacement", "change in position"], ["velocity", "rate of change of position, with direction"], ["acceleration", "rate of change of velocity"]],
            standards: ["HS-PS2-1", "CCSS.MATH.CONTENT.HSA.CED.A.4"],
            body: `
**Kinematic equations (constant acceleration)**
- v = v₀ + at
- d = v₀t + ½at²
- v² = v₀² + 2ad

**Example: car braking**
A car at 25 m/s brakes at −5 m/s².
- Time to stop: 0 = 25 − 5t → **t = 5 s**
- Distance: 0 = 625 − 10d → **d = 62.5 m**

**Reaction distance:** a driver takes ~1.5 s to react. At 25 m/s that's 37.5 m before braking even starts.
**Total stopping distance ≈ 100 m.**

**Double the speed → 4× the braking distance** (v² relationship). That's why speed limits near schools are low.

**Graphs**
- Slope of position–time = velocity
- Slope of velocity–time = acceleration
- Area under velocity–time = displacement`,
            questions: [
              num("A car accelerates from rest at 3 m/s² for 4 s. What is its final velocity (m/s)?", 12, "v = 0 + 3 × 4."),
              num("How far does that car travel in those 4 s (m)?", 24, "½ × 3 × 16."),
              num("A cart at 20 m/s decelerates at 4 m/s². How far does it travel before stopping (m)?", 50, "0 = 400 − 8d."),
              mc("If speed doubles, braking distance becomes…", "4 times as long", ["2 times as long", "the same", "half as long"], "Distance ∝ v²."),
            ],
          },
          {
            title: "Projectile Motion",
            summary: "Projectiles move horizontally at constant velocity while accelerating downward due to gravity.",
            objectives: ["Separate horizontal and vertical motion", "Calculate time of flight and range", "Design a launcher to hit a target"],
            vocab: [["projectile", "an object moving only under gravity after launch"], ["range", "horizontal distance traveled"], ["trajectory", "the curved path of a projectile"]],
            standards: ["HS-PS2-1", "HS-ETS1-2"],
            body: `
**Key idea:** horizontal and vertical motions are **independent**.
- Horizontal: constant velocity (ignoring air resistance)
- Vertical: accelerates down at g = 9.8 m/s²

**Horizontal launch:** a ball rolls off a 1.25 m table at 3 m/s.
- Fall time: 1.25 = ½(9.8)t² → t ≈ **0.505 s**
- Range: 3 × 0.505 ≈ **1.52 m**

**Angled launch from ground level**
- Range = v² sin(2θ) / g
- Maximum range at **45°**
- 30° and 60° give the **same** range

**Example:** 15 m/s at 45° → R = 225 × 1 / 9.8 ≈ **23 m**

**Engineering applications:** catapult design, sports equipment, water fountains, firefighting nozzles, and drop zones for supply deliveries.

**Air resistance** shortens real ranges and lowers the optimal angle slightly.`,
            questions: [
              mc("At what launch angle is range maximized (ignoring air resistance)?", "45°", ["30°", "60°", "90°"], "sin(2θ) is largest at 90°, so θ = 45°."),
              num("A ball is launched horizontally at 5 m/s and falls for 2 s. What is its range (m)?", 10, "5 × 2."),
              tf("A ball dropped and a ball launched horizontally from the same height hit the ground at the same time.", true, "Vertical motion is independent of horizontal."),
              mc("Which launch angle gives the same range as 30°?", "60°", ["45°", "15°", "90°"], "Complementary angles give equal range."),
            ],
          },
        ],
      },
      {
        title: "Engineering Practice",
        description: "Explore engineering careers and learn from failures.",
        lessons: [
          {
            title: "Engineering Disciplines and Pathways",
            summary: "Engineering spans dozens of fields; each applies math and science to different kinds of problems.",
            objectives: ["Compare major engineering disciplines", "Describe education and licensure pathways", "Connect personal interests to engineering fields"],
            vocab: [["Professional Engineer (PE)", "a licensed engineer who can approve public designs"], ["ABET", "the organization that accredits engineering programs"], ["engineering technologist", "applies engineering principles hands-on, often with a 2- or 4-year degree"]],
            standards: ["HS-ETS1-1"],
            body: `
| Discipline | Core science | Sample projects |
|---|---|---|
| Mechanical | physics, thermodynamics | engines, robots, HVAC |
| Electrical | electromagnetism | power grids, chips, phones |
| Civil | statics, materials, geology | bridges, dams, highways |
| Chemical | chemistry | pharmaceuticals, fuels, food processing |
| Biomedical | biology, physiology | prosthetics, imaging, implants |
| Aerospace | fluid dynamics | aircraft, spacecraft |
| Computer | electronics, CS | processors, embedded systems |
| Environmental | chemistry, biology | water treatment, air quality |
| Industrial | statistics, systems | factory efficiency, logistics |

**Pathway**
1. High school: calculus readiness, physics, chemistry, hands-on projects
2. ABET-accredited bachelor's degree (4 years)
3. Fundamentals of Engineering (FE) exam
4. ~4 years of supervised experience
5. Principles and Practice (PE) exam → licensed Professional Engineer

**Other routes:** engineering technician (2-year degree), apprenticeships, military training.

**Median pay** for engineers is well above the national median, and demand is strong.`,
            questions: [
              mc("Which engineer would design a water treatment plant?", "Environmental (or civil)", ["Aerospace", "Computer", "Industrial only"], "Water systems are environmental/civil."),
              mc("What credential lets an engineer approve designs for public projects?", "Professional Engineer (PE) license", ["A driver's license", "A high school diploma", "A patent"], "PE licensure is required for public works."),
              tf("ABET accredits engineering degree programs.", true, "Accreditation matters for licensure."),
              mc("Which engineer most likely designs microprocessors?", "Computer/electrical", ["Civil", "Chemical", "Environmental"], "Chips are electronics."),
            ],
          },
          {
            title: "Learning from Engineering Failures",
            summary: "Famous failures reveal how design flaws, poor communication, and unexpected loads cause disasters.",
            objectives: ["Analyze causes of major engineering failures", "Identify technical and human factors", "Apply lessons to your own designs"],
            vocab: [["failure analysis", "investigating why something failed"], ["resonance", "large oscillations when a force matches a natural frequency"], ["root cause", "the fundamental reason a failure occurred"]],
            standards: ["HS-ETS1-3", "HS-ETS1-1"],
            body: `
**Tacoma Narrows Bridge (1940)**
Wind caused twisting oscillations (aeroelastic flutter) until the deck collapsed four months after opening. **Lesson:** dynamic loads matter, not just static weight. Modern bridges are wind-tunnel tested.

**Hyatt Regency walkway (1981)**
A design change during construction doubled the load on a connection. Walkways collapsed, killing 114 people. **Lesson:** review every change; communication between designers and builders is critical.

**Challenger (1986)**
O-rings lost flexibility in cold weather. Engineers' warnings were overruled. **Lesson:** speak up with data; safety over schedule.

**Mars Climate Orbiter (1999)**
One team used pound-force units, another used newtons. The $125 million spacecraft was lost. **Lesson:** check units and interfaces.

**Common themes:** untested assumptions, unchecked changes, poor communication, schedule pressure.

**Engineers learn more from failures than successes** — that's why failure analysis is a profession.`,
            questions: [
              mc("What caused the loss of the Mars Climate Orbiter?", "A mix-up between metric and U.S. units", ["A meteor strike", "Running out of fuel", "A software virus"], "Pound-force vs. newtons."),
              mc("The Tacoma Narrows Bridge failed because of…", "wind-induced oscillations", ["an earthquake", "a ship collision", "rust"], "Aeroelastic flutter."),
              tf("The Hyatt Regency collapse involved a design change that doubled the load on a connection.", true, "Changes must be reviewed."),
              mc("Which is a common theme in engineering failures?", "Poor communication and untested assumptions", ["Too much testing", "Using metric units", "Overly careful reviews"], "Human factors matter."),
            ],
            writtenPrompt: "Choose one engineering failure (from this lesson or your own research). Describe the root cause, the human and technical factors, and one practice you'll adopt in your own projects because of it.",
            rubric: "Accurately describes the failure (2) · Identifies root cause (3) · Distinguishes human and technical factors (3) · Personal lesson (2)",
          },
        ],
      },
    ],
  },
  {
    id: "eng-elec-912",
    title: "Electronics & Circuits",
    subject: "engineering",
    grade: 9,
    gradeMax: 12,
    framework: NGSS_ETS,
    description: "Analyze DC and AC circuits, semiconductors, digital logic, and microcontrollers, then design and troubleshoot real electronic systems.",
    units: [
      {
        title: "DC Circuit Analysis",
        description: "Apply Ohm's and Kirchhoff's laws to series, parallel, and combination circuits.",
        lessons: [
          {
            title: "Ohm's Law and Kirchhoff's Laws",
            summary: "Kirchhoff's current and voltage laws, with Ohm's law, solve any DC resistor circuit.",
            objectives: ["Apply KCL and KVL", "Solve series and parallel circuits", "Calculate power dissipation"],
            vocab: [["Kirchhoff's current law (KCL)", "current into a node equals current out"], ["Kirchhoff's voltage law (KVL)", "voltages around any closed loop sum to zero"], ["node", "a point where components connect"]],
            standards: ["HS-PS3-1", "HS-ETS1-2"],
            body: `
**Ohm's law:** V = IR   **Power:** P = IV = I²R = V²/R

**KCL:** current into a node = current out
3 A enters a node; 1 A leaves on one branch → **2 A** on the other.

**KVL:** around a loop, rises = drops
A 12 V battery with resistors of 2 Ω and 4 Ω in series:
- I = 12 / 6 = **2 A**
- V₂Ω = 4 V, V₄Ω = 8 V → 4 + 8 = 12 ✓

**Voltage divider:** V_out = V_in × R₂/(R₁ + R₂)
12 V × 4/(2 + 4) = **8 V**

**Power in each resistor**
- 2 Ω: 2² × 2 = 8 W
- 4 Ω: 2² × 4 = 16 W
Choose resistors rated above the power they dissipate (a ¼ W resistor here would burn).`,
            questions: [
              num("A 9 V source drives 1 kΩ and 2 kΩ in series. What is the current in mA?", 3, "9 V / 3 kΩ = 3 mA."),
              num("Using that circuit, what is the voltage across the 2 kΩ resistor (V)?", 6, "3 mA × 2 kΩ."),
              num("5 A enters a node; 2 A and 1.5 A leave on two branches. What current leaves on the third branch (A)?", 1.5, "5 − 2 − 1.5."),
              num("A 10 Ω resistor carries 0.5 A. What power does it dissipate (W)?", 2.5, "0.25 × 10."),
            ],
          },
          {
            title: "Equivalent Resistance and Combination Circuits",
            summary: "Reduce complex resistor networks step by step to find total resistance and branch currents.",
            objectives: ["Calculate series and parallel equivalent resistance", "Simplify combination circuits", "Find branch currents with current dividers"],
            vocab: [["equivalent resistance", "a single resistance that behaves like a network"], ["current divider", "current splits in inverse proportion to branch resistance"], ["combination circuit", "a circuit with both series and parallel parts"]],
            standards: ["HS-PS3-1", "CCSS.MATH.CONTENT.HSA.CED.A.4"],
            body: `
**Series:** R_eq = R₁ + R₂ + …
**Parallel:** 1/R_eq = 1/R₁ + 1/R₂ + …
**Two in parallel shortcut:** R_eq = (R₁R₂)/(R₁ + R₂)

**Examples**
- 6 Ω ∥ 3 Ω = 18/9 = **2 Ω**
- Three 30 Ω in parallel = **10 Ω**
- Parallel R_eq is always **less** than the smallest branch.

**Combination circuit:** 4 Ω in series with (6 Ω ∥ 3 Ω), 12 V source
1. 6 ∥ 3 = 2 Ω
2. Total = 4 + 2 = **6 Ω**
3. I_total = 12/6 = **2 A**
4. V across parallel part = 2 A × 2 Ω = 4 V
5. I₆ = 4/6 ≈ 0.67 A, I₃ = 4/3 ≈ 1.33 A (sum = 2 A ✓)

**More current flows through the smaller resistance.**`,
            questions: [
              num("What is the equivalent resistance (Ω) of 12 Ω and 4 Ω in parallel?", 3, "48/16."),
              num("What is the equivalent resistance (Ω) of four 20 Ω resistors in parallel?", 5, "20/4."),
              num("A 10 Ω resistor is in series with (20 Ω ∥ 20 Ω). What is the total resistance (Ω)?", 20, "10 + 10."),
              tf("The equivalent resistance of a parallel network is always less than its smallest resistor.", true, "Adding paths lowers resistance."),
            ],
          },
          {
            title: "Capacitors and RC Circuits",
            summary: "Capacitors store charge; RC circuits charge and discharge with a time constant τ = RC.",
            objectives: ["Explain how capacitors store energy", "Calculate the RC time constant", "Describe RC charging behavior and uses"],
            vocab: [["capacitor", "a component that stores charge in an electric field"], ["farad (F)", "unit of capacitance"], ["time constant (τ)", "R × C; time to reach about 63% of full charge"]],
            standards: ["HS-PS3-1", "HS-PS3-5"],
            body: `
**Capacitors** store charge: Q = CV.
Energy stored: E = ½CV²

**RC time constant:** τ = R × C
- After 1τ: ~63% charged
- After 5τ: ~99% (considered fully charged)

**Example:** 10 kΩ and 100 µF → τ = 10,000 × 0.0001 = **1 s**. Fully charged in about **5 s**.

**Uses**
- **Timing:** blinking LEDs, 555 timers, delays
- **Filtering:** smoothing power supply ripple
- **Debouncing** buttons
- **Energy bursts:** camera flashes
- **Memory backup**

**Safety:** large capacitors can hold dangerous charge even when unplugged (e.g., in TVs and microwaves).

**Units:** µF = 10⁻⁶ F, nF = 10⁻⁹ F, pF = 10⁻¹² F.`,
            questions: [
              num("What is the time constant (s) of 20 kΩ and 50 µF?", 1, "20,000 × 0.00005 = 1 s."),
              num("About what percent is a capacitor charged after one time constant?", 63, "1 − e⁻¹ ≈ 63%.", { tolerance: 1 }),
              num("A 2 F capacitor is charged to 3 V. How much energy (J) does it store?", 9, "½ × 2 × 9."),
              tf("Large capacitors can hold a dangerous charge even after a device is unplugged.", true, "Always discharge safely."),
            ],
          },
        ],
      },
      {
        title: "Semiconductors and Digital Logic",
        description: "Use diodes, transistors, and logic gates.",
        lessons: [
          {
            title: "Diodes and Transistors",
            summary: "Diodes conduct one way; transistors are electronic switches and amplifiers.",
            objectives: ["Explain diode forward and reverse bias", "Use a transistor as a switch", "Calculate base resistor values"],
            vocab: [["semiconductor", "a material like silicon whose conductivity can be controlled"], ["forward bias", "diode orientation that allows current"], ["transistor", "a three-terminal device used to switch or amplify"], ["MOSFET", "a transistor controlled by gate voltage"]],
            standards: ["HS-PS3-1", "HS-ETS1-2"],
            body: `
**Diodes** allow current in one direction.
- Forward voltage drop: ~0.7 V (silicon), ~2 V (red LED)
- Uses: rectifiers (AC → DC), reverse-polarity protection, flyback protection for motors

**Bipolar transistor (NPN) as a switch**
- Small base current → large collector current
- Current gain β (hFE) ≈ 100: 1 mA base can control ~100 mA

**Driving a motor from a microcontroller pin (5 V, 20 mA max):**
1. The motor needs 200 mA → too much for the pin.
2. Use a transistor: base current needed ≈ 200/100 = 2 mA (use ~5 mA to be sure it saturates).
3. Base resistor: R = (5 − 0.7)/0.005 ≈ **860 Ω** → use 820 Ω.
4. Add a **flyback diode** across the motor.

**MOSFETs** are voltage-controlled and efficient — modern processors contain billions of them.`,
            questions: [
              num("A transistor has β = 150. A base current of 2 mA can control up to how many mA of collector current?", 300, "150 × 2."),
              num("A 5 V pin drives a transistor base (0.7 V drop) with 4.3 mA. What base resistor (Ω) is needed?", 1000, "(5 − 0.7)/0.0043."),
              mc("Why put a diode across a motor driven by a transistor?", "To absorb voltage spikes when the motor turns off", ["To make the motor faster", "To change the motor's direction", "To add light"], "Flyback protection."),
              tf("A diode allows current to flow in both directions equally.", false, "It conducts in one direction."),
            ],
          },
          {
            title: "Logic Gates",
            summary: "AND, OR, NOT, and other gates process binary signals and are the building blocks of computers.",
            objectives: ["Complete truth tables for basic gates", "Combine gates into circuits", "Explain NAND universality"],
            vocab: [["logic gate", "a circuit that outputs 1 or 0 based on inputs"], ["truth table", "a table listing outputs for every input combination"], ["universal gate", "a gate (NAND or NOR) from which any logic can be built"]],
            standards: ["3A-CS-02", "HS-ETS1-2"],
            body: `
| A | B | AND | OR | NAND | NOR | XOR |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 |

**NOT** inverts: 0 → 1, 1 → 0

**Real examples**
- **AND:** a machine runs only if the guard is closed AND the start button is pressed.
- **OR:** a car's dome light turns on if any door is open.
- **XOR:** a hallway light controlled by two switches.

**Half adder:** XOR gives the sum bit, AND gives the carry bit — adding 1 + 1 = 10 in binary.

**NAND is universal:** every other gate (and therefore every computer) can be built from NAND gates alone.

**Number of rows** in a truth table = 2ⁿ for n inputs.`,
            questions: [
              mc("What is the output of an AND gate with inputs 1 and 0?", "0", ["1", "Undefined", "2"], "AND needs both inputs to be 1."),
              mc("What is the output of a NOR gate with inputs 0 and 0?", "1", ["0", "Undefined", "2"], "OR gives 0; NOT gives 1."),
              num("How many rows does a truth table with 4 inputs have?", 16, "2⁴."),
              mc("A car alarm should sound if the door OR the trunk is opened. Which gate?", "OR", ["AND", "NAND", "XOR"], "Either condition triggers it."),
            ],
          },
          {
            title: "Boolean Algebra and Circuit Simplification",
            summary: "Boolean algebra simplifies logic expressions, reducing the number of gates needed.",
            objectives: ["Write Boolean expressions from truth tables", "Apply Boolean laws and De Morgan's theorems", "Simplify a logic circuit"],
            vocab: [["Boolean expression", "an algebraic expression using AND (·), OR (+), and NOT (')"], ["De Morgan's theorem", "(A·B)' = A' + B' and (A + B)' = A'·B'"], ["sum of products", "OR of AND terms"]],
            standards: ["3A-CS-02", "CCSS.MATH.CONTENT.HSA.SSE.A.2"],
            body: `
**Notation:** A·B = AND, A + B = OR, A' = NOT A

**Key laws**
| Law | Example |
|---|---|
| Identity | A + 0 = A, A · 1 = A |
| Null | A + 1 = 1, A · 0 = 0 |
| Complement | A + A' = 1, A · A' = 0 |
| Idempotent | A + A = A |
| Absorption | A + A·B = A |

**De Morgan's theorems**
- (A·B)' = A' + B'
- (A + B)' = A'·B'

**Simplify:** A·B + A·B'
= A·(B + B') = A·1 = **A**
Four gates reduced to a wire!

**From a truth table:** write an AND term for each row where output = 1, then OR them (sum of products). Simplify to save gates, cost, and power.

**Real design:** fewer gates → cheaper, faster, cooler chips.`,
            questions: [
              mc("Simplify A + A·B.", "A", ["B", "A·B", "A + B"], "Absorption law."),
              mc("By De Morgan's theorem, (A + B)' equals…", "A'·B'", ["A' + B'", "A·B", "(A·B)'"], "NOR = AND of inverses."),
              mc("Simplify A·A'.", "0", ["1", "A", "A'"], "Complement law."),
              tf("Simplifying Boolean expressions can reduce the number of gates in a circuit.", true, "Fewer gates = cheaper and faster."),
            ],
          },
        ],
      },
      {
        title: "Microcontrollers",
        description: "Program microcontrollers to read inputs and control outputs.",
        lessons: [
          {
            title: "Microcontroller Inputs and Outputs",
            summary: "Microcontrollers read digital inputs like buttons and drive outputs like LEDs using code.",
            objectives: ["Write setup and loop code", "Read buttons with pull-up resistors", "Control LEDs and debounce inputs"],
            vocab: [["microcontroller", "a small computer on a chip for controlling devices"], ["GPIO", "general-purpose input/output pin"], ["pull-up resistor", "holds an input HIGH when a button isn't pressed"], ["debounce", "filtering noisy rapid switching from mechanical buttons"]],
            standards: ["3A-AP-13", "HS-ETS1-2"],
            body: `
**Arduino-style structure**
\`\`\`cpp
const int LED = 13;
const int BUTTON = 2;

void setup() {
  pinMode(LED, OUTPUT);
  pinMode(BUTTON, INPUT_PULLUP);  // internal pull-up
}

void loop() {
  if (digitalRead(BUTTON) == LOW) {  // pressed (pulled to ground)
    digitalWrite(LED, HIGH);
  } else {
    digitalWrite(LED, LOW);
  }
}
\`\`\`

**Why pull-ups?** An unconnected input "floats" and reads random values. A pull-up holds it HIGH until the button connects it to ground (LOW).

**Debouncing:** a mechanical button bounces for a few milliseconds, looking like many presses. Ignore changes for ~20–50 ms after the first one.

**Current limits:** a pin can supply about 20 mA — fine for an LED with a resistor, **not** for motors (use a transistor).

**Blink without delay:** use \`millis()\` timing so the program can do other things at the same time.`,
            questions: [
              mc("With INPUT_PULLUP, what does an unpressed button read?", "HIGH", ["LOW", "Random", "Zero volts always"], "The pull-up holds it HIGH."),
              mc("Why can't a microcontroller pin drive a motor directly?", "The pin can't supply enough current", ["Motors need code", "Pins only accept input", "Motors are digital"], "Use a transistor driver."),
              tf("A floating input pin can read random values.", true, "Pull-up or pull-down resistors fix this."),
              mc("Debouncing solves which problem?", "One button press registering as many", ["LEDs being too bright", "Batteries draining", "Wires being too long"], "Mechanical contacts bounce."),
            ],
            programmingLanguage: "cpp",
          },
          {
            title: "Analog Input and PWM Output",
            summary: "Analog-to-digital converters read sensors; PWM simulates analog output to dim LEDs and control motor speed.",
            objectives: ["Convert ADC readings to voltages", "Use PWM duty cycle to control brightness or speed", "Map sensor ranges to outputs"],
            vocab: [["ADC", "analog-to-digital converter"], ["resolution", "number of discrete levels an ADC can report"], ["PWM", "pulse-width modulation: rapidly switching on and off"], ["duty cycle", "percent of time a PWM signal is on"]],
            standards: ["3A-AP-13", "HS-ETS1-2"],
            body: `
**Analog input:** a 10-bit ADC reports 0–1023 for 0–5 V.
Voltage = reading × 5 / 1023
Reading 512 → ≈ **2.5 V**

\`\`\`cpp
int light = analogRead(A0);              // 0–1023
int brightness = map(light, 0, 1023, 255, 0);
analogWrite(9, brightness);              // PWM 0–255
\`\`\`
Darker room → brighter LED.

**PWM output:** pins switch on/off very fast.
- **Duty cycle** = on-time ÷ period
- 25% duty → average 1.25 V on a 5 V pin
- analogWrite(pin, 191) → 191/255 ≈ **75%** duty

**Uses:** dimming LEDs, motor speed control, servo position, generating tones.

**Resolution:** a 12-bit ADC has 2¹² = 4,096 levels — finer measurements.`,
            questions: [
              num("A 10-bit ADC (0–1023, 5 V reference) reads 1023. What voltage is that (V)?", 5, "Full scale."),
              num("A PWM signal on a 5 V pin has a 40% duty cycle. What is the average voltage (V)?", 2, "0.4 × 5."),
              num("How many levels does a 12-bit ADC have?", 4096, "2¹²."),
              mc("PWM controls motor speed by…", "changing the fraction of time power is on", ["changing the wire color", "changing the battery chemistry", "reversing gravity"], "Duty cycle sets average power."),
            ],
            programmingLanguage: "cpp",
          },
        ],
      },
      {
        title: "Power and Safety",
        description: "Understand AC power, transformers, and electrical safety.",
        lessons: [
          {
            title: "AC, DC, and Transformers",
            summary: "The grid uses alternating current so transformers can change voltage efficiently; devices convert it to DC.",
            objectives: ["Compare AC and DC", "Calculate transformer voltages", "Explain why transmission uses high voltage"],
            vocab: [["alternating current (AC)", "current that reverses direction periodically"], ["RMS voltage", "the effective value of AC voltage"], ["rectifier", "a circuit that converts AC to DC"], ["transformer", "a device that changes AC voltage using coils"]],
            standards: ["HS-PS3-3", "HS-PS2-5"],
            body: `
**DC:** flows one way (batteries, USB, electronics).
**AC:** reverses direction — **60 times per second (60 Hz)** in North America, 50 Hz in much of the world. U.S. outlets: **120 V RMS** (peak ≈ 170 V).

**Transformers:** Vₛ/Vₚ = Nₛ/Nₚ
- Step-down: 120 V with 10:1 turns → **12 V**
- Power stays about the same: VₚIₚ ≈ VₛIₛ

**Why high-voltage transmission?** Power loss in wires = I²R.
Sending 1 MW at 10,000 V needs 100 A. At 500,000 V it needs only **2 A** — loss drops by a factor of 2,500!

**AC to DC (power adapters)**
1. Transformer steps voltage down
2. **Rectifier** (diodes) makes it one-directional
3. **Capacitor** smooths ripple
4. **Regulator** holds a steady 5 V

Modern "switch-mode" chargers do this at high frequency — that's why phone chargers are small.`,
            questions: [
              num("A transformer has 1,000 primary turns and 50 secondary turns. With 120 V in, what is the output (V)?", 6, "120 × 50/1000."),
              num("How many times per second does U.S. household AC change direction cycles (Hz)?", 60, "60 Hz."),
              mc("Why is electricity transmitted at very high voltage?", "Lower current means less power lost as heat", ["High voltage is safer", "It travels faster", "Transformers require it"], "Loss = I²R."),
              mc("What does a rectifier do?", "Converts AC to DC", ["Converts DC to AC", "Raises voltage", "Stores energy"], "Diodes make current one-directional."),
            ],
          },
          {
            title: "Electrical Safety and Codes",
            summary: "Current through the body is dangerous; grounding, GFCIs, and codes protect people.",
            objectives: ["Explain why current, not voltage alone, causes injury", "Describe grounding, GFCIs, and AFCIs", "Follow lab safety and lockout practices"],
            vocab: [["ground", "a safe path for fault current to the earth"], ["GFCI", "ground-fault circuit interrupter: trips when current leaks"], ["AFCI", "arc-fault circuit interrupter: trips on dangerous arcing"], ["lockout/tagout", "procedure to ensure equipment is de-energized before work"]],
            standards: ["HS-ETS1-3"],
            body: `
**Current through the body**
| Current | Effect |
|---|---|
| 1 mA | barely felt |
| 10–20 mA | painful; can't let go |
| 50–100 mA | can stop the heart |

**Why water is dangerous:** dry skin may have ~100,000 Ω; wet skin ~1,000 Ω.
At 120 V: dry → 1.2 mA; wet → **120 mA** (potentially fatal).

**Protection**
- **Grounding:** the third prong gives fault current a safe path and trips the breaker
- **GFCI:** compares current out and back; trips at ~5 mA difference in about 1/40 s — required near water
- **AFCI:** detects arcing that can start fires — required in bedrooms
- **Breakers/fuses:** protect wires from overheating

**Lab and shop rules**
- Work on de-energized circuits; verify with a meter
- One hand rule for higher voltages
- Never bypass safety devices
- **Lockout/tagout** before servicing machines

The **National Electrical Code (NEC)** sets wiring rules in the U.S.`,
            questions: [
              num("At 120 V with 1,000 Ω of body resistance, what current flows (mA)?", 120, "120/1000 = 0.12 A."),
              mc("What does a GFCI detect?", "A difference between outgoing and returning current", ["Too much light", "Low battery", "High temperature only"], "Leakage means current is going somewhere else — possibly through a person."),
              tf("Wet skin has much lower resistance than dry skin.", true, "Water dramatically increases shock danger."),
              mc("Before servicing a machine, workers should…", "lock out and tag out the power source", ["work quickly while it runs", "remove the ground wire", "bypass the breaker"], "Ensure it can't be energized."),
            ],
          },
        ],
      },
      {
        title: "System Design and Troubleshooting",
        description: "Design a complete sensor system and troubleshoot circuits.",
        lessons: [
          {
            title: "Designing a Sensor System",
            summary: "Integrate sensors, a microcontroller, and actuators into a system that meets specifications.",
            objectives: ["Write measurable specifications", "Draw a block diagram and schematic", "Build, test, and iterate an electronic system"],
            vocab: [["block diagram", "a high-level drawing of system parts and signal flow"], ["schematic", "a detailed circuit drawing using standard symbols"], ["specification", "a measurable requirement"]],
            standards: ["HS-ETS1-2", "HS-ETS1-3", "HS-ETS1-4"],
            body: `
**Project: smart plant monitor**

**Specifications**
- Measure soil moisture every 10 minutes
- Light a red LED and sound a buzzer if moisture < 30%
- Run 2 weeks on batteries
- Cost under $25

**Block diagram**
\`\`\`
[Soil sensor] → [Microcontroller] → [LED + buzzer]
                     ↑
                [Battery + regulator]
\`\`\`

**Power budget**
- Microcontroller asleep: 0.1 mA; awake 1 s per 10 min at 20 mA
- Average ≈ 0.1 + 20 × (1/600) ≈ **0.13 mA**
- 2,000 mAh battery ÷ 0.13 mA ≈ **15,000 hours** (well over 2 weeks)

**Calibrate:** dry soil reading = 0%, wet = 100%; map between.

**Test against every spec** and log results. Iterate: if the sensor corrodes, switch to a capacitive sensor.`,
            questions: [
              num("A device averages 0.5 mA from a 1,000 mAh battery. How many hours will it last?", 2000, "1000 ÷ 0.5."),
              mc("Which document shows exact component connections with standard symbols?", "Schematic", ["Block diagram", "Gantt chart", "Truth table"], "Schematics are detailed."),
              tf("Putting a microcontroller to sleep between readings greatly extends battery life.", true, "Average current drops dramatically."),
              mc("Which is a measurable specification?", "Alerts when moisture is below 30%", ["Works well", "Looks nice", "Is smart"], "It has a number you can test."),
            ],
          },
          {
            title: "Troubleshooting with a Multimeter",
            summary: "Systematic measurement isolates faults in circuits quickly and safely.",
            objectives: ["Measure voltage, current, resistance, and continuity", "Apply a systematic troubleshooting process", "Identify common circuit faults"],
            vocab: [["continuity test", "checks whether a complete path exists"], ["open circuit", "a break that stops current"], ["short circuit", "an unintended low-resistance path"], ["half-splitting", "testing the middle of a system to narrow down the fault"]],
            standards: ["HS-ETS1-3"],
            body: `
**Multimeter modes**
| Measure | Connect | Power |
|---|---|---|
| Voltage | across component (parallel) | on |
| Current | in the path (series) | on |
| Resistance | across component | **off** |
| Continuity (beep) | across a wire or joint | **off** |

**Troubleshooting process**
1. **Observe** symptoms: what works, what doesn't?
2. **Check the obvious:** power, battery voltage, switch, loose wires
3. **Half-split:** measure in the middle of the signal path to see which half has the fault
4. **Measure, don't guess**
5. **Fix one thing**, then retest

**Common faults**
- Dead battery (reads well below rated voltage)
- Open: cold solder joint, broken wire → full supply voltage across the gap
- Short: solder bridge → hot parts, blown fuse
- Reversed LED or diode
- Wrong resistor value (check color bands!)

**Example:** a 9 V circuit's LED is dark. Battery reads 9 V; voltage across the resistor is 0 V; across the LED, 9 V → the LED is open or reversed.`,
            questions: [
              mc("To measure current, the multimeter is connected…", "in series with the circuit", ["in parallel across the battery", "with the power off", "to the ground only"], "Current must flow through the meter."),
              mc("Resistance measurements should be made with…", "power off", ["power on", "the battery reversed", "a hot soldering iron"], "Live voltage gives wrong readings and can damage the meter."),
              mc("In the example, the LED shows the full 9 V across it and no current flows. The LED is likely…", "open or reversed", ["working perfectly", "shorted", "too bright"], "An open part drops all the voltage."),
              tf("Half-splitting means testing the middle of a signal path to narrow down where a fault is.", true, "Each test cuts the search area in half."),
            ],
            writtenPrompt: "A flashlight with two AA batteries, a switch, and an LED doesn't turn on. Write a step-by-step troubleshooting plan, including which measurements you'd take and what each result would tell you.",
            rubric: "Logical order starting with simple checks (3) · Correct meter modes (3) · Interprets possible results (3) · Safety noted (1)",
          },
        ],
      },
    ],
  },
  {
    id: "eng-civil",
    title: "Civil & Environmental Engineering",
    subject: "engineering",
    grade: 9,
    gradeMax: 12,
    framework: NGSS_ETS,
    description: "Design the infrastructure communities depend on: structures, bridges, transportation, water, sustainable sites, and resilience to earthquakes and climate.",
    units: [
      {
        title: "Structures",
        description: "Analyze loads on beams and compare bridge systems.",
        lessons: [
          {
            title: "Loads and Beams",
            summary: "Structures carry dead, live, and environmental loads; beam shape determines how efficiently they resist bending.",
            objectives: ["Classify structural loads", "Explain bending stress in beams", "Compare beam cross-sections"],
            vocab: [["dead load", "the permanent weight of the structure itself"], ["live load", "temporary loads like people, furniture, vehicles"], ["moment of inertia", "a measure of a cross-section's resistance to bending"], ["deflection", "how much a beam bends under load"]],
            standards: ["HS-ETS1-2", "HS-PS2-1"],
            body: `
**Types of loads**
| Load | Examples |
|---|---|
| Dead | beams, floors, roof, walls |
| Live | people, furniture, cars, snow |
| Environmental | wind, earthquakes, snow, temperature |

Building codes specify minimum live loads: ~40 lb/ft² for homes, ~100 lb/ft² for assembly areas.

**Bending:** a loaded beam's top is in **compression**, its bottom in **tension**, and the middle (neutral axis) carries little stress.

**Why I-beams?** They put material at the top and bottom where stress is highest. An I-beam is far stiffer than a solid rectangular beam of the same weight.

**Depth matters most:** a beam's stiffness grows with the **cube** of its depth. Turning a 2×8 board on edge (instead of flat) makes it about **16× stiffer** (8/2 = 4; 4³ = 64 for depth, ÷ 4 for width → 16).

**Maximum moment** for a simply supported beam with a center load: M = PL/4.`,
            questions: [
              mc("Snow on a roof is classified as…", "a live/environmental load", ["a dead load", "no load", "a moment of inertia"], "It's temporary."),
              mc("In a simply supported beam with a downward load, the bottom of the beam is in…", "tension", ["compression", "torsion only", "no stress"], "The bottom stretches."),
              num("A 4 m beam supports a 2,000 N center load. What is the maximum moment (N·m)? (M = PL/4)", 2000, "2000 × 4 / 4."),
              tf("Placing a board on edge makes it much stiffer than laying it flat.", true, "Stiffness grows with depth cubed."),
            ],
          },
          {
            title: "Bridge Types and Design",
            summary: "Bridge type is chosen based on span, loads, site conditions, materials, and cost.",
            objectives: ["Compare beam, truss, arch, cantilever, cable-stayed, and suspension bridges", "Match bridge types to sites", "Evaluate bridge designs with criteria"],
            vocab: [["cable-stayed bridge", "a bridge whose deck hangs from cables attached directly to towers"], ["cantilever", "a structure supported at only one end"], ["abutment", "the support at each end of a bridge"]],
            standards: ["HS-ETS1-1", "HS-ETS1-3"],
            body: `
| Type | Typical span | Key force path | Example |
|---|---|---|---|
| Beam | < 80 m | bending | highway overpasses |
| Truss | 50–400 m | tension and compression members | many railroad bridges |
| Arch | 50–550 m | compression | Hoover Dam Bypass (O'Callaghan–Tillman) |
| Cantilever | 150–550 m | balanced arms | Forth Bridge, Scotland |
| Cable-stayed | 100–1,100 m | cables in tension to towers | Arthur Ravenel Jr. Bridge, SC |
| Suspension | 500–2,000 m | main cables in tension | Golden Gate; Akashi Kaikyō (1,991 m) |

**Site factors**
- Span needed and ship clearance
- Soil and rock for foundations
- Wind, earthquakes, flooding
- Construction access (can you build supports in the river?)
- Budget and maintenance

**Choosing:** a short creek crossing → beam bridge (cheap, quick). A deep canyon with solid rock walls → arch. A wide shipping channel → suspension or cable-stayed.`,
            questions: [
              mc("Which bridge type is best for the longest spans?", "Suspension", ["Beam", "Truss", "Arch"], "Up to about 2,000 m."),
              mc("A deep canyon with strong rock walls is ideal for which bridge?", "Arch", ["Floating", "Beam with many piers", "Pontoon"], "Arches push into solid abutments."),
              tf("In a cable-stayed bridge, cables connect the deck directly to the towers.", true, "Unlike suspension bridges, there are no main draped cables."),
              mc("Which factor is MOST important when choosing a bridge for a busy shipping channel?", "Clearance and span without piers in the channel", ["Paint color", "Number of lanes only", "The name of the bridge"], "Ships need room."),
            ],
          },
        ],
      },
      {
        title: "Transportation and Water",
        description: "Design transportation systems and water infrastructure.",
        lessons: [
          {
            title: "Traffic Flow and Transportation Design",
            summary: "Transportation engineers analyze traffic data to design safer, more efficient roads and transit.",
            objectives: ["Calculate flow, density, and speed relationships", "Evaluate intersection designs like roundabouts", "Consider multimodal transportation"],
            vocab: [["traffic flow", "vehicles passing a point per hour"], ["level of service", "a grade (A–F) describing traffic conditions"], ["roundabout", "a circular intersection where traffic flows counterclockwise"], ["induced demand", "adding road capacity encourages more driving"]],
            standards: ["HS-ETS1-1", "HS-ETS1-4"],
            body: `
**Fundamental relationship:** flow = density × speed
- 20 vehicles/km at 90 km/h → **1,800 vehicles/hour**
- Too dense → speed collapses → flow drops (traffic jams)

**Intersections**
| Type | Pros | Cons |
|---|---|---|
| Stop sign | cheap | slow at high volume |
| Traffic signal | handles heavy flow | delays, red-light crashes |
| **Roundabout** | ~75% fewer injury crashes, steady flow | needs space, unfamiliar to some |

Roundabouts reduce dangerous right-angle and head-on collisions.

**Induced demand:** widening highways often fills them up again within a few years, because faster trips encourage more driving.

**Multimodal design:** sidewalks, bike lanes, buses, and rail move more people per lane. One bus can replace ~40 cars.

**Safety:** lowering speeds from 40 to 20 mph drastically raises pedestrian survival in crashes.`,
            questions: [
              num("A highway has density 25 vehicles/km and speed 80 km/h. What is the flow (vehicles/hour)?", 2000, "25 × 80."),
              mc("Why do roundabouts reduce serious crashes?", "They eliminate high-speed right-angle and head-on collisions", ["They have more traffic lights", "Cars go faster", "They have no pedestrians"], "Low speeds and one-way flow."),
              tf("Widening a highway always permanently eliminates congestion.", false, "Induced demand often refills the lanes."),
              mc("One bus can replace about how many cars?", "40", ["2", "5", "500"], "Buses move many more people per lane."),
            ],
          },
          {
            title: "Water Treatment and Distribution",
            summary: "Treatment plants clean water through coagulation, sedimentation, filtration, and disinfection.",
            objectives: ["Describe the steps of drinking water treatment", "Calculate water demand", "Explain how distribution systems maintain pressure"],
            vocab: [["coagulation", "adding chemicals so particles clump together"], ["sedimentation", "letting clumps settle out"], ["disinfection", "killing pathogens, often with chlorine or UV"], ["water tower", "elevated storage that provides pressure by gravity"]],
            standards: ["HS-ESS3-1", "HS-ETS1-2"],
            body: `
**Drinking water treatment**
1. **Screening:** remove debris
2. **Coagulation/flocculation:** alum makes particles clump into "floc"
3. **Sedimentation:** floc settles
4. **Filtration:** sand, gravel, and activated carbon
5. **Disinfection:** chlorine or UV kills pathogens
6. **Storage and distribution**

**Wastewater treatment** cleans used water before returning it to rivers: screening, settling, bacteria that consume organic waste (secondary treatment), and disinfection.

**Demand:** U.S. residents use about **80–100 gallons per person per day**.
A town of 20,000 at 90 gal/day → **1.8 million gallons per day**.

**Water towers:** gravity provides pressure. Each foot of height adds about 0.43 psi.
A 150 ft tower → ~65 psi at ground level.

**Flint, Michigan (2014):** a switch in water source without corrosion control leached lead from old pipes — a public health crisis showing why engineering decisions affect communities.`,
            questions: [
              mc("Which step uses chemicals to make particles clump together?", "Coagulation", ["Disinfection", "Screening", "Distribution"], "Alum forms floc."),
              num("A town of 10,000 uses 100 gallons per person per day. What is daily demand (gallons)?", 1000000, "10,000 × 100."),
              num("At about 0.43 psi per foot, how much pressure (psi) does a 100 ft water column provide?", 43, "100 × 0.43."),
              tf("The Flint water crisis involved lead leaching from pipes due to lack of corrosion control.", true, "Engineering decisions have public health consequences."),
            ],
          },
        ],
      },
      {
        title: "Sustainable Sites",
        description: "Manage stormwater and plan sustainable developments.",
        lessons: [
          {
            title: "Stormwater and Green Infrastructure",
            summary: "Pavement increases runoff; green infrastructure lets water soak in, reducing floods and pollution.",
            objectives: ["Calculate runoff using the rational method", "Compare gray and green infrastructure", "Design green stormwater solutions"],
            vocab: [["impervious surface", "a surface water can't soak through, like asphalt"], ["runoff coefficient", "fraction of rainfall that becomes runoff"], ["bioswale", "a vegetated channel that slows and filters stormwater"], ["green roof", "a roof covered with plants"]],
            standards: ["HS-ESS3-4", "HS-ETS1-3"],
            body: `
**Rational method:** Q = C × i × A
- C = runoff coefficient (0 to 1)
- i = rainfall intensity
- A = area

| Surface | C |
|---|---|
| Asphalt, roofs | 0.90–0.95 |
| Lawn | 0.10–0.30 |
| Forest | 0.05–0.20 |

**Paving a field** raises C from ~0.2 to ~0.9 → **4.5× more runoff**.

**Gray infrastructure:** pipes, culverts, concrete channels — move water away fast (can overwhelm rivers and sewers).

**Green infrastructure:** let water soak in where it falls.
- **Rain gardens** and **bioswales**
- **Permeable pavement**
- **Green roofs** (absorb 50–90% of rainfall)
- **Rain barrels** and cisterns
- **Urban trees**

**Benefits:** less flooding, cleaner rivers, cooler cities, habitat, and often lower cost than bigger pipes.`,
            questions: [
              num("A 2-acre parking lot (C = 0.9) receives 2 in/h of rain. Using Q = CiA, what is Q (acre-in/h)?", 3.6, "0.9 × 2 × 2."),
              mc("Which surface has the highest runoff coefficient?", "Asphalt", ["Forest", "Lawn", "Rain garden"], "Water can't soak in."),
              tf("Green roofs can absorb a large portion of rainfall.", true, "Often 50–90%."),
              mc("Which is green infrastructure?", "A bioswale", ["A concrete channel", "A storm drain pipe", "A culvert"], "Vegetated systems soak and filter water."),
            ],
          },
          {
            title: "Site Planning and Green Building",
            summary: "Sustainable site and building design reduces energy, water, and environmental impact.",
            objectives: ["Describe LEED categories", "Apply passive design strategies", "Evaluate a site plan for sustainability"],
            vocab: [["LEED", "a green building rating system"], ["passive solar design", "using building orientation and materials to heat and cool naturally"], ["heat island effect", "cities being hotter than surrounding areas due to pavement and buildings"], ["walkability", "how easy it is to reach daily needs on foot"]],
            standards: ["HS-ESS3-4", "HS-ETS1-3"],
            body: `
**LEED rating categories** include:
- Location and transportation (near transit, walkable)
- Sustainable sites (stormwater, heat island reduction)
- Water efficiency
- Energy and atmosphere
- Materials and resources
- Indoor environmental quality
Levels: Certified, Silver, Gold, Platinum.

**Passive design (Northern Hemisphere)**
- Long side of the building faces **south** for winter sun
- **Overhangs** block high summer sun but admit low winter sun
- **Thermal mass** (concrete, stone) stores daytime heat
- **Cross-ventilation** for natural cooling
- Deciduous trees on the south: shade in summer, sun in winter

**Site planning**
- Preserve existing trees and wetlands
- Cluster buildings to leave open space
- Light-colored or vegetated roofs reduce heat islands
- Mixed-use, walkable neighborhoods reduce driving

**Buildings** account for about **40%** of U.S. energy use — design choices matter.`,
            questions: [
              mc("In the Northern Hemisphere, which direction should a passive solar building's main windows face?", "South", ["North", "East only", "Straight up"], "South-facing windows capture winter sun."),
              mc("Roof overhangs help passive design by…", "blocking high summer sun while letting in low winter sun", ["blocking all sunlight", "collecting rain only", "making the building taller"], "Sun angle changes seasonally."),
              tf("Light-colored roofs help reduce the urban heat island effect.", true, "They reflect more sunlight."),
              num("About what percent of U.S. energy use comes from buildings?", 40, "Roughly 40%.", { tolerance: 5 }),
            ],
          },
        ],
      },
      {
        title: "Resilient Infrastructure",
        description: "Design for earthquakes and a changing climate.",
        lessons: [
          {
            title: "Earthquake Engineering",
            summary: "Seismic design uses ductility, bracing, base isolation, and damping to protect lives.",
            objectives: ["Explain how earthquakes load structures", "Compare seismic design strategies", "Explain resonance and natural period"],
            vocab: [["seismic", "related to earthquakes"], ["ductility", "ability to deform without breaking"], ["natural period", "the time a structure takes to sway back and forth once"], ["soft story", "a weak floor, often with open parking, prone to collapse"]],
            standards: ["HS-ESS3-1", "HS-ETS1-2"],
            body: `
**Earthquakes shake the ground sideways**, creating inertial forces in buildings: F = m × a. Heavier buildings feel larger forces.

**Resonance:** every building has a **natural period** (roughly 0.1 s per story). If ground shaking matches it, swaying grows dangerously. In the 1985 Mexico City earthquake, many 6–15 story buildings collapsed because their periods matched the soft soil's shaking.

**Design strategies**
| Strategy | How it helps |
|---|---|
| Ductile steel and reinforced concrete | bend without sudden collapse |
| Shear walls and cross-bracing | resist sideways forces |
| Base isolation | rubber bearings decouple building from ground |
| Dampers | absorb energy (like shock absorbers) |
| Avoid soft stories | strengthen open ground floors |

**Codes save lives:** Chile's strict seismic codes meant that the magnitude 8.8 earthquake in 2010 caused far fewer deaths than weaker quakes in countries without enforced codes.

**Retrofitting** older buildings (adding steel frames, bolting houses to foundations) is often the most cost-effective life-saving step.`,
            questions: [
              num("Using about 0.1 s per story, what is the natural period of a 12-story building (s)?", 1.2, "12 × 0.1."),
              mc("Why did many mid-rise buildings collapse in the 1985 Mexico City earthquake?", "Their natural periods matched the ground shaking (resonance)", ["They were too short", "They were made of wood", "There was no shaking"], "Resonance amplified motion."),
              mc("What does base isolation do?", "Decouples the building from ground motion", ["Makes the building heavier", "Locks the building rigidly to bedrock", "Adds more floors"], "Bearings absorb shaking."),
              tf("A 'soft story' with open parking on the ground floor is a seismic weakness.", true, "It lacks lateral strength."),
            ],
          },
          {
            title: "Climate-Resilient Design",
            summary: "Engineers design infrastructure for rising seas, heavier storms, extreme heat, and wildfire.",
            objectives: ["Identify climate hazards for infrastructure", "Compare adaptation strategies", "Evaluate resilience trade-offs and equity"],
            vocab: [["resilience", "ability to withstand and recover from disruptions"], ["adaptation", "adjusting to actual or expected climate effects"], ["100-year flood", "a flood with a 1% chance of occurring in any year"], ["managed retreat", "moving people and assets away from high-risk areas"]],
            standards: ["HS-ESS3-1", "HS-ESS3-5", "HS-ETS1-1"],
            body: `
**Climate hazards and engineering responses**
| Hazard | Adaptations |
|---|---|
| Sea-level rise | sea walls, raised roads, living shorelines (marshes, oyster reefs) |
| Heavier rainfall | larger culverts, green infrastructure, detention basins |
| Extreme heat | cool pavements, shade trees, heat-resistant rails and power lines |
| Wildfire | defensible space, ember-resistant vents, fire-resistant materials |
| Hurricanes | elevated buildings, stronger roof connections, buried power lines |

**"100-year flood" misconception:** it's a **1% chance each year**. Over a 30-year mortgage, that's about a **26%** chance of at least one.
(1 − 0.99³⁰ ≈ 0.26)

**Design storms are changing:** historical rainfall records underestimate future extremes, so engineers update design standards.

**Strategies:** protect (walls), accommodate (raise and floodproof), or retreat (relocate).

**Equity:** low-income neighborhoods often face higher risks and fewer resources. Resilient design asks who is protected — and who pays.`,
            questions: [
              mc("A '100-year flood' means…", "a flood with a 1% chance of occurring in any year", ["a flood that happens exactly once a century", "a flood lasting 100 days", "a flood 100 feet deep"], "It's a probability, not a schedule."),
              num("About what percent chance is there of at least one 100-year flood in 30 years? (1 − 0.99³⁰)", 26, "≈ 0.26.", { tolerance: 1 }),
              mc("Restoring marshes and oyster reefs to protect a coast is an example of…", "a living shoreline", ["managed retreat", "a gray sea wall", "a culvert"], "Nature-based protection."),
              tf("Engineers should use only historical rainfall data when designing for future storms.", false, "Climate change is shifting extremes."),
            ],
            writtenPrompt: "Choose one climate hazard that affects your region. Propose an engineering adaptation for your community, and discuss its cost, effectiveness, and who benefits.",
            rubric: "Identifies a relevant local hazard (2) · Feasible adaptation (3) · Discusses cost and effectiveness (3) · Addresses equity (2)",
          },
        ],
      },
    ],
  },
];
