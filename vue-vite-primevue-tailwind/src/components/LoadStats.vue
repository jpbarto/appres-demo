<template>
  <PrimePanel header="Load Generator">
    <div>
      <div id="nodeStats" class="statWindow">
        <div>
          <label for="rpsSetting">Load RPS:</label>
          <PrimeInputNumber v-model="loadRps" inputId="rpsSetting" suffix=" rps" style="width: 5rem" fluid />
        </div>
        <div>
          Load RPS:
          <input size=4
            @change="event => worker.postMessage({ command: 'setRequestsPerSecond', rps: event.target.value })"
            placeholder="0" />
        </div>
        <div class="statLine">
          <span class="statLabel">Requests / sec</span>
          <span id="gwThroughput" class="statValue">{{ statsBoard.rps }}</span>
        </div>
        <div class="statLine">
          <span class="statLabel">Errors</span>
          <span id="gwLatMean" class="statValue">{{ statsBoard.downErr }}</span>
        </div>
        <div class="statLine">
          <span class="statLabel">Latency Mean</span>
          <span id="gwLatMean" class="statValue">{{ statsBoard.latMean }} ms</span>
        </div>
        <div class="statLine">
          <span class="statLabel">Latency P50</span>
          <span id="gwLatPercentiles" class="statValue">{{ statsBoard.latP50 }} ms</span>
        </div>
        <div class="statLine">
          <span class="statLabel">Latency P90</span>
          <span id="gwLatPercentiles" class="statValue">{{ statsBoard.latP90 }} ms</span>
        </div>
        <div class="statLine">
          <span class="statLabel">Latency P100</span>
          <span id="gwLatPercentiles" class="statValue">{{ statsBoard.latP100 }} ms</span>
        </div>
        <div class="statLine">
          <span class="statLabel">Last Update</span>
          <span id="gwLatMean" class="statValue">
            {{ new Date(statsBoard.lastUpdate).toLocaleTimeString('en-us', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) }}
          </span>
        </div>
      </div>
    </div>
  </PrimePanel>
</template>

<script setup>
  import {ref} from 'vue';
  import PrimePanel from 'primevue/panel';
  import PrimeInputNumber from 'primevue/inputnumber';

  const loadRps = ref(0);

  defineProps({
    statsBoard: Object,
    worker: Object
  })
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

span.statLabel {
  text-align: left;
  width: 8em;
  display: inline-block;
}

span.statValue {
  color: blue;
}
</style>
