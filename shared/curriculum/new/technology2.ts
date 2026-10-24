import { mc, num, short, tf, type CourseSpec } from "../dsl";

const CSTA = "CSTA K–12 Computer Science Standards";

export const technologyCourses2: CourseSpec[] = [
  {
    id: "data-ai",
    title: "Data Science & AI",
    subject: "technology",
    grade: 9,
    gradeMax: 12,
    framework: CSTA,
    description: "Collect, analyze, and visualize data, then explore how machine learning and large language models work — and how to use them responsibly.",
    units: [
      {
        title: "Working with Data",
        description: "Understand data types and how data is collected.",
        lessons: [
          {
            title: "Types of Data",
            summary: "Data can be numerical or categorical, and structure determines how we analyze it.",
            objectives: ["Classify variables as numerical or categorical", "Organize data in tidy tables", "Identify the unit of observation"],
            vocab: [["numerical variable", "a measured quantity, like height or price"], ["categorical variable", "a label or group, like color or state"], ["tidy data", "one row per observation, one column per variable"]],
            standards: ["3A-DA-10", "3A-DA-11"],
            body: `
| Type | Examples | Summaries |
|---|---|---|
| **Numerical (continuous)** | height, temperature, time | mean, median, histogram |
| **Numerical (discrete)** | number of siblings, goals | counts, mean |
| **Categorical (nominal)** | eye color, state | counts, bar chart |
| **Categorical (ordinal)** | survey rating: poor/fair/good | counts, median category |

**Tidy data**
| student | grade | hours_sleep | favorite_subject |
|---|---|---|---|
| A | 10 | 7.5 | Biology |
| B | 11 | 6.0 | Math |

- Each **row** is one observation (one student).
- Each **column** is one variable.

**Watch out:** ZIP codes and phone numbers are numbers but **categorical** — averaging ZIP codes is meaningless.

**Structured data** fits in tables; **unstructured data** (text, images, audio) needs extra processing before analysis — and is what most AI works with.`,
            questions: [
              mc("Which variable is categorical?", "Favorite sport", ["Height in cm", "Number of pets", "Time to run a mile"], "It's a label, not a measurement."),
              mc("A survey rating of 'low, medium, high' is…", "ordinal categorical", ["continuous numerical", "nominal categorical", "discrete numerical"], "Categories with a natural order."),
              tf("ZIP codes should be treated as numerical data for averaging.", false, "They're labels, not quantities."),
              mc("In tidy data, each row represents…", "one observation", ["one variable", "one chart", "one file"], "Columns are variables."),
            ],
          },
          {
            title: "Sampling and Bias",
            summary: "How data is collected determines whether conclusions can be trusted.",
            objectives: ["Distinguish populations and samples", "Identify sampling, response, and survivorship bias", "Design a fair sampling method"],
            vocab: [["population", "the entire group you want to learn about"], ["sample", "the subset you actually collect data from"], ["random sample", "every member has an equal chance of being chosen"], ["bias", "a systematic error that skews results"]],
            standards: ["3A-DA-12", "3B-DA-05"],
            body: `
**Population vs. sample:** you want to know about all 1,200 students (population) but survey 100 (sample).

**Random sampling** gives every member an equal chance — the best protection against bias.

**Common biases**
| Bias | Example |
|---|---|
| **Convenience** | surveying only your friends |
| **Voluntary response** | online polls — people with strong opinions respond |
| **Non-response** | busy people skip the survey |
| **Leading questions** | "Don't you agree homework is too long?" |
| **Survivorship** | studying only successful startups |

**Famous failure:** in 1936, *Literary Digest* polled 2.4 million people and predicted Landon would beat Roosevelt. Roosevelt won in a landslide. The sample came from phone books and car registrations — wealthier people during the Depression.

**Bigger isn't better if it's biased.** A random sample of 1,000 beats a biased sample of millions.`,
            questions: [
              mc("A website asks visitors to vote in a poll. This is an example of…", "voluntary response bias", ["random sampling", "a census", "tidy data"], "Only motivated people respond."),
              mc("Which is the best way to survey a school's opinion about lunch?", "Randomly select students from the full roster", ["Ask everyone in the cafeteria line", "Ask your friends", "Post a poll on social media"], "Random selection from the whole population."),
              tf("A larger sample always gives more accurate results, even if it's biased.", false, "Bias doesn't shrink with size."),
              mc("Studying only companies that succeeded ignores those that failed. This is…", "survivorship bias", ["non-response bias", "random sampling", "a leading question"], "The failures are invisible."),
            ],
          },
        ],
      },
      {
        title: "Analysis and Visualization",
        description: "Summarize data and communicate findings visually.",
        lessons: [
          {
            title: "Summary Statistics",
            summary: "Mean, median, standard deviation, and quartiles summarize the center and spread of data.",
            objectives: ["Calculate and interpret mean, median, and IQR", "Interpret standard deviation", "Detect outliers with the 1.5 × IQR rule"],
            vocab: [["standard deviation", "typical distance of values from the mean"], ["interquartile range (IQR)", "Q3 − Q1"], ["outlier", "a value unusually far from the rest"]],
            standards: ["3A-DA-11", "3B-DA-06"],
            body: `
**Data:** daily phone minutes for 9 students
45, 60, 62, 70, 75, 80, 85, 90, 240

- **Mean:** 807 ÷ 9 ≈ **89.7**
- **Median:** **75** (the middle value)
- **Q1** = 61, **Q3** = 87.5 → **IQR** = 26.5

**Outlier rule:** anything above Q3 + 1.5 × IQR = 87.5 + 39.75 = **127.25** is an outlier → 240 is an outlier.

**The median resists outliers;** the mean doesn't. Report the median for skewed data like income or home prices.

**Standard deviation** measures spread: a class whose test scores have SD = 3 is very consistent; SD = 15 means scores vary widely.

**In code (Python):**
\`\`\`python
import statistics as st
data = [45, 60, 62, 70, 75, 80, 85, 90, 240]
st.mean(data), st.median(data), st.stdev(data)
\`\`\``,
            questions: [
              num("Find the median of 12, 3, 9, 15, 7.", 9, "Sorted: 3, 7, 9, 12, 15."),
              num("Q1 = 20 and Q3 = 50. What is the IQR?", 30, "50 − 20."),
              num("Q3 = 50 and IQR = 30. Values above what number are outliers (1.5 × IQR rule)?", 95, "50 + 45 = 95."),
              mc("Which measure of center is best for household income, which has a few billionaires?", "Median", ["Mean", "Maximum", "Range"], "The median isn't pulled by extremes."),
            ],
          },
          {
            title: "Data Visualization",
            summary: "Choose charts that match your question and design them honestly and clearly.",
            objectives: ["Choose appropriate chart types", "Identify misleading visualization techniques", "Design clear, accessible charts"],
            vocab: [["histogram", "shows the distribution of one numerical variable"], ["scatter plot", "shows the relationship between two numerical variables"], ["truncated axis", "an axis that doesn't start at zero, exaggerating differences"]],
            standards: ["3A-DA-11", "3B-DA-06"],
            body: `
**Match the chart to the question**
| Question | Chart |
|---|---|
| Compare categories | bar chart |
| Change over time | line chart |
| Distribution of one variable | histogram, box plot |
| Relationship between two variables | scatter plot |
| Parts of a whole (few parts) | stacked bar (or pie, sparingly) |

**Misleading tricks to spot**
- **Truncated y-axis** on bar charts
- **3D effects** that distort size
- **Cherry-picked time ranges**
- **Dual axes** that imply false relationships
- Areas or icons scaled by height *and* width (doubling looks like quadrupling)

**Design for clarity**
- Clear title stating the takeaway: "Sleep drops sharply after 9th grade"
- Label axes with units
- Remove clutter (gridlines, borders, decorations)
- Use colorblind-safe palettes; don't rely on red vs. green`,
            questions: [
              mc("Which chart best shows the relationship between study time and test score?", "Scatter plot", ["Pie chart", "Bar chart", "Histogram"], "Two numerical variables."),
              mc("Which chart best shows how a city's population changed from 1950 to 2020?", "Line chart", ["Pie chart", "Scatter plot of unrelated cities", "Histogram"], "Line charts show change over time."),
              tf("Starting a bar chart's y-axis at a value above zero can exaggerate differences.", true, "Bars' lengths no longer compare honestly."),
              mc("Which is the best chart title?", "\"Teens sleep 1.5 fewer hours by 12th grade\"", ["\"Chart 1\"", "\"Data\"", "\"Sleep stuff\""], "State the takeaway."),
            ],
          },
        ],
      },
      {
        title: "Relationships in Data",
        description: "Measure associations and build simple predictive models.",
        lessons: [
          {
            title: "Correlation vs. Causation",
            summary: "Two variables can move together without one causing the other.",
            objectives: ["Interpret correlation coefficients", "Identify confounding variables", "Explain why randomized experiments establish causation"],
            vocab: [["correlation", "a measure of how two variables move together"], ["confounding variable", "a hidden factor that affects both variables"], ["randomized controlled trial", "an experiment that randomly assigns treatment to establish cause"]],
            standards: ["3B-DA-05", "3B-DA-07"],
            body: `
**Correlation (r)** ranges from −1 to 1:
- r ≈ 0.9: strong positive
- r ≈ 0: no linear relationship
- r ≈ −0.8: strong negative

**Correlation ≠ causation**
| Correlation | Real explanation |
|---|---|
| Ice cream sales ↔ drownings | hot weather (confounder) |
| Shoe size ↔ reading level in kids | age (confounder) |
| Nicolas Cage films ↔ pool drownings | pure coincidence |

**Spurious correlations** are everywhere in big data: test enough variables and some will correlate by chance.

**How to establish causation:** a **randomized controlled trial** — randomly assign people to treatment and control groups, so confounders balance out. That's how medicines are tested.

**Reverse causation:** do happy people exercise more, or does exercise make people happy? Correlation alone can't tell you.`,
            questions: [
              mc("Which correlation is strongest?", "r = −0.85", ["r = 0.40", "r = 0.10", "r = −0.30"], "Strength is the absolute value."),
              mc("Cities with more firefighters have more fire damage. The likely confounder is…", "city size", ["firefighters cause damage", "fire trucks", "coincidence only"], "Bigger cities have both."),
              tf("A randomized controlled trial can establish cause and effect.", true, "Randomization balances confounders."),
              mc("If r = 0, the two variables…", "have no linear relationship", ["are perfectly related", "cause each other", "are identical"], "There may still be a non-linear pattern."),
            ],
          },
          {
            title: "Linear Regression and Prediction",
            summary: "A regression line models a relationship and makes predictions, with error we can measure.",
            objectives: ["Interpret slope and intercept of a regression line", "Make predictions and calculate residuals", "Explain the danger of extrapolation"],
            vocab: [["regression line", "the line that best fits the data, ŷ = mx + b"], ["residual", "actual value minus predicted value"], ["extrapolation", "predicting outside the range of the data"]],
            standards: ["3B-DA-06", "3B-DA-07"],
            body: `
**Model:** used car price (ŷ, in $) vs. age (x, years)
ŷ = −1,500x + 22,000

- **Slope −1,500:** each year of age is associated with $1,500 less value.
- **Intercept 22,000:** predicted price of a new car.
- **Predict:** a 4-year-old car → −6,000 + 22,000 = **$16,000**

**Residuals:** a 4-year-old car actually sold for $17,200 → residual = 17,200 − 16,000 = **+$1,200** (sold for more than predicted).

**Least squares:** the regression line minimizes the sum of squared residuals.

**R²** tells what fraction of variation the model explains: R² = 0.81 means 81% of price variation is explained by age.

**Extrapolation danger:** at 20 years, the model predicts −$8,000. Cars can't have negative prices — the pattern doesn't hold outside the data.

**This is machine learning's simplest form:** learn a pattern from data, then predict new cases.`,
            questions: [
              num("Using ŷ = −1,500x + 22,000, predict the price of a 6-year-old car.", 13000, "−9,000 + 22,000 = 13,000."),
              num("Predicted $13,000; actual $12,400. What is the residual?", -600, "12,400 − 13,000 = −600."),
              mc("R² = 0.64 means…", "64% of the variation is explained by the model", ["the model is 64% accurate on every prediction", "the slope is 0.64", "64% of the data is wrong"], "R² measures explained variation."),
              tf("A regression model is reliable for predictions far outside the range of its data.", false, "Extrapolation can give nonsense."),
            ],
          },
        ],
      },
      {
        title: "Machine Learning",
        description: "Explore how computers learn patterns from data.",
        lessons: [
          {
            title: "What Is Machine Learning?",
            summary: "Machine learning systems learn patterns from examples instead of following hand-written rules.",
            objectives: ["Distinguish rule-based programs from machine learning", "Compare supervised and unsupervised learning", "Explain training and testing data"],
            vocab: [["machine learning", "algorithms that improve by learning patterns from data"], ["training data", "examples a model learns from"], ["test data", "new examples used to measure performance"], ["overfitting", "memorizing training data instead of learning general patterns"]],
            standards: ["3B-AP-08", "3A-IC-24"],
            body: `
**Traditional programming:** rules + data → answers
**Machine learning:** data + answers → rules (a model)

**Spam filter example:** instead of writing thousands of rules, show the model 100,000 emails labeled "spam" or "not spam." It learns which patterns predict spam.

**Types**
| Type | Data | Example |
|---|---|---|
| **Supervised** | labeled examples | spam detection, house prices |
| **Unsupervised** | no labels; find structure | grouping customers by behavior |
| **Reinforcement** | rewards for actions | game-playing agents, robot walking |

**Train/test split:** train on 80% of the data, test on the 20% the model has never seen.

**Overfitting:** a model that scores 100% on training data but 60% on test data memorized instead of learning — like a student who memorizes practice answers but can't solve new problems.

**ML is everywhere:** recommendations, voice assistants, photo tagging, fraud detection, medical imaging.`,
            questions: [
              mc("A model learns to identify cats from 50,000 photos labeled 'cat' or 'not cat.' This is…", "supervised learning", ["unsupervised learning", "reinforcement learning", "rule-based programming"], "The examples are labeled."),
              mc("Why do we keep test data separate from training data?", "To measure how well the model handles new examples", ["To make training faster", "To hide data from users", "To save storage"], "Testing on seen data overestimates accuracy."),
              tf("A model with 99% training accuracy and 55% test accuracy is probably overfitting.", true, "It memorized rather than generalized."),
              mc("A game-playing AI learns by earning points for good moves. This is…", "reinforcement learning", ["supervised learning", "unsupervised learning", "data cleaning"], "It learns from rewards."),
            ],
          },
          {
            title: "Classification and Decision Trees",
            summary: "Decision trees classify data by asking a series of yes/no questions learned from examples.",
            objectives: ["Trace a decision tree to classify an example", "Build a simple tree from data", "Evaluate a classifier with accuracy and a confusion matrix"],
            vocab: [["classifier", "a model that assigns categories"], ["decision tree", "a flowchart-like model of yes/no questions"], ["confusion matrix", "a table of correct and incorrect predictions by category"], ["false positive", "predicting yes when the answer is no"]],
            standards: ["3B-AP-08", "3B-DA-07"],
            body: `
**Will a student finish the assignment on time?**
\`\`\`
Started at least 2 days early?
├── yes → ON TIME
└── no → Has more than 3 other assignments?
         ├── yes → LATE
         └── no → ON TIME
\`\`\`
The algorithm picks the question that **best splits** the data at each step.

**Evaluating a classifier — medical test for a disease (100 people)**
| | Actually sick | Actually healthy |
|---|---|---|
| Test positive | 8 (true +) | 9 (**false +**) |
| Test negative | 2 (**false −**) | 81 (true −) |

- **Accuracy** = (8 + 81)/100 = **89%**
- **False negatives** (2) are dangerous: sick people sent home.
- **False positives** (9) cause worry and extra tests.

**Accuracy can mislead:** if only 1% of emails are fraud, a model that always says "not fraud" is 99% accurate — and useless.`,
            questions: [
              mc("Using the tree: a student started 1 day early and has 2 other assignments. Prediction?", "On time", ["Late", "Can't tell", "Both"], "No → not more than 3 → on time."),
              num("Using the confusion matrix, how many total errors (false positives + false negatives) are there?", 11, "9 + 2 = 11."),
              mc("For a cancer screening test, which error is usually most dangerous?", "False negative", ["False positive", "True positive", "True negative"], "A sick person is told they're healthy."),
              tf("A model that's 99% accurate is always useful.", false, "With rare events, always guessing the common class gets high accuracy."),
            ],
          },
        ],
      },
      {
        title: "AI and Society",
        description: "Examine bias, fairness, and privacy in AI systems.",
        lessons: [
          {
            title: "Bias and Fairness in AI",
            summary: "AI systems can reproduce and amplify biases in their training data.",
            objectives: ["Explain how bias enters AI systems", "Analyze real cases of algorithmic bias", "Propose ways to reduce bias"],
            vocab: [["algorithmic bias", "systematic unfair outcomes from an algorithm"], ["representative data", "data that reflects the full population the system will serve"], ["audit", "a systematic check of a system's outcomes across groups"]],
            standards: ["3A-IC-24", "3B-IC-25"],
            body: `
**AI learns from data — including its flaws.**

**How bias enters**
1. **Historical bias:** past decisions were unfair, and the model copies them.
2. **Representation bias:** some groups are missing from training data.
3. **Measurement bias:** the thing measured is a poor proxy for what matters.

**Real cases**
- A tech company's experimental hiring tool, trained on 10 years of mostly male résumés, learned to penalize the word "women's." It was scrapped.
- A 2018 MIT study found commercial facial-analysis systems had error rates under 1% for lighter-skinned men but up to 35% for darker-skinned women.
- A widely used health algorithm used past **spending** as a proxy for health **need**, underestimating the needs of patients who had less access to care.

**Reducing bias**
- Collect representative data
- **Audit** outcomes across groups before and after deployment
- Include diverse people on design teams
- Keep humans in the loop for high-stakes decisions
- Be transparent about how decisions are made`,
            questions: [
              mc("A face-recognition model trained mostly on one group performs poorly on others. This is…", "representation bias", ["overfitting to noise", "data compression", "reinforcement learning"], "Some groups were underrepresented."),
              mc("Why did the hiring tool penalize résumés mentioning 'women's'?", "It learned from historically male-dominated hiring data", ["Programmers wrote that rule", "It was a random glitch", "Women submitted fewer résumés that year"], "Historical bias in the training data."),
              tf("Auditing an AI system's results across demographic groups can reveal bias.", true, "Compare error rates and outcomes by group."),
              mc("Using healthcare spending to estimate health need is an example of…", "measurement bias from a poor proxy", ["representative data", "a fair algorithm", "unsupervised learning"], "Spending reflects access, not just need."),
            ],
            writtenPrompt: "Choose an AI system that makes decisions about people (loan approval, school admissions, job screening). Describe one way bias could enter it and two safeguards you would require.",
            rubric: "Identifies a specific system (2) · Explains a plausible source of bias (4) · Proposes two concrete safeguards (4)",
          },
          {
            title: "Data Privacy",
            summary: "Personal data powers AI and apps; laws and design choices protect privacy.",
            objectives: ["Explain how personal data is collected and combined", "Describe privacy laws like COPPA, FERPA, and GDPR", "Evaluate privacy trade-offs"],
            vocab: [["personally identifiable information (PII)", "data that can identify a specific person"], ["anonymization", "removing identifying details from data"], ["re-identification", "matching anonymous data back to individuals"]],
            standards: ["3A-IC-29", "3B-IC-26"],
            body: `
**How data is collected:** apps, websites, location services, smart devices, loyalty cards, data brokers that buy and sell profiles.

**Combining data reveals more:** your location history alone can reveal where you live, work, worship, and see a doctor.

**Anonymization isn't foolproof.** Researcher Latanya Sweeney showed that **87%** of Americans can be uniquely identified by just ZIP code, birth date, and sex.

**Privacy laws**
| Law | Protects |
|---|---|
| COPPA (U.S.) | children under 13 online |
| FERPA (U.S.) | student education records |
| HIPAA (U.S.) | health information |
| GDPR (EU) | broad rights: access, deletion, consent |

**Privacy by design:** collect only what you need, store it securely, delete it when done, and be transparent.

**Your choices:** review app permissions, use privacy settings, think about what you share with AI chatbots — many store conversations.`,
            questions: [
              num("According to Sweeney's research, about what percent of Americans can be identified by ZIP code, birth date, and sex?", 87, "Just three data points.", { tolerance: 2 }),
              mc("Which U.S. law protects student education records?", "FERPA", ["COPPA", "HIPAA", "GDPR"], "Family Educational Rights and Privacy Act."),
              tf("Removing names from a data set always makes it impossible to identify people.", false, "Combinations of other fields can re-identify people."),
              mc("'Collect only the data you need' is a principle of…", "privacy by design", ["overfitting", "data visualization", "regression"], "Minimize data collection."),
            ],
          },
        ],
      },
      {
        title: "Generative AI",
        description: "Understand how large language models work and how to use them responsibly.",
        lessons: [
          {
            title: "How Large Language Models Work",
            summary: "LLMs predict the next token based on patterns learned from huge amounts of text.",
            objectives: ["Explain next-token prediction", "Describe training at a high level", "Explain why LLMs can produce confident errors"],
            vocab: [["large language model (LLM)", "an AI model trained on vast text to generate language"], ["token", "a chunk of text, roughly a word or word piece"], ["hallucination", "a confident but false statement generated by an AI"], ["context window", "how much text a model can consider at once"]],
            standards: ["3B-AP-08", "3A-IC-24"],
            body: `
**The core idea: predict the next token.**
"The capital of France is ___" → "Paris" is the most likely continuation.

**Tokens:** text is split into pieces. "unbelievable" might be "un" + "believ" + "able."

**Training (simplified)**
1. **Pre-training:** the model reads enormous amounts of text and adjusts billions of internal numbers (parameters) to get better at predicting the next token.
2. **Fine-tuning:** further training on examples of helpful conversations, plus human feedback about which responses are better.

**Why it seems smart:** predicting text well requires learning grammar, facts, reasoning patterns, and style.

**Why it makes mistakes**
- It generates **plausible** text, which isn't always **true** — "hallucinations" like fake citations.
- Its knowledge has a **cutoff date**.
- It can reflect biases in its training text.

**Context window:** the model only "sees" a limited amount of the conversation at once.

**Takeaway:** treat LLM output like a knowledgeable but fallible collaborator — verify important facts.`,
            questions: [
              mc("At its core, an LLM generates text by…", "predicting the next token", ["searching a database of answers", "copying web pages", "running a calculator"], "It predicts likely continuations."),
              mc("An AI invents a book citation that doesn't exist. This is called…", "a hallucination", ["overfitting", "compression", "a firewall"], "Plausible-sounding but false output."),
              tf("An LLM's answers are always factually correct because it was trained on lots of text.", false, "Plausible ≠ true; verify."),
              mc("What is a token?", "A chunk of text, roughly a word or part of a word", ["A password", "A type of coin", "A whole document"], "Models process text as tokens."),
            ],
          },
          {
            title: "Using AI Responsibly",
            summary: "Use AI tools to learn and create while being honest, verifying output, and protecting privacy.",
            objectives: ["Distinguish helpful from harmful uses of AI in learning", "Verify AI output and cite AI use", "Evaluate societal impacts of AI"],
            vocab: [["academic integrity", "honesty in schoolwork"], ["deepfake", "AI-generated media that falsely depicts real people"], ["human in the loop", "a person reviews or approves AI decisions"]],
            standards: ["3A-IC-24", "3A-IC-25", "3B-IC-25"],
            body: `
**AI as a learning tool**
| Helpful | Harmful |
|---|---|
| Explaining a concept a new way | Submitting AI writing as your own |
| Quizzing you before a test | Skipping the thinking you need to learn |
| Feedback on a draft you wrote | Trusting answers without checking |
| Brainstorming ideas | Sharing private information |

**Good habits**
1. **Follow the rules** your teacher or family sets for AI use.
2. **Verify** facts with reliable sources.
3. **Cite** AI use: "I used an AI assistant to brainstorm topics."
4. **Protect privacy:** don't paste personal or others' private information.
5. **Do the thinking:** if AI does the hard part, you don't build the skill.

**Bigger questions for society**
- **Jobs:** AI automates some tasks and creates new roles.
- **Deepfakes and misinformation:** fake audio and video of real people.
- **Energy use** of large data centers.
- **Copyright** of training data and AI-generated work.
- **High-stakes decisions** need a **human in the loop**.`,
            questions: [
              mc("Which is a responsible use of AI for schoolwork?", "Asking it to quiz you on material you studied", ["Submitting its essay as your own", "Copying its math answers without understanding", "Sharing a friend's private messages with it"], "Using it to strengthen your own learning."),
              mc("What should you do with a surprising fact an AI tells you?", "Verify it with a reliable source", ["Repeat it immediately", "Assume it's true", "Ignore all AI forever"], "AI can be confidently wrong."),
              tf("A deepfake is AI-generated media that falsely shows a real person saying or doing something.", true, "Deepfakes can spread misinformation."),
              mc("Why keep a 'human in the loop' for decisions like medical diagnoses?", "People can catch AI errors and take responsibility", ["Humans are faster than computers", "AI can't process images", "It's cheaper"], "High stakes need human judgment."),
            ],
            writtenPrompt: "Write a personal AI-use policy for your schoolwork: three things you will use AI for, two things you won't, and how you'll verify and cite its help.",
            rubric: "Three appropriate uses (3) · Two clear limits with reasons (3) · Verification plan (2) · Citation plan (2)",
          },
        ],
      },
    ],
  },
  {
    id: "dl-68",
    title: "Digital Literacy",
    subject: "technology",
    grade: 6,
    gradeMax: 8,
    framework: "ISTE Standards for Students",
    description: "Search smarter, spot misinformation, master productivity tools, and build a positive digital life.",
    units: [
      {
        title: "Finding Information",
        description: "Search effectively and judge whether sources are trustworthy.",
        lessons: [
          {
            title: "Search Strategies",
            summary: "Use keywords, operators, and filters to find better information faster.",
            objectives: ["Choose effective keywords", "Use search operators", "Evaluate search results before clicking"],
            vocab: [["keyword", "an important word that describes what you're looking for"], ["search operator", "a symbol or word that refines a search, like quotes or site:"], ["sponsored result", "a paid advertisement in search results"]],
            standards: ["ISTE 3a", "ISTE 3b"],
            body: `
**Use keywords, not questions.** Instead of "what do frogs eat in the winter time," try **frog winter diet hibernation**.

**Search operators**
| Operator | Example | Effect |
|---|---|---|
| " " | "water cycle" | exact phrase |
| - | jaguar -car | exclude a word |
| site: | climate site:nasa.gov | only one website |
| site:.gov / .edu | vaccines site:.gov | only government or school sites |
| filetype: | robotics filetype:pdf | only PDFs |

**Read before you click**
- Skip **"Sponsored"** results unless you want ads.
- Check the **URL**: is it a known organization?
- Read the **snippet**: does it answer your question?

**Refine:** if results aren't helpful, change keywords, add details, or use synonyms.`,
            questions: [
              mc("Which search finds the exact phrase 'solar eclipse 2024'?", "\"solar eclipse 2024\"", ["solar-eclipse-2024", "site:solar eclipse", "solar eclipse -2024"], "Quotes match exact phrases."),
              mc("Which search shows only results from NASA's website?", "mars site:nasa.gov", ["mars nasa", "\"mars\" -nasa", "mars filetype:nasa"], "site: limits to one domain."),
              tf("Sponsored results at the top of a search page are paid ads.", true, "Companies pay to appear there."),
              mc("Which is the best search for information about bees and pollination?", "bees pollination crops", ["can you tell me about how bees do the thing with flowers", "bees?", "stuff about bugs"], "Use specific keywords."),
            ],
          },
          {
            title: "Evaluating Sources",
            summary: "Use lateral reading and the SIFT method to check whether a source is reliable.",
            objectives: ["Apply the SIFT method", "Use lateral reading to check a source", "Distinguish primary and secondary sources"],
            vocab: [["lateral reading", "leaving a site to see what other sources say about it"], ["primary source", "a firsthand account or original data"], ["credibility", "how trustworthy a source is"]],
            standards: ["ISTE 3b"],
            body: `
**SIFT method**
1. **S**top — don't share or believe right away.
2. **I**nvestigate the source — who made it? What's their expertise or agenda?
3. **F**ind better coverage — do trusted sources report the same thing?
4. **T**race claims to the original — find the original study, quote, or photo.

**Lateral reading:** professional fact-checkers don't study a website's "About" page for long — they **open new tabs** and search what others say about the site.

**Questions to ask**
- Who is the author, and are they qualified?
- When was it published or updated?
- Does it cite sources?
- Is it trying to sell something or persuade?

**Primary vs. secondary**
- Primary: original diary, data set, photo, interview
- Secondary: a textbook or article explaining primary sources`,
            questions: [
              mc("What does lateral reading mean?", "Opening new tabs to see what others say about a source", ["Reading a page side to side", "Reading only headlines", "Reading the About page carefully"], "Fact-checkers leave the site to check it."),
              mc("In SIFT, what does the T stand for?", "Trace claims to the original", ["Trust the website", "Type a search", "Tell a friend"], "Find the original source."),
              mc("Which is a primary source?", "A soldier's letter written during World War II", ["A textbook chapter about World War II", "An encyclopedia article", "A documentary review"], "Firsthand account."),
              tf("A website that looks professional is always reliable.", false, "Anyone can make a polished site; check its reputation."),
            ],
          },
        ],
      },
      {
        title: "Misinformation",
        description: "Recognize false and manipulated content.",
        lessons: [
          {
            title: "Spotting Misinformation",
            summary: "False information spreads fast; recognize emotional manipulation and verify before sharing.",
            objectives: ["Distinguish misinformation, disinformation, and satire", "Recognize manipulation techniques", "Verify claims before sharing"],
            vocab: [["misinformation", "false information shared without intent to deceive"], ["disinformation", "false information spread on purpose"], ["clickbait", "headlines designed to get clicks rather than inform"]],
            standards: ["ISTE 3b", "ISTE 2b"],
            body: `
**Types**
- **Misinformation:** false, but the sharer believes it
- **Disinformation:** false and spread **deliberately**
- **Satire:** jokes that look like news (can be mistaken for real)

**Why false news spreads:** an MIT study of Twitter found false stories spread **six times faster** than true ones — they're often more surprising and emotional.

**Red flags**
- Strong emotion: outrage, fear, "you won't believe…"
- ALL CAPS and lots of exclamation points!!!
- No author, date, or sources
- Too good (or bad) to be true
- "Share before they delete this!"

**Before sharing**
1. Pause — notice your emotions.
2. Search the claim + "fact check."
3. Check fact-checking sites (Snopes, PolitiFact, AP Fact Check).
4. If unsure, **don't share**.`,
            questions: [
              mc("False information spread deliberately to deceive is…", "disinformation", ["misinformation", "satire", "a primary source"], "Dis- means intentional."),
              mc("Which headline is most likely clickbait?", "\"You WON'T BELIEVE what this kid found!!!\"", ["\"City council approves new park budget\"", "\"Study finds link between sleep and grades\"", "\"Weather: rain expected Tuesday\""], "Emotional, vague, all caps."),
              tf("False news stories tend to spread faster than true ones on social media.", true, "They're often more surprising."),
              mc("What should you do if you're unsure whether a post is true?", "Don't share it until you verify", ["Share it with a warning", "Share it quickly", "Change a few words and share"], "When in doubt, don't spread it."),
            ],
          },
          {
            title: "Manipulated Images and Deepfakes",
            summary: "Photos and videos can be edited or generated by AI; learn tools to check them.",
            objectives: ["Identify signs of edited or AI-generated media", "Use reverse image search", "Explain the harms of deepfakes"],
            vocab: [["reverse image search", "searching with an image to find where else it appears"], ["deepfake", "AI-generated video or audio that imitates a real person"], ["out of context", "a real image presented with a false story"]],
            standards: ["ISTE 3b", "ISTE 2b"],
            body: `
**Ways images mislead**
1. **Out of context:** a real photo from a different event or year
2. **Edited:** objects added, removed, or changed
3. **AI-generated:** completely synthetic images and video

**Clues of AI-generated images** (getting harder to spot!)
- Odd hands, fingers, or teeth
- Garbled text on signs
- Strange backgrounds, mismatched earrings, melting objects
- Too-perfect skin and lighting

**Tools**
- **Reverse image search** (Google Lens, TinEye): find the image's original source and date
- Check whether trusted news outlets report the same event
- Look for content credentials or watermarks

**Deepfake harms:** fake videos of politicians, scams using a cloned voice of a family member, bullying. Set a **family code word** to verify emergency calls.

**Most common case:** a real photo with a false caption — reverse image search catches it fast.`,
            questions: [
              mc("What does a reverse image search help you find?", "Where an image appeared before and its original source", ["Who is looking at your photos", "A higher-resolution camera", "Your location"], "It traces an image's history."),
              mc("A real photo of a 2015 flood is shared as 'today's storm.' This is…", "out of context", ["a deepfake", "AI-generated", "satire"], "Real image, false story."),
              tf("Garbled text on signs can be a clue that an image is AI-generated.", true, "AI often struggles with text."),
              mc("How can a family protect against voice-cloning scams?", "Agree on a secret code word", ["Never answer the phone", "Share passwords by voice", "Post more videos"], "A code word verifies identity."),
            ],
          },
        ],
      },
      {
        title: "Productivity Tools",
        description: "Use spreadsheets, documents, and presentations effectively.",
        lessons: [
          {
            title: "Spreadsheet Skills",
            summary: "Spreadsheets organize data and calculate with formulas that update automatically.",
            objectives: ["Enter data and use cell references", "Write formulas with SUM, AVERAGE, MAX, and MIN", "Create a chart from data"],
            vocab: [["cell", "a box where a row and column meet, like B3"], ["formula", "a calculation that starts with ="], ["function", "a built-in formula like SUM or AVERAGE"]],
            standards: ["ISTE 5b", "ISTE 6a"],
            body: `
**Cells** are named by column letter and row number: **B3**.

**Budget for a class party**
| | A | B | C | D |
|---|---|---|---|---|
| 1 | Item | Price | Qty | Total |
| 2 | Pizza | 12 | 4 | =B2*C2 |
| 3 | Drinks | 1.5 | 20 | =B3*C3 |
| 4 | Plates | 5 | 2 | =B4*C4 |
| 5 | | | | =SUM(D2:D4) |

D2 = 48, D3 = 30, D4 = 10, **D5 = 88**

**Common functions**
- \`=SUM(D2:D4)\` total
- \`=AVERAGE(B2:B10)\`
- \`=MAX()\`, \`=MIN()\`, \`=COUNT()\`

**The magic:** change pizza Qty to 5, and every total updates automatically.

**Charts:** select your data → Insert → Chart. Choose bar for categories, line for change over time.

**Tip:** sort and filter to answer questions like "which item costs the most?"`,
            questions: [
              num("Using the budget, if pizza quantity changes to 5, what is D2?", 60, "12 × 5 = 60."),
              mc("Every spreadsheet formula starts with…", "=", ["+", "#", "@"], "The equals sign tells the spreadsheet to calculate."),
              mc("Which formula averages cells A1 through A10?", "=AVERAGE(A1:A10)", ["=SUM(A1-A10)", "=MEAN A1 to A10", "AVERAGE(A1,A10)"], "Use a colon for a range."),
              num("Cells A1:A4 contain 5, 10, 15, 20. What does =SUM(A1:A4) return?", 50, "5 + 10 + 15 + 20."),
            ],
          },
          {
            title: "Documents and Presentations",
            summary: "Create clear documents and presentations with good structure and design.",
            objectives: ["Use headings and styles in documents", "Design readable slides", "Collaborate with comments and version history"],
            vocab: [["heading style", "formatting that marks section titles and builds a table of contents"], ["version history", "a record of past versions of a shared document"], ["slide deck", "a set of presentation slides"]],
            standards: ["ISTE 6a", "ISTE 6d", "ISTE 7b"],
            body: `
**Documents**
- Use **heading styles** (Heading 1, Heading 2) — not just big bold text. They build a clickable table of contents and help screen readers.
- Keep paragraphs short; use bullet lists for steps.
- **Cite sources** at the end.

**Presentations: less is more**
- **One idea per slide**
- **6 words or fewer** per line, few bullets
- Big, high-contrast text (24 pt+)
- Images that support your point (with credit)
- Don't read your slides — talk to your audience

**The 10-20-30 guideline** (for pitches): 10 slides, 20 minutes, 30-point font.

**Collaboration**
- **Comments** for suggestions instead of changing a partner's work
- **Suggesting mode** to propose edits
- **Version history** to restore earlier drafts
- Share with **view**, **comment**, or **edit** permissions as needed`,
            questions: [
              mc("Why use heading styles instead of just bold, large text?", "They create structure, a table of contents, and help screen readers", ["They use less ink", "They're required by law", "They change the font color"], "Styles carry meaning, not just looks."),
              mc("Which slide follows good design?", "One big image and a five-word headline", ["Ten bullet points in 12-point font", "A full paragraph to read aloud", "Yellow text on white"], "One idea, readable text."),
              tf("Version history lets you restore an earlier draft of a shared document.", true, "Mistakes can be undone."),
              mc("To suggest a change without editing a partner's text directly, use…", "comments or suggesting mode", ["delete and retype", "a new document", "all caps"], "Respectful collaboration."),
            ],
          },
        ],
      },
      {
        title: "Digital Wellbeing",
        description: "Manage your digital footprint and handle conflict online.",
        lessons: [
          {
            title: "Your Digital Footprint and Reputation",
            summary: "What you post builds an online reputation that colleges, employers, and others may see.",
            objectives: ["Audit your digital footprint", "Distinguish active and passive footprints", "Build a positive online presence"],
            vocab: [["active footprint", "information you deliberately share"], ["passive footprint", "data collected without you actively sharing it"], ["online reputation", "how others see you based on your digital presence"]],
            standards: ["ISTE 2a", "ISTE 2d"],
            body: `
**Active footprint:** posts, comments, photos, profiles you create.
**Passive footprint:** cookies, location data, search history, what others post about you.

**Who looks?** Surveys show many college admissions officers and most employers check applicants' social media.

**The "front page" test:** would you be OK with this on a billboard with your name on it?

**Audit yourself**
1. Search your name in quotes.
2. Check privacy settings on every account.
3. Delete old posts you're not proud of.
4. Ask friends to remove photos you don't want shared.

**Build a positive footprint**
- Share projects, art, or volunteering
- Write thoughtful comments
- Create a simple portfolio site (great for homeschool records too!)

**Screenshots last forever** — even "disappearing" messages can be saved.`,
            questions: [
              mc("Which is part of your passive digital footprint?", "Location data collected by an app", ["A photo you posted", "A comment you wrote", "Your profile bio"], "Collected without you actively sharing."),
              mc("What is the first step in auditing your digital footprint?", "Search your name online", ["Delete all accounts", "Post more selfies", "Change your name"], "See what others can find."),
              tf("Disappearing messages can never be saved by others.", false, "Screenshots can capture them."),
              mc("Which builds a positive digital footprint?", "Sharing a science fair project", ["Posting an angry rant", "Sharing a friend's secret", "Posting your address"], "Show your skills and interests."),
            ],
          },
          {
            title: "Cyberbullying and Healthy Online Communities",
            summary: "Recognize cyberbullying, respond safely, and be an upstander.",
            objectives: ["Identify forms of cyberbullying", "Use stop–save–block–tell to respond", "Act as an upstander"],
            vocab: [["cyberbullying", "using technology to repeatedly harass or hurt someone"], ["upstander", "someone who takes action to help a person being bullied"], ["bystander", "someone who sees bullying but doesn't act"]],
            standards: ["ISTE 2b", "ISTE 2c"],
            body: `
**Cyberbullying** includes mean messages, rumors, embarrassing photos, impersonation, and deliberately excluding someone from group chats.

**Why it's hard:** it can happen 24/7, reach many people, and feel anonymous.

**If it happens to you: Stop, Save, Block, Tell**
1. **Stop** — don't respond or retaliate.
2. **Save** — screenshot the evidence.
3. **Block** — block and report the person on the platform.
4. **Tell** — a parent, teacher, or trusted adult.

**Be an upstander, not a bystander**
- Don't like, share, or forward hurtful content.
- Send a private, supportive message to the target.
- Report the content.
- Tell a trusted adult.

**Healthy habits:** take breaks, turn off notifications at night, notice how apps make you feel, and remember people's real feelings are behind every screen.

If someone is in danger, contact an adult immediately (or call/text 988 for crisis support in the U.S.).`,
            questions: [
              mc("What is the first thing to do if you're cyberbullied?", "Stop — don't respond", ["Post something mean back", "Delete all the evidence", "Keep it secret"], "Responding can make it worse."),
              mc("Why should you save evidence?", "Adults and platforms may need it to take action", ["To post it later", "To show it to everyone", "It isn't important"], "Screenshots document what happened."),
              mc("Which action makes you an upstander?", "Sending the target a supportive message and reporting the post", ["Liking the hurtful post", "Forwarding it to friends", "Ignoring it completely"], "Upstanders take positive action."),
              tf("Excluding someone from a group chat on purpose can be a form of cyberbullying.", true, "Deliberate exclusion hurts."),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cyber",
    title: "Cybersecurity",
    subject: "technology",
    grade: 9,
    gradeMax: 12,
    framework: CSTA,
    description: "Protect systems and data: threats, authentication, cryptography, network defense, social engineering, incident response, and the ethics and law of security.",
    units: [
      {
        title: "Security Foundations",
        description: "Learn the goals of security and the threats it defends against.",
        lessons: [
          {
            title: "The CIA Triad",
            summary: "Security protects confidentiality, integrity, and availability of information.",
            objectives: ["Define confidentiality, integrity, and availability", "Classify attacks by which goal they threaten", "Assess risk as likelihood × impact"],
            vocab: [["confidentiality", "only authorized people can access information"], ["integrity", "information is accurate and unaltered"], ["availability", "systems and data are accessible when needed"], ["risk", "likelihood of a threat × its impact"]],
            standards: ["3A-NI-05", "3B-NI-04"],
            body: `
| Goal | Meaning | Attack example | Defense |
|---|---|---|---|
| **Confidentiality** | keep secrets secret | stolen passwords, data breach | encryption, access control |
| **Integrity** | data is correct | changed grades, tampered files | hashing, digital signatures, logs |
| **Availability** | it works when needed | ransomware, DDoS attack | backups, redundancy |

**Risk = likelihood × impact.** A likely but low-impact threat (spam) may matter less than an unlikely but catastrophic one (ransomware on a hospital).

**Defense in depth:** layers of security, so if one fails, others still protect — like a castle with a moat, walls, and guards.

**Least privilege:** give each person only the access they need. A student account shouldn't be able to change grades.

**Trade-offs:** more security can mean less convenience. Good design balances both.`,
            questions: [
              mc("A hacker changes a student's grade in the database. Which goal is violated?", "Integrity", ["Confidentiality", "Availability", "None"], "The data was altered."),
              mc("A website is knocked offline by flooding it with traffic. Which goal is violated?", "Availability", ["Integrity", "Confidentiality", "Authentication"], "Users can't access it."),
              tf("Least privilege means giving users only the access they need.", true, "It limits damage from mistakes or compromised accounts."),
              mc("Using multiple layers of security is called…", "defense in depth", ["single sign-on", "least privilege", "phishing"], "Layers back each other up."),
            ],
          },
          {
            title: "Threats and Vulnerabilities",
            summary: "Attackers exploit vulnerabilities; understanding threats helps prioritize defenses.",
            objectives: ["Distinguish threats, vulnerabilities, and exploits", "Describe common attack types", "Explain the importance of patching"],
            vocab: [["vulnerability", "a weakness that can be exploited"], ["exploit", "code or a technique that takes advantage of a vulnerability"], ["zero-day", "a vulnerability unknown to the vendor with no patch yet"], ["DDoS", "distributed denial of service: overwhelming a system with traffic"]],
            standards: ["3A-NI-06", "3B-NI-04"],
            body: `
- **Threat:** something that could cause harm (a criminal group, a disgruntled insider, a storm)
- **Vulnerability:** a weakness (unpatched software, weak password, unlocked door)
- **Exploit:** the method used to take advantage of a vulnerability

**Common attacks**
| Attack | How it works |
|---|---|
| Malware | malicious software: viruses, worms, ransomware |
| Phishing | deceptive messages trick people |
| Password attacks | guessing, reusing leaked passwords |
| SQL injection | malicious input tricks a database |
| DDoS | botnets flood a server with traffic |
| Man-in-the-middle | intercepting communication on insecure networks |

**Patching matters:** in 2017, the WannaCry ransomware infected over 200,000 computers in 150 countries — including UK hospitals — using a vulnerability Microsoft had patched two months earlier.

**Zero-days** have no patch yet, so layered defenses and monitoring matter.

**Attackers** range from curious individuals to organized criminals and nation-states.`,
            questions: [
              mc("An unpatched web server is an example of a…", "vulnerability", ["threat", "exploit", "patch"], "It's a weakness."),
              mc("WannaCry spread mainly because organizations…", "hadn't installed an available patch", ["used strong passwords", "had backups", "used encryption"], "The patch existed for two months."),
              tf("A zero-day vulnerability already has a patch available.", false, "Zero-day means the vendor has had zero days to fix it."),
              mc("Which attack uses a network of infected computers to flood a server?", "DDoS", ["Phishing", "SQL injection", "Keylogging"], "Distributed denial of service."),
            ],
          },
        ],
      },
      {
        title: "Authentication and Cryptography",
        description: "Verify identity and protect data with cryptography.",
        lessons: [
          {
            title: "Authentication and Password Hashing",
            summary: "Systems verify identity with factors and store passwords as salted hashes, never plain text.",
            objectives: ["Explain authentication factors and MFA", "Describe how hashing protects stored passwords", "Calculate password strength"],
            vocab: [["authentication", "verifying who someone is"], ["hash function", "a one-way function that turns input into a fixed-size fingerprint"], ["salt", "random data added to a password before hashing"], ["brute force", "trying every possible combination"]],
            standards: ["3A-NI-06", "3A-NI-07"],
            body: `
**Authentication factors**
1. Something you **know**: password, PIN
2. Something you **have**: phone, security key
3. Something you **are**: fingerprint, face

**Multifactor authentication (MFA)** combines two or more. Microsoft reports MFA blocks over 99% of automated account attacks.

**Storing passwords safely: hashing**
- A **hash** is one-way: easy to compute, practically impossible to reverse.
- The server stores \`hash(password + salt)\`, not the password.
- At login, it hashes what you typed and compares.
- A **salt** (random value per user) means identical passwords get different hashes, defeating precomputed lookup tables.
- Slow hash algorithms (bcrypt, Argon2) make guessing expensive.

**Password strength:** possible combinations = (character set size)^length
- 8 lowercase letters: 26⁸ ≈ 2 × 10¹¹
- 16 lowercase letters: 26¹⁶ ≈ 4 × 10²² — **length wins**

**Use a password manager** for unique passwords everywhere.`,
            questions: [
              mc("A fingerprint scan is which authentication factor?", "Something you are", ["Something you know", "Something you have", "Somewhere you are"], "Biometrics are inherent."),
              mc("Why do systems store password hashes instead of passwords?", "If the database leaks, the passwords aren't directly exposed", ["Hashes are shorter to type", "It makes login slower for users", "Hashes can be easily reversed"], "Hashing is one-way."),
              num("How many possible 4-digit PINs are there (digits 0–9)?", 10000, "10⁴ = 10,000."),
              tf("A salt makes two users with the same password have different stored hashes.", true, "Each user gets a unique random salt."),
            ],
          },
          {
            title: "Encryption",
            summary: "Encryption scrambles data so only key holders can read it, protecting data at rest and in transit.",
            objectives: ["Encrypt and decrypt with a Caesar cipher", "Compare symmetric and asymmetric encryption", "Explain how key length affects security"],
            vocab: [["plaintext", "readable data before encryption"], ["ciphertext", "scrambled data after encryption"], ["key", "the secret value used to encrypt or decrypt"], ["end-to-end encryption", "only the communicating users can read messages"]],
            standards: ["3A-NI-07", "3B-NI-04"],
            body: `
**Caesar cipher** (shift 3): A→D, B→E, … X→A
\`HELLO\` → \`KHOOR\`
Easy to break: only 25 possible shifts.

**Modern symmetric encryption (AES)**
- Same key encrypts and decrypts
- AES-256 has 2²⁵⁶ possible keys — brute-forcing would take longer than the age of the universe
- Used for encrypting disks, files, Wi-Fi (WPA3)

**Asymmetric encryption (RSA, elliptic curve)**
- Public key encrypts; private key decrypts
- Solves the key-sharing problem
- Slower, so it's used to exchange a symmetric key

**Where encryption protects you**
- **In transit:** HTTPS, messaging apps
- **At rest:** phone storage, encrypted laptops
- **End-to-end:** apps like Signal — even the company can't read your messages

**Every extra bit of key length doubles** the number of possible keys.`,
            questions: [
              short("Encrypt CAT with a Caesar shift of 3.", ["FDW"], "C→F, A→D, T→W."),
              short("Decrypt KHOOR with a Caesar shift of 3.", ["HELLO"], "Shift each letter back 3."),
              mc("In symmetric encryption…", "the same key encrypts and decrypts", ["a public key decrypts", "no key is needed", "keys are always 3 letters"], "Both sides share one key."),
              mc("Adding one bit to a key's length…", "doubles the number of possible keys", ["adds one possible key", "halves security", "has no effect"], "Each bit doubles the key space."),
            ],
          },
        ],
      },
      {
        title: "Defending Networks and People",
        description: "Protect networks with firewalls and people from social engineering.",
        lessons: [
          {
            title: "Firewalls and Network Defense",
            summary: "Firewalls, segmentation, and monitoring control and watch network traffic.",
            objectives: ["Explain how firewalls filter traffic", "Describe network segmentation and VPNs", "Identify safe practices on public Wi-Fi"],
            vocab: [["firewall", "a system that allows or blocks traffic based on rules"], ["port", "a numbered endpoint for a network service (443 = HTTPS)"], ["VPN", "an encrypted tunnel for network traffic"], ["intrusion detection system", "monitors for suspicious activity"]],
            standards: ["3A-NI-05", "3B-NI-04"],
            body: `
**Firewalls** filter traffic by rules:
| Rule | Action |
|---|---|
| Allow incoming port 443 (HTTPS) to web server | allow |
| Allow outgoing web browsing | allow |
| Block incoming port 23 (Telnet) | block |
| Default | **deny everything else** |

"Default deny" is safest: only explicitly allowed traffic gets through.

**Common ports:** 22 (SSH), 25 (email), 53 (DNS), 80 (HTTP), 443 (HTTPS)

**Network segmentation:** separate networks for guests, staff, and critical systems — so one compromised device can't reach everything. (Put smart TVs and game consoles on a guest network at home.)

**Intrusion detection** watches logs and traffic for unusual patterns, like logins at 3 a.m. from another country.

**Public Wi-Fi safety**
- Stick to HTTPS sites
- Use a **VPN** on untrusted networks
- Avoid banking on public Wi-Fi
- Turn off automatic connection to open networks`,
            questions: [
              num("Which port does HTTPS use by default?", 443, "HTTP uses 80; HTTPS uses 443."),
              mc("A 'default deny' firewall policy means…", "only explicitly allowed traffic is permitted", ["all traffic is permitted", "the firewall is off", "only email is blocked"], "Everything else is blocked."),
              tf("Putting smart home devices on a separate network limits damage if one is hacked.", true, "That's network segmentation."),
              mc("What does a VPN do?", "Creates an encrypted tunnel for your traffic", ["Speeds up all downloads", "Blocks all ads", "Replaces passwords"], "It protects traffic on untrusted networks."),
            ],
          },
          {
            title: "Social Engineering",
            summary: "Attackers manipulate people's trust, fear, and helpfulness; training and verification defend against it.",
            objectives: ["Identify social engineering techniques", "Recognize psychological triggers attackers use", "Apply verification procedures"],
            vocab: [["social engineering", "manipulating people into revealing information or taking actions"], ["pretexting", "inventing a scenario to gain trust"], ["spear phishing", "targeted phishing using personal details"], ["tailgating", "following an authorized person through a secure door"]],
            standards: ["3A-NI-06", "3B-IC-28"],
            body: `
**Humans are often the weakest link.** Most breaches involve a human element.

**Techniques**
| Technique | Example |
|---|---|
| Phishing | mass email: "Reset your password here" |
| Spear phishing | targeted: "Hi Ms. Lopez, here's the invoice for the robotics club" |
| Vishing | phone call pretending to be IT support |
| Smishing | text: "Your package is delayed, click here" |
| Pretexting | "I'm the new auditor; I need the file" |
| Tailgating | following someone through a badge door |
| Baiting | leaving infected USB drives in a parking lot |

**Psychological triggers:** urgency, authority, fear, curiosity, helpfulness, greed ("You won a prize!").

**Defenses**
- **Verify** through a separate channel: call the known number, not the one in the email.
- Organizations never need your password.
- Hover over links before clicking.
- Report suspicious messages.
- Never plug in unknown USB drives.

**Business email compromise** — fake "CEO" emails requesting urgent wire transfers — costs organizations billions each year.`,
            questions: [
              mc("A caller says they're from IT and need your password to fix your account. This is…", "vishing/pretexting", ["a firewall", "encryption", "a legitimate request"], "IT never needs your password."),
              mc("The best way to verify an urgent email from your 'principal' requesting gift cards is to…", "contact the principal using a known phone number or in person", ["reply to the email", "click the link", "buy the gift cards quickly"], "Use a separate, trusted channel."),
              tf("Spear phishing uses personal details to make messages more convincing.", true, "It's targeted at specific people."),
              mc("Leaving infected USB drives for people to find is called…", "baiting", ["tailgating", "hashing", "segmentation"], "Curiosity is the bait."),
            ],
          },
        ],
      },
      {
        title: "Response and Responsibility",
        description: "Respond to incidents and work within ethical and legal boundaries.",
        lessons: [
          {
            title: "Incident Response",
            summary: "Organizations prepare for, detect, contain, recover from, and learn from security incidents.",
            objectives: ["Describe the phases of incident response", "Explain the role of backups and logs", "Write a basic incident response plan"],
            vocab: [["incident", "an event that compromises security"], ["containment", "limiting the spread and damage of an incident"], ["3-2-1 backup rule", "3 copies, on 2 types of media, 1 offsite"], ["post-incident review", "analysis to learn and improve after an incident"]],
            standards: ["3B-NI-04", "3A-NI-05"],
            body: `
**Incident response phases (based on NIST)**
1. **Preparation:** plans, contacts, backups, training
2. **Detection & analysis:** alerts, logs, user reports — what happened, and how bad is it?
3. **Containment:** disconnect infected machines, disable compromised accounts
4. **Eradication:** remove malware, close the vulnerability
5. **Recovery:** restore from clean backups, monitor closely
6. **Lessons learned:** what went wrong? How do we prevent it next time?

**Scenario:** ransomware encrypts the co-op's shared drive.
- **Contain:** disconnect affected computers from the network.
- **Don't pay** (no guarantee of recovery, and it funds criminals).
- **Recover:** restore from offline backups.
- **Report:** to law enforcement (FBI's IC3 in the U.S.).
- **Learn:** how did it get in? Phishing? Unpatched system?

**Backups: 3-2-1 rule** — and test restoring them! A backup you can't restore isn't a backup.

**Logs** are evidence: they show what happened and when.`,
            questions: [
              mc("What is the first action in the containment phase of a ransomware attack?", "Disconnect affected computers from the network", ["Pay the ransom", "Delete the logs", "Post about it online"], "Stop the spread."),
              num("In the 3-2-1 backup rule, how many copies should be stored offsite?", 1, "3 copies, 2 media, 1 offsite."),
              tf("The 'lessons learned' phase is optional and can be skipped.", false, "It prevents repeat incidents."),
              mc("Why test restoring backups?", "To make sure they actually work when needed", ["To use more storage", "To slow down the system", "It isn't necessary"], "Untested backups may fail."),
            ],
          },
          {
            title: "Ethics, Law, and Careers in Cybersecurity",
            summary: "Security professionals act legally and ethically, with permission, and protect people's privacy.",
            objectives: ["Distinguish ethical hacking from illegal hacking", "Describe key cybersecurity laws", "Explore cybersecurity career paths"],
            vocab: [["ethical hacking", "authorized testing to find vulnerabilities"], ["penetration test", "a simulated attack performed with permission"], ["responsible disclosure", "privately reporting a vulnerability so it can be fixed"], ["bug bounty", "a reward program for reporting vulnerabilities"]],
            standards: ["3B-IC-26", "3B-IC-28"],
            body: `
**The key difference: permission.**
- **Ethical (white-hat) hackers** test systems **with written authorization** and report findings.
- **Unauthorized access is illegal** — even "just looking" or testing your school's network without permission.

**U.S. law:** the **Computer Fraud and Abuse Act (CFAA)** makes unauthorized access to computers a federal crime. Many states have additional laws.

**Responsible disclosure:** if you find a vulnerability, report it privately to the organization and give them time to fix it before going public. Many companies offer **bug bounties** — some have paid researchers over $1 million.

**Ethical questions**
- Should governments be able to access encrypted messages?
- When does monitoring employees become invasive?
- Who is responsible when insecure software causes harm?

**Careers** (hundreds of thousands of U.S. openings):
security analyst, penetration tester, incident responder, cryptographer, security engineer, digital forensics investigator.

**Practice legally:** capture-the-flag (CTF) competitions like picoCTF and CyberPatriot.`,
            questions: [
              mc("What separates ethical hacking from illegal hacking?", "Authorization from the system's owner", ["The hacker's skill level", "The tools used", "The time of day"], "Permission is the line."),
              mc("Which U.S. federal law prohibits unauthorized computer access?", "Computer Fraud and Abuse Act", ["COPPA", "FERPA", "HIPAA"], "The CFAA."),
              tf("Testing your school's network for weaknesses without permission is legal if you don't cause damage.", false, "Unauthorized access is illegal regardless of intent."),
              mc("Where can students practice hacking skills legally?", "Capture-the-flag competitions like picoCTF", ["Their school's grade system", "A neighbor's Wi-Fi", "A bank's website"], "CTFs are designed for legal practice."),
            ],
            writtenPrompt: "You discover that your co-op's sign-up website shows other families' information if you change a number in the URL. Describe what you would do, step by step, and explain why.",
            rubric: "Does not exploit or share the data (3) · Reports privately to the right person (3) · Explains responsible disclosure reasoning (4)",
          },
        ],
      },
    ],
  },
];
