<template>
  <div>
    <div class="nodeIcon"></div>
  <div id="nodeStats" class="statWindow">
    <div class="statTitle">{{ nodeName }}</div>
    <div class="statLine">
      <span class="statLabel">Connections</span>
      <span id="gwConnections" class="statValue">1</span>
    </div>
    <div class="statLine">
      <span class="statLabel">Throughput</span>
      <span id="gwThroughput" class="statValue">1 TPS</span>
    </div>
    <div class="statLine">
      <span class="statLabel">Latency mean</span>
      <span id="gwLatMean" class="statValue">23 ms</span>
    </div>
    <div class="statLine">
      <span class="statLabel">Latency P50</span>
      <span id="gwLatPercentiles" class="statValue">23 ms</span>
    </div>
    <div class="statLine">
      <span class="statLabel">Latency P90</span>
      <span id="gwLatPercentiles" class="statValue">24 ms</span>
    </div>
    <div class="statLine">
      <span class="statLabel">Latency P100</span>
      <span id="gwLatPercentiles" class="statValue">26 ms</span>
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
export default {
  name: 'NodeStats',
  props: {
    nodeName: String
  }
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
