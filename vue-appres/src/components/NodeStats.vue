<template>
  <div>
    <div class="nodeIcon"></div>
    <div id="nodeStats" class="statWindow">
      <div class="statTitle">{{ worker.nodeName }}</div>
      <div class="statLine">
        <span class="statLabel">Connections</span>
        <span id="gwConnections" class="statValue">{{ nodeConnections }}</span>
      </div>
      <div class="statLine">
        <span class="statLabel">Throughput</span>
        <span id="gwThroughput" class="statValue">{{ nodeThroughput }} TPS</span>
      </div>
      <div class="statLine">
        <span class="statLabel">Latency Mean</span>
        <span id="gwLatMean" class="statValue">{{ nodeLatMean }} ms</span>
      </div>
      <div class="statLine">
        <span class="statLabel">Latency P50</span>
        <span id="gwLatPercentiles" class="statValue">{{ nodeLatP50 }} ms</span>
      </div>
      <div class="statLine">
        <span class="statLabel">Latency P90</span>
        <span id="gwLatPercentiles" class="statValue">{{ nodeLatP90 }} ms</span>
      </div>
      <div class="statLine">
        <span class="statLabel">Latency P100</span>
        <span id="gwLatPercentiles" class="statValue">{{ nodeLatP100 }} ms</span>
      </div>
      <div class="statLine">
        <span class="statLabel">Service</span>
        <span id="gwService" class="statValue">1.000</span>
      </div>
      <div class="statLine">
        <span class="statLabel">Client</span>
        <span id="gwClient" class="statValue">1.000</span>
      </div>
      <div class="statLine">
        <span class="statLabel">QoS</span>
        <span id="gwQos" class="statValue">1.000</span>
      </div>
    </div>
  </div>
</template>

<script>
// import { ref } from 'vue';
import { calcAverage, calcQuartile } from '@/assets/js/Statistics';

function updateStats(msg) {
  if (msg.data.node == this.$props.worker.nodeId) {
    const stats = msg.data.stats;
    const period = Date.now() - stats.lastUpdate;

    var connCount = stats.upRqstCount;
    var throughput = Math.round(stats.upRespCount / period * 1000);
    var latmean = Math.round(calcAverage(stats.latencies));
    var lat50 = Math.round(calcQuartile(stats.latencies, 50));
    var lat90 = Math.round(calcQuartile(stats.latencies, 90));
    var lat100 = Math.round(calcQuartile(stats.latencies, 100));

    this.nodeConnections = connCount;
    this.nodeThroughput = throughput;
    this.nodeLatMean = latmean;
    this.nodeLatP50 = lat50;
    this.nodeLatP90 = lat90;
    this.nodeLatP100 = lat100;
  }
}

export default {
  name: 'NodeStats',
  props: {
    worker: Object
  },
  data() {
    return {
      nodeConnections: 0,
      nodeThroughput: 0,
      nodeLatMean: 0,
      nodeLatP50: 0,
      nodeLatP90: 0,
      nodeLatP100: 0,
    };
  },
  created () {
    this.$props.worker.addEventListener('message', updateStats.bind (this));
  },
  // setup(props) {
  //   // props.worker.addEventListener('message', updateStats);
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.nodeIcon {
  width: 6em;
  height: 6em;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
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
