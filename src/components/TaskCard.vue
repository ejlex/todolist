<template>
  <article class="task-card" :class="statusClass">

    <div class="card-media">
      <img v-if="previewImage" :src="previewImage" alt="Task visual" loading="lazy" />
      <div v-else class="placeholder">320x200</div>
    </div>

    <div class="card-body">
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

      <p class="created">Created {{ formattedDate }}</p>

      <div class="card-actions">
        <button class="btn start" type="button" @click="cycleStatus">{{ statusLabel }}</button>
        <button class="btn remove" type="button" @click="$emit('delete')">Remove</button>
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
  { value: 'start', label: 'Start' },
  { value: 'pending', label: 'In progress' },
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
  if (props.modelValue.status === 'completed') return

  const currentIndex = statuses.findIndex((s) => s.value === props.modelValue.status)
  const next = statuses[currentIndex + 1] || statuses[0]
  emit('update:modelValue', { ...props.modelValue, status: next.value })
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
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #dadada;
  border-radius: 4px;
  background: #fff;
  min-height: 100%;
  height: 100%;
  padding: 5px;
}

.task-card.status-completed {
  background: #f7f7f7;
}

.created {
  color: #7a7a7a;
  margin: 0;
  font-size: 13px;
}

.card-media {
  width: 100%;
  max-width: 320px;
  height: 200px;
  border-top: 1px solid #ebebeb;
  border-bottom: 1px solid #ebebeb;
  display: grid;
  place-items: center;
  background: #efefef;
}

.card-media img {
  width: 100%;
  height: 100%;
  max-width: 320px;
  max-height: 200px;
  object-fit: cover;
}

.placeholder {
  color: #9a9a9a;
  font-weight: 700;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  flex: 1;
}

.card-content h3 {
  margin: 0 0 4px;
  font-size: 16px;
}

.description {
  margin: 0;
  color: #4c4c4c;
  line-height: 1.4;
  min-height: 48px;
}

.card-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-form label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-weight: 700;
  color: #4c4c4c;
  font-size: 13px;
}

.card-form input,
.card-form textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #c9c9c9;
  border-radius: 3px;
  font-size: 14px;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.btn {
  flex: 1;
  border: 1px solid transparent;
  padding: 8px;
  border-radius: 3px;
  font-weight: 700;
  cursor: pointer;
}

.btn.start {
  border-color: #2f8ed6;
  background: linear-gradient(#53a9e4, #2f8ed6);
  color: #fff;
}

.status-start .btn.start {
  border-color: #2f8ed6;
  background: linear-gradient(#53a9e4, #2f8ed6);
  color: #fff;
}

.status-pending .btn.start {
  border-color: #1f7a27;
  background: linear-gradient(#2fbf3a, #1f7a27);
  color: #fff;
}

.status-completed .btn.start {
  border-color: #b3b3b3;
  background: linear-gradient(#f3f3f3, #cfcfcf);
  color: #4c4c4c;
}

.btn.remove {
  border-color: #cf4436;
  background: linear-gradient(#e96b60, #cf4436);
  color: #fff;
}
</style>
