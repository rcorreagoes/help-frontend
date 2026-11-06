<script setup>
const props = defineProps({
  layout: {
    type: String,
    default: 'four',
    validator: (value) => ['four', 'two'].includes(value),
  },
});
</script>

<template>
  <div class="kpi-grid" :class="`kpi-grid--${props.layout}`">
    <slot />
  </div>
</template>

<style lang="scss">
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

.kpi-grid--two {
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.kpi-grid--four {
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
