<template>
  <article class="task-card" :class="statusClass">
    <div class="card-media" v-if="previewImage">
      <img :src="previewImage" alt="Task visual" loading="lazy" />
    </div>
    <div class="card-body">
      <header class="card-head">
        <div>
          <p class="status-pill">{{ statusLabel }}</p>
          <p class="created">Created {{ formattedDate }}</p>
        </div>
        <button class="chip" type="button" @click="cycleStatus">{{ nextStatusLabel }}</button>
      </header>

      <div v-if="editing" class="card-form">
        <label>
          <span>Title</span>
          <input v-model.trim="draft.title" type="text" required />
        </label>
        <label>
          <span>Description</span>
          <textarea v-model.trim="draft.description" rows="3" />
        </label>
        <label>
          <span>Image URL</span>
          <input v-model.trim="draft.image" type="url" />
        </label>
        <label>
          <span>Status</span>
          <select v-model="draft.status">
            <option v-for="option in statuses" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </label>
      </div>
      <div v-else class="card-content">
        <h3>{{ modelValue.title }}</h3>
        <p class="description">{{ modelValue.description || 'No description provided yet.' }}</p>
      </div>

      <div class="card-actions">
        <button class="ghost" type="button" @click="$emit('duplicate')">Add</button>
        <button class="primary" type="button" @click="toggleEdit">{{ editing ? 'Save' : 'Edit' }}</button>
        <button class="danger" type="button" @click="$emit('delete')">Remove</button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'delete', 'duplicate'])
const editing = ref(false)

const draft = reactive({ ...props.modelValue })

const statuses = [
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
]

const formattedDate = computed(() => new Date(props.modelValue.createdAt).toLocaleString())
const previewImage = computed(() => draft.image || props.modelValue.image || '')
const statusLabel = computed(() => statuses.find((status) => status.value === props.modelValue.status)?.label || 'Todo')
const nextStatusLabel = computed(() => {
  if (props.modelValue.status === 'todo') return 'Start progress'
  if (props.modelValue.status === 'in-progress') return 'Mark complete'
  return 'Reopen'
})
const statusClass = computed(() => `status-${props.modelValue.status}`)

watch(
  () => props.modelValue,
  (value) => {
    Object.assign(draft, value)
  }
)

const cycleStatus = () => {
  const next =
    props.modelValue.status === 'todo'
      ? 'in-progress'
      : props.modelValue.status === 'in-progress'
        ? 'completed'
        : 'in-progress'
  emit('update:modelValue', { ...props.modelValue, status: next })
}

const toggleEdit = () => {
  if (editing.value) {
    emit('update:modelValue', { ...props.modelValue, ...draft })
    editing.value = false
    return
  }

  editing.value = true
}
</script>

<style scoped>
.task-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  min-height: 100%;
}

.card-media {
  width: 100%;
  height: 160px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.status-pill {
  margin: 0;
  font-weight: 700;
  color: #1e293b;
}

.created {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
}

.chip {
  border: 1px solid #cbd5e1;
  padding: 8px 12px;
  border-radius: 999px;
  background: #f8fafc;
  cursor: pointer;
  font-weight: 700;
  color: #475569;
}

.card-content h3 {
  margin: 0 0 6px;
  font-size: 20px;
  color: #0f172a;
}

.description {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}

.card-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
  color: #475569;
}

.card-form input,
.card-form textarea,
.card-form select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 15px;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.card-actions button {
  flex: 1;
  border: none;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.15s ease;
}

.card-actions button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

.ghost {
  background: #f8fafc;
  color: #0f172a;
  border: 1px solid #cbd5e1;
}

.primary {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #ffffff;
}

.danger {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecdd3;
}

.status-in-progress {
  border-color: #c7d2fe;
}

.status-completed {
  border-color: #bbf7d0;
  background: #f0fdf4;
}

.status-todo {
  border-color: #e2e8f0;
}
</style>
