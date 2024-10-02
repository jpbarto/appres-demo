import { NetworkRequest } from './Network.js';

export function LoadGeneratorState () {
    this.requestsPerSec = 1;
    this.errorCount = 0;
    this.recvCount = 0;
    this.requestQueue = [];
    this.latencies = [];
}

export function LoadGenerator(lgState) {
    this.state = lgState;
    this._intervalId = 0;

    this.setRequestsPerSecond = function (rps) {
        clearInterval(this._intervalId);
        this.state.requestsPerSec = rps;
        this._intervalId = setInterval(this.sendMessage.bind(this), (1000 / this.state.requestsPerSec));
    }

    this.sendMessage = function () {
        const rqst = new NetworkRequest('gateway', 'load-generator');
        this.state.requestQueue.push (rqst);
        this.netsend({ data: rqst });
    }

    this.start = function () {
        this._intervalId = setInterval(this.sendMessage.bind(this), (1000 / this.state.requestsPerSec));
    };

    this.addEventListener = function (evtype, handler) {
        this.netsend = handler;
    }

    this.postMessage = function (msg) {
        if (msg.to == 'load-generator') {
            var origRqstIndex = this.state.requestQueue.findIndex((request) => request.traceId == msg.traceId);
            var origRqst = this.state.requestQueue.splice(origRqstIndex, 1)[0];
            this.latencies.push (Date.now () - origRqst.created);
            this.state.recvCount++;
        }
    }
}