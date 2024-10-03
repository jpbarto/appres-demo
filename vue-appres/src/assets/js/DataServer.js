import { Server } from './Server.js';

const upstream = 'app-server';
const downstream = null;
const nodeName = 'data-server';
const server = new Server (upstream, downstream, nodeName, postMessage.bind (this));

addEventListener ('message', server.onMessage.bind (server));

server.start ();