<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'fa-solid fa-chart-bar',
  },
  centered: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <article class="chart-card">
    <h3 class="chart-title">
      <span>{{ props.title }}</span>
      <i :class="props.icon"></i>
    </h3>

    <div class="chart-wrap" :class="{ 'chart-wrap-center': props.centered }">
      <slot />
    </div>
  </article>
</template>

<style lang="scss">
.chart-card {
  padding: 1.25rem;
  background-color: var(--card-bg, #ffffff);
  border: 1px solid var(--card-border, #e2e8f0);
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.chart-title {
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary, #0f172a);
}

.chart-wrap {
  position: relative;
  height: 16rem;
}

.chart-wrap-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
