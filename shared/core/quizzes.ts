import type { LessonContent } from "./types";

/** Auto-graded "check your understanding" quizzes for the bundled lessons, keyed by lesson id. */
export const lessonQuizzes: Record<string, LessonContent> = {
  sci001: {
    sections: [
      {
        id: "sci001-check",
        title: "Check your understanding",
        questions: [
          { id: "sci001-q1", type: "choice", prompt: "A push or pull that can change an object's motion is called…", options: ["Energy", "Force", "Mass", "Speed"], expectedAnswer: "Force" },
          { id: "sci001-q2", type: "choice", prompt: "Which unit is force measured in?", options: ["Joules", "Watts", "Newtons", "Meters"], expectedAnswer: "Newtons" },
          { id: "sci001-q3", type: "text", prompt: "What is the ability to do work or cause change called?", expectedAnswer: "energy" },
        ],
      },
    ],
  },
  sci002: {
    sections: [
      {
        id: "sci002-check",
        title: "Check your understanding",
        questions: [
          { id: "sci002-q1", type: "choice", prompt: "Water vapor cooling to form clouds is called…", options: ["Evaporation", "Condensation", "Precipitation", "Collection"], expectedAnswer: "Condensation" },
          { id: "sci002-q2", type: "choice", prompt: "What powers the water cycle?", options: ["The moon", "Wind", "The sun", "Earth's core"], expectedAnswer: "The sun" },
          { id: "sci002-q3", type: "number", prompt: "Roughly what percent of Earth's water is in the oceans?", expectedAnswer: "97" },
        ],
      },
    ],
  },
  sci003: {
    sections: [
      {
        id: "sci003-check",
        title: "Check your understanding",
        questions: [
          { id: "sci003-q1", type: "choice", prompt: "Which is a sign that a chemical reaction happened?", options: ["Ice melting", "A gas is produced", "Paper being cut", "Sugar dissolving"], expectedAnswer: "A gas is produced" },
          { id: "sci003-q2", type: "choice", prompt: "Substances you start with in a reaction are called…", options: ["Products", "Reactants", "Catalysts", "Solutions"], expectedAnswer: "Reactants" },
        ],
      },
    ],
  },
  tech001: {
    sections: [
      {
        id: "tech001-check",
        title: "Check your understanding",
        questions: [
          { id: "tech001-q1", type: "choice", prompt: "A step-by-step set of instructions to solve a problem is an…", options: ["Algorithm", "Variable", "Compiler", "Network"], expectedAnswer: "Algorithm" },
          { id: "tech001-q2", type: "choice", prompt: "What stores a value that a program can change?", options: ["Loop", "Variable", "Function", "Comment"], expectedAnswer: "Variable" },
          { id: "tech001-q3", type: "number", prompt: "In most languages, what does 7 % 3 evaluate to?", expectedAnswer: "1" },
        ],
      },
    ],
  },
  tech002: {
    sections: [
      {
        id: "tech002-check",
        title: "Check your understanding",
        questions: [
          { id: "tech002-q1", type: "choice", prompt: "Which language describes the structure of a web page?", options: ["CSS", "HTML", "SQL", "Python"], expectedAnswer: "HTML" },
          { id: "tech002-q2", type: "choice", prompt: "Which language controls colors and layout?", options: ["CSS", "HTML", "JSON", "Bash"], expectedAnswer: "CSS" },
          { id: "tech002-q3", type: "text", prompt: "Which language adds interactivity in the browser?", expectedAnswer: "javascript" },
        ],
      },
    ],
  },
  tech003: {
    sections: [
      {
        id: "tech003-check",
        title: "Check your understanding",
        questions: [
          { id: "tech003-q1", type: "choice", prompt: "Systems that improve by learning from data use…", options: ["Machine learning", "Spreadsheets", "Compression", "Encryption"], expectedAnswer: "Machine learning" },
          { id: "tech003-q2", type: "choice", prompt: "Which is an everyday example of AI?", options: ["A light switch", "A voice assistant", "A paper map", "A calculator"], expectedAnswer: "A voice assistant" },
        ],
      },
    ],
  },
  eng001: {
    sections: [
      {
        id: "eng001-check",
        title: "Check your understanding",
        questions: [
          { id: "eng001-q1", type: "choice", prompt: "What is the first step of the engineering design process?", options: ["Build a prototype", "Define the problem", "Test", "Improve"], expectedAnswer: "Define the problem" },
          { id: "eng001-q2", type: "choice", prompt: "A working early model of a design is a…", options: ["Blueprint", "Prototype", "Hypothesis", "Constraint"], expectedAnswer: "Prototype" },
        ],
      },
    ],
  },
  eng002: {
    sections: [
      {
        id: "eng002-check",
        title: "Check your understanding",
        questions: [
          { id: "eng002-q1", type: "choice", prompt: "A force that squeezes a material together is…", options: ["Tension", "Compression", "Torsion", "Friction"], expectedAnswer: "Compression" },
          { id: "eng002-q2", type: "choice", prompt: "Which shape is most often used to make structures rigid?", options: ["Square", "Circle", "Triangle", "Hexagon"], expectedAnswer: "Triangle" },
        ],
      },
    ],
  },
  eng003: {
    sections: [
      {
        id: "eng003-check",
        title: "Check your understanding",
        questions: [
          { id: "eng003-q1", type: "choice", prompt: "Which part lets a robot sense its environment?", options: ["Actuator", "Sensor", "Chassis", "Battery"], expectedAnswer: "Sensor" },
          { id: "eng003-q2", type: "choice", prompt: "Motors that make a robot move are called…", options: ["Actuators", "Controllers", "Sensors", "Resistors"], expectedAnswer: "Actuators" },
        ],
      },
    ],
  },
  math001: {
    sections: [
      {
        id: "math001-check",
        title: "Check your understanding",
        questions: [
          { id: "math001-q1", type: "number", prompt: "Solve for x: x + 7 = 12", expectedAnswer: "5" },
          { id: "math001-q2", type: "number", prompt: "Solve for x: 3x = 21", expectedAnswer: "7" },
          { id: "math001-q3", type: "number", prompt: "Solve for x: 2x − 4 = 10", expectedAnswer: "7" },
        ],
      },
    ],
  },
  math002: {
    sections: [
      {
        id: "math002-check",
        title: "Check your understanding",
        questions: [
          { id: "math002-q1", type: "number", prompt: "Area of a rectangle 6 cm by 4 cm (in cm²)?", expectedAnswer: "24" },
          { id: "math002-q2", type: "number", prompt: "Area of a triangle with base 10 and height 5?", expectedAnswer: "25" },
          { id: "math002-q3", type: "number", prompt: "Perimeter of a square with sides of 9?", expectedAnswer: "36" },
        ],
      },
    ],
  },
  math003: {
    sections: [
      {
        id: "math003-check",
        title: "Check your understanding",
        questions: [
          { id: "math003-q1", type: "number", prompt: "Mean of 4, 8, 6, 2?", expectedAnswer: "5" },
          { id: "math003-q2", type: "number", prompt: "Median of 3, 9, 1, 7, 5?", expectedAnswer: "5" },
          { id: "math003-q3", type: "number", prompt: "Mode of 2, 4, 4, 6, 8?", expectedAnswer: "4" },
        ],
      },
    ],
  },
};
