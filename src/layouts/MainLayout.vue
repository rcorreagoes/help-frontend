<script setup>
import { ref } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import Header from '@/components/Header.vue';

const isSidebarOpen = ref(false);
const filialSelecionada = ref('TODOS');
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen flex transition-colors duration-200">
    <!-- Menu Lateral -->
    <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Header Superior -->
      <Header
        v-model="filialSelecionada"
        @open-sidebar="isSidebarOpen = true"
      />

      <!-- Conteúdo Dinâmico (DashboardView, etc.) -->
      <main class="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        <router-view :filial="filialSelecionada" />
      </main>
    </div>
  </div>
</template>
