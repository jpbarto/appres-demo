import { Server } from './Server.js';

const upstream = 'load-generator';
const downstream = 'web-server';
const nodeName = 'gateway';
const server = new Server (upstream, downstream, nodeName, postMessage.bind (this));

addEventListener ('message', server.onMessage.bind (server));

server.start ();