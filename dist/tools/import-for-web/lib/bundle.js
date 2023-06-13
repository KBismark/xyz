const fs = require("fs");
let terser = require('terser');
const parse = require("./parse").parseModules;
const path = require("path");
let slash = path.join("/");
let base = path.join(__dirname).split(slash);
base = base.slice(0,base.length-3).join(slash)//Pops base directory leaving out node_modules/import-for-web/lib
let dependencyMap, dependentsMap;
let visted = {};
let count = 0;
let internal_import = undefined;
let clientDependencyMap = {};

function Concantenate(source, dependencies) {
    let independentModules = []
    if (!visted[source]) {
        visted[source] = 1;
    } else {
        return visted[source];
    }
    let file,dependents,adders=[];
    for (let i = 0; i < dependencies.length; i++){
        file = dependencies[i]
        if (dependents = dependentsMap[file]) {
            if (dependents.length == 1) {
                adders.push(file)
                independentModules.push(...Concantenate(file, dependencyMap[file] || []))
            } else {
                independentModules.push(file,...Concantenate(file, dependencyMap[file] || []))
            }
        }
    }
    visted[source] = independentModules = Array.from(new Set(independentModules));
    let s="";
    for (let i = 0; i < independentModules.length; i++){
        if (!dependencies.includes(independentModules[i])) {
            s+=`\nIMEX.include('${clientDependencyMap[independentModules[i]]}')`
        }
    }
    if (s) {
        s = `\nIMEX.pathname='independent-${internal_import}-${++count}';${s}`;
        s+=`\nIMEX.onload=function(){IMEX.export={}};`
    }
    let actualSrc = source,content="";
    fs.writeFileSync((source = source + '.bundle.js'), s);
    for (let i = 0; i < adders.length; i++){
        content = fs.readFileSync(adders[i] + '.bundle.js', 'utf8') + '\n';
        fs.appendFileSync(source, content);
        s += content;
        content = "";
    }
    content = fs.readFileSync(actualSrc);
    fs.appendFileSync(source, content);
    s += content;
    content = "";
    let min = terser.minify(s, {
        sourceMap: {
            url: `${clientDependencyMap[actualSrc]}.map`.replace("/", "")
        },
        compress: {
            "arrows": false,
            "keep_infinity": true,
            "passes": 2,
        },
        format: {
            "comments": false,
            "ie8": true,
            "safari10": true,
            "webkit": true,
            "quote_style": 0,
            
        },
        mangle: {
            "reserved": ["Breaker", "Bee", "IMEX"]
        }
    });
    s = "";
    min.then(function (value) {
        fs.writeFileSync((actualSrc + '.min.js'), value.code);
        fs.writeFileSync((actualSrc + '.map'), value.map);
    })
    .catch(function (err) {
        throw new Error("Faced problems while minifying code")
    })
    return independentModules;
}




module.exports = function () {
    clientDependencyMap = parse();
    const depMap = require(base + "/import-bundle-map.js");
    dependencyMap = depMap.dependencyMap;
    dependentsMap = depMap.dependentsMap;
    visted = {};
    count = 0;
    internal_import = Date.now();
    for (let file in dependencyMap) {
        Concantenate(file,dependencyMap[file])
    }
}