// Mock assessment data and functions
export const startAssessment = (answers: Record<string, string>) => {
  console.log('Starting assessment with answers:', answers);
  // In a real app, this would send data to an API
  localStorage.setItem('assessmentAnswers', JSON.stringify(answers));
};

export const getAssessmentResults = async (): Promise<any> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get answers from localStorage
  const answers = JSON.parse(localStorage.getItem('assessmentAnswers') || '{}');
  
  // Mock results based on answers
  const experienceLevel = answers.q1 || 'Beginner';
  const technology = answers.q2 || 'React';
  
  let recommendation = '';
  let resources: string[] = [];
  let nextSteps = '';
  
  if (experienceLevel === 'Beginner') {
    recommendation = 'Start with fundamentals of web development';
    resources = [
      'HTML/CSS basics',
      'JavaScript fundamentals',
      'React documentation'
    ];
    nextSteps = 'Complete the beginner React tutorial and build a simple project';
  } else if (experienceLevel === 'Intermediate') {
    recommendation = 'Focus on advanced React concepts and state management';
    resources = [
      'React hooks deep dive',
      'Redux Toolkit',
      'Testing with Jest'
    ];
    nextSteps = 'Work on a medium complexity project using modern React patterns';
  } else {
    recommendation = 'Master advanced patterns and contribute to open source';
    resources = [
      'Advanced React patterns',
      'Performance optimization',
      'TypeScript with React'
    ];
    nextSteps = 'Contribute to open source projects or build your own library';
  }
  
  return {
    recommendation,
    resources,
    nextSteps
  };
};
