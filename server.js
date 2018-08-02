var http = require("http");
var fs = require("fs");
var path = require("path");

function processed (s) {
	return s.replace(/%20/g, " ");
}

http.createServer(function(req, res) {

    console.log(`${req.method} request for ${req.url}`);

    if (req.method === "GET") {
        if (req.url === "/") {
            fs.readFile("./home.html", "UTF-8", function(err, html) {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.end(html);
            });

        } else if (req.url.match(/.js$/)) {

            var jsPath = path.join(__dirname, req.url);
            var jsStream = fs.createReadStream(jsPath, "UTF-8");

            res.writeHead(200, {
                "Content-Type": "text/js"
            });

            jsStream.pipe(res);

        } else if (req.url.match(/.css$/)) {

            var cssPath = path.join(__dirname, req.url);
            var cssStream = fs.createReadStream(cssPath, "UTF-8");

            res.writeHead(200, {
                "Content-Type": "text/css"
            });

            cssStream.pipe(res);

        } else if (req.url.match(/.png$/)) {

            var imgPath = path.join(__dirname, req.url);
            var imgStream = fs.createReadStream(imgPath);

            res.writeHead(200, {
                "Content-Type": "image/png"
            });

            imgStream.pipe(res);

        } else if (req.url.match(/.json$/)) {

            var jsonPath = path.join(__dirname, req.url);
            var jsonStream = fs.createReadStream(jsonPath, "UTF-8");

            res.writeHead(200, {
                "Content-Type": "text/json"
            });

            jsonStream.pipe(res);

        } else if (req.url.match(/.mp4$/)) {

            var mp4Path = path.join(__dirname, processed(req.url));
            var mp4Stream = fs.createReadStream(mp4Path);

            res.writeHead(200, {
            	"Content-Type" : "video/mp4"
            });

            mp4Stream.pipe(res);

        } else if (req.url.match(/.webm$/)) {

            var webmPath = path.join(__dirname, processed(req.url));
            var webmStream = fs.createReadStream(webmPath);

            res.writeHead(200, {
            	"Content-Type" : "video/webm"
            });

            webmStream.pipe(res);

        } else {

            res.writeHead(404, {
                "Content-Type": "text/plain"
            });
            res.end("404 File Not Found");
        }
    } else if (req.method === "POST") {
    	var body = "";
    	req.on("data", function(chunk){
    		body += chunk;
    	})
    	req.on("end", function() {
            name = JSON.parse(body).fileName;
            fs.writeFileSync(name+".json", body);
            fs.writeFile(name+".json", body, function(){
                console.log("WRITE data" + " TO " + name + ".json");
            });
    	})
    }


}).listen(8000);

console.log("File server running on port 8000");