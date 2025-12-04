import { ref, watch } from "vue";
import { defineStore } from "pinia";
import defaultTasksData from "./defaultTasks.json";

const STORAGE_KEY = "tasks";

const normalizeStatus = (status) => (status === "completed" ? "completed" : "pending");

const defaultTasks = () =>
  defaultTasksData.map((task) => ({
    ...task,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: normalizeStatus(task.status),
  }));

const loadTasks = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultTasks();

  try {
    return JSON.parse(saved).map((task) => ({
      ...task,
      status: normalizeStatus(task.status),
    }));
  } catch (error) {
    console.warn("Could not parse saved tasks", error);
    return defaultTasks();
  }
};

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref(loadTasks());

  watch(
    tasks,
    () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.value));
    },
    { deep: true }
  );

  const addTask = (task) => {
    tasks.value.unshift({ ...task, status: normalizeStatus(task.status) });
  };

  const updateTask = (updated) => {
    const index = tasks.value.findIndex((task) => task.id === updated.id);
    if (index !== -1) tasks.value[index] = updated;
  };

  const deleteTask = (id) => {
    const index = tasks.value.findIndex((task) => task.id === id);
    if (index !== -1) tasks.value.splice(index, 1);
  };

  const duplicateTask = (task) => {
    tasks.value.unshift({
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    duplicateTask,
  };
});
