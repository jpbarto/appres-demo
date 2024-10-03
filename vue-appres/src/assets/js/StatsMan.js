import { ref } from 'vue';

export class StatsMan {
    constructor() {
        this.nodeStats = {};

        this.loadStatsBoard = ref({a: 'b', downRqstCount: 9});
    }

    addNode(node) {
        this.nodeStats[node.nodeName] = ref ({});
        node.addEventListener('message', this.updateNodeStats.bind(this));
    }

    updateNodeStats(message) {
        if ('stats' in message.data) {
            var nodeName = message.data.nodeName;
            var nodeStats = message.data.stats;

            this.nodeStats[nodeName].value.upLatencies = nodeStats.upLatencies;
            this.nodeStats[nodeName].value.upRqstCount = nodeStats.upRqstCount;
            this.nodeStats[nodeName].value.upRespCount = nodeStats.upRespCount;
            this.nodeStats[nodeName].value.upErr = nodeStats.upErr;
            this.nodeStats[nodeName].value.downRqstCount = nodeStats.downRqstCount;
            this.nodeStats[nodeName].value.downRespCount = nodeStats.downRespCount;
            this.nodeStats[nodeName].value.downErr = nodeStats.downErr;
            this.nodeStats[nodeName].value.lastUpdate = nodeStats.lastUpdate;

            // console.log ('got stats update', message.data);
            // console.log('updated stats for', nodeName, 'to', this.nodeStats[nodeName]);
        }
    }
}