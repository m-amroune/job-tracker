export type FollowUpStatus = "upcoming" | "today" | "overdue";

// Returns the follow-up state compared with the current date.
export function getFollowUpStatus(
  followUpDate: string,
  today: string,
): FollowUpStatus {
  if (followUpDate === today) {
    return "today";
  }

  // ISO dates use YYYY-MM-DD, so they can be compared directly as strings.
  if (followUpDate < today) {
    return "overdue";
  }

  return "upcoming";
}