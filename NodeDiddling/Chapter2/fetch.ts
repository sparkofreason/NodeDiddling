///<reference path='../node.d.ts'/>
import http = module("http");
import url = module("url");
var urlOpts;
if (process.argv[2]) {
    if (!process.argv[2].match("http://")) {
        process.argv[2] = "http://" + process.argv[2];
    }
    urlOpts = url.parse(process.argv[2]);
}
http.get(urlOpts, function (response) {
    response.on("data", function (chunk) {
        console.log(chunk.toString());
    });
}).on("error", function(e){
    console.log("Error: ", e.message)
});