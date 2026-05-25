/** 20 technology lessons: computing fundamentals through advanced CS topics */
export const technologyLessons = [
  {
    id: "tech001",
    title: "How Computers Work",
    summary: "CPU, memory, storage, input/output, and the fetch-decode-execute cycle.",
    difficulty: "Easy",
    estimatedMinutes: 25,
    tags: "computers|hardware|basics",
    content: `A **computer** processes data using digital logic.

**Core parts:**
- **CPU** — executes instructions (arithmetic, logic, control)
- **RAM** — fast temporary memory for running programs
- **Storage (SSD/HDD)** — persistent data when power is off
- **I/O devices** — keyboard, display, network

**Binary:** Information is stored as **bits** (0 or 1); **bytes** are 8 bits.

**Fetch-decode-execute cycle:** CPU loads instruction from memory, decodes it, performs operation, repeats billions of times per second (clock speed in GHz).

**Software layers:** Applications → operating system → hardware. The OS manages memory, files, and devices.`,
    answerGuide: `RAM is volatile; storage is non-volatile. CPU does not "understand" Python directly — programs are compiled or interpreted to machine code.`,
    answer: `Students should name CPU, RAM, storage, and I/O roles, define bit and byte, and outline fetch-decode-execute. They should place the OS between apps and hardware.`,
  },
  {
    id: "tech002",
    title: "Introduction to Programming",
    summary: "Algorithms, syntax, variables, and how programs solve problems.",
    difficulty: "Easy",
    estimatedMinutes: 30,
    tags: "programming|algorithms|basics",
    content: `**Programming** is writing precise instructions a computer executes.

**Algorithm** — ordered steps solving a problem (like a recipe). Properties: clear, finite, effective.

**Source code** is written in a language (Python, JavaScript, Java). It must follow **syntax** rules.

**Common constructs:**
- **Variables** store values (x = 5)
- **Conditionals** — if/else decisions
- **Loops** — repeat while/for
- **Functions** — reusable named blocks

**Debugging** finds and fixes errors (**bugs**). Errors can be syntax (won't run) or logic (wrong output).

**First program tradition:** print "Hello, World!" to verify setup.`,
    answerGuide: `Emphasize computational thinking: decomposition, pattern recognition, abstraction. Pseudocode before code for beginners.`,
    answer: `Students should define algorithm and program, list variables/conditionals/loops/functions, distinguish syntax vs logic errors, and explain debugging.`,
  },
  {
    id: "tech003",
    title: "Binary and Data Representation",
    summary: "Convert small binary numbers and see how text and images become bits.",
    difficulty: "Easy",
    estimatedMinutes: 30,
    tags: "binary|data|encoding",
    content: `Computers represent all data as **binary** (base 2).

**Place values:** 2³=8, 2²=4, 2¹=2, 2⁰=1  
Example: 1011₂ = 8+0+2+1 = 11₁₀

**Bytes (8 bits):** 0–255 unsigned decimal

**Text encoding (ASCII/UTF-8):** Characters map to numbers — 'A' is 65 in ASCII; UTF-8 supports world scripts.

**Images:** Pixels with RGB values; more bits → more colors.

**Integers vs floating point:** Different formats; floating point approximates decimals (important for rounding in programs).

**Hexadecimal (base 16):** Compact shorthand for binary (0–9, A–F).`,
    answerGuide: `Powers of two table helps. Unicode is superset of ASCII. Not all fractions are exact in binary floating point (0.1 example).`,
    answer: `Students should convert a 4-bit binary number to decimal, define byte, explain character encoding at a high level, and state that images are stored as numeric pixel data.`,
  },
  {
    id: "tech004",
    title: "The Internet and the Web",
    summary: "Clients, servers, IP addresses, DNS, HTTP, and how web pages load.",
    difficulty: "Easy",
    estimatedMinutes: 30,
    tags: "internet|networking|web",
    content: `The **Internet** is a global network of networks; the **World Wide Web** is a service using HTTP over it.

**Client–server model:** Your **browser (client)** requests resources from **web servers**.

**IP addresses** identify devices (IPv4 like 192.0.2.1; IPv6 longer hex forms).

**DNS (Domain Name System)** maps names (example.com) to IP addresses.

**URLs:** scheme://host/path — https://example.com/page

**HTTP methods:** GET (fetch), POST (submit data). **HTTPS** encrypts traffic with TLS.

**Loading a page:** DNS lookup → TCP connection → HTTP request → HTML/CSS/JS response → browser renders.`,
    answerGuide: `Routers forward packets. ISP connects home network. Cookies store session data; privacy implications. Web ≠ entire Internet (email, games use other protocols).`,
    answer: `Students should explain client vs server, role of DNS and IP, what HTTPS adds, and list steps to load a webpage.`,
  },
  {
    id: "tech005",
    title: "Digital Citizenship and Cyber Safety",
    summary: "Passwords, phishing, privacy, and ethical behavior online.",
    difficulty: "Easy",
    estimatedMinutes: 25,
    tags: "safety|ethics|privacy",
    content: `**Digital citizenship** is responsible, ethical technology use.

**Account security:**
- Strong, unique passwords or a **password manager**
- **Multi-factor authentication (MFA)** adds a second factor (phone app, key)

**Phishing** — deceptive messages trick users into revealing credentials; check sender, links, urgency tactics.

**Privacy:** Limit personal data shared; review app permissions; understand public posts persist.

**Misinformation:** Verify sources; lateral reading; distinguish opinion from evidence.

**Ethics:** Respect copyright; cite sources; avoid plagiarism; report harassment; follow acceptable use policies.

**Digital footprint:** Schools and employers may review public posts.`,
    answerGuide: `Social engineering bypasses technical controls. No legitimate IT support asks for your password. COPPA/FERPA context for schools briefly.`,
    answer: `Students should list three safety practices (MFA, unique passwords, verify links), define phishing, and give two ethical rules for online work.`,
  },
  {
    id: "tech006",
    title: "Algorithms in Everyday Life",
    summary: "Recognize step-by-step procedures and evaluate efficiency informally.",
    difficulty: "Easy",
    estimatedMinutes: 25,
    tags: "algorithms|logic|problem-solving",
    content: `An **algorithm** is a finite sequence of clear steps.

**Everyday examples:**
- Recipe instructions
- GPS route planning
- Sorting mail by ZIP code

**Properties of good algorithms:**
- **Correct** — solves the problem
- **Clear** — unambiguous steps
- **Efficient** — reasonable time/steps (intro level)

**Searching example:** Linear search checks each item; binary search halves sorted data (much faster for large lists).

**Pseudocode** mixes English and code structure for planning before coding.

**Computational thinking:** Decompose problems, find patterns, abstract details, design steps.`,
    answerGuide: `Big-O notation optional. Binary search requires sorted input. Algorithms exist independent of programming language.`,
    answer: `Students should define algorithm, give a non-computer example, contrast linear vs binary search informally, and name two properties of good algorithms.`,
  },
  {
    id: "tech007",
    title: "Files, Folders, and File Types",
    summary: "Organize digital work and understand common extensions and formats.",
    difficulty: "Easy",
    estimatedMinutes: 20,
    tags: "files|organization|basics",
    content: `**File systems** store **files** in hierarchical **folders (directories)**.

**Paths:** /home/user/project/report.pdf (Linux/macOS) or C:\\Users\\project\\report.docx (Windows)

**Extensions hint at type:**
- .txt — plain text
- .csv — tabular data
- .png / .jpg — images (lossless vs lossy)
- .mp3 — audio compression
- .py — Python source

**Metadata:** name, size, modified date, permissions (read/write/execute on Unix)

**Backups:** 3-2-1 rule variant — multiple copies, different media, one off-site/cloud

**Versioning:** meaningful names (essay_v2.docx) or tools like Git for code.`,
    answerGuide: `Cloud sync ≠ backup if ransomware encrypts synced files. Case sensitivity on Linux paths. Hidden files start with dot on Unix.`,
    answer: `Students should explain folder hierarchy and path, match four extensions to content types, and describe why backups matter.`,
  },
  {
    id: "tech008",
    title: "Variables and Data Types",
    summary: "Store text, numbers, and booleans; understand assignment and typing.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "programming|variables|types",
    content: `**Variables** label memory locations holding values that can change.

**Common data types:**
- **Integer** — whole numbers (42, −3)
- **Float** — decimals (3.14)
- **String** — text ("hello")
- **Boolean** — true/false

**Assignment:** score = 100 stores value; score = score + 5 updates it.

**Type errors:** Adding string + number fails in strictly typed languages; JavaScript coerces types (can surprise beginners).

**Constants** — values that should not change (PI = 3.14159).

**Naming:** descriptive identifiers (student_count, not single-letter x).

**Input/output:** programs read user input, compute, print results.`,
    answerGuide: `Declaration vs assignment in typed languages. Scope (local/global) preview. ZeroDivisionError example for runtime errors.`,
    answer: `Students should define variable and four types with examples, show assignment updating a value, and explain why descriptive names help readability.`,
  },
  {
    id: "tech009",
    title: "Web Development Basics",
    summary: "HTML structure, CSS presentation, and how browsers render pages.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "web|html|css",
    content: `Websites combine **structure**, **style**, and **behavior**.

**HTML (HyperText Markup Language):**
- Elements with tags: h1, p, a (links), img
- Semantic tags: header, nav, main, footer improve accessibility

**CSS (Cascading Style Sheets):**
- Selectors target elements
- Properties: color, font-size, margin, display
- Box model: content, padding, border, margin

**JavaScript** adds interactivity (events, DOM updates).

**Accessibility:** alt text for images, sufficient contrast, keyboard navigation.

**Responsive design:** CSS media queries adapt layout to screen size.`,
    answerGuide: `Separate concerns: content/structure vs presentation. Validate HTML. Link external CSS file. Introduce DevTools inspect element.`,
    answer: `Students should state roles of HTML, CSS, and JavaScript, name three HTML tags and purpose, describe box model layers, and explain alt text for accessibility.`,
  },
  {
    id: "tech010",
    title: "Introduction to Databases",
    summary: "Tables, rows, keys, and why databases manage structured data at scale.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "databases|sql|data",
    content: `A **database** stores structured data for reliable querying.

**Relational model (SQL):**
- **Tables** like spreadsheets
- **Rows** = records; **columns** = fields
- **Primary key** uniquely identifies a row
- **Foreign key** links tables (students.class_id → classes.id)

**SQL basics:**
- SELECT — read data
- INSERT — add rows
- UPDATE — change rows
- DELETE — remove rows (careful!)

**Why not only spreadsheets?** Concurrent users, integrity rules, indexes for speed, backups.

**NoSQL** (document, key-value) fits flexible or huge-scale patterns — different tradeoffs.`,
    answerGuide: `Normalization reduces duplication. Never DELETE without WHERE in teaching demos. Parameterized queries prevent SQL injection preview.`,
    answer: `Students should define table, row, primary key, foreign key, name four SQL operations, and explain one reason databases beat single spreadsheets for apps.`,
  },
  {
    id: "tech011",
    title: "Cybersecurity Fundamentals",
    summary: "Threats, vulnerabilities, encryption basics, and defense layers.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "security|cyber|encryption",
    content: `**Cybersecurity** protects confidentiality, integrity, and availability (**CIA triad**).

**Threats:**
- **Malware** (viruses, ransomware)
- **Social engineering** (phishing)
- **Weak passwords** / credential stuffing

**Defenses:**
- Patch software updates
- Firewalls filter traffic
- Encryption scrambles data without the key

**Symmetric encryption** — same key encrypt/decrypt (AES)  
**Asymmetric encryption** — public/private key pair (RSA/ECC); enables TLS handshakes

**Hashing** (SHA-256) — one-way fingerprints; used for password storage with salt (not reversible)

**Principle of least privilege:** accounts get minimum permissions needed.`,
    answerGuide: `HTTPS uses TLS. Ransomware encrypts victim files. Salting hashes defeats rainbow tables. Zero-day = unknown vulnerability.`,
    answer: `Students should define CIA triad, list three threats and three defenses, contrast encryption vs hashing, and explain least privilege.`,
  },
  {
    id: "tech012",
    title: "Boolean Logic and Logic Gates",
    summary: "AND, OR, NOT gates and how digital circuits compute.",
    difficulty: "Medium",
    estimatedMinutes: 30,
    tags: "logic|circuits|binary",
    content: `Digital circuits use **logic gates** on binary signals (0 = low voltage, 1 = high).

**Basic gates:**
- **NOT** — inverts input
- **AND** — output 1 only if all inputs 1
- **OR** — output 1 if any input 1
- **XOR** — output 1 if inputs differ

**Truth tables** list all input combinations and outputs.

**Combinations:** Gates build adders, multiplexers, memory elements.

**Boolean algebra** rules simplify expressions (e.g., De Morgan's laws).

**Link to programming:** Conditions use logical operators (&&, ||, ! in many languages).`,
    answerGuide: `NAND/NOR are universal (can build any gate). Half-adder adds two bits with sum and carry. Relate to if statements combining comparisons.`,
    answer: `Students should complete truth tables for AND/OR/NOT, relate gates to binary 0/1, and connect AND/OR to programming conditionals.`,
  },
  {
    id: "tech013",
    title: "Version Control with Git",
    summary: "Track code changes with commits, branches, and collaboration basics.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "git|version-control|collaboration",
    content: `**Version control** records project history and enables teamwork.

**Git** is distributed VCS — every clone has full history.

**Core concepts:**
- **Repository (repo)** — project folder + history
- **Commit** — snapshot with message describing change
- **Branch** — parallel line of work (e.g., feature-login)
- **Merge** — combine branches

**Common commands (conceptual):**
- git clone — copy remote repo
- git add / git commit — stage and save snapshot
- git push / git pull — sync with remote (e.g., GitHub)

**Why it matters:** Undo mistakes, compare versions, collaborate without emailing files.

**Good commit messages:** short imperative summary ("Fix quiz scoring bug").`,
    answerGuide: `Merge conflicts happen when same lines edited. .gitignore excludes build artifacts. Git ≠ GitHub (hosting service).`,
    answer: `Students should define repository, commit, branch, merge, explain why version control beats manual copies, and list three Git operations with purpose.`,
  },
  {
    id: "tech014",
    title: "Artificial Intelligence and Machine Learning",
    summary: "What AI means today, training data, models, and responsible use.",
    difficulty: "Medium",
    estimatedMinutes: 35,
    tags: "ai|machine-learning|ethics",
    content: `**Artificial intelligence (AI)** — systems performing tasks that typically require human intelligence (perception, language, decision support).

**Machine learning (ML)** — programs **learn patterns from data** instead of only hand-coded rules.

**Supervised learning:** Labeled examples (emails marked spam/not spam) train a model to classify new inputs.

**Neural networks / deep learning:** Layers of computations; strong for images and language at scale; need large data and compute.

**Limitations:**
- Biased or incomplete training data → biased outputs
- Can **hallucinate** incorrect facts in language models
- Not understanding in human sense — statistical patterns

**Responsible use:** Transparency, privacy, human oversight in high-stakes decisions (medicine, justice).`,
    answerGuide: `Narrow AI vs AGI (still hypothetical). Training vs inference. Data labeling labor issues. EU/US regulatory trends overview.`,
    answer: `Students should contrast rule-based software vs ML, define supervised learning, name two limitations (bias, errors), and give one ethical consideration.`,
  },
  {
    id: "tech015",
    title: "Arrays and Lists",
    summary: "Store collections, index elements, and iterate with loops.",
    difficulty: "Hard",
    estimatedMinutes: 40,
    tags: "data-structures|arrays|programming",
    content: `An **array/list** stores ordered elements accessible by **index** (usually starting at 0).

**Operations:**
- Access: scores[0] (first element)
- Append/push (language-dependent)
- Length property
- Iterate with for/while loops

**Use cases:** Grade lists, sensor readings, game inventories.

**Parallel arrays** — separate arrays linked by index (legacy style).

**Bounds errors:** Accessing index ≥ length causes runtime error.

**Time complexity (intro):** Index access O(1); search unsorted O(n); insert at end often O(1) amortized.

**2D arrays** — grid of rows/columns (matrices, board games).`,
    answerGuide: `Dynamic arrays resize internally (Python list). Linked lists differ — not required here. Zero-based indexing trips beginners.`,
    answer: `Students should define index, show access and loop over a list, explain zero-based indexing, and note out-of-bounds error.`,
  },
  {
    id: "tech016",
    title: "Networking: TCP/IP and DNS",
    summary: "Packets, layers, reliable delivery, and name resolution.",
    difficulty: "Hard",
    estimatedMinutes: 40,
    tags: "networking|tcp|ip",
    content: `Networks move data in **packets** (small chunks with headers).

**TCP/IP model (simplified):**
- **Link layer** — local network frames (Wi‑Fi/Ethernet)
- **Internet layer** — **IP** addresses route packets globally
- **Transport layer** — **TCP** reliable, ordered delivery; **UDP** faster, no guarantee
- **Application layer** — HTTP, SMTP, DNS protocols

**TCP handshake** establishes connection (SYN, SYN-ACK, ACK) before data transfer.

**DNS** resolves hierarchical names (www.school.edu) to IP; cached at resolvers for speed.

**Ports** identify services on a host (HTTPS often port 443).

**NAT** lets many devices share one public IP at home routers.`,
    answerGuide: `IPv4 exhaustion led to IPv6 adoption. UDP used for video/voice where loss acceptable. Traceroute visualizes hops.`,
    answer: `Students should define packet, IP address, TCP vs UDP difference, DNS purpose, and identify HTTPS as application layer over TCP.`,
  },
  {
    id: "tech017",
    title: "Object-Oriented Programming Concepts",
    summary: "Classes, objects, encapsulation, inheritance, and polymorphism.",
    difficulty: "Hard",
    estimatedMinutes: 45,
    tags: "oop|programming|design",
    content: `**Object-oriented programming (OOP)** models programs as interacting **objects**.

**Class** — blueprint defining attributes (fields) and behaviors (methods).  
**Object** — instance of a class.

**Encapsulation** — hide internal state; expose methods (getters/setters or properties).

**Inheritance** — subclass extends superclass, reuses and specializes behavior (ElectricCar extends Car).

**Polymorphism** — same interface, different implementations (draw on Circle vs Square).

**Benefits:** Organize large codebases, mirror real-world entities, reuse via inheritance (favor **composition** when possible to reduce tight coupling).

**Example:** BankAccount class with deposit(), withdraw(), and private balance field.`,
    answerGuide: `Composition over inheritance principle. Abstract classes/interfaces differ by language. Constructors initialize objects.`,
    answer: `Students should define class and object, explain encapsulation with BankAccount example, and describe inheritance and polymorphism in plain language.`,
  },
  {
    id: "tech018",
    title: "Software Development Lifecycle",
    summary: "Requirements, design, implementation, testing, deployment, maintenance.",
    difficulty: "Hard",
    estimatedMinutes: 40,
    tags: "software-engineering|sdlc|process",
    content: `Building reliable software follows a **lifecycle**.

**Phases:**
1. **Requirements** — what users need (functional/non-functional)
2. **Design** — architecture, UI mockups, data models
3. **Implementation** — coding following standards
4. **Testing** — unit, integration, user acceptance; find defects early
5. **Deployment** — release to production environment
6. **Maintenance** — fixes, updates, security patches

**Methodologies:**
- **Waterfall** — sequential phases
- **Agile/Scrum** — iterative sprints, frequent feedback

**Roles:** developer, tester, product owner, DevOps (automation/deployment).

**Documentation:** README, API docs, changelogs aid maintainability.`,
    answerGuide: `Regression testing after changes. CI/CD automates build/test/deploy. Technical debt from rushed design.`,
    answer: `Students should list lifecycle phases in order, contrast waterfall vs agile briefly, and explain why testing before release reduces user-facing bugs.`,
  },
  {
    id: "tech019",
    title: "Cloud Computing Basics",
    summary: "IaaS, PaaS, SaaS, virtualization, and scaling on demand.",
    difficulty: "Hard",
    estimatedMinutes: 35,
    tags: "cloud|infrastructure|saas",
    content: `**Cloud computing** delivers IT resources over the network on demand.

**Service models:**
- **IaaS** — rent VMs, storage, networks (you manage OS/apps)
- **PaaS** — platform runs your apps (managed runtime, databases)
- **SaaS** — ready applications (email, LMS) via browser

**Benefits:** Elastic scaling, pay-as-you-go, geographic redundancy.

**Virtualization:** Hypervisors share physical servers among many virtual machines.

**Containers** (Docker) package apps slimmer than full VMs.

**Considerations:** Data location, vendor lock-in, outage dependency, shared responsibility security model (provider secures cloud; customer secures configurations).`,
    answerGuide: `Major providers: AWS, Azure, GCP — names only. On-prem vs hybrid cloud. Latency to nearest region matters.`,
    answer: `Students should define IaaS, PaaS, SaaS with examples, explain virtualization benefit, and name two cloud tradeoffs (cost flexibility vs dependency).`,
  },
  {
    id: "tech020",
    title: "Computational Complexity (Intro)",
    summary: "Why some problems scale poorly and big-O notation at a beginner level.",
    difficulty: "Hard",
    estimatedMinutes: 45,
    tags: "algorithms|complexity|big-o",
    content: `As data grows, algorithm choice affects runtime dramatically.

**Big-O notation** describes growth rate upper bound (worst case focus at intro).

**Common classes:**
- **O(1)** — constant time (array index access)
- **O(log n)** — halving searches (binary search)
- **O(n)** — linear scan
- **O(n log n)** — efficient sorts (merge sort)
- **O(n²)** — nested loops on same data (bubble sort naive)

**Tractable vs intractable:** Some problems (traveling salesman exact) explode combinatorially; heuristics approximate solutions.

**Space complexity** — memory usage also matters.

**Practical lesson:** Choose right data structure (hash map speeds lookups).`,
    answerGuide: `Big-O ignores constants. Best/average cases differ. NP-completeness mention only. Empirical timing complements theory.`,
    answer: `Students should explain Big-O as growth rate, rank O(1), O(n), O(n²) with examples, and argue why binary search beats linear search on large sorted lists.`,
  },
];
