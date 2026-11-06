<script setup>
import { defineEmits, defineProps } from 'vue';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);
</script>

<template>
  <div class="sidebar-shell">
    <aside
      id="sidebar"
      class="sidebar-container"
      :class="{ 'translate-x-0': isOpen }"
    >
      <div>
        <div class="sidebar-header">
          <div class="flex items-center gap-3">
            <div class="brand-icon">
              <i class="fa-solid fa-chart-line"></i>
            </div>
            <span class="font-bold text-lg text-slate-800 dark:text-white tracking-tight">
              HelpEngine
            </span>
          </div>
          <button
            @click="emit('close')"
            class="md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400"
          >
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <nav class="p-4 space-y-1.5">
          <p class="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Módulos Principais
          </p>

          <router-link
            to="/dashboard"
            class="nav-item"
            active-class="nav-item-active"
            exact-active-class="nav-item-active"
          >
            <i class="fa-solid fa-chart-line w-5 text-center text-base"></i>
            <span>Home</span>
          </router-link>

          <router-link
            to="/dashboard/employees"
            class="nav-item"
            active-class="nav-item-active"
            exact-active-class="nav-item-active"
          >
            <i class="fa-solid fa-users w-5 text-center text-base"></i>
            <span>Funcionários</span>
          </router-link>

          <router-link
            to="/dashboard/costs"
            class="nav-item"
            active-class="nav-item-active"
          >
            <i class="fa-solid fa-calculator w-5 text-center text-base"></i>
            <span>Custos & ML</span>
          </router-link>

          <router-link
            to="/dashboard/betting-slips"
            class="nav-item"
            active-class="nav-item-active"
          >
            <i class="fa-solid fa-receipt w-5 text-center text-base"></i>
            <span>Boletas & Títulos</span>
          </router-link>

          <router-link
            to="/dashboard/invoicing"
            class="nav-item"
            active-class="nav-item-active"
          >
            <i class="fa-solid fa-file-invoice-dollar w-5 text-center text-base"></i>
            <span>Faturamento</span>
          </router-link>
        </nav>
      </div>

      <div class="sidebar-footer">
        <div class="flex items-center justify-between text-xs mb-2">
          <span class="text-slate-500 dark:text-slate-400 font-medium">Gateway API:</span>
          <span class="status-badge">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
            Conectado (8000)
          </span>
        </div>
        <p class="text-[11px] text-slate-400 dark:text-slate-500 truncate" title="http://localhost:8000/api/v1">
          http://localhost:8000/api/v1
        </p>
      </div>
    </aside>

    <div
      v-if="isOpen"
      @click="emit('close')"
      class="fixed inset-0 bg-slate-900/50 z-20 md:hidden"
    ></div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/sidebar.scss';
</style>

