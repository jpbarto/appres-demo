importScripts("./Network.js");

onmessage = function (msg) {
    console.log ('node 2 got message', msg.data);
}