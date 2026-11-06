<template>
  <div class="chart-grid">
    <slot />
  </div>
</template>

<style lang="scss">
.chart-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
