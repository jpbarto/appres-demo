importScripts("./Network.js");

upstream = 'app-server';
nodeName = 'data-server';
clientMsgQueue = [];

function doWork () {
    if (clientMsgQueue.length > 0) {
        clientRequest = clientMsgQueue.shift ();
        clientResponse = new NetworkResponse (upstream, nodeName, clientRequest.traceId, {result: 'success'});
        postMessage (clientResponse);
    }

    setTimeout(this.doWork, 2);
}

onmessage = function (msg) {
    request = msg.data;

    if (request.from == upstream) {
        clientMsgQueue.push (request);
    }
};

doWork ();