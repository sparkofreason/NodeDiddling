///<reference path='../node.d.ts'/>
import http = module("http");
import fs = module("fs");
var formidable = require("formidable");

var form = fs.readFileSync("form.html");
http.createServer(function (request, response) {
        if (request.method === "GET") {
            response.writeHead(200, { "Content-type": "text/html" });
            response.end(form);
        } else if (request.method === "POST") {
            var incoming = new formidable.IncomingForm();
            incoming.uploaddir = "uploads";
            incoming.on("file", function (field, file) {
                if (!file.size) {
                    return;
                }
                response.write(file.name + " received\n");
            }).on("end", function () {
                response.end("All files received");
            });
            incoming.parse(request);
        }
    }).listen(8080);