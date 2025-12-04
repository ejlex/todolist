<template>
  <main class="app-shell">
    <header class="heading">
      <div>
        <h1>My Todo List</h1>
        <p>Capture tasks, track status, and manage them visually.</p>
        <p class="badge stack">Vue 3 • Vite • Pinia</p>
        <div class="author">Lee Jun Xian</div>
      </div>
      <div class="badge">{{ counts.todo }} tasks</div>
    </header>

    <form class="form" @submit.prevent="addTask">
      <div class="form-grid">
        <label>
          <span>Title</span>
          <input
            v-model.trim="draft.title"
            type="text"
            name="title"
            autocomplete="off"
            placeholder="Create a task title"
            aria-label="Task title"
            required
          />
        </label>
        <label>
          <span>Image URL</span>
          <input
            v-model.trim="draft.image"
            type="url"
            name="image"
            autocomplete="off"
            placeholder="https://images.example.com/task.jpg"
            aria-label="Task image URL"
          />
        </label>
      </div>
      <label class="full-row">
        <span>Description</span>
        <textarea
          v-model.trim="draft.description"
          name="description"
          rows="3"
          placeholder="Add helpful context for this task"
          aria-label="Task description"
        />
      </label>
      <button type="submit">Add task</button>
    </form>

    <div class="filters" role="group" aria-label="Filter tasks">
      <button
        v-for="option in filters"
        :key="option.value"
        type="button"
        class="filter-btn"
        :class="{ active: filter === option.value }"
        @click="filter = option.value"
      >
        {{ option.label }} ({{ option.count }})
      </button>
    </div>

    <section v-if="filteredTasks.length" class="task-grid" aria-live="polite">
      <TaskCard
        v-for="task in filteredTasks"
        :key="task.id"
        :model-value="task"
        @update:modelValue="updateTask"
        @delete="deleteTask(task.id)"
        @duplicate="duplicateTask(task)"
      />
    </section>
    <p v-else class="empty">No tasks yet. Add something to get started!</p>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import TaskCard from "./components/TaskCard.vue";
import { useTasksStore } from "./stores/tasks";

const draft = reactive({
  title: "",
  description: "",
  image: "",
});

const filter = ref("all");
const tasksStore = useTasksStore();

const filters = computed(() => [
  { label: "Todo", value: "all", count: tasksStore.tasks.length },
  { label: "Pending", value: "pending", count: tasksStore.tasks.filter((task) => task.status === "pending").length },
  { label: "Completed", value: "completed", count: tasksStore.tasks.filter((task) => task.status === "completed").length },
]);

const counts = computed(() => ({
  todo: tasksStore.tasks.length,
  completed: tasksStore.tasks.filter((task) => task.status === "completed").length,
}));

const addTask = () => {
  if (!draft.title.trim()) return;

  tasksStore.addTask({
    id: crypto.randomUUID(),
    title: draft.title.trim(),
    description: draft.description,
    image: draft.image,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  draft.title = "";
  draft.description = "";
  draft.image = "";
};

const updateTask = (updated) => {
  tasksStore.updateTask(updated);
};

const deleteTask = (id) => {
  tasksStore.deleteTask(id);
};

const duplicateTask = (task) => {
  tasksStore.duplicateTask(task);
};

const filteredTasks = computed(() => {
  if (filter.value === "pending") return tasksStore.tasks.filter((task) => task.status === "pending");
  if (filter.value === "completed") return tasksStore.tasks.filter((task) => task.status === "completed");
  return tasksStore.tasks;
});
</script>
