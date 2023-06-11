let compiler = require('./compiler2').translate;
let unpack = require("import-for-web");
let path = require("path")

unpack.transform(compiler);
//unpack.parseModules();
unpack.bundle();
let indexPage = require('./index.page')
let importsMap = require('./import-web-map')();

let { RenderPage, importAll } = require('bserver');
importAll(importsMap);

let http = require('http');
let url = require('url');
let fs = require('fs');

http.createServer(async function (req, res) {
    let parsedUrl = url.parse(req.url, true);
    if (parsedUrl.pathname == "/") {
        let page = indexPage({ isSSR: true }, "/modules/myapp@0.1.0", {});
        //Serve main app
        res.writeHead(200, { 'Content-Type': 'text/html','Transfer-Encoding':'chunked' });
        res.write(page[0]); console.log(new Date());
        await RenderPage(res, require(importsMap['/modules/myapp@0.1.0'] + '.server.js'), importsMap);
        console.log(new Date());
        res.write(page[1]); 
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
            .write(fs.readFileSync(importsMap[parsedUrl.pathname]+'.bundle.js'));
        res.end()
    } else {
        res.end()
    }
}).listen(30001, function () {
    console.log('Running');
})