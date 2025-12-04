<template>
  <div class="page">
    <TopBar v-model:filter="filter" :filters="filters" candidate-name="Lee Jun Xian" />

    <main class="layout">
      <section class="tasks">
        <header class="tasks-head">
          <div>
            <div class="title-row">
              <h1>Todo</h1>
              <button type="button" class="create-btn" @click="toggleForm">+ Create task</button>
            </div>
            <p class="muted">{{ counts.todo }} total tasks</p>
          </div>
        </header>

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
      </section>

      <CompanyNews />
    </main>

    <div v-if="showForm" class="modal-backdrop" @click.self="toggleForm">
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-task-title"
        aria-describedby="add-task-desc"
      >
        <header class="modal-head">
          <h3 id="add-task-title">Add task</h3>
          <button type="button" class="close-btn" aria-label="Close add task modal" @click="toggleForm">×</button>
        </header>
        <AddTaskForm ref="taskForm" aria-describedby="add-task-desc" @submit="addTask" />
        <p id="add-task-desc" class="visually-hidden">
          Provide a task title, optional image URL, and description, then submit to create the task.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import TaskCard from "./components/TaskCard.vue";
import TopBar from "./components/TopBar.vue";
import AddTaskForm from "./components/AddTaskForm.vue";
import CompanyNews from "./components/CompanyNews.vue";
import { useTasksStore } from "./stores/tasks";

const showForm = ref(false);
const taskForm = ref(null);

const filter = ref("all");
const tasksStore = useTasksStore();

const filters = computed(() => [
  { label: "Todo", value: "all", count: tasksStore.tasks.length },
  {
    label: "In progress",
    value: "pending",
    count: tasksStore.tasks.filter((task) => task.status === "pending").length,
  },
  {
    label: "Completed",
    value: "completed",
    count: tasksStore.tasks.filter((task) => task.status === "completed").length,
  },
]);

const counts = computed(() => ({
  todo: tasksStore.tasks.length,
  completed: tasksStore.tasks.filter((task) => task.status === "completed").length,
}));

const addTask = (payload) => {
  if (!payload.title.trim()) return;
  tasksStore.addTask({
    id: crypto.randomUUID(),
    title: payload.title.trim(),
    description: payload.description,
    image: payload.image,
    status: "start",
    createdAt: new Date().toISOString(),
  });
  showForm.value = false;
};

const toggleForm = () => {
  showForm.value = !showForm.value;
  if (showForm.value) {
    requestAnimationFrame(() => {
      taskForm.value?.focusTitle();
    });
  }
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

<style scoped>
.muted {
  margin: 0;
  color: #7a7a7a;
  font-size: 13px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.icon {
  font-size: 12px;
}
</style>
