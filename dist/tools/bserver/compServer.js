"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internal = exports.Breaker = void 0;
class Breaker {
    constructor(res) {
        this.UI = new UI(res);
    }
}
exports.Breaker = Breaker;
const internal = Symbol();
exports.internal = internal;
const internal_ins = Symbol();
const pageopen = {};
let STATUS = {
    pending: 1,
    dead: 0
};
class UI {
    constructor(res) {
        this.ComponentsClasses = new Map();
        this.Blocks = new Map();
        this.Pendings = [];
        this.dinstinctComponents = 0;
        this.componentsID = 0;
        this.currentRenderingComponent = { id: 0, startFrom: 0, Node: { id: "" } };
        this.status = STATUS.dead;
        this.app = 0;
        this._response = res;
        this._externalData = {};
        this._imex = { pathname: "" };
        this._importsMap = {};
        this._pagelock = {};
        this._allowAppCreation = true;
    }
    ;
    setDataSource(info) {
        if (!this._externalData[internal]) {
            this._externalData[internal] = 1;
        }
        ;
        this._externalData[info.url] = { data: info.data };
    }
    setup(componentsMethod, componentInstance) {
        this.componentsMethod = componentsMethod;
        this.componentInstance = componentInstance;
    }
    render(ins, args) {
        const UI = this;
        let componentObj = {};
        let _internal_ = UI.Blocks.get(ins.id);
        let compClass = UI.ComponentsClasses.get(ins.fnId);
        let view, proto;
        if (!compClass.proto) {
            proto = {};
            view = compClass.fn.call(proto, args);
            compClass.setup(view, proto);
        }
        else {
            proto = compClass.proto;
        }
        componentObj[internal] = _internal_;
        componentObj.initArgs = _internal_.InitArgs;
        _internal_.InitArgs = undefined;
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
    }
    CreateComponent(name, fn) {
        let cm = new ComponentClass(fn, ++this.dinstinctComponents, name, this._imex.pathname);
        this.ComponentsClasses.set(cm.id, cm);
        let f = this.componentsMethod.bind({ fnId: cm.id });
        f.instance = this.componentInstance.bind({ fnId: cm.id });
        return f;
    }
    CreateDynamicNode(fn, deps) {
        fn[internal] = internal;
        return fn;
    }
    CreateList(list) {
        return new List(list);
    }
    CreateApp(path, ins, dest) {
        if (this._pagelock != pageopen) {
            if (!this._allowAppCreation) {
                return;
            }
        }
        this._allowAppCreation = false;
        this.app = ins.id;
        this.render(ins, undefined);
        if (!this.Pendings.length) {
            this.status = STATUS.dead;
            
            this.ComponentsClasses = null;
            this.Blocks = null;
            this.Pendings = null;
            this.currentRenderingComponent = null;
            this._response = null;
            this._externalData = null;
            this._imex = null;
            this._importsMap = null;
            this._onend(true);
        }
    }
    lockAppCreation(obj) {
        if (this._pagelock == internal) {
            this._pagelock = obj;
        }
    }
    ;
    unlockAppCreation(obj) {
        if (this._pagelock == obj) {
            this._pagelock = pageopen;
        }
    }
    ;
    getParentInstance(This) {
        var parentId = This[internal].parent.id;
        return this.Blocks.get(parentId)[internal].ins;
    }
    getInstance(This) {
        return This[internal].ins;
    }
    getPublicData(ins) {
        return this.Blocks.get(ins.id).public || {};
    }
    _createInstance(classId, args, initArgs) {
        return new ComponentInstance(classId, ++this.componentsID, args, initArgs);
    }
    _internalRender(wait, componentObj, args, res) {
        let _internal_ = componentObj[internal];
        let pending = this.Pendings;
        let parent = _internal_.parent;
        let currentChild = this.currentRenderingComponent = {
            id: _internal_.id,
            startFrom: 0,
            loopCount: 0,
            Node: {
                id: ""
            }
        };
        if (!wait) {
            let compClass = this.ComponentsClasses.get(_internal_.fnId);
            let view = compClass.html;
            let is_independent = !this._starter || compClass.isIndependent;
            this._starter = true;
            let store = _internal_.store = view.call(componentObj, args, componentObj.state, { isIndependent: is_independent, pathname: compClass.Pathname, name: compClass.Name, parentId: parent.Node.id }, currentChild.Node);
            this._starter;
            let compResult, i, l = store.length;
            let list, handler, data, j, k, listItem, pId;
            if (this._externalData[internal]) {
                this._response.write(`<script>Breaker.externalData={...Breaker.externalData,...${JSON.stringify(this._externalData)}}</script>`);
                this._externalData = {};
            }
            for (i = 0; i < l; i++) {
                currentChild.loopCount++;
                if (typeof store[i] == "string") {
                    if (!pending.length) {
                        this._response.write(store[i]);
                        store[i] = null;
                    }
                }
                else {
                    compResult = store[i].call(componentObj, args, componentObj.state);
                    if (compResult instanceof List) {
                        pId = currentChild.Node.id;
                        currentChild.Node.id = "L-" + pId;
                        currentChild.loopCount--;
                        list = compResult.list;
                        handler = compResult.controller.handler;
                        data = compResult.controller.data;
                        k = list.length;
                        for (j = 0; j < k; j++) {
                            currentChild.loopCount++;
                            handler(listItem = list[j], j, data, args, componentObj);
                            switch (typeof listItem) {
                                case "object":
                                    if (listItem) {
                                        if (listItem.isComponent) {
                                            if (!pending.length) {
                                                list[j] = null;
                                            }
                                            else {
                                                list[j] = listItem;
                                            }
                                            break;
                                        }
                                    }
                                    else {
                                        listItem = "";
                                    }
                                default:
                                    if (!pending.length) {
                                        this._response.write(listItem + "");
                                        list[j] = null;
                                    }
                                    else {
                                        list[j] = listItem + "";
                                        this.Blocks.set(_internal_.id, componentObj);
                                    }
                                    break;
                            }
                        }
                        store = _internal_.store = [...store.slice(0, i), ...list, ...store.slice(i + 1)];
                        i += (k = k - 1);
                        l += k;
                        compResult.controller = compResult.list = undefined;
                        currentChild.Node.id = pId;
                        continue;
                    }
                    let valueType = typeof compResult;
                    if (valueType == "function" && compResult[internal] == internal) {
                        compResult = compResult.call(componentObj, componentObj.state);
                        valueType = typeof compResult;
                    }
                    switch (valueType) {
                        case "object":
                            if (compResult) {
                                if (compResult.isComponent) {
                                    if (!pending.length) {
                                        store[i] = null;
                                    }
                                    else {
                                        store[i] = compResult;
                                    }
                                    break;
                                }
                            }
                            else {
                                compResult = "";
                            }
                        default:
                            if (!pending.length) {
                                this._response.write(compResult + "");
                                store[i] = null;
                            }
                            else {
                                store[i] = compResult + "";
                                this.Blocks.set(_internal_.id, componentObj);
                            }
                            break;
                    }
                }
            }
            _internal_.ins.isPaused = false;
        }
        else {
            if (!parent.startFrom) {
                parent.startFrom = parent.loopCount;
            }
            pending.push(_internal_.ins);
            this.status = STATUS.pending;
            _internal_.ins.isPaused = true;
        }
        if (pending.length) {
            this.Blocks.set(_internal_.id, componentObj);
        }
        this.currentRenderingComponent = parent;
        return _internal_.ins;
    }
    _serve(id, res) {
        let block = this.Blocks.get(id);
        let store = block[internal].store, i, l = store.length;
        let value, proceed = true;
        for (i = 0; i < l; i++) {
            value = store[i];
            if (typeof value == "object") {
                if (value) {
                    if (!value.isPaused) {
                        proceed = this._serve(value.id, res);
                        if (!proceed) {
                            return false;
                        }
                        store[i] = null;
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                res.write(value);
                store[i] = null;
            }
        }
        return proceed;
    }
}
function isIndependent() { let _internal_ = this[internal]; if (_internal_.pure) {
    return;
} ; _internal_.independent = true; }
function noEffect() { return false; }
;
class ComponentClass {
    constructor(fn, id, name, pathname) {
        this.template = undefined;
        this.dn = undefined;
        this.fn = undefined;
        this.id = 0;
        this.proto = undefined;
        this.deps = undefined;
        this.html = undefined;
        this.Name = "";
        this.Pathname = "";
        this.isIndependent = false;
        this.fn = fn;
        this.id = id;
        this.Name = name;
        this.Pathname = pathname;
    }
    setup(htmlMethod, proto) {
        this.proto = proto;
        this.html = htmlMethod;
        this.isIndependent = !!proto.isIndependent;
        proto.isIndependent = isIndependent;
        proto.onServer = proto.onServer || noEffect;
        proto.public = proto.public || noEffect;
    }
}
class ComponentInstance {
    constructor(classId, componentId, args, initArgs) {
        this.id = 0;
        this.fnId = 0;
        this.done = false;
        this.pure = false;
        this.id = componentId;
        this.fnId = classId;
        this.Args = args;
        this.InitArgs = initArgs;
        this.ins = {
            [internal_ins]: 1,
            _$$type: internal_ins,
            id: componentId,
            fnId: classId,
            isComponent: true
        };
    }
}
class List {
    constructor(list) {
        this.list = list;
    }
    insertBefore(index, list, controller, thisArg) {
        this.controller = controller;
        this.list = Array.isArray(list) ? list : [list];
    }
    map(data, fn, thisArg) {
        if (fn) {
            this.controller = {
                data: data,
                handler: fn.bind(thisArg || null)
            };
        }
        return this;
    }
}
function run(B) {
}
