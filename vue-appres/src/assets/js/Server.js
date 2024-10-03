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
        upRqstCount: 0, // number of requests sent from upstream
        upRespCount: 0, // number of responses sent to upstream
        upLatencies: [], // a history since lastUpdate of time taken to respond to a request (in milliseconds)
        upErr: 0, // number of errors returned to the upstream
        downRqstCount: 0, // number of requests sent downstream
        downRespCount: 0, // number of responses from downstream
        downErr: 0, // number of errors received from downstream
        lastUpdate: Date.now()
    }

    this.sendStats = function () {
        this.postMessage({ nodeName: this.nodeName, stats: this.stats });
        this.resetStats();
        this.stats.lastUpdate = Date.now();
    }

    this.resetStats = function () {
        this.stats.upRqstCount = 0;
        this.stats.upRespCount = 0;
        this.stats.upLatencies.length = 0;
        this.stats.upErr = 0;
        this.stats.downRqstCount = 0;
        this.stats.downRespCount = 0;
        this.stats.downErr = 0;
        this.stats.lastUpdate = Date.now();
    }

    this.processMessageQueues = function () {
        var clientResponse;

        if (this.clientMsgQueue.length > 0) {
            var clientRequest = this.clientMsgQueue.shift();

            if (this.downstream != null) {
                this.sendMessage(clientRequest);
            } else {
                // I must be a data server, we just do work and reply, no downstream
                clientResponse = new NetworkResponse(this.upstream, this.nodeName, clientRequest.traceId, { result: 'success' });
                this.postMessage(clientResponse);
                this.stats.upRespCount++;
                this.stats.upLatencies.push(Date.now() - clientRequest.received);
            }
        }

        if (this.downMsgQueue.length > 0) {
            // get the downstream response from the queue and find its matching client request (based on trace id)
            var downResponse = this.downMsgQueue.shift();
            var workRequestIndex = this.workingQueue.findIndex((request) => request.traceId == downResponse.traceId);
            var workRequest = this.workingQueue.splice(workRequestIndex, 1)[0];
            // craft a response for the client and send it
            if (this.upstream != null) {
                clientResponse = new NetworkResponse(this.upstream, this.nodeName, workRequest.traceId, downResponse.data);
                this.postMessage(clientResponse);
                this.stats.upRespCount++;
                this.stats.upLatencies.push(Date.now() - workRequest.received);
            }
        }

        setTimeout(this.processMessageQueues.bind(this), 2);
    };

    this.sendMessage = function (request) {
        this.workingQueue.push(request);
        var downRequest = new NetworkRequest(this.downstream, this.nodeName);
        downRequest.traceId = request.traceId;
        this.postMessage(downRequest);
        this.stats.downRqstCount++;
    }

    this.start = function () {
        this.processMessageQueues();
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