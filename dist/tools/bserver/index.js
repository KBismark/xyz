"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importAll = exports.RenderPage = void 0;
const compServer_1 = require("./compServer");
function noEffect() { }
;
function servePage(res) {
    const STATUS = {
        dead: 0,
        pending: 1
    };
    const B = new compServer_1.Breaker(res);
    const UI = B.UI;
    const IMEX = UI._imex;
    IMEX.require = function _require(Module) {
        let currentPathname = UI._imex.pathname;
        require(UI._importsMap[Module] + '.server.js')(B);
        let _Export = UI._imex.onload;
        UI._imex.onload = null;
        _Export = _Export();
        UI._imex.pathname = currentPathname;
        return _Export;
    };
    IMEX.include = IMEX.loadPage = IMEX.loadModule = IMEX.reloadModule = IMEX.includesModule = noEffect;
    UI.renderPage = noEffect;
    UI.setup(function ComponentMethod(args) {
        let componentObj = {};
        let _internal_ = UI._createInstance(this.fnId, args, undefined);
        let compClass = UI.ComponentsClasses.get(this.fnId);
        let view, proto;
        if (!compClass.proto) {
            proto = {};
            view = compClass.fn.call(proto, args);
            compClass.setup(view, proto);
        }
        else {
            proto = compClass.proto;
        }
        componentObj[compServer_1.internal] = _internal_;
        _internal_.pure = true;
        _internal_.parent = UI.currentRenderingComponent;
        componentObj.public = proto.public.call(componentObj, args, componentObj.state);
        let onReady = function resume() {
            onReady = null;
            switch (UI.status) {
                case STATUS.dead:
                    return;
                default:
                    if (!_internal_.ins.isPaused) {
                        return;
                    }
                    var pending = UI.Pendings;
                    var index = pending.indexOf(_internal_.ins);
                    var waits = UI.Pendings = [0];
                    UI._internalRender(false, componentObj, undefined, UI._response);
                    _internal_.ins.isPaused = false;
                    waits.shift();
                    if (!index) {
                        pending.shift();
                        if (waits.length) {
                            pending = waits.concat(pending);
                        }
                        UI.Pendings = pending;
                        let finished = UI._serve(UI.app, UI._response);
                        if (finished) {
                            UI.status = STATUS.dead;
                            UI.ComponentsClasses = null;
                            UI.Blocks = null;
                            UI.Pendings = null;
                            UI.currentRenderingComponent = null;
                            UI._response = null;
                            UI._externalData = null;
                            UI._imex = null;
                            UI._importsMap = null;
                            UI._onend(true);
                        }
                    }
                    else {
                        pending = [...pending.slice(0, index), ...waits, ...pending.slice(index + 1)];
                        UI.Pendings = pending;
                    }
                    break;
            }
        };
        let wait = proto.onServer.call(Object.setPrototypeOf(componentObj, proto), args, function () {
            onReady && onReady();
        });
        return UI._internalRender(wait, componentObj, args, UI._response);
    }, function getComponentInstance(initArgs) {
        let _internal_ = UI._createInstance(this.fnId, undefined, initArgs);
        UI.Blocks.set(_internal_.id, _internal_);
        return _internal_.ins;
    });
    return B;
}
function RenderPage(res, pageMethod, importsMap) {
    let B = servePage(res);
    B.UI._importsMap = importsMap;
    return new Promise(function (resolver, rejecter) {
        B.UI._onend = resolver;
        pageMethod(B);
        B.UI._imex.onload();
        B = null;
        pageMethod = null;
    });
}
exports.RenderPage = RenderPage;
function promisify(executer) {
    return new Promise(function (resolver, rejecter) {
        executer(function (results) {
            results.status ? resolver(results.value) : rejecter(results.value);
        });
    });
}
function importAll(importsMap) {
    for (let Module in importsMap) {
        try {
            require(importsMap[Module + '.server.js']);
        }
        catch (error) { }
    }
}
exports.importAll = importAll;
