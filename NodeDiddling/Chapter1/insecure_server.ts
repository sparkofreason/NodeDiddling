///<reference path='node.d.ts'/>
import http = module("http");
import path = module("path");
import fs = module("fs");
import url = module("url");

http.createServer(function (request, response) {
    var lookup = url.parse(decodeURI(request.url)).pathname;
    lookup = lookup === "/" ? "/index.html" : lookup;
    var f = "content" + lookup;
    console.log(f);
    fs.readFile(f, function (err, data) {
        response.end(data);
    });
});