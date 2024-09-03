function NetworkRequest(to, from, data) {
    this.to = to;
    this.from = from;
    this.traceId = "trace-" + Math.random().toString(16).slice(2);
    this.created = Date.now();
    this.data = data;
}

function NetworkResponse(to, from, traceId, data) {
    this.to = to;
    this.from = from;
    this.traceId = traceId;
    this.created = Date.now();
    this.data = data;
}

function Network() {
    this.nodes = {};
    this.latency = 0;
    this.jitter = 0;

    this.addNode = function (name, worker) {
        this.nodes[name] = worker;
        worker.addEventListener('message', this._routeMessage.bind(this));
    };

    this._sendMessage = function (node, message) {
        if (node in this.nodes) {
            this.nodes[node].postMessage(message);
        }
    }

    this._routeMessage = function (message) {
        if ('to' in message.data) {
            if (message.data.to in this.nodes) {
                lag = this.latency - this.jitter + (2 * this.jitter * Math.random());
                setTimeout(this._sendMessage.bind(this), lag, message.data.to, message.data);
            } else {
                console.log(`Couldn't route message for ${message.data.to} in ${this.nodes}`);
            }
        }
    };
}