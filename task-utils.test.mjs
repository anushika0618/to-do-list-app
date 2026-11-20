import test from "node:test";
import assert from "node:assert/strict";
import { createTask, filterTasks, getTaskStats, isOverdue, normalizeTasks, parseStoredTasks, readTasks, writeTasks } from "./task-utils.js";

const sample = [
  { id: "1", text: "Plan", done: false, priority: "high", dueDate: "2026-11-19" },
  { id: "2", text: "Build", done: true, priority: "low", dueDate: "" }
];

test("malformed or unavailable stored JSON safely becomes an empty list", () => {
  assert.deepEqual(parseStoredTasks("{bad json"), []);
  assert.deepEqual(parseStoredTasks("null"), []);
});
test("normalization discards invalid rows and supplies safe defaults", () => {
  assert.deepEqual(normalizeTasks([null, { id: 3, text: "  Test  ", done: 1, priority: "urgent" }]), [
    { id: 3, text: "Test", done: false, priority: "normal", dueDate: "" }
  ]);
});
test("storage read and write handle browser storage failures", () => {
  const storage = { getItem: () => "[]" , setItem: () => {} };
  assert.deepEqual(readTasks(storage), []);
  assert.equal(writeTasks(storage, sample), true);
  assert.deepEqual(readTasks({ getItem: () => { throw Error("blocked"); } }), []);
  assert.equal(writeTasks({ setItem: () => { throw Error("full"); } }, sample), false);
});
test("task creation trims input and rejects empty descriptions", () => {
  assert.equal(createTask({ id: 1, text: "  Read  " }).text, "Read");
  assert.throws(() => createTask({ id: 2, text: "   " }), /required/);
});
test("task creation rejects invalid priorities and overlong descriptions", () => {
  assert.throws(() => createTask({ id: 1, text: "X", priority: "urgent" }), /priority/);
  assert.throws(() => createTask({ id: 1, text: "x".repeat(121) }), /120/);
});
test("statistics and filters are calculated correctly", () => {
  assert.deepEqual(getTaskStats(sample), { total: 2, done: 1, active: 1, percent: 50 });
  assert.deepEqual(filterTasks(sample, "active"), [sample[0]]);
  assert.deepEqual(filterTasks(sample, "done"), [sample[1]]);
  assert.deepEqual(filterTasks(sample, "all"), sample);
});
test("overdue excludes completed tasks and today's due date", () => {
  assert.equal(isOverdue("2026-11-19", false, "2026-11-20"), true);
  assert.equal(isOverdue("2026-11-20", false, "2026-11-20"), false);
  assert.equal(isOverdue("2026-11-19", true, "2026-11-20"), false);
});
