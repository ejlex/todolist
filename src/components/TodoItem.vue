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
      <span v-else>{{ modelValue.text }}</span>
    </div>

    <button class="delete" type="button" @click="$emit('delete')">✕</button>
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
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: transform 0.08s ease, border 0.15s ease, box-shadow 0.2s ease;
}

.todo:hover {
  transform: translateY(-1px);
  border-color: #cbd5e1;
  box-shadow: 0 8px 20px rgba(148, 163, 184, 0.2);
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
  border-color: #4f46e5;
  background: #eef2ff;
}

.todo.completed .checkbox span {
  background: #4f46e5;
}

.content {
  font-size: 16px;
  color: #0f172a;
}

.todo.completed .content span {
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

.delete {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  color: #cbd5e1;
  transition: color 0.15s ease, transform 0.1s ease;
}

.delete:hover {
  color: #ef4444;
  transform: scale(1.1);
}
</style>
