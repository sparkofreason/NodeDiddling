///<reference path='node.d.ts'/>
import http = module("http");
import path = module("path");
import fs = module("fs");

var mimeTypes = {
    ".js": "text/javascript",
    ".html": "text/html",
    ".css": "text/css"
};

http.createServer(function (request, response) {
    var lookup = path.basename(decodeURI(request.url)) || "index.html";
    var f = "content/" + lookup;
    fs.exists(f, function (exists) {
        if (exists) {
            fs.readFile(f, function (err, data) {
                if (err) {
                    response.writeHead(500);
                    response.end("Server error!");
                    return;
                }
                var headers = { "Content-type": mimeTypes[path.extname(lookup)] };
                response.writeHead(200, headers);
                response.end(data);
            });
            return;
        }
        response.writeHead(404);
        response.end();
    });
}).listen(8080);