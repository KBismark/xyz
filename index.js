let compiler = require('./compiler2').translate;
let unpack = require("import-for-web");
let path = require("path")

// unpack.transform(compiler);
// unpack.parseModules();
//unpack.bundle();
let importsMap = require('./import-web-map')();

let { RenderPage, importAll } = require('bserver');
importAll(importsMap);

let http = require('http');
let url = require('url');
let fs = require('fs');

http.createServer(async function (req, res) {
    let parsedUrl = url.parse(req.url, true);
    if (parsedUrl.pathname == "/") {
        //Serve main app
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`
        <!doctype html>
        <html>
        <head>
        <script src='statics/imex.js'></script>
        <script src='statics/breaker.js'></script>
        <script>Breaker.isSSR=true;</script>
        <script src='modules/myapp@0.1.0/home/front.js'></script>
        </head>
        <body>
        `);
        
        await RenderPage(res, require(importsMap['/modules/myapp@0.1.0/home/front.js'] + '.server.js'), importsMap);
        
        res.write(`
        </body>
        </html>
        `);
        res.end();
    } else if (parsedUrl.pathname.startsWith('/statics')) {
        res.writeHead(200, { 'Content-Type': 'text/javascript' })
            .write(fs.readFileSync(path.join(__dirname, '/dist', parsedUrl.pathname)));
        res.end()
    }
    else if (parsedUrl.pathname.startsWith('/modules')) {
        if (parsedUrl.pathname.endsWith('/')) {
            parsedUrl.pathname = parsedUrl.pathname.split('/').pop();
            parsedUrl.pathname = parsedUrl.pathname.join('/');
        }
        res.writeHead(200, { 'Content-Type': 'text/javascript' })
            .write(fs.readFileSync(importsMap[parsedUrl.pathname]));
        res.end()
    } else {
        res.end()
    }
}).listen(30001, function () {
    console.log('Running');
})