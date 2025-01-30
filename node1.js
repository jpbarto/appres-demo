importScripts("./Network.js");

onmessage = function (msg) {
    console.log ('node 1 got message ', msg.data);
    rqst = new NetworkRequest ('node2', 'node1', 'hi from node 1');
    this.postMessage(rqst);
}