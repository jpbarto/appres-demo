<template>
  <div>
    <div id="loadIcon"></div>
    <div id="nodeStats" class="statWindow">
      <div class="statTitle">Load Generator</div>
      <div class="statLine">
        <span class="statLabel">Requests / sec</span>
        <span id="gwThroughput" class="statValue">{{ loadGenState.requestsPerSec }} TPS</span>
      </div>
      <div class="statLine">
        <span class="statLabel">Errors</span>
        <span id="gwLatMean" class="statValue">{{ loadGenState.recvCount }}</span>
      </div>
      <div class="statLine">
        <span class="statLabel">Latency Mean</span>
        <span id="gwLatMean" class="statValue">{{ Math.round(loadGenState.latencies[0]) }} ms</span>
      </div>
    </div>
  </div>
</template>

<script>
// import { calcAverage, calcQuartile } from '@/assets/js/Statistics';

export default {
  name: 'LoadStats',
  props: {
    loadGenState: Object
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div#loadIcon {
  width: 6em;
  height: 6em;
  display: inline-block;
  background: #75a;
  margin-left: 2.5em;
}

div.statWindow {
  border: 1px solid black;
  padding: 5px;
  width: 11em;
  margin-top: 20px;
}

span.statLabel {
  text-align: left;
  width: 8em;
  display: inline-block;
}

span.statValue {
  color: blue;
}
</style>
