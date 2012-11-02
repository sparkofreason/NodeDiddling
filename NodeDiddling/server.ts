///<reference path='node.d.ts'/>
import http = module("http");

http.createServer(function (request, response) {
    response.writeHead(200, { "Content-type": "text/html" });
    response.end("Woohoo!");
}).listen(8080);