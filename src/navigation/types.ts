// Navigation types for React Navigation

export type RootStackParamList = {
  Main: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Mood: undefined;
  Tasks: undefined;
  Learning: undefined;
  Finance: undefined;
  More: undefined;
};

export type MoodStackParamList = {
  MoodHome: undefined;
  MoodLog: undefined;
  MoodHistory: undefined;
  MoodInsights: undefined;
};

export type TaskStackParamList = {
  TaskList: undefined;
  TaskDetail: { taskId: string };
  TaskCreate: undefined;
};

export type LearningStackParamList = {
  LearningHome: undefined;
  CodingChallenge: { challengeId: string };
  VocabularyQuiz: undefined;
};

export type FinanceStackParamList = {
  FinanceHome: undefined;
  PortfolioDetail: undefined;
  AddTransaction: undefined;
};
