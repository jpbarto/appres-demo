<template>
  <PrimePanel header="Load Generator">
    <div>
      <div id="nodeStats" class="statWindow">
        <table>
          <tbody>
            <tr>
              <td>
                <label for="rpsSetting">Load RPS:</label>
              </td>
              <td>
                <PrimeInputNumber
                  v-model="loadRps"
                  inputId="rpsSetting"
                  suffix=" rps"
                  style="width: 5rem"
                  fluid
                />
              </td>
            </tr>
            <tr>
              <td><span class="statLabel">Requests / sec</span></td>
              <td>
                <span id="gwThroughput" class="statValue">{{
                  statsBoard.rps
                }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="statLabel">Errors</span>
              </td>
              <td>
                <span id="gwLatMean" class="statValue">{{
                  statsBoard.downErr
                }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="statLabel">Latency Mean</span>
              </td>
              <td>
                <span id="gwLatMean" class="statValue">
                  {{ statsBoard.latMean }} ms
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="statLabel">Latency P50</span>
              </td>
              <td>
                <span id="gwLatPercentiles" class="statValue">
                  {{ statsBoard.latP50 }} ms
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="statLabel">Latency P90</span>
              </td>
              <td>
                <span id="gwLatPercentiles" class="statValue">
                  {{ statsBoard.latP90 }} ms
                  </span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="statLabel">Latency P100</span>
              </td>
              <td>
                <span id="gwLatPercentiles" class="statValue"
                  >{{ statsBoard.latP100 }} ms</span
                >
              </td>
            </tr>
            <tr>
              <td>
                <span class="statLabel">Last Update</span>
              </td>
              <td>
                <span id="gwLatMean" class="statValue">
                  {{
                    new Date(statsBoard.lastUpdate).toLocaleTimeString(
                      "en-us",
                      {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }
                    )
                  }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <!--
        <div>
          Load RPS:
          <input size=4
            @change="event => worker.postMessage({ command: 'setRequestsPerSecond', rps: event.target.value })"
            placeholder="0" />
        </div>
      --></div>
    </div>
  </PrimePanel>
</template>

<script setup>
import PrimePanel from "primevue/panel";
import PrimeInputNumber from "primevue/inputnumber";

const props = defineProps({
  statsBoard: Object,
  worker: Object,
});

const loadRps = defineModel({
  default: 0,
  set(v) {
    props.worker.postMessage({
      command: 'setRequestsPerSecond',
      rps: v
    })
    console.log ('got new value of', v);
    console.log (props.worker);
    console.log (props.worker.postMessage);
    return v;
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
span.statLabel {
  text-align: left;
  width: 8em;
  display: inline-block;
}

span.statValue {
  font-family: 'Courier New', Courier, monospace;
  color: #0f3;
  background-color: black;
  width: 80px;
  display: block;
}
</style>
