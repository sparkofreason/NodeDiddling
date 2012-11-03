var http = require("http")
var fs = require("fs")
var querystring = require("querystring")
var util = require("util")
var maxData = 2 * 1024 * 1024;
var form = fs.readFileSync("form.html");
http.createServer(function (request, response) {
    if(request.method === "GET") {
        response.writeHead(200, {
            "Content-type": "text/html"
        });
        response.end(form);
    } else {
        if(request.method === "POST") {
            var postData = "";
            request.on("data", function (chunk) {
                postData += chunk;
                if(postData.length > maxData) {
                    postData = "";
                    this.pause();
                    response.writeHead(403);
                    response.end("Too large");
                }
            });
            request.on("end", function () {
                if(!postData) {
                    response.end();
                    return;
                }
                var postDataObject = querystring.parse(postData);
                console.log("User Posted:\n", postData);
                response.end("You posted:\n" + util.inspect(postDataObject));
            });
        }
    }
}).listen(8080);

