<script setup>
// Nenhuma lógica complexa necessária aqui no início
</script>

<template>
  <!-- O router-view carrega a rota ativa configurada no router/index.ts -->
  <router-view />
</template>

<style>
/* Estilos globais e resets básicos podem ficar aqui ou num main.scss */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

body {
  background-color: var(--bg-main, #f4f6f9);
  color: var(--text-main, #0f172a);
}
</style>