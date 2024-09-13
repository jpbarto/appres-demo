<template>
  <header>Resilience Playground</header>
  <div id="console">
    <div id="statsConsole">
    <LoadStats />
    <NodeStats nodeName="Gateway" />
    <NodeStats nodeName="Web Server" />
    <NodeStats nodeName="App Server" />
    <NodeStats nodeName="Data Server" />
    </div>
  </div>
</template>

<script>
import NodeStats from './components/NodeStats.vue'
import LoadStats from './components/LoadStats.vue';

export default {
  name: 'App',
  components: {
    NodeStats,
    LoadStats,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
  display: grid;
  place-content: center;
}

#statsConsole {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
  column-gap: 10px;
}
</style>
