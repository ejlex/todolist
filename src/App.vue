<template>
  <main class="app-shell">
    <header class="heading">
      <div>
        <p class="badge">Vue 3 • Vite</p>
        <h1>Task board</h1>
        <p>Capture tasks, track status, and manage them visually.</p>
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
import { computed, reactive, ref, watch } from 'vue'
import TaskCard from './components/TaskCard.vue'

const filter = ref('all')
const tasks = ref(loadTasks())

const draft = reactive({
  title: '',
  description: '',
  image: '',
})

const filters = computed(() => [
  { label: 'Todo', value: 'all', count: tasks.value.length },
  {
    label: 'In progress',
    value: 'in-progress',
    count: tasks.value.filter((task) => task.status === 'in-progress').length,
  },
  { label: 'Completed', value: 'completed', count: tasks.value.filter((task) => task.status === 'completed').length },
])

const counts = computed(() => ({
  todo: tasks.value.length,
  completed: tasks.value.filter((task) => task.status === 'completed').length,
}))

watch(
  tasks,
  () => {
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  },
  { deep: true }
)

function loadTasks() {
  const saved = localStorage.getItem('tasks')
  if (!saved) return []

  try {
    return JSON.parse(saved)
  } catch (error) {
    console.warn('Could not parse saved tasks', error)
    return []
  }
}

const addTask = () => {
  if (!draft.title.trim()) return

  tasks.value.unshift({
    id: crypto.randomUUID(),
    title: draft.title.trim(),
    description: draft.description,
    image: draft.image,
    status: 'todo',
    createdAt: new Date().toISOString(),
  })

  draft.title = ''
  draft.description = ''
  draft.image = ''
}

const updateTask = (updated) => {
  const index = tasks.value.findIndex((task) => task.id === updated.id)
  if (index !== -1) {
    tasks.value[index] = updated
  }
}

const deleteTask = (id) => {
  const index = tasks.value.findIndex((task) => task.id === id)
  if (index !== -1) {
    tasks.value.splice(index, 1)
  }
}

const duplicateTask = (task) => {
  tasks.value.unshift({
    ...task,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  })
}

const filteredTasks = computed(() => {
  if (filter.value === 'in-progress') return tasks.value.filter((task) => task.status === 'in-progress')
  if (filter.value === 'completed') return tasks.value.filter((task) => task.status === 'completed')
  return tasks.value
})
</script>
