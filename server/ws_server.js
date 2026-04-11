import { WebSocketServer } from 'ws';

var PORT = 8180;
console.log("Websocket server v0.0.1");
console.log(`Usage: ws-server [-p PORT],  defaults to ${PORT}`);
for (var a = 1; a < process.argv.length; ++a) {
    if (process.argv[a] == "-p") {
        if (process.argv.length > (a + 1)) {
            PORT = process.argv[++a];
        } else {
            process.exit(1);
        }
    }
}

const wss = new WebSocketServer({ port: PORT, clientTracking: true });

console.log(` waiting on port ${PORT}`);
wss.on('connection', function connection(ws, req) {
    ws.on("message", function message(data, isBinary) {
        const json = JSON.parse(data);
        console.log(`Received message: ${data}`);
        switch (json["action"]) {
            case "update":
                console.log("broadcasting...");
                wss.clients.forEach(function each(client) {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(data, { binary: isBinary });
                    }
                });
                break;
            case "register":
                console.log("register:", json["type"]);
                break;
            default:
        }
    });
    ws.on('error', console.error);
    console.log(`new connection: ${req.socket.remoteAddress}`);
});
