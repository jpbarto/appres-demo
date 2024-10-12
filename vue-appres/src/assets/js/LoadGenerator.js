import { Server } from './Server.js';
import { NetworkRequest } from './Network.js';

const upstream = null;
const downstream = 'gateway';
const nodeName = 'load-generator';
const server = new Server(upstream, downstream, nodeName, postMessage.bind(this));
// eslint-disable-next-line
var intervalId;
var intervalCount = 10;
var intervalCurr = 0;
var msgSentCount = 0;
var requestsPerSec = 0;

server.start();

/**
 * By sending 1 message every 1000/rps ms we start to see a slow down where, at 25 rps, 
 * we only send 24 rps. Further profiling would be required but its assumed that this is
 * due to small amounts of time lost by this thread in contention with other workers.
 * To correct this we will instead send batches of messages at 100ms intervals (10 times a second).
 */
function setRequestsPerSecond(rps) {
    clearInterval(intervalId);
    requestsPerSec = rps;
    if (requestsPerSec > 0) {
        intervalId = setInterval(sendLoadMessage, 1000/intervalCount);
    }
}

// eslint-disable-next-line
function sendLoadMessage() {
    if (intervalCurr >= intervalCount) {
        intervalCurr = 0;
    }
    if (msgSentCount >= requestsPerSec) {
        msgSentCount = 0;
    }
    const msgSendThisRound = Math.round((requestsPerSec - msgSentCount)/(intervalCount - intervalCurr));
    for (let i = 0; i < msgSendThisRound; i++) {
        const rqst = new NetworkRequest(downstream, nodeName);
        rqst.received = Date.now();
        server.sendMessage(rqst);
        msgSentCount++;
    }
    intervalCurr++;
}

function handleCommandMessage(msg) {
    if ('from' in msg.data) {
        server.onMessage(msg);
    } else {
        switch (msg.data.command) {
            case 'setRequestsPerSecond':
                setRequestsPerSecond(msg.data.rps);
                break;
        }
    }
}
addEventListener('message', handleCommandMessage);