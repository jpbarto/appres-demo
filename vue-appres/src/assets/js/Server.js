import { NetworkRequest, NetworkResponse } from './Network.js';

export function Server(upstream, downstream, nodeName, postMessage) {
    this.upstream = upstream;
    this.downstream = downstream;
    this.nodeName = nodeName;
    this.postMessage = postMessage;

    this.clientMsgQueue = [];
    this.workingQueue = [];
    this.downMsgQueue = [];

    this.stats = {
        latencies: [], // a history since lastUpdate of time taken to respond to a request
        upRqstCount: 0, // number of requests sent from upstream
        upRespCount: 0, // number of responses sent to upstream
        downRqstCount: 0, // number of requests sent downstream
        downRespCount: 0, // number of responses from downstream
        upErr: 0, // number of errors returned to the upstream
        downErr: 0, // number of errors received from downstream
        lastUpdate: Date.now()
    }

    this.sendStats = function () {
        this.postMessage({ node: this.nodeName, stats: this.stats });
        this.resetStats();
        this.stats.lastUpdate = Date.now();
    }

    this.resetStats = function () {
        this.stats.latencies.length = 0;
        this.stats.upRqstCount = 0;
        this.stats.upRespCount = 0;
        this.stats.downRqstCount = 0;
        this.stats.downRespCount = 0;
        this.stats.upErr = 0;
        this.stats.downErr = 0;
        this.stats.lastUpdate = Date.now();
    }

    this.doWork = function () {
        var clientRequest;
        var clientResponse;

        if (this.clientMsgQueue.length > 0) {
            clientRequest = this.clientMsgQueue.shift();
            this.workingQueue.push(clientRequest);

            if (this.downstream != null) {
                var downRequest = new NetworkRequest(this.downstream, this.nodeName);
                downRequest.traceId = clientRequest.traceId;
                this.postMessage(downRequest);
                this.stats.downRqstCount++;
            } else {
                // I must be a data server, we just do work and reply, no downstream
                clientResponse = new NetworkResponse(this.upstream, this.nodeName, clientRequest.traceId, { result: 'success' });
                this.postMessage(clientResponse);
            }
        }

        if (this.downMsgQueue.length > 0) {
            // get the downstream response from the queue and find its matching client request (based on trace id)
            var downResponse = this.downMsgQueue.shift();
            var clientRequestIndex = this.workingQueue.findIndex((request) => request.traceId == downResponse.traceId);
            clientRequest = this.workingQueue.splice(clientRequestIndex, 1)[0];
            // craft a response for the client and send it
            clientResponse = new NetworkResponse(this.upstream, this.nodeName, clientRequest.traceId, downResponse.data);
            this.postMessage(clientResponse);
            this.stats.upRespCount++;
            this.stats.latencies.push(Date.now() - clientRequest.received);
        }

        setTimeout(this.doWork.bind(this), 2);
    };

    this.onMessage = function (msg) {
        const request = msg.data;
        request.received = Date.now();

        if (request.from == this.downstream) {
            this.downMsgQueue.push(request);
            this.stats.downRespCount++;
        } else if (request.from == this.upstream) {
            this.clientMsgQueue.push(request);
            this.stats.upRqstCount++;
        }
    };

    setInterval(this.sendStats.bind(this), 5000);
}