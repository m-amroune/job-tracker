import { getFollowUpStatus } from "./followUp";

test("returns overdue for a past follow-up date", () => {
  expect(getFollowUpStatus("2026-08-17", "2026-08-18")).toBe("overdue");
});

test("returns today for today's follow-up date", () => {
  expect(getFollowUpStatus("2026-08-18", "2026-08-18")).toBe("today");
});

test("returns upcoming for a future follow-up date", () => {
  expect(getFollowUpStatus("2026-08-19", "2026-08-18")).toBe("upcoming");
});