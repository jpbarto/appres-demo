importScripts("./Network.js");

upstream = 'load-generator';
downstream = 'web-server';
nodeName = 'gateway';
clientMsgQueue = [];
workingQueue = [];
downMsgQueue = [];

stats = {
    latencies: [], // a history since lastUpdate of time taken to respond to a request
    upRqstCount: 0, // number of requests sent from upstream
    upRespCount: 0, // number of responses sent to upstream
    downRqstCount: 0, // number of requests sent downstream
    downRespCount: 0, // number of responses from downstream
    upErr: 0, // number of errors returned to the upstream
    downErr: 0, // number of errors received from downstream
    lastUpdate: Date.now ()
}

function sendStats () {
    postMessage ({node: nodeName, stats: stats});
    stats.latencies.length = 0;
    stats.upRqstCount = 0;
    stats.upRespCount = 0;
    stats.downRqstCount = 0;
    stats.downRespCount = 0;
    stats.upErr = 0;
    stats.downErr = 0;
    stats.lastUpdate = Date.now ();
}
setInterval(sendStats, 3000);

function doWork () {
    if (clientMsgQueue.length > 0) {
        clientRequest = clientMsgQueue.shift ();
        workingQueue.push (clientRequest);

        downRequest = new NetworkRequest (downstream, nodeName);
        downRequest.traceId = clientRequest.traceId;
        postMessage (downRequest);
        this.stats.downRqstCount++;
    }

    if (downMsgQueue.length > 0) {
        downResponse = downMsgQueue.shift ();
        clientRequestIndex = workingQueue.findIndex ((request) => request.traceId == downResponse.traceId);
        clientRequest = workingQueue.splice(clientRequestIndex, 1)[0];
        clientResponse = new NetworkResponse (upstream, nodeName, clientRequest.traceId, downResponse.data);
        postMessage (clientResponse);
        this.stats.upRespCount++;
        this.stats.latencies.push (Date.now () - clientRequest.created);
    }

    setTimeout(this.doWork, 2);
}

addEventListener ('message', function (msg) {
    request = msg.data;

    if (request.from == downstream) {
        downMsgQueue.push (request);
        this.stats.downRespCount++;
    }else if (request.from == upstream) {
        clientMsgQueue.push (request);
        this.stats.upRqstCount++;
    }
});

doWork ();