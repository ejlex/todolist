<template>
  <main class="page">
    <header class="hero">
      <div>
        <p class="pill">Vue 3 • Vite</p>
        <h1>Checklist</h1>
        <p class="lede">Build, track, and finish your daily tasks with a clean workspace.</p>
      </div>
      <div class="accent-card">
        <p class="label">Tasks left</p>
        <p class="big-number">{{ remaining }}</p>
        <p class="muted">{{ total }} total</p>
      </div>
    </header>

    <section class="stats">
      <article class="stat-card">
        <div class="stat-meta">
          <p class="label">Overall progress</p>
          <p class="muted">Keep the momentum going</p>
        </div>
        <div class="stat-body">
          <div class="stat-value">
            <strong>{{ progress }}%</strong>
            <span>complete</span>
          </div>
          <div class="progress" role="presentation">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </article>
      <article class="stat-card">
        <div class="stat-meta">
          <p class="label">Active tasks</p>
          <p class="muted">Prioritize what matters today</p>
        </div>
        <div class="stat-body">
          <div class="pill secondary">{{ remaining }} to go</div>
          <div class="pill secondary">{{ completedCount }} done</div>
        </div>
      </article>
    </section>

    <section class="layout">
      <article class="card">
        <header class="card-header">
          <div>
            <p class="label">Upcoming tasks</p>
            <h2>Get things done</h2>
          </div>
          <form class="inline-form" @submit.prevent="addTodo">
            <input
              v-model.trim="draft"
              type="text"
              name="todo"
              autocomplete="off"
              placeholder="Add a new task..."
              aria-label="New task"
            />
            <button type="submit">Add</button>
          </form>
        </header>

        <ul v-if="activeTodos.length" class="todo-list" aria-live="polite">
          <TodoItem
            v-for="todo in activeTodos"
            :key="todo.id"
            :modelValue="todo"
            @update:modelValue="updateTodo"
            @delete="deleteTodo(todo.id)"
          />
        </ul>
        <p v-else class="empty">No tasks yet. Add something to get started!</p>

        <div class="card-footer">
          <div class="tip">
            <p class="label">Quick tip</p>
            <p class="muted">Double-click a task to edit it. Use the check to mark it done.</p>
          </div>
          <div class="actions">
            <button type="button" class="ghost" @click="markAll(true)" :disabled="!todoList.length">
              Mark all complete
            </button>
            <button type="button" class="ghost" @click="markAll(false)" :disabled="!todoList.length">
              Reset all
            </button>
          </div>
        </div>
      </article>

      <article class="card completed-card">
        <header class="card-header">
          <div>
            <p class="label">Completed</p>
            <h2>{{ completedCount }} tasks finished</h2>
          </div>
          <button type="button" class="ghost" @click="clearCompleted" :disabled="completedCount === 0">
            Clear completed
          </button>
        </header>

        <ul v-if="completedTodos.length" class="todo-list completed" aria-live="polite">
          <TodoItem
            v-for="todo in completedTodos"
            :key="todo.id"
            :modelValue="todo"
            @update:modelValue="updateTodo"
            @delete="deleteTodo(todo.id)"
          />
        </ul>
        <p v-else class="empty">No completed tasks yet. Check items off to see them here.</p>
      </article>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import TodoItem from './components/TodoItem.vue'

const draft = ref('')
const todoList = ref(loadTodos())

function loadTodos() {
  const saved = localStorage.getItem('todos')
  if (!saved) return []
  try {
    return JSON.parse(saved)
  } catch (err) {
    console.warn('Could not parse saved todos', err)
    return []
  }
}

const persist = () => {
  localStorage.setItem('todos', JSON.stringify(todoList.value))
}

watch(
  todoList,
  () => {
    persist()
  },
  { deep: true }
)

const addTodo = () => {
  const text = draft.value.trim()
  if (!text) return

  todoList.value.unshift({
    id: crypto.randomUUID(),
    text,
    completed: false,
  })
  draft.value = ''
}

const updateTodo = (updated) => {
  const index = todoList.value.findIndex((todo) => todo.id === updated.id)
  if (index !== -1) {
    todoList.value[index] = updated
  }
}

const deleteTodo = (id) => {
  const index = todoList.value.findIndex((todo) => todo.id === id)
  if (index !== -1) {
    todoList.value.splice(index, 1)
  }
}

const activeTodos = computed(() => todoList.value.filter((todo) => !todo.completed))
const completedTodos = computed(() => todoList.value.filter((todo) => todo.completed))

const completedCount = computed(() => completedTodos.value.length)
const remaining = computed(() => activeTodos.value.length)
const total = computed(() => todoList.value.length)
const progress = computed(() => {
  if (total.value === 0) return 0
  return Math.round((completedCount.value / total.value) * 100)
})

const clearCompleted = () => {
  const next = todoList.value.filter((todo) => !todo.completed)
  todoList.value.splice(0, todoList.value.length, ...next)
}

const markAll = (value) => {
  todoList.value.forEach((todo) => {
    todo.completed = value
  })
}
</script>
