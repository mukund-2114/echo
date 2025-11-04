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
