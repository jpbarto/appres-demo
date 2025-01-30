import { Server } from './Server.js';

const upstream = 'gateway';
const downstream = 'app-server';
const nodeName = 'web-server';
const server = new Server (upstream, downstream, nodeName, postMessage.bind (this));

addEventListener ('message', server.onMessage.bind (server));

server.start ();