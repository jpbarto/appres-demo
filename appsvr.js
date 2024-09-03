importScripts("./Network.js");

upstream = 'web-server';
downstream = 'data-server';
nodeName = 'app-server';
clientMsgQueue = [];
workingQueue = [];
downMsgQueue = [];

function doWork () {
    if (clientMsgQueue.length > 0) {
        clientRequest = clientMsgQueue.shift ();
        workingQueue.push (clientRequest);

        downRequest = new NetworkRequest (downstream, nodeName);
        downRequest.traceId = clientRequest.traceId;
        postMessage (downRequest);
    }

    if (downMsgQueue.length > 0) {
        downResponse = downMsgQueue.shift ();
        clientRequestIndex = workingQueue.findIndex ((request) => request.traceId == downResponse.traceId);
        clientRequest = workingQueue.splice(clientRequestIndex, 1)[0];
        clientResponse = new NetworkResponse (upstream, nodeName, clientRequest.traceId, downResponse.data);
        postMessage (clientResponse);
    }

    setTimeout(this.doWork, 2);
}

onmessage = function (msg) {
    request = msg.data;

    if (request.from == downstream) {
        downMsgQueue.push (request);
    }else if (request.from == upstream) {
        clientMsgQueue.push (request);
    }
};

doWork ();