import { createTask, filterTasks, getTaskStats, isOverdue, readTasks, writeTasks } from "./task-utils.js";

const $ = (selector) => document.querySelector(selector);
const taskInput = $("#taskInput");
const priorityInput = $("#prioritySelect");
const dueDateInput = $("#dueDateInput");
const taskList = $("#taskList");
const liveMessage = $("#liveMessage");
let tasks = readTasks(window.localStorage);
let currentFilter = "all";

function persist() {
  const saved = writeTasks(window.localStorage, tasks);
  if (!saved) announce("Changes could not be saved. Your browser storage may be full or unavailable.");
  return saved;
}

function announce(message) {
  liveMessage.textContent = message;
}

function makeButton(label, className, title, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.title = title;
  button.setAttribute("aria-label", title);
  button.addEventListener("click", onClick);
  return button;
}

function render() {
  const stats = getTaskStats(tasks);
  $("#totalCount").textContent = stats.total;
  $("#activeCount").textContent = stats.active;
  $("#doneCount").textContent = stats.done;
  $("#progressPct").textContent = stats.percent + "%";
  $("#progressFill").style.width = stats.percent + "%";
  $("#progressFill").setAttribute("aria-valuenow", String(stats.percent));

  taskList.replaceChildren();
  const visible = filterTasks(tasks, currentFilter);
  if (!visible.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = currentFilter === "done" ? "No completed tasks yet." :
      currentFilter === "active" ? "You're all caught up." : "No tasks yet. Add one above.";
    taskList.append(empty);
    return;
  }

  for (const task of visible) {
    const item = document.createElement("article");
    item.className = "task-item" + (task.done ? " done" : "");
    const checkLabel = document.createElement("label");
    checkLabel.className = "check-wrap";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", (task.done ? "Mark as active: " : "Mark as completed: ") + task.text);
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      persist(); render();
      announce(task.done ? "Task marked complete." : "Task marked active.");
    });
    checkLabel.append(checkbox);

    const details = document.createElement("div");
    details.className = "task-details";
    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;
    details.append(text);

    if (task.dueDate) {
      const due = document.createElement("span");
      const overdue = isOverdue(task.dueDate, task.done);
      due.className = "due-date" + (overdue ? " overdue" : "");
      due.textContent = (overdue ? "Overdue · " : "Due · ") + new Date(task.dueDate + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
      details.append(due);
    }

    const priority = document.createElement("span");
    priority.className = "priority " + task.priority;
    priority.textContent = task.priority;
    priority.setAttribute("aria-label", task.priority + " priority");

    const edit = makeButton("Edit", "action-btn", "Edit task: " + task.text, () => beginEdit(task, item));
    const remove = makeButton("×", "del-btn", "Delete task: " + task.text, () => {
      tasks = tasks.filter((entry) => entry.id !== task.id);
      persist(); render(); announce("Task deleted.");
    });

    item.append(checkLabel, details, priority, edit, remove);
    taskList.append(item);
  }
}

function beginEdit(task, item) {
  const form = document.createElement("form");
  form.className = "edit-form";
  const input = document.createElement("input");
  input.className = "edit-input";
  input.maxLength = 120;
  input.required = true;
  input.value = task.text;
  input.setAttribute("aria-label", "Edit task description");
  const priority = document.createElement("select");
  priority.setAttribute("aria-label", "Edit task priority");
  for (const value of ["high", "normal", "low"]) {
    const option = document.createElement("option");
    option.value = value; option.textContent = value[0].toUpperCase() + value.slice(1);
    priority.append(option);
  }
  priority.value = task.priority;
  const dueDate = document.createElement("input");
  dueDate.type = "date";
  dueDate.value = task.dueDate || "";
  dueDate.setAttribute("aria-label", "Edit due date");
  const save = document.createElement("button");
  save.type = "submit"; save.className = "action-btn"; save.textContent = "Save";
  const cancel = makeButton("Cancel", "action-btn secondary", "Cancel editing", render);
  form.append(input, priority, dueDate, save, cancel);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const cleanText = input.value.trim();
    if (!cleanText) { input.setCustomValidity("Enter a task description."); input.reportValidity(); return; }
    task.text = cleanText;
    task.priority = priority.value;
    task.dueDate = dueDate.value;
    persist(); render(); announce("Task updated.");
  });
  item.replaceChildren(form);
  input.focus();
  input.select();
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") render();
  });
}

function addTask() {
  try {
    const task = createTask({
      id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()) + Math.random().toString(16).slice(2),
      text: taskInput.value,
      priority: priorityInput.value,
      dueDate: dueDateInput.value
    });
    tasks.unshift(task);
    taskInput.value = "";
    dueDateInput.value = "";
    persist(); render(); taskInput.focus(); announce("Task added.");
  } catch (error) {
    taskInput.setCustomValidity(error.message);
    taskInput.reportValidity();
  }
}

$("#addBtn").addEventListener("click", addTask);
taskInput.addEventListener("input", () => taskInput.setCustomValidity(""));
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTask();
  if (event.key === "Escape") taskInput.value = "";
});
$("#clearDone").addEventListener("click", () => {
  const count = tasks.filter((task) => task.done).length;
  tasks = tasks.filter((task) => !task.done);
  persist(); render(); announce(count + " completed task(s) cleared.");
});
document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    render();
  });
});

render();
