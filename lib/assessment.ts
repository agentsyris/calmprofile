// Mock assessment data and functions
export type Axis = 'SO' | 'CO' | 'SF' | 'TP';

interface Question {
    id: string;
    prompt: string;
    options: string[];
}

const questions: Question[] = [
    // Source of Truth (SO) axis questions (5 questions)
    { 
        id: "so1", 
        prompt: "How do you prefer to store project requirements?", 
        options: ["Spreadsheets", "Project management tools", "Version control"] 
    },
    { 
        id: "so2", 
        prompt: "What is your primary method for tracking task status?", 
        options: ["Manual updates in documents", "Ticketing systems with statuses", "Burndown charts"] 
    },
    { 
        id: "so3", 
        prompt: "How do you handle scope changes during development?", 
        options: ["Negotiate individually each time", "Formally document and review all changes", "Accept them without tracking"] 
    },
    // Collaboration & Communication (CO) axis questions
    { 
        id: "co1", 
        prompt: "How do you communicate with team members?", 
        options: ["Email only", "Instant messaging + meetings", "Regular standups + documentation"] 
    },
    { 
        id: "co2", 
        prompt: "What is your approach to knowledge sharing?", 
        options: ["Informal conversations", "Shared documents", "Formal documentation and training"] 
    },
    // Structure & Flexibility (SF) axis questions
    { 
        id: "sf1", 
        prompt: "How do you approach project planning?", 
        options: ["Detailed upfront planning", "Iterative planning with flexibility", "Ad-hoc planning as needed"] 
    },
    { 
        id: "sf2", 
        prompt: "What is your tolerance for changes in project scope?", 
        options: ["Very strict - changes are problematic", "Moderate - changes need approval", "Highly flexible - changes are welcome"] 
    },
    // Technical Practices (TP) axis questions
    { 
        id: "tp1", 
        prompt: "How do you approach code reviews?", 
        options: ["Minimal review process", "Formal peer review with checklists", "Continuous integration with automated checks"] 
    },
    { 
        id: "tp2", 
        prompt: "What is your approach to testing?", 
        options: ["Manual testing only", "Automated unit tests", "Comprehensive test automation"] 
    },
];

const axisQuestions = {
    SO: ['so1', 'so2', 'so3'],
    CO: ['co1', 'co2'],
    SF: ['sf1', 'sf2'],
    TP: ['tp1', 'tp2']
};

const baseWeight = {
    SO: 1,
    CO: 1,
    SF: 1,
    TP: 1
};

const rawMaxTotal = 3 * 1 + 2 * 1 + 2 * 1 + 2 * 1; // Total possible score

export function score(answerMap: Record<string, number>): { [axis in Axis]: number } {
    const normalizedScores = {} as { [axis in Axis]: number };

    Object.entries(axisQuestions).forEach(([axisName]) => {
        let totalRawScore = 0;
        (questions as Question[]).filter(q => q.id.startsWith(axisName)).forEach((q) => {
            const index = answerMap[q.id] || 0;
            totalRawScore += index * baseWeight[axisName];
        });

        normalizedScores[axisName] = Math.round((totalRawScore / rawMaxTotal) * 100);
    });

    return normalizedScores;
}

// Mock archetype calculation
export function calculateArchetype(scores: { axis: Axis; score: number }[]): string {
    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);
    
    // Return top axis as archetype
    return scores[0].axis;
}

// Mock friction calculation
export function calculateFrictions(gaps: Record<string, number>): string[] {
    // Sort gaps by size (descending)
    const sortedGaps = Object.entries(gaps)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2); // Top 2 frictions
    
    return sortedGaps.map(([axis]) => axis);
}

export function pickArchetype(normalizedScores: { [axis in Axis]: number }): string {
    // Determine top two axes
    const axisNames = ['SO', 'CO', 'SF', 'TP'] as Axis[];
    const scores = Object.entries(normalizedScores).map(([axis, score]) => ({ axis, score }));
    
    return calculateArchetype(scores);
}

export function pickFrictions(normalizedScores: { [axis in Axis]: number }): string[] {
    // Calculate gaps for each axis
    const gaps = {};
    Object.keys(normalizedScores).forEach((axisName) => {
        gaps[axisName] = 100 - normalizedScores[axisName];
    });

    // Sort by gap size (descending)
    return calculateFrictions(gaps);
}

export function convertAnswersToMap(questionData: Question[], userAnswers: string[]): Record<string, number> {
    const answerMap: Record<string, number> = {};
    
    questionData.forEach((q) => {
        if (!userAnswers[q.id]) return;
        
        // Find the selected option index
        for (let i = 0; i < q.options.length; i++) {
            if (userAnswers[q.id] === q.options[i]) {
                answerMap[q.id] = i;
                break;
            }
        }
    });
    
    return answerMap;
}

export type Result = {
    scores: { [axis in Axis]: number };
    archetype: string;
    topFrictions: string[];
    quickWinTeaser: string;
};

export const startAssessment = (answers: Record<string, string>) => {
  console.log('Starting assessment with answers:', answers);
  // In a real app, this would send data to an API
  localStorage.setItem('assessmentAnswers', JSON.stringify(answers));
};

export const getAssessmentResults = async (): Promise<Result> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get answers from localStorage
  const answers = JSON.parse(localStorage.getItem('assessmentAnswers') || '{}');
  
  // Convert answers to map format
  const answerMap = convertAnswersToMap(questions, Object.entries(answers).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>));
  
  // Calculate scores
  const scores = score(answerMap);
  
  // Pick archetype
  const archetype = pickArchetype(scores);
  
  // Pick frictions
  const topFrictions = pickFrictions(scores);
  
  // Mock quick win teaser based on archetype
  let quickWinTeaser = '';
  switch(archetype) {
    case 'SO':
      quickWinTeaser = 'Implement a centralized project management tool to improve tracking of requirements and changes.';
      break;
    case 'CO':
      quickWinTeaser = 'Establish regular standup meetings to enhance team communication and knowledge sharing.';
      break;
    case 'SF':
      quickWinTeaser = 'Adopt iterative planning with short sprints to balance structure and flexibility.';
      break;
    case 'TP':
      quickWinTeaser = 'Introduce automated testing to improve code quality and reduce manual testing overhead.';
      break;
    default:
      quickWinTeaser = 'Focus on improving your weakest area to enhance overall team performance.';
  }
  
  return {
    scores,
    archetype,
    topFrictions,
    quickWinTeaser
  };
};
