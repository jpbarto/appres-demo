Worker1 = {
  downstream: null
}

Worker1.messageHandler = function (msg) {
  console.log('worker1 got message', msg.data);

  if (msg.data.type == 'set-downstream') {
    this.downstream = msg.data.port;
    this.downstream.start ();
    this.downstream.addEventListener ('message', this.recvDownstream);
    console.log ('worker 1 set downstream to', this.downstream);
  } else {
    if (this.downstream != null) {
      console.log ("worker 1 talking to downstream");
      this.downstream.postMessage ("hello from upstream");
    }
    postMessage("message from worker 1");
  }
};

Worker1.recvDownstream = function (msg) {
  console.log ("worker 1 got message from downstream", msg.data);
}

addEventListener("message", Worker1.messageHandler);
