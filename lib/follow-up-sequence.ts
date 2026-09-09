export type FollowUpSequenceStep = {
  day: number;
  title: string;
  description: string;
};

export const DEFAULT_FOLLOW_UP_SEQUENCE: FollowUpSequenceStep[] = [
  {
    day: 0,
    title: "Initial Reply",
    description: "Start the conversation with a personalized response.",
  },
  {
    day: 2,
    title: "Friendly Follow-Up",
    description: "Reconnect naturally if the lead has not replied.",
  },
  {
    day: 5,
    title: "Value-Based Follow-Up",
    description: "Provide useful context or value related to the lead's goal.",
  },
  {
    day: 9,
    title: "Final Check-In",
    description: "Make one final, low-pressure attempt to reconnect.",
  },
];

/**
 * Returns the next follow-up step after the current step.
 */
export function getNextFollowUpStep(
  currentDay: number
): FollowUpSequenceStep | null {
  return (
    DEFAULT_FOLLOW_UP_SEQUENCE.find(
      (step) => step.day > currentDay
    ) ?? null
  );
}

/**
 * Returns the sequence step for a particular day.
 */
export function getFollowUpStep(
  day: number
): FollowUpSequenceStep | null {
  return (
    DEFAULT_FOLLOW_UP_SEQUENCE.find(
      (step) => step.day === day
    ) ?? null
  );
}

/**
 * Calculates the date for a follow-up relative to a starting date.
 */
export function getFollowUpDate(
  startDate: Date,
  day: number
): Date {
  const date = new Date(startDate);

  date.setDate(date.getDate() + day);

  return date;
}

/**
 * Returns all follow-up steps that occur after a given day.
 */
export function getRemainingFollowUpSteps(
  currentDay: number
): FollowUpSequenceStep[] {
  return DEFAULT_FOLLOW_UP_SEQUENCE.filter(
    (step) => step.day > currentDay
  );
}

/**
 * Determines whether another follow-up exists after the current step.
 */
export function hasNextFollowUp(
  currentDay: number
): boolean {
  return DEFAULT_FOLLOW_UP_SEQUENCE.some(
    (step) => step.day > currentDay
  );
}

/**
 * Returns the final step in the sequence.
 */
export function getFinalFollowUpStep(): FollowUpSequenceStep {
  return DEFAULT_FOLLOW_UP_SEQUENCE[
    DEFAULT_FOLLOW_UP_SEQUENCE.length - 1
  ];
}

/**
 * Returns a human-readable label for a follow-up step.
 */
export function getFollowUpLabel(
  day: number
): string {
  if (day === 0) {
    return "Day 0";
  }

  return `Day ${day}`;
}