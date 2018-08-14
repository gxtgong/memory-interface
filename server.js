var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");

var tempFileName = "";

if (!fs.existsSync('./testdata')){
    fs.mkdirSync('./testdata');
}

function processed (s) {
	return s.replace(/%20/g, " ");
}

http.createServer(function(req, res) {

    console.log(`${req.method} request for ${req.url}`);

    // line 17-25 added from RecordRTC/server.js (request and response replaced by req and res)
    var uri = url.parse(req.url).pathname,
        filename = path.join(process.cwd(), uri);

    var isWin = !!process.platform.match(/^win/);

    if (filename && filename.toString().indexOf(isWin ? '\\uploadFile' : '/uploadFile') != -1 && req.method.toLowerCase() == 'post') {
        uploadFile(req, res);
        return;
    }else if (req.method === "GET") {
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
            tempFileName = JSON.parse(body).fileName;
            if (!fs.existsSync('./testdata/'+tempFileName)){
                fs.mkdirSync('./testdata/'+tempFileName);
            }
            fs.writeFile('./testdata/'+tempFileName+'/'+tempFileName+".json", body, function(){
                console.log("WRITE data" + " TO " + tempFileName + ".json");
                res.end();
            });
    	})
    }


}).listen(8000);

console.log("File server running on port 8000");

// function added from RecordRTC/server.js
function uploadFile(request, response) {
    // parse a file upload
    //var mime = require('mime'); //error: can't find module mime
    var formidable = require('formidable'); //extra thing installed
    var util = require('util');

    var form = new formidable.IncomingForm();

    //var dir = !!process.platform.match(/^win/) ? '\\uploads\\' : '/uploads/';

    form.uploadDir = __dirname;// + dir;
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.maxFields = 1000;
    form.multiples = false;

    //rename the file or it will be a random string
    form.on('file', function(field, file) {
        fs.rename(file.path, path.join(__dirname, './testdata/'+tempFileName+'/'+tempFileName+".webm"), function(err){
            if (err) throw err;
        });
    });

    form.parse(request, function(err, fields, files) {
        var file = util.inspect(files);
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.write(JSON.stringify({'fileURL': tempFileName+".webm"}));
        response.end();
    });
}