// 20 binary questions mapping to 4 axes (5 questions each)
// structure (0-4), collaboration (5-9), scope (10-14), tempo (15-19)

export const assessmentQuestions = [
  // STRUCTURE AXIS (0-4)
  {
    id: 0,
    title: "when starting a new project, you prefer to",
    options: [
      { value: "A", label: "map out the entire system first" },
      { value: "B", label: "jump in and figure it out as you go" }
    ]
  },
  {
    id: 1,
    title: "your ideal workspace is",
    options: [
      { value: "A", label: "organized with clear zones for everything" },
      { value: "B", label: "flexible and changes based on the task" }
    ]
  },
  {
    id: 2,
    title: "when solving problems, you tend to",
    options: [
      { value: "A", label: "follow a proven methodology" },
      { value: "B", label: "improvise based on intuition" }
    ]
  },
  {
    id: 3,
    title: "documentation should be",
    options: [
      { value: "A", label: "comprehensive and detailed upfront" },
      { value: "B", label: "minimal and evolve as needed" }
    ]
  },
  {
    id: 4,
    title: "you prefer tools that are",
    options: [
      { value: "A", label: "robust with defined workflows" },
      { value: "B", label: "simple and adaptable" }
    ]
  },
  
  // COLLABORATION AXIS (5-9)
  {
    id: 5,
    title: "your best work happens when you",
    options: [
      { value: "A", label: "collaborate closely with others" },
      { value: "B", label: "have uninterrupted solo time" }
    ]
  },
  {
    id: 6,
    title: "feedback is most valuable when it's",
    options: [
      { value: "A", label: "frequent and conversational" },
      { value: "B", label: "consolidated and written" }
    ]
  },
  {
    id: 7,
    title: "ideal meeting frequency is",
    options: [
      { value: "A", label: "daily standups and regular syncs" },
      { value: "B", label: "only when absolutely necessary" }
    ]
  },
  {
    id: 8,
    title: "decisions are best made",
    options: [
      { value: "A", label: "through group consensus" },
      { value: "B", label: "by designated individuals" }
    ]
  },
  {
    id: 9,
    title: "knowledge sharing should happen",
    options: [
      { value: "A", label: "continuously through the day" },
      { value: "B", label: "in structured documentation" }
    ]
  },
  
  // SCOPE AXIS (10-14)
  {
    id: 10,
    title: "you're energized by",
    options: [
      { value: "A", label: "seeing the big picture strategy" },
      { value: "B", label: "perfecting specific details" }
    ]
  },
  {
    id: 11,
    title: "when delegating, you prefer to",
    options: [
      { value: "A", label: "give context and let them figure it out" },
      { value: "B", label: "provide exact specifications" }
    ]
  },
  {
    id: 12,
    title: "project success means",
    options: [
      { value: "A", label: "achieving the strategic vision" },
      { value: "B", label: "flawless execution of details" }
    ]
  },
  {
    id: 13,
    title: "you'd rather own",
    options: [
      { value: "A", label: "the entire product roadmap" },
      { value: "B", label: "a specific feature done perfectly" }
    ]
  },
  {
    id: 14,
    title: "complexity should be handled by",
    options: [
      { value: "A", label: "abstracting to simpler patterns" },
      { value: "B", label: "addressing each case specifically" }
    ]
  },
  
  // TEMPO AXIS (15-19)
  {
    id: 15,
    title: "deadlines should be",
    options: [
      { value: "A", label: "aggressive to maintain momentum" },
      { value: "B", label: "realistic to ensure quality" }
    ]
  },
  {
    id: 16,
    title: "you prefer to ship",
    options: [
      { value: "A", label: "something good today" },
      { value: "B", label: "something great next week" }
    ]
  },
  {
    id: 17,
    title: "iteration cycles should be",
    options: [
      { value: "A", label: "rapid with constant adjustments" },
      { value: "B", label: "thoughtful with deeper changes" }
    ]
  },
  {
    id: 18,
    title: "context switching between tasks",
    options: [
      { value: "A", label: "keeps you energized" },
      { value: "B", label: "disrupts your flow" }
    ]
  },
  {
    id: 19,
    title: "planning horizons should extend",
    options: [
      { value: "A", label: "a few weeks out maximum" },
      { value: "B", label: "quarters or years ahead" }
    ]
  }
];