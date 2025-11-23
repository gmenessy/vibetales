import type { StorySpark } from '@/types';

// Curated inspiration questions for ages 8-13
export const STORY_SPARKS: StorySpark[] = [
  // Daily life
  {
    id: 'daily-1',
    question: 'Was war der "Cringe-Moment" des Tages?',
    category: 'daily',
    ageRange: [8, 13],
  },
  {
    id: 'daily-2',
    question: 'Welches Level hast du heute im Real Life gemeistert?',
    category: 'daily',
    ageRange: [8, 13],
  },
  {
    id: 'daily-3',
    question: 'Was war heute so random, dass es niemand glauben würde?',
    category: 'daily',
    ageRange: [8, 13],
  },
  {
    id: 'daily-4',
    question: 'Wenn dein Tag ein Boss-Fight wäre, wer war der Boss?',
    category: 'daily',
    ageRange: [8, 13],
  },
  {
    id: 'daily-5',
    question: 'Was war das sickste, was heute passiert ist?',
    category: 'daily',
    ageRange: [10, 13],
  },

  // Emotions
  {
    id: 'emotion-1',
    question: 'Wann hast du dich heute wie ein Superheld gefühlt?',
    category: 'emotion',
    ageRange: [8, 13],
  },
  {
    id: 'emotion-2',
    question: 'Was hat dich heute mega triggered?',
    category: 'emotion',
    ageRange: [10, 13],
  },
  {
    id: 'emotion-3',
    question: 'Welcher Moment heute war unexpected wholesome?',
    category: 'emotion',
    ageRange: [8, 13],
  },
  {
    id: 'emotion-4',
    question: 'Wann wolltest du heute am liebsten unsichtbar sein?',
    category: 'emotion',
    ageRange: [8, 13],
  },

  // Creative
  {
    id: 'creative-1',
    question: 'Wenn dein Tag ein Film wäre, welches Genre hätte er?',
    category: 'creative',
    ageRange: [8, 13],
  },
  {
    id: 'creative-2',
    question: 'Welche Easter Egg hat der Tag für dich versteckt?',
    category: 'creative',
    ageRange: [9, 13],
  },
  {
    id: 'creative-3',
    question: 'Was war heute NPC-Verhalten und was war Hauptcharakter-Energie?',
    category: 'creative',
    ageRange: [10, 13],
  },
  {
    id: 'creative-4',
    question: 'Wenn du heute eine Superkraft hättest, welche hätte dir am meisten geholfen?',
    category: 'creative',
    ageRange: [8, 13],
  },

  // Reflection
  {
    id: 'reflection-1',
    question: 'Was war dein größter Plot Twist heute?',
    category: 'reflection',
    ageRange: [8, 13],
  },
  {
    id: 'reflection-2',
    question: 'Welche Side Quest hast du heute unabsichtlich gestartet?',
    category: 'reflection',
    ageRange: [8, 13],
  },
  {
    id: 'reflection-3',
    question: 'Was würdest du heute anders machen, wenn du respawnen könntest?',
    category: 'reflection',
    ageRange: [9, 13],
  },
  {
    id: 'reflection-4',
    question: 'Welches Achievement hast du heute freigeschaltet?',
    category: 'reflection',
    ageRange: [8, 13],
  },
];

export function getRandomSpark(age?: number): StorySpark {
  let eligibleSparks = STORY_SPARKS;

  if (age) {
    eligibleSparks = STORY_SPARKS.filter(
      (spark) => age >= spark.ageRange[0] && age <= spark.ageRange[1]
    );
  }

  const randomIndex = Math.floor(Math.random() * eligibleSparks.length);
  return eligibleSparks[randomIndex];
}

export function getSparksByCategory(category: StorySpark['category']): StorySpark[] {
  return STORY_SPARKS.filter((spark) => spark.category === category);
}
