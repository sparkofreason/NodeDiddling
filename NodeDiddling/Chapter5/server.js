var http = require("http")
var WSServer = require("C:/Users/Dave/AppData/Roaming/npm-cache/websocket/1.0.7/package/lib/websocket").server;
var url = require("url")
var fs = require("fs")
var clientHtml = fs.readFileSync("client.html");
var plainHttpServer = http.createServer(function (request, response) {
    response.writeHead(200, {
        "Content-type": "text/html"
    });
    response.end(clientHtml);
});
plainHttpServer.listen(8080);
var webSocketServer = new WSServer({
    httpServer: plainHttpServer
});
var accept = [
    "localhost", 
    "127.0.0.1"
];
webSocketServer.on("request", function (request) {
    request.origin = request.origin || "*";
    if(accept.indexOf(url.parse(request.origin).hostname) === -1) {
        request.reject();
        console.log("disallowed: " + request.origin);
        return;
    }
    var websocket = request.accept(null, request.origin);
    websocket.on("message", function (msg) {
        console.log("Received: '" + msg.utf8Data + "' from " + request.origin);
        if(msg.utf8Data === "Hello") {
            websocket.send("Web sockets!");
        }
    });
    websocket.on("close", function (code, desc) {
        console.log("Disconnect: " + code + " - " + desc);
    });
});

