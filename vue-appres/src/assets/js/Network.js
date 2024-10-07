/**
 * Network simulates an Ethernet network in JS. You can attach Web Workers to the 
 * network as nodes. As the workers pass messages the network routes these messages 
 * to the target node specified in the message.
 * 
 * This library does not go so far as to simulate TCP or UDP and acts more like a 
 * message bus. But it does allow you to simulate latency on the network, delays
 * in the passing of messages between nodes.
 * 
 * Not supported today:
 * - multicast
 */
class NetworkPacket {
    constructor(to, from, data) {
        this.to = to;
        this.from = from;
        this.data = data;
        this.created = Date.now();
    }
}

export class NetworkRequest extends NetworkPacket {
    constructor(to, from, data) {
        super(to, from, data);
        this.traceId = "trace-" + Math.random().toString(16).slice(2);
    }
}

export class NetworkResponse extends NetworkPacket {
    constructor(to, from, traceId, data) {
        super(to, from, data);
        this.traceId = traceId;
    }
}

export class Network {
    constructor(latency = 1, jitter = 1) {
        this.nodes = {};
        this.edgeLatencies = new Map();
        this.latency = latency;
        this.jitter = jitter;
    }

    addNode(name, worker) {
        this.nodes[name] = worker;
        worker.addEventListener('message', this._routeMessage.bind(this));
    }

    _getEdgeName (nodeA, nodeB) {
        return [nodeA, nodeB].sort().join('-');
    }

    setLatency (nodeA, nodeB, latency) {
        this.edgeLatencies.set(this._getEdgeName(nodeA, nodeB), latency);
    }

    _sendMessage(node, message) {
        if (node in this.nodes) {
            this.nodes[node].postMessage(message);
        }
    }

    _routeMessage(message) {
        if ('to' in message.data) {
            if (message.data.to in this.nodes) {
                // use the global latency as a base value
                var lag = this.latency;
                // if the edge has its own latency set use that instead of the global latency
                if (this.edgeLatencies.has(this._getEdgeName(message.data.from, message.data.to))) {
                    lag = this.edgeLatencies.get(this._getEdgeName(message.data.from, message.data.to));
                }
                // calculate overall lag using the global jitter value
                lag = this.lag - this.jitter + (2 * this.jitter * Math.random());
                setTimeout(this._sendMessage.bind(this), lag, message.data.to, message.data);
            } else {
                console.log(`Couldn't route message for ${message.data.to} in ${this.nodes}`);
            }
        }
    }
}