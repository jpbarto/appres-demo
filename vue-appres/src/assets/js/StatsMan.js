import { ref } from 'vue';

export function sumArr(arr) {
    var a = arr.slice();
    return a.reduce(function (a, b) { return parseFloat(a) + parseFloat(b); });
}

export function sortArr(arr) {
    var ary = arr.slice();
    ary.sort(function (a, b) { return parseFloat(a) - parseFloat(b); });
    return ary;
}

export function calcAverage(arr) {
    var a = arr.slice();
    if (a.length) {
        const sum = sumArr(a);
        const avg = sum / a.length;
        return avg;
    }
    return false;
}

export function calcQuartile(arr, q) {
    var a = arr.slice();
    // Turn q into a decimal (e.g. 95 becomes 0.95)
    q = q / 100;

    // Sort the array into ascending order
    var data = sortArr(a);

    // Work out the position in the array of the percentile point
    var p = ((data.length) - 1) * q;
    var b = Math.floor(p);

    // Work out what we rounded off (if anything)
    var remainder = p - b;

    // See whether that data exists directly
    var retval = 0;
    if (data[b + 1] !== undefined) {
        retval = parseFloat(data[b]) + remainder * (parseFloat(data[b + 1]) - parseFloat(data[b]));
    } else {
        retval = parseFloat(data[b]);
    }
    if (isNaN(retval)) {
        return 0;
    }else{
        return retval;
    }
}

export class StatsMan {
    constructor() {
        this.nodeStats = {};
    }

    addNode(node) {
        this.nodeStats[node.nodeName] = ref ({});
        node.addEventListener('message', this.updateNodeStats.bind(this));
    }

    updateNodeStats(message) {
        if ('stats' in message.data) {
            var nodeName = message.data.nodeName;
            var nodeStats = message.data.stats;

            const lastUpdate = this.nodeStats[nodeName].value.lastUpdate;
            Object.keys(nodeStats).forEach((key) => {
                this.nodeStats[nodeName].value[key] = nodeStats[key];
            });
            const period = (nodeStats.lastUpdate - lastUpdate)/1000;
            this.nodeStats[nodeName].value.rps = Math.round(nodeStats.downRqstCount/period);
            this.nodeStats[nodeName].value.connections = Math.round(nodeStats.upRqstCount/period);
            this.nodeStats[nodeName].value.throughput = Math.round(nodeStats.upRespCount/period);
            this.nodeStats[nodeName].value.latMean = Math.round(calcAverage(nodeStats.latencies));
            this.nodeStats[nodeName].value.latP50 = Math.round(calcQuartile(nodeStats.latencies, 50));
            this.nodeStats[nodeName].value.latP90 = Math.round(calcQuartile(nodeStats.latencies, 90));
            this.nodeStats[nodeName].value.latP100 = Math.round(calcQuartile(nodeStats.latencies, 100));

            // console.log ('got stats update', message.data);
            // console.log('updated stats for', nodeName, 'to', this.nodeStats[nodeName]);
        }
    }
}