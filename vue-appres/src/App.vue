<template>
  <header>Resilience Playground</header>
  <div id="console">
    <div id="statsConsole">
      <LoadStats :stats-board="loadStatsBoard" :worker="loadgen" />
      <NodeStats :stats-board="gwStatsBoard" :worker="gateway" />
      <!--
      <node-stats :worker="websvr" />
      <node-stats :worker="appsvr" />
      <node-stats :worker="datasvr" /> -->
      Hello World
    </div>
  </div>
</template>

<script>
// import { ref } from 'vue';

import NodeStats from './components/NodeStats.vue'
import LoadStats from './components/LoadStats.vue';
import * as jsNetwork from './assets/js/Network.js';
import * as StatsMan from './assets/js/StatsMan.js';

const network = new jsNetwork.Network();
network.latency = 1;
network.jitter = 1;

const datasvr = new Worker(new URL('./assets/js/DataServer.js', import.meta.url));
datasvr.nodeDisplayName = 'Data Server';
datasvr.nodeName = 'data-server';
const appsvr = new Worker(new URL('./assets/js/AppServer.js', import.meta.url));
appsvr.nodeDisplayName = 'App Server';
appsvr.nodeName = 'app-server';
const websvr = new Worker(new URL('./assets/js/WebServer.js', import.meta.url));
websvr.nodeDisplayName = 'Web Server';
websvr.nodeName = 'web-server';
const gateway = new Worker(new URL('./assets/js/GatewayServer.js', import.meta.url));
gateway.nodeDisplayName = 'Gateway';
gateway.nodeName = 'gateway';
const loadGen = new Worker(new URL('./assets/js/LoadGenerator.js', import.meta.url));
loadGen.nodeDisplayName = 'Load Generator';
loadGen.nodeName = 'load-generator';

network.addNode(datasvr.nodeName, datasvr);
network.addNode(appsvr.nodeName, appsvr);
network.addNode(websvr.nodeName, websvr);
network.addNode(gateway.nodeName, gateway);
network.addNode(loadGen.nodeName, loadGen);

const statsMan = new StatsMan.StatsMan();
statsMan.addNode(datasvr);
statsMan.addNode(appsvr);
statsMan.addNode(websvr);
statsMan.addNode(gateway);
statsMan.addNode(loadGen);
// const loadStatsBoard = statsMan.loadStatsBoard;
const gwStatsBoard = statsMan.nodeStats[gateway.nodeName];
const loadStatsBoard = statsMan.nodeStats[loadGen.nodeName];

loadGen.postMessage({
  command: 'setRequestsPerSecond',
  rps: 25
});

export default {
  name: 'App',
  components: {
    NodeStats,
    LoadStats,
  },
  data() {
    return {
      // loadStatsBoard: statsMan.nodeStats['load-generator'],
      loadStatsBoard: loadStatsBoard,
      gwStatsBoard: gwStatsBoard,
      gateway: gateway,
      websvr: websvr,
      appsvr: appsvr,
      datasvr: datasvr,
      loadgen: loadGen
    }
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
