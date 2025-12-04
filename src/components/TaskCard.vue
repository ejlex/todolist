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
        <button
          class="status-toggle icon-only"
          type="button"
          :aria-label="props.modelValue.status === 'completed' ? 'Mark pending' : 'Mark complete'"
          :title="props.modelValue.status === 'completed' ? 'Mark pending' : 'Mark complete'"
          @click="cycleStatus"
        >
          <span class="status-indicator" :class="{ done: props.modelValue.status === 'completed' }">
            <svg v-if="props.modelValue.status === 'completed'" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M20 6.5 9.5 17 4 11.5l1.5-1.5 4 4L18.5 5z"
                fill="currentColor"
              />
            </svg>
          </span>
        </button>
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
      </div>
      <div v-else class="card-content">
        <h3>{{ modelValue.title }}</h3>
        <p class="description">{{ modelValue.description || 'No description provided yet.' }}</p>
      </div>

      <div class="card-actions">
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
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
]

const formattedDate = computed(() => new Date(props.modelValue.createdAt).toLocaleString())
const previewImage = computed(() => draft.image || props.modelValue.image || '')
const statusLabel = computed(() => statuses.find((status) => status.value === props.modelValue.status)?.label || 'Todo')
const statusClass = computed(() => `status-${props.modelValue.status}`)

watch(
  () => props.modelValue,
  (value) => {
    Object.assign(draft, value)
  }
)

const cycleStatus = () => {
  const next = props.modelValue.status === 'pending' ? 'completed' : 'pending'
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
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  justify-content: flex-end;
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

.status-toggle {
  display: inline-flex;
  align-items: center;
  border: none;
  padding: 8px;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  color: #0f172a;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.08s ease;
}

.status-toggle.icon-only {
  width: 44px;
  height: 44px;
  justify-content: center;
}

.status-toggle:hover {
  transform: translateY(-1px);
  border-color: #94a3b8;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

.status-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #e2e8f0;
  color: #10b981;
}

.status-indicator.done {
  background: #dcfce7;
}

.status-indicator svg {
  width: 16px;
  height: 16px;
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
  min-height: 50px;
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

.status-pending {
  border-color: #c7d2fe;
}

.status-completed {
  border-color: #bbf7d0;
  background: #f0fdf4;
}
</style>
