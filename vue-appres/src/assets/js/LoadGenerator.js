import { Server } from './Server.js';
import { NetworkRequest } from './Network.js';

const upstream = null;
const downstream = 'gateway';
const nodeName = 'load-generator';
const server = new Server(upstream, downstream, nodeName, postMessage.bind(this));
// eslint-disable-next-line
var intervalId;
var requestsPerSec = 0;

addEventListener('message', server.onMessage.bind(server));

server.start();

function setRequestsPerSecond(rps) {
    clearInterval(intervalId);
    requestsPerSec = rps;
    if (requestsPerSec > 0) {
        intervalId = setInterval(sendLoadMessage, (1000 / requestsPerSec));
    }
}

// eslint-disable-next-line
function sendLoadMessage() {
    const rqst = new NetworkRequest(downstream, nodeName);
    rqst.received = Date.now ();
    server.sendMessage(rqst);
}

function handleCommandMessage (msg) {
    switch (msg.data.command) {
        case 'setRequestsPerSecond':
            setRequestsPerSecond(msg.data.rps);
            break;
    }
}
addEventListener('message', handleCommandMessage);