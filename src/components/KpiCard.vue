<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    default: 'R$ 0,00',
  },
  footnote: {
    type: String,
    default: '',
  },
  footnoteTone: {
    type: String,
    default: 'neutral',
    validator: (value) => ['positive', 'negative', 'neutral'].includes(value),
  },
  icon: {
    type: String,
    default: 'fa-solid fa-wallet',
  },
  accent: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'amber', 'green', 'purple'].includes(value),
  },
});
</script>

<template>
  <article class="kpi-card" :class="`kpi-card--${props.accent}`">
    <div class="kpi-header">
      <span class="kpi-label">{{ props.title }}</span>
      <span class="kpi-icon" :class="`icon-${props.accent}`">
        <i :class="props.icon"></i>
      </span>
    </div>

    <div class="kpi-value">{{ props.value }}</div>

    <p v-if="props.footnote" class="kpi-footnote" :class="`kpi-footnote--${props.footnoteTone}`">
      <slot name="footnote-prefix"></slot>
      {{ props.footnote }}
    </p>
  </article>
</template>

<style lang="scss">
.kpi-card {
  padding: 1.25rem;
  position: relative;
  overflow: hidden;
  background-color: var(--card-bg, #ffffff);
  border: 1px solid var(--card-border, #e2e8f0);
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.kpi-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.kpi-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted-text, #64748b);
}

.kpi-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
}

.kpi-card--blue .icon-blue,
.kpi-card--amber .icon-amber,
.kpi-card--green .icon-green,
.kpi-card--purple .icon-purple {
  background: rgba(148, 163, 184, 0.12);
}

.icon-blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.icon-amber { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.icon-green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.icon-purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }

.kpi-value {
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 700;
  color: var(--text-primary, #0f172a);
}

.kpi-footnote {
  font-size: 0.75rem;
  margin-top: 0.5rem;
  color: var(--muted-text, #64748b);
}

.kpi-footnote--positive {
  color: #059669;
}

.kpi-footnote--negative {
  color: #dc2626;
}
</style>
