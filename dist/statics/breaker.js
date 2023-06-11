!function () {
    "use strict";
    var __assign = (this && this.__assign) || function () {
        __assign = Object.assign || function (t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
    var _a;
    var renderingComponent = { id: undefined, dynIndex: undefined,chain:new Map() };
    var componentsTrashBin = new Set();
    var ListsTrashBin = new Set();
    var CreatedComponents = new Map();
    var Blocks = new Map();
    var MountBucket = new Map();
    var TemplateBucket = new Map();
    var standAloneUpdates = new Map();
    var dynamicNodeUpdates = new Map();
    var listUpdates = new Map();
    var updates_initiated = false;
    var updating = false;
    var internal = Symbol();
    var internal_ins = Symbol();
    var external = Symbol();
    var ext_state = Symbol();
    var independent = Symbol();
    var Namings = {};
    var dinstinctComponents = 0;
    var componentsID = 0;
    var STATUS = {
        alive: 1,
        hibernatedPartially: 2,
        hibernatedFully: 3,
        dead: 4
    };
    var NODETYPES = {
        text: 1,
        component: 2,
        list: 3
    };
    var ACTIONS = {
        render: 0,
        update: 0
    };
    function getIndependentNode(node) {
        return node.getAttribute("bee-I") ? node : getIndependentNode(node.parentNode);
    }
    var currentAction = ACTIONS.render;
    var global_template = undefined;
    var Breaker = /** @class */ (function () {
        function Breaker() {
            this.UI = new UI();
            this.isSelectiveRendering = false;
            this.selector = null;
            this.externalData = {};
        }
        if (typeof IMEX != "undefined") {
            Breaker.prototype._imex = IMEX;
        } else {
            window.IMEX = Breaker.prototype._imex = {
                pathname:""
            }
        }

        Breaker.prototype.select = function (node, eventName) {
            let independentNode = getIndependentNode(node);
            let path = independentNode.getAttribute("bee-path"),
                compName = independentNode.getAttribute("bee-N");
            this.selector = {
                node: independentNode,
                iname: independentNode.getAttribute("bee-I")
            }
            let clientRenderdNode = this.UI.render(Namings[path + compName](/**No Initial Args */)/**No Args */);
            independentNode.replaceWith(
                clientRenderdNode[internal].node
            )
            this.isSelectiveRendering = false;
            this.selector = null;

        };
        Breaker.prototype.create = function (htmlMethod, Setter, dynamicNodes, dependencies, dynMethod, comp) {
            var _internal_ = comp[internal];
            comp[internal] = null;
            var compClass = CreatedComponents.get(_internal_.fnId);
            compClass.setup(htmlMethod, Setter, dynamicNodes, dependencies, dynMethod, comp);
            if (compClass.isIndependent) {
                _internal_.independent = true;
            }
            if (B.isSelectiveRendering&&_internal_.independent) {
                return independent;
            }
            var node = compClass.getTemplate();
            comp = Object.create(comp);
            comp[internal] = _internal_;
            comp.initArgs = _internal_.InitArgs || comp.initArgs;
            _internal_.InitArgs = undefined;
            var id = _internal_.id;
            Blocks.set(id, comp);
            run(comp);
            var kNdN = Setter.call(comp, _internal_.Args, node, eventHandler,id,dependencies,true);
            _internal_.keyed = kNdN[0];
            _internal_.init_dyn = dynMethod(node);//kNdN[1];
            var attrDeps = _internal_.attrDeps = new Map();
            var state = comp.state,key,fn;
            if (state) {
                for (key in dependencies) {
                    fn = dependencies[key];
                    observeDependency(state, fn.$dep,attrDeps,{node:fn.key, attr: true, id: id, index:key});
                }
            }
            return node;
        };
        return Breaker;
    }());
    function clone(_internal_) {
        var compClass = CreatedComponents.get(_internal_.fnId);
        if (compClass.isIndependent) {
            _internal_.independent = true;
        }
        if (B.isSelectiveRendering&&_internal_.independent) {
            return independent;
        }
        var node = compClass.getTemplate();
        var comp = Object.create(compClass.proto);
        comp[internal] = _internal_;
        comp.initArgs = _internal_.InitArgs || comp.initArgs;
        _internal_.InitArgs = undefined;
        var id = _internal_.id;
        Blocks.set(id, comp);
        run(comp);
        var dependencies = compClass.deps;
        var kNdN = compClass.setAttr.call(comp, _internal_.Args, node, eventHandler, id, dependencies, false);
        _internal_.keyed = kNdN[0];
        _internal_.init_dyn = compClass.dynMethod(node); //kNdN[1];
        var attrDeps = _internal_.attrDeps = new Map();
        var state = comp.state,key,fn;
        if (state) {
            for (key in dependencies) {
                fn = dependencies[key];
                observeDependency(state, fn.$dep, attrDeps, { node: fn.key, attr: true, id: id, index: key});
            }
        }
        return node;
    }
    function cloneWithState(comp,_internal_) {
        var compClass = CreatedComponents.get(_internal_.fnId);
        var node = compClass.getTemplate();
        Object.setPrototypeOf(comp, compClass.proto);
        var state = comp.state;
        comp.onParentEffect && comp.onParentEffect.call(comp, args, state);
        comp.onMount && MountBucket.set(_internal_.id, comp);
        if (comp.public) {
            comp.public = comp.public.call(t, args, state);
        }
        var kNdN = compClass.setAttr.call(comp, _internal_.Args, node, eventHandler, _internal_.id, compClass.deps, false);
        _internal_.keyed = kNdN[0];
        _internal_.init_dyn = compClass.dynMethod(node);//kNdN[1];
        return node;
    }
    function run(t) {
        var _internal_ = t[internal];
        var args = _internal_.Args;
        !_internal_.created && t.onCreation && t.onCreation.call(t, args);
        _internal_.created = true;
        t.initArgs = undefined;
        var state = t.state;
        t.onParentEffect && t.onParentEffect.call(t, args, state);
        t.onMount && MountBucket.set(_internal_.id, t);
        if (t.public) {
            t.public = t.public.call(t, args, state);
        }
    }
    function keySetter(key) {
        return {
            set: function (v) {
                var _internal_state = this[ext_state];
                var actualValue = _internal_state[key];
                var attrDeps = _internal_state[internal];
                var nodeDeps = attrDeps.nodeContainer;
                attrDeps = attrDeps.attrContainer;
                if (actualValue.value == v) {
                    if (typeof v == "object" && v) {
                        var deps = actualValue.dependents, l = deps.length;
                        var i, dep;
                        if (!updating) {
                            for (i = 0; i < l; i++) {
                                dep = deps[i];
                                if (dep.attr) {
                                    attrDeps.set(dep.index, dep.node);
                                } else {
                                    nodeDeps.set(dep.dynIdex, dep.dynIdex);
                                }
                            }
                            dynamicNodeUpdates.set(dep.id, dep.id);
                            startUpdates()
                        }
                        else {
                            for (i = 0; i < l; i++) {
                                dep = deps[i];
                                dep.update = true;
                            }
                        }
                    }
                    return;
                }
                actualValue.value = v;
                var deps = actualValue.dependents, l = deps.length;
                var i, dep;
                if (!updating) {
                    for (i = 0; i < l; i++) {
                        dep = deps[i];
                        if (dep.attr) {
                            attrDeps.set(dep.index, dep.node);
                        } else {
                            nodeDeps.set(dep.dynIdex, dep.dynIdex);
                        }
                    }
                    dynamicNodeUpdates.set(dep.id, dep.id);
                    startUpdates()
                }
                else {
                    for (i = 0; i < l; i++) {
                        dep = deps[i];
                        dep.update = true;
                    }
                }
            },
            get: function () {
                return this[ext_state][key].value;
            }
        };
    }
    ;
    function observeDependency(obj, keys,upsContainer,dynIndexInfo) {
        var _internal_;
        if (!(_internal_ = obj[ext_state])) {
            _internal_ = obj[ext_state] = { [internal]: { attrContainer: undefined, nodeContainer: undefined } };
        }
        if (dynIndexInfo.attr) {
            _internal_[internal].attrContainer = upsContainer;
        } else {
            _internal_[internal].nodeContainer = upsContainer;
        }
        var l = keys.length, value, key;
        for (var i = 0; i < l; i++) {
            value = obj[key = keys[i]];
            if (!_internal_[key]) {
                _internal_[key] = {
                    value: value,
                    dependents: [dynIndexInfo],
                };
                Object.defineProperty(obj, key, keySetter(key));
            }
            else {
                _internal_[key].dependents.push(dynIndexInfo);
            }
        }
    }
    function AfterInserts() {
        MountBucket.forEach(function (comp) {
            comp.onMount.apply(comp);
        });
        MountBucket.clear();
        TemplateBucket.forEach(function (compClass) {
            compClass.template = undefined;
        });
        TemplateBucket.clear();
        global_template = undefined;
    }
    var UI = /** @class */ (function () {
        function UI() {
        }
        UI.prototype.CreateStyle = function () {
            var styles = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                styles[_i] = arguments[_i];
            }
            if (styles.length) {
                return styles.join(";");
            }
            return "";
        };
        UI.prototype.CreateList = function (list) {
            return new List(list);
        };
        UI.prototype.CreateComponent = function (name,fn) {
            var cm = new ComponentClass(fn);
            CreatedComponents.set(cm.id, cm);
            var f = ComponentMethod.bind({ fnId: cm.id });
            f.instance = getComponentInstance.bind({ fnId: cm.id });
            Namings[B._imex.getPath() + name] = f.instance;
            return f;
        };
        UI.prototype.CreateDynamicNode = function (fn, stateDependencyKeys) {
            if (typeof fn == "function") {
                fn[external] = stateDependencyKeys.slice(0);
            }
            return fn;
        };
        UI.prototype.CreateApp = function (pagePath, app, destination) {
            if (B.isSSR) { B.isSSR = false; return}
            destination.replaceWith(app[internal].node);
            AfterInserts();
        };
        UI.prototype.render = function (ins, args) {
            if (B.isSSR) { return}
            var id = ins[internal_ins].id;
            var comp = Blocks.get(id);
            var _internal_ = comp[internal];
            var compClass = CreatedComponents.get(_internal_.fnId);
            var node = undefined; //listTrack;
            var out, el;
            _internal_.Args = args;
            switch (_internal_.status) {
                case STATUS.dead: //Full Mount
                    if (!compClass.proto) {
                        node = compClass.fn.call(comp, args);
                    }
                    else {
                        node = clone(_internal_);
                    }
                    
                    out = _internal_.outerValue;
                    out[internal].node = node;
                    _internal_.status = STATUS.alive;
                    if (node == independent) {
                        _internal_.init_dyn = null;
                        return independent;
                    }
                    runDynamicnodes(_internal_.id, compClass.dn, _internal_.init_dyn);
                    _internal_.init_dyn = null;
                    return out;
                case STATUS.alive: //Update
                    if (_internal_.independent) {
                        return independent;
                    }
                    el = _internal_.outerValue;
                    if (el.parent && (renderingComponent.id != el.parent || renderingComponent.dynIndex != el.dynIndex)) {
                        var tmp2 = Blocks.get(el.parent)[internal].dyn;
                        if (el.listItem) {
                            var e = el.getList();
                            var j = e.curData.indexOf(el);
                            e.curData[j] = "";
                            if (j == 0) {
                                el.node.replaceWith((e.pos.head = document.createTextNode("")));
                            }
                            else if (j == e.curData.length - 1) {
                                el.node.replaceWith((e.pos.tail = document.createTextNode("")));
                            }
                            else {
                                el.node.replaceWith(document.createTextNode(""));
                            }
                            el.listItem = false;
                            el.getList = undefined;
                        }
                        else {
                            tmp2[(j = el.dynIndex)].node.replaceWith((e = document.createTextNode("")));
                            tmp2[j] = { node: e, type: NODETYPES.text, value: "" };
                        }
                        el.parent = 0;
                        el.dynIndex = 0;
                    }
                    comp.parentEffect && comp.parentEffect.call(comp, args, comp.state);
                    updateDynamicnodes(_internal_.id, undefined, undefined);
                    return el;
                case STATUS.hibernatedPartially:
                    node = cloneWithState(comp,_internal_);
                    out = _internal_.outerValue;
                    out[internal].node = node;
                    _internal_.status = STATUS.alive;
                    runDynamicnodes(_internal_.id, compClass.dn, _internal_.init_dyn);
                    _internal_.init_dyn = null;
                    return out;
                case STATUS.hibernatedFully:
                    if (_internal_.independent) {
                        _internal_.status = STATUS.alive;
                        return independent;
                    }
                    comp.parentEffect && comp.parentEffect.call(comp, args, comp.state);
                    _internal_.status = STATUS.alive;
                    updateDynamicnodes(_internal_.id, undefined, undefined);
                    return _internal_.outerValue;
            }
        };
        UI.prototype.setState = function (This, state) {
            var _internal_ = This[internal];
            if (!This.state) {
                This.state = state;
                updateDynamicnodes(_internal_.id, _internal_.fnId, undefined);
                return;
            }
            ;
            This.state = __assign(__assign({}, This.state), state);
            updateDynamicnodes(_internal_.id, _internal_.fnId, undefined);
        };
        UI.prototype.setClass = function (This, key, classObject) {
            var _internal_ = This[internal];
            B.ui.update(_internal_.ins, internal, key, classObject);
        };
        UI.prototype.getPublicData = function (ins) {
            return Blocks.get(ins[internal_ins].id).public || {};
        };
        UI.prototype.getInstance = function (This) {
            return This[internal].ins;
        };
        UI.prototype.getParentInstance = function (This) {
            var parent = This[internal].outerValue[internal].parent;
            return Blocks.get(parent)[internal].ins;
        };
        UI.prototype.update = function (ins) {
            var _b;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var id = ins[internal_ins].id;
            var pre = standAloneUpdates.get(id);
            if (args.length && args[0] == internal) {
                if (!pre) {
                    standAloneUpdates.set(id, { ins: ins, main: false, args: undefined, keys: (_b = {}, _b[args[1]] = { class: args[2] }, _b) });
                    if (!updates_initiated) {
                        updates_initiated = true;
                        setTimeout(update, 0);
                    }
                }
                else {
                    pre.key[args[1]] = pre.key[args[1]] || { class: {} };
                    pre.key[args[1]].class = __assign(__assign({}, pre.key[args[1]].class), args[2]);
                }
                return;
            }
            args = args.length ? args[0] : undefined;
            if (pre) {
                pre.main = true;
                pre.args = args;
                return;
            }
            standAloneUpdates.set(id, { ins: ins, main: true, args: args, keys: {} });
            if (!updates_initiated) {
                updates_initiated = true;
                setTimeout(update, 0);
            }
        };
        return UI;
    }());
    function keepStateIfDestroyed(bool) { let _internal_=this[internal]; if (_internal_.pure) { return }; _internal_.keepState = !!bool; }
    function keepEverythingIfDestroyed(bool) { let _internal_ = this[internal]; if (_internal_.pure) { return }; _internal_.keepAll = !!bool; }
    function isIndependent() { let _internal_=this[internal]; if (_internal_.pure) { return }; _internal_.independent = true}
    var ComponentClass = /** @class */ (function () {
        function ComponentClass(fn) {
            this.template = undefined;
            this.dn = undefined;
            this.fn = undefined;
            this.id = 0;
            this.proto = undefined;
            this.deps = undefined;
            this.html = undefined;
            this.setAttr = undefined;
            this.fn = fn;
            dinstinctComponents++;
            this.id = dinstinctComponents;
            this.isIndependent = undefined;
        }
        ComponentClass.prototype.setup = function (htmlMethod, setter, dn,dependencies, dynMethod, proto) {
            this.dn = dn;
            this.deps = dependencies;
            this.proto = proto;
            this.html = htmlMethod;
            this.setAttr = setter;
            this.dynMethod = dynMethod;
            this.isIndependent = !!proto.isIndependent;
            proto.keepStateIfDestroyed = keepStateIfDestroyed;
            proto.keepEverythingIfDestroyed = keepEverythingIfDestroyed;
            proto.isIndependent = isIndependent;
        };
        ComponentClass.prototype.getTemplate = function () {
            if (!this.template) {
                if (!global_template) {
                    global_template = document.createElement("template");
                }
                global_template.innerHTML = this.html();
                this.template = global_template.content.firstElementChild;
                TemplateBucket.set(this.id, this);
            }
            return this.template.cloneNode(true);
        };
        return ComponentClass;
    }());
    ;
    var ComponentInstance = /** @class */ (function () {
        function ComponentInstance(_b) {
            var _c, _d;
            var methodId = _b.methodId, args = _b.args, initArgs = _b.initArgs;
            this.outerValue = (_c = {},
                _c[internal] = {
                    type: NODETYPES.component,
                    parent: 0,
                    dynIndex: 0,
                    listItem: false,
                    listIndex: 0,
                    getList: undefined,
                    node: undefined,
                    id: 0
                },
                _c);
            this.ins = (_d = {}, _d[internal_ins] = { fnId: 0, id: 0,out:undefined}, _d.isComponent = true, _d);
            this.created = false;
            this.status = STATUS.dead;
            this.parent = 0;
            this.id = 0;
            this.fnId = 0;
            this.Args = undefined;
            this.InitArgs = undefined;
            this.init_dyn = undefined;
            this.keyed = null;
            componentsID++;
            this.id = componentsID;
            var f = this.outerValue[internal];
            f.id = componentsID;
            this.fnId = methodId;
            this.Args = args;
            this.InitArgs = initArgs;
            var a = this.ins[internal_ins];
            a.fnId = methodId;
            ;
            a.id = componentsID;
            a.out = f;
        }
        return ComponentInstance;
    }());
    function getList() {
        return this[internal];
    }
    function getListItem(item) {
        return item && item[internal_ins] ? item : item == null ? "" : "".concat(item);
    }
    var List = /** @class */ (function () {
        function List(list) {
            this[_a] = {
                getList: getList.bind(this),
                curData: [],
                length: 0,
                stack: [],
                type: NODETYPES.list,
                pos: {
                    head: undefined,
                    tail: undefined,
                    dynIndex: undefined,
                    parent: undefined
                },
                runner: { fn: undefined, data: undefined }
            };
            var a = this[internal];
            a.curData = list.map(getListItem);
        }
        List.prototype.map = function (data, fn, thisArg) {
            if (fn) {
                var _internal_ = this[internal];
                _internal_.runner.fn = fn.bind(thisArg || null);
                _internal_.runner.data = data;
            }
            return this;
        };
        List.prototype.clear = function () {
            var _internal_ = this[internal];
            _internal_.nextData = [];
        };
        List.prototype.get = function () {
            return this[internal].curData.slice(0);
        };
        List.prototype.remove = function (from, to) {
            var l;
            var _internal_ = this[internal];
            l = _internal_.length;
            if (typeof to != "number" || to > l) {
                to = l - 1;
            }
            if (to < from || from >= l)
                return;
            var t = to - from + 1;
            _internal_.length = l - t;
            _internal_.stack.push({ type: "remove", from: from, to: to, total: t });
            listUpdates.set(_internal_.id, _internal_);
            startUpdates();
        };
        List.prototype.insertBefore = function (index, listData, args) {
            var _internal_ = this[internal];
            var l = _internal_.length, i, t = 1;
            var bf = index < 0 ? l : index >= l ? l : index;
            var value;
            if (Array.isArray(listData)) {
                t = listData.length;
                value = new Array(t);
                for (i = 0; i < t; i++) {
                    value[i] = getListItem(listData[i]);
                }
            }
            else {
                value = [getListItem(listData)];
            }
            _internal_.length = l + t;
            _internal_.stack.push({ type: "insert", value: value, before: bf, args: args });
            listUpdates.set(_internal_.id, _internal_);
            startUpdates();
        };
        List.prototype.size = function () {
            return this[internal].length;
        };
        return List;
    }());
    _a = internal;
    let list_text_replacer = {};
    function insertList(list, parentData, node) {
        updateListData(list);
        var lc = list.curData, value, docF = undefined, ar, e, j, ee, pid = parentData.id, pidx = parentData.i;
        var getList = list.getList;
        if ((value = lc.length)) {
            docF = document.createDocumentFragment();
            ar = new Array(value);
            loop: for (j = 0; j < value; j++) {
                ee = lc[j];
                if ((ee = ee[internal_ins])) {
                    e = ee.out; 
                    ar[j] = e.node;
                    e.parent = pid;
                    e.dynIndex = pidx;
                    e.listItem = true;
                    e.getList = getList;
                    continue loop;
                }
                ar[j] = lc[j];
                lc[i] = list_text_replacer;
            }
            docF.append.apply(docF, ar);
            value = list.pos;
            value.head = docF.firstChild;
            value.tail = docF.lastChild;
        }
        else {
            value = list.pos;
            value.head = value.tail = document.createTextNode("");
        }
        value.dynIndex = pidx;
        value.parent = pid;
        return docF || value.head;
    }
    function removeList(list, head) {
        var lc = list.curData, value = list.pos, r, docF = undefined, e, j, ee, l;
       
        if ((l = lc.length)) {
            var chain = renderingComponent.chain;
            if (!head) {
                Blocks.get(value.parent)[internal].dyn[value.dynIndex] =
                    { /*value: "",*/ type: NODETYPES.text, node: head = document.createTextNode("") };
            }
            r = head;
            var curHead = value.head;
            var parent_1 = curHead.parentNode;
            if (parent_1.firstChild == curHead && parent_1.lastChild == value.tail) {
                parent_1.textContent = "";
                parent_1.appendChild(head);
                for (j = 0; j < l; j++) {
                    ee = lc[j];
                    if ((ee = ee[internal_ins])) {
                        e = ee.out; 
                        e.parent = 0;
                        e.dynIndex = 0;
                        e.listItem = false;
                        e.getList = undefined;
                        chain.delete(e.id);
                        componentsTrashBin.add(e.id);
                    }
                }
            } else {
                curHead.replaceWith(head);
                for (j = 1; j < l; j++) {
                    ee = lc[j];
                    head.nextSibling.remove();
                    if ((ee = ee[internal_ins])) {
                        e = ee.out; 
                        e.parent = 0;
                        e.dynIndex = 0;
                        e.listItem = false;
                        e.getList = undefined;
                        chain.delete(e.id);
                        componentsTrashBin.add(e.id);
                    }
                }
                if ((ee = lc[0][internal_ins])) {
                    e = ee.out;
                    e.parent = 0;
                    e.dynIndex = 0;
                    e.listItem = false;
                    e.getList = undefined;
                    chain.delete(e.id);
                    componentsTrashBin.add(e.id);
                }
            }
           
            value.head = undefined;
            value.tail = undefined;
        }
        else {
            if (!head) {
                Blocks.get(value.parent)[internal].dyn[value.dynIndex] =
                    {/* value: "",*/ type: NODETYPES.text, node: r = value.head };
            }
            else {
                value.head.replaceWith(head);
                r = head;
            }
            value.head = value.tail = undefined;
        }
        value.dynIndex = 0;
        value.parent = 0;
        return r;
    }
    function updateListData(list) {
        var stack = list.stack;
        if (stack.length) {
            list.stack = [];
            var data = list.curData, i, l = stack.length;
            var item, d, a, t, b;
            for (i = 0; i < l; i++) {
                item = stack[i];
                d = data.length;
                t = item.from;
                b = item.to;
                switch (item.type) {
                    case "remove":
                        data = __spreadArray(__spreadArray([], data.slice(0, t), true), data.slice(b + 1), true);
                        break;
                    case "insert":
                        a = item.before;
                        if (a >= d) {
                            data = __spreadArray(__spreadArray([], data, true), item.value, true);
                        }
                        else {
                            data = __spreadArray(__spreadArray(__spreadArray([], data.slice(0, a), true), item.value, true), data.slice(a), true);
                        }
                        break;
                    default:
                        break;
                }
            }
            list.curData = data;
        }
        d = list.runner;
        t = d.fn;
        if (t && (b = list.curData) && (l = b.length)) {
            data = d.data;
            for (i = 0; i < l; i++) {
                t(b[i], i, data);
            }
        }
        d.fn = d.data = undefined;
    }
    function buildListNodes(listData, parent, dynIndex, listGetter) {
        var l = listData.length, ar, j, e;
        var docF = document.createDocumentFragment();
        ar = new Array(l);
        loop: for (j = 0; j < l; j++) {
            e = listData[j];
            if ((e = e[internal_ins])) {
                e = e.out; 
                ar[j] = e.node;
                e.parent = parent;
                e.dynIndex = dynIndex;
                e.listItem = true;
                e.getList = listGetter;
                componentsTrashBin.delete(e.id);
                continue loop;
            }
            ar[j] = listData[j];
            listData[j] = list_text_replacer;
        }
        docF.append.apply(docF, ar);
        return docF;
    }
    function startUpdates() {
        if (!updates_initiated) {
            updates_initiated = true;
            setTimeout(update, 1);
        }
    };
    function update() {
        updating = true;
        dynamicNodeUpdates.forEach(function (value) {
            updateStatefulDynamicnodes(value);
        });
        dynamicNodeUpdates.clear();
        listUpdates.forEach(function (value) {
            var parentData = { id: value.pos.parent, i: value.pos.dynIndex };
            updateList(value, parentData, undefined);
        });
        listUpdates.clear();
        AfterInserts()
        setTimeout(cleanUp, 1);
        //cleanUp();
        updating = updates_initiated = false;
    }
    function updateList(list, parentData, node) {
        var stack = list.stack;
        var data, d, t, b, l, i;
        if (stack.length) {
            list.stack = [];
            data = list.curData;
            l = stack.length;
            d = data.length;
            var head = list.pos.head;
            var tail = list.pos.tail;
            var j = void 0, a = void 0, tmp = void 0, parent_1, item = void 0, el = void 0;
            var pid = parentData.id, pidx = parentData.i;
            var args = void 0, argsData = void 0, handler = void 0, getList_1 = list.getList;
            var chain = renderingComponent.chain;
            for (i = 0; i < l; i++) {
                item = stack[i];
                d = data.length;
                switch (item.type) {
                    case "remove":
                            a = item.total;
                            t = item.from;
                            b = item.to;
                        if (d == a) {
                            head = list.pos.head;
                            tail = list.pos.tail;
                            parent_1 = head.parentNode;
                            if (parent_1.firstChild == head && parent_1.lastChild == tail) {
                                parent_1.textContent = "";
                                list.pos.tail = list.pos.head = parent_1.appendChild(document.createTextNode(""));
                                for (j = 0; j < a; j++) {
                                    if ((el = data[j][internal_ins])) {
                                        el = el.out;
                                        el.parent = 0;
                                        el.dynIndex = 0;
                                        el.listItem = false;
                                        el.getList = undefined;
                                        chain.delete(el.id);
                                        componentsTrashBin.add(el.id);
                                    }
                                }
                            } else {
                                for (j = 1; j < a; j++) {
                                    head.nextSibling.remove();
                                    if ((el = data[j][internal_ins])) {
                                        el = el.out;
                                        el.parent = 0;
                                        el.dynIndex = 0;
                                        el.listItem = false;
                                        el.getList = undefined;
                                        chain.delete(el.id);
                                        componentsTrashBin.add(el.id);
                                    }
                                }
                                list.pos.tail = list.pos.head = head;
                                if ((el = data[0][internal_ins])) {
                                    el = el.out;
                                    el.parent = 0;
                                    el.dynIndex = 0;
                                    el.listItem = false;
                                    el.getList = undefined;
                                    chain.delete(el.id);
                                    componentsTrashBin.add(el.id);
                                }
                            }
                            
                        }
                        else {
                            head = list.pos.head;
                            parent_1 = head.parentNode;
                            if (parent_1.firstChild == head) {
                                head = parent_1.childNodes[t];
                                // for (j = 0; j < t; j++) {
                                //     head = head.nextSibling;
                                // }
                                //If the current tail node must be removed,
                                //then the next tail node is the previousSibling
                                //of the `from` node
                                if (d - 1 == b) {
                                    list.pos.tail = head.previousSibling;
                                }
                                for (j=t; j <= b; j++) {
                                    tmp = head.nextSibling;
                                    head.remove();
                                    head = tmp;
                                    if ((el = data[j][internal_ins])) {
                                        el = el.out;
                                        el.parent = 0;
                                        el.dynIndex = 0;
                                        el.listItem = false;
                                        el.getList = undefined;
                                        chain.delete(el.id);
                                        componentsTrashBin.add(el.id);
                                    }
                                }
                                //If the current head node must be removed,
                                //then the next head node is the nextSibling of 
                                // the `to` node
                                if (t == 0) {
                                    list.pos.head = head;
                                }
                            }else if (t - 0 < d - b) {
                            
                                for (j = 0; j < t; j++) {
                                    head = head.nextSibling;
                                }
                                //If the current tail node must be removed,
                                //then the next tail node is the previousSibling
                                //of the `from` node
                                if (d - 1 == b) {
                                    list.pos.tail = head.previousSibling;
                                }
                                for (; j <= b; j++) {
                                    tmp = head.nextSibling;
                                    head.remove();
                                    head = tmp;
                                    if ((el = data[j][internal_ins])) {
                                        el = el.out;
                                        el.parent = 0;
                                        el.dynIndex = 0;
                                        el.listItem = false;
                                        el.getList = undefined;
                                        chain.delete(el.id);
                                        componentsTrashBin.add(el.id);
                                    }
                                }
                                //If the current head node must be removed,
                                //then the next head node is the nextSibling of 
                                // the `to` node
                                if (t == 0) {
                                    list.pos.head = head;
                                }
                            }
                            else {
                                for (j = d - 1; j > b; j--) {
                                    tail = tail.previousSibling;
                                }
                                //If the current head node must be removed,
                                //then the next head node is the nextSibling of 
                                // the `to` node
                                if (t == 0) {
                                    list.pos.tail = tail.nextSibling;
                                }
                                for (; j >= t; j--) {
                                    tmp = tail.previousSibling;
                                    tail.remove();
                                    tail = tmp;
                                    if ((el = data[j][internal_ins])) {
                                        el = el.out;
                                        el.parent = 0;
                                        el.dynIndex = 0;
                                        el.listItem = false;
                                        el.getList = undefined;
                                        chain.delete(el.id);
                                        componentsTrashBin.add(el.id);
                                    }
                                }
                                //If the current tail node must be removed,
                                //then the next tail node is the previousSibling
                                //of the `from` node
                                if (d - 1 == b) {
                                    list.pos.tail = tail;
                                }
                            }
                        }
                            data = __spreadArray(__spreadArray([], data.slice(0, t), true), data.slice(b + 1), true);
                        break;
                    case "insert":
                        a = item.before;
                        if (a >= d) {
                            data = __spreadArray(__spreadArray([], data, true), item.value, true);
                        }
                        else {
                            data = __spreadArray(__spreadArray(__spreadArray([], data.slice(0, a), true), item.value, true), data.slice(a), true);
                        }
                        
                        b = item.value;
                        if (args = item.args) {
                            t = b.length;
                            argsData = args.data;
                            handler = args.handler;
                            for (j = 0; j < t; j++) {
                                handler(b[j], j, argsData);
                            }
                        }
                        tmp = buildListNodes(b, pid, pidx, getList_1);
                        head = list.pos.head;
                        if (!d) {
                            list.pos.head = tmp.firstChild;
                            list.pos.tail = tmp.lastChild;
                            head.replaceWith(tmp);
                        }
                        else {
                            head = list.pos.head;
                            parent_1 = head.parentNode;
                            if (parent_1.firstChild == head) {
                                head = parent_1.childNodes[a];
                                parent_1.insertBefore(tmp, head);
                            } else if (a - 0 <= d - a) {
                               
                                if (a == 0) {
                                    list.pos.head = tmp.firstChild;
                                }
                                for (j = 0; j < a; j++) {
                                    head = head.nextSibling;
                                }
                                parent_1.insertBefore(tmp, head);
                            }
                            else {
                                //parent_1 = list.pos.tail.parentNode;
                                if (a >= d) {
                                    tail = list.pos.tail.nextSibling;
                                    list.pos.tail = tmp.lastChild;
                                }
                                else {
                                    tail = list.pos.tail;
                                }
                                for (j = d - 1; j > a; j--) {
                                    tail = tail.previousSibling;
                                }
                                parent_1.insertBefore(tmp, tail);
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
            list.curData = data;
            d = list.runner;
            t = d.fn;
            if (t && (b = list.curData) && (l = b.length)) {
                data = d.data;
                for (i = 0; i < l; i++) {
                    t(b[i], i, data);
                }
            }
            d.fn = d.data = undefined;
            if (!list.curData.length) {
                list.pos.head.replaceWith((list.pos.tail = document.createTextNode("")));
                list.pos.head = list.pos.tail;
            }
        }
        else {
            d = list.runner;
            t = d.fn;
            if (t && (b = list.curData) && (l = b.length)) {
                data = d.data;
                for (i = 0; i < l; i++) {
                    t(b[i], i, data);
                }
            }
            d.fn = d.data = undefined;
        }
    }
    function runDynamicnodes(id, classDyn, compDyn) {
        var l = classDyn.length;
        var comp = Blocks.get(id);
        var _internal_ = comp[internal];
        renderingComponent.chain.set(id, _internal_.childComponents = _internal_.childComponents || new Map());
        if (l) {
            var state = comp.state;
            var dyn = _internal_.dyn = new Array(l);
            var nodeDeps = _internal_.nodeDeps = new Map();
            var dn = classDyn,method;
            var Args =  _internal_.Args;
            var value, el, i;
            var statekeys,valueType;
            var parentChain = renderingComponent.chain;
            var parentId = renderingComponent.id;
            renderingComponent.chain = _internal_.childComponents;
            renderingComponent.id = id;
            if (B.selector && !B.selector.ignore) {
                B.selector.ignore = B.isSelectiveRendering = true;
                var serverRenderedIndependentNodes = 
                Object.values(B.selector.node.getElementsByClassName('bee-'+B.selector.iname) || {});
            }
            
            for (i = 0; i < l; i++) {
                method = dn[i];
                renderingComponent.dynIndex = i;
                if (statekeys = method[external]) {
                    observeDependency(comp.state, statekeys, nodeDeps, {id: id, dynIdex: i});
                    value = method.call(comp,state);
                    valueType = typeof value;
                }
                else {
                    value = method.call(comp, Args, state);
                    valueType = typeof value;
                    if (valueType == "function" && (statekeys = value[external])) {
                        observeDependency(comp.state, statekeys, nodeDeps, {id: id, dynIdex: i});
                        dn[i] = value;
                        value = value.call(comp, state);
                        valueType = typeof value;
                    }
                }
                if (value == independent) {
                    dyn[i] = { node: serverRenderedIndependentNodes.shift(), type: NODETYPES.text, /*value: value*/ };
                    compDyn[i].replaceWith(dyn[i].node);
                    continue;
                }
                switch (valueType) {
                    case "object":
                        if (value) {
                            if ((el = value[internal])) {
                                if (el.type == NODETYPES.list) {
                                    compDyn[i].replaceWith(insertList(el, { i: i, id: id }, undefined));
                                }
                                else {
                                    compDyn[i].replaceWith(el.node);
                                    el.parent = id;
                                    el.dynIndex = i;
                                }
                                dyn[i] = el;
                                break;
                            }
                        }
                        else {
                            value = "";
                        }
                    default:
                        value = "".concat(value);
                        el = document.createTextNode(value);
                        compDyn[i].replaceWith(el);
                    dyn[i] = { node: el, type: NODETYPES.text, /*value: value*/ };
                        break;
                }
            }
            renderingComponent.id = parentId;
            renderingComponent.chain = parentChain;
            renderingComponent.dynIndex = undefined;
        }
        _internal_.Args = undefined;
    }
    function updateDynamicnodes(id) {
        var comp = Blocks.get(id);
        var _internal_ = comp[internal];
        var compClass = CreatedComponents.get(_internal_.fnId);
        var deps = compClass.deps;
        var attrDeps = _internal_.attrDeps;
        var keyed = _internal_.keyed;
        var state = comp.state;
        attrDeps.forEach(function (nodekey,fn_key) {
            deps[fn_key].call(comp, keyed[nodekey].node, state, false);
        })
        attrDeps.clear();
        var l = compClass.dn.length;
        if (l) {
            var nodeDeps = _internal_.nodeDeps;
            var dyn = _internal_.dyn;
            var dn = compClass.dn;
            var Args = _internal_.Args;
            var value, el,e,i, tmp, tmp2,bn;
            var method;
            var currentChain = renderingComponent.chain;
            var currentId = renderingComponent.id;
            var chain = renderingComponent.chain = _internal_.childComponents;
            renderingComponent.id = id;
            for (i = 0; i < l; i++) {
                renderingComponent.dynIndex = i;
                method = dn[i];
                if (method[external]) {
                    if (!nodeDeps.has(i)) {
                        continue;
                    } else {
                        value = method.call(comp, state)
                    }
                } else {
                    value = method.call(comp, Args, state);
                }
                if(value==independent){continue}
                switch (typeof value) {
                    case "object":
                        if (value) {
                            if ((el = value[internal])) {
                                if (el.type == NODETYPES.list) {
                                    switch ((tmp = dyn[i]).type) {
                                        case NODETYPES.text:
                                            if (el.pos.head) {
                                                removeList(el, undefined);
                                            }
                                            tmp.node.replaceWith(insertList(el, { i: i, id: id }, undefined));
                                            dyn[i] = el;
                                            break;
                                        case NODETYPES.component:
                                            if (el.pos.head) {
                                                removeList(el, undefined);
                                            }
                                            tmp.parent = 0;
                                            tmp.dynIndex = 0;
                                            componentsTrashBin.add(tmp);
                                            bn = bn || document.createTextNode("");
                                            (tmp2 = tmp.node).replaceWith(bn);
                                            bn.replaceWith(insertList(el, { i: i, id: id }, undefined));
                                            dyn[i] = el;
                                            if (!tmp2.parentNode || tmp.parent != id) {
                                                //Component is either not reused or is reused in a different parent component
                                                chain.delete(tmp.id);
                                                componentsTrashBin.add(tmp.id);
                                            }
                                            break;
                                        default: //Lists
                                            if (tmp != el) {
                                                if (el.pos.head) {
                                                    removeList(el, undefined);
                                                }
                                                e = removeList(tmp, undefined);
                                                e.replaceWith(insertList(el, { i: i, id: id }, undefined));
                                                //ListsTrashBin.add(tmp);
                                                dyn[i] = el;
                                            }
                                            else {
                                                updateList(el, { i: i, id: id }, undefined);
                                            }
                                            break;
                                    }
                                }
                                else {//New node is component

                                    switch ((tmp = dyn[i]).type) {//Match against type of current node
                                        case NODETYPES.text:
                                            tmp.node.replaceWith(el.node);
                                            el.parent = id;
                                            el.dynIndex = i;
                                            dyn[i] = el;
                                            break;
                                        case NODETYPES.component:
                                            if (el.id != tmp.id) {
                                                tmp.node.replaceWith(el.node);
                                                el.parent = id;
                                                el.dynIndex = i;
                                                tmp.parent = 0;
                                                tmp.dynIndex = 0;
                                                dyn[i] = el;
                                                chain.delete(tmp.id);
                                                componentsTrashBin.add(tmp.id);
                                            }
                                            break;
                                        default: //Lists
                                            e = removeList(tmp, undefined);
                                            e.replaceWith(el.node);
                                            el.parent = id;
                                            el.dynIndex = i;
                                            dyn[i] = el;
                                            //ListsTrashBin.add(tmp);
                                            break;
                                    }
                                    //Delete component from trash bin if exists since it's being used
                                    componentsTrashBin.delete(el.id);
                                }
                                break;
                            }
                        }
                        else {
                            value = "";
                        }
                    default:
                        value = "".concat(value);
                        switch ((tmp = dyn[i]).type) {
                            case NODETYPES.text:
                                tmp2 = tmp.node;
                                if (tmp2.textContent != value) {
                                   // tmp.node.textContent = value;
                                    //tmp.value = value;
                                    tmp2.textContent = value;
                                }
                                break;
                            case NODETYPES.component:
                                el = document.createTextNode(value);
                                tmp.parent = 0;
                                tmp.dynIndex = 0;
                                tmp.node.replaceWith(el);
                                componentsTrashBin.add(tmp.id);
                                dyn[i] = { node: el, type: NODETYPES.text, /*value: value*/ };
                                break;
                            default: //Lists
                                el = removeList(tmp, document.createTextNode(value));
                                //ListsTrashBin.add(tmp);
                                dyn[i] = { node: el, type: NODETYPES.text, /*value: value*/ };
                                break;
                        }
                        break;
                }
            }
            nodeDeps.clear();
            dynamicNodeUpdates.delete(id);
            renderingComponent.id = currentId;
            renderingComponent.chain = currentChain;
            renderingComponent.dynIndex = undefined;
        }
        _internal_.Args = undefined;
    }
    function updateStatefulDynamicnodes(id) {
        var comp = Blocks.get(id);
        var _internal_ = comp[internal];
        var compClass = CreatedComponents.get(_internal_.fnId);
        var deps = compClass.deps;
        var attrDeps = _internal_.attrDeps;
        var keyed = _internal_.keyed;
        var state = comp.state;
        attrDeps.forEach(function (nodekey,fn_key) {
            deps[fn_key].call(comp, keyed[nodekey].node, state, false);
        })
        attrDeps.clear();
        var l = compClass.dn.length;
        if (l) {
            var nodeDeps = _internal_.nodeDeps;
            var dyn = _internal_.dyn; 
            var dn = compClass.dn;
            var value, el, bn,e,tmp, tmp2;
            var currentChain = renderingComponent.chain;
            var currentId = renderingComponent.id;
            var chain = renderingComponent.chain = _internal_.childComponents;
            renderingComponent.id = id;
            nodeDeps.forEach(function (i) {
                renderingComponent.dynIndex = i;
                value = dn[i].call(comp, comp.state);
                if (value == independent) { return };
                switch (typeof value) {
                    case "object":
                        if (value) {
                            if ((el = value[internal])) {
                                if (el.type == NODETYPES.list) {
                                    switch ((tmp = dyn[i]).type) {
                                        case NODETYPES.text:
                                            if (el.pos.head) {
                                                removeList(el, undefined);
                                            }
                                            tmp.node.replaceWith(insertList(el, { i: i, id: id }, undefined));
                                            dyn[i] = el;
                                            break;
                                        case NODETYPES.component:
                                            if (el.pos.head) {
                                                removeList(el, undefined);
                                            }
                                            tmp.parent = 0;
                                            tmp.dynIndex = 0;
                                            componentsTrashBin.add(tmp);
                                            bn = bn || document.createTextNode("");
                                            (tmp2 = tmp.node).replaceWith(bn);
                                            bn.replaceWith(insertList(el, { i: i, id: id }, undefined));
                                            dyn[i] = el;
                                            if (!tmp2.parentNode || tmp.parent != id) {
                                                //Component is either not reused or is reused in a different parent component
                                                chain.delete(tmp.id);
                                                componentsTrashBin.add(tmp.id);
                                            }
                                            break;
                                        default: //Lists
                                            if (tmp != el) {
                                                if (el.pos.head) {
                                                    removeList(el, undefined);
                                                }
                                                e = removeList(tmp, undefined);
                                                e.replaceWith(insertList(el, { i: i, id: id }, undefined));
                                                //ListsTrashBin.add(tmp);
                                                dyn[i] = el;
                                            }
                                            else {
                                                updateList(el, { i: i, id: id }, undefined);
                                            }
                                            break;
                                    }
                                }
                                else {//New node is component
    
                                    switch ((tmp = dyn[i]).type) {//Match against type of current node
                                        case NODETYPES.text:
                                            tmp.node.replaceWith(el.node);
                                            el.parent = id;
                                            el.dynIndex = i;
                                            dyn[i] = el;
                                            break;
                                        case NODETYPES.component:
                                            if (el.id != tmp.id) {
                                                tmp.node.replaceWith(el.node);
                                                el.parent = id;
                                                el.dynIndex = i;
                                                tmp.parent = 0;
                                                tmp.dynIndex = 0;
                                                dyn[i] = el;
                                                chain.delete(tmp.id);
                                                componentsTrashBin.add(tmp.id);
                                            }
                                            break;
                                        default: //Lists
                                            e = removeList(tmp, undefined);
                                            e.replaceWith(el.node);
                                            el.parent = id;
                                            el.dynIndex = i;
                                            dyn[i] = el;
                                            //ListsTrashBin.add(tmp);
                                            break;
                                    }
                                    //Delete component from trash bin if exists since it's being used
                                    componentsTrashBin.delete(el.id);
                                }
                                break;
                            }
                        }
                        else {
                            value = "";
                        }
                    default:
                        value = "".concat(value);
                        switch ((tmp = dyn[i]).type) {
                            case NODETYPES.text:
                                tmp2 = tmp.node;
                                if (tmp2.textContent != value) {
                                    tmp2.textContent = value;
                                    //tmp.value = value;
                                }
                                break;
                            case NODETYPES.component:
                                el = document.createTextNode(value);
                                tmp.parent = 0;
                                tmp.dynIndex = 0;
                                tmp.node.replaceWith(el);
                                componentsTrashBin.add(tmp.id);
                                dyn[i] = { node: el, type: NODETYPES.text,/*value: value*/ };
                                break;
                            default: //Lists
                                el = removeList(tmp, document.createTextNode(value));
                                //ListsTrashBin.add(tmp);
                                dyn[i] = { node: el, type: NODETYPES.text,/*value: value*/ };
                                break;
                        }
                        break;
                }
                
            })
            nodeDeps.clear();
            dynamicNodeUpdates.delete(id);
            renderingComponent.id = currentId;
            renderingComponent.chain = currentChain;
            renderingComponent.dynIndex = undefined;
        }
    }
    function cleanUp() {
        componentsTrashBin.forEach(function (id) {
            clearComponents(undefined, id);
        });
        componentsTrashBin.clear();
        //console.log(Blocks);
    }
    function clearComponents(children,id) {
        let comp = Blocks.get(id);
        const _internal_ = comp[internal];
        if (_internal_.keepAll) {
            children = children || _internal_.childComponents;
            let tmp = _internal_.outerValue[internal];
            tmp.node.remove();
            triggerHibernateEvents(children, id);
        } else { 
            let onDestroyed = comp.onDestroyed;
            comp.willDestroy && comp.willDestroy.call(comp,comp.state);
            children = children || _internal_.childComponents;
            let tmp = _internal_.outerValue[internal];
            tmp.node = tmp.listItem = tmp.getList = undefined;
            tmp = _internal_.ins[internal_ins];
            if (_internal_.keepState) {
                comp = { state: comp.state };
                comp[internal] = _internal_;
                Blocks.set(id, comp);
                _internal_.status = STATUS.hibernatedPartially;
            } else {
                Blocks.delete(id);
                _internal_.status = STATUS.dead;
            }
            
            let keyed = _internal_.keyed,key,keyedvalue;
            for (key in keyed) {
                removeEvents((keyedvalue = keyed[key]).node, keyedvalue.evc);
            }
            _internal_.keyed = _internal_.dyn = undefined;
            children.forEach(clearComponents);
            children.clear();
            onDestroyed && onDestroyed();
        }
        
    }
    function triggerHibernateEvents(children,id) {
        let comp = Blocks.get(id);
        let onHibernated = comp.onHibernated;
        let state = comp.state;
        comp.willHibernate && comp.willHibernate.call(comp,state);
        children.forEach(triggerHibernateEvents);
        onHibernated && onHibernated.call(comp, state);
        _internal_.status = STATUS.hibernatedFully;
    }
    function ComponentMethod(args) {
        if (B.isSSR) { return };
        var _b;
        var _internal_ = new ComponentInstance({ methodId: this.fnId, args: args });
        var compClass = CreatedComponents.get(this.fnId);
        var node;
        if (!compClass.proto) {
            node = compClass.fn.call((_b = {}, _b[internal] = _internal_, _b), args);
        }
        else {
            node = clone(_internal_);
        }
        var out = _internal_.outerValue;
        out[internal].node = node;
        _internal_.status = STATUS.alive;
        _internal_.pure = true;
        runDynamicnodes(_internal_.id, compClass.dn, _internal_.init_dyn);
        _internal_.init_dyn = null;
        return out;
    }
    function getComponentInstance(initArgs) {
        if (B.isSSR) { return}
        var _b;
        var _internal_ = new ComponentInstance({ methodId: this.fnId, args: undefined, initArgs: initArgs });
        Blocks.set(_internal_.id, (_b = {}, _b[internal] = _internal_, _b));
        return _internal_.ins;
    }
    function runElementEvent(data) {
        var comp = Blocks.get(data.id);
        var keyed_Data = comp[internal].keyed[data.key];
        //Run event
        keyed_Data.$events[data.ev].apply(data.event.target, [data.event, comp]);
        data.event = null;
    }
    function eventHandler(e) {
        var data = this;
        data.event = e;
        runElementEvent(data);
    }
    //Remove event handlers
    function removeEvents(element, eventCallers) {
        for (var i in eventCallers) {
            element.removeEventListener(i, eventCallers[i], false);
        }
    }
    var B = new Breaker();
    Object.defineProperty(window, "Breaker", { value: B, configurable: false, enumerable: true, writable: false });
}();
