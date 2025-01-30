Worker2 = {
  downstream: null
}

Worker2.messageHandler = function (msg) {
  console.log('worker2 got message', msg.data);

  if (msg.data.type == 'set-downstream') {
    this.downstream = msg.data.port;
    this.downstream.start ();
    this.downstream.addEventListener ('message', this.recvDownstream);
    console.log ('worker 2 set downstream to', this.downstream);
  } else {
    postMessage("message from worker 2");
  }
};

Worker2.recvDownstream = function (msg) {
  console.log ("worker 2 got message from downstream", msg.data);
  this.downstream.postMessage ("hello from worker 2");
}

addEventListener("message", Worker2.messageHandler);
