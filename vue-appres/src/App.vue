<template>
  <header>Resilience Playground</header>
  <div id="console">
    <div id="statsConsole">
      <load-stats :load-gen-state="loadGenState"/>
      <node-stats :worker="gateway" />
      <node-stats :worker="websvr" />
      <node-stats :worker="appsvr" />
      <node-stats :worker="datasvr" />
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';

import NodeStats from './components/NodeStats.vue'
import LoadStats from './components/LoadStats.vue';
import * as jsNetwork from './assets/js/Network.js';
import * as loadGenerator from './assets/js/LoadGenerator.js';

const network = new jsNetwork.Network();
network.latency = 1;
network.jitter = 1;

const datasvr = new Worker(new URL('./assets/js/DataServer.js', import.meta.url));
datasvr.nodeName = 'Data Server';
datasvr.nodeId = 'data-server';
const appsvr = new Worker(new URL('./assets/js/AppServer.js', import.meta.url));
appsvr.nodeName = 'App Server';
appsvr.nodeId = 'app-server';
const websvr = new Worker(new URL('./assets/js/WebServer.js', import.meta.url));
websvr.nodeName = 'Web Server';
websvr.nodeId = 'web-server';
const gateway = new Worker(new URL('./assets/js/GatewayServer.js', import.meta.url));
gateway.nodeName = 'Gateway';
gateway.nodeId = 'gateway';

network.addNode("data-server", datasvr);
network.addNode("app-server", appsvr);
network.addNode("web-server", websvr);
network.addNode("gateway", gateway);

const loadGenState = reactive(new loadGenerator.LoadGeneratorState ());
loadGenState.requestsPerSec = 1;
const loadGen = new loadGenerator.LoadGenerator(loadGenState);
network.addNode('load-generator', loadGen);

export default {
  name: 'App',
  components: {
    NodeStats,
    LoadStats,
  },
  data () {
    return {
      loadGenState: loadGenState,
      gateway: gateway,
      websvr: websvr,
      appsvr: appsvr,
      datasvr: datasvr
    }
  },
  mounted() {
    loadGen.start();
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
