///<reference path='node.d.ts'/>
import http = module("http");
import path = module("path");
import fs = module("fs");

var mimeTypes = {
    ".js": "text/javascript",
    ".html": "text/html",
    ".css": "text/css"
};
var cache = {};

http.createServer(function (request, response) {
    var lookup = path.basename(decodeURI(request.url)) || "index.html";
    var f = "content/" + lookup;
    fs.exists(f, function (exists) {
        if (exists) {
            var headers = { "Content-type": mimeTypes[path.extname(lookup)] };
            if (cache[f]) {
                response.writeHead(200, headers);
                response.end(cache[f].content);
            }
            var s = fs.createReadStream(f);
            s.once("open", function () {
                response.writeHead(200, headers);
                this.pipe(response);
            });
            s.once("error", function (e) {
                console.log(e);
                response.writeHead(500);
                response.end("Server error");
            });
            fs.stat(f, function (err, stats) {
                var bufferOffset = 0;
                cache[f] = { content: new Buffer(stats.size) };
                s.on("data", function (chunk) {
                    chunk.copy(cache[f].content, bufferOffset);
                    bufferOffset += chunk.length;
                });
            });
            return;
        }
        response.writeHead(404);
        response.end();
    });
}).listen(8080);