<template>
  <li class="todo" :class="{ completed: modelValue.completed, editing }">
    <label class="checkbox">
      <input type="checkbox" :checked="modelValue.completed" @change="onToggle" />
      <span></span>
    </label>

    <div class="content" @dblclick="startEditing">
      <input
        v-if="editing"
        ref="editInput"
        v-model.trim="draftText"
        class="edit-input"
        @keyup.enter="save"
        @blur="save"
        @keyup.esc="cancel"
      />
      <p v-else class="text">{{ modelValue.text }}</p>
    </div>

    <div class="actions">
      <button type="button" class="chip" @click="toggleEditing" :aria-pressed="editing">
        {{ editing ? 'Save' : 'Edit' }}
      </button>
      <button class="chip danger" type="button" @click="$emit('delete')" aria-label="Delete task">Delete</button>
    </div>
  </li>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'delete'])
const editing = ref(false)
const draftText = ref(props.modelValue.text)
const editInput = ref(null)

const sanitizedDraft = computed(() => draftText.value.trim())

const focusInput = () => {
  nextTick(() => {
    editInput.value?.focus()
  })
}

const startEditing = () => {
  editing.value = true
  draftText.value = props.modelValue.text
  focusInput()
}

const toggleEditing = () => {
  if (editing.value) {
    save()
    return
  }

  startEditing()
}

const save = () => {
  if (!editing.value) return
  const nextText = sanitizedDraft.value
  editing.value = false

  if (!nextText) {
    emit('delete')
    return
  }

  emit('update:modelValue', { ...props.modelValue, text: nextText })
}

const cancel = () => {
  draftText.value = props.modelValue.text
  editing.value = false
}

const onToggle = () => {
  emit('update:modelValue', { ...props.modelValue, completed: !props.modelValue.completed })
}
</script>

<style scoped>
.todo {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
  transition: transform 0.08s ease, border 0.15s ease, box-shadow 0.2s ease;
}

.todo:hover {
  transform: translateY(-1px);
  border-color: #cbd5e1;
  box-shadow: 0 12px 26px rgba(148, 163, 184, 0.28);
}

.checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 2px solid #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.checkbox input {
  display: none;
}

.checkbox span {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: transparent;
  transition: background 0.15s ease;
}

.todo.completed .checkbox {
  border-color: #22c55e;
  background: #ecfdf3;
}

.todo.completed .checkbox span {
  background: #22c55e;
}

.content {
  font-size: 16px;
  color: #0f172a;
}

.text {
  margin: 0;
}

.todo.completed .text {
  color: #94a3b8;
  text-decoration: line-through;
}

.edit-input {
  width: 100%;
  padding: 10px 12px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  outline: none;
}

.actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.chip {
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  font-size: 14px;
  color: #0f172a;
  transition: color 0.15s ease, transform 0.1s ease, background 0.15s ease, border-color 0.15s ease;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 600;
}

.chip:hover {
  color: #2563eb;
  border-color: #bfdbfe;
  background: #f8fafc;
}

.chip.danger {
  color: #b91c1c;
  border-color: #fecdd3;
  background: #fff1f2;
}

.chip.danger:hover {
  color: #991b1b;
  border-color: #fecdd3;
  background: #ffe4e6;
}
</style>
