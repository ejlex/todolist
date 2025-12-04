<template>
  <nav class="topbar">
    <div class="nav-left">
      <span class="app-title">My Todolist</span>
      <div class="nav-links" role="group" aria-label="Filter tasks">
        <button
          v-for="option in filters"
          :key="option.value"
          type="button"
          class="nav-link"
          :class="{ active: filter === option.value }"
          @click="$emit('update:filter', option.value)"
        >
          {{ option.label }}
          <span v-if="option.value !== 'completed'" class="count-pill">{{ option.count }}</span>
        </button>
      </div>
    </div>
    <div class="nav-right">
      <span class="candidate">{{ candidateName }}</span>
      <span class="logout">Log Out</span>
    </div>
  </nav>
</template>

<script setup>
const props = defineProps({
  filters: {
    type: Array,
    required: true,
  },
  filter: {
    type: String,
    required: true,
  },
  candidateName: {
    type: String,
    default: "Candidate",
  },
});

defineEmits(["update:filter"]);
</script>
