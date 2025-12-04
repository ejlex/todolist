<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <input
      v-model.trim="form.title"
      type="text"
      name="title"
      autocomplete="off"
      placeholder="Task title"
      aria-label="Task title"
      ref="titleInput"
      required
    />
    <input
      v-model.trim="form.image"
      type="url"
      name="image"
      autocomplete="off"
      placeholder="Image URL (320x200)"
      aria-label="Task image URL"
    />
    <textarea
      v-model.trim="form.description"
      name="description-extended"
      rows="2"
      placeholder="Description"
      aria-label="Task description"
    />
    <button type="submit">Add task</button>
  </form>
</template>

<script setup>
import { reactive, ref } from "vue";

const emit = defineEmits(["submit"]);

const form = reactive({
  title: "",
  image: "",
  description: "",
});

const titleInput = ref(null);

const handleSubmit = () => {
  emit("submit", { ...form });
  form.title = "";
  form.image = "";
  form.description = "";
};

const focusTitle = () => {
  titleInput.value?.focus();
};

defineExpose({ focusTitle });
</script>
