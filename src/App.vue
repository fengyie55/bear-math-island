<template>
  <div id="app">
    <GameUI />
  </div>
</template>

<script setup>
import GameUI from './components/GameUI.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>
