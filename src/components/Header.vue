<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  titulo: { type: String, default: 'Gestão & Indicadores' },
  modelValue: { type: String, default: 'TODOS' }
});

const emit = defineEmits(['open-sidebar', 'toggle-theme', 'update:modelValue']);

function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.classList.toggle('dark');
  root.dataset.theme = isDark ? 'dark' : 'light';
  emit('toggle-theme');
}
</script>

<template>
  <header class="header-container">
    <div class="header-left">
      <button @click="emit('open-sidebar')" class="mobile-menu-button" aria-label="Abrir menu lateral">
        <i class="fa-solid fa-bars text-xl"></i>
      </button>
      <h1 class="page-title">
        {{ titulo }}
      </h1>
    </div>

    <div class="header-actions">
      <div class="filter-wrapper hidden sm:block">
        <select
          :value="modelValue"
          @change="emit('update:modelValue', $event.target.value)"
          class="global-select"
        >
          <option value="TODOS">Todas as Filiais</option>
          <option value="CAONZE">Filial CAONZE</option>
          <option value="MESQUITA">Filial MESQUITA</option>
        </select>
      </div>

      <button @click="toggleTheme" class="theme-toggle" title="Alternar Tema" aria-label="Alternar tema">
        <i class="fa-solid fa-moon text-base dark:hidden"></i>
        <i class="fa-solid fa-sun text-base hidden dark:block"></i>
      </button>

      <div class="user-avatar-wrapper">
        <div class="user-avatar">AD</div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/assets/styles/header.scss';
</style>
