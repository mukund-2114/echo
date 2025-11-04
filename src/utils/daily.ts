// Daily rotating content utilities
// Deterministic selection based on YYYY-MM-DD

const words = [
  { word: 'serendipity', meaning: 'The occurrence of events by chance in a happy way.' },
  { word: 'lucid', meaning: 'Expressed clearly; easy to understand.' },
  { word: 'cogent', meaning: 'Clear, logical, and convincing.' },
  { word: 'succinct', meaning: 'Briefly and clearly expressed.' },
  { word: 'tenacity', meaning: 'Persistence; determination.' },
];

const coding = [
  { title: 'Two Sum', tip: 'Use a hashmap to track seen values and complements.' },
  { title: 'Valid Parentheses', tip: 'Stack-based matching of opening and closing pairs.' },
  { title: 'Binary Search', tip: 'Halve the search space each iteration on sorted arrays.' },
  { title: 'Reverse Linked List', tip: 'Iteratively rewire next pointers; track prev.' },
  { title: 'Fibonacci DP', tip: 'Bottom-up with O(1) space by tracking last two.' },
];

const quotes = [
  'Small steps every day lead to big results.',
  'Done is better than perfect.',
  'Consistency beats intensity.',
  'Focus on the next right thing.',
  'You only fail when you stop trying.',
];

const challenges = [
  { title: 'Write 10 lines of code', hint: 'Open your editor and refactor something tiny.' },
  { title: 'Take a 10-min walk', hint: 'Movement resets your focus.' },
  { title: 'Journal 3 bullets', hint: 'Gratitude • Concern • Next step.' },
  { title: 'Reach out to someone', hint: 'A quick check-in strengthens bonds.' },
  { title: 'Tidy your desk', hint: 'Reduce friction for your next session.' },
];

const music = [
  { label: 'Lo-fi beats', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
  { label: 'Focus piano', url: 'https://www.youtube.com/watch?v=_Itq7v4rJOM' },
  { label: 'Ambient focus', url: 'https://www.youtube.com/watch?v=DWcJFNfaw9c' },
  { label: 'Coding synthwave', url: 'https://www.youtube.com/watch?v=MVPTGNGiI-4' },
  { label: 'Nature sounds', url: 'https://www.youtube.com/watch?v=1ZYbU82GVz4' },
];

function indexForToday(len: number): number {
  const d = new Date();
  const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return hash % len;
}

export function getDailyWord() {
  return words[indexForToday(words.length)];
}

export function getDailyCoding() {
  return coding[indexForToday(coding.length)];
}

export function getDailyQuote() {
  return quotes[indexForToday(quotes.length)];
}

export function getDailyChallenge() {
  return challenges[indexForToday(challenges.length)];
}

export function getDailyMusic() {
  return music[indexForToday(music.length)];
}
