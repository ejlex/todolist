<template>
  <main class="app-shell">
    <header class="heading">
      <div>
        <p class="badge">Vue 3 • Vite</p>
        <h1>Todo list</h1>
        <p>Track tasks, mark them done, and stay organized.</p>
      </div>
      <div class="badge">{{ remaining }} left</div>
    </header>

    <form class="form" @submit.prevent="addTodo">
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

    <div class="filters" role="group" aria-label="Filter tasks">
      <button
        v-for="option in filters"
        :key="option.value"
        type="button"
        class="filter-btn"
        :class="{ active: filter === option.value }"
        @click="filter = option.value"
      >
        {{ option.label }}
      </button>
    </div>

    <ul v-if="filteredTodos.length" class="todos" aria-live="polite">
      <TodoItem
        v-for="todo in filteredTodos"
        :key="todo.id"
        :modelValue="todo"
        @update:modelValue="updateTodo"
        @delete="deleteTodo(todo.id)"
      />
    </ul>
    <p v-else class="empty">No tasks yet. Add something to get started!</p>

    <div class="actions">
      <button type="button" class="secondary-btn" @click="markAll(true)" :disabled="!todoList.length">
        Mark all complete
      </button>
      <button type="button" class="secondary-btn" @click="markAll(false)" :disabled="!todoList.length">
        Reset all
      </button>
      <button
        type="button"
        class="secondary-btn"
        @click="clearCompleted"
        :disabled="completed === 0"
      >
        Clear completed
      </button>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import TodoItem from './components/TodoItem.vue'

const draft = ref('')
const filter = ref('all')
const todoList = ref(loadTodos())

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
]

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

const filteredTodos = computed(() => {
  if (filter.value === 'active') return todoList.value.filter((todo) => !todo.completed)
  if (filter.value === 'completed') return todoList.value.filter((todo) => todo.completed)
  return todoList.value
})

const completed = computed(() => todoList.value.filter((todo) => todo.completed).length)
const remaining = computed(() => todoList.value.length - completed.value)

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
