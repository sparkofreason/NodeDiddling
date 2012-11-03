///<reference path='../node.d.ts'/>
var connect = require("connect");
import fs = module("fs");
import util = module("util");

var form = fs.readFileSync("form.html");
connect(connect.limit("64kb"), connect.bodyParser(),
    function (request, response) {
        if (request.method === "GET") {
            response.writeHead(200, { "Content-type": "text/html" });
            response.end(form);
        } else if (request.method === "POST") {
            console.log("User Posted:\n", request.body);
            response.end("You posted:\n" + util.inspect(request.body));
        }
    }).listen(8080);