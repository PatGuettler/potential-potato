import { mc, num, short, tf, type CourseSpec } from "../dsl";

const CSTA = "CSTA K–12 Computer Science Standards";

export const technologyCourses: CourseSpec[] = [
  {
    id: "py",
    title: "Python Programming",
    subject: "technology",
    grade: 9,
    gradeMax: 12,
    framework: CSTA,
    description: "A full introduction to Python: variables, control flow, data structures, functions, files, errors, algorithms, and object-oriented programming.",
    units: [
      {
        title: "Python Basics",
        description: "Write your first programs with input, output, variables, and arithmetic.",
        lessons: [
          {
            title: "Print, Input, and Variables",
            summary: "Python programs display output with print(), read input with input(), and store values in variables.",
            objectives: ["Write programs that print output", "Read user input and store it in variables", "Use f-strings to format output"],
            vocab: [["print()", "displays a value on the screen"], ["input()", "reads text typed by the user"], ["f-string", "a string starting with f that can include {variables}"]],
            standards: ["3A-AP-13", "3A-AP-17"],
            body: `
\`\`\`python
print("Hello, world!")

name = input("What is your name? ")
print(f"Nice to meet you, {name}!")
\`\`\`

**Variables** store values. Python figures out the type automatically.
\`\`\`python
age = 15
height = 1.68
city = "Columbus"
\`\`\`

**Naming rules**
- Letters, digits, underscores; can't start with a digit
- Case matters: \`Score\` ≠ \`score\`
- Use **snake_case**: \`total_points\`

**Comments** start with \`#\` and are ignored by Python:
\`\`\`python
# calculate the total
\`\`\`

**f-strings** make output readable:
\`\`\`python
item, price = "pizza", 12.5
print(f"{item} costs \${price:.2f}")   # pizza costs $12.50
\`\`\``,
            questions: [
              mc("Which function reads text typed by the user?", "input()", ["print()", "read()", "type()"], "input() returns what the user typed."),
              mc("What does print(f\"{2 + 3} apples\") display?", "5 apples", ["{2 + 3} apples", "2 + 3 apples", "f5 apples"], "Expressions in braces are evaluated."),
              mc("Which is a valid Python variable name?", "total_score", ["2nd_place", "total score", "class-size"], "No leading digits, spaces, or hyphens."),
              tf("In Python, Score and score are the same variable.", false, "Python is case-sensitive."),
            ],
            programmingLanguage: "python",
          },
          {
            title: "Data Types and Arithmetic",
            summary: "Python has ints, floats, strings, and booleans, with operators for math and conversion functions.",
            objectives: ["Identify int, float, str, and bool", "Use arithmetic operators including //, %, and **", "Convert between types"],
            vocab: [["int", "a whole number"], ["float", "a number with a decimal point"], ["modulo (%)", "the remainder after division"], ["type conversion", "changing a value's type, like int(\"5\")"]],
            standards: ["3A-AP-13", "3A-AP-14"],
            body: `
| Type | Example |
|---|---|
| int | 42 |
| float | 3.14 |
| str | "hello" |
| bool | True / False |

**Arithmetic**
\`\`\`python
7 + 2    # 9
7 - 2    # 5
7 * 2    # 14
7 / 2    # 3.5   (always a float)
7 // 2   # 3     (floor division)
7 % 2    # 1     (remainder)
7 ** 2   # 49    (power)
\`\`\`

**Modulo is useful:** \`n % 2 == 0\` tests for even numbers; \`minutes % 60\` gives leftover minutes.

**input() always returns a string!**
\`\`\`python
age = input("Age? ")       # "15"
age = int(age)             # 15
next_year = age + 1        # 16
\`\`\`
Without \`int()\`, \`"15" + 1\` causes a **TypeError**.

Order of operations follows PEMDAS: \`2 + 3 * 4\` is 14.`,
            questions: [
              num("What is 17 // 5 in Python?", 3, "Floor division drops the remainder."),
              num("What is 17 % 5 in Python?", 2, "17 = 3 × 5 + 2."),
              num("What is 2 ** 5 in Python?", 32, "2 to the 5th power."),
              mc("What type does input() return?", "str", ["int", "float", "bool"], "Convert it with int() or float() for math."),
            ],
            programmingLanguage: "python",
          },
        ],
      },
      {
        title: "Control Flow",
        description: "Make decisions with conditionals and repeat with loops.",
        lessons: [
          {
            title: "Conditionals: if, elif, else",
            summary: "Conditionals choose which code runs based on Boolean expressions.",
            objectives: ["Write if/elif/else chains", "Use comparison and logical operators", "Trace nested conditionals"],
            vocab: [["Boolean expression", "an expression that is True or False"], ["elif", "short for else if"], ["indentation", "spaces that show which code belongs to a block"]],
            standards: ["3A-AP-15", "3A-AP-17"],
            body: `
\`\`\`python
score = int(input("Score: "))

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "Needs work"
print(grade)
\`\`\`
Python checks top to bottom and runs the **first** true branch only.

**Indentation matters!** The indented lines belong to the \`if\`. Use 4 spaces.

**Comparisons:** \`== != < > <= >=\`
**Logic:** \`and\`, \`or\`, \`not\`
\`\`\`python
if age >= 13 and age <= 19:
    print("teen")
if day == "Sat" or day == "Sun":
    print("weekend")
\`\`\`

**Common mistake:** \`=\` assigns; \`==\` compares.`,
            questions: [
              mc("score = 85. Which grade does the code assign?", "B", ["A", "C", "Needs work"], "85 ≥ 80 is the first true condition."),
              mc("What does (5 > 3) and (2 > 4) evaluate to?", "False", ["True", "Error", "None"], "Both must be true for and."),
              tf("In Python, indentation defines which statements belong to an if block.", true, "Python uses indentation instead of braces."),
              mc("Which operator checks equality?", "==", ["=", "!=", "=>"], "= is assignment."),
            ],
            programmingLanguage: "python",
          },
          {
            title: "Loops: for and while",
            summary: "for loops iterate over sequences; while loops repeat while a condition is true.",
            objectives: ["Use for loops with range()", "Write while loops with correct stopping conditions", "Use accumulators and break"],
            vocab: [["range()", "generates a sequence of integers"], ["accumulator", "a variable that builds a total across loop iterations"], ["infinite loop", "a loop whose condition never becomes false"]],
            standards: ["3A-AP-15", "3A-AP-17"],
            body: `
**for loops** with \`range(start, stop, step)\` — stop is **not** included:
\`\`\`python
for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

for i in range(2, 11, 2): # 2, 4, 6, 8, 10
    print(i)
\`\`\`

**Accumulator pattern**
\`\`\`python
total = 0
for n in range(1, 101):
    total += n
print(total)   # 5050
\`\`\`

**while loops** repeat until a condition is false:
\`\`\`python
guess = ""
while guess != "python":
    guess = input("Password: ")
print("Welcome!")
\`\`\`

**break** exits a loop early; **continue** skips to the next iteration.

**Infinite loop danger:** make sure something inside the loop changes the condition.`,
            questions: [
              mc("What numbers does range(3, 7) produce?", "3, 4, 5, 6", ["3, 4, 5, 6, 7", "4, 5, 6, 7", "3, 7"], "Stop is excluded."),
              num("total = 0; for n in range(1, 6): total += n. What is total?", 15, "1 + 2 + 3 + 4 + 5 = 15."),
              num("How many times does 'for i in range(0, 20, 5)' loop?", 4, "0, 5, 10, 15."),
              mc("x = 10; while x > 0: x -= 3. What is x after the loop?", "-2", ["0", "1", "-3"], "10 → 7 → 4 → 1 → −2."),
            ],
            programmingLanguage: "python",
          },
        ],
      },
      {
        title: "Data Structures",
        description: "Store collections with lists and dictionaries.",
        lessons: [
          {
            title: "Lists",
            summary: "Lists hold ordered, changeable collections and support indexing, slicing, and methods.",
            objectives: ["Create, index, and slice lists", "Use list methods like append, remove, and sort", "Loop over lists"],
            vocab: [["list", "an ordered, mutable collection"], ["slice", "a portion of a list, like nums[1:3]"], ["mutable", "can be changed after creation"]],
            standards: ["3A-AP-14"],
            body: `
\`\`\`python
fruits = ["apple", "banana", "cherry", "date"]
fruits[0]      # "apple"
fruits[-1]     # "date" (negative counts from the end)
fruits[1:3]    # ["banana", "cherry"]
len(fruits)    # 4
\`\`\`

**Changing lists**
\`\`\`python
fruits.append("elderberry")
fruits.remove("banana")
fruits.insert(0, "avocado")
fruits.sort()
\`\`\`

**Looping**
\`\`\`python
scores = [88, 92, 79, 95]
for s in scores:
    print(s)
average = sum(scores) / len(scores)   # 88.5
best = max(scores)                    # 95
\`\`\`

**Membership:** \`"apple" in fruits\` → True

**List comprehension** (compact loops):
\`\`\`python
squares = [n * n for n in range(1, 6)]   # [1, 4, 9, 16, 25]
\`\`\``,
            questions: [
              mc("nums = [10, 20, 30, 40, 50]. What is nums[-2]?", "40", ["20", "50", "Error"], "−1 is the last item, −2 the one before."),
              mc("nums = [10, 20, 30, 40, 50]. What is nums[1:4]?", "[20, 30, 40]", ["[10, 20, 30, 40]", "[20, 30, 40, 50]", "[20, 40]"], "Index 4 is excluded."),
              num("What is len([n * 2 for n in range(7)])?", 7, "One item per value of range(7)."),
              num("What is sum([4, 8, 15, 16, 23, 42])?", 108, "Add them all."),
            ],
            programmingLanguage: "python",
          },
          {
            title: "Dictionaries",
            summary: "Dictionaries map keys to values for fast lookup.",
            objectives: ["Create dictionaries and access values by key", "Add, update, and delete entries", "Loop over keys and values"],
            vocab: [["dictionary", "a collection of key–value pairs"], ["key", "a unique label used to look up a value"], ["KeyError", "the error raised when a key doesn't exist"]],
            standards: ["3A-AP-14", "3B-AP-12"],
            body: `
\`\`\`python
student = {"name": "Maya", "grade": 10, "gpa": 3.8}
student["name"]          # "Maya"
student["grade"] = 11    # update
student["club"] = "Robotics"   # add
del student["gpa"]       # delete
\`\`\`

**Safe lookup:** \`student.get("email", "none")\` returns "none" instead of a **KeyError**.

**Looping**
\`\`\`python
for key, value in student.items():
    print(f"{key}: {value}")
\`\`\`

**Counting with a dictionary**
\`\`\`python
text = "banana"
counts = {}
for ch in text:
    counts[ch] = counts.get(ch, 0) + 1
# {"b": 1, "a": 3, "n": 2}
\`\`\`

**When to use which:** lists for ordered sequences; dictionaries when you look things up by name (phone book, inventory, settings).`,
            questions: [
              mc("d = {\"a\": 1, \"b\": 2}. What is d[\"b\"]?", "2", ["1", "\"b\"", "Error"], "Look up by key."),
              mc("What happens with d[\"z\"] if \"z\" isn't a key?", "KeyError", ["Returns 0", "Returns None", "Adds \"z\""], "Use .get() to avoid this."),
              num("Counting letters in \"mississippi\" with a dictionary, what is counts[\"s\"]?", 4, "m-i-s-s-i-s-s-i-p-p-i has 4 s's."),
              tf("Dictionary keys must be unique.", true, "Assigning to an existing key replaces its value."),
            ],
            programmingLanguage: "python",
          },
        ],
      },
      {
        title: "Functions and Modules",
        description: "Organize code into functions and use Python's standard library.",
        lessons: [
          {
            title: "Functions and Scope",
            summary: "Functions take parameters, return values, and have their own local variables.",
            objectives: ["Define functions with parameters and default values", "Return values", "Explain local vs. global scope"],
            vocab: [["def", "the keyword that defines a function"], ["return", "sends a value back to the caller"], ["scope", "where in a program a variable can be used"]],
            standards: ["3A-AP-17", "3A-AP-18"],
            body: `
\`\`\`python
def bmi(weight_kg, height_m):
    return weight_kg / height_m ** 2

print(round(bmi(60, 1.7), 1))   # 20.8
\`\`\`

**Default parameters**
\`\`\`python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"
greet("Ava")            # "Hello, Ava!"
greet("Ava", "Hi")      # "Hi, Ava!"
\`\`\`

**Scope:** variables created inside a function are **local** — they disappear when the function ends.
\`\`\`python
def f():
    x = 10      # local
f()
print(x)        # NameError!
\`\`\`

**Functions without return** give back \`None\`.

**Docstrings** describe what a function does:
\`\`\`python
def area(r):
    """Return the area of a circle with radius r."""
    return 3.14159 * r ** 2
\`\`\``,
            questions: [
              mc("What does greet(\"Leo\") return, given greet(name, greeting=\"Hello\")?", "\"Hello, Leo!\"", ["\"Leo\"", "\"Hello\"", "Error"], "The default greeting is used."),
              num("def f(a, b=3): return a * b. What is f(4)?", 12, "b defaults to 3."),
              mc("What does a function return if it has no return statement?", "None", ["0", "False", "An error"], "Python returns None by default."),
              tf("A variable created inside a function can be used anywhere in the program.", false, "It's local to the function."),
            ],
            programmingLanguage: "python",
          },
          {
            title: "Modules: random, math, and More",
            summary: "Import modules from the standard library to reuse tested code.",
            objectives: ["Import modules and specific functions", "Use random and math functions", "Build a small game with modules"],
            vocab: [["module", "a file of Python code you can import"], ["import", "makes a module's code available"], ["standard library", "modules that come with Python"]],
            standards: ["3A-AP-16", "3B-AP-16"],
            body: `
\`\`\`python
import math
math.sqrt(144)     # 12.0
math.pi            # 3.14159...
math.ceil(4.2)     # 5

from random import randint, choice
randint(1, 6)                   # random die roll (1–6 inclusive)
choice(["rock", "paper", "scissors"])
\`\`\`

**Number-guessing game**
\`\`\`python
from random import randint
secret = randint(1, 100)
tries = 0
while True:
    guess = int(input("Guess: "))
    tries += 1
    if guess < secret:
        print("Higher")
    elif guess > secret:
        print("Lower")
    else:
        print(f"Got it in {tries} tries!")
        break
\`\`\`

**Other useful modules:** \`datetime\` (dates), \`statistics\` (mean, median), \`csv\` (spreadsheets), \`json\`.

**Third-party libraries** (installed with pip) extend Python further: pandas, matplotlib, requests.`,
            questions: [
              num("What does math.sqrt(81) return (as a number)?", 9, "The square root of 81."),
              mc("What range of values can randint(1, 6) return?", "1 through 6, inclusive", ["0 through 5", "1 through 5", "0 through 6"], "randint includes both ends."),
              num("What does math.ceil(7.01) return?", 8, "ceil rounds up."),
              mc("With the best strategy (always guess the middle), about how many guesses does 1–100 take at most?", "7", ["50", "100", "3"], "2⁷ = 128 ≥ 100."),
            ],
            programmingLanguage: "python",
          },
        ],
      },
      {
        title: "Strings and Errors",
        description: "Process text and handle errors gracefully.",
        lessons: [
          {
            title: "String Methods",
            summary: "Strings have methods for searching, splitting, joining, and changing case.",
            objectives: ["Index and slice strings", "Use common string methods", "Process text data"],
            vocab: [["immutable", "cannot be changed after creation"], ["method", "a function that belongs to an object, called with a dot"], ["split()", "breaks a string into a list"]],
            standards: ["3A-AP-14", "3A-AP-17"],
            body: `
\`\`\`python
s = "Hello, World"
s[0]           # "H"
s[-5:]         # "World"
len(s)         # 12
s.upper()      # "HELLO, WORLD"
s.lower()      # "hello, world"
s.replace("World", "Python")   # "Hello, Python"
s.find("o")    # 4
"World" in s   # True
\`\`\`

**Split and join**
\`\`\`python
"a,b,c".split(",")          # ["a", "b", "c"]
"-".join(["2026", "10", "24"])   # "2026-10-24"
\`\`\`

**Cleaning input:** \`input().strip().lower()\` removes spaces and normalizes case.

**Strings are immutable:** methods return a **new** string; the original doesn't change.

**Word counter**
\`\`\`python
text = "the cat and the hat"
words = text.split()
print(len(words))              # 5
print(words.count("the"))      # 2
\`\`\``,
            questions: [
              short("What does \"python\".upper() return? (type it without quotes)", ["PYTHON"], "upper() capitalizes every letter."),
              num("What is len(\"data science\")?", 12, "The space counts."),
              num("What is len(\"one two three four\".split())?", 4, "Four words."),
              short("What does \"banana\"[1:4] return? (no quotes)", ["ana"], "Indexes 1, 2, 3."),
            ],
            programmingLanguage: "python",
          },
          {
            title: "Exceptions and Error Handling",
            summary: "Use try/except to handle errors without crashing and validate user input.",
            objectives: ["Identify common error types", "Handle exceptions with try/except", "Validate input in a loop"],
            vocab: [["exception", "an error that happens while a program runs"], ["try/except", "code that attempts an action and handles errors"], ["traceback", "the error report showing where a program failed"]],
            standards: ["3A-AP-21", "3B-AP-21"],
            body: `
**Common errors**
| Error | Cause |
|---|---|
| SyntaxError | invalid code (missing colon) |
| NameError | undefined variable |
| TypeError | wrong type: "5" + 1 |
| ValueError | right type, bad value: int("hi") |
| ZeroDivisionError | dividing by 0 |
| IndexError | list index out of range |

**Handling errors**
\`\`\`python
try:
    n = int(input("Enter a number: "))
    print(100 / n)
except ValueError:
    print("That's not a number.")
except ZeroDivisionError:
    print("Can't divide by zero.")
\`\`\`

**Input validation loop**
\`\`\`python
while True:
    try:
        age = int(input("Age: "))
        if 0 < age < 120:
            break
        print("Enter a realistic age.")
    except ValueError:
        print("Numbers only, please.")
\`\`\`

**Read tracebacks bottom-up:** the last line names the error; the lines above show where.`,
            questions: [
              mc("Which error does int(\"hello\") raise?", "ValueError", ["TypeError", "NameError", "SyntaxError"], "The type is right (str) but the value can't convert."),
              mc("Which error does [1, 2, 3][5] raise?", "IndexError", ["KeyError", "ValueError", "ZeroDivisionError"], "Index 5 doesn't exist."),
              tf("Code inside an except block runs only if an error occurs in the try block.", true, "It handles the exception."),
              mc("Where should you start reading a traceback?", "The last line", ["The first line", "The middle", "It doesn't matter"], "The final line names the error type."),
            ],
            programmingLanguage: "python",
          },
        ],
      },
      {
        title: "Algorithms and Objects",
        description: "Implement classic algorithms and model data with classes.",
        lessons: [
          {
            title: "Implementing Search and Sort",
            summary: "Write linear search, binary search, and a simple sort, and compare their efficiency.",
            objectives: ["Implement linear and binary search", "Implement selection or bubble sort", "Compare algorithm efficiency"],
            vocab: [["algorithm", "a precise sequence of steps to solve a problem"], ["Big-O notation", "describes how runtime grows with input size"], ["swap", "exchange two values"]],
            standards: ["3B-AP-10", "3B-AP-11"],
            body: `
**Linear search — O(n)**
\`\`\`python
def linear_search(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1
\`\`\`

**Binary search — O(log n)** (sorted list)
\`\`\`python
def binary_search(items, target):
    low, high = 0, len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
\`\`\`

**Bubble sort — O(n²)**
\`\`\`python
def bubble_sort(a):
    for i in range(len(a)):
        for j in range(len(a) - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
\`\`\`

**In practice** use Python's built-in \`sorted()\` — it's O(n log n) and highly optimized.`,
            questions: [
              num("binary_search([2, 5, 8, 12, 16, 23], 12) returns which index?", 3, "12 is at index 3."),
              num("For low = 0 and high = 9, what is mid?", 4, "(0 + 9) // 2 = 4."),
              mc("Which algorithm is O(n²)?", "Bubble sort", ["Binary search", "Linear search", "Dictionary lookup"], "Nested loops over the list."),
              num("linear_search([4, 7, 1], 9) returns…", -1, "Not found returns −1."),
            ],
            programmingLanguage: "python",
          },
          {
            title: "Classes and Objects",
            summary: "Classes bundle data (attributes) and behavior (methods) into reusable blueprints.",
            objectives: ["Define a class with __init__ and methods", "Create and use objects", "Explain encapsulation and inheritance"],
            vocab: [["class", "a blueprint for creating objects"], ["object (instance)", "a specific thing created from a class"], ["attribute", "a variable stored in an object"], ["inheritance", "a class reusing and extending another class"]],
            standards: ["3B-AP-14", "3A-AP-17"],
            body: `
\`\`\`python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            print("Insufficient funds")
        else:
            self.balance -= amount

acct = BankAccount("Sam", 100)
acct.deposit(50)
acct.withdraw(30)
print(acct.balance)   # 120
\`\`\`

**self** refers to the specific object.

**Encapsulation:** methods protect data (withdraw checks the balance).

**Inheritance**
\`\`\`python
class SavingsAccount(BankAccount):
    def add_interest(self, rate):
        self.balance += self.balance * rate
\`\`\`
A SavingsAccount has everything a BankAccount has, plus interest.

**Objects model the real world:** students, game characters, products in a cart.`,
            questions: [
              num("acct = BankAccount(\"Jo\", 200); acct.withdraw(50); acct.deposit(25). What is acct.balance?", 175, "200 − 50 + 25."),
              mc("What is __init__ used for?", "Setting up a new object's attributes", ["Deleting objects", "Printing objects", "Importing modules"], "It runs when an object is created."),
              mc("In a method, self refers to…", "the specific object the method was called on", ["the class name", "the whole program", "the parent class only"], "Each object has its own data."),
              tf("A subclass inherits the methods of its parent class.", true, "That's inheritance."),
            ],
            programmingLanguage: "python",
            writtenPrompt: "Design a class for something in your life (a pet, a book, a sports team). List three attributes and two methods, and write the Python code for it.",
            rubric: "Sensible class choice (2) · Three relevant attributes in __init__ (3) · Two working methods (4) · Uses self correctly (1)",
          },
        ],
      },
    ],
  },
  {
    id: "web",
    title: "Web Design & Development",
    subject: "technology",
    grade: 9,
    gradeMax: 12,
    framework: CSTA,
    description: "Build accessible, responsive websites with HTML, CSS, and JavaScript, then publish them and test them with real users.",
    units: [
      {
        title: "HTML",
        description: "Structure web pages with semantic HTML.",
        lessons: [
          {
            title: "HTML Structure and Elements",
            summary: "HTML uses tags to structure content into headings, paragraphs, and lists.",
            objectives: ["Write a valid HTML document", "Use headings, paragraphs, and lists", "Nest elements correctly"],
            vocab: [["HTML", "HyperText Markup Language, the structure of web pages"], ["element", "an opening tag, content, and closing tag"], ["attribute", "extra information in a tag, like href or src"]],
            standards: ["3A-AP-16", "3A-CS-01"],
            body: `
\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>My First Page</title>
  </head>
  <body>
    <h1>Welcome!</h1>
    <p>This is a <strong>paragraph</strong>.</p>
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </body>
</html>
\`\`\`

- \`<head>\`: information about the page (title, links to CSS)
- \`<body>\`: visible content
- \`<h1>\`–\`<h6>\`: headings (one \`<h1>\` per page)
- \`<ul>\` unordered (bullets) / \`<ol>\` ordered (numbers)

**Nesting:** close tags in reverse order: \`<p><strong>hi</strong></p>\` ✓

**The three layers of the web:** HTML (structure), CSS (style), JavaScript (behavior).`,
            questions: [
              mc("Which tag holds the visible content of a page?", "<body>", ["<head>", "<title>", "<meta>"], "The head holds information about the page."),
              mc("Which tag makes a numbered list?", "<ol>", ["<ul>", "<li>", "<nl>"], "Ordered list."),
              mc("Which nesting is correct?", "<p><em>hi</em></p>", ["<p><em>hi</p></em>", "<em><p>hi</em></p>", "<p>hi<em></p>"], "Close inner tags first."),
              tf("A page should usually have only one <h1>.", true, "It's the main title, which helps accessibility and SEO."),
            ],
            programmingLanguage: "html",
          },
          {
            title: "Links, Images, and Semantic HTML",
            summary: "Add links and images, and use semantic tags that describe content meaning.",
            objectives: ["Create links and images with attributes", "Use semantic elements like header, nav, main, and footer", "Write meaningful alt text"],
            vocab: [["hyperlink", "a clickable link to another page"], ["semantic HTML", "tags that describe meaning, like <nav> or <article>"], ["relative path", "a file location relative to the current page"]],
            standards: ["3A-AP-16", "3A-IC-24"],
            body: `
**Links**
\`\`\`html
<a href="https://www.nasa.gov">NASA</a>
<a href="about.html">About us</a>   <!-- relative path -->
\`\`\`

**Images**
\`\`\`html
<img src="images/robot.jpg" alt="Student-built robot climbing a ramp" width="400">
\`\`\`
**alt text** describes the image for screen readers and when images fail to load.

**Semantic layout**
\`\`\`html
<header>Site title and logo</header>
<nav>Menu links</nav>
<main>
  <article>Blog post</article>
  <aside>Related links</aside>
</main>
<footer>© 2026</footer>
\`\`\`

**Why semantic?** Screen readers can jump to \`<nav>\` or \`<main>\`, search engines understand your page better, and code is easier to read than a pile of \`<div>\`s.`,
            questions: [
              mc("Which attribute sets where a link goes?", "href", ["src", "alt", "link"], "Hypertext reference."),
              mc("Which is the best alt text for a photo of a dog catching a frisbee?", "\"Golden retriever leaping to catch a red frisbee\"", ["\"image\"", "\"dog.jpg\"", "\"click here\""], "Describe what matters in the image."),
              mc("Which semantic tag holds a site's menu links?", "<nav>", ["<aside>", "<footer>", "<span>"], "Nav means navigation."),
              tf("Semantic HTML helps screen reader users navigate a page.", true, "They can jump between landmarks."),
            ],
            programmingLanguage: "html",
          },
        ],
      },
      {
        title: "CSS",
        description: "Style pages with selectors, the box model, and flexbox.",
        lessons: [
          {
            title: "CSS Selectors and the Box Model",
            summary: "CSS rules select elements and style them; every element is a box with content, padding, border, and margin.",
            objectives: ["Write CSS rules with element, class, and id selectors", "Explain the box model", "Calculate an element's total width"],
            vocab: [["selector", "the part of a CSS rule that chooses elements"], ["class", "a reusable label for styling, selected with ."], ["box model", "content + padding + border + margin"]],
            standards: ["3A-AP-16"],
            body: `
\`\`\`css
p { color: #333; }              /* element selector */
.highlight { background: yellow; }  /* class selector */
#hero { font-size: 2rem; }     /* id selector (unique) */
nav a { text-decoration: none; }   /* descendant */
\`\`\`
\`\`\`html
<p class="highlight">Important!</p>
\`\`\`

**The box model**
\`\`\`
margin → border → padding → content
\`\`\`
\`\`\`css
.card {
  width: 300px;
  padding: 20px;
  border: 2px solid #ccc;
  margin: 10px;
}
\`\`\`
Total width = 300 + 2(20) + 2(2) = **344px** (plus margins outside).

**Tip:** \`box-sizing: border-box;\` makes width include padding and border — much easier to reason about.

**Cascade:** when rules conflict, more specific selectors win (id > class > element), then later rules win.`,
            questions: [
              mc("Which selector targets elements with class=\"btn\"?", ".btn", ["#btn", "btn", "*btn"], "Classes use a dot."),
              num("width: 200px, padding: 10px, border: 5px (content-box). What is the total width in px (without margin)?", 230, "200 + 20 + 10 = 230."),
              mc("Which wins: a class selector or an id selector?", "The id selector", ["The class selector", "Whichever comes first", "Neither"], "IDs are more specific."),
              mc("Space outside an element's border is the…", "margin", ["padding", "content", "outline"], "Padding is inside the border."),
            ],
            programmingLanguage: "css",
          },
          {
            title: "Layout with Flexbox",
            summary: "Flexbox arranges items in a row or column and controls alignment and spacing.",
            objectives: ["Create flex containers", "Use justify-content, align-items, and gap", "Build a navigation bar and card row"],
            vocab: [["flex container", "an element with display: flex"], ["main axis", "the direction items are laid out"], ["justify-content", "spacing along the main axis"]],
            standards: ["3A-AP-16"],
            body: `
\`\`\`css
.nav {
  display: flex;
  justify-content: space-between;  /* main axis */
  align-items: center;             /* cross axis */
  gap: 1rem;
}
\`\`\`

**flex-direction:** \`row\` (default, left→right) or \`column\` (top→bottom).

**justify-content:** \`flex-start\`, \`center\`, \`flex-end\`, \`space-between\`, \`space-around\`

**align-items:** \`stretch\`, \`center\`, \`flex-start\`, \`flex-end\`

**Perfect centering:**
\`\`\`css
.center { display: flex; justify-content: center; align-items: center; }
\`\`\`

**Card row that wraps:**
\`\`\`css
.cards { display: flex; flex-wrap: wrap; gap: 16px; }
.card  { flex: 1 1 250px; }   /* grow, shrink, start at 250px */
\`\`\`

**CSS Grid** is better for two-dimensional layouts (rows *and* columns).`,
            questions: [
              mc("Which property makes an element a flex container?", "display: flex", ["position: flex", "flex: 1", "float: flex"], "display: flex turns on flexbox."),
              mc("With flex-direction: row, justify-content controls…", "horizontal spacing", ["vertical spacing", "font size", "colors"], "The main axis is horizontal for rows."),
              mc("Which value puts equal space between items with none at the edges?", "space-between", ["space-around", "center", "flex-start"], "First and last items touch the edges."),
              tf("Flexbox can center an element both horizontally and vertically.", true, "justify-content + align-items: center."),
            ],
            programmingLanguage: "css",
          },
        ],
      },
      {
        title: "Responsive and Accessible Design",
        description: "Make sites work on every device and for every user.",
        lessons: [
          {
            title: "Responsive Design",
            summary: "Responsive sites adapt to any screen size with flexible units and media queries.",
            objectives: ["Use the viewport meta tag", "Write media queries", "Use relative units and mobile-first design"],
            vocab: [["responsive design", "layouts that adapt to different screen sizes"], ["media query", "CSS that applies only under certain conditions, like screen width"], ["mobile-first", "designing for small screens first, then enhancing"]],
            standards: ["3A-AP-16", "3A-AP-19"],
            body: `
More than half of web traffic comes from phones.

**1. Viewport tag** (in \`<head>\`):
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1">
\`\`\`

**2. Flexible units**
| Unit | Relative to |
|---|---|
| % | parent element |
| rem | root font size |
| vw / vh | viewport width / height |

**3. Media queries (mobile-first)**
\`\`\`css
.grid { display: grid; grid-template-columns: 1fr; }

@media (min-width: 768px) {
  .grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1200px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}
\`\`\`

**4. Flexible images:** \`img { max-width: 100%; height: auto; }\`

**Test** with your browser's device toolbar and on real phones.`,
            questions: [
              mc("What does @media (min-width: 768px) do?", "Applies styles only on screens at least 768px wide", ["Sets the page width to 768px", "Hides the page on phones", "Loads a video"], "Media queries are conditional styles."),
              mc("Which CSS keeps images from overflowing their containers?", "max-width: 100%", ["width: 2000px", "display: none", "float: left"], "Images shrink to fit."),
              num("The root font size is 16px. How many pixels is 1.5rem?", 24, "1.5 × 16 = 24."),
              tf("Mobile-first design starts with styles for small screens.", true, "Then media queries add layouts for larger screens."),
            ],
            programmingLanguage: "css",
          },
          {
            title: "Web Accessibility (WCAG)",
            summary: "Accessible sites follow WCAG principles so everyone can perceive, operate, and understand them.",
            objectives: ["Apply the four WCAG principles", "Check color contrast and keyboard access", "Use labels and ARIA appropriately"],
            vocab: [["WCAG", "Web Content Accessibility Guidelines"], ["contrast ratio", "the difference in brightness between text and background"], ["ARIA", "attributes that add accessibility information to HTML"]],
            standards: ["3A-IC-24", "3A-AP-16"],
            body: `
**WCAG's four principles — POUR**
- **Perceivable:** alt text, captions, sufficient contrast
- **Operable:** everything works with a keyboard; no flashing content
- **Understandable:** clear language, predictable navigation, helpful error messages
- **Robust:** valid HTML that works with assistive technology

**Contrast:** normal text needs at least **4.5:1**; large text 3:1. Light gray on white often fails.

**Keyboard test:** unplug your mouse. Can you reach everything with Tab, and see where focus is?

**Form labels**
\`\`\`html
<label for="email">Email</label>
<input id="email" type="email">
\`\`\`

**Use real buttons:** \`<button>\` works with keyboards automatically; a clickable \`<div>\` doesn't.

**ARIA** fills gaps — \`aria-label="Close menu"\` on an icon-only button — but the first rule of ARIA is: use native HTML when you can.

Many organizations are legally required to meet WCAG AA.`,
            questions: [
              mc("What minimum contrast ratio does WCAG AA require for normal text?", "4.5:1", ["1:1", "2:1", "10:1"], "Large text needs 3:1."),
              mc("Which is the most accessible way to make a clickable control?", "<button>", ["<div onclick>", "<span onclick>", "<img onclick>"], "Buttons are keyboard-accessible by default."),
              tf("Every form input should have a label.", true, "Screen readers announce the label."),
              mc("What does the O in POUR stand for?", "Operable", ["Optional", "Organized", "Optimized"], "Users must be able to operate the interface."),
            ],
            programmingLanguage: "html",
          },
        ],
      },
      {
        title: "JavaScript",
        description: "Add interactivity with the DOM and events.",
        lessons: [
          {
            title: "JavaScript Variables and the DOM",
            summary: "JavaScript can read and change any part of a page through the Document Object Model.",
            objectives: ["Declare variables with let and const", "Select elements with querySelector", "Change text, styles, and classes"],
            vocab: [["DOM", "Document Object Model, the page as a tree of objects"], ["const", "declares a variable that won't be reassigned"], ["querySelector", "finds the first element matching a CSS selector"]],
            standards: ["3A-AP-16", "3A-AP-17"],
            body: `
\`\`\`html
<h1 id="title">Hello</h1>
<p class="msg">Original text</p>
<script src="app.js"></script>
\`\`\`
\`\`\`javascript
const title = document.querySelector("#title");
const msg = document.querySelector(".msg");

title.textContent = "Welcome back!";
msg.style.color = "crimson";
msg.classList.add("highlight");
\`\`\`

**let vs. const**
\`\`\`javascript
const taxRate = 0.07;   // never reassigned
let total = 0;          // will change
total = total + 20 * (1 + taxRate);
\`\`\`

**The DOM is a tree:** \`document\` → \`html\` → \`body\` → elements. JavaScript can add, remove, and change any node.

**Creating elements**
\`\`\`javascript
const li = document.createElement("li");
li.textContent = "New item";
document.querySelector("ul").append(li);
\`\`\`

**Debug** with \`console.log()\` and the browser's developer tools (F12).`,
            questions: [
              mc("Which selects the element with id=\"menu\"?", "document.querySelector(\"#menu\")", ["document.querySelector(\".menu\")", "document.querySelector(\"menu\")", "document.id(\"menu\")"], "IDs use #, like in CSS."),
              mc("Which keyword declares a variable that won't be reassigned?", "const", ["let", "var", "static"], "const = constant."),
              tf("JavaScript can add new elements to a page after it loads.", true, "createElement and append."),
              mc("Which property changes an element's visible text?", "textContent", ["src", "href", "style"], "textContent sets the text."),
            ],
            programmingLanguage: "javascript",
          },
          {
            title: "Events and Interactivity",
            summary: "Event listeners run code in response to clicks, typing, and other user actions.",
            objectives: ["Attach event listeners", "Build a to-do list with click and keyboard events", "Use the event object"],
            vocab: [["event listener", "a function registered to run when an event occurs"], ["callback", "a function passed to another function to call later"], ["event object", "information about the event, like which key was pressed"]],
            standards: ["3A-AP-16"],
            body: `
\`\`\`javascript
const input = document.querySelector("#task");
const list = document.querySelector("#list");
const button = document.querySelector("#add");

function addTask() {
  if (input.value.trim() === "") return;
  const li = document.createElement("li");
  li.textContent = input.value;
  li.addEventListener("click", () => li.classList.toggle("done"));
  list.append(li);
  input.value = "";
}

button.addEventListener("click", addTask);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});
\`\`\`

**Common events:** click, input, change, submit, keydown, mouseover, load

**The event object** (\`e\`) tells you details: \`e.key\`, \`e.target\`.

**Forms:** call \`e.preventDefault()\` in a submit handler to stop the page from reloading.`,
            questions: [
              mc("What does addEventListener(\"click\", addTask) do?", "Runs addTask whenever the element is clicked", ["Runs addTask once immediately", "Deletes the element", "Adds a new button"], "It registers a callback."),
              mc("In a keydown handler, which property tells you the key pressed?", "e.key", ["e.click", "e.value", "e.text"], "The event object's key property."),
              tf("Clicking a task in the code toggles the \"done\" class.", true, "classList.toggle adds or removes it."),
              mc("Why call e.preventDefault() in a form's submit handler?", "To stop the page from reloading", ["To delete the form", "To submit twice", "To change colors"], "Forms reload the page by default."),
            ],
            programmingLanguage: "javascript",
          },
        ],
      },
      {
        title: "Forms and Data",
        description: "Collect user input and load data from APIs.",
        lessons: [
          {
            title: "HTML Forms and Validation",
            summary: "Forms collect user input; built-in validation and JavaScript check it before submission.",
            objectives: ["Build forms with appropriate input types", "Use built-in validation attributes", "Show helpful error messages"],
            vocab: [["form", "an HTML element that collects input"], ["validation", "checking that input is correct before using it"], ["placeholder", "hint text shown in an empty input"]],
            standards: ["3A-AP-16", "3A-AP-21"],
            body: `
\`\`\`html
<form id="signup">
  <label for="name">Name</label>
  <input id="name" required>

  <label for="email">Email</label>
  <input id="email" type="email" required>

  <label for="age">Age</label>
  <input id="age" type="number" min="13" max="120">

  <label for="level">Experience</label>
  <select id="level">
    <option>Beginner</option>
    <option>Intermediate</option>
  </select>

  <button type="submit">Sign up</button>
</form>
\`\`\`

**Input types** give the right phone keyboard and free validation: email, number, date, tel, url, password.

**Validation attributes:** \`required\`, \`min\`, \`max\`, \`minlength\`, \`pattern\`

**Good error messages** say what's wrong and how to fix it: "Password must be at least 8 characters" beats "Invalid input."

**Security:** always validate on the **server** too — users can bypass browser checks.`,
            questions: [
              mc("Which input type shows an email keyboard on phones and checks for @?", "type=\"email\"", ["type=\"text\"", "type=\"mail\"", "type=\"at\""], "Built-in email validation."),
              mc("Which attribute makes a field mandatory?", "required", ["needed", "must", "validate"], "The form won't submit without it."),
              tf("Browser validation alone is enough to keep bad data out of a server.", false, "Users can bypass it; validate on the server too."),
              mc("Which is the most helpful error message?", "\"Password must be at least 8 characters\"", ["\"Error\"", "\"Invalid\"", "\"Try again\""], "Explain what to fix."),
            ],
            programmingLanguage: "html",
          },
          {
            title: "JSON and Fetching Data",
            summary: "Web apps load JSON data from APIs with fetch and display it on the page.",
            objectives: ["Read and write JSON", "Use fetch with async/await", "Display API data in the DOM"],
            vocab: [["API", "a way for programs to request data or services from each other"], ["JSON", "JavaScript Object Notation, a text format for data"], ["async/await", "syntax for waiting on results without freezing the page"]],
            standards: ["3A-AP-16", "3B-AP-16"],
            body: `
**JSON** looks like JavaScript objects:
\`\`\`json
{ "city": "Denver", "tempF": 68, "forecast": ["sunny", "windy"] }
\`\`\`

**Fetching from an API**
\`\`\`javascript
async function showWeather() {
  try {
    const res = await fetch("https://api.example.com/weather?city=Denver");
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const data = await res.json();
    document.querySelector("#temp").textContent = \`\${data.tempF}°F\`;
  } catch (err) {
    document.querySelector("#temp").textContent = "Couldn't load weather";
  }
}
\`\`\`

**await** pauses the function (not the page) until the response arrives.

**Status codes:** 200 OK, 404 Not Found, 500 Server Error.

**Real APIs:** weather, maps, NASA images, sports scores. Many require an **API key** — never put secret keys in public front-end code.`,
            questions: [
              mc("In {\"tempF\": 68}, how do you access 68 after parsing into data?", "data.tempF", ["data[68]", "tempF.data", "data.68"], "Use the key name."),
              mc("What does an HTTP status of 404 mean?", "Not found", ["Success", "Server error", "Redirect"], "The resource doesn't exist."),
              tf("await freezes the entire web page until data arrives.", false, "It pauses only the async function."),
              mc("Why wrap fetch in try/catch?", "To handle network errors gracefully", ["To make it faster", "To encrypt data", "It's required syntax"], "Networks fail; show a helpful message."),
            ],
            programmingLanguage: "javascript",
          },
        ],
      },
      {
        title: "Publishing and Design Process",
        description: "Put sites on the web and improve them through user testing.",
        lessons: [
          {
            title: "Hosting, HTTP, and Domains",
            summary: "Publishing a site means putting files on a server reachable by a domain name over HTTPS.",
            objectives: ["Explain how a browser loads a website", "Compare hosting options", "Describe domains and DNS records"],
            vocab: [["web server", "a computer that sends web pages when requested"], ["domain name", "a human-readable address like example.com"], ["static site", "a site of fixed files with no server-side code"]],
            standards: ["3A-NI-04", "3B-NI-03"],
            body: `
**What happens when you visit a site:**
1. Browser asks **DNS** for the domain's IP address
2. Browser opens a secure **HTTPS** connection to the server
3. Server sends HTML; browser requests the CSS, JS, and images it references
4. Browser renders the page

**Hosting options**
| Option | Good for | Cost |
|---|---|---|
| GitHub Pages / Netlify | static sites, portfolios | free |
| Shared hosting | small business sites | $3–10/month |
| Cloud platforms | apps with databases | pay as you go |

**Domains:** buy from a registrar (~$10–20/year), then point a DNS record at your host.

**HTTPS** is required for modern sites; free certificates from Let's Encrypt.

**Performance:** compress images, minimize files, and use a CDN (servers worldwide) so pages load fast everywhere.`,
            questions: [
              mc("Which is a free option for hosting a static portfolio site?", "GitHub Pages", ["A dedicated server rack", "A registrar", "DNS"], "GitHub Pages hosts static sites for free."),
              mc("What does a CDN do?", "Serves content from servers close to users", ["Registers domains", "Writes HTML", "Encrypts passwords only"], "Shorter distance → faster loads."),
              tf("After the HTML loads, the browser makes additional requests for CSS, JavaScript, and images.", true, "Each referenced file is fetched."),
              mc("Where do you buy a domain name?", "A domain registrar", ["A CDN", "A web browser", "An API"], "Registrars sell domain names."),
            ],
          },
          {
            title: "The Design Process and Usability Testing",
            summary: "Great sites come from research, wireframes, prototypes, and testing with real users.",
            objectives: ["Follow a user-centered design process", "Create wireframes", "Run a usability test and act on findings"],
            vocab: [["wireframe", "a simple sketch of a page layout"], ["prototype", "an early, testable version of a design"], ["usability test", "watching real users try tasks with a product"], ["persona", "a profile representing a typical user"]],
            standards: ["3A-AP-19", "3B-AP-08"],
            body: `
**User-centered design**
1. **Research:** who are the users? What do they need? Create **personas**.
2. **Wireframe:** sketch layouts with boxes — no colors yet.
3. **Prototype:** build a clickable version.
4. **Test:** watch 3–5 real users try specific tasks.
5. **Iterate:** fix the biggest problems, then test again.

**Running a usability test**
- Give a task: "Find the co-op's fall schedule."
- Ask them to **think aloud**.
- **Don't help!** Note where they hesitate or get lost.
- Measure: did they succeed? How long did it take?

**Five users find about 85% of usability problems** (Nielsen's research), so testing doesn't have to be expensive.

**Design principles:** visual hierarchy (important things stand out), whitespace, consistent navigation, readable fonts (16px+ for body text).`,
            questions: [
              mc("What is a wireframe?", "A simple sketch of a page layout", ["The final website", "A server cable", "A type of font"], "Wireframes focus on structure, not style."),
              mc("During a usability test, you should…", "watch without helping", ["explain every button first", "complete the task for them", "only ask yes/no questions"], "Helping hides real problems."),
              num("According to Nielsen, testing with about how many users finds most usability problems?", 5, "Around 5 users find roughly 85%.", { tolerance: 1 }),
              tf("Design should be tested and improved in repeated cycles.", true, "Iteration is the core of good design."),
            ],
            writtenPrompt: "Run a mini usability test: ask a family member to complete one task on a website you choose. Describe the task, what happened, and two improvements you'd make.",
            rubric: "Clear task (2) · Observations of what the user did (4) · Two specific improvements tied to observations (4)",
          },
        ],
      },
    ],
  },
];
