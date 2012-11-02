var http = require("http")
var path = require("path")
var fs = require("fs")
var mimeTypes = {
    ".js": "text/javascript",
    ".html": "text/html",
    ".css": "text/css"
};
var cache = {
    store: {
    },
    maxSize: 26214400,
    maxAge: 5400 * 1000,
    cleanAfter: 7200 * 1000,
    cleanedAt: 0,
    clean: function (now) {
        var self = this;
        if(now - self.cleanedAt > self.cleanedAfter) {
            self.cleanedAt = now;
            Object.keys(self.store).forEach(function (file) {
                if(now > self.store[file].timestamp + self.maxAge) {
                    delete self.store[file];
                }
            });
        }
    }
};
http.createServer(function (request, response) {
    var lookup = path.basename(decodeURI(request.url)) || "index.html";
    var f = "content/" + lookup;
    fs.exists(f, function (exists) {
        if(exists) {
            var headers = {
                "Content-type": mimeTypes[path.extname(lookup)]
            };
            if(cache[f]) {
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
                if(stats.size < cache.maxSize) {
                    var bufferOffset = 0;
                    cache[f] = {
                        content: new Buffer(stats.size),
                        timestamp: Date.now()
                    };
                    s.on("data", function (chunk) {
                        chunk.copy(cache[f].content, bufferOffset);
                        bufferOffset += chunk.length;
                    });
                }
            });
            return;
        }
        response.writeHead(404);
        response.end();
    });
    cache.clean(Date.now());
}).listen(8080);

