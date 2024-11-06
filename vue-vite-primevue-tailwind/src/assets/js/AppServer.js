import { Server } from "./Server.js";

const upstream = 'web-server';
const downstream = 'data-server';
const nodeName = 'app-server';
const server = new Server (upstream, downstream, nodeName, postMessage.bind (this));

addEventListener ('message', server.onMessage.bind (server));

server.start ();